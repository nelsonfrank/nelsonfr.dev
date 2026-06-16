"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Mail, Github, Linkedin, Twitter, Send, CheckCircle } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useFadeUp, useMagnetic, useScaleUp } from "@/hooks/use-gsap"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Turnstile, type TurnstileRef } from "./turnstile"
import * as Sentry from "@sentry/nextjs"
import posthog from "posthog-js"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const socialLinks = [
   { name: "GitHub", href: "https://github.com/nelsonfrank", icon: Github },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/nelson-frank-munissy/", icon: Linkedin },
  { name: "Twitter", href: "https://x.com/nelsonfr_", icon: Twitter },
  { name: "Email", href: "mailto:nelsonfrank741@gmail.com", icon: Mail },
]

function SocialLink({ link, index }: { link: typeof socialLinks[0]; index: number }) {
  const linkRef = useMagnetic<HTMLAnchorElement>(0.4)
  const containerRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    gsap.set(container, { opacity: 0, y: 30, scale: 0.8 })

    ScrollTrigger.create({
      trigger: container,
      start: "top 90%",
      onEnter: () => {
        gsap.to(container, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: 0.3 + index * 0.1,
          ease: "back.out(1.7)",
        })
      },
    })
  }, [index])

  return (
    <Link
      ref={(el) => {
        (containerRef as React.MutableRefObject<HTMLAnchorElement | null>).current = el
        if (linkRef && typeof linkRef === "object" && "current" in linkRef) {
          (linkRef as React.MutableRefObject<HTMLAnchorElement | null>).current = el
        }
      }}
      href={link.href}
      onClick={() => {
        posthog.capture("social_link_clicked", {
          name: link.name,
          href: link.href,
        })
      }}
      className="p-3 md:p-4 bg-secondary rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 group relative overflow-hidden"
      aria-label={link.name}
      data-cursor={link.name}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="absolute inset-0 bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-xl" />
      <link.icon className="size-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
    </Link>
  )
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useFadeUp<HTMLHeadingElement>()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const formRef = useScaleUp<HTMLDivElement>()
  const lineRef = useRef<HTMLDivElement>(null)
  const turnstileRef = useRef<TurnstileRef>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string; email: string; message: string }>()

  useEffect(() => {
    const line = lineRef.current
    if (!line) return

    gsap.set(line, { scaleX: 0, transformOrigin: "left center" })

    ScrollTrigger.create({
      trigger: line,
      start: "top 90%",
      onEnter: () => {
        gsap.to(line, { scaleX: 1, duration: 1.5, ease: "power3.inOut" })
      },
    })
  }, [])

  useEffect(() => {
    const title = titleRef.current
    const desc = descRef.current
    if (!title || !desc) return

    gsap.set([title, desc], { opacity: 0, y: 30 })

    ScrollTrigger.create({
      trigger: title,
      start: "top 85%",
      onEnter: () => {
        gsap.to(title, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        gsap.to(desc, { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: "power3.out" })
      },
    })
  }, [])

  const onSubmit = async (data: { name: string; email: string; message: string }) => {
    if (siteKey && !captchaToken) {
      toast.error("Please complete the captcha verification.")
      return
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-PostHog-Distinct-ID": posthog.get_distinct_id() || data.email,
          "X-PostHog-Session-ID": posthog.get_session_id() || "",
        },
        body: JSON.stringify({
          ...data,
          captchaToken,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Send test metrics to verify Sentry configuration
        Sentry.metrics.count("test_metric", 1)
        Sentry.metrics.count("contact_form_success", 1)

        // Send a test log to Sentry to verify Logs configuration
        Sentry.logger.info("User triggered test log", { log_source: "sentry_test" })

        // Identify the user with their email in PostHog
        posthog.identify(data.email, {
          name: data.name,
          email: data.email,
        })

        // Capture client-side contact submission
        posthog.capture("contact_form_submitted", {
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
      posthog.captureException(error as Error)
      toast.error("An unexpected error occurred. Please try again.")
      setCaptchaToken(null)
      turnstileRef.current?.reset()
    }
  }

  return (
    <section ref={sectionRef} id="contact" className="py-16 md:py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2
          ref={headingRef}
          className="text-sm font-medium text-primary uppercase tracking-wider mb-12 relative inline-block"
        >
          Contact
          <span ref={lineRef} className="absolute -bottom-2 left-0 w-full h-px bg-primary" />
        </h2>

        <div className="grid gap-10 lg:gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h3
              ref={titleRef}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance leading-tight"
            >
              Let&apos;s build something{" "}
              <span className="text-primary relative">
                great
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,5 Q25,0 50,5 T100,5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary/50"
                  />
                </svg>
              </span>{" "}
              together.
            </h3>
            <p ref={descRef} className="text-muted-foreground leading-relaxed max-w-lg text-lg">
              I&apos;m currently open to new opportunities and interesting projects.
              Whether you have a question, want to collaborate, or just want to say hi,
              feel free to reach out.
            </p>

            <div className="flex gap-4 pt-4">
              {socialLinks.map((link, index) => (
                <SocialLink key={link.name} link={link} index={index} />
              ))}
            </div>
          </div>

          <div
            ref={formRef}
            className="bg-card rounded-2xl border border-border p-6 sm:p-8 relative overflow-hidden"
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl" />
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className={`text-sm font-medium transition-colors duration-300 ${
                    focusedField === "name" ? "text-primary" : "text-foreground"
                  }`}
                >
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    {...register("name", {
                      required: "Name is required",
                      onBlur: () => setFocusedField(null)
                    })}
                    onFocus={() => setFocusedField("name")}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all duration-300"
                    placeholder="Your name"
                  />
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      focusedField === "name" ? "w-full" : "w-0"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className={`text-sm font-medium transition-colors duration-300 ${
                    focusedField === "email" ? "text-primary" : "text-foreground"
                  }`}
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      },
                      onBlur: () => setFocusedField(null)
                    })}
                    onFocus={() => setFocusedField("email")}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all duration-300"
                    placeholder="your@email.com"
                  />
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      focusedField === "email" ? "w-full" : "w-0"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className={`text-sm font-medium transition-colors duration-300 ${
                    focusedField === "message" ? "text-primary" : "text-foreground"
                  }`}
                >
                  Message
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    {...register("message", {
                      required: "Message is required",
                      onBlur: () => setFocusedField(null)
                    })}
                    onFocus={() => setFocusedField("message")}
                    rows={4}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-all duration-300 resize-none"
                    placeholder="Tell me about your project..."
                  />
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      focusedField === "message" ? "w-full" : "w-0"
                    }`}
                  />
                </div>
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
                )}
              </div>

              {siteKey && (
                <div className="flex justify-center pb-2">
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
                className="w-full bg-primary text-primary-foreground px-6 py-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                data-cursor={isSubmitted || isSubmitting || (!!siteKey && !captchaToken) ? undefined : "Send"}
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                {isSubmitted ? (
                  <>
                    <CheckCircle className="size-5" />
                    <span>Message Sent!</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Send Message</span>
                    <Send className="size-4 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
