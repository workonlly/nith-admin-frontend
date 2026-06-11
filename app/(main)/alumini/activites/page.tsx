'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Calendar,
  Plus,
  Trash2,
  FileText,
} from 'lucide-react';

interface Activity {
  id: number;
  title_en: string;
  title_hn: string;
  description_en: string;
  description_hn: string;
  date_en: string;
  date_hn: string;
  category_en: string;
  category_hn: string;
  mode_en: string;
  mode_hn: string;
  location_en: string;
  location_hn: string;
}

interface AlumniData {
  heroHeadingEn: string;
  heroHeadingHn: string;
  heroDescriptionEn: string;
  heroDescriptionHn: string;
  activities: Activity[];
}

const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: -1,
    title_en: 'Annual Alumni Reunion 2025',
    title_hn: 'वार्षिक पूर्व छात्र पुनर्मिलन 2025',
    description_en: 'Join us for the grand annual reunion celebrating decades of excellence.',
    description_hn: 'दशकों की उत्कृष्टता का जश्न मनाने वाले भव्य वार्षिक पुनर्मिलन में हमारे साथ जुड़ें।',
    date_en: '2025-01-15',
    date_hn: '15 जनवरी, 2025',
    category_en: 'Reunions',
    category_hn: 'पुनर्मिलन',
    mode_en: 'Offline',
    mode_hn: 'ऑफलाइन',
    location_en: 'Main Auditorium, NIT Hamirpur',
    location_hn: 'मुख्य सभागार, एनआईटी हमीरपुर'
  }
];

type TabType = 'hero' | 'list';

