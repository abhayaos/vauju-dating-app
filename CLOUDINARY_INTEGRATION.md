# Cloudinary Backend Integration Guide

## Overview
This document outlines the professional, reliable Cloudinary integration for displaying user profile images across the Vauju Dating App application.

## Architecture Overview

### Image Utility Layer (`src/utils/imageUtils.js`)
A centralized utility module providing consistent image URL handling across the entire application.

**Key Functions:**
- `getSafeImageUrl(imageUrl, gender)` - Validates URLs and provides gender-specific fallbacks
- `getProfileImage(user)` - Extracts profile image from user objects with multiple field name support
- `handleImageError(event, gender)` - Graceful error handling for broken image links
- `isCloudinaryUrl(url)` - Validates Cloudinary URLs
- `getOptimizedCloudinaryUrl(url, options)` - Adds Cloudinary transformations for optimization
- `validateImageFile(file, options)` - Validates files before upload
- `fileToBase64(file)` - Converts files to base64 for preview

### Fallback Strategy
The application uses a tiered fallback approach:
1. Valid Cloudinary URLs (preferred)
2. Valid HTTPS URLs
3. Gender-specific default avatars
4. Universal default avatar

Default avatars:
```javascript
DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png"
```

## Frontend Pages - Image Display

### Updated Components
All pages now use the image utility functions for consistent display:

#### 1. **Profile.jsx**
- Displays authenticated user's own profile
- Shows profile picture with edit capability
- Uses `getProfileImage(user)` for profile display
- Uses `handleImageError(e, user.gender)` for fallbacks
- File validation via `validateImageFile()`

```jsx
<img
  src={getProfileImage(user)}
  alt="Profile"
  onError={(e) => handleImageError(e, user.gender)}
/>
```

#### 2. **EditProfile.jsx**
- Allows profile picture updates
- Instant preview before upload
- File size validation (5MB limit)
- File type validation (JPEG, PNG, WebP)
- Uses standardized image utilities

#### 3. **Home.jsx**
- Displays user posts with author profile pictures
- Shows current user's profile in sidebar
- SwipeCard integration for matches
- Consistent image handling across all user displays

```jsx
<img
  src={getProfileImage(post.user)}
  alt={post.user?.name}
  onError={(e) => handleImageError(e, post.user?.gender)}
/>
```

#### 4. **Matches.jsx**
- Shows match profiles in grid layout
- Hover effects with profile images
- Filter and pagination support
- Dynamic profile image display

#### 5. **Explore.jsx**
- Random girl finder feature
- Single profile display
- Message navigation integration

#### 6. **SwipeCard.jsx**
- Swipe interaction component
- Profile images with drag animations
- Desktop and mobile optimized

## Backend Configuration

### Express Server Setup (`backend-vauju/server.js`)
```javascript
// Enable large payload support for base64 image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
```

**Why 50MB limit?**
- Base64 encoding increases file size by ~33%
- Allows for high-quality images up to ~37.5MB
- Provides buffer for multiple simultaneous uploads

### JWT Authentication
The backend enforces strict JWT validation:
```javascript
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in environment variables");
  process.exit(1);
}
```

**Security Requirements:**
- JWT_SECRET must be defined in `.env` file
- No fallback default values allowed
- Standard Bearer token format: `Authorization: Bearer <token>`
- Backward compatibility with `x-user-id` header (deprecated)

