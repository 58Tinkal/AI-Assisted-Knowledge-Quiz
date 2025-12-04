import React from "react";

export default function QuestionPalette({
  questions,
  status,
  currentIndex,
  onJump,
}) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="palette-card">
      <h4 className="palette-title">Question Overview</h4>
      <div className="palette-grid">
        {questions.map((q, idx) => {
          const st = status[q.id] || "notVisited";
          return (
            <button
              key={q.id}
              className={`palette-item palette-${st} ${
                idx === currentIndex ? "palette-current" : ""
              }`}
              onClick={() => onJump(idx)}
            >
              {String(idx + 1).padStart(2, "0")}
            </button>
          );
        })}
      </div>

      <div className="palette-legend">
        <div>
          <span className="legend-box palette-answered" /> Answered
        </div>
        <div>
          <span className="legend-box palette-notAnswered" /> Not Answered
        </div>
        <div>
          <span className="legend-box palette-marked" /> Marked
        </div>
        <div>
          <span className="legend-box palette-notVisited" /> Not Visited
        </div>
      </div>
    </div>
  );
}
