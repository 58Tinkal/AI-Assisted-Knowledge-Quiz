import axios from "axios";

// For production, use environment variable or default to relative path
// If deploying separately, set VITE_API_BASE to your backend URL (e.g., https://your-backend.vercel.app/api)
// If deploying together, use relative path or proxy
const API_BASE = import.meta.env.VITE_API_BASE || 
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// user profile (simple echo for now)
export const saveUserProfile = (data) =>
  api.post("/users", data).then((res) => res.data);

// generate questions
export const generateQuiz = (payload) =>
  api.post("/quiz/generate", payload).then((res) => res.data.questions);

// get AI feedback (mock from server for now)
export const getFeedback = (payload) =>
  api.post("/quiz/feedback", payload).then((res) => res.data.feedback);
