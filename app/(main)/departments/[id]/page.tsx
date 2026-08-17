'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Loader2, Plus, Pencil, Trash2, Save, X, Upload, ChevronDown, ChevronUp } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const SECTION_TABS = [
  { key: 'info', label: 'Dept Info' },
  { key: 'vision', label: 'Vision & Mission' },
  { key: 'faculty', label: 'Faculty' },
  { key: 'staff', label: 'Staff' },
  { key: 'programmes', label: 'Programmes' },
  { key: 'labs', label: 'Labs' },
  { key: 'research_pub', label: 'Publications' },
  { key: 'research_proj', label: 'Projects' },
  { key: 'research_written', label: 'Books/Chapters' },
  { key: 'research_super', label: 'Supervision' },
  { key: 'contact', label: 'Contact' },
];

export default function AdminDeptDetailPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Forms
  const [deptForm, setDeptForm] = useState<any>({});
  const [visionForm, setVisionForm] = useState<any>({});
  const [contactForm, setContactForm] = useState<any>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Inline lists
  const [newFaculty, setNewFaculty] = useState<any>({});
  const [newStaff, setNewStaff] = useState<any>({});
  const [newProg, setNewProg] = useState<any>({});
  const [newLab, setNewLab] = useState<any>({});
  const [newPub, setNewPub] = useState<any>({});
  const [newProj, setNewProj] = useState<any>({});
  const [newWritten, setNewWritten] = useState<any>({});
  const [newSuper, setNewSuper] = useState<any>({});

  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddProg, setShowAddProg] = useState(false);
  const [showAddLab, setShowAddLab] = useState(false);
  const [showAddPub, setShowAddPub] = useState(false);
  const [showAddProj, setShowAddProj] = useState(false);
  const [showAddWritten, setShowAddWritten] = useState(false);
  const [showAddSuper, setShowAddSuper] = useState(false);

  // Sub-lists state
  const [faculty, setFaculty] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [labs, setLabs] = useState<any[]>([]);
  const [pubs, setPubs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [written, setWritten] = useState<any[]>([]);
  const [supervision, setSupervision] = useState<any[]>([]);

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const fetchAll = async () => {
    const r = await fetch(`${API_BASE}/api/departments/${params.id}`);
    const d = await r.json();
    setData(d);
    setDeptForm(d.department || {});
    setVisionForm(d.vision || {});
    setContactForm(d.contact || {});
    setFaculty(d.faculty || []);
    setStaff(d.staff || []);
    setProgrammes(d.programmes || []);
    setLabs(d.labs || []);
    setPubs(d.research?.publications || []);
    setProjects(d.research?.projects || []);
    setWritten(d.research?.written || []);
    setSupervision(d.research?.supervision || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [params.id]);

  // ── Generic helpers ─────────────────────────────────────────────────────────
  const saveInfo = async () => {
    setSaving(true);
    const fd = new FormData();
    Object.keys(deptForm).forEach(k => { if (k !== 'photo_url' && k !== 'id') fd.append(k, deptForm[k] || ''); });
    if (photoFile) fd.append('photo_file', photoFile);
    await fetch(`${API_BASE}/api/departments/${params.id}`, { method: 'PUT', body: fd });
    setSaving(false); showMsg('Saved!');
  };

  const saveVision = async () => {
    setSaving(true);
    await fetch(`${API_BASE}/api/departments/${params.id}/vision`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(visionForm),
    });
    setSaving(false); showMsg('Saved!');
  };

  const saveContact = async () => {
    setSaving(true);
    await fetch(`${API_BASE}/api/departments/${params.id}/contact`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contactForm),
    });
    setSaving(false); showMsg('Saved!');
  };

  const addItem = async (url: string, body: any, setter: React.Dispatch<React.SetStateAction<any[]>>, listKey: string) => {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const item = await r.json();
    setter((prev: any[]) => [...prev, item]);
    showMsg('Added!');
  };

  const deleteItem = async (url: string, id: number, setter: React.Dispatch<React.SetStateAction<any[]>>) => {
    if (!confirm('Delete?')) return;
    await fetch(url, { method: 'DELETE' });
    setter((prev: any[]) => prev.filter((x: any) => x.id !== id));
    showMsg('Deleted!');
  };

  // ── Field helpers ───────────────────────────────────────────────────────────
  const Field = ({ label, value, onChange, textarea = false }: any) => (
    <div>
      <label className="block text-xs font-bold text-gray-600 mb-1">{label}</label>
      {textarea
        ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={4} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#631012] resize-none" />
        : <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#631012]" />
      }
    </div>
  );

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-[#631012]" />
    </div>
  );

  const deptName = data?.department?.name_en || 'Department';

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/departments" className="hover:text-[#631012]">Departments</Link>
        <ChevronRight size={14} />
        <span className="font-bold text-gray-900">{deptName}</span>
      </div>

      <div className="bg-gradient-to-r from-[#631012] to-[#8a1a1c] text-white rounded-xl p-6">
        <h1 className="text-2xl font-bold">Manage: {deptName}</h1>
        {msg && <div className="mt-2 text-sm bg-white/20 text-white px-3 py-1.5 rounded inline-block">{msg}</div>}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-0">
        {SECTION_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-xs font-bold rounded-t transition-colors border-b-2 ${
              activeTab === t.key
                ? 'border-[#631012] text-[#631012] bg-red-50'
                : 'border-transparent text-gray-600 hover:text-[#631012]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── DEPT INFO ─────────────────────────────────────────────────────── */}
      {activeTab === 'info' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Department Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name (English)" value={deptForm.name_en} onChange={(v: string) => setDeptForm({ ...deptForm, name_en: v })} />
            <Field label="Name (Hindi)" value={deptForm.name_hn} onChange={(v: string) => setDeptForm({ ...deptForm, name_hn: v })} />
          </div>
          <Field label="Description (English)" value={deptForm.description_en} onChange={(v: string) => setDeptForm({ ...deptForm, description_en: v })} textarea />
          <Field label="Description (Hindi)" value={deptForm.description_hn} onChange={(v: string) => setDeptForm({ ...deptForm, description_hn: v })} textarea />

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Department Photo</label>
            {deptForm.photo_url && (
              <img src={deptForm.photo_url} alt="Dept" className="h-32 object-cover rounded border mb-2" />
            )}
            <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files?.[0] || null)}
              className="block text-sm text-gray-600" />
          </div>

          <button onClick={saveInfo} disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#631012] text-white rounded font-bold text-sm hover:bg-[#800000] disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Info
          </button>
        </div>
      )}

      {/* ── VISION ───────────────────────────────────────────────────────── */}
      {activeTab === 'vision' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Vision & Mission</h2>
          <Field label="Vision (English)" value={visionForm.vision_en} onChange={(v: string) => setVisionForm({ ...visionForm, vision_en: v })} textarea />
          <Field label="Vision (Hindi)" value={visionForm.vision_hn} onChange={(v: string) => setVisionForm({ ...visionForm, vision_hn: v })} textarea />
          <Field label="Mission (English)" value={visionForm.mission_en} onChange={(v: string) => setVisionForm({ ...visionForm, mission_en: v })} textarea />
          <Field label="Mission (Hindi)" value={visionForm.mission_hn} onChange={(v: string) => setVisionForm({ ...visionForm, mission_hn: v })} textarea />
          <button onClick={saveVision} disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#631012] text-white rounded font-bold text-sm hover:bg-[#800000] disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Vision & Mission
          </button>
        </div>
      )}

      {/* ── FACULTY ──────────────────────────────────────────────────────── */}
      {activeTab === 'faculty' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Faculty ({faculty.length})</h2>
            <button onClick={() => setShowAddFaculty(!showAddFaculty)}
              className="flex items-center gap-1 px-4 py-2 bg-[#631012] text-white rounded text-sm font-bold hover:bg-[#800000]">
              <Plus size={14} />{showAddFaculty ? 'Cancel' : 'Add Faculty'}
            </button>
          </div>

          {showAddFaculty && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ['Type', 'type'], ['Name', 'name'], ['Area of Interest', 'area_of_interest'],
                ['Email', 'email'], ['Profile Link', 'profile_link'], ['Sl. No.', 'sl_no']
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-600 mb-1">{label}</label>
                  {key === 'type' ? (
                    <select value={newFaculty[key] || ''} onChange={e => setNewFaculty({ ...newFaculty, [key]: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none">
                      <option value="">Select Type</option>
                      {['Professor','Associate Professor','Assistant Professor Grade-I','Assistant Professor Grade-II','Assistant Professor'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  ) : (
                    <input type={key === 'sl_no' ? 'number' : 'text'} value={newFaculty[key] || ''} onChange={e => setNewFaculty({ ...newFaculty, [key]: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" />
                  )}
                </div>
              ))}
              <div className="md:col-span-2">
                <button onClick={() => addItem(`${API_BASE}/api/departments/${params.id}/faculty`, newFaculty, setFaculty, 'faculty').then(() => { setNewFaculty({}); setShowAddFaculty(false); })}
                  className="px-4 py-2 bg-green-700 text-white rounded text-sm font-bold hover:bg-green-800">
                  Save Faculty
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#0c2340] text-white text-xs">
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Area</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-center">Sl</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {faculty.map(f => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="p-3 text-xs text-gray-600">{f.type}</td>
                    <td className="p-3 font-bold text-gray-900">{f.name}</td>
                    <td className="p-3 text-gray-600 text-xs max-w-xs truncate">{f.area_of_interest}</td>
                    <td className="p-3 text-xs font-mono">{f.email}</td>
                    <td className="p-3 text-center">{f.sl_no}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => deleteItem(`${API_BASE}/api/departments/${params.id}/faculty/${f.id}`, f.id, setFaculty)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── STAFF ────────────────────────────────────────────────────────── */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Staff ({staff.length})</h2>
            <button onClick={() => setShowAddStaff(!showAddStaff)}
              className="flex items-center gap-1 px-4 py-2 bg-[#631012] text-white rounded text-sm font-bold hover:bg-[#800000]">
              <Plus size={14} />{showAddStaff ? 'Cancel' : 'Add Staff'}
            </button>
          </div>

          {showAddStaff && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[['Type', 'type'], ['Name', 'name'], ['Designation', 'designation'], ['Phone No.', 'phone_no'], ['Email', 'email'], ['Sl. No.', 'sl_no']].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-600 mb-1">{label}</label>
                  {key === 'type' ? (
                    <select value={newStaff[key] || ''} onChange={e => setNewStaff({ ...newStaff, [key]: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none">
                      <option value="">Select Type</option>
                      <option>Office Staff</option>
                      <option>Technical Staff</option>
                    </select>
                  ) : (
                    <input type={key === 'sl_no' ? 'number' : 'text'} value={newStaff[key] || ''} onChange={e => setNewStaff({ ...newStaff, [key]: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" />
                  )}
                </div>
              ))}
              <div className="md:col-span-2">
                <button onClick={() => addItem(`${API_BASE}/api/departments/${params.id}/staff`, newStaff, setStaff, 'staff').then(() => { setNewStaff({}); setShowAddStaff(false); })}
                  className="px-4 py-2 bg-green-700 text-white rounded text-sm font-bold hover:bg-green-800">
                  Save Staff
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#0c2340] text-white text-xs">
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Designation</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staff.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="p-3 text-xs text-gray-600">{s.type}</td>
                    <td className="p-3 font-bold text-gray-900">{s.name}</td>
                    <td className="p-3 text-gray-700">{s.designation}</td>
                    <td className="p-3 font-mono text-xs">{s.phone_no}</td>
                    <td className="p-3 text-xs">{s.email}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => deleteItem(`${API_BASE}/api/departments/${params.id}/staff/${s.id}`, s.id, setStaff)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PROGRAMMES ───────────────────────────────────────────────────── */}
      {activeTab === 'programmes' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Programmes ({programmes.length})</h2>
            <button onClick={() => setShowAddProg(!showAddProg)}
              className="flex items-center gap-1 px-4 py-2 bg-[#631012] text-white rounded text-sm font-bold hover:bg-[#800000]">
              <Plus size={14} />{showAddProg ? 'Cancel' : 'Add'}
            </button>
          </div>
          {showAddProg && (
            <div className="border border-gray-200 rounded p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><label className="text-xs font-bold text-gray-600 mb-1 block">Name (EN)</label>
                <input value={newProg.program_name_en || ''} onChange={e => setNewProg({ ...newProg, program_name_en: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" /></div>
              <div><label className="text-xs font-bold text-gray-600 mb-1 block">Name (HI)</label>
                <input value={newProg.program_name_hn || ''} onChange={e => setNewProg({ ...newProg, program_name_hn: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" /></div>
              <div><label className="text-xs font-bold text-gray-600 mb-1 block">Sl. No.</label>
                <input type="number" value={newProg.sl_no || ''} onChange={e => setNewProg({ ...newProg, sl_no: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" /></div>
              <button onClick={() => addItem(`${API_BASE}/api/departments/${params.id}/programmes`, newProg, setProgrammes, 'programmes').then(() => { setNewProg({}); setShowAddProg(false); })}
                className="px-4 py-2 bg-green-700 text-white rounded text-sm font-bold hover:bg-green-800">Save</button>
            </div>
          )}
          <table className="w-full border-collapse text-sm">
            <thead><tr className="bg-[#0c2340] text-white text-xs"><th className="p-3 text-left w-16">Sl</th><th className="p-3 text-left">Programme (EN)</th><th className="p-3 text-left">Programme (HI)</th><th className="p-3 text-center w-16">Del</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {programmes.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-3 text-center">{p.sl_no}</td>
                  <td className="p-3">{p.program_name_en}</td>
                  <td className="p-3">{p.program_name_hn}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => deleteItem(`${API_BASE}/api/departments/${params.id}/programmes/${p.id}`, p.id, setProgrammes)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── LABS ─────────────────────────────────────────────────────────── */}
      {activeTab === 'labs' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Labs ({labs.length})</h2>
            <button onClick={() => setShowAddLab(!showAddLab)}
              className="flex items-center gap-1 px-4 py-2 bg-[#631012] text-white rounded text-sm font-bold hover:bg-[#800000]">
              <Plus size={14} />{showAddLab ? 'Cancel' : 'Add Lab'}
            </button>
          </div>
          {showAddLab && (
            <div className="border border-gray-200 rounded p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div><label className="text-xs font-bold text-gray-600 mb-1 block">Lab Name (EN)</label>
                <input value={newLab.lab_name_en || ''} onChange={e => setNewLab({ ...newLab, lab_name_en: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" /></div>
              <div><label className="text-xs font-bold text-gray-600 mb-1 block">Lab Name (HI)</label>
                <input value={newLab.lab_name_hn || ''} onChange={e => setNewLab({ ...newLab, lab_name_hn: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" /></div>
              <div><label className="text-xs font-bold text-gray-600 mb-1 block">Sl. No.</label>
                <input type="number" value={newLab.sl_no || ''} onChange={e => setNewLab({ ...newLab, sl_no: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" /></div>
              <button onClick={() => addItem(`${API_BASE}/api/departments/${params.id}/labs`, newLab, setLabs, 'labs').then(() => { setNewLab({}); setShowAddLab(false); })}
                className="px-4 py-2 bg-green-700 text-white rounded text-sm font-bold hover:bg-green-800">Save</button>
            </div>
          )}
          <table className="w-full border-collapse text-sm">
            <thead><tr className="bg-[#0c2340] text-white text-xs"><th className="p-3 w-16">Sl</th><th className="p-3 text-left">Lab Name (EN)</th><th className="p-3 text-left">Lab Name (HI)</th><th className="p-3 text-center w-16">Del</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {labs.map(l => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="p-3 text-center">{l.sl_no}</td>
                  <td className="p-3">{l.lab_name_en}</td>
                  <td className="p-3">{l.lab_name_hn}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => deleteItem(`${API_BASE}/api/departments/${params.id}/labs/${l.id}`, l.id, setLabs)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── PUBLICATIONS ─────────────────────────────────────────────────── */}
      {activeTab === 'research_pub' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Research Publications ({pubs.length})</h2>
            <button onClick={() => setShowAddPub(!showAddPub)}
              className="flex items-center gap-1 px-4 py-2 bg-[#631012] text-white rounded text-sm font-bold hover:bg-[#800000]">
              <Plus size={14} />{showAddPub ? 'Cancel' : 'Add'}
            </button>
          </div>
          {showAddPub && (
            <div className="border border-gray-200 rounded p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[['Year', 'year'], ['Author(s)', 'author'], ['Title', 'title'], ['Journal Name', 'journal_name'], ['SCI', 'sci'], ['DOI', 'doi']].map(([label, key]) => (
                <div key={key}><label className="text-xs font-bold text-gray-600 mb-1 block">{label}</label>
                  <input type={key === 'year' ? 'number' : 'text'} value={newPub[key] || ''} onChange={e => setNewPub({ ...newPub, [key]: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" /></div>
              ))}
              <div className="md:col-span-2">
                <button onClick={() => addItem(`${API_BASE}/api/departments/${params.id}/research/publications`, newPub, setPubs, 'pubs').then(() => { setNewPub({}); setShowAddPub(false); })}
                  className="px-4 py-2 bg-green-700 text-white rounded text-sm font-bold hover:bg-green-800">Save</button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead><tr className="bg-[#0c2340] text-white">
                <th className="p-2 text-left w-14">Year</th><th className="p-2 text-left">Authors</th><th className="p-2 text-left">Title</th><th className="p-2 text-left">Journal</th><th className="p-2 text-center w-12">Del</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {pubs.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 align-top">
                    <td className="p-2 font-bold">{p.year}</td>
                    <td className="p-2 max-w-xs">{p.author}</td>
                    <td className="p-2 max-w-xs">{p.title}</td>
                    <td className="p-2">{p.journal_name}</td>
                    <td className="p-2 text-center">
                      <button onClick={() => deleteItem(`${API_BASE}/api/departments/${params.id}/research/publications/${p.id}`, p.id, setPubs)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── RESEARCH PROJECTS ─────────────────────────────────────────────── */}
      {activeTab === 'research_proj' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Research Projects ({projects.length})</h2>
            <button onClick={() => setShowAddProj(!showAddProj)}
              className="flex items-center gap-1 px-4 py-2 bg-[#631012] text-white rounded text-sm font-bold hover:bg-[#800000]">
              <Plus size={14} />{showAddProj ? 'Cancel' : 'Add'}
            </button>
          </div>
          {showAddProj && (
            <div className="border border-gray-200 rounded p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[['Role','role'],['Title','title'],['Funding Agency','funding_agency'],['From','from_date'],['To','to_date'],['Amount','amount'],['Status','status'],['Co-Investigator','co_investigator']].map(([label, key]) => (
                <div key={key}><label className="text-xs font-bold text-gray-600 mb-1 block">{label}</label>
                  <input value={newProj[key] || ''} onChange={e => setNewProj({ ...newProj, [key]: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" /></div>
              ))}
              <div className="md:col-span-2">
                <button onClick={() => addItem(`${API_BASE}/api/departments/${params.id}/research/projects`, newProj, setProjects, 'projects').then(() => { setNewProj({}); setShowAddProj(false); })}
                  className="px-4 py-2 bg-green-700 text-white rounded text-sm font-bold hover:bg-green-800">Save</button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead><tr className="bg-[#0c2340] text-white"><th className="p-2 text-left">Role</th><th className="p-2 text-left">Title</th><th className="p-2 text-left">Agency</th><th className="p-2">Status</th><th className="p-2 text-center w-12">Del</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 align-top">
                    <td className="p-2">{p.role}</td>
                    <td className="p-2 max-w-xs">{p.title}</td>
                    <td className="p-2">{p.funding_agency}</td>
                    <td className="p-2 text-center">{p.status}</td>
                    <td className="p-2 text-center">
                      <button onClick={() => deleteItem(`${API_BASE}/api/departments/${params.id}/research/projects/${p.id}`, p.id, setProjects)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── BOOKS/CHAPTERS ───────────────────────────────────────────────── */}
      {activeTab === 'research_written' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Books & Chapters Written ({written.length})</h2>
            <button onClick={() => setShowAddWritten(!showAddWritten)}
              className="flex items-center gap-1 px-4 py-2 bg-[#631012] text-white rounded text-sm font-bold hover:bg-[#800000]">
              <Plus size={14} />{showAddWritten ? 'Cancel' : 'Add'}
            </button>
          </div>
          {showAddWritten && (
            <div className="border border-gray-200 rounded p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[['Type','type'],['Year','year'],['Author(s)','author'],['Title','title'],['Publisher','publisher'],['ISBN','isbn']].map(([label, key]) => (
                <div key={key}><label className="text-xs font-bold text-gray-600 mb-1 block">{label}</label>
                  <input type={key==='year'?'number':'text'} value={newWritten[key] || ''} onChange={e => setNewWritten({ ...newWritten, [key]: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" /></div>
              ))}
              <div className="md:col-span-2">
                <button onClick={() => addItem(`${API_BASE}/api/departments/${params.id}/research/written`, newWritten, setWritten, 'written').then(() => { setNewWritten({}); setShowAddWritten(false); })}
                  className="px-4 py-2 bg-green-700 text-white rounded text-sm font-bold hover:bg-green-800">Save</button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead><tr className="bg-[#0c2340] text-white"><th className="p-2 w-12">Year</th><th className="p-2 text-left">Authors</th><th className="p-2 text-left">Title</th><th className="p-2 text-left">Publisher</th><th className="p-2 text-center w-12">Del</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {written.map(w => (
                  <tr key={w.id} className="hover:bg-gray-50 align-top">
                    <td className="p-2 font-bold text-center">{w.year}</td><td className="p-2">{w.author}</td><td className="p-2">{w.title}</td><td className="p-2">{w.publisher}</td>
                    <td className="p-2 text-center"><button onClick={() => deleteItem(`${API_BASE}/api/departments/${params.id}/research/written/${w.id}`, w.id, setWritten)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SUPERVISION ──────────────────────────────────────────────────── */}
      {activeTab === 'research_super' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Research Supervision ({supervision.length})</h2>
            <button onClick={() => setShowAddSuper(!showAddSuper)}
              className="flex items-center gap-1 px-4 py-2 bg-[#631012] text-white rounded text-sm font-bold hover:bg-[#800000]">
              <Plus size={14} />{showAddSuper ? 'Cancel' : 'Add'}
            </button>
          </div>
          {showAddSuper && (
            <div className="border border-gray-200 rounded p-4 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[['Program','program_name'],['Scholar Name','scholar_name'],['Research Topic','research_topic'],['Year','year'],['Status','status'],['Co-Supervisor','co_supervisor']].map(([label, key]) => (
                <div key={key}><label className="text-xs font-bold text-gray-600 mb-1 block">{label}</label>
                  <input value={newSuper[key] || ''} onChange={e => setNewSuper({ ...newSuper, [key]: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none" /></div>
              ))}
              <div className="md:col-span-2">
                <button onClick={() => addItem(`${API_BASE}/api/departments/${params.id}/research/supervision`, newSuper, setSupervision, 'supervision').then(() => { setNewSuper({}); setShowAddSuper(false); })}
                  className="px-4 py-2 bg-green-700 text-white rounded text-sm font-bold hover:bg-green-800">Save</button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead><tr className="bg-[#0c2340] text-white"><th className="p-2 text-left">Scholar</th><th className="p-2 text-left">Topic</th><th className="p-2 text-left">Program</th><th className="p-2 w-14">Year</th><th className="p-2">Status</th><th className="p-2 text-center w-12">Del</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {supervision.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 align-top">
                    <td className="p-2 font-bold">{s.scholar_name}</td><td className="p-2">{s.research_topic}</td><td className="p-2">{s.program_name}</td><td className="p-2 text-center">{s.year}</td><td className="p-2 text-center">{s.status}</td>
                    <td className="p-2 text-center"><button onClick={() => deleteItem(`${API_BASE}/api/departments/${params.id}/research/supervision/${s.id}`, s.id, setSupervision)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="HoD Name (EN)" value={contactForm.hod_en} onChange={(v: string) => setContactForm({ ...contactForm, hod_en: v })} />
            <Field label="HoD Name (HI)" value={contactForm.hod_hn} onChange={(v: string) => setContactForm({ ...contactForm, hod_hn: v })} />
            <Field label="Phone No." value={contactForm.phone_no} onChange={(v: string) => setContactForm({ ...contactForm, phone_no: v })} />
            <Field label="HoD Email" value={contactForm.hod_email} onChange={(v: string) => setContactForm({ ...contactForm, hod_email: v })} />
            <Field label="Office Email" value={contactForm.office_email} onChange={(v: string) => setContactForm({ ...contactForm, office_email: v })} />
            <Field label="Department" value={contactForm.department} onChange={(v: string) => setContactForm({ ...contactForm, department: v })} />
            <Field label="College" value={contactForm.college} onChange={(v: string) => setContactForm({ ...contactForm, college: v })} />
            <Field label="Address" value={contactForm.address} onChange={(v: string) => setContactForm({ ...contactForm, address: v })} textarea />
          </div>
          <button onClick={saveContact} disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#631012] text-white rounded font-bold text-sm hover:bg-[#800000] disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Contact
          </button>
        </div>
      )}
    </div>
  );
}
