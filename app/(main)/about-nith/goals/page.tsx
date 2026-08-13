'use client';

import React, { useState, useEffect } from 'react';
import { Save, Target, Plus, Trash2, FileText, Compass, Map, Megaphone, Loader2, Globe } from 'lucide-react';

interface GoalItem {
  id?: number;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  link_text_en: string;
  link_text_hi: string;
}

interface ActionStep {
  id?: number;
  step_number: string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
}

interface CallToAction {
  id?: number;
  button_text_en: string;
  button_text_hi: string;
}

interface GoalsData {
  hero_heading_en: string;
  hero_heading_hi: string;
  hero_description_en: string;
  hero_description_hi: string;
  goals_heading_en: string;
  goals_heading_hi: string;
  goals_subtitle_en: string;
  goals_subtitle_hi: string;
  tagline_en: string;
  tagline_hi: string;
  tagline_description_en: string;
  tagline_description_hi: string;
  strategy_heading_en: string;
  strategy_heading_hi: string;
  strategy_subheading_en: string;
  strategy_subheading_hi: string;
  strategy_description_en: string;
  strategy_description_hi: string;
  cta_heading_en: string;
  cta_heading_hi: string;
  cta_description_en: string;
  cta_description_hi: string;
  goalItems: GoalItem[];
  actionSteps: ActionStep[];
  ctaButtons: CallToAction[];
}

type TabType = 'hero' | 'goals' | 'strategy' | 'cta';
type LangType = 'en' | 'hi';

