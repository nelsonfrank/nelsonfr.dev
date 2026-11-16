"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { captureEvent } from "@/lib/analytics"

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
    captureEvent("theme_toggled", { theme: nextTheme })
    setTheme(nextTheme)
  }

  const isDark = !mounted || resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        className ??
        "inline-flex items-center justify-center min-w-[44px] min-h-[44px] size-11 rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary transition-colors duration-200 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      }
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}
