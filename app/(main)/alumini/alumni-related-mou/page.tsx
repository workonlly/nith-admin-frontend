'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Save,
  Plus,
  Trash2,
  Edit2,
  Upload,
  ExternalLink,
  RefreshCw,
  Layout,
  FileCheck,
  X,
} from 'lucide-react';

interface MoUItem {
  id: number;
  sl_no: string;
  title_en: string;
  title_hn: string;
  drafted_date: string;
  document_url: string;
  file_type: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AlumniRelatedMouAdmin() {
  const [heading, setHeading] = useState<HeadingData>({
    title_en: 'Alumni Related MoU',
    title_hn: 'पूर्व छात्र संबंधित समझौता ज्ञापन (MoU)',
    sub_title_en: 'Memorandums of Understanding between NIT Hamirpur and esteemed Alumni / Corporate Organizations',
    sub_title_hn: 'एनआईटी हमीरपुर और पूर्व छात्र / कॉर्पोरेट संगठनों के बीच समझौता ज्ञापन',
  });

  const [mous, setMous] = useState<MoUItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingHeading, setSavingHeading] = useState(false);
  const [activeTab, setActiveTab] = useState<'mous' | 'heading'>('mous');

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formSlNo, setFormSlNo] = useState('');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleHn, setFormTitleHn] = useState('');
  const [formDraftedDate, setFormDraftedDate] = useState('');
  const [formDocUrl, setFormDocUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch heading
      const hRes = await fetch(`${API_BASE}/api/alumni-mou`);
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
      const lRes = await fetch(`${API_BASE}/api/alumni-mou/list`);
      if (lRes.ok) {
        const lData = await lRes.json();
        if (Array.isArray(lData)) {
          setMous(lData);
        }
      }
    } catch (err) {
      console.error('Error fetching MoU data:', err);
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
      const res = await fetch(`${API_BASE}/api/alumni-mou`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heading),
      });
      if (res.ok) {
        alert('Page Heading saved successfully!');
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
    setFormSlNo((mous.length + 1).toString());
    setFormTitleEn('');
    setFormTitleHn('');
    setFormDraftedDate(new Date().toISOString().split('T')[0]);
    setFormDocUrl('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setModalOpen(true);
  };

  const openEditModal = (item: MoUItem) => {
    setEditingId(item.id);
    setFormSlNo(item.sl_no || '');
    setFormTitleEn(item.title_en || '');
    setFormTitleHn(item.title_hn || '');
    setFormDraftedDate(item.drafted_date || '');
    setFormDocUrl(item.document_url || '');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setModalOpen(true);
  };

  const handleSubmitMoU = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleEn.trim()) {
      alert('Please enter the English MoU Title');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('sl_no', formSlNo);
      formData.append('title_en', formTitleEn);
      formData.append('title_hn', formTitleHn);
      formData.append('drafted_date', formDraftedDate);
      formData.append('file_type', 'PDF');

      if (selectedFile) {
        formData.append('file', selectedFile);
      } else if (formDocUrl) {
        formData.append('document_url', formDocUrl);
      }

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/api/alumni-mou/list/${editingId}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        res = await fetch(`${API_BASE}/api/alumni-mou/list`, {
          method: 'POST',
          body: formData,
        });
      }

      if (res.ok) {
        alert(editingId ? 'MoU updated successfully!' : 'New MoU added successfully!');
        setModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save MoU');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving MoU');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMoU = async (id: number) => {
    if (!confirm('Are you sure you want to delete this MoU?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/alumni-mou/list/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete MoU');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting MoU');
    }
  };

  return (
    <div className="space-y-6 p-6 font-sans">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Alumni Related MoU Manager</h1>
              <p className="text-xs text-gray-500">
                Upload and manage Memorandums of Understanding (MoU) with title, document files, and drafting dates.
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
              <span>Add New MoU</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('mous')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'mous'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText size={16} />
            <span>MoU Documents List ({mous.length})</span>
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
            <span>Page Title & Subtitle</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: MoU List */}
          {activeTab === 'mous' && (
            <div className="space-y-4">
              {mous.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">No MoU records uploaded yet.</p>
                  <button
                    onClick={openAddModal}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#631012] text-white text-xs font-bold rounded-lg"
                  >
                    <Plus size={14} /> Add First MoU
                  </button>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
                    <thead className="bg-[#f0f4f8] border-b border-gray-300 text-[#0c344e] font-mono uppercase text-xs">
                      <tr>
                        <th className="py-3 px-4 w-16 text-center">Sl. No.</th>
                        <th className="py-3 px-4">MoU Title</th>
                        <th className="py-3 px-4 w-36">Drafted Date</th>
                        <th className="py-3 px-4 w-32">Document File</th>
                        <th className="py-3 px-4 w-28 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {mous.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-center font-bold text-gray-600">
                            {item.sl_no || index + 1}
                          </td>
                          <td className="py-3.5 px-4 space-y-1">
                            <div className="font-bold text-gray-900 leading-snug">
                              {item.title_en}
                            </div>
                            {item.title_hn && (
                              <div className="text-xs text-gray-600 font-medium">
                                {item.title_hn}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">
                            {item.drafted_date || '--'}
                          </td>
                          <td className="py-3.5 px-4">
                            {item.document_url ? (
                              <a
                                href={item.document_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-[#631012] hover:bg-[#631012] hover:text-white rounded border border-red-200 text-xs font-semibold transition-colors"
                              >
                                <ExternalLink size={12} />
                                <span>View PDF</span>
                              </a>
                            ) : (
                              <span className="text-gray-400 italic text-xs">No File</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                title="Edit MoU"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteMoU(item.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="Delete MoU"
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

          {/* Tab 2: Heading */}
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
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold">
                {editingId ? 'Edit MoU Record' : 'Upload New MoU Record'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitMoU} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Sl. No.
                  </label>
                  <input
                    type="text"
                    value={formSlNo}
                    onChange={(e) => setFormSlNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] font-mono font-bold"
                    placeholder="1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Drafted Date
                  </label>
                  <input
                    type="date"
                    value={formDraftedDate}
                    onChange={(e) => setFormDraftedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  MoU Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formTitleEn}
                  onChange={(e) => setFormTitleEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] font-semibold"
                  placeholder="e.g. MoU between EPACK Durable limited and NIT Hamirpur (H.P.)"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  MoU Title (Hindi)
                </label>
                <input
                  type="text"
                  value={formTitleHn}
                  onChange={(e) => setFormTitleHn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="उदा. ईपैक ड्यूरेबल लिमिटेड और एनआईटी हमीरपुर..."
                />
              </div>

              {/* File Upload / Link Box */}
              <div className="border border-gray-300 p-4 rounded-lg bg-gray-50/70 space-y-2">
                <label className="text-[11px] font-bold uppercase text-gray-700 flex items-center gap-1.5">
                  <Upload size={14} className="text-[#631012]" />
                  <span>Upload MoU Document (PDF):</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#631012] file:text-white hover:file:bg-[#500c0e]"
                />

                <div className="pt-2">
                  <span className="text-[10px] text-gray-500 block mb-1">Or Document External URL:</span>
                  <input
                    type="text"
                    value={formDocUrl}
                    onChange={(e) => setFormDocUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    placeholder="https://... or /uploads/..."
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
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
                  <FileCheck size={15} />
                  <span>{submitting ? 'Saving...' : editingId ? 'Update MoU' : 'Add MoU'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}