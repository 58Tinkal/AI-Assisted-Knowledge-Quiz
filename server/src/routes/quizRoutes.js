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

export default router;
