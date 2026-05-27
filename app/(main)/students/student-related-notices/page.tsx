'use client';

import React, { useState, useEffect } from 'react';
import { Save, Bell, Plus, Trash2, FileText, Calendar, AlertCircle, Eye, Download, Loader, Upload } from 'lucide-react';

interface Notice {
  id: number;
  title_en: string;
  title_hn: string;
  description_en: string;
  description_hn: string;
  date_en: string;
  date_hn: string;
  category_en: string;
  category_hn: string;
  priority_en: string;
  priority_hn: string;
  attachment_url: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  notices_heading_en: string;
  notices_heading_hn: string;
  notices_sub_en: string;
  notices_sub_hn: string;
  archive_heading_en: string;
  archive_heading_hn: string;
  archive_desc_en: string;
  archive_desc_hn: string;
}

type TabType = 'hero' | 'notices' | 'archive';

const CATEGORIES = [
  { en: "General", hn: "सामान्य" },
  { en: "Examination", hn: "परीक्षा" },
  { en: "Hostel", hn: "छात्रावास" },
  { en: "Scholarship", hn: "छात्रवृत्ति" },
  { en: "Placement", hn: "प्लेसमेंट" }
];

const PRIORITIES = [
  { en: "Low", hn: "निम्न" },
  { en: "Medium", hn: "मध्यम" },
  { en: "High", hn: "उच्च" }
];

