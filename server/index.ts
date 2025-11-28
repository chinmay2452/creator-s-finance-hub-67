import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { MoneyBuddyAgent } from "../src/agents/MoneyBuddy";
import { IncomeSyncAgent } from "../src/agents/IncomeSync";
import { FinanceIntelAgent } from "../src/agents/FinanceIntel";
import { SupabaseDataProvider, SupabaseNotifier, SupabaseStorage, SupabaseVision, SupabaseSaver } from "./providers/SupabaseProvider";
import { parseEmailLLM } from "./providers/LLMEmailParser";
import { parseEmailPaymentDetails } from "../src/utils/emailParser";

const app = express();
app.use(bodyParser.json());

app.post("/api/money-buddy/run", async (req, res) => {
  const { userId, query } = req.body || {};
  const agent = new MoneyBuddyAgent({ provider: new SupabaseDataProvider(), notifier: new SupabaseNotifier() });
  const result = await agent.run({ userId, query });
  res.json(result);
});

app.post("/api/income-sync/run", async (req, res) => {
  const { userId, since } = req.body || {};
  const agent = new IncomeSyncAgent({
    storage: new SupabaseStorage(),
    vision: new SupabaseVision(),
    save: new SupabaseSaver().saveIncome,
    detectDuplicate: new SupabaseSaver().detectDuplicate,
  });
  const result = await agent.run({ userId, since });
  res.json(result);
});

app.post("/api/finance-intel/run", async (req, res) => {
  const { userId } = req.body || {};
  const agent = new FinanceIntelAgent(new SupabaseDataProvider());
  const result = await agent.run({ userId });
  res.json(result);
});

app.post("/api/parse-email", async (req, res) => {
  const { emailText, userId } = req.body || {};
  let parsed = null as null | { brand?: string; amount?: number; currency?: string; dueDate?: string; status?: string; confidence: number };
  try {
    parsed = await parseEmailLLM(emailText);
  } catch (e) {
    parsed = null;
  }
  if (!parsed || parsed.confidence < 0.98) {
    const det = parseEmailPaymentDetails(emailText);
    if (!parsed || det.confidence > parsed.confidence) parsed = det;
  }
  res.json({ ok: true, data: parsed, userId });
});

app.listen(process.env.PORT || 3001);
