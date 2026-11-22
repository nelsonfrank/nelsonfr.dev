"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export type LightboxItem =
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "video"; src: string; alt: string; caption?: string }
  | { kind: "mermaid"; svgHtml: string; caption?: string }

const MIN_SCALE = 0.5
const MAX_SCALE = 4
const STEP_SCALE = 0.25

function clampScale(value: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(value * 100) / 100))
}

function isDocumentDark(): boolean {
  if (typeof document === "undefined") return false
  const attr = document.documentElement.getAttribute("data-theme")
  if (attr === "dark") return true
  if (attr === "light") return false
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function scopeMermaidSvgForModal(svgHtml: string): string {
  const idMatch = svgHtml.match(/<svg[^>]*\bid="([^"]+)"/)
  if (!idMatch?.[1]) return svgHtml
  const origId = idMatch[1]
  return svgHtml.replaceAll(origId, `${origId}-modal`)
}

export function MediaLightbox({
  item,
  onClose,
}: {
  item: LightboxItem | null
  onClose: () => void
}) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const stageRef = useRef<HTMLDivElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const didDragRef = useRef(false)

  const resetView = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const adjustScale = useCallback((delta: number) => {
    setScale((prev) => {
      const next = clampScale(prev + delta)
      if (next <= 1) {
        setOffset({ x: 0, y: 0 })
      }
      return next
    })
  }, [])

  // Reset zoom/pan and manage body scroll lock + focus when opening/closing
  useEffect(() => {
    if (!item) return

    resetView()
    previousFocusRef.current = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const rafId = window.requestAnimationFrame(() => {
      closeBtnRef.current?.focus()
    })

    return () => {
      window.cancelAnimationFrame(rafId)
      document.body.style.overflow = prevOverflow
      previousFocusRef.current?.focus?.()
    }
  }, [item, resetView])

  // Keyboard controls: Escape, +, -, 0
  useEffect(() => {
    if (!item) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault()
        adjustScale(STEP_SCALE)
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault()
        adjustScale(-STEP_SCALE)
      } else if (e.key === "0") {
        e.preventDefault()
        resetView()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [item, onClose, adjustScale, resetView])

  // Non-passive wheel zoom on the stage
  useEffect(() => {
    if (!item) return
    const stage = stageRef.current
    if (!stage) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY < 0 ? 0.15 : -0.15
      adjustScale(delta)
    }

    stage.addEventListener("wheel", onWheel, { passive: false })
    return () => stage.removeEventListener("wheel", onWheel)
  }, [item, adjustScale])

  if (!item) return null

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (scale <= 1 || e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }
    didDragRef.current = false
    setDragging(true)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || !dragStartRef.current) return
    didDragRef.current = true
    setOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    })
  }

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    dragStartRef.current = null
    setDragging(false)
  }

  const handleDoubleClick = () => {
    if (scale > 1) {
      resetView()
    } else {
      setScale(2)
    }
  }

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (didDragRef.current) {
      didDragRef.current = false
      return
    }
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const caption =
    item.caption ||
    (item.kind === "image" || item.kind === "video" ? item.alt : undefined)

  return (
    <div
      className="media-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Media preview"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="media-lightbox-bar" onClick={(e) => e.stopPropagation()}>
        <div className="media-lightbox-controls" role="group" aria-label="Zoom controls">
          <button
            type="button"
            className="media-lightbox-btn"
            onClick={() => adjustScale(-STEP_SCALE)}
            disabled={scale <= MIN_SCALE}
            aria-label="Zoom out"
            title="Zoom out (-)"
          >
            −
          </button>
          <span className="media-lightbox-zoom" aria-live="polite">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            className="media-lightbox-btn"
            onClick={() => adjustScale(STEP_SCALE)}
            disabled={scale >= MAX_SCALE}
            aria-label="Zoom in"
            title="Zoom in (+)"
          >
            +
          </button>
          <button
            type="button"
            className="media-lightbox-btn text"
            onClick={resetView}
            disabled={scale === 1 && offset.x === 0 && offset.y === 0}
            aria-label="Reset zoom"
            title="Reset zoom (0)"
          >
            Reset
          </button>
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          className="media-lightbox-btn close"
          onClick={onClose}
          aria-label="Close preview"
          title="Close (Esc)"
        >
          Close
        </button>
      </div>

      <div
        ref={stageRef}
        className={`media-lightbox-stage${scale > 1 ? " is-zoomed" : ""}${dragging ? " is-dragging" : ""}`}
        onClick={handleStageClick}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <div
          className="media-lightbox-transform"
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
            transition: dragging ? "none" : undefined,
          }}
        >
          {item.kind === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.src}
              alt={item.alt}
              className="media-lightbox-media"
              draggable={false}
            />
          )}

          {item.kind === "video" && (
            <video
              src={item.src}
              aria-label={item.alt}
              className="media-lightbox-media"
              autoPlay={!reducedMotion}
              loop
              muted
              playsInline
              controls={reducedMotion}
            />
          )}

          {item.kind === "mermaid" && (
            <div
              className="media-lightbox-mermaid"
              data-mermaid-modal
              dangerouslySetInnerHTML={{
                __html: scopeMermaidSvgForModal(item.svgHtml),
              }}
            />
          )}
        </div>
      </div>

      {caption && (
        <div className="media-lightbox-caption" onClick={(e) => e.stopPropagation()}>
          <p>{caption}</p>
        </div>
      )}
    </div>
  )
}

