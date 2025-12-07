import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import Loader from "../components/Loader.jsx";

const QUESTION_COUNTS = [5, 10, 15];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function CustomizePage() {
  const navigate = useNavigate();
  const {
    count,
    difficulty,
    setQuizConfig,
    startQuiz,
    isLoading,
    subject,
    topic,
    userName,
    resetLoading,
  } = useQuiz();

  const [selectedCount, setSelectedCount] = useState(count || 5);
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    difficulty || "Easy"
  );

  // Reset isLoading when component mounts to prevent showing loader from stale state
  // This only runs once when the page first loads
  useEffect(() => {
    // Reset loading state on mount to ensure we show the form, not a stale loader
    // This won't interfere with loading that starts after user clicks "Start Test"
    resetLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - won't run again when isLoading changes

  const handleStart = async () => {
    try {
      // Update config first (for persistence)
      setQuizConfig({
        count: Number(selectedCount),
        difficulty: selectedDifficulty,
      });

      // Start quiz generation with all required values
      // This will set isLoading to true and show the loader
      await startQuiz({
        subject: subject, // From context (set on previous page)
        topic: topic || subject, // Use topic if set, otherwise use subject
        count: Number(selectedCount),
        difficulty: selectedDifficulty,
      });

      // Only navigate after quiz is successfully generated
      navigate("/quiz");
    } catch (err) {
      console.error("Failed to start quiz:", err);
      // Error is already handled in startQuiz, but we can show an alert
      alert("Failed to generate quiz. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  if (isLoading) {
    return <Loader text="Generating your quiz..." />;
  }

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="title">
          Customize Test for{" "}
          <span className="title-highlight">{subject || "your subject"}</span>
        </h2>
        <p
          style={{ textAlign: "center", marginTop: "-12px", color: "#6b7280" }}
        >
          Hi {userName || "Learner"}, choose number of questions and difficulty
          level.
        </p>

        {/* Question count */}
        <div style={{ marginTop: "24px" }}>
          <label className="label">Number of Questions</label>
          <div className="row">
            {QUESTION_COUNTS.map((c) => (
              <button
                key={c}
                className={`chip-btn ${
                  selectedCount === c ? "chip-btn-active" : ""
                }`}
                onClick={() => setSelectedCount(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div style={{ marginTop: "24px" }}>
          <label className="label">Difficulty</label>
          <div className="row">
            {DIFFICULTIES.map((lvl) => (
              <button
                key={lvl}
                className={`chip-btn ${
                  selectedDifficulty === lvl ? "chip-btn-active" : ""
                }`}
                onClick={() => setSelectedDifficulty(lvl)}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div
          className="row"
          style={{ marginTop: "32px", justifyContent: "space-between" }}
        >
          <button className="secondary-btn" onClick={handleBack}>
            ← Previous
          </button>
          <button className="primary-btn" onClick={handleStart}>
            Start Test →
          </button>
        </div>
      </div>
    </div>
  );
}
