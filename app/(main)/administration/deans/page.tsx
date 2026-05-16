'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Plus, Trash2, Users } from 'lucide-react';

interface DeanMember {
  id?: number;
  name: string;
  title?: string;
  responsibility: string;
  phone: string;
  email: string;
  category: string;
  designation?: string;
}

export default function DeansPage() {
  const [deans, setDeans] = useState<DeanMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeans();
  }, []);

  const fetchDeans = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/deans');
      const json = await res.json();
      if (json.success) setDeans(json.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching deans:', err);
      setLoading(false);
    }
  };

  const handleSave = async (dean: DeanMember) => {
    const method = dean.id ? 'PUT' : 'POST';
    const url = dean.id 
      ? `http://localhost:5000/api/v1/administration/deans/${dean.id}`
      : 'http://localhost:5000/api/v1/administration/deans';

    const payload = {
      ...dean,
      title: dean.designation || dean.title
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if ((await res.json()).success) {
        alert('Saved!');
        fetchDeans();
      }
    } catch (err) { alert('Error saving'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete?')) return;
    await fetch(`http://localhost:5000/api/v1/administration/deans/${id}`, { method: 'DELETE' });
    setDeans(deans.filter(d => d.id !== id));
  };

  const addEmptyDean = () => {
    setDeans([{ name: '', title: '', responsibility: '', phone: '', email: '', category: 'Dean' }, ...deans]);
  };

  if (loading) return <div className="p-8 text-black font-bold">Loading...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      <div className="bg-gradient-to-r from-[#800000] to-[#631012] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <Users className="w-10 h-10" />
          <h1 className="text-3xl font-extrabold tracking-tight">Deans & Associate Deans</h1>
        </div>
        <p className="text-white/80 text-lg">Manage institutional leadership and categories</p>
      </div>

      <button onClick={addEmptyDean} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 hover:border-[#800000] hover:text-[#800000] transition-all flex items-center justify-center gap-2 bg-white">
        <Plus size={24} /> <span className="font-bold">Add New Entry</span>
      </button>

      <div className="space-y-4">
        {deans.map((d, i) => (
          <div key={d.id || `new-${i}`} className="bg-white p-6 rounded-2xl border shadow-sm group">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Category</label>
                <select value={d.category} onChange={e => {
                  const next = [...deans];
                  next[i].category = e.target.value;
                  setDeans(next);
                }} className="w-full p-2 border rounded-lg bg-gray-50 font-bold text-[#631012]">
                  <option value="Dean">Dean</option>
                  <option value="Associate Dean">Associate Dean</option>
                </select>
              </div>
              <div className="space-y-1 lg:col-span-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Name</label>
                <input type="text" value={d.name} onChange={e => {
                  const next = [...deans];
                  next[i].name = e.target.value;
                  setDeans(next);
                }} className="w-full p-2 border rounded-lg" placeholder="Name" />
              </div>
              <div className="space-y-1 lg:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Responsibility</label>
                <input type="text" value={d.responsibility} onChange={e => {
                  const next = [...deans];
                  next[i].responsibility = e.target.value;
                  setDeans(next);
                }} className="w-full p-2 border rounded-lg" placeholder="Responsibility" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Title / Dept</label>
                <input type="text" value={d.title || d.designation} onChange={e => {
                  const next = [...deans];
                  next[i].title = e.target.value;
                  setDeans(next);
                }} className="w-full p-2 border rounded-lg text-xs" placeholder="Professor..." />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Email</label>
                <input type="email" value={d.email} onChange={e => {
                  const next = [...deans];
                  next[i].email = e.target.value;
                  setDeans(next);
                }} className="w-full p-2 border rounded-lg text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Phone</label>
                <input type="text" value={d.phone} onChange={e => {
                  const next = [...deans];
                  next[i].phone = e.target.value;
                  setDeans(next);
                }} className="w-full p-2 border rounded-lg text-xs" />
              </div>
              <div className="flex items-end gap-2">
                <button onClick={() => handleSave(d)} className="flex-1 bg-[#631012] text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#800000]">
                  <Save size={16}/> Save
                </button>
                {d.id && (
                  <button onClick={() => handleDelete(d.id!)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100">
                    <Trash2 size={20}/>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
