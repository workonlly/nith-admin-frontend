'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Palette,
  Plus,
  Trash2,
  FileText,
  Info,
  List,
  AlertCircle,
  Loader,
  Edit2,
  Check,
  X,
  Trophy,
  Phone,
  ShieldAlert
} from 'lucide-react';

interface Facility {
  id: number;
  facility_en: string;
  facility_hn: string;
}

interface Event {
  id: number;
  event_en: string;
  event_hn: string;
}

interface Achievement {
  id: number;
  achievement_en: string;
  achievement_hn: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  intro_title_en: string;
  intro_title_hn: string;
  intro_desc_en: string;
  intro_desc_hn: string;
  facilities_title_en: string;
  facilities_title_hn: string;
  events_title_en: string;
  events_title_hn: string;
  achievements_title_en: string;
  achievements_title_hn: string;
  achievements_desc_en: string;
  achievements_desc_hn: string;
  contact_title_en: string;
  contact_title_hn: string;

  // Faculty Coordinator
  coord1_name_en: string;
  coord1_name_hn: string;
  coord1_role_en: string;
  coord1_role_hn: string;
  coord1_contact: string;
  coord1_email: string;

  // Sports Office
  coord2_name_en: string;
  coord2_name_hn: string;
  coord2_address_en: string;
  coord2_address_hn: string;
  coord2_contact: string;
  coord2_email: string;
}

type TabType = 'hero' | 'facilities' | 'events' | 'achievements';

