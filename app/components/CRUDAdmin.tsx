'use client';
import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Edit2, X, Save, AlertCircle } from 'lucide-react';

export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date';
}

export interface CRUDAdminProps {
  title: string;
  endpoint: string;
  dataKey: string;
  fields: FieldDef[];
}

export default function CRUDAdmin({ title, endpoint, dataKey, fields }: CRUDAdminProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to fetch data from server');
      const json = await res.json();
      if (json.success) {
        if (dataKey && json.data && json.data[dataKey]) {
          setItems(json.data[dataKey]);
        } else if (Array.isArray(json.data)) {
          setItems(json.data);
        } else if (json.data && Array.isArray(json.data.admissions)) {
          setItems(json.data.admissions);
        } else {
          setItems([]);
        }
      } else {
        throw new Error(json.message || 'Error loading data');
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      const initial: any = {};
      fields.forEach((f) => {
        initial[f.name] = f.type === 'date' ? new Date().toISOString().split('T')[0] : '';
      });
      setFormData(initial);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingItem ? `${endpoint}/${editingItem.id}` : endpoint;
      const method = editingItem ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        handleCloseModal();
        fetchItems();
      } else {
        alert(json.message || json.error || 'Error saving');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save data. Please check connection.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        fetchItems();
      } else {
        alert(json.message || json.error || 'Error deleting');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete data. Please check connection.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10 font-sans">
      <div className="bg-gradient-to-r from-[#631012] to-[#8c1719] rounded-2xl p-8 text-white shadow-xl flex justify-between items-center relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">{title} Management</h1>
          <p className="text-white/80 text-lg">Manage all your {title.toLowerCase()} records here.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="relative z-10 bg-white text-[#631012] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg active:scale-95"
        >
          <Plus size={20} />
          Add New
        </button>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl flex items-center gap-3">
          <AlertCircle className="text-red-600 w-6 h-6" />
          <p className="text-red-800 font-medium">{error}</p>
          <button onClick={fetchItems} className="ml-auto text-sm bg-red-100 text-red-700 px-3 py-1 rounded-lg font-bold hover:bg-red-200">
            Retry
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {fields.map((field) => (
                  <th key={field.name} className="px-6 py-4 text-sm font-semibold text-gray-600">
                    {field.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && items.length === 0 ? (
                <tr>
                  <td colSpan={fields.length + 1} className="p-12 text-center text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#631012]" />
                    <p>Loading data...</p>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={fields.length + 1} className="p-12 text-center text-gray-400">
                    No records found. Click "Add New" to create one.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id || index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    {fields.map((field) => (
                      <td key={field.name} className="px-6 py-4 text-sm text-gray-800 max-w-xs truncate">
                        {item[field.name]}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 lg:p-8 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingItem ? 'Edit Record' : 'Create New Record'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 custom-scrollbar">
              {/* Group fields */}
              {(() => {
                const commonFields = fields.filter(f => !f.name.endsWith('_en') && !f.name.endsWith('_hi'));
                const enFields = fields.filter(f => f.name.endsWith('_en'));
                const hiFields = fields.filter(f => f.name.endsWith('_hi'));

                const renderField = (field: FieldDef) => (
                  <div key={field.name} className={field.type === 'textarea' && commonFields.includes(field) ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#631012]/20 focus:border-[#631012] transition-all outline-none text-gray-800"
                        rows={4}
                        required
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleChange}
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#631012]/20 focus:border-[#631012] transition-all outline-none text-gray-800"
                        required
                      />
                    )}
                  </div>
                );

                return (
                  <>
                    {commonFields.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {commonFields.map(renderField)}
                      </div>
                    )}

                    {(enFields.length > 0 || hiFields.length > 0) && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {enFields.length > 0 && (
                          <div className="space-y-4 p-4 bg-white rounded-xl border border-blue-200/50">
                            <h4 className="font-semibold text-blue-700 text-sm uppercase tracking-wide">
                              English Content
                            </h4>
                            {enFields.map(renderField)}
                          </div>
                        )}
                        {hiFields.length > 0 && (
                          <div className="space-y-4 p-4 bg-white rounded-xl border border-orange-200/50">
                            <h4 className="font-semibold text-orange-700 text-sm uppercase tracking-wide">
                              Hindi Content
                            </h4>
                            {hiFields.map(renderField)}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}
            </form>

            <div className="p-6 lg:p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-3 font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-8 py-3 bg-[#631012] hover:bg-[#7a1214] disabled:bg-[#631012]/60 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
