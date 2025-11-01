// src/pages/Support.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Support() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new support page
    navigate('/support', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to the new support page...</p>
      </div>
    </div>
  );
}

export default Support;
