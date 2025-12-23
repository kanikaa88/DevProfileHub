import Sentry from './sentry-utils';

// Performance monitoring utilities
export const performanceMonitor = {
  // Track page load performance
  trackPageLoad(pageName) {
    const startTime = performance.now();
    
    return {
      end: () => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        Sentry.addBreadcrumb({
          message: `Page ${pageName} loaded`,
          category: 'performance',
          level: 'info',
          data: { loadTime: `${loadTime.toFixed(2)}ms` }
        });
        
        // Log slow page loads
        if (loadTime > 3000) {
          Sentry.captureMessage(`Slow page load: ${pageName} took ${loadTime.toFixed(2)}ms`, 'warning');
        }
      }
    };
  },

  // Track API call performance
  trackApiCall(apiName, url) {
    const startTime = performance.now();
    
    return {
      end: (success = true) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        Sentry.addBreadcrumb({
          message: `API call: ${apiName}`,
          category: 'api',
          level: success ? 'info' : 'error',
          data: { 
            url, 
            duration: `${duration.toFixed(2)}ms`,
            success 
          }
        });
        
        // Log slow API calls
        if (duration > 5000) {
          Sentry.captureMessage(`Slow API call: ${apiName} took ${duration.toFixed(2)}ms`, 'warning');
        }
      }
    };
  },

  // Track user interactions
  trackUserAction(action, details = {}) {
    Sentry.addBreadcrumb({
      message: `User action: ${action}`,
      category: 'user',
      level: 'info',
      data: details
    });
  },

  // Track component render performance
  trackComponentRender(componentName) {
    const startTime = performance.now();
    
    return {
      end: () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        if (renderTime > 100) { // Log slow renders
          Sentry.addBreadcrumb({
            message: `Slow component render: ${componentName}`,
            category: 'performance',
            level: 'warning',
            data: { renderTime: `${renderTime.toFixed(2)}ms` }
          });
        }
      }
    };
  }
};

// Web Vitals tracking
export const trackWebVitals = (metric) => {
  Sentry.addBreadcrumb({
    message: `Web Vital: ${metric.name}`,
    category: 'performance',
    level: 'info',
    data: {
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
      name: metric.name
    }
  });

  // Alert on poor performance
  if (metric.name === 'CLS' && metric.value > 0.1) {
    Sentry.captureMessage(`Poor CLS score: ${metric.value}`, 'warning');
  }
  
  if (metric.name === 'LCP' && metric.value > 4000) {
    Sentry.captureMessage(`Poor LCP score: ${metric.value}ms`, 'warning');
  }
  
  if (metric.name === 'FID' && metric.value > 300) {
    Sentry.captureMessage(`Poor FID score: ${metric.value}ms`, 'warning');
  }
};
