import React from "react";
import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";

function PageNotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-8 flex items-center justify-center">
          <span className="text-4xl">🔍</span>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The link you followed may be broken, or the page may have been removed. <Link to="/" className="text-blue-900 font-semibold">Go Back to YugalMeet</Link>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/" 
            className="flex items-center justify-center bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          <Link 
            to="/explore" 
            className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <Search className="h-5 w-5 mr-2" />
            Explore YugalMeet
          </Link>
        </div>
      </div>
      
      <p className="mt-12 text-sm text-gray-500">
        © {new Date().getFullYear()} YugalMeet. All rights reserved.
      </p>
    </div>
  );
}

export default PageNotFound;