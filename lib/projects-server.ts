import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { type Project, type ProjectDecision, type ProjectLink, projects } from "./projects"

const PROJECTS_CONTENT_DIR = path.join(process.cwd(), "content/projects")

function nonEmptyString(val: unknown): string | undefined {
  if (typeof val !== "string") return undefined
  const trimmed = val.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function stringArray(val: unknown): string[] | undefined {
  if (!Array.isArray(val)) return undefined
  const items = val
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0)
  return items.length > 0 ? items : undefined
}

function parseProjectLinks(val: unknown): ProjectLink[] | undefined {
  if (!Array.isArray(val)) return undefined
  const items: ProjectLink[] = []
  for (const raw of val) {
    if (raw && typeof raw === "object") {
      const rec = raw as Record<string, unknown>
      const label = nonEmptyString(rec.label)
      const url = nonEmptyString(rec.url)
      if (label && url && url !== "#") {
        items.push({ label, url })
      }
    }
  }
  return items.length > 0 ? items : undefined
}

function parseDecisions(val: unknown): ProjectDecision[] | undefined {
  if (!Array.isArray(val)) return undefined
  const items: ProjectDecision[] = []
  for (const raw of val) {
    if (raw && typeof raw === "object") {
      const rec = raw as Record<string, unknown>
      const decision = nonEmptyString(rec.decision)
      const tradeoff = nonEmptyString(rec.tradeoff)
      const summary = nonEmptyString(rec.summary)
      if (decision && tradeoff) {
        items.push(summary ? { decision, summary, tradeoff } : { decision, tradeoff })
      }
    }
  }
  return items.length > 0 ? items : undefined
}

export function getProject(slug: string): Project | undefined {
  const staticProject = projects.find((p) => p.slug === slug)
  if (!staticProject) return undefined

  const filePath = path.join(PROJECTS_CONTENT_DIR, `${slug}.md`)
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8")
      const { data, content } = matter(raw)

      let diagram = staticProject.diagram
      if (
        data.diagram &&
        typeof data.diagram === "object" &&
        Array.isArray((data.diagram as { nodes?: unknown }).nodes) &&
        (data.diagram as { nodes: unknown[] }).nodes.length === 3
      ) {
        const nodes = (data.diagram as { nodes: unknown[] }).nodes.map((n) => String(n))
        diagram = { nodes: [nodes[0], nodes[1], nodes[2]] }
      }

      return {
        ...staticProject,
        title: nonEmptyString(data.title) ?? staticProject.title,
        description: nonEmptyString(data.description) ?? staticProject.description,
        technologies: stringArray(data.technologies) ?? staticProject.technologies,
        liveUrl: nonEmptyString(data.liveUrl) ?? staticProject.liveUrl,
        githubUrl: nonEmptyString(data.githubUrl) ?? staticProject.githubUrl,
        githubLinks: parseProjectLinks(data.githubLinks) ?? staticProject.githubLinks,
        category: nonEmptyString(data.category) ?? staticProject.category,
        outcome: nonEmptyString(data.outcome) ?? staticProject.outcome,
        architectureImage: nonEmptyString(data.architectureImage) ?? staticProject.architectureImage,
        diagram,
        role: nonEmptyString(data.role) ?? staticProject.role,
        year: nonEmptyString(data.year) ?? staticProject.year,
        problem: nonEmptyString(data.problem) ?? staticProject.problem,
        result: nonEmptyString(data.result) ?? staticProject.result,
        myPart: nonEmptyString(data.myPart) ?? staticProject.myPart,
        decisions: parseDecisions(data.decisions) ?? staticProject.decisions,
        results: stringArray(data.results) ?? staticProject.results,
        relatedPosts: stringArray(data.relatedPosts) ?? staticProject.relatedPosts,
        nextProject: nonEmptyString(data.nextProject) ?? staticProject.nextProject,
        content,
      }
    } catch (err) {
      console.error(`Error reading project markdown for ${slug}:`, err)
    }
  }

  return staticProject
}
