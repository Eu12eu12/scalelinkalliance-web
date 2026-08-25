import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AdminLayout from './AdminLayout';
import { 
  FaBell, FaTrash, FaCheckDouble, FaInbox, FaFilter, FaClock, 
  FaCheckCircle, FaFileAlt, FaHistory, FaTimes, FaComments, 
  FaCloudUploadAlt 
} from 'react-icons/fa';
import { toast } from 'react-toastify';

// ===== CONSTANTS =====
const NOTIFICATION_CONFIG = {
  assignment: { 
    icon: FaBell, 
    bgColor: 'bg-blue-100', 
    textColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-700',
    label: 'ASSIGNMENT'
  },
  acceptance: { 
    icon: FaCheckCircle, 
    bgColor: 'bg-green-100', 
    textColor: 'text-green-600',
    badgeColor: 'bg-green-100 text-green-700',
    label: 'ACCEPTED'
  },
  check_out: { 
    icon: FaFileAlt, 
    bgColor: 'bg-orange-100', 
    textColor: 'text-orange-600',
    badgeColor: 'bg-orange-100 text-orange-700',
    label: 'CHECK OUT'
  },
  review: { 
    icon: FaClock, 
    bgColor: 'bg-indigo-100', 
    textColor: 'text-indigo-600',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    label: 'REVIEW'
  },
  completed: { 
    icon: FaCheckDouble, 
    bgColor: 'bg-emerald-100', 
    textColor: 'text-emerald-600',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    label: 'COMPLETED'
  },
  returned: { 
    icon: FaHistory, 
    bgColor: 'bg-red-100', 
    textColor: 'text-red-600',
    badgeColor: 'bg-red-100 text-red-700',
    label: 'DECLINED'
  },
  cancelled: { 
    icon: FaTrash, 
    bgColor: 'bg-rose-100', 
    textColor: 'text-rose-600',
    badgeColor: 'bg-rose-100 text-rose-700',
    label: 'CANCELLED'
  },
  service_request: { 
    icon: FaFileAlt, 
    bgColor: 'bg-blue-100', 
    textColor: 'text-blue-600',
    badgeColor: 'bg-blue-600 text-white shadow-sm',
    label: 'NEW REQUEST'
  },
  comment: { 
    icon: FaComments, 
    bgColor: 'bg-blue-100', 
    textColor: 'text-blue-600',
    badgeColor: 'bg-blue-50 text-blue-700',
    label: 'COMMENT'
  },
  file: { 
    icon: FaCloudUploadAlt, 
    bgColor: 'bg-sky-100', 
    textColor: 'text-sky-600',
    badgeColor: 'bg-sky-50 text-sky-700',
    label: 'FILE'
  },
  website_review_request: { 
    icon: FaFileAlt, 
    bgColor: 'bg-amber-100', 
    textColor: 'text-amber-600',
    badgeColor: 'bg-amber-100 text-amber-700',
    label: 'WEBSITE REVIEW'
  }
};

const DEFAULT_CONFIG = {
  icon: FaBell,
  bgColor: 'bg-slate-100',
  textColor: 'text-slate-600',
  badgeColor: 'bg-slate-100 text-slate-700',
  label: 'UPDATE'
};

// ===== UTILITY FUNCTIONS =====
const parseMeta = (metadata) => {
  if (!metadata) return {};
  if (typeof metadata === 'string') {
    try { 
      const parsed = JSON.parse(metadata);
      return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
    } catch { 
      return {}; 
    }
  }
  return metadata;
};

const sanitizeContent = (content) => {
  if (!content) return '';
  return String(content)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const getNotificationConfig = (type) => {
  return NOTIFICATION_CONFIG[type] || DEFAULT_CONFIG;
};

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return 'Invalid date';
  }
};

// ===== RENDER HELPERS =====
const isWebsiteReviewNotification = (notification) => {
  const type = notification?.type;
  return type === 'website_review_request' || type === 'website_review' || type === 'lead';
};

