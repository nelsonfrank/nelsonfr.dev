import type { Metadata } from "next"
import { getAllPosts } from "@/lib/posts"
import WritingClient from "./WritingClient"

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Practical engineering posts on authentication, distributed systems, and TypeScript by Nelson Frank.",
  alternates: {
    canonical: "/writing",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    title: "Writing · Nelson Frank",
    description:
      "Practical engineering posts on authentication, distributed systems, and TypeScript by Nelson Frank.",
    url: "https://nelsonfrank.dev/writing",
    type: "website",
  },
}

export default function WritingPage() {
  const posts = getAllPosts()

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Writing · Nelson Frank",
    url: "https://nelsonfrank.dev/writing",
    description:
      "Practical engineering posts on authentication, distributed systems, and TypeScript by Nelson Frank.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: `https://nelsonfrank.dev/writing/${post.slug}`,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <WritingClient posts={posts} />
    </>
  )
}
