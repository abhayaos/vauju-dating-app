import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const WebsitePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Use a session flag instead of localStorage
    const popupShownKey = 'WEBSITE_POPUP_SHOWN_SESSION';
    const hasShownPopup = sessionStorage.getItem(popupShownKey) === 'true';
    
    // Show popup after a short delay if not shown before
    if (!hasShownPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Mark popup as shown in session
        sessionStorage.setItem(popupShownKey, 'true');
      }, 1000); // Show after 1 second
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-lg flex items-center justify-center z-[9999] p-4">
      <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors z-10"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
        
        <div className="p-6 pt-8 text-center">
          <div className="mb-4">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
              <span className="text-2xl">❤️</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Vauju!</h2>
          <p className="text-white text-opacity-90 mb-6">
            Find your perfect match today. Connect with amazing people around you.
          </p>
          
          <div className="bg-white bg-opacity-20 rounded-xl p-4 mb-6">
            <p className="text-white font-medium">✨ Special Offer ✨</p>
            <p className="text-white text-sm mt-1">Get 50 free coins for new users!</p>
          </div>
          
          <button
            onClick={handleClose}
            className="w-full bg-white text-pink-600 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Continue to Vauju
          </button>
          
          <p className="text-white text-opacity-70 text-xs mt-4">
            By continuing, you agree to our Terms & Conditions
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebsitePopup;