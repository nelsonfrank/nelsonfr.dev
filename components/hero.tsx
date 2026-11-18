"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { captureEvent } from "@/lib/analytics"

export const AVAILABILITY_TEXT = "Available for full-time & freelance roles"

const SPEC_ROWS = [
  { label: "CURRENT", value: "Backend Dev @ NBC Bank" },
  { label: "EXPERIENCE", value: "7+ years in production" },
  { label: "CORE STACK", value: "TypeScript · Go · Java · Node.js" },
  { label: "BACKEND", value: "Spring Boot · NestJS · Postgres" },
  { label: "FRONTEND", value: "React · Next.js · Tailwind CSS" },
  { label: "INFRA", value: "Docker · Kubernetes · AWS" },
  { label: "BASE", value: "Dar es Salaam, TZ (Remote-ready)" },
] as const

export function Hero() {
  return (
    <section className="py-12 md:py-20">
      <div className="page-container animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
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

          {/* Right Column: Engineering Spec Card */}
          <aside
            aria-label="Engineering specification summary"
            className="lg:col-span-5 w-full rounded-md border border-border bg-card overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-border bg-background/60">
              <span className="meta-mono text-xs uppercase tracking-[0.06em] text-primary font-medium">
                PROFILE // SYS.SPEC
              </span>
              <span className="meta-mono text-xs">UTC+03</span>
            </div>

            <dl className="divide-y divide-border">
              {SPEC_ROWS.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[110px_1fr] gap-3 px-5 py-3 items-baseline"
                >
                  <dt className="meta-mono text-[11px] uppercase tracking-[0.05em]">
                    {row.label}
                  </dt>
                  <dd className="text-xs sm:text-sm font-mono text-foreground leading-snug">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  )
}
