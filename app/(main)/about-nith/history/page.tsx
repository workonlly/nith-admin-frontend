'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  Plus,
  Edit2,
  Trash2,
  Save,
  RefreshCw,
  Layout,
  CheckCircle2,
  X,
  Clock,
} from 'lucide-react';

interface TimelineEvent {
  id: number;
  year: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
}

interface PageData {
  description1_en: string;
  description2_en: string;
  legacy_en: string;
  description1_hi: string;
  description2_hi: string;
  legacy_hi: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function HistoryAdminPage() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [pageData, setPageData] = useState<PageData>({
    description1_en: '',
    description2_en: '',
    legacy_en: '',
    description1_hi: '',
    description2_hi: '',
    legacy_hi: '',
  });

  const [loading, setLoading] = useState(true);
  const [savingPage, setSavingPage] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'page'>('timeline');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formYear, setFormYear] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleHi, setFormTitleHi] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formDescHi, setFormDescHi] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/history`);
      const json = await res.json();
      if (json.success) {
        setTimeline(json.data || []);
        if (json.page && json.page.description1_en) {
          setPageData({
            description1_en: json.page.description1_en || '',
            description2_en: json.page.description2_en || '',
            legacy_en: json.page.legacy_en || '',
            description1_hi: json.page.description1_hi || '',
            description2_hi: json.page.description2_hi || '',
            legacy_hi: json.page.legacy_hi || '',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching history:', err);
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
      const res = await fetch(`${API_BASE}/history/page`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });
      if (res.ok) {
        alert('History introductory overview saved successfully!');
      } else {
        alert('Failed to save overview');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving overview');
    } finally {
      setSavingPage(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormYear(new Date().getFullYear().toString());
    setFormTitleEn('');
    setFormTitleHi('');
    setFormDescEn('');
    setFormDescHi('');
    setModalOpen(true);
  };

  const openEditModal = (item: TimelineEvent) => {
    setEditingId(item.id);
    setFormYear(item.year || '');
    setFormTitleEn(item.title_en || '');
    setFormTitleHi(item.title_hi || '');
    setFormDescEn(item.description_en || '');
    setFormDescHi(item.description_hi || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formYear.trim() || !formTitleEn.trim()) {
      alert('Please provide year and title');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        year: formYear,
        title_en: formTitleEn,
        title_hi: formTitleHi || formTitleEn,
        description_en: formDescEn,
        description_hi: formDescHi || formDescEn,
      };

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/history/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingId ? 'Timeline milestone updated!' : 'Timeline milestone added!');
        setModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save milestone');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving milestone');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;
    try {
      const res = await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
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
              <History size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Institute History & Timeline Manager</h1>
              <p className="text-xs text-gray-500">
                Manage the historical narrative, foundation milestones, and chronological timeline of NIT Hamirpur.
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
              <span>Add Milestone</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'timeline'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock size={16} />
            <span>Timeline Milestones ({timeline.length})</span>
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
            <span>Historical Overview Narratives</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
                  <thead className="bg-[#f0f4f8] border-b border-gray-300 text-[#0c344e] font-mono uppercase text-xs">
                    <tr>
                      <th className="py-3 px-4 w-24 text-center">Year</th>
                      <th className="py-3 px-4 w-60">Milestone Title</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 w-24 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {timeline.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-[#631012] text-sm">
                          {item.year}
                        </td>
                        <td className="py-3.5 px-4 space-y-1">
                          <div className="font-bold text-gray-900">{item.title_en}</div>
                          {item.title_hi && (
                            <div className="text-xs text-gray-600 font-medium">{item.title_hi}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 space-y-1 text-gray-700 text-xs sm:text-sm leading-relaxed">
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

          {/* Tab 2: Historical Overview Narrative */}
          {activeTab === 'page' && (
            <div className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* English Overview */}
                <div className="space-y-4 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-xs uppercase text-[#631012]">
                    Narrative (English)
                  </h3>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      Inception Paragraph 1
                    </label>
                    <textarea
                      rows={4}
                      value={pageData.description1_en}
                      onChange={(e) => setPageData({ ...pageData, description1_en: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      Evolution & NIT Status Paragraph 2
                    </label>
                    <textarea
                      rows={4}
                      value={pageData.description2_en}
                      onChange={(e) => setPageData({ ...pageData, description2_en: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      Campus & Legacy Paragraph 3
                    </label>
                    <textarea
                      rows={3}
                      value={pageData.legacy_en}
                      onChange={(e) => setPageData({ ...pageData, legacy_en: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                </div>

                {/* Hindi Overview */}
                <div className="space-y-4 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-xs uppercase text-[#631012]">
                    वर्णन (हिंदी)
                  </h3>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      शुरुआत अनुच्छेद 1
                    </label>
                    <textarea
                      rows={4}
                      value={pageData.description1_hi}
                      onChange={(e) => setPageData({ ...pageData, description1_hi: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      विकास और एनआईटी दर्जा अनुच्छेद 2
                    </label>
                    <textarea
                      rows={4}
                      value={pageData.description2_hi}
                      onChange={(e) => setPageData({ ...pageData, description2_hi: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      परिसर और विरासत अनुच्छेद 3
                    </label>
                    <textarea
                      rows={3}
                      value={pageData.legacy_hi}
                      onChange={(e) => setPageData({ ...pageData, legacy_hi: e.target.value })}
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
                <span>{savingPage ? 'Saving...' : 'Save Historical Narratives'}</span>
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
                {editingId ? 'Edit History Milestone' : 'Add History Milestone'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="w-32">
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Year *</label>
                <input
                  type="text"
                  required
                  value={formYear}
                  onChange={(e) => setFormYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-mono font-bold"
                  placeholder="e.g. 1986"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Milestone Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formTitleEn}
                  onChange={(e) => setFormTitleEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="e.g. Foundation as Regional Engineering College"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Milestone Title (Hindi)
                </label>
                <input
                  type="text"
                  value={formTitleHi}
                  onChange={(e) => setFormTitleHi(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="उदा. क्षेत्रीय इंजीनियरिंग कॉलेज के रूप में स्थापना"
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
                  {submitting ? 'Saving...' : editingId ? 'Update Milestone' : 'Add Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
