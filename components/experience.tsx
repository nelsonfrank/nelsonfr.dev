import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Experience as ExperienceItem } from "@/lib/experience"

export function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  return (
    <section id="about" className="py-16 md:py-20 border-t border-border">
      <div className="page-container">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
          <h2 className="text-[28px] font-semibold tracking-tight text-foreground">
            Experience
          </h2>
          <Link
            href="/cv.pdf"
            className="inline-flex items-center gap-1.5 min-h-[44px] text-xs font-mono uppercase tracking-[0.05em] text-primary hover:underline"
          >
            <span>Download CV (PDF)</span>
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="divide-y divide-border border-t border-b border-border">
          {experiences.map((exp) => {
            const summaryLine = exp.bullets[0] || exp.description
            return (
              <div
                key={exp.slug}
                className="grid gap-1.5 md:grid-cols-[180px_1fr] md:gap-8 py-4"
              >
                <div className="meta-mono pt-0.5">{exp.period}</div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-base text-foreground leading-snug">
                    <span className="font-semibold">{exp.title}</span>
                    <span className="text-muted-foreground"> · </span>
                    {exp.companyUrl && exp.companyUrl !== "#" ? (
                      <Link
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {exp.company}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">{exp.company}</span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {summaryLine}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
