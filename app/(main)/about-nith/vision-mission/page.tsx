'use client';

import React, { useState, useEffect } from 'react';
import { Save, Target, Plus, Trash2, Eye, Compass, Award, Loader2, Globe } from 'lucide-react';

interface MissionPillar {
  id?: number;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
}

interface LegacyStat {
  id?: number;
  value_en: string;
  value_hi: string;
  label_en: string;
  label_hi: string;
  description_en: string;
  description_hi: string;
}

interface VisionMissionData {
  guiding_principles_heading_en: string;
  guiding_principles_heading_hi: string;
  guiding_principles_description_en: string;
  guiding_principles_description_hi: string;
  vision_heading_en: string;
  vision_heading_hi: string;
  vision_subtitle_en: string;
  vision_subtitle_hi: string;
  vision_description_en: string;
  vision_description_hi: string;
  strategic_objectives_heading_en: string;
  strategic_objectives_heading_hi: string;
  mission_heading_en: string;
  mission_heading_hi: string;
  mission_subtitle_en: string;
  mission_subtitle_hi: string;
  missionPillars: MissionPillar[];
  tagline_en: string;
  tagline_hi: string;
  tagline_description_en: string;
  tagline_description_hi: string;
  legacy_heading_en: string;
  legacy_heading_hi: string;
  legacy_subheading_en: string;
  legacy_subheading_hi: string;
  legacyStats: LegacyStat[];
}

type TabType = 'vision' | 'mission' | 'legacy';
type LangType = 'en' | 'hi';

