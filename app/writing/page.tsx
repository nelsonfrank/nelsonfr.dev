import type { Metadata } from "next"
import Link from "next/link"
import { getAllPosts } from "@/lib/posts"
import { Header } from "@/components/header"
import { FeaturedPostCard } from "@/components/featured-post-card"
import { NewsletterPanel } from "@/components/newsletter-panel"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
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
  const newestPost = posts[0]

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

      <Header />

      <main id="main-content">
        <div className="wrap">
          <header className="page-head">
            <h1>
              Notes from <span className="hl-word">real projects.</span>
            </h1>
            <p>
              Practical posts on authentication, backend architecture, and
              TypeScript. Written when a system ships.
            </p>
            <Link className="rss-link" href="/feed.xml">
              Subscribe with RSS
            </Link>
          </header>

          {newestPost && <FeaturedPostCard post={newestPost} />}

          <WritingClient posts={posts} />

          <NewsletterPanel />
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  )
}
