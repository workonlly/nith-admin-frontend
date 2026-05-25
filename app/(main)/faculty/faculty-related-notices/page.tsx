'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Bell,
  Plus,
  Trash2,
  FileText,
  Filter,
  Calendar,
  Download,
  Eye,
  AlertCircle,
  Upload,
} from 'lucide-react';

interface Notice {
  id: number;
  title_en: string;
  title_hn: string;
  description_en: string;
  description_hn: string;
  category_en: string;
  category_hn: string;
  date_en: string;
  date_hn: string;
  priority_en: string;
  priority_hn: string;
  view_url: string;
  download_url: string;
}

interface NoticesData {
  heroHeadingEn: string;
  heroHeadingHn: string;
  heroDescriptionEn: string;
  heroDescriptionHn: string;
  filterHeading: string;
  categories: string[];
  noticesTableHeading: string;
  notices: Notice[];
}

const INITIAL_NOTICES: Notice[] = [
  {
    id: -1,
    title_en: 'Faculty Performance Appraisal Submission Deadline',
    title_hn: 'संकाय प्रदर्शन मूल्यांकन जमा करने की समय सीमा',
    description_en: 'All faculty members are requested to submit their annual performance appraisal reports by the stipulated deadline.',
    description_hn: 'सभी संकाय सदस्यों से अनुरोध है कि वे निर्धारित समय सीमा तक अपनी वार्षिक प्रदर्शन मूल्यांकन रिपोर्ट जमा करें।',
    category_en: 'Academic',
    category_hn: 'अकादमिक',
    date_en: 'January 10, 2025',
    date_hn: '10 जनवरी, 2025',
    priority_en: 'High',
    priority_hn: 'उच्च',
    view_url: '/documents/notice',
    download_url: '/documents/notice.pdf',
  },
  {
    id: -2,
    title_en: 'Revised Leave Rules for Faculty Members',
    title_hn: 'संकाय सदस्यों के लिए संशोधित अवकाश नियम',
    description_en: 'Notification regarding revised leave rules and entitlements for regular and contractual faculty members.',
    description_hn: 'नियमित और संविदात्मक संकाय सदस्यों के लिए संशोधित अवकाश नियमों और पात्रता के संबंध में अधिसूचना।',
    category_en: 'Leave & Benefits',
    category_hn: 'अवकाश और लाभ',
    date_en: 'January 8, 2025',
    date_hn: '08 जनवरी, 2025',
    priority_en: 'Medium',
    priority_hn: 'मध्यम',
    view_url: '/documents/leave-rules',
    download_url: '/documents/leave-rules.pdf',
  }
];

type TabType = 'hero' | 'notices';

