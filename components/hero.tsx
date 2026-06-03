"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useMagnetic, useParallax } from "@/hooks/use-gsap"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

function AnimatedButton({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  const magneticRef = useMagnetic<HTMLAnchorElement>(0.3)
  
  return (
    <Link
      ref={magneticRef}
      href={href}
      className={`group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden ${
        variant === "primary"
          ? "bg-primary text-primary-foreground"
          : "border border-border text-foreground hover:border-primary"
      }`}
      data-cursor="View"
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" && (
        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      )}
    </Link>
  )
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const blob1Ref = useParallax<HTMLDivElement>(-0.3)
  const blob2Ref = useParallax<HTMLDivElement>(-0.5)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 2.8 })

      // Greeting animation
      tl.fromTo(
        ".hero-greeting",
        { opacity: 0, y: 30, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.8, ease: "power3.out" }
      )

      // Name reveal with split text effect
      if (headingRef.current) {
        const text = headingRef.current.textContent || ""
        headingRef.current.innerHTML = text
          .split("")
          .map((char) => `<span class="inline-block">${char === " " ? "&nbsp;" : char}</span>`)
          .join("")

        const chars = headingRef.current.querySelectorAll("span")
        tl.fromTo(
          chars,
          { opacity: 0, y: 80, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )
      }

      // Subtitle slide in
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      )

      // Description fade up
      tl.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      )

      // CTA buttons stagger
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current.children,
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        )
      }

      // Image reveal with mask effect
      tl.fromTo(
        imageRef.current,
        { clipPath: "inset(100% 0 0 0)", opacity: 0 },
        {
          clipPath: "inset(0% 0 0 0)",
          opacity: 1,
          duration: 1.2,
          ease: "power3.inOut",
        },
        "-=1"
      )

      // Parallax scroll for blobs
      gsap.to(blob1Ref.current, {
        y: -100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })

      gsap.to(blob2Ref.current, {
        y: -150,
        x: 50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [blob1Ref, blob2Ref])

  return (
    <section ref={sectionRef} id="about" className="pt-32 pb-20 px-6 min-h-screen flex items-center overflow-hidden">
      <div className="mx-auto max-w-6xl w-full">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="hero-greeting text-primary font-medium opacity-0">Hello, I&apos;m</p>
              <h1
                ref={headingRef}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight"
                style={{ perspective: "1000px" }}
              >
                Nelson Frank
              </h1>
              <p
                ref={subtitleRef}
                className="text-2xl md:text-3xl text-muted-foreground font-light opacity-0"
              >
                Fullstack Software Developer
              </p>
            </div>

            <p
              ref={descriptionRef}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl opacity-0"
            >
              I build accessible, pixel-perfect digital experiences for the web.
              Passionate about crafting robust software using latest technologies,
              with a focus on performance, usability, and clean code.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4">
              <AnimatedButton href="#contact">
                Get in Touch
                <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </AnimatedButton>
              <AnimatedButton href="#projects" variant="secondary">
                View Projects
              </AnimatedButton>
            </div>
          </div>

          <div className="relative">
            <div ref={imageRef} className="relative aspect-square max-w-md mx-auto opacity-0">
              {/* Animated decorative blobs */}
              <div
                ref={blob1Ref}
                className="absolute -top-8 -right-8 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse"
              />
              <div
                ref={blob2Ref}
                className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary/20 rounded-full blur-2xl"
              />

              {/* Profile image with hover effect */}
              <div className="relative z-10 aspect-square rounded-2xl bg-gradient-to-br from-secondary to-muted overflow-hidden border border-border group cursor-pointer">
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-28 h-28 mx-auto rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500">
                      <span className="text-5xl font-bold text-primary">NF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 opacity-0 animate-fade-in" style={{ animationDelay: "4s", animationFillMode: "forwards" }}>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </div>
    </section>
  )
}
