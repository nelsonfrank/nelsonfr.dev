"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Github, ExternalLink, Search, X, FolderGit2 } from "lucide-react"
import gsap from "gsap"
import { useMagnetic } from "@/hooks/use-gsap"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import type { Project } from "@/lib/projects"

// ─── Individual Project Card ───────────────────────────────────────────────────

function ProjectGridCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    gsap.set(card, { opacity: 0, y: 30 })
    gsap.to(card, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: (index % 3) * 0.1,
      ease: "power2.out",
    })
  }, [project, index])

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col bg-secondary/10 hover:bg-secondary/20 rounded-2xl border border-border/60 hover:border-primary/25 transition-all duration-400 overflow-hidden h-full"
      data-cursor="Explore"
    >
      {/* Visual Header / Placeholder with elegant gradients */}
      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-secondary/40 to-muted/20 border-b border-border/40 flex items-center justify-center">
        {/* Soft background glow */}
        <div className="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="text-5xl font-semibold tracking-tighter text-primary/20 group-hover:text-primary/45 group-hover:scale-110 transition-all duration-500 select-none">
          {project.title.charAt(0)}
        </div>

        {/* Hover overlay with action buttons */}
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-400">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-primary text-background rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
              aria-label="View live site"
            >
              <ExternalLink className="size-4" />
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-secondary/80 border border-border hover:bg-secondary rounded-full hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="View source code"
            >
              <Github className="size-4 text-foreground" />
            </Link>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-background/80 backdrop-blur-md border border-border/40 text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider">
            {project.category}
          </span>
        </div>
      </div>

      {/* Info & Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
              {project.title}
            </h2>
            <div className="flex gap-1.5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <Github className="size-3.5" />
                </Link>
              )}
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  <ExternalLink className="size-3.5" />
                </Link>
              )}
            </div>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-400">
            {project.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-border/30">
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-medium bg-background/50 text-muted-foreground rounded border border-border/40"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Projects Client Component ──────────────────────────────────────────

interface ProjectsClientProps {
  initialProjects: Project[]
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const headerRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const backRef = useMagnetic<HTMLAnchorElement>(0.3)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  // Gather unique categories dynamically
  const categories = useMemo(() => {
    const list = new Set(initialProjects.map((p) => p.category))
    return ["All", ...Array.from(list)]
  }, [initialProjects])

  // Filter projects based on search query and active category
  const filteredProjects = useMemo(() => {
    return initialProjects.filter((project) => {
      const matchesCategory = activeCategory === "All" || project.category === activeCategory
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        query === "" ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query))
      return matchesCategory && matchesSearch
    })
  }, [initialProjects, activeCategory, searchQuery])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate page header
      gsap.fromTo(
        headerRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
      // Animate page hero content
      if (heroRef.current) {
        gsap.fromTo(
          Array.from(heroRef.current.children),
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, delay: 0.15, ease: "power3.out" }
        )
      }
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <CustomCursor />
      <SmoothScroll>
        
        {/* ── Header ── */}
        <header
          ref={headerRef}
          className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border py-4 px-6"
        >
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <Link
              ref={backRef}
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Nelson Frank
            </Link>
            <span className="text-sm font-medium text-primary">Projects</span>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="pt-24 pb-28 px-6 min-h-screen">
          <div className="mx-auto max-w-6xl">
            
            {/* ── Hero ── */}
            <div ref={heroRef} className="mb-12 md:mb-16">
              <p className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-4">
                Creative & Engineering works
              </p>
              <h1 className="text-4xl md:text-[3.5rem] font-semibold tracking-tight text-foreground leading-tight mb-5">
                Projects
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
                A showcase of web applications, mobile platforms, and open-source tools I’ve designed, architected, and built from scratch.
              </p>
            </div>

            {/* ── Search & Filter Controls ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10 pb-6 border-b border-border/40">
              
              {/* Category tabs */}
              <div className="flex flex-wrap gap-2 order-2 md:order-1">
                {categories.map((category) => {
                  const isActive = activeCategory === category
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-primary border-primary text-background"
                          : "bg-secondary/10 border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:max-w-xs order-1 md:order-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2 rounded-full border border-border/80 bg-secondary/10 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* ── Grid Timeline / Content ── */}
            {filteredProjects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project, i) => (
                  <ProjectGridCard
                    key={project.title}
                    project={project}
                    index={i}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border border-dashed border-border/60 rounded-2xl bg-secondary/5">
                <FolderGit2 className="size-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium text-foreground">No projects found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try clearing search tags or switching categories.
                </p>
                {activeCategory !== "All" || searchQuery !== "" ? (
                  <button
                    onClick={() => {
                      setActiveCategory("All")
                      setSearchQuery("")
                    }}
                    className="mt-4 px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors"
                  >
                    Reset Filters
                  </button>
                ) : null}
              </div>
            )}

          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-border/40 py-8 px-6">
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
            >
              <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
              Back home
            </Link>
            <p className="text-xs text-muted-foreground/50">
              Nelson Frank · {new Date().getFullYear()}
            </p>
          </div>
        </footer>

      </SmoothScroll>
    </>
  )
}
