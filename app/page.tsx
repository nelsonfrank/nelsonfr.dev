import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Experience } from "@/components/experience"
import { Projects } from "@/components/projects"
import { Writing } from "@/components/writing"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { Preloader } from "@/components/preloader"
import { SmoothScroll } from "@/components/smooth-scroll"

export default function Page() {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <SmoothScroll>
        <Header />
        <main>
          <Hero />
          <Experience />
          <Projects />
          <Writing />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  )
}
