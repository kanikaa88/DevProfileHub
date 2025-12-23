/**
 * Safe Sentry wrapper - provides no-op functions when Sentry is not installed.
 * This file doesn't import Sentry, so it won't cause build errors.
 */

// No-op implementations - install @sentry/react to get real functionality
const Sentry = {
  init: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry not installed - error tracking disabled');
    }
  },
  captureException: () => {},
  captureMessage: () => {},
  addBreadcrumb: () => {},
  browserTracingIntegration: () => ({}),
  replayIntegration: () => ({}),
};

export default Sentry;
export { Sentry };
