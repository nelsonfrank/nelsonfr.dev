"use client"

import { useEffect, useRef, useState } from "react"
import type { TocHeading } from "@/lib/markdown"

export function ReadingProgressBar({ targetId = "art" }: { targetId?: string }) {
  const barRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function updateProgress() {
      const art = document.getElementById(targetId)
      const bar = barRef.current
      if (!art || !bar) return
      const rect = art.getBoundingClientRect()
      const h = Math.max(1, rect.height - window.innerHeight * 0.6)
      const p = Math.min(
        1,
        Math.max(0, (-rect.top + window.innerHeight * 0.2) / h)
      )
      bar.style.transform = `scaleX(${p})`
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)
    updateProgress()

    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [targetId])

  return (
    <div className="reading-progress-track" aria-hidden="true">
      <div ref={barRef} id="bar" className="reading-progress-bar" />
    </div>
  )
}

export function PostToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "")

  useEffect(() => {
    if (headings.length === 0) return

    function updateSpy() {
      let cur = headings[0].id
      for (const h of headings) {
        const el = document.getElementById(h.id)
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) {
          cur = h.id
        }
      }
      setActiveId(cur)
    }

    window.addEventListener("scroll", updateSpy, { passive: true })
    window.addEventListener("resize", updateSpy)
    updateSpy()

    return () => {
      window.removeEventListener("scroll", updateSpy)
      window.removeEventListener("resize", updateSpy)
    }
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside className="toc-aside" aria-label="On this page">
      <b>On this page</b>
      <ol>
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={activeId === h.id ? "on" : undefined}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  )
}

export function ShareButtons({
  title,
  slug,
}: {
  title: string
  slug: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    const finish = () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(window.location.href)
          .then(finish, finish)
      } else {
        finish()
      }
    } catch {
      finish()
    }
  }

  const shareUrl = `https://nelsonfrank.dev/writing/${slug}`
  const shareText = encodeURIComponent(`${title} by Nelson Frank`)
  const encodedUrl = encodeURIComponent(shareUrl)

  return (
    <div className="share-row">
      <span>Share this post</span>
      <button
        className="btn s"
        id="copy"
        type="button"
        onClick={handleCopyLink}
      >
        {copied ? "Link copied" : "Copy link"}
      </button>
      <a
        className="btn s"
        href={`https://x.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Post on X
      </a>
      <a
        className="btn s"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>
    </div>
  )
}

