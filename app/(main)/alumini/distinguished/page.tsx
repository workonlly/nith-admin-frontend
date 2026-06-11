'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Users, Layout, Upload } from 'lucide-react';

interface DistinguishedAlumniData {
  id: number;
  name_en: string;
  name_hn: string;
  batch_en: string;
  batch_hn: string;
  photo: string;
  achievement_en: string;
  achievement_hn: string;
  department_en?: string;
  department_hn?: string;
  linkedin?: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
}

const INITIAL_HEADING: HeadingData = {
  title_en: 'Distinguished Alumni of NITH',
  title_hn: 'एनआईटी हमीरपुर के विशिष्ट पूर्व छात्र',
  sub_title_en: 'Celebrating the achievements and contributions of our distinguished alumni who have made remarkable impact in their respective fields.',
  sub_title_hn: 'हमारे विशिष्ट पूर्व छात्रों की उपलब्धियों और योगदान का जश्न मनाते हुए जिन्होंने अपने संबंधित क्षेत्रों में उल्लेखनीय प्रभाव डाला है।'
};

export default function DistinguishedAlumniAdmin() {
  const [heading, setHeading] = useState<HeadingData>(INITIAL_HEADING);
  const [alumni, setAlumni] = useState<DistinguishedAlumniData[]>([]);
  const [deletedAlumniIds, setDeletedAlumniIds] = useState<number[]>([]);
  
  const [localPreviews, setLocalPreviews] = useState<{ [key: number]: string }>({});
  const [uploadingIds, setUploadingIds] = useState<{ [key: number]: boolean }>({});
  
  const [activeTab, setActiveTab] = useState<'hero' | 'alumni'>('hero');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Headings
        const hRes = await fetch('http://localhost:4000/api/alumni-distinguished');
        const hData = await hRes.json();
        if (hData && hData.title_en) {
          setHeading(hData);
        }

        // 2. Fetch Alumni List
        const lRes = await fetch('http://localhost:4000/api/alumni-distinguished/list');
        const lData = await lRes.json();
        if (Array.isArray(lData)) {
          setAlumni(lData);
        }
      } catch (err) {
        console.error('Fetch Distinguished Alumni data failed:', err);
      }
    };
    fetchData();
  }, []);

  // Save headings and list changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Prune Deleted Alumni Records
      for (const id of deletedAlumniIds) {
        await fetch(`http://localhost:4000/api/alumni-distinguished/list/${id}`, {
          method: 'DELETE'
        });
      }
      setDeletedAlumniIds([]);

      // 2. Save Headings Settings
      await fetch('http://localhost:4000/api/alumni-distinguished', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heading)
      });

      // 3. Save Alumnus List (POST for new ones, PUT for existing)
      for (const al of alumni) {
        const payload = {
          name_en: al.name_en,
          name_hn: al.name_hn,
          batch_en: al.batch_en,
          batch_hn: al.batch_hn,
          photo: al.photo || '/alumni/placeholder.png',
          achievement_en: al.achievement_en,
          achievement_hn: al.achievement_hn,
          department_en: al.department_en || '',
          department_hn: al.department_hn || '',
          linkedin: al.linkedin || ''
        };

        if (al.id > 0 && al.id < 1000000000) {
          // Real ID, do PUT
          await fetch(`http://localhost:4000/api/alumni-distinguished/list/${al.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          // Temporary ID, do POST
          await fetch('http://localhost:4000/api/alumni-distinguished/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      }

      alert('All distinguished alumni changes saved successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Failed to save changes:', err);
      alert('Error saving changes. Please check server logs.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add Alumnus Row
  const handleAddAlumnus = () => {
    const newAlumnus: DistinguishedAlumniData = {
      id: Date.now() + Math.random(),
      name_en: '',
      name_hn: '',
      batch_en: '',
      batch_hn: '',
      photo: '/alumni/placeholder.png',
      achievement_en: '',
      achievement_hn: '',
      department_en: '',
      department_hn: '',
      linkedin: ''
    };
    setAlumni(prev => [...prev, newAlumnus]);
  };

  // Remove Alumnus Row
  const handleRemoveAlumnus = (id: number) => {
    if (id > 0 && id < 1000000000) {
      setDeletedAlumniIds(prev => [...prev, id]);
    }
    setAlumni(prev => prev.filter(al => al.id !== id));
  };

  // Update Alumnus Row Fields
  const handleUpdateAlumnus = (id: number, field: keyof DistinguishedAlumniData, value: string) => {
    setAlumni(prev => prev.map(al => al.id === id ? { ...al, [field]: value } : al));
  };

  // Handle Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview instantly
    const reader = new FileReader();
    reader.onload = () => {
      setLocalPreviews(prev => ({ ...prev, [id]: reader.result as string }));
    };
    reader.readAsDataURL(file);

    setUploadingIds(prev => ({ ...prev, [id]: true }));
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData
      });
      const result = await res.json();
      if (result.success && result.url) {
        setAlumni(prev => prev.map(al => al.id === id ? { ...al, photo: result.url } : al));
        alert('Photo uploaded successfully!');
      } else {
        alert('Failed to upload photo: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading photo to server');
    } finally {
      setUploadingIds(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header banner */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#171717]">Distinguished Alumni Editor</h1>
              <p className="text-[#171717]/60">Manage dynamic list and details of NITH Distinguished Alumni</p>
            </div>
          </div>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-[#631012] hover:bg-[#7a1214] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md disabled:opacity-50 w-full md:w-auto justify-center"
          >
            <Save size={20} /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('hero')} 
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors shrink-0 ${activeTab === 'hero' ? 'bg-[#631012] text-white' : 'text-[#171717]/70 hover:bg-gray-50'}`}
          >
            <Layout size={18} /> Hero Header Settings
          </button>
          <button 
            onClick={() => setActiveTab('alumni')} 
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors shrink-0 ${activeTab === 'alumni' ? 'bg-[#631012] text-white' : 'text-[#171717]/70 hover:bg-gray-50'}`}
          >
            <Users size={18} /> Alumni Roster ({alumni.length})
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: HERO SETTINGS */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#631012]">Distinguished Page Banner Headers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* English Content */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">English Hero Title</label>
                  <input 
                    type="text" 
                    value={heading.title_en} 
                    onChange={(e) => setHeading({...heading, title_en: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                  />
                  
                  <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">English Description</label>
                  <textarea 
                    rows={4} 
                    value={heading.sub_title_en} 
                    onChange={(e) => setHeading({...heading, sub_title_en: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                  />
                </div>
                {/* Hindi Content */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">Hindi Hero Title</label>
                  <input 
                    type="text" 
                    value={heading.title_hn} 
                    onChange={(e) => setHeading({...heading, title_hn: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                  />
                  
                  <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">Hindi Description</label>
                  <textarea 
                    rows={4} 
                    value={heading.sub_title_hn} 
                    onChange={(e) => setHeading({...heading, sub_title_hn: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALUMNI ROSTER */}
          {activeTab === 'alumni' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">Alumni Members Manager</h2>
                <button 
                  onClick={handleAddAlumnus} 
                  className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                  <Plus size={18} /> Add Alumnus Record
                </button>
              </div>

              {alumni.length === 0 ? (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                  No alumnus records found. Click the button to add a record!
                </div>
              ) : (
                <div className="space-y-4">
                  {alumni.map((al, idx) => (
                    <div key={al.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm relative group hover:shadow transition-shadow">
                      {/* Delete Trigger */}
                      <button 
                        onClick={() => handleRemoveAlumnus(al.id)} 
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Alumnus"
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Column 1: Image & Upload */}
                        <div className="lg:col-span-3 flex flex-col items-center gap-3">
                          <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-inner flex items-center justify-center">
                            <img 
                              src={localPreviews[al.id] || al.photo || '/alumni/placeholder.png'} 
                              alt="Alumni Preview" 
                              className="object-cover w-full h-full" 
                            />
                            {uploadingIds[al.id] && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white">
                                Uploading...
                              </div>
                            )}
                          </div>

                          <label className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs px-3 py-2 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer font-medium">
                            <Upload size={12} />
                            Upload Photo
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handlePhotoUpload(e, al.id)} 
                              className="hidden" 
                            />
                          </label>

                          <input 
                            type="text" 
                            value={al.photo} 
                            onChange={(e) => handleUpdateAlumnus(al.id, 'photo', e.target.value)} 
                            placeholder="Photo URL Link" 
                            className="w-full text-[10px] px-2 py-1 border rounded text-center text-gray-500 font-mono" 
                          />
                        </div>

                        {/* Column 2: Data Fields */}
                        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Name Fields */}
                          <div>
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Full Name (English)</label>
                            <input 
                              type="text" 
                              value={al.name_en} 
                              onChange={(e) => handleUpdateAlumnus(al.id, 'name_en', e.target.value)} 
                              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#631012] outline-none text-sm font-semibold" 
                              placeholder="e.g. Dr. Rajesh Sharma" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Full Name (Hindi)</label>
                            <input 
                              type="text" 
                              value={al.name_hn} 
                              onChange={(e) => handleUpdateAlumnus(al.id, 'name_hn', e.target.value)} 
                              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#631012] outline-none text-sm font-semibold" 
                              placeholder="जैसे: डॉ. राजेश शर्मा" 
                            />
                          </div>

                          {/* Batch Fields */}
                          <div>
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Batch / Class (English)</label>
                            <input 
                              type="text" 
                              value={al.batch_en} 
                              onChange={(e) => handleUpdateAlumnus(al.id, 'batch_en', e.target.value)} 
                              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#631012] outline-none text-sm" 
                              placeholder="e.g. B.Tech CSE 1992" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Batch / Class (Hindi)</label>
                            <input 
                              type="text" 
                              value={al.batch_hn} 
                              onChange={(e) => handleUpdateAlumnus(al.id, 'batch_hn', e.target.value)} 
                              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#631012] outline-none text-sm" 
                              placeholder="जैसे: बी.टेक सीएसई 1992" 
                            />
                          </div>

                          {/* Department Fields */}
                          <div>
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Department (English)</label>
                            <input 
                              type="text" 
                              value={al.department_en || ''} 
                              onChange={(e) => handleUpdateAlumnus(al.id, 'department_en', e.target.value)} 
                              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#631012] outline-none text-sm" 
                              placeholder="e.g. Computer Science & Engineering" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Department (Hindi)</label>
                            <input 
                              type="text" 
                              value={al.department_hn || ''} 
                              onChange={(e) => handleUpdateAlumnus(al.id, 'department_hn', e.target.value)} 
                              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#631012] outline-none text-sm" 
                              placeholder="जैसे: कंप्यूटर विज्ञान और इंजीनियरिंग" 
                            />
                          </div>

                          {/* LinkedIn Link (Shared) */}
                          <div className="md:col-span-2">
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">LinkedIn Profile Link</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                              </span>
                              <input 
                                type="text" 
                                value={al.linkedin || ''} 
                                onChange={(e) => handleUpdateAlumnus(al.id, 'linkedin', e.target.value)} 
                                className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#631012] outline-none text-sm" 
                                placeholder="https://linkedin.com/in/username" 
                              />
                            </div>
                          </div>

                          {/* Achievements (English) */}
                          <div className="md:col-span-2">
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Designation & Achievements (English)</label>
                            <textarea 
                              rows={2}
                              value={al.achievement_en} 
                              onChange={(e) => handleUpdateAlumnus(al.id, 'achievement_en', e.target.value)} 
                              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#631012] outline-none text-sm" 
                              placeholder="e.g. CEO & Founder, TechVentures India | Former Director at Google" 
                            />
                          </div>

                          {/* Achievements (Hindi) */}
                          <div className="md:col-span-2">
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Designation & Achievements (Hindi)</label>
                            <textarea 
                              rows={2}
                              value={al.achievement_hn} 
                              onChange={(e) => handleUpdateAlumnus(al.id, 'achievement_hn', e.target.value)} 
                              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#631012] outline-none text-sm" 
                              placeholder="जैसे: सीईओ और संस्थापक, टेकवेंचर्स इंडिया | गूगल में पूर्व निदेशक" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
