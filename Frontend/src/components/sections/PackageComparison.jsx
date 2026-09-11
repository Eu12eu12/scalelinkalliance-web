// src/components/sections/PackageComparison.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaClock, FaSyncAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export const SERVICE_FEATURES = {};

// Source of truth for package inclusions derived dynamically from the database.
// 1. Prefers the exact per-tier "includes" list authored for this package in packageData.details.
// 2. Falls back dynamically to packageData.rows filtering for checked items on this tier.
export const getPackageFeatures = (serviceSlug, tier, packageData = null) => {
  const normalizedTier = tier === 'basic' ? 'starter' : (tier === 'standard' ? 'growth' : tier);
  const tierOrder = ['starter', 'growth', 'premium'];
  const tierIndex = tierOrder.indexOf(normalizedTier);
  if (tierIndex === -1) return [];

  const tierDetailIncludes = packageData?.details?.[normalizedTier]?.includes || packageData?.details?.[tier]?.includes;
  if (tierDetailIncludes && tierDetailIncludes.length > 0) {
    return tierDetailIncludes;
  }

  return (packageData?.rows || [])
    .filter((row) => row?.values?.[normalizedTier] || row?.values?.[tier])
    .map((row) => row.label)
    .filter(Boolean);
};

const PackageComparison = ({ packageData, serviceSlug, onTabChange }) => {
  const tierLabels = { 
    starter: 'Starter', 
    growth: 'Growth', 
    premium: 'Premium',
    basic: 'Starter', 
    standard: 'Growth' 
  };
  const tiers = Array.isArray(packageData?.tiers) && packageData.tiers.length > 0
    ? packageData.tiers.map(t => t === 'basic' ? 'starter' : (t === 'standard' ? 'growth' : t))
    : ['starter', 'growth', 'premium'];
  const [activeTab, setActiveTab] = useState(tiers[0] || 'starter');
  const [includesOpen, setIncludesOpen] = useState(true);

  const details = packageData?.details || {};
  const activeDetail = details[activeTab] || {
    price: 'Custom Quote',
    packageName: tierLabels[activeTab] || activeTab,
    shortDescription: '',
    deliveryLabel: 'Shown during service selection',
    revisions: null,
    includes: []
  };

  // Switching tiers always reveals "What's Included" immediately, even if the
  // panel had previously been collapsed on another tier.
  const handleTabChange = (tier) => {
    setActiveTab(tier);
    setIncludesOpen(true);
    if (onTabChange) onTabChange(tier);
  };

  // The checkmark matrix uses the hand-authored, already-cascading `rows`
  // for this service (e.g. a Starter feature stays checked at Growth and
  // Premium even though those tiers' own "includes" lists don't repeat it
  // verbatim). Only fall back to deriving rows from the raw tier lists for
  // a service that has no authored rows at all.
  const comparisonRows = (packageData?.rows && packageData.rows.length > 0)
    ? packageData.rows
    : (() => {
        const tierFeatures = Object.fromEntries(
          tiers.map((tier) => [tier, getPackageFeatures(serviceSlug, tier, packageData)])
        );
        const allFeatures = [...new Set(tiers.flatMap((tier) => tierFeatures[tier] || []))];
        return allFeatures.map((label) => ({
          label,
          values: {
            starter: tierFeatures.starter?.includes(label) || tierFeatures.basic?.includes(label) || false,
            growth: tierFeatures.growth?.includes(label) || tierFeatures.standard?.includes(label) || false,
            premium: tierFeatures.premium?.includes(label) || false
          }
        }));
      })();

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full min-w-[600px] md:min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left p-4 text-sm font-semibold text-gray-700 w-1/4 whitespace-normal break-words"></th>
              {tiers.map((tier) => {
                const d = details[tier] || {
                  packageName: tierLabels[tier] || tier,
                  shortDescription: ''
                };
                return (
                  <th 
                    key={tier}
                    className={`text-left p-4 align-top cursor-pointer min-w-[160px] whitespace-normal break-words ${
                      activeTab === tier ? 'border-b-2 border-blue-600' : ''
                    }`}
                    onClick={() => handleTabChange(tier)}
                  >
                    <div className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                      {tierLabels[tier] || tier}
                    </div>
                    <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
                      {d.packageName || tierLabels[tier] || tier}
                    </div>
                    {d.shortDescription && (
                      <div className="text-xs text-gray-500 leading-relaxed normal-case font-normal mt-1">
                        {d.shortDescription}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, idx) => (
              <tr 
                key={idx} 
                className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}
              >
                <td className="p-3 text-sm text-gray-700 border-b border-gray-100 whitespace-normal break-words">
                  {row.label}
                </td>
                {tiers.map((tier) => (
                  <td key={tier} className="p-3 border-b border-gray-100 whitespace-normal break-words">
                    <FaCheck
                      className={row?.values?.[tier] ? 'text-green-600' : 'text-gray-300'}
                      size={16}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right side detail panel - now below the table */}
      <div className="p-6 border-t border-gray-200 bg-gray-50/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {tiers.map((tier) => (
              <button
                key={tier}
                onClick={() => handleTabChange(tier)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                  activeTab === tier
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {tierLabels[tier] || tier}
              </button>
            ))}
          </div>
          <span className="text-lg font-bold text-gray-900">{activeDetail?.price || ''}</span>
        </div>

        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
          <span className="font-semibold">{activeDetail?.packageName || ''}</span>{' '}
          {activeDetail?.shortDescription || ''}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1.5">
            <FaClock size={13} />
            {activeDetail?.deliveryLabel || ''}
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
          className="w-full flex items-center justify-between py-2.5 border-t border-gray-200 text-left"
        >
          <span className="text-sm font-semibold text-gray-900">What's Included</span>
          {includesOpen
            ? <FaChevronUp size={14} className="text-gray-500" />
            : <FaChevronDown size={14} className="text-gray-500" />
          }
        </button>

        {includesOpen && (
          <ul className="space-y-1.5 mt-3 pb-1 max-h-[300px] overflow-y-auto">
            {getPackageFeatures(serviceSlug, activeTab, packageData).map((item, idx) => (
              <li key={idx} className="flex items-start text-sm text-gray-700">
                <FaCheck className="text-green-600 mr-2.5 mt-0.5 shrink-0" size={12} />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PackageComparison;
