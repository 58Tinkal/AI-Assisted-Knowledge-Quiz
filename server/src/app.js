// server/src/app.js
import "dotenv/config";
import express from "express";
import cors from "cors";

import quizRoutes from "./routes/quizRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// optional health route so you don't see "Cannot GET /" on root
app.get("/", (req, res) => {
  res.send("AI-Assisted Quiz API is running ✅");
});

app.use("/api/quiz", quizRoutes);
app.use("/api/users", userRoutes);

export default app;