### Authentication Middleware
```javascript
export const requireAuth = (req, res, next) => {
  let token = null;
  
  // Check Authorization header first (standard format)
  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Fallback to x-user-id header for backwards compatibility
  else if (req.headers["x-user-id"]) {
    token = req.headers["x-user-id"];
  }
  
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

### Profile Routes (`backend-vauju/routes/profileRoutes.js`)
```javascript
// Protected routes require Bearer token authentication
router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);
router.post("/upload", auth, upload.single('profilePic'), uploadProfilePicture);
```

### Profile Picture Upload
```javascript
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Save file locally or to Cloudinary
    const imageUrl = `/uploads/${fileName}`;

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: imageUrl },
      { new: true, runValidators: true }
    ).select("-password");
    
    return res.json({ url: imageUrl, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

## API Endpoints

### Profile Management
- `GET /api/profile` - Get current user's profile
- `PUT /api/profile` - Update profile information
- `POST /api/profile/upload` - Upload profile picture
- `GET /api/profile/me` - Get own profile (alias)

### User Lookup
- `GET /api/users/:id` - Get public user profile by ID
- `GET /api/users/username/:username` - Get public user profile by username

### Match Endpoints
- `GET /api/matches` - Get list of available matches
- `POST /api/matches/:profileId/like` - Like a profile
- `POST /api/matches/:profileId/pass` - Pass on a profile

## Field Naming Conventions

### User Object Properties
The `User` model and API responses use these image field names:
- `profileImage` - Primary field (recommended)
- `profilePic` - Alternative name (legacy support)
- `profilePicture` - Alternative name
- `avatar` - Fallback field
- `image` - Fallback field

**Image Utility Handles All Variants:**
```javascript
const imageUrl =
  user.profilePic ||
  user.profileImage ||
  user.profilePicture ||
  user.avatar ||
  user.image ||
  "";
```

## Frontend API Calls

### Standard Authorization Header
All API requests requiring authentication use Bearer tokens:
```javascript
const token = localStorage.getItem("token");
const res = await fetch(`${API_BASE}/api/profile/upload`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

### Handling 401 Unauthorized
When token expires or is invalid:
```javascript
if (res.status === 401) {
  // Attempt token refresh
  const newToken = await refreshToken();
  if (newToken) {
    localStorage.setItem("token", newToken);
    // Retry request with new token
  } else {
    // Redirect to login
    navigate("/login");
  }
}
```

## Environment Configuration

### Required Environment Variables

**Frontend (.env):**
```
VITE_API_URL=https://backend-vauju-1.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

**Backend (.env):**
```
JWT_SECRET=your_secure_jwt_secret
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## CORS Configuration

The backend allows cross-origin requests from:
- `http://localhost:5173` (local development)
- `https://vauju-dating-app.vercel.app` (production)
- `https://www.yugalmeet.com` (production)

**CORS Headers:**
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Credentials`
- `Access-Control-Allow-Methods`: GET, POST, PUT, PATCH, DELETE, OPTIONS
- `Access-Control-Allow-Headers`: Content-Type, Authorization, x-user-id

## Error Handling & Validation

### Image File Validation
```javascript
const validation = validateImageFile(file, {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/png", "image/webp"]
});

if (!validation.valid) {
  toast.error(validation.error);
  return;
}
```

### Common Error Scenarios

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid/expired token | Refresh token or login again |
| 413 Payload Too Large | File size exceeds limit | Check file size < 5MB |
| 400 Bad Request | Missing file or invalid format | Validate file type and size |
| CORS Error | Request from unauthorized origin | Add origin to CORS whitelist |
| Net::ERR_CONNECTION_REFUSED | Backend not running | Ensure backend server is running |

## Testing & Debugging

### Debug Image Loading
Enable console logging in image utilities:
```javascript
console.log("Loading image from:", getSafeImageUrl(imageUrl));
console.log("Is Cloudinary URL:", isCloudinaryUrl(url));
```

### Verify Token Format
Check token in DevTools console:
```javascript
const token = localStorage.getItem("token");
console.log("Token:", token);
const decoded = jwt_decode(token);
console.log("Decoded:", decoded);
```

### Check Network Requests
1. Open DevTools → Network tab
2. Filter by API requests
3. Verify:
   - Authorization header present
   - Correct Bearer format
   - Response includes updated user with image URL

## Cloudinary Optimization (Future)

When implementing Cloudinary as primary storage:

```javascript
// Cloudinary upload preset configuration
const options = {
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};

// Image optimization transformations
const optimizedUrl = getOptimizedCloudinaryUrl(url, {
  quality: "auto",
  fetch_format: "auto",
  width: 200,
  height: 200,
});
```

## Performance Considerations

1. **Image Caching**
   - Browser caches images by default
   - Add versioning for cache invalidation

2. **CDN Integration**
   - Cloudinary provides CDN by default
   - Reduces server load

3. **Responsive Images**
   - Use `srcSet` for different screen sizes
   - Lazy load images outside viewport

4. **Image Optimization**
   - Use next-gen formats (WebP, AVIF)
   - Compress without quality loss
   - Cloudinary does this automatically

## Security Best Practices

1. ✅ **JWT Token Security**
   - Never expose JWT_SECRET
   - Use strong, randomly generated secrets
   - Enforce Bearer token format

2. ✅ **File Upload Security**
   - Validate file type and size server-side
   - Reject non-image files
   - Store files securely

3. ✅ **CORS Security**
   - Whitelist only trusted origins
   - Use credentials: true carefully
   - Validate all cross-origin requests

4. ✅ **Data Privacy**
   - User images accessible only to authenticated users
   - Profile images linked to specific user IDs
   - Implement rate limiting on upload endpoints

## Maintenance & Support

### Common Issues & Solutions

**Profile images not displaying:**
1. Check console for 404 errors
2. Verify image URL in user object
3. Ensure image file exists on server
4. Check browser cache

**Upload failures:**
1. Verify file size < 5MB
2. Check file format (JPEG, PNG, WebP)
3. Ensure token is valid
4. Check server logs for errors

**Token expiration during upload:**
1. Implement token refresh before upload
2. Show warning before upload starts
3. Handle 401 response with re-authentication

## Related Files
- `src/utils/imageUtils.js` - Image utility functions
- `src/pages/Profile.jsx` - User profile page
- `src/pages/EditProfile.jsx` - Profile editor
- `src/pages/Home.jsx` - Home feed
- `src/pages/Matches.jsx` - Match profiles
- `src/pages/Explore.jsx` - Random girl finder
- `src/components/SwipeCard.jsx` - Swipe component
- `backend-vauju/server.js` - Backend configuration
- `backend-vauju/routes/profileRoutes.js` - Profile API
- `backend-vauju/controllers/profileController.js` - Profile logic

## Version History
- **v1.0** - Initial implementation with Cloudinary integration
- **Updated** - Added comprehensive image utilities and consistent fallbacks
- **Enhanced** - Implemented across all frontend pages and components