export default function SportsIntroductionListPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Heading state
  const [headingData, setHeadingData] = useState<HeadingData>({
    title_en: '', title_hn: '',
    sub_title_en: '', sub_title_hn: '',
    intro_title_en: '', intro_title_hn: '',
    intro_desc_en: '', intro_desc_hn: '',
    facilities_title_en: '', facilities_title_hn: '',
    events_title_en: '', events_title_hn: '',
    achievements_title_en: '', achievements_title_hn: '',
    achievements_desc_en: '', achievements_desc_hn: '',
    contact_title_en: '', contact_title_hn: '',

    coord1_name_en: '', coord1_name_hn: '',
    coord1_role_en: '', coord1_role_hn: '',
    coord1_contact: '', coord1_email: '',

    coord2_name_en: '', coord2_name_hn: '',
    coord2_address_en: '', coord2_address_hn: '',
    coord2_contact: '', coord2_email: '',
  });

  // Dynamic Lists state
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // CRUD Forms state
  const [newFacility, setNewFacility] = useState({ facility_en: '', facility_hn: '' });
  const [editingFacilityId, setEditingFacilityId] = useState<number | null>(null);
  const [editingFacilityData, setEditingFacilityData] = useState({ facility_en: '', facility_hn: '' });

  const [newEvent, setNewEvent] = useState({ event_en: '', event_hn: '' });
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editingEventData, setEditingEventData] = useState({ event_en: '', event_hn: '' });

  const [newAchievement, setNewAchievement] = useState({ achievement_en: '', achievement_hn: '' });
  const [editingAchievementId, setEditingAchievementId] = useState<number | null>(null);
  const [editingAchievementData, setEditingAchievementData] = useState({ achievement_en: '', achievement_hn: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Heading Settings
      const headRes = await fetch(`${API_URL}/api/student-sports-intro`);
      if (headRes.ok) {
        const hData = await headRes.json();
        setHeadingData({
          title_en: hData.title_en || '',
          title_hn: hData.title_hn || '',
          sub_title_en: hData.sub_title_en || '',
          sub_title_hn: hData.sub_title_hn || '',
          intro_title_en: hData.intro_title_en || '',
          intro_title_hn: hData.intro_title_hn || '',
          intro_desc_en: hData.intro_desc_en || '',
          intro_desc_hn: hData.intro_desc_hn || '',
          facilities_title_en: hData.facilities_title_en || '',
          facilities_title_hn: hData.facilities_title_hn || '',
          events_title_en: hData.events_title_en || '',
          events_title_hn: hData.events_title_hn || '',
          achievements_title_en: hData.achievements_title_en || '',
          achievements_title_hn: hData.achievements_title_hn || '',
          achievements_desc_en: hData.achievements_desc_en || '',
          achievements_desc_hn: hData.achievements_desc_hn || '',
          contact_title_en: hData.contact_title_en || '',
          contact_title_hn: hData.contact_title_hn || '',

          coord1_name_en: hData.coord1_name_en || '',
          coord1_name_hn: hData.coord1_name_hn || '',
          coord1_role_en: hData.coord1_role_en || '',
          coord1_role_hn: hData.coord1_role_hn || '',
          coord1_contact: hData.coord1_contact || '',
          coord1_email: hData.coord1_email || '',

          coord2_name_en: hData.coord2_name_en || '',
          coord2_name_hn: hData.coord2_name_hn || '',
          coord2_address_en: hData.coord2_address_en || '',
          coord2_address_hn: hData.coord2_address_hn || '',
          coord2_contact: hData.coord2_contact || '',
          coord2_email: hData.coord2_email || '',
        });
      }

      // 2. Facilities
      const facRes = await fetch(`${API_URL}/api/student-sports-intro/facilities`);
      if (facRes.ok) {
        setFacilities(await facRes.json());
      }

      // 3. Events
      const evRes = await fetch(`${API_URL}/api/student-sports-intro/events`);
      if (evRes.ok) {
        setEvents(await evRes.json());
      }

      // 4. Achievements
      const achRes = await fetch(`${API_URL}/api/student-sports-intro/achievements`);
      if (achRes.ok) {
        setAchievements(await achRes.json());
      }
    } catch (err: any) {
      console.error('Error fetching Sports data:', err);
      setError('Failed to fetch sports information from backend. Check API status.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-sports-intro`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update Sports headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('Sports intro settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Facilities CRUD ---
  const handleAddFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacility.facility_en.trim() || !newFacility.facility_hn.trim()) {
      alert('Bilingual facility descriptions are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-sports-intro/facilities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFacility),
      });
      if (!res.ok) throw new Error('Failed to add facility');
      const saved = await res.json();
      setFacilities([...facilities, saved]);
      setNewFacility({ facility_en: '', facility_hn: '' });
      alert('Sports facility added!');
    } catch (err: any) {
      alert('Error adding facility: ' + err.message);
    }
  };

  const handleSaveFacilityEdit = async (id: number) => {
    if (!editingFacilityData.facility_en.trim() || !editingFacilityData.facility_hn.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-sports-intro/facilities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFacilityData),
      });
      if (!res.ok) throw new Error('Failed to update facility');
      const updated = await res.json();
      setFacilities(facilities.map(f => f.id === id ? updated : f));
      setEditingFacilityId(null);
      alert('Facility updated!');
    } catch (err: any) {
      alert('Error updating facility: ' + err.message);
    }
  };

  const handleDeleteFacility = async (id: number) => {
    if (!confirm('Are you sure you want to delete this facility?')) return;
    try {
      await fetch(`${API_URL}/api/student-sports-intro/facilities/${id}`, { method: 'DELETE' });
      setFacilities(facilities.filter(f => f.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  // --- Events CRUD ---
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.event_en.trim() || !newEvent.event_hn.trim()) {
      alert('Bilingual event titles are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-sports-intro/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      if (!res.ok) throw new Error('Failed to add event');
      const saved = await res.json();
      setEvents([...events, saved]);
      setNewEvent({ event_en: '', event_hn: '' });
      alert('Sports event added!');
    } catch (err: any) {
      alert('Error adding event: ' + err.message);
    }
  };

  const handleSaveEventEdit = async (id: number) => {
    if (!editingEventData.event_en.trim() || !editingEventData.event_hn.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-sports-intro/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingEventData),
      });
      if (!res.ok) throw new Error('Failed to update event');
      const updated = await res.json();
      setEvents(events.map(ev => ev.id === id ? updated : ev));
      setEditingEventId(null);
      alert('Event updated!');
    } catch (err: any) {
      alert('Error updating event: ' + err.message);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await fetch(`${API_URL}/api/student-sports-intro/events/${id}`, { method: 'DELETE' });
      setEvents(events.filter(ev => ev.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  // --- Achievements CRUD ---
  const handleAddAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchievement.achievement_en.trim() || !newAchievement.achievement_hn.trim()) {
      alert('Bilingual achievement descriptions are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-sports-intro/achievements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAchievement),
      });
      if (!res.ok) throw new Error('Failed to add achievement');
      const saved = await res.json();
      setAchievements([...achievements, saved]);
      setNewAchievement({ achievement_en: '', achievement_hn: '' });
      alert('Sports achievement added!');
    } catch (err: any) {
      alert('Error adding achievement: ' + err.message);
    }
  };

  const handleSaveAchievementEdit = async (id: number) => {
    if (!editingAchievementData.achievement_en.trim() || !editingAchievementData.achievement_hn.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-sports-intro/achievements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingAchievementData),
      });
      if (!res.ok) throw new Error('Failed to update achievement');
      const updated = await res.json();
      setAchievements(achievements.map(a => a.id === id ? updated : a));
      setEditingAchievementId(null);
      alert('Achievement updated!');
    } catch (err: any) {
      alert('Error updating achievement: ' + err.message);
    }
  };

  const handleDeleteAchievement = async (id: number) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;
    try {
      await fetch(`${API_URL}/api/student-sports-intro/achievements/${id}`, { method: 'DELETE' });
      setAchievements(achievements.filter(a => a.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero & Contacts', icon: <FileText size={18} /> },
    { id: 'facilities' as TabType, label: 'Sports Facilities', icon: <Info size={18} /> },
    { id: 'events' as TabType, label: 'Major Events', icon: <List size={18} /> },
    { id: 'achievements' as TabType, label: 'Achievements List', icon: <Trophy size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Sports Introduction Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Palette className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Sports Introduction Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure sports banner titles, about section, facilities list, achievements, and contact details bilingually.
              </p>
            </div>
          </div>

          <button
            onClick={handleSavePageSettings}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#631012] hover:bg-[#520d0f] active:scale-95 text-white font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 text-sm w-full sm:w-auto justify-center"
          >
            {saving ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Page Headers
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 p-3.5 bg-red-50 border-l-4 border-red-600 text-red-800 rounded-r-lg text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-white rounded-t-xl px-2 pt-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#631012] text-[#631012] bg-[#631012]/5 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Content */}
      <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 min-h-[400px]">
        
        {/* --- TAB 1: Hero & Contacts --- */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            {/* Live Header Preview */}
            <div className="bg-gradient-to-r from-[#631012] to-[#801416] p-6 rounded-xl text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
                <Palette className="w-64 h-64 text-white" />
              </div>
              <div className="relative z-10 space-y-2">
                <span className="text-xs uppercase bg-white/20 px-3 py-1 rounded-full font-semibold tracking-wider">
                  Live Banner Preview
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                  {headingData.title_en || 'Sports and Games Office'}
                </h2>
                <h3 className="text-lg font-medium text-white/90">
                  {headingData.title_hn || 'खेल और क्रीड़ा कार्यालय'}
                </h3>
                <p className="text-sm text-white/70 max-w-xl italic mt-1">
                  {headingData.sub_title_en || 'National Institute of Technology Hamirpur'}
                </p>
                <p className="text-xs text-white/50 max-w-xl italic">
                  {headingData.sub_title_hn || 'राष्ट्रीय प्रौद्योगिकी संस्थान हमीरपुर'}
                </p>
              </div>
            </div>

            {/* Bilingual Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* English Fields */}
              <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#631012]"></span>
                  English Content (EN)
                </h3>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Banner Title (EN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.title_en}
                    onChange={(e) => setHeadingData({ ...headingData, title_en: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Banner Subtitle (EN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.sub_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">About Intro Section Title (EN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.intro_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, intro_title_en: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">About Intro Paragraph Description (EN)</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.intro_desc_en}
                    onChange={(e) => setHeadingData({ ...headingData, intro_desc_en: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Facilities Subtitle (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.facilities_title_en}
                      onChange={(e) => setHeadingData({ ...headingData, facilities_title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Events Subtitle (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.events_title_en}
                      onChange={(e) => setHeadingData({ ...headingData, events_title_en: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">Faculty Coordinator (EN)</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Coordinator Name (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord1_name_en}
                      onChange={(e) => setHeadingData({ ...headingData, coord1_name_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Coordinator Role (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord1_role_en}
                      onChange={(e) => setHeadingData({ ...headingData, coord1_role_en: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">Sports Office (EN)</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Office Name (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord2_name_en}
                      onChange={(e) => setHeadingData({ ...headingData, coord2_name_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Office Location Address (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord2_address_en}
                      onChange={(e) => setHeadingData({ ...headingData, coord2_address_en: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">Contact Section Heading (EN)</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Contact Title (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.contact_title_en}
                      onChange={(e) => setHeadingData({ ...headingData, contact_title_en: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Hindi Fields */}
              <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Hindi Content (HN)
                </h3>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Banner Title (HN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, title_hn: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Banner Subtitle (HN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.sub_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">About Intro Section Title (HN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.intro_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, intro_title_hn: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">About Intro Paragraph Description (HN)</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.intro_desc_hn}
                    onChange={(e) => setHeadingData({ ...headingData, intro_desc_hn: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Facilities Subtitle (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.facilities_title_hn}
                      onChange={(e) => setHeadingData({ ...headingData, facilities_title_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Events Subtitle (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.events_title_hn}
                      onChange={(e) => setHeadingData({ ...headingData, events_title_hn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">Faculty Coordinator (HN)</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Coordinator Name (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord1_name_hn}
                      onChange={(e) => setHeadingData({ ...headingData, coord1_name_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Coordinator Role (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord1_role_hn}
                      onChange={(e) => setHeadingData({ ...headingData, coord1_role_hn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">Sports Office (HN)</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Office Name (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord2_name_hn}
                      onChange={(e) => setHeadingData({ ...headingData, coord2_name_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Office Location Address (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord2_address_hn}
                      onChange={(e) => setHeadingData({ ...headingData, coord2_address_hn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">संपर्क अनुभाग शीर्षक (HN)</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">संपर्क शीर्षक (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.contact_title_hn}
                      onChange={(e) => setHeadingData({ ...headingData, contact_title_hn: e.target.value })}
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Direct Contact Numbers & Email */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-150 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#631012]" />
                Direct Communication Coordinates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Faculty Coord Contact</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.coord1_contact}
                    onChange={(e) => setHeadingData({ ...headingData, coord1_contact: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Faculty Coord Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.coord1_email}
                    onChange={(e) => setHeadingData({ ...headingData, coord1_email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Sports Office Contact</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.coord2_contact}
                    onChange={(e) => setHeadingData({ ...headingData, coord2_contact: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Sports Office Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.coord2_email}
                    onChange={(e) => setHeadingData({ ...headingData, coord2_email: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: Facilities --- */}
        {activeTab === 'facilities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">
                Sports Facilities List ({facilities.length})
              </h3>
            </div>

            {/* Add New Facility Form */}
            <form onSubmit={handleAddFacility} className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Facility Description (EN)</label>
                <input
                  type="text"
                  placeholder="e.g. Standard 400m Athletic Track"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                  value={newFacility.facility_en}
                  onChange={(e) => setNewFacility({ ...newFacility, facility_en: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">सुविधा विवरण (HN)</label>
                <input
                  type="text"
                  placeholder="उदा. मानक 400 मीटर एथलेटिक ट्रैक"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                  value={newFacility.facility_hn}
                  onChange={(e) => setNewFacility({ ...newFacility, facility_hn: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#631012] hover:bg-[#520d0f] text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm h-[40px]"
              >
                <Plus className="w-4 h-4" /> Add Facility
              </button>
            </form>

            {/* List of Facilities */}
            <div className="space-y-3">
              {facilities.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No sports facilities listed yet. Add one above!
                </div>
              ) : (
                facilities.map((fac) => (
                  <div key={fac.id} className="p-4 border rounded-xl hover:shadow-sm transition-all flex items-center justify-between gap-4 bg-white">
                    {editingFacilityId === fac.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <input
                          type="text"
                          className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingFacilityData.facility_en}
                          onChange={(e) => setEditingFacilityData({ ...editingFacilityData, facility_en: e.target.value })}
                        />
                        <input
                          type="text"
                          className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingFacilityData.facility_hn}
                          onChange={(e) => setEditingFacilityData({ ...editingFacilityData, facility_hn: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-800">{fac.facility_en}</p>
                        <p className="text-xs text-gray-500">{fac.facility_hn}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {editingFacilityId === fac.id ? (
                        <>
                          <button
                            onClick={() => handleSaveFacilityEdit(fac.id)}
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg"
                            title="Save Changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingFacilityId(null)}
                            className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingFacilityId(fac.id);
                              setEditingFacilityData({ facility_en: fac.facility_en, facility_hn: fac.facility_hn });
                            }}
                            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFacility(fac.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* --- TAB 3: Events --- */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">
                Major Sports Events & Competitions ({events.length})
              </h3>
            </div>

            {/* Add New Event Form */}
            <form onSubmit={handleAddEvent} className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Event Title (EN)</label>
                <input
                  type="text"
                  placeholder="e.g. Annual Sports Meet"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                  value={newEvent.event_en}
                  onChange={(e) => setNewEvent({ ...newEvent, event_en: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">खेल आयोजन नाम (HN)</label>
                <input
                  type="text"
                  placeholder="उदा. वार्षिक खेलकूद प्रतियोगिता"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                  value={newEvent.event_hn}
                  onChange={(e) => setNewEvent({ ...newEvent, event_hn: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#631012] hover:bg-[#520d0f] text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm h-[40px]"
              >
                <Plus className="w-4 h-4" /> Add Event
              </button>
            </form>

            {/* List of Events */}
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No sports events registered yet. Add one above!
                </div>
              ) : (
                events.map((ev) => (
                  <div key={ev.id} className="p-4 border rounded-xl hover:shadow-sm transition-all flex items-center justify-between gap-4 bg-white">
                    {editingEventId === ev.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <input
                          type="text"
                          className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingEventData.event_en}
                          onChange={(e) => setEditingEventData({ ...editingEventData, event_en: e.target.value })}
                        />
                        <input
                          type="text"
                          className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingEventData.event_hn}
                          onChange={(e) => setEditingEventData({ ...editingEventData, event_hn: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-800">{ev.event_en}</p>
                        <p className="text-xs text-gray-500">{ev.event_hn}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {editingEventId === ev.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEventEdit(ev.id)}
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg"
                            title="Save Changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingEventId(null)}
                            className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingEventId(ev.id);
                              setEditingEventData({ event_en: ev.event_en, event_hn: ev.event_hn });
                            }}
                            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* --- TAB 4: Achievements --- */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            
            {/* Achievements Section Heading & Description */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5 uppercase">
                <Trophy className="w-4 h-4 text-[#631012]" />
                Section Description Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Section Title (EN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.achievements_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, achievements_title_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">अनुभाग शीर्षक (HN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.achievements_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, achievements_title_hn: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Notable Achievement Paragraph (EN)</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.achievements_desc_en}
                    onChange={(e) => setHeadingData({ ...headingData, achievements_desc_en: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Notable Achievement Paragraph (HN)</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.achievements_desc_hn}
                    onChange={(e) => setHeadingData({ ...headingData, achievements_desc_hn: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">
                Notable Accomplishments Directory ({achievements.length})
              </h3>
            </div>

            {/* Add New Achievement Form */}
            <form onSubmit={handleAddAchievement} className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Achievement Description (EN)</label>
                <input
                  type="text"
                  placeholder="e.g. Bronze in North Zone Inter-University TT"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                  value={newAchievement.achievement_en}
                  onChange={(e) => setNewAchievement({ ...newAchievement, achievement_en: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">उपलब्धि विवरण (HN)</label>
                <input
                  type="text"
                  placeholder="उदा. उत्तर क्षेत्र अंतर-विश्वविद्यालय टीटी में कांस्य पदक"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                  value={newAchievement.achievement_hn}
                  onChange={(e) => setNewAchievement({ ...newAchievement, achievement_hn: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#631012] hover:bg-[#520d0f] text-white font-semibold rounded-lg text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm h-[40px]"
              >
                <Plus className="w-4 h-4" /> Add Achievement
              </button>
            </form>

            {/* List of Achievements */}
            <div className="space-y-3">
              {achievements.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No achievements listed yet. Add one above!
                </div>
              ) : (
                achievements.map((ach) => (
                  <div key={ach.id} className="p-4 border rounded-xl hover:shadow-sm transition-all flex items-center justify-between gap-4 bg-white">
                    {editingAchievementId === ach.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                        <input
                          type="text"
                          className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingAchievementData.achievement_en}
                          onChange={(e) => setEditingAchievementData({ ...editingAchievementData, achievement_en: e.target.value })}
                        />
                        <input
                          type="text"
                          className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingAchievementData.achievement_hn}
                          onChange={(e) => setEditingAchievementData({ ...editingAchievementData, achievement_hn: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-800">{ach.achievement_en}</p>
                        <p className="text-xs text-gray-500">{ach.achievement_hn}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {editingAchievementId === ach.id ? (
                        <>
                          <button
                            onClick={() => handleSaveAchievementEdit(ach.id)}
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg"
                            title="Save Changes"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingAchievementId(null)}
                            className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingAchievementId(ach.id);
                              setEditingAchievementData({ achievement_en: ach.achievement_en, achievement_hn: ach.achievement_hn });
                            }}
                            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteAchievement(ach.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
