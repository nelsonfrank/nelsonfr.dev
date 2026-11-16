"use client"

import { useEffect, useRef, useState, useCallback, memo } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, ArrowUpRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { PostMeta } from "@/lib/posts"
import type { Project } from "@/lib/projects"
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
    <aside
      aria-label="On this page"
      className="hidden lg:block lg:w-[200px] lg:sticky lg:top-8 lg:self-start shrink-0"
    >
      <p className="eyebrow mb-3">On this page</p>
      <ul className="space-y-1.5 border-l border-border pl-3">
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
  relatedProject: Project | null
  relatedPosts: PostMeta[]
}

export default function PostClient({
  post,
  htmlContent,
  headings,
  relatedProject,
  relatedPosts,
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

      <main id="main-content" className="py-12 md:py-20 min-h-screen">
        <div className="page-container">
          <div className="mb-10 pb-8 border-b border-border max-w-[720px]">
            <Link
              href="/writing"
              className="inline-flex items-center gap-2 min-h-[44px] text-xs font-mono uppercase tracking-[0.05em] text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              <span>All articles</span>
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 meta-mono border border-border rounded bg-card"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] text-foreground leading-[1.08] mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 meta-mono">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" aria-hidden="true" />
                {post.date}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden="true" />
                {post.readTime}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-12">
            <div className="w-full max-w-[720px] min-w-0">
              <BlogPostHtml htmlContent={htmlContent} onDiagramClick={setModalSvg} />

              <section
                aria-label="Related content"
                className="mt-14 pt-8 border-t border-border space-y-8"
              >
                {relatedProject && (
                  <div className="space-y-3">
                    <p className="eyebrow">Related project</p>
                    <Link
                      href={`/projects/${relatedProject.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-md border border-border bg-card p-5 hover:border-primary transition-colors duration-200 min-h-[44px]"
                    >
                      <div className="space-y-1 min-w-0">
                        <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {relatedProject.title}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {relatedProject.description}
                        </p>
                      </div>
                      <ArrowUpRight
                        className="size-5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                )}

                {relatedPosts.length > 0 && (
                  <div className="space-y-3">
                    <p className="eyebrow">Related articles</p>
                    <div className="divide-y divide-border border-t border-b border-border">
                      {relatedPosts.map((related) => (
                        <Link
                          key={related.slug}
                          href={`/writing/${related.slug}`}
                          className="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-6 py-4 min-h-[44px] transition-colors duration-200"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 min-w-0">
                            <time className="meta-mono shrink-0 sm:w-36">
                              {related.date}
                            </time>
                            <span className="text-[18px] font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                              {related.title}
                            </span>
                          </div>
                          {related.tags[0] && (
                            <span className="meta-mono shrink-0">
                              {related.tags[0]}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </section>
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
