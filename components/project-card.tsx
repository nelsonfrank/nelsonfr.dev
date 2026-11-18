"use client"

import Link from "next/link"
import Image from "next/image"
import type { Project } from "@/lib/projects"
import { captureEvent } from "@/lib/analytics"

const EXISTING_IMAGES = new Set([
  "/projects/city-connector-architecture.jpg",
  "/projects/necta-explorer.png",
])

export function ProjectCard({
  project,
  featured = false,
  dataCategories,
}: {
  project: Project
  featured?: boolean
  dataCategories?: string
}) {
  const hasRealImage = Boolean(project.image && EXISTING_IMAGES.has(project.image))
  const hasLiveUrl = Boolean(project.liveUrl && project.liveUrl !== "#")
  const sourceLinks =
    project.githubLinks && project.githubLinks.length > 0
      ? project.githubLinks
      : project.githubUrl && project.githubUrl !== "#"
        ? [{ label: "Source", url: project.githubUrl }]
        : []

  const tintClass =
    project.tint === "warm"
      ? "warm"
      : project.tint === "indigo"
        ? "indigo"
        : ""
  const frameClass = project.frameType === "phone" ? "frame ph" : "frame"

  return (
    <article
      className={`pj${featured ? " big" : ""}`}
      data-c={dataCategories ?? project.categories.map((c) => c.toLowerCase()).join(" ")}
    >
      <div className={`shot${tintClass ? ` ${tintClass}` : ""}`}>
        <span className="status-badge">{project.statusBadge}</span>
        <div className={frameClass} aria-hidden="true">
          <div className={`frame-screen${hasRealImage ? " has-img" : ""}`}>
            {hasRealImage ? (
              <Image
                src={project.image}
                alt=""
                width={640}
                height={400}
                sizes="(max-width: 820px) 80vw, 400px"
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <>
                <div>
                  <span className="mock-bar hl" />
                  <span className="mock-bar" />
                  <span className="mock-bar" style={{ width: "78%" }} />
                </div>
                {project.diagram ? (
                  <div className="mock-nodes">
                    <span className="mock-node">{project.diagram.nodes[0]}</span>
                    <span className="mock-node mid">{project.diagram.nodes[1]}</span>
                    <span className="mock-node">{project.diagram.nodes[2]}</span>
                  </div>
                ) : (
                  <div>
                    <span className="mock-bar lg" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="pj-body">
        <p className="pj-role">
          {project.role}
          {project.year ? `, ${project.year}` : ""}
        </p>

        <p className="pj-res">
          {project.resultHeadline.prefix}
          <b>{project.resultHeadline.highlight}</b>
          {project.resultHeadline.suffix}
        </p>

        <h3>
          <Link
            href={`/projects/${project.slug}`}
            onClick={() =>
              captureEvent("project_card_clicked", {
                project_title: project.title,
                slug: project.slug,
              })
            }
          >
            {project.title}
          </Link>
        </h3>

        <p className="pj-desc">{project.description}</p>

        <div>
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="tag">
              {tech}
            </span>
          ))}
        </div>

        {(hasLiveUrl || sourceLinks.length > 0) && (
          <div className="pj-sec">
            {hasLiveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  captureEvent("project_live_website_visited", {
                    project_title: project.title,
                    live_url: project.liveUrl,
                  })
                }
              >
                Live demo
              </a>
            )}
            {sourceLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  captureEvent("project_source_code_viewed", {
                    project_title: project.title,
                    github_url: link.url,
                    repo_label: link.label,
                  })
                }
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
