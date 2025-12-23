import { trackWebVitals } from './performance';

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        onPerfEntry(metric);
        trackWebVitals(metric);
      });
      getFID((metric) => {
        onPerfEntry(metric);
        trackWebVitals(metric);
      });
      getFCP((metric) => {
        onPerfEntry(metric);
        trackWebVitals(metric);
      });
      getLCP((metric) => {
        onPerfEntry(metric);
        trackWebVitals(metric);
      });
      getTTFB((metric) => {
        onPerfEntry(metric);
        trackWebVitals(metric);
      });
    });
  }
};

export default reportWebVitals;
