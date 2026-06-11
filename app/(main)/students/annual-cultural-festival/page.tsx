'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Sparkles,
  Plus,
  Trash2,
  FileText,
  Calendar,
  Star,
  Trophy,
  AlertCircle,
  Loader,
  Edit2,
  Check,
  X
} from 'lucide-react';

interface FestivalEvent {
  id: number;
  name_en: string;
  name_hn: string;
  category_en: string;
  category_hn: string;
  description_en: string;
  description_hn: string;
  prize_en: string;
  prize_hn: string;
  venue_en: string;
  venue_hn: string;
}

interface Highlight {
  id: number;
  highlight_en: string;
  highlight_hn: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  about_title_en: string;
  about_title_hn: string;
  about_desc_en: string;
  about_desc_hn: string;
  events_title_en: string;
  events_title_hn: string;
  events_sub_en: string;
  events_sub_hn: string;
  schedule_title_en: string;
  schedule_title_hn: string;
  schedule_desc_en: string;
  schedule_desc_hn: string;
  dates_en: string;
  dates_hn: string;
}

type TabType = 'hero' | 'about' | 'events' | 'schedule';

export default function AnnualCulturalFestivalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Singleton headings
  const [headingData, setHeadingData] = useState<HeadingData>({
    title_en: '',
    title_hn: '',
    sub_title_en: '',
    sub_title_hn: '',
    about_title_en: '',
    about_title_hn: '',
    about_desc_en: '',
    about_desc_hn: '',
    events_title_en: '',
    events_title_hn: '',
    events_sub_en: '',
    events_sub_hn: '',
    schedule_title_en: '',
    schedule_title_hn: '',
    schedule_desc_en: '',
    schedule_desc_hn: '',
    dates_en: '',
    dates_hn: '',
  });

  // Lists
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [events, setEvents] = useState<FestivalEvent[]>([]);

  // Add / Edit form states
  const [newHighlight, setNewHighlight] = useState({ highlight_en: '', highlight_hn: '' });
  const [editingHighlightId, setEditingHighlightId] = useState<number | null>(null);
  const [editingHighlightData, setEditingHighlightData] = useState({ highlight_en: '', highlight_hn: '' });

  const [newEvent, setNewEvent] = useState({
    name_en: '', name_hn: '',
    category_en: 'Music', category_hn: 'संगीत',
    description_en: '', description_hn: '',
    prize_en: '', prize_hn: '',
    venue_en: '', venue_hn: ''
  });
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editingEventData, setEditingEventData] = useState({
    name_en: '', name_hn: '',
    category_en: 'Music', category_hn: 'संगीत',
    description_en: '', description_hn: '',
    prize_en: '', prize_hn: '',
    venue_en: '', venue_hn: ''
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Headings
      const headRes = await fetch(`${API_URL}/api/student-hillfair`);
      if (headRes.ok) {
        const hData = await headRes.json();
        setHeadingData({
          title_en: hData.title_en || '',
          title_hn: hData.title_hn || '',
          sub_title_en: hData.sub_title_en || '',
          sub_title_hn: hData.sub_title_hn || '',
          about_title_en: hData.about_title_en || '',
          about_title_hn: hData.about_title_hn || '',
          about_desc_en: hData.about_desc_en || '',
          about_desc_hn: hData.about_desc_hn || '',
          events_title_en: hData.events_title_en || '',
          events_title_hn: hData.events_title_hn || '',
          events_sub_en: hData.events_sub_en || '',
          events_sub_hn: hData.events_sub_hn || '',
          schedule_title_en: hData.schedule_title_en || '',
          schedule_title_hn: hData.schedule_title_hn || '',
          schedule_desc_en: hData.schedule_desc_en || '',
          schedule_desc_hn: hData.schedule_desc_hn || '',
          dates_en: hData.dates_en || '',
          dates_hn: hData.dates_hn || '',
        });
      }

      // 2. Fetch Highlights
      const highRes = await fetch(`${API_URL}/api/student-hillfair/highlights`);
      if (highRes.ok) {
        const hiData = await highRes.json();
        setHighlights(hiData);
      }

      // 3. Fetch Events
      const evRes = await fetch(`${API_URL}/api/student-hillfair/events`);
      if (evRes.ok) {
        const eData = await evRes.json();
        setEvents(eData);
      }
    } catch (err: any) {
      console.error('Error fetching Hill\'ffair data:', err);
      setError('Failed to fetch festival data. Please ensure backend services are active.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-hillfair`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('Hill\'ffair page settings saved successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Highlights CRUD ---
  const handleAddHighlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHighlight.highlight_en.trim() || !newHighlight.highlight_hn.trim()) {
      alert('Please fill in both English and Hindi versions.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-hillfair/highlights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHighlight),
      });
      if (!res.ok) throw new Error('Failed to create highlight');
      const saved = await res.json();
      setHighlights([...highlights, saved]);
      setNewHighlight({ highlight_en: '', highlight_hn: '' });
      alert('Highlight added!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const startEditingHighlight = (hi: Highlight) => {
    setEditingHighlightId(hi.id);
    setEditingHighlightData({ highlight_en: hi.highlight_en, highlight_hn: hi.highlight_hn });
  };

  const handleSaveHighlightEdit = async (id: number) => {
    if (!editingHighlightData.highlight_en.trim() || !editingHighlightData.highlight_hn.trim()) {
      alert('Both fields are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-hillfair/highlights/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingHighlightData),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setHighlights(highlights.map(h => h.id === id ? updated : h));
      setEditingHighlightId(null);
      alert('Highlight updated successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteHighlight = async (id: number) => {
    if (!confirm('Are you sure you want to delete this highlight?')) return;
    try {
      await fetch(`${API_URL}/api/student-hillfair/highlights/${id}`, { method: 'DELETE' });
      setHighlights(highlights.filter(h => h.id !== id));
      alert('Deleted!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // --- Events CRUD ---
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.name_en.trim() || !newEvent.name_hn.trim() || !newEvent.description_en.trim() || !newEvent.description_hn.trim()) {
      alert('Bilingual Name and Description are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-hillfair/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      if (!res.ok) throw new Error('Failed to create event');
      const saved = await res.json();
      setEvents([...events, saved]);
      setNewEvent({
        name_en: '', name_hn: '',
        category_en: 'Music', category_hn: 'संगीत',
        description_en: '', description_hn: '',
        prize_en: '', prize_hn: '',
        venue_en: '', venue_hn: ''
      });
      alert('Festival event added successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const startEditingEvent = (e: FestivalEvent) => {
    setEditingEventId(e.id);
    setEditingEventData({
      name_en: e.name_en, name_hn: e.name_hn,
      category_en: e.category_en, category_hn: e.category_hn,
      description_en: e.description_en, description_hn: e.description_hn,
      prize_en: e.prize_en || '', prize_hn: e.prize_hn || '',
      venue_en: e.venue_en || '', venue_hn: e.venue_hn || ''
    });
  };

  const handleSaveEventEdit = async (id: number) => {
    if (!editingEventData.name_en.trim() || !editingEventData.description_en.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-hillfair/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEventData),
      });
      if (!res.ok) throw new Error('Failed to update event');
      const updated = await res.json();
      setEvents(events.map(e => e.id === id ? updated : e));
      setEditingEventId(null);
      alert('Event details updated successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await fetch(`${API_URL}/api/student-hillfair/events/${id}`, { method: 'DELETE' });
      setEvents(events.filter(e => e.id !== id));
      alert('Deleted!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const syncNewEventCategory = (catEn: string) => {
    const catsMapping: Record<string, string> = {
      'Music': 'संगीत',
      'Dance': 'नृत्य',
      'Theatre': 'रंगमंच',
      'Art': 'कला',
      'Fashion': 'फैशन',
      'Literary': 'साहित्यिक'
    };
    setNewEvent({
      ...newEvent,
      category_en: catEn,
      category_hn: catsMapping[catEn] || 'संगीत'
    });
  };

  const syncEditingEventCategory = (catEn: string) => {
    const catsMapping: Record<string, string> = {
      'Music': 'संगीत',
      'Dance': 'नृत्य',
      'Theatre': 'रंगमंच',
      'Art': 'कला',
      'Fashion': 'फैशन',
      'Literary': 'साहित्यिक'
    };
    setEditingEventData({
      ...editingEventData,
      category_en: catEn,
      category_hn: catsMapping[catEn] || 'संगीत'
    });
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Banner', icon: <FileText size={18} /> },
    { id: 'about' as TabType, label: 'About & Highlights', icon: <Star size={18} /> },
    { id: 'events' as TabType, label: 'Festival Events', icon: <Trophy size={18} /> },
    { id: 'schedule' as TabType, label: 'Schedule Config', icon: <Calendar size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Hill'ffair Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* 1. Page Title Header containing UNCONDITIONAL SAVE button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Hill'ffair Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure Hill'ffair annual cultural festival headings, highlights list, schedule, and events bilingually.
              </p>
            </div>
          </div>
          <button
            onClick={handleSavePageSettings}
            disabled={saving}
            className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-semibold shadow-sm hover:shadow active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Tabs Layout */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#631012] text-[#631012] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/70'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* TAB 1: HERO SECTION */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Hero Banner Configuration</h3>
                <p className="text-sm text-gray-500">Configure bilingually SGRC-style annual cultural festival headlines</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Heading (English)</label>
                  <input
                    type="text"
                    value={headingData.title_en}
                    onChange={(e) => setHeadingData({ ...headingData, title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Heading (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Hero Description (English)</label>
                  <textarea
                    value={headingData.sub_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Hero Description (Hindi)</label>
                  <textarea
                    value={headingData.sub_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT & HIGHLIGHTS */}
          {activeTab === 'about' && (
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="border-l-4 border-[#631012] pl-3 mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">About Overview</h3>
                  <p className="text-sm text-gray-500">Edit bilingually the detailed history and theme details of Hill'ffair</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Heading (English)</label>
                    <input
                      type="text"
                      value={headingData.about_title_en}
                      onChange={(e) => setHeadingData({ ...headingData, about_title_en: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Heading (Hindi)</label>
                    <input
                      type="text"
                      value={headingData.about_title_hn}
                      onChange={(e) => setHeadingData({ ...headingData, about_title_hn: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Narrative Description (English)</label>
                    <textarea
                      value={headingData.about_desc_en}
                      onChange={(e) => setHeadingData({ ...headingData, about_desc_en: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Narrative Description (Hindi)</label>
                    <textarea
                      value={headingData.about_desc_hn}
                      onChange={(e) => setHeadingData({ ...headingData, about_desc_hn: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Highlights CRUD */}
              <div className="border-t border-gray-100 pt-8 space-y-6">
                <div className="border-l-4 border-[#631012] pl-3 mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">Festival Highlights</h3>
                  <p className="text-sm text-gray-500">Configure bilingually high-impact bullet points demonstrating features of the festival</p>
                </div>

                <form onSubmit={handleAddHighlight} className="bg-gray-50/50 border border-gray-150 p-4 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">New Highlight (English)</label>
                      <input
                        type="text"
                        value={newHighlight.highlight_en}
                        onChange={(e) => setNewHighlight({ ...newHighlight, highlight_en: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white"
                        placeholder="Star Night performances..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">New Highlight (Hindi)</label>
                      <input
                        type="text"
                        value={newHighlight.highlight_hn}
                        onChange={(e) => setNewHighlight({ ...newHighlight, highlight_hn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white"
                        placeholder="स्टार नाइट प्रस्तुतियां..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Plus size={14} /> Add Highlight
                    </button>
                  </div>
                </form>

                <div className="space-y-3">
                  {highlights.map((hi, i) => (
                    <div key={hi.id} className="border border-gray-150 p-4 rounded-xl flex items-start justify-between gap-4">
                      {editingHighlightId === hi.id ? (
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={editingHighlightData.highlight_en}
                            onChange={(e) => setEditingHighlightData({ ...editingHighlightData, highlight_en: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900"
                          />
                          <input
                            type="text"
                            value={editingHighlightData.highlight_hn}
                            onChange={(e) => setEditingHighlightData({ ...editingHighlightData, highlight_hn: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => handleSaveHighlightEdit(hi.id)} className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded-lg flex items-center gap-1 text-xs">
                              <Check size={14} /> Save
                            </button>
                            <button onClick={() => setEditingHighlightId(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1.5 rounded-lg flex items-center gap-1 text-xs">
                              <X size={14} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-semibold text-gray-800 flex gap-2">
                            <span className="text-[#631012]">{i + 1}.</span>
                            <span>{hi.highlight_en}</span>
                          </p>
                          <p className="text-sm text-gray-500 pl-5">{hi.highlight_hn}</p>
                        </div>
                      )}
                      
                      {editingHighlightId !== hi.id && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEditingHighlight(hi)} className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded-lg">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteHighlight(hi.id)} className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FESTIVAL EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-8">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Competitions Directory</h3>
                <p className="text-sm text-gray-500">Configure bilingual details for student competitions including categories, prizes, and venues</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 pb-6 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Events Heading (English)</label>
                  <input
                    type="text"
                    value={headingData.events_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, events_title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Events Heading (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.events_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, events_title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Events Subtitle (English)</label>
                  <input
                    type="text"
                    value={headingData.events_sub_en}
                    onChange={(e) => setHeadingData({ ...headingData, events_sub_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Events Subtitle (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.events_sub_hn}
                    onChange={(e) => setHeadingData({ ...headingData, events_sub_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
              </div>

              {/* Add event form */}
              <form onSubmit={handleAddEvent} className="bg-gray-50/50 border border-gray-150 p-6 rounded-xl space-y-4">
                <h4 className="font-bold text-gray-800 text-sm">Add New Festival Event</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Event Name (English)</label>
                    <input
                      type="text"
                      value={newEvent.name_en}
                      onChange={(e) => setNewEvent({ ...newEvent, name_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. Battle of Bands"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Event Name (Hindi)</label>
                    <input
                      type="text"
                      value={newEvent.name_hn}
                      onChange={(e) => setNewEvent({ ...newEvent, name_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. बैटल ऑफ बैंड्स"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Category</label>
                    <select
                      value={newEvent.category_en}
                      onChange={(e) => syncNewEventCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900 focus:ring-1 focus:ring-[#631012]"
                    >
                      <option value="Music">Music (संगीत)</option>
                      <option value="Dance">Dance (नृत्य)</option>
                      <option value="Theatre">Theatre (रंगमंच)</option>
                      <option value="Art">Art (कला)</option>
                      <option value="Fashion">Fashion (फैशन)</option>
                      <option value="Literary">Literary (साहित्यिक)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Description (English)</label>
                    <input
                      type="text"
                      value={newEvent.description_en}
                      onChange={(e) => setNewEvent({ ...newEvent, description_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="Band competition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Description (Hindi)</label>
                    <input
                      type="text"
                      value={newEvent.description_hn}
                      onChange={(e) => setNewEvent({ ...newEvent, description_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="बैंड प्रतियोगिता"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Prize Worth (English)</label>
                    <input
                      type="text"
                      value={newEvent.prize_en}
                      onChange={(e) => setNewEvent({ ...newEvent, prize_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. ₹50,000"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Prize Worth (Hindi)</label>
                    <input
                      type="text"
                      value={newEvent.prize_hn}
                      onChange={(e) => setNewEvent({ ...newEvent, prize_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. ₹50,000"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Venue (English)</label>
                    <input
                      type="text"
                      value={newEvent.venue_en}
                      onChange={(e) => setNewEvent({ ...newEvent, venue_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. Main Stage"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Venue (Hindi)</label>
                    <input
                      type="text"
                      value={newEvent.venue_hn}
                      onChange={(e) => setNewEvent({ ...newEvent, venue_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. मुख्य मंच"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <Plus size={15} /> Add Competition Event
                  </button>
                </div>
              </form>

              {/* Events Directory Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-150">
                <table className="w-full text-left table-fixed border-collapse text-sm">
                  <colgroup>
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '10%' }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase font-bold tracking-wider text-gray-500">
                      <th className="p-4">Event Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Prize</th>
                      <th className="p-4">Venue</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150 bg-white">
                    {events.map((e) => (
                      <tr key={e.id} className="hover:bg-gray-50/40">
                        {editingEventId === e.id ? (
                          <td colSpan={6} className="p-4 space-y-3 bg-gray-50/45">
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={editingEventData.name_en}
                                onChange={(e) => setEditingEventData({ ...editingEventData, name_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Name (En)"
                              />
                              <input
                                type="text"
                                value={editingEventData.name_hn}
                                onChange={(e) => setEditingEventData({ ...editingEventData, name_hn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Name (Hn)"
                              />
                              <select
                                value={editingEventData.category_en}
                                onChange={(e) => syncEditingEventCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                              >
                                <option value="Music">Music</option>
                                <option value="Dance">Dance</option>
                                <option value="Theatre">Theatre</option>
                                <option value="Art">Art</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Literary">Literary</option>
                              </select>
                              <div className="col-span-2 grid grid-cols-2 gap-4">
                                <input
                                  type="text"
                                  value={editingEventData.description_en}
                                  onChange={(e) => setEditingEventData({ ...editingEventData, description_en: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                  placeholder="Description En"
                                />
                                <input
                                  type="text"
                                  value={editingEventData.description_hn}
                                  onChange={(e) => setEditingEventData({ ...editingEventData, description_hn: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                  placeholder="Description Hn"
                                />
                              </div>
                              <input
                                type="text"
                                value={editingEventData.prize_en}
                                onChange={(e) => setEditingEventData({ ...editingEventData, prize_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Prize (En)"
                              />
                              <input
                                type="text"
                                value={editingEventData.prize_hn}
                                onChange={(e) => setEditingEventData({ ...editingEventData, prize_hn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Prize (Hn)"
                              />
                              <input
                                type="text"
                                value={editingEventData.venue_en}
                                onChange={(e) => setEditingEventData({ ...editingEventData, venue_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Venue (En)"
                              />
                              <input
                                type="text"
                                value={editingEventData.venue_hn}
                                onChange={(e) => setEditingEventData({ ...editingEventData, venue_hn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Venue (Hn)"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleSaveEventEdit(e.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold">
                                <Check size={14} /> Save
                              </button>
                              <button onClick={() => setEditingEventId(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs">
                                <X size={14} /> Cancel
                              </button>
                            </div>
                          </td>
                        ) : (
                          <>
                            <td className="p-4 align-top">
                              <div className="font-semibold text-gray-800">{e.name_en}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{e.name_hn}</div>
                            </td>
                            <td className="p-4 align-top">
                              <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-gray-100 text-gray-700">
                                {e.category_en}
                              </span>
                              <div className="text-xs text-gray-500 mt-1 pl-1">{e.category_hn}</div>
                            </td>
                            <td className="p-4 align-top text-xs leading-relaxed text-gray-600">
                              <div>{e.description_en}</div>
                              <div className="text-gray-400 mt-0.5">{e.description_hn}</div>
                            </td>
                            <td className="p-4 align-top text-xs">
                              <div className="text-emerald-700 font-semibold">{e.prize_en || '—'}</div>
                              <div className="text-[11px] text-emerald-600 mt-0.5">{e.prize_hn || '—'}</div>
                            </td>
                            <td className="p-4 align-top text-xs text-gray-600 font-medium">
                              <div>{e.venue_en || '—'}</div>
                              <div className="text-gray-400 mt-0.5">{e.venue_hn || '—'}</div>
                            </td>
                            <td className="p-4 align-top text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => startEditingEvent(e)} className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded-lg">
                                  <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDeleteEvent(e.id)} className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded-lg">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SCHEDULE CONFIG */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Schedule & Calendar Config</h3>
                <p className="text-sm text-gray-500">Edit bilingually the schedule headings, dates, and promotional subtexts</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Schedule Heading (English)</label>
                  <input
                    type="text"
                    value={headingData.schedule_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, schedule_title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Schedule Heading (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.schedule_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, schedule_title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Dates Duration (English)</label>
                  <input
                    type="text"
                    value={headingData.dates_en}
                    onChange={(e) => setHeadingData({ ...headingData, dates_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Dates Duration (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.dates_hn}
                    onChange={(e) => setHeadingData({ ...headingData, dates_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Schedule Description (English)</label>
                  <textarea
                    value={headingData.schedule_desc_en}
                    onChange={(e) => setHeadingData({ ...headingData, schedule_desc_en: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Schedule Description (Hindi)</label>
                  <textarea
                    value={headingData.schedule_desc_hn}
                    onChange={(e) => setHeadingData({ ...headingData, schedule_desc_hn: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
