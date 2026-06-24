import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { Preloader } from "@/components/preloader"
import { SmoothScroll } from "@/components/smooth-scroll"
import { getAllPosts } from "@/lib/posts"

// Dynamic imports with ssr: true to preserve SEO HTML indexing
const Projects = dynamic(() => import("@/components/projects").then((mod) => mod.Projects), {
  ssr: true,
})

const Writing = dynamic(() => import("@/components/writing").then((mod) => mod.Writing), {
  ssr: true,
})

const Contact = dynamic(() => import("@/components/contact").then((mod) => mod.Contact), {
  ssr: true,
})

// Dynamic import for client-side mouse interactive effects
const CustomCursor = dynamic(() => import("@/components/custom-cursor").then((mod) => mod.CustomCursor))


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
      <Preloader />
      <CustomCursor />
      <SmoothScroll>
        <Header />
        <main>
          <Hero />
          <Projects />
          <Writing posts={posts} />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  )
}
