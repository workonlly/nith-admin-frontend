'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, Plus, Pencil, Trash2, Loader2, Settings2, Sparkles } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Dept { id: number; name_en: string; name_hn?: string; description_en?: string; photo_url?: string; }

export default function AdminDepartmentsPage() {
  const [depts, setDepts] = useState<Dept[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>({});
  const [msg, setMsg] = useState('');

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const fetchDepts = () => {
    fetch(`${API_BASE}/api/departments`)
      .then(r => r.json())
      .then(d => { setDepts(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchDepts(); }, []);

  const addDept = async () => {
    if (!form.name_en) return alert('Name (EN) is required');
    const r = await fetch(`${API_BASE}/api/departments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    const d = await r.json();
    setDepts(prev => [...prev, d]);
    setForm({}); setShowAdd(false); showMsg('Department added!');
  };

  const deleteDept = async (id: number) => {
    if (!confirm('Delete this department and all its data?')) return;
    await fetch(`${API_BASE}/api/departments/${id}`, { method: 'DELETE' });
    setDepts(prev => prev.filter(d => d.id !== id));
    showMsg('Deleted!');
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#631012] via-[#7a1214] to-[#921b1e] rounded-3xl p-8 text-white shadow-xl shadow-[#631012]/10">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-10 pointer-events-none">
          <Settings2 className="w-96 h-96" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-medium">
              <Building2 className="w-4 h-4" />
              <span>CMS Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Departments</h1>
            <p className="text-white/80">Manage academic departments and their content</p>
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl font-bold text-sm transition-all"
          >
            <Plus size={16} />
            Add Department
          </button>
        </div>
        {msg && <div className="mt-4 inline-block bg-white/20 border border-white/30 text-white text-sm font-medium px-4 py-2 rounded-full">{msg}</div>}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Add New Department</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Name (English) *</label>
              <input value={form.name_en || ''} onChange={e => setForm({ ...form, name_en: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#631012]"
                placeholder="e.g. Computer Science & Engineering" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Name (Hindi)</label>
              <input value={form.name_hn || ''} onChange={e => setForm({ ...form, name_hn: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#631012]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1">Short Description</label>
              <textarea value={form.description_en || ''} onChange={e => setForm({ ...form, description_en: e.target.value })} rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#631012] resize-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addDept} className="px-5 py-2 bg-[#631012] text-white rounded-lg font-bold text-sm hover:bg-[#800000]">
              Create Department
            </button>
            <button onClick={() => { setShowAdd(false); setForm({}); }} className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-200">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#631012]" /></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide w-12">#</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide">Department</th>
                <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wide hidden md:table-cell">Hindi Name</th>
                <th className="p-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {depts.map((dept, i) => (
                <tr key={dept.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 text-gray-500 font-mono text-xs">{i + 1}</td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900 group-hover:text-[#631012] transition-colors">{dept.name_en}</div>
                    {dept.description_en && (
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{dept.description_en.slice(0, 80)}...</div>
                    )}
                  </td>
                  <td className="p-4 text-gray-600 hidden md:table-cell">{dept.name_hn || '-'}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/departments/${dept.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#631012] text-white rounded-lg text-xs font-bold hover:bg-[#800000] transition-colors">
                        <Pencil size={12} />
                        Manage
                      </Link>
                      <button onClick={() => deleteDept(dept.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors">
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {depts.length === 0 && (
                <tr><td colSpan={4} className="p-12 text-center text-gray-500">No departments found. Add one above.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
