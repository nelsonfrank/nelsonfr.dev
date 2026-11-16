"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { captureEvent } from "@/lib/analytics"

export function Hero() {
  return (
    <section id="hero" className="py-16 md:py-24 px-5 md:px-8">
      <div className="mx-auto max-w-[1080px] animate-fade-in">
        <div className="max-w-[720px] space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.05em] text-primary">
            <span className="inline-block size-2 rounded-full bg-primary" aria-hidden="true" />
            <span>Available for [freelance / full-time]</span>
          </div>

          <h1 className="text-[36px] md:text-[60px] font-bold tracking-[-0.03em] leading-[1.08] text-foreground">
            Fullstack engineer building secure auth, transit backends and cloud infrastructure.
          </h1>

          <p className="text-[17px] md:text-[19px] leading-[1.6] text-muted-foreground max-w-[680px]">
            TypeScript, Go and Python on Kubernetes. Based in Dar es Salaam, working with teams worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="#work"
              onClick={() => captureEvent("cta_see_work_clicked")}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity duration-200"
            >
              See my work
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="#contact"
              onClick={() => captureEvent("cta_get_in_touch_clicked")}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:border-primary hover:text-primary transition-colors duration-200"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
