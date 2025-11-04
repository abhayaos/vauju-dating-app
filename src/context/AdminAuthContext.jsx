import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoutAdmin = useCallback(() => {
    setAdminToken(null);
    setAdminProfile(null);
    // Clear from localStorage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminProfile');
    // Notify other components about auth change
    window.dispatchEvent(new Event('adminLogout'));
  }, []);

  const loginAdmin = useCallback((token, profile) => {
    setAdminToken(token);
    setAdminProfile(profile || null);
    // Persist to localStorage
    localStorage.setItem('adminToken', token);
    if (profile) {
      localStorage.setItem('adminProfile', JSON.stringify(profile));
    }
    window.dispatchEvent(new Event('adminLogin'));
  }, []);

  // Initialize admin auth state from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedProfile = localStorage.getItem('adminProfile');
    
    if (savedToken) {
      setAdminToken(savedToken);
      if (savedProfile) {
        setAdminProfile(JSON.parse(savedProfile));
      }
    }
    
    setLoading(false);
  }, []);

  const isAdminLoggedIn = !!adminToken;

  const value = {
    adminToken,
    adminProfile,
    isAdminLoggedIn,
    loading,
    loginAdmin,
    logoutAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook to use AdminAuthContext
export const useAdminAuth = () => {
  const context = React.useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
