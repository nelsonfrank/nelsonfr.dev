"use client"

import Link from "next/link"
import { ArrowLeft, Github, ExternalLink, ArrowUpRight, FolderGit2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { captureEvent } from "@/lib/analytics"
import type { Project } from "@/lib/projects"

interface ProjectDetailsClientProps {
  project: Project
  htmlContent: string
  nextProject: Project
}

export default function ProjectDetailsClient({
  project,
  htmlContent,
  nextProject,
}: ProjectDetailsClientProps) {
  return (
    <>
      <Header />

      <main className="py-12 md:py-20 px-5 md:px-8 min-h-screen">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-10 border-b border-border pb-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 min-h-[44px] text-xs font-mono uppercase tracking-[0.05em] text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="size-3.5" />
              All projects
            </Link>
            <h1 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.08] text-foreground mb-4">
              {project.title}
            </h1>
            <p className="text-muted-foreground text-[17px] md:text-[19px] max-w-[720px] leading-[1.6]">
              {project.description}
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_240px]">
            <div className="max-w-[720px] min-w-0 space-y-8">
              {htmlContent ? (
                <article
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : (
                <div className="py-16 text-center border border-dashed border-border rounded-lg bg-card">
                  <FolderGit2 className="size-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">Detailed case study in preparation.</p>
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <div className="border border-border bg-card p-6 rounded-lg space-y-4">
                <div>
                  <h2 className="text-xs font-mono text-primary uppercase tracking-[0.05em] mb-2">
                    Stack
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs font-mono bg-background text-muted-foreground rounded border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  {project.liveUrl && project.liveUrl !== "#" && (
                    <Link
                      href={project.liveUrl}
                      onClick={() => {
                        captureEvent("project_live_website_visited", {
                          project_title: project.title,
                          live_url: project.liveUrl,
                        })
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[44px] bg-primary text-primary-foreground text-xs font-mono py-2.5 px-4 rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    >
                      Live
                      <ExternalLink className="size-3.5" />
                    </Link>
                  )}
                  {project.githubUrl && project.githubUrl !== "#" && (
                    <Link
                      href={project.githubUrl}
                      onClick={() => {
                        captureEvent("project_source_code_viewed", {
                          project_title: project.title,
                          github_url: project.githubUrl,
                        })
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[44px] bg-background border border-border hover:border-primary text-foreground text-xs font-mono py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                      GitHub
                      <Github className="size-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <Link
              href={`/projects/${nextProject.slug}`}
              onClick={() => {
                captureEvent("next_project_clicked", {
                  current_project: project.title,
                  next_project: nextProject.title,
                  next_slug: nextProject.slug,
                })
              }}
              className="group inline-flex items-center gap-3 min-h-[44px] text-foreground hover:text-primary transition-colors"
            >
              <span className="text-xs font-mono uppercase tracking-[0.05em] text-muted-foreground">
                Next project:
              </span>
              <span className="text-base font-medium">{nextProject.title}</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
