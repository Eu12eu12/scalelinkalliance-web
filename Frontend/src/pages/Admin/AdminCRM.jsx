// src/pages/Admin/AdminCRM.jsx
import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { useToast } from './Toast';
import { 
  FaHandshake, FaSearch, FaFilter, FaUser, FaClock, FaDollarSign,
  FaCalendarAlt, FaStar, FaChevronRight, FaTimes, FaSave, FaTrello, 
  FaInfoCircle, FaSyncAlt
} from 'react-icons/fa';
import { CURRENCIES } from '../../utils/formConstants';

const DEAL_STAGES = [
  { id: 'Lead', title: 'New Leads', color: 'border-t-blue-500 bg-blue-500/5' },
  { id: 'Contacted', title: 'Contacted', color: 'border-t-purple-500 bg-purple-500/5' },
  { id: 'Meeting Scheduled', title: 'Meeting Scheduled', color: 'border-t-amber-500 bg-amber-500/5' },
  { id: 'Quoted', title: 'Quoted', color: 'border-t-indigo-500 bg-indigo-500/5' },
  { id: 'Contract Sent', title: 'Contract Sent', color: 'border-t-pink-500 bg-pink-500/5' },
  { id: 'Closed Won', title: 'Closed Won', color: 'border-t-emerald-500 bg-emerald-500/5' },
  { id: 'Closed Lost', title: 'Closed Lost', color: 'border-t-rose-500 bg-rose-500/5' }
];

