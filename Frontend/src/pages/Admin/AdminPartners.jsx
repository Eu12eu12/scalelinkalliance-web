import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useToast } from './Toast';
import { FaHandshake, FaCheck, FaTimes, FaTrash, FaExternalLinkAlt, FaSearch, FaFilter, FaEdit, FaImage, FaPlus } from 'react-icons/fa';

const AdminPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [editFormData, setEditFormData] = useState({
    businessName: '',
    category: '',
    websiteUrl: '',
    contactEmail: '',
    linkPlacementUrl: '',
    description: '',
    status: 'approved'
  });
  const [logoPreview, setLogoPreview] = useState(null);

  // Create State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    businessName: '',
    category: '',
    websiteUrl: '',
    contactEmail: '',
    linkPlacementUrl: '',
    description: '',
    status: 'approved'
  });
  const [createLogoPreview, setCreateLogoPreview] = useState(null);

  const { showToast, ToastContainer } = useToast();
  const token = localStorage.getItem('cms_token');

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/admin/partners', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setPartners(data);
    } catch (err) {
      console.error('Failed to fetch partners', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/cms/admin/partners/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setPartners(partners.map(p => p.id === id ? { ...p, status: newStatus } : p));
        showToast(`Partner status changed to ${newStatus}.`, 'success');
      }
    } catch (err) {
      console.error('Failed to update status', err);
      showToast('Failed to update status.', 'error');
    }
  };

  // Open Create Modal
  const openCreate = () => {
    setCreateFormData({
      businessName: '',
      category: '',
      websiteUrl: '',
      contactEmail: '',
      linkPlacementUrl: '',
      description: '',
      status: 'approved'
    });
    setCreateLogoPreview(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 16 * 1024 * 1024) {
        showToast('Logo file size must be less than 16MB.', 'error');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setCreateLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSave = async (e) => {
    e.preventDefault();
    if (!createLogoPreview) {
      showToast('Please upload a company logo.', 'error');
      return;
    }
    setLoading(true);

    const payload = {
      ...createFormData,
      logoUrl: createLogoPreview
    };

    try {
      const res = await fetch('/api/cms/admin/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const newPartner = await res.json();
        setPartners([newPartner, ...partners]);
        showToast('Partner added successfully!', 'success');
        setIsCreateModalOpen(false);
      } else {
        const error = await res.json();
        showToast(error.error || 'Failed to add partner.', 'error');
      }
    } catch (err) {
      showToast('A network error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Modal
  const openEdit = (partner) => {
    setEditingPartner(partner);
    setEditFormData({
      businessName: partner.businessName,
      category: partner.category,
      websiteUrl: partner.websiteUrl,
      contactEmail: partner.contactEmail,
      linkPlacementUrl: partner.linkPlacementUrl,
      description: partner.description || '',
      status: partner.status || 'approved'
    });
    setLogoPreview(partner.logoUrl);
    setIsEditModalOpen(true);
  };

  const handleEditLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 16 * 1024 * 1024) {
        showToast('Logo file size must be less than 16MB.', 'error');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      businessName: editFormData.businessName,
      category: editFormData.category,
      websiteUrl: editFormData.websiteUrl,
      contactEmail: editFormData.contactEmail,
      linkPlacementUrl: editFormData.linkPlacementUrl,
      description: editFormData.description,
      status: editFormData.status,
    };

    if (logoPreview) {
      payload.logoUrl = logoPreview;
    }

    try {
      const res = await fetch(`/api/cms/admin/partners/${editingPartner.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updated = await res.json();
        setPartners(partners.map(p => p.id === updated.id ? updated : p));
        showToast('Partner details updated successfully!', 'success');
        setIsEditModalOpen(false);
      } else {
        const error = await res.json();
        showToast(error.error || 'Failed to update partner.', 'error');
      }
    } catch (err) {
      showToast('A network error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this partner?')) return;
    try {
      const res = await fetch(`/api/cms/admin/partners/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPartners(partners.filter(p => p.id !== id));
        showToast('Partner deleted.', 'success');
      }
    } catch (err) {
      console.error('Failed to delete partner', err);
    }
  };

  const filteredPartners = partners.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <AdminLayout pageTitle="Partner Network">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header/Filters */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-64"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-slate-400 text-xs" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Showing {filteredPartners.length} of {partners.length} partners
            </span>
            <button
              onClick={openCreate}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-95 shadow-md shadow-blue-500/20 bg-[#18264A] hover:bg-[#101c38] cursor-pointer"
            >
              <FaPlus size={12} />
              <span>Add Partner</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading partners...</div>
          ) : filteredPartners.length === 0 ? (
            <div className="py-20 text-center">
               <FaHandshake className="mx-auto text-slate-200 text-4xl mb-4" />
               <p className="text-slate-400 mb-4">No partners found matching your criteria.</p>
               <button
                 onClick={openCreate}
                 className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#18264A] hover:bg-[#101c38] transition-all shadow-sm"
               >
                 <FaPlus size={11} />
                 <span>Add First Partner</span>
               </button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Partner Details</th>
                  <th className="px-6 py-4">Contact & Verification</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200">
                          {partner.logoUrl ? (
                            <img src={partner.logoUrl} alt={partner.businessName} className="w-full h-full object-contain" />
                          ) : (
                            <FaHandshake className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{partner.businessName}</div>
                          <div className="text-xs text-slate-400">{partner.category}</div>
                          {partner.description && (
                            <div className="text-[11px] text-slate-500 mt-1 max-w-xs truncate" title={partner.description}>
                              <span className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider mr-1">Internal:</span>
                              {partner.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div>
                          <a 
                            href={partner.websiteUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                          >
                            <span>Website</span>
                            <FaExternalLinkAlt size={9} />
                          </a>
                        </div>
                        <div>
                          <a 
                            href={partner.linkPlacementUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center space-x-1"
                          >
                            <span>Link Placement</span>
                            <FaExternalLinkAlt size={9} />
                          </a>
                        </div>
                        <div className="text-[11px] text-slate-400 italic">
                          {partner.contactEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(partner.status)}`}>
                        {partner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {partner.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(partner.id, 'approved')}
                              title="Approve Partner"
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <FaCheck size={13} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(partner.id, 'rejected')}
                              title="Reject Partner"
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <FaTimes size={13} />
                            </button>
                          </>
                        )}
                        {partner.status === 'approved' && (
                          <button
                            onClick={() => handleStatusChange(partner.id, 'rejected')}
                            title="Reject/Unpublish Partner"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <FaTimes size={13} />
                          </button>
                        )}
                        {partner.status === 'rejected' && (
                          <button
                            onClick={() => handleStatusChange(partner.id, 'approved')}
                            title="Re-approve Partner"
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <FaCheck size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => openEdit(partner)}
                          title="Edit Partner"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FaEdit size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(partner.id)}
                          title="Delete Partner"
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <FaPlus className="text-[#18264A] text-sm" />
                Add New Partner
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleCreateSave} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Business Name *</label>
                    <input
                      required
                      name="businessName"
                      type="text"
                      placeholder="e.g. Acme Tech Solutions"
                      value={createFormData.businessName}
                      onChange={e => setCreateFormData({ ...createFormData, businessName: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Category *</label>
                    <input
                      required
                      name="category"
                      type="text"
                      placeholder="e.g. B2B SaaS, IT Consulting"
                      value={createFormData.category}
                      onChange={e => setCreateFormData({ ...createFormData, category: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Website URL *</label>
                    <input
                      required
                      name="websiteUrl"
                      type="url"
                      placeholder="https://example.com"
                      value={createFormData.websiteUrl}
                      onChange={e => setCreateFormData({ ...createFormData, websiteUrl: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Contact Email *</label>
                    <input
                      required
                      name="contactEmail"
                      type="email"
                      placeholder="partner@example.com"
                      value={createFormData.contactEmail}
                      onChange={e => setCreateFormData({ ...createFormData, contactEmail: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Link Placement URL *</label>
                    <input
                      required
                      name="linkPlacementUrl"
                      type="url"
                      placeholder="https://example.com/partners"
                      value={createFormData.linkPlacementUrl}
                      onChange={e => setCreateFormData({ ...createFormData, linkPlacementUrl: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Status *</label>
                    <select
                      value={createFormData.status}
                      onChange={e => setCreateFormData({ ...createFormData, status: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    >
                      <option value="approved">Approved (Live)</option>
                      <option value="pending">Pending Review</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Company Logo *</label>
                    <div className="relative group">
                      <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleCreateLogoChange}
                        className="hidden"
                        id="logo-create-upload"
                      />
                      <label 
                        htmlFor="logo-create-upload"
                        className="flex items-center justify-center w-full px-4 py-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer bg-white"
                      >
                        <div className="flex items-center space-x-2 text-slate-500">
                          <FaImage />
                          <span className="text-xs">Upload Logo (Max 16MB)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  {createLogoPreview && (
                    <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-inner relative">
                      <img src={createLogoPreview} alt="Logo preview" className="h-16 w-auto object-contain rounded-lg" />
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">Logo Preview</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Brief Description (Internal) *</label>
                  <textarea
                    required
                    name="description"
                    maxLength={80}
                    value={createFormData.description}
                    onChange={e => setCreateFormData({ ...createFormData, description: e.target.value })}
                    placeholder="Briefly describe the partner (max 80 chars)..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm resize-none"
                    rows={2}
                  />
                  <div className="text-[10px] text-slate-400 mt-1 text-right font-medium">
                    {createFormData.description.length}/80 characters
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl border border-slate-200 hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-70 bg-[#18264A] hover:bg-[#101c38] shadow-md shadow-slate-900/10 cursor-pointer"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : null}
                  <span>{loading ? 'Adding…' : 'Create Partner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-base">Edit Partner: {editingPartner?.businessName}</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleEditSave} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Business Name *</label>
                    <input
                      required
                      name="businessName"
                      type="text"
                      value={editFormData.businessName}
                      onChange={e => setEditFormData({ ...editFormData, businessName: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Category *</label>
                    <input
                      required
                      name="category"
                      type="text"
                      value={editFormData.category}
                      onChange={e => setEditFormData({ ...editFormData, category: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Website URL *</label>
                    <input
                      required
                      name="websiteUrl"
                      type="url"
                      value={editFormData.websiteUrl}
                      onChange={e => setEditFormData({ ...editFormData, websiteUrl: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Contact Email *</label>
                    <input
                      required
                      name="contactEmail"
                      type="email"
                      value={editFormData.contactEmail}
                      onChange={e => setEditFormData({ ...editFormData, contactEmail: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Link Placement URL *</label>
                    <input
                      required
                      name="linkPlacementUrl"
                      type="url"
                      value={editFormData.linkPlacementUrl}
                      onChange={e => setEditFormData({ ...editFormData, linkPlacementUrl: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Status *</label>
                    <select
                      value={editFormData.status}
                      onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    >
                      <option value="approved">Approved (Live)</option>
                      <option value="pending">Pending Review</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Company Logo</label>
                    <div className="relative group">
                      <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleEditLogoChange}
                        className="hidden"
                        id="logo-edit-upload"
                      />
                      <label 
                        htmlFor="logo-edit-upload"
                        className="flex items-center justify-center w-full px-4 py-3 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer bg-white"
                      >
                        <div className="flex items-center space-x-2 text-slate-500">
                          <FaImage />
                          <span className="text-xs">Change Logo (Max 16MB)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  {logoPreview && (
                    <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-inner relative">
                      <img src={logoPreview} alt="Logo preview" className="h-16 w-auto object-contain rounded-lg" />
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">Logo Preview</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Brief Description (Internal) *</label>
                  <textarea
                    required
                    name="description"
                    maxLength={80}
                    value={editFormData.description}
                    onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                    placeholder="Briefly describe the partner (max 80 chars)..."
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm resize-none"
                    rows={2}
                  />
                  <div className="text-[10px] text-slate-400 mt-1 text-right font-medium">
                    {editFormData.description.length}/80 characters
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl border border-slate-200 hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-70 bg-[#18264A] hover:bg-[#101c38] shadow-md shadow-slate-900/10 cursor-pointer"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : null}
                  <span>{loading ? 'Saving…' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </AdminLayout>
  );
};

export default AdminPartners;
