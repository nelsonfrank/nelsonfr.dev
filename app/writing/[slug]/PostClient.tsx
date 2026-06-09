"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMagnetic } from "@/hooks/use-gsap"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import type { PostMeta } from "@/lib/posts"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Reading Progress Bar ─────────────────────────────────────────────────────

function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const update = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : "0%"
    }
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-60 h-0.5 bg-border/30">
      <div ref={barRef} className="h-full bg-primary transition-none" style={{ width: "0%" }} />
    </div>
  )
}

// ─── Post Client ──────────────────────────────────────────────────────────────

interface PostClientProps {
  post: PostMeta
  htmlContent: string
  prevPost: PostMeta | null
  nextPost: PostMeta | null
}

export default function PostClient({ post, htmlContent, prevPost, nextPost }: PostClientProps) {
  const headerRef = useRef<HTMLElement>(null)
  const heroRef   = useRef<HTMLDivElement>(null)
  const bodyRef   = useRef<HTMLDivElement>(null)
  const backRef   = useMagnetic<HTMLAnchorElement>(0.3)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )

      if (heroRef.current) {
        gsap.fromTo(
          Array.from(heroRef.current.children),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, delay: 0.1, ease: "power3.out" }
        )
      }

      if (bodyRef.current) {
        gsap.fromTo(
          bodyRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, delay: 0.5, ease: "power3.out" }
        )
      }
    })

    return () => ctx.revert()
  }, [post.slug])

  return (
    <>
      <ReadingProgress />
      <CustomCursor />
      <SmoothScroll>
        {/* Header */}
        <header
          ref={headerRef}
          className="fixed top-0.5 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border py-4 px-6"
        >
          <div className="mx-auto max-w-3xl flex items-center justify-between">
            <Link
              ref={backRef}
              href="/writing"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
              data-cursor="Back"
            >
              <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Writing
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Nelson Frank
            </Link>
          </div>
        </header>

        <main className="pt-28 pb-24 px-6 min-h-screen">
          <div className="mx-auto max-w-3xl">

            {/* Hero */}
            <div ref={heroRef} className="mb-14">
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-tight text-balance mb-6">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {post.date}
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {post.readTime}
                </span>
              </div>

              <div className="mt-10 h-px bg-gradient-to-r from-primary/40 via-border to-transparent" />
            </div>

            {/* Rendered markdown body */}
            <article
              ref={bodyRef}
              className="prose"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            <div className="mt-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Prev / Next navigation */}
            <nav className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost ? (
                <Link
                  href={`/writing/${prevPost.slug}`}
                  className="group flex flex-col gap-1 p-5 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/30 transition-all duration-300"
                >
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform duration-300" />
                    Previous
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {prevPost.title}
                  </span>
                </Link>
              ) : <div />}

              {nextPost ? (
                <Link
                  href={`/writing/${nextPost.slug}`}
                  className="group flex flex-col items-end gap-1 p-5 rounded-xl border border-border hover:border-primary/40 hover:bg-secondary/30 transition-all duration-300"
                >
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    Next
                    <ArrowUpRight className="size-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors text-right line-clamp-2">
                    {nextPost.title}
                  </span>
                </Link>
              ) : <div />}
            </nav>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/40 py-8 px-6">
          <div className="mx-auto max-w-3xl flex items-center justify-between">
            <Link
              href="/writing"
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5 group"
            >
              <ArrowLeft className="size-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
              All posts
            </Link>
            <p className="text-xs text-muted-foreground/50">Nelson Frank · {new Date().getFullYear()}</p>
          </div>
        </footer>
      </SmoothScroll>
    </>
  )
}
