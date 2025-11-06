import React, { useState, useEffect, useRef } from 'react';
import { getOptimizedCloudinaryUrl, isCloudinaryUrl, handleImageError } from '../utils/imageUtils';

/**
 * LazyImage Component
 * Implements lazy loading and blur-up effect for images
 * Improves perceived performance and reduces initial load time
 */
function LazyImage({
  src,
  alt = 'Image',
  className = '',
  width,
  height,
  gender = 'default',
  showBlur = true,
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    // Create blur placeholder
    if (showBlur && src && isCloudinaryUrl(src)) {
      const blurSrc = getOptimizedCloudinaryUrl(src, {
        quality: 10,
        fetch_format: 'auto',
        width: 20,
      });
      setImageSrc(blurSrc);
    } else if (src) {
      setImageSrc(src);
    }
  }, [src, showBlur]);

  useEffect(() => {
    if (!imageRef || !src) return;

    // Create intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load full resolution image
            const fullSrc = isCloudinaryUrl(src)
              ? getOptimizedCloudinaryUrl(src, {
                  quality: 'auto',
                  fetch_format: 'auto',
                  width: width || 400,
                })
              : src;

            setImageSrc(fullSrc);
            setIsLoaded(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    observer.observe(imageRef);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [imageRef, src, width]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-75'} ${className}`}
      style={{
        width: width ? `${width}px` : 'auto',
        height: height ? `${height}px` : 'auto',
      }}
      onError={(e) => handleImageError(e, gender)}
      loading="lazy"
      {...props}
    />
  );
}

export default React.memo(LazyImage);
