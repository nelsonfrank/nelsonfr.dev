"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Register once at module level — calling registerPlugin multiple times is harmless
// but wasteful; the guard above already ensures this only runs in the browser.
gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ScrollTrigger already listens to window resize and calls refresh()
    // internally with a 200ms debounce — no need to duplicate that here.

    return () => {
      // Kill all ScrollTrigger instances created by child components so they
      // don't leak or fire against stale / unmounted DOM nodes.
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return <div className="smooth-wrapper">{children}</div>
}
