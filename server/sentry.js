/**
 * Safe Sentry initializer for the server.
 * - Will not crash if @sentry/node or @sentry/profiling-node are missing.
 * - Initializes Sentry only when SENTRY_DSN is provided.
 */

let Sentry = null;

try {
  Sentry = require("@sentry/node");
} catch (err) {
  // Sentry not installed — continue without it
  console.log("Sentry (server) not available — running without error tracking.");
}

if (Sentry && process.env.SENTRY_DSN) {
  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "0.0"),
      release: process.env.RELEASE || undefined,
      environment: process.env.NODE_ENV || "development",
    });
    console.log("Sentry initialized (server)");
  } catch (err) {
    console.warn("Failed to init Sentry (server):", err.message);
  }
} else {
  if (!Sentry) {
    console.log("Sentry module not found — running server without Sentry.");
  } else if (!process.env.SENTRY_DSN) {
    console.log("SENTRY_DSN not set — Sentry disabled for server.");
  }
}

module.exports = Sentry || {};
