import express from "express";
import { generateQuestions, generateFeedback } from "../services/quizService.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  try {
    const { subject, topic, count, difficulty } = req.body;
    if (!subject) {
      return res.status(400).json({ error: "Subject is required" });
    }

    const questions = await generateQuestions({
      subject,
      topic,
      count,
      difficulty: difficulty || "Easy",
    });

    res.json({ questions });
  } catch (err) {
    console.error("Quiz generation error:", err.message);
    
    // Check if it's a quota error
    if (err.message.includes("quota") || err.message.includes("API quota")) {
      return res.status(429).json({ 
        error: err.message || "API quota exceeded. Please wait a few minutes and try again." 
      });
    }
    
    res.status(500).json({ 
      error: err.message || "Failed to generate quiz. Please try again later." 
    });
  }
});

router.post("/feedback", async (req, res) => {
  try {
    const { name, subject, score, total } = req.body;
    const feedback = await generateFeedback({ name, subject, score, total });
    res.json({ feedback });
  } catch (err) {
    console.error("Feedback error:", err.message);
    
    // Check if it's a quota error
    if (err.message.includes("quota") || err.message.includes("API quota")) {
      return res.status(429).json({ 
        error: err.message || "API quota exceeded. Please wait a few minutes and try again." 
      });
    }
    
    res.status(500).json({ 
      error: err.message || "Failed to generate feedback. Please try again later." 
    });
  }
});

// Test endpoint to verify API key is set
router.get("/test", async (req, res) => {
  try {
    console.log("\n🧪 API Key Test Requested");
    const apiKeyPresent = !!process.env.GEMINI_API_KEY;
    
    res.json({
      success: apiKeyPresent,
      message: apiKeyPresent 
        ? "✅ API Key is configured and ready to use."
        : "❌ API Key is not set in environment variables.",
      apiKeyConfigured: apiKeyPresent,
      model: "gemini-2.5-flash"
    });
  } catch (err) {
    console.error("Test error:", err.message);
    res.status(500).json({ 
      success: false,
      error: err.message || "Failed to test API key" 
    });
  }
});

export default router;
