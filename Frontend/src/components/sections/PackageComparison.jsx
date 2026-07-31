// src/components/sections/PackageComparison.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaClock, FaSyncAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PackageComparison = ({ packageData, serviceSlug, onTabChange }) => {
  const tierLabels = { basic: 'Basic', standard: 'Standard', premium: 'Premium' };
  const [activeTab, setActiveTab] = useState(packageData.tiers[0]);
  const [includesOpen, setIncludesOpen] = useState(true);
  const activeDetail = packageData.details[activeTab];

  const handleTabChange = (tier) => {
    setActiveTab(tier);
    if (onTabChange) onTabChange(tier);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Compare Packages</h2>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* LEFT: Comparison Table */}
        <div className="lg:col-span-3 overflow-x-auto">
          <table className="w-full border-collapse min-w-[560px]">
            <thead>
              <tr>
                <th className="text-left p-3 border-b border-gray-200 w-1/4"></th>
                {packageData.tiers.map((tier) => {
                  const d = packageData.details[tier];
                  const isActive = activeTab === tier;
                  return (
                    <th
                      key={tier}
                      onClick={() => handleTabChange(tier)}
                      className={`text-left p-3 border-b align-top cursor-pointer min-w-[160px] ${
                        isActive ? 'border-b-2 border-gray-900' : 'border-gray-200'
                      }`}
                    >
                      <div className="text-xl font-bold text-gray-900 mb-0.5 invisible">{d.price}</div>
                      <div className="text-base font-semibold text-gray-900 mb-2">{tierLabels[tier]}</div>
                      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        {d.packageName}
                      </div>
                      <div className="text-xs text-gray-500 leading-relaxed normal-case font-normal">
                        {d.shortDescription}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {packageData.rows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50/60' : ''}>
                  <td className="p-3 text-sm text-gray-700 border-b border-gray-100">{row.label}</td>
                  {packageData.tiers.map((tier) => (
                    <td key={tier} className="p-3 border-b border-gray-100">
                      <FaCheck
                        className={row.values[tier] ? 'text-gray-900' : 'text-gray-300'}
                        size={14}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RIGHT: Tabbed Detail Panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-4">
            {/* Tab strip */}
            <div className="flex border-b border-gray-200 mb-5">
              {packageData.tiers.map((tier) => (
                <button
                  key={tier}
                  onClick={() => handleTabChange(tier)}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                    activeTab === tier
                      ? 'text-gray-900 border-b-2 border-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tierLabels[tier]}
                </button>
              ))}
            </div>

            <div className="text-xl font-bold text-gray-900 mb-3 invisible">{activeDetail.price}</div>

            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              <span className="font-semibold">{activeDetail.packageName}</span>{' '}
              {activeDetail.shortDescription}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1.5">
                <FaClock size={13} />
                {activeDetail.deliveryLabel}
              </span>
              {activeDetail.revisions && (
                <span className="flex items-center gap-1.5">
                  <FaSyncAlt size={12} />
                  {activeDetail.revisions}
                </span>
              )}
            </div>

            <button
              onClick={() => setIncludesOpen(!includesOpen)}
              className="w-full flex items-center justify-between py-3 border-t border-gray-200 mb-1 text-left"
            >
              <span className="text-sm font-semibold text-gray-900">What's Included</span>
              {includesOpen
                ? <FaChevronUp size={14} className="text-gray-500" />
                : <FaChevronDown size={14} className="text-gray-500" />
              }
            </button>

            {includesOpen && (
              <ul className="space-y-2 mb-4 pb-2">
                {activeDetail.includes.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <FaCheck className="text-gray-900 mr-2 mt-1 shrink-0" size={11} />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            <Link
              to={`/services/${serviceSlug}`}
              className="block w-full py-3 text-center font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm mt-2"
            >
              View Full Service Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageComparison;