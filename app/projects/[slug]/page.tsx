import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { projects } from "@/lib/projects"
import { getProject } from "@/lib/projects-server"
import { markdownToHtml } from "@/lib/markdown"
import ProjectDetailsClient from "./ProjectDetailsClient"

interface RouteParams {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: `${project.title} — Nelson Frank`,
    description: project.description,
    alternates: {
      canonical: "./",
    },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "website",
      url: `https://nelsonfrank.dev/projects/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
    },
  }
}

export default async function ProjectDetailsPage({ params }: RouteParams) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const htmlContent = project.content ? await markdownToHtml(project.content) : ""

  // Find next project to display as a teaser at the bottom of the page
  const idx = projects.findIndex((p) => p.slug === slug)
  const nextProject = projects[(idx + 1) % projects.length]

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
        "name": "Projects",
        "item": "https://nelsonfrank.dev/projects"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": project.title,
        "item": `https://nelsonfrank.dev/projects/${slug}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProjectDetailsClient project={project} htmlContent={htmlContent} nextProject={nextProject} />
    </>
  )
}
