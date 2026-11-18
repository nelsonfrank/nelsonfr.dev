"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { captureEvent } from "@/lib/analytics"

export function Header() {
  const pathname = usePathname()

  const isWork = pathname === "/projects" || pathname.startsWith("/projects/")
  const isWriting = pathname === "/writing" || pathname.startsWith("/writing/")
  const isAbout = pathname === "/experience" || pathname === "/about"

  const toggleTheme = () => {
    try {
      const root = document.documentElement
      const attr = root.getAttribute("data-theme")
      const isDark =
        attr === "dark" ||
        (!attr && window.matchMedia("(prefers-color-scheme: dark)").matches)
      const next = isDark ? "light" : "dark"
      root.setAttribute("data-theme", next)
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
        >
          NF
        </Link>
        <Link
          href="/projects"
          className="hide-xs"
          aria-current={isWork ? "page" : undefined}
        >
          Work
        </Link>
        <Link
          href="/writing"
          className="hide-xs"
          aria-current={isWriting ? "page" : undefined}
        >
          Writing
        </Link>
        <Link
          href="/experience"
          className="hide-xs"
          aria-current={isAbout ? "page" : undefined}
        >
          About
        </Link>
        <a href="#contact">Contact</a>
        <button
          id="t"
          type="button"
          onClick={toggleTheme}
          aria-label="Switch theme"
        >
          Theme
        </button>
      </nav>
    </>
  )
}
