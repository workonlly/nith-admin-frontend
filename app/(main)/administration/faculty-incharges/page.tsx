'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Plus, Trash2, ShieldCheck, Mail, Building } from 'lucide-react';

interface FacultyIncharge {
  id?: number;
  name: string;
  department: string;
  responsibility: string;
  email: string;
}

export default function FacultyInchargesAdminPage() {
  const [list, setList] = useState<FacultyIncharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FacultyIncharge>({
    name: '', department: '', responsibility: '', email: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/faculty-incharges');
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
        ? `http://localhost:5000/api/v1/administration/faculty-incharges/${editingId}`
        : 'http://localhost:5000/api/v1/administration/faculty-incharges';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        fetchData();
        setFormData({ name: '', department: '', responsibility: '', email: '' });
        setEditingId(null);
      }
    } catch (err) { alert('Error saving'); }
  };

  const handleEdit = (item: FacultyIncharge) => {
    setFormData(item);
    setEditingId(item.id!);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await fetch(`http://localhost:5000/api/v1/administration/faculty-incharges/${id}`, { method: 'DELETE' });
      setList(list.filter(item => item.id !== id));
    } catch (err) { alert('Error deleting'); }
  };

  if (loading) return <div className="p-8 text-black">Loading...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <ShieldCheck className="w-10 h-10" />
          <h1 className="text-3xl font-extrabold tracking-tight">Faculty Incharges</h1>
        </div>
        <p className="text-white/80 text-lg">Manage faculty incharges and their responsibilities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {editingId ? 'Edit Incharge' : 'Add New Incharge'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Department</label>
                <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Responsibility</label>
                <input type="text" value={formData.responsibility} onChange={e => setFormData({...formData, responsibility: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]" required />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-[#631012] text-white py-3 rounded-xl font-bold hover:bg-[#800000] transition-all">
                  {editingId ? 'Update' : 'Add Incharge'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => {setEditingId(null); setFormData({name:'', department:'', responsibility:'', email:''})}} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold">
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
                    <th className="p-4 font-bold text-gray-600">Incharge Info</th>
                    <th className="p-4 font-bold text-gray-600">Responsibility</th>
                    <th className="p-4 font-bold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(item => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-lg">{item.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1"><Building size={14}/> {item.department}</div>
                        <div className="text-sm text-[#631012] flex items-center gap-1"><Mail size={14}/> {item.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-[#631012]/10 text-[#631012] px-3 py-1 rounded-full text-sm font-bold">
                          {item.responsibility}
                        </span>
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
