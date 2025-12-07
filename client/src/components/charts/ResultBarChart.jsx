import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = {
  Correct: "#22c55e",
  Incorrect: "#ef4444",
  Skipped: "#9ca3af",
};

export default function ResultBarChart({ summary }) {
  const safeSummary = summary || { correct: 0, incorrect: 0, skipped: 0 };

  const data = [
    {
      name: "Questions",
      Correct: safeSummary.correct || 0,
      Incorrect: safeSummary.incorrect || 0,
      Skipped: safeSummary.skipped || 0,
    },
  ];

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Correct" fill={COLORS.Correct} />
          <Bar dataKey="Incorrect" fill={COLORS.Incorrect} />
          <Bar dataKey="Skipped" fill={COLORS.Skipped} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
