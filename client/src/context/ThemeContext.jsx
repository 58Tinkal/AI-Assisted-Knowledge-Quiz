// client/src/context/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // read from localStorage or default to light
    if (typeof window !== "undefined") {
      return localStorage.getItem("ai-quiz-theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("ai-quiz-theme", theme);

    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(
      theme === "dark" ? "theme-dark" : "theme-light"
    );
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
