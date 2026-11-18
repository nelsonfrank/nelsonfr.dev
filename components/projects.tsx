"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Layers, Sparkles } from "lucide-react"
import { projects, SELECTED_WORK_SLUGS, type Project } from "@/lib/projects"
import { ArchDiagram } from "@/components/arch-diagram"
import { captureEvent } from "@/lib/analytics"

type PreviewMode = "side-by-side" | "bento" | "dossier" | "blueprint" | "current"

const BLUEPRINT_GRID_STYLE = {
  backgroundImage:
    "radial-gradient(color-mix(in srgb, var(--muted-foreground) 22%, transparent) 1px, transparent 1px)",
  backgroundSize: "12px 12px",
}

function TechPills({
  technologies,
  limit = 5,
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

/* ─── 0. CURRENT CARD (Baseline) ──────────────────────────────────────────── */
function CurrentCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      onClick={() =>
        captureEvent("project_card_clicked", {
          project_title: project.title,
          slug: project.slug,
          variant: "current",
        })
      }
      className="group flex flex-col justify-between rounded-md border border-border bg-card p-5 hover:border-primary transition-colors duration-200 h-full"
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
  )
}

/* ─── 1. BLUEPRINT SPEC CARD (Option C / Secondary Bento Card) ────────────── */
function BlueprintCard({
  project,
  index,
  techLimit = 5,
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
          variant: "blueprint",
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
              <p className="meta-mono text-[11px]">{project.role}</p>
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

/* ─── 2. EDITORIAL DOSSIER COMPACT CARD (For 3-Col Side-by-Side) ──────────── */
function DossierCompactCard({
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
          variant: "dossier-compact",
        })
      }
      className="group relative flex flex-col justify-between rounded-md border border-border bg-card p-5 hover:border-primary transition-all duration-200 h-full"
    >
      <div className="space-y-4">
        {/* Editorial Numbered Index & Category */}
        <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-border">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-lg font-bold tracking-tight text-primary leading-none">
              {formattedIndex}
            </span>
            <span className="meta-mono uppercase tracking-[0.06em]">
              {project.category}
            </span>
          </div>
          <span className="meta-mono text-xs">{project.year ?? "2026"}</span>
        </div>

        {/* Title & Role */}
        <div className="space-y-1">
          <h3 className="text-[21px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors duration-200">
            {project.title}
          </h3>
          {project.role && (
            <p className="text-xs font-mono text-muted-foreground">
              Role: <span className="text-foreground/80">{project.role}</span>
            </p>
          )}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Architecture Flow Pill Strip */}
        {project.diagram && (
          <div className="rounded border border-border bg-background px-3 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground">
                System Pipeline
              </span>
              <span className="inline-block size-1.5 rounded-full bg-primary" />
            </div>
            <ArchDiagram nodes={project.diagram.nodes} variant="blueprint" />
          </div>
        )}

        {/* Outcome */}
        {project.outcome && (
          <p className="text-xs text-foreground/90 leading-relaxed pt-1">
            <span className="font-mono uppercase tracking-[0.05em] text-primary font-semibold mr-1.5">
              Result →
            </span>
            {project.outcome}
          </p>
        )}
      </div>

      <div className="pt-4 mt-5 border-t border-border space-y-3">
        <TechPills technologies={project.technologies} limit={4} />
        <div className="flex items-center justify-between text-xs font-mono text-primary pt-1">
          <span className="uppercase tracking-[0.05em]">Read case study</span>
          <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

/* ─── 3. FLAGSHIP BENTO HERO CARD (Option A Top Full-Width Card) ──────────── */
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
          variant: "bento-flagship",
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
                Verified Outcome
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
            Explore architecture
            <ArrowUpRight className="size-3.5" />
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
            <span className="size-1.5 rounded-full bg-primary" />
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
          <span>Click to view full system design & trade-offs</span>
          <span className="text-foreground font-medium">→</span>
        </div>
      </div>
    </Link>
  )
}

