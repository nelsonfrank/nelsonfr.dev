"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize smooth scroll
    const wrapper = wrapperRef.current
    const content = contentRef.current
    if (!wrapper || !content) return

    // Set up smooth scrolling with GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div ref={wrapperRef} className="smooth-wrapper">
      <div ref={contentRef} className="smooth-content">
        {children}
      </div>
    </div>
  )
}
