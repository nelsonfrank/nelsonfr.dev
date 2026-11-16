"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink, ArrowUpRight, FolderGit2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArchDiagram } from "@/components/arch-diagram"
import { captureEvent } from "@/lib/analytics"
import type { Project } from "@/lib/projects"
import type { PostMeta } from "@/lib/posts"
import type { TocHeading } from "@/lib/markdown"

let mermaidInitialized = false

function useMermaid(containerRef: React.RefObject<HTMLElement | null>, htmlContent: string) {
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
          const id = `project-mermaid-svg-${Date.now()}-${i}`
          const { svg } = await mermaid.render(id, definition)
          if (cancelled) break
          block.innerHTML = svg
        } catch (err) {
          console.error("Mermaid render error:", err)
        }
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [containerRef, htmlContent])
}

function CaseStudyToc({ headings }: { headings: TocHeading[] }) {
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

    const top = el.getBoundingClientRect().top + window.scrollY - 24
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
          rootMargin: "-60px 0px -65% 0px",
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
            <li key={heading.id} className={heading.level === 3 ? "pl-2.5" : ""}>
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

interface ProjectDetailsClientProps {
  project: Project
  htmlContent: string
  headings: TocHeading[]
  relatedArticles: PostMeta[]
  nextProject: Project
}

export default function ProjectDetailsClient({
  project,
  htmlContent,
  headings,
  relatedArticles,
  nextProject,
}: ProjectDetailsClientProps) {
  const articleRef = useRef<HTMLElement>(null)
  useMermaid(articleRef, htmlContent)

  const hasLiveUrl = Boolean(project.liveUrl && project.liveUrl !== "#")
  const hasGithubUrl = Boolean(project.githubUrl && project.githubUrl !== "#")
  const hasLinks = hasLiveUrl || hasGithubUrl
  const hasTldr = Boolean(project.problem || project.result || project.myPart)

  const tocHeadings: TocHeading[] = [
    ...(project.diagram ? [{ id: "architecture", text: "Architecture", level: 2 }] : []),
    ...headings,
  ]

  return (
    <>
      <Header />

      <main id="main-content" className="py-12 md:py-20 min-h-screen">
        <div className="page-container">
          <div className="flex flex-col lg:flex-row lg:items-start gap-12">
            {/* Main Article Column (max 720px) */}
            <div className="w-full max-w-[720px] min-w-0 space-y-10">
              {/* 1. Back link "All projects", H1 (48px), one-sentence summary */}
              <div className="space-y-4">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 min-h-[44px] text-xs font-mono uppercase tracking-[0.05em] text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="size-3.5" aria-hidden="true" />
                  <span>All projects</span>
                </Link>

                <h1 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.08] text-foreground">
                  {project.title}
                </h1>

                <p className="text-[17px] md:text-[19px] leading-[1.6] text-muted-foreground">
                  {project.description}
                </p>
              </div>

              {/* 2. Metadata strip (up to 4 columns, hairline top and bottom): Role | Year | Stack | Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 border-t border-b border-border py-5">
                {project.role && (
                  <div className="space-y-1">
                    <span className="block meta-mono uppercase tracking-[0.05em]">Role</span>
                    <span className="block text-sm text-foreground font-medium">
                      {project.role}
                    </span>
                  </div>
                )}

                {project.year && (
                  <div className="space-y-1">
                    <span className="block meta-mono uppercase tracking-[0.05em]">Year</span>
                    <span className="block text-sm font-mono text-foreground">
                      {project.year}
                    </span>
                  </div>
                )}

                {project.technologies.length > 0 && (
                  <div className={`space-y-1.5 ${!project.role && !project.year ? "sm:col-span-2 md:col-span-3" : ""}`}>
                    <span className="block meta-mono uppercase tracking-[0.05em]">Stack</span>
                    <div className="flex flex-wrap gap-x-2.5 gap-y-1">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="text-xs font-mono text-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hasLinks && (
                  <div className="space-y-1.5">
                    <span className="block meta-mono uppercase tracking-[0.05em]">Links</span>
                    <div className="flex flex-wrap items-center gap-3">
                      {hasLiveUrl && (
                        <Link
                          href={project.liveUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            captureEvent("project_live_website_visited", {
                              project_title: project.title,
                              live_url: project.liveUrl,
                            })
                          }
                          className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-0 text-xs font-mono text-primary hover:underline"
                        >
                          <span>Live</span>
                          <ExternalLink className="size-3.5" aria-hidden="true" />
                        </Link>
                      )}
                      {hasGithubUrl && (
                        <Link
                          href={project.githubUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            captureEvent("project_source_code_viewed", {
                              project_title: project.title,
                              github_url: project.githubUrl,
                            })
                          }
                          className="inline-flex items-center gap-1.5 min-h-[44px] sm:min-h-0 text-xs font-mono text-primary hover:underline"
                        >
                          <span>GitHub</span>
                          <Github className="size-3.5" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. TL;DR panel (bordered, surface background) */}
              {hasTldr && (
                <section
                  aria-label="TL;DR summary"
                  className="rounded-md border border-border bg-card p-5 sm:p-6 space-y-3"
                >
                  <p className="eyebrow">TL;DR</p>
                  <dl className="space-y-2 text-sm leading-relaxed">
                    {project.problem && (
                      <div className="grid sm:grid-cols-[90px_1fr] gap-1 sm:gap-3">
                        <dt className="meta-mono font-medium text-foreground">Problem</dt>
                        <dd className="text-muted-foreground">{project.problem}</dd>
                      </div>
                    )}
                    {project.result && (
                      <div className="grid sm:grid-cols-[90px_1fr] gap-1 sm:gap-3">
                        <dt className="meta-mono font-medium text-foreground">Result</dt>
                        <dd className="text-muted-foreground">{project.result}</dd>
                      </div>
                    )}
                    {project.myPart && (
                      <div className="grid sm:grid-cols-[90px_1fr] gap-1 sm:gap-3">
                        <dt className="meta-mono font-medium text-foreground">My part</dt>
                        <dd className="text-muted-foreground">{project.myPart}</dd>
                      </div>
                    )}
                  </dl>
                </section>
              )}

              {/* 4. Architecture (early on the page) */}
              {project.diagram && (
                <section id="architecture" className="space-y-3">
                  <h2 className="text-[28px] font-semibold tracking-tight text-foreground">
                    Architecture
                  </h2>
                  <div className="rounded-md border border-border bg-card p-4 sm:p-6">
                    <ArchDiagram
                      nodes={project.diagram.nodes}
                      className="w-full max-w-[480px] h-auto aspect-[20/3] block text-foreground select-none"
                    />
                  </div>
                </section>
              )}

              {/* 5. Key decisions (structured frontmatter if present) */}
              {project.decisions && project.decisions.length > 0 && (
                <section id="key-decisions" className="space-y-4">
                  <h2 className="text-[28px] font-semibold tracking-tight text-foreground">
                    Key decisions
                  </h2>
                  <ol className="divide-y divide-border border-t border-b border-border">
                    {project.decisions.map((item, idx) => (
                      <li
                        key={idx}
                        className="py-4 grid gap-2 sm:grid-cols-[32px_1fr]"
                      >
                        <span className="meta-mono text-primary font-medium">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="space-y-1 text-sm">
                          <p className="font-semibold text-foreground">{item.decision}</p>
                          <p className="text-muted-foreground">{item.tradeoff}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* 6. Results (structured frontmatter if present) */}
              {project.results && project.results.length > 0 && (
                <section id="results" className="space-y-3">
                  <h2 className="text-[28px] font-semibold tracking-tight text-foreground">
                    Results
                  </h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {project.results.map((res, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-2 size-1.5 rounded-full bg-primary shrink-0" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Case Study Markdown Body */}
              {htmlContent ? (
                <article
                  ref={articleRef}
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : (
                <div className="py-16 text-center border border-dashed border-border rounded-md bg-card">
                  <FolderGit2 className="size-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">
                    Detailed case study in preparation.
                  </p>
                </div>
              )}

              {/* 7. Related: link to a related article and the next project */}
              <section
                aria-label="Related content"
                className="pt-8 border-t border-border space-y-6"
              >
                {relatedArticles.length > 0 && (
                  <div className="space-y-3">
                    <p className="eyebrow">Related article</p>
                    <div className="divide-y divide-border border-t border-b border-border">
                      {relatedArticles.map((article) => (
                        <Link
                          key={article.slug}
                          href={`/writing/${article.slug}`}
                          className="group flex items-baseline justify-between gap-4 py-3.5 min-h-[44px]"
                        >
                          <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                            {article.title}
                          </span>
                          <span className="meta-mono shrink-0 inline-flex items-center gap-1 text-primary">
                            Read article
                            <ArrowUpRight className="size-3.5" aria-hidden="true" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="eyebrow">Next project</p>
                  <Link
                    href={`/projects/${nextProject.slug}`}
                    onClick={() =>
                      captureEvent("next_project_clicked", {
                        current_project: project.title,
                        next_project: nextProject.title,
                        next_slug: nextProject.slug,
                      })
                    }
                    className="group flex items-center justify-between gap-4 rounded-md border border-border bg-card p-5 hover:border-primary transition-colors duration-200 min-h-[44px]"
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {nextProject.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {nextProject.description}
                      </p>
                    </div>
                    <ArrowUpRight
                      className="size-5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </section>
            </div>

            {/* Sticky "On this page" Aside (~200px) */}
            <CaseStudyToc headings={tocHeadings} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
