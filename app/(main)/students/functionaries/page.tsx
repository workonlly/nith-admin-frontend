'use client';

import React, { useState, useEffect } from 'react';
import { Save, Users, Plus, Trash2, FileText, Mail, Phone, List, AlertCircle, Loader, Edit3 } from 'lucide-react';

interface Functionary {
  id: number;
  category_en: string;
  category_hn: string;
  name_en: string;
  name_hn: string;
  responsibility_en: string;
  responsibility_hn: string;
  phone: string;
  mobile: string;
  email: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
}

type TabType = 'general' | 'list';

const CATEGORIES = [
  { en: "Dean & Senior Functionaries", hn: "डीन और वरिष्ठ पदाधिकारी" },
  { en: "Nodal Officers", hn: "नोडल अधिकारी" },
  { en: "Faculty In-Charge / Assistant Faculty In-Charge", hn: "संकाय प्रभारी / सहायक संकाय प्रभारी" },
  { en: "Staff", hn: "कर्मचारी" }
];

export default function FunctionariesPage() {
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
  });

  const [functionaries, setFunctionaries] = useState<Functionary[]>([]);
  
  // New Item State
  const [newItem, setNewItem] = useState({
    category_index: 0, // Indexes into CATEGORIES
    name_en: '',
    name_hn: '',
    responsibility_en: '',
    responsibility_hn: '',
    phone: '',
    mobile: '',
    email: '',
  });
  const [addingItem, setAddingItem] = useState(false);

  // Inline editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({
    category_index: 0,
    name_en: '',
    name_hn: '',
    responsibility_en: '',
    responsibility_hn: '',
    phone: '',
    mobile: '',
    email: '',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch headings
      const headRes = await fetch(`${API_URL}/api/student-functionaries`);
      if (headRes.ok) {
        const hData = await headRes.json();
        setHeadingData({
          title_en: hData.title_en || '',
          title_hn: hData.title_hn || '',
          sub_title_en: hData.sub_title_en || '',
          sub_title_hn: hData.sub_title_hn || '',
        });
      }

      // 2. Fetch list
      const listRes = await fetch(`${API_URL}/api/student-functionaries/list`);
      if (listRes.ok) {
        const lData = await listRes.json();
        setFunctionaries(lData);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to load data. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Save Heading singleton
  const handleSaveHeading = async () => {
    setSavingHeading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-functionaries`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('Page headings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSavingHeading(false);
    }
  };

  // Add new functionary
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name_en.trim() || !newItem.name_hn.trim() || !newItem.responsibility_en.trim() || !newItem.responsibility_hn.trim()) {
      alert('Name and Responsibility are required in both English and Hindi.');
      return;
    }

    setAddingItem(true);
    const selectedCat = CATEGORIES[newItem.category_index];
    const payload = {
      category_en: selectedCat.en,
      category_hn: selectedCat.hn,
      name_en: newItem.name_en,
      name_hn: newItem.name_hn,
      responsibility_en: newItem.responsibility_en,
      responsibility_hn: newItem.responsibility_hn,
      phone: newItem.phone,
      mobile: newItem.mobile,
      email: newItem.email
    };

    try {
      const res = await fetch(`${API_URL}/api/student-functionaries/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to add official');
      const savedItem = await res.json();
      setFunctionaries([...functionaries, savedItem]);
      
      // Reset form but retain category index
      setNewItem({
        category_index: newItem.category_index,
        name_en: '',
        name_hn: '',
        responsibility_en: '',
        responsibility_hn: '',
        phone: '',
        mobile: '',
        email: '',
      });
      alert('Functionary added successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error adding official: ' + err.message);
    } finally {
      setAddingItem(false);
    }
  };

  // Start inline editing
  const startEditing = (item: Functionary) => {
    // Find matching category index
    let catIdx = CATEGORIES.findIndex(c => c.en === item.category_en);
    if (catIdx === -1) catIdx = 0;

    setEditingId(item.id);
    setEditingData({
      category_index: catIdx,
      name_en: item.name_en,
      name_hn: item.name_hn,
      responsibility_en: item.responsibility_en,
      responsibility_hn: item.responsibility_hn,
      phone: item.phone || '',
      mobile: item.mobile || '',
      email: item.email || '',
    });
  };

  // Save inline editing
  const handleSaveEdit = async (id: number) => {
    if (!editingData.name_en.trim() || !editingData.name_hn.trim() || !editingData.responsibility_en.trim() || !editingData.responsibility_hn.trim()) {
      alert('Name and Responsibility are required in both English and Hindi.');
      return;
    }

    const selectedCat = CATEGORIES[editingData.category_index];
    const payload = {
      category_en: selectedCat.en,
      category_hn: selectedCat.hn,
      name_en: editingData.name_en,
      name_hn: editingData.name_hn,
      responsibility_en: editingData.responsibility_en,
      responsibility_hn: editingData.responsibility_hn,
      phone: editingData.phone,
      mobile: editingData.mobile,
      email: editingData.email
    };

    try {
      const res = await fetch(`${API_URL}/api/student-functionaries/list/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update functionary');
      const updated = await res.json();

      setFunctionaries(functionaries.map(f => f.id === id ? updated : f));
      setEditingId(null);
      alert('Updated successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error updating functionary: ' + err.message);
    }
  };

  // Delete functionary
  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this official? This action is permanent.')) return;
    try {
      const res = await fetch(`${API_URL}/api/student-functionaries/list/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete item');
      setFunctionaries(functionaries.filter(f => f.id !== id));
      alert('Deleted successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error deleting official: ' + err.message);
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
      label: 'Functionaries Directory',
      icon: <Users size={18} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium font-semibold">Loading Student Functionaries...</p>
      </div>
    );
  }

  // Pre-group for the preview rendering
  const groupedFunctionaries = functionaries.reduce((acc, func) => {
    const cat = func.category_en || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(func);
    return acc;
  }, {} as Record<string, Functionary[]>);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* upper block */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Student Welfare Functionaries Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage contact details, responsibilities, and groups of Dean and Nodal officers
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

      {/* Main Tabs Block */}
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
          {/* TAB 1: GENERAL PAGE SETTINGS */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Hero Header Information</h2>
                <p className="text-xs text-gray-500">Configure page headings appearing in the red banner.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Banner Title (English)
                  </label>
                  <input
                    type="text"
                    value={headingData.title_en}
                    onChange={(e) => setHeadingData({ ...headingData, title_en: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black font-medium"
                    placeholder="Student Welfare Functionaries"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Banner Title (Hindi)
                  </label>
                  <input
                    type="text"
                    value={headingData.title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, title_hn: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black font-medium"
                    placeholder="छात्र कल्याण पदाधिकारी"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black font-medium"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FUNCTIONARIES CRUD LIST */}
          {activeTab === 'list' && (
            <div className="space-y-8">
              {/* Add form */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-md font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Plus className="w-5 h-5 text-[#631012]" />
                  Add New Welfare Official
                </h3>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Category Group</label>
                      <select
                        value={newItem.category_index}
                        onChange={(e) => setNewItem({ ...newItem, category_index: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#631012]/30"
                      >
                        {CATEGORIES.map((cat, i) => (
                          <option key={i} value={i}>{cat.en}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Official Name (English)</label>
                      <input
                        type="text"
                        value={newItem.name_en}
                        onChange={(e) => setNewItem({ ...newItem, name_en: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#631012]/30"
                        placeholder="e.g. Prof. Y. D. Sharma, DoMSC"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Official Name (Hindi)</label>
                      <input
                        type="text"
                        value={newItem.name_hn}
                        onChange={(e) => setNewItem({ ...newItem, name_hn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#631012]/30"
                        placeholder="जैसे: प्रो. वाई. डी. शर्मा"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Responsibility / Role (English)</label>
                      <input
                        type="text"
                        value={newItem.responsibility_en}
                        onChange={(e) => setNewItem({ ...newItem, responsibility_en: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#631012]/30"
                        placeholder="e.g. Dean (Student Welfare)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Responsibility / Role (Hindi)</label>
                      <input
                        type="text"
                        value={newItem.responsibility_hn}
                        onChange={(e) => setNewItem({ ...newItem, responsibility_hn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#631012]/30"
                        placeholder="जैसे: डीन (छात्र कल्याण)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Phone Extension / Office No.</label>
                      <input
                        type="text"
                        value={newItem.phone}
                        onChange={(e) => setNewItem({ ...newItem, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#631012]/30"
                        placeholder="e.g. 254326"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Mobile / Secondary contact</label>
                      <input
                        type="text"
                        value={newItem.mobile}
                        onChange={(e) => setNewItem({ ...newItem, mobile: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#631012]/30"
                        placeholder="e.g. 9418153838"
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-1">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Email address</label>
                      <input
                        type="text"
                        value={newItem.email}
                        onChange={(e) => setNewItem({ ...newItem, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#631012]/30"
                        placeholder="e.g. dsw@nith.ac.in"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={addingItem}
                      className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2 rounded-lg font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {addingItem ? 'Adding Official...' : 'Add Official to Directory'}
                    </button>
                  </div>
                </form>
              </div>

              {/* List rendering */}
              <div className="space-y-8">
                {CATEGORIES.map((catGroup) => {
                  const filtered = functionaries.filter(f => f.category_en === catGroup.en);
                  return (
                    <div key={catGroup.en} className="border border-gray-250 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{catGroup.en}</h3>
                          <p className="text-gray-400 font-semibold text-xs mt-0.5">{catGroup.hn}</p>
                        </div>
                        <span className="bg-[#631012]/10 text-[#631012] text-xs font-bold px-2.5 py-1 rounded-full">
                          {filtered.length} Officials
                        </span>
                      </div>

                      {filtered.length === 0 ? (
                        <p className="text-gray-400 text-center py-6 text-sm font-medium bg-white">
                          No officials added to this group yet.
                        </p>
                      ) : (
                        <div className="divide-y divide-gray-150 bg-white">
                          {filtered.map((item, index) => (
                            <div key={item.id} className="p-5 hover:bg-gray-50/50 transition-all">
                              {editingId === item.id ? (
                                /* In-line editing form */
                                <div className="space-y-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Group Category</label>
                                      <select
                                        value={editingData.category_index}
                                        onChange={(e) => setEditingData({ ...editingData, category_index: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                      >
                                        {CATEGORIES.map((c, i) => (
                                          <option key={i} value={i}>{c.en}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Name (English)</label>
                                      <input
                                        type="text"
                                        value={editingData.name_en}
                                        onChange={(e) => setEditingData({ ...editingData, name_en: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Name (Hindi)</label>
                                      <input
                                        type="text"
                                        value={editingData.name_hn}
                                        onChange={(e) => setEditingData({ ...editingData, name_hn: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Responsibility (English)</label>
                                      <input
                                        type="text"
                                        value={editingData.responsibility_en}
                                        onChange={(e) => setEditingData({ ...editingData, responsibility_en: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Responsibility (Hindi)</label>
                                      <input
                                        type="text"
                                        value={editingData.responsibility_hn}
                                        onChange={(e) => setEditingData({ ...editingData, responsibility_hn: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Phone</label>
                                      <input
                                        type="text"
                                        value={editingData.phone}
                                        onChange={(e) => setEditingData({ ...editingData, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Mobile</label>
                                      <input
                                        type="text"
                                        value={editingData.mobile}
                                        onChange={(e) => setEditingData({ ...editingData, mobile: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                                      <input
                                        type="text"
                                        value={editingData.email}
                                        onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
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
                                /* Normal display */
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-start gap-2.5">
                                      <span className="font-extrabold text-sm text-[#631012] bg-[#631012]/10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {index + 1}
                                      </span>
                                      <div>
                                        <div className="flex flex-wrap items-baseline gap-2">
                                          <h4 className="text-gray-900 font-extrabold text-md">{item.name_en}</h4>
                                          <span className="text-gray-400 text-xs font-medium">({item.name_hn})</span>
                                        </div>
                                        <p className="text-[#631012] font-semibold text-sm mt-0.5">
                                          {item.responsibility_en} <span className="text-gray-400 font-medium">({item.responsibility_hn})</span>
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-500 mt-2">
                                          {item.phone && item.phone !== '--' && (
                                            <span className="flex items-center gap-1">
                                              <Phone size={12} />
                                              Office: {item.phone}
                                            </span>
                                          )}
                                          {item.mobile && item.mobile !== '--' && (
                                            <span className="flex items-center gap-1">
                                              Mobile: {item.mobile}
                                            </span>
                                          )}
                                          {item.email && item.email !== '--' && (
                                            <span className="flex items-center gap-1">
                                              <Mail size={12} />
                                              {item.email}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex gap-2.5 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 flex-shrink-0">
                                    <button
                                      onClick={() => startEditing(item)}
                                      className="px-4 py-2 bg-gray-105 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-sm border border-gray-250 transition-colors"
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
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
