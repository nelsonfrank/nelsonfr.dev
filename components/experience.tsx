import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Experience as ExperienceItem } from "@/lib/experience"

export function Experience({ experiences = [] }: { experiences?: ExperienceItem[] }) {
  return (
    <section id="about" className="py-16 md:py-20 px-5 md:px-8 border-t border-border">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <h2 className="text-[28px] font-semibold tracking-tight text-foreground">
            Experience
          </h2>
          {/* TODO(content): Add /public/cv.pdf */}
          <Link
            href="/cv.pdf"
            className="inline-flex items-center gap-1.5 min-h-[44px] text-sm font-mono text-primary hover:underline"
          >
            Download CV (PDF)
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="divide-y divide-border border-t border-b border-border">
          {experiences.map((exp) => (
            <div
              key={exp.slug}
              className="grid gap-2 md:grid-cols-[180px_1fr] md:gap-8 py-4"
            >
              <div className="text-xs font-mono text-muted-foreground pt-1">
                {exp.period}
              </div>
              <div className="space-y-1">
                <h3 className="text-base text-foreground">
                  <span className="font-semibold">{exp.title}</span>
                  {" · "}
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
                  {exp.bullets[0] || exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
