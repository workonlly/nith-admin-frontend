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
  X
} from 'lucide-react';

interface Activity {
  id: number;
  activity_en: string;
  activity_hn: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  about_desc1_en: string;
  about_desc1_hn: string;
  about_desc2_en: string;
  about_desc2_hn: string;
  activities_title_en: string;
  activities_title_hn: string;
}

type TabType = 'hero' | 'about' | 'list';

export default function AnnualTechnicalFestivalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Singleton headings data
  const [headingData, setHeadingData] = useState<HeadingData>({
    title_en: '',
    title_hn: '',
    sub_title_en: '',
    sub_title_hn: '',
    about_desc1_en: '',
    about_desc1_hn: '',
    about_desc2_en: '',
    about_desc2_hn: '',
    activities_title_en: '',
    activities_title_hn: '',
  });

  // Activities list
  const [activities, setActivities] = useState<Activity[]>([]);

  // Add / Edit form states
  const [newActivity, setNewActivity] = useState({
    activity_en: '',
    activity_hn: '',
  });
  
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);
  const [editingActivityData, setEditingActivityData] = useState({
    activity_en: '',
    activity_hn: '',
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
      const headRes = await fetch(`${API_URL}/api/student-nimbus`);
      if (headRes.ok) {
        const hData = await headRes.json();
        setHeadingData({
          title_en: hData.title_en || '',
          title_hn: hData.title_hn || '',
          sub_title_en: hData.sub_title_en || '',
          sub_title_hn: hData.sub_title_hn || '',
          about_desc1_en: hData.about_desc1_en || '',
          about_desc1_hn: hData.about_desc1_hn || '',
          about_desc2_en: hData.about_desc2_en || '',
          about_desc2_hn: hData.about_desc2_hn || '',
          activities_title_en: hData.activities_title_en || '',
          activities_title_hn: hData.activities_title_hn || '',
        });
      }

      // 2. Fetch Activities
      const actRes = await fetch(`${API_URL}/api/student-nimbus/activities`);
      if (actRes.ok) {
        const aData = await actRes.json();
        setActivities(aData);
      }
    } catch (err: any) {
      console.error('Error fetching Nimbus data:', err);
      setError('Failed to fetch Nimbus data from server. Please verify backend status.');
    } finally {
      setLoading(false);
    }
  };

  // Save headings singleton
  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-nimbus`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('Nimbus settings saved successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Activities CRUD ---
  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.activity_en.trim() || !newActivity.activity_hn.trim()) {
      alert('Key activity details in both English and Hindi are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-nimbus/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newActivity),
      });
      if (!res.ok) throw new Error('Failed to add activity');
      const saved = await res.json();
      setActivities([...activities, saved]);
      setNewActivity({
        activity_en: '',
        activity_hn: '',
      });
      alert('Key activity added successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const startEditingActivity = (act: Activity) => {
    setEditingActivityId(act.id);
    setEditingActivityData({
      activity_en: act.activity_en,
      activity_hn: act.activity_hn,
    });
  };

  const handleSaveActivityEdit = async (id: number) => {
    if (!editingActivityData.activity_en.trim() || !editingActivityData.activity_hn.trim()) {
      alert('Activity fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-nimbus/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingActivityData),
      });
      if (!res.ok) throw new Error('Failed to update activity');
      const updated = await res.json();
      setActivities(activities.map(a => a.id === id ? updated : a));
      setEditingActivityId(null);
      alert('Activity details updated successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    try {
      await fetch(`${API_URL}/api/student-nimbus/activities/${id}`, { method: 'DELETE' });
      setActivities(activities.filter(a => a.id !== id));
      alert('Deleted successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Banner', icon: <FileText size={18} /> },
    { id: 'about' as TabType, label: 'About Details', icon: <Info size={18} /> },
    { id: 'list' as TabType, label: 'Key Activities', icon: <List size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Nimbus Festival Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Upper header block containing unconditional SAVE button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Palette className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Nimbus Festival Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure Nimbus banner, about text details, and key festival activities bilingually.
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                <p className="text-sm text-gray-500">Edit major page headers and intro descriptions in English and Hindi</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Heading (English)</label>
                  <input
                    type="text"
                    value={headingData.title_en}
                    onChange={(e) => setHeadingData({ ...headingData, title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Heading (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sub Title / Banner Desc (English)</label>
                  <textarea
                    value={headingData.sub_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sub Title / Banner Desc (Hindi)</label>
                  <textarea
                    value={headingData.sub_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Active Banner Preview */}
              <div className="mt-8 p-6 bg-gradient-to-br from-[#631012] to-[#800000] rounded-xl text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full mb-3 inline-block">LIVE BANNER PREVIEW</span>
                <h4 className="text-xl sm:text-2xl font-black">{headingData.title_en || 'NIMBUS'}</h4>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">{headingData.sub_title_en || 'Nimbus technical festival...'}</p>
                <div className="h-px bg-white/10 my-4" />
                <h4 className="text-xl sm:text-2xl font-black">{headingData.title_hn || 'निम्बस'}</h4>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">{headingData.sub_title_hn || 'निम्बस तकनीकी उत्सव...'}</p>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT DETAILS */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">About Nimbus Activities</h3>
                <p className="text-sm text-gray-500">Edit the detailed information blocks about campus innovative technical fests</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Paragraph 1 (English)</label>
                  <textarea
                    value={headingData.about_desc1_en}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc1_en: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Paragraph 1 (Hindi)</label>
                  <textarea
                    value={headingData.about_desc1_hn}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc1_hn: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Paragraph 2 (English)</label>
                  <textarea
                    value={headingData.about_desc2_en}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc2_en: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Paragraph 2 (Hindi)</label>
                  <textarea
                    value={headingData.about_desc2_hn}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc2_hn: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Activities Title (English)</label>
                  <input
                    type="text"
                    value={headingData.activities_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, activities_title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Activities Title (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.activities_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, activities_title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KEY ACTIVITIES */}
          {activeTab === 'list' && (
            <div className="space-y-8">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Key Activities Directory</h3>
                <p className="text-sm text-gray-500">Manage the checklist of key technical activities and highlights bilingually</p>
              </div>

              {/* Add activity form */}
              <form onSubmit={handleAddActivity} className="bg-gray-50/50 border border-gray-200 p-6 rounded-xl space-y-4">
                <h4 className="font-bold text-gray-800 text-sm">Add New Key Activity</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Activity Description (English)</label>
                    <input
                      type="text"
                      value={newActivity.activity_en}
                      onChange={(e) => setNewActivity({ ...newActivity, activity_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. Departmental teams and technical societies"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Activity Description (Hindi)</label>
                    <input
                      type="text"
                      value={newActivity.activity_hn}
                      onChange={(e) => setNewActivity({ ...newActivity, activity_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. विभागीय टीमें और तकनीकी सोसाइटीज़"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={15} /> Add Activity
                  </button>
                </div>
              </form>

              {/* Activities list table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left table-fixed border-collapse text-sm">
                  <colgroup>
                    <col style={{ width: '8%' }} />
                    <col style={{ width: '42%' }} />
                    <col style={{ width: '42%' }} />
                    <col style={{ width: '8%' }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase font-bold tracking-wider text-gray-500">
                      <th className="p-4">#</th>
                      <th className="p-4">Activity (English)</th>
                      <th className="p-4">Activity (Hindi)</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {activities.map((act, idx) => (
                      <tr key={act.id} className="hover:bg-gray-50/50">
                        {editingActivityId === act.id ? (
                          <td colSpan={4} className="p-4 space-y-3 bg-gray-50/30">
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={editingActivityData.activity_en}
                                onChange={(e) => setEditingActivityData({ ...editingActivityData, activity_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                                placeholder="Activity Description (En)"
                              />
                              <input
                                type="text"
                                value={editingActivityData.activity_hn}
                                onChange={(e) => setEditingActivityData({ ...editingActivityData, activity_hn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                                placeholder="Activity Description (Hn)"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveActivityEdit(act.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold"
                              >
                                <Check size={14} /> Save
                              </button>
                              <button
                                onClick={() => setEditingActivityId(null)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs"
                              >
                                <X size={14} /> Cancel
                              </button>
                            </div>
                          </td>
                        ) : (
                          <>
                            <td className="p-4 align-top text-gray-500 font-semibold">{idx + 1}</td>
                            <td className="p-4 align-top">
                              <div className="font-semibold text-gray-800 text-xs leading-relaxed">{act.activity_en}</div>
                            </td>
                            <td className="p-4 align-top">
                              <div className="font-semibold text-gray-600 text-xs leading-relaxed">{act.activity_hn}</div>
                            </td>
                            <td className="p-4 align-top text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => startEditingActivity(act)}
                                  className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded-lg"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteActivity(act.id)}
                                  className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded-lg"
                                >
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
        </div>
      </div>
    </div>
  );
}
