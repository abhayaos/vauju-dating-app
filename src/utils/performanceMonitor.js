/**
 * Performance Monitoring Utility
 * Tracks and logs performance metrics for optimization analysis
 */

export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.enabled = import.meta.env.DEV;
  }

  /**
   * Start measuring a performance metric
   * @param {string} label - Metric label/name
   */
  start(label) {
    if (!this.enabled) return;
    this.metrics.set(label, performance.now());
  }

  /**
   * End measuring and get duration
   * @param {string} label - Metric label/name
   * @returns {number} Duration in milliseconds
   */
  end(label) {
    if (!this.enabled || !this.metrics.has(label)) return 0;
    const startTime = this.metrics.get(label);
    const duration = performance.now() - startTime;
    this.metrics.delete(label);
    
    if (duration > 100) { // Log slow operations
      console.warn(`⚠️ Slow operation: ${label} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  /**
   * Measure function execution time
   * @param {Function} fn - Function to measure
   * @param {string} label - Optional label for the measurement
   * @returns {any} Function return value
   */
  measure(fn, label = fn.name || 'anonymous') {
    if (!this.enabled) return fn();
    
    this.start(label);
    const result = fn();
    this.end(label);
    return result;
  }

  /**
   * Measure async function execution time
   * @param {AsyncFunction} fn - Async function to measure
   * @param {string} label - Optional label for the measurement
   * @returns {Promise<any>} Function return promise
   */
  async measureAsync(fn, label = fn.name || 'async operation') {
    if (!this.enabled) return fn();
    
    this.start(label);
    try {
      const result = await fn();
      this.end(label);
      return result;
    } catch (error) {
      this.end(label);
      throw error;
    }
  }

  /**
   * Get Core Web Vitals
   * @returns {Object} Web vitals metrics
   */
  getWebVitals() {
    if (!this.enabled) return {};

    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');

    return {
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      timeToFirstByte: navigation?.responseStart - navigation?.requestStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
    };
  }

  /**
   * Get memory usage (Chrome only)
   * @returns {Object} Memory metrics or empty object
   */
  getMemoryUsage() {
    if (!this.enabled || !performance.memory) return {};

    return {
      usedJSHeapSize: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
      totalJSHeapSize: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
      jsHeapSizeLimit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
    };
  }

  /**
   * Log all collected metrics
   */
  logMetrics() {
    if (!this.enabled) return;

    console.group('📊 Performance Metrics');
    console.table(this.getWebVitals());
    console.table(this.getMemoryUsage());
    console.groupEnd();
  }
}

// Export singleton instance
export const monitor = new PerformanceMonitor();

export default monitor;
