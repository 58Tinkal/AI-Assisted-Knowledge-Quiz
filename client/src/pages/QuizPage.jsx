import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import Loader from "../components/Loader.jsx";
import QuestionCard from "../components/QuestionCard.jsx";
import QuestionPalette from "../components/QuestionPalette.jsx";
import ProgressBar from "../components/ProgressBar.jsx";

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    userName,
    subject,
    difficulty,
    count,
    questions,
    currentIndex,
    answers,
    status,
    isLoading,
    selectAnswer,
    markForReview,
    goToQuestion,
    goNext,
    goPrev,
    finishQuiz,
  } = useQuiz();

  useEffect(() => {
    if (!isLoading && (!questions || questions.length === 0)) {
      // user opened /quiz directly
      navigate("/customize");
    }
  }, [questions, isLoading, navigate]);

  if (isLoading) {
    return <Loader text="Preparing your questions..." />;
  }

  if (!questions || questions.length === 0) {
    return null; // redirect handled above
  }

  const currentQuestion = questions[currentIndex];
  const selectedOptionId = answers[currentQuestion.id];

  const handleSubmit = async () => {
    await finishQuiz();
    navigate("/report");
  };

  return (
    <div className="quiz-layout">
      {/* Left side: main question area */}
      <div className="quiz-main">
        <div className="quiz-topbar">
          <div>
            <div className="quiz-topline">
              <span className="chip">Subject: {subject}</span>
              <span className="chip">Questions: {count}</span>
              <span className="chip">Level: {difficulty}</span>
            </div>
            <div className="quiz-topline" style={{ marginTop: "8px" }}>
              <span className="chip chip-light">
                Name: {userName || "Learner"}
              </span>
            </div>
          </div>
          <button className="submit-btn" onClick={handleSubmit}>
            Submit Test
          </button>
        </div>

        <ProgressBar current={currentIndex} total={questions.length} />

        <QuestionCard
          index={currentIndex}
          total={questions.length}
          question={currentQuestion}
          selectedOptionId={selectedOptionId}
          onSelect={(optId) => selectAnswer(currentQuestion.id, optId)}
          onMark={() => markForReview(currentQuestion.id)}
        />

        <div className="quiz-nav">
          <button
            className="secondary-btn"
            onClick={goPrev}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>
          <button
            className="secondary-btn"
            onClick={goNext}
            disabled={currentIndex === questions.length - 1}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Right side: palette */}
      <div className="quiz-sidebar">
        <QuestionPalette
          questions={questions}
          status={status}
          currentIndex={currentIndex}
          onJump={goToQuestion}
        />
      </div>
    </div>
  );
}
