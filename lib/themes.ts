// ── Central theme configuration ─────────────────────────────────────
// To add a theme: add a [data-theme="<id>"] block in app/globals.css and
// one entry here. Nothing else in the app needs to change — every
// component inherits its colours from the active theme's CSS variables.

export type ConcreteTheme = "dark" | "light" | "ocean" | "executive";
export type ThemeId = ConcreteTheme | "system";

export interface ThemeDef {
  id: ThemeId;
  label: string;
  description: string;
  /** Preview swatch [surface, accent, ink] — used only by the switcher UI. */
  swatch: [string, string, string];
}

export const THEMES: ThemeDef[] = [
  {
    id: "dark",
    label: "Intelligence Dark",
    description: "The default terminal — deep navy with signal teal.",
    swatch: ["#0e1426", "#34e0c8", "#eef1f8"],
  },
  {
    id: "light",
    label: "Clarity Light",
    description: "Bright research surface with high-contrast ink.",
    swatch: ["#ffffff", "#0bb39e", "#0d1726"],
  },
  {
    id: "ocean",
    label: "Ocean Navigator",
    description: "Deep blue waters with luminous cyan signals.",
    swatch: ["#0d2a45", "#38d0ff", "#eaf4ff"],
  },
  {
    id: "executive",
    label: "Executive Black",
    description: "Pure black, restrained, with platinum accents.",
    swatch: ["#101012", "#d8c08a", "#f4f4f5"],
  },
  {
    id: "system",
    label: "System Theme",
    description: "Follow your operating system's light / dark setting.",
    swatch: ["#0e1426", "#5b9dff", "#ffffff"],
  },
];

export const DEFAULT_THEME: ThemeId = "dark";
export const STORAGE_KEY = "vkd.theme";

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

/** Resolve a selection to a concrete theme, expanding "system". */
export function resolveTheme(id: ThemeId): ConcreteTheme {
  if (id !== "system") return id;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
}

/**
 * Inline, pre-paint script. Stringified into the document <head> so the
 * correct theme is applied before first render — no flash of wrong theme.
 */
export const THEME_INIT_SCRIPT = `(function(){try{
  var sel=localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||${JSON.stringify(DEFAULT_THEME)};
  var resolved=sel;
  if(sel==='system'){resolved=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}
  var d=document.documentElement;
  d.dataset.theme=resolved;
  d.dataset.themeSelection=sel;
}catch(e){document.documentElement.dataset.theme=${JSON.stringify(DEFAULT_THEME)};}})();`;
