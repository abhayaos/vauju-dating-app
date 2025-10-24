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
    console.error("❌ Failed to decode JWT:", err);
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
    console.error("❌ Token validation failed:", err);
    return false;
  }
}

/**
 * Save token and user info to localStorage
 * @param {string} token - The JWT token
 * @param {object} user - The user data object
 */
export function saveAuthData(token, user) {
  try {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  } catch (err) {
    console.error("❌ Failed to save auth data:", err);
  }
}

/**
 * Get the saved token from localStorage
 * @returns {string|null} Token if exists, otherwise null
 */
export function getToken() {
  return localStorage.getItem("token");
}

/**
 * Get saved user data from localStorage
 * @returns {object|null} User object or null if not found
 */
export function getUser() {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (err) {
    console.error("❌ Failed to parse user data:", err);
    return null;
  }
}

/**
 * Clear all authentication data from localStorage & sessionStorage
 */
export function clearAuthData() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    console.log("✅ Auth data cleared successfully.");
  } catch (err) {
    console.error("❌ Failed to clear auth data:", err);
  }
}

/**
 * Check if token is expired and needs auto-logout
 * @returns {boolean} True if token is expired, false otherwise
 */
export function isTokenExpired() {
  try {
    const token = getToken();
    if (!token) return true;
    
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000); // seconds
    const timeUntilExpiry = decoded.exp - currentTime;
    
    // Auto-logout if token expires in less than 30 seconds
    if (timeUntilExpiry < 30) {
      console.warn("⚠️ Token expiring soon, auto-logout triggered");
      return true;
    }
    
    return false;
  } catch (err) {
    console.error("❌ Token expiry check failed:", err);
    return true;
  }
}
