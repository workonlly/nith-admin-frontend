'use client';

import React, { useState, useEffect } from 'react';
import {
  Target,
  Zap,
  TrendingUp,
  Award,
  Plus,
  Edit2,
  Trash2,
  Save,
  RefreshCw,
  Layout,
  CheckCircle2,
  X,
  Compass,
} from 'lucide-react';

interface GoalItem {
  id: number;
  icon: string;
  title_en: string;
  title_hi: string;
  text_en: string;
  text_hi: string;
  stats_label_en: string;
  stats_label_hi: string;
  stats_value: string;
}

interface RoadmapItem {
  id: number;
  year: string;
  title_en: string;
  title_hi: string;
  focus_en: string;
  focus_hi: string;
}

interface PageData {
  hero_heading_en: string;
  hero_heading_hi: string;
  hero_description_en: string;
  hero_description_hi: string;
  goals_heading_en: string;
  goals_heading_hi: string;
  strategy_heading_en: string;
  strategy_heading_hi: string;
  strategy_description_en: string;
  strategy_description_hi: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const ICON_OPTIONS = [
  { label: 'Target (Ranking / Benchmark)', value: 'Target' },
  { label: 'Zap (Green & Clean Energy)', value: 'Zap' },
  { label: 'TrendingUp (Research & Computing)', value: 'TrendingUp' },
  { label: 'Award (Patents & Startups)', value: 'Award' },
];

export default function GoalsAdminPage() {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([]);
  const [pageData, setPageData] = useState<PageData>({
    hero_heading_en: '',
    hero_heading_hi: '',
    hero_description_en: '',
    hero_description_hi: '',
    goals_heading_en: '',
    goals_heading_hi: '',
    strategy_heading_en: '',
    strategy_heading_hi: '',
    strategy_description_en: '',
    strategy_description_hi: '',
  });

  const [loading, setLoading] = useState(true);
  const [savingPage, setSavingPage] = useState(false);
  const [activeTab, setActiveTab] = useState<'goals' | 'roadmap' | 'page'>('goals');

  // Modal states
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<number | null>(null);
  const [formIcon, setFormIcon] = useState('Target');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleHi, setFormTitleHi] = useState('');
  const [formTextEn, setFormTextEn] = useState('');
  const [formTextHi, setFormTextHi] = useState('');
  const [formStatsLabelEn, setFormStatsLabelEn] = useState('');
  const [formStatsLabelHi, setFormStatsLabelHi] = useState('');
  const [formStatsValue, setFormStatsValue] = useState('');