const renderMessage = (notification, isWorker) => {
  if (!notification) return '';
  
  const rawMsg = notification.message || `Job Update: ${notification.type?.replace('_', ' ') || ''}`;
  const sanitizedMsg = sanitizeContent(rawMsg);
  const message = isWorker 
    ? sanitizedMsg.replace(/Request Custom Quote - /g, '') 
    : sanitizedMsg;

  if (notification.type === 'comment' && message.startsWith('[Client Message]')) {
    const colonIndex = message.indexOf(':', '[Client Message]'.length);
    if (colonIndex !== -1) {
      const prefix = message.slice(0, colonIndex + 1);
      let content = message.slice(colonIndex + 1).trim();
      
      let displayContent = content;
      if (content.length > 75) {
        displayContent = content.slice(0, 75) + '...';
      }

      return (
        <span>
          {sanitizeContent(prefix)}
          {' '}
          <span className="font-normal">{sanitizeContent(displayContent)}</span>
        </span>
      );
    }
  }

  return sanitizeContent(message);
};

// ===== MAIN COMPONENT =====
const Notifications = () => {
  // ===== STATE =====
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [activeJobForDecline, setActiveJobForDecline] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [activeLead, setActiveLead] = useState(null);
  const [loadingLead, setLoadingLead] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const itemsPerPage = 5;
  const token = localStorage.getItem('cms_token');

  // ===== API CALLS =====
  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/cms/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data);
      } else {
        toast.error(data.message || 'Failed to load notifications');
      }
    } catch (err) {
      toast.error('Failed to load notifications');
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchSession = useCallback(async () => {
    if (!token) return;

    try {
      const res = await fetch('/api/cms/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch session:', err);
    }
  }, [token]);

  // ===== EFFECTS =====
  useEffect(() => {
    fetchNotifications();
    fetchSession();

    const handleUpdate = () => fetchNotifications();
    window.addEventListener('notificationsUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('notificationsUpdated', handleUpdate);
    };
  }, [fetchNotifications, fetchSession]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // ===== COMPUTED VALUES =====
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (filter === 'unread') return !n.isRead;
      return true;
    });
  }, [notifications, filter]);

  const isStale = useCallback((notification) => {
    if (!notification) return true;
    if (notification.type !== 'assignment') return false;
    
    if (notification.actionStatus && notification.actionStatus !== 'pending') return true;
    if (!notification.job) return true;
    if (notification.job.status !== 'assigned') return true;
    
    const newer = notifications.find(n => 
      n.type === 'assignment' && 
      n.jobId === notification.jobId && 
      new Date(n.createdAt) > new Date(notification.createdAt)
    );
    if (newer) return true;
    
    return false;
  }, [notifications]);

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / itemsPerPage));
  const currentNotifications = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredNotifications.slice(start, end);
  }, [filteredNotifications, currentPage]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // ===== ACTION HANDLERS =====
  const markAsRead = useCallback(async (id) => {
    if (!id) return false;
    
    try {
      const res = await fetch(`/api/cms/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Mark as read error:', err);
      toast.error('Failed to mark as read');
      return false;
    }
  }, [token]);

  const openLeadModal = useCallback(async (notification) => {
    if (!notification) {
      toast.error('No notification data');
      return;
    }
    
    const meta = parseMeta(notification.metadata);
    console.log('Opening lead modal for:', notification);
    console.log('Metadata:', meta);
    
    // Try multiple ways to get the lead ID
    let leadId = null;
    
    if (meta.leadId) {
      leadId = meta.leadId;
    } else if (meta.id) {
      leadId = meta.id;
    } else if (notification.leadId) {
      leadId = notification.leadId;
    } else if (notification.job && notification.job.leadId) {
      leadId = notification.job.leadId;
    } else if (notification.job && notification.job.id) {
      leadId = notification.job.id;
    }
    
    // If still no lead ID, use data from metadata directly
    if (!leadId) {
      // Show data from metadata without API call
      setShowLeadModal(true);
      setLoadingLead(false);
      setActiveLead({
        clientName: meta.clientName || notification.fromUser || 'System',
        clientEmail: meta.clientEmail || 'N/A',
        company: meta.company || 'N/A',
        websiteUrl: meta.websiteUrl || meta.url || 'N/A',
        businessDescription: meta.businessDescription || 'Website review request',
        status: meta.status || 'pending',
        createdAt: notification.createdAt || new Date().toISOString()
      });
      
      if (!notification.isRead) {
        await markAsRead(notification.id);
      }
      return;
    }
    
    setShowLeadModal(true);
    setLoadingLead(true);
    setActiveLead(null);
    
    try {
      console.log('Fetching lead with ID:', leadId);
      const res = await fetch(`/api/leads/${leadId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      
      if (res.ok && data.success) {
        setActiveLead(data.data);
        if (!notification.isRead) {
          await markAsRead(notification.id);
        }
      } else {
        // Fallback to metadata
        setActiveLead({
          clientName: meta.clientName || notification.fromUser || 'System',
          clientEmail: meta.clientEmail || 'N/A',
          company: meta.company || 'N/A',
          websiteUrl: meta.websiteUrl || meta.url || 'N/A',
          businessDescription: meta.businessDescription || 'Website review request',
          status: meta.status || 'pending',
          createdAt: notification.createdAt || new Date().toISOString()
        });
        toast.info('Showing lead data from notification');
        if (!notification.isRead) {
          await markAsRead(notification.id);
        }
      }
    } catch (err) {
      console.error('Error fetching lead:', err);
      // Fallback to metadata on error
      setActiveLead({
        clientName: meta.clientName || notification.fromUser || 'System',
        clientEmail: meta.clientEmail || 'N/A',
        company: meta.company || 'N/A',
        websiteUrl: meta.websiteUrl || meta.url || 'N/A',
        businessDescription: meta.businessDescription || 'Website review request',
        status: meta.status || 'pending',
        createdAt: notification.createdAt || new Date().toISOString()
      });
      toast.info('Showing lead data from notification');
      if (!notification.isRead) {
        await markAsRead(notification.id);
      }
    } finally {
      setLoadingLead(false);
    }
  }, [token, markAsRead]);

  const markAllRead = useCallback(async () => {
    if (isProcessingAction) return;
    
    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/cms/notifications/read-all', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success('All marked as read');
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to mark all as read');
      }
    } catch (err) {
      toast.error('Failed to mark all as read');
      console.error('Mark all read error:', err);
    } finally {
      setIsProcessingAction(false);
    }
  }, [token, isProcessingAction]);

  const clearRead = useCallback(async () => {
    if (!window.confirm('Clear all read notifications?')) return;
    if (isProcessingAction) return;
    
    setIsProcessingAction(true);
    try {
      const res = await fetch('/api/cms/notifications/clear', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setNotifications(prev => prev.filter(n => !n.isRead));
        toast.success('Cleared read notifications');
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to clear notifications');
      }
    } catch (err) {
      toast.error('Failed to clear notifications');
      console.error('Clear notifications error:', err);
    } finally {
      setIsProcessingAction(false);
    }
  }, [token, isProcessingAction]);

  const handleAcceptJob = useCallback(async (notification) => {
    if (!notification || !notification.jobId) {
      toast.error('Invalid notification data');
      return;
    }
    if (isProcessingAction) return;
    
    setIsProcessingAction(true);
    try {
      const res = await fetch(`/api/cms/admin/notice-board/${notification.jobId}/accept`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast.success('Job accepted! It now appears on your board.');
        await markAsRead(notification.id);
        await fetchNotifications();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to accept job');
      }
    } catch (e) {
      toast.error('Connection error');
      console.error('Accept job error:', e);
    } finally {
      setIsProcessingAction(false);
    }
  }, [token, markAsRead, fetchNotifications, isProcessingAction]);

  const handleDeclineJob = useCallback(async () => {
    if (!declineReason.trim()) {
      toast.warning('Please provide a reason');
      return;
    }
    if (!activeJobForDecline || !activeJobForDecline.jobId) {
      toast.error('Invalid job data');
      return;
    }
    if (isProcessingAction) return;
    
    setIsProcessingAction(true);
    try {
      const res = await fetch(`/api/cms/admin/notice-board/${activeJobForDecline.jobId}/decline`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: declineReason.trim() })
      });
      
      if (res.ok) {
        toast.info('Assignment declined.');
        await markAsRead(activeJobForDecline.id);
        setShowDeclineModal(false);
        setDeclineReason('');
        await fetchNotifications();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to decline');
      }
    } catch (e) {
      toast.error('Connection error');
      console.error('Decline job error:', e);
    } finally {
      setIsProcessingAction(false);
    }
  }, [declineReason, activeJobForDecline, token, markAsRead, fetchNotifications, isProcessingAction]);

  // ===== RENDER HELPERS =====
  const renderNotificationBadge = useCallback((type) => {
    const config = getNotificationConfig(type);
    const label = config.label;
    return (
      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${config.badgeColor}`}>
        {label}
      </span>
    );
  }, []);

  const renderNotificationDetails = useCallback((notification) => {
    if (!notification) return null;

    const meta = parseMeta(notification.metadata);
    const displayJob = meta?.snapshot || notification.job || {};

    // Returned notification
    if (notification.type === 'returned' && meta && Object.keys(meta).length > 0) {
      return (
        <div className="mb-4 mt-2 p-4 bg-red-50/30 border border-red-100 rounded-xl space-y-2 shadow-sm">
          <p className="text-sm">
            <span className="font-bold text-slate-700">Worker:</span> 
            <span className="text-slate-600 ml-2">{sanitizeContent(meta.workerEmail || 'Unknown')}</span>
          </p>
          <div className="text-sm">
            <span className="font-bold text-slate-700 block mb-1">Reason:</span>
            <p className="text-slate-500 leading-relaxed bg-white/50 p-3 rounded-lg border border-red-50">
              {sanitizeContent(meta.reason || 'No reason provided.')}
            </p>
          </div>
        </div>
      );
    }

    // File upload notification
    if (notification.type === 'file' && meta) {
      const fileNames = meta.fileNames || [];
      const names = Array.isArray(fileNames) ? fileNames : 
        (typeof fileNames === 'string' ? JSON.parse(fileNames) : []);
      
      if (!meta.clientName && !meta.clientEmail && names.length === 0) return null;
      
      return (
        <div className="mb-4 mt-2 p-4 bg-sky-50/30 border border-sky-100 rounded-xl space-y-2 shadow-sm">
          <p className="text-sm">
            <span className="font-bold text-slate-700">Client Name:</span>
            <span className="text-slate-600 ml-2">{sanitizeContent(meta.clientName || 'N/A')}</span>
          </p>
          <p className="text-sm">
            <span className="font-bold text-slate-700">Client Email:</span>
            <span className="text-slate-600 ml-2">{sanitizeContent(meta.clientEmail || 'N/A')}</span>
          </p>
          {names.length > 0 && (
            <div className="text-sm">
              <span className="font-bold text-slate-700">Files:</span>
              <span className="text-slate-600 ml-2">{names.map(sanitizeContent).join(', ')}</span>
            </div>
          )}
        </div>
      );
    }

    // Acceptance notification
    if (notification.type === 'acceptance' && meta) {
      if (!meta.workerName && !meta.workerEmail) return null;
      
      return (
        <div className="mb-4 mt-2 p-4 bg-green-50/30 border border-green-100 rounded-xl space-y-2 shadow-sm">
          <p className="text-sm">
            <span className="font-bold text-slate-700">Worker Name:</span>
            <span className="text-slate-600 ml-2">{sanitizeContent(meta.workerName || 'N/A')}</span>
          </p>
          <p className="text-sm">
            <span className="font-bold text-slate-700">Worker Email:</span>
            <span className="text-slate-600 ml-2">{sanitizeContent(meta.workerEmail || notification.fromUser || 'N/A')}</span>
          </p>
        </div>
      );
    }

    // Completed notification from client
    if (notification.type === 'completed' && notification.fromUser === 'client' && meta) {
      if (!meta.clientName && !meta.clientEmail && !meta.company) return null;
      
      return (
        <div className="mb-4 mt-2 p-4 bg-emerald-50/30 border border-emerald-100 rounded-xl space-y-2 shadow-sm">
          <p className="text-sm">
            <span className="font-bold text-slate-700">Client Name:</span>
            <span className="text-slate-600 ml-2">{sanitizeContent(meta.clientName || 'N/A')}</span>
          </p>
          <p className="text-sm">
            <span className="font-bold text-slate-700">Client Email:</span>
            <span className="text-slate-600 ml-2">{sanitizeContent(meta.clientEmail || 'N/A')}</span>
          </p>
          <p className="text-sm">
            <span className="font-bold text-slate-700">Company:</span>
            <span className="text-slate-600 ml-2">{sanitizeContent(meta.company || 'N/A')}</span>
          </p>
        </div>
      );
    }

    // Website Review Request
    if (isWebsiteReviewNotification(notification)) {
      const clientName = meta.clientName || notification.fromUser || 'System';
      const websiteUrl = meta.websiteUrl || meta.url || meta.website || 'N/A';
      const company = meta.company || 'N/A';
      
      return (
        <div className="mb-4 mt-2 p-4 bg-amber-50/30 border border-amber-100 rounded-xl space-y-2 shadow-sm">
          <p className="text-sm">
            <span className="font-bold text-slate-700">Client:</span> 
            <span className="text-slate-600 ml-2">{sanitizeContent(clientName)}</span>
          </p>
          {websiteUrl && websiteUrl !== 'N/A' && (
            <p className="text-sm">
              <span className="font-bold text-slate-700">Website:</span> 
              <a 
                href={websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-600 ml-2 hover:underline"
              >
                {sanitizeContent(websiteUrl)}
              </a>
            </p>
          )}
          {company && company !== 'N/A' && (
            <p className="text-sm">
              <span className="font-bold text-slate-700">Company:</span> 
              <span className="text-slate-600 ml-2">{sanitizeContent(company)}</span>
            </p>
          )}
          <button 
            onClick={() => openLeadModal(notification)}
            className="mt-2 px-6 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-md active:scale-95"
          >
            View Details
          </button>
        </div>
      );
    }

    // Service request
    if (notification.type === 'service_request') {
      return (
        <div className="mb-4 mt-2 p-4 bg-white border border-slate-100 rounded-xl space-y-2 shadow-sm">
          <p className="text-sm">
            <span className="font-bold text-slate-700">Client:</span> 
            <span className="text-slate-600 ml-2">{sanitizeContent(meta.clientName || 'N/A')}</span>
          </p>
          <p className="text-sm">
            <span className="font-bold text-slate-700">Company:</span> 
            <span className="text-slate-600 ml-2">{sanitizeContent(meta.company || 'N/A')}</span>
          </p>
          <p className="text-sm">
            <span className="font-bold text-slate-700">Amount:</span> 
            <span className="text-slate-600 ml-2">
              {meta.totalAmount && meta.totalAmount > 0 
                ? `${meta.totalAmount} ${meta.currency?.toUpperCase() || 'USD'}` 
                : 'Custom Quote'}
            </span>
          </p>
        </div>
      );
    }

    // Assignment or cancelled
    if (notification.type === 'assignment' || (notification.type === 'cancelled' && meta?.snapshot)) {
      if (!displayJob || Object.keys(displayJob).length === 0) return null;
      
      return (
        <div className="mb-4 mt-2 p-4 bg-white border border-slate-100 rounded-xl space-y-2 shadow-sm">
          <p className="text-sm">
            <span className="font-bold text-slate-700">Project Fee:</span> 
            <span className="text-slate-600 ml-2">${displayJob.projectFee || 'N/A'} USD</span>
          </p>
          <p className="text-sm">
            <span className="font-bold text-slate-700">Project Deadline:</span> 
            <span className="text-slate-600 ml-2">{displayJob.dueAt ? formatDate(displayJob.dueAt) : 'N/A'}</span>
          </p>
          <span className="font-bold text-slate-700 block mb-1">Project Description:</span>
          <p className="text-slate-500 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-50">
            {currentUser?.role === 'worker' 
              ? sanitizeContent((displayJob.description || 'No description provided.').replace('Request Custom Quote - ', ''))
              : sanitizeContent(displayJob.description || 'No description provided.')}
          </p>
        </div>
      );
    }

    return null;
  }, [currentUser, openLeadModal]);

  const renderActionButtons = useCallback((notification) => {
    if (!notification) return null;

    if (notification.type === 'assignment') {
      const stale = isStale(notification);
      
      if (!stale) {
        return (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleAcceptJob(notification)}
              disabled={isProcessingAction}
              className="px-6 py-2 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept
            </button>
            <button 
              onClick={() => {
                setActiveJobForDecline(notification);
                setShowDeclineModal(true);
              }}
              disabled={isProcessingAction}
              className="px-6 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Decline
            </button>
          </div>
        );
      } else {
        let statusText = 'Handled';
        let statusClass = 'bg-slate-100 text-slate-500 border-slate-200';
        
        if (notification.actionStatus === 'accepted') {
          statusText = 'Accepted';
          statusClass = 'bg-green-50 text-green-600 border-green-100';
        } else if (notification.actionStatus === 'declined') {
          statusText = 'Declined';
          statusClass = 'bg-red-50 text-red-600 border-red-100';
        } else if (notification.actionStatus === 'cancelled' || notification.type === 'cancelled') {
          statusText = 'Cancelled';
          statusClass = 'bg-slate-100 text-slate-500 border-slate-200';
        }
        
        return (
          <div className="flex items-center gap-2">
            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusClass}`}>
              {statusText}
            </div>
          </div>
        );
      }
    }

    if (notification.type === 'service_request') {
      const meta = parseMeta(notification.metadata);
      const isCustomQuote = !meta.totalAmount || meta.totalAmount === 0;
      
      return (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.location.href = '/hub/notice-board'}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-95"
          >
            View in Notice Board
          </button>
          {isCustomQuote && (
            <button 
              onClick={() => window.location.href = `/hub/quotes?editJobId=${notification.jobId}`}
              className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md active:scale-95"
            >
              View in Custom Quote
            </button>
          )}
        </div>
      );
    }

    return null;
  }, [isStale, handleAcceptJob, isProcessingAction]);

  // ===== MODALS =====
  const DeclineModal = useCallback(() => {
    if (!showDeclineModal) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
          onClick={() => {
            if (!isProcessingAction) {
              setShowDeclineModal(false);
              setDeclineReason('');
            }
          }} 
        />
        <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 overflow-hidden border border-white/20">
          <div className="relative h-32 bg-red-600 flex items-center justify-center">
            <div className="absolute top-6 right-6">
              <button 
                onClick={() => {
                  if (!isProcessingAction) {
                    setShowDeclineModal(false);
                    setDeclineReason('');
                  }
                }}
                disabled={isProcessingAction}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all disabled:opacity-50"
                aria-label="Close decline modal"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center text-white shadow-xl">
              <FaHistory size={32} />
            </div>
          </div>

          <div className="p-10 pt-8 text-center">
            <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Decline Assignment</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">
              We're sorry to see you go! Please let us know why you're declining this task so we can improve future assignments.
            </p>
            
            <div className="space-y-6 text-left">
              <div className="group">
                <label htmlFor="declineReason" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1 group-focus-within:text-red-500 transition-colors">
                  Reason for Decline
                </label>
                <textarea
                  id="declineReason"
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="e.g., Timeline is too tight for my current schedule..."
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all resize-none h-40 font-medium text-slate-700 placeholder:text-slate-300 shadow-inner"
                  disabled={isProcessingAction}
                  aria-label="Reason for declining the assignment"
                />
              </div>
              
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => {
                    if (!isProcessingAction) {
                      setShowDeclineModal(false);
                      setDeclineReason('');
                    }
                  }}
                  disabled={isProcessingAction}
                  className="flex-1 px-6 py-5 bg-slate-100 text-slate-600 rounded-[1.5rem] text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button 
                  disabled={!declineReason.trim() || isProcessingAction}
                  onClick={handleDeclineJob}
                  className="flex-[1.5] px-6 py-5 bg-red-600 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/25 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  {isProcessingAction ? 'Processing...' : 'Confirm Decline'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [showDeclineModal, declineReason, isProcessingAction, handleDeclineJob]);

  const LeadModal = useCallback(() => {
    if (!showLeadModal) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
          onClick={() => {
            if (!loadingLead) {
              setShowLeadModal(false);
              setActiveLead(null);
            }
          }} 
        />
        <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 overflow-hidden border border-white/20 max-h-[90vh] flex flex-col">
          <div className="relative h-32 bg-amber-600 flex items-center justify-center flex-shrink-0">
            <div className="absolute top-6 right-6">
              <button 
                onClick={() => {
                  if (!loadingLead) {
                    setShowLeadModal(false);
                    setActiveLead(null);
                  }
                }}
                disabled={loadingLead}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all disabled:opacity-50"
                aria-label="Close lead modal"
              >
                <FaTimes size={18} />
              </button>
            </div>
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center text-white shadow-xl">
              <FaFileAlt size={32} />
            </div>
          </div>

          <div className="p-8 overflow-y-auto flex-1">
            {loadingLead ? (
              <div className="py-20 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-4" role="status" aria-label="Loading" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading lead details...</p>
              </div>
            ) : activeLead ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Client Name</label>
                    <p className="text-lg font-bold text-slate-800 mt-1">{sanitizeContent(activeLead.clientName || 'N/A')}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Client Email</label>
                    <p className="text-lg font-bold text-slate-800 mt-1">{sanitizeContent(activeLead.clientEmail || 'N/A')}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Company</label>
                    <p className="text-lg font-bold text-slate-800 mt-1">{sanitizeContent(activeLead.company || 'N/A')}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Website URL</label>
                    <p className="text-lg font-bold text-slate-800 mt-1">
                      {activeLead.websiteUrl && activeLead.websiteUrl !== 'N/A' ? (
                        <a 
                          href={activeLead.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-amber-600 hover:underline"
                        >
                          {sanitizeContent(activeLead.websiteUrl)}
                        </a>
                      ) : 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Business Description</label>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {sanitizeContent(activeLead.businessDescription || 'No description provided.')}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</label>
                    <p className="text-lg font-bold text-slate-800 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        activeLead.status === 'active' ? 'bg-green-100 text-green-700' :
                        activeLead.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {activeLead.status || 'N/A'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Created</label>
                    <p className="text-lg font-bold text-slate-800 mt-1">{formatDate(activeLead.createdAt)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No lead data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [showLeadModal, loadingLead, activeLead]);

  // ===== MAIN RENDER =====
  return (
    <AdminLayout pageTitle="Notifications">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl" aria-hidden="true">
              <FaBell size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Notification Center</h2>
              <p className="text-xs text-slate-500 font-medium">Manage your workflow alerts and updates</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={markAllRead}
              disabled={isProcessingAction || unreadCount === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Mark all notifications as read"
            >
              <FaCheckDouble size={14} aria-hidden="true" />
              <span>Mark All Read</span>
            </button>
            <button 
              onClick={clearRead}
              disabled={isProcessingAction}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Clear read notifications"
            >
              <FaTrash size={14} aria-hidden="true" />
              <span>Clear Read</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-2 rounded-2xl border border-slate-100 flex items-center space-x-2 shadow-sm" role="tablist">
          <button 
            onClick={() => setFilter('all')}
            role="tab"
            aria-selected={filter === 'all'}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === 'all' 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <FaInbox size={14} aria-hidden="true" />
            <span>All Alerts</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              filter === 'all' ? 'bg-slate-700' : 'bg-slate-100'
            }`}>
              {notifications.length}
            </span>
          </button>
          <button 
            onClick={() => setFilter('unread')}
            role="tab"
            aria-selected={filter === 'unread'}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === 'unread' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <FaFilter size={14} aria-hidden="true" />
            <span>Unread Only</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
              filter === 'unread' ? 'bg-blue-500' : 'bg-slate-100'
            }`}>
              {unreadCount}
            </span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" role="status" aria-label="Loading" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <>
              {currentNotifications.map(notification => {
                const config = getNotificationConfig(notification.type);
                const Icon = config.icon;
                const isUnread = !notification.isRead;

                return (
                  <div 
                    key={notification.id}
                    className={`group bg-white p-5 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                      isUnread ? 'border-blue-200 bg-blue-50/20 shadow-sm' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl ${config.bgColor} ${config.textColor}`} aria-hidden="true">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                          {renderNotificationBadge(notification.type)}
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <FaClock size={10} aria-hidden="true" />
                            {formatDate(notification.createdAt)}
                          </div>
                        </div>
                        
                        <h3 className={`text-sm md:text-base font-bold mb-1 ${
                          isUnread ? 'text-slate-900' : 'text-slate-600'
                        }`}>
                          {renderMessage(notification, currentUser?.role === 'worker')}
                        </h3>

                        {renderNotificationDetails(notification)}

                        <div className="flex items-center gap-3 flex-wrap">
                          {isUnread && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              disabled={isProcessingAction}
                              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 disabled:opacity-50"
                              aria-label="Mark notification as read"
                            >
                              <FaCheckDouble size={10} aria-hidden="true" />
                              Mark as read
                            </button>
                          )}
                          {renderActionButtons(notification)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-6" role="navigation" aria-label="Pagination">
                  <button
                    disabled={currentPage === 1 || isProcessingAction}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        disabled={isProcessingAction}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                          currentPage === i + 1 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
                        } disabled:opacity-50`}
                        aria-label={`Go to page ${i + 1}`}
                        aria-current={currentPage === i + 1 ? 'page' : undefined}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={currentPage === totalPages || isProcessingAction}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white py-20 rounded-3xl border border-slate-100 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-200 mb-6" aria-hidden="true">
                <FaInbox size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">All Clear!</h3>
              <p className="text-slate-500 max-w-xs mx-auto text-sm">
                You're all caught up. No new notifications to show right now.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <DeclineModal />
      <LeadModal />
    </AdminLayout>
  );
};

export default Notifications;