export const parseEmailLLM = async (text: string) => {
  const key = (process.env.GROQ_API_KEY as string | undefined) || (process.env.OPENAI_API_KEY as string | undefined);
  if (!key) return null;
  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Extract payment details from the email and return ONLY a compact JSON object with keys: brand (string), amount (number), currency (string), dueDate (YYYY-MM-DD), status (string). Use numeric amount without commas; infer currency if missing.",
        },
        { role: "user", content: text },
      ],
    }),
  });
  if (!resp.ok) return null;
  type GroqChatCompletionResponse = { choices?: Array<{ message?: { content?: string } }> };
  const json = (await resp.json()) as GroqChatCompletionResponse;
  const raw = json?.choices?.[0]?.message?.content || "{}";
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
