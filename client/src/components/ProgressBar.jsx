export default function ProgressBar({ current, total }) {
  const percent = total ? Math.round(((current + 1) / total) * 100) : 0;
  return (
    <div className="progress-wrapper">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress-text">{percent}% completed</span>
    </div>
  );
}
