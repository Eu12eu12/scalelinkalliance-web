import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { FaLock, FaUserPlus, FaUserShield, FaKey, FaShieldAlt, FaCircle, FaTrash, FaPhone, FaUser, FaMapMarkerAlt, FaEnvelope, FaUserCheck, FaUserSlash } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [adminUsers, setAdminUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Password Form State
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  // New User Form State
  const [newUserData, setNewUserData] = useState({ email: '', password: '', role: 'worker' });

  // Profile Form State (for workers/admins)
  const [profileData, setProfileData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    zipCode: ''
  });

  const token = localStorage.getItem('cms_token');

  useEffect(() => {
    fetchSession();
    if (activeTab === 'users') {
      fetchAdminUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        fullName: currentUser.fullName || '',
        phoneNumber: currentUser.phoneNumber || '',
        address: currentUser.address || '',
        zipCode: currentUser.zipCode || ''
      });
    }
  }, [currentUser]);

  const showToast = (msg, type) => {
    if (type === 'success') {
      setSuccess(msg);
      setError('');
    } else {
      setError(msg);
      setSuccess('');
    }
    setTimeout(() => { setSuccess(''); setError(''); }, 5000);
  };

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/cms/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setCurrentUser(data.user);
    } catch (err) { console.error('Session fetch failed', err); }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch('/api/cms/admin-users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAdminUsers(data);
    } catch (err) { console.error(err); }
  };

  // Removed sendOnboardingEmail as it is now handled by the backend via Resend API.


  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      return showToast('New passwords do not match', 'error');
    }
    setLoading(true);
    try {
      const res = await fetch('/api/cms/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passData.currentPassword,
          newPassword: passData.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Password updated successfully!', 'success');
        setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        showToast(data.error || 'Failed to update password', 'error');
      }
    } catch (err) {
      showToast('A network error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/cms/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Profile updated successfully!', 'success');
        fetchSession(); // Refresh current user data
      } else {
        showToast(data.error || 'Failed to update profile.', 'error');
      }
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/cms/admin-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newUserData)
      });
      const data = await res.json();
      if (res.ok) {
        if (newUserData.role === 'worker') {
          showToast('New worker created. A verification email has been sent.', 'success');
        } else {
          showToast('Administrator created successfully.', 'success');
        }
        setNewUserData({ email: '', password: '', role: 'worker' });
        fetchAdminUsers();
      } else {
        showToast(data.error || 'Failed to create user', 'error');
      }
    } catch (err) {
      showToast('A network error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to remove ${userEmail}? This action cannot be undone.`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/admin-users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Member removed successfully.', 'success');
        fetchAdminUsers();
      } else {
        showToast('Failed to delete user', 'error');
      }
    } catch (err) {
      showToast('Error deleting user', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/cms/admin-users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        showToast('Privileges updated successfully.', 'success');
        fetchAdminUsers();
      }
    } catch (err) {
      showToast('Error updating role', 'error');
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      const res = await fetch(`/api/cms/admin/users/${userId}/toggle-active`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'success');
        fetchAdminUsers();
      } else {
        showToast(data.error, 'error');
      }
    } catch (err) {
      showToast('Error updating account status', 'error');
    }
  };

  return (
    <AdminLayout pageTitle="General Settings">
      <div className="w-full">
        {/* Tabs */}
        <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl mb-8 w-fit">
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'account' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FaLock size={14} />
            <span>My Account</span>
          </button>
          {currentUser?.role === 'super_admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FaUserShield size={14} />
              <span>Team Management</span>
            </button>
          )}
        </div>

        {/* Global Feedback */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center space-x-3 text-sm animate-fade-in-up">
            <FaCircle className="text-[6px]" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl flex items-center space-x-3 text-sm animate-fade-in-up">
            <FaCircle className="text-[6px]" />
            <span>{error}</span>
          </div>
        )}

        {activeTab === 'account' ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Security Section */}
              <div className="flex-1 space-y-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
                  <FaShieldAlt className="text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Security Settings</h3>
                </div>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Current Password</label>
                    <input
                      required
                      type="password"
                      value={passData.currentPassword}
                      onChange={e => setPassData({...passData, currentPassword: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">New Password</label>
                    <input
                      required
                      type="password"
                      value={passData.newPassword}
                      onChange={e => setPassData({...passData, newPassword: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Confirm New Password</label>
                    <input
                      required
                      type="password"
                      value={passData.confirmPassword}
                      onChange={e => setPassData({...passData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50/30"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>

              {/* Profile Section (Visible to all) */}
              {currentUser && (
                <div className="flex-[1.5] space-y-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-4">
                    <FaUser className="text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Personal Profile</h3>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Full Name *</label>
                        <input
                          required
                          type="text"
                          value={profileData.fullName}
                          onChange={e => setProfileData({...profileData, fullName: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phone Number *</label>
                        <input
                          required
                          type="tel"
                          value={profileData.phoneNumber}
                          onChange={e => setProfileData({...profileData, phoneNumber: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          placeholder="+1 234 567 890"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email Address (Managed)</label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input
                          disabled
                          value={currentUser?.email || ''}
                          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Address</label>
                        <input
                          type="text"
                          value={profileData.address}
                          onChange={e => setProfileData({...profileData, address: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          placeholder="Street, City, State"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Zip Code</label>
                        <input
                          type="text"
                          value={profileData.zipCode}
                          onChange={e => setProfileData({...profileData, zipCode: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          placeholder="Zip"
                        />
                      </div>
                    </div>

                    {!currentUser?.isVerified && (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3">
                        <div className="text-amber-500 mt-0.5 text-lg">⚠️</div>
                        <div>
                          <p className="text-xs text-amber-800 font-bold mb-0.5">Account Verification Pending</p>
                          <p className="text-[10px] text-amber-700 leading-relaxed">
                            Please complete your profile details above to verify your account and begin accepting tasks.
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (currentUser?.isVerified ? 'Save Profile Changes' : 'Complete Verification')}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Create User Form */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Add Team Member</h3>
                  <p className="text-sm text-slate-500">A verification email will be sent to the worker.</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <FaUserPlus className="text-blue-600" size={20} />
                </div>
              </div>
              <form onSubmit={handleCreateUser} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                    <input 
                      required type="email"
                      value={newUserData.email}
                      onChange={e => setNewUserData({...newUserData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm" 
                      placeholder="worker@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Initial Password</label>
                    <input 
                      required type="password"
                      value={newUserData.password}
                      onChange={e => setNewUserData({...newUserData, password: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm" 
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Role</label>
                    <select
                      value={newUserData.role}
                      onChange={e => setNewUserData({...newUserData, role: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm font-semibold"
                    >
                      <option value="worker">Worker (Restricted)</option>
                      <option value="admin">Admin (Limited)</option>
                      <option value="super_admin">Super Admin (Full)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>

            {/* User List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-lg font-bold text-slate-800">Active Team Members</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Administrator</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Added Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Access Level</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {adminUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs shadow-sm">
                              {user.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">{user.email}</span>
                              {currentUser?.id === user.id && (
                                <span className="text-[10px] text-blue-500 font-bold uppercase">Current User</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={user.role}
                            disabled={currentUser?.id === user.id}
                            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                            className={`text-[10px] font-bold rounded-lg px-3 py-1.5 outline-none transition-all uppercase tracking-widest ${
                              user.role === 'super_admin'
                                ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                : 'bg-slate-50 text-slate-600 border border-slate-100'
                            }`}
                          >
                            <option value="worker">Worker</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {!user.isActive ? (
                              <div className="inline-flex items-center space-x-1.5 px-2 py-1 bg-rose-50 text-rose-600 rounded-lg font-bold text-[9px] uppercase tracking-wider w-fit">
                                <div className="w-1 h-1 rounded-full bg-rose-500" />
                                <span>Deactivated</span>
                              </div>
                            ) : user.isVerified ? (
                              <div className="inline-flex items-center space-x-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-bold text-[9px] uppercase tracking-wider w-fit">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                <span>Verified</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center space-x-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded-lg font-bold text-[9px] uppercase tracking-wider w-fit">
                                <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
                                <span>Pending</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {currentUser?.id !== user.id && (
                              <>
                                <button
                                  onClick={() => handleToggleActive(user.id)}
                                  className={`p-2 rounded-xl transition-all ${
                                    user.isActive 
                                      ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' 
                                      : 'text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50'
                                  }`}
                                  title={user.isActive ? 'Deactivate Account' : 'Reactivate Account'}
                                >
                                  {user.isActive ? <FaUserSlash size={14} /> : <FaUserCheck size={14} />}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id, user.email)}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                  title="Delete Member"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </>
                            )}
                            {currentUser?.id === user.id && (
                              <span className="text-[10px] text-slate-300 font-bold px-2 uppercase tracking-tighter">System</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
