import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useToast } from './Toast';
import { Link } from 'react-router-dom';
import {
  FaPlus, FaEdit, FaTrash, FaStar, FaEye, FaSearch, FaCogs,
  FaCheck, FaTimes, FaImage, FaLayerGroup, FaTags, FaDollarSign,
  FaFileAlt, FaTools, FaLink, FaExternalLinkAlt, FaCloudUploadAlt,
  FaShieldAlt, FaChartLine, FaRobot, FaArrowRight, FaUndo, FaSave
} from 'react-icons/fa';
import { AVAILABLE_SERVICE_ICONS, getServiceIcon } from '../../utils/serviceIcons';
import { broadcastServiceUpdate } from '../../utils/serviceSync';

const CATEGORY_OPTIONS = [
  { id: 'creative-support', name: 'Creative & Support' },
  { id: 'websites-development', name: 'Websites & Development' },
  { id: 'marketing-growth', name: 'Marketing & Growth' },
  { id: 'automation-technology', name: 'Automation & Technology' }
];

const INITIAL_SERVICE_STATE = {
  title: '',
  slug: '',
  category: 'creative-support',
  isCustomQuote: false,
  showOnCatalogGrid: true,
  iconName: 'FaCogs',
  startingPrice: '$35',
  intro: '',
  description: '',
  longDescription: '',
  features: [],
  whatItHelpsAchieve: [],
  howMeasured: [],
  servicesInclude: [],
  tools: [],
  sellerInfo: {
    name: 'ScaleLink Alliance Team',
    level: 'Professional',
    rating: 4.9,
    reviews: 150,
    ordersInQueue: 4,
    verified: true
  },
  complementaryServices: [],
  packages: {
    starter: { name: 'Starter Package', price: '$35', description: '', includes: [] },
    growth: { name: 'Standard Package', price: '$175', description: '', includes: [] },
    premium: { name: 'Premium Package', price: '$499', description: '', includes: [] }
  },
  packageComparison: {
    tiers: ['basic', 'standard', 'premium'],
    rows: [],
    details: {
      basic: { price: '$35', packageName: 'Starter Package', shortDescription: '', description: '', deliveryLabel: 'Shown during service selection', revisions: '1 revision round', includes: [] },
      standard: { price: '$175', packageName: 'Standard Package', shortDescription: '', description: '', deliveryLabel: 'Shown during service selection', revisions: '2 revision rounds', includes: [] },
      premium: { price: '$499', packageName: 'Premium Package', shortDescription: '', description: '', deliveryLabel: 'Shown during service selection', revisions: 'Priority revisions', includes: [] }
    }
  },
  sampleProject: {
    projectName: '',
    businessType: '',
    projectSummary: '',
    servicesIncluded: [],
    portfolioCardText: ''
  },
  mainImage: '',
  galleryImages: [],
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  sortOrder: 0,
  status: 'published'
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Search, Filter & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('core');
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_SERVICE_STATE);

  // Temporary item adders
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newAchieveText, setNewAchieveText] = useState('');
  const [newMeasuredText, setNewMeasuredText] = useState('');
  const [newServiceIncludeText, setNewServiceIncludeText] = useState('');
  const [newToolText, setNewToolText] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newCompServiceName, setNewCompServiceName] = useState('');
  const [newCompServiceReason, setNewCompServiceReason] = useState('');
  const [newComparisonRowLabel, setNewComparisonRowLabel] = useState('');

  // Package item adders
  const [newStarterInclude, setNewStarterInclude] = useState('');
  const [newGrowthInclude, setNewGrowthInclude] = useState('');
  const [newPremiumInclude, setNewPremiumInclude] = useState('');

  const { showToast, ToastContainer } = useToast();
  const token = localStorage.getItem('cms_token');

  useEffect(() => {
    fetchServices();
  }, [page, categoryFilter, statusFilter]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      let url = `/api/cms/admin/services?page=${page}&limit=15`;
      if (categoryFilter !== 'all') url += `&category=${categoryFilter}`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      if (searchQuery.trim()) url += `&search=${encodeURIComponent(searchQuery.trim())}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('cms_token')}` }
      });
      const data = await res.json();

      if (res.ok && data.services) {
        setServices(data.services);
        setTotalCount(data.totalCount || data.services.length);
        setTotalPages(data.totalPages || 1);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
      showToast('Error loading services', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchServices();
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      ...INITIAL_SERVICE_STATE,
      sortOrder: totalCount + 1
    });
    setActiveTab('core');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (svc) => {
    setEditingId(svc.id);
    
    const parsedFeatures = Array.isArray(svc.features) ? svc.features : [];
    const parsedAchieve = Array.isArray(svc.whatItHelpsAchieve) ? svc.whatItHelpsAchieve : [];
    const parsedMeasured = Array.isArray(svc.howMeasured) ? svc.howMeasured : [];
    const parsedInclude = Array.isArray(svc.servicesInclude) ? svc.servicesInclude : [];
    const parsedTools = Array.isArray(svc.tools) ? svc.tools : [];
    const parsedComp = Array.isArray(svc.complementaryServices) ? svc.complementaryServices : [];
    const parsedGallery = Array.isArray(svc.galleryImages) ? svc.galleryImages : [];
    const parsedPackages = (typeof svc.packages === 'object' && svc.packages) ? svc.packages : INITIAL_SERVICE_STATE.packages;
    const parsedComparison = (typeof svc.packageComparison === 'object' && svc.packageComparison) ? svc.packageComparison : INITIAL_SERVICE_STATE.packageComparison;
    const parsedSampleProject = (typeof svc.sampleProject === 'object' && svc.sampleProject) ? svc.sampleProject : INITIAL_SERVICE_STATE.sampleProject;

    setFormData({
      ...INITIAL_SERVICE_STATE,
      ...svc,
      features: parsedFeatures,
      whatItHelpsAchieve: parsedAchieve,
      howMeasured: parsedMeasured,
      servicesInclude: parsedInclude,
      tools: parsedTools,
      complementaryServices: parsedComp,
      galleryImages: parsedGallery,
      packages: parsedPackages,
      packageComparison: parsedComparison,
      sampleProject: parsedSampleProject
    });

    setActiveTab('core');
    setIsModalOpen(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Service title is required.', 'error');
      setActiveTab('core');
      return;
    }

    setSaving(true);
    try {
      const currentToken = localStorage.getItem('cms_token');
      const url = editingId ? `/api/cms/services/${editingId}` : '/api/cms/services';
      const method = editingId ? 'PUT' : 'POST';

      // 1. Calculate Starting Price Tag from Tab 1 / Tab 2
      const calculatedStartingPrice = formData.isCustomQuote
        ? 'Custom Quote'
        : (formData.packages?.starter?.price || '$35');

      // 2. Synchronize Tab 2 package tiers into Tab 3 packageComparison.details
      const existingDetails = formData.packageComparison?.details || {};
      const syncedComparison = {
        ...(formData.packageComparison || { tiers: ['basic', 'standard', 'premium'], rows: [] }),
        details: {
          basic: {
            ...existingDetails.basic,
            price: formData.packages?.starter?.price || '$35',
            packageName: formData.packages?.starter?.name || 'Starter Package',
            shortDescription: formData.packages?.starter?.description || '',
            deliveryLabel: existingDetails.basic?.deliveryLabel || 'Shown during service selection',
            revisions: existingDetails.basic?.revisions || '1 revision round',
            includes: formData.packages?.starter?.includes || []
          },
          standard: {
            ...existingDetails.standard,
            price: formData.packages?.growth?.price || '$175',
            packageName: formData.packages?.growth?.name || 'Standard Package',
            shortDescription: formData.packages?.growth?.description || '',
            deliveryLabel: existingDetails.standard?.deliveryLabel || 'Shown during service selection',
            revisions: existingDetails.standard?.revisions || '2 revision rounds',
            includes: formData.packages?.growth?.includes || []
          },
          premium: {
            ...existingDetails.premium,
            price: formData.packages?.premium?.price || '$499',
            packageName: formData.packages?.premium?.name || 'Premium Package',
            shortDescription: formData.packages?.premium?.description || '',
            deliveryLabel: existingDetails.premium?.deliveryLabel || 'Shown during service selection',
            revisions: existingDetails.premium?.revisions || 'Priority revisions',
            includes: formData.packages?.premium?.includes || []
          }
        }
      };

      const payload = {
        ...formData,
        startingPrice: calculatedStartingPrice,
        packageComparison: syncedComparison
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        showToast(editingId ? 'Service updated successfully!' : 'Service created successfully!', 'success');
        setIsModalOpen(false);
        fetchServices();
        broadcastServiceUpdate(editingId);
      } else {
        showToast(data.error || 'Failed to save service.', 'error');
      }
    } catch (err) {
      console.error('Save service error:', err);
      showToast('An error occurred while saving the service.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async () => {
    if (!deletingId) return;

    try {
      const res = await fetch(`/api/cms/services/${deletingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('cms_token')}` }
      });

      if (res.ok) {
        showToast('Service deleted successfully.', 'success');
        setIsDeleteModalOpen(false);
        const removedId = deletingId;
        setDeletingId(null);
        if (services.length === 1 && page > 1) {
          setPage(prev => Math.max(1, prev - 1));
        } else {
          fetchServices();
        }
        broadcastServiceUpdate(removedId);
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to delete service.', 'error');
      }
    } catch (err) {
      showToast('Error deleting service.', 'error');
    }
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append('files', file);

      const res = await fetch('/api/upload-files', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();

      if (res.ok && data.fileUrls && data.fileUrls.length > 0) {
        setFormData(prev => ({ ...prev, mainImage: data.fileUrls[0].url }));
        showToast('Cover image uploaded!', 'success');
      } else {
        showToast(data.error || 'Failed to upload image.', 'error');
      }
    } catch (err) {
      showToast('Error uploading image.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploadingGallery(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));

      const res = await fetch('/api/upload-files', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();

      if (res.ok && data.fileUrls) {
        const newUrls = data.fileUrls.map(f => f.url);
        setFormData(prev => ({
          ...prev,
          galleryImages: [...prev.galleryImages, ...newUrls]
        }));
        showToast(`${newUrls.length} gallery image(s) uploaded!`, 'success');
      } else {
        showToast(data.error || 'Failed to upload gallery images.', 'error');
      }
    } catch (err) {
      showToast('Error uploading gallery images.', 'error');
    } finally {
      setUploadingGallery(false);
    }
  };

  const addGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      galleryImages: [...prev.galleryImages, newGalleryUrl.trim()]
    }));
    setNewGalleryUrl('');
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== index)
    }));
  };

  const addItem = (field, text, setter) => {
    if (!text.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), text.trim()]
    }));
    setter('');
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, idx) => idx !== index)
    }));
  };

  const addPackageInclude = (pkgKey, text, setter) => {
    if (!text.trim()) return;
    setFormData(prev => {
      const currentPkg = prev.packages?.[pkgKey] || {};
      const currentIncludes = currentPkg.includes || [];
      return {
        ...prev,
        packages: {
          ...prev.packages,
          [pkgKey]: {
            ...currentPkg,
            includes: [...currentIncludes, text.trim()]
          }
        }
      };
    });
    setter('');
  };

  const removePackageInclude = (pkgKey, index) => {
    setFormData(prev => {
      const currentPkg = prev.packages?.[pkgKey] || {};
      return {
        ...prev,
        packages: {
          ...prev.packages,
          [pkgKey]: {
            ...currentPkg,
            includes: (currentPkg.includes || []).filter((_, idx) => idx !== index)
          }
        }
      };
    });
  };

  const addComparisonRow = () => {
    if (!newComparisonRowLabel.trim()) return;
    const newRow = {
      label: newComparisonRowLabel.trim(),
      values: { basic: true, standard: true, premium: true }
    };
    setFormData(prev => {
      const existingComp = prev.packageComparison || { tiers: ['basic', 'standard', 'premium'], rows: [], details: {} };
      return {
        ...prev,
        packageComparison: {
          ...existingComp,
          rows: [...(existingComp.rows || []), newRow]
        }
      };
    });
    setNewComparisonRowLabel('');
  };

  const toggleComparisonValue = (rowIndex, tier) => {
    setFormData(prev => {
      const existingComp = prev.packageComparison || { tiers: ['basic', 'standard', 'premium'], rows: [], details: {} };
      const updatedRows = [...(existingComp.rows || [])];
      if (updatedRows[rowIndex]) {
        const currentVal = updatedRows[rowIndex].values?.[tier];
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          values: {
            ...updatedRows[rowIndex].values,
            [tier]: !currentVal
          }
        };
      }
      return {
        ...prev,
        packageComparison: {
          ...existingComp,
          rows: updatedRows
        }
      };
    });
  };

  const removeComparisonRow = (index) => {
    setFormData(prev => {
      const existingComp = prev.packageComparison || { tiers: ['basic', 'standard', 'premium'], rows: [], details: {} };
      return {
        ...prev,
        packageComparison: {
          ...existingComp,
          rows: (existingComp.rows || []).filter((_, idx) => idx !== index)
        }
      };
    });
  };

  const addCompService = () => {
    if (!newCompServiceName.trim()) return;
    setFormData(prev => ({
      ...prev,
      complementaryServices: [
        ...(prev.complementaryServices || []),
        { name: newCompServiceName.trim(), reason: newCompServiceReason.trim() || 'complementary solution' }
      ]
    }));
    setNewCompServiceName('');
    setNewCompServiceReason('');
  };

  const removeCompService = (index) => {
    setFormData(prev => ({
      ...prev,
      complementaryServices: prev.complementaryServices.filter((_, idx) => idx !== index)
    }));
  };

  return (
    <AdminLayout>
      <ToastContainer />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <FaCogs size={24} />
              </span>
              Services Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Create, update, and manage services, 3-tier packages, comparison matrices, galleries, and custom quote settings.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/25 transition-all text-sm shrink-0 cursor-pointer"
          >
            <FaPlus size={14} />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search services by title or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-500 text-xs" />
          </form>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {CATEGORY_OPTIONS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Services Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-4 px-5">Service & Slug</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Type & Pricing</th>
                  <th className="py-4 px-4">Catalog Grid</th>
                  <th className="py-4 px-4">Gallery</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500">
                      <div className="inline-flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading services...</span>
                      </div>
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-500">
                      No services found. Click "Add New Service" to create one.
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 shrink-0">
                            {getServiceIcon(service.iconName, { size: 16 })}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-white truncate max-w-xs">{service.title}</div>
                            <div className="text-xs text-slate-500 font-mono truncate max-w-xs">/services/{service.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 capitalize">
                          {(service.category || 'creative-support').replace(/-/g, ' ')}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        {service.isCustomQuote ? (
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-900/40 text-purple-300 border border-purple-700/50">
                            Custom Quote
                          </span>
                        ) : (
                          <div className="font-semibold text-emerald-400">
                            {service.startingPrice || 'From $35'}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        {service.showOnCatalogGrid ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                            <FaCheck size={10} /> Shown
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            Hidden (Direct only)
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-400">
                        {Array.isArray(service.galleryImages) ? service.galleryImages.length : 0} items
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          service.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {service.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/services/${service.slug}`}
                            target="_blank"
                            title="View Live Page"
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          >
                            <FaEye size={14} />
                          </Link>
                          <button
                            onClick={() => handleOpenEditModal(service)}
                            title="Edit Service"
                            className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => { setDeletingId(service.id); setIsDeleteModalOpen(true); }}
                            title="Delete Service"
                            className="p-2 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>Showing page {page} of {totalPages} ({totalCount} total services)</div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CREATE / EDIT MULTI-TAB MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-blue-400">{editingId ? <FaEdit /> : <FaPlus />}</span>
                  {editingId ? `Edit Service: ${formData.title}` : 'Create New Service'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure details, packages, comparison matrices, highlight tags, and galleries.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <FaTimes size={16} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 overflow-x-auto shrink-0 px-4 pt-2 gap-2 text-xs sm:text-sm font-semibold">
              {[
                { id: 'core', label: '1. Core Details' },
                { id: 'packages', label: '2. Packages & Pricing' },
                { id: 'comparison', label: '3. Comparison Matrix' },
                { id: 'highlights', label: '4. Highlights & Metas' },
                { id: 'media', label: `5. Gallery (${formData.galleryImages?.length || 0})` },
                { id: 'seo', label: '6. SEO & Metadata' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2.5 px-4 rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveService} className="p-6 overflow-y-auto flex-grow space-y-6">
              {/* TAB 1: CORE DETAILS */}
              {activeTab === 'core' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Service Title *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            title: val,
                            slug: prev.slug ? prev.slug : val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')
                          }));
                        }}
                        placeholder="e.g. Website Development"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">URL Slug *</label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="e.g. website-development"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                      >
                        {CATEGORY_OPTIONS.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Icon</label>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-blue-400 shrink-0">
                          {getServiceIcon(formData.iconName, { size: 16 })}
                        </div>
                        <select
                          value={formData.iconName}
                          onChange={(e) => setFormData(prev => ({ ...prev, iconName: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                          {AVAILABLE_SERVICE_ICONS.map(i => (
                            <option key={i.name} value={i.name}>{i.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Starting Price Tag</label>
                        <span className="text-[10px] text-blue-400 font-medium">Auto (Tier 1 Starter)</span>
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={formData.isCustomQuote ? 'Custom Quote' : (formData.packages?.starter?.price || '$35')}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 font-medium cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  {/* Mode and Visibility Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isCustomQuote"
                        checked={formData.isCustomQuote}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          isCustomQuote: e.target.checked,
                          startingPrice: e.target.checked ? 'Custom Quote' : prev.startingPrice
                        }))}
                        className="w-5 h-5 rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-900 cursor-pointer"
                      />
                      <label htmlFor="isCustomQuote" className="text-xs text-slate-200 font-semibold cursor-pointer">
                        Custom Quote Service
                        <span className="block text-[11px] font-normal text-slate-400">Routes to custom inquiry questionnaire</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="showOnCatalogGrid"
                        checked={formData.showOnCatalogGrid}
                        onChange={(e) => setFormData(prev => ({ ...prev, showOnCatalogGrid: e.target.checked }))}
                        className="w-5 h-5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900 cursor-pointer"
                      />
                      <label htmlFor="showOnCatalogGrid" className="text-xs text-slate-200 font-semibold cursor-pointer">
                        Show on /services Grid
                        <span className="block text-[11px] font-normal text-slate-400">Display card on catalog landing page</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Short Intro</label>
                    <textarea
                      rows="2"
                      value={formData.intro}
                      onChange={(e) => setFormData(prev => ({ ...prev, intro: e.target.value }))}
                      placeholder="e.g. Strong visual design helps businesses communicate clearly..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Overview Description</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed overview for the service..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Long Description</label>
                    <textarea
                      rows="4"
                      value={formData.longDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                      placeholder="In-depth explanation of how ScaleLink Alliance delivers this service..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PACKAGES */}
              {activeTab === 'packages' && (
                <div className="space-y-6">
                  <p className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    Configure the 3 package tiers (Starter, Standard/Growth, Premium) displayed on the service detail page and sidebar checkout.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Starter */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Tier 1: Starter</h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 font-mono">starter</span>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Package Name</label>
                        <input
                          type="text"
                          value={formData.packages?.starter?.name || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            packages: {
                              ...prev.packages,
                              starter: { ...prev.packages?.starter, name: e.target.value }
                            }
                          }))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Price Tag</label>
                        <input
                          type="text"
                          value={formData.packages?.starter?.price || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            packages: {
                              ...prev.packages,
                              starter: { ...prev.packages?.starter, price: e.target.value }
                            }
                          }))}
                          placeholder="$35"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Description</label>
                        <textarea
                          rows="2"
                          value={formData.packages?.starter?.description || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            packages: {
                              ...prev.packages,
                              starter: { ...prev.packages?.starter, description: e.target.value }
                            }
                          }))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Included Items</label>
                        <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto pr-1">
                          {(formData.packages?.starter?.includes || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-900 text-xs text-slate-300">
                              <span className="truncate">{item}</span>
                              <button type="button" onClick={() => removePackageInclude('starter', idx)} className="text-rose-400 hover:text-rose-300 shrink-0 cursor-pointer">
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add item..."
                            value={newStarterInclude}
                            onChange={(e) => setNewStarterInclude(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPackageInclude('starter', newStarterInclude, setNewStarterInclude); } }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                          <button type="button" onClick={() => addPackageInclude('starter', newStarterInclude, setNewStarterInclude)} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs shrink-0 cursor-pointer">
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Growth */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Tier 2: Standard</h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 font-mono">growth</span>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Package Name</label>
                        <input
                          type="text"
                          value={formData.packages?.growth?.name || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            packages: {
                              ...prev.packages,
                              growth: { ...prev.packages?.growth, name: e.target.value }
                            }
                          }))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Price Tag</label>
                        <input
                          type="text"
                          value={formData.packages?.growth?.price || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            packages: {
                              ...prev.packages,
                              growth: { ...prev.packages?.growth, price: e.target.value }
                            }
                          }))}
                          placeholder="$175"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Description</label>
                        <textarea
                          rows="2"
                          value={formData.packages?.growth?.description || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            packages: {
                              ...prev.packages,
                              growth: { ...prev.packages?.growth, description: e.target.value }
                            }
                          }))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Included Items</label>
                        <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto pr-1">
                          {(formData.packages?.growth?.includes || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-900 text-xs text-slate-300">
                              <span className="truncate">{item}</span>
                              <button type="button" onClick={() => removePackageInclude('growth', idx)} className="text-rose-400 hover:text-rose-300 shrink-0 cursor-pointer">
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add item..."
                            value={newGrowthInclude}
                            onChange={(e) => setNewGrowthInclude(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPackageInclude('growth', newGrowthInclude, setNewGrowthInclude); } }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                          <button type="button" onClick={() => addPackageInclude('growth', newGrowthInclude, setNewGrowthInclude)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs shrink-0 cursor-pointer">
                            Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Premium */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Tier 3: Premium</h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 font-mono">premium</span>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Package Name</label>
                        <input
                          type="text"
                          value={formData.packages?.premium?.name || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            packages: {
                              ...prev.packages,
                              premium: { ...prev.packages?.premium, name: e.target.value }
                            }
                          }))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Price Tag</label>
                        <input
                          type="text"
                          value={formData.packages?.premium?.price || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            packages: {
                              ...prev.packages,
                              premium: { ...prev.packages?.premium, price: e.target.value }
                            }
                          }))}
                          placeholder="$499"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Description</label>
                        <textarea
                          rows="2"
                          value={formData.packages?.premium?.description || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            packages: {
                              ...prev.packages,
                              premium: { ...prev.packages?.premium, description: e.target.value }
                            }
                          }))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Included Items</label>
                        <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto pr-1">
                          {(formData.packages?.premium?.includes || []).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded bg-slate-900 text-xs text-slate-300">
                              <span className="truncate">{item}</span>
                              <button type="button" onClick={() => removePackageInclude('premium', idx)} className="text-rose-400 hover:text-rose-300 shrink-0 cursor-pointer">
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add item..."
                            value={newPremiumInclude}
                            onChange={(e) => setNewPremiumInclude(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addPackageInclude('premium', newPremiumInclude, setNewPremiumInclude); } }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                          <button type="button" onClick={() => addPackageInclude('premium', newPremiumInclude, setNewPremiumInclude)} className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs shrink-0 cursor-pointer">
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: COMPARISON */}
              {activeTab === 'comparison' && (
                <div className="space-y-5">
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Feature / Deliverable</th>
                          <th className="py-3 px-3 text-center">Basic / Starter</th>
                          <th className="py-3 px-3 text-center">Standard / Growth</th>
                          <th className="py-3 px-3 text-center">Premium</th>
                          <th className="py-3 px-3 text-right">Remove</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {(formData.packageComparison?.rows || []).map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/50">
                            <td className="py-3 px-4 font-medium text-white">{row.label}</td>
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={!!row.values?.basic}
                                onChange={() => toggleComparisonValue(rIdx, 'basic')}
                                className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                              />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={!!row.values?.standard}
                                onChange={() => toggleComparisonValue(rIdx, 'standard')}
                                className="w-4 h-4 rounded text-emerald-600 bg-slate-900 border-slate-700"
                              />
                            </td>
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={!!row.values?.premium}
                                onChange={() => toggleComparisonValue(rIdx, 'premium')}
                                className="w-4 h-4 rounded text-purple-600 bg-slate-900 border-slate-700"
                              />
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() => removeComparisonRow(rIdx)}
                                className="text-rose-400 hover:text-rose-300 cursor-pointer"
                              >
                                <FaTrash size={12} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <input
                      type="text"
                      placeholder="New comparison feature label..."
                      value={newComparisonRowLabel}
                      onChange={(e) => setNewComparisonRowLabel(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addComparisonRow(); } }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-xs sm:text-sm text-white"
                    />
                    <button
                      type="button"
                      onClick={addComparisonRow}
                      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shrink-0 cursor-pointer"
                    >
                      Add Row
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: HIGHLIGHTS */}
              {activeTab === 'highlights' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">What It Helps Businesses Achieve</h3>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {(formData.whatItHelpsAchieve || []).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded bg-slate-900 text-xs text-slate-300">
                            <span className="truncate">{item}</span>
                            <button type="button" onClick={() => removeItem('whatItHelpsAchieve', idx)} className="text-rose-400 hover:text-rose-300 shrink-0 cursor-pointer">
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. strengthen brand recognition..."
                          value={newAchieveText}
                          onChange={(e) => setNewAchieveText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('whatItHelpsAchieve', newAchieveText, setNewAchieveText); } }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                        <button type="button" onClick={() => addItem('whatItHelpsAchieve', newAchieveText, setNewAchieveText)} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs shrink-0 cursor-pointer">
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">How This Service Is Measured</h3>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {(formData.howMeasured || []).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded bg-slate-900 text-xs text-slate-300">
                            <span className="truncate">{item}</span>
                            <button type="button" onClick={() => removeItem('howMeasured', idx)} className="text-rose-400 hover:text-rose-300 shrink-0 cursor-pointer">
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. number of assets created..."
                          value={newMeasuredText}
                          onChange={(e) => setNewMeasuredText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('howMeasured', newMeasuredText, setNewMeasuredText); } }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                        <button type="button" onClick={() => addItem('howMeasured', newMeasuredText, setNewMeasuredText)} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs shrink-0 cursor-pointer">
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Services Included</h3>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {(formData.servicesInclude || []).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded bg-slate-900 text-xs text-slate-300">
                            <span className="truncate">{item}</span>
                            <button type="button" onClick={() => removeItem('servicesInclude', idx)} className="text-rose-400 hover:text-rose-300 shrink-0 cursor-pointer">
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Social media graphics..."
                          value={newServiceIncludeText}
                          onChange={(e) => setNewServiceIncludeText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('servicesInclude', newServiceIncludeText, setNewServiceIncludeText); } }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                        <button type="button" onClick={() => addItem('servicesInclude', newServiceIncludeText, setNewServiceIncludeText)} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs shrink-0 cursor-pointer">
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tools & Technologies</h3>
                      <div className="flex flex-wrap gap-2 mb-2 max-h-36 overflow-y-auto">
                        {(formData.tools || []).map((tool, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 text-xs text-slate-200 border border-slate-800">
                            {tool}
                            <button type="button" onClick={() => removeItem('tools', idx)} className="text-rose-400 hover:text-rose-300 cursor-pointer">
                              <FaTimes size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Figma, React..."
                          value={newToolText}
                          onChange={(e) => setNewToolText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem('tools', newToolText, setNewToolText); } }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                        <button type="button" onClick={() => addItem('tools', newToolText, setNewToolText)} className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs shrink-0 cursor-pointer">
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Complementary Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      {(formData.complementaryServices || []).map((comp, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                          <div>
                            <div className="font-bold text-white">{comp.name}</div>
                            <div className="text-slate-400 text-[11px]">{comp.reason}</div>
                          </div>
                          <button type="button" onClick={() => removeCompService(idx)} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
                            <FaTrash size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Service Name (e.g. Brand Identity)"
                        value={newCompServiceName}
                        onChange={(e) => setNewCompServiceName(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="Reason (e.g. consistent branding)"
                        value={newCompServiceReason}
                        onChange={(e) => setNewCompServiceReason(e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      <button type="button" onClick={addCompService} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer">
                        Add Complementary
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MEDIA */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <FaImage className="text-blue-400" />
                      Main Cover Image
                    </h3>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      {formData.mainImage && (
                        <div className="w-48 h-32 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-900">
                          <img src={formData.mainImage} alt="Cover Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="space-y-3 flex-grow w-full">
                        <input
                          type="text"
                          placeholder="Direct image URL (e.g. https://... or /images/...)"
                          value={formData.mainImage || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, mainImage: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white font-mono"
                        />
                        <div>
                          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer border border-slate-700">
                            <FaCloudUploadAlt size={16} />
                            <span>{uploadingImage ? 'Uploading...' : 'Upload Cover Image'}</span>
                            <input type="file" accept="image/*" onChange={handleMainImageUpload} disabled={uploadingImage} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                          <FaLayerGroup className="text-emerald-400" />
                          Gallery Showcase Images ({formData.galleryImages?.length || 0})
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          High-resolution portfolio images displayed in the lightbox gallery on /services/:slug.
                        </p>
                      </div>

                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-md shrink-0">
                        <FaCloudUploadAlt size={16} />
                        <span>{uploadingGallery ? 'Uploading...' : 'Upload Gallery Files'}</span>
                        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploadingGallery} className="hidden" />
                      </label>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add gallery image URL..."
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addGalleryUrl(); } }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white font-mono"
                      />
                      <button type="button" onClick={addGalleryUrl} className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shrink-0 cursor-pointer">
                        Add URL
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-1">
                      {(formData.galleryImages || []).map((imgUrl, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-900 aspect-video shadow-md">
                          <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 cursor-pointer"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-slate-300">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Search Engine Optimization (SEO)</h3>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">SEO Title</label>
                      <input
                        type="text"
                        value={formData.seoTitle || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">SEO Meta Description</label>
                      <textarea
                        rows="2"
                        value={formData.seoDescription || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Keywords</label>
                      <input
                        type="text"
                        value={formData.seoKeywords || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white"
                      />
                    </div>
                  </div>

                  </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between bg-slate-900">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 cursor-pointer disabled:opacity-50"
                >
                  <FaSave size={14} />
                  <span>{saving ? 'Saving Service...' : 'Save & Publish Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-3 rounded-xl bg-rose-950 border border-rose-800">
                <FaTrash size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Service?</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              Are you sure you want to permanently delete this service and its packages from the database?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteService}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-600/25 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminServices;
