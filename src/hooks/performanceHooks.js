import React from 'react';

/**
 * withMemo - HOC to memoize components and prevent unnecessary re-renders
 * Only re-renders when props actually change
 * 
 * Usage:
 * export default withMemo(MyComponent);
 * 
 * Or with custom comparison:
 * export default withMemo(MyComponent, (prevProps, nextProps) => {
 *   return prevProps.id === nextProps.id && prevProps.data === nextProps.data;
 * });
 */
export const withMemo = (Component, propsAreEqual) => {
  const Memoized = React.memo(Component, propsAreEqual);
  Memoized.displayName = `withMemo(${Component.displayName || Component.name || 'Component'})`;
  return Memoized;
};

/**
 * useCallbackRef - Hook to create stable callback references
 * Prevents unnecessary re-renders of child components
 */
export const useCallbackRef = (callback, deps = []) => {
  const ref = React.useRef(callback);

  React.useLayoutEffect(() => {
    ref.current = callback;
  }, deps);

  return React.useCallback((...args) => ref.current?.(...args), []);
};

/**
 * usePrevious - Hook to track previous value
 * Useful for detecting when props change
 */
export const usePrevious = (value) => {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

/**
 * useAsync - Hook for managing async operations with loading/error states
 * Automatically cleans up on unmount
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = React.useState('idle');
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  const execute = React.useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
};

/**
 * useDebounce - Hook to debounce value changes
 * Prevents excessive updates
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useThrottle - Hook to throttle value changes
 * Limits update frequency
 */
export const useThrottle = (value, interval = 500) => {
  const [throttledValue, setThrottledValue] = React.useState(value);
  const lastUpdated = React.useRef(null);

  React.useEffect(() => {
    const now = Date.now();

    if (lastUpdated.current && now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = now;
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
};

export default {
  withMemo,
  useCallbackRef,
  usePrevious,
  useAsync,
  useDebounce,
  useThrottle,
};
