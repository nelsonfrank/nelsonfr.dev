import fs from "fs"
import path from "path"
import type { Metadata } from "next"
import { getAllExperiences } from "@/lib/experience"
import { projects } from "@/lib/projects"
import { getAllPosts } from "@/lib/posts"
import ExperienceClient, { type CvFileMeta } from "./ExperienceClient"

export const metadata: Metadata = {
  title: {
    absolute: "Profile and CV · Nelson Frank",
  },
  description:
    "Full experience, skills with evidence, education, open-source work, and downloadable CV of Nelson Frank, full-stack and backend engineer in Dar es Salaam.",
  alternates: {
    canonical: "/experience",
  },
  openGraph: {
    title: "Profile and CV · Nelson Frank",
    description:
      "Full experience, skills with evidence, education, open-source work, and downloadable CV of Nelson Frank, full-stack and backend engineer in Dar es Salaam.",
    url: "https://nelsonfrank.dev/experience",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile and CV · Nelson Frank",
    description:
      "Full experience, skills with evidence, education, open-source work, and downloadable CV of Nelson Frank, full-stack and backend engineer in Dar es Salaam.",
  },
}

function getCvFileMeta(): CvFileMeta {
  const cvPath = path.join(process.cwd(), "public/cv.pdf")
  const previewPath = path.join(process.cwd(), "public/cv-preview.webp")
  const hasPreviewImage = fs.existsSync(previewPath)

  try {
    const stat = fs.statSync(cvPath)
    const rawBuffer = fs.readFileSync(cvPath)
    const rawStr = rawBuffer.toString("latin1")
    const pageMatches = rawStr.match(/\/Type\s*\/Page\b/g)
    const pages = pageMatches && pageMatches.length > 0 ? pageMatches.length : 2
    const sizeKb = Math.max(1, Math.round(stat.size / 1024))
    const updatedMonthYear = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(stat.mtime)

    return {
      url: "/cv.pdf",
      downloadName: "Nelson-Frank-CV.pdf",
      fileType: "PDF",
      pages,
      sizeKb: `${sizeKb} KB`,
      updated: `Updated ${updatedMonthYear}`,
      hasPreviewImage,
    }
  } catch {
    return {
      url: "/cv.pdf",
      downloadName: "Nelson-Frank-CV.pdf",
      fileType: "PDF",
      pages: 2,
      sizeKb: "[ADD: CV file size]",
      updated: "[ADD: CV last updated date]",
      hasPreviewImage,
    }
  }
}

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nelson Frank",
  url: "https://nelsonfrank.dev/experience",
  image: "https://nelsonfrank.dev/profile.png",
  jobTitle: "Full-stack & Backend Software Engineer",
  worksFor: {
    "@type": "Organization",
    name: "NBC Bank",
    url: "https://nbc.co.tz/",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dar es Salaam",
    addressCountry: "TZ",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Dar es Salaam",
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: "Bachelor of Science in Computer Science",
      recognizedBy: {
        "@type": "CollegeOrUniversity",
        name: "University of Dar es Salaam",
      },
    },
  ],
  description:
    "Full-stack and backend engineer in Dar es Salaam with 7+ years shipping distributed banking services, transit platforms, and modern web applications.",
  sameAs: [
    "https://github.com/nelsonfrank",
    "https://www.linkedin.com/in/nelson-frank-munissy/",
    "https://x.com/nelsonfr_",
  ],
}

export default function ExperiencePage() {
  const experiences = getAllExperiences()
  const posts = getAllPosts()
  const cvMeta = getCvFileMeta()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <ExperienceClient
        experiences={experiences}
        projects={projects}
        posts={posts}
        cvMeta={cvMeta}
      />
    </>
  )
}
