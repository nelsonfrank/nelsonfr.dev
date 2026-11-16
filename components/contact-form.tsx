"use client"

import { useRef, useState } from "react"
import { Send, CheckCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Turnstile, type TurnstileRef } from "./turnstile"
import { captureEvent, captureError, getPostHogHeaders, identifyUser } from "@/lib/analytics"

export default function ContactForm() {
  const turnstileRef = useRef<TurnstileRef>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string; email: string; message: string }>()

  const onSubmit = async (data: { name: string; email: string; message: string }) => {
    if (siteKey && !captchaToken) {
      toast.error("Please complete the captcha verification.")
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
            Sentry.metrics.count("test_metric", 1)
            Sentry.metrics.count("contact_form_success", 1)
            Sentry.logger.info("User triggered test log", { log_source: "sentry_test" })
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

        setIsSubmitted(true)
        toast.success(result.message || "Message sent successfully!")
        reset()
        setCaptchaToken(null)
        turnstileRef.current?.reset()
        setTimeout(() => setIsSubmitted(false), 3000)
      } else {
        toast.error(result.error || "Failed to send the message. Please try again.")
        setCaptchaToken(null)
        turnstileRef.current?.reset()
      }
    } catch (error) {
      console.error(error)
      captureError(error as Error)
      toast.error("An unexpected error occurred. Please try again.")
      setCaptchaToken(null)
      turnstileRef.current?.reset()
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 max-w-[600px] space-y-4 pt-2"
    >
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-xs font-mono text-muted-foreground">
          Name
        </label>
        <input
          type="text"
          id="name"
          {...register("name", { required: "Name is required" })}
          className="w-full min-h-[44px] px-3.5 py-2.5 bg-input border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200"
          placeholder="Your name"
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-xs font-mono text-muted-foreground">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          className="w-full min-h-[44px] px-3.5 py-2.5 bg-input border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200"
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-xs font-mono text-muted-foreground">
          Message
        </label>
        <textarea
          id="message"
          {...register("message", { required: "Message is required" })}
          rows={4}
          className="w-full px-3.5 py-2.5 bg-input border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200 resize-y"
          placeholder="Tell me about your project..."
        />
        {errors.message && (
          <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
        )}
      </div>

      {siteKey && (
        <div className="flex justify-start">
          <Turnstile
            ref={turnstileRef}
            siteKey={siteKey}
            onVerify={setCaptchaToken}
            onExpire={() => setCaptchaToken(null)}
            onError={() => setCaptchaToken(null)}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitted || isSubmitting || (!!siteKey && !captchaToken)}
        className="inline-flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitted ? (
          <>
            <CheckCircle className="size-4" />
            <span>Message Sent</span>
          </>
        ) : isSubmitting ? (
          <span>Sending...</span>
        ) : (
          <>
            <span>Send Message</span>
            <Send className="size-4" />
          </>
        )}
      </button>
    </form>
  )
}

