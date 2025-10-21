// Authentication utilities
export const validateToken = (token) => {
  if (!token || typeof token !== "string") {
    console.error("Token is missing or not a string:", token);
    return false;
  }
  
  const parts = token.split(".");
  if (parts.length !== 3) {
    console.error("Token does not have 3 parts:", token);
    return false;
  }
  
  try {
    // Try to decode the payload
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    
    // Check expiration with 5 minute buffer
    const now = Math.floor(Date.now() / 1000);
    const buffer = 5 * 60; // 5 minutes
    
    if (payload.exp && payload.exp < (now + buffer)) {
      console.error("Token has expired or will expire soon:", new Date(payload.exp * 1000));
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Invalid token format:", err);
    return false;
  }
};

export const decodeJWT = (token) => {
  try {
    if (!token || typeof token !== "string" || !token.includes(".")) {
      console.error("Invalid token format:", token);
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Token does not have three parts:", token);
      return null;
    }

    const payload = parts[1];
    try {
      const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      const parsedPayload = JSON.parse(decodedPayload);
      
      console.log("Decoded JWT payload:", JSON.stringify(parsedPayload, null, 2));

      // Check token expiration
      const now = Math.floor(Date.now() / 1000);
      if (parsedPayload.exp && parsedPayload.exp < now) {
        console.error("Token is expired:", parsedPayload);
        return null;
      }

      // Try multiple ID fields
      const userId = parsedPayload._id || parsedPayload.id || parsedPayload.sub || parsedPayload.userId;
      if (!userId) {
        console.error("No user ID found in JWT payload:", parsedPayload);
        return null;
      }

      return { ...parsedPayload, _id: userId }; // Normalize to _id
    } catch (err) {
      console.error("Failed to decode or parse JWT payload:", err);
      return null;
    }
  } catch (err) {
    console.error("Error in decodeJWT:", err);
    return null;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("authChange"));
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token && validateToken(token);
};

// Test API endpoint availability
export const testApiEndpoints = async (token, baseUrl = "http://localhost:5000/api", userId = null) => {
  const endpoints = [
    `${baseUrl}/auth/me`,
    `${baseUrl}/users/me`,
    `${baseUrl}/user/me`,
    `${baseUrl}/me`,
    `${baseUrl}/auth/user`,
    `${baseUrl}/auth/user/me`,
    `${baseUrl}/profile`,
    `${baseUrl}/profile/me`,
    `${baseUrl}/user/profile`,
    `${baseUrl}/users/profile`,
    ...(userId ? [
      `${baseUrl}/users/${userId}`,
      `${baseUrl}/user/${userId}`,
      `${baseUrl}/auth/user/${userId}`,
      `${baseUrl}/profile/${userId}`
    ] : [])
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`);
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      results.push({
        endpoint,
        status: res.status,
        ok: res.ok,
        statusText: res.statusText
      });
      
      if (res.ok) {
        console.log(`✅ Working endpoint found: ${endpoint}`);
        return endpoint;
      }
    } catch (err) {
      results.push({
        endpoint,
        error: err.message
      });
      console.log(`❌ Failed endpoint ${endpoint}:`, err.message);
    }
  }
  
  console.log("All endpoint test results:", results);
  return null;
};
