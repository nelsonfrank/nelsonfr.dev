import { NextResponse } from "next/server"

export const runtime = "edge"

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const rawEmail = typeof body?.email === "string" ? body.email.trim() : ""

    if (!rawEmail || !EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (apiKey && audienceId) {
      const response = await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            email: rawEmail,
            unsubscribed: false,
          }),
        }
      )

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        console.error("Resend Audience Error:", errData)
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
    }

    // Fallback when RESEND_AUDIENCE_ID is not yet configured: notify via Resend email if RESEND_API_KEY is present
    if (apiKey) {
      const toEmail = process.env.CONTACT_EMAIL || "nelsonfrank741@gmail.com"
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: `Newsletter <${process.env.FROM_EMAIL || "contact@contact.nelsonfrank.dev"}>`,
          to: toEmail,
          subject: `New Newsletter Subscriber: ${rawEmail}`,
          html: `<p>New newsletter subscription request from <strong>${rawEmail}</strong>.</p>`,
        }),
      }).catch(() => {})
    } else {
      console.log(`Newsletter subscription logged (dev mode): ${rawEmail}`)
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

