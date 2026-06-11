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
  X,
  Trophy
} from 'lucide-react';

interface Section {
  id: number;
  key: string;
  en: string;
  hi: string;
  content_en: string;
  content_hi: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  event_date_en: string;
  event_date_hn: string;
  event_venue_en: string;
  event_venue_hn: string;
  coordinator_en: string;
  coordinator_hn: string;
  register_url: string;
  brochure_url: string;
  quick_info_title_en: string;
  quick_info_title_hn: string;
  quick_info1_en: string;
  quick_info1_hn: string;
  quick_info2_en: string;
  quick_info2_hn: string;
  quick_info3_en: string;
  quick_info3_hn: string;
}

type TabType = 'hero' | 'sections';

export default function AnnualSportsMeetPage() {
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
    event_date_en: '',
    event_date_hn: '',
    event_venue_en: '',
    event_venue_hn: '',
    coordinator_en: '',
    coordinator_hn: '',
    register_url: '',
    brochure_url: '',
    quick_info_title_en: '',
    quick_info_title_hn: '',
    quick_info1_en: '',
    quick_info1_hn: '',
    quick_info2_en: '',
    quick_info2_hn: '',
    quick_info3_en: '',
    quick_info3_hn: '',
  });

  // Sections list
  const [sections, setSections] = useState<Section[]>([]);

  // Add / Edit form states
  const [newSection, setNewSection] = useState({
    key: '',
    en: '',
    hi: '',
    content_en: '',
    content_hi: ''
  });
  
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingSectionData, setEditingSectionData] = useState({
    key: '',
    en: '',
    hi: '',
    content_en: '',
    content_hi: ''
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
      const headRes = await fetch(`${API_URL}/api/student-lalkaar`);
      if (headRes.ok) {
        const hData = await headRes.json();
        setHeadingData({
          title_en: hData.title_en || '',
          title_hn: hData.title_hn || '',
          sub_title_en: hData.sub_title_en || '',
          sub_title_hn: hData.sub_title_hn || '',
          event_date_en: hData.event_date_en || '',
          event_date_hn: hData.event_date_hn || '',
          event_venue_en: hData.event_venue_en || '',
          event_venue_hn: hData.event_venue_hn || '',
          coordinator_en: hData.coordinator_en || '',
          coordinator_hn: hData.coordinator_hn || '',
          register_url: hData.register_url || '',
          brochure_url: hData.brochure_url || '',
          quick_info_title_en: hData.quick_info_title_en || '',
          quick_info_title_hn: hData.quick_info_title_hn || '',
          quick_info1_en: hData.quick_info1_en || '',
          quick_info1_hn: hData.quick_info1_hn || '',
          quick_info2_en: hData.quick_info2_en || '',
          quick_info2_hn: hData.quick_info2_hn || '',
          quick_info3_en: hData.quick_info3_en || '',
          quick_info3_hn: hData.quick_info3_hn || '',
        });
      }

      // 2. Fetch Sections
      const secRes = await fetch(`${API_URL}/api/student-lalkaar/sections`);
      if (secRes.ok) {
        const sData = await secRes.json();
        setSections(sData);
      }
    } catch (err: any) {
      console.error('Error fetching Lalkaar data:', err);
      setError('Failed to fetch sports meet data from server. Please verify backend status.');
    } finally {
      setLoading(false);
    }
  };

  // Save headings singleton
  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-lalkaar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('Sports Meet headings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Sections CRUD ---
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection.key.trim() || !newSection.en.trim() || !newSection.hi.trim() || !newSection.content_en.trim() || !newSection.content_hi.trim()) {
      alert('All bilingual section fields are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-lalkaar/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection),
      });
      if (!res.ok) throw new Error('Failed to add section');
      const saved = await res.json();
      setSections([...sections, saved]);
      setNewSection({
        key: '',
        en: '',
        hi: '',
        content_en: '',
        content_hi: ''
      });
      alert('Sports Meet section/tab added successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const startEditingSection = (sec: Section) => {
    setEditingSectionId(sec.id);
    setEditingSectionData({
      key: sec.key,
      en: sec.en,
      hi: sec.hi,
      content_en: sec.content_en,
      content_hi: sec.content_hi
    });
  };

  const handleSaveSectionEdit = async (id: number) => {
    if (!editingSectionData.key.trim() || !editingSectionData.en.trim() || !editingSectionData.hi.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-lalkaar/sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSectionData),
      });
      if (!res.ok) throw new Error('Failed to update section');
      const updated = await res.json();
      setSections(sections.map(s => s.id === id ? updated : s));
      setEditingSectionId(null);
      alert('Section details updated successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteSection = async (id: number) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    try {
      await fetch(`${API_URL}/api/student-lalkaar/sections/${id}`, { method: 'DELETE' });
      setSections(sections.filter(s => s.id !== id));
      alert('Deleted successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Banner', icon: <FileText size={18} /> },
    { id: 'sections' as TabType, label: 'Lalkaar Tabs & Sections', icon: <List size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Sports Meet Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Upper header block containing unconditional SAVE button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Lalkaar - Annual Sports Meet Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure annual sports festival headers, event descriptions, and category sections bilingually.
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
                Save Headers
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                <p className="text-sm text-gray-500">Edit major sports festival titles and intro subtitles in English and Hindi</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Heading (English)</label>
                  <input
                    type="text"
                    value={headingData.title_en}
                    onChange={(e) => setHeadingData({ ...headingData, title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Heading (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sub Title / Banner Desc (English)</label>
                  <textarea
                    value={headingData.sub_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sub Title / Banner Desc (Hindi)</label>
                  <textarea
                    value={headingData.sub_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div className="md:col-span-2 border-t pt-4 my-2">
                  <h4 className="font-bold text-gray-800 text-sm">Event Details & Coordinates</h4>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Event Date (English)</label>
                  <input
                    type="text"
                    value={headingData.event_date_en}
                    onChange={(e) => setHeadingData({ ...headingData, event_date_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Event Date (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.event_date_hn}
                    onChange={(e) => setHeadingData({ ...headingData, event_date_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Event Venue (English)</label>
                  <input
                    type="text"
                    value={headingData.event_venue_en}
                    onChange={(e) => setHeadingData({ ...headingData, event_venue_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Event Venue (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.event_venue_hn}
                    onChange={(e) => setHeadingData({ ...headingData, event_venue_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Coordinator (English)</label>
                  <input
                    type="text"
                    value={headingData.coordinator_en}
                    onChange={(e) => setHeadingData({ ...headingData, coordinator_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Coordinator (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.coordinator_hn}
                    onChange={(e) => setHeadingData({ ...headingData, coordinator_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Register Link URL</label>
                  <input
                    type="text"
                    value={headingData.register_url}
                    onChange={(e) => setHeadingData({ ...headingData, register_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Brochure Download Link URL</label>
                  <input
                    type="text"
                    value={headingData.brochure_url}
                    onChange={(e) => setHeadingData({ ...headingData, brochure_url: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div className="md:col-span-2 border-t pt-4 my-2">
                  <h4 className="font-bold text-gray-800 text-sm">Quick Info Sidebar Settings</h4>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sidebar Title (English)</label>
                  <input
                    type="text"
                    value={headingData.quick_info_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, quick_info_title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sidebar Title (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.quick_info_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, quick_info_title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Info Bullet 1 (English)</label>
                  <input
                    type="text"
                    value={headingData.quick_info1_en}
                    onChange={(e) => setHeadingData({ ...headingData, quick_info1_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Info Bullet 1 (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.quick_info1_hn}
                    onChange={(e) => setHeadingData({ ...headingData, quick_info1_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Info Bullet 2 (English)</label>
                  <input
                    type="text"
                    value={headingData.quick_info2_en}
                    onChange={(e) => setHeadingData({ ...headingData, quick_info2_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Info Bullet 2 (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.quick_info2_hn}
                    onChange={(e) => setHeadingData({ ...headingData, quick_info2_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Info Bullet 3 (English)</label>
                  <input
                    type="text"
                    value={headingData.quick_info3_en}
                    onChange={(e) => setHeadingData({ ...headingData, quick_info3_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Info Bullet 3 (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.quick_info3_hn}
                    onChange={(e) => setHeadingData({ ...headingData, quick_info3_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Active Banner Preview */}
              <div className="mt-8 p-6 bg-gradient-to-br from-[#631012] to-[#800000] rounded-xl text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full mb-3 inline-block">LIVE BANNER PREVIEW</span>
                <h4 className="text-xl sm:text-2xl font-black">{headingData.title_en || 'LALKAAR'}</h4>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">{headingData.sub_title_en || 'Sports meet...'}</p>
                <div className="h-px bg-white/10 my-4" />
                <h4 className="text-xl sm:text-2xl font-black">{headingData.title_hn || 'ललकार'}</h4>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">{headingData.sub_title_hn || 'खेल उत्सव...'}</p>
              </div>
            </div>
          )}

          {/* TAB 2: SECTIONS & TABS */}
          {activeTab === 'sections' && (
            <div className="space-y-8">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Interactive Tabs Configuration</h3>
                <p className="text-sm text-gray-500">Configure bilingually-rendered navigation tabs and text descriptions for your festival</p>
              </div>

              {/* Add section form */}
              <form onSubmit={handleAddSection} className="bg-gray-50/50 border border-gray-200 p-6 rounded-xl space-y-4">
                <h4 className="font-bold text-gray-800 text-sm">Add New Tab / Content Section</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Unique Key Identifier</label>
                    <input
                      type="text"
                      value={newSection.key}
                      onChange={(e) => setNewSection({ ...newSection, key: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. karates"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Tab Label (English)</label>
                    <input
                      type="text"
                      value={newSection.en}
                      onChange={(e) => setNewSection({ ...newSection, en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. Karate Displays"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Tab Label (Hindi)</label>
                    <input
                      type="text"
                      value={newSection.hi}
                      onChange={(e) => setNewSection({ ...newSection, hi: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. कराटे प्रदर्शन"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Section Content (English)</label>
                    <textarea
                      rows={3}
                      value={newSection.content_en}
                      onChange={(e) => setNewSection({ ...newSection, content_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900 font-sans"
                      placeholder="Enter detailed English content..."
                    />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Section Content (Hindi)</label>
                    <textarea
                      rows={3}
                      value={newSection.content_hi}
                      onChange={(e) => setNewSection({ ...newSection, content_hi: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900 font-sans"
                      placeholder="विस्तृत हिंदी विवरण दर्ज करें..."
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={15} /> Add Tab Section
                  </button>
                </div>
              </form>

              {/* Sections list table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left table-fixed border-collapse text-sm">
                  <colgroup>
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '56%' }} />
                    <col style={{ width: '12%' }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase font-bold tracking-wider text-gray-500">
                      <th className="p-4">Tab Key</th>
                      <th className="p-4">Tab Label</th>
                      <th className="p-4">Tab Detailed Content</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {sections.map((sec) => (
                      <tr key={sec.id} className="hover:bg-gray-50/50">
                        {editingSectionId === sec.id ? (
                          <td colSpan={4} className="p-4 space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                              <input
                                type="text"
                                value={editingSectionData.key}
                                onChange={(e) => setEditingSectionData({ ...editingSectionData, key: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                                placeholder="Unique Key"
                              />
                              <input
                                type="text"
                                value={editingSectionData.en}
                                onChange={(e) => setEditingSectionData({ ...editingSectionData, en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                                placeholder="Label (En)"
                              />
                              <input
                                type="text"
                                value={editingSectionData.hi}
                                onChange={(e) => setEditingSectionData({ ...editingSectionData, hi: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                                placeholder="Label (Hn)"
                              />
                              <div className="col-span-3">
                                <textarea
                                  rows={2}
                                  value={editingSectionData.content_en}
                                  onChange={(e) => setEditingSectionData({ ...editingSectionData, content_en: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                                  placeholder="Content (En)"
                                />
                              </div>
                              <div className="col-span-3">
                                <textarea
                                  rows={2}
                                  value={editingSectionData.content_hi}
                                  onChange={(e) => setEditingSectionData({ ...editingSectionData, content_hi: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                                  placeholder="Content (Hn)"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveSectionEdit(sec.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold"
                              >
                                <Check size={14} /> Save
                              </button>
                              <button
                                onClick={() => setEditingSectionId(null)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs"
                              >
                                <X size={14} /> Cancel
                              </button>
                            </div>
                          </td>
                        ) : (
                          <>
                            <td className="p-4 align-top font-semibold text-[#631012] text-xs uppercase">{sec.key}</td>
                            <td className="p-4 align-top">
                              <div className="font-semibold text-gray-800 text-xs">{sec.en}</div>
                              <div className="text-[11px] text-gray-500 mt-0.5">{sec.hi}</div>
                            </td>
                            <td className="p-4 align-top">
                              <div className="font-medium text-gray-700 text-xs leading-relaxed">{sec.content_en}</div>
                              <div className="text-[11px] text-gray-500 mt-1 leading-relaxed">{sec.content_hi}</div>
                            </td>
                            <td className="p-4 align-top text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => startEditingSection(sec)}
                                  className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded-lg"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteSection(sec.id)}
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
