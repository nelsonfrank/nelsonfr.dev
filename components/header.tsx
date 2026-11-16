"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const pathname = usePathname()
  const isHome = pathname === "/"

  const navLinks = [
    { href: isHome ? "#work" : "/projects", label: "Work" },
    { href: isHome ? "#writing" : "/writing", label: "Writing" },
    { href: isHome ? "#about" : "/experience", label: "About" },
    { href: isHome ? "#contact" : "/#contact", label: "Contact" },
  ]

  return (
    <header className="border-b border-border bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <div className="page-container flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2.5 sm:py-3.5">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground hover:text-primary transition-colors duration-200 min-h-[44px] inline-flex items-center shrink-0"
        >
          Nelson Frank
        </Link>

        <div className="flex flex-wrap items-center justify-between w-full sm:w-auto gap-x-1 gap-y-1 sm:gap-x-2">
          <nav aria-label="Primary" className="flex flex-wrap items-center -ml-2 sm:ml-0">
            {navLinks.map((link, index) => (
              <span key={link.label} className="inline-flex items-center">
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="text-muted-foreground/50 select-none px-0.5 sm:px-1"
                  >
                    ·
                  </span>
                )}
                <Link
                  href={link.href}
                  className="inline-flex items-center justify-center min-h-[44px] px-2 sm:px-2.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
