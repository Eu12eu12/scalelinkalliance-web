import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  FaDownload, FaFileUpload, FaFileAlt, FaCheckCircle, FaCheck, 
  FaPaperPlane, FaInfoCircle, FaClipboardCheck, FaRegComments,
  FaCalendarAlt, FaHourglassHalf, FaProjectDiagram, FaCloudUploadAlt,
  FaComments, FaUserCircle, FaShieldAlt, FaTimesCircle, FaDollarSign,
  FaFileInvoiceDollar, FaBolt, FaFileSignature, FaSpinner, FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const ClientPortalPage = () => {
  const { token } = useParams();
  const [job, setJob] = useState(null);
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [satisfying, setSatisfying] = useState(false);
  const [error, setError] = useState('');
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  const isPaid = job && ['deposit_paid', 'in_progress', 'completed', 'approved'].includes(job.quoteStatus);
  const totalAddonsPrice = isPaid ? 0 : selectedAddons.reduce((sum, item) => sum + (item.price || 0), 0);
  const displayDeposit = job ? (job.depositRequired + totalAddonsPrice) : 0;
  const displayTotal = job ? (job.customQuoteAmount + totalAddonsPrice) : 0;
  const displayDiscount = job ? (job.specialDiscount || 0) : 0;
  const displayBalance = Math.max(0, displayTotal - displayDiscount - displayDeposit);

  const toggleAddon = (addon) => {
    if (isPaid) return;
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.name === addon.name);
      if (exists) {
        return prev.filter(a => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  const isAddonSelected = (addonName) => {
    if (isPaid) {
      return job?.includedServices && job.includedServices.includes(`Upgrade: ${addonName}`);
    }
    return selectedAddons.some(a => a.name === addonName);
  };

  const handleCheckout = async () => {
    try {
      setIsLoadingCheckout(true);
      const res = await fetch(`/api/portal/track/${token}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedAddons })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create payment checkout.');
      }
      const data = await res.json();
      window.location.href = data.stripeCheckoutUrl;
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  const fetchPortalData = async () => {
    try {
      const res = await fetch(`/api/portal/track/${token}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch project tracking information.');
      }
      const data = await res.json();
      
      // Parse JSON fields if they are returned as strings in production (MySQL)
      if (data.job) {
        if (typeof data.job.optionalAddOns === 'string') {
          try {
            data.job.optionalAddOns = JSON.parse(data.job.optionalAddOns);
          } catch (e) {
            console.error('Failed to parse optionalAddOns:', e);
            data.job.optionalAddOns = [];
          }
        }
        if (typeof data.job.projectScope === 'string') {
          try {
            data.job.projectScope = JSON.parse(data.job.projectScope);
          } catch (e) {
            console.error('Failed to parse projectScope:', e);
            data.job.projectScope = null;
          }
        }
        if (typeof data.job.clientAssets === 'string') {
          try {
            data.job.clientAssets = JSON.parse(data.job.clientAssets);
          } catch (e) {
            console.error('Failed to parse clientAssets:', e);
            data.job.clientAssets = null;
          }
        }
      }

      setJob(data.job);
      setComments(data.comments);
      setFiles(data.files);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPortalData();
    }
  }, [token]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentSuccess = queryParams.get('payment_success');
    const sessionId = queryParams.get('session_id');

    if (paymentSuccess === 'true' && sessionId && token) {
      const confirmPayment = async () => {
        setVerifyingPayment(true);
        try {
          const res = await fetch(`/api/portal/track/${token}/confirm-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to verify deposit payment.');
          }
          const data = await res.json();
          toast.success(data.message || 'Deposit payment successfully verified!');
          
          // Clear query params from URL so reloading doesn't re-trigger verification
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Refresh job details
          fetchPortalData();
        } catch (err) {
          toast.error(err.message);
        } finally {
          setVerifyingPayment(false);
        }
      };
      confirmPayment();
    }
  }, [token]);

  useEffect(() => {
    if (job && job.quoteStatus === 'quote_sent' && job.stripeSessionId) {
      const checkPaymentStatus = async () => {
        try {
          const res = await fetch(`/api/portal/track/${token}/payment-status`);
          if (res.ok) {
            const data = await res.json();
            if (data.paid) {
              toast.success('Your deposit payment was successfully verified!');
              fetchPortalData();
            }
          }
        } catch (err) {
          console.error('Error in fallback payment verification:', err);
        }
      };
      // Run fallback check after a short delay to allow webhook / primary redirect to complete first
      const timer = setTimeout(() => {
        checkPaymentStatus();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [job?.quoteStatus, job?.stripeSessionId, token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/portal/track/${token}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newMessage })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to send message.');
      }
      setNewMessage('');
      fetchPortalData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0 || uploading) return;

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file));

    try {
      const res = await fetch(`/api/portal/track/${token}/files`, {
        method: 'POST',
        body: formData
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to upload files.');
      }
      toast.success('Files successfully uploaded to project.');
      fetchPortalData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleMarkSatisfied = async () => {
    if (window.confirm('Are you completely satisfied with this project deliverables? This action will finalize your order.')) {
      setSatisfying(true);
      try {
        const res = await fetch(`/api/portal/track/${token}/satisfied`, {
          method: 'POST'
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to close project.');
        }
        toast.success('Project marked as satisfied! Thank you for choosing us.');
        fetchPortalData();
      } catch (err) {
        toast.error(err.message);
      } finally {
        setSatisfying(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full" />
        <p className="text-slate-500 font-bold text-sm">Loading secure portal environment...</p>
      </div>
    );
  }

  if (verifyingPayment) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full" />
        <p className="text-slate-700 font-bold text-sm">Verifying deposit payment...</p>
        <p className="text-slate-400 text-xs font-semibold">Please do not refresh or close this tab.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6">
        <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl max-w-md text-center shadow-xl shadow-rose-50 space-y-4 animate-fade-in">
          <div className="h-12 w-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl font-bold">!</div>
          <h3 className="text-lg font-extrabold text-slate-800">Secure Link Expired</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {error || 'This passwordless link is invalid, has expired, or was removed by administrative security.'}
          </p>
          <a href="/contact" className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-md">
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  const formatCurrency = (amountInCents, currencyCode = 'USD') => {
    if (amountInCents === null || amountInCents === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(amountInCents / 100);
  };

  const renderScopeDetails = () => {
    if (!job || !job.projectScope || typeof job.projectScope !== 'object') return null;
    
    const scope = job.projectScope;
    let answers = scope.customQuoteAnswers ? { ...scope.customQuoteAnswers } : { ...scope };

    // Remove known internal boolean flags injected by the admin builder
    const internalKeys = ['needCopywriting', 'needImages', 'needContactForms', 'needBooking', 'needPayment', 'needSeo', 'needMobile', 'pagesCount', 'customQuoteAmount', 'depositRequired'];
    internalKeys.forEach(k => delete answers[k]);

    const entries = Object.entries(answers).filter(([key, val]) => {
      if (val === null || val === undefined || val === false || val === '') return false;
      if (Array.isArray(val) && val.length === 0) return false;
      return true;
    });

    if (entries.length === 0) return null;

    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
        <h4 className="text-sm font-bold text-blue-300 tracking-wide uppercase">Your Requested Specifications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          {entries.map(([key, val]) => {
            const label = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            
            const LABEL_MAP = {
              'customer_support': 'Customer Support / Inbox',
              'calendar_email': 'Calendar & Email Management',
              'billing_bookkeep': 'Billing & Basic Bookkeeping',
              'data_entry': 'Data Entry & Processing',
              'sop_writing': 'SOP & Process Documentation',
              'social_graphics': 'Social Media Graphics',
              'video_reels': 'Short Video / Reels Editing',
              'copy_blog': 'Copywriting / Blog Content',
              'branding_guide': 'Logos & Complete Branding',
              'raw_sources': 'Vector/Raw Source Files',
              'seo_search': 'SEO & Search Engine Visibility',
              'meta_ads': 'Meta Ads (Facebook/Instagram)',
              'google_ads': 'Google Search & Display Ads',
              'email_news': 'Email Newsletters / Campaigns',
              'cold_outbound': 'Cold Lead Outbound Campaigns',
              'other': 'Others: Specify'
            };

            const formatValue = (v) => {
              if (LABEL_MAP[v]) return LABEL_MAP[v];
              if (typeof v !== 'string') return String(v);
              if (v.includes('_') && !v.includes(' ')) {
                return v.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
              }
              if (/^[a-z]+[A-Z][a-zA-Z]*$/.test(v)) {
                const spaced = v.replace(/([A-Z])/g, ' $1');
                return spaced.charAt(0).toUpperCase() + spaced.slice(1);
              }
              return v;
            };

            let valueStr = '';
            if (Array.isArray(val)) {
              valueStr = val.map(formatValue).join(', ');
            } else if (typeof val === 'object' && val !== null) {
              valueStr = JSON.stringify(val);
            } else {
              valueStr = formatValue(val);
            }

            if (!valueStr || valueStr === '{}' || valueStr === '[]') return null;

            return (
              <div key={key} className="space-y-1 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{label}</span>
                <p className="font-semibold text-white">{valueStr}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAssetsDetails = () => {
    if (!job || !job.clientAssets || typeof job.clientAssets !== 'object') return null;
    
    const assetsList = Object.entries(job.clientAssets)
      .filter(([_, value]) => value === true || value === 'true')
      .map(([key]) => {
        return key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());
      });

    if (assetsList.length === 0) return null;

    return (
      <div className="space-y-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Available Brand Assets</span>
        <div className="flex flex-wrap gap-2 pt-1">
          {assetsList.map((asset, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 bg-white/5 border border-white/10 text-white text-[11px] font-bold rounded-full">
              <FaCheckCircle className="text-emerald-500 text-[10px] mr-1.5 flex-shrink-0" />
              {asset}
            </span>
          ))}
        </div>
      </div>
    );
  };

  if (job && job.quoteStatus === 'quote_sent') {
    const includedList = job.includedServices ? job.includedServices.split('\n').filter(s => s.trim()) : [];
    const excludedList = job.notIncluded ? job.notIncluded.split('\n').filter(s => s.trim()) : [];
    const optionalAddons = Array.isArray(job.optionalAddOns) ? job.optionalAddOns : [];

    return (
      <div className="min-h-screen bg-[#04060a] text-white py-12 px-4 md:px-8 relative overflow-hidden font-sans">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-8 relative z-10 animate-fade-in">
          {/* Header Banner */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <FaShieldAlt className="text-[11px] flex-shrink-0" />
                  Official Proposal Portal
                </span>
                <span className="text-[10px] font-black bg-white/10 text-slate-300 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  PROPOSAL #{job.id}
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white mt-1">
                {job.title}
              </h1>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed max-w-2xl">
                Review your customized service plan, detailed inclusions, timeline, and dynamic add-on options prepared by the ScaleLink Alliance team.
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <span className="px-4 py-2.5 rounded-2xl text-xs font-extrabold border uppercase tracking-wider bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-md">
                Proposal Under Review
              </span>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${job.specialDiscount > 0 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6`}>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center flex-shrink-0 text-xl border border-blue-500/30">
                <FaProjectDiagram />
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Recommended Solution</span>
                <span className="text-sm font-extrabold text-white block mt-0.5">{job.recommendedPackage || 'Custom Package'}</span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center flex-shrink-0 text-xl border border-indigo-500/30">
                <FaCalendarAlt />
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Est. Completion</span>
                <span className="text-sm font-extrabold text-white block mt-0.5">{job.estimatedCompletionTime || 'To Be Confirmed'}</span>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0 text-xl border border-emerald-500/30">
                <FaDollarSign />
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Total Solution Fee</span>
                <span className="text-sm font-extrabold text-white block mt-0.5">{formatCurrency(displayTotal)}</span>
              </div>
            </div>

            {job.specialDiscount > 0 && (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center flex-shrink-0 text-xl border border-rose-500/30">
                  <FaDollarSign />
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Special Discount</span>
                  <span className="text-sm font-extrabold text-rose-400 block mt-0.5">-{formatCurrency(job.specialDiscount)}</span>
                </div>
              </div>
            )}

            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 text-xl border border-purple-500/30">
                <FaFileInvoiceDollar />
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Required Deposit</span>
                <span className="text-sm font-extrabold text-white block mt-0.5">{formatCurrency(displayDeposit)}</span>
              </div>
            </div>
          </div>

          {/* Inclusions and Exclusions Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inclusions */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-white/10 pb-3 flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400 text-lg flex-shrink-0" />
                <h3 className="text-md font-bold text-white uppercase tracking-wider">Features & Included Services</h3>
              </div>
              
              {includedList.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No specific inclusions outlined. Refer to description.</p>
              ) : (
                <ul className="space-y-4">
                  {includedList.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs text-slate-300 font-medium">
                      <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Exclusions */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-white/10 pb-3 flex items-center gap-2">
                <FaTimesCircle className="text-rose-400 text-lg flex-shrink-0" />
                <h3 className="text-md font-bold text-white uppercase tracking-wider">Project Exclusions</h3>
              </div>

              {excludedList.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No exclusions explicitly defined.</p>
              ) : (
                <ul className="space-y-4">
                  {excludedList.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs text-slate-300 font-medium">
                      <FaTimesCircle className="text-rose-500 text-sm mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Optional Add-Ons Section */}
          {optionalAddons.length > 0 && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-white/10 pb-3 flex items-center gap-2">
                <FaBolt className="text-yellow-400 text-lg animate-pulse flex-shrink-0" />
                <h3 className="text-md font-bold text-white uppercase tracking-wider">Available Solution Upgrades</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optionalAddons.map((addon, idx) => {
                  const selected = isAddonSelected(addon.name);
                  return (
                    <div 
                      key={idx} 
                      onClick={() => !isPaid && toggleAddon(addon)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all select-none ${
                        isPaid ? 'cursor-default' : 'cursor-pointer'
                      } ${
                        selected 
                          ? 'bg-blue-600/10 border-blue-500 shadow-md shadow-blue-500/5' 
                          : 'bg-white/5 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {!isPaid && (
                          <input 
                            type="checkbox"
                            checked={selected}
                            onChange={() => {}} // handled by onClick on wrapper
                            className="w-4 h-4 rounded text-blue-600 focus:ring-0 focus:ring-offset-0 bg-white/10 border-white/20 cursor-pointer"
                          />
                        )}
                        {isPaid && selected && (
                          <FaCheck className="text-emerald-400 text-sm flex-shrink-0" />
                        )}
                        <span className={`text-xs font-bold ${selected ? 'text-white font-extrabold' : 'text-slate-200'}`}>
                          {addon.name}
                        </span>
                      </div>
                      <span className={`text-xs font-black ${selected ? 'text-blue-300' : 'text-slate-400'}`}>
                        {formatCurrency(addon.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Monthly Retainer Support Option Section */}
          {job.monthlySupportOption && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
              <div className="border-b border-white/10 pb-3 flex items-center gap-2">
                <FaInfoCircle className="text-purple-400 text-lg flex-shrink-0" />
                <h3 className="text-md font-bold text-white uppercase tracking-wider">Monthly Retainer Support Option</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold bg-purple-950/20 p-4 rounded-xl border border-purple-500/20">
                {job.monthlySupportOption}
              </p>
            </div>
          )}

          {/* Scope Review Section */}
          {renderScopeDetails()}

          {/* Client Details Section */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3 flex items-center gap-2">
              <FaInfoCircle className="text-blue-400 flex-shrink-0" /> Additional Requirements & Notes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
              {job.clientWebsite && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Website</span>
                  <a href={job.clientWebsite.startsWith('http') ? job.clientWebsite : `https://${job.clientWebsite}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-semibold block truncate">
                    {job.clientWebsite}
                  </a>
                </div>
              )}
              {job.clientLocation && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Business Location</span>
                  <span className="text-white font-semibold block">{job.clientLocation}</span>
                </div>
              )}
              {job.clientIndustry && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Industry / Business Type</span>
                  <span className="text-white font-semibold block">{job.clientIndustry}</span>
                </div>
              )}
              {job.levelOfSupport && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Requested Support Level</span>
                  <span className="text-white font-semibold block">{job.levelOfSupport}</span>
                </div>
              )}
              {job.monthlySupportOption && (
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Monthly Support Option</span>
                  <span className="text-white font-semibold block truncate" title={job.monthlySupportOption}>{job.monthlySupportOption}</span>
                </div>
              )}
            </div>

            {/* Assets details */}
            {renderAssetsDetails()}

            {/* Current Problem & Project Goal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              {job.projectGoal && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Primary Project Goal</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">{job.projectGoal}</p>
                </div>
              )}
              {job.currentProblem && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Challenges to Address</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">{job.currentProblem}</p>
                </div>
              )}
            </div>
            
            {/* Description / Initial Specs */}
            {job.description && (
              <div className="space-y-2 pt-4 border-t border-white/5">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Original Project Specifications</span>
                <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 whitespace-pre-wrap">{job.description}</p>
              </div>
            )}
          </div>

          {/* Action Call to Action Block */}
          <div className="bg-linear-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-md border border-blue-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-lg font-black text-white">Accept Proposal & Initiate Project</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                By paying the security deposit, you approve this customized service proposal. ScaleLink Alliance will lock in your timeline and allocate the necessary engineering and design resources immediately.
              </p>
              <div className="flex flex-wrap gap-6 pt-2 text-xs">
                <div>
                  <span className="text-slate-500 block font-bold">Total Quote:</span>
                  <span className="text-sm font-black text-white">{formatCurrency(displayTotal)}</span>
                </div>
                {job.specialDiscount > 0 && (
                  <div>
                    <span className="text-slate-500 block font-bold">Special Discount:</span>
                    <span className="text-sm font-black text-rose-400">-{formatCurrency(displayDiscount)}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block font-bold">Deposit Due Now:</span>
                  <span className="text-sm font-black text-emerald-400">{formatCurrency(displayDeposit)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block font-bold">Remaining Balance:</span>
                  <span className="text-sm font-black text-white">
                    {formatCurrency(displayBalance)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              {job.quoteStatus === 'quote_sent' ? (
                <button
                  disabled={isLoadingCheckout}
                  onClick={handleCheckout}
                  className="w-full md:w-auto inline-flex items-center justify-center space-x-2 py-4 px-8 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingCheckout ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <FaFileSignature className="text-sm flex-shrink-0" />
                  )}
                  <span>{isLoadingCheckout ? 'Creating Secure Payment...' : 'Approve & Pay Deposit'}</span>
                </button>
              ) : job.quoteStatus === 'under_review' ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <span className="text-[10px] text-slate-400 font-semibold">Quote under review. Payment link will be active once proposal is sent.</span>
                </div>
              ) : (
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 text-center">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Deposit Verified ✓</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter files by role
  const finalDeliverables = files.filter(f => f.uploadedByRole !== 'client');
  const clientUploaded = files
    .filter(f => f.uploadedByRole === 'client')
    .sort((a, b) => {
      const aIsInitial = Math.abs(new Date(a.createdAt) - new Date(job.receivedAt)) < 30000;
      const bIsInitial = Math.abs(new Date(b.createdAt) - new Date(job.receivedAt)) < 30000;
      if (aIsInitial && !bIsInitial) return -1;
      if (!aIsInitial && bIsInitial) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="min-h-screen bg-[#fafbfc] py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Title Header Banner */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <FaShieldAlt className="text-[10px]" />
                Secure Portal
              </span>
              <span className="text-[9px] font-black bg-slate-100 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                Key: {token ? token.split('-')[0].toUpperCase() : 'ACTIVE'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {job.category}
            </h1>
            <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-2xl">
              Welcome to your dedicated client workspace. Review production progress, access completed files, and converse directly with your designated representative.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold border uppercase tracking-wider shadow-sm ${
              job.clientSatisfied 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-100'
            }`}>
              {job.milestoneStatus}
            </span>
          </div>
        </div>

        {/* Progress Milestone Stepper */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-50 pb-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <FaHourglassHalf className="text-slate-400" /> Production Progress
            </h3>
          </div>
          
          {/* Desktop timeline */}
          <div className="hidden md:flex justify-between items-start relative z-10 pt-2 pb-4">
            {/* Progress Connector Track */}
            <div className="absolute top-[20px] left-[12.5%] right-[12.5%] h-[4px] bg-slate-100 -z-10 rounded-full">
              <div 
                className="h-full bg-indigo-600 transition-all duration-700 ease-out rounded-full shadow-inner shadow-indigo-400" 
                style={{ width: `${((job.stepIndex - 1) / 3) * 100}%` }}
              />
            </div>
            
            {[
              { step: 1, label: 'Order Received', desc: 'Requirements processed' },
              { step: 2, label: 'In Production', desc: 'Team is active on deliverables' },
              { step: 3, label: 'Quality Review', desc: 'System checks & approvals' },
              { step: 4, label: 'Delivered & Complete', desc: 'Final deliverables package' }
            ].map(s => {
              const isActive = job.stepIndex >= s.step;
              const isCurrent = job.stepIndex === s.step;
              return (
                <div key={s.step} className="flex flex-col items-center text-center w-1/4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 scale-105' 
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}>
                    {isActive && s.step < job.stepIndex ? <FaCheckCircle size={15} /> : s.step}
                  </div>
                  <h4 className={`text-xs font-black mt-3 transition-colors ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                    {s.label}
                  </h4>
                  <p className="text-slate-400 text-[10px] mt-1 font-semibold max-w-[130px] leading-normal">{s.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Mobile timeline */}
          <div className="flex flex-col md:hidden gap-6">
            {[
              { step: 1, label: 'Order Received', desc: 'Requirements processed' },
              { step: 2, label: 'In Production', desc: 'Team is active on deliverables' },
              { step: 3, label: 'Quality Review', desc: 'System checks & approvals' },
              { step: 4, label: 'Delivered & Complete', desc: 'Final deliverables package' }
            ].map(s => {
              const isActive = job.stepIndex >= s.step;
              return (
                <div key={s.step} className="flex items-center gap-4">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-extrabold border-2 flex-shrink-0 ${
                    isActive 
                      ? 'bg-indigo-600 text-white border-indigo-600' 
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}>
                    {isActive && s.step < job.stepIndex ? <FaCheckCircle size={14} /> : s.step}
                  </div>
                  <div>
                    <h4 className={`text-xs font-black ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                      {s.label}
                    </h4>
                    <p className="text-slate-400 text-[10px] mt-0.5 font-semibold">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unified 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Column (Left Side - 8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Section 1: Deliverables & Files Package */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
              <div className="border-b border-slate-50 pb-3">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <FaFileAlt className="text-indigo-600" /> Deliverables & Documents Package
                </h3>
                <p className="text-slate-400 text-[11px] font-semibold mt-1">
                  Access official files uploaded by your representative or share supplementary resources with the team.
                </p>
              </div>

              {/* Final Deliverables (From representative) */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Official Deliverables
                </h4>
                
                {finalDeliverables.length === 0 ? (
                  <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-8 text-center">
                    <FaFileAlt className="text-slate-300 text-3xl mx-auto mb-3" />
                    <p className="text-xs font-semibold text-slate-500">No official deliverables packages uploaded yet.</p>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-sm mx-auto">
                      Files will populate here once the production team finalizes and audits the files. You will receive an email notice when ready.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {finalDeliverables.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:bg-indigo-50/5 transition-all group">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
                            <FaFileAlt size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">{file.fileName}</p>
                            <p className="text-[9px] text-indigo-600 font-extrabold uppercase mt-0.5">
                              Deliverable File
                            </p>
                          </div>
                        </div>
                        <a 
                          href={file.filePath} 
                          download 
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100/40 rounded-xl transition-all shadow-sm bg-white border border-slate-100"
                          title="Download Deliverable"
                        >
                          <FaDownload size={11} />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Client Uploaded Assets */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Your Uploaded Resources
                </h4>

                {clientUploaded.length === 0 ? (
                  <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                    <p className="text-xs font-semibold text-slate-400">You haven't uploaded any resources or guidelines yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {clientUploaded.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-orange-100 hover:bg-orange-50/5 transition-all group">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-sm flex-shrink-0">
                            <FaFileAlt size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-700 truncate">{file.fileName}</p>
                            <p className="text-[9px] text-orange-600 font-extrabold uppercase mt-0.5">
                              {Math.abs(new Date(file.createdAt) - new Date(job.receivedAt)) < 30000 ? 'Initial Submission' : 'Uploaded by You'}
                            </p>
                          </div>
                        </div>
                        <a 
                          href={file.filePath} 
                          download 
                          className="p-2.5 text-slate-400 hover:text-orange-600 hover:bg-orange-100/40 rounded-xl transition-all shadow-sm bg-white border border-slate-100"
                          title="Download Uploaded Asset"
                        >
                          <FaDownload size={11} />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dotted Upload Dropzone */}
              <div className="pt-2 border-t border-slate-100">
                <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${
                  job.clientSatisfied 
                    ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60' 
                    : 'bg-slate-50/30 hover:bg-indigo-50/10 border-slate-200 hover:border-indigo-400 cursor-pointer'
                }`}>
                  <FaCloudUploadAlt className={`text-2xl mb-2 ${uploading ? 'animate-bounce text-indigo-500' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-700">
                    {uploading ? 'Processing asset files...' : 'Upload Asset / Guidelines'}
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-1">
                    Drag files here or click to browse. Max 10MB per file.
                  </span>
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileUpload} 
                    disabled={uploading || job.clientSatisfied} 
                  />
                </label>
              </div>

            </div>

            {/* Section 2: Project Metadata Overview */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-50 pb-3">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <FaInfoCircle className="text-indigo-600" /> Project Summary
                </h3>
              </div>

              {/* Service details grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
                    <FaProjectDiagram size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Category</span>
                    <span className="text-xs font-extrabold text-slate-700 block mt-0.5 truncate max-w-[150px]">{job.category}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm flex-shrink-0">
                    <FaCalendarAlt size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Received Date</span>
                    <span className="text-xs font-extrabold text-slate-700 block mt-0.5">{new Date(job.receivedAt).toLocaleDateString([], { dateStyle: 'medium' })}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-rose-600 shadow-sm flex-shrink-0">
                    <FaHourglassHalf size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Estimated Delivery</span>
                    <span className="text-xs font-extrabold text-slate-700 block mt-0.5">{new Date(job.dueAt).toLocaleDateString([], { dateStyle: 'medium' })}</span>
                  </div>
                </div>
              </div>

              {/* Description Block */}
              <div className="space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Original Project Specifications</span>
                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 mt-1">
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                    {job.description || "No description specifications provided."}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Action & Communication Sidebar (Right Side - 4 Columns) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Sidebar Section 1: Main Call to Action (CTA) */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3 flex items-center gap-1.5">
                <FaClipboardCheck className="text-indigo-600" /> Portal Action Center
              </h3>

              {job.clientSatisfied ? (
                <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 text-center space-y-4 shadow-sm shadow-emerald-50">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <FaCheckCircle size={20} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider">Project Approved</h4>
                    <p className="text-[10px] text-emerald-600 leading-relaxed font-semibold">
                      You have verified all deliverables and finalized the project. Active support logs are now read-only.
                    </p>
                  </div>
                </div>
              ) : job.stepIndex === 4 ? (
                <div className="space-y-4">
                  <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 text-center space-y-2.5">
                    <div className="animate-ping h-2.5 w-2.5 rounded-full bg-amber-500 mx-auto" />
                    <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider">Deliverables Pending Review</h4>
                    <p className="text-[10px] text-amber-600 leading-relaxed font-semibold">
                      Your representatives have delivered the finalized deliverables. Please check the files and confirm satisfaction below.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleMarkSatisfied}
                    disabled={satisfying}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md shadow-emerald-100 active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <FaCheckCircle size={13} />
                    <span>{satisfying ? 'Finalizing Order...' : 'Approve & Finalize Project'}</span>
                  </button>
                </div>
              ) : (
                <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 text-center space-y-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mx-auto animate-pulse" />
                  <h4 className="text-xs font-black text-indigo-800 uppercase tracking-wider">Active Production</h4>
                  <p className="text-[10px] text-indigo-500 leading-relaxed font-semibold">
                    Our team is currently drafting and compiling your deliverables. The finalize option will activate once files are ready.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar Section 2: Fixed Height Support Rep Chat Widget */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col h-[520px]">
              
              {/* Chat widget header */}
              <div className="border-b border-slate-50 pb-3 flex items-center justify-between flex-shrink-0">
                <div>
                  <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <FaRegComments className="text-indigo-600" /> Direct Support
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Chat with Agency Rep</p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Online</span>
                </div>
              </div>
              
              {/* Message scroll container */}
              <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                {comments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-4">
                    <FaComments className="text-3xl text-slate-200 mb-2" />
                    <p className="text-xs font-semibold text-slate-400 italic">No message logs active.</p>
                    <p className="text-[9px] text-slate-400 mt-1 max-w-[180px]">
                      Send a message below to coordinate directly with your Support Representative.
                    </p>
                  </div>
                ) : (
                  comments.map(c => {
                    const isClient = c.fromUserRole === 'client';
                    return (
                      <div key={c.id} className={`flex items-start space-x-2 text-xs animate-fade-in ${
                        isClient ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[10px] font-extrabold uppercase ${
                          isClient ? 'bg-orange-500 shadow-sm shadow-orange-100' : 'bg-indigo-600 shadow-sm shadow-indigo-100'
                        }`}>
                          {c.userName.charAt(0)}
                        </div>
                        <div className="max-w-[78%]">
                          <div className={`flex items-center space-x-1.5 mb-0.5 ${isClient ? 'justify-end' : ''}`}>
                            <span className="font-extrabold text-slate-700 text-[10px]">{isClient ? 'You' : 'Support Rep'}</span>
                            <span className="text-[8px] text-slate-400 font-medium">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className={`p-3 rounded-2xl border text-[11px] text-slate-700 leading-relaxed ${
                            isClient 
                              ? 'bg-orange-50/40 border-orange-100 rounded-tr-none shadow-sm' 
                              : 'bg-slate-50 border-slate-100 rounded-tl-none shadow-sm'
                          }`}>
                            {c.comment}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input form area */}
              <form onSubmit={handleSendMessage} className="relative pt-3 border-t border-slate-50 flex-shrink-0">
                <textarea
                  disabled={job.clientSatisfied}
                  rows={2}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder={job.clientSatisfied ? "This workspace chat is now closed." : "Write a reply or request guidelines..."}
                  className="w-full px-3.5 py-3 pr-11 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-xs transition-all resize-none shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isSending || !newMessage.trim() || job.clientSatisfied}
                  className="absolute right-2.5 bottom-5.5 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-100 transition-all disabled:opacity-50"
                >
                  <FaPaperPlane size={9} />
                </button>
              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ClientPortalPage;
