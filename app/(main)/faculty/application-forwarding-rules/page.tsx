'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  FileCheck,
  Plus,
  Trash2,
  FileText,
  Upload,
} from 'lucide-react';

interface ForwardingRule {
  id: number;
  title_en: string;
  title_hn: string;
  description_en: string;
  description_hn: string;
  date_en: string;
  date_hn: string;
  download_url: string;
  read_more_url: string;
}

interface ForwardingData {
  heroHeadingEn: string;
  heroHeadingHn: string;
  heroDescriptionEn: string;
  heroDescriptionHn: string;
  rules: ForwardingRule[];
}

const INITIAL_RULES: ForwardingRule[] = [
  {
    id: -1,
    title_en: 'Leave Application Forwarding Protocol',
    title_hn: 'अवकाश आवेदन अग्रेषण प्रोटोकॉल',
    description_en: 'Guidelines for forwarding leave applications through departmental hierarchy and obtaining necessary approvals.',
    description_hn: 'विभागीय पदानुक्रम के माध्यम से अवकाश आवेदनों को अग्रेषित करने और आवश्यक अनुमोदन प्राप्त करने के लिए दिशानिर्देश।',
    date_en: 'January 1, 2024',
    date_hn: '1 जनवरी, 2024',
    download_url: '/documents/leave-forwarding-protocol.pdf',
    read_more_url: '/news/leave-forwarding'
  }
];

type TabType = 'hero' | 'rules';

