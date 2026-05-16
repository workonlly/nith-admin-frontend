'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Plus, Trash2, Calendar, LayoutGrid } from 'lucide-react';

interface FormerChairperson {
  id?: number;
  name: string;
  years: string;
  image: string;
  category: string;
  note?: string;
}

export default function FormerChairpersonsAdminPage() {
  const [list, setList] = useState<FormerChairperson[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormerChairperson>({
    name: '', years: '', image: '', category: 'NIT', note: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/former-chairpersons');
      const json = await res.json();
      if (json.success) setList(json.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:5000/api/v1/administration/former-chairpersons/${editingId}`
        : 'http://localhost:5000/api/v1/administration/former-chairpersons';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if ((await res.json()).success) {
        fetchData();
        setFormData({ name: '', years: '', image: '', category: 'NIT', note: '' });
        setEditingId(null);
      }
    } catch (err) { alert('Error saving'); }
  };

  const handleEdit = (item: FormerChairperson) => {
    setFormData(item);
    setEditingId(item.id!);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await fetch(`http://localhost:5000/api/v1/administration/former-chairpersons/${id}`, { method: 'DELETE' });
      setList(list.filter(item => item.id !== id));
    } catch (err) { alert('Error deleting'); }
  };

  if (loading) return <div className="p-8 text-black font-bold">Loading...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <Calendar className="w-10 h-10" />
          <h1 className="text-3xl font-extrabold tracking-tight">Former Chairpersons</h1>
        </div>
        <p className="text-white/80 text-lg">Manage historical records of institute chairpersons</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Record' : 'Add New Record'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 font-bold text-[#631012]">
                  <option value="NIT">NIT Hamirpur</option>
                  <option value="REC">REC Hamirpur</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Years / Tenure</label>
                <input type="text" value={formData.years} onChange={e => setFormData({...formData, years: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="e.g. 2018 to 2021" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Image URL</label>
                <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Note (Optional)</label>
                <input type="text" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-[#631012] text-white py-3 rounded-xl font-bold hover:bg-[#800000]">
                  {editingId ? 'Update' : 'Add Record'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => {setEditingId(null); setFormData({name:'', years:'', image:'', category:'NIT', note:''})}} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {list.map(item => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border p-4 flex gap-4 items-center group relative">
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">{item.category} Chairperson</div>
                  <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                  <div className="text-sm text-[#631012] font-medium">{item.years}</div>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all absolute right-2 top-2 bg-white/80 p-1 rounded-lg backdrop-blur-sm shadow-sm border">
                   <button onClick={() => handleEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Save size={16}/></button>
                   <button onClick={() => handleDelete(item.id!)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
