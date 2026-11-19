"use client"

export function captureEvent(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return
  import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.capture(event, properties)
    })
    .catch(() => {
      // Ignore analytics failures
    })
}

export async function getPostHogHeaders(fallbackDistinctId: string): Promise<{
  distinctId: string
  sessionId: string
}> {
  if (typeof window === "undefined") {
    return { distinctId: fallbackDistinctId, sessionId: "" }
  }
  try {
    const { default: posthog } = await import("posthog-js")
    return {
      distinctId: posthog.get_distinct_id() || fallbackDistinctId,
      sessionId: posthog.get_session_id() || "",
    }
  } catch {
    return { distinctId: fallbackDistinctId, sessionId: "" }
  }
}

export function identifyUser(distinctId: string, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return
  import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.identify(distinctId, properties)
    })
    .catch(() => {
      // Ignore analytics failures
    })
}

export function captureError(error: Error): void {
  if (typeof window === "undefined") return
  import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.captureException(error)
    })
    .catch(() => {
      // Ignore analytics failures
    })
}

