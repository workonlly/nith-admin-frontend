'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Palette,
  Plus,
  Trash2,
  FileText,
  Info,
  List,
  AlertCircle,
  Loader,
  Edit2,
  Check,
  X
} from 'lucide-react';

interface Society {
  id: number;
  name_en: string;
  name_hn: string;
  focus_en: string;
  focus_hn: string;
  faculty_en: string;
  faculty_hn: string;
  contact: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  about_title_en: string;
  about_title_hn: string;
  about_desc1_en: string;
  about_desc1_hn: string;
  about_desc2_en: string;
  about_desc2_hn: string;
}

type TabType = 'hero' | 'about' | 'list';

export default function CulturalIntroductionListPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Singleton headings data
  const [headingData, setHeadingData] = useState<HeadingData>({
    title_en: '',
    title_hn: '',
    sub_title_en: '',
    sub_title_hn: '',
    about_title_en: '',
    about_title_hn: '',
    about_desc1_en: '',
    about_desc1_hn: '',
    about_desc2_en: '',
    about_desc2_hn: '',
  });

  // Societies list
  const [societies, setSocieties] = useState<Society[]>([]);

  // Add / Edit form states
  const [newSociety, setNewSociety] = useState({
    name_en: '', name_hn: '',
    focus_en: '', focus_hn: '',
    faculty_en: '', faculty_hn: '',
    contact: ''
  });
  
  const [editingSocietyId, setEditingSocietyId] = useState<number | null>(null);
  const [editingSocietyData, setEditingSocietyData] = useState({
    name_en: '', name_hn: '',
    focus_en: '', focus_hn: '',
    faculty_en: '', faculty_hn: '',
    contact: ''
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Headings
      const headRes = await fetch(`${API_URL}/api/student-cultural`);
      if (headRes.ok) {
        const hData = await headRes.json();
        setHeadingData({
          title_en: hData.title_en || '',
          title_hn: hData.title_hn || '',
          sub_title_en: hData.sub_title_en || '',
          sub_title_hn: hData.sub_title_hn || '',
          about_title_en: hData.about_title_en || '',
          about_title_hn: hData.about_title_hn || '',
          about_desc1_en: hData.about_desc1_en || '',
          about_desc1_hn: hData.about_desc1_hn || '',
          about_desc2_en: hData.about_desc2_en || '',
          about_desc2_hn: hData.about_desc2_hn || '',
        });
      }

      // 2. Fetch Societies
      const socRes = await fetch(`${API_URL}/api/student-cultural/societies`);
      if (socRes.ok) {
        const sData = await socRes.json();
        setSocieties(sData);
      }
    } catch (err: any) {
      console.error('Error fetching cultural intro data:', err);
      setError('Failed to fetch cultural data from server. Please verify backend status.');
    } finally {
      setLoading(false);
    }
  };

  // Save headings singleton
  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-cultural`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('Cultural page settings saved successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Societies CRUD ---
  const handleAddSociety = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSociety.name_en.trim() || !newSociety.name_hn.trim() || !newSociety.focus_en.trim() || !newSociety.focus_hn.trim() || !newSociety.faculty_en.trim()) {
      alert('Society name, focus and faculty details are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-cultural/societies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSociety),
      });
      if (!res.ok) throw new Error('Failed to add society');
      const saved = await res.json();
      setSocieties([...societies, saved]);
      setNewSociety({
        name_en: '', name_hn: '',
        focus_en: '', focus_hn: '',
        faculty_en: '', faculty_hn: '',
        contact: ''
      });
      alert('Cultural Society/Club added successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const startEditingSociety = (soc: Society) => {
    setEditingSocietyId(soc.id);
    setEditingSocietyData({
      name_en: soc.name_en, name_hn: soc.name_hn,
      focus_en: soc.focus_en, focus_hn: soc.focus_hn,
      faculty_en: soc.faculty_en, faculty_hn: soc.faculty_hn,
      contact: soc.contact
    });
  };

  const handleSaveSocietyEdit = async (id: number) => {
    if (!editingSocietyData.name_en.trim() || !editingSocietyData.name_hn.trim()) {
      alert('Name fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-cultural/societies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSocietyData),
      });
      if (!res.ok) throw new Error('Failed to update society');
      const updated = await res.json();
      setSocieties(societies.map(s => s.id === id ? updated : s));
      setEditingSocietyId(null);
      alert('Society details updated successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteSociety = async (id: number) => {
    if (!confirm('Are you sure you want to delete this cultural society/club?')) return;
    try {
      await fetch(`${API_URL}/api/student-cultural/societies/${id}`, { method: 'DELETE' });
      setSocieties(societies.filter(s => s.id !== id));
      alert('Deleted!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Banner', icon: <FileText size={18} /> },
    { id: 'about' as TabType, label: 'About Activities', icon: <Info size={18} /> },
    { id: 'list' as TabType, label: 'Societies & Clubs', icon: <List size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Cultural Introduction Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Upper header block containing unconditional SAVE button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Palette className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Cultural Introduction Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure cultural banners, about text details, and coordinate cultural clubs or societies bilingually.
              </p>
            </div>
          </div>
          <button
            onClick={handleSavePageSettings}
            disabled={saving}
            className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-semibold shadow-sm hover:shadow active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? (
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
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Tabs Layout */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#631012] text-[#631012] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/70'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* TAB 1: HERO SECTION */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Hero Banner Configuration</h3>
                <p className="text-sm text-gray-500">Edit major page headers and intro descriptions in English and Hindi</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Heading (English)</label>
                  <input
                    type="text"
                    value={headingData.title_en}
                    onChange={(e) => setHeadingData({ ...headingData, title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Heading (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sub Title / Banner Desc (English)</label>
                  <textarea
                    value={headingData.sub_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sub Title / Banner Desc (Hindi)</label>
                  <textarea
                    value={headingData.sub_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
              </div>

              {/* Active Banner Preview */}
              <div className="mt-8 p-6 bg-gradient-to-br from-[#631012] to-[#800000] rounded-xl text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full mb-3 inline-block">LIVE BANNER PREVIEW</span>
                <h4 className="text-xl sm:text-2xl font-black">{headingData.title_en || 'CULTURAL INTRODUCTION'}</h4>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">{headingData.sub_title_en || 'Cultural activities...'}</p>
                <div className="h-px bg-white/10 my-4" />
                <h4 className="text-xl sm:text-2xl font-black">{headingData.title_hn || 'सांस्कृतिक परिचय'}</h4>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">{headingData.sub_title_hn || 'सांस्कृतिक गतिविधियाँ...'}</p>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT DETAILS */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">About Cultural Activities</h3>
                <p className="text-sm text-gray-500">Edit the detailed information blocks about campus creative activities</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Section Heading (English)</label>
                  <input
                    type="text"
                    value={headingData.about_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, about_title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Section Heading (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.about_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, about_title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Paragraph 1 (English)</label>
                  <textarea
                    value={headingData.about_desc1_en}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc1_en: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Paragraph 1 (Hindi)</label>
                  <textarea
                    value={headingData.about_desc1_hn}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc1_hn: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Paragraph 2 (English)</label>
                  <textarea
                    value={headingData.about_desc2_en}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc2_en: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Paragraph 2 (Hindi)</label>
                  <textarea
                    value={headingData.about_desc2_hn}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc2_hn: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIETIES & CLUBS */}
          {activeTab === 'list' && (
            <div className="space-y-8">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Societies & Clubs Directory</h3>
                <p className="text-sm text-gray-500">Manage names, activity focuses, faculty-in-charges, and emails for campus clubs bilingually</p>
              </div>

              {/* Add club form */}
              <form onSubmit={handleAddSociety} className="bg-gray-50/50 border border-gray-150 p-6 rounded-xl space-y-4">
                <h4 className="font-bold text-gray-800 text-sm">Add New Cultural Society/Club</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Club/Society Name (English)</label>
                    <input
                      type="text"
                      value={newSociety.name_en}
                      onChange={(e) => setNewSociety({ ...newSociety, name_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. Music Club"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Club/Society Name (Hindi)</label>
                    <input
                      type="text"
                      value={newSociety.name_hn}
                      onChange={(e) => setNewSociety({ ...newSociety, name_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. संगीत क्लब"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Focus / Activities (English)</label>
                    <input
                      type="text"
                      value={newSociety.focus_en}
                      onChange={(e) => setNewSociety({ ...newSociety, focus_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="Vocal, instrumental and band fests"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Focus / Activities (Hindi)</label>
                    <input
                      type="text"
                      value={newSociety.focus_hn}
                      onChange={(e) => setNewSociety({ ...newSociety, focus_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="गायन, वादन और बैंड प्रदर्शन"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Faculty In-Charge (English)</label>
                    <input
                      type="text"
                      value={newSociety.faculty_en}
                      onChange={(e) => setNewSociety({ ...newSociety, faculty_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="Dr. R. Verma"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Faculty In-Charge (Hindi)</label>
                    <input
                      type="text"
                      value={newSociety.faculty_hn}
                      onChange={(e) => setNewSociety({ ...newSociety, faculty_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="डॉ. आर. वर्मा"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={newSociety.contact}
                      onChange={(e) => setNewSociety({ ...newSociety, contact: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="music@nit.ac.in"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={15} /> Add Club/Society
                  </button>
                </div>
              </form>

              {/* Societies list table */}
              <div className="overflow-x-auto rounded-xl border border-gray-150">
                <table className="w-full text-left table-fixed border-collapse text-sm">
                  <colgroup>
                    <col style={{ width: '6%' }} />
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '18%' }} />
                    <col style={{ width: '16%' }} />
                    <col style={{ width: '10%' }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase font-bold tracking-wider text-gray-500">
                      <th className="p-4">#</th>
                      <th className="p-4">Society / Club Name</th>
                      <th className="p-4">Focus / Activities</th>
                      <th className="p-4">Faculty In-charge</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 bg-white">
                    {societies.map((soc, idx) => (
                      <tr key={soc.id} className="hover:bg-gray-55/30">
                        {editingSocietyId === soc.id ? (
                          <td colSpan={6} className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={editingSocietyData.name_en}
                                onChange={(e) => setEditingSocietyData({ ...editingSocietyData, name_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Name (En)"
                              />
                              <input
                                type="text"
                                value={editingSocietyData.name_hn}
                                onChange={(e) => setEditingSocietyData({ ...editingSocietyData, name_hn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Name (Hn)"
                              />
                              <input
                                type="text"
                                value={editingSocietyData.focus_en}
                                onChange={(e) => setEditingSocietyData({ ...editingSocietyData, focus_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Focus (En)"
                              />
                              <input
                                type="text"
                                value={editingSocietyData.focus_hn}
                                onChange={(e) => setEditingSocietyData({ ...editingSocietyData, focus_hn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Focus (Hn)"
                              />
                              <input
                                type="text"
                                value={editingSocietyData.faculty_en}
                                onChange={(e) => setEditingSocietyData({ ...editingSocietyData, faculty_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Faculty In-charge (En)"
                              />
                              <input
                                type="text"
                                value={editingSocietyData.faculty_hn}
                                onChange={(e) => setEditingSocietyData({ ...editingSocietyData, faculty_hn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Faculty In-charge (Hn)"
                              />
                              <div className="col-span-2">
                                <input
                                  type="text"
                                  value={editingSocietyData.contact}
                                  onChange={(e) => setEditingSocietyData({ ...editingSocietyData, contact: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                  placeholder="Contact Email"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveSocietyEdit(soc.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold"
                              >
                                <Check size={14} /> Save
                              </button>
                              <button
                                onClick={() => setEditingSocietyId(null)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs"
                              >
                                <X size={14} /> Cancel
                              </button>
                            </div>
                          </td>
                        ) : (
                          <>
                            <td className="p-4 align-top text-gray-500 font-semibold">{idx + 1}</td>
                            <td className="p-4 align-top">
                              <div className="font-semibold text-gray-800">{soc.name_en}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{soc.name_hn}</div>
                            </td>
                            <td className="p-4 align-top">
                              <div className="font-medium text-gray-700 text-xs leading-relaxed">{soc.focus_en}</div>
                              <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">{soc.focus_hn}</div>
                            </td>
                            <td className="p-4 align-top">
                              <div className="text-gray-600 font-medium text-xs">{soc.faculty_en}</div>
                              <div className="text-[11px] text-gray-400 mt-0.5">{soc.faculty_hn}</div>
                            </td>
                            <td className="p-4 align-top">
                              <span className="text-[#631012] font-semibold text-xs hover:underline break-all">
                                {soc.contact}
                              </span>
                            </td>
                            <td className="p-4 align-top text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => startEditingSociety(soc)}
                                  className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded-lg"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteSociety(soc.id)}
                                  className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded-lg"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
