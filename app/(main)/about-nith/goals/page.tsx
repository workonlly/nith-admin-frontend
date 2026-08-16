
'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, X } from 'lucide-react';

export default function GoalsPage() {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000')}/goals`;
  
  const [activeTab, setActiveTab] = useState('goals'); // 'goals' or 'roadmap'
  
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const goalFields = ['icon', 'title_en', 'title_hi', 'text_en', 'text_hi', 'stats_label_en', 'stats_label_hi', 'stats_value'];
  const roadmapFields = ['year', 'title_en', 'title_hi', 'focus_en', 'focus_hi']; // Excluding items_en for simplicity in simple CRUD

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${activeTab}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`${API_URL}/${activeTab}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `${API_URL}/${activeTab}/${editingItem.id}` : `${API_URL}/${activeTab}`;
      
      const payload: any = {...formData};
      if (activeTab === 'roadmap') {
         payload.items_en = payload.items_en || [];
         payload.items_hi = payload.items_hi || [];
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Goals & Roadmap</h1>
      </div>
      
      <div className="mb-6 flex border-b border-gray-200">
        <button onClick={() => setActiveTab('goals')} className={`py-2 px-4 font-medium text-sm ${activeTab === 'goals' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Goals</button>
        <button onClick={() => setActiveTab('roadmap')} className={`py-2 px-4 font-medium text-sm ${activeTab === 'roadmap' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Roadmap</button>
      </div>

      <div className="mb-4">
        <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          <Plus size={18} /> Add New {activeTab === 'goals' ? 'Goal' : 'Roadmap Item'}
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title (EN)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title_en || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit Item' : 'Add Item'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {(activeTab === 'goals' ? goalFields : roadmapFields).map(f => (
                <div key={f}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">{f.replace(/_/g, ' ')}</label>
                  <input type="text" name={f} value={formData[f] || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
                </div>
              ))}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3">Cancel</button>
                <button type="submit" disabled={saving} className="flex justify-center items-center bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-blue-700">
                  {saving && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />} Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
