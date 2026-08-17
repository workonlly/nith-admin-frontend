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
  BookOpen,
} from 'lucide-react';

interface WorkshopFormat {
  id: number;
  sl_no: string;
  form_type_en: string;
  form_type_hn: string;
  title_en: string;
  title_hn: string;
  description_en: string;
  description_hn: string;
  pdf_url: string;
  word_url: string;
}

interface WorkshopNotice {
  id: number;
  sl_no: string;
  title_en: string;
  title_hn: string;
  description_en: string;
  description_hn: string;
  remarks_en: string;
  remarks_hn: string;
  date_en: string;
  date_hn: string;
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

export default function RulesConductingWorkshopsAdmin() {
  const [heading, setHeading] = useState<HeadingData>({
    title_en: 'Conference/Workshop/FDP/STC Rules Formats',
    title_hn: 'सम्मेलन/कार्यशाला/एफडीपी/एसटीसी नियम प्रारूप',
    sub_title_en: 'Download Rules For Organizing Conference (International/ National), Workshop/Faculty Development Programme/Short Term Course, Expert Lectures',
    sub_title_hn: 'सम्मेलन (अंतर्राष्ट्रीय/राष्ट्रीय), कार्यशाला/संकाय विकास कार्यक्रम/अल्पकालिक पाठ्यक्रम, विशेषज्ञ व्याख्यान आयोजित करने के लिए नियम प्रारूप डाउनलोड करें',
  });

  const [formats, setFormats] = useState<WorkshopFormat[]>([]);
  const [notices, setNotices] = useState<WorkshopNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingHeading, setSavingHeading] = useState(false);
  const [activeTab, setActiveTab] = useState<'formats' | 'notices' | 'heading'>('formats');

  // Modal states for Formats
  const [formatModalOpen, setFormatModalOpen] = useState(false);
  const [editingFormatId, setEditingFormatId] = useState<number | null>(null);
  const [formFormatSlNo, setFormFormatSlNo] = useState('1');
  const [formFormTypeEn, setFormFormTypeEn] = useState('Form 1');
  const [formFormTypeHn, setFormFormTypeHn] = useState('प्रारूप 1');
  const [formFormatDescEn, setFormFormatDescEn] = useState('');
  const [formFormatDescHn, setFormFormatDescHn] = useState('');
  const [formFormatPdfUrl, setFormFormatPdfUrl] = useState('');
  const [formFormatWordUrl, setFormFormatWordUrl] = useState('');

