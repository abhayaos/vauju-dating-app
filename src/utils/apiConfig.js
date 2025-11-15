/**
 * API Configuration and utilities
 * Centralizes API endpoints and request handling
 */

// Use Vite environment variables or fallback to proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

// In production, always use /api proxy to avoid CORS
const getApiUrl = (endpoint) => {
  if (import.meta.env.PROD) {
    // Use relative /api path in production (handled by reverse proxy)
    return `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  }
  
  // In development, use proxy via Vite
  return `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

/**
 * Fetch wrapper with automatic error handling
 * @param {string} endpoint - API endpoint (e.g., '/posts')
 * @param {Object} options - Fetch options
 * @param {string} token - Optional auth token
 * @returns {Promise<any>} Response data
 */
export const apiFetch = async (endpoint, options = {}, token = null) => {
  const url = getApiUrl(endpoint);
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    
    if (response.status === 401) {
      error.message = 'Unauthorized - please login again';
    } else if (response.status === 403) {
      error.message = 'Access forbidden';
    } else if (response.status === 404) {
      error.message = 'Resource not found';
    } else if (response.status >= 500) {
      error.message = 'Server error - please try again later';
    }
    
    throw error;
  }

  return response.json();
};

/**
 * Get full backend URL for direct requests
 * Use sparingly - prefer /api proxy in most cases
 */
export const getBackendUrl = (endpoint) => {
  return `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

/**
 * Common API endpoints
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Posts
  POSTS: '/posts',
  POST_DETAIL: (id) => `/posts/${id}`,
  CREATE_POST: '/posts',
  DELETE_POST: (id) => `/posts/${id}`,
  LIKE_POST: (id) => `/posts/${id}/like`,
  COMMENT_POST: (id) => `/posts/${id}/comments`,
  SHARE_POST: (id) => `/posts/${id}/share`,
  
  // Users
  PROFILE: '/users/profile',
  USER_DETAIL: (id) => `/users/${id}`,
  UPDATE_PROFILE: '/users/profile',
  SEARCH_USERS: '/users/search',
  
  // Matches
  MATCHES: '/matches',
  LIKE_MATCH: (id) => `/matches/${id}/like`,
  PASS_MATCH: (id) => `/matches/${id}/pass`,
  
  // Messages
  CONVERSATIONS: '/messages',
  SEND_MESSAGE: (userId) => `/messages/${userId}`,
  GET_MESSAGES: (userId) => `/messages/${userId}`,
  
  // Community
  COMMUNITY_STATS: '/community/stats',
  COMMUNITY_POSTS: '/community/posts',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_READ: (id) => `/notifications/${id}/read`,
  
  // Upload
  UPLOAD_IMAGE: '/upload',
  DELETE_IMAGE: (publicId) => `/upload/${publicId}`,
  
  // Preview
  PREVIEW: '/preview'
};

/**
 * Request/Response Interceptor for logging and debugging
 */
export const createApiClient = (token = null) => {
  return {
    get: (endpoint, options = {}) => 
      apiFetch(endpoint, { ...options, method: 'GET' }, token),
    
    post: (endpoint, data = {}, options = {}) => 
      apiFetch(endpoint, { 
        ...options, 
        method: 'POST', 
        body: JSON.stringify(data) 
      }, token),
    
    put: (endpoint, data = {}, options = {}) => 
      apiFetch(endpoint, { 
        ...options, 
        method: 'PUT', 
        body: JSON.stringify(data) 
      }, token),
    
    delete: (endpoint, options = {}) => 
      apiFetch(endpoint, { ...options, method: 'DELETE' }, token),
    
    patch: (endpoint, data = {}, options = {}) => 
      apiFetch(endpoint, { 
        ...options, 
        method: 'PATCH', 
        body: JSON.stringify(data) 
      }, token),
  };
};

export const getShareUrl = (postId) => {
  return `${window.location.origin}/posts/${postId}`;
};

export const SHARE_POST_ENDPOINT = (postId) => `/api/posts/${postId}/share`;

// Preview endpoint
export const PREVIEW_ENDPOINT = (url) => `/api/preview?url=${encodeURIComponent(url)}`;