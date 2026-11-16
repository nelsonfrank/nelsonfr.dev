let routerTransitionHandler: ((...args: unknown[]) => void) | null = null;

export const onRouterTransitionStart = (...args: unknown[]) => {
  routerTransitionHandler?.(...args);
};

if (typeof window !== "undefined") {
  let initialized = false;
  const initDeferredObservability = () => {
    if (initialized) return;
    initialized = true;

    import("@sentry/nextjs")
      .then((Sentry) => {
        Sentry.init({
          dsn: "https://201c4fb0f0db4fcb4487d7d2b750db12@o4506044817014784.ingest.us.sentry.io/4506044821471232",
          sendDefaultPii: true,
          tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0,
          enableLogs: true,
          integrations: [
            Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
          ],
        });

        routerTransitionHandler =
          Sentry.captureRouterTransitionStart as unknown as (...args: unknown[]) => void;

        return Sentry.lazyLoadIntegration("replayIntegration").then((replayIntegration) => {
          Sentry.addIntegration(
            replayIntegration({
              maskAllText: true,
              blockAllMedia: true,
            })
          );
        });
      })
      .catch(() => {});

    import("posthog-js")
      .then(({ default: posthog }) => {
        posthog.init(
          process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || "phc_placeholder_token",
          {
            api_host: "/ingest",
            ui_host: "https://us.posthog.com",
            defaults: "2026-01-30",
            capture_exceptions: true,
            debug: process.env.NODE_ENV === "development",
          }
        );
      })
      .catch(() => {});
  };

  const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll"];
  const onFirstInteraction = () => {
    events.forEach((evt) => window.removeEventListener(evt, onFirstInteraction));
    initDeferredObservability();
  };
  events.forEach((evt) =>
    window.addEventListener(evt, onFirstInteraction, { once: true, passive: true })
  );

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => initDeferredObservability(), { timeout: 3000 });
  } else {
    globalThis.setTimeout(initDeferredObservability, 2000);
  }
}