export function ArticleMediaLightbox({
  targetId = "art",
  includeCover = true,
}: {
  targetId?: string
  includeCover?: boolean
}) {
  const [activeItem, setActiveItem] = useState<LightboxItem | null>(null)

  useEffect(() => {
    const article = document.getElementById(targetId)
    const coverEl = includeCover
      ? document.querySelector<HTMLElement>(".post-cover.has-img")
      : null

    const getFigureCaption = (el: HTMLElement): string | undefined => {
      const fig = el.closest("figure")
      const caption = fig?.querySelector("figcaption")?.textContent?.trim()
      return caption || undefined
    }

    const openFromElement = (target: HTMLElement) => {
      if (target.matches("img:not([data-no-zoom])")) {
        const img = target as HTMLImageElement
        const src = img.currentSrc || img.getAttribute("src")
        if (!src) return
        setActiveItem({
          kind: "image",
          src,
          alt: img.alt || "Article image",
          caption: getFigureCaption(img),
        })
        return
      }

      if (target.matches("video[data-theme-video]")) {
        const video = target as HTMLVideoElement
        const src =
          video.currentSrc ||
          video.getAttribute("src") ||
          (isDocumentDark() ? video.dataset.darkSrc : video.dataset.lightSrc)
        if (!src) return
        setActiveItem({
          kind: "video",
          src,
          alt: video.getAttribute("aria-label") || "Animated diagram",
          caption: getFigureCaption(video),
        })
        return
      }

      if (coverEl && (target === coverEl || coverEl.contains(target))) {
        const img = coverEl.querySelector("img")
        if (!img) return
        const src = img.currentSrc || img.getAttribute("src")
        if (!src) return
        setActiveItem({
          kind: "image",
          src,
          alt: img.alt || "Post cover image",
        })
      }
    }

    const markZoomable = (el: HTMLElement, label: string) => {
      el.setAttribute("data-zoomable", "true")
      el.setAttribute("tabindex", "0")
      el.setAttribute("role", "button")
      if (!el.getAttribute("aria-label")) {
        el.setAttribute("aria-label", label)
      }
    }

    const cleanups: Array<() => void> = []

    if (article) {
      article
        .querySelectorAll<HTMLImageElement>("img:not([data-no-zoom])")
        .forEach((img) => {
          markZoomable(img, img.alt ? `Preview image: ${img.alt}` : "Preview image")
        })
      article
        .querySelectorAll<HTMLVideoElement>("video[data-theme-video]")
        .forEach((video) => {
          const label = video.getAttribute("aria-label")
          markZoomable(video, label ? `Preview diagram: ${label}` : "Preview diagram")
        })

      const onArticleClick = (e: MouseEvent) => {
        const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
          "img:not([data-no-zoom]), video[data-theme-video]"
        )
        if (target && article.contains(target)) {
          openFromElement(target)
        }
      }

      const onArticleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== "Enter" && e.key !== " ") return
        const target = e.target as HTMLElement | null
        if (
          target &&
          target.matches("img:not([data-no-zoom]), video[data-theme-video]")
        ) {
          e.preventDefault()
          openFromElement(target)
        }
      }

      article.addEventListener("click", onArticleClick)
      article.addEventListener("keydown", onArticleKeyDown)
      cleanups.push(() => {
        article.removeEventListener("click", onArticleClick)
        article.removeEventListener("keydown", onArticleKeyDown)
      })
    }

    if (coverEl) {
      const coverImg = coverEl.querySelector("img")
      markZoomable(
        coverEl,
        coverImg?.alt ? `Preview cover image: ${coverImg.alt}` : "Preview cover image"
      )

      const onCoverClick = () => openFromElement(coverEl)
      const onCoverKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          openFromElement(coverEl)
        }
      }

      coverEl.addEventListener("click", onCoverClick)
      coverEl.addEventListener("keydown", onCoverKeyDown)
      cleanups.push(() => {
        coverEl.removeEventListener("click", onCoverClick)
        coverEl.removeEventListener("keydown", onCoverKeyDown)
      })
    }

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [targetId, includeCover])

  return (
    <MediaLightbox item={activeItem} onClose={() => setActiveItem(null)} />
  )
}

