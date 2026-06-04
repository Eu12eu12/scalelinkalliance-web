// src/pages/Admin/AdminQuotes.jsx
import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { useToast } from './Toast';
import { 
  FaPlus, FaTrash, FaEdit, FaCheck, FaClock, FaExclamationTriangle, 
  FaFilter, FaSearch, FaPaperPlane, FaBriefcase, FaEye, FaUser, 
  FaEnvelope, FaPhone, FaGlobeAmericas, FaLayerGroup, FaMoneyBillWave,
  FaTimes, FaCheckDouble, FaHistory, FaFileInvoiceDollar, FaCalendar, 
  FaPlusCircle, FaMinusCircle, FaLink, FaExternalLinkAlt, FaTrashAlt
} from 'react-icons/fa';
import { 
  SERVICES_WITH_PACKAGES, 
  SERVICE_CATEGORIES, 
  CURRENCIES, 
  COUNTRIES,
  BUDGET_RANGES 
} from '../../utils/formConstants';
import PhoneInput from '../../components/forms/PhoneInput';

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingQuote, setViewingQuote] = useState(null);
  const [editingQuote, setEditingQuote] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [sendingQuoteId, setSendingQuoteId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    client: '', // Company Name
    clientFirstName: '',
    clientLastName: '',
    clientEmail: '',
    clientPhone: '',
    clientDialCode: '+1',
    clientWebsite: '',
    clientLocation: '',
    clientIndustry: '',
    
    // Services
    services: {}, // { serviceName: packageName }
    otherServiceDescription: '',
    
    // Project details
    projectGoal: '',
    projectScope: {
      // Tech-specific
      pagesCount: '',
      needCopywriting: false,
      needImages: false,
      needContactForms: false,
      needBooking: false,
      needPayment: false,
      needSeo: false,
      needMobile: false,
      siteRedesign: 'new_build', // new_build or redesign
      
      // Marketing-specific
      marketingPostsCount: '',
      marketingPlatforms: '',
      marketingCampaignLength: '',
      marketingTopics: '',
      marketingAdSupport: false,
      marketingMonthlyManagement: false,

      // App-specific
      appFeatures: '',
      appUserRoles: '',
      appDatabaseNeeds: '',
      appLoginSystem: false,
      appDashboardNeeds: '',
      appIntegrations: '',
      appReports: false,
      appAdminPanel: false,
      appSecurityNeeds: '',
      
      // Dynamic client answers (read-only reference)
      clientAnswers: {}
    },
    timeline: 'Within 30 days',
    budget: '$3,000 - $5,000',
    levelOfSupport: 'One-time project',
    
    // Client assets
    clientAssets: {
      hasLogo: false,
      hasBrandColors: false,
      hasBrandGuide: false,
      hasContent: false,
      hasPhotosVideos: false,
      hasProductImages: false,
      hasSocialMedia: false,
      hasHostingAccess: false,
      hasCrmAccess: false,
      likesExamples: ''
    },
    currentProblem: '',
    
    // Recommended Quote Details
    recommendedPackage: '',
    customQuoteAmount: '', // displayed in dollars
    depositRequired: '', // displayed in dollars
    estimatedCompletionTime: '',
    includedServices: '',
    notIncluded: '',
    optionalAddOns: [], // [{ name: '', price: '' }]
    monthlySupportOption: '',
    specialDiscount: '', // displayed in dollars
    quoteExpirationDate: '',
    
    // Quote management & internal notes
    quoteStatus: 'new_request',
    clientUrgency: 'medium',
    clientQuality: 'average',
    potentialUpsell: '',
    followUpReminder: '',
    salesStatus: 'Lead',
    lastContactDate: '',
    nextFollowUpDate: '',
    assignedTo: '',
    notes: '', // General internal notes
    description: '', // Project summary/solution recommendation
  });

  const [workerSuggestions, setWorkerSuggestions] = useState([]);
  const [isSearchingWorker, setIsSearchingWorker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validatedEmail, setValidatedEmail] = useState('');
  const validatedEmailRef = useRef('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { showToast, ToastContainer } = useToast();
  const token = localStorage.getItem('cms_token');

  // Format currency
  const formatPrice = (amountInCents, currencyCode = 'usd') => {
    const currency = CURRENCIES.find(c => c.code === (currencyCode || 'usd').toLowerCase()) || CURRENCIES[0];
    if (!amountInCents || amountInCents === 0) return 'Custom Quote';
    const decimalAmount = currency.zeroDecimal ? amountInCents : amountInCents / 100;
    try {
      return new Intl.NumberFormat(navigator.language, { 
        style: 'currency', 
        currency: (currencyCode || 'usd').toUpperCase(), 
        minimumFractionDigits: currency.zeroDecimal ? 0 : 2, 
        maximumFractionDigits: currency.zeroDecimal ? 0 : 2 
      }).format(decimalAmount);
    } catch { 
      return `${currency.symbol}${decimalAmount.toFixed(currency.zeroDecimal ? 0 : 2)}`; 
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleScopeChange = (key, val, type = 'text') => {
    setFormData(prev => ({
      ...prev,
      projectScope: {
        ...prev.projectScope,
        [key]: type === 'checkbox' ? !prev.projectScope[key] : val
      }
    }));
  };

  const handleAssetChange = (key) => {
    setFormData(prev => ({
      ...prev,
      clientAssets: {
        ...prev.clientAssets,
        [key]: !prev.clientAssets[key]
      }
    }));
  };

  // Add-on helpers
  const addAddOn = () => {
    setFormData(prev => ({
      ...prev,
      optionalAddOns: [...prev.optionalAddOns, { name: '', price: '' }]
    }));
  };

  const removeAddOn = (index) => {
    setFormData(prev => {
      const copy = [...prev.optionalAddOns];
      copy.splice(index, 1);
      return { ...prev, optionalAddOns: copy };
    });
  };

  const updateAddOn = (index, field, value) => {
    setFormData(prev => {
      const copy = [...prev.optionalAddOns];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, optionalAddOns: copy };
    });
  };

  // Autocomplete worker email
  const handleWorkerSearch = async (query) => {
    setFormData(prev => ({ ...prev, assignedTo: query }));
    if (query.length < 2) {
      setWorkerSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsSearchingWorker(true);
    try {
      const res = await fetch(`/api/cms/workers/search?query=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setWorkerSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error('Worker search failed', err);
    } finally {
      setIsSearchingWorker(false);
    }
  };

  const selectWorker = (email) => {
    setFormData(prev => ({ ...prev, assignedTo: email }));
    setValidatedEmail(email);
    validatedEmailRef.current = email;
    setWorkerSuggestions([]);
    setShowSuggestions(false);
  };

  const handleWorkerBlur = () => {
    setTimeout(() => {
      setFormData(prev => {
        if (prev.assignedTo && prev.assignedTo !== validatedEmailRef.current) {
          return { ...prev, assignedTo: '' };
        }
        return prev;
      });
      setShowSuggestions(false);
    }, 250);
  };

  const fetchQuotes = async () => {
    try {
      const res = await fetch('/api/cms/admin/notice-board', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        // In this system, every NoticeBoardJob can be managed as a quote/opportunity.
        // We will sort them by creation date descending.
        setQuotes(data);
      }
    } catch (err) {
      showToast('Failed to fetch quotes.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/cms/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setCurrentUser(data.user);
    } catch (err) { console.error('Session check failed', err); }
  };

  useEffect(() => { 
    fetchQuotes(); 
    fetchSession();

    const handleClickOutside = (e) => {
      if (!e.target.closest('.relative')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [token]);

  // Sync viewingQuote with updated list for real-time updates in modal
  useEffect(() => {
    if (viewingQuote && quotes.length > 0) {
      const updated = quotes.find(q => q.id === viewingQuote.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(viewingQuote)) {
        setViewingQuote(updated);
      }
    }
  }, [quotes, viewingQuote]);

  const handleOpenModal = (quote = null) => {
    if (quote) {
      setEditingQuote(quote);
      const servicesData = typeof quote.services === 'string' ? JSON.parse(quote.services) : (quote.services || {});
      
      let parsedScope = {
        pagesCount: '', needCopywriting: false, needImages: false, needContactForms: false,
        needBooking: false, needPayment: false, needSeo: false, needMobile: false, siteRedesign: 'new_build',
        marketingPostsCount: '', marketingPlatforms: '', marketingCampaignLength: '', marketingTopics: '',
        marketingAdSupport: false, marketingMonthlyManagement: false,
        appFeatures: '', appUserRoles: '', appDatabaseNeeds: '', appLoginSystem: false, appDashboardNeeds: '',
        appIntegrations: '', appReports: false, appAdminPanel: false, appSecurityNeeds: '',
        clientAnswers: {}
      };
      if (quote.projectScope) {
        const pScope = typeof quote.projectScope === 'string' ? JSON.parse(quote.projectScope) : quote.projectScope;
        parsedScope = { ...parsedScope, ...pScope };
      }

      let parsedAssets = {
        hasLogo: false, hasBrandColors: false, hasBrandGuide: false, hasContent: false,
        hasPhotosVideos: false, hasProductImages: false, hasSocialMedia: false, hasHostingAccess: false,
        hasCrmAccess: false, likesExamples: ''
      };
      if (quote.clientAssets) {
        const cAssets = typeof quote.clientAssets === 'string' ? JSON.parse(quote.clientAssets) : quote.clientAssets;
        parsedAssets = { ...parsedAssets, ...cAssets };
      }

      let parsedAddOns = [];
      if (quote.optionalAddOns) {
        try {
          const rawAddOns = typeof quote.optionalAddOns === 'string' ? JSON.parse(quote.optionalAddOns) : quote.optionalAddOns;
          parsedAddOns = Array.isArray(rawAddOns) ? rawAddOns.map(a => ({ name: a.name, price: a.price ? a.price / 100 : '' })) : [];
        } catch (e) { console.error(e); }
      }

      setFormData({
        title: quote.title || '',
        client: quote.client || '',
        clientFirstName: quote.clientFirstName || '',
        clientLastName: quote.clientLastName || '',
        clientEmail: quote.clientEmail || '',
        clientPhone: (() => {
          let phone = quote.clientPhone || '';
          const dial = quote.clientDialCode || '+1';
          if (phone.startsWith('+')) {
            const spaceIdx = phone.indexOf(' ');
            if (spaceIdx !== -1) {
              return phone.substring(spaceIdx + 1);
            } else if (phone.startsWith(dial)) {
              return phone.substring(dial.length);
            }
          }
          return phone;
        })(),
        clientDialCode: (() => {
          const phone = quote.clientPhone || '';
          let dial = quote.clientDialCode || '+1';
          if (phone.startsWith('+')) {
            const spaceIdx = phone.indexOf(' ');
            if (spaceIdx !== -1) {
              dial = phone.substring(0, spaceIdx);
            }
          }
          return dial;
        })(),
        clientWebsite: quote.clientWebsite || '',
        clientLocation: quote.clientLocation || '',
        clientIndustry: quote.clientIndustry || '',
        services: servicesData,
        otherServiceDescription: quote.otherServiceDescription || '',
        projectGoal: quote.projectGoal || '',
        projectScope: parsedScope,
        timeline: quote.clientTimeline || 'Within 30 days',
        budget: quote.budget || '$3,000 - $5,000',
        levelOfSupport: quote.levelOfSupport || 'One-time project',
        clientAssets: parsedAssets,
        currentProblem: quote.currentProblem || '',
        
        recommendedPackage: quote.recommendedPackage || '',
        customQuoteAmount: quote.customQuoteAmount ? String(quote.customQuoteAmount / 100) : '',
        depositRequired: quote.depositRequired ? String(quote.depositRequired / 100) : '',
        estimatedCompletionTime: quote.estimatedCompletionTime || '',
        includedServices: quote.includedServices || '',
        notIncluded: quote.notIncluded || '',
        optionalAddOns: parsedAddOns,
        monthlySupportOption: quote.monthlySupportOption || '',
        specialDiscount: quote.specialDiscount ? String(quote.specialDiscount / 100) : '',
        quoteExpirationDate: quote.quoteExpirationDate ? String(quote.quoteExpirationDate).slice(0, 10) : '',
        
        quoteStatus: quote.quoteStatus || 'new_request',
        clientUrgency: quote.clientUrgency || 'medium',
        clientQuality: quote.clientQuality || 'average',
        potentialUpsell: quote.potentialUpsell || '',
        followUpReminder: quote.followUpReminder ? String(quote.followUpReminder).slice(0, 10) : '',
        salesStatus: quote.salesStatus || 'Lead',
        lastContactDate: quote.lastContactDate ? String(quote.lastContactDate).slice(0, 10) : '',
        nextFollowUpDate: quote.nextFollowUpDate ? String(quote.nextFollowUpDate).slice(0, 10) : '',
        assignedTo: quote.assignedTo || '',
        notes: quote.notes || '',
        description: quote.description || '', // Project summary/solution recommendation
        stripeCheckoutUrl: quote.stripeCheckoutUrl || ''
      });
      setValidatedEmail(quote.assignedTo || '');
      validatedEmailRef.current = quote.assignedTo || '';
    } else {
      setEditingQuote(null);
      setFormData({
        title: '', client: '', clientFirstName: '', clientLastName: '',
        clientEmail: '', clientPhone: '', clientDialCode: '+1',
        clientWebsite: '', clientLocation: '', clientIndustry: '',
        services: {}, otherServiceDescription: '',
        projectGoal: '',
        projectScope: {
          pagesCount: '', needCopywriting: false, needImages: false, needContactForms: false,
          needBooking: false, needPayment: false, needSeo: false, needMobile: false, siteRedesign: 'new_build',
          marketingPostsCount: '', marketingPlatforms: '', marketingCampaignLength: '', marketingTopics: '',
          marketingAdSupport: false, marketingMonthlyManagement: false,
          appFeatures: '', appUserRoles: '', appDatabaseNeeds: '', appLoginSystem: false, appDashboardNeeds: '',
          appIntegrations: '', appReports: false, appAdminPanel: false, appSecurityNeeds: '',
          clientAnswers: {}
        },
        timeline: 'Within 30 days', budget: '$3,000 - $5,000', levelOfSupport: 'One-time project',
        clientAssets: {
          hasLogo: false, hasBrandColors: false, hasBrandGuide: false, hasContent: false,
          hasPhotosVideos: false, hasProductImages: false, hasSocialMedia: false, hasHostingAccess: false,
          hasCrmAccess: false, likesExamples: ''
        },
        currentProblem: '',
        recommendedPackage: '',
        customQuoteAmount: '', depositRequired: '', estimatedCompletionTime: '',
        includedServices: '', notIncluded: '', optionalAddOns: [], monthlySupportOption: '',
        specialDiscount: '', quoteExpirationDate: '',
        quoteStatus: 'new_request', clientUrgency: 'medium', clientQuality: 'average',
        potentialUpsell: '', followUpReminder: '', salesStatus: 'Lead',
        lastContactDate: '', nextFollowUpDate: '', assignedTo: '', notes: '', description: '',
        stripeCheckoutUrl: ''
      });
      setValidatedEmail('');
      validatedEmailRef.current = '';
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingQuote ? 'PATCH' : 'POST';
    const url = editingQuote 
      ? `/api/cms/admin/notice-board/${editingQuote.id}` 
      : '/api/cms/admin/notice-board';

    try {
      const rawAddOns = formData.optionalAddOns.map(a => ({ name: a.name, price: Number(a.price) * 100 }));
      
      const payload = {
        ...formData,
        // Convert dollar inputs to cents for server
        customQuoteAmount: formData.customQuoteAmount ? Math.round(Number(formData.customQuoteAmount) * 100) : null,
        depositRequired: formData.depositRequired ? Math.round(Number(formData.depositRequired) * 100) : null,
        specialDiscount: formData.specialDiscount ? Math.round(Number(formData.specialDiscount) * 100) : null,
        optionalAddOns: JSON.stringify(rawAddOns),
        projectScope: JSON.stringify(formData.projectScope),
        clientAssets: JSON.stringify(formData.clientAssets),
        services: JSON.stringify(formData.services),
        
        // Auto set properties from Quote Form to keep noticeboard compatible
        title: formData.title || `${formData.clientFirstName} ${formData.clientLastName} - ${formData.client}`,
        category: Object.keys(formData.services).join(', ') || 'Custom Solution',
        dueAt: formData.quoteExpirationDate || new Date(Date.now() + 14*24*60*60*1000).toISOString(), // Default expiry as due date if empty
        status: 'new' // fallback job status
      };

      // FormData is needed for Multer on backend even if no file is uploaded.
      const fd = new FormData();
      Object.keys(payload).forEach(key => {
        if (payload[key] !== null && payload[key] !== undefined) {
          fd.append(key, typeof payload[key] === 'object' ? JSON.stringify(payload[key]) : payload[key]);
        }
      });

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });

      if (res.ok) {
        showToast(`Quote draft ${editingQuote ? 'updated' : 'created'} successfully!`, 'success');
        setIsModalOpen(false);
        fetchQuotes();
      } else {
        const error = await res.json();
        showToast(error.error || 'Failed to save quote.', 'error');
      }
    } catch (err) {
      showToast('A network error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuote = async (id) => {
    if (!window.confirm('Are you sure you want to finalize and send this quote proposal to the client? This will generate a Stripe checkout link.')) return;
    setSendingQuoteId(id);
    try {
      const res = await fetch(`/api/cms/admin/notice-board/${id}/send-quote`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Quote compiled & emailed to client successfully!', 'success');
        fetchQuotes();
      } else {
        showToast(data.error || 'Failed to compile or email quote. Check pricing fields.', 'error');
      }
    } catch (err) {
      showToast('Network error during quote transmission.', 'error');
    } finally {
      setSendingQuoteId(null);
    }
  };

  // Filter quotes based on search and tab filters
  const filteredQuotes = quotes.filter(q => {
    // We treat jobs with quoteStatus set as quotes. Or all request jobs since we added quoteStatus defaults.
    const matchesSearch = (q.client || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (q.clientFirstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (q.clientLastName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filters
    let matchesFilter = false;
    if (filter === 'all') {
      matchesFilter = true;
    } else if (filter === 'new') {
      matchesFilter = q.quoteStatus === 'new_request';
    } else if (filter === 'sent') {
      matchesFilter = q.quoteStatus === 'quote_sent';
    } else if (filter === 'approved') {
      matchesFilter = ['approved', 'deposit_paid'].includes(q.quoteStatus);
    } else if (filter === 'declined') {
      matchesFilter = q.quoteStatus === 'declined';
    }

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const paginatedQuotes = filteredQuotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getQuoteStatusBadge = (status) => {
    const styles = {
      new_request: 'bg-blue-100 text-blue-800 border-blue-200',
      under_review: 'bg-amber-100 text-amber-800 border-amber-200',
      quote_sent: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      follow_up_needed: 'bg-purple-100 text-purple-800 border-purple-200',
      approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      deposit_paid: 'bg-green-100 text-green-800 border-green-200',
      in_progress: 'bg-sky-100 text-sky-800 border-sky-200',
      completed: 'bg-teal-100 text-teal-800 border-teal-200',
      declined: 'bg-rose-100 text-rose-800 border-rose-200'
    };
    const labels = {
      new_request: 'New Request',
      under_review: 'Under Review',
      quote_sent: 'Quote Sent',
      follow_up_needed: 'Follow-up Needed',
      approved: 'Approved',
      deposit_paid: 'Deposit Paid',
      in_progress: 'In Progress',
      completed: 'Completed',
      declined: 'Declined'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getQualityBadge = (quality) => {
    const styles = {
      poor: 'bg-slate-100 text-slate-500',
      average: 'bg-blue-50 text-blue-600',
      premium: 'bg-indigo-50 text-indigo-600',
      hot: 'bg-red-50 text-red-600 animate-pulse'
    };
    return (
      <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${styles[quality] || 'bg-slate-100 text-slate-500'}`}>
        {quality}
      </span>
    );
  };

  return (
    <AdminLayout pageTitle="Custom Quotes Manager">
      <div className="max-w-7xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search quotes by client name or business..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white transition-all outline-none text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
              <FaFilter className="text-slate-400 mr-2 text-xs" />
              <select 
                value={filter} 
                onChange={e => setFilter(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Opportunities</option>
                <option value="new">New Requests</option>
                <option value="sent">Quotes Sent</option>
                <option value="approved">Approved / Deposit Paid</option>
                <option value="declined">Declined</option>
              </select>
            </div>
            {currentUser?.role === 'super_admin' && (
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200"
              >
                <FaPlus size={12} />
                <span>New Custom Quote</span>
              </button>
            )}
          </div>
        </div>

        {/* Quotes List Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-slate-500">Fetching quotes opportunities...</p>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                <FaFileInvoiceDollar size={30} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No quotes found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Create a custom proposal draft or adjust search filters to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Opportunity / Client</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Budget / Quote Value</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timeline / Expiry</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedQuotes.map(quote => {
                    const servicesData = typeof quote.services === 'string' ? JSON.parse(quote.services) : (quote.services || {});
                    const amountFormatted = quote.customQuoteAmount ? formatPrice(quote.customQuoteAmount) : 'Pending Quote';
                    const depositFormatted = quote.depositRequired ? `Deposit: ${formatPrice(quote.depositRequired)}` : '';
                    
                    return (
                      <tr key={quote.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 leading-tight text-sm mb-1.5">
                            {quote.client}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-1">
                            {Object.keys(servicesData).map((svc, i) => (
                              <span key={i} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                {svc.replace(/Request Custom Quote - /g, '')}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">Client: {quote.clientFirstName} {quote.clientLastName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-700">{amountFormatted}</p>
                          {depositFormatted && <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">{depositFormatted}</p>}
                          <p className="text-[10px] text-slate-400 mt-0.5">Budget: {quote.budget || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-slate-700 font-semibold mb-1">Timeline: {quote.clientTimeline || 'Flexible'}</p>
                          <p className="text-[10px] text-slate-400">
                            Expires: {quote.quoteExpirationDate ? new Date(quote.quoteExpirationDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-slate-400">Rating:</span>
                              {getQualityBadge(quote.clientQuality || 'average')}
                            </div>
                            <p className="text-[10px] text-slate-500">Urgency: <span className="font-bold">{quote.clientUrgency || 'medium'}</span></p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[150px]">Rep: {quote.assignedTo || 'Unassigned'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">{getQuoteStatusBadge(quote.quoteStatus || 'new_request')}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {currentUser?.role === 'super_admin' && (
                              <>
                                <button 
                                  onClick={() => handleSendQuote(quote.id)}
                                  disabled={sendingQuoteId === quote.id || !quote.customQuoteAmount}
                                  className={`p-2 rounded-lg transition-colors ${
                                    !quote.customQuoteAmount 
                                      ? 'text-slate-300 cursor-not-allowed' 
                                      : 'text-indigo-600 hover:bg-indigo-50'
                                  }`} 
                                  title={sendingQuoteId === quote.id ? 'Sending...' : 'Email Quote Proposal to Client'}
                                >
                                  {sendingQuoteId === quote.id ? (
                                    <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <FaPaperPlane size={13} />
                                  )}
                                </button>
                                <button onClick={() => handleOpenModal(quote)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Proposal Builder"><FaEdit size={13} /></button>
                              </>
                            )}
                            {quote.stripeCheckoutUrl && (
                              <a 
                                href={quote.stripeCheckoutUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Stripe Checkout Payment Link"
                              >
                                <FaLink size={13} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-medium">
                    Showing <span className="font-bold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredQuotes.length)}</span> of <span className="font-bold text-slate-700">{filteredQuotes.length}</span> opportunities
                  </p>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <span className="text-xs text-slate-500 font-bold">{currentPage} / {totalPages}</span>
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-xs font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-white transition-colors disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 6-Section Proposal & Custom Quote Builder Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 sticky top-0 z-10 backdrop-blur-md">
                <div>
                  <h2 className="text-base font-bold text-slate-800">
                    {editingQuote ? `Quote Proposal Builder (#${editingQuote.id})` : 'New Custom Quote Proposal'}
                  </h2>
                  <p className="text-xs text-slate-400">Configure opportunities, price custom deliverables, and compile links.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-slate-400 hover:text-slate-600 text-lg p-1 hover:bg-slate-100 rounded-full transition-all"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-10">
                
                {/* SECTION 1: Client Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-black">1</span>
                    Client Details
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">First Name *</label>
                      <input required type="text" name="clientFirstName" value={formData.clientFirstName} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Last Name *</label>
                      <input required type="text" name="clientLastName" value={formData.clientLastName} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Business Name *</label>
                      <input required type="text" name="client" value={formData.client} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address *</label>
                      <input required type="email" name="clientEmail" value={formData.clientEmail} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number *</label>
                      <PhoneInput
                        value={formData.clientPhone}
                        dialCode={formData.clientDialCode}
                        onNumberChange={val => setFormData(p => ({ ...p, clientPhone: val }))}
                        onDialChange={val => setFormData(p => ({ ...p, clientDialCode: val }))}
                        py="py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Company Website</label>
                      <input type="text" name="clientWebsite" placeholder="e.g. www.example.com" value={formData.clientWebsite} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Business Location</label>
                      <input type="text" name="clientLocation" placeholder="e.g. Chicago, IL" value={formData.clientLocation} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Industry / Business Type</label>
                      <input type="text" name="clientIndustry" placeholder="e.g. E-Commerce, Retail" value={formData.clientIndustry} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Service Needed */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-black">2</span>
                    Services Needed
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.keys(SERVICES_WITH_PACKAGES).map((serviceName) => {
                      const isSelected = !!formData.services[serviceName];
                      return (
                        <label 
                          key={serviceName} 
                          className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => {
                              const copy = { ...formData.services };
                              if (isSelected) {
                                delete copy[serviceName];
                              } else {
                                copy[serviceName] = serviceName.includes('Request Custom Quote') ? 'custom' : 'starter';
                              }
                              setFormData(prev => ({ ...prev, services: copy }));
                            }}
                            className="w-4 h-4 text-blue-600 rounded mr-2.5" 
                          />
                          <span className="text-xs font-semibold text-slate-700 leading-snug">
                            {serviceName.replace(/Request Custom Quote - /g, '')}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {Object.keys(formData.services).some(s => s.includes('Request Custom Quote')) && (
                    <div className="mt-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Custom Service Description / Notes</label>
                      <textarea 
                        rows={2} 
                        name="otherServiceDescription"
                        value={formData.otherServiceDescription} 
                        onChange={handleInputChange} 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" 
                        placeholder="Explain client requirements for their custom package request..."
                      />
                    </div>
                  )}
                </div>

                {/* SECTION 3: Project Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-black">3</span>
                    Project Details
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Project Goal / Core Outcome</label>
                      <select name="projectGoal" value={formData.projectGoal} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white">
                        <option value="">Select core goal...</option>
                        <option value="Get more leads">Get more leads</option>
                        <option value="Improve website design">Improve website design</option>
                        <option value="Sell products online">Sell products online</option>
                        <option value="Automate business tasks">Automate business tasks</option>
                        <option value="Improve search visibility">Improve search visibility</option>
                        <option value="Manage social media">Manage social media</option>
                        <option value="Create content">Create content</option>
                        <option value="Build a custom system">Build a custom system</option>
                        <option value="Improve customer follow-up">Improve customer follow-up</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Timeline Preference</label>
                      <select name="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white">
                        <option value="Urgent: 1–3 days">Urgent: 1–3 days</option>
                        <option value="Within 1 week">Within 1 week</option>
                        <option value="Within 2 weeks">Within 2 weeks</option>
                        <option value="Within 30 days">Within 30 days</option>
                        <option value="Flexible">Flexible</option>
                        <option value="Ongoing monthly support">Ongoing monthly support</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Budget Expectation</label>
                      <select name="budget" value={formData.budget} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white">
                        <option value="Under $500">Under $500</option>
                        <option value="$500–$1,000">$500–$1,000</option>
                        <option value="$1,000–$2,500">$1,000–$2,500</option>
                        <option value="$2,500–$5,000">$2,500–$5,000</option>
                        <option value="$5,000+">$5,000+</option>
                        <option value="Not sure yet">Not sure yet</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Level of Support Needed</label>
                      <select name="levelOfSupport" value={formData.levelOfSupport} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white">
                        <option value="One-time project">One-time project</option>
                        <option value="Monthly support">Monthly support</option>
                        <option value="Strategy only">Strategy only</option>
                        <option value="Done-for-you service">Done-for-you service</option>
                        <option value="Project oversight">Project oversight</option>
                        <option value="Ongoing maintenance">Ongoing maintenance</option>
                        <option value="Consultation and planning">Consultation and planning</option>
                      </select>
                    </div>
                  </div>

                  {/* Collapsible/Conditional Scopes */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-1.5">Dynamic Project Scopes</h4>
                    
                    {/* Website Project Details */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block mb-1">Web Development / Design Scope</span>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Number of Pages</label>
                        <input type="text" placeholder="e.g. 5 pages" value={formData.projectScope.pagesCount || ''} onChange={e => handleScopeChange('pagesCount', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none text-xs transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Build Mode</label>
                        <select value={formData.projectScope.siteRedesign || 'new_build'} onChange={e => handleScopeChange('siteRedesign', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none text-xs transition-all">
                          <option value="new_build">Brand New Site Build</option>
                          <option value="redesign">Website Redesign / Improvement</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                        {[
                          { key: 'needCopywriting', label: 'Copywriting' },
                          { key: 'needImages', label: 'Custom Images' },
                          { key: 'needContactForms', label: 'Contact Forms' },
                          { key: 'needBooking', label: 'Booking System' },
                          { key: 'needPayment', label: 'Payment System' },
                          { key: 'needSeo', label: 'SEO Setup' },
                          { key: 'needMobile', label: 'Mobile Optim.' }
                        ].map(item => (
                          <label key={item.key} className="flex items-center gap-1.5 p-2 border border-slate-200 hover:border-slate-300 rounded-lg bg-white cursor-pointer select-none">
                            <input type="checkbox" checked={!!formData.projectScope[item.key]} onChange={() => handleScopeChange(item.key, null, 'checkbox')} className="w-3.5 h-3.5 text-blue-600 rounded" />
                            <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Marketing Scope */}
                    <div className="grid sm:grid-cols-2 gap-4 border-t border-slate-200/80 pt-4">
                      <div className="sm:col-span-2">
                        <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block mb-1">Marketing & Campaigns Scope</span>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Posts/Videos/Emails Count</label>
                        <input type="text" placeholder="e.g. 12 posts per month" value={formData.projectScope.marketingPostsCount || ''} onChange={e => handleScopeChange('marketingPostsCount', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none text-xs transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Platforms Involved</label>
                        <input type="text" placeholder="e.g. Instagram, Facebook, LinkedIn" value={formData.projectScope.marketingPlatforms || ''} onChange={e => handleScopeChange('marketingPlatforms', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none text-xs transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Campaign Length</label>
                        <input type="text" placeholder="e.g. 3 months" value={formData.projectScope.marketingCampaignLength || ''} onChange={e => handleScopeChange('marketingCampaignLength', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none text-xs transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Content Topics</label>
                        <input type="text" placeholder="e.g. SaaS growth, Business tips" value={formData.projectScope.marketingTopics || ''} onChange={e => handleScopeChange('marketingTopics', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none text-xs transition-all" />
                      </div>
                      <div className="sm:col-span-2 flex gap-3 mt-1">
                        {[
                          { key: 'marketingAdSupport', label: 'Ad Account Management Support' },
                          { key: 'marketingMonthlyManagement', label: 'Full Monthly Campaign Management' }
                        ].map(item => (
                          <label key={item.key} className="flex items-center gap-1.5 p-2 border border-slate-200 hover:border-slate-300 rounded-lg bg-white cursor-pointer select-none flex-1">
                            <input type="checkbox" checked={!!formData.projectScope[item.key]} onChange={() => handleScopeChange(item.key, null, 'checkbox')} className="w-3.5 h-3.5 text-blue-600 rounded" />
                            <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* App/Software Scope */}
                    <div className="grid sm:grid-cols-2 gap-4 border-t border-slate-200/80 pt-4">
                      <div className="sm:col-span-2">
                        <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block mb-1">App, SaaS & Custom Software Scope</span>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Required Features</label>
                        <input type="text" placeholder="e.g. Subscriptions, Messaging" value={formData.projectScope.appFeatures || ''} onChange={e => handleScopeChange('appFeatures', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none text-xs transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">User Roles</label>
                        <input type="text" placeholder="e.g. Clients, Admins, Workers" value={formData.projectScope.appUserRoles || ''} onChange={e => handleScopeChange('appUserRoles', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none text-xs transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Database Needs</label>
                        <input type="text" placeholder="e.g. SQLite local, MySQL scalable" value={formData.projectScope.appDatabaseNeeds || ''} onChange={e => handleScopeChange('appDatabaseNeeds', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none text-xs transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Dashboard/Integrations</label>
                        <input type="text" placeholder="e.g. Admin stats, HubSpot CRM" value={formData.projectScope.appDashboardNeeds || ''} onChange={e => handleScopeChange('appDashboardNeeds', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none text-xs transition-all" />
                      </div>
                      <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                        {[
                          { key: 'appLoginSystem', label: 'Login System' },
                          { key: 'appReports', label: 'Reports Gen.' },
                          { key: 'appAdminPanel', label: 'Admin Panel' }
                        ].map(item => (
                          <label key={item.key} className="flex items-center gap-1.5 p-2 border border-slate-200 hover:border-slate-300 rounded-lg bg-white cursor-pointer select-none">
                            <input type="checkbox" checked={!!formData.projectScope[item.key]} onChange={() => handleScopeChange(item.key, null, 'checkbox')} className="w-3.5 h-3.5 text-blue-600 rounded" />
                            <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Client Custom Quote Dynamic Submissions */}
                    {editingQuote && editingQuote.projectScope && (
                      <div className="border-t border-slate-200/80 pt-4">
                        <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block mb-2">Submitted Client Specifications (Dynamic Custom Quote)</span>
                        <div className="bg-slate-200/40 p-4 rounded-xl text-[11px] text-slate-600 font-semibold space-y-2 border border-slate-200">
                          {(() => {
                            const scope = typeof editingQuote.projectScope === 'string' ? JSON.parse(editingQuote.projectScope) : editingQuote.projectScope;
                            const answers = scope.customQuoteAnswers || {};
                            if (Object.keys(answers).length === 0) {
                              return <p className="italic text-slate-400">No dynamic specs submitted. Drafted internally by administrator.</p>;
                            }
                            
                            return (
                              <div className="grid md:grid-cols-2 gap-4">
                                {Object.entries(answers).map(([key, val]) => {
                                  if (!val || (Array.isArray(val) && val.length === 0)) return null;
                                  return (
                                    <div key={key}>
                                      <span className="text-[9px] text-slate-400 uppercase font-black block">{key.replace(/([A-Z])/g, ' $1')}</span>
                                      <span className="text-slate-700 block mt-0.5">{Array.isArray(val) ? val.join(', ') : val}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION 4: Assets and Access */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-black">4</span>
                    Assets & Access
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { key: 'hasLogo', label: 'Company Logo' },
                      { key: 'hasBrandColors', label: 'Brand Color Hexes' },
                      { key: 'hasBrandGuide', label: 'Brand Guide / Style Sheet' },
                      { key: 'hasContent', label: 'Written Copy / Content' },
                      { key: 'hasPhotosVideos', label: 'Company Photos / Videos' },
                      { key: 'hasProductImages', label: 'Product Photography' },
                      { key: 'hasSocialMedia', label: 'Social Accounts Access' },
                      { key: 'hasHostingAccess', label: 'Domain & Hosting logins' },
                      { key: 'hasCrmAccess', label: 'CRM / Email Platform access' }
                    ].map(item => (
                      <label 
                        key={item.key} 
                        className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${
                          formData.clientAssets[item.key] 
                            ? 'border-blue-500 bg-blue-50/50 shadow-sm' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={formData.clientAssets[item.key] || false}
                          onChange={() => handleAssetChange(item.key)}
                          className="w-4 h-4 text-blue-600 rounded mr-2.5" 
                        />
                        <span className="text-xs font-semibold text-slate-700 leading-snug">{item.label}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Examples / References They Like</label>
                    <textarea 
                      rows={2} 
                      value={formData.clientAssets.likesExamples || ''} 
                      onChange={e => setFormData(prev => ({ ...prev, clientAssets: { ...prev.clientAssets, likesExamples: e.target.value } }))} 
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" 
                      placeholder="e.g. likes clean SaaS layouts like Stripe, prefers dynamic slider in banner..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Current Problem Statement *</label>
                    <textarea 
                      required
                      rows={3} 
                      name="currentProblem"
                      value={formData.currentProblem} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" 
                      placeholder="Explain the client's current business problem that ScaleLink Alliance will solve..."
                    />
                  </div>
                </div>

                {/* SECTION 5: Custom Quote Builder */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-black">5</span>
                    Custom Quote Builder
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Recommended Package Name</label>
                      <input type="text" placeholder="e.g. Custom Web Redesign Suite" name="recommendedPackage" value={formData.recommendedPackage} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Custom Quote Amount (Total USD) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400 font-semibold text-sm">$</span>
                        <input required type="number" placeholder="2500" name="customQuoteAmount" value={formData.customQuoteAmount} onChange={handleInputChange} className="w-full pl-7 pr-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Deposit Required (USD) *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400 font-semibold text-sm">$</span>
                        <input required type="number" placeholder="500" name="depositRequired" value={formData.depositRequired} onChange={handleInputChange} className="w-full pl-7 pr-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Estimated Duration / Completed In</label>
                      <input type="text" placeholder="e.g. 10 business days" name="estimatedCompletionTime" value={formData.estimatedCompletionTime} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Special Discount, if any (USD)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400 font-semibold text-sm">$</span>
                        <input type="number" placeholder="e.g. 200" name="specialDiscount" value={formData.specialDiscount} onChange={handleInputChange} className="w-full pl-7 pr-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Quote Expiration Date</label>
                      <input type="date" name="quoteExpirationDate" value={formData.quoteExpirationDate} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white" />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Monthly Retainer Support Option (Optional)</label>
                      <input type="text" placeholder="e.g. $250/mo for weekly maintenance retainer" name="monthlySupportOption" value={formData.monthlySupportOption} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Services / Deliverables Included (one per line) *</label>
                      <textarea 
                        required
                        rows={4} 
                        name="includedServices"
                        value={formData.includedServices} 
                        onChange={handleInputChange} 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs transition-all" 
                        placeholder="- Setup responsive React page&#10;- Configure Stripe gateway&#10;- Add dashboard metrics charts"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Exclusions / What is NOT Included (one per line)</label>
                      <textarea 
                        rows={4} 
                        name="notIncluded"
                        value={formData.notIncluded} 
                        onChange={handleInputChange} 
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-xs transition-all" 
                        placeholder="- Domain registration costs&#10;- External third-party API keys monthly fee"
                      />
                    </div>
                  </div>

                  {/* Optional Add-Ons Repeater */}
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60 mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase">Optional Quote Add-ons</span>
                      <button 
                        type="button" 
                        onClick={addAddOn}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <FaPlusCircle /> Add Option
                      </button>
                    </div>

                    {formData.optionalAddOns.length === 0 ? (
                      <p className="text-[10px] text-slate-400 italic">No optional add-ons specified for this quote.</p>
                    ) : (
                      <div className="space-y-3">
                        {formData.optionalAddOns.map((add, idx) => (
                          <div key={idx} className="flex gap-4 items-center">
                            <input 
                              type="text" 
                              placeholder="Add-on Deliverable (e.g. Extra Revision round)"
                              value={add.name}
                              onChange={e => updateAddOn(idx, 'name', e.target.value)}
                              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                            />
                            <div className="relative w-28">
                              <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs">$</span>
                              <input 
                                type="number" 
                                placeholder="Price"
                                value={add.price}
                                onChange={e => updateAddOn(idx, 'price', e.target.value)}
                                className="w-full pl-6 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                              />
                            </div>
                            <button 
                              type="button" 
                              onClick={() => removeAddOn(idx)}
                              className="text-rose-500 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                            >
                              <FaTrashAlt size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.stripeCheckoutUrl && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-800">
                      <div className="flex items-center gap-2">
                        <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                        <span className="font-medium truncate max-w-sm sm:max-w-md">
                          Stripe Checkout link generated: <a href={formData.stripeCheckoutUrl} target="_blank" rel="noreferrer" className="underline font-bold hover:text-emerald-900">{formData.stripeCheckoutUrl}</a>
                        </span>
                      </div>
                      <a href={formData.stripeCheckoutUrl} target="_blank" rel="noreferrer" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded shadow-sm hover:shadow flex items-center gap-1 flex-shrink-0 ml-4 transition-all">
                        <FaExternalLinkAlt size={10} /> Visit Link
                      </a>
                    </div>
                  )}
                </div>

                {/* SECTION 6: Quote Management */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-xs font-black">6</span>
                    Quote Management & Notes
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Quote Status</label>
                      <select name="quoteStatus" value={formData.quoteStatus} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white font-bold text-slate-800">
                        <option value="new_request">New Request</option>
                        <option value="under_review">Under Review</option>
                        <option value="quote_sent">Quote Sent</option>
                        <option value="follow_up_needed">Follow-up Needed</option>
                        <option value="approved">Approved</option>
                        <option value="deposit_paid">Deposit Paid</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="declined">Declined</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Deal Stage (Sales Status)</label>
                      <select name="salesStatus" value={formData.salesStatus} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white">
                        <option value="Lead">New Lead</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Meeting Scheduled">Meeting Scheduled</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Contract Sent">Contract Sent</option>
                        <option value="Closed Won">Closed Won</option>
                        <option value="Closed Lost">Closed Lost</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Designated Rep (Assigned Team Member)</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="e.g. rep@scalelinkalliance.com" 
                          value={formData.assignedTo} 
                          onChange={e => handleWorkerSearch(e.target.value)}
                          onBlur={handleWorkerBlur}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" 
                        />
                        {isSearchingWorker && (
                          <div className="absolute right-3 top-2.5 animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400" />
                        )}
                        {showSuggestions && workerSuggestions.length > 0 && (
                          <ul className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto divide-y divide-slate-100">
                            {workerSuggestions.map(w => (
                              <li 
                                key={w.id} 
                                onMouseDown={() => selectWorker(w.email)}
                                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 cursor-pointer"
                              >
                                {w.email}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Client Urgency</label>
                      <select name="clientUrgency" value={formData.clientUrgency} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Client Lead Quality</label>
                      <select name="clientQuality" value={formData.clientQuality} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white">
                        <option value="poor">Poor</option>
                        <option value="average">Average</option>
                        <option value="premium">Premium</option>
                        <option value="hot">Hot Opportunity</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Potential Upsell Opportunities</label>
                      <input type="text" placeholder="e.g. Monthly maintenance post launch" name="potentialUpsell" value={formData.potentialUpsell} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Last Contact Date</label>
                      <input type="date" name="lastContactDate" value={formData.lastContactDate} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Next Follow-up Date</label>
                      <input type="date" name="nextFollowUpDate" value={formData.nextFollowUpDate} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Set Follow-up Reminder Alarm</label>
                      <input type="date" name="followUpReminder" value={formData.followUpReminder} onChange={handleInputChange} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">General Internal Notes (Private to Team)</label>
                    <textarea 
                      rows={3} 
                      name="notes"
                      value={formData.notes} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" 
                      placeholder="e.g. client is a referral from BNI Chicago chapter. Skeptical of SEO, focus on copywriting quality..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Recommended Solution Summary (Included in Client Quote Email) *</label>
                    <textarea 
                      required
                      rows={3} 
                      name="description"
                      value={formData.description} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" 
                      placeholder="A short summary detailing why this custom package is recommended to solve their core business problem..."
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-700 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-100 text-sm"
                  >
                    Save Draft
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </AdminLayout>
  );
};

export default AdminQuotes;
