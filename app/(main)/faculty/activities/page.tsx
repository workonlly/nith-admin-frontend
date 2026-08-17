'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Layout,
  CheckCircle2,
  X,
  FileText,
} from 'lucide-react';

interface ActivitySubtext {
  id: number;
  heading_en: string;
  heading_hn: string;
  subheading_en: string;
  subheading_hn: string;
  small_text: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function FacultyActivitiesAdmin() {
  const [heading, setHeading] = useState<HeadingData>({
    title_en: 'ACTIVITIES',
    title_hn: 'गतिविधियां',
    sub_title_en: 'As per the schedule ‘C’ of NIT statutes the role and responsibilities of the Dean (Faculty Welfare) is to advice the Director in matters related to:',
    sub_title_hn: 'एनआईटी संविधियों की अनुसूची \'सी\' के अनुसार डीन (संकाय कल्याण) की भूमिका और जिम्मेदारियां निदेशक को निम्नलिखित से संबंधित मामलों में सलाह देना है:',
  });

  const [subtexts, setSubtexts] = useState<ActivitySubtext[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingHeading, setSavingHeading] = useState(false);
  const [activeTab, setActiveTab] = useState<'responsibilities' | 'heading'>('responsibilities');

  // Modal states for Subtext
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formHeadingEn, setFormHeadingEn] = useState('');
  const [formHeadingHn, setFormHeadingHn] = useState('');
  const [formSubheadingEn, setFormSubheadingEn] = useState('');
  const [formSubheadingHn, setFormSubheadingHn] = useState('');
  const [formSmallText, setFormSmallText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Heading
      const hRes = await fetch(`${API_BASE}/api/faculty-activities`);
      if (hRes.ok) {
        const hData = await hRes.json();
        if (hData && hData.title_en) {
          setHeading({
            title_en: hData.title_en || '',
            title_hn: hData.title_hn || '',
            sub_title_en: hData.sub_title_en || '',
            sub_title_hn: hData.sub_title_hn || '',
          });
        }
      }

      // 2. Fetch Subtexts / Responsibilities
      const sRes = await fetch(`${API_BASE}/api/faculty-activities/subtext`);
      if (sRes.ok) {
        const sData = await sRes.json();
        if (Array.isArray(sData)) {
          setSubtexts(sData);
        }
      }
    } catch (err) {
      console.error('Error fetching faculty activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveHeading = async () => {
    try {
      setSavingHeading(true);
      const res = await fetch(`${API_BASE}/api/faculty-activities`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heading),
      });
      if (res.ok) {
        alert('Heading settings saved successfully!');
      } else {
        alert('Failed to save heading');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving heading');
    } finally {
      setSavingHeading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormHeadingEn('');
    setFormHeadingHn('');
    setFormSubheadingEn('');
    setFormSubheadingHn('');
    setFormSmallText('');
    setModalOpen(true);
  };

  const openEditModal = (item: ActivitySubtext) => {
    setEditingId(item.id);
    setFormHeadingEn(item.heading_en || '');
    setFormHeadingHn(item.heading_hn || '');
    setFormSubheadingEn(item.subheading_en || '');
    setFormSubheadingHn(item.subheading_hn || '');
    setFormSmallText(item.small_text || '');
    setModalOpen(true);
  };

  const handleSubmitSubtext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSmallText.trim() && !formHeadingEn.trim()) {
      alert('Please enter responsibility or title text');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        heading_en: formHeadingEn || formSmallText.substring(0, 50),
        heading_hn: formHeadingHn,
        subheading_en: formSubheadingEn,
        subheading_hn: formSubheadingHn,
        small_text: formSmallText || formHeadingEn,
      };

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/api/faculty-activities/subtext/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/api/faculty-activities/subtext`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingId ? 'Responsibility updated successfully!' : 'Responsibility added successfully!');
        setModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save responsibility');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubtext = async (id: number) => {
    if (!confirm('Are you sure you want to delete this responsibility?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/faculty-activities/subtext/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete responsibility');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting responsibility');
    }
  };

  return (
    <div className="space-y-6 p-6 font-sans">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Faculty Activities Manager</h1>
              <p className="text-xs text-gray-500">
                Manage roles, responsibilities, and guidelines of Dean (Faculty Welfare) as per NIT statutes.
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
              <span>Add Responsibility</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('responsibilities')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'responsibilities'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText size={16} />
            <span>Responsibilities List ({subtexts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('heading')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'heading'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layout size={16} />
            <span>Page Header & Intro Settings</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Responsibilities List */}
          {activeTab === 'responsibilities' && (
            <div className="space-y-4">
              {subtexts.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">No responsibilities added yet.</p>
                  <button
                    onClick={openAddModal}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#631012] text-white text-xs font-bold rounded-lg"
                  >
                    <Plus size={14} /> Add First Item
                  </button>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
                    <thead className="bg-[#f0f4f8] border-b border-gray-300 text-[#0c344e] font-mono uppercase text-xs">
                      <tr>
                        <th className="py-3 px-4 w-16 text-center">Sl. No.</th>
                        <th className="py-3 px-4">Responsibility / Role Description</th>
                        <th className="py-3 px-4 w-60">Category / Subheading</th>
                        <th className="py-3 px-4 w-28 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {subtexts.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-center font-bold text-gray-600 align-top">
                            {index + 1}
                          </td>
                          <td className="py-3.5 px-4 space-y-1.5">
                            <div className="font-semibold text-gray-900 leading-relaxed">
                              {item.small_text || item.heading_en}
                            </div>
                            {item.heading_hn && (
                              <div className="text-xs text-gray-600 font-medium">
                                {item.heading_hn}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-gray-600 align-top">
                            {item.subheading_en || item.heading_en || '--'}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap align-top">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                title="Edit"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteSubtext(item.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Header Settings */}
          {activeTab === 'heading' && (
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <label className="text-xs font-bold uppercase text-gray-700 block">
                    Page Title (English)
                  </label>
                  <input
                    type="text"
                    value={heading.title_en}
                    onChange={(e) => setHeading({ ...heading, title_en: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  />
                  <label className="text-xs font-bold uppercase text-gray-700 block pt-2">
                    Subtitle / Statutory Introduction (English)
                  </label>
                  <textarea
                    rows={4}
                    value={heading.sub_title_en}
                    onChange={(e) => setHeading({ ...heading, sub_title_en: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  />
                </div>

                <div className="space-y-3 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <label className="text-xs font-bold uppercase text-gray-700 block">
                    Page Title (Hindi)
                  </label>
                  <input
                    type="text"
                    value={heading.title_hn}
                    onChange={(e) => setHeading({ ...heading, title_hn: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  />
                  <label className="text-xs font-bold uppercase text-gray-700 block pt-2">
                    Subtitle / Statutory Introduction (Hindi)
                  </label>
                  <textarea
                    rows={4}
                    value={heading.sub_title_hn}
                    onChange={(e) => setHeading({ ...heading, sub_title_hn: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveHeading}
                disabled={savingHeading}
                className="bg-[#631012] hover:bg-[#500c0e] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
              >
                <Save size={16} />
                <span>{savingHeading ? 'Saving...' : 'Save Title Settings'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold">
                {editingId ? 'Edit Responsibility' : 'Add New Responsibility'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitSubtext} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Responsibility Description (English) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formSmallText}
                  onChange={(e) => setFormSmallText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="e.g. Deputation of faculty to various institutions under Quality Improvement Programme."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Responsibility Description (Hindi)
                </label>
                <textarea
                  rows={3}
                  value={formHeadingHn}
                  onChange={(e) => setFormHeadingHn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="हिंदी विवरण..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Short Title / Category (English)
                  </label>
                  <input
                    type="text"
                    value={formHeadingEn}
                    onChange={(e) => setFormHeadingEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    placeholder="e.g. Faculty Deputation under QIP"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Subheading / Scope (English)
                  </label>
                  <input
                    type="text"
                    value={formSubheadingEn}
                    onChange={(e) => setFormSubheadingEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    placeholder="e.g. Quality Improvement Programme"
                  />
                </div>
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
                  className="px-5 py-2 bg-[#631012] hover:bg-[#500c0e] text-white rounded-lg text-xs font-bold shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} />
                  <span>{submitting ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
