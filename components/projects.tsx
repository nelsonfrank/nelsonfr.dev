import Link from "next/link"
import { projects, SELECTED_WORK_SLUGS, type Project } from "@/lib/projects"
import { ProjectCard } from "@/components/project-card"

export function Projects() {
  const selectedProjects: Project[] = SELECTED_WORK_SLUGS.map((slug) =>
    projects.find((p) => p.slug === slug)
  ).filter((p): p is Project => Boolean(p))

  const [featuredProject, ...regularProjects] = selectedProjects

  return (
    <section id="work" className="site-section">
      <div className="wrap">
        <h2 className="sec-h2">Selected work</h2>
        <p className="sec-sub">
          Each project shows the result first, then what I built and how.
        </p>

        <div className="works-home">
          {featuredProject && (
            <ProjectCard project={featuredProject} featured />
          )}
          {regularProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <p className="more-link">
          <Link href="/projects">See all projects</Link>
        </p>
      </div>
    </section>
  )
}
