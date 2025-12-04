import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import ResultPieChart from "../components/charts/ResultPieChart.jsx";
import ResultBarChart from "../components/charts/ResultBarChart.jsx";

export default function ReportPage() {
  const navigate = useNavigate();
  const quiz = useQuiz();

  const summary = quiz.summary || { correct: 0, incorrect: 0, skipped: 0 };
  const feedback = quiz.feedback || "";
  const questions = quiz.questions || [];
  const userName = quiz.userName || "Learner";
  const subject = quiz.subject || "N/A";
  const total = questions.length;

  const handleNewTest = () => {
    quiz.resetForNewTest();
    navigate("/");
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="title">
          Test Report for <span className="title-highlight">{userName}</span>
        </h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginTop: "-8px" }}>
          Subject: {subject}
        </p>

        <div className="row" style={{ marginTop: "24px" }}>
          <div className="column">
            <h3>Performance Overview (Pie)</h3>
            <ResultPieChart summary={summary} />
          </div>
          <div className="column">
            <h3>Performance Overview (Bar)</h3>
            <ResultBarChart summary={summary} />
          </div>
        </div>

        <div className="row" style={{ marginTop: "24px" }}>
          <div className="column">
            <h3>Summary</h3>
            <p>Total Questions: {total}</p>
            <p>Correct: {summary.correct}</p>
            <p>Incorrect: {summary.incorrect}</p>
            <p>Skipped: {summary.skipped}</p>
          </div>

          <div className="column">
            <h3>AI Feedback</h3>
            <p style={{ color: "#4b5563", whiteSpace: "pre-line" }}>
              {feedback || "Feedback not available."}
            </p>
          </div>
        </div>

        <div style={{ marginTop: "32px", textAlign: "center" }}>
          <button className="primary-btn" onClick={handleNewTest}>
            Start New Test
          </button>
        </div>
      </div>
    </div>
  );
}
