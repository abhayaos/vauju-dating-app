/**
 * Image Utility Functions for Cloudinary Integration
 * Provides consistent image URL handling, fallbacks, and validation across the application
 */

// Default avatar URLs for consistent fallbacks
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const FALLBACK_AVATARS = {
  default: DEFAULT_AVATAR,
  female: "https://cdn-icons-png.flaticon.com/512/747/747376.png",
  male: "https://cdn-icons-png.flaticon.com/512/747/747376.png",
  user: DEFAULT_AVATAR,
};

/**
 * Get a safe image URL with fallback to default avatar
 * Handles Cloudinary URLs, local URLs, and invalid URLs
 * @param {string|null|undefined} imageUrl - The image URL to validate
 * @param {string} gender - Optional gender for gender-specific fallback
 * @returns {string} - Valid image URL or default avatar
 */
export const getSafeImageUrl = (imageUrl, gender = "default") => {
  // If no URL provided, use fallback
  if (!imageUrl || typeof imageUrl !== "string" || imageUrl.trim() === "") {
    return FALLBACK_AVATARS[gender] || DEFAULT_AVATAR;
  }

  const trimmed = imageUrl.trim();

  // Validate URL is either Cloudinary or relative path
  const isCloudinary = trimmed.startsWith("https://res.cloudinary.com/");
  const isHttps = trimmed.startsWith("https://");
  const isHttp = trimmed.startsWith("http://");
  const isRelative = trimmed.startsWith("/");

  if (isCloudinary || (isHttps && !isHttp) || (isHttp && !isHttps) || isRelative) {
    return trimmed;
  }

  // If URL doesn't match expected patterns, use fallback
  return FALLBACK_AVATARS[gender] || DEFAULT_AVATAR;
};

/**
 * Get profile image from user object with consistent property checks
 * Handles multiple possible field names (profileImage, profilePic, avatar, image)
 * @param {Object} user - User object from API
 * @returns {string} - Safe image URL
 */
export const getProfileImage = (user) => {
  if (!user || typeof user !== "object") {
    return DEFAULT_AVATAR;
  }

  // Check multiple possible field names
  const imageUrl =
    user.profilePic ||
    user.profileImage ||
    user.profilePicture ||
    user.avatar ||
    user.image ||
    "";

  return getSafeImageUrl(imageUrl, user.gender);
};

/**
 * Handle image load errors gracefully with fallback image
 * Use in onError handler: onError={(e) => handleImageError(e, gender)}
 * @param {Event} event - Error event from image element
 * @param {string} gender - Optional gender for gender-specific fallback
 */
export const handleImageError = (event, gender = "default") => {
  if (event && event.target) {
    event.target.src = FALLBACK_AVATARS[gender] || DEFAULT_AVATAR;
  }
};

/**
 * Validate if image URL is from Cloudinary
 * @param {string} url - Image URL to validate
 * @returns {boolean} - True if URL is from Cloudinary
 */
export const isCloudinaryUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return url.startsWith("https://res.cloudinary.com/");
};

/**
 * Get optimized Cloudinary URL with transformations
 * Adds quality, size, and format optimizations for faster loading
 * @param {string} url - Cloudinary URL
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized Cloudinary URL
 */
export const getOptimizedCloudinaryUrl = (
  url,
  options = { quality: "auto", fetch_format: "auto", width: 200, height: 200 }
) => {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/transformations/public_id
  // Insert transformations after /upload/
  const parts = url.split("/upload/");
  if (parts.length !== 2) {
    return url;
  }

  const transformations = [];
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.fetch_format) transformations.push(`f_${options.fetch_format}`);
  if (options.width && options.height) {
    transformations.push(`w_${options.width}`);
    transformations.push(`h_${options.height}`);
    transformations.push("c_fill");
  }

  const transformStr = transformations.join(",");
  return transformStr ? `${parts[0]}/upload/${transformStr}/${parts[1]}` : url;
};

/**
 * Validate image file before upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} - { valid: boolean, error: string|null }
 */
export const validateImageFile = (
  file,
  options = { maxSize: 5 * 1024 * 1024, allowedTypes: ["image/jpeg", "image/png", "image/webp"] }
) => {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Please select a valid image file" };
  }

  if (!options.allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type not supported. Allowed: ${options.allowedTypes.join(", ")}` };
  }

  if (file.size > options.maxSize) {
    const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `Image size must be less than ${maxSizeMB}MB` };
  }

  return { valid: true, error: null };
};

/**
 * Convert file to base64 data URL
 * Useful for preview before upload
 * @param {File} file - File to convert
 * @returns {Promise<string>} - Base64 data URL
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default {
  getSafeImageUrl,
  getProfileImage,
  handleImageError,
  isCloudinaryUrl,
  getOptimizedCloudinaryUrl,
  validateImageFile,
  fileToBase64,
  DEFAULT_AVATAR,
  FALLBACK_AVATARS,
};
