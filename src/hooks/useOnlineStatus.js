import { useState, useEffect } from 'react';

/**
 * useOnlineStatus Hook
 * Detects when the user goes online/offline
 * Returns the current online status and provides callback support
 * 
 * Usage:
 * const isOnline = useOnlineStatus();
 * 
 * Or with callback:
 * const isOnline = useOnlineStatus({
 *   onOnline: () => console.log('Back online'),
 *   onOffline: () => console.log('Now offline')
 * });
 */
export const useOnlineStatus = (callbacks = {}) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // Handler for when connection is established
    const handleOnline = () => {
      setIsOnline(true);
      callbacks.onOnline?.();
    };

    // Handler for when connection is lost
    const handleOffline = () => {
      setIsOnline(false);
      callbacks.onOffline?.();
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [callbacks]);

  return isOnline;
};

/**
 * Fallback online detection using periodic fetch
 * Uses fetch to verify connectivity to a lightweight endpoint
 * Useful for detecting network degradation
 */
export const checkOnlineWithFetch = async () => {
  try {
    const response = await fetch(window.location.origin, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
      timeout: 5000,
    });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * useConnectivityStatus Hook
 * More robust offline detection combining multiple methods
 * Includes periodic connectivity checks
 * 
 * Usage:
 * const { isOnline, isChecking } = useConnectivityStatus();
 */
export const useConnectivityStatus = (checkInterval = 5000) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Use navigator.onLine for immediate detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic check for network degradation
    const intervalId = setInterval(async () => {
      if (navigator.onLine) {
        setIsChecking(true);
        const isConnected = await checkOnlineWithFetch();
        setIsOnline(isConnected);
        setIsChecking(false);
      }
    }, checkInterval);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [checkInterval]);

  return { isOnline, isChecking };
};

export default useOnlineStatus;
