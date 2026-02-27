import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./useAuth";

const ThemeContext = createContext({});

export const THEMES = [
  { id: "light",  label: "LIGHT",       desc: "Black & white" },
  { id: "dark",   label: "DARK",        desc: "Pure black" },
  { id: "cherry", label: "RED CHERRY",  desc: "#e30202" },
  { id: "blue",   label: "BLUE",        desc: "#4988C4" },
];

const getKey = (userId) => `fytfynfyn_theme_${userId || "default"}`;

export function ThemeProvider({ children }) {
  const { userId } = useAuth();

  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(getKey(userId)) || "light";
  });

  // Re-sync on user switch
  useEffect(() => {
    const saved = localStorage.getItem(getKey(userId)) || "light";
    setThemeState(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, [userId]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (t) => {
    localStorage.setItem(getKey(userId), t);
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
