"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Turnstile, type TurnstileRef } from "./turnstile"
import {
  captureEvent,
  captureError,
  getPostHogHeaders,
  identifyUser,
} from "@/lib/analytics"

export default function ContactForm() {
  const turnstileRef = useRef<TurnstileRef>(null)
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string; email: string; message: string }>()

  const onSubmit = async (data: {
    name: string
    email: string
    message: string
  }) => {
    setStatusMessage(null)
    if (siteKey && !captchaToken) {
      const msg = "Please complete the verification check before sending."
      setStatusMessage({ type: "error", text: msg })
      toast.error(msg)
      return
    }

    try {
      const { distinctId, sessionId } = await getPostHogHeaders(data.email)
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-PostHog-Distinct-ID": distinctId,
          "X-PostHog-Session-ID": sessionId,
        },
        body: JSON.stringify({
          ...data,
          captchaToken,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        import("@sentry/nextjs")
          .then((Sentry) => {
            Sentry.metrics.count("contact_form_success", 1)
          })
          .catch(() => {})

        identifyUser(data.email, {
          name: data.name,
          email: data.email,
        })

        captureEvent("contact_form_submitted", {
          name: data.name,
          email: data.email,
        })

        const msg =
          result.message ||
          "Your message was sent. I will reply within 24 hours."
        setStatusMessage({ type: "success", text: msg })
        toast.success(msg)
        reset()
        setCaptchaToken(null)
        turnstileRef.current?.reset()
      } else {
        const msg =
          result.error ||
          "Could not send your message. Please try again or email me directly."
        setStatusMessage({ type: "error", text: msg })
        toast.error(msg)
        setCaptchaToken(null)
        turnstileRef.current?.reset()
      }
    } catch (error) {
      captureError(error as Error)
      const msg =
        "Network error while sending. Please check your connection or email me directly."
      setStatusMessage({ type: "error", text: msg })
      toast.error(msg)
      setCaptchaToken(null)
      turnstileRef.current?.reset()
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        marginTop: "1.75rem",
        maxWidth: "36rem",
        display: "grid",
        gap: "1rem",
      }}
    >
      <div>
        <label
          htmlFor="name"
          style={{
            display: "block",
            fontWeight: 600,
            fontSize: "0.9rem",
            marginBottom: "0.35rem",
            color: "var(--paper)",
          }}
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: "Please enter your name." })}
          placeholder="Your name"
          style={{
            width: "100%",
            minHeight: "44px",
            padding: "0.7rem 1rem",
            borderRadius: "6px",
            border: "1px solid var(--line)",
            background: "var(--paper)",
            color: "var(--ink)",
            font: "400 1rem var(--display)",
          }}
        />
        {errors.name && (
          <p
            style={{
              margin: "0.3rem 0 0",
              fontSize: "0.85rem",
              color: "var(--marigold)",
            }}
          >
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          style={{
            display: "block",
            fontWeight: 600,
            fontSize: "0.9rem",
            marginBottom: "0.35rem",
            color: "var(--paper)",
          }}
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register("email", {
            required: "Please enter your email address.",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address.",
            },
          })}
          placeholder="you@example.com"
          style={{
            width: "100%",
            minHeight: "44px",
            padding: "0.7rem 1rem",
            borderRadius: "6px",
            border: "1px solid var(--line)",
            background: "var(--paper)",
            color: "var(--ink)",
            font: "400 1rem var(--display)",
          }}
        />
        {errors.email && (
          <p
            style={{
              margin: "0.3rem 0 0",
              fontSize: "0.85rem",
              color: "var(--marigold)",
            }}
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          style={{
            display: "block",
            fontWeight: 600,
            fontSize: "0.9rem",
            marginBottom: "0.35rem",
            color: "var(--paper)",
          }}
        >
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          {...register("message", {
            required: "Please write a short message about your project.",
          })}
          placeholder="Tell me what you’re building and when you need it…"
          style={{
            width: "100%",
            padding: "0.7rem 1rem",
            borderRadius: "6px",
            border: "1px solid var(--line)",
            background: "var(--paper)",
            color: "var(--ink)",
            font: "400 1rem var(--display)",
            resize: "vertical",
          }}
        />
        {errors.message && (
          <p
            style={{
              margin: "0.3rem 0 0",
              fontSize: "0.85rem",
              color: "var(--marigold)",
            }}
          >
            {errors.message.message}
          </p>
        )}
      </div>

      {siteKey && (
        <div>
          <Turnstile
            ref={turnstileRef}
            siteKey={siteKey}
            onVerify={setCaptchaToken}
            onExpire={() => setCaptchaToken(null)}
            onError={() => setCaptchaToken(null)}
          />
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting || (!!siteKey && !captchaToken)}
          className="btn p"
        >
          {isSubmitting ? "Sending message…" : "Send message"}
        </button>
      </div>

      {statusMessage && (
        <p
          role="status"
          aria-live="polite"
          style={{
            margin: 0,
            fontSize: "0.95rem",
            color:
              statusMessage.type === "success"
                ? "var(--lagoon-soft)"
                : "var(--marigold)",
          }}
        >
          {statusMessage.text}
        </p>
      )}
    </form>
  )
}
