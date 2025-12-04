import express from "express";

const router = express.Router();

// POST /api/users
router.post("/", async (req, res) => {
  const { name, lastSubject, lastDifficulty } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  // later we'll save to Mongo; currently just echo back
  res.json({ name, lastSubject, lastDifficulty });
});

export default router;
