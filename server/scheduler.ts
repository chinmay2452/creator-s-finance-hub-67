import { IncomeSyncAgent } from "../src/agents/IncomeSync";
import { SupabaseStorage, SupabaseVision, SupabaseSaver } from "./providers/SupabaseProvider";

const agent = new IncomeSyncAgent({
  storage: new SupabaseStorage(),
  vision: new SupabaseVision(),
  save: new SupabaseSaver().saveIncome,
  detectDuplicate: new SupabaseSaver().detectDuplicate,
});

const run = async () => {
  await agent.run({ userId: "scheduled", since: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() });
};

setInterval(run, 6 * 60 * 60 * 1000);

