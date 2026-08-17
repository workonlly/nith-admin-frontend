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
  Bell,
} from 'lucide-react';

interface FacultyNotice {
  id: number;
  sl_no: string;
  title_en: string;
  title_hn: string;
  description_en?: string;
  description_hn?: string;
  remarks_en?: string;
  remarks_hn?: string;
  category_en?: string;
  category_hn?: string;
  date_en: string;
  date_hn: string;
  priority_en?: string;
  priority_hn?: string;
  view_url?: string;
  download_url?: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function FacultyNoticesAdmin() {
  const [heading, setHeading] = useState<HeadingData>({
    title_en: 'Notices/Office Orders/Notifications',
    title_hn: 'सूचनाएं / कार्यालय आदेश / अधिसूचनाएं',
    sub_title_en: 'Official notices, office orders, and notifications related to faculty welfare and administration at NIT Hamirpur.',
    sub_title_hn: 'एनआईटी हमीरपुर में संकाय कल्याण और प्रशासन से संबंधित आधिकारिक सूचनाएं, कार्यालय आदेश और अधिसूचनाएं।',
  });

  const [notices, setNotices] = useState<FacultyNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingHeading, setSavingHeading] = useState(false);
  const [activeTab, setActiveTab] = useState<'notices' | 'heading'>('notices');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formSlNo, setFormSlNo] = useState('1');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleHn, setFormTitleHn] = useState('');
  const [formRemarksEn, setFormRemarksEn] = useState('Office of The Registrar , NIT Hamirpur (HP)');
  const [formRemarksHn, setFormRemarksHn] = useState('कुलसचिव कार्यालय, एनआईटी हमीरपुर (हि.प्र.)');
  const [formDateEn, setFormDateEn] = useState('');
  const [formDateHn, setFormDateHn] = useState('');
  const [formCategoryEn, setFormCategoryEn] = useState('Office Order');
  const [formPdfUrl, setFormPdfUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch heading
      const hRes = await fetch(`${API_BASE}/api/faculty-notices`);
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
      const lRes = await fetch(`${API_BASE}/api/faculty-notices/list`);
      if (lRes.ok) {
        const lData = await lRes.json();
        if (Array.isArray(lData)) setNotices(lData);
      }
    } catch (err) {
      console.error('Error fetching faculty notices:', err);
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
      const res = await fetch(`${API_BASE}/api/faculty-notices`, {
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
    setFormSlNo((notices.length + 1).toString());
    setFormTitleEn('');
    setFormTitleHn('');
    setFormRemarksEn('Office of The Registrar , NIT Hamirpur (HP)');
    setFormRemarksHn('कुलसचिव कार्यालय, एनआईटी हमीरपुर (हि.प्र.)');
    setFormDateEn(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
    setFormDateHn(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
    setFormCategoryEn('Office Order');
    setFormPdfUrl('');
    setModalOpen(true);
  };

  const openEditModal = (item: FacultyNotice) => {
    setEditingId(item.id);
    setFormSlNo(item.sl_no || '1');
    setFormTitleEn(item.title_en || '');
    setFormTitleHn(item.title_hn || '');
    setFormRemarksEn(item.remarks_en || 'Office of The Registrar , NIT Hamirpur (HP)');
    setFormRemarksHn(item.remarks_hn || 'कुलसचिव कार्यालय, एनआईटी हमीरपुर (हि.प्र.)');
    setFormDateEn(item.date_en || '');
    setFormDateHn(item.date_hn || '');
    setFormCategoryEn(item.category_en || 'Office Order');
    setFormPdfUrl(item.view_url || item.download_url || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleEn.trim()) {
      alert('Please enter Particulars text');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        sl_no: formSlNo,
        title_en: formTitleEn,
        title_hn: formTitleHn,
        description_en: formTitleEn,
        description_hn: formTitleHn,
        remarks_en: formRemarksEn,
        remarks_hn: formRemarksHn,
        category_en: formCategoryEn,
        category_hn: formCategoryEn === 'Office Order' ? 'कार्यालय आदेश' : 'सूचना',
        date_en: formDateEn,
        date_hn: formDateHn || formDateEn,
        view_url: formPdfUrl,
        download_url: formPdfUrl,
      };

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/api/faculty-notices/list/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/api/faculty-notices/list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingId ? 'Notice updated!' : 'Notice added successfully!');
        setModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save notice');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/faculty-notices/list/${id}`, {
        method: 'DELETE',
      });
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
              <Bell size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Faculty Related Notices Manager</h1>
              <p className="text-xs text-gray-500">
                Manage notices, office orders, circulars, and notifications for faculty welfare.
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
              <span>Add Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('notices')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'notices'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bell size={16} />
            <span>Notices / Orders List ({notices.length})</span>
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
          {/* Tab 1: Notices */}
          {activeTab === 'notices' && (
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
                  <thead className="bg-[#f0f4f8] border-b border-gray-300 text-[#0c344e] font-mono uppercase text-xs">
                    <tr>
                      <th className="py-3 px-4 w-16 text-center">Sl. No.</th>
                      <th className="py-3 px-4">Particulars</th>
                      <th className="py-3 px-4 w-60">Remarks (if any)</th>
                      <th className="py-3 px-4 w-32 text-center">Date of Upload</th>
                      <th className="py-3 px-4 w-24 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {notices.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-center font-bold text-gray-600">
                          {item.sl_no || index + 1}
                        </td>
                        <td className="py-3.5 px-4 space-y-1">
                          <div className="font-semibold text-gray-900">
                            {item.title_en}
                          </div>
                          {item.title_hn && (
                            <div className="text-xs text-gray-600 font-medium">
                              {item.title_hn}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-700">
                          {item.remarks_en || '--'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-center text-xs text-gray-800 font-semibold">
                          {item.date_en || '--'}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button onClick={() => openEditModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
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

          {/* Tab 2: Title Settings */}
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
                    Subtitle (English)
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
                    Subtitle (Hindi)
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
              <h2 className="text-base font-bold">{editingId ? 'Edit Notice' : 'Add Notice'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Sl. No.</label>
                  <input
                    type="text"
                    value={formSlNo}
                    onChange={(e) => setFormSlNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Date of Upload</label>
                  <input
                    type="text"
                    value={formDateEn}
                    onChange={(e) => {
                      setFormDateEn(e.target.value);
                      setFormDateHn(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-mono font-bold"
                    placeholder="08-10-2025"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Particulars (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={formTitleEn}
                  onChange={(e) => setFormTitleEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="e.g. Office order regarding TA DA Entitlements of Temporary Faculty Members"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Particulars (Hindi)</label>
                <textarea
                  rows={2}
                  value={formTitleHn}
                  onChange={(e) => setFormTitleHn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="हिंदी विवरण..."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Remarks (if any)</label>
                <input
                  type="text"
                  value={formRemarksEn}
                  onChange={(e) => setFormRemarksEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                  placeholder="Office of The Registrar , NIT Hamirpur (HP)"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Document URL (PDF)</label>
                <input
                  type="text"
                  value={formPdfUrl}
                  onChange={(e) => setFormPdfUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-[#631012] hover:bg-[#500c0e] text-white rounded-lg text-xs font-bold shadow-sm">
                  {submitting ? 'Saving...' : editingId ? 'Update Notice' : 'Add Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
