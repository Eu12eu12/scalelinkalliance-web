import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { FaChartBar, FaUserCheck, FaClock, FaPercent, FaExclamationCircle } from 'react-icons/fa';

const HubReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('cms_token');

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/cms/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return <AdminLayout pageTitle="Business Intelligence"><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div></AdminLayout>;
  if (!stats) return <AdminLayout pageTitle="Business Intelligence"><div className="text-center py-20 text-slate-500 font-bold italic">No data available yet.</div></AdminLayout>;

  return (
    <AdminLayout pageTitle="Business Reports">
      <div className="space-y-8 max-w-7xl">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Completion Rate" 
            value={`${stats.completionRate}%`} 
            sub="of all tasks finished" 
            icon={<FaPercent className="text-blue-600" />} 
          />
          <StatCard 
            label="Avg. Turnaround" 
            value={`${stats.avgCompletionTime}h`} 
            sub="per completed job" 
            icon={<FaClock className="text-emerald-600" />} 
          />
          <StatCard 
            label="Overdue Tasks" 
            value={stats.overdueCount} 
            sub="require immediate action" 
            icon={<FaExclamationCircle className="text-rose-600" />} 
            alert={stats.overdueCount > 0}
          />
          <StatCard 
            label="Active Workers" 
            value={Object.keys(stats.byWorker).length} 
            sub="contributing this period" 
            icon={<FaUserCheck className="text-purple-600" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Distribution */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Job Status Distribution</h3>
            <div className="space-y-6">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-2 capitalize">
                    <span>{status.replace('_', ' ')}</span>
                    <span>{count}</span>
                  </div>
                  <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${(count / stats.total) * 100}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Worker Performance */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-50">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Worker Performance Metrics</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Worker</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Total</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center text-emerald-600">Done</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center text-rose-600">Late</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {Object.entries(stats.byWorker).map(([worker, wStats]) => {
                    const successRate = ((wStats.completed / wStats.total) * 100).toFixed(0);
                    return (
                      <tr key={worker} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs uppercase">
                              {worker.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-800">{worker}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center text-sm font-bold text-slate-700">{wStats.total}</td>
                        <td className="px-8 py-5 text-center text-sm font-bold text-emerald-600">{wStats.completed}</td>
                        <td className="px-8 py-5 text-center text-sm font-bold text-rose-600">{wStats.overdue}</td>
                        <td className="px-8 py-5 text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            successRate >= 80 ? 'bg-emerald-50 text-emerald-600' : 
                            successRate >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                          }`}>
                            {successRate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

const StatCard = ({ label, value, sub, icon, alert }) => (
  <div className={`bg-white p-8 rounded-3xl border transition-all ${alert ? 'border-rose-100 ring-2 ring-rose-50' : 'border-slate-100'} shadow-sm`}>
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl shadow-sm">
        {icon}
      </div>
      {alert && <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
    </div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
    <p className="text-[11px] text-slate-400 font-medium">{sub}</p>
  </div>
);

export default HubReports;
