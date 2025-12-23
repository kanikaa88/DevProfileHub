/**
 * Sentry initialization file.
 * This file is safe to import even if @sentry/react is not installed.
 * It will only initialize Sentry if the package is available and SENTRY_DSN is set.
 */

// Don't import Sentry here - let it be initialized lazily if needed
// This file just ensures the module can be imported without errors

// If you want to initialize Sentry, install @sentry/react and set REACT_APP_SENTRY_DSN
// Then uncomment and configure the initialization below:

/*
import * as Sentry from '@sentry/react';

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [],
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || 'development',
  });
}
*/

// Export empty object so imports don't fail
export default {};
