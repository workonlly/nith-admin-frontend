'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Presentation,
  Plus,
  Trash2,
  FileText,
  Bell,
  Upload,
} from 'lucide-react';

interface WorkshopRule {
  id: number;
  title_en: string;
  title_hn: string;
  description_en: string;
  description_hn: string;
  pdf_url: string;
  word_url: string;
}

interface WorkshopNotice {
  id: number;
  title_en: string;
  title_hn: string;
  description_en: string;
  description_hn: string;
  pdf_url: string;
  word_url: string;
  date_en: string;
  date_hn: string;
}

interface WorkshopData {
  heroHeadingEn: string;
  heroHeadingHn: string;
  heroDescriptionEn: string;
  heroDescriptionHn: string;
  tab1NameEn: string;
  tab1NameHn: string;
  tab2NameEn: string;
  tab2NameHn: string;
  rules: WorkshopRule[];
  notices: WorkshopNotice[];
}

const INITIAL_RULES: WorkshopRule[] = [
  {
    id: -1,
    title_en: 'Technical Workshop Organization Guidelines',
    title_hn: 'तकनीकी कार्यशाला आयोजन दिशानिर्देश',
    description_en: 'Guidelines for organizing technical workshops including venue booking and participant registration.',
    description_hn: 'स्थान बुकिंग और प्रतिभागी पंजीकरण सहित तकनीकी कार्यशालाओं के आयोजन के लिए दिशानिर्देश।',
    pdf_url: '/documents/technical-workshop-guidelines.pdf',
    word_url: '/documents/technical-workshop-guidelines.docx'
  }
];

const INITIAL_NOTICES: WorkshopNotice[] = [
  {
    id: -1,
    title_en: 'Notice regarding Upcoming FDP 2025',
    title_hn: 'आगामी एफडीपी 2025 के संबंध में सूचना',
    description_en: 'Official notification for the Faculty Development Program scheduled for March 2025.',
    description_hn: 'मार्च 2025 के लिए निर्धारित संकाय विकास कार्यक्रम के लिए आधिकारिक अधिसूचना।',
    pdf_url: '/documents/fdp-notice.pdf',
    word_url: '',
    date_en: 'Feb 10, 2025',
    date_hn: '10 फरवरी, 2025'
  }
];

type TabType = 'hero' | 'rules' | 'notices';

