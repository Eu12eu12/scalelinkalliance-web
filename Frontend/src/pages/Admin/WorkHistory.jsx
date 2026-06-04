import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { FaHistory, FaBriefcase, FaDollarSign, FaSearch, FaCalendarAlt, FaChevronRight, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

const WorkHistory = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState('all');
  const token = localStorage.getItem('cms_token');

  const fetchSessionAndHistory = async () => {
    try {
      // 1. Fetch user session details
      const sessionRes = await fetch('/api/cms/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      let userObj = null;
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        setCurrentUser(sessionData.user);
        userObj = sessionData.user;
      }

      // 2. Fetch work history
      const res = await fetch('/api/cms/worker/work-history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setJobs(data.jobs || []);
      } else {
        throw new Error(data.error || 'Failed to load work history');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSessionAndHistory();
    }
  }, [token]);

  const sanitizeJobTitle = (title) => {
    if (!title) return '';
    let cleaned = title.replace(/Request Custom Quote - /g, '');
    if (cleaned.includes(' - ')) {
      const parts = cleaned.split(' - ');
      if (parts.length >= 2) {
        cleaned = parts[parts.length - 1];
      }
    }
    return cleaned.trim();
  };

  // Get unique list of workers who have completed jobs
  const uniqueWorkers = ['all', ...new Set(jobs.map(job => job.assignedTo).filter(Boolean))];

  // Filter jobs based on worker dropdown selection
  const displayedJobs = jobs.filter(job => selectedWorker === 'all' || job.assignedTo === selectedWorker);
  const displayedEarnings = displayedJobs.reduce((sum, job) => sum + (job.projectFee || 0), 0);
  const displayedCount = displayedJobs.length;

  // Filter display list based on search term
  const filteredJobs = displayedJobs.filter(job => {
    const cleanTitle = sanitizeJobTitle(job.title).toLowerCase();
    const category = (job.category || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return cleanTitle.includes(search) || category.includes(search);
  });

  if (loading) {
    return (
      <AdminLayout pageTitle="Work History">
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
          <p className="text-slate-500 font-bold text-sm">Loading work history records...</p>
        </div>
      </AdminLayout>
    );
  }

  const isSuperAdmin = currentUser?.role === 'super_admin';

  return (
    <AdminLayout pageTitle="Work History">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
              <FaHistory size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {isSuperAdmin ? 'Worker Payouts & History' : 'Work History & Earnings'}
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                {isSuperAdmin 
                  ? 'Audit contract completion records and manage worker payouts' 
                  : 'Track completed jobs and monitor your accumulated payouts'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Earnings Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-xl shadow-emerald-500/10 flex items-center justify-between relative overflow-hidden group">
            <div className="space-y-2 z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-100/80">
                {isSuperAdmin ? 'Total Payouts Audited' : 'Total Revenue Generated'}
              </span>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight flex items-baseline">
                ${displayedEarnings.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-xs font-extrabold ml-1.5 text-emerald-100">USD</span>
              </h3>
              <p className="text-xs font-semibold text-emerald-100/90">
                {isSuperAdmin ? 'Aggregate payouts paid out to partners' : 'Sum total of all successfully completed contracts'}
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-2xl z-10">
              <FaDollarSign size={28} />
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
          </div>

          {/* Volume Card */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between relative overflow-hidden group">
            <div className="space-y-2 z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {isSuperAdmin ? 'Total Audited Jobs' : 'Contracts Finished'}
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight flex items-baseline">
                {displayedCount}
                <span className="text-xs font-extrabold ml-1.5 text-slate-400">Jobs</span>
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                {isSuperAdmin ? 'Total count of finished worker deliverables' : 'Total volume of accepted & completed jobs'}
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-100 text-slate-500 rounded-2xl z-10">
              <FaBriefcase size={28} />
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-110 transition-transform duration-500" />
          </div>
        </div>

        {/* History Search & List */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-50">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FaBriefcase className="text-slate-400" /> Archive of Completed Jobs
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Super Admin Worker Filter Dropdown */}
              {isSuperAdmin && (
                <div className="relative w-full sm:w-48">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <select
                    value={selectedWorker}
                    onChange={e => setSelectedWorker(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs rounded-xl transition-all font-bold text-slate-700 capitalize bg-white appearance-none cursor-pointer"
                  >
                    <option value="all">All Workers</option>
                    {uniqueWorkers.filter(w => w !== 'all').map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Search Input */}
              <div className="relative w-full sm:w-60">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search category or title..."
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs rounded-xl transition-all"
                />
              </div>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-300 mb-3">
                <FaBriefcase size={22} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No completed jobs found</p>
              <p className="text-[11px] text-slate-400 mt-1 font-medium">Completed assignments will populate here automatically</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredJobs.map(job => (
                <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 hover:bg-slate-50/50 -mx-4 px-4 rounded-2xl transition-all duration-150 group">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-extrabold uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md tracking-wider">
                        {(job.category || 'Service').replace(/Request Custom Quote - /g, '')}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <FaCalendarAlt size={9} />
                        {new Date(job.completedAt || job.updatedAt).toLocaleDateString([], { dateStyle: 'medium' })}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                      {sanitizeJobTitle(job.title)}
                    </h4>
                    {isSuperAdmin && job.assignedTo && (
                      <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                        <FaUser size={9} className="text-slate-300" />
                        <span>Partner: {job.assignedTo}</span>
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">
                        {isSuperAdmin ? 'Partner Payout' : 'Payout Earned'}
                      </span>
                      <span className="text-sm font-black text-emerald-600">
                        +${(job.projectFee || 0).toLocaleString([], { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <FaChevronRight size={10} className="text-slate-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-0.5 duration-200 hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default WorkHistory;
