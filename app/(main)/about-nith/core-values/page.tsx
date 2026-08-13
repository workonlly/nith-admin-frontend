'use client';

import React, { useState, useEffect } from 'react';
import { Save, Heart, Plus, Trash2, FileText, Shield, BookOpen, Loader2, Globe } from 'lucide-react';

interface CoreValue {
  id?: number;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
}

interface PracticeParagraph {
  id?: number;
  paragraph_en: string;
  paragraph_hi: string;
}

interface CoreValuesData {
  hero_heading_en: string;
  hero_heading_hi: string;
  hero_description_en: string;
  hero_description_hi: string;
  pillars_label_en: string;
  pillars_label_hi: string;
  pillars_heading_en: string;
  pillars_heading_hi: string;
  pillars_subtitle_en: string;
  pillars_subtitle_hi: string;
  practice_label_en: string;
  practice_label_hi: string;
  practice_heading_en: string;
  practice_heading_hi: string;
  practice_subtitle_en: string;
  practice_subtitle_hi: string;
  coreValues: CoreValue[];
  practiceParagraphs: PracticeParagraph[];
}

type TabType = 'hero' | 'values' | 'practice';
type LangType = 'en' | 'hi';

export default function CoreValuesPage() {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/core-values`;

  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [lang, setLang] = useState<LangType>('en');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState<CoreValuesData>({
    hero_heading_en: '', hero_heading_hi: '',
    hero_description_en: '', hero_description_hi: '',
    pillars_label_en: '', pillars_label_hi: '',
    pillars_heading_en: '', pillars_heading_hi: '',
    pillars_subtitle_en: '', pillars_subtitle_hi: '',
    practice_label_en: '', practice_label_hi: '',
    practice_heading_en: '', practice_heading_hi: '',
    practice_subtitle_en: '', practice_subtitle_hi: '',
    coreValues: [],
    practiceParagraphs: [],
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
          hero_heading_en: json.hero_heading_en || '',
          hero_heading_hi: json.hero_heading_hi || '',
          hero_description_en: json.hero_description_en || '',
          hero_description_hi: json.hero_description_hi || '',
          pillars_label_en: json.pillars_label_en || '',
          pillars_label_hi: json.pillars_label_hi || '',
          pillars_heading_en: json.pillars_heading_en || '',
          pillars_heading_hi: json.pillars_heading_hi || '',
          pillars_subtitle_en: json.pillars_subtitle_en || '',
          pillars_subtitle_hi: json.pillars_subtitle_hi || '',
          practice_label_en: json.practice_label_en || '',
          practice_label_hi: json.practice_label_hi || '',
          practice_heading_en: json.practice_heading_en || '',
          practice_heading_hi: json.practice_heading_hi || '',
          practice_subtitle_en: json.practice_subtitle_en || '',
          practice_subtitle_hi: json.practice_subtitle_hi || '',
          coreValues: json.coreValues || [],
          practiceParagraphs: json.practiceParagraphs || [],
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
          heroHeading_en: data.hero_heading_en, heroHeading_hi: data.hero_heading_hi,
          heroDescription_en: data.hero_description_en, heroDescription_hi: data.hero_description_hi,
          pillarsLabel_en: data.pillars_label_en, pillarsLabel_hi: data.pillars_label_hi,
          pillarsHeading_en: data.pillars_heading_en, pillarsHeading_hi: data.pillars_heading_hi,
          pillarsSubtitle_en: data.pillars_subtitle_en, pillarsSubtitle_hi: data.pillars_subtitle_hi,
          practiceLabel_en: data.practice_label_en, practiceLabel_hi: data.practice_label_hi,
          practiceHeading_en: data.practice_heading_en, practiceHeading_hi: data.practice_heading_hi,
          practiceSubtitle_en: data.practice_subtitle_en, practiceSubtitle_hi: data.practice_subtitle_hi,
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

  const updateListLocal = (listName: keyof CoreValuesData, index: number, field: string, value: string) => {
    const updated: any[] = [...(data[listName] as any[])];
    updated[index][`${field}_${lang}`] = value;
    setData({ ...data, [listName]: updated });
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Section', icon: <FileText size={18} /> },
    { id: 'values' as TabType, label: 'Core Values', icon: <Shield size={18} /> },
    { id: 'practice' as TabType, label: 'In Practice', icon: <BookOpen size={18} /> },
  ];

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#631012]/10 p-2 rounded-full text-[#631012]"><Heart className="w-6 h-6" /></div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">Core Values Editor</h1>
            <p className="text-sm text-gray-500">Edit core values and principles</p>
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
                <input type="text" value={getField('hero_heading')} onChange={e => updateField('hero_heading', e.target.value)} placeholder="Hero Heading" className="w-full p-2 border rounded" />
                <textarea rows={4} value={getField('hero_description')} onChange={e => updateField('hero_description', e.target.value)} placeholder="Hero Description" className="w-full p-2 border rounded" />
              </div>
            </div>
          )}

          {/* VALUES TAB */}
          {activeTab === 'values' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 border rounded-lg">
                <input type="text" value={getField('pillars_label')} onChange={e => updateField('pillars_label', e.target.value)} placeholder="Pillars Label" className="w-full p-2 border rounded" />
                <input type="text" value={getField('pillars_heading')} onChange={e => updateField('pillars_heading', e.target.value)} placeholder="Pillars Heading" className="w-full p-2 border rounded" />
                <input type="text" value={getField('pillars_subtitle')} onChange={e => updateField('pillars_subtitle', e.target.value)} placeholder="Pillars Subtitle" className="w-full p-2 border rounded" />
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Core Values</h3>
                <div className="space-y-3">
                  {data.coreValues.map((value, i) => (
                    <div key={i} className="p-3 border rounded bg-gray-50 flex gap-3">
                      <div className="flex-1 space-y-2">
                        <input type="text" value={(value as any)[`title_${lang}`] || ''} onChange={e => updateListLocal('coreValues', i, 'title', e.target.value)} placeholder="Title" className="w-full p-2 border rounded text-sm" />
                        <textarea rows={2} value={(value as any)[`description_${lang}`] || ''} onChange={e => updateListLocal('coreValues', i, 'description', e.target.value)} placeholder="Description" className="w-full p-2 border rounded text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => saveSubItem('value', { title_en: value.title_en, title_hi: value.title_hi, description_en: value.description_en, description_hi: value.description_hi }, !value.id, value.id)} className="p-2 bg-green-100 text-green-700 rounded"><Save size={16}/></button>
                        <button onClick={() => deleteSubItem('value', value.id, i, data.coreValues, 'coreValues')} className="p-2 bg-red-100 text-red-700 rounded"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setData({ ...data, coreValues: [...data.coreValues, { title_en: '', title_hi: '', description_en: '', description_hi: '' }]})} className="text-[#631012] font-medium text-sm flex items-center gap-1 hover:underline"><Plus size={16} /> Add Value</button>
                </div>
              </div>
            </div>
          )}

          {/* PRACTICE TAB */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 border rounded-lg">
                <input type="text" value={getField('practice_label')} onChange={e => updateField('practice_label', e.target.value)} placeholder="Practice Label" className="w-full p-2 border rounded" />
                <input type="text" value={getField('practice_heading')} onChange={e => updateField('practice_heading', e.target.value)} placeholder="Practice Heading" className="w-full p-2 border rounded" />
                <input type="text" value={getField('practice_subtitle')} onChange={e => updateField('practice_subtitle', e.target.value)} placeholder="Practice Subtitle" className="w-full p-2 border rounded" />
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Practice Paragraphs</h3>
                <div className="space-y-3">
                  {data.practiceParagraphs.map((paragraph, i) => (
                    <div key={i} className="p-3 border rounded bg-gray-50 flex gap-3">
                      <div className="flex-1">
                        <textarea rows={3} value={(paragraph as any)[`paragraph_${lang}`] || ''} onChange={e => updateListLocal('practiceParagraphs', i, 'paragraph', e.target.value)} placeholder="Paragraph" className="w-full p-2 border rounded text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => saveSubItem('paragraph', { paragraph_en: paragraph.paragraph_en, paragraph_hi: paragraph.paragraph_hi }, !paragraph.id, paragraph.id)} className="p-2 bg-green-100 text-green-700 rounded"><Save size={16}/></button>
                        <button onClick={() => deleteSubItem('paragraph', paragraph.id, i, data.practiceParagraphs, 'practiceParagraphs')} className="p-2 bg-red-100 text-red-700 rounded"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setData({ ...data, practiceParagraphs: [...data.practiceParagraphs, { paragraph_en: '', paragraph_hi: '' }]})} className="text-[#631012] font-medium text-sm flex items-center gap-1 hover:underline"><Plus size={16} /> Add Paragraph</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
