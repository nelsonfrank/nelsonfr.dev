"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [cursorText, setCursorText] = useState("")

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    if (!cursor || !cursorDot) return

    // Check for touch device
    if ("ontouchstart" in window) {
      setIsHidden(true)
      return
    }

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0
    let dotX = 0
    let dotY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleMouseEnter = () => setIsHidden(false)
    const handleMouseLeave = () => setIsHidden(true)

    // Animate cursor with lag
    const animate = () => {
      // Main cursor follows with smooth lag
      cursorX += (mouseX - cursorX) * 0.15
      cursorY += (mouseY - cursorY) * 0.15
      
      // Dot follows more quickly
      dotX += (mouseX - dotX) * 0.35
      dotY += (mouseY - dotY) * 0.35

      gsap.set(cursor, { x: cursorX, y: cursorY })
      gsap.set(cursorDot, { x: dotX, y: dotY })

      requestAnimationFrame(animate)
    }
    animate()

    // Handle hover states
    const handleLinkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest("a, button, [data-cursor]")
      
      if (interactive) {
        setIsHovering(true)
        const cursorData = interactive.getAttribute("data-cursor")
        if (cursorData) {
          setCursorText(cursorData)
        }
      } else {
        setIsHovering(false)
        setCursorText("")
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousemove", handleLinkHover)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousemove", handleLinkHover)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  if (isHidden) return null

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-all duration-300 ease-out hidden md:flex items-center justify-center ${
          isHovering ? "w-20 h-20" : "w-10 h-10"
        }`}
      >
        <div
          className={`rounded-full border-2 border-white transition-all duration-300 ${
            isHovering ? "w-full h-full scale-100" : "w-full h-full"
          }`}
        />
        {cursorText && (
          <span className="absolute text-xs font-medium text-white whitespace-nowrap">
            {cursorText}
          </span>
        )}
      </div>
      
      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block transition-opacity duration-200 ${
          isHovering ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-1.5 h-1.5 bg-white rounded-full mix-blend-difference" />
      </div>
    </>
  )
}
