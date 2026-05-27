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
  Phone
} from 'lucide-react';

interface NssHeading {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  about_title_en: string;
  about_title_hn: string;
  about_desc_en: string;
  about_desc_hn: string;
  objective_title_en: string;
  objective_title_hn: string;
  activities_title_en: string;
  activities_title_hn: string;
  contact_title_en: string;
  contact_title_hn: string;
  coord_name_en: string;
  coord_name_hn: string;
  coord_email: string;
  coord_phone: string;
  coord_office_en: string;
  coord_office_hn: string;
  coord_hours_en: string;
  coord_hours_hn: string;
  calendar_url: string;
}

interface NssObjective {
  id: number;
  objective_en: string;
  objective_hn: string;
}

interface NssActivity {
  id: number;
  activity_en: string;
  activity_hn: string;
}

type TabType = 'hero' | 'objectives' | 'activities';

export default function NSSActivitiesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const DEFAULT_HEADING: NssHeading = {
    title_en: 'National Service Scheme (NSS)',
    title_hn: 'राष्ट्रीय सेवा योजना (एनएसएस)',
    sub_title_en: 'NSS encourages students to participate in community service and social outreach activities to foster social responsibility and leadership.',
    sub_title_hn: 'एनएसएस छात्रों को सामाजिक जिम्मेदारी और नेतृत्व को बढ़ावा देने के लिए सामुदायिक सेवा और सामाजिक आउटरीच गतिविधियों में भाग लेने के लिए प्रोत्साहित करता है।',
    about_title_en: 'About NSS',
    about_title_hn: 'एनएसएस के बारे में',
    about_desc_en: 'The National Service Scheme (NSS) is a public service program under the Ministry of Youth Affairs and Sports. NSS aims to develop students personality through community service and to inculcate social responsibility among youth.',
    about_desc_hn: 'राष्ट्रीय सेवा योजना (एनएसएस) युवा मामले और खेल मंत्रालय के तहत एक सार्वजनिक सेवा कार्यक्रम है। एनएसएस का उद्देश्य सामुदायिक सेवा के माध्यम से छात्रों के व्यक्तित्व का विकास करना और युवाओं में सामाजिक जिम्मेदारी की भावना पैदा करना है।',
    objective_title_en: 'Objective of NSS',
    objective_title_hn: 'एनएसएस का उद्देश्य',
    activities_title_en: 'NSS Regular Activities',
    activities_title_hn: 'एनएसएस की नियमित गतिविधियां',
    contact_title_en: 'Contact Us',
    contact_title_hn: 'संपर्क करें',
    coord_name_en: 'NSS Coordinator',
    coord_name_hn: 'एनएसएस समन्वयक',
    coord_email: 'nss-coordinator@nith.ac.in',
    coord_phone: '+91-00000-00000',
    coord_office_en: 'Student Affairs Building',
    coord_office_hn: 'छात्र कल्याण भवन',
    coord_hours_en: 'Mon-Fri 10:00-16:00',
    coord_hours_hn: 'सोम-शुक्र 10:00-16:00',
    calendar_url: '/student/welfare'
  };

  const DEFAULT_OBJECTIVES = [
    {
      objective_en: 'Developing student personality through community service.',
      objective_hn: 'सामुदायिक सेवा के माध्यम से छात्र व्यक्तित्व का विकास करना।'
    },
    {
      objective_en: 'Creating social awareness and leadership skills.',
      objective_hn: 'सामाजिक जागरूकता और नेतृत्व कौशल का निर्माण करना।'
    },
    {
      objective_en: 'Promoting national integration and social cohesion.',
      objective_hn: 'राष्ट्रीय एकीकरण और सामाजिक समरसता को बढ़ावा देना।'
    }
  ];

  const DEFAULT_ACTIVITIES = [
    {
      activity_en: 'Weekly community camps and outreach programs.',
      activity_hn: 'साप्ताहिक सामुदायिक शिविर और आउटरीच कार्यक्रम।'
    },
    {
      activity_en: 'Blood donation and health awareness camps.',
      activity_hn: 'रक्तदान और स्वास्थ्य जागरूकता शिविर।'
    },
    {
      activity_en: 'Environmental drives and cleanliness campaigns.',
      activity_hn: 'पर्यावरण अभियान और स्वच्छता अभियान।'
    },
    {
      activity_en: 'Skill-building workshops and training sessions.',
      activity_hn: 'कौशल-निर्माण कार्यशालाएं और प्रशिक्षण सत्र।'
    }
  ];

  // Singleton Heading state
  const [headingData, setHeadingData] = useState<NssHeading>({
    title_en: DEFAULT_HEADING.title_en,
    title_hn: DEFAULT_HEADING.title_hn,
    sub_title_en: DEFAULT_HEADING.sub_title_en,
    sub_title_hn: DEFAULT_HEADING.sub_title_hn,
    about_title_en: DEFAULT_HEADING.about_title_en,
    about_title_hn: DEFAULT_HEADING.about_title_hn,
    about_desc_en: DEFAULT_HEADING.about_desc_en,
    about_desc_hn: DEFAULT_HEADING.about_desc_hn,
    objective_title_en: DEFAULT_HEADING.objective_title_en,
    objective_title_hn: DEFAULT_HEADING.objective_title_hn,
    activities_title_en: DEFAULT_HEADING.activities_title_en,
    activities_title_hn: DEFAULT_HEADING.activities_title_hn,
    contact_title_en: DEFAULT_HEADING.contact_title_en,
    contact_title_hn: DEFAULT_HEADING.contact_title_hn,
    coord_name_en: DEFAULT_HEADING.coord_name_en,
    coord_name_hn: DEFAULT_HEADING.coord_name_hn,
    coord_email: DEFAULT_HEADING.coord_email,
    coord_phone: DEFAULT_HEADING.coord_phone,
    coord_office_en: DEFAULT_HEADING.coord_office_en,
    coord_office_hn: DEFAULT_HEADING.coord_office_hn,
    coord_hours_en: DEFAULT_HEADING.coord_hours_en,
    coord_hours_hn: DEFAULT_HEADING.coord_hours_hn,
    calendar_url: DEFAULT_HEADING.calendar_url
  });

  // Dynamic Lists state
  const [objectives, setObjectives] = useState<NssObjective[]>([]);
  const [activities, setActivities] = useState<NssActivity[]>([]);

  // CRUD Form states - Objectives
  const [newObjective, setNewObjective] = useState({ objective_en: '', objective_hn: '' });
  const [editingObjectiveId, setEditingObjectiveId] = useState<number | null>(null);
  const [editingObjectiveData, setEditingObjectiveData] = useState({ objective_en: '', objective_hn: '' });

  // CRUD Form states - Activities
  const [newActivity, setNewActivity] = useState({ activity_en: '', activity_hn: '' });
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);
  const [editingActivityData, setEditingActivityData] = useState({ activity_en: '', activity_hn: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Heading Settings
      const headRes = await fetch(`${API_URL}/api/student-nss`);
      if (headRes.ok) {
        const hData = await headRes.json();
        if (hData && Object.keys(hData).length > 0) {
          setHeadingData({
            title_en: hData.title_en || DEFAULT_HEADING.title_en,
            title_hn: hData.title_hn || DEFAULT_HEADING.title_hn,
            sub_title_en: hData.sub_title_en || DEFAULT_HEADING.sub_title_en,
            sub_title_hn: hData.sub_title_hn || DEFAULT_HEADING.sub_title_hn,
            about_title_en: hData.about_title_en || DEFAULT_HEADING.about_title_en,
            about_title_hn: hData.about_title_hn || DEFAULT_HEADING.about_title_hn,
            about_desc_en: hData.about_desc_en || DEFAULT_HEADING.about_desc_en,
            about_desc_hn: hData.about_desc_hn || DEFAULT_HEADING.about_desc_hn,
            objective_title_en: hData.objective_title_en || DEFAULT_HEADING.objective_title_en,
            objective_title_hn: hData.objective_title_hn || DEFAULT_HEADING.objective_title_hn,
            activities_title_en: hData.activities_title_en || DEFAULT_HEADING.activities_title_en,
            activities_title_hn: hData.activities_title_hn || DEFAULT_HEADING.activities_title_hn,
            contact_title_en: hData.contact_title_en || DEFAULT_HEADING.contact_title_en,
            contact_title_hn: hData.contact_title_hn || DEFAULT_HEADING.contact_title_hn,
            coord_name_en: hData.coord_name_en || DEFAULT_HEADING.coord_name_en,
            coord_name_hn: hData.coord_name_hn || DEFAULT_HEADING.coord_name_hn,
            coord_email: hData.coord_email || DEFAULT_HEADING.coord_email,
            coord_phone: hData.coord_phone || DEFAULT_HEADING.coord_phone,
            coord_office_en: hData.coord_office_en || DEFAULT_HEADING.coord_office_en,
            coord_office_hn: hData.coord_office_hn || DEFAULT_HEADING.coord_office_hn,
            coord_hours_en: hData.coord_hours_en || DEFAULT_HEADING.coord_hours_en,
            coord_hours_hn: hData.coord_hours_hn || DEFAULT_HEADING.coord_hours_hn,
            calendar_url: hData.calendar_url || DEFAULT_HEADING.calendar_url
          });
        }
      }

      // 2. Objectives
      const objRes = await fetch(`${API_URL}/api/student-nss/objectives`);
      if (objRes.ok) {
        const oData = await objRes.json();
        if (oData.length === 0) {
          for (const item of DEFAULT_OBJECTIVES) {
            await fetch(`${API_URL}/api/student-nss/objectives`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            });
          }
          const objRes2 = await fetch(`${API_URL}/api/student-nss/objectives`);
          setObjectives(await objRes2.json());
        } else {
          setObjectives(oData);
        }
      }

      // 3. Activities
      const actRes = await fetch(`${API_URL}/api/student-nss/activities`);
      if (actRes.ok) {
        const aData = await actRes.json();
        if (aData.length === 0) {
          for (const item of DEFAULT_ACTIVITIES) {
            await fetch(`${API_URL}/api/student-nss/activities`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            });
          }
          const actRes2 = await fetch(`${API_URL}/api/student-nss/activities`);
          setActivities(await actRes2.json());
        } else {
          setActivities(aData);
        }
      }
    } catch (err: any) {
      console.error('Error fetching NSS data:', err);
      setError('Failed to fetch NSS details from backend. Check API status.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-nss`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update NSS headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('NSS banner and about settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Objectives CRUD ---
  const handleAddObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjective.objective_en.trim() || !newObjective.objective_hn.trim()) {
      alert('Bilingual objective fields are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-nss/objectives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newObjective),
      });
      if (!res.ok) throw new Error('Failed to add objective');
      const saved = await res.json();
      setObjectives([...objectives, saved]);
      setNewObjective({ objective_en: '', objective_hn: '' });
      alert('Objective added!');
    } catch (err: any) {
      alert('Error adding objective: ' + err.message);
    }
  };

  const handleSaveObjectiveEdit = async (id: number) => {
    if (!editingObjectiveData.objective_en.trim() || !editingObjectiveData.objective_hn.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-nss/objectives/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingObjectiveData),
      });
      if (!res.ok) throw new Error('Failed to update objective');
      const updated = await res.json();
      setObjectives(objectives.map(o => o.id === id ? updated : o));
      setEditingObjectiveId(null);
      alert('Objective updated!');
    } catch (err: any) {
      alert('Error updating objective: ' + err.message);
    }
  };

  const handleDeleteObjective = async (id: number) => {
    if (!confirm('Are you sure you want to delete this objective?')) return;
    try {
      await fetch(`${API_URL}/api/student-nss/objectives/${id}`, { method: 'DELETE' });
      setObjectives(objectives.filter(o => o.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  // --- Activities CRUD ---
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.activity_en.trim() || !newActivity.activity_hn.trim()) {
      alert('Bilingual activity descriptions are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-nss/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity),
      });
      if (!res.ok) throw new Error('Failed to add activity');
      const saved = await res.json();
      setActivities([...activities, saved]);
      setNewActivity({ activity_en: '', activity_hn: '' });
      alert('Activity added!');
    } catch (err: any) {
      alert('Error adding activity: ' + err.message);
    }
  };

  const handleSaveActivityEdit = async (id: number) => {
    if (!editingActivityData.activity_en.trim() || !editingActivityData.activity_hn.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-nss/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingActivityData),
      });
      if (!res.ok) throw new Error('Failed to update activity');
      const updated = await res.json();
      setActivities(activities.map(a => a.id === id ? updated : a));
      setEditingActivityId(null);
      alert('Activity updated!');
    } catch (err: any) {
      alert('Error updating activity: ' + err.message);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    if (!confirm('Are you sure you want to delete this activity item?')) return;
    try {
      await fetch(`${API_URL}/api/student-nss/activities/${id}`, { method: 'DELETE' });
      setActivities(activities.filter(a => a.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero & Contacts', icon: <FileText size={18} /> },
    { id: 'objectives' as TabType, label: 'NSS Objectives', icon: <Info size={18} /> },
    { id: 'activities' as TabType, label: 'Regular Activities', icon: <List size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading NSS Activities Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Palette className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                NSS Activities Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure NSS banner titles, about descriptors, objectives, activities list, and contact details bilingually.
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
            Save Page Headings
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

      {/* Tab Contents */}
      <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 min-h-[400px]">
        {/* --- HERO TAB --- */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#631012] to-[#801416] p-6 rounded-xl text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <span className="text-xs uppercase bg-white/20 px-3 py-1 rounded-full font-semibold tracking-wider">
                  Live Banner Preview
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                  {headingData.title_en || 'National Service Scheme (NSS)'}
                </h2>
                <h3 className="text-lg font-medium text-white/95">
                  {headingData.title_hn || 'राष्ट्रीय सेवा योजना (एनएसएस)'}
                </h3>
                <p className="text-sm text-white/70 max-w-xl italic mt-1">
                  {headingData.sub_title_en || 'Fostering social responsibility.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English */}
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
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.sub_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">About NSS Section Title (EN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.about_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, about_title_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">About NSS Description (EN)</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012] whitespace-pre-wrap"
                    value={headingData.about_desc_en}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc_en: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Objectives Subtitle (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.objective_title_en}
                      onChange={(e) => setHeadingData({ ...headingData, objective_title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Activities Subtitle (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.activities_title_en}
                      onChange={(e) => setHeadingData({ ...headingData, activities_title_en: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">Coordinator & Office (EN)</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Coordinator Name (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord_name_en}
                      onChange={(e) => setHeadingData({ ...headingData, coord_name_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Office Building Location (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord_office_en}
                      onChange={(e) => setHeadingData({ ...headingData, coord_office_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Office Hours (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord_hours_en}
                      onChange={(e) => setHeadingData({ ...headingData, coord_hours_en: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Hindi */}
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
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.sub_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">About NSS Section Title (HN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.about_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, about_title_hn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">About NSS Description (HN)</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012] whitespace-pre-wrap"
                    value={headingData.about_desc_hn}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc_hn: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Objectives Subtitle (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.objective_title_hn}
                      onChange={(e) => setHeadingData({ ...headingData, objective_title_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Activities Subtitle (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.activities_title_hn}
                      onChange={(e) => setHeadingData({ ...headingData, activities_title_hn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">समन्वयक और कार्यालय (HN)</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">समन्वयक का नाम (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord_name_hn}
                      onChange={(e) => setHeadingData({ ...headingData, coord_name_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">कार्यालय का स्थान (Building) (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord_office_hn}
                      onChange={(e) => setHeadingData({ ...headingData, coord_office_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">कार्यालय समय (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.coord_hours_hn}
                      onChange={(e) => setHeadingData({ ...headingData, coord_hours_hn: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Communication & Link details */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-150 mt-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#631012]" />
                Direct Communication Coordinates & Link URLs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Coordinator Phone</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.coord_phone}
                    onChange={(e) => setHeadingData({ ...headingData, coord_phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Coordinator Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.coord_email}
                    onChange={(e) => setHeadingData({ ...headingData, coord_email: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Activities Calendar URL</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.calendar_url}
                    onChange={(e) => setHeadingData({ ...headingData, calendar_url: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- OBJECTIVES TAB --- */}
        {activeTab === 'objectives' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">NSS Key Objectives</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {objectives.length} Objectives
              </span>
            </div>

            {/* List */}
            <div className="space-y-3">
              {objectives.map((obj) => (
                <div key={obj.id} className="p-4 border rounded-xl bg-gray-50/50 flex items-center justify-between gap-4">
                  {editingObjectiveId === obj.id ? (
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">Objective (EN)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingObjectiveData.objective_en}
                          onChange={(e) => setEditingObjectiveData({ ...editingObjectiveData, objective_en: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">Objective (HN)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingObjectiveData.objective_hn}
                          onChange={(e) => setEditingObjectiveData({ ...editingObjectiveData, objective_hn: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-gray-800">{obj.objective_en}</p>
                      <p className="text-xs text-gray-500">{obj.objective_hn}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 justify-end">
                    {editingObjectiveId === obj.id ? (
                      <>
                        <button
                          onClick={() => handleSaveObjectiveEdit(obj.id)}
                          className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingObjectiveId(null)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingObjectiveId(obj.id);
                            setEditingObjectiveData({
                              objective_en: obj.objective_en,
                              objective_hn: obj.objective_hn
                            });
                          }}
                          className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteObjective(obj.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Form */}
            <form onSubmit={handleAddObjective} className="p-5 border rounded-xl bg-gray-50/30 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Plus size={16} /> Add New Objective
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Objective Point (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. Developing student personality through community service."
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newObjective.objective_en}
                    onChange={(e) => setNewObjective({ ...newObjective, objective_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Objective Point (HN)</label>
                  <input
                    type="text"
                    placeholder="e.g. सामुदायिक सेवा के माध्यम से छात्र व्यक्तित्व का विकास करना।"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newObjective.objective_hn}
                    onChange={(e) => setNewObjective({ ...newObjective, objective_hn: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#631012] hover:bg-[#520d0f] text-white font-medium text-sm rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={16} /> Add Objective
              </button>
            </form>
          </div>
        )}

        {/* --- ACTIVITIES TAB --- */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">Regular Outreach Activities</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {activities.length} Activities
              </span>
            </div>

            {/* List */}
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="p-4 border rounded-xl bg-gray-50/50 flex items-center justify-between gap-4">
                  {editingActivityId === act.id ? (
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">Activity (EN)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingActivityData.activity_en}
                          onChange={(e) => setEditingActivityData({ ...editingActivityData, activity_en: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">Activity (HN)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingActivityData.activity_hn}
                          onChange={(e) => setEditingActivityData({ ...editingActivityData, activity_hn: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-gray-800">{act.activity_en}</p>
                      <p className="text-xs text-gray-500">{act.activity_hn}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 justify-end">
                    {editingActivityId === act.id ? (
                      <>
                        <button
                          onClick={() => handleSaveActivityEdit(act.id)}
                          className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingActivityId(null)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingActivityId(act.id);
                            setEditingActivityData({
                              activity_en: act.activity_en,
                              activity_hn: act.activity_hn
                            });
                          }}
                          className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteActivity(act.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Form */}
            <form onSubmit={handleAddActivity} className="p-5 border rounded-xl bg-gray-50/30 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Plus size={16} /> Add New Activity
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Activity Description (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. Weekly community camps and outreach programs."
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newActivity.activity_en}
                    onChange={(e) => setNewActivity({ ...newActivity, activity_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Activity Description (HN)</label>
                  <input
                    type="text"
                    placeholder="e.g. साप्ताहिक सामुदायिक शिविर और आउटरीच कार्यक्रम।"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newActivity.activity_hn}
                    onChange={(e) => setNewActivity({ ...newActivity, activity_hn: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#631012] hover:bg-[#520d0f] text-white font-medium text-sm rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={16} /> Add Activity
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
