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

/** Extract h2/h3 headings from raw markdown for the sidebar TOC.
 *  Runs the same rehype-slug pipeline as markdownToHtml so the IDs
 *  are guaranteed to match what ends up in the rendered HTML.
 */
export async function extractHeadings(markdown: string): Promise<TocHeading[]> {
  const headings: TocHeading[] = []

  // Lightweight plugin — collects heading nodes after rehype-slug has added ids
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
  // Add language id as a data attribute we can use for the badge
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
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

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeExternalLinks)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown)

  return String(result)
}
