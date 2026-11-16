"use client"

import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Download, MapPin, Briefcase } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Experience } from "@/lib/experience"

function ExperienceCard({ exp }: { exp: Experience }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 md:p-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h2 className="text-[20px] font-semibold text-foreground leading-snug">
            {exp.title}
          </h2>
          {exp.companyUrl && exp.companyUrl !== "#" ? (
            <Link
              href={exp.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-sm mt-0.5"
            >
              {exp.company}
              <ArrowUpRight className="size-3.5" />
            </Link>
          ) : (
            <p className="text-sm text-muted-foreground mt-0.5">{exp.company}</p>
          )}
        </div>

        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
          {exp.period}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3 shrink-0" />
          {exp.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Briefcase className="size-3 shrink-0" />
          {exp.type}
        </span>
      </div>

      <div className="h-px bg-border" />

      <p className="text-muted-foreground text-sm leading-relaxed">
        {exp.description}
      </p>

      {exp.bullets.length > 0 && (
        <ul className="space-y-2">
          {exp.bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-foreground leading-relaxed"
            >
              <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
              {bullet}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-1.5 pt-2">
        {exp.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 text-xs font-mono bg-background text-muted-foreground rounded border border-border"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

interface ExperienceClientProps {
  experiences: Experience[]
}

export default function ExperienceClient({ experiences }: ExperienceClientProps) {
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
        "name": "Experience",
        "item": "https://nelsonfrank.dev/experience"
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main className="py-12 md:py-20 px-5 md:px-8 min-h-screen">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-12 max-w-[680px]">
            <Link
              href="/"
              className="inline-flex items-center gap-2 min-h-[44px] text-xs font-mono uppercase tracking-[0.05em] text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="size-3.5" />
              Home
            </Link>
            <h1 className="text-[36px] md:text-[60px] font-bold tracking-[-0.03em] leading-[1.08] text-foreground mb-4">
              Experience
            </h1>
            <p className="text-muted-foreground text-[17px] md:text-[19px] leading-[1.6] mb-6">
              A timeline of my professional engineering roles, teams and systems built.
            </p>

            {/* TODO(content): Add /public/cv.pdf */}
            <Link
              href="/cv.pdf"
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Download className="size-4" />
              Download CV (PDF)
            </Link>
          </div>

          <div className="space-y-6 max-w-[720px]">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.slug} exp={exp} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
