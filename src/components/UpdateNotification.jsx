import React from 'react';
import { usePWA } from '../context/PWAContext';

const UpdateNotification = () => {
  const { needRefresh, updateApp } = usePWA();

  if (!needRefresh) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white p-4 z-[9999] shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">New version available!</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-blue-500 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Reload
          </button>
          <button
            onClick={updateApp}
            className="bg-white text-blue-500 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Update Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;