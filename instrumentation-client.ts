import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || "phc_placeholder_token", {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    defaults: '2026-01-30',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  });
}

Sentry.init({
  dsn: "https://201c4fb0f0db4fcb4487d7d2b750db12@o4506044817014784.ingest.us.sentry.io/4506044821471232",

  sendDefaultPii: true,

  // 100% in dev, 10% in production
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Session Replay: 10% of all sessions, 100% of sessions with errors
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Enable Sentry logs
  enableLogs: true,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
});

// Hook into App Router navigation transitions (App Router only)
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
