/**
 * Frontend/src/pages/Admin/AdminPromotions.jsx
 * 
 * Marketing → Holiday Promotions
 * Dedicated Administrator & Webmaster interface fulfilling Section 5 & Section 9.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminLayout from './AdminLayout';
import {
  FaTag, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle,
  FaClock, FaEye, FaHistory, FaBullhorn, FaChartLine, FaDollarSign,
  FaMousePointer, FaShoppingCart, FaCalendarAlt, FaShieldAlt, FaSpinner
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { HOLIDAY_THEMES } from '../../utils/holidayThemes';

const AVAILABLE_SERVICES = [
  { slug: 'website-development', name: 'Website Development' },
  { slug: 'build-from-scratch', name: 'Build From Scratch' },
  { slug: 'scale-existing-website', name: 'Scale Existing Website' },
  { slug: 'landing-pages', name: 'Landing Pages & Funnels' },
  { slug: 'ecommerce-development', name: 'E-Commerce Development' },
  { slug: 'crm-automation', name: 'CRM & Marketing Automation' },
  { slug: 'web-applications', name: 'Web Applications & SaaS' },
  { slug: 'api-integration', name: 'API Integration & Automation' },
  { slug: 'brand-identity', name: 'Brand Identity & Logo' },
  { slug: 'seo-marketing', name: 'SEO & Search Marketing' },
  { slug: 'paid-advertising', name: 'Paid Advertising' },
  { slug: 'email-marketing', name: 'Email Marketing' },
  { slug: 'lead-generation', name: 'Lead Generation' },
  { slug: 'graphic-design', name: 'Graphic Design' },
  { slug: 'video-editing', name: 'Video Editing' },
  { slug: 'copywriting', name: 'Copywriting' },
  { slug: 'online-booking-systems', name: 'Online Booking Systems' },
  { slug: 'business-process-automation', name: 'Business Process Automation' },
  { slug: 'website-maintenance', name: 'Website Maintenance (Monthly)' },
  { slug: 'virtual-assistant', name: 'Virtual Assistant Services' }
];

export const TIMEZONE_GROUPS = [
  {
    group: 'North America (US & Canada)',
    zones: [
      { value: 'America/Chicago', label: '(UTC-06:00) Central Time — Chicago, Dallas' },
      { value: 'America/New_York', label: '(UTC-05:00) Eastern Time — New York, Miami, Toronto' },
      { value: 'America/Denver', label: '(UTC-07:00) Mountain Time — Denver, Salt Lake' },
      { value: 'America/Los_Angeles', label: '(UTC-08:00) Pacific Time — Los Angeles, Seattle, Vancouver' },
      { value: 'America/Phoenix', label: '(UTC-07:00) Arizona (No DST) — Phoenix' },
      { value: 'America/Anchorage', label: '(UTC-09:00) Alaska — Anchorage' },
      { value: 'Pacific/Honolulu', label: '(UTC-10:00) Hawaii — Honolulu' },
    ]
  },
  {
    group: 'Europe & Africa',
    zones: [
      { value: 'Europe/London', label: '(UTC+00:00) London, Dublin, Edinburgh' },
      { value: 'Europe/Paris', label: '(UTC+01:00) Paris, Berlin, Rome, Madrid, Amsterdam' },
      { value: 'Europe/Athens', label: '(UTC+02:00) Athens, Bucharest, Helsinki' },
      { value: 'Europe/Moscow', label: '(UTC+03:00) Moscow, St. Petersburg' },
      { value: 'Africa/Johannesburg', label: '(UTC+02:00) Johannesburg, Pretoria' },
      { value: 'Africa/Lagos', label: '(UTC+01:00) Lagos, West Africa Time' },
    ]
  },
  {
    group: 'Asia & Middle East',
    zones: [
      { value: 'Asia/Dubai', label: '(UTC+04:00) Dubai, Abu Dhabi, Muscat' },
      { value: 'Asia/Kolkata', label: '(UTC+05:30) Mumbai, New Delhi, Bengaluru' },
      { value: 'Asia/Bangkok', label: '(UTC+07:00) Bangkok, Jakarta, Hanoi' },
      { value: 'Asia/Singapore', label: '(UTC+08:00) Singapore, Kuala Lumpur' },
      { value: 'Asia/Hong_Kong', label: '(UTC+08:00) Hong Kong, Beijing, Shanghai' },
      { value: 'Asia/Tokyo', label: '(UTC+09:00) Tokyo, Osaka, Seoul' },
    ]
  },
  {
    group: 'Australia & Pacific',
    zones: [
      { value: 'Australia/Perth', label: '(UTC+08:00) Western Australia — Perth' },
      { value: 'Australia/Sydney', label: '(UTC+10:00) Sydney, Melbourne, Canberra' },
      { value: 'Australia/Brisbane', label: '(UTC+10:00) Queensland — Brisbane' },
      { value: 'Pacific/Auckland', label: '(UTC+12:00) Auckland, Wellington' },
    ]
  },
  {
    group: 'Latin America',
    zones: [
      { value: 'America/Mexico_City', label: '(UTC-06:00) Mexico City, Guadalajara' },
      { value: 'America/Bogota', label: '(UTC-05:00) Bogota, Lima, Quito' },
      { value: 'America/Sao_Paulo', label: '(UTC-03:00) São Paulo, Rio de Janeiro' },
      { value: 'America/Buenos_Aires', label: '(UTC-03:00) Buenos Aires' },
    ]
  },
  {
    group: 'Universal Time (UTC)',
    zones: [
      { value: 'UTC', label: '(UTC+00:00) Coordinated Universal Time (UTC)' },
    ]
  }
];

const INITIAL_FORM = {
  name: '',
  holidayName: 'Black Friday',
  mainHeading: 'Build Smarter. Grow Faster. Save 20% This Holiday Season.',
  subheading: 'Give your business a head start on the new year. Save up to $400 on selected website development, CRM automation, and digital business improvement projects.',
  bannerText: 'HOLIDAY GROWTH EVENT — SAVE 20% ON ELIGIBLE PROJECTS — UP TO $400 OFF — EXPLORE OFFERS',
  showBanner: true,
  buttonText: 'Claim Your Holiday Discount',
  buttonDestination: '/holiday-offer',
  secondaryButtonText: 'Get a Free Website Review',
  secondaryButtonDestination: '/free-website-review',
  discountType: 'percentage',
  discountValue: 20,
  maxDiscount: 400,
  currency: 'USD',
  eligibleServices: [
    'website-development',
    'build-from-scratch',
    'scale-existing-website',
    'landing-pages',
    'ecommerce-development',
    'crm-automation',
    'web-applications',
    'api-integration',
    'brand-identity',
    'seo-marketing',
    'paid-advertising',
    'email-marketing',
    'lead-generation'
  ],
  excludedServices: ['website-maintenance', 'virtual-assistant'],
  startDate: '',
  endDate: '',
  timezone: 'America/Chicago',
  holidayTheme: 'black_friday',
  allowStacking: false,
  status: 'draft',
  termsAndConditions: 'Offer valid for approved eligible new projects and one-time setup fees. Maximum discount of $400 applies per eligible project. Recurring monthly retainers, maintenance subscriptions, third-party software licenses, and taxes are excluded. Promotional discounts cannot be combined with bundle discounts or existing promotional codes; the checkout system automatically applies whichever eligible discount offers greater savings. ScaleLink Alliance reserves the right to modify or discontinue promotions in accordance with company policy. All payments must be processed securely through authorized ScaleLink Alliance online payment channels. DO NOT PAY CASH.'
};

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [activeAuditLogs, setActiveAuditLogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const detectedTz = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Chicago';
    } catch {
      return 'America/Chicago';
    }
  }, []);

  const token = localStorage.getItem('cms_token');

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cms/promotions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load promotions');
      const data = await res.json();
      setPromotions(data.promotions || []);
    } catch (err) {
      toast.error(err.message || 'Error fetching promotions');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleOpenCreate = () => {
    setEditingId(null);
    const now = new Date();
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    setFormData({
      ...INITIAL_FORM,
      startDate: now.toISOString().slice(0, 16),
      endDate: nextWeek.toISOString().slice(0, 16)
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (promo) => {
    setEditingId(promo.id);
    setFormData({
      ...promo,
      startDate: promo.startDate ? new Date(promo.startDate).toISOString().slice(0, 16) : '',
      endDate: promo.endDate ? new Date(promo.endDate).toISOString().slice(0, 16) : '',
      eligibleServices: promo.eligibleServices || [],
      excludedServices: promo.excludedServices || []
    });
    setIsModalOpen(true);
  };

  const handleOpenAudit = (promo) => {
    setActiveAuditLogs(promo.auditLogs || []);
    setIsAuditModalOpen(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/cms/promotions/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(`Campaign status updated to ${newStatus}`);
      fetchPromotions();
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete campaign "${name}"?`)) return;
    try {
      const res = await fetch(`/api/cms/promotions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
      toast.success('Promotion deleted successfully');
      fetchPromotions();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e, forcedStatus = null) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        status: forcedStatus || formData.status
      };

      const url = editingId ? `/api/cms/promotions/${editingId}` : '/api/cms/promotions';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      toast.success(editingId ? 'Promotion updated successfully' : 'Promotion created successfully');
      setIsModalOpen(false);
      fetchPromotions();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleService = (listName, slug) => {
    setFormData(prev => {
      const current = prev[listName] || [];
      const updated = current.includes(slug)
        ? current.filter(s => s !== slug)
        : [...current, slug];
      return { ...prev, [listName]: updated };
    });
  };

  // Aggregated Reporting Metrics (Section 9)
  const totalClicks = promotions.reduce((sum, p) => sum + (p.bannerClicks || 0), 0);
  const totalVisits = promotions.reduce((sum, p) => sum + (p.landingPageVisits || 0), 0);
  const totalOrders = promotions.reduce((sum, p) => sum + (p.ordersCount || 0), 0);
  const totalSavingsGranted = promotions.reduce((sum, p) => sum + (p.totalDiscountGranted || 0), 0);
  const totalRevenue = promotions.reduce((sum, p) => sum + (p.totalRevenueGenerated || 0), 0);

  return (
    <AdminLayout pageTitle="Holiday Promotions & Discount Management">
      <div className="space-y-6">

        {/* ─── Top Header & Controls ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider">
                Marketing System
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Central Pricing Engine Connected</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Holiday Promotions</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Create, schedule, customize, and deactivate seasonal holiday discounts without modifying code.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all shrink-0"
          >
            <FaPlus size={12} />
            <span>New Promotion</span>
          </button>
        </div>

        {/* ─── Performance Reporting Cards (Section 9) ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Banner Clicks</span>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-900">{totalClicks.toLocaleString()}</span>
              <FaMousePointer className="text-blue-500 text-sm" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Landing Visits</span>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-900">{totalVisits.toLocaleString()}</span>
              <FaEye className="text-amber-500 text-sm" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Orders Placed</span>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-900">{totalOrders.toLocaleString()}</span>
              <FaShoppingCart className="text-emerald-500 text-sm" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Discounts Granted</span>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-black text-rose-600">${(totalSavingsGranted / 100).toFixed(2)}</span>
              <FaTag className="text-rose-500 text-sm" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Promoted Revenue</span>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-900">${(totalRevenue / 100).toFixed(2)}</span>
              <FaDollarSign className="text-emerald-600 text-sm" />
            </div>
          </div>
        </div>

        {/* ─── Campaign List Table ─── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <FaBullhorn className="text-blue-600" />
              <span>All Configured Campaigns</span>
            </h2>
            <span className="text-xs text-slate-400 font-semibold">{promotions.length} total</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin text-blue-600" />
              <span className="text-sm">Loading promotions...</span>
            </div>
          ) : promotions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <p>No holiday promotions created yet.</p>
              <button onClick={handleOpenCreate} className="mt-3 text-blue-600 font-bold hover:underline">
                Create first campaign
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Campaign Name</th>
                    <th className="py-3 px-4">Theme</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Schedule (CT)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Performance</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {promotions.map((promo) => {
                    const theme = HOLIDAY_THEMES[promo.holidayTheme] || HOLIDAY_THEMES.general_holiday;
                    return (
                      <tr key={promo.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Name & Headline */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 text-sm">{promo.name}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{promo.mainHeading}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">/{promo.slug}</div>
                        </td>

                        {/* Theme Preset */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${theme.badgeBg}`}>
                            {theme.label}
                          </span>
                        </td>

                        {/* Discount */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-black text-slate-900 text-sm">{promo.discountValue}% OFF</div>
                          <div className="text-[10px] text-slate-500">Max ${promo.maxDiscount} / project</div>
                        </td>

                        {/* Schedule */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                          <div><strong className="text-slate-700">Start:</strong> {new Date(promo.startDate).toLocaleDateString()}</div>
                          <div><strong className="text-slate-700">End:</strong> {new Date(promo.endDate).toLocaleDateString()}</div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {promo.computedStatus === 'active' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Active
                            </span>
                          ) : promo.computedStatus === 'scheduled' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                              <FaClock size={10} />
                              Scheduled
                            </span>
                          ) : promo.computedStatus === 'expired' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                              Expired
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                              {promo.status}
                            </span>
                          )}
                        </td>

                        {/* Performance Mini-Stats */}
                        <td className="py-4 px-4 whitespace-nowrap text-center text-xs">
                          <div className="font-bold text-slate-800">{promo.ordersCount || 0} orders</div>
                          <div className="text-[10px] text-slate-500">${((promo.totalRevenueGenerated || 0) / 100).toFixed(0)} rev</div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 whitespace-nowrap text-right space-x-1">
                          {promo.status !== 'active' ? (
                            <button
                              onClick={() => handleStatusChange(promo.id, 'active')}
                              title="Publish / Activate immediately"
                              className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition-colors"
                            >
                              Publish
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(promo.id, 'disabled')}
                              title="Disable promotion"
                              className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-[11px] transition-colors"
                            >
                              Disable
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEdit(promo)}
                            title="Edit campaign settings"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          >
                            <FaEdit size={13} />
                          </button>

                          <button
                            onClick={() => handleOpenAudit(promo)}
                            title="View audit trail"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-purple-600 hover:bg-slate-100 transition-colors"
                          >
                            <FaHistory size={13} />
                          </button>

                          {promo.status !== 'active' && (
                            <button
                              onClick={() => handleDelete(promo.id, promo.name)}
                              title="Delete campaign"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <FaTrash size={13} />
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ─── Promotion Editor Modal (Section 5) ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingId ? 'Edit Holiday Promotion' : 'Create New Holiday Promotion'}
                </h3>
                <p className="text-xs text-slate-500">All fields save directly to the promotional pricing engine.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Row 1: Identification */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Promotion Name (Internal) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. ScaleLink Alliance Holiday Growth Event"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Holiday Event Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.holidayName}
                    onChange={e => setFormData({ ...formData, holidayName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="e.g. Christmas, Black Friday, Easter, Independence Day"
                  />
                </div>
              </div>

              {/* Row 2: Headings & Copy */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Main Promotional Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mainHeading}
                    onChange={e => setFormData({ ...formData, mainHeading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Supporting Subheading
                  </label>
                  <textarea
                    rows={2}
                    value={formData.subheading}
                    onChange={e => setFormData({ ...formData, subheading: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Announcement Bar Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bannerText}
                    onChange={e => setFormData({ ...formData, bannerText: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Discount Rules & Caps */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.discountValue}
                    onChange={e => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Max Discount Cap (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.maxDiscount}
                    onChange={e => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Visual Theme
                  </label>
                  <select
                    value={formData.holidayTheme}
                    onChange={e => setFormData({ ...formData, holidayTheme: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white font-semibold"
                  >
                    {Object.values(HOLIDAY_THEMES).map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Dates & Scheduling */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Timezone *
                    </label>
                    {detectedTz && formData.timezone !== detectedTz && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, timezone: detectedTz }))}
                        className="text-[10px] font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        title="Set to your local timezone"
                      >
                        Use Local ({detectedTz.split('/').pop().replace(/_/g, ' ')})
                      </button>
                    )}
                  </div>
                  <select
                    value={formData.timezone}
                    onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#18264A]"
                  >
                    {!TIMEZONE_GROUPS.some(g => g.zones.some(z => z.value === formData.timezone)) && formData.timezone && (
                      <option value={formData.timezone}>{formData.timezone} (Saved / Custom)</option>
                    )}
                    {TIMEZONE_GROUPS.map(grp => (
                      <optgroup key={grp.group} label={grp.group}>
                        {grp.zones.map(z => (
                          <option key={z.value} value={z.value}>
                            {z.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Eligible Services Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Eligible Services (Qualifying for Holiday Discount)
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {AVAILABLE_SERVICES.map(svc => {
                    const checked = (formData.eligibleServices || []).includes(svc.slug);
                    return (
                      <label key={svc.slug} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleService('eligibleServices', svc.slug)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className={checked ? 'font-bold text-slate-900' : 'text-slate-600'}>{svc.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Row 6: Toggles & Terms */}
              <div className="space-y-4">
                <div className="flex items-center gap-6 text-xs font-semibold text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showBanner}
                      onChange={e => setFormData({ ...formData, showBanner: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Show Announcement Banner</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowStacking}
                      onChange={e => setFormData({ ...formData, allowStacking: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Allow Discount Combination (Disabled by Default)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Promotion Terms and Conditions
                  </label>
                  <textarea
                    rows={3}
                    value={formData.termsAndConditions}
                    onChange={e => setFormData({ ...formData, termsAndConditions: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmit(null, 'draft')}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Save Draft
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleSubmit(null, 'scheduled')}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Schedule Campaign
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => setFormData({ ...formData, status: 'active' })}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Publish Immediately
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ─── Audit Log Modal (Section 5) ─── */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FaHistory className="text-purple-600" />
                <span>Administration Audit Log</span>
              </h3>
              <button onClick={() => setIsAuditModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
            </div>

            {activeAuditLogs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No audit logs recorded for this promotion.</p>
            ) : (
              <div className="space-y-3">
                {activeAuditLogs.map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex justify-between items-center text-slate-500 mb-1">
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{log.details}</p>
                    <div className="text-[10px] text-slate-400 mt-1">By: {log.adminEmail}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminPromotions;

