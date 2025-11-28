import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ Missing Gemini API Key. Add GEMINI_API_KEY to .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Sends a query to Gemini AI with optional income data context.
 */
export async function askGemini(question: string, incomeData: any[] = []) {
  const systemPrompt = `
You are FundFluence, an AI Money Buddy and financial planning assistant for digital creators.
Your goal is to analyze earnings data, forecast revenue, identify pending payments, and provide actionable financial guidance.

Rules for response:
- Keep answers short (4-7 lines)
- Use emojis where appropriate (📊📈💰💡🤖)
- Provide 1 actionable tip at the end
- If data is missing, ask a helpful clarifying question
- Never invent numbers — use only what you are given

User Question: ${question}

Income Data for context:
${JSON.stringify(incomeData, null, 2)}
`;

  try {
    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return "⚠️ Sorry, I had trouble accessing financial data. Try again in a moment!";
  }
}