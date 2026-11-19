import type { Metadata } from "next"
import { projects } from "@/lib/projects"
import ProjectsClient from "./ProjectsClient"

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected web, mobile, backend, and open-source engineering projects by Nelson Frank, each with the problem, the result, and how it was built.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Work · Nelson Frank",
    description:
      "Selected web, mobile, backend, and open-source engineering projects by Nelson Frank, each with the problem, the result, and how it was built.",
    url: "https://nelsonfrank.dev/projects",
    type: "website",
  },
}

export default function ProjectsPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Work · Nelson Frank",
    url: "https://nelsonfrank.dev/projects",
    description:
      "Selected web, mobile, backend, and open-source engineering projects by Nelson Frank.",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: `https://nelsonfrank.dev/projects/${project.slug}`,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <ProjectsClient initialProjects={projects} />
    </>
  )
}
