"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorTextRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    if (!cursor || !cursorDot) return

    // Hide on touch devices
    if ("ontouchstart" in window) {
      gsap.set([cursor, cursorDot], { autoAlpha: 0 })
      return
    }

    // quickTo reuses a single tween per axis — much more efficient than
    // calling gsap.set() inside a manually-driven RAF loop every frame.
    const cursorXTo = gsap.quickTo(cursor, "x", { duration: 0.55, ease: "power3.out" })
    const cursorYTo = gsap.quickTo(cursor, "y", { duration: 0.55, ease: "power3.out" })
    const dotXTo   = gsap.quickTo(cursorDot, "x", { duration: 0.2,  ease: "power3.out" })
    const dotYTo   = gsap.quickTo(cursorDot, "y", { duration: 0.2,  ease: "power3.out" })

    const handleMouseMove = (e: MouseEvent) => {
      cursorXTo(e.clientX)
      cursorYTo(e.clientY)
      dotXTo(e.clientX)
      dotYTo(e.clientY)

      // Handle hover state in the same listener to avoid a second mousemove registration
      const target = e.target as HTMLElement
      const interactive = target.closest("a, button, [data-cursor]")

      if (interactive) {
        gsap.to(cursor, { scale: 2, duration: 0.3, ease: "power2.out", overwrite: "auto" })
        gsap.to(cursorDot, { autoAlpha: 0, duration: 0.2, overwrite: "auto" })
        const cursorData = interactive.getAttribute("data-cursor")
        if (cursorTextRef.current) {
          cursorTextRef.current.textContent = cursorData ?? ""
          gsap.set(cursorTextRef.current, { autoAlpha: cursorData ? 1 : 0 })
        }
      } else {
        gsap.to(cursor, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" })
        gsap.to(cursorDot, { autoAlpha: 1, duration: 0.2, overwrite: "auto" })
        if (cursorTextRef.current) {
          cursorTextRef.current.textContent = ""
          gsap.set(cursorTextRef.current, { autoAlpha: 0 })
        }
      }
    }

    const handleMouseEnter = () =>
      gsap.to([cursor, cursorDot], { autoAlpha: 1, scale: 1, duration: 0.3 })

    const handleMouseLeave = () =>
      gsap.to([cursor, cursorDot], { autoAlpha: 0, duration: 0.3 })

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      // Kill quickTo tweens to avoid updates on unmounted nodes
      gsap.killTweensOf([cursor, cursorDot])
    }
  }, [])

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        style={{ willChange: "transform" }}
        className="fixed top-0 left-0 pointer-events-none z-9999 -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:flex w-10 h-10 items-center justify-center"
      >
        <div className="w-full h-full rounded-full border-2 border-white" />
        <span
          ref={cursorTextRef}
          className="absolute text-xs font-medium text-white whitespace-nowrap opacity-0 invisible"
        />
      </div>

      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        style={{ willChange: "transform" }}
        className="fixed top-0 left-0 pointer-events-none z-9999 -translate-x-1/2 -translate-y-1/2 hidden md:block"
      >
        <div className="w-1.5 h-1.5 bg-white rounded-full mix-blend-difference" />
      </div>
    </>
  )
}
