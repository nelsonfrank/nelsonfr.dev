"use client"

import { useState } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { href: "/#work", label: "Work" },
  { href: "/#writing", label: "Writing" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-border bg-background">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8"
      >
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground hover:text-primary transition-colors min-h-[44px] inline-flex items-center"
        >
          Nelson Frank
        </Link>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center min-h-[44px] px-2.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
