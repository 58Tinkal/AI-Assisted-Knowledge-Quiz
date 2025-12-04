import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./context/QuizContext.jsx";

import StartPage from "./pages/StartPage.jsx";
import CustomizePage from "./pages/CustomizePage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";

export default function App() {
  return (
    <QuizProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/customize" element={<CustomizePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </BrowserRouter>
    </QuizProvider>
  );
}
