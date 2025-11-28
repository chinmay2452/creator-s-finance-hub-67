import { createClient } from "@supabase/supabase-js";
import { AccountConnection, DataProvider, ExpenseEntry, IncomeEntry, Notifier, StorageProvider, ToneRewriter, VisionProvider } from "../src/agents/types";

const supabase = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string);

export class SupabaseDataProvider implements DataProvider {
  async listAccounts(): Promise<AccountConnection[]> {
    const { data } = await supabase.from("accounts").select("platform,account_id,display_name");
    const rows = (data || []) as ReadonlyArray<{ platform: string; account_id: string; display_name: string }>;
    return rows.map((r) => ({ platform: r.platform, accountId: r.account_id, displayName: r.display_name }));
  }
  async listIncome(opts: { from?: string; to?: string }): Promise<IncomeEntry[]> {
    let query = supabase.from("income_streams").select("id,platform,amount,currency,date,status");
    if (opts.from) query = query.gte("date", opts.from);
    if (opts.to) query = query.lte("date", opts.to);
    const { data } = await query;
    const rows = (data || []) as ReadonlyArray<{ id: string; platform: string; amount: number; currency?: string; date: string; status?: string }>;
    return rows.map((r) => ({ id: r.id, platform: r.platform, amount: r.amount, currency: r.currency || "USD", date: r.date, status: (r.status as "paid" | "pending") || "paid" }));
  }
  async listExpenses(opts: { from?: string; to?: string }): Promise<ExpenseEntry[]> {
    let query = supabase.from("transactions").select("id,category,amount,currency,date,type").eq("type", "expense");
    if (opts.from) query = query.gte("date", opts.from);
    if (opts.to) query = query.lte("date", opts.to);
    const { data } = await query;
    const rows = (data || []) as ReadonlyArray<{ id: string; category: string; amount: number; currency?: string; date: string }>;
    return rows.map((r) => ({ id: r.id, category: r.category, amount: r.amount, currency: r.currency || "USD", date: r.date }));
  }
}

export class SupabaseNotifier implements Notifier {
  async write(userId: string, message: string): Promise<void> {
    await supabase.from("notifications").insert({ user_id: userId, message, created_at: new Date().toISOString() });
  }
}

export class SupabaseStorage implements StorageProvider {
  async listImages(opts: { since?: string }) {
    const { data } = await supabase.storage.from("uploads").list("income", { limit: 50 });
    const files = ((data || []) as ReadonlyArray<{ name: string }>).filter((f) => f.name.match(/\.png$|\.jpg$|\.jpeg$/i));
    return files.map((f) => ({ key: f.name, fetch: async () => {
      const { data: dl } = await supabase.storage.from("uploads").download(`income/${f.name}`);
      return await (dl as Blob).arrayBuffer();
    }}));
  }
}

export class SupabaseVision implements VisionProvider {
  async extract(image: ArrayBuffer | Uint8Array | string): Promise<{ amount: number; source: string; timestamp: string } | null> {
    return null;
  }
}

export class SupabaseSaver {
  async saveIncome(args: { userId: string; amount: number; source: string; timestamp: string }) {
    const { data } = await supabase.from("income_streams").insert({ user_id: args.userId, amount: args.amount, platform: args.source, date: args.timestamp, currency: "USD", status: "paid" }).select("id").single();
    return { id: data.id };
  }
  async detectDuplicate(args: { userId: string; source: string; timestamp: string }) {
    const { data } = await supabase.from("income_streams").select("id").eq("user_id", args.userId).eq("platform", args.source).eq("date", args.timestamp).limit(1);
    return !!(data && data.length);
  }
}

export class CreatorTone implements ToneRewriter {
  async rewrite(text: string): Promise<string> {
    return `Hey Creator! ${text}`;
  }
}
