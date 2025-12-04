export default function Loader({ text = "Loading..." }) {
  return (
    <div className="page-container">
      <div className="card" style={{ textAlign: "center" }}>
        <div className="spinner" />
        <p style={{ marginTop: "16px", color: "#4b5563" }}>{text}</p>
      </div>
    </div>
  );
}
