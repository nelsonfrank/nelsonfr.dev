"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowLeft, Search, X, FolderGit2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Project } from "@/lib/projects"

function ProjectGridCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col justify-between rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors duration-200 h-full"
    >
      <div className="space-y-3">
        <span className="inline-block text-xs font-mono uppercase tracking-[0.05em] text-primary">
          {project.category}
        </span>
        <h2 className="text-[20px] font-semibold text-foreground group-hover:text-primary transition-colors duration-200 leading-snug">
          {project.title}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {project.description}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs font-mono bg-background text-muted-foreground rounded border border-border"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

interface ProjectsClientProps {
  initialProjects: Project[]
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = useMemo(() => {
    const list = new Set(initialProjects.map((p) => p.category).filter((c): c is string => Boolean(c)))
    return ["All", ...Array.from(list)]
  }, [initialProjects])

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
        "name": "Projects",
        "item": "https://nelsonfrank.dev/projects"
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main id="main-content" className="py-12 md:py-20 min-h-screen">
        <div className="page-container">
          <div className="mb-10 md:mb-14">
            <Link
              href="/"
              className="inline-flex items-center gap-2 min-h-[44px] text-xs font-mono uppercase tracking-[0.05em] text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="size-3.5" />
              Home
            </Link>
            <h1 className="text-[36px] md:text-[60px] font-bold tracking-[-0.03em] leading-[1.08] text-foreground mb-4">
              Projects
            </h1>
            <p className="text-muted-foreground text-[17px] md:text-[19px] max-w-[680px] leading-[1.6]">
              Engineering case studies across authentication, transit routing, data pipelines, developer tooling and cloud infrastructure.
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border">
            <div className="flex flex-wrap gap-2 order-2 md:order-1">
              {categories.map((category) => {
                const isActive = activeCategory === category
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`min-h-[44px] px-4 py-2 rounded-md text-xs font-mono border transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? "bg-primary border-primary text-primary-foreground font-medium"
                        : "bg-card border-border text-muted-foreground hover:border-primary hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>

            <div className="relative w-full md:max-w-xs order-1 md:order-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects or tags..."
                aria-label="Search projects or tags"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[44px] pl-10 pr-9 py-2 rounded-md border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-0 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectGridCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-border rounded-lg bg-card">
              <FolderGit2 className="size-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">No projects found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try clearing search tags or switching categories.
              </p>
              {activeCategory !== "All" || searchQuery !== "" ? (
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("All")
                    setSearchQuery("")
                  }}
                  className="mt-4 min-h-[44px] px-4 py-2 text-xs font-mono rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Reset Filters
                </button>
              ) : null}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