export default function ForwardingRulesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [forwardingData, setForwardingData] = useState<ForwardingData>({
    heroHeadingEn: 'Application Forwarding Rules',
    heroHeadingHn: 'आवेदन अग्रेषण नियम',
    heroDescriptionEn: 'Comprehensive guidelines and procedures for forwarding applications.',
    heroDescriptionHn: 'आवेदनों को अग्रेषित करने के लिए व्यापक दिशानिर्देश और प्रक्रियाएं।',
    rules: INITIAL_RULES,
  });
  const [uploadingState, setUploadingState] = useState<{ [key: number]: boolean }>({});

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed!');
      return;
    }

    setUploadingState((prev) => ({ ...prev, [id]: true }));
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
        setForwardingData((prev) => ({
          ...prev,
          rules: prev.rules.map((r) =>
            r.id === id ? { ...r, download_url: result.url } : r
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
      setUploadingState((prev) => ({ ...prev, [id]: false }));
    }
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Section', icon: <FileText size={18} /> },
    { id: 'rules' as TabType, label: 'Rules Management', icon: <FileCheck size={18} /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hRes = await fetch('http://localhost:4000/api/faculty-forwarding');
        const hData = await hRes.json();
        if (hData && hData.title_en) {
          setForwardingData(prev => ({
            ...prev,
            heroHeadingEn: hData.title_en,
            heroHeadingHn: hData.title_hn,
            heroDescriptionEn: hData.sub_title_en,
            heroDescriptionHn: hData.sub_title_hn,
          }));
        }

        const lRes = await fetch('http://localhost:4000/api/faculty-forwarding/list');
        const lData = await lRes.json();
        if (Array.isArray(lData) && lData.length > 0) {
          setForwardingData(prev => {
            const merged = [...lData];
            INITIAL_RULES.forEach(def => {
              if (!merged.find(m => m.title_en === def.title_en || String(m.id) === String(def.id))) {
                merged.push(def);
              }
            });
            return { ...prev, rules: merged };
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
      await fetch('http://localhost:4000/api/faculty-forwarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_en: forwardingData.heroHeadingEn,
          title_hn: forwardingData.heroHeadingHn,
          sub_title_en: forwardingData.heroDescriptionEn,
          sub_title_hn: forwardingData.heroDescriptionHn,
        }),
      });

      for (const rule of forwardingData.rules) {
        if (rule.id > 0 && rule.id < 1000000) {
          await fetch(`http://localhost:4000/api/faculty-forwarding/list/${rule.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rule),
          });
        } else {
          await fetch('http://localhost:4000/api/faculty-forwarding/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rule),
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

  const updateRule = (id: number, field: keyof ForwardingRule, value: string) => {
    setForwardingData({
      ...forwardingData,
      rules: forwardingData.rules.map((r) => r.id === id ? { ...r, [field]: value } : r),
    });
  };

  const addRule = () => {
    setForwardingData({
      ...forwardingData,
      rules: [
        ...forwardingData.rules,
        { id: Date.now() + Math.floor(Math.random() * 1000), title_en: '', title_hn: '', description_en: '', description_hn: '', date_en: '', date_hn: '', download_url: '', read_more_url: '' },
      ],
    });
  };

  const removeRule = async (id: number) => {
    if (id > 0 && id < 1000000) {
      if (!confirm('Delete from database?')) return;
      await fetch(`http://localhost:4000/api/faculty-forwarding/list/${id}`, { method: 'DELETE' });
    }
    setForwardingData({
      ...forwardingData,
      rules: forwardingData.rules.filter((r) => r.id !== id),
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">
              <FileCheck size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#171717]">Forwarding Rules Editor</h1>
              <p className="text-[#171717]/60">Manage application forwarding procedures</p>
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
                <input type="text" value={forwardingData.heroHeadingEn} onChange={(e) => setForwardingData({...forwardingData, heroHeadingEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Heading" />
                <textarea rows={3} value={forwardingData.heroDescriptionEn} onChange={(e) => setForwardingData({...forwardingData, heroDescriptionEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Description" />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-500">Hindi Header</label>
                <input type="text" value={forwardingData.heroHeadingHn} onChange={(e) => setForwardingData({...forwardingData, heroHeadingHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="शीर्षक" />
                <textarea rows={3} value={forwardingData.heroDescriptionHn} onChange={(e) => setForwardingData({...forwardingData, heroDescriptionHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="विवरण" />
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Rules Management</h2>
                <button onClick={addRule} className="bg-[#631012] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7a1214]">
                  <Plus size={18} /> Add Rule
                </button>
              </div>

              <div className="space-y-4">
                {forwardingData.rules.map((rule, idx) => (
                  <div key={rule.id} className="p-4 border rounded-xl bg-gray-50 relative group">
                    <button onClick={() => removeRule(rule.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#631012] uppercase">English Content</label>
                        <input value={rule.title_en} onChange={(e) => updateRule(rule.id, 'title_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" placeholder="Title" />
                        <textarea value={rule.description_en} onChange={(e) => updateRule(rule.id, 'description_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm h-20" placeholder="Description" />
                        <input value={rule.date_en} onChange={(e) => updateRule(rule.id, 'date_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Effective Date" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#631012] uppercase">Hindi Content</label>
                        <input value={rule.title_hn} onChange={(e) => updateRule(rule.id, 'title_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" placeholder="शीर्षक" />
                        <textarea value={rule.description_hn} onChange={(e) => updateRule(rule.id, 'description_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm h-20" placeholder="विवरण" />
                        <input value={rule.date_hn} onChange={(e) => updateRule(rule.id, 'date_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="प्रभावी तिथि" />
                      </div>
                      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                        {/* PDF Upload and URL */}
                        <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200">
                          <label className="text-[10px] font-bold text-[#631012] uppercase block">Download PDF Document</label>
                          <input 
                            type="text" 
                            value={rule.download_url} 
                            onChange={(e) => updateRule(rule.id, 'download_url', e.target.value)} 
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50" 
                            placeholder="Download PDF URL" 
                          />
                          <div className="flex items-center gap-3">
                            <label className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm ${uploadingState[rule.id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                              <Upload size={12} />
                              {uploadingState[rule.id] ? 'Uploading...' : 'Upload PDF'}
                              <input 
                                type="file" 
                                accept="application/pdf" 
                                disabled={!!uploadingState[rule.id]}
                                onChange={(e) => handlePdfUpload(e, rule.id)} 
                                className="hidden" 
                              />
                            </label>
                            {rule.download_url && (
                              <span className="text-[11px] text-green-600 font-semibold flex items-center gap-1 truncate max-w-[180px]">
                                ✓ Active PDF
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Read More URL */}
                        <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200 flex flex-col justify-between">
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Read More URL</label>
                            <input 
                              type="text" 
                              value={rule.read_more_url} 
                              onChange={(e) => updateRule(rule.id, 'read_more_url', e.target.value)} 
                              className="w-full px-3 py-2 border rounded-lg text-sm" 
                              placeholder="Read More URL" 
                            />
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
