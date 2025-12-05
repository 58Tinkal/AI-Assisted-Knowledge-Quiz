import axios from "axios";

// For production, use environment variable or default to relative path
// If deploying separately, set VITE_API_BASE to your backend URL (e.g., https://your-backend.vercel.app)
// The /api prefix will be added automatically
let API_BASE = import.meta.env.VITE_API_BASE;

if (!API_BASE) {
  // Development: use localhost
  API_BASE = "http://localhost:5000";
} else {
  // Production: ensure no trailing slash and add /api if not present
  API_BASE = API_BASE.replace(/\/$/, ""); // Remove trailing slash
}

// Always append /api to the base URL
if (!API_BASE.endsWith("/api")) {
  API_BASE = `${API_BASE}/api`;
}

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
