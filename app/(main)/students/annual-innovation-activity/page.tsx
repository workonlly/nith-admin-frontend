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
  BookOpen,
  HelpCircle
} from 'lucide-react';

interface FocusArea {
  id: number;
  focus_en: string;
  focus_hn: string;
}

interface ProgramOpportunity {
  id: number;
  program_en: string;
  program_hn: string;
}

interface JoinStep {
  id: number;
  step_order: number;
  step_en: string;
  step_hn: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  about_title_en: string;
  about_title_hn: string;
  about_desc1_en: string;
  about_desc1_hn: string;
  about_desc2_en: string;
  about_desc2_hn: string;
  focus_title_en: string;
  focus_title_hn: string;
  programs_title_en: string;
  programs_title_hn: string;
  join_title_en: string;
  join_title_hn: string;
  contact_email: string;
}

type TabType = 'hero' | 'focus' | 'programs' | 'join';

export default function AnnualInnovationActivityPage() {
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
    about_title_en: '',
    about_title_hn: '',
    about_desc1_en: '',
    about_desc1_hn: '',
    about_desc2_en: '',
    about_desc2_hn: '',
    focus_title_en: '',
    focus_title_hn: '',
    programs_title_en: '',
    programs_title_hn: '',
    join_title_en: '',
    join_title_hn: '',
    contact_email: '',
  });

  // Focus areas, programs, steps
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [programs, setPrograms] = useState<ProgramOpportunity[]>([]);
  const [joinSteps, setJoinSteps] = useState<JoinStep[]>([]);

  // Add / Edit states
  const [newFocus, setNewFocus] = useState({ focus_en: '', focus_hn: '' });
  const [editingFocusId, setEditingFocusId] = useState<number | null>(null);
  const [editingFocusData, setEditingFocusData] = useState({ focus_en: '', focus_hn: '' });

  const [newProgram, setNewProgram] = useState({ program_en: '', program_hn: '' });
  const [editingProgramId, setEditingProgramId] = useState<number | null>(null);
  const [editingProgramData, setEditingProgramData] = useState({ program_en: '', program_hn: '' });

  const [newStep, setNewStep] = useState({ step_order: 1, step_en: '', step_hn: '' });
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [editingStepData, setEditingStepData] = useState({ step_order: 1, step_en: '', step_hn: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Headings
      const headRes = await fetch(`${API_URL}/api/student-innovation`);
      if (headRes.ok) {
        const hData = await headRes.json();
        setHeadingData({
          title_en: hData.title_en || '',
          title_hn: hData.title_hn || '',
          sub_title_en: hData.sub_title_en || '',
          sub_title_hn: hData.sub_title_hn || '',
          about_title_en: hData.about_title_en || '',
          about_title_hn: hData.about_title_hn || '',
          about_desc1_en: hData.about_desc1_en || '',
          about_desc1_hn: hData.about_desc1_hn || '',
          about_desc2_en: hData.about_desc2_en || '',
          about_desc2_hn: hData.about_desc2_hn || '',
          focus_title_en: hData.focus_title_en || '',
          focus_title_hn: hData.focus_title_hn || '',
          programs_title_en: hData.programs_title_en || '',
          programs_title_hn: hData.programs_title_hn || '',
          join_title_en: hData.join_title_en || '',
          join_title_hn: hData.join_title_hn || '',
          contact_email: hData.contact_email || '',
        });
      }

      // 2. Fetch Focus Areas
      const focusRes = await fetch(`${API_URL}/api/student-innovation/focus`);
      if (focusRes.ok) {
        const fData = await focusRes.json();
        setFocusAreas(fData);
      }

      // 3. Fetch Programs
      const progRes = await fetch(`${API_URL}/api/student-innovation/programs`);
      if (progRes.ok) {
        const pData = await progRes.json();
        setPrograms(pData);
      }

      // 4. Fetch Steps
      const stepRes = await fetch(`${API_URL}/api/student-innovation/steps`);
      if (stepRes.ok) {
        const sData = await stepRes.json();
        setJoinSteps(sData);
      }
    } catch (err: any) {
      console.error('Error fetching Innovation Hub data:', err);
      setError('Failed to fetch Innovation data from server. Please verify backend status.');
    } finally {
      setLoading(false);
    }
  };

  // Save headings singleton
  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-innovation`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('Innovation Hub settings saved successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Focus Areas CRUD ---
  const handleAddFocus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFocus.focus_en.trim() || !newFocus.focus_hn.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/student-innovation/focus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFocus),
      });
      if (!res.ok) throw new Error('Failed to add focus area');
      const saved = await res.json();
      setFocusAreas([...focusAreas, saved]);
      setNewFocus({ focus_en: '', focus_hn: '' });
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleSaveFocusEdit = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/student-innovation/focus/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingFocusData),
      });
      if (!res.ok) throw new Error('Failed to update focus');
      const updated = await res.json();
      setFocusAreas(focusAreas.map(f => f.id === id ? updated : f));
      setEditingFocusId(null);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteFocus = async (id: number) => {
    if (!confirm('Are you sure you want to delete this focus area?')) return;
    try {
      await fetch(`${API_URL}/api/student-innovation/focus/${id}`, { method: 'DELETE' });
      setFocusAreas(focusAreas.filter(f => f.id !== id));
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // --- Programs CRUD ---
  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.program_en.trim() || !newProgram.program_hn.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/student-innovation/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgram),
      });
      if (!res.ok) throw new Error('Failed to add program');
      const saved = await res.json();
      setPrograms([...programs, saved]);
      setNewProgram({ program_en: '', program_hn: '' });
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleSaveProgramEdit = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/student-innovation/programs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProgramData),
      });
      if (!res.ok) throw new Error('Failed to update program');
      const updated = await res.json();
      setPrograms(programs.map(p => p.id === id ? updated : p));
      setEditingProgramId(null);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteProgram = async (id: number) => {
    if (!confirm('Are you sure you want to delete this program/opportunity?')) return;
    try {
      await fetch(`${API_URL}/api/student-innovation/programs/${id}`, { method: 'DELETE' });
      setPrograms(programs.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // --- Join Steps CRUD ---
  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStep.step_en.trim() || !newStep.step_hn.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/student-innovation/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStep),
      });
      if (!res.ok) throw new Error('Failed to add step');
      const saved = await res.json();
      setJoinSteps([...joinSteps, saved].sort((a, b) => a.step_order - b.step_order));
      setNewStep({ step_order: joinSteps.length + 2, step_en: '', step_hn: '' });
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleSaveStepEdit = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/api/student-innovation/steps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStepData),
      });
      if (!res.ok) throw new Error('Failed to update step');
      const updated = await res.json();
      setJoinSteps(joinSteps.map(s => s.id === id ? updated : s).sort((a, b) => a.step_order - b.step_order));
      setEditingStepId(null);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteStep = async (id: number) => {
    if (!confirm('Are you sure you want to delete this join step?')) return;
    try {
      await fetch(`${API_URL}/api/student-innovation/steps/${id}`, { method: 'DELETE' });
      setJoinSteps(joinSteps.filter(s => s.id !== id));
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero & About Info', icon: <FileText size={18} /> },
    { id: 'focus' as TabType, label: 'Focus Areas', icon: <Info size={18} /> },
    { id: 'programs' as TabType, label: 'Programs & Opportunities', icon: <BookOpen size={18} /> },
    { id: 'join' as TabType, label: 'How to Join Steps', icon: <HelpCircle size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Innovation Hub Dashboard...</p>
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
                Innovation Hub Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure Innovation Hub banners, descriptions, focused fields, and program opportunities bilingually.
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
          {/* TAB 1: HERO & ABOUT INFO */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Hero & Main Info Configuration</h3>
                <p className="text-sm text-gray-500">Edit headings, subheadings, and basic page texts in English and Hindi</p>
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
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sub Title / Banner Desc (Hindi)</label>
                  <textarea
                    value={headingData.sub_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div className="h-px bg-gray-150 md:col-span-2 my-2" />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Section Heading (English)</label>
                  <input
                    type="text"
                    value={headingData.about_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, about_title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Section Heading (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.about_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, about_title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Paragraph 1 (English)</label>
                  <textarea
                    value={headingData.about_desc1_en}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc1_en: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Paragraph 1 (Hindi)</label>
                  <textarea
                    value={headingData.about_desc1_hn}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc1_hn: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Paragraph 2 (English)</label>
                  <textarea
                    value={headingData.about_desc2_en}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc2_en: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Paragraph 2 (Hindi)</label>
                  <textarea
                    value={headingData.about_desc2_hn}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc2_hn: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div className="h-px bg-gray-150 md:col-span-2 my-2" />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Focus Areas Title (English)</label>
                  <input
                    type="text"
                    value={headingData.focus_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, focus_title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Focus Areas Title (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.focus_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, focus_title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Opportunities Title (English)</label>
                  <input
                    type="text"
                    value={headingData.programs_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, programs_title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Opportunities Title (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.programs_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, programs_title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">How to Join Title (English)</label>
                  <input
                    type="text"
                    value={headingData.join_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, join_title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">How to Join Title (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.join_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, join_title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Contact Email Address</label>
                  <input
                    type="email"
                    value={headingData.contact_email}
                    onChange={(e) => setHeadingData({ ...headingData, contact_email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>

              {/* Active Banner Preview */}
              <div className="mt-8 p-6 bg-gradient-to-br from-[#631012] to-[#800000] rounded-xl text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full mb-3 inline-block">LIVE BANNER PREVIEW</span>
                <h4 className="text-xl sm:text-2xl font-black">{headingData.title_en || 'INNOVATION HUB'}</h4>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">{headingData.sub_title_en || 'Innovation Hub projects...'}</p>
                <div className="h-px bg-white/10 my-4" />
                <h4 className="text-xl sm:text-2xl font-black">{headingData.title_hn || 'इनोवेशन हब'}</h4>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">{headingData.sub_title_hn || 'इनोवेशन हब...'}</p>
              </div>
            </div>
          )}

          {/* TAB 2: FOCUS AREAS */}
          {activeTab === 'focus' && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Focus Areas Directory</h3>
                <p className="text-sm text-gray-500">Edit the fields of dynamic technical prototyping and development areas bilingually</p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddFocus} className="bg-gray-50/50 border border-gray-200 p-6 rounded-xl space-y-4">
                <h4 className="font-bold text-gray-800 text-sm">Add New Focus Area</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Focus Area (English)</label>
                    <input
                      type="text"
                      value={newFocus.focus_en}
                      onChange={(e) => setNewFocus({ ...newFocus, focus_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. Design thinking and prototyping"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Focus Area (Hindi)</label>
                    <input
                      type="text"
                      value={newFocus.focus_hn}
                      onChange={(e) => setNewFocus({ ...newFocus, focus_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. डिज़ाइन थिंकिंग और प्रोटोटाइपिंग"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={15} /> Add Focus Area
                  </button>
                </div>
              </form>

              {/* List */}
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
                      <th className="p-4">Focus Area (English)</th>
                      <th className="p-4">Focus Area (Hindi)</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {focusAreas.map((act, idx) => (
                      <tr key={act.id} className="hover:bg-gray-50/50">
                        {editingFocusId === act.id ? (
                          <td colSpan={4} className="p-4 space-y-3 bg-gray-50/30">
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={editingFocusData.focus_en}
                                onChange={(e) => setEditingFocusData({ ...editingFocusData, focus_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                              />
                              <input
                                type="text"
                                value={editingFocusData.focus_hn}
                                onChange={(e) => setEditingFocusData({ ...editingFocusData, focus_hn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveFocusEdit(act.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold"
                              >
                                <Check size={14} /> Save
                              </button>
                              <button
                                onClick={() => setEditingFocusId(null)}
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
                              <div className="font-semibold text-gray-800 text-xs leading-relaxed">{act.focus_en}</div>
                            </td>
                            <td className="p-4 align-top">
                              <div className="font-semibold text-gray-600 text-xs leading-relaxed">{act.focus_hn}</div>
                            </td>
                            <td className="p-4 align-top text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setEditingFocusId(act.id);
                                    setEditingFocusData({ focus_en: act.focus_en, focus_hn: act.focus_hn });
                                  }}
                                  className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded-lg"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteFocus(act.id)}
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

          {/* TAB 3: PROGRAMS & OPPORTUNITIES */}
          {activeTab === 'programs' && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Opportunities & Programs</h3>
                <p className="text-sm text-gray-500">Edit bootcamps, maker-space access privileges and grant details bilingually</p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddProgram} className="bg-gray-50/50 border border-gray-200 p-6 rounded-xl space-y-4">
                <h4 className="font-bold text-gray-800 text-sm">Add New Program/Opportunity</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Opportunity (English)</label>
                    <input
                      type="text"
                      value={newProgram.program_en}
                      onChange={(e) => setNewProgram({ ...newProgram, program_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. Funding, grants and demo days"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Opportunity (Hindi)</label>
                    <input
                      type="text"
                      value={newProgram.program_hn}
                      onChange={(e) => setNewProgram({ ...newProgram, program_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. फंडिंग, अनुदान और प्रदर्शन दिवस"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={15} /> Add Program
                  </button>
                </div>
              </form>

              {/* List */}
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
                      <th className="p-4">Opportunity (English)</th>
                      <th className="p-4">Opportunity (Hindi)</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {programs.map((act, idx) => (
                      <tr key={act.id} className="hover:bg-gray-50/50">
                        {editingProgramId === act.id ? (
                          <td colSpan={4} className="p-4 space-y-3 bg-gray-50/30">
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={editingProgramData.program_en}
                                onChange={(e) => setEditingProgramData({ ...editingProgramData, program_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                              />
                              <input
                                type="text"
                                value={editingProgramData.program_hn}
                                onChange={(e) => setEditingProgramData({ ...editingProgramData, program_hn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveProgramEdit(act.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold"
                              >
                                <Check size={14} /> Save
                              </button>
                              <button
                                onClick={() => setEditingProgramId(null)}
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
                              <div className="font-semibold text-gray-800 text-xs leading-relaxed">{act.program_en}</div>
                            </td>
                            <td className="p-4 align-top">
                              <div className="font-semibold text-gray-600 text-xs leading-relaxed">{act.program_hn}</div>
                            </td>
                            <td className="p-4 align-top text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setEditingProgramId(act.id);
                                    setEditingProgramData({ program_en: act.program_en, program_hn: act.program_hn });
                                  }}
                                  className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded-lg"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProgram(act.id)}
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

          {/* TAB 4: HOW TO JOIN STEPS */}
          {activeTab === 'join' && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Registration & Joining Steps</h3>
                <p className="text-sm text-gray-500">Configure sequential stages of student onboarding in both English and Hindi</p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddStep} className="bg-gray-50/50 border border-gray-200 p-6 rounded-xl space-y-4">
                <h4 className="font-bold text-gray-800 text-sm">Add New Onboarding Step</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Step Order (Number)</label>
                    <input
                      type="number"
                      value={isNaN(newStep.step_order) ? '' : newStep.step_order}
                      onChange={(e) => setNewStep({ ...newStep, step_order: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Step (English)</label>
                    <input
                      type="text"
                      value={newStep.step_en}
                      onChange={(e) => setNewStep({ ...newStep, step_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="Attend the introductory session"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Step (Hindi)</label>
                    <input
                      type="text"
                      value={newStep.step_hn}
                      onChange={(e) => setNewStep({ ...newStep, step_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="परिचयात्मक सत्र में भाग लें"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={15} /> Add Onboarding Step
                  </button>
                </div>
              </form>

              {/* List */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-left table-fixed border-collapse text-sm">
                  <colgroup>
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '41%' }} />
                    <col style={{ width: '41%' }} />
                    <col style={{ width: '8%' }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase font-bold tracking-wider text-gray-500">
                      <th className="p-4">Order</th>
                      <th className="p-4">Step (English)</th>
                      <th className="p-4">Step (Hindi)</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {joinSteps.map((act) => (
                      <tr key={act.id} className="hover:bg-gray-50/50">
                        {editingStepId === act.id ? (
                          <td colSpan={4} className="p-4 space-y-3 bg-gray-50/30">
                            <div className="grid grid-cols-3 gap-4">
                              <input
                                type="number"
                                value={isNaN(editingStepData.step_order) ? '' : editingStepData.step_order}
                                onChange={(e) => setEditingStepData({ ...editingStepData, step_order: parseInt(e.target.value, 10) })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                              />
                              <div className="col-span-2">
                                <input
                                  type="text"
                                  value={editingStepData.step_en}
                                  onChange={(e) => setEditingStepData({ ...editingStepData, step_en: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                                />
                              </div>
                              <div className="col-span-3">
                                <input
                                  type="text"
                                  value={editingStepData.step_hn}
                                  onChange={(e) => setEditingStepData({ ...editingStepData, step_hn: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveStepEdit(act.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold"
                              >
                                <Check size={14} /> Save
                              </button>
                              <button
                                onClick={() => setEditingStepId(null)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs"
                              >
                                <X size={14} /> Cancel
                              </button>
                            </div>
                          </td>
                        ) : (
                          <>
                            <td className="p-4 align-top text-gray-500 font-semibold">Step {act.step_order}</td>
                            <td className="p-4 align-top">
                              <div className="font-semibold text-gray-800 text-xs leading-relaxed">{act.step_en}</div>
                            </td>
                            <td className="p-4 align-top">
                              <div className="font-semibold text-gray-600 text-xs leading-relaxed">{act.step_hn}</div>
                            </td>
                            <td className="p-4 align-top text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setEditingStepId(act.id);
                                    setEditingStepData({ step_order: act.step_order, step_en: act.step_en, step_hn: act.step_hn });
                                  }}
                                  className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded-lg"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteStep(act.id)}
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
