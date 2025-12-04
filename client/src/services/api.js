import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
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
