import { AccountConnection, DataProvider, ExpenseEntry, IncomeEntry } from "@/agents/types";

const accounts: AccountConnection[] = [
  { platform: "YouTube", accountId: "yt_123", displayName: "YouTube Channel" },
  { platform: "Twitch", accountId: "tw_456", displayName: "Twitch Stream" },
  { platform: "Patreon", accountId: "pt_789", displayName: "Patreon" },
];

const income: IncomeEntry[] = [
  { id: "i1", platform: "YouTube", amount: 8450, currency: "INR", date: "2025-10-28", status: "paid" },
  { id: "i2", platform: "YouTube", amount: 9200, currency: "USD", date: "2025-11-05", status: "paid" },
  { id: "i3", platform: "Twitch", amount: 3100, currency: "USD", date: "2025-11-20", status: "pending" },
  { id: "i4", platform: "Patreon", amount: 2200, currency: "USD", date: "2025-11-25", status: "paid" },
  { id: "i5", platform: "TikTok", amount: 1500, currency: "USD", date: "2025-11-18", status: "paid" },
];

const expenses: ExpenseEntry[] = [
  { id: "e1", category: "Equipment", amount: 450, currency: "USD", date: "2025-11-03" },
  { id: "e2", category: "Software", amount: 120, currency: "USD", date: "2025-11-07" },
  { id: "e3", category: "Contractor", amount: 680, currency: "USD", date: "2025-11-10" },
  { id: "e4", category: "Travel", amount: 90, currency: "USD", date: "2025-11-15" },
];

export class MockDataProvider implements DataProvider {
  async listAccounts() {
    return accounts;
  }
  async listIncome(opts: { from?: string; to?: string }) {
    const from = opts.from ? new Date(opts.from) : undefined;
    const to = opts.to ? new Date(opts.to) : undefined;
    return income.filter((i) => {
      const d = new Date(i.date);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }
  async listExpenses(opts: { from?: string; to?: string }) {
    const from = opts.from ? new Date(opts.from) : undefined;
    const to = opts.to ? new Date(opts.to) : undefined;
    return expenses.filter((e) => {
      const d = new Date(e.date);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }
}

