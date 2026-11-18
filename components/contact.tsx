"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { captureEvent } from "@/lib/analytics"

const ContactForm = dynamic(() => import("./contact-form"), {
  ssr: false,
  loading: () => (
    <p style={{ marginTop: "1rem", color: "var(--paper)", opacity: 0.8 }}>
      Loading form…
    </p>
  ),
})

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "nelsonfrank741@gmail.com"
export const RESPONSE_TIME_PLACEHOLDER = "24 hours"

export function Contact({
  heading = "Have a project in mind?",
}: {
  heading?: string
}) {
  const [showForm, setShowForm] = useState(false)

  return (
    <section className="contact-block" id="contact">
      <div className="wrap">
        <h2>{heading}</h2>
        <p className="lead">
          Tell me what you’re building and when you need it. I reply within{" "}
          {RESPONSE_TIME_PLACEHOLDER}.
        </p>
        <a
          className="mail-pill"
          href={`mailto:${CONTACT_EMAIL}`}
          onClick={() =>
            captureEvent("social_link_clicked", {
              name: "Email",
              href: `mailto:${CONTACT_EMAIL}`,
            })
          }
        >
          {CONTACT_EMAIL}
        </a>

        <ul className="contact-links">
          <li>
            <a
              href="https://github.com/nelsonfrank"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                captureEvent("social_link_clicked", {
                  name: "GitHub",
                  href: "https://github.com/nelsonfrank",
                })
              }
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/nelson-frank-munissy/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                captureEvent("social_link_clicked", {
                  name: "LinkedIn",
                  href: "https://www.linkedin.com/in/nelson-frank-munissy/",
                })
              }
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://x.com/nelsonfr_"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                captureEvent("social_link_clicked", {
                  name: "X",
                  href: "https://x.com/nelsonfr_",
                })
              }
            >
              X
            </a>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              aria-expanded={showForm}
            >
              {showForm ? "Hide form" : "Send a message right here"}
            </button>
          </li>
        </ul>

        {showForm && <ContactForm />}
      </div>
    </section>
  )
}
