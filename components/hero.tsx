"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
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
      <span className="relative z-10 flex items-center gap-2">{children}</span>
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
  const techRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const blob1Ref = useParallax<HTMLDivElement>(-0.3)
  const blob2Ref = useParallax<HTMLDivElement>(-0.5)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const preloaderShown = typeof window !== "undefined" && sessionStorage.getItem("preloader-shown") === "true"
      const startDelay = preloaderShown ? 0.5 : 3.4
      const tl = gsap.timeline({ delay: startDelay })

      // Badge reveal
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, scale: 0.8, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(2)" }
      )

      // Greeting animation
      tl.fromTo(
        ".hero-greeting",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )

      // Name reveal with split text effect
      if (headingRef.current) {
        const text = "Nelson Frank"
        headingRef.current.innerHTML = text
          .split("")
          .map((char) => `<span class="inline-block">${char === " " ? "&nbsp;" : char}</span>`)
          .join("")

        const chars = headingRef.current.querySelectorAll("span")
        tl.fromTo(
          chars,
          { opacity: 0, y: 40, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.02,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )
      }

      // Subtitle slide in
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )

      // Description fade up
      tl.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )

      // CTA buttons stagger
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current.children,
          { opacity: 0, y: 15, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.4"
        )
      }

      // Tech stack reveal
      if (techRef.current) {
        tl.fromTo(
          techRef.current.children,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
          "-=0.4"
        )
      }

      // Image reveal with mask effect
      tl.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0, rotate: -5 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1,
          ease: "expo.out",
        },
        "-=1.2"
      )

      // Continuous floating animation for image
      gsap.to(imageRef.current, {
        y: -15,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const techStack = [
    "React", "Next.js", "TypeScript", "Tailwind CSS", "Zustand", "React Query", "Node.js", "PostgreSQL", "AWS", "D3.js"
  ]

  return (
    <section ref={sectionRef} id="about" className="relative pt-32 pb-20 px-6 min-h-screen flex items-center overflow-hidden grain">
      <div className="mx-auto max-w-6xl w-full relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div ref={badgeRef} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium opacity-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Available for new opportunities
              </div>
              
              <div className="space-y-2">
                <p className="hero-greeting text-muted-foreground font-medium opacity-0 tracking-wider uppercase text-sm">Welcome to my space</p>
                <h1
                  ref={headingRef}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gradient py-2"
                  style={{ perspective: "1000px" }}
                >
                  Nelson Frank
                </h1>
                <p
                  ref={subtitleRef}
                  className="text-2xl md:text-3xl text-foreground font-light opacity-0"
                >
                  Architecting <span className="font-medium">Seamless Digital</span> Experiences
                </p>
              </div>
            </div>

            <p
              ref={descriptionRef}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl opacity-0"
            >
              I bridge the gap between complex engineering and elegant design. 
              Specializing in building high-performance, accessible web applications 
              that leave a lasting impression.
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4">
              <AnimatedButton href="#contact">
                Start a Project
                <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </AnimatedButton>
              <AnimatedButton href="#projects" variant="secondary">
                View Work
              </AnimatedButton>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Main Stack</p>
              <div ref={techRef} className="flex flex-wrap gap-3">
                {techStack.map((tech) => (
                  <span 
                    key={tech} 
                    className="px-3 py-1 rounded-md text-xs font-medium glass-dark text-muted-foreground opacity-0 hover:text-primary hover:border-primary/50 transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative lg:h-150 flex items-center justify-center">
            {/* Background decorative elements */}
            <div
              ref={blob1Ref}
              className="absolute top-1/4 -right-12 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse-glow"
            />
            <div
              ref={blob2Ref}
              className="absolute bottom-1/4 -left-12 w-64 h-64 bg-accent/20 rounded-full blur-[80px]"
            />

            <div ref={imageRef} className="relative aspect-square w-full max-w-xl opacity-0">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
              <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden group">
                <Image 
                  src="/landing-page.png"
                  alt="Nelson Frank Abstract Portfolio"
                  fill
                  priority
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, 576px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <p className="text-white/80 text-sm font-light italic">
                    "Design is not just what it looks like and feels like. Design is how it works."
                  </p>
                </div>
              </div>
              
              {/* Floating glass card */}
              <div className="absolute -bottom-6 -right-6 md:-bottom-20 md:-right-20 p-6 glass rounded-2xl shadow-2xl z-20 animate-float hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">NF</div>
                  <div>
                    <h4 className="text-sm font-bold">Nelson Frank</h4>
                    <p className="text-xs text-muted-foreground">Portfolio 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: "2.5s", animationFillMode: "forwards" }}>
          <span className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-semibold">Explore</span>
          <div className="w-px h-16 bg-linear-to-b from-primary via-primary/50 to-transparent" />
        </div>
      </div>
    </section>
  )
}
