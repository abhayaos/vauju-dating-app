/**
 * Cache Manager for API responses
 * Uses IndexedDB for persistent caching and memory cache for fast access
 * Implements cache expiration and strategy patterns
 */

const DB_NAME = 'VaujuCache';
const DB_VERSION = 1;
const STORE_NAME = 'responses';

class CacheManager {
  constructor() {
    this.db = null;
    this.memoryCache = new Map();
    this.cacheTTL = new Map(); // Time to live for cache entries
    this.init();
  }

  /**
   * Initialize IndexedDB
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  /**
   * Generate cache key from URL and options
   */
  generateKey(url, options = {}) {
    const hash = JSON.stringify(options);
    return `${url}:${hash}`;
  }

  /**
   * Get cached response
   * @param {string} url - API URL
   * @param {Object} options - Cache options { ttl: 3600000, strategy: 'network-first' }
   */
  async get(url, options = {}) {
    const key = this.generateKey(url, options);
    const ttl = options.ttl || 3600000; // 1 hour default

    // Check memory cache first
    if (this.memoryCache.has(key)) {
      const cached = this.memoryCache.get(key);
      if (Date.now() - cached.timestamp < ttl) {
        return cached.data;
      } else {
        this.memoryCache.delete(key);
      }
    }

    // Check IndexedDB
    if (this.db) {
      try {
        const data = await this.getFromDB(key);
        if (data && Date.now() - data.timestamp < ttl) {
          // Restore to memory cache
          this.memoryCache.set(key, data);
          return data.data;
        } else if (data) {
          await this.removeFromDB(key);
        }
      } catch (error) {
        console.warn('IndexedDB read error:', error);
      }
    }

    return null;
  }

  /**
   * Set cache with TTL
   */
  async set(url, data, options = {}) {
    const key = this.generateKey(url, options);
    const ttl = options.ttl || 3600000;
    const cacheData = {
      key,
      data,
      timestamp: Date.now(),
      url,
    };

    // Store in memory cache
    this.memoryCache.set(key, cacheData);
    this.cacheTTL.set(key, ttl);

    // Store in IndexedDB
    if (this.db) {
      try {
        await this.saveToDB(cacheData);
      } catch (error) {
        console.warn('IndexedDB write error:', error);
      }
    }
  }

  /**
   * Clear expired cache entries
   */
  async clearExpired() {
    const now = Date.now();

    // Clear memory cache
    for (const [key, ttl] of this.cacheTTL.entries()) {
      const cached = this.memoryCache.get(key);
      if (cached && now - cached.timestamp > ttl) {
        this.memoryCache.delete(key);
        this.cacheTTL.delete(key);
      }
    }

    // Clear IndexedDB
    if (this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('timestamp');
        const range = IDBKeyRange.upperBound(now - 3600000);

        const request = index.getAll(range);
        request.onsuccess = () => {
          request.result.forEach((item) => {
            store.delete(item.key);
          });
          resolve();
        };
        request.onerror = () => reject(request.error);
      });
    }
  }

  /**
   * Clear all cache
   */
  async clear() {
    this.memoryCache.clear();
    this.cacheTTL.clear();

    if (this.db) {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  /**
   * Get from IndexedDB
   */
  getFromDB(key) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save to IndexedDB
   */
  saveToDB(data) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Remove from IndexedDB
   */
  removeFromDB(key) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      memoryEntries: this.memoryCache.size,
      cacheKeys: Array.from(this.memoryCache.keys()),
    };
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

export default cacheManager;
