"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Download, MapPin, Briefcase } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMagnetic } from "@/hooks/use-gsap"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import type { Experience } from "@/lib/experience"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Experience Card ──────────────────────────────────────────────────────────

function ExperienceCard({
  exp,
  index,
  isLast,
}: {
  exp: Experience
  index: number
  isLast: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    gsap.set(card, { opacity: 0, y: 48 })
    ScrollTrigger.create({
      trigger: card,
      start: "top 87%",
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          delay: (index % 3) * 0.1,
          ease: "power3.out",
        })
      },
    })
  }, [index])

  return (
    <div ref={cardRef} className="relative flex gap-0">

      {/* ── Timeline gutter ── */}
      <div className="hidden md:flex flex-col items-center w-14 shrink-0 pt-1">
        {/* Dot */}
        <div className="relative z-10 flex items-center justify-center w-3 h-3 rounded-full bg-primary ring-4 ring-primary/15 mt-1" />
        {/* Vertical line below dot */}
        {!isLast && (
          <div className="flex-1 w-px bg-border/60 mt-2" />
        )}
      </div>

      {/* ── Card body ── */}
      <div className="flex-1 pb-12 pl-2 md:pl-6">
        <div className="group rounded-2xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 hover:border-primary/25 transition-all duration-400 p-6 md:p-8">

          {/* Top row: title + period */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                {exp.title}
              </h2>
              <Link
                href={exp.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-primary/70 transition-colors text-sm mt-0.5"
              >
                {exp.company}
                <ArrowUpRight className="size-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/8 border border-primary/20 text-[11px] font-mono font-medium text-primary/80 uppercase tracking-wide whitespace-nowrap">
                {exp.period}
              </span>
            </div>
          </div>

          {/* Location + type row */}
          <div className="flex flex-wrap gap-4 mb-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3 shrink-0" />
              {exp.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="size-3 shrink-0" />
              {exp.type}
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/40 mb-5" />

          {/* Description */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            {exp.description}
          </p>

          {/* Bullet achievements */}
          {exp.bullets.length > 0 && (
            <ul className="space-y-2.5 mb-6">
              {exp.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed"
                >
                  <span className="mt-[7px] shrink-0 w-1.5 h-1.5 rounded-full bg-primary/50" />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5">
            {exp.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-[11px] font-medium bg-background/60 text-muted-foreground rounded-md border border-border/60 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-200"
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

// ─── Experience Client Page ───────────────────────────────────────────────────

interface ExperienceClientProps {
  experiences: Experience[]
}

export default function ExperienceClient({ experiences }: ExperienceClientProps) {
  const headerRef  = useRef<HTMLElement>(null)
  const heroRef    = useRef<HTMLDivElement>(null)
  const backRef    = useMagnetic<HTMLAnchorElement>(0.3)
  const resumeRef  = useMagnetic<HTMLAnchorElement>(0.3)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
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

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://nelsonfrank.dev"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Experience",
      "item": "https://nelsonfrank.dev/experience"
    }
  ]
}

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CustomCursor />
      <SmoothScroll>

        {/* ── Header ── */}
        <header
          ref={headerRef}
          className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border py-4 px-6"
        >
          <div className="mx-auto max-w-4xl flex items-center justify-between">
            <Link
              ref={backRef}
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Nelson Frank
            </Link>
            <span className="text-sm font-medium text-primary">Experience</span>
          </div>
        </header>

        <main className="pt-24 pb-28 px-6 min-h-screen">
          <div className="mx-auto max-w-4xl">

            {/* ── Hero ── */}
            <div ref={heroRef} className="mb-16 md:mb-20">
              <p className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-4">
                Professional history
              </p>
              <h1 className="text-4xl md:text-[3.5rem] font-semibold tracking-tight text-foreground leading-tight mb-5">
                Experience
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed mb-8">
                A timeline of my professional journey — the roles, teams, and problems that shaped how I build software.
              </p>

              <Link
                ref={resumeRef}
                href="/resume.pdf"
                download="nelson-frank-software-developer.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-primary text-background text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all duration-200 group shadow-lg shadow-primary/20"
                data-cursor="Download"
              >
                <Download className="size-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
                Download Resume
              </Link>
            </div>

            {/* ── Timeline ── */}
            <div>
              {/* Label row for the timeline */}
              <div className="hidden md:flex items-center gap-0 mb-8">
                <div className="w-14 shrink-0" />
                <div className="pl-6">
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground/50">
                    — Timeline
                  </p>
                </div>
              </div>

              <div>
                {experiences.map((exp, i) => (
                  <ExperienceCard
                    key={exp.slug}
                    exp={exp}
                    index={i}
                    isLast={i === experiences.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* ── Bottom CTA ── */}
            <div className="mt-6 ml-0 md:ml-20 rounded-2xl border border-border/50 bg-secondary/20 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <p className="text-sm font-medium text-foreground">Want the full picture?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Includes education, certifications, and additional side projects.
                </p>
              </div>
              <Link
                href="/resume.pdf"
                download="nelson-frank-software-developer.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary text-sm font-medium text-foreground transition-all duration-200 group shrink-0"
                data-cursor="Download"
              >
                <Download className="size-3.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                Download PDF
              </Link>
            </div>

          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-border/40 py-8 px-6">
          <div className="mx-auto max-w-4xl flex items-center justify-between">
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