export default function StudentRelatedNoticesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);
  const [savingHeading, setSavingHeading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Singleton Heading State
  const [headingData, setHeadingData] = useState<HeadingData>({
    title_en: '',
    title_hn: '',
    sub_title_en: '',
    sub_title_hn: '',
    notices_heading_en: '',
    notices_heading_hn: '',
    notices_sub_en: '',
    notices_sub_hn: '',
    archive_heading_en: '',
    archive_heading_hn: '',
    archive_desc_en: '',
    archive_desc_hn: '',
  });

  const [notices, setNotices] = useState<Notice[]>([]);

  // Form states
  const [newItem, setNewItem] = useState({
    title_en: '',
    title_hn: '',
    description_en: '',
    description_hn: '',
    date_en: new Date().toISOString().split('T')[0],
    date_hn: new Date().toISOString().split('T')[0],
    category_index: 0,
    priority_index: 1,
    attachment_url: '',
  });
  const [addingNotice, setAddingNotice] = useState(false);

  // Inline editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({
    title_en: '',
    title_hn: '',
    description_en: '',
    description_hn: '',
    date_en: '',
    date_hn: '',
    category_index: 0,
    priority_index: 1,
    attachment_url: '',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const [uploadingNewPdf, setUploadingNewPdf] = useState(false);
  const [uploadingIds, setUploadingIds] = useState<{ [key: number]: boolean }>({});

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, id?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed!');
      return;
    }

    if (id !== undefined) {
      setUploadingIds((prev) => ({ ...prev, [id]: true }));
    } else {
      setUploadingNewPdf(true);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'x-bucket-name': 'student-section',
        },
        body: formData,
      });

      const result = await res.json();
      if (result.success && result.url) {
        if (id !== undefined) {
          if (editingId === id) {
            setEditingData((prev) => ({ ...prev, attachment_url: result.url }));
          } else {
            setNotices((prev) =>
              prev.map((n) => (n.id === id ? { ...n, attachment_url: result.url } : n))
            );
          }
        } else {
          setNewItem((prev) => ({ ...prev, attachment_url: result.url }));
        }
        alert('PDF uploaded successfully!');
      } else {
        alert('Failed to upload PDF: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading PDF to server');
    } finally {
      if (id !== undefined) {
        setUploadingIds((prev) => ({ ...prev, [id]: false }));
      } else {
        setUploadingNewPdf(false);
      }
    }
  };

  const getAttachmentUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${API_URL}${url}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Headings
      const headRes = await fetch(`${API_URL}/api/student-notices`);
      if (headRes.ok) {
        const hData = await headRes.json();
        setHeadingData({
          title_en: hData.title_en || '',
          title_hn: hData.title_hn || '',
          sub_title_en: hData.sub_title_en || '',
          sub_title_hn: hData.sub_title_hn || '',
          notices_heading_en: hData.notices_heading_en || '',
          notices_heading_hn: hData.notices_heading_hn || '',
          notices_sub_en: hData.notices_sub_en || '',
          notices_sub_hn: hData.notices_sub_hn || '',
          archive_heading_en: hData.archive_heading_en || '',
          archive_heading_hn: hData.archive_heading_hn || '',
          archive_desc_en: hData.archive_desc_en || '',
          archive_desc_hn: hData.archive_desc_hn || '',
        });
      }

      // 2. Fetch list
      const listRes = await fetch(`${API_URL}/api/student-notices/list`);
      if (listRes.ok) {
        const lData = await listRes.json();
        setNotices(lData);
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to load notices from server. Please verify that nith-backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Save Heading singleton
  const handleSaveHeading = async () => {
    setSavingHeading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-notices`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('Page settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSavingHeading(false);
    }
  };

  // Add a new notice
  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title_en.trim() || !newItem.title_hn.trim() || !newItem.description_en.trim() || !newItem.description_hn.trim()) {
      alert('Title and Description are required in both English and Hindi.');
      return;
    }

    setAddingNotice(true);
    const selectedCat = CATEGORIES[newItem.category_index];
    const selectedPrior = PRIORITIES[newItem.priority_index];
    const payload = {
      title_en: newItem.title_en,
      title_hn: newItem.title_hn,
      description_en: newItem.description_en,
      description_hn: newItem.description_hn,
      date_en: newItem.date_en,
      date_hn: newItem.date_hn,
      category_en: selectedCat.en,
      category_hn: selectedCat.hn,
      priority_en: selectedPrior.en,
      priority_hn: selectedPrior.hn,
      attachment_url: newItem.attachment_url,
    };

    try {
      const res = await fetch(`${API_URL}/api/student-notices/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create notice');
      const savedNotice = await res.json();
      setNotices([savedNotice, ...notices]);
      
      // Reset form but retain indexes
      setNewItem({
        category_index: newItem.category_index,
        priority_index: newItem.priority_index,
        title_en: '',
        title_hn: '',
        description_en: '',
        description_hn: '',
        date_en: new Date().toISOString().split('T')[0],
        date_hn: new Date().toISOString().split('T')[0],
        attachment_url: '',
      });
      alert('Notice added successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error creating notice: ' + err.message);
    } finally {
      setAddingNotice(false);
    }
  };

  // Start inline editing
  const startEditing = (notice: Notice) => {
    let catIdx = CATEGORIES.findIndex(c => c.en === notice.category_en);
    if (catIdx === -1) catIdx = 0;

    let priorIdx = PRIORITIES.findIndex(p => p.en === notice.priority_en);
    if (priorIdx === -1) priorIdx = 1;

    setEditingId(notice.id);
    setEditingData({
      category_index: catIdx,
      priority_index: priorIdx,
      title_en: notice.title_en,
      title_hn: notice.title_hn,
      description_en: notice.description_en,
      description_hn: notice.description_hn,
      date_en: notice.date_en,
      date_hn: notice.date_hn,
      attachment_url: notice.attachment_url || '',
    });
  };

  // Save inline edit
  const handleSaveEdit = async (id: number) => {
    if (!editingData.title_en.trim() || !editingData.title_hn.trim() || !editingData.description_en.trim() || !editingData.description_hn.trim()) {
      alert('Title and Description are required in both English and Hindi.');
      return;
    }

    const selectedCat = CATEGORIES[editingData.category_index];
    const selectedPrior = PRIORITIES[editingData.priority_index];
    const payload = {
      title_en: editingData.title_en,
      title_hn: editingData.title_hn,
      description_en: editingData.description_en,
      description_hn: editingData.description_hn,
      date_en: editingData.date_en,
      date_hn: editingData.date_hn,
      category_en: selectedCat.en,
      category_hn: selectedCat.hn,
      priority_en: selectedPrior.en,
      priority_hn: selectedPrior.hn,
      attachment_url: editingData.attachment_url,
    };

    try {
      const res = await fetch(`${API_URL}/api/student-notices/list/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update notice');
      const updated = await res.json();
      
      setNotices(notices.map(n => n.id === id ? updated : n));
      setEditingId(null);
      alert('Notice updated successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error updating notice: ' + err.message);
    }
  };

  // Delete notice
  const handleDeleteNotice = async (id: number) => {
    if (!confirm('Are you sure you want to delete this notice? This action is permanent.')) return;
    try {
      const res = await fetch(`${API_URL}/api/student-notices/list/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete notice');
      setNotices(notices.filter(n => n.id !== id));
      alert('Deleted successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error deleting notice: ' + err.message);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      High: 'bg-red-100 text-red-800 border border-red-200',
      Medium: 'bg-amber-100 text-amber-800 border border-amber-200',
      Low: 'bg-green-100 text-green-800 border border-green-200',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Examination: 'bg-blue-100 text-blue-800 border border-blue-200',
      Hostel: 'bg-purple-100 text-purple-800 border border-purple-200',
      Scholarship: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      Placement: 'bg-amber-100 text-amber-800 border border-amber-200',
      General: 'bg-gray-100 text-gray-800 border border-gray-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Section', icon: <FileText size={18} /> },
    { id: 'notices' as TabType, label: 'Manage Notices', icon: <Bell size={18} /> },
    { id: 'archive' as TabType, label: 'Archive Info', icon: <Calendar size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-semibold">Loading Student Notices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* upper block */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Bell className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Student Notices Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage the main student related notices, archives, and custom categories
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

      {/* Main editor block */}
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
          {/* TAB 1: HERO SECTION HEADINGS */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Hero Section Heading</h2>
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black font-semibold"
                    placeholder="Student Related Notices"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black font-semibold"
                    placeholder="छात्रों से संबंधित सूचनाएं"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Banner Subtitle (English)
                  </label>
                  <textarea
                    rows={2}
                    value={headingData.sub_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Banner Subtitle (Hindi)
                  </label>
                  <textarea
                    rows={2}
                    value={headingData.sub_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012]/30 focus:border-[#631012] text-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE STUDENT NOTICES AND PREVIEW */}
          {activeTab === 'notices' && (
            <div className="space-y-8">
              {/* Form to add item */}
              <div className="bg-gray-50 border border-gray-250 rounded-xl p-5 shadow-sm">
                <h3 className="text-md font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Plus className="w-5 h-5 text-[#631012]" />
                  Add New Student Notice
                </h3>
                <form onSubmit={handleAddNotice} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Notice Title (English)</label>
                      <input
                        type="text"
                        value={newItem.title_en}
                        onChange={(e) => setNewItem({ ...newItem, title_en: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30 focus:outline-none"
                        placeholder="e.g. Scholarship Application Deadline Extended"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Notice Title (Hindi)</label>
                      <input
                        type="text"
                        value={newItem.title_hn}
                        onChange={(e) => setNewItem({ ...newItem, title_hn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30 focus:outline-none"
                        placeholder="जैसे: छात्रवृत्ति आवेदन की अंतिम तिथि बढ़ाई गई"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
                      <select
                        value={newItem.category_index}
                        onChange={(e) => setNewItem({ ...newItem, category_index: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                      >
                        {CATEGORIES.map((c, i) => (
                          <option key={i} value={i}>{c.en}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Priority</label>
                      <select
                        value={newItem.priority_index}
                        onChange={(e) => setNewItem({ ...newItem, priority_index: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                      >
                        {PRIORITIES.map((p, i) => (
                          <option key={i} value={i}>{p.en}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Notice Date</label>
                      <input
                        type="date"
                        value={newItem.date_en}
                        onChange={(e) => setNewItem({ ...newItem, date_en: e.target.value, date_hn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Attachment URL / Document Link</label>
                      <input
                        type="text"
                        value={newItem.attachment_url}
                        onChange={(e) => setNewItem({ ...newItem, attachment_url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30 focus:outline-none"
                        placeholder="e.g. /notices/filename.pdf"
                      />
                    </div>

                    <div className="flex items-end pb-0.5">
                      <div className="w-full flex items-center gap-3 bg-white p-2 rounded-lg border border-dashed border-[#631012]/30 h-[38px]">
                        <label className={`px-4 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm ${uploadingNewPdf ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                          <Upload size={14} />
                          {uploadingNewPdf ? 'Uploading...' : 'Upload PDF'}
                          <input 
                            type="file" 
                            accept="application/pdf" 
                            disabled={uploadingNewPdf}
                            onChange={(e) => handlePdfUpload(e)} 
                            className="hidden" 
                          />
                        </label>
                        <div className="text-xs text-gray-500 truncate">
                          {newItem.attachment_url ? (
                            <span className="text-[#631012] font-semibold flex items-center gap-1">
                              <FileText size={14} /> Uploaded PDF!
                            </span>
                          ) : (
                            <span>No PDF uploaded.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Description (English)</label>
                      <textarea
                        rows={2}
                        value={newItem.description_en}
                        onChange={(e) => setNewItem({ ...newItem, description_en: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30 focus:outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-600 mb-1">Description (Hindi)</label>
                      <textarea
                        rows={2}
                        value={newItem.description_hn}
                        onChange={(e) => setNewItem({ ...newItem, description_hn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={addingNotice}
                      className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2 rounded-lg font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {addingNotice ? 'Adding Notice...' : 'Publish Notice'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Subheading settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Section Heading (English)</label>
                  <input
                    type="text"
                    value={headingData.notices_heading_en}
                    onChange={(e) => setHeadingData({ ...headingData, notices_heading_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold focus:ring-2 focus:ring-[#631012]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Section Heading (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.notices_heading_hn}
                    onChange={(e) => setHeadingData({ ...headingData, notices_heading_hn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold focus:ring-2 focus:ring-[#631012]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Section Subtitle (English)</label>
                  <input
                    type="text"
                    value={headingData.notices_sub_en}
                    onChange={(e) => setHeadingData({ ...headingData, notices_sub_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Section Subtitle (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.notices_sub_hn}
                    onChange={(e) => setHeadingData({ ...headingData, notices_sub_hn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                  />
                </div>
              </div>

              {/* List Editor & Preview */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Current Notices Directory</h3>
                  <span className="text-xs font-bold bg-[#631012]/15 text-[#631012] px-2.5 py-1 rounded-full">
                    {notices.length} Notices Published
                  </span>
                </div>

                {notices.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 border border-dashed rounded-lg bg-gray-50/50">
                    No active student notices found. Add one above.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {notices.map((item, idx) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-xl bg-white hover:border-[#631012]/30 transition-all shadow-sm"
                      >
                        {editingId === item.id ? (
                          /* Inline edit form */
                          <div className="p-5 space-y-4 bg-gray-50/50 rounded-xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Title (English)</label>
                                <input
                                  type="text"
                                  value={editingData.title_en}
                                  onChange={(e) => setEditingData({ ...editingData, title_en: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Title (Hindi)</label>
                                <input
                                  type="text"
                                  value={editingData.title_hn}
                                  onChange={(e) => setEditingData({ ...editingData, title_hn: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
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
                                <label className="block text-xs font-bold text-gray-500 mb-1">Priority</label>
                                <select
                                  value={editingData.priority_index}
                                  onChange={(e) => setEditingData({ ...editingData, priority_index: parseInt(e.target.value) })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                >
                                  {PRIORITIES.map((p, i) => (
                                    <option key={i} value={i}>{p.en}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Date</label>
                                <input
                                  type="date"
                                  value={editingData.date_en}
                                  onChange={(e) => setEditingData({ ...editingData, date_en: e.target.value, date_hn: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Attachment Link</label>
                                <input
                                  type="text"
                                  value={editingData.attachment_url}
                                  onChange={(e) => setEditingData({ ...editingData, attachment_url: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                />
                              </div>

                              <div className="flex items-end pb-0.5">
                                <div className="w-full flex items-center gap-3 bg-white p-2 rounded-lg border border-dashed border-[#631012]/30 h-[38px]">
                                  <label className={`px-4 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm ${uploadingIds[item.id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                                    <Upload size={14} />
                                    {uploadingIds[item.id] ? 'Uploading...' : 'Upload PDF'}
                                    <input 
                                      type="file" 
                                      accept="application/pdf" 
                                      disabled={!!uploadingIds[item.id]}
                                      onChange={(e) => handlePdfUpload(e, item.id)} 
                                      className="hidden" 
                                    />
                                  </label>
                                  <div className="text-xs text-gray-500 truncate">
                                    {editingData.attachment_url ? (
                                      <span className="text-[#631012] font-semibold flex items-center gap-1">
                                        <FileText size={14} /> Uploaded PDF!
                                      </span>
                                    ) : (
                                      <span>No PDF uploaded.</span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Description (English)</label>
                                <textarea
                                  rows={2}
                                  value={editingData.description_en}
                                  onChange={(e) => setEditingData({ ...editingData, description_en: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 mb-1">Description (Hindi)</label>
                                <textarea
                                  rows={2}
                                  value={editingData.description_hn}
                                  onChange={(e) => setEditingData({ ...editingData, description_hn: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2.5 justify-end">
                              <button
                                onClick={() => handleSaveEdit(item.id)}
                                className="px-5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-sm shadow-sm"
                              >
                                Save Changes
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-5 py-1.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded font-bold text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Display mode containing the requested beautiful preview */
                          <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                            <div className="flex-1 space-y-2">
                              {/* Tags Row */}
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getCategoryColor(item.category_en)}`}>
                                  {item.category_en} ({item.category_hn})
                                </span>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${getPriorityColor(item.priority_en)}`}>
                                  <AlertCircle size={10} />
                                  {item.priority_en} ({item.priority_hn})
                                </span>
                                <span className="text-xs font-semibold text-gray-400">
                                  {item.date_en}
                                </span>
                              </div>

                              {/* Title */}
                              <div>
                                <h4 className="text-gray-900 font-extrabold text-md leading-snug">{item.title_en}</h4>
                                <p className="text-gray-400 font-semibold text-sm mt-0.5">({item.title_hn})</p>
                              </div>

                              {/* Description */}
                              <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-150 text-sm">
                                <p className="text-gray-700 leading-relaxed font-medium">{item.description_en}</p>
                                <p className="text-gray-400 font-semibold text-xs mt-1">({item.description_hn})</p>
                              </div>

                              {/* Attachment details */}
                              {item.attachment_url && (
                                <p className="text-xs font-semibold text-[#631012] bg-[#631012]/10 inline-block px-2.5 py-1 rounded-md">
                                  Attachment: {item.attachment_url}
                                </p>
                              )}
                            </div>

                            {/* Actions block */}
                            <div className="flex flex-row md:flex-col lg:flex-row gap-2.5 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 flex-shrink-0">
                              {item.attachment_url && (
                                <div className="flex gap-2">
                                  <a
                                    href={getAttachmentUrl(item.attachment_url)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 text-[#631012] hover:bg-[#631012]/10 rounded-lg border border-gray-200 flex items-center justify-center"
                                    title="View PDF"
                                  >
                                    <Eye size={18} />
                                  </a>
                                  <a
                                    href={getAttachmentUrl(item.attachment_url)}
                                    download
                                    className="p-2 text-[#631012] hover:bg-[#631012]/10 rounded-lg border border-gray-200 flex items-center justify-center"
                                    title="Download PDF"
                                  >
                                    <Download size={18} />
                                  </a>
                                </div>
                              )}
                              <button
                                onClick={() => startEditing(item)}
                                className="px-4 py-2 bg-gray-105 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-sm border border-gray-250 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteNotice(item.id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
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
            </div>
          )}

          {/* TAB 3: ARCHIVE SETTINGS */}
          {activeTab === 'archive' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Archive Block Info</h2>
                <p className="text-xs text-gray-500">Configure headings appearing for previous notices archive.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Archive Header (English)
                  </label>
                  <input
                    type="text"
                    value={headingData.archive_heading_en}
                    onChange={(e) => setHeadingData({ ...headingData, archive_heading_en: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black font-semibold focus:ring-2 focus:ring-[#631012]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Archive Header (Hindi)
                  </label>
                  <input
                    type="text"
                    value={headingData.archive_heading_hn}
                    onChange={(e) => setHeadingData({ ...headingData, archive_heading_hn: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black font-semibold focus:ring-2 focus:ring-[#631012]/30"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Archive Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={headingData.archive_desc_en}
                    onChange={(e) => setHeadingData({ ...headingData, archive_desc_en: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Archive Description (Hindi)
                  </label>
                  <textarea
                    rows={2}
                    value={headingData.archive_desc_hn}
                    onChange={(e) => setHeadingData({ ...headingData, archive_desc_hn: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#631012]/30"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
