import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { 
  FaNewspaper, FaTags, FaStar, FaChartBar, FaHandshake, 
  FaBriefcase, FaCheckCircle, FaClock, FaExclamationTriangle 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon, color, sub, link }) => {
  const cardContent = (
    <>
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
          style={{ background: color }}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </>
  );

  if (link) {
    return (
      <Link 
        to={link} 
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 hover:scale-[1.01] transition-all block cursor-pointer"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      {cardContent}
    </div>
  );
};

const AdminDashboard = () => {
  const [resources, setResources] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [statsData, setStatsData] = useState({
    // Admin stats
    totalResources: 0,
    publishedResources: 0,
    totalCategories: 0,
    totalPartners: 0,
    pendingPartners: 0,
    featuredResource: null,
    totalNoticeBoardJobs: 0,
    openNoticeBoardJobs: 0,
    overdueNoticeBoardJobs: 0,
    // Worker stats
    myActiveJobs: 0,
    myCompletedJobs: 0,
    myOverdueJobs: 0,
    myPendingReview: 0
  });
  const token = localStorage.getItem('cms_token');

  useEffect(() => {
    Promise.all([
      fetch('/api/cms/admin/resources?page=1&limit=5', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()).catch(() => ({ resources: [], totalCount: 0 })),
      fetch('/api/cms/resource-types').then(r => r.json()).catch(() => []),
      fetch('/api/cms/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()).catch(() => null),
    ]).then(async ([r, t, s]) => {
      if (r && r.resources) {
        setResources(r.resources);
        setTotalCount(r.totalCount);
      } else if (Array.isArray(r)) {
        setResources(r);
        setTotalCount(r.length);
      }
      
      if (Array.isArray(t)) setTypes(t);
      if (s && !s.error) setStatsData(s);

      // Fetch user role for conditional UI
      const sessionRes = await fetch('/api/cms/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        setUserRole(sessionData.user?.role);
      }
    }).finally(() => setLoading(false));
  }, []);

  const featured = resources.find(r => r.isFeatured);
  const publishedCount = resources.filter(r => r.status === 'published').length;

    const stats = userRole === 'super_admin' ? [
      {
        label: 'Total Resources',
        value: loading ? '—' : statsData.totalResources,
        icon: <FaNewspaper size={18} />,
        color: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        sub: `${statsData.publishedResources} active on website`,
        link: '/hub/resources'
      },
      {
        label: 'Categories',
        value: loading ? '—' : statsData.totalCategories,
        icon: <FaTags size={18} />,
        color: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
        sub: 'Resource type groups',
        link: '/hub/categories'
      },
      {
        label: 'Featured Resource',
        value: loading ? '—' : statsData.featuredResource ? '1' : '0',
        icon: <FaStar size={18} />,
        color: 'linear-gradient(135deg, #d97706, #b45309)',
        sub: statsData.featuredResource ? statsData.featuredResource.title.slice(0, 30) + '…' : 'No featured resource set',
      },
      {
        label: 'Partner Network',
        value: loading ? '—' : statsData.totalPartners,
        icon: <FaHandshake size={18} />,
        color: 'linear-gradient(135deg, #ec4899, #db2777)',
        sub: `${statsData.pendingPartners} pending review`,
        link: '/hub/partners'
      },
      {
        label: 'Active Jobs',
        value: loading ? '—' : statsData.openNoticeBoardJobs,
        icon: <FaBriefcase size={18} />,
        color: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        sub: 'Open in Notice Board',
        link: '/hub/notice-board'
      },
      {
        label: 'Overdue/Urgent',
        value: loading ? '—' : statsData.overdueNoticeBoardJobs,
        icon: <FaExclamationTriangle size={18} />,
        color: 'linear-gradient(135deg, #ef4444, #dc2626)',
        sub: 'Action required',
        link: '/hub/notice-board'
      },
    ] : userRole === 'admin' ? [
      {
        label: 'Total Resources',
        value: loading ? '—' : statsData.totalResources,
        icon: <FaNewspaper size={18} />,
        color: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        sub: `${statsData.publishedResources} active on website`,
        link: '/hub/resources'
      },
      {
        label: 'Categories',
        value: loading ? '—' : statsData.totalCategories,
        icon: <FaTags size={18} />,
        color: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
        sub: 'Resource type groups',
        link: '/hub/categories'
      },
      {
        label: 'Featured Resource',
        value: loading ? '—' : statsData.featuredResource ? '1' : '0',
        icon: <FaStar size={18} />,
        color: 'linear-gradient(135deg, #d97706, #b45309)',
        sub: statsData.featuredResource ? statsData.featuredResource.title.slice(0, 30) + '…' : 'No featured resource set',
      },
    ] : [
      {
        label: 'My Active Jobs',
        value: loading ? '—' : statsData.myActiveJobs,
        icon: <FaBriefcase size={18} />,
        color: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        sub: 'Ongoing assignments',
        link: '/hub/notice-board'
      },
      {
        label: 'Pending Review',
        value: loading ? '—' : statsData.myPendingReview,
        icon: <FaClock size={18} />,
        color: 'linear-gradient(135deg, #f59e0b, #d97706)',
        sub: 'Awaiting admin check',
        link: '/hub/notice-board'
      },
      {
        label: 'My Overdue Tasks',
        value: loading ? '—' : statsData.myOverdueJobs,
        icon: <FaExclamationTriangle size={18} />,
        color: 'linear-gradient(135deg, #ef4444, #dc2626)',
        sub: 'Immediate action needed',
        link: '/hub/notice-board'
      },
      {
        label: 'Completed Tasks',
        value: loading ? '—' : statsData.myCompletedJobs,
        icon: <FaCheckCircle size={18} />,
        color: 'linear-gradient(135deg, #10b981, #059669)',
        sub: 'Total finished',
        link: '/hub/work-history'
      },
    ];

  return (
    <AdminLayout pageTitle="Dashboard">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 mb-8 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
      >
        <div
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10 blur-2xl"
          style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }}
        />
        <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-2">Welcome back</p>
        <h2 className="text-2xl font-bold mb-1">ScaleLink Alliance Portal</h2>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Recent resources - Super Admin Only */}
      {userRole === 'super_admin' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 text-sm">Recent Resources</h3>
            <Link to="/hub/resources" className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="px-6 py-10 text-center text-slate-400 text-sm">Loading...</div>
          ) : resources.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-slate-400 text-sm mb-3">No resources yet.</p>
              <Link to="/hub/resources" className="text-sm font-medium text-blue-600 hover:underline">
                Create your first resource →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-50">
              {resources.slice(0, 5).map(r => (
                <li key={r.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FaNewspaper size={12} className="text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{r.title}</p>
                      <p className="text-xs text-slate-400">{r.type?.name || 'Uncategorized'}</p>
                    </div>
                  </div>
                  {r.isFeatured && (
                    <span className="flex-shrink-0 ml-4 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      Featured
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
