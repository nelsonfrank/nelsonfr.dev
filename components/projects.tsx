"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { projects, SELECTED_WORK_SLUGS, type Project } from "@/lib/projects"
import { ArchDiagram } from "@/components/arch-diagram"
import { captureEvent } from "@/lib/analytics"

export function Projects() {
  const selectedProjects: Project[] = SELECTED_WORK_SLUGS.map((slug) =>
    projects.find((p) => p.slug === slug)
  ).filter((p): p is Project => Boolean(p))

  return (
    <section id="work" className="py-16 md:py-20 border-t border-border">
      <div className="page-container">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <h2 className="text-[28px] font-semibold tracking-tight text-foreground">
            Selected work
          </h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-mono uppercase tracking-[0.05em] text-primary hover:underline"
          >
            <span>All projects</span>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {selectedProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              onClick={() =>
                captureEvent("project_card_clicked", {
                  project_title: project.title,
                  slug: project.slug,
                })
              }
              className="group flex flex-col justify-between rounded-md border border-border bg-card p-5 hover:border-primary transition-colors duration-200"
            >
              <div className="space-y-4">
                {project.diagram && (
                  <div className="rounded border border-border bg-background p-2.5 overflow-hidden">
                    <ArchDiagram nodes={project.diagram.nodes} />
                  </div>
                )}

                {project.category && (
                  <span className="block meta-mono uppercase tracking-[0.05em]">
                    {project.category}
                  </span>
                )}

                <h3 className="text-[20px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors duration-200">
                  {project.title}
                </h3>

                <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  <p className="line-clamp-2">{project.description}</p>
                  {project.outcome && (
                    <p className="text-foreground/90 font-medium">
                      Outcome: {project.outcome}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-x-2.5 gap-y-1 pt-4 mt-5 border-t border-border">
                {project.technologies.map((tech) => (
                  <span key={tech} className="meta-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
