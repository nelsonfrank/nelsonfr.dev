// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://201c4fb0f0db4fcb4487d7d2b750db12@o4506044817014784.ingest.us.sentry.io/4506044821471232",

  sendDefaultPii: true,

  // 100% in development, 10% in production
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Attach local variable values to stack frames (server only)
  includeLocalVariables: true,

  // Enable Sentry logs
  enableLogs: true,

  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
});
