"use client"

import { type MouseEvent, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { captureEvent } from "@/lib/analytics"

export function Header() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)

  const isWork = pathname === "/projects" || pathname.startsWith("/projects/")
  const isWriting = pathname === "/writing" || pathname.startsWith("/writing/")
  const isAbout = pathname === "/experience" || pathname === "/about"

  useEffect(() => {
    const syncTheme = () => {
      try {
        const root = document.documentElement
        const attr = root.getAttribute("data-theme")
        const dark =
          attr === "dark" ||
          (!attr && window.matchMedia("(prefers-color-scheme: dark)").matches)
        setIsDark(dark)
      } catch {
        // Ignore errors
      }
    }

    syncTheme()

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => syncTheme()
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const toggleTheme = () => {
    try {
      const root = document.documentElement
      const attr = root.getAttribute("data-theme")
      const currentlyDark =
        attr === "dark" ||
        (!attr && window.matchMedia("(prefers-color-scheme: dark)").matches)
      const next = currentlyDark ? "light" : "dark"
      root.setAttribute("data-theme", next)
      setIsDark(next === "dark")
      try {
        localStorage.setItem("theme", next)
      } catch {
        // Ignore storage errors
      }
      captureEvent("theme_toggled", { theme: next })
    } catch {
      // Ignore errors
    }
  }

  const handleNavClick =
    (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return
      }

      if (pathname !== href) {
        return
      }

      if (!window.location.search) {
        event.preventDefault()
        if (window.location.hash) {
          window.history.replaceState(null, "", href)
        }
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      })
    }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <nav aria-label="Main" className="site-nav">
        <Link
          href="/"
          className="me"
          aria-label="Nelson Frank — Home"
          aria-current={pathname === "/" ? "page" : undefined}
          onClick={handleNavClick("/")}
        >
          NF
        </Link>
        <Link
          href="/projects"
          aria-current={isWork ? "page" : undefined}
          onClick={handleNavClick("/projects")}
        >
          Work
        </Link>
        <Link
          href="/writing"
          aria-current={isWriting ? "page" : undefined}
          onClick={handleNavClick("/writing")}
        >
          Writing
        </Link>
        <Link
          href="/experience"
          aria-current={isAbout ? "page" : undefined}
          onClick={handleNavClick("/experience")}
        >
          About
        </Link>
        <a href="#contact">Contact</a>
        <button
          id="t"
          type="button"
          className="theme-btn"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        >
          <svg
            className="theme-icon icon-sun"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
          <svg
            className="theme-icon icon-moon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </button>
      </nav>
    </>
  )
}