export default function GoalsPage() {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/goals`;
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [lang, setLang] = useState<LangType>('en');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState<GoalsData>({
    hero_heading_en: '', hero_heading_hi: '',
    hero_description_en: '', hero_description_hi: '',
    goals_heading_en: '', goals_heading_hi: '',
    goals_subtitle_en: '', goals_subtitle_hi: '',
    tagline_en: '', tagline_hi: '',
    tagline_description_en: '', tagline_description_hi: '',
    strategy_heading_en: '', strategy_heading_hi: '',
    strategy_subheading_en: '', strategy_subheading_hi: '',
    strategy_description_en: '', strategy_description_hi: '',
    cta_heading_en: '', cta_heading_hi: '',
    cta_description_en: '', cta_description_hi: '',
    goalItems: [],
    actionSteps: [],
    ctaButtons: []
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
          goals_heading_en: json.goals_heading_en || '',
          goals_heading_hi: json.goals_heading_hi || '',
          goals_subtitle_en: json.goals_subtitle_en || '',
          goals_subtitle_hi: json.goals_subtitle_hi || '',
          tagline_en: json.tagline_en || '',
          tagline_hi: json.tagline_hi || '',
          tagline_description_en: json.tagline_description_en || '',
          tagline_description_hi: json.tagline_description_hi || '',
          strategy_heading_en: json.strategy_heading_en || '',
          strategy_heading_hi: json.strategy_heading_hi || '',
          strategy_subheading_en: json.strategy_subheading_en || '',
          strategy_subheading_hi: json.strategy_subheading_hi || '',
          strategy_description_en: json.strategy_description_en || '',
          strategy_description_hi: json.strategy_description_hi || '',
          cta_heading_en: json.cta_heading_en || '',
          cta_heading_hi: json.cta_heading_hi || '',
          cta_description_en: json.cta_description_en || '',
          cta_description_hi: json.cta_description_hi || '',
          goalItems: json.goalItems || [],
          actionSteps: json.actionSteps || [],
          ctaButtons: json.ctaButtons || []
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
          goalsHeading_en: data.goals_heading_en, goalsHeading_hi: data.goals_heading_hi,
          goalsSubtitle_en: data.goals_subtitle_en, goalsSubtitle_hi: data.goals_subtitle_hi,
          tagline_en: data.tagline_en, tagline_hi: data.tagline_hi,
          taglineDescription_en: data.tagline_description_en, taglineDescription_hi: data.tagline_description_hi,
          strategyHeading_en: data.strategy_heading_en, strategyHeading_hi: data.strategy_heading_hi,
          strategySubheading_en: data.strategy_subheading_en, strategySubheading_hi: data.strategy_subheading_hi,
          strategyDescription_en: data.strategy_description_en, strategyDescription_hi: data.strategy_description_hi,
          ctaHeading_en: data.cta_heading_en, ctaHeading_hi: data.cta_heading_hi,
          ctaDescription_en: data.cta_description_en, ctaDescription_hi: data.cta_description_hi,
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

  const updateListLocal = (listName: keyof GoalsData, index: number, field: string, value: string, useLang: boolean = true) => {
    const updated: any[] = [...(data[listName] as any[])];
    if (useLang) updated[index][`${field}_${lang}`] = value;
    else updated[index][field] = value;
    setData({ ...data, [listName]: updated });
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Section', icon: <FileText size={18} /> },
    { id: 'goals' as TabType, label: 'Institutional Goals', icon: <Compass size={18} /> },
    { id: 'strategy' as TabType, label: 'Strategy', icon: <Map size={18} /> },
    { id: 'cta' as TabType, label: 'Call to Action', icon: <Megaphone size={18} /> },
  ];

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading...</div>;

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#631012]/10 p-2 rounded-full text-[#631012]"><Target className="w-6 h-6" /></div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">Goals Editor</h1>
            <p className="text-sm text-gray-500">Edit institutional goals and strategy</p>
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
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="grid gap-3 p-4 bg-gray-50 border rounded-lg">
                <input type="text" value={getField('hero_heading')} onChange={e => updateField('hero_heading', e.target.value)} placeholder="Hero Heading" className="w-full p-2 border rounded" />
                <textarea rows={3} value={getField('hero_description')} onChange={e => updateField('hero_description', e.target.value)} placeholder="Hero Description" className="w-full p-2 border rounded" />
              </div>
              <div className="grid gap-3 p-4 bg-gray-50 border rounded-lg">
                <input type="text" value={getField('tagline')} onChange={e => updateField('tagline', e.target.value)} placeholder="Tagline" className="w-full p-2 border rounded" />
                <textarea rows={2} value={getField('tagline_description')} onChange={e => updateField('tagline_description', e.target.value)} placeholder="Tagline Description" className="w-full p-2 border rounded" />
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 border rounded-lg">
                <input type="text" value={getField('goals_heading')} onChange={e => updateField('goals_heading', e.target.value)} placeholder="Goals Heading" className="w-full p-2 border rounded" />
                <input type="text" value={getField('goals_subtitle')} onChange={e => updateField('goals_subtitle', e.target.value)} placeholder="Goals Subtitle" className="w-full p-2 border rounded" />
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Goal Items</h3>
                <div className="space-y-3">
                  {data.goalItems.map((goal, i) => (
                    <div key={i} className="p-3 border rounded bg-gray-50 flex gap-3">
                      <div className="flex-1 space-y-2">
                        <input type="text" value={(goal as any)[`title_${lang}`] || ''} onChange={e => updateListLocal('goalItems', i, 'title', e.target.value)} placeholder="Title" className="w-full p-2 border rounded text-sm" />
                        <textarea rows={2} value={(goal as any)[`description_${lang}`] || ''} onChange={e => updateListLocal('goalItems', i, 'description', e.target.value)} placeholder="Description" className="w-full p-2 border rounded text-sm" />
                        <input type="text" value={(goal as any)[`link_text_${lang}`] || ''} onChange={e => updateListLocal('goalItems', i, 'link_text', e.target.value)} placeholder="Link Text" className="w-full p-2 border rounded text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => saveSubItem('goal', { title_en: goal.title_en, title_hi: goal.title_hi, description_en: goal.description_en, description_hi: goal.description_hi, linkText_en: goal.link_text_en, linkText_hi: goal.link_text_hi }, !goal.id, goal.id)} className="p-2 bg-green-100 text-green-700 rounded"><Save size={16}/></button>
                        <button onClick={() => deleteSubItem('goal', goal.id, i, data.goalItems, 'goalItems')} className="p-2 bg-red-100 text-red-700 rounded"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setData({ ...data, goalItems: [...data.goalItems, { title_en: '', title_hi: '', description_en: '', description_hi: '', link_text_en: '', link_text_hi: '' }]})} className="text-[#631012] font-medium text-sm flex items-center gap-1 hover:underline"><Plus size={16} /> Add Goal</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'strategy' && (
            <div className="space-y-6">
              <div className="grid gap-3 p-4 bg-gray-50 border rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={getField('strategy_heading')} onChange={e => updateField('strategy_heading', e.target.value)} placeholder="Strategy Heading" className="w-full p-2 border rounded" />
                  <input type="text" value={getField('strategy_subheading')} onChange={e => updateField('strategy_subheading', e.target.value)} placeholder="Strategy Subheading" className="w-full p-2 border rounded" />
                </div>
                <textarea rows={2} value={getField('strategy_description')} onChange={e => updateField('strategy_description', e.target.value)} placeholder="Strategy Description" className="w-full p-2 border rounded" />
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Action Steps</h3>
                <div className="space-y-3">
                  {data.actionSteps.map((step, i) => (
                    <div key={i} className="p-3 border rounded bg-gray-50 flex gap-3">
                      <div className="flex-1 space-y-2">
                        <input type="text" value={step.step_number || ''} onChange={e => updateListLocal('actionSteps', i, 'step_number', e.target.value, false)} placeholder="Step Number" className="w-full p-2 border rounded text-sm" />
                        <input type="text" value={(step as any)[`title_${lang}`] || ''} onChange={e => updateListLocal('actionSteps', i, 'title', e.target.value)} placeholder="Title" className="w-full p-2 border rounded text-sm" />
                        <textarea rows={2} value={(step as any)[`description_${lang}`] || ''} onChange={e => updateListLocal('actionSteps', i, 'description', e.target.value)} placeholder="Description" className="w-full p-2 border rounded text-sm" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => saveSubItem('action-step', { stepNumber: step.step_number, title_en: step.title_en, title_hi: step.title_hi, description_en: step.description_en, description_hi: step.description_hi }, !step.id, step.id)} className="p-2 bg-green-100 text-green-700 rounded"><Save size={16}/></button>
                        <button onClick={() => deleteSubItem('action-step', step.id, i, data.actionSteps, 'actionSteps')} className="p-2 bg-red-100 text-red-700 rounded"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setData({ ...data, actionSteps: [...data.actionSteps, { step_number: '', title_en: '', title_hi: '', description_en: '', description_hi: '' }]})} className="text-[#631012] font-medium text-sm flex items-center gap-1 hover:underline"><Plus size={16} /> Add Step</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cta' && (
            <div className="space-y-6">
              <div className="grid gap-3 p-4 bg-gray-50 border rounded-lg">
                <input type="text" value={getField('cta_heading')} onChange={e => updateField('cta_heading', e.target.value)} placeholder="CTA Heading" className="w-full p-2 border rounded" />
                <textarea rows={2} value={getField('cta_description')} onChange={e => updateField('cta_description', e.target.value)} placeholder="CTA Description" className="w-full p-2 border rounded" />
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">CTA Buttons</h3>
                <div className="space-y-3">
                  {data.ctaButtons.map((btn, i) => (
                    <div key={i} className="p-3 border rounded bg-gray-50 flex gap-3">
                      <div className="flex-1">
                        <input type="text" value={(btn as any)[`button_text_${lang}`] || ''} onChange={e => updateListLocal('ctaButtons', i, 'button_text', e.target.value)} placeholder="Button Text" className="w-full p-2 border rounded text-sm" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => saveSubItem('cta-button', { buttonText_en: btn.button_text_en, buttonText_hi: btn.button_text_hi }, !btn.id, btn.id)} className="p-2 bg-green-100 text-green-700 rounded"><Save size={16}/></button>
                        <button onClick={() => deleteSubItem('cta-button', btn.id, i, data.ctaButtons, 'ctaButtons')} className="p-2 bg-red-100 text-red-700 rounded"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setData({ ...data, ctaButtons: [...data.ctaButtons, { button_text_en: '', button_text_hi: '' }]})} className="text-[#631012] font-medium text-sm flex items-center gap-1 hover:underline"><Plus size={16} /> Add Button</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
