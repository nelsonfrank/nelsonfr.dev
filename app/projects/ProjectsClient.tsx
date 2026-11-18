"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/header"
import { ProjectCard } from "@/components/project-card"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import type { Project } from "@/lib/projects"

interface ProjectsClientProps {
  initialProjects: Project[]
  minProjectsForFilter?: number
}

export default function ProjectsClient({
  initialProjects,
  minProjectsForFilter = 1,
}: ProjectsClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All")

  const categories = useMemo(() => {
    const seen = new Set<string>()
    for (const p of initialProjects) {
      for (const c of p.categories) {
        seen.add(c)
      }
    }
    return ["All", ...Array.from(seen)]
  }, [initialProjects])

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const catParam = params.get("category") || params.get("topic")
      if (catParam) {
        const matched = categories.find(
          (c) => c.toLowerCase() === catParam.toLowerCase()
        )
        if (matched) {
          setActiveCategory(matched)
        } else {
          setActiveCategory(catParam)
        }
      }
    } catch {
      // Ignore URL parse issues
    }
  }, [categories])

  const selectCategory = (category: string) => {
    setActiveCategory(category)
    try {
      const url = new URL(window.location.href)
      if (category === "All") {
        url.searchParams.delete("category")
        url.searchParams.delete("topic")
      } else {
        url.searchParams.set("category", category.toLowerCase())
      }
      window.history.replaceState({}, "", url.pathname + url.search + url.hash)
    } catch {
      // Ignore replaceState error
    }
  }

  const visibleCount = useMemo(() => {
    if (activeCategory === "All") return initialProjects.length
    const target = activeCategory.toLowerCase()
    return initialProjects.filter((p) =>
      p.categories.some((c) => c.toLowerCase() === target)
    ).length
  }, [initialProjects, activeCategory])

  const showFilterBar = initialProjects.length >= minProjectsForFilter

  return (
    <>
      <Header />

      <main id="main-content">
        <div className="wrap">
          <header className="page-head">
            <h1>
              Work that <span className="hl-word">shipped.</span>
            </h1>
            <p>
              Five engineering projects across web, mobile, developer tooling,
              and cloud infrastructure. Each page starts with the result, then
              shows the problem and how I built it.
            </p>
          </header>

          {showFilterBar && (
            <div className="filter-bar">
              <div
                className="chips"
                role="group"
                aria-label="Filter projects"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className="chip"
                    data-f={category.toLowerCase()}
                    aria-pressed={
                      activeCategory.toLowerCase() === category.toLowerCase()
                    }
                    onClick={() => selectCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <span className="count-line" id="count" aria-live="polite">
                {visibleCount} {visibleCount === 1 ? "project" : "projects"}
              </span>
            </div>
          )}

          <div className="works-grid" id="works">
            {initialProjects.map((project, index) => {
              const isMatch =
                activeCategory === "All" ||
                project.categories.some(
                  (c) => c.toLowerCase() === activeCategory.toLowerCase()
                )
              const isBig = activeCategory === "All" && index === 0

              return (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  featured={isBig}
                  hidden={!isMatch}
                  dataCategories={project.categories
                    .map((c) => c.toLowerCase())
                    .join(" ")}
                />
              )
            })}
          </div>

          <p className="empty-state" id="empty" hidden={visibleCount > 0}>
            No projects in this category yet. Try choosing another category above.
          </p>
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  )
}
