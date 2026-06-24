import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeStringify from "rehype-stringify"
import type { Options as PrettyCodeOptions } from "rehype-pretty-code"

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
    .use(rehypePrettyCode, prettyCodeOptions)
    .use(rehypeExternalLinks)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown)

  return String(result)
}
