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

// Global window Turnstile type definition
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
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<string | null>(null)
    const [scriptLoaded, setScriptLoaded] = useState(false)

    // Expose the reset function to parent components
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

    // Check if the script is already loaded on mount
    useEffect(() => {
      if (typeof window !== "undefined" && window.turnstile) {
        setScriptLoaded(true)
      }
    }, [])

    useEffect(() => {
      if (!scriptLoaded || !containerRef.current) return

      const container = containerRef.current

      try {
        if (window.turnstile) {
          // If there is an existing widget, clean it up first
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
          } catch (err) {
            // ignore
          }
          widgetIdRef.current = null
        }
      }
    }, [siteKey, onVerify, onExpire, onError, theme, scriptLoaded])

    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setScriptLoaded(true)}
        />
        <div ref={containerRef} className="w-full flex justify-center py-2" />
      </>
    )
  }
)

Turnstile.displayName = "Turnstile"
