'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, ExternalLink, Plus, Trash2 } from 'lucide-react';

interface Visitor {
  id?: number;
  name: string;
  title: string;
  description: string;
  website_label: string;
  website_url: string;
}

interface PageInfo {
  hero_heading: string;
  hero_subheading: string;
}

export default function VisitorAdminPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [info, setInfo] = useState<PageInfo>({ hero_heading: '', hero_subheading: '' });
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<Visitor>({
    name: '', title: '', description: '', website_label: '', website_url: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [infoRes, listRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/administration/visitors-info'),
        fetch('http://localhost:5000/api/v1/administration/visitors')
      ]);
      const infoData = await infoRes.json();
      const listData = await listRes.json();
      
      if (infoData.success && infoData.data) setInfo(infoData.data);
      if (listData.success) setVisitors(listData.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/visitors-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      });
      if ((await res.json()).success) alert('Header saved!');
    } catch (err) { alert('Error saving header'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `http://localhost:5000/api/v1/administration/visitors/${editingId}`
        : 'http://localhost:5000/api/v1/administration/visitors';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if ((await res.json()).success) {
        fetchData();
        setFormData({ name: '', title: '', description: '', website_label: '', website_url: '' });
        setEditingId(null);
      }
    } catch (err) { alert('Error saving visitor'); }
  };

  const handleEdit = (v: Visitor) => {
    setFormData(v);
    setEditingId(v.id!);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this visitor?')) return;
    try {
      await fetch(`http://localhost:5000/api/v1/administration/visitors/${id}`, { method: 'DELETE' });
      setVisitors(visitors.filter(v => v.id !== id));
    } catch (err) { alert('Error deleting'); }
  };

  if (loading) return <div className="p-8 text-black font-bold">Loading...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <User className="w-10 h-10" />
          <h1 className="text-3xl font-extrabold tracking-tight">Visitor Management</h1>
        </div>
        <p className="text-white/80 text-lg">Manage institutional visitors and their profiles</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold mb-4 border-b pb-4">Page Header</h2>
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
        <button onClick={handleSaveInfo} className="bg-[#631012] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#800000] flex items-center gap-2">
          <Save size={20} /> Save Headers
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Visitor' : 'Add New Visitor'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Title/Salutation</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" rows={4} />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Website Label</label>
                  <input type="text" value={formData.website_label} onChange={e => setFormData({...formData, website_label: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Website URL</label>
                  <input type="text" value={formData.website_url} onChange={e => setFormData({...formData, website_url: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-[#631012] text-white py-3 rounded-xl font-bold hover:bg-[#800000]">
                  {editingId ? 'Update' : 'Add Visitor'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => {setEditingId(null); setFormData({name:'', title:'', description:'', website_label:'', website_url:''})}} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="grid grid-cols-1 gap-4 p-4">
                {visitors.map(v => (
                  <div key={v.id} className="p-6 border rounded-2xl bg-gray-50 hover:border-[#631012] transition-all relative group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-xs text-gray-400 font-bold uppercase mb-1">{v.title}</div>
                        <h3 className="text-xl font-bold text-gray-900">{v.name}</h3>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={() => handleEdit(v)} className="p-2 text-blue-600 hover:bg-white rounded-xl shadow-sm border"><Save size={18}/></button>
                        <button onClick={() => handleDelete(v.id!)} className="p-2 text-red-600 hover:bg-white rounded-xl shadow-sm border"><Trash2 size={18}/></button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{v.description}</p>
                    {v.website_url && (
                      <a href={v.website_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#631012] font-bold text-sm hover:underline">
                        <ExternalLink size={16}/> {v.website_label || 'Visit Official Website'}
                      </a>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
