import React, { useState, useEffect } from 'react';
import { usePWA } from '../context/PWAContext';

const PWAInstaller = () => {
  const { needRefresh, offlineReady, isAppInstalled, deferredPrompt, installApp, updateApp } = usePWA();
  const [showInstaller, setShowInstaller] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("PWA State:", { needRefresh, offlineReady, isAppInstalled, hasDeferredPrompt: !!deferredPrompt });
  }, [needRefresh, offlineReady, isAppInstalled, deferredPrompt]);

  // Only show installer after a short delay to avoid immediate popups
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAppInstalled && deferredPrompt) {
        setShowInstaller(true);
        console.log("Showing PWA installer");
      }
    }, 3000); // Show after 3 seconds

    return () => clearTimeout(timer);
  }, [isAppInstalled, deferredPrompt]);

  // Don't show anything if app is already installed or not installable
  if (isAppInstalled || !deferredPrompt || !showInstaller) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Installation prompt */}
      {!needRefresh && !offlineReady && (
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">Install App</h3>
              <p className="text-sm text-gray-600">Get the full experience</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowInstaller(false)}
                className="text-gray-500 hover:text-gray-700 px-2 py-1 text-sm"
              >
                ✕
              </button>
              <button
                onClick={installApp}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline ready notification */}
      {offlineReady && !needRefresh && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg max-w-sm">
          <div className="flex justify-between items-center">
            <p className="text-sm">App is ready to work offline!</p>
            <button
              onClick={() => setOfflineReady(false)}
              className="text-green-700 hover:text-green-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Update available notification */}
      {needRefresh && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg max-w-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm">New version available!</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setNeedRefresh(false)}
                className="text-blue-700 hover:text-blue-900"
              >
                ✕
              </button>
              <button
                onClick={updateApp}
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PWAInstaller;