  // Modal states for Notices
  const [noticeModalOpen, setNoticeModalOpen] = useState(false);
  const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null);
  const [formNoticeSlNo, setFormNoticeSlNo] = useState('1');
  const [formNoticeTitleEn, setFormNoticeTitleEn] = useState('');
  const [formNoticeTitleHn, setFormNoticeTitleHn] = useState('');
  const [formNoticeRemarksEn, setFormNoticeRemarksEn] = useState('Dean (Faculty Welfare) , NIT Hamirpur (HP)');
  const [formNoticeRemarksHn, setFormNoticeRemarksHn] = useState('डीन (संकाय कल्याण), एनआईटी हमीरपुर (हि.प्र.)');
  const [formNoticeDateEn, setFormNoticeDateEn] = useState('');
  const [formNoticeDateHn, setFormNoticeDateHn] = useState('');
  const [formNoticePdfUrl, setFormNoticePdfUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch heading
      const hRes = await fetch(`${API_BASE}/api/faculty-workshop`);
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

      // Fetch formats list
      const fRes = await fetch(`${API_BASE}/api/faculty-workshop/list`);
      if (fRes.ok) {
        const fData = await fRes.json();
        if (Array.isArray(fData)) setFormats(fData);
      }

      // Fetch notices list
      const nRes = await fetch(`${API_BASE}/api/faculty-workshop/notices`);
      if (nRes.ok) {
        const nData = await nRes.json();
        if (Array.isArray(nData)) setNotices(nData);
      }
    } catch (err) {
      console.error('Error fetching workshop data:', err);
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
      const res = await fetch(`${API_BASE}/api/faculty-workshop`, {
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

  // FORMATS CRUD
  const openAddFormatModal = () => {
    setEditingFormatId(null);
    setFormFormatSlNo((formats.length + 1).toString());
    setFormFormTypeEn(`Form ${formats.length + 1}`);
    setFormFormTypeHn(`प्रारूप ${formats.length + 1}`);
    setFormFormatDescEn('');
    setFormFormatDescHn('');
    setFormFormatPdfUrl('');
    setFormFormatWordUrl('');
    setFormatModalOpen(true);
  };

  const openEditFormatModal = (item: WorkshopFormat) => {
    setEditingFormatId(item.id);
    setFormFormatSlNo(item.sl_no || '1');
    setFormFormTypeEn(item.form_type_en || 'Form 1');
    setFormFormTypeHn(item.form_type_hn || 'प्रारूप 1');
    setFormFormatDescEn(item.title_en || item.description_en || '');
    setFormFormatDescHn(item.title_hn || item.description_hn || '');
    setFormFormatPdfUrl(item.pdf_url || '');
    setFormFormatWordUrl(item.word_url || '');
    setFormatModalOpen(true);
  };

  const handleSubmitFormat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        sl_no: formFormatSlNo,
        form_type_en: formFormTypeEn,
        form_type_hn: formFormTypeHn,
        title_en: formFormatDescEn,
        title_hn: formFormatDescHn,
        description_en: formFormatDescEn,
        description_hn: formFormatDescHn,
        pdf_url: formFormatPdfUrl,
        word_url: formFormatWordUrl,
      };

      let res;
      if (editingFormatId) {
        res = await fetch(`${API_BASE}/api/faculty-workshop/list/${editingFormatId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/api/faculty-workshop/list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingFormatId ? 'Format updated!' : 'Format added successfully!');
        setFormatModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save format');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving format');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFormat = async (id: number) => {
    if (!confirm('Are you sure you want to delete this format?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/faculty-workshop/list/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // NOTICES CRUD
  const openAddNoticeModal = () => {
    setEditingNoticeId(null);
    setFormNoticeSlNo((notices.length + 1).toString());
    setFormNoticeTitleEn('');
    setFormNoticeTitleHn('');
    setFormNoticeRemarksEn('Dean (Faculty Welfare) , NIT Hamirpur (HP)');
    setFormNoticeRemarksHn('डीन (संकाय कल्याण), एनआईटी हमीरपुर (हि.प्र.)');
    setFormNoticeDateEn(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
    setFormNoticeDateHn(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
    setFormNoticePdfUrl('');
    setNoticeModalOpen(true);
  };

  const openEditNoticeModal = (item: WorkshopNotice) => {
    setEditingNoticeId(item.id);
    setFormNoticeSlNo(item.sl_no || '1');
    setFormNoticeTitleEn(item.title_en || item.description_en || '');
    setFormNoticeTitleHn(item.title_hn || item.description_hn || '');
    setFormNoticeRemarksEn(item.remarks_en || 'Dean (Faculty Welfare) , NIT Hamirpur (HP)');
    setFormNoticeRemarksHn(item.remarks_hn || 'डीन (संकाय कल्याण), एनआईटी हमीरपुर (हि.प्र.)');
    setFormNoticeDateEn(item.date_en || '');
    setFormNoticeDateHn(item.date_hn || '');
    setFormNoticePdfUrl(item.pdf_url || '');
    setNoticeModalOpen(true);
  };

  const handleSubmitNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        sl_no: formNoticeSlNo,
        title_en: formNoticeTitleEn,
        title_hn: formNoticeTitleHn,
        description_en: formNoticeTitleEn,
        description_hn: formNoticeTitleHn,
        remarks_en: formNoticeRemarksEn,
        remarks_hn: formNoticeRemarksHn,
        date_en: formNoticeDateEn,
        date_hn: formNoticeDateHn,
        pdf_url: formNoticePdfUrl,
        word_url: '#',
      };

      let res;
      if (editingNoticeId) {
        res = await fetch(`${API_BASE}/api/faculty-workshop/notices/${editingNoticeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/api/faculty-workshop/notices`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingNoticeId ? 'Notice updated!' : 'Notice added successfully!');
        setNoticeModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save notice');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNotice = async (id: number) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/faculty-workshop/notices/${id}`, {
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
              <BookOpen size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workshop & Conference Rules Manager</h1>
              <p className="text-xs text-gray-500">
                Manage proposal formats (Form 1, 2, 3) and official workshop notices and circulars.
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
            {activeTab === 'formats' && (
              <button
                onClick={openAddFormatModal}
                className="bg-[#631012] hover:bg-[#500c0e] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm"
              >
                <Plus size={16} />
                <span>Add Format</span>
              </button>
            )}
            {activeTab === 'notices' && (
              <button
                onClick={openAddNoticeModal}
                className="bg-[#631012] hover:bg-[#500c0e] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm"
              >
                <Plus size={16} />
                <span>Add Notice</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('formats')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'formats'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen size={16} />
            <span>Rule Formats ({formats.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'notices'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText size={16} />
            <span>Notices & Orders ({notices.length})</span>
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
          {/* Tab 1: Formats */}
          {activeTab === 'formats' && (
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
                  <thead className="bg-[#f0f4f8] border-b border-gray-300 text-[#0c344e] font-mono uppercase text-xs">
                    <tr>
                      <th className="py-3 px-4 w-16 text-center">Sl. No.</th>
                      <th className="py-3 px-4 w-28 text-center">Form Type</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 w-36 text-center">Download</th>
                      <th className="py-3 px-4 w-24 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {formats.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-center font-bold text-gray-600">
                          {item.sl_no || index + 1}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-center font-semibold text-gray-800">
                          {item.form_type_en}
                        </td>
                        <td className="py-3.5 px-4 space-y-1">
                          <div className="font-semibold text-gray-900">
                            {item.title_en || item.description_en}
                          </div>
                          {item.title_hn && (
                            <div className="text-xs text-gray-600 font-medium">
                              {item.title_hn}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-3 font-mono font-bold text-xs">
                            {item.pdf_url ? (
                              <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" className="text-[#631012] hover:underline">
                                PDF
                              </a>
                            ) : <span className="text-gray-300">PDF</span>}
                            <span>|</span>
                            {item.word_url ? (
                              <a href={item.word_url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                                Word
                              </a>
                            ) : <span className="text-gray-300">Word</span>}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button onClick={() => openEditFormatModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDeleteFormat(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
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

          {/* Tab 2: Notices */}
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
                            {item.title_en || item.description_en}
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
                            <button onClick={() => openEditNoticeModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDeleteNotice(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
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

          {/* Tab 3: Heading */}
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

      {/* Format Modal */}
      {formatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold">{editingFormatId ? 'Edit Format' : 'Add Format'}</h2>
              <button onClick={() => setFormatModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitFormat} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Sl. No.</label>
                  <input
                    type="text"
                    value={formFormatSlNo}
                    onChange={(e) => setFormFormatSlNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Form Type (e.g. Form 1)</label>
                  <input
                    type="text"
                    value={formFormTypeEn}
                    onChange={(e) => setFormFormTypeEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Description (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={formFormatDescEn}
                  onChange={(e) => setFormFormatDescEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Description (Hindi)</label>
                <textarea
                  rows={2}
                  value={formFormatDescHn}
                  onChange={(e) => setFormFormatDescHn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">PDF URL</label>
                  <input
                    type="text"
                    value={formFormatPdfUrl}
                    onChange={(e) => setFormFormatPdfUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Word URL</label>
                  <input
                    type="text"
                    value={formFormatWordUrl}
                    onChange={(e) => setFormFormatWordUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
                <button type="button" onClick={() => setFormatModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-[#631012] hover:bg-[#500c0e] text-white rounded-lg text-xs font-bold shadow-sm">
                  {submitting ? 'Saving...' : editingFormatId ? 'Update Format' : 'Add Format'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notice Modal */}
      {noticeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold">{editingNoticeId ? 'Edit Notice' : 'Add Notice'}</h2>
              <button onClick={() => setNoticeModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitNotice} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Sl. No.</label>
                  <input
                    type="text"
                    value={formNoticeSlNo}
                    onChange={(e) => setFormNoticeSlNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Date of Upload</label>
                  <input
                    type="text"
                    value={formNoticeDateEn}
                    onChange={(e) => {
                      setFormNoticeDateEn(e.target.value);
                      setFormNoticeDateHn(e.target.value);
                    }}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-mono font-bold"
                    placeholder="02-11-2021"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Particulars (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={formNoticeTitleEn}
                  onChange={(e) => setFormNoticeTitleEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Remarks (if any)</label>
                <input
                  type="text"
                  value={formNoticeRemarksEn}
                  onChange={(e) => setFormNoticeRemarksEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                  placeholder="Dean (Faculty Welfare) , NIT Hamirpur (HP)"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">PDF URL</label>
                <input
                  type="text"
                  value={formNoticePdfUrl}
                  onChange={(e) => setFormNoticePdfUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
                <button type="button" onClick={() => setNoticeModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-[#631012] hover:bg-[#500c0e] text-white rounded-lg text-xs font-bold shadow-sm">
                  {submitting ? 'Saving...' : editingNoticeId ? 'Update Notice' : 'Add Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
