"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { captureEvent } from "@/lib/analytics"

export const AVAILABILITY_TEXT = "Available for full-time & freelance roles"

export function Hero() {
  return (
    <section className="py-12 md:py-20">
      <div className="page-container animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {AVAILABILITY_TEXT && (
              <p className="eyebrow inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-border bg-card">
                <span
                  className="inline-block size-2 rounded-full bg-primary shrink-0"
                  aria-hidden="true"
                />
                <span>{AVAILABILITY_TEXT}</span>
              </p>
            )}

            <h1 className="text-[36px] md:text-[52px] font-bold tracking-[-0.03em] leading-[1.08] text-foreground">
              Full-stack engineer building reliable backend systems and modern web applications.
            </h1>

            <p className="text-[17px] md:text-[19px] leading-[1.6] text-muted-foreground max-w-[640px]">
              7+ years shipping production software end to end in TypeScript, Go, Java, Spring Boot, and Next.js — from distributed banking and transit services to fast, maintainable interfaces.
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

          {/* Right Column: Editorial Portrait Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <figure className="w-full max-w-[380px] rounded-md border border-border bg-card overflow-hidden">
              <div className="relative aspect-square w-full bg-background/50">
                <Image
                  src="/landing-page.png"
                  alt="Nelson Frank — Full-Stack and Backend Engineer"
                  width={600}
                  height={600}
                  priority
                  sizes="(max-width: 768px) 340px, 380px"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-card">
                <span className="text-xs font-medium text-foreground">
                  Nelson Frank
                </span>
                <span className="meta-mono text-xs">
                  Dar es Salaam · UTC+3
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
