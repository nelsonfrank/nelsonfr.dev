"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import gsap from "gsap"
import { useMagnetic } from "@/hooks/use-gsap"
import posthog from "posthog-js"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const buttonRef = useMagnetic<HTMLButtonElement>(0.4)
  const iconRef = useRef<HTMLDivElement>(null)

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
    
    // Quick rotation and scale bounce animation on click
    if (iconRef.current) {
      gsap.fromTo(
        iconRef.current,
        { rotate: 0, scale: 0.7 },
        { rotate: 360, scale: 1, duration: 0.5, ease: "back.out(1.5)" }
      )
    }
    
    posthog.capture("theme_toggled", { theme: nextTheme })
    setTheme(nextTheme)
  }

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center size-12 rounded-full glass text-foreground hover:text-primary transition-all duration-300 shadow-lg cursor-pointer select-none active:scale-95"
      aria-label="Toggle theme"
      data-cursor="Theme"
    >
      <div ref={iconRef} className="flex items-center justify-center">
        {isDark ? (
          <Sun className="size-5" />
        ) : (
          <Moon className="size-5" />
        )}
      </div>
    </button>
  )
}
