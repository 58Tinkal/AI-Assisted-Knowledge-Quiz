// client/src/components/ThemeToggle.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      className={`theme-toggle ${isDark ? "theme-toggle-dark" : "theme-toggle-light"}`}
      onClick={toggleTheme}
      aria-label="Toggle light/dark mode"
    >
      <span className="theme-toggle-track" />
      <span className="theme-toggle-thumb" />
      <span className="theme-toggle-icon theme-toggle-icon-left">☀️</span>
      <span className="theme-toggle-icon theme-toggle-icon-right">🌙</span>
      <span className="theme-toggle-label">
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
