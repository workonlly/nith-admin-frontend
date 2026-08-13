'use client';

import React, { useState, useEffect } from 'react';
import { Save, Building2, Plus, Trash2, MapPin, FileText, Info, List, Loader2, Globe } from 'lucide-react';

interface CityInfoCard {
  id?: number;
  label_en: string;
  label_hi: string;
  value_en: string;
  value_hi: string;
}

interface CityDescription {
  id?: number;
  description_en: string;
  description_hi: string;
}

interface CityData {
  heading_en: string;
  heading_hi: string;
  introduction_en: string;
  introduction_hi: string;
  overview_title_en: string;
  overview_title_hi: string;
  overview_subtitle_en: string;
  overview_subtitle_hi: string;
  infoCards: CityInfoCard[];
  descriptions: CityDescription[];
}

type TabType = 'hero' | 'overview' | 'descriptions';
type LangType = 'en' | 'hi';

export default function AboutCityPage() {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/about-city`;

  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [lang, setLang] = useState<LangType>('en');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState<CityData>({
    heading_en: '', heading_hi: '',
    introduction_en: '', introduction_hi: '',
    overview_title_en: '', overview_title_hi: '',
    overview_subtitle_en: '', overview_subtitle_hi: '',
    infoCards: [],
    descriptions: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (res.ok) {
        const json = await res.json();
        setData({
          heading_en: json.heading_en || '',
          heading_hi: json.heading_hi || '',
          introduction_en: json.introduction_en || '',
          introduction_hi: json.introduction_hi || '',
          overview_title_en: json.overview_title_en || '',
          overview_title_hi: json.overview_title_hi || '',
          overview_subtitle_en: json.overview_subtitle_en || '',
          overview_subtitle_hi: json.overview_subtitle_hi || '',
          infoCards: json.infoCards || [],
          descriptions: json.descriptions || [],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMain = async () => {
    try {
      setSaving(true);
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heading_en: data.heading_en, heading_hi: data.heading_hi,
          introduction_en: data.introduction_en, introduction_hi: data.introduction_hi,
          overviewTitle_en: data.overview_title_en, overviewTitle_hi: data.overview_title_hi,
          overviewSubtitle_en: data.overview_subtitle_en, overviewSubtitle_hi: data.overview_subtitle_hi,
        }),
      });

      if (res.ok) alert('Saved successfully!');
      else alert('Failed to save');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setData(prev => ({ ...prev, [`${field}_${lang}`]: value }));
  };

  const getField = (field: string) => {
    return (data as any)[`${field}_${lang}`] || '';
  };

  // --- Sub-items Operations ---
  const saveSubItem = async (endpoint: string, payload: any, isNew: boolean, id?: number) => {
    try {
      const url = isNew ? `${API_URL}/${endpoint}` : `${API_URL}/${endpoint}/${id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteSubItem = async (endpoint: string, id: number | undefined, index: number, localList: any[], listName: string) => {
    if (!id) {
      const updated = [...localList];
      updated.splice(index, 1);
      setData({ ...data, [listName]: updated });
      return;
    }
    if (confirm('Delete this item?')) {
      try {
        await fetch(`${API_URL}/${endpoint}/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const updateListLocal = (listName: keyof CityData, index: number, field: string, value: string) => {
    const updated: any[] = [...(data[listName] as any[])];
    updated[index][`${field}_${lang}`] = value;
    setData({ ...data, [listName]: updated });
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Section', icon: <FileText size={18} /> },
    { id: 'overview' as TabType, label: 'City Overview', icon: <Info size={18} /> },
    { id: 'descriptions' as TabType, label: 'Descriptions', icon: <List size={18} /> },
  ];

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#631012]/10 p-2 rounded-full text-[#631012]"><Building2 className="w-6 h-6" /></div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">About City Editor</h1>
            <p className="text-sm text-gray-500">Edit Hamirpur city information</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <Globe size={18} className="text-gray-500 ml-2" />
            <select value={lang} onChange={(e) => setLang(e.target.value as LangType)} className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer py-1 pr-4">
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
          <button onClick={handleSaveMain} disabled={saving} className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} Save Main Content
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-[#171717]/10 flex overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap text-sm ${activeTab === tab.id ? 'bg-[#631012] text-white border-b-2 border-[#631012]' : 'text-gray-600 hover:bg-gray-50'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          {/* HERO TAB */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="grid gap-3 p-4 bg-gray-50 border rounded-lg">
                <input type="text" value={getField('heading')} onChange={e => updateField('heading', e.target.value)} placeholder="Heading" className="w-full p-2 border rounded" />
                <textarea rows={4} value={getField('introduction')} onChange={e => updateField('introduction', e.target.value)} placeholder="Introduction" className="w-full p-2 border rounded" />
              </div>
            </div>
          )}

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 border rounded-lg">
                <input type="text" value={getField('overview_title')} onChange={e => updateField('overview_title', e.target.value)} placeholder="Overview Title" className="w-full p-2 border rounded" />
                <input type="text" value={getField('overview_subtitle')} onChange={e => updateField('overview_subtitle', e.target.value)} placeholder="Overview Subtitle" className="w-full p-2 border rounded" />
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Information Cards</h3>
                <div className="space-y-3">
                  {data.infoCards.map((card, i) => (
                    <div key={i} className="p-3 border rounded bg-gray-50 flex gap-3">
                      <div className="flex-1 space-y-2 grid grid-cols-2 gap-2">
                        <input type="text" value={(card as any)[`label_${lang}`] || ''} onChange={e => updateListLocal('infoCards', i, 'label', e.target.value)} placeholder="Label" className="p-2 border rounded text-sm" />
                        <input type="text" value={(card as any)[`value_${lang}`] || ''} onChange={e => updateListLocal('infoCards', i, 'value', e.target.value)} placeholder="Value" className="p-2 border rounded text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => saveSubItem('info-card', { label_en: card.label_en, label_hi: card.label_hi, value_en: card.value_en, value_hi: card.value_hi }, !card.id, card.id)} className="p-2 bg-green-100 text-green-700 rounded"><Save size={16}/></button>
                        <button onClick={() => deleteSubItem('info-card', card.id, i, data.infoCards, 'infoCards')} className="p-2 bg-red-100 text-red-700 rounded"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setData({ ...data, infoCards: [...data.infoCards, { label_en: '', label_hi: '', value_en: '', value_hi: '' }]})} className="text-[#631012] font-medium text-sm flex items-center gap-1 hover:underline"><Plus size={16} /> Add Info Card</button>
                </div>
              </div>
            </div>
          )}

          {/* DESCRIPTIONS TAB */}
          {activeTab === 'descriptions' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Description Paragraphs</h3>
                <div className="space-y-3">
                  {data.descriptions.map((desc, i) => (
                    <div key={i} className="p-3 border rounded bg-gray-50 flex gap-3">
                      <div className="flex-1">
                        <textarea rows={3} value={(desc as any)[`description_${lang}`] || ''} onChange={e => updateListLocal('descriptions', i, 'description', e.target.value)} placeholder="Description paragraph" className="w-full p-2 border rounded text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => saveSubItem('description', { description_en: desc.description_en, description_hi: desc.description_hi }, !desc.id, desc.id)} className="p-2 bg-green-100 text-green-700 rounded"><Save size={16}/></button>
                        <button onClick={() => deleteSubItem('description', desc.id, i, data.descriptions, 'descriptions')} className="p-2 bg-red-100 text-red-700 rounded"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setData({ ...data, descriptions: [...data.descriptions, { description_en: '', description_hi: '' }]})} className="text-[#631012] font-medium text-sm flex items-center gap-1 hover:underline"><Plus size={16} /> Add Paragraph</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
