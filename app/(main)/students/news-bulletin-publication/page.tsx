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
  BookOpen,
  Download,
  Eye,
  Mail,
  Phone,
  Clock,
  Upload
} from 'lucide-react';

interface NewsBulletinHeading {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  latest_title_en: string;
  latest_title_hn: string;
  latest_desc_en: string;
  latest_desc_hn: string;
  archive_title_en: string;
  archive_title_hn: string;
  archive_desc_en: string;
  archive_desc_hn: string;
  contact_title_en: string;
  contact_title_hn: string;
  contact_desc_en: string;
  contact_desc_hn: string;
  coord_office_en: string;
  coord_office_hn: string;
  coord_email: string;
  coord_phone: string;
  coord_hours_en: string;
  coord_hours_hn: string;
}

interface NewsBulletinItem {
  id: number;
  title_en: string;
  title_hn: string;
  bulletin_date: string;
  excerpt_en: string;
  excerpt_hn: string;
  pdf_url: string;
}

type TabType = 'headers' | 'bulletins';

export default function NewsBulletinPublicationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('headers');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const DEFAULT_HEADING: NewsBulletinHeading = {
    title_en: 'News Bulletin',
    title_hn: 'समाचार बुलेटिन',
    sub_title_en: 'Official monthly digest that summarizes campus news, important notices, achievements and upcoming events for the institute community.',
    sub_title_hn: 'आधिकारिक मासिक सारांश जो संस्थान समुदाय के लिए परिसर के समाचार, महत्वपूर्ण नोटिस, उपलब्धियों और आगामी कार्यक्रमों का सारांश प्रस्तुत करता है।',
    latest_title_en: 'Latest Bulletins',
    latest_title_hn: 'नवीनतम बुलेटिन',
    latest_desc_en: 'Browse recent editions and download the full PDF for details.',
    latest_desc_hn: 'हाल के संस्करण ब्राउज़ करें और विवरण के लिए पूरा पीडीएफ डाउनलोड करें।',
    archive_title_en: 'Archive',
    archive_title_hn: 'संग्रह',
    archive_desc_en: 'Past bulletins organized chronologically.',
    archive_desc_hn: 'कालानुक्रमिक रूप से व्यवस्थित पिछले बुलेटिन।',
    contact_title_en: 'Contact',
    contact_title_hn: 'संपर्क',
    contact_desc_en: 'For submissions, corrections or circulation requests contact the Publications Office.',
    contact_desc_hn: 'प्रविष्टियों, सुधारों या प्रसार अनुरोधों के लिए प्रकाशन कार्यालय से संपर्क करें।',
    coord_office_en: 'Publications Office',
    coord_office_hn: 'प्रकाशन कार्यालय',
    coord_email: 'publications@nith.ac.in',
    coord_phone: '+91-00000-00000',
    coord_hours_en: 'Mon-Fri 09:30-17:30',
    coord_hours_hn: 'सोम-शुक्र 09:30-17:30'
  };

  const DEFAULT_BULLETINS = [
    {
      title_en: 'Institute News Bulletin - January 2026',
      title_hn: 'संस्थान समाचार बुलेटिन - जनवरी 2026',
      bulletin_date: '2026-01-15',
      excerpt_en: 'Highlights: Convocation details, Research grants awarded, Upcoming events and important notices for students and faculty.',
      excerpt_hn: 'मुख्य आकर्षण: दीक्षांत समारोह का विवरण, अनुसंधान अनुदान प्रदान किया गया, आगामी कार्यक्रम और छात्रों और संकाय के लिए महत्वपूर्ण नोटिस।',
      pdf_url: '#'
    },
    {
      title_en: 'Institute News Bulletin - December 2025',
      title_hn: 'संस्थान समाचार बुलेटिन - दिसंबर 2025',
      bulletin_date: '2025-12-10',
      excerpt_en: 'Year-end highlights, departmental achievements, and campus events roundup.',
      excerpt_hn: 'वर्ष के अंत के मुख्य आकर्षण, विभागीय उपलब्धियां, और परिसर के कार्यक्रमों का संकलन।',
      pdf_url: '#'
    },
    {
      title_en: 'Institute News Bulletin - September 2025',
      title_hn: 'संस्थान समाचार बुलेटिन - सितंबर 2025',
      bulletin_date: '2025-09-05',
      excerpt_en: 'Student achievements, upcoming workshops and notable alumni interactions.',
      excerpt_hn: 'छात्र उपलब्धियां, आगामी कार्यशालाएं और उल्लेखनीय पूर्व छात्रों की बातचीत।',
      pdf_url: '#'
    }
  ];

  const [headingData, setHeadingData] = useState<NewsBulletinHeading>({ ...DEFAULT_HEADING });
  const [bulletins, setBulletins] = useState<NewsBulletinItem[]>([]);

  // CRUD states for bulletins
  const [newBulletin, setNewBulletin] = useState({
    title_en: '',
    title_hn: '',
    bulletin_date: new Date().toISOString().split('T')[0],
    excerpt_en: '',
    excerpt_hn: '',
    pdf_url: '#'
  });
  const [editingBulletinId, setEditingBulletinId] = useState<number | null>(null);
  const [editingBulletinData, setEditingBulletinData] = useState({
    title_en: '',
    title_hn: '',
    bulletin_date: '',
    excerpt_en: '',
    excerpt_hn: '',
    pdf_url: ''
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
          if (editingBulletinId === id) {
            setEditingBulletinData((prev) => ({ ...prev, pdf_url: result.url }));
          } else {
            setBulletins((prev) =>
              prev.map((item) => (item.id === id ? { ...item, pdf_url: result.url } : item))
            );
          }
        } else {
          setNewBulletin((prev) => ({ ...prev, pdf_url: result.url }));
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
      // Fetch Heading singleton
      const headRes = await fetch(`${API_URL}/api/student-news-bulletin`);
      if (headRes.ok) {
        const hData = await headRes.json();
        if (hData && Object.keys(hData).length > 0) {
          setHeadingData({
            title_en: hData.title_en || DEFAULT_HEADING.title_en,
            title_hn: hData.title_hn || DEFAULT_HEADING.title_hn,
            sub_title_en: hData.sub_title_en || DEFAULT_HEADING.sub_title_en,
            sub_title_hn: hData.sub_title_hn || DEFAULT_HEADING.sub_title_hn,
            latest_title_en: hData.latest_title_en || DEFAULT_HEADING.latest_title_en,
            latest_title_hn: hData.latest_title_hn || DEFAULT_HEADING.latest_title_hn,
            latest_desc_en: hData.latest_desc_en || DEFAULT_HEADING.latest_desc_en,
            latest_desc_hn: hData.latest_desc_hn || DEFAULT_HEADING.latest_desc_hn,
            archive_title_en: hData.archive_title_en || DEFAULT_HEADING.archive_title_en,
            archive_title_hn: hData.archive_title_hn || DEFAULT_HEADING.archive_title_hn,
            archive_desc_en: hData.archive_desc_en || DEFAULT_HEADING.archive_desc_en,
            archive_desc_hn: hData.archive_desc_hn || DEFAULT_HEADING.archive_desc_hn,
            contact_title_en: hData.contact_title_en || DEFAULT_HEADING.contact_title_en,
            contact_title_hn: hData.contact_title_hn || DEFAULT_HEADING.contact_title_hn,
            contact_desc_en: hData.contact_desc_en || DEFAULT_HEADING.contact_desc_en,
            contact_desc_hn: hData.contact_desc_hn || DEFAULT_HEADING.contact_desc_hn,
            coord_office_en: hData.coord_office_en || DEFAULT_HEADING.coord_office_en,
            coord_office_hn: hData.coord_office_hn || DEFAULT_HEADING.coord_office_hn,
            coord_email: hData.coord_email || DEFAULT_HEADING.coord_email,
            coord_phone: hData.coord_phone || DEFAULT_HEADING.coord_phone,
            coord_hours_en: hData.coord_hours_en || DEFAULT_HEADING.coord_hours_en,
            coord_hours_hn: hData.coord_hours_hn || DEFAULT_HEADING.coord_hours_hn
          });
        } else {
          // Auto-seed heading immediately
          await fetch(`${API_URL}/api/student-news-bulletin`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(DEFAULT_HEADING),
          });
        }
      }

      // Fetch Bulletins list
      const listRes = await fetch(`${API_URL}/api/student-news-bulletin/list`);
      if (listRes.ok) {
        const lData = await listRes.json();
        if (lData.length === 0) {
          // Seed bulletins list with default array
          for (const item of DEFAULT_BULLETINS) {
            await fetch(`${API_URL}/api/student-news-bulletin/list`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            });
          }
          const listRes2 = await fetch(`${API_URL}/api/student-news-bulletin/list`);
          setBulletins(await listRes2.json());
        } else {
          setBulletins(lData);
        }
      }
    } catch (err: any) {
      console.error('Error fetching bulletins data:', err);
      setError('Failed to fetch bulletins from backend. Check API status.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-news-bulletin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('News Bulletin content settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Bulletins CRUD ---
  const handleAddBulletin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBulletin.title_en.trim() || !newBulletin.title_hn.trim() || !newBulletin.bulletin_date) {
      alert('Bilingual title and date fields are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-news-bulletin/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBulletin),
      });
      if (!res.ok) throw new Error('Failed to add news bulletin');
      const saved = await res.json();
      setBulletins([saved, ...bulletins]);
      setNewBulletin({
        title_en: '',
        title_hn: '',
        bulletin_date: new Date().toISOString().split('T')[0],
        excerpt_en: '',
        excerpt_hn: '',
        pdf_url: '#'
      });
      alert('News Bulletin added successfully!');
    } catch (err: any) {
      alert('Error adding news bulletin: ' + err.message);
    }
  };

  const handleSaveBulletinEdit = async (id: number) => {
    if (!editingBulletinData.title_en.trim() || !editingBulletinData.title_hn.trim() || !editingBulletinData.bulletin_date) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-news-bulletin/list/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBulletinData),
      });
      if (!res.ok) throw new Error('Failed to update bulletin');
      const updated = await res.json();
      setBulletins(bulletins.map(b => b.id === id ? updated : b));
      setEditingBulletinId(null);
      alert('Bulletin updated successfully!');
    } catch (err: any) {
      alert('Error updating bulletin: ' + err.message);
    }
  };

  const handleDeleteBulletin = async (id: number) => {
    if (!confirm('Are you sure you want to delete this bulletin entry?')) return;
    try {
      await fetch(`${API_URL}/api/student-news-bulletin/list/${id}`, { method: 'DELETE' });
      setBulletins(bulletins.filter(b => b.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting bulletin: ' + err.message);
    }
  };

  const tabs = [
    { id: 'headers' as TabType, label: 'Page Banner & Settings', icon: <FileText size={18} /> },
    { id: 'bulletins' as TabType, label: 'Manage Bulletins', icon: <BookOpen size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Bulletins Editor Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Palette className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                News Bulletins Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure headings, contact cards, and manage the list of bulletins and archives dynamically bilingually.
              </p>
            </div>
          </div>

          <button
            onClick={handleSavePageSettings}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#631012] hover:bg-[#520d0f] active:scale-95 text-white font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 text-sm w-full sm:w-auto justify-center"
          >
            {saving ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Page Content
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 p-3.5 bg-red-50 border-l-4 border-red-600 text-red-800 rounded-r-lg text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-white rounded-t-xl px-2 pt-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#631012] text-[#631012] bg-[#631012]/5 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contents */}
      <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 min-h-[400px]">
        {/* --- HEADERS TAB --- */}
        {activeTab === 'headers' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English */}
              <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#631012]"></span>
                  English Content (EN)
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Page Title (EN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.title_en || ''}
                    onChange={(e) => setHeadingData({ ...headingData, title_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Banner Subtitle (EN)</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.sub_title_en || ''}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                  />
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">1. Latest Bulletins Section Header</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Section Title (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.latest_title_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, latest_title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Section Description (EN)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.latest_desc_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, latest_desc_en: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">2. Archive Section Header</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Archive Title (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.archive_title_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, archive_title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Archive Description (EN)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.archive_desc_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, archive_desc_en: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">3. Contact Section Header</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Contact Title (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.contact_title_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, contact_title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Contact Description (EN)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.contact_desc_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, contact_desc_en: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">4. Publication Office Mappings (EN)</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Office Name (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord_office_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, coord_office_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Office Hours (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord_hours_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, coord_hours_en: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Hindi */}
              <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Hindi Content (HN)
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">पृष्ठ शीर्षक (HN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.title_hn || ''}
                    onChange={(e) => setHeadingData({ ...headingData, title_hn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">बैनर उपशीर्षक (HN)</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.sub_title_hn || ''}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                  />
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">1. नवीनतम बुलेटिन अनुभाग शीर्षक</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">अनुभाग शीर्षक (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.latest_title_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, latest_title_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">अनुभाग विवरण (HN)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.latest_desc_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, latest_desc_hn: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">2. संग्रह अनुभाग शीर्षक</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">संग्रह शीर्षक (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.archive_title_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, archive_title_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">संग्रह विवरण (HN)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.archive_desc_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, archive_desc_hn: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">3. संपर्क अनुभाग शीर्षक</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">संपर्क शीर्षक (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.contact_title_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, contact_title_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">संपर्क विवरण (HN)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.contact_desc_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, contact_desc_hn: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">4. प्रकाशन कार्यालय विवरण (HN)</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">कार्यालय नाम (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord_office_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, coord_office_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">कार्यालय समय (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord_hours_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, coord_hours_hn: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Mappings */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#631012]" />
                Direct Communication Coordinates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Office Contact Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord_email || ''}
                      onChange={(e) => setHeadingData({ ...headingData, coord_email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Office Contact Phone</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord_phone || ''}
                      onChange={(e) => setHeadingData({ ...headingData, coord_phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- BULLETINS TAB --- */}
        {activeTab === 'bulletins' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">News Bulletins</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {bulletins.length} Active Bulletins
              </span>
            </div>

            {/* Form for new bulletin */}
            <form onSubmit={handleAddBulletin} className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
              <h4 className="text-sm font-extrabold text-[#631012] uppercase tracking-wider flex items-center gap-2">
                <Plus size={16} /> Add a New News Bulletin Edition
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Edition Title (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. Institute News Bulletin - January 2026"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newBulletin.title_en || ''}
                    onChange={(e) => setNewBulletin({ ...newBulletin, title_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Edition Title (HN)</label>
                  <input
                    type="text"
                    placeholder="e.g. संस्थान समाचार बुलेटिन - जनवरी 2026"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newBulletin.title_hn || ''}
                    onChange={(e) => setNewBulletin({ ...newBulletin, title_hn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Release Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newBulletin.bulletin_date || ''}
                    onChange={(e) => setNewBulletin({ ...newBulletin, bulletin_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Excerpt / Brief Description (EN)</label>
                  <textarea
                    rows={2}
                    placeholder="Brief highlights..."
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newBulletin.excerpt_en || ''}
                    onChange={(e) => setNewBulletin({ ...newBulletin, excerpt_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Excerpt / Brief Description (HN)</label>
                  <textarea
                    rows={2}
                    placeholder="संक्षिप्त विवरण..."
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newBulletin.excerpt_hn || ''}
                    onChange={(e) => setNewBulletin({ ...newBulletin, excerpt_hn: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">PDF File Link URL</label>
                  <input
                    type="text"
                    placeholder="#"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newBulletin.pdf_url || ''}
                    onChange={(e) => setNewBulletin({ ...newBulletin, pdf_url: e.target.value })}
                  />
                </div>
                <div className="flex items-end pb-0.5">
                  <div className="w-full flex items-center gap-3 bg-white p-2 rounded-lg border border-dashed border-[#631012]/30 h-[38px]">
                    <label className={`px-4 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm w-full justify-center ${uploadingNewPdf ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
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
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-[#631012] hover:bg-[#520d0f] active:scale-95 text-white font-semibold rounded-lg shadow-sm text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Bulletin Release
                </button>
              </div>
            </form>

            {/* List Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full border-collapse table-auto text-left text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 font-semibold text-gray-700">Sl. No.</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Release Date</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Bilingual Titles</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Bilingual Excerpts / PDF Link</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bulletins.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-4">
                        {editingBulletinId === item.id ? (
                          <input
                            type="date"
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:border-[#631012]"
                            value={editingBulletinData.bulletin_date ? editingBulletinData.bulletin_date.split('T')[0] : ''}
                            onChange={(e) => setEditingBulletinData({ ...editingBulletinData, bulletin_date: e.target.value })}
                          />
                        ) : (
                          <span className="text-gray-900 font-semibold">{new Date(item.bulletin_date).toLocaleDateString()}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 space-y-1">
                        {editingBulletinId === item.id ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:border-[#631012]"
                              value={editingBulletinData.title_en || ''}
                              onChange={(e) => setEditingBulletinData({ ...editingBulletinData, title_en: e.target.value })}
                            />
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:border-[#631012]"
                              value={editingBulletinData.title_hn || ''}
                              onChange={(e) => setEditingBulletinData({ ...editingBulletinData, title_hn: e.target.value })}
                            />
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <p className="font-semibold text-gray-900">{item.title_en}</p>
                            <p className="text-xs text-gray-500">{item.title_hn}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 space-y-2">
                        {editingBulletinId === item.id ? (
                          <div className="space-y-1.5">
                            <textarea
                              rows={2}
                              className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:border-[#631012]"
                              value={editingBulletinData.excerpt_en || ''}
                              onChange={(e) => setEditingBulletinData({ ...editingBulletinData, excerpt_en: e.target.value })}
                            />
                            <textarea
                              rows={2}
                              className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:border-[#631012]"
                              value={editingBulletinData.excerpt_hn || ''}
                              onChange={(e) => setEditingBulletinData({ ...editingBulletinData, excerpt_hn: e.target.value })}
                            />
                            <div className="flex items-center gap-1">
                              <Download size={12} className="text-gray-400" />
                              <input
                                type="text"
                                className="w-full px-2 py-0.5 border rounded text-xs focus:outline-none focus:border-[#631012]"
                                value={editingBulletinData.pdf_url || ''}
                                onChange={(e) => setEditingBulletinData({ ...editingBulletinData, pdf_url: e.target.value })}
                              />
                            </div>
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <label className={`px-2 py-1 rounded text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs ${uploadingIds[item.id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                                <Upload size={10} />
                                {uploadingIds[item.id] ? 'Uploading...' : 'Upload PDF'}
                                <input 
                                  type="file" 
                                  accept="application/pdf" 
                                  disabled={!!uploadingIds[item.id]}
                                  onChange={(e) => handlePdfUpload(e, item.id)} 
                                  className="hidden" 
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-600 space-y-1">
                            <p className="italic">EN: "{item.excerpt_en}"</p>
                            <p className="italic text-gray-500">HN: "{item.excerpt_hn}"</p>
                            <p className="text-[10px] text-[#631012] font-semibold flex items-center gap-1"><Download size={10} /> Link: {item.pdf_url}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {editingBulletinId === item.id ? (
                            <>
                              <button
                                onClick={() => handleSaveBulletinEdit(item.id)}
                                className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                                title="Save"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => setEditingBulletinId(null)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingBulletinId(item.id);
                                  setEditingBulletinData({
                                    title_en: item.title_en,
                                    title_hn: item.title_hn,
                                    bulletin_date: item.bulletin_date,
                                    excerpt_en: item.excerpt_en,
                                    excerpt_hn: item.excerpt_hn,
                                    pdf_url: item.pdf_url
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteBulletin(item.id)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bulletins.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500 font-medium bg-gray-50/20">
                        No bulletins configured yet. Use the form above to add one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
