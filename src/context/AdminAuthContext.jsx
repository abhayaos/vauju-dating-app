import React, { createContext, useState, useCallback } from 'react';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);

  const loginAdmin = useCallback((token, profile) => {
    setAdminToken(token);
    setAdminProfile(profile || null);
    window.dispatchEvent(new Event('adminLogin'));
  }, []);

  const logoutAdmin = useCallback(() => {
    setAdminToken(null);
    setAdminProfile(null);
    window.dispatchEvent(new Event('adminLogout'));
  }, []);

  const isAdminLoggedIn = !!adminToken;

  const value = {
    adminToken,
    adminProfile,
    isAdminLoggedIn,
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
