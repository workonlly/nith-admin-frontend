'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Plus, Trash2, ShieldCheck, Mail, Phone, Briefcase } from 'lucide-react';

interface NodalOfficer {
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

export default function NodalOfficersAdminPage() {
  const [list, setList] = useState<NodalOfficer[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<NodalOfficer>({
    name: '', name_en: '', name_hi: '', responsibility: '', responsibility_en: '', responsibility_hi: '', phone: '', email: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const isHindi = (text: string) => /[\u0900-\u097F]/.test(text || '');

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/nodal-officers');
      const json = await res.json();
      if (json.success) {
        const mapped = json.data.map((item: any) => ({
          ...item,
          name_en: isHindi(item.name) ? '' : item.name,
          name_hi: isHindi(item.name) ? item.name : '',
          responsibility_en: isHindi(item.responsibility) ? '' : item.responsibility,
          responsibility_hi: isHindi(item.responsibility) ? item.responsibility : '',
        }));
        setList(mapped);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
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
        ? `http://localhost:5000/api/v1/administration/nodal-officers/${editingId}`
        : 'http://localhost:5000/api/v1/administration/nodal-officers';
      
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

  const handleEdit = (item: NodalOfficer) => {
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
    if (!confirm('Delete this entry?')) return;
    try {
      await fetch(`http://localhost:5000/api/v1/administration/nodal-officers/${id}`, { method: 'DELETE' });
      setList(list.filter(item => item.id !== id));
    } catch (err) { alert('Error deleting'); }
  };

  if (loading) return <div className="p-8 text-black">Loading...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <ShieldCheck className="w-10 h-10" />
          <h1 className="text-3xl font-extrabold tracking-tight">Nodal Officers</h1>
        </div>
        <p className="text-white/80 text-lg">Manage nodal officers and their institutional responsibilities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {editingId ? 'Edit Officer' : 'Add New Officer'}
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
                  <textarea value={formData.responsibility_en || ''} onChange={e => setFormData({...formData, responsibility_en: e.target.value, responsibility: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" placeholder="Responsibility (English)" rows={2} required />
                  <textarea value={formData.responsibility_hi || ''} onChange={e => setFormData({...formData, responsibility_hi: e.target.value, responsibility: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" placeholder="जिम्मेदारी (हिंदी)" rows={2} />
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
                  {editingId ? 'Update' : 'Add Officer'}
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
                    <th className="p-4 font-bold text-gray-600">Officer Info</th>
                    <th className="p-4 font-bold text-gray-600">Responsibility</th>
                    <th className="p-4 font-bold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-lg">{item.name}</div>
                        <div className="flex gap-4 mt-1">
                           <span className="text-sm text-gray-600 flex items-center gap-1"><Phone size={14}/> {item.phone || 'N/A'}</span>
                           <span className="text-sm text-[#631012] flex items-center gap-1"><Mail size={14}/> {item.email}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-700 max-w-xs leading-relaxed flex items-start gap-2">
                          <Briefcase size={16} className="mt-1 flex-shrink-0 text-gray-400"/>
                          {item.responsibility}
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
