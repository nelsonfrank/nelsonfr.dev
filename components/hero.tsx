"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { captureEvent } from "@/lib/analytics"

export const AVAILABILITY_TEXT = "Available for full-time & freelance roles"

const LEDGER_ITEMS = [
  {
    index: "01 / CURRENT",
    title: "NBC Bank",
    detail: "Backend Developer · Java & Spring Boot",
  },
  {
    index: "02 / EXPERIENCE",
    title: "7+ Years Shipping",
    detail: "End-to-end production systems & client delivery",
  },
  {
    index: "03 / CORE STACK",
    title: "TypeScript · Go · Java",
    detail: "Next.js · Node.js / NestJS · Spring Boot",
  },
  {
    index: "04 / INFRA & DATA",
    title: "Postgres · Redis · Cloud",
    detail: "Docker · Kubernetes · AWS · Microservices",
  },
] as const

export function Hero() {
  return (
    <section className="py-10 md:py-16">
      <div className="page-container animate-fade-in">
        <div className="rounded-md border border-border bg-background overflow-hidden">
          {/* Top Datasheet Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 sm:px-8 border-b border-border bg-card">
            <div className="flex items-center gap-2.5 meta-mono uppercase tracking-[0.05em]">
              <span className="text-foreground font-medium">FULL-STACK &amp; BACKEND ENGINEER</span>
              <span aria-hidden="true" className="text-border-strong">
                /
              </span>
              <span>DAR ES SALAAM · UTC+3</span>
            </div>

            {AVAILABILITY_TEXT && (
              <p className="eyebrow inline-flex items-center gap-2 text-xs">
                <span
                  className="inline-block size-2 rounded-full bg-primary shrink-0"
                  aria-hidden="true"
                />
                <span>{AVAILABILITY_TEXT}</span>
              </p>
            )}
          </div>

          {/* Main Editorial Cell */}
          <div className="px-5 py-10 sm:px-8 sm:py-12 md:px-10 md:py-16 space-y-6">
            <h1 className="text-[36px] md:text-[56px] font-bold tracking-[-0.03em] leading-[1.07] text-foreground max-w-[780px]">
              Full-stack engineer building reliable backend systems and modern web applications.
            </h1>

            <p className="text-[17px] md:text-[19px] leading-[1.6] text-muted-foreground max-w-[680px]">
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

          {/* Bottom 4-Cell Ledger Strip */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-border bg-card divide-y sm:divide-y-0 sm:divide-x divide-border">
            {LEDGER_ITEMS.map((item) => (
              <div
                key={item.index}
                className="px-5 py-4 sm:px-6 sm:py-5 space-y-1 border-b sm:border-b-0 lg:border-b-0 border-border last:border-b-0"
              >
                <dt className="meta-mono text-[11px] uppercase tracking-[0.06em] text-primary">
                  {item.index}
                </dt>
                <dd className="text-sm font-semibold text-foreground leading-snug pt-0.5">
                  {item.title}
                </dd>
                <dd className="meta-mono text-xs leading-normal">
                  {item.detail}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
