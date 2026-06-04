// src/components/sections/ComparisonTable.jsx
import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ComparisonTable = () => {
  const comparisons = [
    {
      scale: 'Curated chapters',
      traditional: 'Open attendance'
    },
    {
      scale: 'One industry per seat',
      traditional: 'Competing members'
    },
    {
      scale: 'Weekly accountability',
      traditional: 'Inconsistent follow-ups'
    },
    {
      scale: 'Referral tracking',
      traditional: 'No measurable ROI'
    },
    {
      scale: 'Growth-driven culture',
      traditional: 'Social connections only'
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Why ScaleLink Alliance Is Different
        </h2>
        <p className="text-xl text-gray-600">
          Networking With Structure, Standards, and Results
        </p>
      </div>
      
      <div className="max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 bg-linear-to-r from-blue-600 to-blue-800 text-white p-6">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-bold">ScaleLink Alliance</h3>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold">Traditional Networking</h3>
          </div>
        </div>
        
        {comparisons.map((item, index) => (
          <div 
            key={index} 
            className={`grid grid-cols-1 md:grid-cols-3 ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            } p-6 border-b border-gray-200`}
          >
            <div className="md:col-span-1">
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-green-500 text-xl" />
                <span className="text-lg font-semibold text-gray-900">{item.scale}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3">
                <FaTimesCircle className="text-red-400 text-xl" />
                <span className="text-lg text-gray-600">{item.traditional}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-600 italic">
          This isn't networking. This is <strong className="text-blue-600">relationship-driven scale</strong>.
        </p>
      </div>
    </div>
  );
};

export default ComparisonTable;