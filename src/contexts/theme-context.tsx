"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

export type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isMobileDevice: boolean
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, defaultTheme = "system" }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    // Check if user prefers dark mode
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      
      // Set initial theme
      if (theme === "system") {
        document.documentElement.classList.toggle("dark", mediaQuery.matches)
      } else {
        document.documentElement.classList.toggle("dark", theme === "dark")
      }

      // Listen for system theme changes
      const handleChange = (e: MediaQueryListEvent) => {
        if (theme === "system") {
          document.documentElement.classList.toggle("dark", e.matches)
        }
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  useEffect(() => {
    // Check if device is mobile
    if (typeof window !== "undefined") {
      setIsMobileDevice(window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent))
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const nextTheme = prevTheme === "light" ? "dark" : prevTheme === "dark" ? "system" : "light"
      
      // Update document class based on new theme
      if (nextTheme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        document.documentElement.classList.toggle("dark", prefersDark)
      } else {
        document.documentElement.classList.toggle("dark", nextTheme === "dark")
      }
      
      return nextTheme
    })
  }, [])

  const value = {
    theme,
    toggleTheme,
    isMobileDevice
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
} 