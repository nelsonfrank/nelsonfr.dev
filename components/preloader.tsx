"use client"

import { useEffect, useState } from "react"
import gsap from "gsap"

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("preloader-shown") === "true") {
      setIsLoading(false)
      return
    }

    // Animate counter
    const counter = { value: 0 }
    gsap.to(counter, {
      value: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        setCount(Math.round(counter.value))
      },
      onComplete: () => {
        // Animate out the preloader
        const tl = gsap.timeline({
          onComplete: () => {
            setIsLoading(false)
            sessionStorage.setItem("preloader-shown", "true")
          },
        })

        tl.to(".preloader-text", {
          y: -50,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        })
          .to(".preloader-bar", {
            scaleX: 1,
            duration: 0.3,
            ease: "power2.out",
          })
          .to(".preloader", {
            yPercent: -100,
            duration: 0.8,
            ease: "power3.inOut",
          })
      },
    })

    return () => {
      gsap.killTweensOf(counter)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="preloader fixed inset-0 z-10000 bg-background flex flex-col items-center justify-center">
      <div className="preloader-text flex flex-col items-center gap-4">
        <span className="text-6xl md:text-8xl font-bold text-foreground tabular-nums">
          {count}%
        </span>
        <span className="text-sm text-muted-foreground uppercase tracking-widest">
          Loading
        </span>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted overflow-hidden">
        <div 
          className="preloader-bar h-full bg-primary origin-left"
          style={{ transform: `scaleX(${count / 100})` }}
        />
      </div>
    </div>
  )
}

