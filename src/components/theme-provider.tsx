"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

export type ThemeName =
  | "zinc"
  | "blue"
  | "rose"
  | "emerald"
  | "purple"
  | "sunset"
  | "ocean"
  | "midnight"
  | "dracula"
  | "coffee"

export interface ThemeInfo {
  name: ThemeName
  label: string
  isDark: boolean
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
}

export const themes: ThemeInfo[] = [
  {
    name: "zinc",
    label: "Zinc",
    isDark: false,
    colors: {
      primary: "#18181b",
      secondary: "#f4f4f5",
      accent: "#f4f4f5",
      background: "#ffffff",
    },
  },
  {
    name: "blue",
    label: "Blue",
    isDark: false,
    colors: {
      primary: "#2563eb",
      secondary: "#e0e7ff",
      accent: "#dbeafe",
      background: "#f8faff",
    },
  },
  {
    name: "rose",
    label: "Rose",
    isDark: false,
    colors: {
      primary: "#e11d48",
      secondary: "#ffe4e6",
      accent: "#fecdd3",
      background: "#fff5f6",
    },
  },
  {
    name: "emerald",
    label: "Emerald",
    isDark: false,
    colors: {
      primary: "#059669",
      secondary: "#d1fae5",
      accent: "#a7f3d0",
      background: "#f0fdf4",
    },
  },
  {
    name: "purple",
    label: "Purple",
    isDark: false,
    colors: {
      primary: "#7c3aed",
      secondary: "#ede9fe",
      accent: "#ddd6fe",
      background: "#faf5ff",
    },
  },
  {
    name: "sunset",
    label: "Sunset",
    isDark: false,
    colors: {
      primary: "#ea580c",
      secondary: "#fff7ed",
      accent: "#fed7aa",
      background: "#fffbf5",
    },
  },
  {
    name: "ocean",
    label: "Ocean",
    isDark: false,
    colors: {
      primary: "#0891b2",
      secondary: "#cffafe",
      accent: "#a5f3fc",
      background: "#f0fdfa",
    },
  },
  {
    name: "midnight",
    label: "Midnight",
    isDark: true,
    colors: {
      primary: "#60a5fa",
      secondary: "#1e293b",
      accent: "#334155",
      background: "#0f172a",
    },
  },
  {
    name: "dracula",
    label: "Dracula",
    isDark: true,
    colors: {
      primary: "#bd93f9",
      secondary: "#383a59",
      accent: "#44475a",
      background: "#282a36",
    },
  },
  {
    name: "coffee",
    label: "Coffee",
    isDark: true,
    colors: {
      primary: "#d4a574",
      secondary: "#3d2e22",
      accent: "#4a3728",
      background: "#1c1410",
    },
  },
]

const STORAGE_KEY = "nodeflow-theme"
const DEFAULT_THEME: ThemeName = "zinc"

interface ThemeContextValue {
  theme: ThemeName
  setTheme: (theme: ThemeName) => void
  themes: ThemeInfo[]
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function applyTheme(theme: ThemeName) {
  const root = document.documentElement
  root.setAttribute("data-theme", theme)
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
}: {
  children: React.ReactNode
  defaultTheme?: ThemeName
}) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    // On the server, use the default theme
    if (typeof window === "undefined") return defaultTheme

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && themes.some((t) => t.name === stored)) {
        return stored as ThemeName
      }
    } catch {
      // localStorage not available
    }
    return defaultTheme
  })

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem(STORAGE_KEY, newTheme)
    } catch {
      // localStorage not available
    }
    applyTheme(newTheme)
  }, [])

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
