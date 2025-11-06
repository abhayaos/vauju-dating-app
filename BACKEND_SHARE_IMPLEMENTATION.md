# Backend Implementation - Post Share & Analytics

## Updated postController.js

The postController.js file has been updated with the following new endpoints:

### New Functions Added:

1. **sharePost** - Record when a user shares a post
2. **getPostShares** - Get analytics of who shared a post
3. **getPostAnalytics** - Get engagement metrics for a single post
4. **getUserPostAnalytics** - Get all analytics for a user's posts
5. **getPostPreview** - Get shareable preview of a post

---

## Step 1: Create Share Model

Create file: `models/Share.js`

```javascript
import mongoose from "mongoose";

const shareSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    sharedAt: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
shareSchema.index({ postId: 1 });
shareSchema.index({ userId: 1 });

const Share = mongoose.model("Share", shareSchema);

export default Share;
```

---

## Step 2: Update Post Model

Update file: `models/Post.js` - Add `shareCount` field:

```javascript
const postSchema = new mongoose.Schema(
  {
    // ... existing fields ...
    
    shareCount: {
      type: Number,
      default: 0
    },
    
    // ... rest of schema ...
  },
  {
    timestamps: true
  }
);
```

---

## Step 3: Add Routes

Update file: `routes/posts.js` or wherever post routes are defined:

```javascript
import express from "express";
import {
  getPosts,
  getPostsByUser,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  sharePost,              // NEW
  getPostShares,          // NEW
  getPostAnalytics,       // NEW
  getUserPostAnalytics,   // NEW
  getPostPreview          // NEW
} from "../controllers/postController.js";
import { authenticate } from "../middleware/auth.js"; // Adjust path as needed

const router = express.Router();

// Existing routes
router.get("/", getPosts);
router.get("/user/:userId", getPostsByUser);
router.get("/:id", getPost);
router.post("/", authenticate, createPost);
router.put("/:id", authenticate, updatePost);
router.delete("/:id", authenticate, deletePost);
router.post("/:id/like", authenticate, likePost);
router.delete("/:id/like", authenticate, unlikePost);
router.post("/:id/comments", authenticate, addComment);
router.delete("/:postId/comments/:commentId", authenticate, deleteComment);

// NEW ROUTES FOR SHARE & ANALYTICS
router.post("/:id/share", authenticate, sharePost);
router.get("/:id/shares", authenticate, getPostShares);
router.get("/:id/analytics", authenticate, getPostAnalytics);
router.get("/:id/preview", getPostPreview); // Public - no auth needed
router.get("/user/:userId/analytics", authenticate, getUserPostAnalytics);

export default router;
```

---

## Step 4: Import Share Model in Controller

The updated postController.js already imports Share:
```javascript
import Share from "../models/Share.js";
```

Make sure this import is correct based on your project structure.

---

## API Endpoints Summary

### 1. Share a Post
```
POST /api/posts/{postId}/share
Authorization: Bearer {token}

Body:
{
  "sharedAt": "2025-11-06T10:30:00.000Z"  // Optional, defaults to current time
}

Response:
{
  "success": true,
  "message": "Share recorded successfully",
  "share": {
    "_id": "share_mongo_id",
    "postId": "post_id",
    "userId": "user_id",
    "sharedAt": "2025-11-06T10:30:00.000Z",
    "createdAt": "2025-11-06T10:30:00.000Z"
  }
}
```

### 2. Get Post Shares Analytics
```
GET /api/posts/{postId}/shares
Authorization: Bearer {token}

Response:
{
  "success": true,
  "totalShares": 5,
  "shares": [
    {
      "_id": "share_id",
      "postId": "post_id",
      "userId": {
        "_id": "user_id",
        "name": "John Doe",
        "username": "johndoe",
        "profileImage": "url"
      },
      "sharedAt": "2025-11-06T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Single Post Analytics
```
GET /api/posts/{postId}/analytics
Authorization: Bearer {token}

Response:
{
  "success": true,
  "analytics": {
    "postId": "post_id",
    "title": "Post Title",
    "content": "Post content...",
    "author": "John Doe",
    "createdAt": "2025-11-06T10:30:00.000Z",
    "stats": {
      "likes": 25,
      "comments": 10,
      "shares": 5,
      "totalEngagement": 40
    },
    "engagement": {
      "likeRate": 62,      // percentage
      "commentRate": 25,
      "shareRate": 13
    }
  }
}
```

### 4. Get User Posts Analytics
```
GET /api/posts/user/{userId}/analytics
Authorization: Bearer {token}

Response:
{
  "success": true,
  "userId": "user_id",
  "totalPosts": 10,
  "analytics": {
    "totalLikes": 250,
    "totalComments": 100,
    "totalShares": 50,
    "averageEngagement": 40
  },
  "posts": [
    {
      "postId": "post_id",
      "content": "Post content...",
      "createdAt": "2025-11-06T10:30:00.000Z",
      "stats": {
        "likes": 25,
        "comments": 10,
        "shares": 5,
        "totalEngagement": 40
      }
    }
  ]
}
```

### 5. Get Post Preview (for sharing/pasting)
```
GET /api/posts/{postId}/preview

Response:
{
  "success": true,
  "preview": {
    "_id": "post_id",
    "title": "Untitled Post",
    "content": "Full post content here...",
    "author": "John Doe",
    "authorUsername": "johndoe",
    "authorImage": "image_url",
    "isVerified": true,
    "createdAt": "2025-11-06T10:30:00.000Z",
    "stats": {
      "likes": 25,
      "comments": 10,
      "shares": 5
    },
    "url": "https://yugalmeet.com/posts/post_id"
  }
}
```

---

## Frontend Integration

The frontend already handles:
- ✅ Share button with clipboard copy
- ✅ Auto-calling `/api/posts/{postId}/share`
- ✅ Display alert on successful share
- ✅ Passing userId and timestamp to backend

---

## Error Handling

All endpoints return appropriate status codes:
- **200**: Success
- **400**: Invalid input
- **404**: Post/User not found
- **500**: Server error

---

## Database Queries Performance

Add indexes for better performance:

```javascript
// In migration or seed file
Share.collection.createIndex({ postId: 1 });
Share.collection.createIndex({ userId: 1 });
Share.collection.createIndex({ postId: 1, createdAt: -1 });
```

---

## Testing

### Test with cURL

```bash
# Record a share
curl -X POST http://localhost:5000/api/posts/POST_ID/share \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sharedAt": "2025-11-06T10:30:00.000Z"
  }'

# Get post analytics
curl -X GET http://localhost:5000/api/posts/POST_ID/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get user analytics
curl -X GET http://localhost:5000/api/posts/user/USER_ID/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get post preview
curl -X GET http://localhost:5000/api/posts/POST_ID/preview
```

---

## Notes

- Share endpoint requires authentication (Bearer token)
- Preview endpoint is public (no authentication)
- Analytics endpoints require authentication
- Share records include timestamp and user info
- Post shareCount is automatically incremented
- All endpoints include comprehensive error handling
- Database indexes improve query performance

## Status

✅ Frontend: Implemented  
⏳ Backend: Ready to implement using updated postController.js  
📊 Database: Share model schema provided  
🔗 Routes: Configuration provided
