"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { PostMeta } from "@/lib/posts"

function PostRow({ post }: { post: PostMeta & { href: string } }) {
  return (
    <Link
      href={post.href}
      className="group flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-8 py-5 border-b border-border hover:border-primary transition-colors duration-200 min-h-[44px]"
    >
      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 min-w-0">
        <div className="shrink-0 md:w-40 flex items-center gap-3 md:block">
          <time className="block text-xs font-mono text-muted-foreground">
            {post.date}
          </time>
          <span className="block text-xs font-mono text-muted-foreground/70">{post.readTime}</span>
        </div>

        <div className="space-y-1.5 min-w-0">
          <h2 className="text-[18px] font-medium text-foreground group-hover:text-primary transition-colors duration-200 leading-snug">
            {post.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-2 max-w-[680px]">{post.excerpt}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 shrink-0">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs font-mono text-muted-foreground border border-border rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

interface WritingClientProps {
  posts: PostMeta[]
}

export default function WritingClient({ posts }: WritingClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()
  const allPosts = posts.map((p) => ({ ...p, href: `/writing/${p.slug}` }))

  const filtered = allPosts.filter((p) => {
    const matchTag = !activeTag || p.tags.includes(activeTag)
    const q = query.toLowerCase()
    const matchQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    return matchTag && matchQuery
  })

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://nelsonfrank.dev"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Writing",
        "item": "https://nelsonfrank.dev/writing"
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main className="py-12 md:py-20 px-5 md:px-8 min-h-screen">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 min-h-[44px] text-xs font-mono uppercase tracking-[0.05em] text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="size-3.5" />
              Home
            </Link>
            <h1 className="text-[36px] md:text-[60px] font-bold tracking-[-0.03em] leading-[1.08] text-foreground mb-4">
              Writing
            </h1>
            <p className="text-muted-foreground text-[17px] md:text-[19px] max-w-[680px] leading-[1.6]">
              Technical articles and architecture notes on authentication, backend systems and TypeScript.
            </p>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-6 border-b border-border">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search posts…"
                aria-label="Search posts"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full min-h-[44px] bg-input border border-border rounded-md py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={`min-h-[44px] px-3 py-1.5 rounded-md text-xs font-mono border transition-colors duration-200 cursor-pointer ${
                  activeTag === null
                    ? "bg-primary border-primary text-primary-foreground font-medium"
                    : "bg-card border-border text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`min-h-[44px] px-3 py-1.5 rounded-md text-xs font-mono border transition-colors duration-200 cursor-pointer ${
                    activeTag === tag
                      ? "bg-primary border-primary text-primary-foreground font-medium"
                      : "bg-card border-border text-muted-foreground hover:border-primary hover:text-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs font-mono text-muted-foreground mb-4">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </p>

          <div className="border-t border-border">
            {filtered.length > 0 ? (
              filtered.map((post) => <PostRow key={post.slug} post={post} />)
            ) : (
              <div className="py-16 text-center text-muted-foreground">
                <p className="text-base">No posts found.</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTag(null)
                    setQuery("")
                  }}
                  className="mt-4 min-h-[44px] px-4 text-sm font-mono text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