/* ─── 4. FULL-WIDTH EDITORIAL DOSSIER ROW (Option B) ──────────────────────── */
function EditorialDossierRow({
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
          variant: "editorial-row",
        })
      }
      className="group grid grid-cols-1 lg:grid-cols-12 rounded-md border border-border bg-card hover:border-primary transition-all duration-200 overflow-hidden"
    >
      {/* Zone 1: Index & Meta (2 cols) */}
      <div className="lg:col-span-2 p-5 lg:border-r border-b lg:border-b-0 border-border bg-background/35 flex lg:flex-col justify-between items-baseline lg:items-start gap-2">
        <div className="space-y-1">
          <span className="block font-mono text-2xl font-bold text-primary leading-none">
            {formattedIndex}
          </span>
          <span className="block meta-mono uppercase tracking-[0.06em] pt-1">
            {project.category}
          </span>
        </div>
        <div className="text-right lg:text-left">
          {project.year && (
            <span className="block font-mono text-xs text-foreground">
              {project.year}
            </span>
          )}
          {project.role && (
            <span className="block meta-mono text-[11px] mt-0.5">
              {project.role}
            </span>
          )}
        </div>
      </div>

      {/* Zone 2: Core Narrative & Outcome (6 cols) */}
      <div className="lg:col-span-6 p-5 md:p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[22px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1.5" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        </div>

        {project.outcome && (
          <div className="rounded-r border-l-2 border-primary bg-primary/[0.06] px-3.5 py-2.5">
            <p className="text-xs text-foreground/90 leading-relaxed">
              <span className="font-mono uppercase tracking-[0.06em] text-primary font-semibold mr-2">
                Impact:
              </span>
              {project.outcome}
            </p>
          </div>
        )}
      </div>

      {/* Zone 3: Blueprint & Stack (4 cols) */}
      <div
        className="lg:col-span-4 p-5 border-t lg:border-t-0 lg:border-l border-border bg-background/50 flex flex-col justify-between gap-4"
        style={BLUEPRINT_GRID_STYLE}
      >
        {project.diagram && (
          <div className="rounded border border-border bg-card p-3">
            <span className="block font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground mb-1.5">
              Architecture Flow
            </span>
            <ArchDiagram nodes={project.diagram.nodes} variant="blueprint" />
          </div>
        )}
        <TechPills technologies={project.technologies} limit={6} />
      </div>
    </Link>
  )
}