export default function FacultyRelatedNoticesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [uploadingIds, setUploadingIds] = useState<{ [key: number]: boolean }>({});

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed!');
      return;
    }

    setUploadingIds((prev) => ({ ...prev, [id]: true }));
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        headers: {
          'x-bucket-name': 'faculty-section',
        },
        body: formData,
      });

      const result = await res.json();
      if (result.success && result.url) {
        setNoticesData((prev) => ({
          ...prev,
          notices: prev.notices.map((n) =>
            n.id === id ? { ...n, view_url: result.url, download_url: result.url } : n
          ),
        }));
        alert('PDF uploaded successfully!');
      } else {
        alert('Failed to upload PDF: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading PDF to server');
    } finally {
      setUploadingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const [noticesData, setNoticesData] = useState<NoticesData>({
    heroHeadingEn: 'Faculty Related Notices',
    heroHeadingHn: 'संकाय संबंधित सूचनाएं',
    heroDescriptionEn: 'Important notices, circulars, and announcements for faculty members regarding academic, administrative, and institutional matters.',
    heroDescriptionHn: 'शैक्षणिक, प्रशासनिक और संस्थागत मामलों के संबंध में संकाय सदस्यों के लिए महत्वपूर्ण सूचनाएं, परिपत्र और घोषणाएं।',
    filterHeading: 'Filter by Category:',
    categories: ['All', 'Academic', 'Administrative', 'Recruitment', 'Promotions', 'Leave & Benefits', 'General'],
    noticesTableHeading: 'Faculty Notices',
    notices: INITIAL_NOTICES,
  });

  const tabs = [
    {
      id: 'hero' as TabType,
      label: 'Hero Section',
      icon: <FileText size={18} />,
    },
    {
      id: 'notices' as TabType,
      label: 'Notices',
      icon: <Bell size={18} />,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hRes = await fetch('http://localhost:4000/api/faculty-notices');
        const hData = await hRes.json();
        if (hData && typeof hData === 'object' && hData.title_en) {
          setNoticesData(prev => ({
            ...prev,
            heroHeadingEn: hData.title_en,
            heroHeadingHn: hData.title_hn,
            heroDescriptionEn: hData.sub_title_en,
            heroDescriptionHn: hData.sub_title_hn,
          }));
        }

        const lData = await fetch('http://localhost:4000/api/faculty-notices/list').then(res => res.json());
        if (Array.isArray(lData) && lData.length > 0) {
            setNoticesData(prev => {
                const merged = [...lData];
                INITIAL_NOTICES.forEach(def => {
                    const exists = merged.some(m => m.title_en === def.title_en || String(m.id) === String(def.id));
                    if (!exists) {
                        merged.push(def);
                    }
                });
                return { ...prev, notices: merged };
            });
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      // Save Hero
      await fetch('http://localhost:4000/api/faculty-notices', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_en: noticesData.heroHeadingEn,
          title_hn: noticesData.heroHeadingHn,
          sub_title_en: noticesData.heroDescriptionEn,
          sub_title_hn: noticesData.heroDescriptionHn,
        }),
      });

      // Save Notices
      for (const notice of noticesData.notices) {
        if (notice.id > 0 && notice.id < 1000000) { // DB ID
          await fetch(`http://localhost:4000/api/faculty-notices/list/${notice.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notice),
          });
        } else {
          await fetch('http://localhost:4000/api/faculty-notices/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notice),
          });
        }
      }
      alert('Changes saved successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save changes');
    }
  };

  const updateNotice = (id: number, field: keyof Notice, value: string) => {
    setNoticesData({
      ...noticesData,
      notices: noticesData.notices.map((notice) =>
        notice.id === id ? { ...notice, [field]: value } : notice
      ),
    });
  };

  const addNotice = () => {
    const newId = Date.now();
    setNoticesData({
      ...noticesData,
      notices: [
        ...noticesData.notices,
        { id: Date.now() + Math.floor(Math.random() * 1000), title_en: '', title_hn: '', description_en: '', description_hn: '', category_en: 'General', category_hn: 'सामान्य', date_en: '', date_hn: '', priority_en: 'Medium', priority_hn: 'मध्यम', view_url: '', download_url: '' },
      ],
    });
  };

  const removeNotice = async (id: number) => {
    if (id > 0 && id < 1000000) {
      if (!confirm('Are you sure you want to delete this notice from database?')) return;
      await fetch(`http://localhost:4000/api/faculty-notices/list/${id}`, { method: 'DELETE' });
    }
    setNoticesData({
      ...noticesData,
      notices: noticesData.notices.filter((n) => n.id !== id),
    });
  };

  const filteredNotices = selectedCategory === 'All'
    ? noticesData.notices
    : noticesData.notices.filter(n => n.category_en === selectedCategory);

  const getPriorityColor = (priority: string) => {
    if (priority === 'High' || priority === 'उच्च') return 'bg-red-100 text-red-800';
    if (priority === 'Medium' || priority === 'मध्यम') return 'bg-amber-100 text-amber-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">
              <Bell className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#171717]">Faculty Notices Editor</h1>
              <p className="text-[#171717]/60">Manage faculty-related notices and announcements</p>
            </div>
          </div>
          <button onClick={handleSave} className="bg-[#631012] hover:bg-[#7a1214] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md">
            <Save size={20} /> Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-[#171717]/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === tab.id ? 'bg-[#631012] text-white' : 'text-[#171717]/70 hover:bg-gray-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'hero' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase text-gray-500">English Content</label>
                  <input type="text" value={noticesData.heroHeadingEn} onChange={(e) => setNoticesData({...noticesData, heroHeadingEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Heading" />
                  <textarea rows={3} value={noticesData.heroDescriptionEn} onChange={(e) => setNoticesData({...noticesData, heroDescriptionEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Description" />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase text-gray-500">Hindi Content</label>
                  <input type="text" value={noticesData.heroHeadingHn} onChange={(e) => setNoticesData({...noticesData, heroHeadingHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="शीर्षक" />
                  <textarea rows={3} value={noticesData.heroDescriptionHn} onChange={(e) => setNoticesData({...noticesData, heroDescriptionHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="विवरण" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Notices Management</h2>
                <button onClick={addNotice} className="bg-[#631012] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7a1214]">
                  <Plus size={18} /> Add Notice
                </button>
              </div>

              <div className="space-y-4">
                {noticesData.notices.map((notice) => (
                  <div key={notice.id} className="p-4 border rounded-xl bg-gray-50 relative group">
                    <button onClick={() => removeNotice(notice.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#631012] uppercase">English Details</label>
                        <input type="text" value={notice.title_en} onChange={(e) => updateNotice(notice.id, 'title_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Title" />
                        <textarea value={notice.description_en} onChange={(e) => updateNotice(notice.id, 'description_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Description" />
                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" value={notice.category_en} onChange={(e) => updateNotice(notice.id, 'category_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Category" />
                            <input type="text" value={notice.date_en} onChange={(e) => updateNotice(notice.id, 'date_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Date" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#631012] uppercase">Hindi Details</label>
                        <input type="text" value={notice.title_hn} onChange={(e) => updateNotice(notice.id, 'title_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="शीर्षक" />
                        <textarea value={notice.description_hn} onChange={(e) => updateNotice(notice.id, 'description_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="विवरण" />
                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" value={notice.category_hn} onChange={(e) => updateNotice(notice.id, 'category_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="श्रेणी" />
                            <input type="text" value={notice.date_hn} onChange={(e) => updateNotice(notice.id, 'date_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="तिथि" />
                        </div>
                      </div>

                      <div className="col-span-2 border-t pt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase text-gray-400 font-bold">View URL</label>
                            <input type="text" value={notice.view_url} onChange={(e) => updateNotice(notice.id, 'view_url', e.target.value)} className="px-3 py-2 border rounded-lg text-sm" placeholder="View URL" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase text-gray-400 font-bold">Download URL</label>
                            <input type="text" value={notice.download_url} onChange={(e) => updateNotice(notice.id, 'download_url', e.target.value)} className="px-3 py-2 border rounded-lg text-sm" placeholder="Download URL" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] uppercase text-gray-400 font-bold">Priority</label>
                            <select value={notice.priority_en} onChange={(e) => updateNotice(notice.id, 'priority_en', e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white">
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-dashed border-[#631012]/30">
                          <label className={`px-4 py-2 rounded-lg text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm ${uploadingIds[notice.id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                            <Upload size={14} />
                            {uploadingIds[notice.id] ? 'Uploading PDF...' : 'Upload PDF Document'}
                            <input 
                              type="file" 
                              accept="application/pdf" 
                              disabled={!!uploadingIds[notice.id]}
                              onChange={(e) => handlePdfUpload(e, notice.id)} 
                              className="hidden" 
                            />
                          </label>
                          <div className="text-xs text-gray-500">
                            {notice.view_url ? (
                              <span className="text-[#631012] font-semibold flex items-center gap-1">
                                <FileText size={14} /> Active PDF: {notice.view_url.split('/').pop()}
                              </span>
                            ) : (
                              <span>No PDF uploaded yet. Click to select a file.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
