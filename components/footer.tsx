"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Github, Linkedin, Twitter } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMagnetic } from "@/hooks/use-gsap"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

function SocialIcon({ href, icon: Icon, label }: { href: string; icon: typeof Github; label: string }) {
  const ref = useMagnetic<HTMLAnchorElement>(0.4)

  return (
    <Link
      ref={ref}
      href={href}
      className="text-muted-foreground hover:text-primary transition-colors duration-300 p-2 hover:bg-primary/10 rounded-lg"
      aria-label={label}
    >
      <Icon className="size-5" />
    </Link>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  const footerRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const line = lineRef.current
    const content = contentRef.current
    if (!line || !content) return

    gsap.set(line, { scaleX: 0, transformOrigin: "center center" })
    gsap.set(content, { opacity: 0, y: 20 })

    ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top 95%",
      onEnter: () => {
        gsap.to(line, { scaleX: 1, duration: 1.2, ease: "power3.inOut" })
        gsap.to(content, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" })
      },
    })
  }, [])

  return (
    <footer ref={footerRef} className="py-12 px-6">
      <div className="mx-auto max-w-6xl">
        <div ref={lineRef} className="h-px bg-border mb-12" />
        
        <div ref={contentRef} className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link
              href="/"
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors duration-300 group"
            >
              Nelson Frank
              <span className="block h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-300" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Fullstack Software Developer
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SocialIcon href="https://github.com" icon={Github} label="GitHub" />
            <SocialIcon href="https://linkedin.com" icon={Linkedin} label="LinkedIn" />
            <SocialIcon href="https://twitter.com" icon={Twitter} label="Twitter" />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Nelson Frank. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Built with Next.js, Tailwind CSS & GSAP
          </p>
        </div>
      </div>
    </footer>
  )
}
