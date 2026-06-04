// src/components/business/IndustrySeats.jsx
import React from 'react';
import { FaUserCheck, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const IndustrySeats = ({ filled, open, chapterId }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Industry Seats</h3>
      
      <div className="space-y-6">
        {/* Filled Seats */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-700 flex items-center space-x-2">
              <FaUserCheck className="text-green-500" />
              <span>Filled Seats</span>
            </h4>
            <span className="text-sm text-gray-500">{filled.length} filled</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {filled.map((industry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">{industry}</span>
                <span className="text-xs text-green-600 font-semibold px-2 py-1 bg-green-100 rounded-full">
                  Filled
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Seats */}
      <div>
  <div className="flex items-center justify-between mb-3">
    <h4 className="font-semibold text-gray-700 flex items-center space-x-2">
      <FaUserPlus className="text-blue-500" />
      <span>Open Seats</span>
    </h4>
    <span className="text-sm text-gray-500">{open.length} open</span>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
    {open.map((industry, index) => (
      <div key={index} className="group p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 font-medium">{industry}</span>
          <span className="text-xs text-blue-600 font-semibold px-2 py-1 bg-blue-100 rounded-full">
            Available
          </span>
        </div>
        <Link to="/membership">
          <button className="w-full py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Apply for This Seat
          </button>
        </Link>
      </div>
    ))}
  </div>
</div>
</div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Each chapter maintains industry exclusivity — only one business per industry per chapter.
        </p>
      </div>
    </div>
  );
};

export default IndustrySeats;