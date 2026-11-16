"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { projects } from "@/lib/projects"
import { captureEvent } from "@/lib/analytics"

export function Projects() {
  return (
    <section id="work" className="py-16 md:py-20 px-5 md:px-8 border-t border-border">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex items-baseline justify-between gap-4 mb-10">
          <h2 className="text-[28px] font-semibold tracking-tight text-foreground">
            Selected work
          </h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-mono text-primary hover:underline"
          >
            All projects
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              onClick={() =>
                captureEvent("project_card_clicked", {
                  project_title: project.title,
                  slug: project.slug,
                })
              }
              className="group flex flex-col justify-between rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors duration-200"
            >
              <div className="space-y-3">
                <span className="block text-xs font-mono uppercase tracking-[0.05em] text-muted-foreground">
                  {project.category}
                </span>
                <h3 className="text-[20px] font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-border">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono text-muted-foreground"
                  >
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
