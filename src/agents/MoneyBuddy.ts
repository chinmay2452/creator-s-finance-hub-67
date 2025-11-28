import { Agent, AgentRunResult, DataProvider, Notifier, ToneRewriter, formatCurrency } from "@/agents/types";

type MoneyBuddyInput = { userId: string; query: string };

export class MoneyBuddyAgent implements Agent<MoneyBuddyInput> {
  id = "money-buddy";
  title = "AI Money Buddy";
  description = "Conversational financial coach for creators";
  private provider: DataProvider;
  private notifier?: Notifier;
  private rewriter?: ToneRewriter;
  constructor(args: { provider: DataProvider; notifier?: Notifier; rewriter?: ToneRewriter }) {
    this.provider = args.provider;
    this.notifier = args.notifier;
    this.rewriter = args.rewriter;
  }
  async run(input: MoneyBuddyInput): Promise<AgentRunResult> {
    const income = await this.provider.listIncome({});
    const expenses = await this.provider.listExpenses({});
    const spend = expenses.reduce((s, e) => s + e.amount, 0);
    const earn = income.reduce((s, i) => s + i.amount, 0);
    const pending = income.filter((i) => i.status === "pending").reduce((s, i) => s + i.amount, 0);
    const next = predictNextPayment(income);
    const base = `You have ${formatCurrency(earn)} income and ${formatCurrency(spend)} spending in the recent period. Pending ${formatCurrency(pending)}. Next payment prediction ${formatCurrency(next.amount)} around ${new Date(next.date).toLocaleDateString()}.`;
    const text = this.rewriter ? await this.rewriter.rewrite(base) : base;
    if (spend > earn * 0.8 && this.notifier) await this.notifier.write(input.userId, "Spending is unusually high compared to income");
    return {
      text,
      data: { spend, earn, pending, next },
      steps: [
        { name: "fetch-income", result: { ok: true, data: income } },
        { name: "fetch-expenses", result: { ok: true, data: expenses } },
        { name: "predict-next", result: { ok: true, data: next } },
      ],
    };
  }
}

const predictNextPayment = (income: { amount: number; date: string; platform: string }[]) => {
  const sorted = income.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const recent = sorted.slice(0, 6);
  const avg = recent.reduce((s, i) => s + i.amount, 0) / Math.max(1, recent.length);
  const lastDate = recent[0]?.date || new Date().toISOString();
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + 30);
  return { amount: avg, date: nextDate.toISOString() };
};

