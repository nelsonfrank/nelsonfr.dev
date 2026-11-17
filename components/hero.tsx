"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { captureEvent } from "@/lib/analytics"

export const AVAILABILITY_TEXT = "Available for full-time & freelance roles"

export function Hero() {
  return (
    <section className="py-14 md:py-24">
      <div className="page-container animate-fade-in">
        <div className="max-w-[720px] space-y-6">
          {AVAILABILITY_TEXT && (
            <p className="eyebrow inline-flex items-center gap-2.5">
              <span
                className="inline-block size-2 rounded-full bg-primary shrink-0"
                aria-hidden="true"
              />
              <span>{AVAILABILITY_TEXT}</span>
            </p>
          )}

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
              className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity duration-200"
            >
              <span>See my work</span>
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="#contact"
              onClick={() => captureEvent("cta_get_in_touch_clicked")}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-md border border-border bg-card text-foreground text-sm font-medium hover:border-primary hover:text-primary transition-colors duration-200"
            >
              <span>Get in touch</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