const AdminCRM = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRepFilter, setSelectedRepFilter] = useState('all');
  const [selectedQualityFilter, setSelectedQualityFilter] = useState('all');
  const [editingDeal, setEditingDeal] = useState(null);
  const [savingDeal, setSavingDeal] = useState(false);

  const [formData, setFormData] = useState({
    assignedTo: '',
    clientQuality: 'average',
    clientUrgency: 'medium',
    potentialUpsell: '',
    lastContactDate: '',
    nextFollowUpDate: '',
    followUpReminder: '',
    notes: '',
  });

  const [workerSuggestions, setWorkerSuggestions] = useState([]);
  const [isSearchingWorker, setIsSearchingWorker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validatedEmail, setValidatedEmail] = useState('');
  const validatedEmailRef = useRef('');

  const { showToast, ToastContainer } = useToast();
  const token = localStorage.getItem('cms_token');

  // Format currency
  const formatPrice = (amountInCents, currencyCode = 'usd') => {
    const currency = CURRENCIES.find(c => c.code === (currencyCode || 'usd').toLowerCase()) || CURRENCIES[0];
    if (!amountInCents || amountInCents === 0) return 'TBD';
    const decimalAmount = currency.zeroDecimal ? amountInCents : amountInCents / 100;
    try {
      return new Intl.NumberFormat(navigator.language, { 
        style: 'currency', 
        currency: (currencyCode || 'usd').toUpperCase(), 
        minimumFractionDigits: 0, 
        maximumFractionDigits: currency.zeroDecimal ? 0 : 2 
      }).format(decimalAmount);
    } catch { 
      return `${currency.symbol}${decimalAmount.toFixed(0)}`; 
    }
  };

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/admin/notice-board', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setDeals(data);
      }
    } catch (err) {
      showToast('Failed to fetch CRM deals.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();

    const handleClickOutside = (e) => {
      if (!e.target.closest('.relative')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [token]);

  // Drag and Drop implementation
  const handleDragStart = (e, dealId) => {
    e.dataTransfer.setData('text/plain', dealId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    if (!dealId) return;

    const deal = deals.find(d => String(d.id) === String(dealId));
    if (!deal) return;

    if (deal.salesStatus === targetStage) return;

    // Optimistic Update
    const originalDeals = [...deals];
    setDeals(prev => prev.map(d => String(d.id) === String(dealId) ? { ...d, salesStatus: targetStage } : d));

    try {
      const res = await fetch(`/api/cms/admin/notice-board/${dealId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ salesStatus: targetStage })
      });

      if (!res.ok) {
        throw new Error('Failed to update stage on server.');
      }
      showToast(`Deal moved to ${targetStage}`, 'success');
      // Refetch to ensure everything is in sync
      const updatedRes = await fetch('/api/cms/admin/notice-board', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const updatedData = await updatedRes.json();
      if (updatedRes.ok) setDeals(updatedData);
    } catch (err) {
      setDeals(originalDeals);
      showToast('Failed to change stage.', 'error');
    }
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

  const openEditModal = (deal) => {
    setEditingDeal(deal);
    setFormData({
      assignedTo: deal.assignedTo || '',
      clientQuality: deal.clientQuality || 'average',
      clientUrgency: deal.clientUrgency || 'medium',
      potentialUpsell: deal.potentialUpsell || '',
      lastContactDate: deal.lastContactDate ? String(deal.lastContactDate).slice(0, 10) : '',
      nextFollowUpDate: deal.nextFollowUpDate ? String(deal.nextFollowUpDate).slice(0, 10) : '',
      followUpReminder: deal.followUpReminder ? String(deal.followUpReminder).slice(0, 10) : '',
      notes: deal.notes || '',
    });
    setValidatedEmail(deal.assignedTo || '');
    validatedEmailRef.current = deal.assignedTo || '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveDealDetails = async (e) => {
    e.preventDefault();
    if (!editingDeal) return;
    setSavingDeal(true);

    try {
      const res = await fetch(`/api/cms/admin/notice-board/${editingDeal.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        showToast('Deal parameters updated successfully!', 'success');
        setEditingDeal(null);
        fetchDeals();
      } else {
        const error = await res.json();
        showToast(error.error || 'Failed to save deal details.', 'error');
      }
    } catch (err) {
      showToast('A network error occurred.', 'error');
    } finally {
      setSavingDeal(false);
    }
  };

  // Filters & calculations
  const filteredDeals = deals.filter(d => {
    // Only show jobs with quote status / client name (meaning they are custom quote candidates/requests)
    if (!d.client) return false;

    const matchesSearch = 
      (d.client || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (d.clientFirstName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (d.clientLastName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRep = selectedRepFilter === 'all' || d.assignedTo === selectedRepFilter;
    const matchesQuality = selectedQualityFilter === 'all' || d.clientQuality === selectedQualityFilter;

    return matchesSearch && matchesRep && matchesQuality;
  });

  // Extract list of representatives
  const representatives = Array.from(new Set(deals.map(d => d.assignedTo).filter(Boolean)));

  // Calculate Pipeline metrics
  const activeDeals = filteredDeals.filter(d => d.salesStatus !== 'Closed Lost');
  const pipelineValue = activeDeals.reduce((sum, d) => sum + (d.customQuoteAmount || 0), 0);
  const closedWonValue = filteredDeals
    .filter(d => d.salesStatus === 'Closed Won')
    .reduce((sum, d) => sum + (d.customQuoteAmount || 0), 0);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'low': return 'bg-slate-50 text-slate-600 border-slate-200';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  const getQualityBadge = (quality) => {
    switch (quality) {
      case 'hot': return 'bg-red-500 text-white font-extrabold uppercase animate-pulse';
      case 'premium': return 'bg-indigo-600 text-white font-bold uppercase';
      case 'average': return 'bg-blue-100 text-blue-800 font-semibold uppercase';
      case 'poor': return 'bg-slate-100 text-slate-500 font-semibold uppercase';
      default: return 'bg-slate-100 text-slate-500 font-semibold uppercase';
    }
  };

  return (
    <AdminLayout pageTitle="CRM & Sales Pipelines">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Deal Metrics Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
              <FaTrello />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Deals</span>
              <span className="text-lg font-black text-slate-800 block mt-0.5">{filteredDeals.length}</span>
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-bold">
              <FaDollarSign />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Active Pipeline Value</span>
              <span className="text-lg font-black text-slate-800 block mt-0.5">{formatPrice(pipelineValue)}</span>
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
              <FaHandshake />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Closed Won Revenue</span>
              <span className="text-lg font-black text-emerald-600 block mt-0.5">{formatPrice(closedWonValue)}</span>
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
              <FaClock />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Conversion Rate</span>
              <span className="text-lg font-black text-slate-800 block mt-0.5">
                {filteredDeals.length > 0 
                  ? `${Math.round((filteredDeals.filter(d => d.salesStatus === 'Closed Won').length / filteredDeals.length) * 100)}%`
                  : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search deals by company or client..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white transition-all outline-none text-xs"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Rep Filter */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <FaUser className="text-slate-400 mr-2 text-[10px]" />
              <select 
                value={selectedRepFilter} 
                onChange={e => setSelectedRepFilter(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Representatives</option>
                {representatives.map(rep => (
                  <option key={rep} value={rep}>{rep}</option>
                ))}
              </select>
            </div>

            {/* Quality Filter */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <FaStar className="text-slate-400 mr-2 text-[10px]" />
              <select 
                value={selectedQualityFilter} 
                onChange={e => setSelectedQualityFilter(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Quality Types</option>
                <option value="hot">Hot Deals</option>
                <option value="premium">Premium Lead</option>
                <option value="average">Average Lead</option>
                <option value="poor">Poor Lead</option>
              </select>
            </div>

            <button 
              onClick={fetchDeals}
              className="p-2 text-slate-500 hover:text-blue-600 rounded-xl border border-slate-200 hover:bg-slate-50 bg-white transition-all"
              title="Sync Deals Board"
            >
              <FaSyncAlt className={loading ? 'animate-spin' : ''} size={12} />
            </button>
          </div>
        </div>

        {/* Kanban Board Container */}
        {loading ? (
          <div className="py-24 text-center bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4" />
            <p className="text-slate-500 text-xs font-semibold">Synchronizing CRM dashboard...</p>
          </div>
        ) : (
          <div className="flex space-x-4 overflow-x-auto pb-4 items-start select-none min-h-[60vh]">
            {DEAL_STAGES.map(stage => {
              // Group deals by stage
              const stageDeals = filteredDeals.filter(d => {
                const status = d.salesStatus || 'Lead';
                return status === stage.id;
              });

              const totalAmount = stageDeals.reduce((sum, d) => sum + (d.customQuoteAmount || 0), 0);

              return (
                <div 
                  key={stage.id} 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                  className={`w-72 flex-shrink-0 border-t-4 rounded-xl shadow-sm flex flex-col max-h-[75vh] border border-slate-150/80 bg-slate-50/50 ${stage.color}`}
                >
                  {/* Column Header */}
                  <div className="p-3 border-b border-slate-150/60 bg-white flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-black text-slate-800 tracking-tight">{stage.title}</h3>
                      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">{stageDeals.length} deals</span>
                    </div>
                    {totalAmount > 0 && (
                      <span className="text-[11px] font-black text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded-lg border border-indigo-100/40">
                        {formatPrice(totalAmount)}
                      </span>
                    )}
                  </div>

                  {/* Deals Cards List */}
                  <div className="p-2 overflow-y-auto space-y-2 flex-1 scrollbar-thin scrollbar-thumb-slate-200">
                    {stageDeals.length === 0 ? (
                      <div className="py-8 text-center border-2 border-dashed border-slate-200/50 rounded-xl m-1">
                        <span className="text-[10px] font-bold text-slate-400 italic">Drag opportunities here</span>
                      </div>
                    ) : (
                      stageDeals.map(deal => (
                        <div 
                          key={deal.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal.id)}
                          onClick={() => openEditModal(deal)}
                          className="bg-white border border-slate-150 rounded-xl p-3 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer relative group duration-150"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">
                              {deal.client}
                            </h4>
                            <span className="text-[9px] text-slate-400 font-mono flex-shrink-0 mt-0.5">#{deal.id}</span>
                          </div>

                          <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">
                            Client: {deal.clientFirstName} {deal.clientLastName}
                          </p>

                          {/* Deal Value */}
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs font-black text-slate-700">
                              {deal.customQuoteAmount 
                                ? formatPrice(deal.customQuoteAmount) 
                                : <span className="text-[9px] text-slate-400 italic uppercase">Not Quoted</span>
                              }
                            </span>
                            
                            <div className="flex items-center space-x-1.5">
                              {deal.clientUrgency && (
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${getUrgencyColor(deal.clientUrgency)}`}>
                                  {deal.clientUrgency}
                                </span>
                              )}
                              {deal.clientQuality && (
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider uppercase ${getQualityBadge(deal.clientQuality)}`}>
                                  {deal.clientQuality}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Representative & Next follow-up info */}
                          <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between text-[9px] text-slate-400 font-medium">
                            <span className="truncate max-w-[140px]" title={`Rep: ${deal.assignedTo || 'Unassigned'}`}>
                              👤 {deal.assignedTo ? deal.assignedTo.split('@')[0] : 'Unassigned'}
                            </span>
                            {deal.nextFollowUpDate && (
                              <span className="flex items-center text-slate-500">
                                <FaCalendarAlt className="mr-0.5 text-[8px]" />
                                {new Date(deal.nextFollowUpDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Deal Parameters Editing Drawer/Modal */}
        {editingDeal && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-y-auto shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200 p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Deal Parameters: {editingDeal.client}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                    Configure internal sales parameters and follow-up alerts. Private to management.
                  </p>
                </div>
                <button 
                  onClick={() => setEditingDeal(null)} 
                  className="text-slate-400 hover:text-slate-600 text-lg p-1.5 hover:bg-slate-100 rounded-full transition-all"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              <form onSubmit={saveDealDetails} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  
                  {/* Designated Representative */}
                  <div className="relative">
                    <div className="h-8 flex items-end mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 leading-tight">Designated Sales Representative</label>
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="e.g. rep@scalelinkalliance.com" 
                        value={formData.assignedTo} 
                        onChange={e => handleWorkerSearch(e.target.value)}
                        onBlur={handleWorkerBlur}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all" 
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
                              className="px-4 py-2 text-[10px] font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 cursor-pointer"
                            >
                              {w.email}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Urgency */}
                  <div>
                    <div className="h-8 flex items-end mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 leading-tight">Client Urgency</label>
                    </div>
                    <select 
                      name="clientUrgency" 
                      value={formData.clientUrgency} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all bg-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Quality */}
                  <div>
                    <div className="h-8 flex items-end mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 leading-tight">Client Lead Quality</label>
                    </div>
                    <select 
                      name="clientQuality" 
                      value={formData.clientQuality} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all bg-white"
                    >
                      <option value="poor">Poor Lead</option>
                      <option value="average">Average Lead</option>
                      <option value="premium">Premium Lead</option>
                      <option value="hot">Hot Opportunity</option>
                    </select>
                  </div>

                  {/* Potential Upsell */}
                  <div>
                    <div className="h-8 flex items-end mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 leading-tight">Potential Upsell Opportunity</label>
                    </div>
                    <input 
                      type="text" 
                      placeholder="e.g. Monthly maintenance SEO package" 
                      name="potentialUpsell" 
                      value={formData.potentialUpsell} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all" 
                    />
                  </div>

                  {/* Date Logs */}
                  <div>
                    <div className="h-8 flex items-end mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 leading-tight">Last Contact Date</label>
                    </div>
                    <input 
                      type="date" 
                      name="lastContactDate" 
                      value={formData.lastContactDate} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all bg-white" 
                    />
                  </div>

                  <div>
                    <div className="h-8 flex items-end mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 leading-tight">Next Scheduled Follow-up</label>
                    </div>
                    <input 
                      type="date" 
                      name="nextFollowUpDate" 
                      value={formData.nextFollowUpDate} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all bg-white" 
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="h-8 flex items-end mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 leading-tight">Set Follow-up Reminder Alarm</label>
                    </div>
                    <input 
                      type="date" 
                      name="followUpReminder" 
                      value={formData.followUpReminder} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all bg-white" 
                    />
                  </div>

                  {/* Notes */}
                  <div className="sm:col-span-2">
                    <div className="h-8 flex items-end mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 leading-tight">Internal Sales & CRM Notes</label>
                    </div>
                    <textarea 
                      rows={4} 
                      name="notes"
                      value={formData.notes} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all" 
                      placeholder="e.g. client is requesting quote updates, needs SEO. Keep focus on speed..."
                    />
                  </div>

                </div>

                {/* Footer buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setEditingDeal(null)} 
                    className="px-5 py-2 rounded-xl border border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={savingDeal}
                    className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-100 text-xs flex items-center space-x-1.5"
                  >
                    {savingDeal ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FaSave />
                        <span>Save Parameters</span>
                      </>
                    )}
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

export default AdminCRM;
