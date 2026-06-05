import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useToast } from './Toast';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaStar, FaRegStar, FaNewspaper, FaTags, FaImage, FaAlignLeft, FaUser, FaCalendarAlt } from 'react-icons/fa';

// Helper to format dates to "Month DD, YYYY"
const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  }).format(date);
};
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminResources = () => {
  const [resources, setResources] = useState([]);
  const [types, setTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isSmartFit, setIsSmartFit] = useState(false);
  const [imageSource, setImageSource] = useState('upload'); // 'upload' or 'url'

  const [formData, setFormData] = useState({ 
    title: '', 
    typeId: '', 
    richHtmlContent: '', 
    plainTextSnippet: '', 
    imageUrl: '', 
    author: 'ScaleLink Alliance', 
    isFeatured: false,
    status: 'published',
    publishedDate: new Date().toISOString().split('T')[0]
  });
  const { showToast, ToastContainer } = useToast();

  const token = localStorage.getItem('cms_token');

  useEffect(() => { fetchData(); }, [page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [r, t] = await Promise.all([
        fetch(`/api/cms/admin/resources?page=${page}&limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(x => x.json()).catch(() => ({ resources: [], totalCount: 0, totalPages: 1 })),
        fetch('/api/cms/resource-types').then(x => x.json()).catch(() => []),
      ]);
      
      if (r && r.resources) {
        setResources(r.resources);
        setTotalCount(r.totalCount);
        setTotalPages(r.totalPages);
      } else if (Array.isArray(r)) {
        // Fallback for legacy structure if needed
        setResources(r);
      }

      if (Array.isArray(t)) setTypes(t);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('Image is too large. Maximum size is 10MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const openCreate = () => {
    setEditingId(null);
    setFormData({ 
      title: '', 
      typeId: types[0]?.id || '', 
      richHtmlContent: '', 
      plainTextSnippet: '', 
      imageUrl: '', 
      author: 'ScaleLink Alliance', 
      isFeatured: false,
      status: 'published',
      publishedDate: new Date().toISOString().split('T')[0]
    });
    setIsSmartFit(false);
    setImageSource('upload');
    setIsModalOpen(true);
  };

  const openEdit = (res) => {
    setEditingId(res.id);
    setFormData({ 
      title: res.title, 
      typeId: res.typeId, 
      richHtmlContent: res.richHtmlContent || '', 
      plainTextSnippet: res.plainTextSnippet || '', 
      imageUrl: res.imageUrl || '', 
      author: res.author || 'ScaleLink Alliance', 
      isFeatured: res.isFeatured || false,
      status: res.status || 'published',
      publishedDate: res.publishedDate ? new Date(res.publishedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setIsSmartFit(res.imageUrl?.includes('#contain') || false);
    const isBase64 = res.imageUrl && res.imageUrl.startsWith('data:image/');
    setImageSource(isBase64 ? 'upload' : (res.imageUrl ? 'url' : 'upload'));
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/cms/resources/${editingId}` : '/api/cms/resources';
    const finalUrl = isSmartFit 
      ? (formData.imageUrl.includes('#contain') ? formData.imageUrl : `${formData.imageUrl.split('#')[0]}#contain`) 
      : formData.imageUrl.split('#')[0];

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, imageUrl: finalUrl }),
      });
      if (res.ok) {
        showToast(editingId ? 'Resource updated successfully!' : 'Resource created successfully!', 'success');
        setIsModalOpen(false);
        fetchData();
      } else {
        showToast('Failed to save resource.', 'error');
      }
    } catch {
      showToast('A network error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource? This cannot be undone.')) return;
    try {
      await fetch(`/api/cms/resources/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Resource deleted.', 'info');
      fetchData();
    } catch {
      showToast('Delete failed.', 'error');
    }
  };

  return (
    <AdminLayout pageTitle="Resources">
      <ToastContainer />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">All Resources</h2>
          <p className="text-sm text-slate-500">{totalCount} resource{totalCount !== 1 ? 's' : ''} published</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/hub/categories"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm"
          >
            <FaTags size={12} />
            <span>Manage Categories</span>
          </Link>
          <button
            onClick={openCreate}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-md shadow-blue-200"
            style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
          >
            <FaPlus size={12} />
            <span>New Resource</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <FaNewspaper size={28} className="text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">No resources yet</h3>
            <p className="text-slate-400 text-sm mb-5">Create your first resource to get started.</p>
            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
            >
              + Create Resource
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Image</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Published</th>
                <th className="px-4 py-3.5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Featured</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {resources.map(res => (
                <tr key={res.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    {res.status === 'published' ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">Live</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider font-mono">Draft</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {res.imageUrl ? (
                      <img src={res.imageUrl} alt={res.title} className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-100">
                        <FaImage size={14} className="text-slate-300" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <FaNewspaper size={12} className="text-blue-500" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-800 line-clamp-1">{res.title}</span>
                        {res.author && <span className="text-[10px] text-slate-400 block mt-0.5">By {res.author}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {res.type?.name || res.type?.shortForm || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                      {formatDate(res.publishedDate)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {res.isFeatured
                      ? <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><FaStar size={10} /><span>Featured</span></span>
                      : <span className="text-slate-300"><FaRegStar size={14} /></span>
                    }
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(res)}
                        className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="text-slate-700">{(page - 1) * 10 + 1}</span> to <span className="text-slate-700">{Math.min(page * 10, totalCount)}</span> of <span className="text-slate-700">{totalCount}</span> results
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`p-2 rounded-lg border transition-all ${page === 1 ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                <div className="rotate-180">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`min-w-[36px] h-9 rounded-lg text-xs font-bold transition-all ${page === n ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`p-2 rounded-lg border transition-all ${page === totalPages ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 9L7.5 6L4.5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-slate-800">{editingId ? 'Edit Resource' : 'Create New Resource'}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Fill in the details below</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors text-lg font-bold">
                ×
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Resource Title *</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. The Ultimate Networking Guide"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Category *</label>
                    <select
                      required
                      value={formData.typeId}
                      onChange={e => setFormData({ ...formData, typeId: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    >
                      <option value="" disabled>Select a category</option>
                      {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Resource Image</label>
                    
                    {/* Image Source Tabs */}
                    <div className="flex space-x-2 mb-3 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          setImageSource('upload');
                          if (formData.imageUrl && !formData.imageUrl.startsWith('data:image/')) {
                            setFormData(prev => ({ ...prev, imageUrl: '' }));
                          }
                        }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${imageSource === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Upload from PC
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageSource('url');
                          if (formData.imageUrl && formData.imageUrl.startsWith('data:image/')) {
                            setFormData(prev => ({ ...prev, imageUrl: '' }));
                          }
                        }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${imageSource === 'url' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        Image URL Link
                      </button>
                    </div>

                    {imageSource === 'upload' ? (
                      <div>
                        {formData.imageUrl && formData.imageUrl.startsWith('data:image/') ? (
                          <div className="relative border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={formData.imageUrl} 
                                alt="Preview" 
                                className="w-12 h-12 rounded-lg object-cover border border-slate-100" 
                              />
                              <div>
                                <p className="text-xs font-bold text-slate-700">Uploaded Image</p>
                                <p className="text-[9px] text-slate-400">Ready to save</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                              className="px-2.5 py-1 text-[10px] font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/10 rounded-xl p-6 bg-slate-50 cursor-pointer relative transition-all">
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageUpload} 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                            />
                            <FaImage className="text-slate-400 mb-2" size={20} />
                            <span className="text-xs font-bold text-slate-600">Click to upload image</span>
                            <span className="text-[9px] text-slate-400">PNG, JPG, JPEG, WEBP up to 10MB</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <FaImage className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                        <input
                          type="text"
                          value={formData.imageUrl ? formData.imageUrl.split('#')[0] : ''}
                          onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                          placeholder="e.g. https://images.unsplash.com/..."
                          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                        />
                      </div>
                    )}
                    
                    {/* Smart Fit Toggle */}
                    <div className="mt-4 flex items-center justify-between p-3 rounded-xl border border-blue-100 bg-blue-50/50">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSmartFit ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                          <FaImage size={10} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">Smart Fit (No Cropping)</p>
                          <p className="text-[9px] text-slate-500 leading-tight">Best for infographics or text-heavy images.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSmartFit(!isSmartFit)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isSmartFit ? 'bg-blue-600' : 'bg-slate-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${isSmartFit ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 mt-2 px-1">
                      Tip: Use **1200 x 800** (3:2 ratio) for best photographic results.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Author</label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                      <input
                        type="text"
                        value={formData.author}
                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                        placeholder="ScaleLink Alliance"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Short Card Description *</label>
                  <div className="relative">
                    <FaAlignLeft className="absolute left-3.5 top-3 text-slate-400" size={12} />
                    <textarea
                      required
                      value={formData.plainTextSnippet}
                      onChange={e => setFormData({ ...formData, plainTextSnippet: e.target.value })}
                      placeholder="Enter a brief summary that will appear on the resource card..."
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className={`p-4 rounded-xl border transition-all cursor-pointer ${formData.status === 'published' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`} onClick={() => setFormData({...formData, status: 'published'})}>
                    <div className="flex items-center space-x-3">
                      <input type="radio" checked={formData.status === 'published'} readOnly className="accent-emerald-600" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">Publish Mode</p>
                        <p className="text-[10px] text-slate-500 italic">Visible immediately on the website</p>
                      </div>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl border transition-all cursor-pointer ${formData.status === 'draft' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`} onClick={() => setFormData({...formData, status: 'draft'})}>
                    <div className="flex items-center space-x-3">
                      <input type="radio" checked={formData.status === 'draft'} readOnly className="accent-amber-600" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">Draft Mode</p>
                        <p className="text-[10px] text-slate-500 italic">Work in progress (Hidden from site)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Published Date *</label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                    <input
                      required
                      type="date"
                      value={formData.publishedDate}
                      onChange={e => setFormData({ ...formData, publishedDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 px-1">Tip: This is the date members will see as the "Published" date on the website.</p>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-xl bg-amber-50/30 border border-amber-100">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <label htmlFor="featured" className="cursor-pointer">
                    <p className="text-sm font-semibold text-amber-800">Set as Featured Resource</p>
                    <p className="text-[10px] text-amber-600">Prominently displayed on the Resources page (Only 1 active at a time).</p>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Article Content (Rich Text) *</label>
                  <div className="quill-editor-container border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-slate-50">
                    <ReactQuill 
                      theme="snow"
                      value={formData.richHtmlContent}
                      onChange={(val) => setFormData({ ...formData, richHtmlContent: val })}
                      modules={{
                        toolbar: [
                          [{ 'header': [2, 3, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                          ['link', 'clean']
                        ],
                      }}
                      formats={[
                        'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link'
                      ]}
                      placeholder="Write your article content here..."
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 px-1">Tip: Use the toolbar above to format your article professionally. No HTML knowledge required!</p>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl border border-slate-200 hover:bg-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : null}
                  <span>{loading ? 'Saving…' : (editingId ? 'Save Changes' : 'Create Resource')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminResources;
