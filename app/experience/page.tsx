import type { Metadata } from "next"
import { getAllExperiences } from "@/lib/experience"
import ExperienceClient from "./ExperienceClient"

export const metadata: Metadata = {
  title: "About",
  description:
    "Full-stack software engineer in Dar es Salaam. My story, experience, skills, education, and how I work.",
  alternates: {
    canonical: "/experience",
  },
  openGraph: {
    title: "About · Nelson Frank",
    description:
      "Full-stack software engineer in Dar es Salaam. My story, experience, skills, education, and how I work.",
    url: "https://nelsonfrank.dev/experience",
    type: "website",
  },
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nelson Frank",
  url: "https://nelsonfrank.dev/experience",
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

export default function ExperiencePage() {
  const experiences = getAllExperiences()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <ExperienceClient experiences={experiences} />
    </>
  )
}
