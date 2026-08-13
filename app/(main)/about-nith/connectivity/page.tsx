'use client';

import React, { useState, useEffect } from 'react';
import { Save, MapPin, Plus, Trash2, FileText, Train, Plane, Car, Loader2, Globe } from 'lucide-react';

interface ServiceParagraph {
  id?: number;
  paragraph_en: string;
  paragraph_hi: string;
}

interface TravelOption {
  id?: number;
  icon: string;
  title_en: string;
  title_hi: string;
  nearest_point_label_en: string;
  nearest_point_label_hi: string;
  nearest_point_value_en: string;
  nearest_point_value_hi: string;
  distance_label_en: string;
  distance_label_hi: string;
  distance_value_en: string;
  distance_value_hi: string;
  travel_time_en: string;
  travel_time_hi: string;
  services_label_en: string;
  services_label_hi: string;
  servicesParagraphs: ServiceParagraph[];
}

interface ConnectivityData {
  hero_heading_en: string;
  hero_heading_hi: string;
  hero_description_en: string;
  hero_description_hi: string;
  travel_options_label_en: string;
  travel_options_label_hi: string;
  travel_options_heading_en: string;
  travel_options_heading_hi: string;
  travel_options_subtitle_en: string;
  travel_options_subtitle_hi: string;
  travelOptions: TravelOption[];
}

type TabType = 'hero' | 'travel';
type LangType = 'en' | 'hi';