export function Projects() {
  const [mode, setMode] = useState<PreviewMode>("side-by-side")
  const [comparedSlug, setComparedSlug] = useState<string>("city-connector-backend")

  const selectedProjects: Project[] = SELECTED_WORK_SLUGS.map((slug) =>
    projects.find((p) => p.slug === slug)
  ).filter((p): p is Project => Boolean(p))

  const comparedProject =
    selectedProjects.find((p) => p.slug === comparedSlug) ?? selectedProjects[0]
  const comparedIndex = Math.max(
    0,
    selectedProjects.findIndex((p) => p.slug === comparedProject?.slug)
  )

  // Reorder for Option A Flagship Bento so City Connector leads as the flagship
  const bentoProjects = [
    selectedProjects.find((p) => p.slug === "city-connector-backend"),
    ...selectedProjects.filter((p) => p.slug !== "city-connector-backend"),
  ].filter((p): p is Project => Boolean(p))

  return (
    <section id="work" className="py-16 md:py-20 border-t border-border">
      <div className="page-container space-y-10">
        {/* Section Header */}
        <div className="flex flex-wrap items-baseline justify-between gap-4">
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

        {/* ─── PROTOTYPE SWITCHER BAR ───────────────────────────────────────── */}
        <div className="rounded-md border border-primary/40 bg-card p-4 space-y-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary shrink-0" />
              <span className="font-mono text-xs uppercase tracking-[0.06em] text-primary font-semibold">
                Design Prototype Switcher
              </span>
            </div>
            <span className="meta-mono text-xs">
              Compare card anatomy side-by-side or preview full section layouts
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                {
                  id: "side-by-side",
                  label: "1. Side-by-Side Comparison (All)",
                },
                {
                  id: "bento",
                  label: "Option A: Flagship Bento (1 + 2)",
                },
                {
                  id: "dossier",
                  label: "Option B: Editorial Dossier Rows",
                },
                {
                  id: "blueprint",
                  label: "Option C: Blueprint 3-Column",
                },
                {
                  id: "current",
                  label: "Current (Baseline)",
                },
              ] as const
            ).map((tab) => {
              const active = mode === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setMode(tab.id)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer border ${
                    active
                      ? "bg-primary text-primary-foreground border-primary font-medium"
                      : "bg-background text-muted-foreground border-border hover:border-primary hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ─── VIEW 1: SIDE-BY-SIDE CARD ANATOMY + FULL SECTION PREVIEWS ──── */}
        {mode === "side-by-side" && comparedProject && (
          <div className="space-y-16">
            {/* Part A: 3-Column Card-to-Card Side-by-Side */}
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
                <div>
                  <p className="eyebrow">Part 1 · Direct Card Anatomy Comparison</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Viewing the exact same project rendered across all 3 card styles side-by-side:
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="meta-mono mr-1">Inspect project:</span>
                  {selectedProjects.map((p) => (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => setComparedSlug(p.slug)}
                      className={`px-2.5 py-1 rounded text-xs font-mono border cursor-pointer transition-colors ${
                        comparedSlug === p.slug
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p.title.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-3 items-stretch">
                {/* Col 1: Current */}
                <div className="flex flex-col space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="font-mono text-xs uppercase tracking-[0.05em] text-muted-foreground">
                      Baseline · Current Card
                    </span>
                    <span className="meta-mono text-[11px]">Flat / Uncapped tags</span>
                  </div>
                  <div className="flex-1">
                    <CurrentCard project={comparedProject} />
                  </div>
                </div>

                {/* Col 2: Option C Blueprint Card */}
                <div className="flex flex-col space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="font-mono text-xs uppercase tracking-[0.05em] text-primary font-semibold">
                      Option C · Blueprint Spec Card
                    </span>
                    <span className="meta-mono text-[11px]">Dot-grid + Impact box</span>
                  </div>
                  <div className="flex-1">
                    <BlueprintCard
                      project={comparedProject}
                      index={comparedIndex}
                    />
                  </div>
                </div>

                {/* Col 3: Option B/A Editorial Dossier Card */}
                <div className="flex flex-col space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="font-mono text-xs uppercase tracking-[0.05em] text-primary font-semibold">
                      Option B · Editorial Dossier
                    </span>
                    <span className="meta-mono text-[11px]">Numbered + CTA footer</span>
                  </div>
                  <div className="flex-1">
                    <DossierCompactCard
                      project={comparedProject}
                      index={comparedIndex}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Part B: Option A Full Layout Preview (Flagship Bento 1 + 2) */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="eyebrow">
                    Option A Full Layout · Asymmetric Flagship Bento (1 + 2)
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Leads with a full-width Flagship Case Study card on top, paired with two spacious 50%-width Blueprint cards below.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMode("bento")}
                  className="meta-mono text-primary hover:underline shrink-0 cursor-pointer"
                >
                  Focus Option A →
                </button>
              </div>

              <div className="space-y-6">
                {bentoProjects[0] && (
                  <FlagshipBentoCard project={bentoProjects[0]} index={0} />
                )}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  {bentoProjects.slice(1).map((project, idx) => (
                    <BlueprintCard
                      key={project.slug}
                      project={project}
                      index={idx + 1}
                      techLimit={6}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Part C: Option B Full Layout Preview (Editorial Dossier Rows) */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="eyebrow">
                    Option B Full Layout · Editorial Engineering Dossier (12-Col Rows)
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Full-width horizontal case-study strips divided into Index/Role, Narrative/Impact, and Architecture/Stack.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMode("dossier")}
                  className="meta-mono text-primary hover:underline shrink-0 cursor-pointer"
                >
                  Focus Option B →
                </button>
              </div>

              <div className="space-y-4">
                {selectedProjects.map((project, idx) => (
                  <EditorialDossierRow
                    key={project.slug}
                    project={project}
                    index={idx}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── VIEW 2: OPTION A ONLY (FLAGSHIP BENTO 1 + 2) ───────────────── */}
        {mode === "bento" && (
          <div className="space-y-6">
            {bentoProjects[0] && (
              <FlagshipBentoCard project={bentoProjects[0]} index={0} />
            )}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {bentoProjects.slice(1).map((project, idx) => (
                <BlueprintCard
                  key={project.slug}
                  project={project}
                  index={idx + 1}
                  techLimit={6}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── VIEW 3: OPTION B ONLY (EDITORIAL DOSSIER ROWS) ─────────────── */}
        {mode === "dossier" && (
          <div className="space-y-4">
            {selectedProjects.map((project, idx) => (
              <EditorialDossierRow
                key={project.slug}
                project={project}
                index={idx}
              />
            ))}
          </div>
        )}

        {/* ─── VIEW 4: OPTION C ONLY (3-COLUMN BLUEPRINT GRID) ────────────── */}
        {mode === "blueprint" && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {selectedProjects.map((project, idx) => (
              <BlueprintCard key={project.slug} project={project} index={idx} />
            ))}
          </div>
        )}

        {/* ─── VIEW 5: CURRENT BASELINE ───────────────────────────────────── */}
        {mode === "current" && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {selectedProjects.map((project) => (
              <CurrentCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