  // Roadmap Modal
  const [roadmapModalOpen, setRoadmapModalOpen] = useState(false);
  const [editingRoadmapId, setEditingRoadmapId] = useState<number | null>(null);
  const [formYear, setFormYear] = useState('');
  const [formRoadmapTitleEn, setFormRoadmapTitleEn] = useState('');
  const [formRoadmapTitleHi, setFormRoadmapTitleHi] = useState('');
  const [formFocusEn, setFormFocusEn] = useState('');
  const [formFocusHi, setFormFocusHi] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/goals`);
      const json = await res.json();
      if (json.success) {
        setGoals(json.goals || json.data || []);
        setRoadmaps(json.roadmaps || []);
        if (json.page && json.page.hero_heading_en) {
          setPageData({
            hero_heading_en: json.page.hero_heading_en || '',
            hero_heading_hi: json.page.hero_heading_hi || '',
            hero_description_en: json.page.hero_description_en || '',
            hero_description_hi: json.page.hero_description_hi || '',
            goals_heading_en: json.page.goals_heading_en || '',
            goals_heading_hi: json.page.goals_heading_hi || '',
            strategy_heading_en: json.page.strategy_heading_en || '',
            strategy_heading_hi: json.page.strategy_heading_hi || '',
            strategy_description_en: json.page.strategy_description_en || '',
            strategy_description_hi: json.page.strategy_description_hi || '',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePage = async () => {
    try {
      setSavingPage(true);
      const res = await fetch(`${API_BASE}/goals/page`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });
      if (res.ok) {
        alert('Goals page settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings');
    } finally {
      setSavingPage(false);
    }
  };

  // GOALS CRUD
  const openAddGoalModal = () => {
    setEditingGoalId(null);
    setFormIcon('Target');
    setFormTitleEn('');
    setFormTitleHi('');
    setFormTextEn('');
    setFormTextHi('');
    setFormStatsLabelEn('Target Metric');
    setFormStatsLabelHi('लक्ष्य मीट्रिक');
    setFormStatsValue('');
    setGoalModalOpen(true);
  };

  const openEditGoalModal = (item: GoalItem) => {
    setEditingGoalId(item.id);
    setFormIcon(item.icon || 'Target');
    setFormTitleEn(item.title_en || '');
    setFormTitleHi(item.title_hi || '');
    setFormTextEn(item.text_en || '');
    setFormTextHi(item.text_hi || '');
    setFormStatsLabelEn(item.stats_label_en || '');
    setFormStatsLabelHi(item.stats_label_hi || '');
    setFormStatsValue(item.stats_value || '');
    setGoalModalOpen(true);
  };

  const handleSubmitGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        icon: formIcon,
        title_en: formTitleEn,
        title_hi: formTitleHi || formTitleEn,
        text_en: formTextEn,
        text_hi: formTextHi || formTextEn,
        stats_label_en: formStatsLabelEn,
        stats_label_hi: formStatsLabelHi || formStatsLabelEn,
        stats_value: formStatsValue,
      };

      let res;
      if (editingGoalId) {
        res = await fetch(`${API_BASE}/goals/goals/${editingGoalId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/goals/goals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingGoalId ? 'Goal updated!' : 'Goal added successfully!');
        setGoalModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save goal');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (!confirm('Are you sure you want to delete this strategic goal?')) return;
    try {
      const res = await fetch(`${API_BASE}/goals/goals/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ROADMAP CRUD
  const openAddRoadmapModal = () => {
    setEditingRoadmapId(null);
    setFormYear('2025-2026');
    setFormRoadmapTitleEn('');
    setFormRoadmapTitleHi('');
    setFormFocusEn('');
    setFormFocusHi('');
    setRoadmapModalOpen(true);
  };

  const openEditRoadmapModal = (item: RoadmapItem) => {
    setEditingRoadmapId(item.id);
    setFormYear(item.year || '');
    setFormRoadmapTitleEn(item.title_en || '');
    setFormRoadmapTitleHi(item.title_hi || '');
    setFormFocusEn(item.focus_en || '');
    setFormFocusHi(item.focus_hi || '');
    setRoadmapModalOpen(true);
  };

  const handleSubmitRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        year: formYear,
        title_en: formRoadmapTitleEn,
        title_hi: formRoadmapTitleHi || formRoadmapTitleEn,
        focus_en: formFocusEn,
        focus_hi: formFocusHi || formFocusEn,
        items_en: [formFocusEn],
        items_hi: [formFocusHi || formFocusEn],
      };

      let res;
      if (editingRoadmapId) {
        res = await fetch(`${API_BASE}/goals/roadmap/${editingRoadmapId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/goals/roadmap`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingRoadmapId ? 'Roadmap phase updated!' : 'Roadmap phase added!');
        setRoadmapModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoadmap = async (id: number) => {
    if (!confirm('Are you sure you want to delete this roadmap phase?')) return;
    try {
      const res = await fetch(`${API_BASE}/goals/roadmap/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-6 font-sans">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <Target size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Goals & Strategic Roadmap Manager</h1>
              <p className="text-xs text-gray-500">
                Manage institutional targets, strategic benchmarks, action steps, and multi-year roadmaps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            {activeTab === 'goals' && (
              <button
                onClick={openAddGoalModal}
                className="bg-[#631012] hover:bg-[#500c0e] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm"
              >
                <Plus size={16} />
                <span>Add Goal</span>
              </button>
            )}
            {activeTab === 'roadmap' && (
              <button
                onClick={openAddRoadmapModal}
                className="bg-[#631012] hover:bg-[#500c0e] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm"
              >
                <Plus size={16} />
                <span>Add Phase</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'goals'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Target size={16} />
            <span>Strategic Goals ({goals.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'roadmap'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Compass size={16} />
            <span>Roadmap Phases ({roadmaps.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('page')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'page'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layout size={16} />
            <span>Header & Intro Settings</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Goals */}
          {activeTab === 'goals' && (
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
                  <thead className="bg-[#f0f4f8] border-b border-gray-300 text-[#0c344e] font-mono uppercase text-xs">
                    <tr>
                      <th className="py-3 px-4 w-28 text-center">Metric</th>
                      <th className="py-3 px-4 w-64">Goal Title</th>
                      <th className="py-3 px-4">Strategic Objective</th>
                      <th className="py-3 px-4 w-24 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {goals.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-1 bg-[#631012]/10 text-[#631012] font-mono font-bold rounded text-xs">
                            {item.stats_value || item.icon}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 space-y-1 font-bold text-gray-900">
                          <div>{item.title_en}</div>
                          {item.title_hi && <div className="text-xs text-gray-600 font-medium">{item.title_hi}</div>}
                        </td>
                        <td className="py-3.5 px-4 space-y-1 text-xs text-gray-700 leading-relaxed">
                          <div>{item.text_en}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openEditGoalModal(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteGoal(item.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Roadmap */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
                  <thead className="bg-[#f0f4f8] border-b border-gray-300 text-[#0c344e] font-mono uppercase text-xs">
                    <tr>
                      <th className="py-3 px-4 w-32 text-center">Phase (Year)</th>
                      <th className="py-3 px-4 w-72">Phase Title</th>
                      <th className="py-3 px-4">Core Focus Area</th>
                      <th className="py-3 px-4 w-24 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {roadmaps.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-[#631012] text-xs">
                          {item.year}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-900 text-xs sm:text-sm">
                          {item.title_en}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-700">
                          {item.focus_en}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openEditRoadmapModal(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteRoadmap(item.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Page Settings */}
          {activeTab === 'page' && (
            <div className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-xs uppercase text-[#631012]">English Content</h3>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      Hero Heading
                    </label>
                    <input
                      type="text"
                      value={pageData.hero_heading_en}
                      onChange={(e) => setPageData({ ...pageData, hero_heading_en: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      Hero Description
                    </label>
                    <textarea
                      rows={4}
                      value={pageData.hero_description_en}
                      onChange={(e) => setPageData({ ...pageData, hero_description_en: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-xs uppercase text-[#631012]">हिंदी सामग्री</h3>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      मुख्य शीर्षक (Hero Heading)
                    </label>
                    <input
                      type="text"
                      value={pageData.hero_heading_hi}
                      onChange={(e) => setPageData({ ...pageData, hero_heading_hi: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      मुख्य विवरण (Hero Description)
                    </label>
                    <textarea
                      rows={4}
                      value={pageData.hero_description_hi}
                      onChange={(e) => setPageData({ ...pageData, hero_description_hi: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSavePage}
                disabled={savingPage}
                className="bg-[#631012] hover:bg-[#500c0e] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
              >
                <Save size={16} />
                <span>{savingPage ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Goal Modal */}
      {goalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold">
                {editingGoalId ? 'Edit Goal' : 'Add Strategic Goal'}
              </h2>
              <button onClick={() => setGoalModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitGoal} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Icon</label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-semibold"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Stats Value (e.g. Top 20)
                  </label>
                  <input
                    type="text"
                    value={formStatsValue}
                    onChange={(e) => setFormStatsValue(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-mono font-bold"
                    placeholder="e.g. Top 20"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Goal Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formTitleEn}
                  onChange={(e) => setFormTitleEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Goal Description (English) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formTextEn}
                  onChange={(e) => setFormTextEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setGoalModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#631012] hover:bg-[#500c0e] text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  {submitting ? 'Saving...' : editingGoalId ? 'Update Goal' : 'Add Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Roadmap Modal */}
      {roadmapModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold">
                {editingRoadmapId ? 'Edit Roadmap Phase' : 'Add Roadmap Phase'}
              </h2>
              <button onClick={() => setRoadmapModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitRoadmap} className="p-6 space-y-4 overflow-y-auto">
              <div className="w-36">
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Year Period *
                </label>
                <input
                  type="text"
                  required
                  value={formYear}
                  onChange={(e) => setFormYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-mono font-bold"
                  placeholder="2025-2026"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Phase Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formRoadmapTitleEn}
                  onChange={(e) => setFormRoadmapTitleEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Core Focus Areas *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formFocusEn}
                  onChange={(e) => setFormFocusEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setRoadmapModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#631012] hover:bg-[#500c0e] text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  {submitting ? 'Saving...' : editingRoadmapId ? 'Update Phase' : 'Add Phase'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
