import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Projects } from "@/components/projects"
import { Writing } from "@/components/writing"
import { Experience } from "@/components/experience"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { getAllPosts } from "@/lib/posts"
import { getAllExperiences } from "@/lib/experience"

export const metadata: Metadata = {
  title: "Nelson Frank · Full-stack software engineer",
  description:
    "Full-stack software engineer in Dar es Salaam with 7+ years building reliable backend systems, web platforms, and mobile apps in TypeScript, Go, Java, and Next.js.",
  alternates: {
    canonical: "/",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nelson Frank",
  url: "https://nelsonfrank.dev",
  image: "https://nelsonfrank.dev/profile.png",
  jobTitle: "Full-stack Software Engineer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dar es Salaam",
    addressCountry: "TZ",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Dar es Salaam",
  },
  description:
    "Full-stack software engineer in Dar es Salaam with 7+ years building reliable backend systems, web platforms, and mobile apps.",
  sameAs: [
    "https://github.com/nelsonfrank",
    "https://www.linkedin.com/in/nelson-frank-munissy/",
    "https://x.com/nelsonfr_",
  ],
}

export default function Page() {
  const posts = getAllPosts().slice(0, 3)
  const experiences = getAllExperiences()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main id="main-content">
        <Hero />
        <Projects />
        <Experience experiences={experiences} />
        <Writing posts={posts} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
