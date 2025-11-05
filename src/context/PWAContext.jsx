import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';

const PWAContext = createContext();

let updateServiceWorker;

export const PWAProvider = ({ children }) => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Initialize PWA
  useEffect(() => {
    updateServiceWorker = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
        console.log("New content available! Ready for update.");
      },
      onOfflineReady() {
        setOfflineReady(true);
        console.log("App ready to work offline 💪");
      },
    });

    // Check if app is already installed
    const checkInstalled = () => {
      setIsAppInstalled(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);
    };

    checkInstalled();

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null); // Clear the deferred prompt
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("PWA install prompt is available");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      console.log("No deferred prompt available");
      return false;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log("User accepted the install prompt");
        setIsAppInstalled(true);
      } else {
        console.log("User dismissed the install prompt");
      }
      
      setDeferredPrompt(null);
      return outcome === 'accepted';
    } catch (error) {
      console.error("Error during PWA installation:", error);
      return false;
    }
  };

  const updateApp = () => {
    if (updateServiceWorker) {
      updateServiceWorker(true);
      setNeedRefresh(false);
    }
  };

  const value = {
    needRefresh,
    offlineReady,
    isAppInstalled,
    deferredPrompt,
    installApp,
    updateApp
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};

export default PWAContext;