export default function ConnectivityPage() {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/connectivity`;

  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [lang, setLang] = useState<LangType>('en');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState<ConnectivityData>({
    hero_heading_en: '', hero_heading_hi: '',
    hero_description_en: '', hero_description_hi: '',
    travel_options_label_en: '', travel_options_label_hi: '',
    travel_options_heading_en: '', travel_options_heading_hi: '',
    travel_options_subtitle_en: '', travel_options_subtitle_hi: '',
    travelOptions: [],
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
          hero_heading_en: json.heroHeadingEn || '',
          hero_heading_hi: json.heroHeadingHi || '',
          hero_description_en: json.heroDescriptionEn || '',
          hero_description_hi: json.heroDescriptionHi || '',
          travel_options_label_en: json.travelOptionsLabelEn || '',
          travel_options_label_hi: json.travelOptionsLabelHi || '',
          travel_options_heading_en: json.travelOptionsHeadingEn || '',
          travel_options_heading_hi: json.travelOptionsHeadingHi || '',
          travel_options_subtitle_en: json.travelOptionsSubtitleEn || '',
          travel_options_subtitle_hi: json.travelOptionsSubtitleHi || '',
          travelOptions: json.travelOptions || [],
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
          heroHeading: lang === 'en' ? data.hero_heading_en : data.hero_heading_hi,
          heroDescription: lang === 'en' ? data.hero_description_en : data.hero_description_hi,
          travelOptionsLabel: lang === 'en' ? data.travel_options_label_en : data.travel_options_label_hi,
          travelOptionsHeading: lang === 'en' ? data.travel_options_heading_en : data.travel_options_heading_hi,
          travelOptionsSubtitle: lang === 'en' ? data.travel_options_subtitle_en : data.travel_options_subtitle_hi,
          lang
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
  const saveOption = async (option: TravelOption, isNew: boolean) => {
    try {
      const url = isNew ? `${API_URL}/travel-option` : `${API_URL}/travel-option/${option.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          icon: option.icon,
          title_en: option.title_en, title_hi: option.title_hi,
          nearestPointLabel_en: option.nearest_point_label_en, nearestPointLabel_hi: option.nearest_point_label_hi,
          nearestPointValue_en: option.nearest_point_value_en, nearestPointValue_hi: option.nearest_point_value_hi,
          distanceLabel_en: option.distance_label_en, distanceLabel_hi: option.distance_label_hi,
          distanceValue_en: option.distance_value_en, distanceValue_hi: option.distance_value_hi,
          travelTime_en: option.travel_time_en, travelTime_hi: option.travel_time_hi,
          servicesLabel_en: option.services_label_en, servicesLabel_hi: option.services_label_hi,
        }),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteOption = async (id: number | undefined, index: number) => {
    if (!id) {
      const updated = [...data.travelOptions];
      updated.splice(index, 1);
      setData({ ...data, travelOptions: updated });
      return;
    }
    if (confirm('Delete this option?')) {
      try {
        await fetch(`${API_URL}/travel-option/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const saveParagraph = async (optionId: number, paragraph: ServiceParagraph, isNew: boolean) => {
    try {
      const url = isNew ? `${API_URL}/paragraph` : `${API_URL}/paragraph/${paragraph.id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travelOptionId: optionId,
          paragraph_en: paragraph.paragraph_en,
          paragraph_hi: paragraph.paragraph_hi,
        }),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteParagraph = async (id: number | undefined, optionIndex: number, paragraphIndex: number) => {
    if (!id) {
      const updatedOpts = [...data.travelOptions];
      updatedOpts[optionIndex].servicesParagraphs.splice(paragraphIndex, 1);
      setData({ ...data, travelOptions: updatedOpts });
      return;
    }
    if (confirm('Delete this paragraph?')) {
      try {
        await fetch(`${API_URL}/paragraph/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const updateOptionLocal = (index: number, field: string, value: string, useLang: boolean = true) => {
    const updated = [...data.travelOptions];
    if (useLang) (updated[index] as any)[`${field}_${lang}`] = value;
    else (updated[index] as any)[field] = value;
    setData({ ...data, travelOptions: updated });
  };

  const updateParagraphLocal = (optionIndex: number, paragraphIndex: number, value: string) => {
    const updatedOpts = [...data.travelOptions];
    (updatedOpts[optionIndex].servicesParagraphs[paragraphIndex] as any)[`paragraph_${lang}`] = value;
    setData({ ...data, travelOptions: updatedOpts });
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Section', icon: <FileText size={18} /> },
    { id: 'travel' as TabType, label: 'Travel Options', icon: <MapPin size={18} /> },
  ];

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#631012]/10 p-2 rounded-full text-[#631012]"><MapPin className="w-6 h-6" /></div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">Connectivity Editor</h1>
            <p className="text-sm text-gray-500">Edit travel options and connectivity</p>
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

          {/* TRAVEL TAB */}
          {activeTab === 'travel' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 border rounded-lg">
                <input type="text" value={getField('travel_options_label')} onChange={e => updateField('travel_options_label', e.target.value)} placeholder="Travel Options Label" className="w-full p-2 border rounded" />
                <input type="text" value={getField('travel_options_heading')} onChange={e => updateField('travel_options_heading', e.target.value)} placeholder="Travel Options Heading" className="w-full p-2 border rounded" />
                <input type="text" value={getField('travel_options_subtitle')} onChange={e => updateField('travel_options_subtitle', e.target.value)} placeholder="Travel Options Subtitle" className="w-full p-2 border rounded" />
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Travel Options</h3>
                <div className="space-y-4">
                  {data.travelOptions.map((option, i) => (
                    <div key={i} className="p-4 border rounded bg-gray-50 flex gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <select value={option.icon} onChange={e => updateOptionLocal(i, 'icon', e.target.value, false)} className="w-full p-2 border rounded text-sm bg-white">
                            <option value="train">Train</option>
                            <option value="plane">Plane</option>
                            <option value="car">Car/Road</option>
                          </select>
                          <input type="text" value={(option as any)[`title_${lang}`] || ''} onChange={e => updateOptionLocal(i, 'title', e.target.value)} placeholder="Title (e.g. By Rail)" className="w-full p-2 border rounded text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" value={(option as any)[`nearest_point_label_${lang}`] || ''} onChange={e => updateOptionLocal(i, 'nearest_point_label', e.target.value)} placeholder="Nearest Point Label" className="w-full p-2 border rounded text-sm" />
                          <input type="text" value={(option as any)[`nearest_point_value_${lang}`] || ''} onChange={e => updateOptionLocal(i, 'nearest_point_value', e.target.value)} placeholder="Nearest Point Value" className="w-full p-2 border rounded text-sm" />
                          <input type="text" value={(option as any)[`distance_label_${lang}`] || ''} onChange={e => updateOptionLocal(i, 'distance_label', e.target.value)} placeholder="Distance Label" className="w-full p-2 border rounded text-sm" />
                          <input type="text" value={(option as any)[`distance_value_${lang}`] || ''} onChange={e => updateOptionLocal(i, 'distance_value', e.target.value)} placeholder="Distance Value" className="w-full p-2 border rounded text-sm" />
                          <input type="text" value={(option as any)[`travel_time_${lang}`] || ''} onChange={e => updateOptionLocal(i, 'travel_time', e.target.value)} placeholder="Travel Time" className="w-full p-2 border rounded text-sm" />
                          <input type="text" value={(option as any)[`services_label_${lang}`] || ''} onChange={e => updateOptionLocal(i, 'services_label', e.target.value)} placeholder="Services Label" className="w-full p-2 border rounded text-sm" />
                        </div>
                        
                        {option.id && (
                          <div className="p-3 bg-white border rounded">
                            <h4 className="text-sm font-semibold mb-2">Services Paragraphs</h4>
                            <div className="space-y-2">
                              {option.servicesParagraphs.map((para, pIdx) => (
                                <div key={pIdx} className="flex gap-2">
                                  <textarea rows={2} value={(para as any)[`paragraph_${lang}`] || ''} onChange={e => updateParagraphLocal(i, pIdx, e.target.value)} className="flex-1 p-2 border rounded text-sm" />
                                  <div className="flex flex-col gap-1">
                                    <button onClick={() => saveParagraph(option.id!, para, !para.id)} className="p-1 bg-green-100 text-green-700 rounded"><Save size={14}/></button>
                                    <button onClick={() => deleteParagraph(para.id, i, pIdx)} className="p-1 bg-red-100 text-red-700 rounded"><Trash2 size={14}/></button>
                                  </div>
                                </div>
                              ))}
                              <button onClick={() => {
                                const newOpts = [...data.travelOptions];
                                newOpts[i].servicesParagraphs.push({ paragraph_en: '', paragraph_hi: '' });
                                setData({ ...data, travelOptions: newOpts });
                              }} className="text-[#631012] text-xs font-medium flex items-center gap-1 hover:underline"><Plus size={14} /> Add Paragraph</button>
                            </div>
                          </div>
                        )}
                        {!option.id && <p className="text-xs text-orange-500">Save this option first to add service paragraphs.</p>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <button onClick={() => saveOption(option, !option.id)} className="p-2 bg-green-100 text-green-700 rounded"><Save size={16}/></button>
                        <button onClick={() => deleteOption(option.id, i)} className="p-2 bg-red-100 text-red-700 rounded"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setData({ ...data, travelOptions: [...data.travelOptions, { icon: 'car', title_en: '', title_hi: '', nearest_point_label_en: 'Nearest Point:', nearest_point_label_hi: '', nearest_point_value_en: '', nearest_point_value_hi: '', distance_label_en: 'Distance:', distance_label_hi: '', distance_value_en: '', distance_value_hi: '', travel_time_en: '', travel_time_hi: '', services_label_en: 'Services Available:', services_label_hi: '', servicesParagraphs: [] }]})} className="text-[#631012] font-medium text-sm flex items-center gap-1 hover:underline"><Plus size={16} /> Add Travel Option</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
