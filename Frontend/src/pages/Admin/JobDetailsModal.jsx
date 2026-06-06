import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaDownload, FaTrash, FaPaperPlane, FaFileUpload, 
  FaFileAlt, FaCommentDots, FaUserCircle, FaClock, FaHistory,
  FaUser, FaEnvelope, FaPhone, FaMoneyBillWave, FaLayerGroup, FaCheckCircle, FaCheck,
  FaUserPlus, FaUserMinus, FaExchangeAlt, FaSearch, FaBriefcase,
  FaLink, FaCopy, FaEye, FaGlobe
} from 'react-icons/fa';

const JobDetailsModal = ({ job, currentUser, onClose, onRefresh, showToast }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [comments, setComments] = useState([]);
  const [files, setFiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [workerSearch, setWorkerSearch] = useState('');
  const [workerSuggestions, setWorkerSuggestions] = useState([]);
  const [isSearchingWorker, setIsSearchingWorker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [commentVisibility, setCommentVisibility] = useState('internal');
  const [uploadVisibility, setUploadVisibility] = useState('internal');

  const token = localStorage.getItem('cms_token');

  const hasCustomQuoteService = job?.category && job.category.includes('Request Custom Quote');
  const hasQuoteAmount = job?.customQuoteAmount && job.customQuoteAmount > 0;
  const isCustomQuote = hasCustomQuoteService || hasQuoteAmount;
  const isPaid = !isCustomQuote || ['deposit_paid', 'in_progress', 'completed', 'approved'].includes(job?.quoteStatus);

  const handleJobAction = async (action, extraData = {}) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cms/admin/notice-board/${job.id}/${action}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(extraData)
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || `Action Successful!`, 'success');
        onRefresh(); // Refresh parent notice board
        if (action !== 'assign' && action !== 'unassign') {
          onClose(); // Close modal after workflow action
        } else {
          fetchData(); // Just refresh data for assignment actions
        }
      } else {
        showToast(data.error || `Failed to ${action} job`, 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWorkerSearch = async (query) => {
    setWorkerSearch(query);
    setAssignmentForm(prev => ({ ...prev, assignedTo: query }));
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
      if (res.ok) {
        const data = await res.json();
        setWorkerSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error('Worker search failed', err);
    } finally {
      setIsSearchingWorker(false);
    }
  };

  const assignWorker = (email) => {
    if (email === job.assignedTo) {
      showToast('This worker is already assigned to this job.', 'info');
      setShowSuggestions(false);
      setWorkerSearch('');
      return;
    }
    handleJobAction('assign', { workerEmail: email });
    setShowSuggestions(false);
    setWorkerSearch('');
  };

  const removeWorker = () => {
    if (window.confirm('Are you sure you want to remove the current worker from this job?')) {
      handleJobAction('unassign');
    }
  };

  const [assignmentForm, setAssignmentForm] = useState({
    assignedTo: '',
    dueAt: '',
    notes: '',
    status: '',
    projectFee: ''
  });

  const handleUpdateAssignment = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/cms/admin/notice-board/${job.id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignmentForm)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Assignment updated successfully!', 'success');
        onRefresh();
        fetchData();
      } else {
        showToast(data.error || 'Failed to update assignment', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [commRes, fileRes, activitiesRes] = await Promise.all([
        fetch(`/api/cms/admin/notice-board/${job.id}/comments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/cms/admin/notice-board/${job.id}/files`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/cms/admin/notice-board/${job.id}/activities`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      if (commRes.ok) setComments(await commRes.json());
      if (fileRes.ok) setFiles(await fileRes.json());
      if (activitiesRes.ok) setActivities(await activitiesRes.json());
    } catch (err) {
      console.error('Failed to fetch job data', err);
    }
  };

  useEffect(() => {
    if (job) {
      fetchData();
      setAssignmentForm({
        assignedTo: job.assignedTo || '',
        dueAt: job.dueAt ? String(job.dueAt).slice(0, 16) : '',
        notes: job.notes || '',
        status: job.status || 'new',
        projectFee: job.projectFee || '',
        priority: job.priority || 'medium'
      });
      setWorkerSearch(job.assignedTo || '');
    }
  }, [job]);

  // Auto-set status based on worker assignment
  useEffect(() => {
    if (job && (job.status === 'new' || job.status === 'assigned')) {
      setAssignmentForm(prev => ({
        ...prev,
        status: prev.assignedTo ? 'assigned' : 'new'
      }));
    }
  }, [assignmentForm.assignedTo, job]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/admin/notice-board/${job.id}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ comment: newComment, visibility: commentVisibility })
      });
      if (res.ok) {
        setNewComment('');
        setCommentVisibility('internal');
        fetchData();
      }
    } catch (err) {
      showToast('Error posting comment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file));
    formData.append('visibility', uploadVisibility);

    try {
      const res = await fetch(`/api/cms/admin/notice-board/${job.id}/files`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        showToast('Files uploaded successfully', 'success');
        setUploadVisibility('internal');
        fetchData();
      } else {
        const err = await res.json();
        showToast(err.error || 'Upload failed', 'error');
      }
    } catch (err) {
      showToast('Network error during upload', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      const res = await fetch(`/api/cms/admin/notice-board/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('File removed', 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Error deleting file', 'error');
    }
  };

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnFeedback, setReturnFeedback] = useState('');

  const hasAssignmentChanged = job && (
    (assignmentForm.assignedTo || '') !== (job.assignedTo || '') ||
    (assignmentForm.dueAt || '') !== (job.dueAt ? String(job.dueAt).slice(0, 16) : '') ||
    (assignmentForm.notes || '') !== (job.notes || '') ||
    (assignmentForm.priority || 'medium') !== (job.priority || 'medium') ||
    String(assignmentForm.projectFee || '') !== String(job.projectFee || '')
  );

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <FaFileAlt size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 leading-tight">
                {currentUser?.role === 'worker' ? job.category.replace(/Request Custom Quote - /g, '') : job.title.replace(/Request Custom Quote - /g, '')}
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                #{job.id} • {job.client} {currentUser?.role !== 'worker' && `• ${job.category.replace(/Request Custom Quote - /g, '')}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-8 border-b border-slate-100 bg-slate-50/50 overflow-x-auto no-scrollbar gap-1 md:gap-2 h-[52px] flex-shrink-0">
          {[
            { id: 'details', label: 'Overview', icon: <FaFileAlt /> },
            { id: 'files', label: `Files (${files.filter(f => currentUser?.role === 'super_admin' || f.visibility !== 'client').length})`, icon: <FaFileUpload /> },
            { id: 'comments', label: `Comments (${comments.filter(c => currentUser?.role === 'super_admin' || c.visibility !== 'client').length})`, icon: <FaCommentDots /> },
            { id: 'activity', label: 'Activity Log', icon: <FaHistory /> },
            currentUser?.role === 'super_admin' && { id: 'client_portal', label: 'Client Portal', icon: <FaGlobe /> },
            currentUser?.role === 'super_admin' && isPaid && { id: 'assignment', label: 'Assignment', icon: <FaUserPlus /> }
          ].filter(Boolean).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 md:px-5 h-full text-xs md:text-sm font-bold transition-all border-b-2 flex-shrink-0 ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600 bg-white' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-white relative">
          
          {activeTab === 'details' && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold text-slate-700 capitalize">{job.status.replace('_', ' ')}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Priority</p>
                  <p className="text-sm font-bold text-slate-700 capitalize">{job.priority}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Project Fee</p>
                  <p className="text-sm font-bold text-green-600">
                    {job.projectFee ? `$${job.projectFee} USD` : 'N/A'}
                  </p>
                </div>
                {currentUser?.role !== 'worker' && (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Worker</p>
                    <p className="text-sm font-bold text-slate-700 truncate" title={job.assignedTo}>{job.assignedTo || 'Pending'}</p>
                    {currentUser?.role === 'super_admin' && job.assignedTo && job.status !== 'completed' && (
                      <button
                        onClick={removeWorker}
                        disabled={loading}
                        className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <FaUserMinus size={10} />
                        Remove Worker
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className={`grid grid-cols-1 ${currentUser?.role === 'super_admin' ? 'md:grid-cols-2' : ''} gap-8`}>
                {/* Client Contact Info - Restricted to Super Admin */}
                {currentUser?.role === 'super_admin' && (
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <FaUser className="text-blue-500" /> Client Contact Information
                    </h4>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Full Name</span>
                        <span className="text-sm font-bold text-slate-700">
                          {job.clientFirstName} {job.clientLastName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Email Address</span>
                        <a href={`mailto:${job.clientEmail}`} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                          <FaEnvelope size={10} /> {job.clientEmail}
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Phone Number</span>
                        <a href={`tel:${job.clientPhone}`} className="text-sm font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1">
                          <FaPhone size={10} /> {job.clientPhone}
                        </a>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                        <span className="text-xs text-slate-500">Company</span>
                        <span className="text-sm font-bold text-slate-700">{job.client}</span>
                      </div>
                      {job.clientTimeline && (
                        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                          <span className="text-xs text-slate-500">Timeline</span>
                          <span className="text-sm font-bold text-blue-600">{job.clientTimeline}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Selected Services */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FaLayerGroup className="text-indigo-500" /> Selected Services
                  </h4>
                  <div className="space-y-2">
                    {(() => {
                      const services = typeof job.services === 'string' ? (() => { try { return JSON.parse(job.services); } catch { return {}; } })() : (job.services || {});
                      return Object.keys(services).length > 0 ? (
                      Object.entries(services).map(([service, plan]) => (
                        <div key={service} className="flex items-center justify-between p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                          <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-indigo-500" size={12} />
                            <span className="text-sm font-bold text-slate-700">{service.replace(/Request Custom Quote - /g, '')}</span>
                          </div>
                          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
                            {plan} Plan
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                        <p className="text-xs text-slate-500 italic">No specific services mapped.</p>
                      </div>
                    ) })()}
                  </div>
                </div>
              </div>
              {job.otherServiceDescription && (
                <div className="animate-fade-in">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Custom Service Details</h4>
                  <div className="bg-indigo-50/30 rounded-2xl p-6 border border-indigo-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap italic">
                    {job.otherServiceDescription}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Job Description</h4>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              {job.notes && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Internal Notes</h4>
                  <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 text-amber-900 text-sm italic whitespace-pre-wrap">
                    {job.notes}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Document Storage</h4>
                <div className="flex items-center space-x-3">
                  {currentUser?.role === 'super_admin' && (
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Target:</span>
                      <select 
                        value={uploadVisibility}
                        onChange={e => setUploadVisibility(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-600 focus:outline-none"
                      >
                        <option value="internal">Internal Only</option>
                        <option value="client">Client Only</option>
                        <option value="both">Both (All)</option>
                      </select>
                    </div>
                  )}
                  <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-lg shadow-blue-100">
                    <FaFileUpload />
                    <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
                    <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              {files.filter(f => currentUser?.role === 'super_admin' || f.visibility !== 'client').length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                  <p className="text-slate-400 text-sm">No files attached to this job yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {files.filter(f => currentUser?.role === 'super_admin' || f.visibility !== 'client').map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-500 shadow-sm">
                          <FaFileAlt />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-700 truncate">{file.fileName}</p>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">{(file.fileSize / 1024 / 1024).toFixed(2)} MB • {file.uploadedBy.split('@')[0]}</p>
                            {currentUser?.role === 'super_admin' && (
                              <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                file.visibility === 'client' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                file.visibility === 'both' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                'bg-slate-50 text-slate-500 border border-slate-100'
                              }`}>
                                {file.visibility}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <a 
                          href={file.filePath} 
                          download 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Download"
                        >
                          <FaDownload size={14} />
                        </a>
                        <button 
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="flex flex-col h-full animate-fade-in-up">
              <div className="flex-1 space-y-6 mb-8">
                {comments.filter(c => currentUser?.role === 'super_admin' || c.visibility !== 'client').length === 0 ? (
                  <div className="py-20 text-center text-slate-400 text-sm italic">
                    Start a conversation on this job...
                  </div>
                ) : (
                  comments.filter(c => currentUser?.role === 'super_admin' || c.visibility !== 'client').map(c => (
                    <div key={c.id} className="flex items-start space-x-4 animate-fade-in">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                        <FaUserCircle size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1 flex-wrap gap-1">
                          <span className="text-sm font-bold text-slate-800">{c.userName}</span>
                          <span className="text-[10px] text-slate-400 font-bold flex items-center">
                            <FaClock className="mr-1" />
                            {new Date(c.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          {currentUser?.role === 'super_admin' && (
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ml-2 ${
                              c.visibility === 'client' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                            }`}>
                              {c.visibility === 'client' ? 'Shared with Client' : 'Internal Only'}
                            </span>
                          )}
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 text-sm text-slate-700 leading-relaxed shadow-sm">
                          {c.comment}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Input */}
              <form onSubmit={handlePostComment} className="relative pt-4 border-t border-slate-100 space-y-3">
                {currentUser?.role === 'super_admin' && (
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mr-2">Post Channel:</span>
                    <button
                      type="button"
                      onClick={() => setCommentVisibility('internal')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        commentVisibility === 'internal' 
                          ? 'bg-slate-800 text-white shadow-md shadow-slate-100' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Worker & Admins (Internal)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommentVisibility('client')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        commentVisibility === 'client' 
                          ? 'bg-orange-600 text-white shadow-md shadow-orange-100' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Client Portal (Public)
                    </button>
                  </div>
                )}
                <div className="relative">
                  <textarea
                    rows={2}
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder={commentVisibility === 'client' ? "Write a message to the client portal..." : "Add an internal note or worker update..."}
                    className="w-full px-6 py-4 pr-16 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm transition-all resize-none shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={loading || !newComment.trim()}
                    className="absolute right-4 bottom-5 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
                  >
                    <FaPaperPlane size={14} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4 animate-fade-in-up">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Audit Trail</h4>
              <div className="relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {activities.map((act, idx) => (
                  <div key={act.id} className="relative pl-10 pb-6 group">
                    <div className="absolute left-2 top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-500 z-10 group-last:border-emerald-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{act.action}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{act.details}</p>
                      <div className="flex items-center space-x-2 mt-1.5">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter bg-blue-50 px-1.5 py-0.5 rounded">
                          {act.userName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(act.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'client_portal' && currentUser?.role === 'super_admin' && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Magic Link Section */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100/50">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
                      <FaLink /> Client Portal Tracking Link
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Share this unique magic link with the client. No login or password is required.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const link = `${window.location.origin}/track-job/${job.clientToken}`;
                      navigator.clipboard.writeText(link);
                      showToast('Portal magic link copied to clipboard!', 'success');
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95"
                  >
                    <FaCopy />
                    <span>Copy Magic Link</span>
                  </button>
                </div>
                <div className="mt-4 bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-700 select-all font-mono break-all">
                  {`${window.location.origin}/track-job/${job.clientToken}`}
                </div>
              </div>

              {/* Status & Satisfaction Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                job.clientSatisfied 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                  : 'bg-orange-50 border-orange-100 text-orange-800'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${job.clientSatisfied ? 'bg-emerald-400' : 'bg-orange-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${job.clientSatisfied ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {job.clientSatisfied ? 'Project Approved & Closed' : 'Portal Active & Awaiting Client Approval'}
                  </span>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-white/80 px-2 py-0.5 rounded-full shadow-sm">
                  {job.clientSatisfied ? 'Satisfied' : 'Pending'}
                </span>
              </div>

              {/* Live Preview Split Pane */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Client Messages Preview */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <FaCommentDots /> Client Portal Chat history
                  </h4>
                  <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                    {comments.filter(c => c.visibility === 'client').length === 0 ? (
                      <div className="py-10 text-center text-xs text-slate-400 italic">
                        No portal messages recorded yet...
                      </div>
                    ) : (
                      comments.filter(c => c.visibility === 'client').map(c => (
                        <div key={c.id} className={`flex items-start space-x-3 text-xs animate-fade-in ${
                          c.fromUserRole === 'client' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                            c.fromUserRole === 'client' ? 'bg-orange-500' : 'bg-indigo-600'
                          }`}>
                            <span className="font-bold uppercase">{c.userName.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <div className={`flex items-center space-x-1.5 mb-1 ${c.fromUserRole === 'client' ? 'justify-end' : ''}`}>
                              <span className="font-extrabold text-slate-700">{c.fromUserRole === 'client' ? 'Client' : 'Agency Support'}</span>
                              <span className="text-[9px] text-slate-400 font-medium">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className={`p-3 rounded-xl border text-slate-700 leading-relaxed ${
                              c.fromUserRole === 'client' 
                                ? 'bg-orange-50/50 border-orange-100 rounded-tr-none' 
                                : 'bg-white border-slate-100 rounded-tl-none'
                            }`}>
                              {c.comment}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Client Shared Files Preview */}
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <FaFileAlt /> Client Portal Files
                  </h4>
                  <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                    {files.filter(f => ['client', 'both'].includes(f.visibility)).length === 0 ? (
                      <div className="py-10 text-center text-xs text-slate-400 italic">
                        No portal files shared yet...
                      </div>
                    ) : (
                      files.filter(f => ['client', 'both'].includes(f.visibility)).map(file => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-indigo-100 transition-all text-xs">
                          <div className="flex items-center space-x-2 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                              <FaFileAlt size={12} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-700 truncate">{file.fileName}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">{file.uploadedByRole === 'client' ? 'Uploaded by Client' : 'Uploaded by Agency'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <a 
                              href={file.filePath} 
                              download 
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"
                            >
                              <FaDownload size={10} />
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assignment' && currentUser?.role === 'super_admin' && isPaid && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><FaBriefcase size={14} /></div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Work Management</h4>
                  </div>
                  {job.status === 'completed' && (
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-bold border border-emerald-100 flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                      <FaCheckCircle size={10} /> Project Completed
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Row 1: Assigned Worker & Status */}
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Assigned Worker</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input 
                        value={workerSearch} 
                        onChange={e => {
                          if (job.status === 'completed') return;
                          setWorkerSearch(e.target.value);
                          handleWorkerSearch(e.target.value);
                        }}
                        onFocus={() => job.status !== 'completed' && workerSearch.length >= 2 && setShowSuggestions(true)}
                        readOnly={job.status === 'completed'}
                        className={`w-full pl-11 pr-4 py-3 rounded-2xl border outline-none text-sm transition-all ${
                          job.status === 'completed' 
                            ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-slate-100' 
                            : 'bg-white border-slate-200 focus:ring-2 focus:ring-blue-500'
                        }`} 
                        placeholder={job.status === 'completed' ? "" : "Search workers by email..."} 
                      />
                    </div>
                    {isSearchingWorker && (
                      <div className="absolute right-4 top-[38px]">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                      </div>
                    )}
                    {showSuggestions && workerSuggestions.length > 0 && (
                      <div className="absolute z-[70] left-0 right-0 top-[calc(100%+8px)] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">
                        {workerSuggestions.map(w => (
                          <button
                            key={w.id}
                            type="button"
                            onClick={() => {
                              setWorkerSearch(w.email);
                              setAssignmentForm(prev => ({ ...prev, assignedTo: w.email }));
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-5 py-4 hover:bg-blue-50 text-sm font-semibold text-slate-700 transition-colors border-b border-slate-50 last:border-0 flex items-center justify-between group"
                          >
                            <span>{w.email}</span>
                            <span className="text-[9px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 uppercase tracking-widest">Select</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Status</label>
                    <div className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-500 capitalize">
                      {assignmentForm.status.replace('_', ' ')}
                    </div>
                  </div>

                  {/* Row 2: Received At & Deadline */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Received At *</label>
                    <div className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold text-slate-500">
                      {job.receivedAt ? new Date(job.receivedAt).toLocaleString() : 'Not set'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Deadline *</label>
                    <input 
                      required 
                      type="datetime-local" 
                      value={assignmentForm.dueAt} 
                      onChange={e => {
                        if (job.status === 'completed') return;
                        setAssignmentForm({...assignmentForm, dueAt: e.target.value});
                      }} 
                      readOnly={job.status === 'completed'}
                      className={`w-full px-4 py-3 rounded-2xl border outline-none text-sm ${
                        job.status === 'completed' 
                          ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-slate-100' 
                          : 'bg-white border-slate-200 focus:ring-2 focus:ring-blue-500'
                      }`} 
                    />
                  </div>

                  {/* Row 3: Priority & Project Fee */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Priority</label>
                    <select 
                      value={assignmentForm.priority} 
                      onChange={e => {
                        if (job.status === 'completed') return;
                        setAssignmentForm({...assignmentForm, priority: e.target.value});
                      }} 
                      disabled={job.status === 'completed'}
                      className={`w-full px-4 py-3 rounded-2xl border outline-none text-sm font-bold capitalize transition-all ${
                        job.status === 'completed' 
                          ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-slate-100' 
                          : 'bg-white border-slate-200 focus:ring-2 focus:ring-blue-500 text-slate-700'
                      }`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Project Fee (USD)</label>
                    <div className="relative">
                      <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input 
                        type="number"
                        min="0"
                        value={assignmentForm.projectFee} 
                        onChange={e => {
                          if (job.status === 'completed') return;
                          setAssignmentForm({...assignmentForm, projectFee: e.target.value});
                        }} 
                        readOnly={job.status === 'completed'}
                        className={`w-full pl-11 pr-4 py-3 rounded-2xl border outline-none text-sm transition-all ${
                          job.status === 'completed' 
                            ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-slate-100' 
                            : 'bg-white border-slate-200 focus:ring-2 focus:ring-blue-500'
                        }`} 
                        placeholder="e.g. 150" 
                      />
                    </div>
                  </div>
                </div>

                {/* Internal Notes - Editable */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Internal Notes</label>
                  <textarea 
                    rows={3} 
                    value={assignmentForm.notes} 
                    onChange={e => {
                      if (job.status === 'completed') return;
                      setAssignmentForm({...assignmentForm, notes: e.target.value});
                    }} 
                    readOnly={job.status === 'completed'}
                    className={`w-full px-4 py-4 rounded-2xl border outline-none text-sm resize-none transition-all ${
                      job.status === 'completed' 
                        ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-slate-100' 
                        : 'bg-white border-slate-200 focus:ring-2 focus:ring-blue-500'
                    }`} 
                    placeholder={job.status === 'completed' ? "" : "Add private notes for the team..."} 
                  />
                </div>

                {job.status !== 'completed' && (
                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={handleUpdateAssignment}
                      disabled={loading || !hasAssignmentChanged}
                      className={`flex items-center space-x-2 px-8 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
                        loading || !hasAssignmentChanged
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100'
                      }`}
                    >
                      {loading ? <div className="animate-spin h-4 w-4 border-2 border-slate-400 border-t-transparent rounded-full" /> : <FaCheck size={12} />}
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Bar for Workers */}
          {currentUser?.role === 'worker' && job.assignedTo === currentUser.email && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50 -mx-8 -mb-8 p-8">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Worker Workflow Action</p>
                <p className="text-xs text-slate-600 font-medium italic">Update status to proceed with the project.</p>
              </div>
              <div className="flex items-center gap-3">
                {job.status === 'assigned' && (
                  <button 
                    onClick={() => handleJobAction('accept')}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <FaCheckCircle size={14} />
                    <span>Accept Job</span>
                  </button>
                )}
                {job.status === 'in_progress' && (
                  <button 
                    onClick={() => handleJobAction('checkout')}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <FaCheck size={14} />
                    <span>Mark as Checked Out</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Bar for Super Admins (Review Cycle) */}
          {currentUser?.role === 'super_admin' && (job.status === 'checked_out' || job.status === 'waiting_review') && (
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-4 bg-indigo-50/30 -mx-8 -mb-8 p-8">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Administrative Control</p>
                <p className="text-xs text-slate-600 font-medium italic">Review work and finalize or return for revision.</p>
              </div>
              <div className="flex items-center gap-3">
                {job.status === 'checked_out' && (
                  <button 
                    onClick={() => handleJobAction('review')}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
                  >
                    <FaClock size={14} />
                    <span>Start Review</span>
                  </button>
                )}
                {job.status === 'waiting_review' && (
                  <>
                    <button 
                      onClick={() => setIsReturnModalOpen(true)}
                      className="px-6 py-2.5 bg-orange-100 text-orange-700 rounded-xl font-bold text-sm hover:bg-orange-200 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <FaHistory size={14} />
                      <span>Return Work</span>
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to approve this work and mark it as completed?')) {
                          handleJobAction('approve');
                        }
                      }}
                      className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center gap-2"
                    >
                      <FaCheckCircle size={14} />
                      <span>Approve & Complete</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Return Feedback Modal Overlay */}
          {isReturnModalOpen && (
            <div className="absolute inset-0 z-[70] bg-white/95 backdrop-blur-sm flex items-center justify-center p-8 animate-fade-in">
              <div className="w-full max-w-lg space-y-6">
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
                        setIsReturnModalOpen(false);
                        setReturnFeedback('');
                      }}
                      className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        if (!returnFeedback.trim()) {
                          showToast('Please provide feedback before returning.', 'warning');
                          return;
                        }
                        handleJobAction('return', { feedback: returnFeedback });
                        setIsReturnModalOpen(false);
                        setReturnFeedback('');
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
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
