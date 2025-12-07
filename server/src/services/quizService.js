import { GoogleGenerativeAI } from "@google/generative-ai";


// Helper to mask API key for logging (show first 8 and last 4 chars)
function maskApiKey(key) {
  if (!key) return "NOT SET";
  if (key.length <= 12) return "***";
  return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
}

const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key present:", !!apiKey);
if (apiKey) {
  console.log("API Key (masked):", maskApiKey(apiKey));
}
console.log("Model:", "gemini-2.0-flash");

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY is not set in .env");
  console.error("💡 Create a .env file in the server directory with: GEMINI_API_KEY=your_key_here");
  throw new Error("GEMINI_API_KEY is required for quiz generation");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Helper function to extract retry delay from error
function extractRetryDelay(error) {
  try {
    const errorString = error.toString();
    const retryMatch = errorString.match(/Please retry in ([\d.]+)s/);
    if (retryMatch) {
      return Math.ceil(parseFloat(retryMatch[1])) * 1000; // Convert to milliseconds
    }
    // Check if error has details with retry info
    if (error.details && Array.isArray(error.details)) {
      for (const detail of error.details) {
        if (detail["@type"] === "type.googleapis.com/google.rpc.RetryInfo" && detail.retryDelay) {
          const delay = parseFloat(detail.retryDelay);
          return isNaN(delay) ? 15000 : Math.ceil(delay) * 1000;
        }
      }
    }
  } catch (e) {
    // If parsing fails, return default delay
  }
  return 15000; // Default 15 seconds
}

// Helper function to check if error is a quota/rate limit error
function isQuotaError(error) {
  const errorMessage = error.toString().toLowerCase();
  return (
    errorMessage.includes("429") ||
    errorMessage.includes("quota") ||
    errorMessage.includes("rate limit") ||
    errorMessage.includes("too many requests")
  );
}

// Retry wrapper with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      
      if (isQuotaError(error)) {
        const retryDelay = extractRetryDelay(error);
        console.warn(`⚠️ Quota error (attempt ${attempt}/${maxRetries}). Retrying in ${retryDelay / 1000}s...`);
        
        if (!isLastAttempt) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        } else {
          throw new Error(
            "API quota exceeded. Please wait a few minutes and try again, or check your API usage limits at https://ai.dev/usage?tab=rate-limit"
          );
        }
      }
      
      // For other errors, throw immediately
      throw error;
    }
  }
}

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

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Wrap API call in retry logic for quota errors
  return await retryWithBackoff(async () => {
    // try a couple of times to get valid JSON
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
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
      } catch (error) {
        // Re-throw quota errors to be handled by retryWithBackoff
        if (isQuotaError(error)) {
          throw error;
        }
        // For other errors, log and continue to next attempt
        console.warn(`⚠️ Error on attempt ${attempt}:`, error.message);
        if (attempt === 2) {
          throw new Error(`Failed to generate questions: ${error.message}`);
        }
      }
    }

    throw new Error("Gemini did not return valid questions JSON after retries");
  });
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

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Wrap API call in retry logic for quota errors
  return await retryWithBackoff(async () => {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text.trim();
    } catch (error) {
      // Re-throw quota errors to be handled by retryWithBackoff
      if (isQuotaError(error)) {
        throw error;
      }
      // For other errors, throw with context
      throw new Error(`Failed to generate feedback: ${error.message}`);
    }
  });
}
