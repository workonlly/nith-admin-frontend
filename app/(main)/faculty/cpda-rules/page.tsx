'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  FileText,
  Plus,
  Trash2,
  BookOpen,
  Download,
  ExternalLink,
  Calendar,
  Upload,
} from 'lucide-react';

interface Rule {
  id: number;
  particulars_en: string;
  particulars_hn: string;
  pdf_url: string;
  word_url: string;
}

interface CPDAData {
  heroHeadingEn: string;
  heroHeadingHn: string;
  heroDescriptionEn: string;
  heroDescriptionHn: string;
  rules: Rule[];
}

const INITIAL_RULES: Rule[] = [
  {
    id: 1,
    particulars_en: 'CUMULATIVE PROFESSIONAL DEVELOPMENT ALLOWANCE (CPDA) RULES W.E.F. 1st APRIL, 2021 to 31st MARCH, 2024',
    particulars_hn: '1 अप्रैल, 2021 से 31 मार्च, 2024 तक संचयी व्यावसायिक विकास भत्ता (सीपीडीए) नियम',
    pdf_url: '/documents/cpda-rules.pdf',
    word_url: '/documents/cpda-rules.docx',
  }
];

type TabType = 'hero' | 'rules';

export default function CPDARulesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [cpdaData, setCpdaData] = useState<CPDAData>({
    heroHeadingEn: 'CPDA Rules',
    heroHeadingHn: 'सीपीडीए नियम',
    heroDescriptionEn: 'Important rules and guidelines for Cumulative Professional Development Allowance.',
    heroDescriptionHn: 'संचयी व्यावसायिक विकास भत्ते के लिए महत्वपूर्ण नियम और दिशा-निर्देश।',
    rules: INITIAL_RULES,
  });
  const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    type: 'pdf' | 'word'
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

    const uploadKey = `${id}-${type}`;
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
        setCpdaData((prev) => ({
          ...prev,
          rules: prev.rules.map((r) =>
            r.id === id ? { ...r, [type === 'pdf' ? 'pdf_url' : 'word_url']: result.url } : r
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
    { id: 'rules' as TabType, label: 'Rules Management', icon: <BookOpen size={18} /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hRes = await fetch('http://localhost:4000/api/faculty-cpda');
        const hData = await hRes.json();
        if (hData && hData.title_en) {
          setCpdaData(prev => ({
            ...prev,
            heroHeadingEn: hData.title_en,
            heroHeadingHn: hData.title_hn,
            heroDescriptionEn: hData.sub_title_en,
            heroDescriptionHn: hData.sub_title_hn,
          }));
        }

        const lRes = await fetch('http://localhost:4000/api/faculty-cpda/list');
        const lData = await lRes.json();
        if (Array.isArray(lData) && lData.length > 0) {
          setCpdaData(prev => ({ ...prev, rules: lData }));
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      // Save Hero
      await fetch('http://localhost:4000/api/faculty-cpda', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_en: cpdaData.heroHeadingEn,
          title_hn: cpdaData.heroHeadingHn,
          sub_title_en: cpdaData.heroDescriptionEn,
          sub_title_hn: cpdaData.heroDescriptionHn,
        }),
      });

      // Save Rules
      for (const rule of cpdaData.rules) {
        if (rule.id > 0 && rule.id < 1000000) { // Existing Database ID
          await fetch(`http://localhost:4000/api/faculty-cpda/list/${rule.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rule),
          });
        } else {
          // New Rule (Date.now() or Negative Hardcoded ID)
          await fetch('http://localhost:4000/api/faculty-cpda/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rule),
          });
        }
      }
      alert('Changes saved successfully!');
      // Re-fetch to get real database IDs for new items
      window.location.reload(); 
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save changes');
    }
  };

  const updateRule = (id: number, field: keyof Rule, value: string) => {
    setCpdaData({
      ...cpdaData,
      rules: cpdaData.rules.map((r) => r.id === id ? { ...r, [field]: value } : r),
    });
  };

  const addRule = () => {
    setCpdaData({
      ...cpdaData,
      rules: [
        ...cpdaData.rules,
        { id: Date.now() + Math.floor(Math.random() * 1000), particulars_en: '', particulars_hn: '', pdf_url: '', word_url: '' },
      ],
    });
  };

  const removeRule = async (id: number) => {
    if (id > 0 && id < 1000000) {
      if (!confirm('Delete from database?')) return;
      await fetch(`http://localhost:4000/api/faculty-cpda/list/${id}`, { method: 'DELETE' });
    }
    setCpdaData({
      ...cpdaData,
      rules: cpdaData.rules.filter((r) => r.id !== id),
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">
              <BookOpen size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#171717]">CPDA Rules Editor</h1>
              <p className="text-[#171717]/60">Manage faculty CPDA guidelines and documents</p>
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
                <input type="text" value={cpdaData.heroHeadingEn} onChange={(e) => setCpdaData({...cpdaData, heroHeadingEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Heading" />
                <textarea rows={3} value={cpdaData.heroDescriptionEn} onChange={(e) => setCpdaData({...cpdaData, heroDescriptionEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Description" />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-500">Hindi Header</label>
                <input type="text" value={cpdaData.heroHeadingHn} onChange={(e) => setCpdaData({...cpdaData, heroHeadingHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="शीर्षक" />
                <textarea rows={3} value={cpdaData.heroDescriptionHn} onChange={(e) => setCpdaData({...cpdaData, heroDescriptionHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="विवरण" />
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
                {cpdaData.rules.map((rule, idx) => (
                  <div key={rule.id} className="p-4 border rounded-xl bg-gray-50 relative group">
                    <button onClick={() => removeRule(rule.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#631012] uppercase">English Particulars</label>
                        <textarea value={rule.particulars_en} onChange={(e) => updateRule(rule.id, 'particulars_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm h-24" placeholder="Description in English" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#631012] uppercase">Hindi Particulars</label>
                        <textarea value={rule.particulars_hn} onChange={(e) => updateRule(rule.id, 'particulars_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm h-24" placeholder="हिंदी में विवरण" />
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
                            <label className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm ${uploadingState[`${rule.id}-pdf`] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                              <Upload size={12} />
                              {uploadingState[`${rule.id}-pdf`] ? 'Uploading...' : 'Upload PDF'}
                              <input 
                                type="file" 
                                accept="application/pdf" 
                                disabled={!!uploadingState[`${rule.id}-pdf`]}
                                onChange={(e) => handleFileUpload(e, rule.id, 'pdf')} 
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
                            <label className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm ${uploadingState[`${rule.id}-word`] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                              <Upload size={12} />
                              {uploadingState[`${rule.id}-word`] ? 'Uploading...' : 'Upload Word'}
                              <input 
                                type="file" 
                                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                                disabled={!!uploadingState[`${rule.id}-word`]}
                                onChange={(e) => handleFileUpload(e, rule.id, 'word')} 
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
        </div>
      </div>
    </div>
  );
}
