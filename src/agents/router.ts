import { Agent } from "@/agents/types";
import { MoneyBuddyAgent } from "@/agents/MoneyBuddy";
import { FinanceIntelAgent } from "@/agents/FinanceIntel";
import { IncomeSyncAgent } from "@/agents/IncomeSync";
import { MockDataProvider } from "@/tools/MockDataProvider";

export const getAgent = (id: string): Agent<unknown> | null => {
  if (id === "money-buddy") return new MoneyBuddyAgent({ provider: new MockDataProvider() });
  if (id === "finance-intel") return new FinanceIntelAgent(new MockDataProvider());
  if (id === "income-sync")
    return new IncomeSyncAgent({
      storage: { listImages: async () => [] },
      vision: { extract: async () => null },
      save: async () => ({ id: "" }),
      detectDuplicate: async () => false,
    });
  return null;
};
