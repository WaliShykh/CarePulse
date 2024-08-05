import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://b913ee807faad39f2dd893aae6d346f6@o4507613693411328.ingest.us.sentry.io/4507726065238016",

  integrations: [Sentry.replayIntegration()],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
