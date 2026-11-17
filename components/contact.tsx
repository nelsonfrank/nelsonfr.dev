"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Mail, Github, Linkedin, ChevronDown } from "lucide-react"
import { captureEvent } from "@/lib/analytics"

const ContactForm = dynamic(() => import("./contact-form"), {
  ssr: false,
  loading: () => (
    <p className="mt-4 meta-mono">Loading form…</p>
  ),
})

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "nelsonfrank741@gmail.com"
export const RESPONSE_TIME_PLACEHOLDER = "24 hours"

export function Contact() {
  const [showForm, setShowForm] = useState(false)

  return (
    <section id="contact" className="py-16 md:py-20 border-t border-border">
      <div className="page-container">
        <div className="rounded-md border border-border bg-card p-6 sm:p-8 md:p-10 space-y-6">
          <div className="space-y-2 max-w-[680px]">
            <h2 className="text-[28px] font-semibold tracking-tight text-foreground">
              Let&apos;s build something.
            </h2>
            <p className="text-[17px] leading-[1.6] text-muted-foreground">
              I reply within {RESPONSE_TIME_PLACEHOLDER}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              onClick={() =>
                captureEvent("social_link_clicked", {
                  name: "Email",
                  href: `mailto:${CONTACT_EMAIL}`,
                })
              }
              className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity duration-200"
            >
              <Mail className="size-4" aria-hidden="true" />
              <span>Email {CONTACT_EMAIL}</span>
            </a>

            <Link
              href="https://github.com/nelsonfrank"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                captureEvent("social_link_clicked", {
                  name: "GitHub",
                  href: "https://github.com/nelsonfrank",
                })
              }
              className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto px-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:border-primary hover:text-primary transition-colors duration-200"
            >
              <Github className="size-4" aria-hidden="true" />
              <span>GitHub</span>
            </Link>

            <Link
              href="https://www.linkedin.com/in/nelson-frank-munissy/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                captureEvent("social_link_clicked", {
                  name: "LinkedIn",
                  href: "https://www.linkedin.com/in/nelson-frank-munissy/",
                })
              }
              className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto px-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:border-primary hover:text-primary transition-colors duration-200"
            >
              <Linkedin className="size-4" aria-hidden="true" />
              <span>LinkedIn</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              aria-expanded={showForm}
              className="inline-flex items-center gap-2 min-h-[44px] text-xs font-mono uppercase tracking-[0.05em] text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
            >
              <span>Prefer a form?</span>
              <ChevronDown
                className={`size-4 transition-transform duration-200 ${
                  showForm ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {showForm && <ContactForm />}
          </div>
        </div>
      </div>
    </section>
  )
}
