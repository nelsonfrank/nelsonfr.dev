"use client"

import { useState } from "react"
import Link from "next/link"

export function NewsletterPanel({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setState("error")
      setMessage("Please enter your email address.")
      return
    }

    setState("submitting")
    setMessage("")

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, website }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        message?: string
        error?: string
      }

      if (res.ok) {
        setState("success")
        setMessage(
          data.message || "You’re subscribed. Watch your inbox for the next post."
        )
        setEmail("")
      } else {
        setState("error")
        setMessage(
          data.error || "Could not subscribe right now. Please try again."
        )
      }
    } catch {
      setState("error")
      setMessage("Network error. Please check your connection and try again.")
    }
  }

  return (
    <aside
      className={`news-panel${compact ? " compact" : ""}`}
      aria-label="Newsletter signup"
    >
      <div>
        {compact ? (
          <h3>One practical post a month</h3>
        ) : (
          <h2>One practical post a month</h2>
        )}
        <p>
          Lessons from real projects on authentication, backend systems, and
          TypeScript. Unsubscribe any time, or{" "}
          <Link href="/feed.xml" style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
            subscribe via RSS
          </Link>
          .
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
        <input
          type="email"
          placeholder="you@example.com"
          aria-label="Email address"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "submitting"}
        />
        <button
          className="btn p"
          type="submit"
          disabled={state === "submitting"}
        >
          {state === "submitting" ? "Subscribing…" : "Subscribe"}
        </button>
        {message && (
          <small role="status" aria-live="polite">
            {message}
          </small>
        )}
      </form>
    </aside>
  )
}
