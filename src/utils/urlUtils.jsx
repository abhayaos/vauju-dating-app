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
    
    // In a real implementation, you would use a service like:
    // 1. A backend endpoint that fetches OG data
    // 2. A third-party service like opengraph.io or microlink.io
    // 3. A self-hosted solution
    
    // For now, we'll simulate the response with a delay
    // In a production app, you would replace this with an actual API call
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Parse domain for display
    let domain = '';
    try {
      domain = new URL(url).hostname;
    } catch (e) {
      domain = url;
    }
    
    // Return mock data for demonstration
    // In a real app, this would come from an actual OG metadata fetching service
    return {
      url: url,
      title: `OG Preview for ${domain}`,
      description: `This is a preview of ${url}. In a production environment, this would show the actual Open Graph metadata including title, description, and image from the website.`,
      image: null,
      domain: domain,
      isLoading: false,
      error: null
    };
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