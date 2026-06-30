"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMagnetic } from "@/hooks/use-gsap"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import type { PostMeta } from "@/lib/posts"
import type { TocHeading } from "@/lib/markdown"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Mermaid renderer ─────────────────────────────────────────────────────────

let mermaidInitialized = false

/**
 * After the article HTML is injected, find every div.mermaid-block containing a
 * <script type="application/mermaid"> and render it into an SVG.
 *
 * We read the definition from the script's textContent, NOT from a data
 * attribute — HTML parsers normalize newlines in attribute values to spaces,
 * which breaks multi-line mermaid syntax completely.
 */
function useMermaid(containerRef: React.RefObject<HTMLDivElement | null>, htmlContent: string) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const blocks = Array.from(
      container.querySelectorAll<HTMLDivElement>("div.mermaid-block")
    )
    if (blocks.length === 0) return

    let cancelled = false

    async function render() {
      const mermaid = (await import("mermaid")).default

      if (!mermaidInitialized) {
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            darkMode: true,
            background: "transparent",
            primaryColor: "hsl(142 71% 45%)",
            primaryTextColor: "hsl(0 0% 95%)",
            primaryBorderColor: "hsl(142 71% 35%)",
            lineColor: "hsl(0 0% 50%)",
            secondaryColor: "hsl(0 0% 12%)",
            tertiaryColor: "hsl(0 0% 9%)",
            edgeLabelBackground: "hsl(0 0% 9%)",
            clusterBkg: "hsl(0 0% 10%)",
            titleColor: "hsl(0 0% 90%)",
            nodeTextColor: "hsl(0 0% 90%)",
            fontFamily: "'Geist', 'Inter', sans-serif",
            fontSize: "14px",
          },
          flowchart: { htmlLabels: true, curve: "basis" },
          sequence: { useMaxWidth: true },
        })
        mermaidInitialized = true
      }

      for (let i = 0; i < blocks.length; i++) {
        if (cancelled) break
        const block = blocks[i]

        // Read definition from the <script type="application/mermaid"> child.
        // textContent is never HTML-parsed, so newlines are preserved as-is.
        const scriptEl = block.querySelector<HTMLScriptElement>(
          "script[type='application/mermaid']"
        )
        const definition = scriptEl?.textContent ?? ""
        if (!definition.trim()) continue

        try {
          const id = `mermaid-svg-${Date.now()}-${i}`
          const { svg } = await mermaid.render(id, definition)
          if (cancelled) break
          block.innerHTML = svg
        } catch (err) {
          console.error("Mermaid render error:", err)
          block.innerHTML =
            `<pre style="color:hsl(0 80% 60%);font-size:0.75rem;white-space:pre-wrap;text-align:left">${String(err)}</pre>`
        }
      }
    }

    render()
    return () => { cancelled = true }
  // htmlContent changing means a new post was loaded — re-run
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [htmlContent])
}

// ─── Reading Progress Bar ─────────────────────────────────────────────────────

function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const update = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : "0%"
    }
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-60 h-0.5 bg-border/30">
      <div ref={barRef} className="h-full bg-primary transition-none" style={{ width: "0%" }} />
    </div>
  )
}

// ─── Table of Contents Sidebar ────────────────────────────────────────────────

function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("")

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    // Offset for the fixed header (~68px)
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top, behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const observers: IntersectionObserver[] = []
    const visibleIds = new Set<string>()

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibleIds.add(id)
          } else {
            visibleIds.delete(id)
          }
          // Pick the first visible heading in document order
          const firstVisible = headings.find((h) => visibleIds.has(h.id))
          if (firstVisible) setActiveId(firstVisible.id)
        },
        {
          rootMargin: "-80px 0px -60% 0px",
          threshold: 0,
        }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="hidden xl:block sticky top-28 self-start w-56 shrink-0">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        On this page
      </p>
      <ul className="space-y-1 border-l border-border/60">
        {headings.map((heading) => {
          const isActive = activeId === heading.id
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={[
                  "block text-xs leading-relaxed py-1.5 transition-all duration-200 truncate",
                  "border-l-2 -ml-px",
                  heading.level === 3 ? "pl-7" : "pl-4",
                  isActive
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
                ].join(" ")}
                title={heading.text}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// ─── Post Client ──────────────────────────────────────────────────────────────

interface PostClientProps {
  post: PostMeta
  htmlContent: string
  headings: TocHeading[]
  prevPost: PostMeta | null
  nextPost: PostMeta | null
}

export default function PostClient({ post, htmlContent, headings, prevPost, nextPost }: PostClientProps) {
  const headerRef = useRef<HTMLElement>(null)
  const heroRef   = useRef<HTMLDivElement>(null)
  const bodyRef   = useRef<HTMLDivElement>(null)
  const backRef   = useMagnetic<HTMLAnchorElement>(0.3)

  // Render mermaid diagrams whenever the post body changes
  useMermaid(bodyRef, htmlContent)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )

      if (heroRef.current) {
        gsap.fromTo(
          Array.from(heroRef.current.children),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, delay: 0.1, ease: "power3.out" }
        )
      }

      if (bodyRef.current) {
        gsap.fromTo(
          bodyRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, delay: 0.5, ease: "power3.out" }
        )
      }
    })

    return () => ctx.revert()
  }, [post.slug])

  return (
    <>
      <ReadingProgress />
      <CustomCursor />
      <SmoothScroll>
        {/* Header */}
        <header
          ref={headerRef}
          className="fixed top-0.5 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border py-4 px-6"
        >
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <Link
              ref={backRef}
              href="/writing"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              data-cursor="Back"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Writing
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Nelson Frank
            </Link>
          </div>
        </header>

        <main className="pt-28 pb-24 px-6 min-h-screen">
          {/* Outer wrapper: prose column + TOC sidebar */}
          <div className="mx-auto max-w-6xl flex gap-16 items-start">

            {/* Main content column (max-w-3xl, centred when no sidebar) */}
            <div className="w-full min-w-0 max-w-3xl mx-auto xl:mx-0">

              {/* Hero */}
              <div ref={heroRef} className="mb-14">
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-tight text-balance mb-6">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {post.date}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <div className="mt-10 h-px bg-gradient-to-r from-primary/40 via-border to-transparent" />
              </div>

              {/* Rendered markdown body */}
              <article
                ref={bodyRef}
                className="prose"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              <div className="mt-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              {/* Prev / Next navigation */}
              <nav className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevPost ? (
                  <Link
                    href={`/writing/${prevPost.slug}`}
                    className="group flex flex-col gap-1 p-5 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/30 transition-all duration-300"
                  >
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform duration-300" />
                      Previous
                    </span>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {prevPost.title}
                    </span>
                  </Link>
                ) : <div />}

                {nextPost ? (
                  <Link
                    href={`/writing/${nextPost.slug}`}
                    className="group flex flex-col items-end gap-1 p-5 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/30 transition-all duration-300"
                  >
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      Next
                      <ArrowUpRight className="size-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </span>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors text-right line-clamp-2">
                      {nextPost.title}
                    </span>
                  </Link>
                ) : <div />}
              </nav>
            </div>

            {/* Sticky TOC sidebar — only visible on xl+ */}
            <TableOfContents headings={headings} />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 py-8 px-6">
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <Link
              href="/writing"
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
            >
              <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
              All posts
            </Link>
            <p className="text-xs text-muted-foreground/50">Nelson Frank · {new Date().getFullYear()}</p>
          </div>
        </footer>
      </SmoothScroll>
    </>
  )
}
