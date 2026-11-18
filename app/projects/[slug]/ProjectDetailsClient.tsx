"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { useMermaid } from "@/hooks/use-mermaid"
import { captureEvent } from "@/lib/analytics"
import type { Project } from "@/lib/projects"
import type { PostMeta } from "@/lib/posts"

const EXISTING_IMAGES = new Set([
  "/projects/city-connector-architecture.jpg",
  "/projects/necta-explorer.png",
])

interface ProjectDetailsClientProps {
  project: Project
  htmlContent: string
  relatedArticles: PostMeta[]
  nextProject: Project
}

export default function ProjectDetailsClient({
  project,
  htmlContent,
  relatedArticles,
  nextProject,
}: ProjectDetailsClientProps) {
  const articleRef = useRef<HTMLElement>(null)
  useMermaid(articleRef, htmlContent)

  const hasLiveUrl = Boolean(project.liveUrl && project.liveUrl !== "#")
  const githubLinks =
    project.githubLinks && project.githubLinks.length > 0
      ? project.githubLinks
      : project.githubUrl && project.githubUrl !== "#"
        ? [{ label: "View source", url: project.githubUrl }]
        : []

  const stageImage =
    project.architectureImage && EXISTING_IMAGES.has(project.architectureImage)
      ? project.architectureImage
      : project.image && EXISTING_IMAGES.has(project.image)
        ? project.image
        : null

  return (
    <>
      <Header />

      <main id="main-content">
        <div className="wrap">
          <header className="case-head">
            <Link className="back-link" href="/projects">
              ← Back to all work
            </Link>

            <h1>
              {project.resultHeadline.prefix}
              <span className="hl-word">
                {project.resultHeadline.highlight}
              </span>
              {project.resultHeadline.suffix}
            </h1>

            <p className="case-dek">{project.description}</p>

            {(hasLiveUrl || githubLinks.length > 0) && (
              <div className="cta-row">
                {hasLiveUrl && (
                  <a
                    className="btn p"
                    href={project.liveUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      captureEvent("project_live_website_visited", {
                        project_title: project.title,
                        live_url: project.liveUrl,
                      })
                    }
                  >
                    Open live demo
                  </a>
                )}
                {githubLinks.map((repo, idx) => (
                  <a
                    key={repo.url}
                    className={!hasLiveUrl && idx === 0 ? "btn p" : "btn s"}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      captureEvent("project_source_code_viewed", {
                        project_title: project.title,
                        github_url: repo.url,
                        repo_label: repo.label,
                      })
                    }
                  >
                    {githubLinks.length === 1 ? "View source" : repo.label}
                  </a>
                ))}
              </div>
            )}

            <dl className="facts-strip">
              {project.role && (
                <div>
                  <dt>Role</dt>
                  <dd>
                    <Link
                      href="/experience"
                      style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                    >
                      {project.role}
                    </Link>
                  </dd>
                </div>
              )}
              {(project.duration || project.year) && (
                <div>
                  <dt>Year</dt>
                  <dd>{project.duration ?? project.year}</dd>
                </div>
              )}
              {project.usersOrScale && (
                <div>
                  <dt>Users &amp; scale</dt>
                  <dd>{project.usersOrScale}</dd>
                </div>
              )}
              {project.technologies.length > 0 && (
                <div>
                  <dt>Stack</dt>
                  <dd>{project.technologies.slice(0, 6).join(", ")}</dd>
                </div>
              )}
            </dl>
          </header>

          <div
            className="visual-stage"
            role="img"
            aria-label={
              stageImage
                ? `Architecture and screens of ${project.title}`
                : `System preview of ${project.title} ([ADD: real product screenshot])`
            }
          >
            <div className="stage-browser">
              {stageImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={stageImage}
                    alt={`${project.title} visual preview`}
                    width={1024}
                    height={560}
                    priority
                    sizes="(max-width: 820px) 90vw, 680px"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ) : (
                <div className="frame-screen">
                  <div>
                    <span className="mock-bar hl" />
                    <span className="mock-bar" />
                    <span className="mock-bar" style={{ width: "70%" }} />
                  </div>
                  {project.diagram && (
                    <div className="mock-nodes">
                      <span className="mock-node">
                        {project.diagram.nodes[0]}
                      </span>
                      <span className="mock-node mid">
                        {project.diagram.nodes[1]}
                      </span>
                      <span className="mock-node">
                        {project.diagram.nodes[2]}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="stage-phone" aria-hidden="true">
              <span className="mock-bar hl" />
              <span className="mock-bar" />
              <span className="mock-bar" />
              <span className="mock-bar" />
              <span className="mock-bar hl" />
              <span className="mock-bar" />
            </div>
          </div>

          {project.problem && (
            <section id="problem" className="site-section">
              <div className="split-sec">
                <h2>The problem</h2>
                <div className="serif-copy">
                  <p>{project.problem}</p>
                  {project.userQuote && (
                    <div className="quote-block">
                      “{project.userQuote.quote}”
                      <small>{project.userQuote.attribution}</small>
                    </div>
                  )}
                  {project.myPart && (
                    <p>
                      <strong>My part:</strong> {project.myPart}
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}

          {project.timeline && project.timeline.length > 0 && (
            <section id="process" className="site-section">
              <div className="split-sec">
                <h2>How I worked</h2>
                <ol className="timeline-steps">
                  {project.timeline.map((step, i) => (
                    <li key={i}>
                      <b>{step.title}</b>
                      <small>{step.period}</small>
                      <p>{step.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          )}

          {project.decisions && project.decisions.length > 0 && (
            <section id="decisions" className="site-section">
              <div className="split-sec">
                <h2>Key decisions</h2>
                <div className="decisions-grid">
                  {project.decisions.map((item, i) => (
                    <div key={i} className="surface-card">
                      <h3>{item.decision}</h3>
                      {item.summary && <p>{item.summary}</p>}
                      <p className="vs">
                        <b>Tradeoff</b>
                        {item.tradeoff}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {project.screens && project.screens.length > 0 && (
            <section id="screens" className="site-section">
              <div className="split-sec">
                <h2>The product</h2>
                <div className="screens-grid">
                  {project.screens.map((scr, i) => (
                    <figure key={i} className="screen-fig">
                      <div className="ph-mock" aria-hidden="true">
                        <span className="mock-bar hl" />
                        <span className="mock-bar" />
                        <span className="mock-bar" />
                        <span className="mock-bar" style={{ width: "75%" }} />
                      </div>
                      <figcaption>{scr.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          )}

          {project.outcomeCards && project.outcomeCards.length > 0 && (
            <section id="results" className="site-section">
              <div className="split-sec">
                <h2>Results</h2>
                <div className="results-grid">
                  {project.outcomeCards.map((card, i) => (
                    <div key={i} className="surface-card">
                      <b>{card.metric}</b>
                      <p>{card.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {project.learned && (
            <section id="learned" className="site-section">
              <div className="split-sec">
                <h2>What I learned</h2>
                <div className="serif-copy">
                  <p>{project.learned.summary}</p>
                  {project.learned.bullets.length > 0 && (
                    <ul>
                      {project.learned.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          )}

          {htmlContent && (
            <section id="deep-dive" className="site-section">
              <div className="split-sec">
                <h2>Technical deep dive</h2>
                <article
                  ref={articleRef}
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            </section>
          )}

          {relatedArticles.length > 0 && (
            <section id="related-writing" className="site-section">
              <div className="split-sec">
                <h2>Related writing</h2>
                <div>
                  {relatedArticles.map((article) => (
                    <article key={article.slug} className="post-row">
                      <time>{article.date}</time>
                      <div>
                        <h3>
                          <Link href={`/writing/${article.slug}`}>
                            {article.title}
                          </Link>
                        </h3>
                        <p>{article.excerpt}</p>
                      </div>
                      <span className="rt">{article.readTime}</span>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="site-section" style={{ borderTop: 0, paddingTop: "1rem" }}>
            <article className="next-card">
              <div>
                <small>Next project</small>
                <h3>
                  <Link
                    href={`/projects/${nextProject.slug}`}
                    onClick={() =>
                      captureEvent("next_project_clicked", {
                        current_project: project.title,
                        next_project: nextProject.title,
                        next_slug: nextProject.slug,
                      })
                    }
                  >
                    {nextProject.title}
                  </Link>
                </h3>
                <p>{nextProject.description}</p>
              </div>
              {nextProject.technologies[0] && (
                <span className="tag">{nextProject.technologies[0]}</span>
              )}
            </article>
          </section>
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  )
}
