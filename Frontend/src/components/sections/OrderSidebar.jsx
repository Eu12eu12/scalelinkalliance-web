// src/components/sections/OrderSidebar.jsx
// Sits alongside PackageComparison on ServiceDetailPage.
// Shows selected package, specific add-ons per service (from amendment doc),
// live total, and Stripe Checkout button.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaShieldAlt, FaLock, FaCheckCircle, FaTimes,
  FaSpinner, FaTag, FaInfoCircle
} from 'react-icons/fa';

const PLATFORM_FEE_PERCENT = 0.05;
const API_BASE = import.meta.env.VITE_API_URL || '';

// ── Service starting prices ───────────────────────────────────────────────────
const SERVICE_STARTING_PRICES = {
  'graphic-design': 35,
  'video-editing': 75,
  'copywriting': 75,
  'brand-identity': 199,
  'photography': 199,
  'website-development': 699,
  'landing-pages': 499,
  'ecommerce-development': 999,
  'web-applications': 4999,
  'api-integration': 499,
  'website-maintenance': 149,
  'social-media-management': 299,
  'seo-marketing': 399,
  'paid-advertising': 399,
  'email-marketing': 199,
  'lead-generation': 199,
  'crm-automation': 499,
  'virtual-assistant': 149,
  'data-analytics': 199,
  'process-documentation': 400,
  'project-management': 499,
  'data-entry': 99,
  'ai-automation': 0,
};

