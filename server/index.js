// server/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";

import quizRoutes from "./src/routes/quizRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI-Assisted Quiz API is running ✅");
});

app.use("/api/quiz", quizRoutes);
app.use("/api/users", userRoutes);

export default app; // for Vercel

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("Server running on port", PORT);
  });
}
