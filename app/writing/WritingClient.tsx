"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight, ArrowLeft, Search } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useFadeUp, useMagnetic } from "@/hooks/use-gsap"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import type { PostMeta } from "@/lib/posts"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

function PostRow({ post, index }: { post: PostMeta & { href: string }; index: number }) {
  const rowRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const el = rowRef.current
    if (!el) return

    gsap.set(el, { opacity: 0, x: -30 })

    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          delay: (index % 6) * 0.08,
          ease: "power3.out",
        })
      },
    })
  }, [index])

  return (
    <Link
      ref={rowRef}
      href={post.href}
      className="group flex flex-col md:flex-row md:items-start gap-4 md:gap-8 py-7 border-b border-border/50 hover:border-primary/40 transition-all duration-400 relative"
      data-cursor="Read"
    >
      <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top -ml-4" />

      <div className="shrink-0 md:w-44 space-y-1 pl-4 md:pl-0">
        <time className="block text-xs font-mono text-muted-foreground group-hover:text-primary/70 transition-colors duration-300">
          {post.date}
        </time>
        <span className="block text-xs text-muted-foreground/60">{post.readTime}</span>
      </div>

      <div className="flex-1 space-y-2 pl-4 md:pl-0">
        <h2 className="text-base md:text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300 flex items-start gap-2 text-balance leading-snug">
          <span>{post.title}</span>
          <ArrowUpRight className="size-4 shrink-0 mt-1 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
        </h2>
        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary/80 rounded-full group-hover:bg-primary/20 transition-colors duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
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

  const headingRef = useFadeUp<HTMLHeadingElement>()
  const backRef    = useMagnetic<HTMLAnchorElement>(0.3)
  const headerRef  = useRef<HTMLDivElement>(null)

  // Derive tags from the received posts
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort()

  // Add href to each post
  const allPosts = posts.map((p) => ({ ...p, href: `/writing/${p.slug}` }))

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    gsap.fromTo(
      header,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }
    )
  }, [])

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
      <CustomCursor />
      <SmoothScroll>
        <header
          ref={headerRef}
          className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border py-4 px-6"
        >
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <Link
              ref={backRef}
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Nelson Frank
            </Link>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="text-primary font-medium">Writing</span>
            </nav>
          </div>
        </header>

        <main className="pt-28 pb-24 px-6 min-h-screen">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16">
              <h1
                ref={headingRef}
                className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-4"
              >
                Writing
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Thoughts on software engineering, architecture, and the tools I use day to day.
              </p>
            </div>

            <div className="mb-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                <input
                  type="text"
                  placeholder="Search posts…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg py-2.5 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTag(null)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeTag === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  All
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      activeTag === tag
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs font-mono text-muted-foreground/60 mb-6">
              {filtered.length} {filtered.length === 1 ? "post" : "posts"}
            </p>

            <div>
              {filtered.length > 0 ? (
                filtered.map((post, i) => <PostRow key={post.slug} post={post} index={i} />)
              ) : (
                <div className="py-20 text-center text-muted-foreground">
                  <p className="text-lg">No posts found.</p>
                  <button
                    onClick={() => { setActiveTag(null); setQuery("") }}
                    className="mt-4 text-sm text-primary hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="border-t border-border/40 py-8 px-6">
          <div className="mx-auto max-w-6xl flex items-center justify-between">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Back home
            </Link>
            <p className="text-xs text-muted-foreground/50">Nelson Frank · {new Date().getFullYear()}</p>
          </div>
        </footer>
      </SmoothScroll>
    </>
  )
}
