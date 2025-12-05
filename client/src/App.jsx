// client/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import ThemeToggle from "./components/ThemeToggle.jsx";

import StartPage from "./pages/StartPage.jsx";
import CustomizePage from "./pages/CustomizePage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <QuizProvider>
        <BrowserRouter>
          {/* Root wrapper for the whole app */}
          <div className="app-root">
            {/* Top-right theme toggle visible on all pages */}
            <div className="theme-toggle-wrapper">
              <ThemeToggle />
            </div>

            {/* Routes */}
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/customize" element={<CustomizePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/report" element={<ReportPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </QuizProvider>
    </ThemeProvider>
  );
}
