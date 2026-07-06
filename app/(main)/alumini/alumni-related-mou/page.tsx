'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  FileText,
  Plus,
  Trash2,
  Calendar,
  Upload,
} from 'lucide-react';

interface MouItem {
  id: number;
  title_en: string;
  title_hn: string;
  drafted_date: string;
  document_url: string;
  file_type: string;
}

interface MouData {
  heroHeadingEn: string;
  heroHeadingHn: string;
  heroDescriptionEn: string;
  heroDescriptionHn: string;
  mous: MouItem[];
}

type TabType = 'hero' | 'list';

export default function AlumniMouAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [data, setData] = useState<MouData>({
    heroHeadingEn: 'Alumni Related MoU',
    heroHeadingHn: 'पूर्व छात्र संबंधित समझौता ज्ञापन',
    heroDescriptionEn: 'Official Memorandums of Understanding associated with NITH Alumni initiatives.',
    heroDescriptionHn: 'एनआईटीएच पूर्व छात्र पहलों से जुड़े आधिकारिक समझौता ज्ञापन।',
    mous: [],
  });
  const [uploadingState, setUploadingState] = useState<{ [key: number]: boolean }>({});

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf';
    const isWord = file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isPdf && !isWord) {
      alert('Only PDF and Word documents are allowed!');
      return;
    }

    setUploadingState((prev) => ({ ...prev, [id]: true }));
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        headers: {
          'x-bucket-name': 'alumni-section',
        },
        body: formData,
      });

      const result = await res.json();
      if (result.success && result.url) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
        setData((prev) => ({
          ...prev,
          mous: prev.mous.map((m) =>
            m.id === id ? { ...m, document_url: result.url, file_type: ext } : m
          ),
        }));
        alert('File uploaded successfully!');
      } else {
        alert('Failed to upload file: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file to server');
    } finally {
      setUploadingState((prev) => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hRes = await fetch('http://localhost:4000/api/alumni-mou');
        const hData = await hRes.json();
        if (hData && hData.title_en) {
          setData(prev => ({
            ...prev,
            heroHeadingEn: hData.title_en,
            heroHeadingHn: hData.title_hn,
            heroDescriptionEn: hData.sub_title_en,
            heroDescriptionHn: hData.sub_title_hn,
          }));
        }

        const lRes = await fetch('http://localhost:4000/api/alumni-mou/list');
        const lData = await lRes.json();
        if (Array.isArray(lData)) {
          setData(prev => ({ ...prev, mous: lData }));
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await fetch('http://localhost:4000/api/alumni-mou', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_en: data.heroHeadingEn,
          title_hn: data.heroHeadingHn,
          sub_title_en: data.heroDescriptionEn,
          sub_title_hn: data.heroDescriptionHn,
        }),
      });

      for (const item of data.mous) {
        if (item.id > 0 && item.id < 1000000) {
          await fetch(`http://localhost:4000/api/alumni-mou/list/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          });
        } else {
          await fetch('http://localhost:4000/api/alumni-mou/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
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

  const updateMou = (id: number, field: keyof MouItem, value: string) => {
    setData({
      ...data,
      mous: data.mous.map((m) => m.id === id ? { ...m, [field]: value } : m),
    });
  };

  const addMou = () => {
    setData({
      ...data,
      mous: [
        ...data.mous,
        { 
            id: Date.now() + Math.floor(Math.random() * 1000), 
            title_en: '', title_hn: '', 
            drafted_date: new Date().toISOString().split('T')[0],
            document_url: '',
            file_type: 'pdf'
        },
      ],
    });
  };

  const removeMou = async (id: number) => {
    if (id > 0 && id < 1000000) {
      if (!confirm('Delete from database?')) return;
      await fetch(`http://localhost:4000/api/alumni-mou/list/${id}`, { method: 'DELETE' });
    }
    setData({
      ...data,
      mous: data.mous.filter((m) => m.id !== id),
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#171717]">Alumni Related MoU Editor</h1>
              <p className="text-[#171717]/60">Manage Memorandums of Understanding and agreements</p>
            </div>
          </div>
          <button onClick={handleSave} className="bg-[#631012] hover:bg-[#7a1214] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md">
            <Save size={20} /> Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-[#171717]/10">
          <button onClick={() => setActiveTab('hero')} className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'hero' ? 'bg-[#631012] text-white' : 'text-[#171717]/70 hover:bg-gray-50'}`}>
            <Calendar size={18} /> Hero Section
          </button>
          <button onClick={() => setActiveTab('list')} className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'list' ? 'bg-[#631012] text-white' : 'text-[#171717]/70 hover:bg-gray-50'}`}>
            <FileText size={18} /> MoU Documents List
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'hero' && (
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-500">English Header</label>
                <input type="text" value={data.heroHeadingEn} onChange={(e) => setData({...data, heroHeadingEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Heading" />
                <textarea rows={3} value={data.heroDescriptionEn} onChange={(e) => setData({...data, heroDescriptionEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Description" />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-500">Hindi Header</label>
                <input type="text" value={data.heroHeadingHn} onChange={(e) => setData({...data, heroHeadingHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="शीर्षक" />
                <textarea rows={3} value={data.heroDescriptionHn} onChange={(e) => setData({...data, heroDescriptionHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="विवरण" />
              </div>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">MoU Management</h2>
                <button onClick={addMou} className="bg-[#631012] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7a1214]">
                  <Plus size={18} /> Add MoU
                </button>
              </div>

              <div className="space-y-4">
                {data.mous.map((item) => (
                  <div key={item.id} className="p-6 border rounded-xl bg-gray-50 relative group">
                    <button onClick={() => removeMou(item.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#631012] uppercase tracking-widest">English Title</label>
                        <textarea value={item.title_en} onChange={(e) => updateMou(item.id, 'title_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" placeholder="MoU Title" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#631012] uppercase tracking-widest">Hindi Title</label>
                        <textarea value={item.title_hn} onChange={(e) => updateMou(item.id, 'title_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" placeholder="शीर्षक" />
                      </div>
                      <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Drafted Date</label>
                            <input type="date" value={item.drafted_date} onChange={(e) => updateMou(item.id, 'drafted_date', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white" />
                        </div>
                        
                        <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200">
                          <label className="text-[10px] font-bold text-[#631012] uppercase block">Document Link</label>
                          <input 
                            type="text" 
                            value={item.document_url} 
                            onChange={(e) => updateMou(item.id, 'document_url', e.target.value)} 
                            className="w-full px-3 py-1.5 border rounded-lg text-xs bg-gray-50 font-mono" 
                            placeholder="File URL" 
                          />
                          <div className="flex items-center gap-3">
                            <label className={`px-3 py-1 rounded-lg text-white text-[10px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm ${uploadingState[item.id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                              <Upload size={10} />
                              {uploadingState[item.id] ? 'Uploading...' : 'Upload File'}
                              <input 
                                type="file" 
                                accept="application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                                disabled={!!uploadingState[item.id]}
                                onChange={(e) => handleFileUpload(e, item.id)} 
                                className="hidden" 
                              />
                            </label>
                            {item.document_url && (
                              <span className="text-[10px] text-green-600 font-semibold truncate max-w-[120px]">
                                ✓ Active File
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">File Type</label>
                            <select value={item.file_type} onChange={(e) => updateMou(item.id, 'file_type', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                                <option value="pdf">PDF</option>
                                <option value="doc">DOC</option>
                                <option value="docx">DOCX</option>
                            </select>
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
