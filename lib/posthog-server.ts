/**
 * PostHog Server-side Event Capture Utility
 * Fully compatible with the Next.js Edge Runtime.
 */
export async function captureEdgeEvent({
  distinctId,
  event,
  properties = {},
}: {
  distinctId: string
  event: string
  properties?: Record<string, any>
}) {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"

  if (!token || token === "phc_placeholder_token") {
    console.warn("PostHog project token is placeholder or not set. Skipping event capture.")
    return
  }

  try {
    const response = await fetch(`${host}/i/v0/e/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: token,
        event: event,
        distinct_id: distinctId,
        properties: {
          ...properties,
          $lib: "posthog-edge-custom",
          $lib_version: "1.0.0",
        },
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`PostHog Edge Capture API returned status ${response.status}: ${errorText}`)
    }
  } catch (error) {
    console.error("Failed to capture server event in PostHog Edge:", error)
  }
}
