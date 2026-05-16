'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Plus, Trash2, FileText, Users, Award, Building } from 'lucide-react';

interface FormerChairperson {
  id?: number;
  name: string;
  years: string;
  category: 'NIT' | 'REC';
  image?: string;
  note?: string;
}

interface ChairpersonInfo {
  id?: number;
  title: string;
  name: string;
  description: string;
  dates: string;
  image: string;
}

export default function ChairpersonAdminPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'former'>('current');
  const [info, setInfo] = useState<ChairpersonInfo>({
    id: 1, title: '', name: '', description: '', dates: '', image: ''
  });
  const [former, setFormer] = useState<FormerChairperson[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [formerForm, setFormerForm] = useState<FormerChairperson>({ name: '', years: '', category: 'NIT' });
  const [showFormerForm, setShowFormerForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [infoRes, formerRes] = await Promise.allSettled([
        fetch('http://localhost:5000/api/v1/administration/chairperson'),
        fetch('http://localhost:5000/api/v1/administration/former-chairpersons')
      ]);

      if (infoRes.status === 'fulfilled') {
        const data = await infoRes.value.json();
        if (data.success && data.data.length > 0) setInfo(data.data[0]);
      }
      
      if (formerRes.status === 'fulfilled') {
        const data = await formerRes.value.json();
        if (data.success) setFormer(data.data);
      }

      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/administration/chairperson/${info.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      });
      const json = await res.json();
      if (json.success) alert('Chairperson Info Saved!');
    } catch (err) { alert('Error saving info'); }
  };

  const handleFormerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formerForm.name || !formerForm.years) return;
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/former-chairpersons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formerForm)
      });
      const json = await res.json();
      if (json.success) {
        setFormer([json.data, ...former]);
        setFormerForm({ name: '', years: '', category: formerForm.category });
        setShowFormerForm(false);
        alert('Former Chairperson Added!');
      }
    } catch (err) { alert('Error adding'); }
  };

  const handleDeleteFormer = async (id: number) => {
    if (!confirm('Delete?')) return;
    try {
      await fetch(`http://localhost:5000/api/v1/administration/former-chairpersons/${id}`, { method: 'DELETE' });
      setFormer(former.filter(f => f.id !== id));
    } catch (err) { alert('Error deleting'); }
  };

  if (loading) return <div className="p-8 text-black">Loading Chairperson Data...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <User className="w-10 h-10" />
          <h1 className="text-3xl font-extrabold tracking-tight">Chairperson Section</h1>
        </div>
        <p className="text-white/80 text-lg">Manage current chairperson info and former chairpersons</p>
      </div>

      <div className="flex gap-2 border-b overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('current')}
          className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${
            activeTab === 'current' ? 'bg-[#631012] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border'
          }`}
        >
          Current Chairperson
        </button>
        <button
          onClick={() => setActiveTab('former')}
          className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${
            activeTab === 'former' ? 'bg-[#631012] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border'
          }`}
        >
          Former Chairpersons
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {activeTab === 'current' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-4"><User className="text-[#631012]" /> Current Chairperson</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Chairperson Name</label>
                <input type="text" value={info.name} onChange={e => setInfo({...info, name: e.target.value})} className="w-full p-3 border rounded-xl font-bold bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Title/Designation</label>
                <input type="text" value={info.title} onChange={e => setInfo({...info, title: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Message/Profile Description</label>
                <textarea 
                  value={info.description} 
                  onChange={e => setInfo({...info, description: e.target.value})} 
                  className="w-full p-3 border rounded-xl min-h-[200px] bg-gray-50" 
                  placeholder="Paste profile summary or message here..."
                />
              </div>
            </div>
            <button onClick={handleSaveInfo} className="bg-[#631012] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#800000] transition-all flex items-center gap-2">
              <Save size={20} /> Save Changes
            </button>
          </div>
        )}

        {activeTab === 'former' && (
          <div className="space-y-8">
            {showFormerForm && (
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-[#631012]/10 mb-8 animate-in fade-in slide-in-from-top-4">
                <h3 className="text-lg font-bold mb-4">Add Former {formerForm.category === 'NIT' ? 'Chairperson' : 'Chairman (REC)'}</h3>
                <form onSubmit={handleFormerSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Name" value={formerForm.name} onChange={e => setFormerForm({...formerForm, name: e.target.value})} className="p-2 border rounded-lg" required />
                  <input type="text" placeholder="Years (e.g. 2010-2015)" value={formerForm.years} onChange={e => setFormerForm({...formerForm, years: e.target.value})} className="p-2 border rounded-lg" required />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-[#631012] text-white px-4 py-2 rounded-lg font-bold flex-1">Save</button>
                    <button type="button" onClick={() => setShowFormerForm(false)} className="bg-gray-200 px-4 py-2 rounded-lg font-bold">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Users className="text-[#631012]" /> Former NIT Chairpersons</h2>
                <button onClick={() => { setFormerForm({...formerForm, category: 'NIT'}); setShowFormerForm(true); }} className="bg-[#631012] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={18}/> Add</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {former.filter(f => f.category === 'NIT').map(f => (
                  <div key={f.id} className="p-4 border rounded-xl bg-gray-50 relative group">
                    <button onClick={() => handleDeleteFormer(f.id!)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    <p className="font-bold text-[#631012]">{f.name}</p>
                    <p className="text-sm text-gray-500">{f.years}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Building className="text-[#631012]" /> Former REC Chairmen</h2>
                <button onClick={() => { setFormerForm({...formerForm, category: 'REC'}); setShowFormerForm(true); }} className="bg-[#631012] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={18}/> Add</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {former.filter(f => f.category === 'REC').map(f => (
                  <div key={f.id} className="p-4 border rounded-xl bg-gray-50 relative group">
                    <button onClick={() => handleDeleteFormer(f.id!)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    <p className="font-bold text-[#631012]">{f.name}</p>
                    <p className="text-sm text-gray-500">{f.years}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
