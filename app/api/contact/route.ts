import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
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
