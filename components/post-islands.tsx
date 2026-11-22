"use client"

import { useEffect, useRef, useState } from "react"
import type { TocHeading } from "@/lib/markdown"

export function ReadingProgressBar({ targetId = "art" }: { targetId?: string }) {
  const barRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const art = document.getElementById(targetId)
    const bar = barRef.current
    if (!art || !bar) return

    let rafId: number | null = null

    function updateProgress() {
      rafId = null
      const rect = art!.getBoundingClientRect()
      const h = Math.max(1, rect.height - window.innerHeight * 0.6)
      const p = Math.min(
        1,
        Math.max(0, (-rect.top + window.innerHeight * 0.2) / h)
      )
      bar!.style.transform = `scaleX(${p})`
    }

    function scheduleUpdate() {
      if (rafId !== null) return
      rafId = window.requestAnimationFrame(updateProgress)
    }

    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate, { passive: true })
    scheduleUpdate()

    return () => {
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
      if (rafId !== null) window.cancelAnimationFrame(rafId)
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

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    if (typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort(
              (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
            )
          if (visible.length > 0 && visible[0].target.id) {
            setActiveId(visible[0].target.id)
          }
        },
        {
          rootMargin: "-12% 0px -70% 0px",
          threshold: 0,
        }
      )

      elements.forEach((el) => observer.observe(el))
      return () => observer.disconnect()
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

export function ThemeVideoHydrator({ targetId = "art" }: { targetId?: string }) {
  useEffect(() => {
    const container = document.getElementById(targetId)
    if (!container) return

    const videos = Array.from(
      container.querySelectorAll<HTMLVideoElement>("video[data-theme-video]")
    )
    if (videos.length === 0) return

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const isDark = () => {
      const attr = document.documentElement.getAttribute("data-theme")
      if (attr === "dark") return true
      if (attr === "light") return false
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    const activeVideos = new Set<HTMLVideoElement>()

    const syncVideoSource = (video: HTMLVideoElement) => {
      const nextSrc = isDark() ? video.dataset.darkSrc : video.dataset.lightSrc
      if (!nextSrc) return
      if (video.getAttribute("src") !== nextSrc) {
        video.setAttribute("src", nextSrc)
        video.load()
      }
      if (!reducedMotion) {
        video.play().catch(() => {})
      } else {
        video.controls = true
      }
    }

    let io: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const video = entry.target as HTMLVideoElement
            if (entry.isIntersecting) {
              activeVideos.add(video)
              syncVideoSource(video)
            } else if (!video.paused) {
              video.pause()
            }
          }
        },
        { rootMargin: "250px 0px" }
      )
      videos.forEach((v) => io!.observe(v))
    } else {
      videos.forEach((v) => {
        activeVideos.add(v)
        syncVideoSource(v)
      })
    }

    const syncAllActive = () => {
      activeVideos.forEach(syncVideoSource)
    }

    const mo = new MutationObserver(syncAllActive)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })

    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    mq.addEventListener("change", syncAllActive)

    return () => {
      io?.disconnect()
      mo.disconnect()
      mq.removeEventListener("change", syncAllActive)
    }
  }, [targetId])

  return null
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
        Share on LinkedIn
      </a>
    </div>
  )
}