// ── Specific add-ons per service — exactly from amendment doc item 6 ──────────
const SERVICE_ADDONS = {
  'website-development': [
    { slug: 'seo-marketing',           name: 'SEO Setup',                  price: 399  },
    { slug: 'copywriting',             name: 'Copywriting',                price: 75   },
    { slug: 'brand-identity',          name: 'Logo Design',                price: 199  },
    { slug: 'crm-automation',          name: 'CRM Setup',                  price: 499  },
    { slug: 'email-marketing',         name: 'Email Automation',           price: 199  },
    { slug: 'api-integration',         name: 'API Integration',            price: 499  },
    { slug: 'data-analytics',          name: 'Analytics Dashboard',        price: 199  },
    { slug: 'website-maintenance',     name: 'Website Maintenance',        price: 149  },
    { slug: 'lead-generation',         name: 'Lead Generation',            price: 199  },
    { slug: 'graphic-design',          name: 'Social Media Graphics',      price: 35   },
  ],
  'ecommerce-development': [
    { slug: 'data-entry',              name: 'Product Upload',             price: 99   },
    { slug: 'email-marketing',         name: 'Email Campaigns',            price: 199  },
    { slug: 'crm-automation',          name: 'Abandoned Cart Automation',  price: 499  },
    { slug: 'api-integration',         name: 'Inventory Sync',             price: 499  },
    { slug: 'photography',             name: 'Product Photography',        price: 199  },
    { slug: 'paid-advertising',        name: 'Paid Ads',                   price: 399  },
    { slug: 'seo-marketing',           name: 'SEO Setup',                  price: 399  },
    { slug: 'data-analytics',          name: 'Analytics Reports',          price: 199  },
  ],
  'lead-generation': [
    { slug: 'landing-pages',           name: 'Landing Page',               price: 499  },
    { slug: 'crm-automation',          name: 'CRM Pipeline',               price: 499  },
    { slug: 'email-marketing',         name: 'Email Follow-Up',            price: 199  },
    { slug: 'paid-advertising',        name: 'Paid Ads',                   price: 399  },
    { slug: 'seo-marketing',           name: 'SEO Content',                price: 399  },
    { slug: 'data-analytics',          name: 'Data Reports',               price: 199  },
    { slug: 'virtual-assistant',       name: 'VA Follow-Up',               price: 149  },
  ],
  'web-applications': [
    { slug: 'api-integration',         name: 'API Integration',            price: 499  },
    { slug: 'crm-automation',          name: 'CRM Setup',                  price: 499  },
    { slug: 'data-analytics',          name: 'Analytics Dashboard',        price: 199  },
    { slug: 'website-maintenance',     name: 'Website Maintenance',        price: 149  },
    { slug: 'seo-marketing',           name: 'SEO Setup',                  price: 399  },
    { slug: 'copywriting',             name: 'Copywriting',                price: 75   },
  ],
  'landing-pages': [
    { slug: 'copywriting',             name: 'Copywriting',                price: 75   },
    { slug: 'graphic-design',          name: 'Graphic Design',             price: 35   },
    { slug: 'paid-advertising',        name: 'Paid Advertising',           price: 399  },
    { slug: 'email-marketing',         name: 'Email Marketing',            price: 199  },
    { slug: 'crm-automation',          name: 'CRM Integration',            price: 499  },
    { slug: 'seo-marketing',           name: 'SEO Setup',                  price: 399  },
  ],
  'seo-marketing': [
    { slug: 'website-development',     name: 'Website Development',        price: 699  },
    { slug: 'copywriting',             name: 'Copywriting',                price: 75   },
    { slug: 'landing-pages',           name: 'Landing Pages',              price: 499  },
    { slug: 'paid-advertising',        name: 'Paid Advertising',           price: 399  },
    { slug: 'lead-generation',         name: 'Lead Generation',            price: 199  },
    { slug: 'graphic-design',          name: 'Blog Graphics',              price: 35   },
  ],
  'social-media-management': [
    { slug: 'graphic-design',          name: 'Graphic Design',             price: 35   },
    { slug: 'video-editing',           name: 'Video Editing',              price: 75   },
    { slug: 'copywriting',             name: 'Copywriting',                price: 75   },
    { slug: 'paid-advertising',        name: 'Social Media Ads',           price: 399  },
    { slug: 'photography',             name: 'Photography',                price: 199  },
  ],
  'crm-automation': [
    { slug: 'lead-generation',         name: 'Lead Generation',            price: 199  },
    { slug: 'email-marketing',         name: 'Email Marketing',            price: 199  },
    { slug: 'website-development',     name: 'Website Development',        price: 699  },
    { slug: 'api-integration',         name: 'API Integration',            price: 499  },
    { slug: 'data-analytics',          name: 'Analytics Dashboard',        price: 199  },
  ],
  'paid-advertising': [
    { slug: 'landing-pages',           name: 'Landing Pages',              price: 499  },
    { slug: 'copywriting',             name: 'Ad Copywriting',             price: 75   },
    { slug: 'social-media-management', name: 'Social Media Management',    price: 299  },
    { slug: 'lead-generation',         name: 'Lead Generation',            price: 199  },
    { slug: 'data-analytics',          name: 'Performance Analytics',      price: 199  },
  ],
  'email-marketing': [
    { slug: 'lead-generation',         name: 'Lead Generation',            price: 199  },
    { slug: 'copywriting',             name: 'Copywriting',                price: 75   },
    { slug: 'graphic-design',          name: 'Email Graphics',             price: 35   },
    { slug: 'crm-automation',          name: 'CRM Automation',             price: 499  },
    { slug: 'landing-pages',           name: 'Landing Pages',              price: 499  },
  ],
  'brand-identity': [
    { slug: 'graphic-design',          name: 'Graphic Design',             price: 35   },
    { slug: 'website-development',     name: 'Website Development',        price: 699  },
    { slug: 'copywriting',             name: 'Brand Copywriting',          price: 75   },
    { slug: 'social-media-management', name: 'Social Media Management',    price: 299  },
    { slug: 'photography',             name: 'Brand Photography',          price: 199  },
  ],
  'graphic-design': [
    { slug: 'brand-identity',          name: 'Brand Identity',             price: 199  },
    { slug: 'copywriting',             name: 'Copywriting',                price: 75   },
    { slug: 'social-media-management', name: 'Social Media Management',    price: 299  },
    { slug: 'website-development',     name: 'Website Development',        price: 699  },
    { slug: 'video-editing',           name: 'Video Editing',              price: 75   },
  ],
  'copywriting': [
    { slug: 'graphic-design',          name: 'Graphic Design',             price: 35   },
    { slug: 'website-development',     name: 'Website Development',        price: 699  },
    { slug: 'seo-marketing',           name: 'SEO Optimization',           price: 399  },
    { slug: 'email-marketing',         name: 'Email Marketing',            price: 199  },
    { slug: 'social-media-management', name: 'Social Media Management',    price: 299  },
  ],
  'photography': [
    { slug: 'graphic-design',          name: 'Graphic Design',             price: 35   },
    { slug: 'website-development',     name: 'Website Development',        price: 699  },
    { slug: 'social-media-management', name: 'Social Media Management',    price: 299  },
    { slug: 'video-editing',           name: 'Video Editing',              price: 75   },
    { slug: 'brand-identity',          name: 'Brand Identity',             price: 199  },
  ],
  'video-editing': [
    { slug: 'graphic-design',          name: 'Thumbnail Design',           price: 35   },
    { slug: 'copywriting',             name: 'Video Script',               price: 75   },
    { slug: 'social-media-management', name: 'Social Media Management',    price: 299  },
    { slug: 'paid-advertising',        name: 'Video Ads',                  price: 399  },
    { slug: 'landing-pages',           name: 'Landing Page',               price: 499  },
  ],
  'api-integration': [
    { slug: 'crm-automation',          name: 'CRM Automation',             price: 499  },
    { slug: 'web-applications',        name: 'Web Application',            price: 4999 },
    { slug: 'data-analytics',          name: 'Analytics Dashboard',        price: 199  },
    { slug: 'website-development',     name: 'Website Development',        price: 699  },
    { slug: 'process-documentation',   name: 'Process Documentation',      price: 400  },
  ],
  'website-maintenance': [
    { slug: 'website-development',     name: 'Website Development',        price: 699  },
    { slug: 'seo-marketing',           name: 'SEO Optimization',           price: 399  },
    { slug: 'graphic-design',          name: 'Visual Updates',             price: 35   },
    { slug: 'copywriting',             name: 'Content Updates',            price: 75   },
    { slug: 'data-analytics',          name: 'Performance Reports',        price: 199  },
  ],
  'virtual-assistant': [
    { slug: 'data-entry',              name: 'Data Entry',                 price: 99   },
    { slug: 'project-management',      name: 'Project Management',         price: 499  },
    { slug: 'process-documentation',   name: 'Process Documentation',      price: 400  },
    { slug: 'lead-generation',         name: 'Lead Generation',            price: 199  },
  ],
  'data-analytics': [
    { slug: 'crm-automation',          name: 'CRM Automation',             price: 499  },
    { slug: 'lead-generation',         name: 'Lead Generation',            price: 199  },
    { slug: 'seo-marketing',           name: 'SEO Reports',                price: 399  },
    { slug: 'paid-advertising',        name: 'Ad Performance Tracking',    price: 399  },
    { slug: 'website-development',     name: 'Analytics Integration',      price: 699  },
  ],
  'process-documentation': [
    { slug: 'project-management',      name: 'Project Management',         price: 499  },
    { slug: 'virtual-assistant',       name: 'Virtual Assistant',          price: 149  },
    { slug: 'crm-automation',          name: 'CRM Automation',             price: 499  },
    { slug: 'data-analytics',          name: 'Performance Reporting',      price: 199  },
    { slug: 'data-entry',              name: 'Data Entry',                 price: 99   },
  ],
  'project-management': [
    { slug: 'process-documentation',   name: 'Process Documentation',      price: 400  },
    { slug: 'virtual-assistant',       name: 'Virtual Assistant',          price: 149  },
    { slug: 'data-analytics',          name: 'Performance Tracking',       price: 199  },
    { slug: 'crm-automation',          name: 'CRM Automation',             price: 499  },
  ],
  'data-entry': [
    { slug: 'crm-automation',          name: 'CRM Automation',             price: 499  },
    { slug: 'data-analytics',          name: 'Data Analytics',             price: 199  },
    { slug: 'virtual-assistant',       name: 'Virtual Assistant',          price: 149  },
    { slug: 'process-documentation',   name: 'Process Documentation',      price: 400  },
    { slug: 'lead-generation',         name: 'Lead Database',              price: 199  },
  ],
  'ai-automation': [
    { slug: 'crm-automation',          name: 'CRM Setup',                  price: 499  },
    { slug: 'api-integration',         name: 'API Integration',            price: 499  },
    { slug: 'data-analytics',          name: 'Reporting Dashboard',        price: 199  },
    { slug: 'website-development',     name: 'Website Integration',        price: 699  },
    { slug: 'virtual-assistant',       name: 'Virtual Assistant Backup',   price: 149  },
  ],
};

