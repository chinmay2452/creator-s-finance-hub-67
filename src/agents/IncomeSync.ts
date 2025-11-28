import { Agent, AgentRunResult, StorageProvider, VisionProvider } from "@/agents/types";

type IncomeSyncInput = { userId: string; since?: string };

export class IncomeSyncAgent implements Agent<IncomeSyncInput> {
  id = "income-sync";
  title = "Income Sync";
  description = "Autonomous data extraction from platform screenshots";
  private storage: StorageProvider;
  private vision: VisionProvider;
  private save: (args: { userId: string; amount: number; source: string; timestamp: string }) => Promise<{ id: string }>;
  private detectDuplicate: (args: { userId: string; source: string; timestamp: string }) => Promise<boolean>;
  constructor(args: {
    storage: StorageProvider;
    vision: VisionProvider;
    save: (args: { userId: string; amount: number; source: string; timestamp: string }) => Promise<{ id: string }>;
    detectDuplicate: (args: { userId: string; source: string; timestamp: string }) => Promise<boolean>;
  }) {
    this.storage = args.storage;
    this.vision = args.vision;
    this.save = args.save;
    this.detectDuplicate = args.detectDuplicate;
  }
  async run(input: IncomeSyncInput): Promise<AgentRunResult> {
    const images = await this.storage.listImages({ since: input.since });
    const steps: { name: string; result: { ok: boolean; data?: unknown; error?: string } }[] = [];
    const saved: { id: string; source: string; amount: number; timestamp: string }[] = [];
    for (const img of images) {
      const buf = await img.fetch();
      const data = await this.vision.extract(buf);
      if (!data) {
        steps.push({ name: "extract", result: { ok: false, error: "no-data" } });
        continue;
      }
      const dup = await this.detectDuplicate({ userId: input.userId, source: data.source, timestamp: data.timestamp });
      if (dup) {
        steps.push({ name: "duplicate", result: { ok: true, data } });
        continue;
      }
      const res = await this.save({ userId: input.userId, amount: data.amount, source: data.source, timestamp: data.timestamp });
      saved.push({ id: res.id, source: data.source, amount: data.amount, timestamp: data.timestamp });
      steps.push({ name: "save", result: { ok: true, data: res } });
    }
    const text = `Synced ${saved.length} new income records`;
    return { text, data: { saved }, steps };
  }
}

