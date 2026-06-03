"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useFadeUp, useMagnetic } from "@/hooks/use-gsap"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const posts = [
  {
    title: "Get Started On GraphQL Query And Mutation",
    excerpt:
      "Learn the fundamentals of GraphQL queries and mutations. A comprehensive guide to getting started with GraphQL in your projects.",
    date: "April 8, 2023",
    tags: ["API", "GraphQL", "fundamentals"],
    slug: "/blog/graphql-query-mutation",
  },
  {
    title: "A Step-By-Step Guide To Setting Up A Node.js And Express App With TypeScript",
    excerpt:
      "Everything you need to know about setting up a modern Node.js and Express application with TypeScript, from scratch to production.",
    date: "January 27, 2024",
    tags: ["API", "Node.js", "TypeScript"],
    slug: "/blog/nodejs-express-typescript",
  },
  {
    title: "Building Scalable React Applications",
    excerpt:
      "Best practices and patterns for building scalable React applications that are maintainable and performant.",
    date: "March 15, 2024",
    tags: ["React", "Architecture", "Performance"],
    slug: "/blog/scalable-react",
  },
]

function PostCard({ post, index }: { post: typeof posts[0]; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    gsap.set(card, { opacity: 0, x: index % 2 === 0 ? -50 : 50 })

    ScrollTrigger.create({
      trigger: card,
      start: "top 85%",
      onEnter: () => {
        gsap.to(card, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power3.out",
        })
      },
    })
  }, [index])

  return (
    <Link
      ref={cardRef}
      href={post.slug}
      className="group block p-6 -mx-6 rounded-lg hover:bg-secondary/50 transition-all duration-500 relative overflow-hidden"
      data-cursor="Read"
    >
      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary/30 transition-colors duration-500" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <article className="grid gap-4 md:grid-cols-[200px_1fr] md:gap-8 relative">
        <time className="text-sm text-muted-foreground font-mono group-hover:text-primary/70 transition-colors duration-300">
          {post.date}
        </time>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300 flex items-start gap-2">
            <span className="text-balance">{post.title}</span>
            <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shrink-0 mt-1" />
          </h3>

          <p className="text-muted-foreground line-clamp-2 group-hover:text-muted-foreground/80 transition-colors duration-300">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full group-hover:bg-primary/20 transition-colors duration-300"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}

export function Writing() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useFadeUp<HTMLHeadingElement>()
  const viewAllRef = useMagnetic<HTMLAnchorElement>(0.3)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const line = lineRef.current
    if (!line) return

    gsap.set(line, { scaleX: 0, transformOrigin: "left center" })

    ScrollTrigger.create({
      trigger: line,
      start: "top 90%",
      onEnter: () => {
        gsap.to(line, {
          scaleX: 1,
          duration: 1.5,
          ease: "power3.inOut",
        })
      },
    })
  }, [])

  return (
    <section ref={sectionRef} id="writing" className="py-20 px-6">
      <div className="mx-auto max-w-6xl">
        <h2
          ref={headingRef}
          className="text-sm font-medium text-primary uppercase tracking-wider mb-12 relative inline-block"
        >
          Writing
          <span ref={lineRef} className="absolute -bottom-2 left-0 w-full h-px bg-primary" />
        </h2>

        <div className="space-y-2">
          {posts.map((post, index) => (
            <PostCard key={index} post={post} index={index} />
          ))}
        </div>

        <Link
          ref={viewAllRef}
          href="/blog"
          className="inline-flex items-center gap-2 mt-12 text-foreground font-medium hover:text-primary transition-colors group"
          data-cursor="Explore"
        >
          View All Posts
          <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
