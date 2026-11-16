"use client"

import { useEffect, useRef, useState, useCallback, memo } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, ArrowUpRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { PostMeta } from "@/lib/posts"
import type { TocHeading } from "@/lib/markdown"

let mermaidInitialized = false

function useMermaid(
  containerRef: React.RefObject<HTMLDivElement | null>,
  htmlContent: string,
  onDiagramClick: (svgHtml: string) => void
) {
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
            primaryColor: "#0b7a6e",
            primaryTextColor: "#e6edf3",
            primaryBorderColor: "#3ddbc8",
            lineColor: "#9aa7b4",
            secondaryColor: "#0f151c",
            tertiaryColor: "#0b0f14",
            edgeLabelBackground: "#0f151c",
            clusterBkg: "#0f151c",
            titleColor: "#e6edf3",
            nodeTextColor: "#e6edf3",
            fontFamily: "'Geist', sans-serif",
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
          block.style.cursor = "zoom-in"
          block.onclick = () => {
            onDiagramClick(block.innerHTML)
          }
        } catch (err) {
          console.error("Mermaid render error:", err)
          block.innerHTML = `<pre style="color:hsl(0 80% 60%);font-size:0.75rem;white-space:pre-wrap;text-align:left">${String(err)}</pre>`
        }
      }
    }

    render()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [htmlContent])
}

function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("")
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return

    setActiveId(id)
    isScrollingRef.current = true

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)

    const top = el.getBoundingClientRect().top + window.scrollY - 32
    window.scrollTo({ top, behavior: "smooth" })

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false
    }, 800)
  }, [])

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
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
          if (isScrollingRef.current) return

          if (entry.isIntersecting) {
            visibleIds.add(id)
          } else {
            visibleIds.delete(id)
          }
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
    <aside aria-label="On this page" className="lg:sticky lg:top-8 lg:self-start">
      <p className="text-xs font-mono uppercase tracking-[0.05em] text-primary mb-3">
        On this page
      </p>
      <ul className="space-y-2 border-l border-border pl-3">
        {headings.map((heading) => {
          const isActive = activeId === heading.id
          return (
            <li key={heading.id} className={heading.level === 3 ? "pl-3" : ""}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`block text-xs leading-snug py-1 transition-colors duration-200 ${
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

const BlogPostHtml = memo(
  ({
    htmlContent,
    onDiagramClick,
  }: {
    htmlContent: string
    onDiagramClick: (svgHtml: string) => void
  }) => {
    const bodyRef = useRef<HTMLDivElement>(null)
    useMermaid(bodyRef, htmlContent, onDiagramClick)

    return (
      <article
        ref={bodyRef}
        className="prose"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    )
  }
)
BlogPostHtml.displayName = "BlogPostHtml"

interface PostClientProps {
  post: PostMeta
  htmlContent: string
  headings: TocHeading[]
  prevPost: PostMeta | null
  nextPost: PostMeta | null
}

export default function PostClient({
  post,
  htmlContent,
  headings,
  prevPost,
  nextPost,
}: PostClientProps) {
  const [modalSvg, setModalSvg] = useState<string | null>(null)

  useEffect(() => {
    if (!modalSvg) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalSvg(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [modalSvg])

  return (
    <>
      <Header />

      <main className="py-12 md:py-20 px-5 md:px-8 min-h-screen">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-10 pb-8 border-b border-border max-w-[720px]">
            <Link
              href="/writing"
              className="inline-flex items-center gap-2 min-h-[44px] text-xs font-mono uppercase tracking-[0.05em] text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="size-3.5" />
              All articles
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-mono text-primary border border-border rounded bg-card"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-[32px] md:text-[48px] font-bold tracking-[-0.03em] text-foreground leading-[1.1] mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {post.date}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {post.readTime}
              </span>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,720px)_200px] items-start">
            <div className="min-w-0">
              <BlogPostHtml htmlContent={htmlContent} onDiagramClick={setModalSvg} />

              <div className="mt-14 pt-8 border-t border-border">
                <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prevPost ? (
                    <Link
                      href={`/writing/${prevPost.slug}`}
                      className="group flex flex-col gap-1 p-4 rounded-lg border border-border bg-card hover:border-primary transition-colors duration-200"
                    >
                      <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        <ArrowLeft className="size-3" />
                        Previous
                      </span>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {prevPost.title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {nextPost ? (
                    <Link
                      href={`/writing/${nextPost.slug}`}
                      className="group flex flex-col items-end gap-1 p-4 rounded-lg border border-border bg-card hover:border-primary transition-colors duration-200"
                    >
                      <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                        Next
                        <ArrowUpRight className="size-3" />
                      </span>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors text-right line-clamp-2">
                        {nextPost.title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                </nav>
              </div>
            </div>

            <TableOfContents headings={headings} />
          </div>
        </div>
      </main>

      <Footer />

      {modalSvg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setModalSvg(null)}
        >
          <button
            type="button"
            onClick={() => setModalSvg(null)}
            className="absolute top-6 right-6 min-w-[44px] min-h-[44px] p-2.5 rounded-md border border-border bg-card text-foreground hover:border-primary transition-colors cursor-pointer z-50 flex items-center justify-center"
            aria-label="Close diagram"
          >
            ✕
          </button>

          <div
            className="bg-[#0b0f14] border border-[#1f2933] p-6 md:p-10 rounded-lg max-w-5xl w-full max-h-[85vh] overflow-auto flex items-center justify-center relative cursor-default"
            onClick={(e) => e.stopPropagation()}
            data-mermaid-modal
            dangerouslySetInnerHTML={{ __html: modalSvg }}
          />
        </div>
      )}
    </>
  )
}
