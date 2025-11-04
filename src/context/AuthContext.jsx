import React, { createContext, useState, useCallback, useEffect } from 'react';
import { isTokenExpired } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define logout first so it can be used in other effects
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    // Clear from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    // Notify other components about auth change
    window.dispatchEvent(new Event('authChange'));
  }, []);

  const login = useCallback((authToken, userData) => {
    setToken(authToken);
    setUser(userData || null);
    // Persist to localStorage
    localStorage.setItem('authToken', authToken);
    if (userData) {
      localStorage.setItem('authUser', JSON.stringify(userData));
    }
    // Notify other components about auth change
    window.dispatchEvent(new Event('authChange'));
  }, []);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    
    if (savedToken && !isTokenExpired(savedToken)) {
      setToken(savedToken);
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (e) {
          // If parsing fails, clear the invalid data
          localStorage.removeItem('authUser');
        }
      }
    } else if (savedToken) {
      // Token is expired, clear it
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
    
    setLoading(false);
  }, [logout]);

  // Check token expiry periodically
  useEffect(() => {
    const checkTokenExpiry = () => {
      if (token && isTokenExpired(token)) {
        logout();
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000); // Check every 60 seconds
    return () => clearInterval(interval);
  }, [token, logout]);

  // Add effect to handle storage events (for cross-tab auth sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'authToken') {
        if (e.newValue && !isTokenExpired(e.newValue)) {
          setToken(e.newValue);
        } else {
          setToken(null);
          setUser(null);
        }
      } else if (e.key === 'authUser') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (e) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  const isLoggedIn = !!token;

  const value = {
    token,
    user,
    loading,
    isLoggedIn,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;