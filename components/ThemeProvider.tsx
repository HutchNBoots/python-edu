"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { darkTheme } from "@/styles/themes/dark";
import { lightTheme } from "@/styles/themes/light";

type ThemeName = "dark" | "light";

interface ThemeContextValue {
  theme: ThemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

function applyTokens(name: ThemeName) {
  const tokens = name === "dark" ? darkTheme : lightTheme;
  const root = document.documentElement;
  Object.entries(tokens).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("light");

  useEffect(() => {
    const stored = localStorage.getItem("dragonpy-theme");
    const active: ThemeName = stored === "dark" ? "dark" : "light";
    setTheme(active);
    applyTokens(active);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: ThemeName = current === "dark" ? "light" : "dark";
      localStorage.setItem("dragonpy-theme", next);
      applyTokens(next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
