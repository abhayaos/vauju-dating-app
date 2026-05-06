const BASE = "http://localhost:5000/api";

const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.token || "";
  } catch {
    return "";
  }
};

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const req = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const api = {
  // auth
  login: (body) => req("POST", "/auth/login", body),
  register: (body) => req("POST", "/auth/register", body),

  // user
  getMe: () => req("GET", "/users/me"),
  updateMe: (body) => req("PUT", "/users/me", body),

  // photo upload — uses FormData, not JSON
  uploadPhoto: async (file) => {
    const form = new FormData();
    form.append("photo", file);
    const res = await fetch(`${BASE}/users/me/photo`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data;
  },

  deletePhoto: (url) => req("DELETE", "/users/me/photo", { url }),

  // discover
  getProfiles: () => req("GET", "/discover"),

  // swipe
  swipe: (body) => req("POST", "/swipe", body),
  getLikes: () => req("GET", "/swipe/likes"),

  // matches
  getMatches: () => req("GET", "/matches"),

  // chats
  getChats: () => req("GET", "/chats"),
  getMessages: (chatId) => req("GET", `/chats/${chatId}/messages`),
  sendMessage: (chatId, content) => req("POST", `/chats/${chatId}/messages`, { content }),

  // posts
  getFeed: () => req("GET", "/posts/feed"),
  createPost: (body) => req("POST", "/posts", body),
  likePost: (postId) => req("POST", `/posts/${postId}/like`),
  getComments: (postId) => req("GET", `/posts/${postId}/comments`),
  addComment: (postId, content) => req("POST", `/posts/${postId}/comments`, { content }),
};
