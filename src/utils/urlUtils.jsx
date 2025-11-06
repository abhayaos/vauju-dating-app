import React, { useState, useEffect } from 'react';

/**
 * Extract URLs from text content
 * @param {string} content - The text content to search for URLs
 * @returns {Array} - Array of found URLs
 */
export const extractUrls = (content) => {
  if (!content) return [];
  
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = content.match(urlRegex);
  return matches || [];
};

/**
 * Fetch Open Graph metadata for a URL
 * @param {string} url - The URL to fetch metadata for
 * @returns {Promise<Object>} - Promise that resolves to the metadata object
 */
export const fetchOGMetadata = async (url) => {
  try {
    // Validate URL
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }
    
    // Parse domain for display
    let domain = '';
    try {
      domain = new URL(url).hostname;
    } catch (e) {
      domain = url;
    }
    
    // Try to fetch from our backend preview endpoint
    const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
    
    if (response.ok) {
      const data = await response.json();
      return {
        url: url,
        title: data.title || `OG Preview for ${domain}`,
        description: data.description || `Preview for ${url}`,
        image: data.image || null,
        domain: data.domain || domain,
        isLoading: false,
        error: null
      };
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
    
    return {
      url: url,
      title: url,
      description: null,
      image: null,
      domain: domain,
      isLoading: false,
      error: error.message
    };
  }
};

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

    const fetchMetadata = async () => {
      try {
        setMetadata(prev => ({ ...prev, isLoading: true, error: null }));
        const data = await fetchOGMetadata(url);
        setMetadata(data);
      } catch (error) {
        let domain = '';
        try {
          domain = new URL(url).hostname;
        } catch (e) {
          domain = url;
        }
        
        setMetadata(prev => ({
          ...prev,
          isLoading: false,
          error: error.message,
          domain: domain
        }));
      }
    };

    fetchMetadata();
  }, [url]);

  return metadata;
};