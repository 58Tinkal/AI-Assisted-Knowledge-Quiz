import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#9ca3af"]; // correct, incorrect, skipped

export default function ResultPieChart({ summary }) {
  const safeSummary = summary || { correct: 0, incorrect: 0, skipped: 0 };

  const data = [
    { name: "Correct", value: safeSummary.correct || 0 },
    { name: "Incorrect", value: safeSummary.incorrect || 0 },
    { name: "Skipped", value: safeSummary.skipped || 0 },
  ];

  const total = data.reduce((acc, d) => acc + d.value, 0);
  if (!total) {
    return (
      <p style={{ fontSize: 12, color: "#9ca3af" }}>No data to display yet.</p>
    );
  }

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
