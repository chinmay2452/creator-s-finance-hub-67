import { Agent, AgentRunResult, DataProvider, ExpenseEntry, IncomeEntry, formatCurrency } from "@/agents/types";

type FinanceIntelInput = { userId: string };

export class FinanceIntelAgent implements Agent<FinanceIntelInput> {
  id = "finance-intel";
  title = "Cashflow + Tax Intelligence";
  description = "Predictive analytics and tax estimation";
  private provider: DataProvider;
  constructor(provider: DataProvider) {
    this.provider = provider;
  }
  async run(input: FinanceIntelInput): Promise<AgentRunResult> {
    const now = new Date();
    const start = new Date(now);
    start.setMonth(start.getMonth() - 12);
    const income = await this.provider.listIncome({ from: start.toISOString(), to: now.toISOString() });
    const expenses = await this.provider.listExpenses({ from: start.toISOString(), to: now.toISOString() });
    const forecast = forecastIncome(income);
    const tax = estimateTax(income, expenses);
    const risk = riskyMonths(income);
    const text = `30d ${formatCurrency(forecast.d30)}; 90d ${formatCurrency(forecast.d90)}; 1y ${formatCurrency(forecast.d365)}. Estimated tax ${formatCurrency(tax.estimatedTax)}. Risky months ${risk.join(", ")}`;
    return {
      text,
      data: { forecast, tax, risk },
      steps: [
        { name: "fetch-income", result: { ok: true, data: income } },
        { name: "fetch-expenses", result: { ok: true, data: expenses } },
        { name: "forecast", result: { ok: true, data: forecast } },
        { name: "tax", result: { ok: true, data: tax } },
      ],
    };
  }
}

const forecastIncome = (income: IncomeEntry[]) => {
  const byMonth: Record<string, number> = {};
  for (const i of income) {
    const d = new Date(i.date);
    const k = `${d.getFullYear()}-${d.getMonth() + 1}`;
    byMonth[k] = (byMonth[k] || 0) + i.amount;
  }
  const vals = Object.values(byMonth);
  const avg = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
  return { d30: avg / 12, d90: (avg / 12) * 3, d365: avg };
};

const estimateTax = (income: IncomeEntry[], expenses: ExpenseEntry[]) => {
  const gross = income.reduce((s, i) => s + i.amount, 0);
  const deductible = expenses.reduce((s, e) => s + e.amount, 0);
  const taxable = Math.max(0, gross - deductible);
  const rate = taxable < 50000 ? 0.12 : taxable < 100000 ? 0.22 : 0.24;
  const estimatedTax = taxable * rate;
  return { taxableIncome: taxable, estimatedTax, deductions: deductible };
};

const riskyMonths = (income: IncomeEntry[]) => {
  const byMonth: Record<string, number> = {};
  for (const i of income) {
    const d = new Date(i.date);
    const k = `${d.getFullYear()}-${d.getMonth() + 1}`;
    byMonth[k] = (byMonth[k] || 0) + i.amount;
  }
  const entries = Object.entries(byMonth).sort((a, b) => a[0].localeCompare(b[0]));
  const avg = entries.length ? entries.reduce((s, e) => s + e[1], 0) / entries.length : 0;
  return entries.filter((e) => e[1] < avg * 0.6).map((e) => e[0]);
};

