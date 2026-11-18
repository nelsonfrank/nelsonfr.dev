"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { projects, SELECTED_WORK_SLUGS, type Project } from "@/lib/projects"
import { ArchDiagram } from "@/components/arch-diagram"
import { captureEvent } from "@/lib/analytics"

const BLUEPRINT_GRID_STYLE = {
  backgroundImage:
    "radial-gradient(color-mix(in srgb, var(--muted-foreground) 22%, transparent) 1px, transparent 1px)",
  backgroundSize: "12px 12px",
}

function TechPills({
  technologies,
  limit = 6,
}: {
  technologies: string[]
  limit?: number
}) {
  const visible = technologies.slice(0, limit)
  const extra = technologies.length - visible.length

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {visible.map((tech) => (
        <span
          key={tech}
          className="px-2 py-0.5 text-[11px] font-mono rounded border border-border bg-background/80 text-muted-foreground group-hover:border-border-strong transition-colors"
        >
          {tech}
        </span>
      ))}
      {extra > 0 && (
        <span className="px-1.5 py-0.5 text-[11px] font-mono rounded border border-dashed border-border text-muted-foreground">
          +{extra}
        </span>
      )}
    </div>
  )
}

function FlagshipBentoCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const formattedIndex = String(index + 1).padStart(2, "0")

  return (
    <Link
      href={`/projects/${project.slug}`}
      onClick={() =>
        captureEvent("project_card_clicked", {
          project_title: project.title,
          slug: project.slug,
          position: index + 1,
        })
      }
      className="group rounded-md border border-border bg-card overflow-hidden hover:border-primary transition-all duration-200 grid grid-cols-1 lg:grid-cols-12"
    >
      {/* Left Column: Narrative & Impact (7 cols) */}
      <div className="lg:col-span-7 p-6 md:p-7 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-[0.05em] bg-primary/10 text-primary border border-primary/25 font-medium">
              Flagship Case Study · {formattedIndex}
            </span>
            {project.category && (
              <span className="meta-mono uppercase tracking-[0.05em]">
                {project.category}
              </span>
            )}
            {project.year && (
              <span className="meta-mono">· {project.year}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <h3 className="text-[24px] md:text-[28px] font-bold tracking-tight leading-snug text-foreground group-hover:text-primary transition-colors duration-200 flex items-center gap-2">
              <span>{project.title}</span>
              <ArrowUpRight
                className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                aria-hidden="true"
              />
            </h3>
            {project.role && (
              <p className="meta-mono text-xs">Role: {project.role}</p>
            )}
          </div>

          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {project.description}
          </p>

          {project.outcome && (
            <div className="rounded-r border-l-2 border-primary bg-primary/[0.06] px-4 py-3 space-y-1">
              <span className="block font-mono text-[11px] uppercase tracking-[0.07em] text-primary font-semibold">
                Engineering Impact
              </span>
              <p className="text-xs md:text-sm text-foreground/95 leading-relaxed">
                {project.outcome}
              </p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <TechPills technologies={project.technologies} limit={7} />
          <span className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-[0.05em] text-primary font-medium shrink-0">
            Read case study
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>

      {/* Right Column: Expanded Blueprint Stage (5 cols) */}
      <div
        className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-border bg-background/60 p-6 flex flex-col justify-between gap-6"
        style={BLUEPRINT_GRID_STYLE}
      >
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
          <span className="uppercase tracking-[0.06em]">
            Architecture Schematic
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-primary">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            3-Tier Pipeline
          </span>
        </div>

        {project.diagram && (
          <div className="my-auto rounded-md border border-border bg-card/90 p-4 shadow-xs">
            <ArchDiagram nodes={project.diagram.nodes} variant="blueprint" />
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-border text-center">
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                  Edge / Client
                </span>
                <span className="font-mono text-[11px] text-foreground font-medium">
                  {project.diagram.nodes[0]}
                </span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-primary">
                  Core Service
                </span>
                <span className="font-mono text-[11px] text-foreground font-medium">
                  {project.diagram.nodes[1]}
                </span>
              </div>
              <div>
                <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                  Persistence
                </span>
                <span className="font-mono text-[11px] text-foreground font-medium">
                  {project.diagram.nodes[2]}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground border-t border-border/70 pt-3">
          <span>System design, key decisions & trade-offs</span>
          <span className="text-foreground font-medium">→</span>
        </div>
      </div>
    </Link>
  )
}

function BlueprintCard({
  project,
  index,
  techLimit = 6,
}: {
  project: Project
  index: number
  techLimit?: number
}) {
  const formattedIndex = String(index + 1).padStart(2, "0")

  return (
    <Link
      href={`/projects/${project.slug}`}
      onClick={() =>
        captureEvent("project_card_clicked", {
          project_title: project.title,
          slug: project.slug,
          position: index + 1,
        })
      }
      className="group relative flex flex-col justify-between rounded-md border border-border bg-card overflow-hidden hover:border-primary transition-all duration-200 h-full"
    >
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-border bg-background/40">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-xs font-semibold text-primary">
              {formattedIndex}
            </span>
            <span className="text-border-strong font-mono text-xs">/</span>
            <span className="meta-mono uppercase tracking-[0.06em] truncate">
              {project.category ?? "Engineering"}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {project.year && (
              <span className="meta-mono text-[11px]">{project.year}</span>
            )}
            <ArrowUpRight
              className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Blueprint Diagram Well */}
        {project.diagram && (
          <div
            className="px-4 py-3.5 border-b border-border bg-background/60"
            style={BLUEPRINT_GRID_STYLE}
          >
            <ArchDiagram nodes={project.diagram.nodes} variant="blueprint" />
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 space-y-3.5">
          <div className="space-y-1">
            <h3 className="text-[20px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors duration-200">
              {project.title}
            </h3>
            {project.role && (
              <p className="meta-mono text-[11px]">Role: {project.role}</p>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {project.description}
          </p>

          {project.outcome && (
            <div className="rounded-r border-l-2 border-primary bg-primary/[0.06] px-3 py-2.5 space-y-0.5">
              <span className="block font-mono text-[10px] uppercase tracking-[0.08em] text-primary font-semibold">
                Engineering Impact
              </span>
              <p className="text-xs text-foreground/90 leading-relaxed">
                {project.outcome}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Stack Pills */}
      <div className="px-5 py-3.5 border-t border-border bg-background/25 flex items-center justify-between gap-3">
        <TechPills technologies={project.technologies} limit={techLimit} />
      </div>
    </Link>
  )
}

export function Projects() {
  const selectedProjects: Project[] = SELECTED_WORK_SLUGS.map((slug) =>
    projects.find((p) => p.slug === slug)
  ).filter((p): p is Project => Boolean(p))

  const [flagshipProject, ...secondaryProjects] = selectedProjects

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

        <div className="space-y-6">
          {flagshipProject && (
            <FlagshipBentoCard project={flagshipProject} index={0} />
          )}

          {secondaryProjects.length > 0 && (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {secondaryProjects.map((project, idx) => (
                <BlueprintCard
                  key={project.slug}
                  project={project}
                  index={idx + 1}
                  techLimit={6}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