export default function AlumniActivitiesAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [data, setData] = useState<AlumniData>({
    heroHeadingEn: 'Alumni Activities',
    heroHeadingHn: 'पूर्व छात्र गतिविधियाँ',
    heroDescriptionEn: 'Stay connected with your alma mater through reunions, webinars, and campus events.',
    heroDescriptionHn: 'पुनर्मिलन, वेबिनार और कैंपस कार्यक्रमों के माध्यम से अपने अल्मा मेटर से जुड़े रहें।',
    activities: INITIAL_ACTIVITIES,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hRes = await fetch('http://localhost:4000/api/alumni-activities');
        const hData = await hRes.json();
        if (hData && hData.title_en) {
          setData(prev => ({
            ...prev,
            heroHeadingEn: hData.title_en,
            heroHeadingHn: hData.title_hn,
            heroDescriptionEn: hData.sub_title_en,
            heroDescriptionHn: hData.sub_title_hn,
          }));
        }

        const lRes = await fetch('http://localhost:4000/api/alumni-activities/list');
        const lData = await lRes.json();
        if (Array.isArray(lData) && lData.length > 0) {
          setData(prev => {
            const merged = [...lData];
            INITIAL_ACTIVITIES.forEach(def => {
              if (!merged.find(m => m.title_en === def.title_en || String(m.id) === String(def.id))) {
                merged.push(def);
              }
            });
            return { ...prev, activities: merged };
          });
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await fetch('http://localhost:4000/api/alumni-activities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_en: data.heroHeadingEn,
          title_hn: data.heroHeadingHn,
          sub_title_en: data.heroDescriptionEn,
          sub_title_hn: data.heroDescriptionHn,
        }),
      });

      for (const act of data.activities) {
        if (act.id > 0 && act.id < 1000000) {
          await fetch(`http://localhost:4000/api/alumni-activities/list/${act.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(act),
          });
        } else {
          await fetch('http://localhost:4000/api/alumni-activities/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(act),
          });
        }
      }
      alert('Changes saved successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save changes');
    }
  };

  const updateActivity = (id: number, field: keyof Activity, value: string) => {
    setData({
      ...data,
      activities: data.activities.map((a) => a.id === id ? { ...a, [field]: value } : a),
    });
  };

  const addActivity = () => {
    setData({
      ...data,
      activities: [
        ...data.activities,
        { 
            id: Date.now() + Math.floor(Math.random() * 1000), 
            title_en: '', title_hn: '', 
            description_en: '', description_hn: '', 
            date_en: '', date_hn: '',
            category_en: '', category_hn: '',
            mode_en: 'Offline', mode_hn: 'ऑफलाइन',
            location_en: '', location_hn: ''
        },
      ],
    });
  };

  const removeActivity = async (id: number) => {
    if (id > 0 && id < 1000000) {
      if (!confirm('Delete from database?')) return;
      await fetch(`http://localhost:4000/api/alumni-activities/list/${id}`, { method: 'DELETE' });
    }
    setData({
      ...data,
      activities: data.activities.filter((a) => a.id !== id),
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">
              <Calendar size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#171717]">Alumni Activities Editor</h1>
              <p className="text-[#171717]/60">Manage reunions, webinars and campus events</p>
            </div>
          </div>
          <button onClick={handleSave} className="bg-[#631012] hover:bg-[#7a1214] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md">
            <Save size={20} /> Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b border-[#171717]/10">
          <button onClick={() => setActiveTab('hero')} className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'hero' ? 'bg-[#631012] text-white' : 'text-[#171717]/70 hover:bg-gray-50'}`}>
            <FileText size={18} /> Hero Section
          </button>
          <button onClick={() => setActiveTab('list')} className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'list' ? 'bg-[#631012] text-white' : 'text-[#171717]/70 hover:bg-gray-50'}`}>
            <Calendar size={18} /> Activities List
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'hero' && (
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-500">English Header</label>
                <input type="text" value={data.heroHeadingEn} onChange={(e) => setData({...data, heroHeadingEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Heading" />
                <textarea rows={3} value={data.heroDescriptionEn} onChange={(e) => setData({...data, heroDescriptionEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Description" />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-500">Hindi Header</label>
                <input type="text" value={data.heroHeadingHn} onChange={(e) => setData({...data, heroHeadingHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="शीर्षक" />
                <textarea rows={3} value={data.heroDescriptionHn} onChange={(e) => setData({...data, heroDescriptionHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="विवरण" />
              </div>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Activities Management</h2>
                <button onClick={addActivity} className="bg-[#631012] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7a1214]">
                  <Plus size={18} /> Add Activity
                </button>
              </div>

              <div className="space-y-4">
                {data.activities.map((act) => (
                  <div key={act.id} className="p-6 border rounded-xl bg-gray-50 relative group">
                    <button onClick={() => removeActivity(act.id)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-8">
                      {/* English Side */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#631012] uppercase tracking-widest">English Content</label>
                        <input value={act.title_en} onChange={(e) => updateActivity(act.id, 'title_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" placeholder="Activity Title" />
                        <textarea value={act.description_en} onChange={(e) => updateActivity(act.id, 'description_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm h-20" placeholder="Description" />
                        <div className="grid grid-cols-2 gap-3">
                            <input value={act.date_en} onChange={(e) => updateActivity(act.id, 'date_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Date (YYYY-MM-DD)" />
                            <input value={act.category_en} onChange={(e) => updateActivity(act.id, 'category_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Category" />
                            <input value={act.mode_en} onChange={(e) => updateActivity(act.id, 'mode_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Mode (Online/Offline)" />
                            <input value={act.location_en} onChange={(e) => updateActivity(act.id, 'location_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Location" />
                        </div>
                      </div>
                      {/* Hindi Side */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-[#631012] uppercase tracking-widest">Hindi Content</label>
                        <input value={act.title_hn} onChange={(e) => updateActivity(act.id, 'title_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm font-bold" placeholder="गतिविधि शीर्षक" />
                        <textarea value={act.description_hn} onChange={(e) => updateActivity(act.id, 'description_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm h-20" placeholder="विवरण" />
                        <div className="grid grid-cols-2 gap-3">
                            <input value={act.date_hn} onChange={(e) => updateActivity(act.id, 'date_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="तिथि" />
                            <input value={act.category_hn} onChange={(e) => updateActivity(act.id, 'category_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="श्रेणी" />
                            <input value={act.mode_hn} onChange={(e) => updateActivity(act.id, 'mode_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="मोड (ऑनलाइन/ऑफलाइन)" />
                            <input value={act.location_hn} onChange={(e) => updateActivity(act.id, 'location_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="स्थान" />
                        </div>
                      </div>
                    </div>
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
