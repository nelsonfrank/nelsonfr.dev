import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { projects } from "@/lib/projects"
import { getProject } from "@/lib/projects-server"
import { getAllPosts } from "@/lib/posts"
import { markdownToHtml, extractHeadings } from "@/lib/markdown"
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
  const headings = project.content ? await extractHeadings(project.content) : []

  const allPosts = getAllPosts()
  const relatedArticles = (project.relatedPosts ?? [])
    .map((postSlug) => allPosts.find((p) => p.slug === postSlug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  const idx = projects.findIndex((p) => p.slug === slug)
  const explicitNext = project.nextProject
    ? projects.find((p) => p.slug === project.nextProject)
    : undefined
  const nextProject = explicitNext ?? projects[(idx + 1) % projects.length]

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

  const repoUrls =
    project.githubLinks && project.githubLinks.length > 0
      ? project.githubLinks.map((r) => r.url)
      : project.githubUrl && project.githubUrl !== "#"
        ? [project.githubUrl]
        : []
  const softwareSourceCodeJsonLd =
    repoUrls.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "SoftwareSourceCode",
          "name": project.title,
          "description": project.description,
          "codeRepository": repoUrls.length === 1 ? repoUrls[0] : repoUrls,
          "programmingLanguage": project.technologies,
          "author": {
            "@type": "Person",
            "name": "Nelson Frank",
            "url": "https://nelsonfrank.dev",
          },
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {softwareSourceCodeJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSourceCodeJsonLd) }}
        />
      )}
      <ProjectDetailsClient
        project={project}
        htmlContent={htmlContent}
        headings={headings}
        relatedArticles={relatedArticles}
        nextProject={nextProject}
      />
    </>
  )
}
