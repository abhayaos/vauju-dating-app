import React, { createContext, useState, useCallback, useEffect } from 'react';
import { isTokenExpired, validateToken } from '../utils/auth';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define logout first so it can be used in other effects
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    // Clear cookie
    Cookies.remove('token', { 
      path: '/', 
      domain: window.location.hostname,
      secure: window.location.protocol === 'https:'
    });
    // Also clear localStorage for backward compatibility
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    // Notify other components about auth change
    window.dispatchEvent(new Event('authChange'));
  }, []);

  const login = useCallback((authToken, userData) => {
    setToken(authToken);
    setUser(userData || null);
    
    // Set secure cookie with proper configuration
    const isProduction = window.location.protocol === 'https:';
    Cookies.set('token', authToken, {
      path: '/',
      domain: window.location.hostname,
      secure: isProduction, // only true in production (HTTPS)
      sameSite: 'Lax', // Changed from 'None' to 'Lax' for better compatibility
      expires: 7 // 7 days
    });
    
    // Also persist to localStorage for backward compatibility
    localStorage.setItem('authToken', authToken);
    if (userData) {
      localStorage.setItem('authUser', JSON.stringify(userData));
    }
    // Notify other components about auth change
    window.dispatchEvent(new Event('authChange'));
  }, []);

  // Initialize auth state from cookie on mount
  useEffect(() => {
    // First try to get token from cookie
    const cookieToken = Cookies.get('token');
    
    if (cookieToken && !isTokenExpired(cookieToken)) {
      setToken(cookieToken);
      // Try to get user data from localStorage for backward compatibility
      const savedUser = localStorage.getItem('authUser');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (e) {
          // If parsing fails, clear the invalid data
          localStorage.removeItem('authUser');
        }
      }
    } else if (cookieToken) {
      // Token is expired, clear it
      Cookies.remove('token', { 
        path: '/', 
        domain: window.location.hostname,
        secure: window.location.protocol === 'https:'
      });
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
    
    setLoading(false);
  }, []);

  // Check token expiry periodically
  useEffect(() => {
    const checkTokenExpiry = () => {
      // Check cookie token first
      const cookieToken = Cookies.get('token');
      
      if (cookieToken && isTokenExpired(cookieToken)) {
        logout();
      } else if (cookieToken !== token) {
        // Token in cookie differs from state, update state
        setToken(cookieToken || null);
      }
    };

    const interval = setInterval(checkTokenExpiry, 60000); // Check every 60 seconds
    return () => clearInterval(interval);
  }, [token, logout]);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    // Update user data in localStorage for backward compatibility
    if (userData) {
      localStorage.setItem('authUser', JSON.stringify(userData));
    }
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