import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import AdminLayout from './AdminLayout';
import { useToast } from './Toast';
import { 
  FaPlus, FaTrash, FaEdit, FaCheck, FaClock, FaExclamationTriangle, 
  FaFilter, FaSearch, FaPaperPlane, FaBriefcase, FaEye, FaUser, 
  FaEnvelope, FaPhone, FaGlobeAmericas, FaLayerGroup, FaMoneyBillWave,
  FaTimes, FaCheckDouble, FaHistory, FaLock
} from 'react-icons/fa';
import JobDetailsModal from './JobDetailsModal';
import { 
  SERVICES_WITH_PACKAGES, 
  SERVICE_CATEGORIES, 
  CURRENCIES, 
  COUNTRIES,
  BUDGET_RANGES
} from '../../utils/formConstants';
import PhoneInput from '../../components/forms/PhoneInput';
import FileUpload from '../../components/forms/FileUpload';

const AdminNoticeBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningJob, setAssigningJob] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    client: '', // Company Name
    clientFirstName: '',
    clientLastName: '',
    clientEmail: '',
    clientPhone: '',
    clientDialCode: '+1',
    clientTimeline: '',
    otherServiceDescription: '',
    category: 'Graphic Design',
    services: {}, // { serviceName: packageName }
    budget: '',
    currency: 'usd',
    description: '',
    assignedTo: '',
    receivedAt: new Date().toISOString().slice(0, 16),
    dueAt: '',
    status: 'new',
    priority: 'medium',
    notes: '',
    projectFee: '',
    files: []
  });
  const [workerSuggestions, setWorkerSuggestions] = useState([]);
  const [isSearchingWorker, setIsSearchingWorker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validatedEmail, setValidatedEmail] = useState('');
  const validatedEmailRef = useRef('');
  const [isGlobalReturnModalOpen, setIsGlobalReturnModalOpen] = useState(false);
  const [returnFeedback, setReturnFeedback] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { showToast, ToastContainer } = useToast();
  const token = localStorage.getItem('cms_token');

  // Helper for price formatting
  const formatPrice = (amount, currencyCode = 'usd') => {
    const currency = CURRENCIES.find(c => c.code === (currencyCode || 'usd').toLowerCase()) || CURRENCIES[0];
    if (!amount || amount === 0) return 'Custom Quote';
    const decimalAmount = currency.zeroDecimal ? amount : amount / 100;
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

  // Calculate total cost
  const totalCost = Object.entries(formData?.services || {}).reduce((acc, [service, pkg]) => {
    const pkgData = SERVICES_WITH_PACKAGES[service]?.packages[pkg];
    return acc + (pkgData?.price || 0);
  }, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // EmailJS Configuration (Use placeholders if not in .env)
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_placeholder';
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_placeholder';
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key_placeholder';

  const checkReminders = async () => {
    try {
      const res = await fetch('/api/cms/admin/notice-board/reminders/check', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const pendingAlerts = await res.json();
      if (res.ok && pendingAlerts.length > 0) {
        for (const alert of pendingAlerts) {
          await sendReminderEmail(alert);
        }
      }
    } catch (err) { console.error('Reminder check failed', err); }
  };

  const sendReminderEmail = async (alert) => {
    const { job, type } = alert;
    const recipientEmail = job.assignedTo?.includes('@') ? job.assignedTo : 'staff@scalelinkalliance.com';

    try {
      const templateParams = {
        job_title: job.title,
        job_id: job.id,
        assigned_worker: job.assignedTo || 'Unassigned',
        deadline: new Date(job.dueAt).toLocaleString(),
        status: job.status,
        warning_level: type.replace('_', ' '),
        link_to_job: `${window.location.origin}/hub/notice-board`
      };

      // Only attempt if keys are provided
      if (EMAILJS_SERVICE_ID !== 'service_placeholder') {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      }

      await fetch('/api/cms/admin/notice-board/reminders/mark-sent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ jobId: job.id, type, sentTo: recipientEmail })
      });
    } catch (err) { console.error('Email send failed', err); }
  };

  // Auto-generate title and category based on selected services
  useEffect(() => {
    if (!formData.services || Object.keys(formData.services).length === 0) {
      setFormData(prev => ({ ...prev, title: '', category: '' }));
      return;
    }

    const selectedServices = Object.keys(formData.services);
    
    // Internal Job Category = Comma separated service names
    const categoryStr = selectedServices.join(', ');

    // Job Title = Comma separated unique category labels
    const uniqueCategoryLabels = [];
    selectedServices.forEach(service => {
      // Find which category this service belongs to
      for (const [catKey, catData] of Object.entries(SERVICE_CATEGORIES)) {
        if (catData.services.includes(service)) {
          if (!uniqueCategoryLabels.includes(catData.label)) {
            uniqueCategoryLabels.push(catData.label);
          }
          break;
        }
      }
    });
    const titleStr = uniqueCategoryLabels.join(', ');

    setFormData(prev => ({ 
      ...prev, 
      title: titleStr, 
      category: categoryStr 
    }));
  }, [formData.services]);

  // Auto-set status based on worker assignment during CREATION or QUICK ASSIGN
  useEffect(() => {
    if (!editingJob || isAssignModalOpen) { // Automate during creation or quick assign
      setFormData(prev => ({
        ...prev,
        status: prev.assignedTo ? 'assigned' : 'new'
      }));
    }
  }, [formData.assignedTo, editingJob, isAssignModalOpen]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/cms/admin/notice-board', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setJobs(data);
    } catch (err) {
      showToast('Failed to fetch jobs.', 'error');
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
    fetchJobs(); 
    fetchSession();
    checkReminders(); // Run automated reminder check on load

    // Reset pagination when filters change
    setCurrentPage(1);

    // Close suggestions on outside click
    const handleClickOutside = (e) => {
      if (!e.target.closest('.relative')) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [token]);

  // Sync viewingJob with updated jobs list for real-time updates in modal
  useEffect(() => {
    if (viewingJob && jobs.length > 0) {
      const updated = jobs.find(j => j.id === viewingJob.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(viewingJob)) {
        setViewingJob(updated);
      }
    }
  }, [jobs, viewingJob]);


  const EMAILJS_CONFIG = {
    serviceId: 'service_z0n4bpa',
    templateId: 'template_spxsoac',
    publicKey: 'IRwXMIYIKhUnttcdY'
  };

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const sendAdminNotification = async () => {
    try {
      const serviceEntries = Object.entries(formData.services);
      const servicesLine = serviceEntries
        .map(([svc, pkg]) => `${svc} (${pkg.toUpperCase()})`)
        .join(', ') || 'None selected';
      
      const totalSizeRaw = (formData.files || []).reduce((acc, f) => acc + (f.size || 0), 0);
      const fileListFormatted = (formData.files || []).length > 0 
        ? formData.files.map(f => `• ${f.name} (${formatSize(f.size)})`).join('\n')
        : 'No files uploaded';

      const fullName = `${formData.clientFirstName} ${formData.clientLastName}`.trim() || 'Admin Entry';

      const templateParams = {
        title: `[INTERNAL] Post Work Notice: ${formData.title || (serviceEntries[0] ? serviceEntries[0][0] : 'New Job')}`,
        name: fullName,
        email: formData.clientEmail,
        from_name: fullName,
        from_email: formData.clientEmail,
        reply_to: formData.clientEmail,
        company: formData.client || 'Internal/Not specified',
        phone: `${formData.clientDialCode} ${formData.clientPhone}`.trim(),
        services: servicesLine,
        project_description: formData.description || 'See details in Admin Panel',
        other_service_description: formData.otherServiceDescription || 'None',
        timeline: formData.clientTimeline || 'Not specified',
        budget: formData.budget || 'Internal/Custom',
        total_amount: 'Internal/To be quoted',
        payment_status: 'Internal Posting',
        file_count: (formData.files || []).length.toString(),
        total_file_size: formatSize(totalSizeRaw),
        uploaded_files: fileListFormatted,
        request_date: new Date().toLocaleString(),
      };

      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams, EMAILJS_CONFIG.publicKey);
    } catch (err) {
      console.error('Admin EmailJS error:', err);
    }
  };

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
    // Timeout to allow selection click to register
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

  const handleOpenModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      const servicesData = typeof job.services === 'string' ? JSON.parse(job.services) : (job.services || {});
      setFormData({
        title: job.title || '',
        client: job.client || '',
        clientFirstName: job.clientFirstName || '',
        clientLastName: job.clientLastName || '',
        clientEmail: job.clientEmail || '',
        clientPhone: (() => {
          let phone = job.clientPhone || '';
          const dial = job.clientDialCode || '+1';
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
          const phone = job.clientPhone || '';
          let dial = job.clientDialCode || '+1';
          if (phone.startsWith('+')) {
            const spaceIdx = phone.indexOf(' ');
            if (spaceIdx !== -1) {
              dial = phone.substring(0, spaceIdx);
            }
          }
          return dial;
        })(),
        clientTimeline: job.clientTimeline || '',
        otherServiceDescription: job.otherServiceDescription || '',
        category: job.category || '',
        services: servicesData,
        budget: job.budget || '',
        currency: job.currency || 'usd',
        description: job.description || '',
        assignedTo: job.assignedTo || '',
        receivedAt: job.receivedAt ? String(job.receivedAt).slice(0, 16) : new Date().toISOString().slice(0, 16),
        dueAt: job.dueAt ? String(job.dueAt).slice(0, 16) : '',
        status: job.status || 'new',
        priority: job.priority || 'medium',
        notes: job.notes || '',
        projectFee: job.projectFee || '',
        files: []
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: '', client: '', clientFirstName: '', clientLastName: '',
        clientEmail: '', clientPhone: '', clientDialCode: '+1',
        clientTimeline: '', otherServiceDescription: '', category: '',
        services: {}, budget: '', currency: 'usd', description: '',
        assignedTo: '', receivedAt: new Date().toISOString().slice(0, 16),
        dueAt: '', status: 'new', priority: 'medium', notes: '',
        projectFee: '', files: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingJob ? 'PATCH' : 'POST';
    const url = editingJob 
      ? `/api/cms/admin/notice-board/${editingJob.id}` 
      : '/api/cms/admin/notice-board';

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'files') {
          formData.files.forEach(file => data.append('files', file));
        } else if (key === 'services') {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });

      if (res.ok) {
        const savedJob = await res.json();
        showToast(`Job ${editingJob ? 'updated' : 'posted'} successfully!`, 'success');
        
        if (!editingJob) await sendAdminNotification();

        if (!editingJob && formData.assignedTo) {
          await sendReminderEmail({ job: savedJob, type: 'assignment' });
        }

        setIsModalOpen(false);
        fetchJobs();
      } else {
        const error = await res.json();
        showToast(error.error || 'Failed to save job.', 'error');
      }
    } catch (err) {
      showToast('A network error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this job notice? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/cms/admin/notice-board/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Job deleted.', 'success');
        fetchJobs();
      }
    } catch (err) {
      showToast('Failed to delete.', 'error');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/cms/admin/notice-board/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        showToast(`Status updated to ${status.replace('_', ' ')}.`, 'success');
        fetchJobs();
      }
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          j.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || j.status === filter;
    
    // Role-based filtering: 
    // Super Admins see everything.
    // Workers only see their assigned jobs AND only if they have moved past the 'assigned' state
    const isSuperAdmin = currentUser?.role === 'super_admin';
    const isAssignedToMe = j.assignedTo === currentUser?.email || j.assignedTo === currentUser?.email.split('@')[0];
    
    let matchesRole = false;
    if (isSuperAdmin) {
      matchesRole = true;
    } else if (isAssignedToMe) {
      // Worker only sees the job if it's NOT in 'assigned' state (meaning they accepted it)
      matchesRole = j.status !== 'assigned';
    }

    return matchesSearch && matchesFilter && matchesRole;
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isUnpaidCustomQuote = (job) => {
    const hasCustomQuoteService = job.category && job.category.includes('Request Custom Quote');
    const hasQuoteAmount = job.customQuoteAmount && job.customQuoteAmount > 0;
    const isCustomQuote = hasCustomQuoteService || hasQuoteAmount;
    if (!isCustomQuote) return false;
    return job.quoteStatus !== 'deposit_paid' && 
           job.quoteStatus !== 'in_progress' && 
           job.quoteStatus !== 'completed' && 
           job.quoteStatus !== 'approved';
  };

  const getPaymentStatusBadge = (job) => {
    const hasCustomQuoteService = job.category && job.category.includes('Request Custom Quote');
    const hasQuoteAmount = job.customQuoteAmount && job.customQuoteAmount > 0;
    const isCustomQuote = hasCustomQuoteService || hasQuoteAmount;

    if (!isCustomQuote) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
          Paid ✓
        </span>
      );
    }

    switch (job.quoteStatus) {
      case 'deposit_paid':
      case 'in_progress':
      case 'completed':
      case 'approved':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
            Deposit Paid ✓
          </span>
        );
      case 'quote_sent':
      case 'follow_up_needed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 animate-pulse">
            Awaiting Payment
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
            Declined
          </span>
        );
      case 'new_request':
      case 'under_review':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
            Pending Quote
          </span>
        );
    }
  };

  const getStatusBadge = (status, assignedTo) => {
    const isGhostAssignment = status === 'assigned' && !assignedTo;
    const effectiveStatus = isGhostAssignment ? 'new' : status;
    const styles = {
      new: 'bg-blue-100 text-blue-700',
      assigned: 'bg-indigo-100 text-indigo-700',
      in_progress: 'bg-amber-100 text-amber-700',
      checked_out: 'bg-purple-100 text-purple-700',
      waiting_review: 'bg-cyan-100 text-cyan-700',
      completed: 'bg-green-100 text-green-700',
      overdue: 'bg-red-100 text-red-700',
      archived: 'bg-slate-100 text-slate-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${styles[effectiveStatus] || 'bg-slate-100 text-slate-700'}`}>
        {effectiveStatus.replace('_', ' ')}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent': return <span className="flex items-center text-red-600 font-bold text-xs"><FaExclamationTriangle className="mr-1" /> Urgent</span>;
      case 'high': return <span className="text-orange-600 font-bold text-xs">High</span>;
      case 'medium': return <span className="text-blue-600 font-bold text-xs">Medium</span>;
      default: return <span className="text-slate-400 font-medium text-xs">Low</span>;
    }
  };

  const getWarningLevelIndicator = (level) => {
    const colors = {
      green: '#10b981',
      yellow: '#f59e0b',
      orange: '#f97316',
      red: '#ef4444'
    };
    return (
      <div className="flex items-center space-x-2">
        <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: colors[level] }} />
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors[level] }}>{level}</span>
      </div>
    );
  };

  return (
    <AdminLayout pageTitle="Work Notice Board">
      <div className="max-w-7xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search jobs or clients..."
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
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            {currentUser?.role === 'super_admin' && (
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200"
              >
                <FaPlus size={12} />
                <span>Post New Job</span>
              </button>
            )}
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-slate-500">Fetching board data...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
                <FaBriefcase size={30} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No jobs found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your filters or post a new job to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Job & Warning</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client & Worker</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timeline</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedJobs.map(job => {
                    const isSuperAdmin = currentUser?.role === 'super_admin';
                    const isAssignedToMe = job.assignedTo === currentUser?.email || job.assignedTo === currentUser?.email?.split('@')[0];
                    
                    return (
                      <tr key={job.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="mb-2">
                            {getWarningLevelIndicator(job.warningLevel)}
                          </div>
                          <div className="space-y-1 mb-2">
                            {currentUser?.role === 'worker' ? (
                              <p className="font-bold text-slate-800 leading-tight text-sm">
                                {job.category.replace(/Request Custom Quote - /g, '')}
                              </p>
                            ) : (
                              job.title.split(', ').map((t, i) => (
                                <p key={i} className="font-bold text-slate-800 leading-tight text-sm">
                                  {t.replace(/Request Custom Quote - /g, '')}
                                </p>
                              ))
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {getPriorityBadge(job.priority)}
                            <span className="text-[10px] text-slate-400 font-medium">#{job.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-700 mb-1.5">{job.client}</p>
                          <div className="flex flex-col space-y-1 text-[11px] text-slate-500">
                            <div className="flex flex-wrap gap-1">
                              {job.category.split(', ').map((c, i) => (
                                <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-medium block w-full">{c.replace(/Request Custom Quote - /g, '')}</span>
                              ))}
                            </div>
                            <span className="pt-1">Assignee: <span className="font-bold text-slate-700">{job.assignedTo || 'Unassigned'}</span></span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-3">
                            <div className="flex items-start text-[11px] text-slate-400">
                              <span className="w-10 font-bold text-[9px] mt-0.5">IN:</span>
                              <div className="flex flex-col">
                                <span className="text-slate-700 font-bold">{new Date(job.receivedAt).toLocaleDateString([], { dateStyle: 'medium' })}</span>
                                <span className="text-slate-400 font-medium">{new Date(job.receivedAt).toLocaleTimeString([], { timeStyle: 'short' })}</span>
                              </div>
                            </div>
                            <div className="flex items-start text-[11px] text-slate-400">
                              <span className="w-10 font-bold text-[9px] mt-0.5">DUE:</span>
                              <div className="flex flex-col">
                                <span className={`font-bold ${job.warningLevel === 'red' ? 'text-red-600' : 'text-slate-700'}`}>
                                  {new Date(job.dueAt).toLocaleDateString([], { dateStyle: 'medium' })}
                                </span>
                                <span className="text-slate-400 font-medium">
                                  {new Date(job.dueAt).toLocaleTimeString([], { timeStyle: 'short' })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-2 items-start">
                            {getStatusBadge(job.status, job.assignedTo)}
                            {getPaymentStatusBadge(job)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Lifecycle Actions */}
                            {job.status === 'assigned' && isAssignedToMe && (
                              <button 
                                onClick={async () => {
                                  try {
                                    const res = await fetch(`/api/cms/admin/notice-board/${job.id}/accept`, {
                                      method: 'PATCH',
                                      headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    if (res.ok) {
                                      showToast('Job accepted!', 'success');
                                      fetchJobs();
                                    }
                                  } catch (e) { showToast('Failed to accept job', 'error'); }
                                }} 
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                                title="Accept Job"
                              >
                                <FaCheck size={14} />
                              </button>
                            )}
                            {job.status === 'in_progress' && isAssignedToMe && (
                              <button 
                                onClick={async () => {
                                  try {
                                    const res = await fetch(`/api/cms/admin/notice-board/${job.id}/checkout`, {
                                      method: 'PATCH',
                                      headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    if (res.ok) {
                                      showToast('Job checked out!', 'success');
                                      fetchJobs();
                                    }
                                  } catch (e) { showToast('Failed to checkout', 'error'); }
                                }} 
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
                                title="Check Out (Begin Work)"
                              >
                                <FaPaperPlane size={14} />
                              </button>
                            )}
                            {job.status === 'checked_out' && isSuperAdmin && (
                            <button 
                              onClick={async () => {
                                try {
                                  const res = await fetch(`/api/cms/admin/notice-board/${job.id}/review`, {
                                    method: 'PATCH',
                                    headers: { 'Authorization': `Bearer ${token}` }
                                  });
                                  if (res.ok) {
                                    showToast('Review started!', 'success');
                                    fetchJobs();
                                  }
                                } catch (e) { showToast('Failed to start review', 'error'); }
                              }} 
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                              title="Start Review"
                            >
                              <FaClock size={14} />
                            </button>
                          )}
                            
                            {/* Admin Review Actions */}
                            {job.status === 'waiting_review' && isSuperAdmin && (
                              <>
                                <button 
                                  onClick={async () => {
                                    try {
                                      const res = await fetch(`/api/cms/admin/notice-board/${job.id}/approve`, {
                                        method: 'PATCH',
                                        headers: { 'Authorization': `Bearer ${token}` }
                                      });
                                      if (res.ok) {
                                        showToast('Job approved!', 'success');
                                        fetchJobs();
                                      }
                                    } catch (e) { showToast('Failed to approve', 'error'); }
                                  }} 
                                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                                  title="Approve Work"
                                >
                                  <FaCheckDouble size={14} />
                                </button>
                                <button 
                                  onClick={() => {
                                    setAssigningJob(job);
                                    setIsGlobalReturnModalOpen(true);
                                  }} 
                                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" 
                                  title="Return for Revision"
                                >
                                  <FaHistory size={14} />
                                </button>
                              </>
                            )}

                            <button onClick={() => setViewingJob(job)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details"><FaEye size={14} /></button>
                            {isSuperAdmin && (
                              <>
                                {job.status !== 'completed' && (
                                  <button onClick={() => handleOpenModal(job)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit"><FaEdit size={14} /></button>
                                )}
                                {job.status === 'new' && (
                                  <button onClick={() => handleDelete(job.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Notice"><FaTrash size={14} /></button>
                                )}
                              </>
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
                    Showing <span className="font-bold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredJobs.length)}</span> of <span className="font-bold text-slate-700">{filteredJobs.length}</span> notices
                  </p>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        // Only show first, last, and pages around current
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                                currentPage === page 
                                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                                  : 'text-slate-500 hover:bg-white hover:text-slate-700 border border-transparent hover:border-slate-200'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="text-slate-300">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Details Modal */}
        {viewingJob && (
          <JobDetailsModal 
            job={viewingJob} 
            currentUser={currentUser}
            onClose={() => setViewingJob(null)} 
            onRefresh={fetchJobs}
            showToast={showToast}
          />
        )}

        {/* Global Return Feedback Modal (For list actions) */}
        {isGlobalReturnModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaHistory size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Return for Revision</h3>
                  <p className="text-sm text-slate-500">Provide clear instructions for the worker on what needs to be improved or corrected.</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Revision Feedback *</label>
                    <textarea
                      rows={5}
                      value={returnFeedback}
                      onChange={e => setReturnFeedback(e.target.value)}
                      placeholder="Specify exactly what needs to be changed..."
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none text-sm transition-all resize-none shadow-sm"
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        setIsGlobalReturnModalOpen(false);
                        setReturnFeedback('');
                        setAssigningJob(null);
                      }}
                      className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={async () => {
                        if (!returnFeedback.trim()) {
                          showToast('Please provide feedback before returning.', 'warning');
                          return;
                        }
                        setLoading(true);
                        try {
                          const res = await fetch(`/api/cms/admin/notice-board/${assigningJob.id}/return`, {
                            method: 'PATCH',
                            headers: { 
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}` 
                            },
                            body: JSON.stringify({ feedback: returnFeedback })
                          });
                          if (res.ok) {
                            showToast('Job returned for revision.', 'warning');
                            setIsGlobalReturnModalOpen(false);
                            setReturnFeedback('');
                            setAssigningJob(null);
                            fetchJobs();
                          }
                        } catch (e) { showToast('Failed to return job', 'error'); }
                        finally { setLoading(false); }
                      }}
                      disabled={loading}
                      className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Submit Revision'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Post/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">{editingJob ? 'Edit Job' : 'Post New Work Notice'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
              </div>
              <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Section 1: Client Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><FaUser size={14} /></div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Client Information</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">First Name *</label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
                          <input required value={formData.clientFirstName} onChange={e => setFormData({...formData, clientFirstName: e.target.value})} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" placeholder="John" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Last Name *</label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
                          <input required value={formData.clientLastName} onChange={e => setFormData({...formData, clientLastName: e.target.value})} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" placeholder="Doe" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Email Address *</label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
                          <input required type="email" value={formData.clientEmail} onChange={e => setFormData({...formData, clientEmail: e.target.value})} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" placeholder="john.doe@example.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Company / Business Name *</label>
                        <div className="relative">
                          <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
                          <input required value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" placeholder="Acme Corp" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Phone Number *</label>
                      <PhoneInput 
                        value={formData.clientPhone} 
                        dialCode={formData.clientDialCode}
                        onNumberChange={val => setFormData({...formData, clientPhone: val})}
                        onDialChange={val => setFormData({...formData, clientDialCode: val})}
                      />
                    </div>
                  </div>

                  {/* Section 2: Service Selection */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><FaLayerGroup size={14} /></div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Service Selection</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {Object.entries(SERVICE_CATEGORIES).map(([key, cat]) => (
                        <div key={key} className="space-y-3">
                          <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1 h-1 bg-indigo-400 rounded-full"></span>
                            {cat.label}
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {cat.services.map(service => {
                              const isSelected = formData.services[service];
                              const pkgData = SERVICES_WITH_PACKAGES[service];
                              
                              return (
                                <div 
                                  key={service}
                                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                                    isSelected 
                                      ? 'border-indigo-500 bg-indigo-50/30' 
                                      : 'border-slate-100 bg-white hover:border-slate-200'
                                  }`}
                                  onClick={() => {
                                    const newServices = { ...formData.services };
                                    if (isSelected) {
                                      delete newServices[service];
                                    } else {
                                      newServices[service] = 'starter'; // Default package
                                    }
                                    setFormData({ 
                                      ...formData, 
                                      services: newServices,
                                      title: formData.title || service // Auto-set title if empty
                                    });
                                  }}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>{service}</span>
                                    {isSelected && <FaCheck className="text-indigo-600" size={12} />}
                                  </div>
                                  
                                  {isSelected && pkgData && (
                                    <select 
                                      value={formData.services[service]}
                                      onClick={e => e.stopPropagation()}
                                      onChange={e => {
                                        const newServices = { ...formData.services };
                                        newServices[service] = e.target.value;
                                        setFormData({ ...formData, services: newServices });
                                      }}
                                      className="w-full text-[11px] font-bold bg-white border border-indigo-200 rounded-lg px-2 py-1 outline-none text-indigo-600"
                                    >
                                      {Object.keys(pkgData.packages).map(pkg => (
                                        <option key={pkg} value={pkg}>{pkg.toUpperCase()} Plan</option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Project & Finance */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="p-1.5 bg-green-50 text-green-600 rounded-lg"><FaMoneyBillWave size={14} /></div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Project & Finance</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Job Title (Auto-generated) *</label>
                        <div className="w-full min-h-[42px] p-2 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap gap-1.5 items-center">
                          {formData.title ? formData.title.split(', ').map(cat => (
                            <span key={cat} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md text-[11px] font-bold border border-blue-200 shadow-sm">
                              {cat}
                            </span>
                          )) : (
                            <span className="text-slate-400 text-sm ml-1 italic">Select services above...</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Internal Job Category (Auto-generated) *</label>
                        <div className="w-full min-h-[42px] p-2 rounded-xl border border-slate-200 bg-slate-50 flex flex-wrap gap-1.5 items-center">
                          {formData.category ? formData.category.split(', ').map(svc => (
                            <span key={svc} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-[11px] font-bold border border-indigo-200 shadow-sm">
                              {svc}
                            </span>
                          )) : (
                            <span className="text-slate-400 text-sm ml-1 italic">Select services above...</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {formData.services && Object.keys(formData.services).some(s => s.includes('Request Custom Quote')) && (
                      <div className="animate-fade-in">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Custom Quote Details</label>
                        <textarea
                          name="otherServiceDescription"
                          
                          rows={3}
                          value={formData.otherServiceDescription}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                          placeholder="Specify the custom service requirements..."
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Project Description *</label>
                      <textarea
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                        placeholder="Describe the client's project goals and requirements..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Client Timeline</label>
                        <select
                          name="clientTimeline"
                          value={formData.clientTimeline}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                        >
                          <option value="">Select Timeline</option>
                          <option value="ASAP">As soon as possible</option>
                          <option value="1-2 weeks">1-2 weeks</option>
                          <option value="Within 1 month">Within 1 month</option>
                          <option value="2-3 months">2-3 months</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Budget Range</label>
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                        >
                          <option value="">Select Budget Range</option>
                          {BUDGET_RANGES.map(range => (
                            <option key={range} value={range}>{range}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Attachments</label>
                      <FileUpload 
                        files={formData.files}
                        onFilesAdded={acceptedFiles => setFormData({ ...formData, files: [...formData.files, ...acceptedFiles] })}
                        onFileRemove={idx => setFormData({ ...formData, files: formData.files.filter((_, i) => i !== idx) })}
                      />
                    </div>
                  </div>

                  {/* Section 4: Work Management */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><FaBriefcase size={14} /></div>
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Work Management</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Row 1: Assigned Worker & Status */}
                      <div className="relative">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Assigned Worker</label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
                          <input 
                            value={formData.assignedTo} 
                            onChange={e => !editingJob && handleWorkerSearch(e.target.value)}
                            onFocus={() => !editingJob && formData.assignedTo.length >= 2 && setShowSuggestions(true)}
                            onBlur={handleWorkerBlur}
                            readOnly={!!editingJob}
                            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all ${editingJob ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`} 
                            placeholder={editingJob ? "Use Assignment tab in View Details" : "Search by email..."} 
                          />
                        </div>
                        {isSearchingWorker && (
                          <div className="absolute right-3 top-[34px]">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                          </div>
                        )}
                        {showSuggestions && (
                          <div className="absolute z-[60] left-0 right-0 top-[65px] bg-white border border-slate-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto ring-1 ring-black/5">
                            {workerSuggestions.map(w => (
                              <button
                                key={w.id}
                                type="button"
                                onClick={() => selectWorker(w.email)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm font-semibold text-slate-700 transition-colors border-b border-slate-50 last:border-0"
                              >
                                {w.email}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Status</label>
                        <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-500 flex items-center justify-between">
                          <span className="capitalize">{formData.status.replace('_', ' ')}</span>
                        </div>
                      </div>

                      {/* Row 2: Received At & Deadline */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Received At *</label>
                        <input 
                          required 
                          type="datetime-local" 
                          value={formData.receivedAt} 
                          onChange={e => !editingJob && setFormData({...formData, receivedAt: e.target.value})} 
                          readOnly={!!editingJob}
                          className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm ${editingJob ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`} 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Deadline *</label>
                        <input 
                          required 
                          type="datetime-local" 
                          value={formData.dueAt} 
                          onChange={e => !editingJob && setFormData({...formData, dueAt: e.target.value})} 
                          readOnly={!!editingJob}
                          className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm ${editingJob ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`} 
                        />
                      </div>

                      {/* Row 3: Priority & Project Fee */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Priority</label>
                        <select 
                          value={formData.priority} 
                          onChange={e => !editingJob && setFormData({...formData, priority: e.target.value})} 
                          disabled={!!editingJob}
                          className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white ${editingJob ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Project Fee (USD)</label>
                        <div className="relative">
                          <FaMoneyBillWave className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
                          <input 
                            type="number"
                            min="0"
                            value={formData.projectFee} 
                            onChange={e => !editingJob && setFormData({...formData, projectFee: e.target.value})} 
                            readOnly={!!editingJob}
                            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm ${editingJob ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'bg-white'}`} 
                            placeholder="e.g. 150" 
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Internal Notes</label>
                      <textarea 
                        rows={2} 
                        value={formData.notes} 
                        onChange={e => !editingJob && setFormData({...formData, notes: e.target.value})} 
                        readOnly={!!editingJob}
                        className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none ${editingJob ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : ''}`} 
                        placeholder={editingJob ? "Use Assignment tab in View Details" : "Add private notes for the team..."} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50/80 backdrop-blur-md border-t border-slate-200 p-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                      <span className="text-xs font-bold text-slate-700 capitalize">{formData.status.replace('_', ' ')}</span>
                    </div>
                    {totalCost > 0 && (
                      <div className="flex flex-col border-l border-slate-200 pl-6">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                        <span className="text-sm font-black text-green-600">{formatPrice(totalCost, formData.currency)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                    <button type="submit" disabled={loading} className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]">
                      {loading ? 'Saving...' : <FaCheck size={12} />} <span>{editingJob ? 'Update Notice' : 'Post Notice'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Quick Assign Modal */}
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><FaCheck size={14} /></div>
                  <h3 className="font-bold text-slate-800">Quick Assignment</h3>
                </div>
                <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-full">
                  <FaTimes size={16} />
                </button>
              </div>
              <form onSubmit={handleQuickAssignSave} className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><FaBriefcase size={14} /></div>
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Work Management</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Assigned Worker</label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
                        <input 
                          value={formData.assignedTo} 
                          onChange={e => handleWorkerSearch(e.target.value)}
                          onFocus={() => formData.assignedTo.length >= 2 && setShowSuggestions(true)}
                          onBlur={handleWorkerBlur}
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all" 
                          placeholder="Search by email..." 
                        />
                      </div>
                      {isSearchingWorker && (
                        <div className="absolute right-3 top-[34px]">
                          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                        </div>
                      )}
                      {showSuggestions && (
                        <div className="absolute z-[70] left-0 right-0 top-[65px] bg-white border border-slate-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto ring-1 ring-black/5">
                          {workerSuggestions.map(w => (
                            <button
                              key={w.id}
                              type="button"
                              onClick={() => selectWorker(w.email)}
                              className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm font-semibold text-slate-700 transition-colors border-b border-slate-50 last:border-0"
                            >
                              {w.email}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Priority</label>
                        <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Status</label>
                        <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-500 flex items-center justify-between">
                          <span className="capitalize">{formData.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Received At *</label>
                      <input required type="datetime-local" value={formData.receivedAt} onChange={e => setFormData({...formData, receivedAt: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Deadline *</label>
                      <input required type="datetime-local" value={formData.dueAt} onChange={e => setFormData({...formData, dueAt: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Internal Notes</label>
                    <textarea rows={2} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none" placeholder="Add private notes for the team..." />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                  <button type="button" onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                  <button type="submit" disabled={loading} className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]">
                    {loading ? 'Assigning...' : <><FaCheck size={12} /> <span>Confirm Assignment</span></>}
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

export default AdminNoticeBoard;
