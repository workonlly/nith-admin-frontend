'use client';

import React, { useState, useEffect } from 'react';
import { Save, Users, Plus, Trash2, ShieldCheck, Mail, Phone } from 'lucide-react';

interface Coordinator {
  id?: number;
  name: string;
  responsibility: string;
  phone: string;
  email: string;
}

interface PageInfo {
  hero_heading: string;
  hero_subheading: string;
}

export default function InstituteCoordinatorsAdminPage() {
  const [list, setList] = useState<Coordinator[]>([]);
  const [info, setInfo] = useState<PageInfo>({ hero_heading: '', hero_subheading: '' });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Coordinator>({
    name: '', responsibility: '', phone: '', email: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [infoRes, listRes] = await Promise.allSettled([
        fetch('http://localhost:5000/api/v1/administration/institute-coordinators-info'),
        fetch('http://localhost:5000/api/v1/administration/institute-coordinators')
      ]);
      
      if (infoRes.status === 'fulfilled') {
        const data = await infoRes.value.json();
        if (data.success && data.data) setInfo(data.data);
      }
      
      if (listRes.status === 'fulfilled') {
        const data = await listRes.value.json();
        if (data.success) setList(data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/institute-coordinators-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      });
      const json = await res.json();
      if (json.success) alert('Header saved successfully!');
      else alert('Error: ' + json.message);
    } catch (err) { alert('Error saving header'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:5000/api/v1/administration/institute-coordinators/${editingId}`
        : 'http://localhost:5000/api/v1/administration/institute-coordinators';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        fetchData();
        setFormData({ name: '', responsibility: '', phone: '', email: '' });
        setEditingId(null);
      }
    } catch (err) { alert('Error saving'); }
  };

  const handleEdit = (item: Coordinator) => {
    setFormData(item);
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
            <input type="text" value={info.hero_heading} onChange={e => setInfo({...info, hero_heading: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 uppercase">Subheading</label>
            <input type="text" value={info.hero_subheading} onChange={e => setInfo({...info, hero_subheading: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
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
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Responsibility</label>
                <input type="text" value={formData.responsibility} onChange={e => setFormData({...formData, responsibility: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" required />
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
                  <button type="button" onClick={() => {setEditingId(null); setFormData({name:'', responsibility:'', phone:'', email:''})}} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold">
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
