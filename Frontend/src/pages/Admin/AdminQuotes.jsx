// src/pages/Admin/AdminQuotes.jsx
import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { useToast } from './Toast';
import { 
  FaPlus, FaTrash, FaEdit, FaCheck, FaClock, FaExclamationTriangle, 
  FaFilter, FaSearch, FaPaperPlane, FaBriefcase, FaEye, FaUser, 
  FaEnvelope, FaPhone, FaGlobeAmericas, FaLayerGroup, FaMoneyBillWave,
  FaTimes, FaCheckDouble, FaHistory, FaFileInvoiceDollar, FaCalendar, 
  FaPlusCircle, FaMinusCircle, FaLink, FaExternalLinkAlt, FaTrashAlt,
  FaArrowLeft, FaCheckCircle, FaTimesCircle, FaSave, FaExternalLinkSquareAlt,
  FaGlobe, FaMapMarkerAlt, FaFileAlt, FaLock
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
      pagesCount: '',
      needCopywriting: false,
      needImages: false,
      needContactForms: false,
      needBooking: false,
      needPayment: false,
      needSeo: false,
      needMobile: false,
      siteRedesign: 'new_build', // new_build or redesign
      
      marketingPostsCount: '',
      marketingPlatforms: '',
      marketingCampaignLength: '',
      marketingTopics: '',
      marketingAdSupport: false,
      marketingMonthlyManagement: false,

      appFeatures: '',
      appUserRoles: '',
      appDatabaseNeeds: '',
      appLoginSystem: false,
      appDashboardNeeds: '',
      appIntegrations: '',
      appReports: false,
      appAdminPanel: false,
      appSecurityNeeds: '',
      
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
    
    // Quote status
    quoteStatus: 'new_request',
    assignedTo: '',
    notes: '', // General internal notes
    description: '', // Project summary/solution recommendation
    stripeCheckoutUrl: '',
  });

  const [workerSuggestions, setWorkerSuggestions] = useState([]);
  const [isSearchingWorker, setIsSearchingWorker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validatedEmail, setValidatedEmail] = useState('');
  const validatedEmailRef = useRef('');

  // Structured list states
  const [includedServicesList, setIncludedServicesList] = useState([]);
  const [exclusionsList, setExclusionsList] = useState([]);
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePackage, setNewServicePackage] = useState('');

  // Auto-save & Change states
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [previewTab, setPreviewTab] = useState('email'); // 'email' or 'portal'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { showToast, ToastContainer } = useToast();
  const token = localStorage.getItem('cms_token');

  // Refs for auto-save loop to prevent stale closures
  const latestFormStateRef = useRef({ formData, includedServicesList, exclusionsList });
  const editingQuoteRef = useRef(editingQuote);

  useEffect(() => {
    latestFormStateRef.current = { formData, includedServicesList, exclusionsList };
  }, [formData, includedServicesList, exclusionsList]);

  useEffect(() => {
    editingQuoteRef.current = editingQuote;
  }, [editingQuote]);

  // Format currency
  const formatPrice = (amountInCents, currencyCode = 'usd', allowZero = false) => {
    const currency = CURRENCIES.find(c => c.code === (currencyCode || 'usd').toLowerCase()) || CURRENCIES[0];
    if (amountInCents === null || amountInCents === undefined || amountInCents === '') return 'Custom Quote';
    if (amountInCents === 0 && !allowZero) return 'Custom Quote';
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
    setIsDirty(true);
    setFormData(prev => {
      const copy = { ...prev, [name]: value };
      
      const totalAmt = Number(copy.customQuoteAmount) || 0;

      // Adjust depositRequired based on change in specialDiscount
      if (name === 'specialDiscount') {
        const oldDiscount = Number(prev.specialDiscount) || 0;
        const newDiscount = Number(value) || 0;
        const diff = newDiscount - oldDiscount;
        const currentDep = Number(copy.depositRequired) || 0;
        if (currentDep - diff >= 0) {
          copy.depositRequired = String(currentDep - diff);
        } else {
          copy.depositRequired = '0';
        }
      }

      // Safeguard: Deposit Required cannot exceed Total Quote Amount
      if (name === 'depositRequired') {
        const depAmt = Number(value) || 0;
        if (depAmt > totalAmt) {
          copy.depositRequired = String(totalAmt);
        }
      }
      
      // Auto-cap depositRequired if it exceeds totalAmt if totalAmt changes
      if (name === 'customQuoteAmount') {
        const depAmt = Number(copy.depositRequired) || 0;
        if (depAmt > totalAmt) {
          copy.depositRequired = String(totalAmt);
        }
      }

      return copy;
    });
  };

  // Set proposal title when services change or if it's empty
  useEffect(() => {
    if (isModalOpen && !formData.title) {
      const selected = Object.keys(formData.services);
      if (selected.length > 0) {
        const titleVal = selected[0].replace(/Request Custom Quote - /g, '') + ' Proposal';
        setFormData(prev => ({ ...prev, title: titleVal }));
      }
    }
  }, [formData.services, isModalOpen]);

  // Add-on helpers
  const addAddOn = () => {
    setIsDirty(true);
    setFormData(prev => ({
      ...prev,
      optionalAddOns: [...prev.optionalAddOns, { name: '', price: '' }]
    }));
  };

  const removeAddOn = (index) => {
    setIsDirty(true);
    setFormData(prev => {
      const copy = [...prev.optionalAddOns];
      copy.splice(index, 1);
      return { ...prev, optionalAddOns: copy };
    });
  };

  const updateAddOn = (index, field, value) => {
    setIsDirty(true);
    setFormData(prev => {
      const copy = [...prev.optionalAddOns];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, optionalAddOns: copy };
    });
  };

  // Autocomplete worker email
  const handleWorkerSearch = async (query) => {
    setIsDirty(true);
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
    setIsDirty(true);
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

  // Auto-open builder if editJobId query parameter is present
  useEffect(() => {
    if (!loading && quotes.length > 0) {
      const queryParams = new URLSearchParams(window.location.search);
      const editJobId = queryParams.get('editJobId');
      if (editJobId) {
        const quoteToEdit = quotes.find(q => q.id === parseInt(editJobId));
        if (quoteToEdit) {
          handleOpenModal(quoteToEdit);
        }
      }
    }
  }, [loading, quotes]);

  // Sync viewingQuote with updated list for real-time updates in modal
  useEffect(() => {
    if (viewingQuote && quotes.length > 0) {
      const updated = quotes.find(q => q.id === viewingQuote.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(viewingQuote)) {
        setViewingQuote(updated);
      }
    }
  }, [quotes, viewingQuote]);

  // Form Auto-save Loop (runs every 30 seconds if dirty)
  useEffect(() => {
    if (!isModalOpen) return;

    const interval = setInterval(async () => {
      if (isDirty) {
        await autoSaveQuote();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isModalOpen, isDirty]);

  const autoSaveQuote = async () => {
    setSaveStatus('saving');
    const { formData: currentForm, includedServicesList: inclusions, exclusionsList: exclusions } = latestFormStateRef.current;
    
    const method = editingQuoteRef.current ? 'PATCH' : 'POST';
    const url = editingQuoteRef.current 
      ? `/api/cms/admin/notice-board/${editingQuoteRef.current.id}` 
      : '/api/cms/admin/notice-board';

    try {
      const rawAddOns = currentForm.optionalAddOns.map(a => ({ name: a.name, price: Number(a.price) * 100 }));
      
      const payload = {
        ...currentForm,
        isAutoSave: true,
        // Convert dollar inputs to cents for server
        customQuoteAmount: currentForm.customQuoteAmount ? Math.round(Number(currentForm.customQuoteAmount) * 100) : null,
        depositRequired: currentForm.depositRequired ? Math.round(Number(currentForm.depositRequired) * 100) : null,
        specialDiscount: currentForm.specialDiscount ? Math.round(Number(currentForm.specialDiscount) * 100) : null,
        optionalAddOns: JSON.stringify(rawAddOns),
        projectScope: JSON.stringify(currentForm.projectScope),
        clientAssets: JSON.stringify(currentForm.clientAssets),
        services: JSON.stringify(currentForm.services),
        
        // Auto-serialize structured lists
        includedServices: inclusions.map(i => `- ${i}`).join('\n'),
        notIncluded: exclusions.map(e => `- ${e}`).join('\n'),
        
        // On first save, auto-transition to under_review if new_request
        quoteStatus: currentForm.quoteStatus === 'new_request' ? 'under_review' : currentForm.quoteStatus,
        
        title: currentForm.title || `${currentForm.clientFirstName} ${currentForm.clientLastName} - ${currentForm.client}`,
        category: Object.keys(currentForm.services).join(', ') || 'Custom Solution',
        dueAt: currentForm.quoteExpirationDate || new Date(Date.now() + 14*24*60*60*1000).toISOString(),
        status: 'new'
      };

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedQuote = await res.json();
        setSaveStatus('saved');
        setLastSaveTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        setIsDirty(false);

        // Update routing quoteStatus visually
        setFormData(prev => ({ ...prev, quoteStatus: payload.quoteStatus }));

        if (!editingQuoteRef.current) {
          setEditingQuote(savedQuote);
          editingQuoteRef.current = savedQuote;
        }
        fetchQuotes();
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    }
  };

  const handleOpenModal = (quote = null) => {
    if (quote) {
      setEditingQuote(quote);
      editingQuoteRef.current = quote;
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

      // Parse structured lists
      let inclusions = [];
      if (quote.includedServices) {
        inclusions = quote.includedServices.split('\n').map(s => s.trim().replace(/^-\s*/, '')).filter(Boolean);
      }
      setIncludedServicesList(inclusions);

      let exclusions = [];
      if (quote.notIncluded) {
        exclusions = quote.notIncluded.split('\n').map(s => s.trim().replace(/^-\s*/, '')).filter(Boolean);
      }
      setExclusionsList(exclusions);

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
        currentProblem: quote.currentProblem || quote.description || '',
        
        recommendedPackage: quote.recommendedPackage || '',
        customQuoteAmount: quote.customQuoteAmount ? String(quote.customQuoteAmount / 100) : '',
        depositRequired: (() => {
          const total = quote.customQuoteAmount ? quote.customQuoteAmount / 100 : 0;
          const discount = quote.specialDiscount ? quote.specialDiscount / 100 : 0;
          const net = Math.max(0, total - discount);
          const deposit = quote.depositRequired ? quote.depositRequired / 100 : 0;
          return deposit > net ? String(net) : (quote.depositRequired ? String(quote.depositRequired / 100) : '');
        })(),
        estimatedCompletionTime: quote.estimatedCompletionTime || '',
        includedServices: quote.includedServices || '',
        notIncluded: quote.notIncluded || '',
        optionalAddOns: parsedAddOns,
        monthlySupportOption: quote.monthlySupportOption || '',
        specialDiscount: quote.specialDiscount ? String(quote.specialDiscount / 100) : '',
        quoteExpirationDate: quote.quoteExpirationDate ? String(quote.quoteExpirationDate).slice(0, 10) : '',
        
        quoteStatus: quote.quoteStatus || 'new_request',
        assignedTo: quote.assignedTo || '',
        notes: quote.notes || '',
        description: quote.description || '', 
        stripeCheckoutUrl: quote.stripeCheckoutUrl || ''
      });
      setValidatedEmail(quote.assignedTo || '');
      validatedEmailRef.current = quote.assignedTo || '';
      
      setSaveStatus('saved');
      setLastSaveTime(null);
      setIsDirty(false);
    } else {
      setEditingQuote(null);
      editingQuoteRef.current = null;
      setIncludedServicesList([]);
      setExclusionsList([]);
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
        specialDiscount: '', 
        quoteExpirationDate: (() => {
          const d = new Date();
          d.setDate(d.getDate() + 14);
          return d.toISOString().slice(0, 10);
        })(),
        quoteStatus: 'new_request', assignedTo: '', notes: '', description: '',
        stripeCheckoutUrl: ''
      });
      setValidatedEmail('');
      validatedEmailRef.current = '';
      
      setSaveStatus('saved');
      setLastSaveTime(null);
      setIsDirty(false);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    
    // Core pre-send validations before manual save
    if (!formData.customQuoteAmount || !formData.depositRequired) {
      showToast('Custom Quote Amount and Deposit Required fields are required.', 'error');
      return;
    }

    const totalAmt = Number(formData.customQuoteAmount) || 0;
    const discountAmt = Number(formData.specialDiscount) || 0;
    const depositAmt = Number(formData.depositRequired) || 0;
    const netAmt = Math.max(0, totalAmt - discountAmt);

    if (depositAmt > netAmt) {
      showToast(`Deposit Required ($${depositAmt}) cannot exceed the Net Quote Amount after discount ($${netAmt}).`, 'error');
      return;
    }


    setLoading(true);
    const method = editingQuote ? 'PATCH' : 'POST';
    const url = editingQuote 
      ? `/api/cms/admin/notice-board/${editingQuote.id}` 
      : '/api/cms/admin/notice-board';

    try {
      const rawAddOns = formData.optionalAddOns.map(a => ({ name: a.name, price: Number(a.price) * 100 }));
      
      const payload = {
        ...formData,
        customQuoteAmount: formData.customQuoteAmount ? Math.round(Number(formData.customQuoteAmount) * 100) : null,
        depositRequired: formData.depositRequired ? Math.round(Number(formData.depositRequired) * 100) : null,
        specialDiscount: formData.specialDiscount ? Math.round(Number(formData.specialDiscount) * 100) : null,
        optionalAddOns: JSON.stringify(rawAddOns),
        projectScope: JSON.stringify(formData.projectScope),
        clientAssets: JSON.stringify(formData.clientAssets),
        services: JSON.stringify(formData.services),
        
        includedServices: includedServicesList.map(i => `- ${i}`).join('\n'),
        notIncluded: exclusionsList.map(e => `- ${e}`).join('\n'),
        
        title: formData.title || `${formData.clientFirstName} ${formData.clientLastName} - ${formData.client}`,
        category: Object.keys(formData.services).join(', ') || 'Custom Solution',
        dueAt: formData.quoteExpirationDate || new Date(Date.now() + 14*24*60*60*1000).toISOString(),
        status: 'new'
      };

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const savedQuote = await res.json();
        showToast(`Quote draft ${editingQuote ? 'updated' : 'created'} successfully!`, 'success');
        
        // Update references so subsequent manual saves and auto-saves PATCH the created quote
        setEditingQuote(savedQuote);
        editingQuoteRef.current = savedQuote;
        
        // Update save status indicators
        setSaveStatus('saved');
        setLastSaveTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        
        setIsDirty(false);
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
    // Check if the current form parameters are saved before finalized
    if (isDirty) {
      if (!window.confirm('You have unsaved changes in your quote builder. Sending the quote now will submit the last saved draft. Continue?')) {
        return;
      }
    }

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
        setIsModalOpen(false);
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

  const handleAddRequestedService = (e) => {
    e.preventDefault();
    if (newServiceName.trim()) {
      setIsDirty(true);
      setFormData(prev => ({
        ...prev,
        services: {
          ...prev.services,
          [`Request Custom Quote - ${newServiceName.trim()}`]: newServicePackage.trim() || 'Custom'
        }
      }));
      setNewServiceName('');
      setNewServicePackage('');
    }
  };

  const handleRemoveRequestedService = (svcKey) => {
    setIsDirty(true);
    setFormData(prev => {
      const copy = { ...prev.services };
      delete copy[svcKey];
      return { ...prev, services: copy };
    });
  };

  const handleAddInclusion = (e) => {
    e.preventDefault();
    if (newInclusion.trim()) {
      setIsDirty(true);
      setIncludedServicesList([...includedServicesList, newInclusion.trim()]);
      setNewInclusion('');
    }
  };

  const handleRemoveInclusion = (index) => {
    setIsDirty(true);
    setIncludedServicesList(includedServicesList.filter((_, idx) => idx !== index));
  };

  const handleAddExclusion = (e) => {
    e.preventDefault();
    if (newExclusion.trim()) {
      setIsDirty(true);
      setExclusionsList([...exclusionsList, newExclusion.trim()]);
      setNewExclusion('');
    }
  };

  const handleRemoveExclusion = (index) => {
    setIsDirty(true);
    setExclusionsList(exclusionsList.filter((_, idx) => idx !== index));
  };

  // Filter quotes based on search and tab filters
  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = (q.client || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (q.clientFirstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (q.clientLastName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
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

  // ──────────────────────────────────────────
  // FULL PAGE OVERLAY FOCUS MODE BUILDER
  // ──────────────────────────────────────────
  if (isModalOpen) {
    // Live variables calculated for previewing
    const clientName = `${formData.clientFirstName || ''} ${formData.clientLastName || ''}`.trim() || 'Client';
    const totalVal = Number(formData.customQuoteAmount) || 0;
    const depVal = Number(formData.depositRequired) || 0;
    const discountVal = Number(formData.specialDiscount) || 0;
    const balVal = totalVal - discountVal - depVal;

    const isSendDisabled = 
      !formData.title?.trim() ||
      !formData.recommendedPackage?.trim() ||
      !formData.quoteExpirationDate ||
      !formData.estimatedCompletionTime?.trim() ||
      !formData.customQuoteAmount ||
      !formData.depositRequired ||
      includedServicesList.length === 0 ||
      !formData.description?.trim();

    return (
      <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col h-screen overflow-hidden text-slate-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
        
        {/* Editor Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 flex-shrink-0 shadow-xs">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                if (isDirty) {
                  if (!window.confirm('You have unsaved changes. Are you sure you want to close?')) return;
                }
                setIsModalOpen(false);
              }}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              title="Return to Quotes Table"
            >
              <FaArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-slate-800">
                  {editingQuote ? `Quote Builder (#${editingQuote.id})` : 'New Quote proposal'}
                </h2>
                {getQuoteStatusBadge(formData.quoteStatus)}
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                {formData.clientFirstName ? `${formData.clientFirstName} ${formData.clientLastName} - ${formData.client}` : 'Draft opportunity'}
              </p>
            </div>
          </div>

          {/* Save & Draft statuses */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-[11px] font-bold">
              {saveStatus === 'saving' && (
                <span className="text-slate-400 flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  Auto-saving draft...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-emerald-600 flex items-center gap-1.5">
                  <FaCheckCircle />
                  {lastSaveTime ? `Saved at ${lastSaveTime}` : 'All changes saved'}
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="text-rose-600 flex items-center gap-1.5">
                  <FaExclamationTriangle />
                  Failed to auto-save
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSave()}
                disabled={!isDirty || saveStatus === 'saving'}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Draft
              </button>
              
              {editingQuote && (
                <button
                  onClick={() => handleSendQuote(editingQuote.id)}
                  disabled={sendingQuoteId === editingQuote.id || isSendDisabled || (formData.quoteStatus === 'quote_sent' && !isDirty)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-100 flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sendingQuoteId === editingQuote.id ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FaPaperPlane size={11} />
                      <span>Send Quote Proposal</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </header>

        {/* 3 Panel Workspace */}
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
          
          {/* LEFT PANEL: Client Snapshot (Read-only) */}
          <aside className="w-80 border-r border-slate-200 bg-slate-50/50 overflow-y-auto p-5 space-y-6 flex-shrink-0">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 pb-1 border-b border-slate-200/60">
                Client Snapshot
              </h3>
              
              {!editingQuote ? (
                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-150 shadow-xs text-[10px]">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase tracking-wider">Client Name</label>
                    <div className="flex gap-2">
                      <input type="text" name="clientFirstName" placeholder="First Name" value={formData.clientFirstName} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="text" name="clientLastName" placeholder="Last Name" value={formData.clientLastName} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase tracking-wider">Company / Brand</label>
                    <input type="text" name="client" placeholder="Company Name" value={formData.client} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase tracking-wider">Email Address</label>
                    <input type="email" name="clientEmail" placeholder="email@example.com" value={formData.clientEmail} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase tracking-wider">Phone</label>
                    <div className="flex gap-2">
                      <input type="text" name="clientDialCode" placeholder="+1" value={formData.clientDialCode} onChange={handleInputChange} className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="text" name="clientPhone" placeholder="1234567890" value={formData.clientPhone} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase tracking-wider">Website URL</label>
                    <input type="text" name="clientWebsite" placeholder="example.com" value={formData.clientWebsite} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase tracking-wider">Location</label>
                    <input type="text" name="clientLocation" placeholder="City, Country" value={formData.clientLocation} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <FaUser size={12} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 truncate max-w-[170px]">{clientName}</p>
                        <p className="text-[10px] text-slate-400 font-medium truncate max-w-[170px]">{formData.client}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-50 space-y-1.5 text-[11px] font-medium text-slate-500">
                      <p className="truncate flex items-center gap-1.5">
                        <FaEnvelope className="text-slate-400" />
                        <span>{formData.clientEmail || 'N/A'}</span>
                      </p>
                      <p className="truncate flex items-center gap-1.5">
                        <FaPhone className="text-slate-400" />
                        <span>{formData.clientDialCode} {formData.clientPhone || 'N/A'}</span>
                      </p>
                      {formData.clientWebsite && (
                        <p className="truncate flex items-center gap-1.5">
                          <FaGlobe className="text-slate-400" />
                          <a 
                            href={formData.clientWebsite.startsWith('http') ? formData.clientWebsite : `https://${formData.clientWebsite}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-blue-500 hover:underline"
                          >
                            {formData.clientWebsite}
                          </a>
                        </p>
                      )}
                      {formData.clientLocation && (
                        <p className="truncate flex items-center gap-1.5">
                          <FaMapMarkerAlt className="text-slate-400" />
                          <span>{formData.clientLocation}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Requested Services */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 pb-1 border-b border-slate-200/60">
                Requested Services
              </h3>
              
              {!editingQuote ? (
                <div className="bg-white p-4 rounded-xl border border-slate-150 shadow-xs space-y-3">
                  <form onSubmit={handleAddRequestedService} className="flex gap-2">
                    <input type="text" placeholder="Service (e.g. Website)" value={newServiceName} onChange={e => setNewServiceName(e.target.value)} className="w-1/2 px-2 py-1.5 text-[10px] rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <input type="text" placeholder="Tier/Package" value={newServicePackage} onChange={e => setNewServicePackage(e.target.value)} className="w-1/2 px-2 py-1.5 text-[10px] rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <button type="submit" className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black text-xs">+</button>
                  </form>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(formData.services).map(([svc, pack]) => (
                      <span key={svc} className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-[9px] px-2 py-1 rounded-lg flex items-center gap-1 uppercase tracking-wide">
                        {svc.replace(/Request Custom Quote - /g, '')}
                        <span className="bg-indigo-600/10 text-indigo-800 text-[8px] font-black px-1 rounded uppercase">{pack}</span>
                        <button type="button" onClick={() => handleRemoveRequestedService(svc)} className="ml-1 text-indigo-400 hover:text-rose-500"><FaTrashAlt size={9} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {Object.keys(formData.services).length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No services specified yet.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(formData.services).map(([svc, pack]) => (
                        <span 
                          key={svc} 
                          className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1 uppercase tracking-wide"
                        >
                          {svc.replace(/Request Custom Quote - /g, '')}
                          <span className="bg-indigo-600/10 text-indigo-800 text-[8px] font-black px-1 rounded uppercase">
                            {pack}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Submissions & Project Parameters */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 pb-1 border-b border-slate-200/60">
                Original Request Parameters
              </h3>
              
              {!editingQuote ? (
                <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-150 shadow-xs text-[10px]">
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase tracking-wider">Timeline</label>
                    <input type="text" name="timeline" placeholder="e.g. Within 30 days" value={formData.timeline} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase tracking-wider">Budget</label>
                    <input type="text" name="budget" placeholder="e.g. $3,000 - $5,000" value={formData.budget} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase tracking-wider">Support Level</label>
                    <input type="text" name="levelOfSupport" placeholder="e.g. One-time project" value={formData.levelOfSupport} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-500 mb-1 uppercase tracking-wider">Problem to Solve</label>
                    <textarea name="currentProblem" placeholder="Describe the client's problem..." value={formData.currentProblem} onChange={handleInputChange} className="w-full px-2 py-1.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"></textarea>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-[11px] font-medium text-slate-500 bg-white border border-slate-150 p-4 rounded-xl shadow-xs">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Client Timeline Preference</span>
                    <span className="text-slate-800 font-bold block mt-0.5">{formData.timeline || 'Flexible'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Client Budget Expectation</span>
                    <span className="text-slate-800 font-bold block mt-0.5">{formData.budget || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Support Level Preference</span>
                    <span className="text-slate-800 font-bold block mt-0.5">{formData.levelOfSupport || 'One-time project'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Problem to Solve</span>
                    <p className="text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 text-[10px] leading-relaxed mt-1 font-semibold whitespace-pre-line">
                      {formData.currentProblem || 'No problem statement submitted.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Specifications */}
            {editingQuote && editingQuote.projectScope && (
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 pb-1 border-b border-slate-200/60">
                  Client Questionnaire Answers
                </h3>
                
                <div className="bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-800 text-[10px] font-medium space-y-3 max-h-56 overflow-y-auto">
                  {(() => {
                    const scope = typeof editingQuote.projectScope === 'string' ? JSON.parse(editingQuote.projectScope) : editingQuote.projectScope;
                    const answers = scope.customQuoteAnswers || {};
                    if (Object.keys(answers).length === 0) {
                      return <p className="italic text-slate-500 text-center py-2">No questionnaire answers submitted.</p>;
                    }
                    
                    return Object.entries(answers).map(([key, val]) => {
                      if (!val || (Array.isArray(val) && val.length === 0)) return null;
                      return (
                        <div key={key} className="space-y-0.5 border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                          <span className="text-[8px] text-slate-500 uppercase font-black tracking-wider block">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="text-white block font-semibold leading-relaxed">{Array.isArray(val) ? val.join(', ') : val}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </aside>

          {/* CENTER PANEL: Quote Builder (Interactive) */}
          <main className="flex-1 bg-white overflow-y-auto p-8 space-y-8">
            
            {/* SECTION A: Quote Identity */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black">1</span>
                Proposal Identity & Expiration
              </h3>
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <div className="h-8 flex items-end mb-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">Official Proposal Title *</label>
                  </div>
                  <input 
                    required 
                    type="text" 
                    name="title" 
                    placeholder="e.g. Website Redesign & Stripe Payment Suite" 
                    value={formData.title} 
                    onChange={handleInputChange} 
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all font-bold text-slate-700" 
                  />
                </div>
                <div>
                  <div className="h-8 flex items-end mb-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">Recommended Package Name</label>
                  </div>
                  <input 
                    type="text" 
                    name="recommendedPackage" 
                    placeholder="e.g. Custom React Redesign Suite" 
                    value={formData.recommendedPackage} 
                    onChange={handleInputChange} 
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all font-medium text-slate-600" 
                  />
                </div>
                <div>
                  <div className="h-8 flex items-end mb-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">Quote Expiration Date</label>
                  </div>
                  <input 
                    type="date" 
                    name="quoteExpirationDate" 
                    value={formData.quoteExpirationDate} 
                    onChange={handleInputChange} 
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all bg-white font-medium" 
                  />
                </div>
                <div>
                  <div className="h-8 flex items-end mb-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">Est. Duration / Completed In</label>
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. 10 business days" 
                    name="estimatedCompletionTime" 
                    value={formData.estimatedCompletionTime} 
                    onChange={handleInputChange} 
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all font-medium text-slate-600" 
                  />
                </div>
              </div>
            </div>

            {/* SECTION B: Pricing */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black">2</span>
                Financial & Pricing Builder
              </h3>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <div className="h-8 flex items-end mb-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">Total Quote Amount (USD) *</label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2 text-slate-400 font-bold text-xs">$</span>
                    <input 
                      required 
                      type="number" 
                      placeholder="2500" 
                      name="customQuoteAmount" 
                      value={formData.customQuoteAmount} 
                      onChange={handleInputChange} 
                      className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all font-bold text-slate-700" 
                    />
                  </div>
                </div>

                <div>
                  <div className="h-8 flex items-end mb-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">Deposit Required (USD) *</label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2 text-slate-400 font-bold text-xs">$</span>
                    <input 
                      required 
                      type="number" 
                      placeholder="1250" 
                      name="depositRequired" 
                      value={formData.depositRequired} 
                      onChange={handleInputChange} 
                      className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all font-bold text-indigo-600" 
                    />
                  </div>
                </div>

                <div>
                  <div className="h-8 flex items-end mb-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">Special Discount, if any (USD)</label>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2 text-slate-400 font-bold text-xs">$</span>
                    <input 
                      type="number" 
                      placeholder="e.g. 250" 
                      name="specialDiscount" 
                      value={formData.specialDiscount} 
                      onChange={handleInputChange} 
                      className="w-full pl-8 pr-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all font-semibold text-slate-600" 
                    />
                  </div>
                </div>

                <div>
                  <div className="h-8 flex items-end mb-1.5">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 leading-tight">Monthly Retainer Support Option (Optional)</label>
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. $250/mo for weekly maintenance retainer support post-launch" 
                    name="monthlySupportOption" 
                    value={formData.monthlySupportOption} 
                    onChange={handleInputChange} 
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all text-slate-600 font-semibold" 
                  />
                </div>

                <div className="sm:col-span-2 bg-slate-50 border border-slate-150 p-3.5 rounded-2xl flex items-center justify-between shadow-3xs">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Net Project Solution Fee</span>
                    <span className="text-[9px] text-slate-400 font-semibold block">Total project quote amount after applying special discount.</span>
                  </div>
                  <span className="text-sm font-black text-slate-800">
                    {formatPrice(Math.max(0, (Number(formData.customQuoteAmount) || 0) - (Number(formData.specialDiscount) || 0)) * 100)}
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION C: Deliverables (Interactive Lists) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black">3</span>
                Deliverables & Scope Parameters
              </h3>

              <div className="flex flex-col gap-6">
                
                {/* Included Services Add/Remove List */}
                <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Included Services & Deliverables *</label>
                    <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {includedServicesList.length} items
                    </span>
                  </div>

                  <form onSubmit={handleAddInclusion} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add an included deliverable item..." 
                      value={newInclusion} 
                      onChange={e => setNewInclusion(e.target.value)} 
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-semibold" 
                    />
                    <button 
                      type="submit" 
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs transition-all flex items-center justify-center"
                    >
                      +
                    </button>
                  </form>

                  {includedServicesList.length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic text-center py-6">No deliverables added yet. At least one required.</p>
                  ) : (
                    <ul className="space-y-2 max-h-56 overflow-y-auto">
                      {includedServicesList.map((item, idx) => (
                        <li 
                          key={idx} 
                          className="flex items-center justify-between p-2.5 bg-white border border-slate-150 rounded-xl text-xs hover:border-slate-300 transition-all shadow-3xs"
                        >
                          <span className="font-semibold text-slate-700 flex-1 truncate" title={item}>✓ {item}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveInclusion(idx)} 
                            className="text-rose-500 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <FaTrashAlt size={10} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Exclusions Add/Remove List */}
                <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Exclusions (What is NOT Included)</label>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {exclusionsList.length} items
                    </span>
                  </div>

                  <form onSubmit={handleAddExclusion} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add an exclusion item..." 
                      value={newExclusion} 
                      onChange={e => setNewExclusion(e.target.value)} 
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-semibold" 
                    />
                    <button 
                      type="submit" 
                      className="px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-black text-xs transition-all flex items-center justify-center"
                    >
                      +
                    </button>
                  </form>

                  {exclusionsList.length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic text-center py-6">No exclusions specified. All items considered included.</p>
                  ) : (
                    <ul className="space-y-2 max-h-56 overflow-y-auto">
                      {exclusionsList.map((item, idx) => (
                        <li 
                          key={idx} 
                          className="flex items-center justify-between p-2.5 bg-white border border-slate-150 rounded-xl text-xs hover:border-slate-300 transition-all shadow-3xs"
                        >
                          <span className="font-semibold text-slate-600 flex-1 truncate" title={item}>✕ {item}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveExclusion(idx)} 
                            className="text-rose-500 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <FaTrashAlt size={10} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>

              {/* Optional Upgrades Repeater */}
              <div className="bg-slate-50 p-5 border border-slate-150 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Optional Quote Upgrades (Add-ons)</span>
                  <button 
                    type="button" 
                    onClick={addAddOn}
                    className="text-[10px] font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 uppercase tracking-wide"
                  >
                    <FaPlusCircle /> Add Upgrade Option
                  </button>
                </div>

                {formData.optionalAddOns.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic text-center py-4">No optional upgrades specified for this proposal.</p>
                ) : (
                  <div className="space-y-3">
                    {formData.optionalAddOns.map((add, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <input 
                          type="text" 
                          placeholder="Upgrade Deliverable (e.g. Custom Revision round)"
                          value={add.name}
                          onChange={e => updateAddOn(idx, 'name', e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none font-semibold text-slate-700"
                        />
                        <div className="relative w-28 flex-shrink-0">
                          <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs">$</span>
                          <input 
                            type="number" 
                            placeholder="Price"
                            value={add.price}
                            onChange={e => updateAddOn(idx, 'price', e.target.value)}
                            className="w-full pl-6 pr-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none font-bold text-slate-700"
                          />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeAddOn(idx)}
                          className="text-rose-500 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors flex-shrink-0"
                        >
                          <FaTrashAlt size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* SECTION D: Solution Summary */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black">4</span>
                Solution Overview Summary
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Recommended Solution Summary (Included in Quote Email) *</label>
                  <textarea 
                    required
                    rows={4} 
                    name="description"
                    value={formData.description} 
                    onChange={handleInputChange} 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-xs transition-all text-slate-700 font-semibold leading-relaxed" 
                    placeholder="Provide a professional summary explaining why this custom architecture resolves their operational roadblocks..."
                  />
                </div>
              </div>
            </div>
          </main>

          {/* RIGHT PANEL: Live Previews (Dark Layout) */}
          <aside className="w-[480px] border-l border-slate-200 bg-slate-950 overflow-y-auto flex flex-col flex-shrink-0 relative">
            
            {/* Preview Navigation Tabs */}
            <div className="flex h-12 border-b border-slate-900 bg-slate-950/80 sticky top-0 z-20 backdrop-blur-md">
              <button
                onClick={() => setPreviewTab('email')}
                className={`flex-1 text-[10px] font-black tracking-widest uppercase text-center transition-all ${
                  previewTab === 'email' 
                    ? 'border-b-2 border-indigo-500 text-white bg-slate-900/30' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Email Client Proposal
              </button>
              <button
                onClick={() => setPreviewTab('portal')}
                className={`flex-1 text-[10px] font-black tracking-widest uppercase text-center transition-all ${
                  previewTab === 'portal' 
                    ? 'border-b-2 border-indigo-500 text-white bg-slate-900/30' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Interactive Portal View
              </button>
            </div>

            {/* Live Render Area */}
            <div className="p-6 flex-1 bg-slate-950 text-slate-300 select-none">
              
              {previewTab === 'email' ? (
                /* EMAIL PREVIEW */
                <div className="max-w-[400px] mx-auto bg-white border border-slate-800 text-slate-800 p-6 rounded-2xl space-y-5 text-[11px] leading-relaxed shadow-xl">
                  <div className="text-center pb-2 border-b border-slate-100">
                    <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase tracking-wider">
                      Official Quote Proposal
                    </span>
                    <h1 className="text-sm font-black text-slate-950 mt-2">
                      Quote: {formData.title || 'Proposal Title'}
                    </h1>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Prepared for <strong>{clientName}</strong> at <strong>{formData.client || 'Client Business'}</strong>
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-xl space-y-2.5">
                    <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200/40 pb-1">
                      Financial Summary
                    </h4>
                    <div className="space-y-1.5 font-semibold text-slate-600">
                      <div className="flex justify-between">
                        <span>Total Project Quote:</span>
                        <span className="text-slate-900 font-bold">{formatPrice(totalVal * 100)}</span>
                      </div>
                      {discountVal > 0 && (
                        <div className="flex justify-between text-rose-600">
                          <span>Special Discount:</span>
                          <span className="font-bold">-{formatPrice(discountVal * 100)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
                        <span>Deposit Required:</span>
                        <span className="text-indigo-600 font-bold">{formatPrice(depVal * 100)}</span>
                      </div>
                       <div className="flex justify-between pt-1">
                        <span>Balance Due:</span>
                        <span className="text-slate-900 font-bold">{formatPrice(balVal * 100, 'usd', true)}</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-slate-200/50 flex justify-between text-[9px] text-slate-400">
                      <span><strong>Timeline:</strong> {formData.estimatedCompletionTime || 'Flexible'}</span>
                      <span><strong>Expires:</strong> {formData.quoteExpirationDate ? new Date(formData.quoteExpirationDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>

                  {formData.monthlySupportOption && (
                    <div className="bg-indigo-50 border border-indigo-150 p-3.5 rounded-xl space-y-1 text-indigo-950 font-medium">
                      <span className="font-black text-indigo-700 block uppercase tracking-wider text-[8px]">Monthly Support Option</span>
                      <p className="text-[10px] leading-relaxed font-semibold text-indigo-900">{formData.monthlySupportOption}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                        Solution recommendation
                      </h4>
                      <p className="text-slate-600 leading-normal font-medium whitespace-pre-wrap">
                        {formData.description || 'Solution summary summary details will render here.'}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                        Included Services
                      </h4>
                      {includedServicesList.length === 0 ? (
                        <p className="text-slate-400 italic">No inclusions listed.</p>
                      ) : (
                        <ul className="list-disc pl-4 text-slate-600 space-y-1 font-medium">
                          {includedServicesList.map((inc, i) => (
                            <li key={i}>{inc}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {exclusionsList.length > 0 && (
                      <div>
                        <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                          What is NOT included
                        </h4>
                        <ul className="list-disc pl-4 text-slate-500 space-y-1 font-medium">
                          {exclusionsList.map((exc, i) => (
                            <li key={i}>{exc}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {formData.optionalAddOns.length > 0 && (
                      <div>
                        <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                          Optional Add-ons
                        </h4>
                        <table className="w-full text-slate-600 font-medium border-collapse">
                          <tbody>
                            {formData.optionalAddOns.map((add, i) => (
                              <tr key={i} className="border-b border-slate-100 last:border-0">
                                <td className="py-1">+ {add.name || 'Upgrade Deliverable'}</td>
                                <td className="py-1 text-right text-indigo-600 font-bold">
                                  {add.price ? formatPrice(Number(add.price) * 100) : '$0.00'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-150 p-4 rounded-xl space-y-3 text-center">
                    <p className="text-blue-800 text-[10px] font-medium leading-relaxed">
                      To accept this proposal, approve the quote and pay the deposit via the secure link.
                    </p>
                    <button type="button" className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:shadow active:scale-95 transition-all text-xs">
                      Approve Proposal & Pay Deposit
                    </button>
                  </div>
                </div>
              ) : (
                /* PORTAL PREVIEW */
                <div className="max-w-[420px] mx-auto bg-[#04060a] border border-slate-850 p-6 rounded-2xl space-y-6 text-white text-[10px] leading-relaxed shadow-2xl relative overflow-hidden">
                  <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[60px]" />
                  
                  {/* Banner */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2 relative z-10">
                    <div className="flex gap-1.5">
                      <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Official Proposal Portal
                      </span>
                    </div>
                    <h2 className="text-xs font-black text-white mt-1 leading-snug">
                      {formData.title || 'Proposal Title'}
                    </h2>
                    <p className="text-slate-400 text-[9px]">Prepared for {formData.client}</p>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-3 relative z-10">
                    <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">Recommended Package</span>
                      <span className="font-bold text-white block mt-0.5 truncate">{formData.recommendedPackage || 'Custom Package'}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">Est. Completion</span>
                      <span className="font-bold text-white block mt-0.5 truncate">{formData.estimatedCompletionTime || 'To Be Confirmed'}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">Total Project Fee</span>
                      <span className="font-bold text-emerald-400 block mt-0.5">{formatPrice(totalVal * 100)}</span>
                    </div>
                    {discountVal > 0 && (
                      <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                        <span className="text-[8px] font-black text-rose-400 uppercase tracking-wider block">Special Discount</span>
                        <span className="font-bold text-rose-300 block mt-0.5">-{formatPrice(discountVal * 100)}</span>
                      </div>
                    )}
                    <div className="bg-white/5 border border-white/10 p-3 rounded-lg">
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider block">Deposit Required</span>
                      <span className="font-bold text-white block mt-0.5">{formatPrice(depVal * 100)}</span>
                    </div>
                  </div>

                  {/* Inclusions / Exclusions */}
                  <div className="grid grid-cols-2 gap-3 relative z-10">
                    <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-2">
                      <h3 className="font-black text-white uppercase tracking-wider border-b border-white/5 pb-1">Inclusions</h3>
                      {includedServicesList.length === 0 ? (
                        <p className="text-slate-500 italic">No inclusions listed.</p>
                      ) : (
                        <ul className="space-y-1.5 text-slate-300">
                          {includedServicesList.map((inc, i) => (
                            <li key={i} className="truncate">✓ {inc}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-lg p-3 space-y-2">
                      <h3 className="font-black text-white uppercase tracking-wider border-b border-white/5 pb-1">Exclusions</h3>
                      {exclusionsList.length === 0 ? (
                        <p className="text-slate-500 italic">No exclusions listed.</p>
                      ) : (
                        <ul className="space-y-1.5 text-slate-400">
                          {exclusionsList.map((exc, i) => (
                            <li key={i} className="truncate">✕ {exc}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Upgrades */}
                  {formData.optionalAddOns.length > 0 && (
                    <div className="bg-white/5 border border-white/5 p-3 rounded-lg space-y-2 relative z-10">
                      <h3 className="font-black text-white uppercase tracking-wider border-b border-white/5 pb-1">Available Upgrades</h3>
                      <div className="space-y-1.5">
                        {formData.optionalAddOns.map((add, i) => (
                          <div key={i} className="flex justify-between items-center bg-white/5 p-1.5 rounded border border-white/5">
                            <span className="font-bold truncate max-w-[120px]">{add.name || 'Upgrade Option'}</span>
                            <span className="font-black text-blue-300">{add.price ? formatPrice(Number(add.price) * 100) : '$0.00'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Monthly Support Option */}
                  {formData.monthlySupportOption && (
                    <div className="bg-white/5 border border-white/5 p-3 rounded-lg space-y-1 relative z-10">
                      <h3 className="font-black text-white uppercase tracking-wider border-b border-white/5 pb-1">Monthly Support Option</h3>
                      <p className="text-slate-300 font-semibold text-[9px] leading-relaxed">{formData.monthlySupportOption}</p>
                    </div>
                  )}

                  {/* Action Block */}
                  <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl space-y-3 relative z-10 text-center">
                    <div>
                      <h3 className="font-black text-white text-xs leading-none">Accept Proposal & Pay Deposit</h3>
                      <p className="text-slate-400 text-[8px] mt-1">Locks in production resource allocation and schedules.</p>
                    </div>
                    <div className="flex justify-around text-[9px] py-1.5 border-t border-b border-blue-500/10">
                      <div>
                        <span className="text-slate-500 block font-bold">Deposit Due Now:</span>
                        <span className="font-black text-emerald-400">{formatPrice(depVal * 100)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-bold">Remaining Balance:</span>
                        <span className="font-black text-white">{formatPrice(balVal * 100)}</span>
                      </div>
                    </div>
                    <button type="button" className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:shadow active:scale-95 transition-all text-[9px] uppercase tracking-wider">
                      Approve & Pay Deposit
                    </button>
                  </div>
                </div>
              )}

            </div>
          </aside>

        </div>
        <ToastContainer />
      </div>
    );
  }

  // ──────────────────────────────────────────
  // MAIN QUOTES OPPORTUNITIES LIST VIEW
  // ──────────────────────────────────────────
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
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedQuotes.map(quote => {
                    const servicesData = typeof quote.services === 'string' ? JSON.parse(quote.services) : (quote.services || {});
                    const amountFormatted = quote.customQuoteAmount ? formatPrice(quote.customQuoteAmount) : 'Pending Quote';
                    const depositFormatted = quote.depositRequired ? `Deposit: ${formatPrice(quote.depositRequired)}` : '';
                    
                    const isRowSendDisabled = 
                      !quote.title?.trim() ||
                      !quote.recommendedPackage?.trim() ||
                      !quote.quoteExpirationDate ||
                      !quote.estimatedCompletionTime?.trim() ||
                      !quote.customQuoteAmount ||
                      !quote.depositRequired ||
                      !quote.includedServices?.trim() ||
                      !quote.description?.trim();

                    const isAlreadyProcessed = ['quote_sent', 'deposit_paid', 'approved', 'declined'].includes(quote.quoteStatus);

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
                        <td className="px-6 py-4">{getQuoteStatusBadge(quote.quoteStatus || 'new_request')}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {currentUser?.role === 'super_admin' && (
                              <>
                                <button 
                                  onClick={() => handleSendQuote(quote.id)}
                                  disabled={sendingQuoteId === quote.id || isRowSendDisabled || isAlreadyProcessed}
                                  className={`p-2 rounded-lg transition-colors ${
                                    (isRowSendDisabled || isAlreadyProcessed)
                                      ? 'text-slate-300 cursor-not-allowed opacity-40' 
                                      : 'text-indigo-600 hover:bg-indigo-50'
                                  }`} 
                                  title={
                                    sendingQuoteId === quote.id 
                                      ? 'Sending...' 
                                      : isAlreadyProcessed 
                                        ? `Quote has already been sent/processed (Status: ${quote.quoteStatus}).`
                                        : isRowSendDisabled 
                                          ? 'Proposal incomplete. Please click edit to fill in all required fields before sending.' 
                                          : 'Email Quote Proposal to Client'
                                  }
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
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(quote.stripeCheckoutUrl);
                                  showToast('Stripe Checkout Link copied to clipboard!', 'success');
                                }}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Copy Stripe Checkout Payment Link"
                              >
                                <FaLink size={13} />
                              </button>
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
      </div>
      <ToastContainer />
    </AdminLayout>
  );
};

export default AdminQuotes;