export default function VisionMissionPage() {
  const [activeTab, setActiveTab] = useState<TabType>('vision');
  const [lang, setLang] = useState<LangType>('en');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState<VisionMissionData>({
    guiding_principles_heading_en: '', guiding_principles_heading_hi: '',
    guiding_principles_description_en: '', guiding_principles_description_hi: '',
    vision_heading_en: '', vision_heading_hi: '',
    vision_subtitle_en: '', vision_subtitle_hi: '',
    vision_description_en: '', vision_description_hi: '',
    strategic_objectives_heading_en: '', strategic_objectives_heading_hi: '',
    mission_heading_en: '', mission_heading_hi: '',
    mission_subtitle_en: '', mission_subtitle_hi: '',
    missionPillars: [],
    tagline_en: '', tagline_hi: '',
    tagline_description_en: '', tagline_description_hi: '',
    legacy_heading_en: '', legacy_heading_hi: '',
    legacy_subheading_en: '', legacy_subheading_hi: '',
    legacyStats: [],
  });

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/vision-mission`;

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
          guiding_principles_heading_en: json.guiding_principles_heading_en || '',
          guiding_principles_heading_hi: json.guiding_principles_heading_hi || '',
          guiding_principles_description_en: json.guiding_principles_description_en || '',
          guiding_principles_description_hi: json.guiding_principles_description_hi || '',
          vision_heading_en: json.vision_heading_en || '',
          vision_heading_hi: json.vision_heading_hi || '',
          vision_subtitle_en: json.vision_subtitle_en || '',
          vision_subtitle_hi: json.vision_subtitle_hi || '',
          vision_description_en: json.vision_description_en || '',
          vision_description_hi: json.vision_description_hi || '',
          strategic_objectives_heading_en: json.strategic_objectives_heading_en || '',
          strategic_objectives_heading_hi: json.strategic_objectives_heading_hi || '',
          mission_heading_en: json.mission_heading_en || '',
          mission_heading_hi: json.mission_heading_hi || '',
          mission_subtitle_en: json.mission_subtitle_en || '',
          mission_subtitle_hi: json.mission_subtitle_hi || '',
          missionPillars: json.missionPillars || [],
          tagline_en: json.tagline_en || '',
          tagline_hi: json.tagline_hi || '',
          tagline_description_en: json.tagline_description_en || '',
          tagline_description_hi: json.tagline_description_hi || '',
          legacy_heading_en: json.legacy_heading_en || '',
          legacy_heading_hi: json.legacy_heading_hi || '',
          legacy_subheading_en: json.legacy_subheading_en || '',
          legacy_subheading_hi: json.legacy_subheading_hi || '',
          legacyStats: json.legacyStats || [],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guidingPrinciplesHeading_en: data.guiding_principles_heading_en,
          guidingPrinciplesHeading_hi: data.guiding_principles_heading_hi,
          guidingPrinciplesDescription_en: data.guiding_principles_description_en,
          guidingPrinciplesDescription_hi: data.guiding_principles_description_hi,
          visionHeading_en: data.vision_heading_en,
          visionHeading_hi: data.vision_heading_hi,
          visionSubtitle_en: data.vision_subtitle_en,
          visionSubtitle_hi: data.vision_subtitle_hi,
          visionDescription_en: data.vision_description_en,
          visionDescription_hi: data.vision_description_hi,
          strategicObjectivesHeading_en: data.strategic_objectives_heading_en,
          strategicObjectivesHeading_hi: data.strategic_objectives_heading_hi,
          missionHeading_en: data.mission_heading_en,
          missionHeading_hi: data.mission_heading_hi,
          missionSubtitle_en: data.mission_subtitle_en,
          missionSubtitle_hi: data.mission_subtitle_hi,
          tagline_en: data.tagline_en,
          tagline_hi: data.tagline_hi,
          taglineDescription_en: data.tagline_description_en,
          taglineDescription_hi: data.tagline_description_hi,
          legacyHeading_en: data.legacy_heading_en,
          legacyHeading_hi: data.legacy_heading_hi,
          legacySubheading_en: data.legacy_subheading_en,
          legacySubheading_hi: data.legacy_subheading_hi,
        }),
      });

      if (res.ok) {
        alert('Saved successfully!');
      } else {
        alert('Failed to save');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setData((prev: any) => ({ ...prev, [`${field}_${lang}`]: value }));
  };

  const getField = (field: string) => {
    return (data as any)[`${field}_${lang}`] || '';
  };

  // --- Pillars API ---
  const savePillar = async (pillar: MissionPillar) => {
    try {
      const isNew = !pillar.id;
      const url = isNew ? `${API_URL}/pillar` : `${API_URL}/pillar/${pillar.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_en: pillar.title_en,
          title_hi: pillar.title_hi,
          description_en: pillar.description_en,
          description_hi: pillar.description_hi,
        }),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const deletePillar = async (id: number | undefined, index: number) => {
    if (!id) {
      const updated = [...data.missionPillars];
      updated.splice(index, 1);
      setData({ ...data, missionPillars: updated });
      return;
    }
    if (confirm('Delete this pillar?')) {
      try {
        await fetch(`${API_URL}/pillar/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const updatePillarLocal = (index: number, field: string, value: string) => {
    const updated = [...data.missionPillars];
    (updated[index] as any)[`${field}_${lang}`] = value;
    setData({ ...data, missionPillars: updated });
  };

  const addPillar = () => {
    setData({
      ...data,
      missionPillars: [
        ...data.missionPillars,
        { title_en: '', title_hi: '', description_en: '', description_hi: '' }
      ]
    });
  };

  // --- Legacy Stats API ---
  const saveLegacyStat = async (stat: LegacyStat) => {
    try {
      const isNew = !stat.id;
      const url = isNew ? `${API_URL}/legacy-stat` : `${API_URL}/legacy-stat/${stat.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          value_en: stat.value_en,
          value_hi: stat.value_hi,
          label_en: stat.label_en,
          label_hi: stat.label_hi,
          description_en: stat.description_en,
          description_hi: stat.description_hi,
        }),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteLegacyStat = async (id: number | undefined, index: number) => {
    if (!id) {
      const updated = [...data.legacyStats];
      updated.splice(index, 1);
      setData({ ...data, legacyStats: updated });
      return;
    }
    if (confirm('Delete this stat?')) {
      try {
        await fetch(`${API_URL}/legacy-stat/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const updateLegacyStatLocal = (index: number, field: string, value: string) => {
    const updated = [...data.legacyStats];
    (updated[index] as any)[`${field}_${lang}`] = value;
    setData({ ...data, legacyStats: updated });
  };

  const addLegacyStat = () => {
    setData({
      ...data,
      legacyStats: [
        ...data.legacyStats,
        { value_en: '', value_hi: '', label_en: '', label_hi: '', description_en: '', description_hi: '' }
      ]
    });
  };

  const tabs = [
    { id: 'vision' as TabType, label: 'Vision Section', icon: <Eye size={18} /> },
    { id: 'mission' as TabType, label: 'Mission Section', icon: <Compass size={18} /> },
    { id: 'legacy' as TabType, label: 'Legacy Section', icon: <Award size={18} /> },
  ];

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#631012]/10 p-2 rounded-full text-[#631012]"><Target className="w-6 h-6" /></div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">Vision & Mission Editor</h1>
            <p className="text-sm text-gray-500">Edit vision, mission, and legacy content</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <Globe size={18} className="text-gray-500 ml-2" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LangType)}
              className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer py-1 pr-4"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            Save Main Content
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-[#171717]/10 flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap text-sm ${activeTab === tab.id ? 'bg-[#631012] text-white border-b-2 border-[#631012]' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          {/* VISION TAB */}
          {activeTab === 'vision' && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-semibold mb-3">Guiding Principles</h3>
                <div className="grid gap-3">
                  <input type="text" value={getField('guiding_principles_heading')} onChange={e => updateField('guiding_principles_heading', e.target.value)} placeholder="Heading" className="w-full p-2 border rounded" />
                  <textarea rows={2} value={getField('guiding_principles_description')} onChange={e => updateField('guiding_principles_description', e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="font-semibold mb-3">Our Vision</h3>
                <div className="grid gap-3">
                  <input type="text" value={getField('vision_heading')} onChange={e => updateField('vision_heading', e.target.value)} placeholder="Heading" className="w-full p-2 border rounded" />
                  <input type="text" value={getField('vision_subtitle')} onChange={e => updateField('vision_subtitle', e.target.value)} placeholder="Subtitle" className="w-full p-2 border rounded" />
                  <textarea rows={3} value={getField('vision_description')} onChange={e => updateField('vision_description', e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
                </div>
              </div>
            </div>
          )}

          {/* MISSION TAB */}
          {activeTab === 'mission' && (
            <div className="space-y-6">
              <div className="grid gap-3 p-4 bg-gray-50 border rounded-lg">
                <input type="text" value={getField('strategic_objectives_heading')} onChange={e => updateField('strategic_objectives_heading', e.target.value)} placeholder="Strategic Objectives Heading" className="w-full p-2 border rounded" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={getField('mission_heading')} onChange={e => updateField('mission_heading', e.target.value)} placeholder="Mission Heading" className="w-full p-2 border rounded" />
                  <input type="text" value={getField('mission_subtitle')} onChange={e => updateField('mission_subtitle', e.target.value)} placeholder="Mission Subtitle" className="w-full p-2 border rounded" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Mission Pillars</h3>
                <div className="space-y-3">
                  {data.missionPillars.map((pillar, i) => (
                    <div key={i} className="p-3 border rounded bg-gray-50 flex gap-3 relative">
                      <div className="flex-1 space-y-2">
                        <input type="text" value={(pillar as any)[`title_${lang}`]} onChange={e => updatePillarLocal(i, 'title', e.target.value)} placeholder="Title" className="w-full p-2 border rounded text-sm" />
                        <textarea rows={2} value={(pillar as any)[`description_${lang}`]} onChange={e => updatePillarLocal(i, 'description', e.target.value)} placeholder="Description" className="w-full p-2 border rounded text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => savePillar(pillar)} className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded" title="Save Pillar"><Save size={16} /></button>
                        <button onClick={() => deletePillar(pillar.id, i)} className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded" title="Delete Pillar"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={addPillar} className="text-[#631012] font-medium text-sm flex items-center gap-1 hover:underline"><Plus size={16} /> Add Pillar</button>
                </div>
              </div>
            </div>
          )}

          {/* LEGACY TAB */}
          {activeTab === 'legacy' && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg border grid gap-3">
                <input type="text" value={getField('tagline')} onChange={e => updateField('tagline', e.target.value)} placeholder="Tagline" className="w-full p-2 border rounded" />
                <textarea rows={2} value={getField('tagline_description')} onChange={e => updateField('tagline_description', e.target.value)} placeholder="Tagline Description" className="w-full p-2 border rounded" />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border grid grid-cols-2 gap-3">
                <input type="text" value={getField('legacy_heading')} onChange={e => updateField('legacy_heading', e.target.value)} placeholder="Legacy Heading" className="w-full p-2 border rounded" />
                <input type="text" value={getField('legacy_subheading')} onChange={e => updateField('legacy_subheading', e.target.value)} placeholder="Legacy Subheading" className="w-full p-2 border rounded" />
              </div>

              <div>
                <h3 className="font-semibold mb-3">Legacy Statistics</h3>
                <div className="space-y-3">
                  {data.legacyStats.map((stat, i) => (
                    <div key={i} className="p-3 border rounded bg-gray-50 flex gap-3 relative">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <input type="text" value={(stat as any)[`value_${lang}`]} onChange={e => updateLegacyStatLocal(i, 'value', e.target.value)} placeholder="Value (e.g. 1986)" className="p-2 border rounded text-sm" />
                        <input type="text" value={(stat as any)[`label_${lang}`]} onChange={e => updateLegacyStatLocal(i, 'label', e.target.value)} placeholder="Label (e.g. Established)" className="p-2 border rounded text-sm" />
                        <input type="text" value={(stat as any)[`description_${lang}`]} onChange={e => updateLegacyStatLocal(i, 'description', e.target.value)} placeholder="Description" className="p-2 border rounded text-sm" />
                      </div>
                      <div className="flex flex-col justify-center gap-2">
                        <button onClick={() => saveLegacyStat(stat)} className="p-2 bg-green-100 text-green-700 hover:bg-green-200 rounded" title="Save"><Save size={16} /></button>
                        <button onClick={() => deleteLegacyStat(stat.id, i)} className="p-2 bg-red-100 text-red-700 hover:bg-red-200 rounded" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={addLegacyStat} className="text-[#631012] font-medium text-sm flex items-center gap-1 hover:underline"><Plus size={16} /> Add Statistic</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
