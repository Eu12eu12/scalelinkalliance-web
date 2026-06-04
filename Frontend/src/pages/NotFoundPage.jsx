// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/"
            className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all group"
          >
            <FaHome className="text-gray-400 group-hover:text-blue-600 text-2xl mx-auto mb-3" />
            <span className="font-semibold text-gray-900 group-hover:text-blue-600">Go Home</span>
          </Link>
          
          <Link
            to="/chapters"
            className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all group"
          >
            <FaSearch className="text-gray-400 group-hover:text-blue-600 text-2xl mx-auto mb-3" />
            <span className="font-semibold text-gray-900 group-hover:text-blue-600">Find Chapters</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all group"
          >
            <FaArrowLeft className="text-gray-400 group-hover:text-blue-600 text-2xl mx-auto mb-3" />
            <span className="font-semibold text-gray-900 group-hover:text-blue-600">Go Back</span>
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Looking for something specific?</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/services"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Our Services
            </Link>
            <Link
              to="/membership"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Membership Info
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;