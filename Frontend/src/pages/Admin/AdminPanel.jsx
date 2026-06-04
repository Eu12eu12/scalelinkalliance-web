import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const [resources, setResources] = useState([]);
  const [types, setTypes] = useState([]);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({ title: '', typeId: '', richHtmlContent: '', isFeatured: false });
  const [loading, setLoading] = useState(false);

  // New Category State
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeShort, setNewTypeShort] = useState('');

  const token = localStorage.getItem('cms_token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resReq, typeReq] = await Promise.all([
        fetch('/api/cms/resources'),
        fetch('/api/cms/resource-types')
      ]);
      const resData = await resReq.json();
      const typeData = await typeReq.json();
      if (resReq.ok) setResources(resData);
      if (typeReq.ok) setTypes(typeData);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  const handleOpenModal = (resource = null) => {
    if (resource) {
      setEditingResource(resource.id);
      setFormData({
        title: resource.title,
        typeId: resource.typeId,
        richHtmlContent: resource.richHtmlContent,
        isFeatured: resource.isFeatured
      });
    } else {
      setEditingResource(null);
      setFormData({ title: '', typeId: types[0]?.id || '', richHtmlContent: '', isFeatured: false });
    }
    setIsModalOpen(true);
  };

  const handleSaveResource = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingResource ? 'PUT' : 'POST';
    const url = editingResource ? `/api/cms/resources/${editingResource}` : '/api/cms/resources';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        await fetchData(); // Refresh data explicitly to pull down the newly transaction-altered isFeatured states
        setIsModalOpen(false);
      } else {
        alert('Failed to save resource');
      }
    } catch (err) {
      alert('Error saving resource');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await fetch(`/api/cms/resources/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) { alert('Error deleting'); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cms/resource-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newTypeName, shortForm: newTypeShort })
      });
      if (response.ok) {
        setNewTypeName('');
        setNewTypeShort('');
        fetchData();
      }
    } catch (err) { alert('Error adding category'); }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">CMS Admin Dashboard</h1>
          <button 
            className="text-red-500 hover:text-red-700 font-medium"
            onClick={() => { localStorage.removeItem('cms_token'); window.location.reload(); }}
          >
            Logout
          </button>
        </div>

        <div className="flex space-x-4 mb-6">
          <button 
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'resources' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Manage Resources
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'categories' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Manage Categories
          </button>
        </div>

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Published Resources</h2>
              <button 
                onClick={() => handleOpenModal()}
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
              >
                + Create New Resource
              </button>
            </div>
            
            <div className="overflow-x-auto border rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Featured</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resources.map(res => (
                    <tr key={res.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{res.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{res.type?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {res.isFeatured ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Featured</span> : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleOpenModal(res)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button onClick={() => handleDeleteResource(res.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {resources.length === 0 && (
                    <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No resources found. Create one above!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
              <ul className="divide-y divide-gray-200 border rounded-lg bg-white shadow-sm">
                {types.map(t => (
                  <li key={t.id} className="p-4 flex justify-between">
                    <span className="font-medium text-gray-800">{t.name}</span>
                    <span className="text-gray-500 text-sm bg-gray-100 px-2 rounded-full py-1">Badge: {t.shortForm}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">Add New Category</h2>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-900">Full Name (e.g. Guides & Templates)</label>
                  <input required type="text" value={newTypeName} onChange={e => setNewTypeName(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-900">Short Form Badge (e.g. Guide)</label>
                  <input required type="text" value={newTypeShort} onChange={e => setNewTypeShort(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium tracking-wide shadow-sm">Add Category</button>
              </form>
            </div>
          </div>
        )}

        {/* Edit/Create Modal overlaying the generic Tailwind UI */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-800/75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-2xl font-bold">{editingResource ? 'Edit Resource' : 'Create New Resource'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 font-bold text-xl">&times;</button>
              </div>
              
              <form onSubmit={handleSaveResource} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Resource Title</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="block w-full border-gray-300 rounded-md shadow-sm border p-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select required value={formData.typeId} onChange={e => setFormData({...formData, typeId: e.target.value})} className="block w-full border-gray-300 rounded-md shadow-sm border p-2 bg-white focus:ring-blue-500 focus:border-blue-500">
                      <option value="" disabled>Select a category</option>
                      {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2 py-2">
                  <input type="checkbox" id="featured" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor="featured" className="font-semibold text-gray-800 cursor-pointer">Set as Featured Resource</label>
                </div>

                <div className="mt-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Rich Text Content (Article Body)</label>
                  <div className="border border-gray-300 rounded overflow-hidden">
                    {/* Using React-Quill for comprehensive bolding/italics/numbering */}
                    <ReactQuill 
                      theme="snow" 
                      value={formData.richHtmlContent} 
                      onChange={val => setFormData({...formData, richHtmlContent: val})}
                      className="h-64 mb-10" // extra margin to offset absolute toolbar logic typical in ReactQuill 
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3 border-t">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 font-medium">Cancel</button>
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 shadow flex items-center">
                    {loading ? 'Saving...' : 'Save Resource'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
