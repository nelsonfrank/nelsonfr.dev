import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { type Project, projects } from "./projects"

const PROJECTS_CONTENT_DIR = path.join(process.cwd(), "content/projects")

export function getProject(slug: string): Project | undefined {
  const staticProject = projects.find((p) => p.slug === slug)
  if (!staticProject) return undefined

  // Try to load detailed markdown content if it exists
  const filePath = path.join(PROJECTS_CONTENT_DIR, `${slug}.md`)
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8")
      const { data, content } = matter(raw)
      return {
        ...staticProject,
        // Override/extend with markdown frontmatter if specified
        title: String(data.title ?? staticProject.title),
        description: String(data.description ?? staticProject.description),
        technologies: Array.isArray(data.technologies) ? (data.technologies as string[]) : staticProject.technologies,
        liveUrl: data.liveUrl !== undefined ? String(data.liveUrl) : staticProject.liveUrl,
        githubUrl: data.githubUrl !== undefined ? String(data.githubUrl) : staticProject.githubUrl,
        category: String(data.category ?? staticProject.category),
        content,
      }
    } catch (err) {
      console.error(`Error reading project markdown for ${slug}:`, err)
    }
  }

  return staticProject
}
