// src/utils/cookieParser.js
import Cookies from 'js-cookie';

/**
 * Get a specific cookie by name
 * @param {string} name - The name of the cookie
 * @returns {string|undefined} The cookie value or undefined if not found
 */
export function getCookie(name) {
  return Cookies.get(name);
}

/**
 * Set a cookie with default secure settings for JWT tokens
 * @param {string} name - The name of the cookie
 * @param {string} value - The cookie value
 * @param {object} options - Additional cookie options
 * @returns {void}
 */
export function setCookie(name, value, options = {}) {
  const defaultOptions = {
    httpOnly: false, // Note: httpOnly must be set on server-side
    secure: window.location.protocol === 'https:', // Use secure flag in production
    sameSite: 'Lax', // Changed to Lax for better compatibility
    path: '/',
    ...options,
  };

  Cookies.set(name, value, defaultOptions);
}

/**
 * Set JWT token in secure cookie (typically used with server-side httpOnly)
 * @param {string} token - The JWT token
 * @param {number} expiryDays - Number of days until expiration (default: 7)
 * @returns {void}
 */
export function setTokenCookie(token, expiryDays = 7) {
  setCookie('authToken', token, {
    maxAge: expiryDays * 24 * 60 * 60 * 1000, // Convert days to milliseconds
    sameSite: 'Lax',
  });
}

/**
 * Get JWT token from cookie
 * @returns {string|undefined} The JWT token or undefined if not found
 */
export function getTokenCookie() {
  return getCookie('authToken');
}

/**
 * Remove a cookie by name
 * @param {string} name - The name of the cookie to remove
 * @returns {void}
 */
export function removeCookie(name) {
  Cookies.remove(name, { path: '/' });
}

/**
 * Clear all cookies (careful with this!)
 * @returns {void}
 */
export function clearAllCookies() {
  const allCookies = Cookies.get();
  Object.keys(allCookies).forEach((cookieName) => {
    removeCookie(cookieName);
  });
}

/**
 * Parse all cookies into an object
 * @returns {object} Object containing all cookies as key-value pairs
 */
export function getAllCookies() {
  return Cookies.get();
}

/**
 * Check if a cookie exists
 * @param {string} name - The name of the cookie
 * @returns {boolean} True if cookie exists, false otherwise
 */
export function hasCookie(name) {
  return Cookies.get(name) !== undefined;
}

/**
 * Update a cookie value while keeping its options
 * @param {string} name - The name of the cookie
 * @param {string} value - The new value
 * @param {object} options - Cookie options
 * @returns {void}
 */
export function updateCookie(name, value, options = {}) {
  setCookie(name, value, options);
}
