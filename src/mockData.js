// ============================================================
// MOCK DATA — replace with real API calls when backend is ready
// Each section is labeled with the endpoint it maps to
// ============================================================

// GET /api/discover  →  { profiles: [...] }
export const MOCK_PROFILES = [
  {
    _id: "p1",
    name: "Aanya Sharma",
    age: 24,
    bio: "Coffee addict ☕ | Hiking enthusiast | Looking for someone to explore the mountains with.",
    photos: ["https://randomuser.me/api/portraits/women/44.jpg"],
    interests: ["Hiking", "Coffee", "Photography", "Travel"],
  },
  {
    _id: "p2",
    name: "Priya Mehta",
    age: 26,
    bio: "Bookworm 📚 | Amateur chef | Dog mom. Let's talk about life over chai.",
    photos: ["https://randomuser.me/api/portraits/women/68.jpg"],
    interests: ["Reading", "Cooking", "Dogs", "Yoga"],
  },
  {
    _id: "p3",
    name: "Riya Kapoor",
    age: 23,
    bio: "Artist by day, stargazer by night 🌙 | Into deep conversations.",
    photos: ["https://randomuser.me/api/portraits/women/90.jpg"],
    interests: ["Art", "Astronomy", "Music", "Philosophy"],
  },
  {
    _id: "p4",
    name: "Sneha Iyer",
    age: 25,
    bio: "Fitness freak 💪 | Foodie | Traveller. Swipe right if you love sunsets.",
    photos: ["https://randomuser.me/api/portraits/women/33.jpg"],
    interests: ["Fitness", "Food", "Travel", "Sunsets"],
  },
];

// GET /api/matches  →  { matches: [...] }
export const MOCK_MATCHES = [
  {
    _id: "m1",
    name: "Aanya Sharma",
    age: 24,
    photos: ["https://randomuser.me/api/portraits/women/44.jpg"],
    chatId: "chat1",
  },
  {
    _id: "m2",
    name: "Priya Mehta",
    age: 26,
    photos: ["https://randomuser.me/api/portraits/women/68.jpg"],
    chatId: "chat2",
  },
];

// GET /api/chats  →  { chats: [...] }
export const MOCK_CHATS = [
  {
    _id: "chat1",
    otherUser: {
      _id: "m1",
      name: "Aanya Sharma",
      photos: ["https://randomuser.me/api/portraits/women/44.jpg"],
    },
    lastMessage: "Hey! How are you? 😊",
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 min ago
  },
  {
    _id: "chat2",
    otherUser: {
      _id: "m2",
      name: "Priya Mehta",
      photos: ["https://randomuser.me/api/portraits/women/68.jpg"],
    },
    lastMessage: "Would love to grab coffee sometime!",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hrs ago
  },
];

// GET /api/chats/:chatId/messages  →  { messages: [...], otherUser }
export const MOCK_MESSAGES = {
  chat1: {
    otherUser: {
      _id: "m1",
      name: "Aanya Sharma",
      photos: ["https://randomuser.me/api/portraits/women/44.jpg"],
    },
    messages: [
      { _id: "msg1", senderId: "m1", content: "Hey! How are you? 😊", createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
      { _id: "msg2", senderId: "me", content: "I'm great! Just got back from a hike 🏔️", createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
      { _id: "msg3", senderId: "m1", content: "Oh wow, that sounds amazing! Where did you go?", createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    ],
  },
  chat2: {
    otherUser: {
      _id: "m2",
      name: "Priya Mehta",
      photos: ["https://randomuser.me/api/portraits/women/68.jpg"],
    },
    messages: [
      { _id: "msg4", senderId: "m2", content: "Would love to grab coffee sometime!", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
      { _id: "msg5", senderId: "me", content: "Absolutely! I know a great place ☕", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    ],
  },
};

// GET /api/posts/feed  →  { posts: [...] }
export const MOCK_POSTS = [
  {
    _id: "post1",
    author: {
      _id: "m1",
      name: "Aanya Sharma",
      photos: ["https://randomuser.me/api/portraits/women/44.jpg"],
    },
    content: "Just finished a 10km trail run! 🏃‍♀️ Feeling on top of the world. Who else loves morning runs?",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    likeCount: 12,
    commentCount: 3,
    likedByMe: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    _id: "post2",
    author: {
      _id: "m2",
      name: "Priya Mehta",
      photos: ["https://randomuser.me/api/portraits/women/68.jpg"],
    },
    content: "Made homemade pasta from scratch today 🍝 It took 3 hours but totally worth it!",
    imageUrl: null,
    likeCount: 8,
    commentCount: 2,
    likedByMe: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
];

// GET /api/posts/:postId/comments  →  { comments: [...] }
export const MOCK_COMMENTS = {
  post1: [
    { _id: "c1", author: { _id: "m2", name: "Priya Mehta", photos: ["https://randomuser.me/api/portraits/women/68.jpg"] }, content: "That's so inspiring! 🔥", createdAt: new Date().toISOString() },
    { _id: "c2", author: { _id: "me", name: "You", photos: [] }, content: "Same! Morning runs are the best", createdAt: new Date().toISOString() },
  ],
  post2: [
    { _id: "c3", author: { _id: "m1", name: "Aanya Sharma", photos: ["https://randomuser.me/api/portraits/women/44.jpg"] }, content: "Save me some! 😍", createdAt: new Date().toISOString() },
  ],
};

// GET /api/users/me  →  { user }
export const MOCK_ME = {
  _id: "me",
  name: "Rahul Verma",
  age: 25,
  bio: "Software dev by day, guitarist by night 🎸 | Love hiking and good food.",
  interests: ["Music", "Hiking", "Tech", "Food"],
  photos: ["https://randomuser.me/api/portraits/men/32.jpg"],
  email: "rahul@example.com",
};
