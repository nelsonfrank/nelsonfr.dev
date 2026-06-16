import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const { name, email, message, captchaToken } = await request.json()

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
    }

    // Server-side Turnstile verification
    const secretKey = process.env.TURNSTILE_SECRET_KEY
    if (secretKey) {
      if (!captchaToken) {
        return NextResponse.json(
          { error: "Captcha verification token is missing." },
          { status: 400 }
        )
      }

      try {
        const formData = new URLSearchParams()
        formData.append("secret", secretKey)
        formData.append("response", captchaToken)

        const ip = request.headers.get("cf-connecting-ip")
        if (ip) {
          formData.append("remoteip", ip)
        }

        const turnstileResponse = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            body: formData,
          }
        )

        const turnstileData = await turnstileResponse.json()

        if (!turnstileData.success) {
          console.error("Turnstile verification failed:", turnstileData)
          return NextResponse.json(
            { error: "Captcha verification failed. Please try again." },
            { status: 400 }
          )
        }
      } catch (err) {
        console.error("Error verifying Turnstile captcha:", err)
        return NextResponse.json(
          { error: "Failed to verify captcha. Please try again." },
          { status: 500 }
        )
      }
    } else {
      console.warn("TURNSTILE_SECRET_KEY is not configured. Skipping server-side captcha verification.")
    }

    const apiKey = process.env.RESEND_API_KEY
    const toEmail = process.env.CONTACT_EMAIL || "nelsonfrank741@gmail.com"

    if (!apiKey) {
      console.log("========================================")
      console.log("CONTACT FORM SUBMISSION (No API Key Configured):")
      console.log(`From: ${name} <${email}>`)
      console.log(`Message: ${message}`)
      console.log("========================================")

      return NextResponse.json({
        success: true,
        message: "Message logged successfully (local testing mode). Set RESEND_API_KEY to send emails.",
      })
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Contact Form <onboarding@resend.dev>",
        to: toEmail,
        subject: `Portfolio Contact: Message from ${name}`,
        html: `
          <h3>New Message from Portfolio Contact Form</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px; white-space: pre-wrap;">
            ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
          </div>
        `,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Resend API Error:", errorData)
      return NextResponse.json(
        { error: "Failed to send email via service provider." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    })
  } catch (error) {
    console.error("Contact API Handler Error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    )
  }
}
