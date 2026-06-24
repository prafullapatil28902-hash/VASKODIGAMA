"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  DEFAULT_THEME,
  STORAGE_KEY,
  isThemeId,
  resolveTheme,
  type ConcreteTheme,
  type ThemeId,
} from "@/lib/themes";

interface ThemeContextValue {
  /** The user's selection (may be "system"). */
  theme: ThemeId;
  /** The concrete theme actually applied. */
  resolved: ConcreteTheme;
  setTheme: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function apply(resolved: ConcreteTheme, animate: boolean) {
  const d = document.documentElement;
  if (animate) {
    d.setAttribute("data-theme-transition", "");
    window.setTimeout(() => d.removeAttribute("data-theme-transition"), 450);
  }
  d.dataset.theme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Seed from the attribute the inline script already set (avoids a flash).
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [resolved, setResolved] = useState<ConcreteTheme>("dark");

  useEffect(() => {
    const d = document.documentElement;
    const stored = (d.dataset.themeSelection as ThemeId) ?? localStorage.getItem(STORAGE_KEY);
    const sel = isThemeId(stored) ? stored : DEFAULT_THEME;
    /* eslint-disable react-hooks/set-state-in-effect */
    setThemeState(sel);
    setResolved((d.dataset.theme as ConcreteTheme) ?? resolveTheme(sel));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Live-follow the OS when the selection is "system".
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const next = resolveTheme("system");
      setResolved(next);
      apply(next, true);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    localStorage.setItem(STORAGE_KEY, id);
    document.documentElement.dataset.themeSelection = id;
    const next = resolveTheme(id);
    setResolved(next);
    apply(next, true);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
