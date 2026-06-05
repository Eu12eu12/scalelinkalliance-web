import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  FaSignOutAlt, FaTachometerAlt, FaBars, FaTimes, FaCog, FaHandshake, FaFileAlt, FaBriefcase, FaChartLine, FaBell, FaHistory, FaFileInvoiceDollar
} from 'react-icons/fa';



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

const AdminLayout = ({ children, pageTitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('cms_token');

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/cms/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/cms/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setSessionUser(data.user);
      } catch (err) { console.error('Failed to fetch session', err); }
    };
    if (token) {
      fetchSession();
      fetchNotifications();
      
      // Listen for notification updates from child components
      const handleUpdate = () => fetchNotifications();
      window.addEventListener('notificationsUpdated', handleUpdate);
      
      // Poll for notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => {
        clearInterval(interval);
        window.removeEventListener('notificationsUpdated', handleUpdate);
      };
    }
  }, [token]);

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
      console.error('Failed to mark notification as read', err);
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
        window.dispatchEvent(new CustomEvent('notificationsUpdated'));
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cms_token');
    navigate('/hub/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700/50">
        <Link to="/" className="flex items-center space-x-3 group">
          <img 
            src="/scalelink-logo.png" 
            alt="ScaleLink Alliance" 
            className="h-8 w-auto transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm tracking-tight">ScaleLink Alliance</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">
              Management Hub
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto">
        {/* DASHBOARD GROUP */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Dashboard</p>
          <NavLink to="/hub" end className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <FaTachometerAlt size={16} />
            <span>Overview</span>
          </NavLink>
        </div>

        {/* CONTENT GROUP - Management & Admin */}
        {(sessionUser?.role === 'super_admin' || sessionUser?.role === 'admin') && (
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Content</p>
            <NavLink to="/hub/resources" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <FaFileAlt size={16} />
              <span>Resources</span>
            </NavLink>
            {sessionUser?.role === 'super_admin' && (
              <NavLink to="/hub/partners" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <FaHandshake size={16} />
                <span>Partner Network</span>
              </NavLink>
            )}
          </div>
        )}

        {/* OPERATIONS GROUP - Notice Board for Super Admin & Workers */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Operations</p>
          {(sessionUser?.role === 'super_admin' || sessionUser?.role === 'worker') && (
            <>
              <NavLink to="/hub/notice-board" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <FaBriefcase size={16} />
                <span>Notice Board</span>
              </NavLink>
              <NavLink to="/hub/work-history" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <FaHistory size={16} />
                <span>Work History</span>
              </NavLink>
            </>
          )}
          {(sessionUser?.role === 'super_admin' || sessionUser?.role === 'admin') && (
            <>
              <NavLink to="/hub/crm" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <FaHandshake size={16} />
                <span>CRM / Deals</span>
              </NavLink>
              <NavLink to="/hub/quotes" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <FaFileInvoiceDollar size={16} />
                <span>Custom Quotes</span>
              </NavLink>
            </>
          )}
          <NavLink to="/hub/notifications" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <FaBell size={16} />
            <span>Notifications</span>
          </NavLink>
          {sessionUser?.role === 'super_admin' && (
            <NavLink to="/hub/reports" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <FaChartLine size={16} />
              <span>Business Reports</span>
            </NavLink>
          )}
        </div>

        {/* SYSTEM GROUP - All Roles */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">System</p>
          <NavLink to="/hub/settings" className={({ isActive }) => `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <FaCog size={16} />
            <span>General Settings</span>
          </NavLink>
        </div>
      </nav>

      {/* Logout at bottom */}
      <div className="px-3 py-4 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-400 bg-red-900/20 hover:bg-red-900/40 transition-all duration-150"
        >
          <FaSignOutAlt size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop fixed, mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-60 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#0f172a' }}
      >
        <SidebarContent />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center space-x-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
            <div>
              <h1 className="font-semibold text-slate-800 text-base">{pageTitle}</h1>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-xl transition-all duration-200 relative ${isNotificationsOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
              >
                <FaBell size={18} />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                      <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                      <button 
                        onClick={markAllRead}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-50">
                          {notifications.map(notification => (
                            <div 
                              key={notification.id} 
                              className={`p-4 transition-colors hover:bg-slate-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                              onClick={() => {
                                if (!notification.isRead) markAsRead(notification.id);
                                setIsNotificationsOpen(false);
                                if (notification.jobId) navigate('/hub/notifications');
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`mt-1 p-1.5 rounded-lg ${
                                  notification.type === 'assignment' ? 'bg-blue-100 text-blue-600' :
                                  notification.type === 'acceptance' ? 'bg-green-100 text-green-600' :
                                  notification.type === 'check_out' ? 'bg-orange-100 text-orange-600' :
                                  notification.type === 'review' ? 'bg-indigo-100 text-indigo-600' :
                                  notification.type === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                  notification.type === 'returned' ? 'bg-orange-100 text-orange-600' :
                                  notification.type === 'comment' ? 'bg-blue-100 text-blue-600' :
                                  notification.type === 'file' ? 'bg-sky-100 text-sky-600' :
                                  'bg-slate-100 text-slate-600'
                                }`}>
                                  <FaBell size={12} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-800 leading-tight">
                                    {renderMessage(notification, sessionUser?.role === 'worker')}
                                  </p>
                                  <p className="text-[10px] text-slate-400 mt-1">
                                    {new Date(notification.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-300 mb-3">
                            <FaBell size={24} />
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No notifications</p>
                        </div>
                      )}
                    </div>
                    <Link 
                      to="/hub/notifications" 
                      onClick={() => setIsNotificationsOpen(false)}
                      className="block py-3 text-center text-xs font-bold text-slate-500 hover:bg-slate-50 border-t border-slate-50 transition-colors"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Admin chip */}
            <Link to="/" className="flex items-center space-x-3 px-3 py-1 bg-slate-50 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
              <img 
                src="/scalelink-logo.png" 
                alt="Admin" 
                className="h-5 w-auto"
              />
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  {sessionUser?.role === 'super_admin' ? 'Super Admin' : (sessionUser?.role === 'admin' ? 'Admin' : 'Worker')}
                </span>
                <span className="text-xs font-semibold text-slate-700">
                  {sessionUser?.email || 'Dashboard'}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
