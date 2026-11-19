import fs from "fs"
import path from "path"
import matter from "gray-matter"

const CONTENT_DIR = path.join(process.cwd(), "content/writing")

export interface PostMeta {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  project?: string
  highlightPhrase?: string
}

export interface Post extends PostMeta {
  content: string
}

function readMarkdownFile(slug: string): { data: Record<string, unknown>; content: string } | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)
  return { data, content }
}

function parseProjectSlug(val: unknown): string | undefined {
  if (typeof val !== "string") return undefined
  const trimmed = val.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function calculateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

const DEFAULT_HIGHLIGHTS: Record<string, string> = {
  "TOTP-authentication": "How It Works and How It's Built",
  "passkey-auth-as-multi-factor-auth-option": "Multi-Factor Authentication",
  "typescript-generics": "TypeScript Generics",
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename): PostMeta | null => {
      const slug = filename.replace(/\.md$/, "")
      const file = readMarkdownFile(slug)
      if (!file) return null

      const { data, content } = file
      const project = parseProjectSlug(data.project)
      const rawReadTime = typeof data.readTime === "string" ? data.readTime.trim() : ""
      const readTime = rawReadTime || calculateReadTime(content)
      const highlightPhrase =
        typeof data.highlightPhrase === "string" && data.highlightPhrase.trim()
          ? data.highlightPhrase.trim()
          : DEFAULT_HIGHLIGHTS[slug]

      return {
        slug,
        title: String(data.title ?? ""),
        excerpt: String(data.excerpt ?? ""),
        date: String(data.date ?? ""),
        readTime,
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
        ...(project ? { project } : {}),
        ...(highlightPhrase ? { highlightPhrase } : {}),
      }
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string): Post | undefined {
  const file = readMarkdownFile(slug)
  if (!file) return undefined

  const { data, content } = file
  const rawReadTime = typeof data.readTime === "string" ? data.readTime.trim() : ""
  const readTime = rawReadTime || calculateReadTime(content)
  const highlightPhrase =
    typeof data.highlightPhrase === "string" && data.highlightPhrase.trim()
      ? data.highlightPhrase.trim()
      : DEFAULT_HIGHLIGHTS[slug]

  return {
    slug,
    title: String(data.title ?? ""),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? ""),
    readTime,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    project: parseProjectSlug(data.project),
    ...(highlightPhrase ? { highlightPhrase } : {}),
    content,
  }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
}
