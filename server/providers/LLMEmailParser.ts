import OpenAI from "openai";

export const parseEmailLLM = async (text: string) => {
  const key = process.env.OPENAI_API_KEY as string | undefined;
  if (!key) return null;
  const client = new OpenAI({ apiKey: key });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You extract payment details from emails. Return JSON with keys: brand (string), amount (number), currency (string), dueDate (YYYY-MM-DD), status (string). Use numeric amount without commas; infer currency if missing.",
      },
      { role: "user", content: text },
    ],
  });
  const raw = completion.choices[0]?.message?.content || "{}";
  const data = JSON.parse(raw);
  const found = ["amount", "dueDate", "brand"].reduce((s, k) => (data?.[k] ? s + 1 : s), 0);
  const confidence = data?.amount && data?.dueDate ? 0.99 : Math.min(0.95, 0.7 + 0.1 * found);
  return {
    brand: data?.brand,
    amount: typeof data?.amount === "number" ? data.amount : Number(data?.amount),
    currency: data?.currency,
    dueDate: data?.dueDate,
    status: data?.status,
    confidence,
  } as { brand?: string; amount?: number; currency?: string; dueDate?: string; status?: string; confidence: number };
};
