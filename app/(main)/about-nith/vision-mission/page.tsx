'use client';

import React, { useState, useEffect } from 'react';
import {
  Target,
  BookOpen,
  Cpu,
  Briefcase,
  Compass,
  Plus,
  Edit2,
  Trash2,
  Save,
  RefreshCw,
  Layout,
  CheckCircle2,
  X,
  Award,
} from 'lucide-react';

interface MissionPillar {
  id: number;
  icon: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
}

interface PageData {
  vision_heading_en: string;
  vision_heading_hi: string;
  vision_subtitle_en: string;
  vision_subtitle_hi: string;
  vision_description_en: string;
  vision_description_hi: string;
  mission_heading_en: string;
  mission_heading_hi: string;
  mission_subtitle_en: string;
  mission_subtitle_hi: string;
  tagline_en: string;
  tagline_hi: string;
  tagline_description_en: string;
  tagline_description_hi: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const ICON_OPTIONS = [
  { label: 'Book (Academic Excellence)', value: 'BookOpen' },
  { label: 'Cpu (Research & Tech)', value: 'Cpu' },
  { label: 'Briefcase (Industry Synergy)', value: 'Briefcase' },
  { label: 'Compass (Ethical Leadership)', value: 'Compass' },
];

export default function VisionMissionAdminPage() {
  const [missions, setMissions] = useState<MissionPillar[]>([]);
  const [pageData, setPageData] = useState<PageData>({
    vision_heading_en: '',
    vision_heading_hi: '',
    vision_subtitle_en: '',
    vision_subtitle_hi: '',
    vision_description_en: '',
    vision_description_hi: '',
    mission_heading_en: '',
    mission_heading_hi: '',
    mission_subtitle_en: '',
    mission_subtitle_hi: '',
    tagline_en: '',
    tagline_hi: '',
    tagline_description_en: '',
    tagline_description_hi: '',
  });

  const [loading, setLoading] = useState(true);
  const [savingPage, setSavingPage] = useState(false);
  const [activeTab, setActiveTab] = useState<'missions' | 'page'>('missions');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formIcon, setFormIcon] = useState('BookOpen');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleHi, setFormTitleHi] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formDescHi, setFormDescHi] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/vision-mission`);
      const json = await res.json();
      if (json.success) {
        setMissions(json.data || []);
        if (json.page && json.page.vision_heading_en) {
          setPageData({
            vision_heading_en: json.page.vision_heading_en || '',
            vision_heading_hi: json.page.vision_heading_hi || '',
            vision_subtitle_en: json.page.vision_subtitle_en || '',
            vision_subtitle_hi: json.page.vision_subtitle_hi || '',
            vision_description_en: json.page.vision_description_en || '',
            vision_description_hi: json.page.vision_description_hi || '',
            mission_heading_en: json.page.mission_heading_en || '',
            mission_heading_hi: json.page.mission_heading_hi || '',
            mission_subtitle_en: json.page.mission_subtitle_en || '',
            mission_subtitle_hi: json.page.mission_subtitle_hi || '',
            tagline_en: json.page.tagline_en || '',
            tagline_hi: json.page.tagline_hi || '',
            tagline_description_en: json.page.tagline_description_en || '',
            tagline_description_hi: json.page.tagline_description_hi || '',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching vision mission:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePage = async () => {
    try {
      setSavingPage(true);
      const res = await fetch(`${API_BASE}/vision-mission/page`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });
      if (res.ok) {
        alert('Vision & Mission statements saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving statements');
    } finally {
      setSavingPage(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormIcon('BookOpen');
    setFormTitleEn('');
    setFormTitleHi('');
    setFormDescEn('');
    setFormDescHi('');
    setModalOpen(true);
  };

  const openEditModal = (item: MissionPillar) => {
    setEditingId(item.id);
    setFormIcon(item.icon || 'BookOpen');
    setFormTitleEn(item.title_en || '');
    setFormTitleHi(item.title_hi || '');
    setFormDescEn(item.description_en || '');
    setFormDescHi(item.description_hi || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleEn.trim()) {
      alert('Please enter a Title');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        icon: formIcon,
        title_en: formTitleEn,
        title_hi: formTitleHi || formTitleEn,
        description_en: formDescEn,
        description_hi: formDescHi || formDescEn,
      };

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/vision-mission/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/vision-mission`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingId ? 'Mission pillar updated!' : 'Mission pillar added successfully!');
        setModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save pillar');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this mission pillar?')) return;
    try {
      const res = await fetch(`${API_BASE}/vision-mission/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-6 font-sans">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <Target size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vision & Mission Manager</h1>
              <p className="text-xs text-gray-500">
                Manage the overarching vision, strategic mission objectives, and institute pillars.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={openAddModal}
              className="bg-[#631012] hover:bg-[#500c0e] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>Add Mission Pillar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('missions')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'missions'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Target size={16} />
            <span>Mission Pillars ({missions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('page')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'page'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layout size={16} />
            <span>Vision & Statements</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Mission Pillars */}
          {activeTab === 'missions' && (
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
                  <thead className="bg-[#f0f4f8] border-b border-gray-300 text-[#0c344e] font-mono uppercase text-xs">
                    <tr>
                      <th className="py-3 px-4 w-28 text-center">Icon</th>
                      <th className="py-3 px-4 w-60">Pillar Title</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 w-24 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {missions.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono text-xs font-bold text-gray-700">
                          <span className="px-2 py-1 bg-gray-100 rounded text-gray-800 border border-gray-300">
                            {item.icon}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 space-y-1">
                          <div className="font-bold text-gray-900">{item.title_en}</div>
                          {item.title_hi && (
                            <div className="text-xs text-gray-600 font-medium">{item.title_hi}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 space-y-1 text-gray-700 text-xs sm:text-sm">
                          <div>{item.description_en}</div>
                          {item.description_hi && (
                            <div className="text-xs text-gray-500">{item.description_hi}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Vision & Statements */}
          {activeTab === 'page' && (
            <div className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-xs uppercase text-[#631012]">Vision Statement (English)</h3>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      Vision Subtitle
                    </label>
                    <input
                      type="text"
                      value={pageData.vision_subtitle_en}
                      onChange={(e) => setPageData({ ...pageData, vision_subtitle_en: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      Vision Description
                    </label>
                    <textarea
                      rows={5}
                      value={pageData.vision_description_en}
                      onChange={(e) => setPageData({ ...pageData, vision_description_en: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-xs uppercase text-[#631012]">विजन वक्तव्य (हिंदी)</h3>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      विजन उपशीर्षक
                    </label>
                    <input
                      type="text"
                      value={pageData.vision_subtitle_hi}
                      onChange={(e) => setPageData({ ...pageData, vision_subtitle_hi: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      विजन विवरण
                    </label>
                    <textarea
                      rows={5}
                      value={pageData.vision_description_hi}
                      onChange={(e) => setPageData({ ...pageData, vision_description_hi: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSavePage}
                disabled={savingPage}
                className="bg-[#631012] hover:bg-[#500c0e] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
              >
                <Save size={16} />
                <span>{savingPage ? 'Saving...' : 'Save Statements'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold">
                {editingId ? 'Edit Mission Pillar' : 'Add Mission Pillar'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Icon</label>
                <select
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-semibold"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formTitleEn}
                  onChange={(e) => setFormTitleEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Title (Hindi)
                </label>
                <input
                  type="text"
                  value={formTitleHi}
                  onChange={(e) => setFormTitleHi(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Description (English) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescEn}
                  onChange={(e) => setFormDescEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Description (Hindi)
                </label>
                <textarea
                  rows={2}
                  value={formDescHi}
                  onChange={(e) => setFormDescHi(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#631012] hover:bg-[#500c0e] text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Pillar' : 'Add Pillar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