export default function WorkshopRulesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [workshopData, setWorkshopData] = useState<WorkshopData>({
    heroHeadingEn: 'Rules for Conducting Workshops',
    heroHeadingHn: 'कार्यशाला आयोजित करने के नियम',
    heroDescriptionEn: 'Comprehensive guidelines and regulations for organizing workshops and training programs.',
    heroDescriptionHn: 'कार्यशालाओं and प्रशिक्षण कार्यक्रमों के आयोजन के लिए व्यापक दिशानिर्देश और नियम।',
    tab1NameEn: 'Conference/Workshop/FDP/STC Rules Formats',
    tab1NameHn: 'सम्मेलन/कार्यशाला/एफडीपी/एसटीसी नियम प्रारूप',
    tab2NameEn: 'Notices/Office Orders/Notifications',
    tab2NameHn: 'सूचनाएं/कार्यालय आदेश/अधिसूचनाएं',
    rules: INITIAL_RULES,
    notices: INITIAL_NOTICES,
  });
  const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    type: 'pdf' | 'word',
    listType: 'rules' | 'notices'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'pdf' && file.type !== 'application/pdf') {
      alert('Only PDF files are allowed!');
      return;
    }
    
    if (
      type === 'word' &&
      !file.name.endsWith('.doc') &&
      !file.name.endsWith('.docx') &&
      file.type !== 'application/msword' &&
      file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      alert('Only Word documents (.doc, .docx) are allowed!');
      return;
    }

    const uploadKey = `${listType}-${id}-${type}`;
    setUploadingState((prev) => ({ ...prev, [uploadKey]: true }));
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
        setWorkshopData((prev) => ({
          ...prev,
          [listType]: prev[listType].map((item) =>
            item.id === id ? { ...item, [type === 'pdf' ? 'pdf_url' : 'word_url']: result.url } : item
          ),
        }));
        alert(`${type.toUpperCase()} uploaded successfully!`);
      } else {
        alert(`Failed to upload ${type.toUpperCase()}: ` + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert(`Error uploading ${type.toUpperCase()} to server`);
    } finally {
      setUploadingState((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Section', icon: <FileText size={18} /> },
    { id: 'rules' as TabType, label: 'Rules Formats', icon: <Presentation size={18} /> },
    { id: 'notices' as TabType, label: 'Notices/Orders', icon: <Bell size={18} /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hRes = await fetch('http://localhost:4000/api/faculty-workshop');
        const hData = await hRes.json();
        if (hData && hData.title_en) {
          setWorkshopData(prev => ({
            ...prev,
            heroHeadingEn: hData.title_en,
            heroHeadingHn: hData.title_hn,
            heroDescriptionEn: hData.sub_title_en,
            heroDescriptionHn: hData.sub_title_hn,
            tab1NameEn: hData.tab1_name_en || prev.tab1NameEn,
            tab1NameHn: hData.tab1_name_hn || prev.tab1NameHn,
            tab2NameEn: hData.tab2_name_en || prev.tab2NameEn,
            tab2NameHn: hData.tab2_name_hn || prev.tab2NameHn,
          }));
        }

        // Rules
        const lRes = await fetch('http://localhost:4000/api/faculty-workshop/list');
        const lData = await lRes.json();
        if (Array.isArray(lData) && lData.length > 0) {
          setWorkshopData(prev => {
            const merged = [...lData];
            INITIAL_RULES.forEach(def => {
              if (!merged.find(m => m.title_en === def.title_en || String(m.id) === String(def.id))) {
                merged.push(def);
              }
            });
            return { ...prev, rules: merged };
          });
        }

        // Notices
        const nRes = await fetch('http://localhost:4000/api/faculty-workshop/notices');
        const nData = await nRes.json();
        if (Array.isArray(nData) && nData.length > 0) {
          setWorkshopData(prev => {
            const merged = [...nData];
            INITIAL_NOTICES.forEach(def => {
              if (!merged.find(m => m.title_en === def.title_en || String(m.id) === String(def.id))) {
                merged.push(def);
              }
            });
            return { ...prev, notices: merged };
          });
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      // Header
      await fetch('http://localhost:4000/api/faculty-workshop', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_en: workshopData.heroHeadingEn,
          title_hn: workshopData.heroHeadingHn,
          sub_title_en: workshopData.heroDescriptionEn,
          sub_title_hn: workshopData.heroDescriptionHn,
          tab1_name_en: workshopData.tab1NameEn,
          tab1_name_hn: workshopData.tab1NameHn,
          tab2_name_en: workshopData.tab2NameEn,
          tab2_name_hn: workshopData.tab2NameHn,
        }),
      });

      // Rules
      for (const rule of workshopData.rules) {
        if (rule.id > 0 && rule.id < 1000000) {
          await fetch(`http://localhost:4000/api/faculty-workshop/list/${rule.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rule),
          });
        } else {
          await fetch('http://localhost:4000/api/faculty-workshop/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rule),
          });
        }
      }

      // Notices
      for (const notice of workshopData.notices) {
        if (notice.id > 0 && notice.id < 1000000) {
          await fetch(`http://localhost:4000/api/faculty-workshop/notices/${notice.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notice),
          });
        } else {
          await fetch('http://localhost:4000/api/faculty-workshop/notices', {
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

  const updateRule = (id: number, field: keyof WorkshopRule, value: string) => {
    setWorkshopData({
      ...workshopData,
      rules: workshopData.rules.map((r) => r.id === id ? { ...r, [field]: value } : r),
    });
  };

  const addRule = () => {
    setWorkshopData({
      ...workshopData,
      rules: [
        ...workshopData.rules,
        { id: Date.now() + Math.floor(Math.random() * 1000), title_en: '', title_hn: '', description_en: '', description_hn: '', pdf_url: '', word_url: '' },
      ],
    });
  };

  const removeRule = async (id: number) => {
    if (id > 0 && id < 1000000) {
      if (!confirm('Delete from database?')) return;
      await fetch(`http://localhost:4000/api/faculty-workshop/list/${id}`, { method: 'DELETE' });
    }
    setWorkshopData({
      ...workshopData,
      rules: workshopData.rules.filter((r) => r.id !== id),
    });
  };

  const updateNotice = (id: number, field: keyof WorkshopNotice, value: string) => {
    setWorkshopData({
      ...workshopData,
      notices: workshopData.notices.map((n) => n.id === id ? { ...n, [field]: value } : n),
    });
  };

  const addNotice = () => {
    setWorkshopData({
      ...workshopData,
      notices: [
        ...workshopData.notices,
        { id: Date.now() + Math.floor(Math.random() * 1000), title_en: '', title_hn: '', description_en: '', description_hn: '', pdf_url: '', word_url: '', date_en: '', date_hn: '' },
      ],
    });
  };

  const removeNotice = async (id: number) => {
    if (id > 0 && id < 1000000) {
      if (!confirm('Delete notice from database?')) return;
      await fetch(`http://localhost:4000/api/faculty-workshop/notices/${id}`, { method: 'DELETE' });
    }
    setWorkshopData({
      ...workshopData,
      notices: workshopData.notices.filter((n) => n.id !== id),
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">
              <Presentation size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#171717]">Workshop Rules & Notices Editor</h1>
              <p className="text-[#171717]/60">Manage workshops, training programs, and official orders</p>
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
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-500">English Header</label>
                <input type="text" value={workshopData.heroHeadingEn} onChange={(e) => setWorkshopData({...workshopData, heroHeadingEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Heading" />
                <textarea rows={3} value={workshopData.heroDescriptionEn} onChange={(e) => setWorkshopData({...workshopData, heroDescriptionEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Description" />
                <label className="block text-xs font-bold uppercase text-gray-500 mt-4">Tab 1 Name (English)</label>
                <input type="text" value={workshopData.tab1NameEn} onChange={(e) => setWorkshopData({...workshopData, tab1NameEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Tab 1 English Name" />
                <label className="block text-xs font-bold uppercase text-gray-500 mt-4">Tab 2 Name (English)</label>
                <input type="text" value={workshopData.tab2NameEn} onChange={(e) => setWorkshopData({...workshopData, tab2NameEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Tab 2 English Name" />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-500">Hindi Header</label>
                <input type="text" value={workshopData.heroHeadingHn} onChange={(e) => setWorkshopData({...workshopData, heroHeadingHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="शीर्षक" />
                <textarea rows={3} value={workshopData.heroDescriptionHn} onChange={(e) => setWorkshopData({...workshopData, heroDescriptionHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="विवरण" />
                <label className="block text-xs font-bold uppercase text-gray-500 mt-4">Tab 1 Name (Hindi)</label>
                <input type="text" value={workshopData.tab1NameHn} onChange={(e) => setWorkshopData({...workshopData, tab1NameHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Tab 1 Hindi Name" />
                <label className="block text-xs font-bold uppercase text-gray-500 mt-4">Tab 2 Name (Hindi)</label>
                <input type="text" value={workshopData.tab2NameHn} onChange={(e) => setWorkshopData({...workshopData, tab2NameHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Tab 2 Hindi Name" />
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Rules & Formats Management</h2>
                <button onClick={addRule} className="bg-[#631012] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7a1214]">
                  <Plus size={18} /> Add Rule
                </button>
              </div>

              <div className="space-y-4">
                {workshopData.rules.map((rule) => (
                  <div key={rule.id} className="p-4 border rounded-xl bg-gray-50 relative group">
                    <button onClick={() => removeRule(rule.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#631012] uppercase">English Content</label>
                        <input value={rule.title_en} onChange={(e) => updateRule(rule.id, 'title_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" placeholder="Title" />
                        <textarea value={rule.description_en} onChange={(e) => updateRule(rule.id, 'description_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm h-20" placeholder="Description" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#631012] uppercase">Hindi Content</label>
                        <input value={rule.title_hn} onChange={(e) => updateRule(rule.id, 'title_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" placeholder="शीर्षक" />
                        <textarea value={rule.description_hn} onChange={(e) => updateRule(rule.id, 'description_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm h-20" placeholder="विवरण" />
                      </div>
                      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                        {/* PDF Upload and URL */}
                        <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200">
                          <label className="text-[10px] font-bold text-[#631012] uppercase block">PDF Document</label>
                          <input 
                            type="text" 
                            value={rule.pdf_url} 
                            onChange={(e) => updateRule(rule.id, 'pdf_url', e.target.value)} 
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50" 
                            placeholder="PDF URL" 
                          />
                          <div className="flex items-center gap-3">
                            <label className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm ${uploadingState[`rules-${rule.id}-pdf`] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                              <Upload size={12} />
                              {uploadingState[`rules-${rule.id}-pdf`] ? 'Uploading...' : 'Upload PDF'}
                              <input 
                                type="file" 
                                accept="application/pdf" 
                                disabled={!!uploadingState[`rules-${rule.id}-pdf`]}
                                onChange={(e) => handleFileUpload(e, rule.id, 'pdf', 'rules')} 
                                className="hidden" 
                              />
                            </label>
                            {rule.pdf_url && (
                              <span className="text-[11px] text-green-600 font-semibold flex items-center gap-1 truncate max-w-[180px]">
                                ✓ Active PDF
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Word Upload and URL */}
                        <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200">
                          <label className="text-[10px] font-bold text-[#631012] uppercase block">Word Document</label>
                          <input 
                            type="text" 
                            value={rule.word_url} 
                            onChange={(e) => updateRule(rule.id, 'word_url', e.target.value)} 
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50" 
                            placeholder="Word Document URL" 
                          />
                          <div className="flex items-center gap-3">
                            <label className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm ${uploadingState[`rules-${rule.id}-word`] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                              <Upload size={12} />
                              {uploadingState[`rules-${rule.id}-word`] ? 'Uploading...' : 'Upload Word'}
                              <input 
                                type="file" 
                                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                                disabled={!!uploadingState[`rules-${rule.id}-word`]}
                                onChange={(e) => handleFileUpload(e, rule.id, 'word', 'rules')} 
                                className="hidden" 
                              />
                            </label>
                            {rule.word_url && (
                              <span className="text-[11px] text-green-600 font-semibold flex items-center gap-1 truncate max-w-[180px]">
                                ✓ Active Word Doc
                              </span>
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

          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Notices & Office Orders</h2>
                <button onClick={addNotice} className="bg-[#631012] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7a1214]">
                  <Plus size={18} /> Add Notice
                </button>
              </div>

              <div className="space-y-4">
                {workshopData.notices.map((notice) => (
                  <div key={notice.id} className="p-4 border rounded-xl bg-gray-50 relative group">
                    <button onClick={() => removeNotice(notice.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-blue-600 uppercase">English Content</label>
                        <input value={notice.title_en} onChange={(e) => updateNotice(notice.id, 'title_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" placeholder="Notice Title" />
                        <textarea value={notice.description_en} onChange={(e) => updateNotice(notice.id, 'description_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm h-20" placeholder="Description" />
                        <input value={notice.date_en} onChange={(e) => updateNotice(notice.id, 'date_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Date" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-blue-600 uppercase">Hindi Content</label>
                        <input value={notice.title_hn} onChange={(e) => updateNotice(notice.id, 'title_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" placeholder="सूचना शीर्षक" />
                        <textarea value={notice.description_hn} onChange={(e) => updateNotice(notice.id, 'description_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm h-20" placeholder="विवरण" />
                        <input value={notice.date_hn} onChange={(e) => updateNotice(notice.id, 'date_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="तिथि" />
                      </div>
                      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                        {/* PDF Upload and URL */}
                        <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200">
                          <label className="text-[10px] font-bold text-[#631012] uppercase block">PDF Document</label>
                          <input 
                            type="text" 
                            value={notice.pdf_url} 
                            onChange={(e) => updateNotice(notice.id, 'pdf_url', e.target.value)} 
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50" 
                            placeholder="PDF URL" 
                          />
                          <div className="flex items-center gap-3">
                            <label className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm ${uploadingState[`notices-${notice.id}-pdf`] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                              <Upload size={12} />
                              {uploadingState[`notices-${notice.id}-pdf`] ? 'Uploading...' : 'Upload PDF'}
                              <input 
                                type="file" 
                                accept="application/pdf" 
                                disabled={!!uploadingState[`notices-${notice.id}-pdf`]}
                                onChange={(e) => handleFileUpload(e, notice.id, 'pdf', 'notices')} 
                                className="hidden" 
                              />
                            </label>
                            {notice.pdf_url && (
                              <span className="text-[11px] text-green-600 font-semibold flex items-center gap-1 truncate max-w-[180px]">
                                ✓ Active PDF
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Word Upload and URL */}
                        <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200">
                          <label className="text-[10px] font-bold text-[#631012] uppercase block">Word Document</label>
                          <input 
                            type="text" 
                            value={notice.word_url} 
                            onChange={(e) => updateNotice(notice.id, 'word_url', e.target.value)} 
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50" 
                            placeholder="Word Document URL" 
                          />
                          <div className="flex items-center gap-3">
                            <label className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm ${uploadingState[`notices-${notice.id}-word`] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                              <Upload size={12} />
                              {uploadingState[`notices-${notice.id}-word`] ? 'Uploading...' : 'Upload Word'}
                              <input 
                                type="file" 
                                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                                disabled={!!uploadingState[`notices-${notice.id}-word`]}
                                onChange={(e) => handleFileUpload(e, notice.id, 'word', 'notices')} 
                                className="hidden" 
                              />
                            </label>
                            {notice.word_url && (
                              <span className="text-[11px] text-green-600 font-semibold flex items-center gap-1 truncate max-w-[180px]">
                                ✓ Active Word Doc
                              </span>
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