// Fallback add-ons for any service not explicitly listed
const DEFAULT_ADDONS = [
  { slug: 'graphic-design',    name: 'Graphic Design',        price: 35  },
  { slug: 'copywriting',       name: 'Copywriting',           price: 75  },
  { slug: 'seo-marketing',     name: 'SEO Setup',             price: 399 },
  { slug: 'email-marketing',   name: 'Email Marketing',       price: 199 },
  { slug: 'data-analytics',    name: 'Analytics Dashboard',   price: 199 },
];

const parsePrice = (priceStr) => {
  if (!priceStr || priceStr === 'Custom Quote') return 0;
  const match = priceStr.replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

const OrderSidebar = ({ serviceSlug, selectedPackage, packagePrice, packageName, complementaryServices }) => {
  const [checkedAddOns, setCheckedAddOns] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const basePrice = parsePrice(packagePrice);
  const isCustomQuoteOnly = packagePrice === 'Custom Quote' || basePrice === 0;

  // Get the specific add-ons for this service from the doc, fallback to defaults
  const addOns = (SERVICE_ADDONS[serviceSlug] || DEFAULT_ADDONS).filter(
    a => a.slug !== serviceSlug // don't show the service itself as its own add-on
  );

  const toggleAddOn = (slug) => {
    setCheckedAddOns(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  const selectedAddOns = addOns.filter(a => checkedAddOns[a.slug]);
  const addOnTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const subtotal = basePrice + addOnTotal;
  const platformFee = parseFloat((subtotal * PLATFORM_FEE_PERCENT).toFixed(2));
  const total = subtotal + platformFee;

  const handleCheckout = async () => {
    if (isCustomQuoteOnly || total === 0) return;
    setLoading(true);
    setError('');

    try {
      const items = [
        {
          name: `${packageName} — ${serviceSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
          description: `${packageName} package`,
          price: basePrice,
          quantity: 1,
        },
        ...selectedAddOns.map(a => ({
          name: `Add-On: ${a.name}`,
          description: `Add-on service`,
          price: a.price,
          quantity: 1,
        })),
        ...(platformFee > 0 ? [{
          name: 'Platform Fee (5%)',
          description: 'ScaleLink Alliance platform fee',
          price: platformFee,
          quantity: 1,
        }] : []),
      ];

      const res = await fetch(`${API_BASE}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          serviceSlug,
          packageTier: selectedPackage,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&service=${serviceSlug}&package=${selectedPackage}`,
          cancelUrl: window.location.href,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create checkout session.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden sticky top-6">
      {/* Header */}
      <div className="bg-gray-900 px-6 py-4">
        <h3 className="text-white font-bold text-base">Your Order</h3>
      </div>

      <div className="p-6">
        {/* Selected package */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-gray-800">{packageName || 'Selected Package'}</span>
          <span className="text-sm font-bold text-gray-900">
            {isCustomQuoteOnly ? 'Custom Quote' : `$${basePrice.toLocaleString()}`}
          </span>
        </div>
        <p className="text-xs text-gray-400 mb-5 capitalize">{serviceSlug?.replace(/-/g, ' ')}</p>

        {/* Add-ons */}
        {addOns.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <FaTag className="text-blue-500" size={10} /> Add-On Services
            </p>
            <div className="space-y-2.5">
              {addOns.map(addon => (
                <div key={addon.slug} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`addon-${addon.slug}`}
                    checked={!!checkedAddOns[addon.slug]}
                    onChange={() => toggleAddOn(addon.slug)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer shrink-0"
                  />
                  <label htmlFor={`addon-${addon.slug}`} className="flex-grow cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-800 leading-snug">{addon.name}</span>
                      <span className="text-xs font-bold text-blue-600 ml-2 shrink-0">
                        +${addon.price.toLocaleString()}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checked add-ons summary */}
        {selectedAddOns.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1.5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Additional Features</p>
            {selectedAddOns.map(a => (
              <div key={a.slug} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 text-xs">{a.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-800 text-xs font-semibold">${a.price.toLocaleString()}</span>
                  <button
                    onClick={() => toggleAddOn(a.slug)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        {!isCustomQuoteOnly && (
          <div className="border-t border-gray-100 pt-4 space-y-2 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1">
                Platform Fee (5%)
                <FaInfoCircle className="text-gray-300 text-xs" />
              </span>
              <span className="text-gray-700">${platformFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-900">Total</span>
              <span className="text-blue-600">${total.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
            {error}
          </div>
        )}

        {/* CTA */}
        {isCustomQuoteOnly ? (
          <Link
            to="/contact"
            className="block w-full py-3.5 text-center font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
          >
            Request Custom Quote
          </Link>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={loading || total === 0}
            className="w-full py-3.5 font-bold rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <><FaSpinner className="animate-spin" /> Redirecting to checkout...</>
            ) : (
              <><FaLock size={12} /> Continue to Checkout — ${total.toLocaleString()}</>
            )}
          </button>
        )}

        {/* Save for later */}
        <button className="w-full mt-2 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          Save & Continue Later
        </button>

        {/* Trust badges */}
        <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <FaShieldAlt className="text-green-500 shrink-0 mt-0.5" size={13} />
            <div>
              <p className="text-xs font-semibold text-gray-800">100% Secure Payment</p>
              <p className="text-xs text-gray-400">Protected by industry-leading encryption</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <FaCheckCircle className="text-blue-500 shrink-0 mt-0.5" size={13} />
            <div>
              <p className="text-xs font-semibold text-gray-800">Need something custom?</p>
              <Link to="/contact" className="text-xs text-blue-600 hover:underline">
                Contact us for a personalized quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSidebar;