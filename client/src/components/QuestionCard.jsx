import React from "react";

export default function QuestionCard({
  index,
  total,
  question,
  selectedOptionId,
  onSelect,
  onMark,
}) {
  if (!question) return null;

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">
          Question {index + 1} of {total}
        </span>
        <button className="mark-btn" onClick={onMark}>
          Mark for Review
        </button>
      </div>
      <p className="question-text">{question.question}</p>

      <div className="options-list">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            className={`option-btn ${
              selectedOptionId === opt.id ? "option-btn-selected" : ""
            }`}
            onClick={() => onSelect(opt.id)}
          >
            <span className="option-label">{opt.id}.</span>
            <span>{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
