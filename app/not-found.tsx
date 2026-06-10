"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import gsap from "gsap"
import { CustomCursor } from "@/components/custom-cursor"
import { Preloader } from "@/components/preloader"
import { useMagnetic } from "@/hooks/use-gsap"

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<SVGSVGElement>(null)
  const digit1Ref = useRef<HTMLSpanElement>(null)
  const digit2Ref = useRef<HTMLSpanElement>(null)
  const digit3Ref = useRef<HTMLSpanElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonWrapperRef = useRef<HTMLDivElement>(null)
  
  const floater1Ref = useRef<HTMLDivElement>(null)
  const floater2Ref = useRef<HTMLDivElement>(null)
  const floater3Ref = useRef<HTMLDivElement>(null)
  const floater4Ref = useRef<HTMLDivElement>(null)
  const floater5Ref = useRef<HTMLDivElement>(null)

  const magneticBtnRef = useMagnetic<HTMLAnchorElement>(0.35)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Staggered reveal timeline
      const tl = gsap.timeline({ delay: 0.6 })

      tl.fromTo(
        [digit1Ref.current, digit2Ref.current, digit3Ref.current],
        { opacity: 0, scale: 0.6, y: 50, rotateX: -45 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0, 
          rotateX: 0, 
          duration: 1, 
          stagger: 0.1, 
          ease: "back.out(1.5)" 
        }
      )

      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )

      tl.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4"
      )

      tl.fromTo(
        buttonWrapperRef.current,
        { opacity: 0, scale: 0.9, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(2)" },
        "-=0.3"
      )

      // Fade-in floating variables
      tl.fromTo(
        [floater1Ref.current, floater2Ref.current, floater3Ref.current, floater4Ref.current, floater5Ref.current],
        { opacity: 0 },
        { opacity: 1, duration: 1, stagger: 0.1, ease: "power2.out" },
        "-=0.5"
      )

      // 2. Slow looping float animations for comments / variable tokens
      const floatHelpers = [
        { ref: floater1Ref, y: 15, x: 10, rot: 5, dur: 4 },
        { ref: floater2Ref, y: -20, x: -12, rot: -8, dur: 5 },
        { ref: floater3Ref, y: 12, x: -8, rot: 6, dur: 3.5 },
        { ref: floater4Ref, y: -15, x: 15, rot: -4, dur: 4.5 },
        { ref: floater5Ref, y: 18, x: -10, rot: 7, dur: 4.8 },
      ]

      floatHelpers.forEach((f) => {
        if (f.ref.current) {
          gsap.to(f.ref.current, {
            y: `+=${f.y}`,
            x: `+=${f.x}`,
            rotation: `+=${f.rot}`,
            duration: f.dur,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          })
        }
      })

      // 3. Parallax mouse tracking setup
      const container = containerRef.current
      if (!container) return

      // Pre-create quickTo tweens for silky smooth animations
      const d1X = gsap.quickTo(digit1Ref.current, "x", { duration: 0.8, ease: "power2.out" })
      const d1Y = gsap.quickTo(digit1Ref.current, "y", { duration: 0.8, ease: "power2.out" })
      
      const d2X = gsap.quickTo(digit2Ref.current, "x", { duration: 0.8, ease: "power2.out" })
      const d2Y = gsap.quickTo(digit2Ref.current, "y", { duration: 0.8, ease: "power2.out" })
      
      const d3X = gsap.quickTo(digit3Ref.current, "x", { duration: 0.8, ease: "power2.out" })
      const d3Y = gsap.quickTo(digit3Ref.current, "y", { duration: 0.8, ease: "power2.out" })

      const gridX = gsap.quickTo(gridRef.current, "x", { duration: 1.2, ease: "power2.out" })
      const gridY = gsap.quickTo(gridRef.current, "y", { duration: 1.2, ease: "power2.out" })

      const float1X = gsap.quickTo(floater1Ref.current, "x", { duration: 1, ease: "power2.out" })
      const float1Y = gsap.quickTo(floater1Ref.current, "y", { duration: 1, ease: "power2.out" })

      const float2X = gsap.quickTo(floater2Ref.current, "x", { duration: 1, ease: "power2.out" })
      const float2Y = gsap.quickTo(floater2Ref.current, "y", { duration: 1, ease: "power2.out" })

      const handleMouseMove = (e: MouseEvent) => {
        // Calculate coordinate range: -1 to 1
        const xVal = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)
        const yVal = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)

        // Apply distinct parallax multiplier layers for depth
        d1X(xVal * 30)
        d1Y(yVal * 30)

        d2X(xVal * -15)
        d2Y(yVal * -15)

        d3X(xVal * 45)
        d3Y(yVal * 45)

        gridX(xVal * 8)
        gridY(yVal * 8)

        float1X(xVal * 20)
        float1Y(yVal * 20)

        float2X(xVal * -25)
        float2Y(yVal * -25)
      }

      window.addEventListener("mousemove", handleMouseMove)

      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
      }

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      <Preloader />
      <CustomCursor />
      <main
        ref={containerRef}
        className="min-h-screen w-full bg-background flex flex-col items-center justify-center text-center p-6 relative overflow-hidden grain font-sans text-white select-none"
        style={{ perspective: "1200px" }}
      >
        {/* SVG Mesh Star Grid Backdrop */}
        <svg
          ref={gridRef}
          className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] opacity-[0.035] pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridPattern)" />
        </svg>

        {/* Ambient Glowing Celestial Core */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full blur-[90px] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)",
            willChange: "transform",
          }}
        />

        {/* Floating Variable Debris */}
        <div
          ref={floater1Ref}
          className="absolute text-[11px] font-mono text-primary/40 pointer-events-none hidden md:block"
          style={{ top: "25%", left: "18%" }}
        >
          {"// status: 404"}
        </div>
        <div
          ref={floater2Ref}
          className="absolute text-[11px] font-mono text-accent/30 pointer-events-none hidden md:block"
          style={{ top: "32%", right: "16%" }}
        >
          {"const page = undefined;"}
        </div>
        <div
          ref={floater3Ref}
          className="absolute text-[11px] font-mono text-white/20 pointer-events-none hidden md:block"
          style={{ bottom: "38%", left: "14%" }}
        >
          {"return null;"}
        </div>
        <div
          ref={floater4Ref}
          className="absolute text-[11px] font-mono text-primary/30 pointer-events-none hidden md:block"
          style={{ bottom: "28%", right: "22%" }}
        >
          {"void 0;"}
        </div>
        <div
          ref={floater5Ref}
          className="absolute text-[11px] font-mono text-accent/40 pointer-events-none hidden md:block"
          style={{ top: "16%", left: "44%" }}
        >
          {"// lost in translation"}
        </div>

        {/* Dynamic 3D Parallax Digits Container */}
        <div 
          className="flex flex-row items-center justify-center gap-1 font-mono text-[160px] md:text-[220px] font-black tracking-tighter relative leading-none select-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          <span 
            ref={digit1Ref} 
            className="text-gradient inline-block"
            style={{ 
              willChange: "transform",
              textShadow: "0 0 45px rgba(20, 184, 166, 0.25)"
            }}
          >
            4
          </span>
          <span 
            ref={digit2Ref} 
            className="text-white inline-block px-1"
            style={{ 
              willChange: "transform",
              textShadow: "0 0 25px rgba(255, 255, 255, 0.15)"
            }}
          >
            0
          </span>
          <span 
            ref={digit3Ref} 
            className="text-gradient inline-block"
            style={{ 
              willChange: "transform",
              textShadow: "0 0 45px rgba(20, 184, 166, 0.25)"
            }}
          >
            4
          </span>
        </div>

        {/* Content Wrapper */}
        <div className="max-w-md space-y-6 relative z-20 mt-8">
          <div className="space-y-3">
            <h2
              ref={headingRef}
              className="text-xl md:text-2xl font-bold uppercase tracking-[0.25em] text-foreground"
            >
              Lost in the Void
            </h2>
            <p
              ref={descriptionRef}
              className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm mx-auto"
            >
              The page you are looking for has evaporated. Go back home before the vacuum consumes your session.
            </p>
          </div>

          <div ref={buttonWrapperRef} className="flex justify-center pt-2">
            <Link
              ref={magneticBtnRef}
              href="/"
              className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground transition-all duration-300 relative overflow-hidden shadow-lg shadow-primary/20 hover:shadow-primary/30"
              data-cursor="Home"
            >
              <span className="relative z-10 flex items-center gap-2 font-mono text-sm tracking-wide">
                <ArrowLeft className="size-4 relative top-[-1px] group-hover:-translate-x-0.5 transition-transform" />
                {"// Return to safety"}
              </span>
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Lower footer tag */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-widest text-muted-foreground/45 select-none">
          SYSTEM_ERROR_VOID_RECOVERY_MODE
        </div>
      </main>
    </>
  )
}
