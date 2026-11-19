import type { Metadata } from "next"
import { projects } from "@/lib/projects"
import { Header } from "@/components/header"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
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

      <Header />

      <main id="main-content">
        <div className="wrap">
          <header className="page-head">
            <h1>
              Work that <span className="hl-word">shipped.</span>
            </h1>
            <p>
              Five engineering projects across web, mobile, developer tooling,
              and cloud infrastructure. Each page starts with the result, then
              shows the problem and how I built it.
            </p>
          </header>

          <ProjectsClient initialProjects={projects} />
        </div>

        <Contact />
      </main>

      <Footer />
    </>
  )
}
