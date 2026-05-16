'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Plus, Trash2, ShieldCheck, Mail, Phone, Image as ImageIcon, FileText } from 'lucide-react';

interface Registrar {
  id?: number;
  name: string;
  image: string;
  email: string;
  phone: string;
  profile_summary_en: string[];
  profile_summary_hi: string[];
}

interface Staff {
  id?: number;
  name: string;
  designation: string;
  phone: string;
  email: string;
  is_registrar: boolean;
}

export default function RegistrarAdminPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'office'>('profile');
  const [registrar, setRegistrar] = useState<Registrar>({
    name: '', image: '', email: '', phone: '', profile_summary_en: [''], profile_summary_hi: ['']
  });
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Staff Form
  const [staffForm, setStaffForm] = useState<Staff>({
    name: '', designation: '', phone: '', email: '', is_registrar: false
  });
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [regRes, staffRes] = await Promise.allSettled([
        fetch('http://localhost:5000/api/v1/administration/registrar'),
        fetch('http://localhost:5000/api/v1/administration/registrar-office')
      ]);
      
      if (regRes.status === 'fulfilled') {
        const data = await regRes.value.json();
        if (data.success && data.data) {
          // Ensure arrays are initialized
          const reg = data.data;
          reg.profile_summary_en = reg.profile_summary_en || [''];
          reg.profile_summary_hi = reg.profile_summary_hi || [''];
          setRegistrar(reg);
        }
      }

      if (staffRes.status === 'fulfilled') {
        const data = await staffRes.value.json();
        if (data.success) setStaffList(data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSaveRegistrar = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrar)
      });
      const json = await res.json();
      if (json.success) alert('Registrar profile saved successfully!');
      else alert('Error: ' + json.message);
    } catch (err) { alert('Error saving profile'); }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingStaffId ? 'PUT' : 'POST';
      const url = editingStaffId 
        ? `http://localhost:5000/api/v1/administration/registrar-office/${editingStaffId}`
        : 'http://localhost:5000/api/v1/administration/registrar-office';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffForm)
      });
      const json = await res.json();
      if (json.success) {
        alert('Staff member saved!');
        fetchData();
        setStaffForm({ name: '', designation: '', phone: '', email: '', is_registrar: false });
        setEditingStaffId(null);
      } else {
        alert('Error: ' + json.message);
      }
    } catch (err) { alert('Error saving staff'); }
  };

  const handleDeleteStaff = async (id: number) => {
    if (!confirm('Delete this staff member?')) return;
    try {
      await fetch(`http://localhost:5000/api/v1/administration/registrar-office/${id}`, { method: 'DELETE' });
      setStaffList(staffList.filter(s => s.id !== id));
    } catch (err) { alert('Error deleting'); }
  };

  if (loading) return <div className="p-8 text-black font-bold">Loading...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-8 text-black bg-[#F8F9FA] min-h-screen font-sans">
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <ShieldCheck className="w-10 h-10" />
          <h1 className="text-3xl font-extrabold tracking-tight">Registrar Administration</h1>
        </div>
        <p className="text-white/80 text-lg">Manage Registrar profile and office staff</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button onClick={() => setActiveTab('profile')} className={`pb-4 px-6 font-bold transition-all ${activeTab === 'profile' ? 'border-b-4 border-[#631012] text-[#631012]' : 'text-gray-400'}`}>
          Registrar Profile
        </button>
        <button onClick={() => setActiveTab('office')} className={`pb-4 px-6 font-bold transition-all ${activeTab === 'office' ? 'border-b-4 border-[#631012] text-[#631012]' : 'text-gray-400'}`}>
          Office Staff
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><User className="text-[#631012]"/> Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Name</label>
                  <input type="text" value={registrar.name} onChange={e => setRegistrar({...registrar, name: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Image URL</label>
                  <div className="flex gap-2">
                    <input type="text" value={registrar.image} onChange={e => setRegistrar({...registrar, image: e.target.value})} className="flex-1 p-3 border rounded-xl bg-gray-50" />
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden border">
                      {registrar.image && <img src={registrar.image} className="w-full h-full object-cover" alt="prev" />}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Email</label>
                    <input type="email" value={registrar.email} onChange={e => setRegistrar({...registrar, email: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Phone</label>
                    <input type="text" value={registrar.phone} onChange={e => setRegistrar({...registrar, phone: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
                  </div>
                </div>
              </div>
            </div>

            <button onClick={handleSaveRegistrar} className="w-full bg-[#631012] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#800000] transition-all flex items-center justify-center gap-2">
              <Save size={24} /> Save Profile Changes
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FileText className="text-[#631012]"/> Profile Summary (English)</h2>
              <div className="space-y-4">
                {registrar.profile_summary_en.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <textarea value={p} onChange={e => {
                      const updated = [...registrar.profile_summary_en];
                      updated[i] = e.target.value;
                      setRegistrar({...registrar, profile_summary_en: updated});
                    }} className="flex-1 p-3 border rounded-xl bg-gray-50 min-h-[100px]" />
                    <button onClick={() => {
                      const updated = registrar.profile_summary_en.filter((_, idx) => idx !== i);
                      setRegistrar({...registrar, profile_summary_en: updated});
                    }} className="text-red-500 p-2 h-fit hover:bg-red-50 rounded-lg"><Trash2 size={20}/></button>
                  </div>
                ))}
                <button onClick={() => setRegistrar({...registrar, profile_summary_en: [...registrar.profile_summary_en, '']})} className="text-[#631012] font-bold flex items-center gap-1 hover:underline">
                  <Plus size={18}/> Add Paragraph
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FileText className="text-[#631012]"/> Profile Summary (Hindi)</h2>
              <div className="space-y-4">
                {registrar.profile_summary_hi.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <textarea value={p} onChange={e => {
                      const updated = [...registrar.profile_summary_hi];
                      updated[i] = e.target.value;
                      setRegistrar({...registrar, profile_summary_hi: updated});
                    }} className="flex-1 p-3 border rounded-xl bg-gray-50 min-h-[100px]" />
                    <button onClick={() => {
                      const updated = registrar.profile_summary_hi.filter((_, idx) => idx !== i);
                      setRegistrar({...registrar, profile_summary_hi: updated});
                    }} className="text-red-500 p-2 h-fit hover:bg-red-50 rounded-lg"><Trash2 size={20}/></button>
                  </div>
                ))}
                <button onClick={() => setRegistrar({...registrar, profile_summary_hi: [...registrar.profile_summary_hi, '']})} className="text-[#631012] font-bold flex items-center gap-1 hover:underline">
                  <Plus size={18}/> Add Paragraph
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
                <h2 className="text-xl font-bold mb-6">{editingStaffId ? 'Edit Staff' : 'Add Staff Member'}</h2>
                <form onSubmit={handleStaffSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Name</label>
                    <input type="text" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Designation</label>
                    <input type="text" value={staffForm.designation} onChange={e => setStaffForm({...staffForm, designation: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Phone</label>
                    <input type="text" value={staffForm.phone} onChange={e => setStaffForm({...staffForm, phone: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-1 uppercase">Email</label>
                    <input type="text" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={staffForm.is_registrar} onChange={e => setStaffForm({...staffForm, is_registrar: e.target.checked})} className="w-5 h-5 accent-[#631012]" id="is_registrar" />
                    <label htmlFor="is_registrar" className="text-sm font-bold text-gray-600">Mark as Registrar (Main Row)</label>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-[#631012] text-white py-3 rounded-xl font-bold hover:bg-[#800000]">
                      {editingStaffId ? 'Update' : 'Add Staff'}
                    </button>
                    {editingStaffId && (
                      <button type="button" onClick={() => {setEditingStaffId(null); setStaffForm({name:'', designation:'', phone:'', email:'', is_registrar: false})}} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
             </div>
          </div>
          
          <div className="lg:col-span-2">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-4 font-bold text-gray-600">Staff Info</th>
                      <th className="p-4 font-bold text-gray-600">Designation</th>
                      <th className="p-4 font-bold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map(s => (
                      <tr key={s.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold flex items-center gap-2">
                            {s.name}
                            {s.is_registrar && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">REGISTRAR</span>}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex gap-4">
                            <span><Phone size={12} className="inline mr-1"/> {s.phone}</span>
                            <span><Mail size={12} className="inline mr-1"/> {s.email}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-medium text-[#631012]">{s.designation}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => {setEditingStaffId(s.id!); setStaffForm(s)}} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-2"><Save size={18}/></button>
                          <button onClick={() => handleDeleteStaff(s.id!)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
