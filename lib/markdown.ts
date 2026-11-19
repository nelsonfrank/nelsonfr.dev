import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import rehypeStringify from "rehype-stringify"
import type { Options as PrettyCodeOptions } from "rehype-pretty-code"

export interface TocHeading {
  id: string
  text: string
  level: number // 2 = h2, 3 = h3
}

/**
 * Normalizes heading levels inside markdown content so every page maintains a
 * strict h1 -> h2 -> h3 hierarchy beneath the page's single h1:
 * 1. Any h1 inside markdown body is demoted to h2.
 * 2. If the document has no h2 elements (e.g. starts at h3/h4), h3 becomes h2
 *    and h4 becomes h3 so heading levels never skip from h1 to h3.
 */
function rehypeNormalizeHeadings() {
  return (tree: any) => {
    let hasH1OrH2 = false

    const scan = (node: any) => {
      if (node.type === "element" && (node.tagName === "h1" || node.tagName === "h2")) {
        hasH1OrH2 = true
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(scan)
      }
    }
    scan(tree)

    const transform = (node: any) => {
      if (node.type === "element") {
        if (node.tagName === "h1") {
          node.tagName = "h2"
        } else if (!hasH1OrH2) {
          if (node.tagName === "h3") node.tagName = "h2"
          else if (node.tagName === "h4") node.tagName = "h3"
        }
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(transform)
      }
    }
    transform(tree)
  }
}

export async function extractHeadings(markdown: string): Promise<TocHeading[]> {
  const headings: TocHeading[] = []

  function collectHeadings() {
    return (tree: any) => {
      const visit = (node: any) => {
        if (
          node.type === "element" &&
          /^h[23]$/.test(node.tagName) &&
          node.properties?.id
        ) {
          const level = parseInt(node.tagName[1], 10)
          const text = extractText(node)
          headings.push({ id: node.properties.id as string, text, level })
        }
        if (node.children) node.children.forEach(visit)
      }
      visit(tree)
    }
  }

  function extractText(node: any): string {
    if (node.type === "text") return node.value
    if (node.children) return node.children.map(extractText).join("")
    return ""
  }

  await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeNormalizeHeadings)
    .use(rehypeSlug)
    .use(collectHeadings)
    .use(rehypeStringify)
    .process(markdown)

  return headings
}

const prettyCodeOptions: PrettyCodeOptions = {
  theme: "github-dark-dimmed",
  keepBackground: true,
  defaultLang: "plaintext",
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }]
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className?.push("highlighted")
  },
}

function rehypeExternalLinks() {
  return (tree: any) => {
    const visit = (node: any) => {
      if (node.type === "element" && node.tagName === "a") {
        const href = node.properties?.href
        if (typeof href === "string" && (href.startsWith("http://") || href.startsWith("https://"))) {
          node.properties = {
            ...node.properties,
            target: "_blank",
            rel: "noopener noreferrer",
          }
        }
      }
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(visit)
      }
    }
    visit(tree)
  }
}

function rehypeMermaid() {
  return (tree: any) => {
    const visit = (node: any, parent: any, index: number) => {
      if (
        node.type === "element" &&
        node.tagName === "pre" &&
        Array.isArray(node.children)
      ) {
        const code = node.children.find(
          (c: any) =>
            c.type === "element" &&
            c.tagName === "code" &&
            (c.properties?.className ?? []).includes("language-mermaid")
        )
        if (code) {
          const raw = code.children
            .filter((c: any) => c.type === "text")
            .map((c: any) => c.value)
            .join("")

          parent.children[index] = {
            type: "element",
            tagName: "div",
            properties: { className: ["mermaid-block"] },
            children: [
              {
                type: "element",
                tagName: "script",
                properties: { type: "application/mermaid" },
                children: [{ type: "text", value: raw }],
              },
            ],
          }
        }
      }
      if (node.children) {
        node.children.forEach((child: any, i: number) => visit(child, node, i))
      }
    }
    visit(tree, null, 0)
  }
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeNormalizeHeadings)
    .use(rehypeSlug)
    .use(rehypeMermaid)
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeExternalLinks)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown)

  return String(result)
}
