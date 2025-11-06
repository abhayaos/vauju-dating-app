import React from 'react';
import { useOGMetadata } from '../hooks/useOGMetadata';

const ProfessionalUrlPreview = ({ url }) => {
  const metadata = useOGMetadata(url);

  // Don't render anything if there's no URL
  if (!url) return null;

  if (metadata.isLoading) {
    return (
      <div className="border border-gray-200 rounded-xl mt-3 mb-3 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="w-full h-36 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-3 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
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
        className="inline-flex items-center text-blue-600 hover:text-blue-800 underline break-all text-sm font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        {url}
      </a>
    );
  }

  const { title, description, image, domain } = metadata;

  return (
    <div 
      className="border border-gray-200 rounded-xl mt-3 mb-3 overflow-hidden hover:shadow-md transition-all duration-200 bg-white cursor-pointer"
      onClick={() => window.open(url, '_blank')}
    >
      {image && (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img 
            src={image} 
            alt={title || 'Link preview'} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-sm bg-gray-200 flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-3 h-3 fill-current text-gray-600">
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14.4c-3.5 0-6.4-2.9-6.4-6.4S4.5 1.6 8 1.6s6.4 2.9 6.4 6.4-2.9 6.4-6.4 6.4z"/>
              <path d="M10.4 8l-2.4 2.4-2.4-2.4 2.4-2.4 2.4 2.4z"/>
            </svg>
          </div>
          <span className="text-xs font-medium text-gray-500 truncate">{domain || url}</span>
        </div>
        <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1 text-base">
          {title || url}
        </h4>
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-2">
            {description}
          </p>
        )}
        <div className="mt-3 flex items-center">
          <span className="text-xs text-blue-600 font-medium">View Preview</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalUrlPreview;