'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, FileText, List, AlertCircle, Loader } from 'lucide-react';

interface Responsibility {
  id: number;
  activity_en: string;
  activity_hn: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  role_title_en: string;
  role_title_hn: string;
  role_desc_en: string;
  role_desc_hn: string;
}

type TabType = 'general' | 'list';

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loading, setLoading] = useState(true);
  const [savingHeading, setSavingHeading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [headingData, setHeadingData] = useState<HeadingData>({
    title_en: '',
    title_hn: '',
    sub_title_en: '',
    sub_title_hn: '',
    role_title_en: '',
    role_title_hn: '',
    role_desc_en: '',
    role_desc_hn: '',
  });

  const [responsibilities, setResponsibilities] = useState<Responsibility[]>([]);
  const [newItem, setNewItem] = useState({ activity_en: '', activity_hn: '' });
  const [addingItem, setAddingItem] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({ activity_en: '', activity_hn: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Headings
      const headRes = await fetch(`${API_URL}/api/student-activities`);
      if (headRes.ok) {
        const hData = await headRes.json();
        setHeadingData({
          title_en: hData.title_en || '',
          title_hn: hData.title_hn || '',
          sub_title_en: hData.sub_title_en || '',
          sub_title_hn: hData.sub_title_hn || '',
          role_title_en: hData.role_title_en || '',
          role_title_hn: hData.role_title_hn || '',
          role_desc_en: hData.role_desc_en || '',
          role_desc_hn: hData.role_desc_hn || '',
        });
      }

      // 2. Fetch list items
      const listRes = await fetch(`${API_URL}/api/student-activities/list`);
      if (listRes.ok) {
        const lData = await listRes.json();
        setResponsibilities(lData);
      }
    } catch (err: any) {
      console.error('Error fetching student activities data:', err);
      setError('Failed to load data from server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Save Heading Singleton
  const handleSaveHeading = async () => {
    setSavingHeading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-activities`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update headings');
      const updated = await res.json();
      
      setHeadingData(updated);
      alert('Page settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSavingHeading(false);
    }
  };

  // Add a new responsibility item
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.activity_en.trim() || !newItem.activity_hn.trim()) {
      alert('Please fill in both English and Hindi content for the responsibility.');
      return;
    }
    setAddingItem(true);
    try {
      const res = await fetch(`${API_URL}/api/student-activities/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) throw new Error('Failed to add item');
      const savedItem = await res.json();
      
      setResponsibilities([...responsibilities, savedItem]);
      setNewItem({ activity_en: '', activity_hn: '' });
      alert('Responsibility added successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error adding responsibility: ' + err.message);
    } finally {
      setAddingItem(false);
    }
  };

  // Start editing in-place
  const startEditing = (item: Responsibility) => {
    setEditingId(item.id);
    setEditingData({
      activity_en: item.activity_en,
      activity_hn: item.activity_hn,
    });
  };

  // Save in-place edit
  const handleSaveEdit = async (id: number) => {
    if (!editingData.activity_en.trim() || !editingData.activity_hn.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-activities/list/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingData),
      });

      if (!res.ok) throw new Error('Failed to update item');
      const updated = await res.json();

      setResponsibilities(responsibilities.map(r => r.id === id ? updated : r));
      setEditingId(null);
      alert('Updated successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error updating item: ' + err.message);
    }
  };

  // Delete an item
  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this responsibility? This action is permanent.')) return;
    try {
      const res = await fetch(`${API_URL}/api/student-activities/list/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete item');
      
      setResponsibilities(responsibilities.filter(r => r.id !== id));
      alert('Deleted successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error deleting item: ' + err.message);
    }
  };

  const tabs = [
    {
      id: 'general' as TabType,
      label: 'Page Headings & Info',
      icon: <FileText size={18} />,
    },
    {
      id: 'list' as TabType,
      label: 'Dean Responsibilities',
      icon: <List size={18} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Student Activities data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Upper header block */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <List className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Student Activities Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage the headings, text, and role responsibilities of the Dean (Student Welfare)
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveHeading}
            disabled={savingHeading}
            className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-semibold shadow-sm hover:shadow active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {savingHeading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center gap-3 text-red-700 border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* Tabs list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/50">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all border-b-2 text-sm sm:text-base whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#631012] text-[#631012] bg-white font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* TAB 1: GENERAL PAGE HEADINGS AND DEAN DEETS */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">1. Hero Section Content</h2>
                <p className="text-xs text-gray-500">Configure page headings appearing in the red top banner.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Main Banner Title (English)
                  </label>
                  <input
                    type="text"
                    value={headingData.title_en}
                    onChange={(e) => setHeadingData({ ...headingData, title_en: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black font-medium"
                    placeholder="e.g. ACTIVITIES"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Main Banner Title (Hindi)
                  </label>
                  <input
                    type="text"
                    value={headingData.title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, title_hn: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black font-medium"
                    placeholder="जैसे: गतिविधियां"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Banner Subtitle / Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={headingData.sub_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black"
                    placeholder="e.g. Duties and responsibilities of the Dean (Student Welfare)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Banner Subtitle / Description (Hindi)
                  </label>
                  <textarea
                    rows={2}
                    value={headingData.sub_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black"
                    placeholder="जैसे: डीन (छात्र कल्याण) के कर्तव्य और जिम्मेदारियाँ"
                  />
                </div>
              </div>

              <div className="pt-6 pb-4 border-t border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">2. Dean Role Card Headings</h2>
                <p className="text-xs text-gray-500">Configure text appearing inside the white card on the page.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Card Title (English)
                  </label>
                  <input
                    type="text"
                    value={headingData.role_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, role_title_en: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black font-medium"
                    placeholder="e.g. Dean (Student Welfare) — Role & Responsibilities"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Card Title (Hindi)
                  </label>
                  <input
                    type="text"
                    value={headingData.role_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, role_title_hn: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black font-medium"
                    placeholder="जैसे: डीन (छात्र कल्याण) — भूमिका और जिम्मेदारियां"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Card Paragraph Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={headingData.role_desc_en}
                    onChange={(e) => setHeadingData({ ...headingData, role_desc_en: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Card Paragraph Description (Hindi)
                  </label>
                  <textarea
                    rows={3}
                    value={headingData.role_desc_hn}
                    onChange={(e) => setHeadingData({ ...headingData, role_desc_hn: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RESPONSIBILITIES LIST */}
          {activeTab === 'list' && (
            <div className="space-y-8">
              {/* Form to add item */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <h3 className="text-md font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Plus className="w-5 h-5 text-[#631012]" />
                  Add New Responsibility
                </h3>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        Responsibility Text (English)
                      </label>
                      <input
                        type="text"
                        value={newItem.activity_en}
                        onChange={(e) => setNewItem({ ...newItem, activity_en: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#631012]/30"
                        placeholder="e.g. Conduct the enquiries of students indulged in indiscipline."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        Responsibility Text (Hindi)
                      </label>
                      <input
                        type="text"
                        value={newItem.activity_hn}
                        onChange={(e) => setNewItem({ ...newItem, activity_hn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#631012]/30"
                        placeholder="जैसे: अनुशासनहीनता में लिप्त छात्रों की जांच करना।"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={addingItem}
                      className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2 rounded-lg font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {addingItem ? 'Adding...' : 'Add to List'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Responsibilities list table */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Current Responsibilities List</h3>
                {responsibilities.length === 0 ? (
                  <p className="text-gray-500 text-center py-6 border border-dashed rounded-lg bg-gray-50/50">
                    No responsibilities uploaded yet. Add some above.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {responsibilities.map((item, index) => (
                      <div
                        key={item.id}
                        className="p-5 border border-gray-200 rounded-xl bg-white hover:border-[#631012]/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
                      >
                        {editingId === item.id ? (
                          /* Edit mode */
                          <div className="flex-1 w-full space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">English</label>
                                <input
                                  type="text"
                                  value={editingData.activity_en}
                                  onChange={(e) => setEditingData({ ...editingData, activity_en: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Hindi</label>
                                <input
                                  type="text"
                                  value={editingData.activity_hn}
                                  onChange={(e) => setEditingData({ ...editingData, activity_hn: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleSaveEdit(item.id)}
                                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-bold text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Display mode */
                          <>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-start gap-2.5">
                                <span className="font-extrabold text-sm text-[#631012] bg-[#631012]/10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  {index + 1}
                                </span>
                                <div>
                                  <p className="text-gray-900 font-semibold leading-relaxed">{item.activity_en}</p>
                                  <p className="text-gray-500 text-sm mt-1 leading-relaxed font-medium">{item.activity_hn}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2.5 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 flex-shrink-0">
                              <button
                                onClick={() => startEditing(item)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-sm transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
