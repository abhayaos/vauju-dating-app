// src/utils/auth.js

/**
 * Decode a JWT token (JSON Web Token)
 * @param {string} token - The JWT token string
 * @returns {object|null} The decoded payload or null if invalid
 */
export function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    // Removed console.error for security
    return null;
  }
}

/**
 * Validate a JWT token based on expiration time
 * @param {string} token - The JWT token
 * @returns {boolean} True if valid, false otherwise
 */
export function validateToken(token) {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return false;

    const currentTime = Date.now() / 1000; // seconds
    return decoded.exp > currentTime;
  } catch (err) {
    // Removed console.error for security
    return false;
  }
}

/**
 * Note: saveAuthData, getToken, getUser, and clearAuthData have been removed
 * to eliminate localStorage usage. Use AuthContext from context/AuthContext.jsx instead.
 */

/**
 * Check if token is expired and needs auto-logout
 * @param {string} token - The JWT token to check
 * @returns {boolean} True if token is expired, false otherwise
 */
export function isTokenExpired(token) {
  try {
    if (!token) return true;
    
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000); // seconds
    const timeUntilExpiry = decoded.exp - currentTime;
    
    // Auto-logout if token expires in less than 30 seconds
    if (timeUntilExpiry < 30) {
      // Removed console.warn for security
      return true;
    }
    
    return false;
  } catch (err) {
    // Removed console.error for security
    return true;
  }
}