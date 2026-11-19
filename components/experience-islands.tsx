"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import type { Experience } from "@/lib/experience"

export interface ExperienceMenuItem {
  id: string
  label: string
}

export function ExperienceToc({
  items,
}: {
  items: readonly ExperienceMenuItem[]
}) {
  const [activeSection, setActiveSection] = useState<string>(
    items[0]?.id ?? "experience"
  )

  useEffect(() => {
    function spy() {
      let current: string = items[0]?.id ?? "experience"
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) {
          current = item.id
        }
      }
      setActiveSection(current)
    }

    window.addEventListener("scroll", spy, { passive: true })
    spy()
    return () => window.removeEventListener("scroll", spy)
  }, [items])

  return (
    <nav className="cv-menu" aria-label="On this page">
      <b>On this page</b>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={activeSection === item.id ? "on" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export interface RoleAccordionEntry {
  experience: Experience
  teamText: string
  related: { label: string; href: string }[]
}

const METRIC_PATTERNS = [
  "32% of commits",
  "5 concurrent",
  "3 enterprise",
  "60%",
  "99.9% uptime",
  "sub-1s",
  "50%",
  "3 junior developers",
]

function highlightBulletMetrics(text: string): React.ReactNode {
  let matchedPattern: string | null = null
  let matchedIndex = -1

  for (const pattern of METRIC_PATTERNS) {
    const idx = text.indexOf(pattern)
    if (idx !== -1 && (matchedIndex === -1 || idx < matchedIndex)) {
      matchedPattern = pattern
      matchedIndex = idx
    }
  }

  if (!matchedPattern || matchedIndex === -1) {
    return text
  }

  const before = text.slice(0, matchedIndex)
  const match = text.slice(matchedIndex, matchedIndex + matchedPattern.length)
  const after = text.slice(matchedIndex + matchedPattern.length)

  return (
    <>
      {before}
      <b>{match}</b>
      {after}
    </>
  )
}

export function ExperienceRolesAccordion({
  entries,
}: {
  entries: RoleAccordionEntry[]
}) {
  const detailsRefs = useRef<(HTMLDetailsElement | null)[]>([])
  const [allExpanded, setAllExpanded] = useState(false)

  const syncExpandState = () => {
    const els = detailsRefs.current.filter(
      (el): el is HTMLDetailsElement => el !== null
    )
    if (els.length === 0) return
    setAllExpanded(els.every((el) => el.open))
  }

  const handleToggleAll = () => {
    const els = detailsRefs.current.filter(
      (el): el is HTMLDetailsElement => el !== null
    )
    const nextOpen = !els.every((el) => el.open)
    els.forEach((el) => {
      el.open = nextOpen
    })
    setAllExpanded(nextOpen)
  }

  useEffect(() => {
    syncExpandState()
  }, [])

  return (
    <section id="experience">
      <div className="xph">
        <div>
          <h2 className="sh">Experience</h2>
          <p className="cv-lead" style={{ margin: 0 }}>
            {entries.length} roles, newest first. Open a role for the full
            detail.
          </p>
        </div>
        <button id="all" type="button" onClick={handleToggleAll}>
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {entries.map(({ experience: exp, teamText, related }, index) => (
        <details
          key={exp.slug}
          className="job"
          open={index === 0}
          ref={(el) => {
            detailsRefs.current[index] = el
          }}
          onToggle={syncExpandState}
        >
          <summary>
            <div>
              <h3>{exp.title}</h3>
              <span className="co">
                {exp.company}
                {exp.location ? `, ${exp.location}` : ""}
              </span>
            </div>
            <div className="when">
              {exp.period}
              <span className="chev" aria-hidden="true">
                ›
              </span>
            </div>
          </summary>

          <div className="in">
            <dl>
              <dt>Team</dt>
              <dd>{teamText}</dd>

              {exp.description && (
                <>
                  <dt>Owned</dt>
                  <dd>{exp.description}</dd>
                </>
              )}

              {exp.bullets.length > 0 && (
                <>
                  <dt>Results</dt>
                  <dd>
                    <ul>
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>{highlightBulletMetrics(bullet)}</li>
                      ))}
                    </ul>
                  </dd>
                </>
              )}

              {exp.technologies.length > 0 && (
                <>
                  <dt>Stack</dt>
                  <dd>
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="tag">
                        {tech}
                      </span>
                    ))}
                  </dd>
                </>
              )}

              {related.length > 0 && (
                <>
                  <dt>Related</dt>
                  <dd>
                    {related.map((rel, rIdx) => (
                      <span key={rel.href}>
                        {rIdx > 0 && " · "}
                        <Link href={rel.href}>{rel.label}</Link>
                      </span>
                    ))}
                  </dd>
                </>
              )}
            </dl>
          </div>
        </details>
      ))}
    </section>
  )
}

