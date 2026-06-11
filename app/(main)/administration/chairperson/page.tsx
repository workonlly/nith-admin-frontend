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
  name_en?: string;
  name_hi?: string;
  years_en?: string;
  years_hi?: string;
}

interface ChairpersonInfo {
  id?: number;
  title: string;
  name: string;
  description: string;
  dates: string;
  image: string;
  title_en?: string;
  title_hi?: string;
  name_en?: string;
  name_hi?: string;
  description_en?: string;
  description_hi?: string;
  dates_en?: string;
  dates_hi?: string;
}

export default function ChairpersonAdminPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'former'>('current');
  const [info, setInfo] = useState<ChairpersonInfo>({
    id: 1, title: '', name: '', description: '', dates: '', image: ''
  });
  const [former, setFormer] = useState<FormerChairperson[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [formerForm, setFormerForm] = useState<FormerChairperson>({ name: '', name_en: '', name_hi: '', years: '', years_en: '', years_hi: '', category: 'NIT' });
  const [showFormerForm, setShowFormerForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const isHindi = (text: string) => /[\u0900-\u097F]/.test(text || '');

  const fetchData = async () => {
    try {
      const [infoRes, formerRes] = await Promise.allSettled([
        fetch('http://localhost:5000/api/v1/administration/chairperson'),
        fetch('http://localhost:5000/api/v1/administration/former-chairpersons')
      ]);

      if (infoRes.status === 'fulfilled') {
        const data = await infoRes.value.json();
        if (data.success && data.data.length > 0) {
          const inf = data.data[0];
          setInfo({
            ...inf,
            title_en: isHindi(inf.title) ? '' : inf.title,
            title_hi: isHindi(inf.title) ? inf.title : '',
            name_en: isHindi(inf.name) ? '' : inf.name,
            name_hi: isHindi(inf.name) ? inf.name : '',
            description_en: isHindi(inf.description) ? '' : inf.description,
            description_hi: isHindi(inf.description) ? inf.description : '',
            dates_en: isHindi(inf.dates) ? '' : inf.dates,
            dates_hi: isHindi(inf.dates) ? inf.dates : '',
          });
        }
      }
      
      if (formerRes.status === 'fulfilled') {
        const data = await formerRes.value.json();
        if (data.success) {
          const mapped = data.data.map((f: any) => ({
            ...f,
            name_en: isHindi(f.name) ? '' : f.name,
            name_hi: isHindi(f.name) ? f.name : '',
            years_en: isHindi(f.years) ? '' : f.years,
            years_hi: isHindi(f.years) ? f.years : '',
          }));
          setFormer(mapped);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    const payload = {
      ...info,
      title: info.title_hi || info.title_en || info.title,
      name: info.name_hi || info.name_en || info.name,
      description: info.description_hi || info.description_en || info.description,
      dates: info.dates_hi || info.dates_en || info.dates
    };
    try {
      const res = await fetch(`http://localhost:5000/api/v1/administration/chairperson/${info.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) alert('Chairperson Info Saved!');
    } catch (err) { alert('Error saving info'); }
  };

  const handleFormerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameVal = formerForm.name_hi || formerForm.name_en || formerForm.name;
    const yearsVal = formerForm.years_hi || formerForm.years_en || formerForm.years;
    if (!nameVal || !yearsVal) return;
    const payload = {
      ...formerForm,
      name: nameVal,
      years: yearsVal
    };
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/former-chairpersons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        fetchData();
        setFormerForm({ name: '', name_en: '', name_hi: '', years: '', years_en: '', years_hi: '', category: formerForm.category });
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
                <div className="flex flex-col gap-2">
                  <input type="text" value={info.name_en || ''} onChange={e => setInfo({...info, name_en: e.target.value, name: e.target.value})} className="w-full p-3 border rounded-xl font-bold bg-gray-50" placeholder="Chairperson Name (English)" />
                  <input type="text" value={info.name_hi || ''} onChange={e => setInfo({...info, name_hi: e.target.value, name: e.target.value})} className="w-full p-3 border rounded-xl font-bold bg-gray-50" placeholder="अध्यक्ष का नाम (हिंदी)" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Title/Designation</label>
                <div className="flex flex-col gap-2">
                  <input type="text" value={info.title_en || ''} onChange={e => setInfo({...info, title_en: e.target.value, title: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="Title/Designation (English)" />
                  <input type="text" value={info.title_hi || ''} onChange={e => setInfo({...info, title_hi: e.target.value, title: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="पद (हिंदी)" />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Message/Profile Description</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <textarea 
                      value={info.description_en || ''} 
                      onChange={e => setInfo({...info, description_en: e.target.value, description: e.target.value})} 
                      className="w-full p-3 border rounded-xl min-h-[200px] bg-gray-50" 
                      placeholder="Paste profile summary or message in English here..."
                    />
                  </div>
                  <div>
                    <textarea 
                      value={info.description_hi || ''} 
                      onChange={e => setInfo({...info, description_hi: e.target.value, description: e.target.value})} 
                      className="w-full p-3 border rounded-xl min-h-[200px] bg-gray-50" 
                      placeholder="विवरण या संदेश यहाँ हिंदी में पेस्ट करें..."
                    />
                  </div>
                </div>
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
                  <div className="flex flex-col gap-2">
                    <input type="text" placeholder="Name (English)" value={formerForm.name_en || ''} onChange={e => setFormerForm({...formerForm, name_en: e.target.value, name: e.target.value})} className="p-2 border rounded-lg" required />
                    <input type="text" placeholder="नाम (हिंदी)" value={formerForm.name_hi || ''} onChange={e => setFormerForm({...formerForm, name_hi: e.target.value, name: e.target.value})} className="p-2 border rounded-lg" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <input type="text" placeholder="Years (e.g. 2010-2015)" value={formerForm.years_en || ''} onChange={e => setFormerForm({...formerForm, years_en: e.target.value, years: e.target.value})} className="p-2 border rounded-lg" required />
                    <input type="text" placeholder="वर्ष कार्यकाल (उदा. 2010-2015)" value={formerForm.years_hi || ''} onChange={e => setFormerForm({...formerForm, years_hi: e.target.value, years: e.target.value})} className="p-2 border rounded-lg" />
                  </div>
                  <div className="flex gap-2 items-end">
                    <button type="submit" className="bg-[#631012] text-white px-4 py-2 rounded-lg font-bold flex-1 h-fit">Save</button>
                    <button type="button" onClick={() => setShowFormerForm(false)} className="bg-gray-200 px-4 py-2 rounded-lg font-bold h-fit">Cancel</button>
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
