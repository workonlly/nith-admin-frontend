'use client';

import React, { useState, useEffect } from 'react';
import { Save, Users, Plus, Trash2, ShieldCheck, Mail, Phone } from 'lucide-react';

interface Coordinator {
  id?: number;
  name: string;
  responsibility: string;
  phone: string;
  email: string;
  name_en?: string;
  name_hi?: string;
  responsibility_en?: string;
  responsibility_hi?: string;
}

interface PageInfo {
  hero_heading: string;
  hero_subheading: string;
  hero_heading_en?: string;
  hero_heading_hi?: string;
  hero_subheading_en?: string;
  hero_subheading_hi?: string;
}

export default function InstituteCoordinatorsAdminPage() {
  const [list, setList] = useState<Coordinator[]>([]);
  const [info, setInfo] = useState<PageInfo>({ hero_heading: '', hero_subheading: '', hero_heading_en: '', hero_heading_hi: '', hero_subheading_en: '', hero_subheading_hi: '' });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Coordinator>({
    name: '', name_en: '', name_hi: '', responsibility: '', responsibility_en: '', responsibility_hi: '', phone: '', email: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const isHindi = (text: string) => /[\u0900-\u097F]/.test(text || '');

  const fetchData = async () => {
    try {
      const [infoRes, listRes] = await Promise.allSettled([
        fetch('http://localhost:5000/api/v1/administration/institute-coordinators-info'),
        fetch('http://localhost:5000/api/v1/administration/institute-coordinators')
      ]);
      
      if (infoRes.status === 'fulfilled') {
        const data = await infoRes.value.json();
        if (data.success && data.data) {
          const loaded = data.data;
          setInfo({
            ...loaded,
            hero_heading_en: isHindi(loaded.hero_heading) ? '' : loaded.hero_heading,
            hero_heading_hi: isHindi(loaded.hero_heading) ? loaded.hero_heading : '',
            hero_subheading_en: isHindi(loaded.hero_subheading) ? '' : loaded.hero_subheading,
            hero_subheading_hi: isHindi(loaded.hero_subheading) ? loaded.hero_subheading : '',
          });
        }
      }
      
      if (listRes.status === 'fulfilled') {
        const data = await listRes.value.json();
        if (data.success) {
          const mapped = data.data.map((item: any) => ({
            ...item,
            name_en: isHindi(item.name) ? '' : item.name,
            name_hi: isHindi(item.name) ? item.name : '',
            responsibility_en: isHindi(item.responsibility) ? '' : item.responsibility,
            responsibility_hi: isHindi(item.responsibility) ? item.responsibility : '',
          }));
          setList(mapped);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    const heroVal = info.hero_heading_hi || info.hero_heading_en || info.hero_heading;
    const subVal = info.hero_subheading_hi || info.hero_subheading_en || info.hero_subheading;
    if (!heroVal || !subVal) return;
    const payload = {
      ...info,
      hero_heading: heroVal,
      hero_subheading: subVal
    };
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/institute-coordinators-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) alert('Header saved successfully!');
      else alert('Error: ' + json.message);
    } catch (err) { alert('Error saving header'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameVal = formData.name_hi || formData.name_en || formData.name;
    const responsibilityVal = formData.responsibility_hi || formData.responsibility_en || formData.responsibility;
    if (!nameVal || !responsibilityVal) return;
    const payload = {
      ...formData,
      name: nameVal,
      responsibility: responsibilityVal
    };
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:5000/api/v1/administration/institute-coordinators/${editingId}`
        : 'http://localhost:5000/api/v1/administration/institute-coordinators';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        fetchData();
        setFormData({ name: '', name_en: '', name_hi: '', responsibility: '', responsibility_en: '', responsibility_hi: '', phone: '', email: '' });
        setEditingId(null);
      }
    } catch (err) { alert('Error saving'); }
  };

  const handleEdit = (item: Coordinator) => {
    setFormData({
      ...item,
      name_en: isHindi(item.name) ? '' : item.name,
      name_hi: isHindi(item.name) ? item.name : '',
      responsibility_en: isHindi(item.responsibility) ? '' : item.responsibility,
      responsibility_hi: isHindi(item.responsibility) ? item.responsibility : '',
    });
    setEditingId(item.id!);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this coordinator?')) return;
    try {
      await fetch(`http://localhost:5000/api/v1/administration/institute-coordinators/${id}`, { method: 'DELETE' });
      setList(list.filter(item => item.id !== id));
    } catch (err) { alert('Error deleting'); }
  };

  if (loading) return <div className="p-8 text-black">Loading...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <Users className="w-10 h-10" />
          <h1 className="text-3xl font-extrabold tracking-tight">Institute Coordinators</h1>
        </div>
        <p className="text-white/80 text-lg">Manage institutional coordinators and their domains</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-4">Page Header Editor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 uppercase">Heading</label>
            <div className="flex flex-col gap-2">
              <input type="text" value={info.hero_heading_en || ''} onChange={e => setInfo({...info, hero_heading_en: e.target.value, hero_heading: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="Heading (English)" />
              <input type="text" value={info.hero_heading_hi || ''} onChange={e => setInfo({...info, hero_heading_hi: e.target.value, hero_heading: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="शीर्षक (हिंदी)" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 uppercase">Subheading</label>
            <div className="flex flex-col gap-2">
              <input type="text" value={info.hero_subheading_en || ''} onChange={e => setInfo({...info, hero_subheading_en: e.target.value, hero_subheading: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="Subheading (English)" />
              <input type="text" value={info.hero_subheading_hi || ''} onChange={e => setInfo({...info, hero_subheading_hi: e.target.value, hero_subheading: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="उपशीर्षक (हिंदी)" />
            </div>
          </div>
        </div>
        <button onClick={handleSaveInfo} className="bg-[#631012] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#800000] transition-all flex items-center gap-2">
          <Save size={20} /> Save Headers
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {editingId ? 'Edit Coordinator' : 'Add New Coordinator'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Name</label>
                <div className="flex flex-col gap-2">
                  <input type="text" value={formData.name_en || ''} onChange={e => setFormData({...formData, name_en: e.target.value, name: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" placeholder="Name (English)" required />
                  <input type="text" value={formData.name_hi || ''} onChange={e => setFormData({...formData, name_hi: e.target.value, name: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" placeholder="नाम (हिंदी)" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Responsibility</label>
                <div className="flex flex-col gap-2">
                  <input type="text" value={formData.responsibility_en || ''} onChange={e => setFormData({...formData, responsibility_en: e.target.value, responsibility: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" placeholder="Responsibility (English)" required />
                  <input type="text" value={formData.responsibility_hi || ''} onChange={e => setFormData({...formData, responsibility_hi: e.target.value, responsibility: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" placeholder="जिम्मेदारी (हिंदी)" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Phone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" required />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-[#631012] text-white py-3 rounded-xl font-bold hover:bg-[#800000] transition-all">
                  {editingId ? 'Update' : 'Add Coordinator'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => {setEditingId(null); setFormData({name:'', name_en:'', name_hi:'', responsibility:'', responsibility_en:'', responsibility_hi:'', phone:'', email:''})}} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-4 font-bold text-gray-600">Coordinator Info</th>
                    <th className="p-4 font-bold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-lg">{item.name}</div>
                        <div className="text-sm text-[#631012] font-bold bg-[#631012]/5 w-fit px-2 py-0.5 rounded mt-1 mb-2">
                          {item.responsibility}
                        </div>
                        <div className="flex gap-4">
                           <span className="text-sm text-gray-600 flex items-center gap-1"><Phone size={14}/> {item.phone || 'N/A'}</span>
                           <span className="text-sm text-gray-600 flex items-center gap-1"><Mail size={14}/> {item.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Save size={18}/></button>
                          <button onClick={() => handleDelete(item.id!)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
