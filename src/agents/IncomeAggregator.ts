import { Agent, AgentRunResult, DataProvider, formatCurrency, IncomeEntry } from "@/agents/types";

export class IncomeAggregatorAgent implements Agent<string> {
  id = "income-aggregator";
  title = "Income Aggregator";
  description = "Aggregates income across platforms and normalizes data";
  private provider: DataProvider;
  constructor(provider: DataProvider) {
    this.provider = provider;
  }
  async run(input: string): Promise<AgentRunResult> {
    const now = new Date();
    const from = new Date(now);
    from.setMonth(from.getMonth() - 1);
    const entries = await this.provider.listIncome({ from: from.toISOString(), to: now.toISOString() });
    const totals = summarize(entries);
    const text = buildSummaryText(entries, totals);
    return { text, data: { entries, totals }, steps: [{ name: "fetch-income", result: { ok: true, data: entries } }] };
  }
}

const summarize = (entries: IncomeEntry[]) => {
  const byPlatform: Record<string, number> = {};
  let total = 0;
  let pending = 0;
  for (const e of entries) {
    byPlatform[e.platform] = (byPlatform[e.platform] || 0) + e.amount;
    total += e.amount;
    if (e.status === "pending") pending += e.amount;
  }
  return { byPlatform, total, pending };
};

const buildSummaryText = (entries: IncomeEntry[], totals: { byPlatform: Record<string, number>; total: number; pending: number }) => {
  const parts: string[] = [];
  parts.push(`Income in the last month: ${formatCurrency(totals.total)}`);
  const platforms = Object.entries(totals.byPlatform)
    .map(([p, v]) => `${p}: ${formatCurrency(v)}`)
    .join(", ");
  if (platforms) parts.push(platforms);
  if (totals.pending > 0) parts.push(`Pending: ${formatCurrency(totals.pending)}`);
  const latest = entries
    .slice()
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
  if (latest) parts.push(`Latest payment: ${formatCurrency(latest.amount)} from ${latest.platform} on ${new Date(latest.date).toLocaleDateString()}`);
  return parts.join(". ");
};

