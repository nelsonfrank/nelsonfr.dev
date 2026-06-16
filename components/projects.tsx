"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Github, ExternalLink } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useFadeUp, useMagnetic } from "@/hooks/use-gsap"

import { projects } from "@/lib/projects"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}


function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) {
      return
    }
    router.push(`/projects/${project.slug}`)
  }

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    gsap.set(card, { opacity: 0, y: 80, rotateX: -10 })

    ScrollTrigger.create({
      trigger: card,
      start: "top 85%",
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          delay: index * 0.2,
          ease: "power3.out",
        })
      },
    })
  }, [index])

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500 cursor-pointer"
      style={{ perspective: "1000px" }}
      data-cursor="View"
    >
      {/* Project Image */}
      <div className="aspect-video bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl font-bold text-primary/20 group-hover:scale-110 transition-transform duration-700">
            {project.title.charAt(0)}
          </div>
        </div>

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Hover overlay with staggered icons */}
        <div className="absolute inset-0 bg-primary/90 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              className="p-3 bg-background/90 rounded-full hover:bg-background transition-all duration-300 hover:scale-110 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
              style={{ transitionDelay: "100ms" }}
              aria-label="View live site"
            >
              <ExternalLink className="size-5 text-foreground" />
            </Link>
          )}
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              className="p-3 bg-background/90 rounded-full hover:bg-background transition-all duration-300 hover:scale-110 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
              style={{ transitionDelay: "200ms" }}
              aria-label="View source code"
            >
              <Github className="size-5 text-foreground" />
            </Link>
          )}
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 overflow-hidden">
          {project.technologies.map((tech, i) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded translate-y-0 group-hover:-translate-y-0 transition-transform duration-300"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  )
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useFadeUp<HTMLHeadingElement>()
  const viewAllRef = useMagnetic<HTMLAnchorElement>(0.3)
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
    <section ref={sectionRef} id="projects" className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <h2
          ref={headingRef}
          className="text-sm font-medium text-primary uppercase tracking-wider mb-12 relative inline-block"
        >
          Projects
          <span ref={lineRef} className="absolute -bottom-2 left-0 w-full h-px bg-primary" />
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            ref={viewAllRef}
            href="/projects"
            className="inline-flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors group"
            data-cursor="Explore"
          >
            View All Projects
            <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
