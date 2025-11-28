export type ToolContext = {
  now: Date;
};

export type ToolResult = {
  ok: boolean;
  data?: unknown;
  error?: string;
};

export interface Tool<TInput = unknown, TOutput = unknown> {
  name: string;
  run: (input: TInput, ctx: ToolContext) => Promise<TOutput>;
}

export type AgentStep = {
  name: string;
  result: ToolResult;
};

export type AgentRunResult = {
  text: string;
  data?: unknown;
  steps: AgentStep[];
};

export interface Agent<TInput = unknown> {
  id: string;
  title: string;
  description: string;
  run: (input: TInput) => Promise<AgentRunResult>;
}

export type IncomeEntry = {
  id: string;
  platform: string;
  amount: number;
  currency: string;
  date: string;
  status: "paid" | "pending";
};

export type ExpenseEntry = {
  id: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
};

export type AccountConnection = {
  platform: string;
  accountId: string;
  displayName: string;
};

export interface DataProvider {
  listAccounts: () => Promise<AccountConnection[]>;
  listIncome: (opts: { from?: string; to?: string }) => Promise<IncomeEntry[]>;
  listExpenses: (opts: { from?: string; to?: string }) => Promise<ExpenseEntry[]>;
}

export const formatCurrency = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

export interface Notifier {
  write: (userId: string, message: string) => Promise<void>;
}

export interface ToneRewriter {
  rewrite: (text: string) => Promise<string>;
}

export interface VisionProvider {
  extract: (image: ArrayBuffer | Uint8Array | string) => Promise<{ amount: number; source: string; timestamp: string } | null>;
}

export interface StorageProvider {
  listImages: (opts: { since?: string }) => Promise<{ key: string; fetch: () => Promise<ArrayBuffer> }[]>;
}
