import { useCallback } from 'react';
import { usePWA } from '../context/PWAContext';

export const usePWAInstaller = () => {
  const { 
    needRefresh, 
    offlineReady, 
    isAppInstalled, 
    deferredPrompt, 
    installApp, 
    updateApp 
  } = usePWA();

  const canInstall = !isAppInstalled && deferredPrompt;

  const promptInstall = useCallback(async () => {
    if (canInstall) {
      return await installApp();
    }
    return false;
  }, [canInstall, installApp]);

  return {
    needRefresh,
    offlineReady,
    isAppInstalled,
    canInstall,
    promptInstall,
    updateApp
  };
};

export default usePWAInstaller;