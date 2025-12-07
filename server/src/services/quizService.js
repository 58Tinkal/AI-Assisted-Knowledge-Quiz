
import { GoogleGenerativeAI } from "@google/generative-ai";


console.log("API Key present:", !!process.env.GEMINI_API_KEY);
console.log("Model:", "gemini-2.5-flash");

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is not set in .env");
  throw new Error("GEMINI_API_KEY is required for quiz generation");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Safely parse JSON from AI
function safeParseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function generateQuestions({ subject, topic, count, difficulty }) {
  const finalTopic = topic || subject;
  const n = Number(count) || 5;

  const prompt = `
You are a quiz generator. Create exactly ${n} multiple choice questions
for the topic "${finalTopic}" with difficulty "${difficulty}".

Return ONLY valid JSON with this exact structure:

{
  "questions": [
    {
      "id": "string",
      "question": "string",
      "options": [
        { "id": "A", "text": "string" },
        { "id": "B", "text": "string" },
        { "id": "C", "text": "string" },
        { "id": "D", "text": "string" }
      ],
      "correctOptionId": "A" | "B" | "C" | "D"
    }
  ]
}

Rules:
- Do NOT include explanations.
- Do NOT include any text before or after the JSON.
- All questions must be unique and accurate.
`;

  // 🔁 UPDATED MODEL NAME HERE
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  // If that gives issues with your key, try: "gemini-2.0-flash"

  // try a couple of times to get valid JSON
  for (let attempt = 1; attempt <= 2; attempt++) {
    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    console.log("Gemini raw response (truncated):", raw.slice(0, 200), "...");

    const parsed = safeParseJson(raw);

    if (
      parsed &&
      Array.isArray(parsed.questions) &&
      parsed.questions.length === n
    ) {
      console.log("✅ Gemini returned valid questions");
      return parsed.questions;
    }

    console.warn(`⚠️ Gemini returned invalid JSON, attempt ${attempt}`);
  }

  // if we reach here, it's a hard failure
  throw new Error("Gemini did not return valid questions JSON");
}

export async function generateFeedback({ name, subject, score, total }) {
  const prompt = `
You are a helpful tutor. A user completed a quiz.

Name: ${name}
Subject: ${subject}
Score: ${score} out of ${total}

Write a short, friendly feedback message in 3-5 sentences:
- Mention their score.
- Highlight 1-2 strengths.
- Suggest 1-2 ways to improve.

Return ONLY the feedback text. No JSON, no bullet points.
`;

  // 🔁 UPDATED MODEL NAME HERE TOO
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  // Or "gemini-2.0-flash" if your account only supports that

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text.trim();
}