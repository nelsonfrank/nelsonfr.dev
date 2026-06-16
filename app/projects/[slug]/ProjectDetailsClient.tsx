"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink, ArrowUpRight, FolderGit2, CheckCircle2 } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMagnetic } from "@/hooks/use-gsap"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import type { Project } from "@/lib/projects"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const update = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : "0%"
    }
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-60 h-0.5 bg-border/30">
      <div ref={barRef} className="h-full bg-primary transition-none" style={{ width: "0%" }} />
    </div>
  )
}

interface ProjectDetailsClientProps {
  project: Project
  htmlContent: string
  nextProject: Project
}

export default function ProjectDetailsClient({
  project,
  htmlContent,
  nextProject,
}: ProjectDetailsClientProps) {
  const headerRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  
  const backRef = useMagnetic<HTMLAnchorElement>(0.3)
  const githubBtnRef = useMagnetic<HTMLAnchorElement>(0.4)
  const liveBtnRef = useMagnetic<HTMLAnchorElement>(0.4)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate top header bar
      gsap.fromTo(
        headerRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )

      // Stagger page intro hero elements
      if (heroRef.current) {
        gsap.fromTo(
          Array.from(heroRef.current.children),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.1, ease: "power3.out" }
        )
      }

      // Sidebar content animation
      if (sidebarRef.current) {
        gsap.fromTo(
          sidebarRef.current,
          { opacity: 0, scale: 0.95, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
        )
      }

      // Case study content animation
      if (bodyRef.current) {
        gsap.fromTo(
          bodyRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, delay: 0.45, ease: "power3.out" }
        )
      }
    })

    return () => ctx.revert()
  }, [project.slug])

  return (
    <>
      <ReadingProgress />
      <CustomCursor />
      <SmoothScroll>
        
        {/* ── Sticky Header ── */}
        <header
          ref={headerRef}
          className="fixed top-0.5 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border py-4 px-6"
        >
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <Link
              ref={backRef}
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              data-cursor="Back"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Projects
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Nelson Frank
            </Link>
          </div>
        </header>

        {/* ── Main Content Container ── */}
        <main className="pt-28 pb-20 px-6 min-h-screen">
          <div className="mx-auto max-w-6xl">
            
            {/* ── Hero section ── */}
            <div ref={heroRef} className="mb-12 border-b border-border/40 pb-10">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-secondary/30 border border-border/60 text-xs font-mono font-medium text-primary uppercase tracking-wider mb-4">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6 text-balance">
                {project.title}
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-3xl leading-relaxed text-balance">
                {project.description}
              </p>
            </div>

            {/* ── Two Column Page Layout ── */}
            <div className="grid gap-10 lg:grid-cols-3">
              
              {/* Left Column: Markdown Content */}
              <div className="lg:col-span-2 space-y-8">
                {htmlContent ? (
                  <article
                    ref={bodyRef}
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                ) : (
                  <div ref={bodyRef} className="py-20 text-center border border-dashed border-border/50 rounded-2xl bg-secondary/5">
                    <FolderGit2 className="size-10 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground font-medium">Detailed case study in preparation.</p>
                    <p className="text-xs text-muted-foreground/75 mt-1">Please inspect the project repository or visit live demo.</p>
                  </div>
                )}
              </div>

              {/* Right Column: Statistics / Meta Sidebar */}
              <div className="lg:col-span-1">
                <div
                  ref={sidebarRef}
                  className="sticky top-24 bg-secondary/10 border border-border/60 p-6 md:p-8 rounded-2xl space-y-6"
                >
                  <div>
                    <h3 className="text-xs font-mono text-primary/80 uppercase tracking-widest mb-3">Project Specs</h3>
                    <div className="space-y-4">
                      
                      {/* Stat Item */}
                      <div className="flex justify-between items-center py-2 border-b border-border/20">
                        <span className="text-xs text-muted-foreground font-medium">Role</span>
                        <span className="text-xs text-foreground font-semibold">Lead Developer</span>
                      </div>

                      {/* Stat Item */}
                      <div className="flex justify-between items-center py-2 border-b border-border/20">
                        <span className="text-xs text-muted-foreground font-medium">Timeline</span>
                        <span className="text-xs text-foreground font-semibold">2024 - 2025</span>
                      </div>

                      {/* Stat Item */}
                      <div className="flex justify-between items-center py-2 border-b border-border/20">
                        <span className="text-xs text-muted-foreground font-medium">Stage</span>
                        <span className="text-xs text-foreground font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-emerald-500" /> Completed
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="text-xs font-mono text-primary/80 uppercase tracking-widest mb-3">Technologies</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 text-[11px] font-medium bg-background text-muted-foreground rounded-lg border border-border/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Links */}
                  <div className="pt-4 space-y-3">
                    {project.liveUrl && project.liveUrl !== "#" && (
                      <Link
                        ref={liveBtnRef}
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-primary text-background hover:bg-primary/95 text-xs font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 group transition-all duration-300 shadow-sm shadow-primary/10"
                        data-cursor="External"
                      >
                        Visit Live Website
                        <ExternalLink className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    )}
                    {project.githubUrl && project.githubUrl !== "#" && (
                      <Link
                        ref={githubBtnRef}
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-secondary/85 hover:bg-secondary border border-border text-foreground text-xs font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 group transition-all duration-300"
                      >
                        View Source Code
                        <Github className="size-3.5" />
                      </Link>
                    )}
                  </div>

                </div>
              </div>

            </div>

            {/* ── Next Project Teaser Section ── */}
            <div className="mt-20 pt-10 border-t border-border/40">
              <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6 text-center">
                Keep Exploring
              </h3>
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group block relative overflow-hidden bg-secondary/5 hover:bg-secondary/15 rounded-2xl border border-border/50 hover:border-primary/30 p-8 md:p-12 transition-all duration-400 max-w-2xl mx-auto"
                data-cursor="Next"
              >
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-medium text-primary uppercase tracking-widest">
                      Next Project
                    </span>
                    <h4 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {nextProject.title}
                    </h4>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 max-w-md">
                      {nextProject.description}
                    </p>
                  </div>
                  <div className="shrink-0 p-3 bg-secondary/80 border border-border group-hover:bg-primary group-hover:text-background rounded-full group-hover:scale-105 transition-all duration-300">
                    <ArrowUpRight className="size-5" />
                  </div>
                </div>
                
                {/* Visual Glow */}
                <div className="absolute right-0 bottom-0 w-48 h-48 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </Link>
            </div>

          </div>
        </main>

        {/* ── Footer ── */}
        <footer ref={footerRef} className="border-t border-border/40 py-8 px-6">
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
            >
              <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
              All projects
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
