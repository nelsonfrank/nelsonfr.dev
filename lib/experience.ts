import fs from "fs"
import path from "path"
import matter from "gray-matter"

const CONTENT_DIR = path.join(process.cwd(), "content/experience")

export interface Experience {
  slug: string
  title: string
  company: string
  companyUrl: string
  period: string
  location: string
  type: string
  technologies: string[]
  order: number
  /** Bullet-point lines parsed from the markdown body */
  bullets: string[]
  /** Full markdown body (for rich rendering if needed) */
  description: string
}

export function getAllExperiences(): Experience[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "")
      const filePath = path.join(CONTENT_DIR, filename)
      const raw = fs.readFileSync(filePath, "utf-8")
      const { data, content } = matter(raw)

      // Parse bullet lines (lines starting with "- ")
      const bullets = content
        .split("\n")
        .filter((l) => l.trimStart().startsWith("- "))
        .map((l) => l.replace(/^\s*-\s*/, "").trim())

      // First paragraph (before bullet lines) as the description
      const description = content
        .split("\n")
        .filter((l) => l.trim() && !l.trimStart().startsWith("- "))
        .join(" ")
        .trim()

      return {
        slug,
        title: String(data.title ?? ""),
        company: String(data.company ?? ""),
        companyUrl: String(data.companyUrl ?? "#"),
        period: String(data.period ?? ""),
        location: String(data.location ?? ""),
        type: String(data.type ?? ""),
        technologies: Array.isArray(data.technologies) ? (data.technologies as string[]) : [],
        order: Number(data.order ?? 99),
        bullets,
        description,
      }
    })
    .sort((a, b) => a.order - b.order)
}
