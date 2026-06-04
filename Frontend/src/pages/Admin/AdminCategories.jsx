import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { useToast } from './Toast';
import { FaTags, FaPlus, FaTrash } from 'react-icons/fa';

const AdminCategories = () => {
  const [types, setTypes] = useState([]);
  const [name, setName] = useState('');
  const [shortForm, setShortForm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [resourceCount, setResourceCount] = useState(0);
  const [moveToId, setMoveToId] = useState('');

  const { showToast, ToastContainer } = useToast();
  const token = localStorage.getItem('cms_token');

  useEffect(() => { fetchTypes(); }, []);

  const fetchTypes = async () => {
    const data = await fetch('/api/cms/resource-types').then(r => r.json()).catch(() => []);
    if (Array.isArray(data)) setTypes(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/cms/resource-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, shortForm }),
      });
      if (res.ok) {
        setName('');
        setShortForm('');
        showToast('Category added successfully!', 'success');
        fetchTypes();
      } else {
        showToast('Failed to add category.', 'error');
      }
    } catch {
      showToast('A network error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (category) => {
    try {
      const res = await fetch(`/api/cms/resource-types/${category.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.status === 409) {
        setCategoryToDelete(category);
        setResourceCount(data.count);
        setShowDeleteModal(true);
      } else if (res.ok) {
        showToast('Category deleted successfully.', 'success');
        fetchTypes();
      } else {
        // Detailed error from backend
        showToast(data.message || data.error || 'Failed to delete category.', 'error');
      }
    } catch (err) {
      showToast('Error connecting to server.', 'error');
    }
  };

  const confirmMigrationDeletion = async () => {
    if (!moveToId) return showToast('Please select a target category.', 'error');
    
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/resource-types/${categoryToDelete.id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ moveToId })
      });
      const data = await res.json();
      
      if (res.ok) {
        showToast('Resources migrated and category deleted.', 'success');
        setShowDeleteModal(false);
        setCategoryToDelete(null);
        setMoveToId('');
        fetchTypes();
      } else {
        // Detailed error from backend
        showToast(data.message || data.error || 'Failed to migrate resources.', 'error');
      }
    } catch {
      showToast('A network error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout pageTitle="Categories">
      <ToastContainer />

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Resource Categories</h2>
        <p className="text-sm text-slate-500">{types.length} categor{types.length !== 1 ? 'ies' : 'y'} defined</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Existing categories list */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">Existing Categories</h3>
            </div>

            {types.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <FaTags size={24} className="text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">No categories yet</p>
                <p className="text-xs text-slate-400 mt-1">Add your first category using the form →</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-50">
                {types.map((t) => (
                  <li key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/80 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-blue-50 text-blue-600">
                        <FaTags />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{t.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Badge label: <span className="font-medium text-slate-600">{t.shortForm}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                        {t.shortForm}
                      </span>
                      <button 
                        onClick={() => handleDeleteClick(t)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Category"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Add new category form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div
              className="px-6 py-4 border-b border-slate-100"
              style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' }}
            >
              <h3 className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <FaPlus size={11} />
                <span>Add New Category</span>
              </h3>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Guides & Templates"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Short Badge Label *
                </label>
                <input
                  required
                  type="text"
                  value={shortForm}
                  onChange={e => setShortForm(e.target.value)}
                  placeholder="e.g. Guide"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-70 mt-2 hover:shadow-lg active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : <FaPlus size={12} />}
                <span>{loading ? 'Adding…' : 'Add Category'}</span>
              </button>
            </form>
          </div>

          <div className="mt-4 p-4 rounded-2xl border border-blue-100 bg-blue-50">
            <p className="text-xs font-semibold text-blue-700 mb-1">💡 Tip</p>
            <p className="text-xs text-blue-600 leading-relaxed">
              Categories appear as filter tabs on your public Resources page. The badge label is shown on each resource card.
            </p>
          </div>
        </div>
      </div>
      {/* Migration Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in shadow-2xl">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-sm">
                <FaTrash size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 text-center mb-2">Category Not Empty</h3>
              <p className="text-sm text-slate-500 text-center leading-relaxed">
                <span className="font-bold text-slate-700">"{categoryToDelete?.name}"</span> contains 
                <span className="font-bold text-blue-600 mx-1">{resourceCount}</span> resources. 
                Please choose where to move them before deleting.
              </p>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                  Reassign to Category:
                </label>
                <select
                  value={moveToId}
                  onChange={e => setMoveToId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                >
                  <option value="">-- Select a target category --</option>
                  {types
                    .filter(t => t.id !== categoryToDelete?.id)
                    .map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))
                  }
                </select>
                {types.length <= 1 && (
                  <p className="mt-3 text-xs text-rose-500 font-medium">
                    You cannot delete this category because there are no other categories to move resources to. Add another category first.
                  </p>
                )}
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => { setShowDeleteModal(false); setMoveToId(''); }}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  disabled={loading || !moveToId}
                  onClick={confirmMigrationDeletion}
                  className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  {loading ? 'Moving...' : 'Migrate & Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;

