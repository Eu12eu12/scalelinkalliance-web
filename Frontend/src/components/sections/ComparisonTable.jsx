// src/components/sections/ComparisonTable.jsx
import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ComparisonTable = () => {
  const comparisons = [
    {
      scale: 'One accountable delivery team across web, marketing & systems',
      traditional: 'Managing 5 disconnected freelancers or agencies'
    },
    {
      scale: 'Transparent milestone approvals & deposit protection',
      traditional: 'Vague hourly billing or large upfront retainers'
    },
    {
      scale: 'Real-time Project Tracking Portal with live deliverables',
      traditional: 'Scattered email threads and missed deadlines'
    },
    {
      scale: 'Integrated lead capture, CRM pipelines & automation',
      traditional: 'Stand-alone website with broken conversion flows'
    },
    {
      scale: 'Proactive ongoing Care, security monitoring & updates',
      traditional: 'Build, launch, and complete post-delivery silence'
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <span className="text-emerald-700 font-semibold text-xs uppercase tracking-widest block mb-2">
          The ScaleLink Advantage
        </span>
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          Why ScaleLink Alliance Is Different
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          One coordinated team delivering reliable digital execution with complete milestone transparency.
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-xl border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 bg-[#18264A] text-white p-6">
          <div>
            <h3 className="text-xl font-bold text-emerald-400">ScaleLink Alliance</h3>
            <p className="text-xs text-slate-300">Done-For-You Systems & Delivery</p>
          </div>
          <div className="mt-4 md:mt-0">
            <h3 className="text-xl font-bold text-slate-200">Traditional / Fragmented Approach</h3>
            <p className="text-xs text-slate-300">Disconnected Freelancers & Standard Agencies</p>
          </div>
        </div>
        
        {comparisons.map((item, index) => (
          <div 
            key={index} 
            className={`grid grid-cols-1 md:grid-cols-2 ${
              index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
            } p-6 border-b border-slate-200 gap-4`}
          >
            <div>
              <div className="flex items-start space-x-3">
                <FaCheckCircle className="text-emerald-600 text-lg mt-0.5 shrink-0" />
                <span className="text-sm sm:text-base font-semibold text-slate-900">{item.scale}</span>
              </div>
            </div>
            <div>
              <div className="flex items-start space-x-3">
                <FaTimesCircle className="text-rose-500 text-lg mt-0.5 shrink-0" />
                <span className="text-sm sm:text-base text-slate-600">{item.traditional}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-slate-600 text-sm">
          A single professional partner to <strong className="text-[#18264A]">build, market, automate, and support</strong> your growth.
        </p>
      </div>
    </div>
  );
};

export default ComparisonTable;
