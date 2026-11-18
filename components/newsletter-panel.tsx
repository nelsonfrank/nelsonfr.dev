"use client"

import { useState } from "react"

export function NewsletterPanel({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<string | null>(null)

  return (
    <aside className={`news-panel${compact ? " compact" : ""}`} aria-label="Newsletter signup">
      <div>
        {compact ? (
          <h3>Engineering notes in your inbox</h3>
        ) : (
          <h2>Engineering notes in your inbox</h2>
        )}
        <p>
          Deep dives on authentication, backend architecture, and TypeScript when a new post ships.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setStatus(
            "Newsletter provider is not wired yet ([ADD: newsletter provider endpoint]). Subscribe via RSS in the meantime."
          )
        }}
      >
        <input
          type="email"
          placeholder="you@example.com"
          aria-label="Email address"
          autoComplete="email"
          disabled
        />
        <button className="btn p" type="submit" disabled>
          Subscribe
        </button>
        <small>
          {status ??
            "Newsletter signup is currently disabled ([ADD: newsletter provider]). Follow along via the RSS feed."}
        </small>
      </form>
    </aside>
  )
}
