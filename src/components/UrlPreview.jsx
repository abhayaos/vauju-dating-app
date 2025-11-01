import React from 'react';
import { useOGMetadata } from '../utils/urlUtils';

const UrlPreview = ({ url }) => {
  const metadata = useOGMetadata(url);

  // Don't render anything if there's no URL
  if (!url) return null;

  if (metadata.isLoading) {
    return (
      <div className="border border-gray-200 rounded-lg mt-2 mb-2 overflow-hidden bg-gray-50 animate-pulse">
        <div className="w-full h-32 bg-gray-200"></div>
        <div className="p-3">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (metadata.error) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline break-all"
      >
        {url}
      </a>
    );
  }

  const { title, description, image, domain } = metadata;

  return (
    <div 
      className="border border-gray-200 rounded-lg mt-2 mb-2 overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-white"
      onClick={() => window.open(url, '_blank')}
    >
      {image && (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
          <img 
            src={image} 
            alt={title || 'Link preview'} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-3">
        <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1 text-sm">
          {title || url}
        </h4>
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {description}
          </p>
        )}
        <p className="text-xs text-gray-500 flex items-center">
          <span className="w-4 h-4 bg-gray-300 rounded-sm mr-1 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-3 h-3 fill-current">
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14.4c-3.5 0-6.4-2.9-6.4-6.4S4.5 1.6 8 1.6s6.4 2.9 6.4 6.4-2.9 6.4-6.4 6.4z"/>
              <path d="M10.4 8l-2.4 2.4-2.4-2.4 2.4-2.4 2.4 2.4z"/>
            </svg>
          </span>
          {domain || url}
        </p>
      </div>
    </div>
  );
};

export default UrlPreview;