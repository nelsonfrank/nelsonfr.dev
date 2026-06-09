"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, Calendar, ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMagnetic } from "@/hooks/use-gsap"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import { getPost, getAllSlugs, posts, type PostSection } from "@/lib/posts"
import { use } from "react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// ─── Section Renderers ────────────────────────────────────────────────────────

function Paragraph({ text }: { text: string }) {
  return (
    <p className="text-foreground/80 leading-relaxed text-[1.05rem]">{text}</p>
  )
}

function Heading({ text }: { text: string }) {
  return (
    <h2 className="text-xl md:text-2xl font-semibold text-foreground mt-12 mb-4 first:mt-0">
      {text}
    </h2>
  )
}

function Subheading({ text }: { text: string }) {
  return (
    <h3 className="text-base md:text-lg font-medium text-foreground mt-8 mb-3">
      {text}
    </h3>
  )
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  return (
    <div className="relative group/code my-6">
      {/* Language badge */}
      <div className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-mono font-medium text-primary/60 bg-primary/10 rounded border border-primary/20 z-10">
        {lang}
      </div>
      <pre className="overflow-x-auto rounded-xl bg-secondary/60 border border-border/60 p-5 pr-16 text-sm leading-relaxed font-mono text-foreground/90 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <code>{code}</code>
      </pre>
      {/* Subtle gradient overlay on left edge */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-3 rounded-l-xl bg-linear-to-r from-secondary/60 to-transparent" />
    </div>
  )
}

function Callout({ variant, text }: { variant: "note" | "tip" | "warning"; text: string }) {
  const styles = {
    note: {
      border: "border-primary/30",
      bg: "bg-primary/5",
      label: "Note",
      labelColor: "text-primary",
      dot: "bg-primary",
    },
    tip: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/5",
      label: "Tip",
      labelColor: "text-emerald-400",
      dot: "bg-emerald-400",
    },
    warning: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/5",
      label: "Warning",
      labelColor: "text-amber-400",
      dot: "bg-amber-400",
    },
  }

  const s = styles[variant]

  return (
    <div className={`my-6 rounded-xl border ${s.border} ${s.bg} p-4 md:p-5`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${s.dot}`} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${s.labelColor}`}>
          {s.label}
        </span>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">{text}</p>
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="my-4 space-y-2.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-foreground/80 text-[1.05rem] leading-relaxed">
          <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Section({ section }: { section: PostSection }) {
  switch (section.type) {
    case "paragraph":  return <Paragraph text={section.text} />
    case "heading":    return <Heading text={section.text} />
    case "subheading": return <Subheading text={section.text} />
    case "code":       return <CodeBlock lang={section.lang} code={section.code} />
    case "callout":    return <Callout variant={section.variant} text={section.text} />
    case "list":       return <BulletList items={section.items} />
  }
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const update = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const pct = total > 0 ? (scrolled / total) * 100 : 0
      bar.style.width = `${pct}%`
    }

    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-60 h-0.5 bg-border/30">
      <div
        ref={barRef}
        className="h-full bg-primary transition-none"
        style={{ width: "0%" }}
      />
    </div>
  )
}

// ─── Post Page ────────────────────────────────────────────────────────────────

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const post = getPost(slug)

  if (!post) notFound()

  const headerRef = useRef<HTMLElement>(null)
  const heroRef   = useRef<HTMLDivElement>(null)
  const bodyRef   = useRef<HTMLDivElement>(null)
  const backRef   = useMagnetic<HTMLAnchorElement>(0.3)

  const postIndex = posts.findIndex((p) => p.slug === slug)
  const prevPost  = posts[postIndex - 1]
  const nextPost  = posts[postIndex + 1]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header slide in
      gsap.fromTo(
        headerRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )

      // Hero stagger
      if (heroRef.current) {
        const children = Array.from(heroRef.current.children)
        gsap.fromTo(
          children,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, delay: 0.1, ease: "power3.out" }
        )
      }

      // Body sections fade in on scroll
      if (bodyRef.current) {
        const sections = Array.from(bodyRef.current.children)
        sections.forEach((el, i) => {
          gsap.set(el, { opacity: 0, y: 30 })
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            onEnter: () => {
              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: 0.05,
                ease: "power3.out",
              })
            },
          })
        })
      }
    })

    return () => ctx.revert()
  }, [slug])

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
              {/* Tags */}
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

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-tight text-balance mb-6">
                {post.title}
              </h1>

              {/* Meta */}
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

              {/* Divider */}
              <div className="mt-10 h-px bg-gradient-to-r from-primary/40 via-border to-transparent" />
            </div>

            {/* Body */}
            <article ref={bodyRef} className="space-y-6">
              {post.content.map((section, i) => (
                <Section key={i} section={section} />
              ))}
            </article>

            {/* Bottom divider */}
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
