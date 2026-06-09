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
  description: "Senior Frontend Developer specializing in React, TypeScript, and crafting delightful, data-rich web applications.",
}

export default function Page() {
  return (
    <>
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
