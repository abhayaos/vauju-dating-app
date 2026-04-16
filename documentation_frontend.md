# YugalMeet — Frontend API Documentation

This document lists every backend API endpoint consumed by the YugalMeet frontend.
All endpoints are prefixed with `http://localhost:5000` (configurable via env).
All protected endpoints require the header: `Authorization: Bearer <token>`

---

## Auth

| Method | Endpoint | Request Body | Description |
|--------|----------|-------------|-------------|
| POST | `/api/auth/login` | `{ email, password }` | Authenticate user, returns `{ token, user: { email, fullName } }` |
| POST | `/api/auth/register` | `{ fullName, email, password, confirmPassword }` | Register new user, returns `{ token, user }` |
| POST | `/api/auth/logout` | — | Invalidate session/token (protected) |

---

## Users

| Method | Endpoint | Request Body | Description |
|--------|----------|-------------|-------------|
| GET | `/api/users/me` | — | Get current user's full profile. Returns `{ user: { name, age, bio, interests, photos[] } }` |
| PUT | `/api/users/me` | `{ name, age, bio, interests[] }` | Update current user's profile. Returns `{ user }` |

---

## Discover / Swipe

| Method | Endpoint | Request Body | Description |
|--------|----------|-------------|-------------|
| GET | `/api/discover` | — | Get a list of profiles to show in the swipe deck. Returns `{ profiles: [{ _id, name, age, bio, photos[], interests[] }] }` |
| POST | `/api/swipe` | `{ targetUserId, direction: "like" \| "pass" }` | Record a swipe. Returns `{ matched: boolean, matchedUser?: { _id, name, photos[] } }` |

---

## Matches

| Method | Endpoint | Request Body | Description |
|--------|----------|-------------|-------------|
| GET | `/api/matches` | — | Get all mutual matches for the current user. Returns `{ matches: [{ _id, name, age, photos[], chatId }] }` |

---

## Chats

| Method | Endpoint | Request Body | Description |
|--------|----------|-------------|-------------|
| GET | `/api/chats` | — | Get all chat conversations for the current user. Returns `{ chats: [{ _id, otherUser: { _id, name, photos[] }, lastMessage, updatedAt }] }` |
| GET | `/api/chats/:chatId/messages` | — | Get message history for a chat. Returns `{ messages: [{ _id, senderId, content, createdAt }], otherUser: { _id, name, photos[] } }` |
| POST | `/api/chats/:chatId/messages` | `{ content }` | Send a message in a chat. Returns `{ message: { _id, senderId, content, createdAt } }` |

---

## Posts

| Method | Endpoint | Request Body | Description |
|--------|----------|-------------|-------------|
| GET | `/api/posts/feed` | — | Get posts from the current user's matches. Returns `{ posts: [{ _id, author: { _id, name, photos[] }, content, imageUrl?, likeCount, commentCount, likedByMe, createdAt }] }` |
| POST | `/api/posts` | `{ content, imageUrl? }` | Create a new post. Returns `{ post }` |
| POST | `/api/posts/:postId/like` | — | Toggle like on a post. Returns `{ liked: boolean, likeCount }` |
| GET | `/api/posts/:postId/comments` | — | Get comments for a post. Returns `{ comments: [{ _id, author: { _id, name, photos[] }, content, createdAt }] }` |
| POST | `/api/posts/:postId/comments` | `{ content }` | Add a comment to a post. Returns `{ comment: { _id, author, content, createdAt } }` |

---

## Notes for Backend

- All list responses should support pagination via `?page=1&limit=20` query params (frontend is ready to extend).
- `photos` is an array of image URLs; the frontend always uses `photos[0]` as the primary photo.
- `chatId` on a match object should be the `_id` of the corresponding chat document so the frontend can navigate directly to `/chats/:chatId`.
- The `senderId` on a message is compared against `user.email` or `user._id` in the frontend to determine message alignment — ensure consistency in what identifier is returned.
