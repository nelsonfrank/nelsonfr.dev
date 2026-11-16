"use client"

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react"
import Script from "next/script"

export interface TurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  theme?: "light" | "dark" | "auto"
}

export interface TurnstileRef {
  reset: () => void
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          "expired-callback"?: () => void
          "error-callback"?: () => void
          theme?: "light" | "dark" | "auto"
          [key: string]: unknown
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  ({ siteKey, onVerify, onExpire, onError, theme = "dark" }, ref) => {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    const [shouldLoadScript, setShouldLoadScript] = useState(false)
    const [scriptLoaded, setScriptLoaded] = useState(false)

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.reset(widgetIdRef.current)
          } catch (err) {
            console.error("Error resetting Turnstile widget:", err)
          }
        }
      },
    }))

    // Load script only when near viewport or when user focuses inside form
    useEffect(() => {
      if (typeof window === "undefined") return
      if (window.turnstile) {
        setShouldLoadScript(true)
        setScriptLoaded(true)
        return
      }

      const el = wrapperRef.current
      if (!el) return

      const triggerLoad = () => {
        setShouldLoadScript(true)
      }

      const form = el.closest("form")
      if (form) {
        form.addEventListener("focusin", triggerLoad, { once: true })
        form.addEventListener("pointerdown", triggerLoad, { once: true, passive: true })
      }

      let observer: IntersectionObserver | null = null
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              triggerLoad()
              observer?.disconnect()
            }
          },
          { rootMargin: "250px 0px" }
        )
        observer.observe(el)
      } else {
        triggerLoad()
      }

      return () => {
        observer?.disconnect()
        if (form) {
          form.removeEventListener("focusin", triggerLoad)
          form.removeEventListener("pointerdown", triggerLoad)
        }
      }
    }, [])

    useEffect(() => {
      if (!scriptLoaded || !containerRef.current) return

      const container = containerRef.current

      try {
        if (window.turnstile) {
          if (widgetIdRef.current) {
            window.turnstile.remove(widgetIdRef.current)
            widgetIdRef.current = null
          }

          const widgetId = window.turnstile.render(container, {
            sitekey: siteKey,
            callback: onVerify,
            "expired-callback": () => {
              if (onExpire) onExpire()
            },
            "error-callback": () => {
              if (onError) onError()
            },
            theme,
          })
          widgetIdRef.current = widgetId
        }
      } catch (err) {
        console.error("Failed to render Cloudflare Turnstile:", err)
        if (onError) onError()
      }

      return () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current)
          } catch {
            // ignore
          }
          widgetIdRef.current = null
        }
      }
    }, [siteKey, onVerify, onExpire, onError, theme, scriptLoaded])

    return (
      <div ref={wrapperRef} className="w-full min-h-[65px] flex items-center justify-center">
        {shouldLoadScript && (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onLoad={() => setScriptLoaded(true)}
          />
        )}
        <div ref={containerRef} className="w-full flex justify-center px-2 py-2" />
      </div>
    )
  }
)

Turnstile.displayName = "Turnstile"
