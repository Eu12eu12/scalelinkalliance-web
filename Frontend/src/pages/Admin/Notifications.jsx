import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { FaBell, FaTrash, FaCheckDouble, FaInbox, FaFilter, FaClock, FaCheckCircle, FaFileAlt, FaHistory, FaTimes, FaComments, FaCloudUploadAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Helper to safely parse metadata (handles MySQL JSON double-serialization)
const parseMeta = (metadata) => {
  if (!metadata) return {};
  if (typeof metadata === 'string') {
    try { return JSON.parse(metadata); } catch { return {}; }
  }
  return metadata;
};

// Helper to render notification messages (handles client message bold/truncation)
const renderMessage = (notification, isWorker) => {
  const rawMsg = notification.message || `Job Update: ${notification.type.replace('_', ' ')}`;
  const message = isWorker 
    ? rawMsg.replace(/Request Custom Quote - /g, '') 
    : rawMsg;

  if (notification.type === 'comment' && message.startsWith('[Client Message]')) {
    const colonIndex = message.indexOf(':', '[Client Message]'.length);
    if (colonIndex !== -1) {
      const prefix = message.slice(0, colonIndex + 1); // "[Client Message] [Client Name]:"
      let content = message.slice(colonIndex + 1);
      
      const leadingSpaces = content.match(/^\s*/)[0];
      content = content.trim();

      let displayContent = content;
      if (content.length > 75) {
        displayContent = content.slice(0, 75) + '...';
      }

      return (
        <span>
          {prefix}
          {leadingSpaces}
          <span className="font-normal">{displayContent}</span>
        </span>
      );
    }
  }

  return message;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread'
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [activeJobForDecline, setActiveJobForDecline] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const itemsPerPage = 5;
  const token = localStorage.getItem('cms_token');

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/cms/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setNotifications(data);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/cms/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setCurrentUser(data.user);
      } catch (err) { console.error('Failed to fetch session', err); }
    };
    if (token) fetchSession();

    // Sync with global notification updates (e.g. from AdminLayout bell dropdown)
    const handleUpdate = () => fetchNotifications();
    window.addEventListener('notificationsUpdated', handleUpdate);
    return () => window.removeEventListener('notificationsUpdated', handleUpdate);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const isStale = (notification) => {
    if (notification.type !== 'assignment') return false;
    
    // Primary check: use actionStatus from DB
    if (notification.actionStatus && notification.actionStatus !== 'pending') return true;
    
    if (!notification.job) return true; // If job is gone, it's stale
    
    // Fallback: If job is no longer 'assigned' (e.g. accepted, completed)
    if (notification.job.status !== 'assigned') return true;
    
    // Fallback: If there is a NEWER assignment notification for the same job
    const newer = notifications.find(n => 
      n.type === 'assignment' && 
      n.jobId === notification.jobId && 
      new Date(n.createdAt) > new Date(notification.createdAt)
    );
    if (newer) return true;
    
    return false;
  };

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const currentNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/cms/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      }
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllRead = async () => {
    try {
      const res = await fetch('/api/cms/notifications/read-all', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        toast.success('All marked as read');
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      }
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const clearRead = async () => {
    if (!window.confirm('Clear all read notifications?')) return;
    try {
      const res = await fetch('/api/cms/notifications/clear', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(notifications.filter(n => !n.isRead));
        toast.success('Cleared read notifications');
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      }
    } catch (err) {
      toast.error('Failed to clear notifications');
    }
  };

  return (
    <AdminLayout pageTitle="Notifications">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FaBell size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Notification Center</h2>
              <p className="text-xs text-slate-500 font-medium">Manage your workflow alerts and updates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={markAllRead}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
              <FaCheckDouble size={14} />
              <span>Mark All Read</span>
            </button>
            <button 
              onClick={clearRead}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-all active:scale-95"
            >
              <FaTrash size={14} />
              <span>Clear Read</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-2 rounded-2xl border border-slate-100 flex items-center space-x-2 shadow-sm">
          <button 
            onClick={() => setFilter('all')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <FaInbox size={14} />
            <span>All Alerts</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'all' ? 'bg-slate-700' : 'bg-slate-100'}`}>
              {notifications.length}
            </span>
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'unread' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <FaFilter size={14} />
            <span>Unread Only</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === 'unread' ? 'bg-blue-500' : 'bg-slate-100'}`}>
              {notifications.filter(n => !n.isRead).length}
            </span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <>
              {currentNotifications.map(notification => (
              <div 
                key={notification.id}
                className={`group bg-white p-5 rounded-2xl border transition-all duration-200 hover:shadow-md ${!notification.isRead ? 'border-blue-200 bg-blue-50/20 shadow-sm' : 'border-slate-100'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${
                    notification.type === 'assignment' ? 'bg-blue-100 text-blue-600' :
                    notification.type === 'acceptance' ? 'bg-green-100 text-green-600' :
                    notification.type === 'check_out' ? 'bg-orange-100 text-orange-600' :
                    notification.type === 'review' ? 'bg-indigo-100 text-indigo-600' :
                    notification.type === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                    notification.type === 'returned' ? 'bg-red-100 text-red-600' :
                    notification.type === 'cancelled' ? 'bg-rose-100 text-rose-600' :
                    notification.type === 'service_request' ? 'bg-blue-100 text-blue-600' :
                    notification.type === 'comment' ? 'bg-blue-100 text-blue-600' :
                    notification.type === 'file' ? 'bg-sky-100 text-sky-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {notification.type === 'assignment' && <FaBell size={20} />}
                    {notification.type === 'acceptance' && <FaCheckCircle size={20} />}
                    {notification.type === 'check_out' && <FaFileAlt size={20} />}
                    {notification.type === 'review' && <FaClock size={20} />}
                    {notification.type === 'completed' && <FaCheckDouble size={20} />}
                    {notification.type === 'returned' && <FaHistory size={20} />}
                    {notification.type === 'cancelled' && <FaTrash size={20} />}
                    {notification.type === 'service_request' && <FaFileAlt size={20} />}
                    {notification.type === 'comment' && <FaComments size={20} />}
                    {notification.type === 'file' && <FaCloudUploadAlt size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        notification.type === 'assignment' ? 'bg-blue-100 text-blue-700' :
                        notification.type === 'acceptance' ? 'bg-green-100 text-green-700' :
                        notification.type === 'check_out' ? 'bg-orange-100 text-orange-700' :
                        notification.type === 'review' ? 'bg-indigo-100 text-indigo-700' :
                        notification.type === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        notification.type === 'returned' ? 'bg-red-100 text-red-700' :
                        notification.type === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                        notification.type === 'service_request' ? 'bg-blue-600 text-white shadow-sm' :
                        notification.type === 'comment' ? 'bg-blue-50 text-blue-700' :
                        notification.type === 'file' ? 'bg-sky-50 text-sky-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {notification.type === 'returned' ? 'DECLINED' : 
                         notification.type === 'service_request' ? 'NEW REQUEST' :
                         notification.type.replace('_', ' ')}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <FaClock size={10} />
                        {new Date(notification.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <h3 className={`text-sm md:text-base font-bold mb-1 ${!notification.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                      {renderMessage(notification, currentUser?.role === 'worker')}
                    </h3>

                    {notification.type === 'returned' && parseMeta(notification.metadata) && Object.keys(parseMeta(notification.metadata)).length > 0 && (
                      <div className="mb-4 mt-2 p-4 bg-red-50/30 border border-red-100 rounded-xl space-y-2 shadow-sm">
                        <p className="text-sm">
                          <span className="font-bold text-slate-700">Worker:</span> 
                          <span className="text-slate-600 ml-2">{parseMeta(notification.metadata).workerEmail || 'Unknown'}</span>
                        </p>
                        <div className="text-sm">
                          <span className="font-bold text-slate-700 block mb-1">Reason:</span>
                          <p className="text-slate-500 leading-relaxed bg-white/50 p-3 rounded-lg border border-red-50">
                            {parseMeta(notification.metadata).reason || 'No reason provided.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Client File Upload Detail Block */}
                    {notification.type === 'file' && (() => {
                      const meta = parseMeta(notification.metadata);
                      if (!meta || (!meta.clientName && !meta.clientEmail && !meta.fileNames)) return null;
                      return (
                        <div className="mb-4 mt-2 p-4 bg-sky-50/30 border border-sky-100 rounded-xl space-y-2 shadow-sm">
                          <p className="text-sm">
                            <span className="font-bold text-slate-700">Client Name:</span>
                            <span className="text-slate-600 ml-2">{meta.clientName || 'N/A'}</span>
                          </p>
                          <p className="text-sm">
                            <span className="font-bold text-slate-700">Client Email:</span>
                            <span className="text-slate-600 ml-2">{meta.clientEmail || 'N/A'}</span>
                          </p>
                          {meta.fileNames && meta.fileNames.length > 0 && (
                            <div className="text-sm">
                              <span className="font-bold text-slate-700">Files:</span>
                              <span className="text-slate-600 ml-2">
                                {(() => {
                                  const names = Array.isArray(meta.fileNames) ? meta.fileNames : 
                                    (typeof meta.fileNames === 'string' ? JSON.parse(meta.fileNames) : []);
                                  return names.join(', ');
                                })()}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Assignment Accepted Detail Block */}
                    {notification.type === 'acceptance' && (() => {
                      const meta = parseMeta(notification.metadata);
                      if (!meta || (!meta.workerName && !meta.workerEmail)) return null;
                      return (
                        <div className="mb-4 mt-2 p-4 bg-green-50/30 border border-green-100 rounded-xl space-y-2 shadow-sm">
                          <p className="text-sm">
                            <span className="font-bold text-slate-700">Worker Name:</span>
                            <span className="text-slate-600 ml-2">{meta.workerName || 'N/A'}</span>
                          </p>
                          <p className="text-sm">
                            <span className="font-bold text-slate-700">Worker Email:</span>
                            <span className="text-slate-600 ml-2">{meta.workerEmail || notification.fromUser || 'N/A'}</span>
                          </p>
                        </div>
                      );
                    })()}

                    {/* Project Satisfied Detail Block */}
                    {notification.type === 'completed' && notification.fromUser === 'client' && (() => {
                      const meta = parseMeta(notification.metadata);
                      if (!meta || (!meta.clientName && !meta.clientEmail && !meta.company)) return null;
                      return (
                        <div className="mb-4 mt-2 p-4 bg-emerald-50/30 border border-emerald-100 rounded-xl space-y-2 shadow-sm">
                          <p className="text-sm">
                            <span className="font-bold text-slate-700">Client Name:</span>
                            <span className="text-slate-600 ml-2">{meta.clientName || 'N/A'}</span>
                          </p>
                          <p className="text-sm">
                            <span className="font-bold text-slate-700">Client Email:</span>
                            <span className="text-slate-600 ml-2">{meta.clientEmail || 'N/A'}</span>
                          </p>
                          <p className="text-sm">
                            <span className="font-bold text-slate-700">Company:</span>
                            <span className="text-slate-600 ml-2">{meta.company || 'N/A'}</span>
                          </p>
                        </div>
                      );
                    })()}

                    {/* Project Info Block (Assignment, Cancelled, or Service Request) */}
                    {(notification.type === 'assignment' || notification.type === 'service_request' || (notification.type === 'cancelled' && parseMeta(notification.metadata)?.snapshot)) && (
                      <div className="mb-4 mt-2 p-4 bg-white border border-slate-100 rounded-xl space-y-2 shadow-sm">
                        {(() => {
                          const safeMeta = parseMeta(notification.metadata);
                          const displayJob = safeMeta?.snapshot || notification.job;
                          // For service_request, metadata might contain some info
                          const meta = safeMeta;
                          
                          if (notification.type === 'service_request') {
                            return (
                              <>
                                <p className="text-sm">
                                  <span className="font-bold text-slate-700">Client:</span> 
                                  <span className="text-slate-600 ml-2">{meta.clientName || 'N/A'}</span>
                                </p>
                                <p className="text-sm">
                                  <span className="font-bold text-slate-700">Company:</span> 
                                  <span className="text-slate-600 ml-2">{meta.company || 'N/A'}</span>
                                </p>
                                <p className="text-sm">
                                  <span className="font-bold text-slate-700">Amount:</span> 
                                  <span className="text-slate-600 ml-2">{meta.totalAmount > 0 ? `${meta.totalAmount} ${meta.currency?.toUpperCase()}` : 'Custom Quote'}</span>
                                </p>
                              </>
                            );
                          }

                          if (!displayJob) return null;
                          return (
                            <>
                              <p className="text-sm">
                                <span className="font-bold text-slate-700">Project Fee:</span> 
                                <span className="text-slate-600 ml-2">${displayJob.projectFee || 'N/A'} USD</span>
                              </p>
                              <p className="text-sm">
                                <span className="font-bold text-slate-700">Project Deadline:</span> 
                                <span className="text-slate-600 ml-2">{displayJob.dueAt ? new Date(displayJob.dueAt).toLocaleString() : 'N/A'}</span>
                              </p>
                                <span className="font-bold text-slate-700 block mb-1">Project Description:</span>
                                <p className="text-slate-500 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-50">
                                  {currentUser?.role === 'worker' 
                                    ? (displayJob.description || 'No description provided.').replace('Request Custom Quote - ', '')
                                    : (displayJob.description || 'No description provided.')}
                                </p>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      {!notification.isRead && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                        >
                          <FaCheckDouble size={10} />
                          Mark as read
                        </button>
                      )}
                      {notification.type === 'assignment' && (
                        <div className="flex items-center gap-2">
                          {!isStale(notification) ? (
                            <>
                              <button 
                                onClick={async () => {
                                  try {
                                    const res = await fetch(`/api/cms/admin/notice-board/${notification.jobId}/accept`, {
                                      method: 'PATCH',
                                      headers: { 'Authorization': `Bearer ${token}` }
                                    });
                                    if (res.ok) {
                                      toast.success('Job accepted! It now appears on your board.');
                                      markAsRead(notification.id);
                                    } else {
                                      const err = await res.json();
                                      toast.error(err.error || 'Failed to accept job');
                                    }
                                  } catch (e) {
                                    toast.error('Connection error');
                                  }
                                }}
                                className="px-6 py-2 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-md active:scale-95"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveJobForDecline(notification);
                                  setShowDeclineModal(true);
                                }}
                                className="px-6 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95"
                              >
                                Decline
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              {notification.actionStatus === 'accepted' ? (
                                <div className="px-4 py-1.5 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-100">
                                  Accepted
                                </div>
                              ) : notification.actionStatus === 'declined' ? (
                                <div className="px-4 py-1.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100">
                                  Declined
                                </div>
                              ) : notification.actionStatus === 'cancelled' || notification.type === 'cancelled' ? (
                                <div className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                  Cancelled
                                </div>
                              ) : (
                                <div className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200">
                                  Handled
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      {notification.type === 'service_request' && (
                        <button 
                          onClick={() => window.location.href = '/hub/notice-board'}
                          className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-95"
                        >
                          View in Notice Board
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
          ) : (
            <div className="bg-white py-20 rounded-3xl border border-slate-100 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-200 mb-6">
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

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setShowDeclineModal(false)} 
          />
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 overflow-hidden border border-white/20">
            {/* Modal Header */}
            <div className="relative h-32 bg-red-600 flex items-center justify-center">
              <div className="absolute top-6 right-6">
                <button 
                  onClick={() => setShowDeclineModal(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
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
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1 group-focus-within:text-red-500 transition-colors">
                    Reason for Decline
                  </label>
                  <textarea
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="e.g., Timeline is too tight for my current schedule..."
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-sm focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all resize-none h-40 font-medium text-slate-700 placeholder:text-slate-300 shadow-inner"
                  />
                </div>
                
                <div className="flex gap-4 pt-2">
                  <button 
                    onClick={() => setShowDeclineModal(false)}
                    className="flex-1 px-6 py-5 bg-slate-100 text-slate-600 rounded-[1.5rem] text-sm font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Back
                  </button>
                  <button 
                    disabled={!declineReason.trim()}
                    onClick={async () => {
                      if (!declineReason.trim()) return toast.warning('Please provide a reason');
                      try {
                        const res = await fetch(`/api/cms/admin/notice-board/${activeJobForDecline.jobId}/decline`, {
                          method: 'PATCH',
                          headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ reason: declineReason })
                        });
                        if (res.ok) {
                          toast.info('Assignment declined.');
                          markAsRead(activeJobForDecline.id);
                          setShowDeclineModal(false);
                          setDeclineReason('');
                          fetchNotifications();
                        } else {
                          const err = await res.json();
                          toast.error(err.error || 'Failed to decline');
                        }
                      } catch (e) {
                        toast.error('Connection error');
                      }
                    }}
                    className="flex-[1.5] px-6 py-5 bg-red-600 text-white rounded-[1.5rem] text-sm font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/25 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                  >
                    Confirm Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Notifications;
