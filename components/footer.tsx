"use client"

import Link from "next/link"
import { captureEvent } from "@/lib/analytics"

const socialLinks = [
  { label: "GitHub", href: "https://github.com/nelsonfrank" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nelson-frank-munissy/" },
  { label: "X", href: "https://x.com/nelsonfr_" },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-6">
      <div className="page-container flex flex-wrap items-center justify-between gap-4 meta-mono">
        <p>© {currentYear} Nelson Frank</p>
        <div className="flex flex-wrap items-center gap-3">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                captureEvent("social_link_clicked", {
                  name: link.label,
                  href: link.href,
                })
              }
              className="inline-flex items-center min-h-[44px] px-1.5 hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
