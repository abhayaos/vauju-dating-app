import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

function PageNotFound() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Yugal Meet</title>
        <meta name="description" content="Oops! The page you're looking for doesn't exist. Return to Yugal Meet homepage to connect with like-minded people." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-2xl w-full">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-8">Page Not Found</h2>
          <p className="text-lg text-gray-400 mb-12">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link 
            to="/" 
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Return to Homepage
          </Link>
          
          <div className="mt-16">
            <p className="text-gray-900 text-sm">
              Error code: 404
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default PageNotFound