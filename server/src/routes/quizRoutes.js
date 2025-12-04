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
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

router.post("/feedback", async (req, res) => {
  try {
    const { name, subject, score, total } = req.body;
    const feedback = await generateFeedback({ name, subject, score, total });
    res.json({ feedback });
  } catch (err) {
    console.error("Feedback error:", err.message);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});

export default router;
