import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Projects } from "@/components/projects"
import { Writing } from "@/components/writing"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { getAllPosts } from "@/lib/posts"

export const metadata: Metadata = {
  title: "Nelson Frank — Portfolio",
  description: "Fullstack software developer interested in tech and building robust software using latest technology.",
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Nelson Frank",
  "url": "https://nelsonfrank.dev",
  "image": "https://nelsonfrank.dev/profile.png",
  "jobTitle": "Fullstack Software Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance / Self-employed"
  },
  "description": "Fullstack software developer interested in tech and building robust software using latest technology.",
  "sameAs": [
    "https://github.com/nelsonfrank",
    "https://www.linkedin.com/in/nelson-frank-munissy/",
    "https://x.com/nelsonfr_"
  ]
}

export default function Page() {
  const posts = getAllPosts()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <Projects />
        <Writing posts={posts} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
