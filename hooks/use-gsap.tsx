"use client"

import { useEffect, useRef, useCallback } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Text split utility for character/word animations
export function useSplitText() {
  const splitText = useCallback((element: HTMLElement, type: "chars" | "words" | "lines" = "chars") => {
    const text = element.textContent || ""
    element.innerHTML = ""
    
    if (type === "chars") {
      const chars = text.split("")
      chars.forEach((char) => {
        const span = document.createElement("span")
        span.className = "inline-block"
        span.textContent = char === " " ? "\u00A0" : char
        element.appendChild(span)
      })
      return Array.from(element.children) as HTMLElement[]
    }
    
    if (type === "words") {
      const words = text.split(" ")
      words.forEach((word, i) => {
        const span = document.createElement("span")
        span.className = "inline-block"
        span.textContent = word
        element.appendChild(span)
        if (i < words.length - 1) {
          const space = document.createElement("span")
          space.innerHTML = "&nbsp;"
          element.appendChild(space)
        }
      })
      return Array.from(element.querySelectorAll("span:not(:empty)")) as HTMLElement[]
    }
    
    return [element]
  }, [])
  
  return { splitText }
}

// Fade up animation on scroll
export function useFadeUp<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    gsap.set(element, { opacity: 0, y: 60 })
    
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 85%",
      onEnter: () => {
        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        })
      },
    })
    
    return () => trigger.kill()
  }, [])
  
  return ref
}

// Staggered children animation
export function useStaggerChildren<T extends HTMLElement>(stagger = 0.1, delay = 0) {
  const ref = useRef<T>(null)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const children = Array.from(element.children) as HTMLElement[]
    gsap.set(children, { opacity: 0, y: 40 })
    
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      onEnter: () => {
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger,
          delay,
          ease: "power3.out",
        })
      },
    })
    
    return () => trigger.kill()
  }, [stagger, delay])
  
  return ref
}

// Parallax effect
export function useParallax<T extends HTMLElement>(speed = 0.5) {
  const ref = useRef<T>(null)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    gsap.to(element, {
      y: () => speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })
    
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [speed])
  
  return ref
}

// Magnetic button effect
export function useMagnetic<T extends HTMLElement>(strength = 0.5) {
  const ref = useRef<T>(null)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength
      
      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out",
      })
    }
    
    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      })
    }
    
    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseleave", handleMouseLeave)
    
    return () => {
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [strength])
  
  return ref
}

// Text reveal animation (character by character)
export function useTextReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const { splitText } = useSplitText()
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const chars = splitText(element, "chars")
    gsap.set(chars, { opacity: 0, y: 20 })
    
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 85%",
      onEnter: () => {
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: "power2.out",
        })
      },
    })
    
    return () => trigger.kill()
  }, [splitText])
  
  return ref
}

// Horizontal scroll reveal
export function useRevealFromLeft<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    gsap.set(element, { opacity: 0, x: -100 })
    
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 80%",
      onEnter: () => {
        gsap.to(element, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
        })
      },
    })
    
    return () => trigger.kill()
  }, [])
  
  return ref
}

// Scale up animation
export function useScaleUp<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    gsap.set(element, { opacity: 0, scale: 0.8 })
    
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 85%",
      onEnter: () => {
        gsap.to(element, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
      },
    })
    
    return () => trigger.kill()
  }, [])
  
  return ref
}

// Line draw animation for borders/underlines
export function useLineReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    gsap.set(element, { scaleX: 0, transformOrigin: "left center" })
    
    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 90%",
      onEnter: () => {
        gsap.to(element, {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
        })
      },
    })
    
    return () => trigger.kill()
  }, [])
  
  return ref
}
