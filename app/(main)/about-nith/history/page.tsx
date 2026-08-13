'use client';

import React, { useState, useEffect } from 'react';
import { Save, History as HistoryIcon, Plus, Trash2, Calendar, FileText, Award, Loader2, Globe } from 'lucide-react';

interface TimelineEvent {
  id: number;
  year: string;
  title_en: string;
  title_hi: string;
  subtitle_en: string;
  subtitle_hi: string;
  event_date: string;
  description_en: string;
  description_hi: string;
}

interface HistoryData {
  heading: string;
  subtitle: string;
  introText: string;
  initialDepartments: string[];
  legacyTitle: string;
  legacyText: string;
}

type TabType = 'hero' | 'intro' | 'timeline' | 'legacy';
type LangType = 'en' | 'hi';

export default function HistoryPage() {
  const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/history`;

  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [lang, setLang] = useState<LangType>('en');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Store raw database row
  const [dbData, setDbData] = useState<any>(null);
  
  // Current edited form state
  const [historyData, setHistoryData] = useState<HistoryData>({
    heading: '', subtitle: '', introText: '', initialDepartments: [], legacyTitle: '', legacyText: ''
  });

  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  // When language changes, re-parse the form fields from dbData
  useEffect(() => {
    if (dbData) {
      parseDataForLang(dbData, lang);
    }
  }, [lang, dbData]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const mainRes = await fetch(API_BASE);
      if (!mainRes.ok) throw new Error('Failed to fetch main content');
      const mainData = await mainRes.json();
      setDbData(mainData);
      
      const timeRes = await fetch(`${API_BASE}/timeline`);
      const timeData = await timeRes.json();
      
      setTimelineEvents(Array.isArray(timeData) ? timeData.map((ev: any) => ({
        id: ev.id,
        year: ev.year ? ev.year.toString() : '',
        title_en: ev.title_en || '',
        title_hi: ev.title_hi || '',
        subtitle_en: ev.subtitle_en || '',
        subtitle_hi: ev.subtitle_hi || '',
        event_date: ev.event_date ? new Date(ev.event_date).toISOString().split('T')[0] : '',
        description_en: ev.description_en || '',
        description_hi: ev.description_hi || '',
      })) : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parseDataForLang = (data: any, currentLang: LangType) => {
    const desc1 = currentLang === 'en' ? data.description1_en : data.description1_hi;
    const desc2 = currentLang === 'en' ? data.description2_en : data.description2_hi;
    const leg = currentLang === 'en' ? data.legacy_en : data.legacy_hi;

    let heroData = { heading: '', subtitle: '' };
    try { heroData = JSON.parse(desc1 || '{}'); } catch { heroData = { heading: 'About NIT Hamirpur', subtitle: desc1 || '' }; }

    let introData = { text: '', departments: [] as string[] };
    try { introData = JSON.parse(desc2 || '{}'); } catch { introData = { text: desc2 || '', departments: [] }; }

    let legacyData = { title: '', text: '' };
    try { legacyData = JSON.parse(leg || '{}'); } catch { legacyData = { title: 'Our Legacy', text: leg || '' }; }

    setHistoryData({
      heading: heroData.heading || '',
      subtitle: heroData.subtitle || '',
      introText: introData.text || '',
      initialDepartments: introData.departments || [],
      legacyTitle: legacyData.title || '',
      legacyText: legacyData.text || ''
    });
  };

  const handleSaveMain = async () => {
    try {
      setSaving(true);
      const body = {
        lang,
        description1: JSON.stringify({ heading: historyData.heading, subtitle: historyData.subtitle }),
        description2: JSON.stringify({ text: historyData.introText, departments: historyData.initialDepartments }),
        legacy: JSON.stringify({ title: historyData.legacyTitle, text: historyData.legacyText }),
      };

      const res = await fetch(API_BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to save');
      await fetchData();
      alert(`Main content saved successfully in ${lang === 'en' ? 'English' : 'Hindi'}!`);
    } catch (err) {
      console.error(err);
      alert('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const addTimelineEvent = async () => {
    const newEvent = {
      lang: 'en',
      year: new Date().getFullYear(),
      title: 'New Event',
      subtitle: '',
      event_date: new Date().toISOString().split('T')[0],
      description: 'Event description',
    };
    try {
      const res = await fetch(`${API_BASE}/timeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      if (res.ok) fetchData();
    } catch {
      alert('Failed to add event');
    }
  };

  const removeTimelineEvent = async (id: number) => {
    if (!confirm('Delete this event?')) return;
    try {
      await fetch(`${API_BASE}/timeline/${id}`, { method: 'DELETE' });
      fetchData();
    } catch {
      alert('Failed to delete event');
    }
  };

  const updateTimelineLocal = (id: number, field: string, value: string) => {
    setTimelineEvents(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const saveTimelineEvent = async (id: number) => {
    const event = timelineEvents.find(e => e.id === id);
    if (!event) return;
    try {
      const res = await fetch(`${API_BASE}/timeline/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          year: parseInt(event.year) || 0,
          title: lang === 'en' ? event.title_en : event.title_hi,
          subtitle: lang === 'en' ? event.subtitle_en : event.subtitle_hi,
          event_date: event.event_date,
          description: lang === 'en' ? event.description_en : event.description_hi,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      alert(`Event updated in ${lang === 'en' ? 'English' : 'Hindi'}!`);
      fetchData();
    } catch {
      alert('Failed to update event');
    }
  };

  const addDepartment = () => setHistoryData(prev => ({ ...prev, initialDepartments: [...prev.initialDepartments, 'New Dept'] }));
  const updateDepartment = (index: number, val: string) => {
    const newDepts = [...historyData.initialDepartments];
    newDepts[index] = val;
    setHistoryData(prev => ({ ...prev, initialDepartments: newDepts }));
  };
  const removeDepartment = (index: number) => setHistoryData(prev => ({ ...prev, initialDepartments: prev.initialDepartments.filter((_, i) => i !== index) }));

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Section', icon: <FileText size={18} /> },
    { id: 'intro' as TabType, label: 'Introduction', icon: <FileText size={18} /> },
    { id: 'timeline' as TabType, label: 'Timeline', icon: <Calendar size={18} /> },
    { id: 'legacy' as TabType, label: 'Legacy', icon: <Award size={18} /> },
  ];

  if (loading && !dbData) return <div className="p-10 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-2 rounded-full text-[#631012]"><HistoryIcon className="w-6 h-6" /></div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">History Editor</h1>
              <p className="text-sm text-gray-500">Edit history content</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <Globe size={18} className="text-gray-500 ml-2" />
              <select value={lang} onChange={(e) => setLang(e.target.value as LangType)} className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer py-1 pr-4">
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>
            {activeTab !== 'timeline' && (
              <button onClick={handleSaveMain} disabled={saving} className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50">
                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} Save Content
              </button>
            )}
          </div>
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
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Main Heading</label>
                <input type="text" value={historyData.heading} onChange={e => setHistoryData({ ...historyData, heading: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#631012] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <textarea rows={2} value={historyData.subtitle} onChange={e => setHistoryData({ ...historyData, subtitle: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#631012] outline-none" />
              </div>
            </div>
          )}

          {activeTab === 'intro' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Introduction Text</label>
                <textarea rows={4} value={historyData.introText} onChange={e => setHistoryData({ ...historyData, introText: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#631012] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Initial Departments</label>
                {historyData.initialDepartments.map((dept, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input type="text" value={dept} onChange={e => updateDepartment(idx, e.target.value)} className="flex-1 p-2 border rounded focus:ring-2 focus:ring-[#631012] outline-none" />
                    <button onClick={() => removeDepartment(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                  </div>
                ))}
                <button onClick={addDepartment} className="text-[#631012] text-sm font-bold flex items-center gap-1 hover:underline"><Plus size={16} /> Add Department</button>
              </div>
            </div>
          )}

          {activeTab === 'legacy' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Legacy Title</label>
                <input type="text" value={historyData.legacyTitle} onChange={e => setHistoryData({ ...historyData, legacyTitle: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#631012] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Legacy Text</label>
                <textarea rows={6} value={historyData.legacyText} onChange={e => setHistoryData({ ...historyData, legacyText: e.target.value })} className="w-full p-2 border rounded focus:ring-2 focus:ring-[#631012] outline-none" />
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-bold">Timeline Events</h2>
                <button onClick={addTimelineEvent} className="bg-[#631012] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"><Plus size={16} /> Add Event</button>
              </div>
              <div className="space-y-4">
                {timelineEvents.map((event) => (
                  <div key={event.id} className="border p-4 rounded-lg bg-gray-50 relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => saveTimelineEvent(event.id)} className="text-green-600 hover:bg-green-100 p-2 rounded"><Save size={18} /></button>
                      <button onClick={() => removeTimelineEvent(event.id)} className="text-red-600 hover:bg-red-100 p-2 rounded"><Trash2 size={18} /></button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-3 pr-20">
                      <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Year</label><input type="number" value={event.year} onChange={e => updateTimelineLocal(event.id, 'year', e.target.value)} className="w-full p-2 border rounded text-sm outline-none" /></div>
                      <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Date</label><input type="date" value={event.event_date} onChange={e => updateTimelineLocal(event.id, 'event_date', e.target.value)} className="w-full p-2 border rounded text-sm outline-none" /></div>
                      <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Title</label><input type="text" value={lang === 'en' ? event.title_en : event.title_hi} onChange={e => updateTimelineLocal(event.id, `title_${lang}`, e.target.value)} className="w-full p-2 border rounded text-sm outline-none" /></div>
                    </div>
                    <div><label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Description</label><textarea rows={2} value={lang === 'en' ? event.description_en : event.description_hi} onChange={e => updateTimelineLocal(event.id, `description_${lang}`, e.target.value)} className="w-full p-2 border rounded text-sm outline-none" /></div>
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
