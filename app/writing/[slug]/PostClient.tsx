"use client"

import { useEffect, useRef, useState, memo } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { NewsletterPanel } from "@/components/newsletter-panel"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { useMermaid } from "@/hooks/use-mermaid"
import type { PostMeta } from "@/lib/posts"
import type { Project } from "@/lib/projects"
import type { TocHeading } from "@/lib/markdown"

function renderHighlightedTitle(title: string, highlightPhrase?: string) {
  if (!highlightPhrase) {
    const words = title.split(" ")
    if (words.length <= 2) {
      return <span className="hl-word">{title}</span>
    }
    const lastTwo = words.slice(-2).join(" ")
    const prefix = words.slice(0, -2).join(" ")
    return (
      <>
        {prefix} <span className="hl-word">{lastTwo}</span>
      </>
    )
  }

  const idx = title.toLowerCase().indexOf(highlightPhrase.toLowerCase())
  if (idx === -1) {
    return <span className="hl-word">{title}</span>
  }

  const before = title.slice(0, idx)
  const match = title.slice(idx, idx + highlightPhrase.length)
  const after = title.slice(idx + highlightPhrase.length)

  return (
    <>
      {before}
      <span className="hl-word">{match}</span>
      {after}
    </>
  )
}

const BlogPostHtml = memo(
  ({
    htmlContent,
    articleRef,
    onDiagramClick,
  }: {
    htmlContent: string
    articleRef: React.RefObject<HTMLElement | null>
    onDiagramClick: (svgHtml: string) => void
  }) => {
    useMermaid(articleRef, htmlContent, onDiagramClick)

    return (
      <article
        ref={articleRef}
        id="art"
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
  const articleRef = useRef<HTMLElement | null>(null)
  const progressBarRef = useRef<HTMLDivElement | null>(null)
  const [activeId, setActiveId] = useState<string>(headings[0]?.id ?? "")
  const [copied, setCopied] = useState(false)
  const [modalSvg, setModalSvg] = useState<string | null>(null)

  useEffect(() => {
    function updateProgressAndSpy() {
      const art = articleRef.current
      const bar = progressBarRef.current
      if (art && bar) {
        const rect = art.getBoundingClientRect()
        const h = Math.max(1, rect.height - window.innerHeight * 0.6)
        const p = Math.min(
          1,
          Math.max(0, (-rect.top + window.innerHeight * 0.2) / h)
        )
        bar.style.transform = `scaleX(${p})`
      }

      if (headings.length > 0) {
        let cur = headings[0].id
        for (const h of headings) {
          const el = document.getElementById(h.id)
          if (el && el.getBoundingClientRect().top < window.innerHeight * 0.35) {
            cur = h.id
          }
        }
        setActiveId(cur)
      }
    }

    window.addEventListener("scroll", updateProgressAndSpy, { passive: true })
    window.addEventListener("resize", updateProgressAndSpy)
    updateProgressAndSpy()

    return () => {
      window.removeEventListener("scroll", updateProgressAndSpy)
      window.removeEventListener("resize", updateProgressAndSpy)
    }
  }, [headings])

  useEffect(() => {
    if (!modalSvg) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalSvg(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [modalSvg])

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

  const shareUrl = `https://nelsonfrank.dev/writing/${post.slug}`
  const shareText = encodeURIComponent(`${post.title} by Nelson Frank`)
  const encodedUrl = encodeURIComponent(shareUrl)

  return (
    <>
      <div className="reading-progress-track" aria-hidden="true">
        <div ref={progressBarRef} id="bar" className="reading-progress-bar" />
      </div>

      <Header />

      <main id="main-content">
        <div className="wrap">
          <header className="post-head">
            <Link className="back-link" href="/writing">
              ← Back to all posts
            </Link>

            <h1>{renderHighlightedTitle(post.title, post.highlightPhrase)}</h1>

            <p className="post-dek">{post.excerpt}</p>

            <div className="byline">
              <div className="avatar-circle" aria-hidden="true">
                NF
              </div>
              <div>
                <b>Nelson Frank</b>
                {post.date} · {post.readTime}
              </div>
            </div>

            {post.tags.length > 0 && (
              <div style={{ marginTop: "1.2rem" }}>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    className="tag"
                    href={`/writing?topic=${encodeURIComponent(tag.toLowerCase())}`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div
            className="post-cover"
            role="img"
            aria-label={`Visual overview for ${post.title}`}
          >
            <div className="post-cover-inner" aria-hidden="true">
              <div>
                <span className="mock-bar hl" />
                <span className="mock-bar" />
                <span className="mock-bar" style={{ width: "68%" }} />
              </div>
              <div className="mock-nodes">
                {post.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={tag}
                    className={`mock-node${idx === 1 ? " mid" : ""}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="post-layout">
            {headings.length > 0 && (
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
            )}

            <div>
              <BlogPostHtml
                htmlContent={htmlContent}
                articleRef={articleRef}
                onDiagramClick={setModalSvg}
              />

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

              <div className="author-box">
                <div className="avatar-circle" aria-hidden="true">
                  NF
                </div>
                <div>
                  <b>Nelson Frank</b>
                  Full-stack software engineer in Dar es Salaam. I write about
                  authentication, distributed backend services, and TypeScript.{" "}
                  <Link href="/experience">More about me</Link>
                </div>
              </div>

              {relatedProject && (
                <div style={{ margin: "2rem 0" }}>
                  <article className="next-card">
                    <div>
                      <small>Related case study</small>
                      <h3>
                        <Link href={`/projects/${relatedProject.slug}`}>
                          {relatedProject.title}
                        </Link>
                      </h3>
                      <p>{relatedProject.description}</p>
                    </div>
                    <span className="tag">Case study</span>
                  </article>
                </div>
              )}

              <NewsletterPanel compact />
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <section className="related-sec">
              <h2>Keep reading</h2>
              <div className="related-grid">
                {relatedPosts.map((rel) => (
                  <article key={rel.slug} className="related-card">
                    <small>
                      {rel.date} · {rel.readTime}
                    </small>
                    <h3>
                      <Link href={`/writing/${rel.slug}`}>{rel.title}</Link>
                    </h3>
                    <p>{rel.excerpt}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <Contact />
      </main>

      <Footer />

      {modalSvg && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "var(--glass)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={() => setModalSvg(null)}
        >
          <button
            type="button"
            onClick={() => setModalSvg(null)}
            className="btn s"
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              background: "var(--surface)",
            }}
            aria-label="Close diagram"
          >
            Close
          </button>
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: "14px",
              padding: "1.5rem",
              maxWidth: "64rem",
              width: "100%",
              maxHeight: "85vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
            data-mermaid-modal
            dangerouslySetInnerHTML={{ __html: modalSvg }}
          />
        </div>
      )}
    </>
  )
}
