import React, { useState, useMemo } from "react";
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
  const answers = quiz.answers || {};
  const userName = quiz.userName || "Learner";
  const subject = quiz.subject || "N/A";
  const total = questions.length;

  // chart view (pie / bar) within summary mode
  const [chartView, setChartView] = useState("pie");
  // page view (summary / analysis)
  const [viewMode, setViewMode] = useState("summary");

  const accuracy = total > 0 ? Math.round((summary.correct / total) * 100) : 0;

  const handleNewTest = () => {
    quiz.resetForNewTest();
    navigate("/");
  };

  const toggleChartView = () => {
    setChartView((prev) => (prev === "pie" ? "bar" : "pie"));
  };

  // Build analysis lists
  const { correctList, incorrectList, skippedList } = useMemo(() => {
    const correctList = [];
    const incorrectList = [];
    const skippedList = [];

    questions.forEach((q, idx) => {
      const selectedId = answers[q.id];
      const selectedOpt = q.options.find((o) => o.id === selectedId);
      const correctOpt = q.options.find((o) => o.id === q.correctOptionId);

      const base = {
        index: idx + 1,
        question: q.question,
        selectedId,
        selectedText: selectedOpt ? selectedOpt.text : null,
        correctId: q.correctOptionId,
        correctText: correctOpt ? correctOpt.text : "",
      };

      if (!selectedId) {
        skippedList.push(base);
      } else if (selectedId === q.correctOptionId) {
        correctList.push(base);
      } else {
        incorrectList.push(base);
      }
    });

    return { correctList, incorrectList, skippedList };
  }, [questions, answers]);

  // ---------------- SUMMARY VIEW ----------------
  if (viewMode === "summary") {
    return (
      <div className="page-container">
        <div className="card">
          <h2 className="title">
            Test Report for{" "}
            <span className="title-highlight">{userName}</span>
          </h2>
          <p className="report-subtitle">
            Subject: {subject}
          </p>

          {/* Chart header + toggle button */}
          <div className="charts-header">
            <h3>
              Performance Overview (
              {chartView === "pie" ? "Pie Chart" : "Bar Chart"})
            </h3>
            <button
              className={`toggle-btn ${
                chartView === "pie" ? "toggle-pie" : "toggle-bar"
              }`}
              onClick={toggleChartView}
            >
              {chartView === "pie" ? "Show Bar Graph" : "Show Pie Chart"}
            </button>
          </div>

          {/* Single chart area – switches view */}
          <div className="chart-container">
            {chartView === "pie" ? (
              <ResultPieChart summary={summary} />
            ) : (
              <ResultBarChart summary={summary} />
            )}
          </div>

          {/* Extra insights under charts when Bar is active */}
          {chartView === "bar" && (
            <div className="details-card">
              <h3>Detailed Insights</h3>
              <p>
                Accuracy: <strong>{accuracy}%</strong>
              </p>
              <p>
                Correct: <strong>{summary.correct}</strong> &nbsp;|&nbsp;
                Incorrect: <strong>{summary.incorrect}</strong> &nbsp;|&nbsp;
                Skipped: <strong>{summary.skipped}</strong>
              </p>
              <p style={{ marginTop: "8px", color: "#4b5563" }}>
                Switch between Pie and Bar charts to explore different views of
                your performance. You can dive even deeper using the{" "}
                <strong>Analyse Result</strong> button below.
              </p>
            </div>
          )}

          {/* Numeric summary + AI feedback */}
          <div className="row" style={{ marginTop: "24px" }}>
            <div className="column summary-column">
              <h3>Summary</h3>
              <p>Total Questions: {total}</p>
              <p>Correct: {summary.correct}</p>
              <p>Incorrect: {summary.incorrect}</p>
              <p>Skipped: {summary.skipped}</p>
            </div>

            <div className="column feedback-column">
              <h3>AI Feedback</h3>
              <p className="feedback-text">
                {feedback || "Feedback not available."}
              </p>
            </div>
          </div>

          {/* Bottom buttons */}
          <div className="report-buttons-container">
            <button
              className="secondary-btn outline-btn"
              onClick={() => setViewMode("analysis")}
            >
              Analyse Result
            </button>
            <button className="primary-btn" onClick={handleNewTest}>
              Start New Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ANALYSIS VIEW ----------------
  return (
    <div className="page-container">
      <div className="card">
        <div className="analysis-header">
          <h2 className="title">Result Analysis</h2>
          <button
            className="secondary-btn outline-btn"
            onClick={() => setViewMode("summary")}
          >
            ⬅ Back to Report
          </button>
        </div>
        <p className="report-subtitle">
          Subject: {subject} • Total Questions: {total}
        </p>

        <div className="analysis-container">
          {/* Correct */}
          <div className="analysis-section">
            <h3 className="analysis-title correct-title">
              Correct ({correctList.length})
            </h3>
            {correctList.length === 0 && (
              <p className="analysis-empty">No correct answers.</p>
            )}
            {correctList.map((item) => (
              <div
                key={`c-${item.index}`}
                className="analysis-item analysis-correct"
              >
                <div className="analysis-item-header">
                  <span className="analysis-qno">Q{item.index}</span>
                  <span className="analysis-badge badge-correct">Correct</span>
                </div>
                <p className="analysis-question">{item.question}</p>
                <p className="analysis-line">
                  <span className="label">Your Answer:</span>{" "}
                  <span>{item.selectedId}. {item.selectedText}</span>
                </p>
                <p className="analysis-line">
                  <span className="label">Correct Answer:</span>{" "}
                  <span>{item.correctId}. {item.correctText}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Incorrect */}
          <div className="analysis-section">
            <h3 className="analysis-title incorrect-title">
              Incorrect ({incorrectList.length})
            </h3>
            {incorrectList.length === 0 && (
              <p className="analysis-empty">No incorrect answers.</p>
            )}
            {incorrectList.map((item) => (
              <div
                key={`i-${item.index}`}
                className="analysis-item analysis-incorrect"
              >
                <div className="analysis-item-header">
                  <span className="analysis-qno">Q{item.index}</span>
                  <span className="analysis-badge badge-incorrect">
                    Incorrect
                  </span>
                </div>
                <p className="analysis-question">{item.question}</p>
                <p className="analysis-line">
                  <span className="label">Your Answer:</span>{" "}
                  <span>{item.selectedId}. {item.selectedText}</span>
                </p>
                <p className="analysis-line">
                  <span className="label">Correct Answer:</span>{" "}
                  <span>{item.correctId}. {item.correctText}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Unanswered / Skipped */}
          <div className="analysis-section">
            <h3 className="analysis-title skipped-title">
              Unanswered ({skippedList.length})
            </h3>
            {skippedList.length === 0 && (
              <p className="analysis-empty">No unanswered questions.</p>
            )}
            {skippedList.map((item) => (
              <div
                key={`s-${item.index}`}
                className="analysis-item analysis-skipped"
              >
                <div className="analysis-item-header">
                  <span className="analysis-qno">Q{item.index}</span>
                  <span className="analysis-badge badge-skipped">
                    Not Answered
                  </span>
                </div>
                <p className="analysis-question">{item.question}</p>
                <p className="analysis-line">
                  <span className="label">Your Answer:</span>{" "}
                  <span>Not Answered</span>
                </p>
                <p className="analysis-line">
                  <span className="label">Correct Answer:</span>{" "}
                  <span>{item.correctId}. {item.correctText}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <button className="primary-btn" onClick={() => setViewMode("summary")}>
            Back to Summary
          </button>
        </div>
      </div>
    </div>
  );
}
