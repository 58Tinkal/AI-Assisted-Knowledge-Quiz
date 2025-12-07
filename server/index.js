
import "dotenv/config";
import express from "express";
import cors from "cors";

import quizRoutes from "./src/routes/quizRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

const app = express();


app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
}));
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("AI-Assisted Quiz API is running ✅");
});

// API routes
app.use("/api/quiz", quizRoutes);
app.use("/api/users", userRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
    message: `Cannot ${req.method} ${req.path}. Available routes: /api/quiz/generate, /api/quiz/feedback, /api/users`
  });
});

export default app;

// Start server locally (only if not in Vercel environment)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
