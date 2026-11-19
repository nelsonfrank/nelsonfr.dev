import { NextResponse } from "next/server"

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

// Lightweight per-IP sliding-window rate limiter (5 requests / 10 minutes)
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5
const ipHits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (ipHits.get(ip) ?? []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  )
  if (recent.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, recent)
    return true
  }
  recent.push(now)
  ipHits.set(ip, recent)
  // Prevent unbounded memory growth
  if (ipHits.size > 1000) {
    for (const [key, timestamps] of ipHits.entries()) {
      if (timestamps.every((ts) => now - ts >= RATE_LIMIT_WINDOW_MS)) {
        ipHits.delete(key)
      }
    }
  }
  return false
}

function getClientIp(request: Request): string {
  const cfIp = request.headers.get("cf-connecting-ip")
  if (cfIp) return cfIp.trim()
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return "unknown"
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      )
    }

    // Honeypot trap: silently succeed for bots without touching Resend
    if (typeof body.website === "string" && body.website.trim().length > 0) {
      return NextResponse.json({
        success: true,
        message: "You’re subscribed. Watch your inbox for the next post.",
      })
    }

    const clientIp = getClientIp(request)
    if (clientIp !== "unknown" && isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a few minutes and try again." },
        { status: 429 }
      )
    }

    const rawEmail =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : ""

    if (!rawEmail || rawEmail.length > 254 || !EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    const segmentId =
      process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID

    if (!apiKey) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`Newsletter subscription logged (dev mode): ${rawEmail}`)
        return NextResponse.json({
          success: true,
          message: "You’re subscribed. Watch your inbox for the next post.",
        })
      }

      console.error("Newsletter API Error: RESEND_API_KEY is not configured.")
      return NextResponse.json(
        {
          error:
            "Newsletter signup is temporarily unavailable. You can subscribe via RSS instead.",
        },
        { status: 503 }
      )
    }

    const payload: {
      email: string
      unsubscribed: boolean
      segments?: { id: string }[]
    } = {
      email: rawEmail,
      unsubscribed: false,
    }
    if (segmentId) {
      payload.segments = [{ id: segmentId }]
    }

    const response = await fetch("https://api.resend.com/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errData = (await response.json().catch(() => ({}))) as {
        name?: string
        message?: string
      }

      // Treat already-subscribed contacts as success
      const msg = (errData.message ?? "").toLowerCase()
      if (response.status === 409 || msg.includes("already exists")) {
        return NextResponse.json({
          success: true,
          message: "You’re already subscribed. Watch your inbox for the next post.",
        })
      }

      if (response.status === 401 || response.status === 403) {
        console.error(
          "Resend Contacts API auth error (ensure RESEND_API_KEY has Full Access permissions):",
          errData
        )
      } else {
        console.error("Resend Contacts API error:", response.status, errData)
      }

      return NextResponse.json(
        {
          error:
            "Could not complete subscription right now. Please try again or use the RSS feed.",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "You’re subscribed. Watch your inbox for the next post.",
    })
  } catch (error) {
    console.error("Newsletter API Error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
