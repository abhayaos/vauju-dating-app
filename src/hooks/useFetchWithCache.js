import { useCallback, useEffect, useRef, useState } from 'react';
import { cacheManager } from '../utils/cacheManager';

/**
 * useFetchWithCache - Hook for fetching data with automatic caching
 * Combines API caching, error handling, and loading states
 * 
 * Usage:
 * const { data, loading, error, refetch } = useFetchWithCache(
 *   '/api/posts',
 *   { headers: { 'Authorization': 'Bearer token' } },
 *   { ttl: 3600000, strategy: 'network-first' }
 * );
 */
export const useFetchWithCache = (url, options = {}, cacheOptions = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheKey = useRef(null);

  const defaultCacheOptions = {
    ttl: 3600000, // 1 hour
    strategy: 'network-first', // 'network-first' or 'cache-first'
    ...cacheOptions,
  };

  const fetchData = useCallback(async (skipCache = false) => {
    setLoading(true);
    setError(null);

    try {
      cacheKey.current = url;

      // Try to get from cache first (if not skipped)
      if (!skipCache && defaultCacheOptions.strategy === 'cache-first') {
        const cached = await cacheManager.get(url, defaultCacheOptions);
        if (cached) {
          setData(cached);
          setLoading(false);
          return;
        }
      }

      // Fetch from network
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Cache the result
      await cacheManager.set(url, result, defaultCacheOptions);

      setData(result);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);

      // Try to get from cache as fallback
      if (defaultCacheOptions.strategy === 'network-first') {
        const cached = await cacheManager.get(url, defaultCacheOptions);
        if (cached) {
          setData(cached);
          setError(null);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [url, options, defaultCacheOptions]);

  // Fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Cleanup cache on unmount
  useEffect(() => {
    return () => {
      // Optional: Don't clear cache on unmount, only on explicit logout
    };
  }, []);

  const refetch = useCallback(() => {
    fetchData(true); // Skip cache and fetch fresh data
  }, [fetchData]);

  return { data, loading, error, refetch };
};

/**
 * useLazyFetch - Hook for lazy (on-demand) data fetching
 * Data is not fetched until the returned function is called
 * 
 * Usage:
 * const [fetchData, { data, loading, error }] = useLazyFetch(url, options);
 * 
 * // Later...
 * onClick={() => fetchData()}
 */
export const useLazyFetch = (url, options = {}, cacheOptions = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const defaultCacheOptions = {
    ttl: 3600000,
    strategy: 'network-first',
    ...cacheOptions,
  };

  const fetchData = useCallback(
    async (skipCache = false) => {
      setLoading(true);
      setError(null);

      try {
        if (!skipCache && defaultCacheOptions.strategy === 'cache-first') {
          const cached = await cacheManager.get(url, defaultCacheOptions);
          if (cached) {
            setData(cached);
            setLoading(false);
            return;
          }
        }

        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        await cacheManager.set(url, result, defaultCacheOptions);

        setData(result);
        setError(null);
      } catch (err) {
        console.error('Lazy fetch error:', err);
        setError(err.message);

        if (defaultCacheOptions.strategy === 'network-first') {
          const cached = await cacheManager.get(url, defaultCacheOptions);
          if (cached) {
            setData(cached);
            setError(null);
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [url, options, defaultCacheOptions]
  );

  return [fetchData, { data, loading, error }];
};

export default {
  useFetchWithCache,
  useLazyFetch,
};
