import { useState, useEffect } from 'react';

// Simple in-memory cache
const metadataCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Custom hook to fetch and cache OG metadata
 * @param {string} url - The URL to fetch metadata for
 * @returns {Object} - The metadata object with loading and error states
 */
export const useOGMetadata = (url) => {
  const [metadata, setMetadata] = useState({
    url: url,
    title: url,
    description: null,
    image: null,
    domain: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (!url) {
      setMetadata({
        url: '',
        title: '',
        description: null,
        image: null,
        domain: null,
        isLoading: false,
        error: 'No URL provided'
      });
      return;
    }

    // Check cache first
    const cached = metadataCache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setMetadata({ ...cached.data, isLoading: false });
      return;
    }

    const fetchMetadata = async () => {
      try {
        setMetadata(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Try to fetch from our backend preview endpoint
        const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Parse domain for display
          let domain = '';
          try {
            domain = new URL(url).hostname;
          } catch (e) {
            domain = url;
          }
          
          const metadataResult = {
            url: url,
            title: data.title || `OG Preview for ${domain}`,
            description: data.description || `Preview for ${url}`,
            image: data.image || null,
            domain: data.domain || domain,
            isLoading: false,
            error: null
          };
          
          // Cache the result
          metadataCache.set(url, {
            data: metadataResult,
            timestamp: Date.now()
          });
          
          setMetadata(metadataResult);
        } else {
          throw new Error('Failed to fetch preview data');
        }
      } catch (error) {
        let domain = '';
        try {
          domain = new URL(url).hostname;
        } catch (e) {
          domain = url;
        }
        
        const errorMetadata = {
          url: url,
          title: url,
          description: null,
          image: null,
          domain: domain,
          isLoading: false,
          error: error.message
        };
        
        setMetadata(errorMetadata);
      }
    };

    fetchMetadata();
  }, [url]);

  return metadata;
};