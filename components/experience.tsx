"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useFadeUp, useMagnetic } from "@/hooks/use-gsap"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const experiences = [
  {
    period: "2023 — Present",
    title: "Senior Software Engineer",
    company: "Tech Company",
    companyUrl: "#",
    description:
      "Build and maintain critical components used to construct frontend interfaces, work closely with cross-functional teams to implement features and ensure code quality.",
    technologies: ["TypeScript", "React", "Node.js", "PostgreSQL"],
  },
  {
    period: "2021 — 2023",
    title: "Software Developer",
    company: "Digital Agency",
    companyUrl: "#",
    description:
      "Developed and shipped highly interactive web applications for clients. Implemented responsive designs and optimized performance across all platforms.",
    technologies: ["JavaScript", "Vue.js", "Express", "MongoDB"],
  },
  {
    period: "2019 — 2021",
    title: "Junior Developer",
    company: "Startup Inc",
    companyUrl: "#",
    description:
      "Contributed to the development of internal tools and customer-facing features. Collaborated with designers to implement pixel-perfect interfaces.",
    technologies: ["JavaScript", "React", "CSS", "Firebase"],
  },
]

function ExperienceCard({ exp, index }: { exp: typeof experiences[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    gsap.set(card, { opacity: 0, y: 50 })

    ScrollTrigger.create({
      trigger: card,
      start: "top 85%",
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power3.out",
        })
      },
    })
  }, [index])

  return (
    <div
      ref={cardRef}
      className="group grid gap-4 md:grid-cols-[200px_1fr] md:gap-8 p-6 -mx-6 rounded-lg hover:bg-secondary/50 transition-all duration-500 relative overflow-hidden"
    >
      {/* Hover effect line */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
      
      <div className="text-sm text-muted-foreground font-mono">
        {exp.period}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
            {exp.title} ·{" "}
            <Link
              href={exp.companyUrl}
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              {exp.company}
              <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          </h3>
          <p className="text-muted-foreground mt-2 leading-relaxed">
            {exp.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {exp.technologies.map((tech, i) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useFadeUp<HTMLHeadingElement>()
  const resumeLinkRef = useMagnetic<HTMLAnchorElement>(0.3)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const line = lineRef.current
    if (!line) return

    gsap.set(line, { scaleX: 0, transformOrigin: "left center" })

    ScrollTrigger.create({
      trigger: line,
      start: "top 90%",
      onEnter: () => {
        gsap.to(line, {
          scaleX: 1,
          duration: 1.5,
          ease: "power3.inOut",
        })
      },
    })
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <h2
          ref={headingRef}
          className="text-sm font-medium text-primary uppercase tracking-wider mb-12 relative inline-block"
        >
          Experience
          <span ref={lineRef} className="absolute -bottom-2 left-0 w-full h-px bg-primary" />
        </h2>

        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <ExperienceCard key={index} exp={exp} index={index} />
          ))}
        </div>

        <Link
          ref={resumeLinkRef}
          href="/resume.pdf"
          className="inline-flex items-center gap-2 mt-12 text-foreground font-medium hover:text-primary transition-colors group"
          data-cursor="Download"
        >
          View Full Resume
          <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
