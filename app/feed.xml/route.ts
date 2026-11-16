import { getAllPosts } from "@/lib/posts"

const SITE_URL = "https://nelsonfrank.dev"

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const posts = getAllPosts()

  const itemsXml = posts
    .map((post) => {
      const link = `${SITE_URL}/writing/${post.slug}`
      const parsedDate = new Date(post.date)
      const pubDate = isNaN(parsedDate.getTime())
        ? new Date().toUTCString()
        : parsedDate.toUTCString()

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${escapeXml(pubDate)}</pubDate>
    </item>`
    })
    .join("\n")

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nelson Frank — Writing</title>
    <link>${SITE_URL}/writing</link>
    <description>Technical articles and engineering write-ups by Nelson Frank.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
