export default function Loader({ text = "Loading..." }) {
  return (
    <div className="page-container">
      <div className="card" style={{ textAlign: "center" }}>
        <div className="spinner" />
        <p className="loader-text">{text}</p>
      </div>
    </div>
  );
}
