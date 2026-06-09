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
}

export interface Post extends PostMeta {
  content: string // raw markdown body
}

function readMarkdownFile(slug: string): { data: Record<string, unknown>; content: string } | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)
  return { data, content }
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "")
      const file = readMarkdownFile(slug)
      if (!file) return null

      const { data } = file
      return {
        slug,
        title: String(data.title ?? ""),
        excerpt: String(data.excerpt ?? ""),
        date: String(data.date ?? ""),
        readTime: String(data.readTime ?? ""),
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      }
    })
    .filter((p): p is PostMeta => p !== null)
}

export function getPost(slug: string): Post | undefined {
  const file = readMarkdownFile(slug)
  if (!file) return undefined

  const { data, content } = file
  return {
    slug,
    title: String(data.title ?? ""),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? ""),
    readTime: String(data.readTime ?? ""),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
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
