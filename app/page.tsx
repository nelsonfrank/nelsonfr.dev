import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Projects } from "@/components/projects"
import { Writing } from "@/components/writing"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { Preloader } from "@/components/preloader"
import { SmoothScroll } from "@/components/smooth-scroll"

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
          <Writing />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  )
}
