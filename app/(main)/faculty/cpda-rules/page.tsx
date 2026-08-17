'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Layout,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

interface CpdaRule {
  id: number;
  sl_no: string;
  particulars_en: string;
  particulars_hn: string;
  pdf_url: string;
  word_url: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function CpdaRulesAdmin() {
  const [heading, setHeading] = useState<HeadingData>({
    title_en: 'CUMULATIVE PROFESSIONAL DEVELOPMENT ALLOWANCE (CPDA) RULES W.E.F. 1st APRIL, 2021 to 31st MARCH, 2024',
    title_hn: 'संचयी व्यावसायिक विकास भत्ता (सीपीडीए) नियम - 1 अप्रैल 2021 से 31 मार्च 2024 तक लागू',
    sub_title_en: 'Guidelines, notifications, and office orders for the grant and utilization of CPDA for faculty members.',
    sub_title_hn: 'संकाय सदस्यों के लिए सीपीडीए के अनुदान और उपयोग के लिए दिशानिर्देश, अधिसूचनाएं और कार्यालय आदेश।',
  });

  const [rules, setRules] = useState<CpdaRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingHeading, setSavingHeading] = useState(false);
  const [activeTab, setActiveTab] = useState<'rules' | 'heading'>('rules');

  // Modal / Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formSlNo, setFormSlNo] = useState('1');
  const [formParticularsEn, setFormParticularsEn] = useState('');
  const [formParticularsHn, setFormParticularsHn] = useState('');
  const [formPdfUrl, setFormPdfUrl] = useState('');
  const [formWordUrl, setFormWordUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch heading
      const hRes = await fetch(`${API_BASE}/api/faculty-cpda`);
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

      // Fetch list
      const lRes = await fetch(`${API_BASE}/api/faculty-cpda/list`);
      if (lRes.ok) {
        const lData = await lRes.json();
        if (Array.isArray(lData)) {
          setRules(lData);
        }
      }
    } catch (err) {
      console.error('Error fetching CPDA rules:', err);
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
      const res = await fetch(`${API_BASE}/api/faculty-cpda`, {
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
    setFormSlNo((rules.length + 1).toString());
    setFormParticularsEn('');
    setFormParticularsHn('');
    setFormPdfUrl('');
    setFormWordUrl('');
    setModalOpen(true);
  };

  const openEditModal = (item: CpdaRule) => {
    setEditingId(item.id);
    setFormSlNo(item.sl_no || '1');
    setFormParticularsEn(item.particulars_en || '');
    setFormParticularsHn(item.particulars_hn || '');
    setFormPdfUrl(item.pdf_url || '');
    setFormWordUrl(item.word_url || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formParticularsEn.trim()) {
      alert('Please enter Particulars text');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        sl_no: formSlNo,
        particulars_en: formParticularsEn,
        particulars_hn: formParticularsHn,
        pdf_url: formPdfUrl,
        word_url: formWordUrl,
      };

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/api/faculty-cpda/list/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/api/faculty-cpda/list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingId ? 'CPDA rule updated!' : 'CPDA rule added successfully!');
        setModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save CPDA rule');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this CPDA rule?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/faculty-cpda/list/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete rule');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting rule');
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
              <h1 className="text-2xl font-bold text-gray-900">CPDA Rules Manager</h1>
              <p className="text-xs text-gray-500">
                Manage Cumulative Professional Development Allowance orders, circulars, and notifications.
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
              <span>Add CPDA Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'rules'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText size={16} />
            <span>CPDA Particulars ({rules.length})</span>
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
            <span>Page Title Settings</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Rules List */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              {rules.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">No CPDA orders added yet.</p>
                  <button
                    onClick={openAddModal}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#631012] text-white text-xs font-bold rounded-lg"
                  >
                    <Plus size={14} /> Add First Entry
                  </button>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
                    <thead className="bg-[#f0f4f8] border-b border-gray-300 text-[#0c344e] font-mono uppercase text-xs">
                      <tr>
                        <th className="py-3 px-4 w-16 text-center">Sl. No.</th>
                        <th className="py-3 px-4">Particulars</th>
                        <th className="py-3 px-4 w-40">Document Link</th>
                        <th className="py-3 px-4 w-28 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {rules.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-center font-bold text-gray-600">
                            {item.sl_no || index + 1}
                          </td>
                          <td className="py-3.5 px-4 space-y-1">
                            <div className="font-bold text-gray-900 leading-snug">
                              {item.particulars_en}
                            </div>
                            {item.particulars_hn && (
                              <div className="text-xs text-gray-600 font-medium">
                                {item.particulars_hn}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {item.pdf_url && item.pdf_url !== '#' ? (
                              <a
                                href={item.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[#631012] hover:underline font-semibold"
                              >
                                <span>View PDF</span>
                                <ExternalLink size={12} />
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs font-mono">No Link</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                title="Edit"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
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

          {/* Tab 2: Title Settings */}
          {activeTab === 'heading' && (
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <label className="text-xs font-bold uppercase text-gray-700 block">
                    Page Title (English)
                  </label>
                  <textarea
                    rows={3}
                    value={heading.title_en}
                    onChange={(e) => setHeading({ ...heading, title_en: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  />
                  <label className="text-xs font-bold uppercase text-gray-700 block pt-2">
                    Subtitle (English)
                  </label>
                  <textarea
                    rows={3}
                    value={heading.sub_title_en}
                    onChange={(e) => setHeading({ ...heading, sub_title_en: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  />
                </div>

                <div className="space-y-3 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <label className="text-xs font-bold uppercase text-gray-700 block">
                    Page Title (Hindi)
                  </label>
                  <textarea
                    rows={3}
                    value={heading.title_hn}
                    onChange={(e) => setHeading({ ...heading, title_hn: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  />
                  <label className="text-xs font-bold uppercase text-gray-700 block pt-2">
                    Subtitle (Hindi)
                  </label>
                  <textarea
                    rows={3}
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
                {editingId ? 'Edit CPDA Order' : 'Add New CPDA Order'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="w-24">
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Sl. No.
                </label>
                <input
                  type="text"
                  value={formSlNo}
                  onChange={(e) => setFormSlNo(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Particulars / Order Title (English) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formParticularsEn}
                  onChange={(e) => setFormParticularsEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] font-semibold"
                  placeholder="e.g. Office order regarding CPDA dated 13-03-2023"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Particulars / Order Title (Hindi)
                </label>
                <textarea
                  rows={2}
                  value={formParticularsHn}
                  onChange={(e) => setFormParticularsHn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="उदा. सीपीडीए के संबंध में कार्यालय आदेश..."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Document PDF URL
                </label>
                <input
                  type="text"
                  value={formPdfUrl}
                  onChange={(e) => setFormPdfUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="https://nith.ac.in/uploads/..."
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
                  className="px-5 py-2 bg-[#631012] hover:bg-[#500c0e] text-white rounded-lg text-xs font-bold shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} />
                  <span>{submitting ? 'Saving...' : editingId ? 'Update Record' : 'Add Order'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
