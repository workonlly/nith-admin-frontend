'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Plus, Trash2, ShieldCheck, Mail, Phone, FileDown, AlertTriangle } from 'lucide-react';

interface Member {
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

interface Download {
  id?: number;
  title: string;
  file_path: string;
  title_en?: string;
  title_hi?: string;
}

export default function VigilanceAdminPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'downloads'>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [memberForm, setMemberForm] = useState<Member>({ name: '', name_en: '', name_hi: '', responsibility: '', responsibility_en: '', responsibility_hi: '', phone: '', email: '' });
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  
  const [downloadForm, setDownloadForm] = useState<Download>({ title: '', title_en: '', title_hi: '', file_path: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const isHindi = (text: string) => /[\u0900-\u097F]/.test(text || '');

  const fetchData = async () => {
    try {
      const [memRes, dlRes] = await Promise.all([
        fetch('http://localhost:5000/api/v1/administration/vigilance'),
        fetch('http://localhost:5000/api/v1/administration/vigilance-downloads')
      ]);
      const memData = await memRes.json();
      const dlData = await dlRes.json();
      if (memData.success) {
        const mapped = memData.data.map((m: any) => ({
          ...m,
          name_en: isHindi(m.name) ? '' : m.name,
          name_hi: isHindi(m.name) ? m.name : '',
          responsibility_en: isHindi(m.responsibility) ? '' : m.responsibility,
          responsibility_hi: isHindi(m.responsibility) ? m.responsibility : '',
        }));
        setMembers(mapped);
      }
      if (dlData.success) {
        const mapped = dlData.data.map((d: any) => ({
          ...d,
          title_en: isHindi(d.title) ? '' : d.title,
          title_hi: isHindi(d.title) ? d.title : '',
        }));
        setDownloads(mapped);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameVal = memberForm.name_hi || memberForm.name_en || memberForm.name;
    const responsibilityVal = memberForm.responsibility_hi || memberForm.responsibility_en || memberForm.responsibility;
    if (!nameVal || !responsibilityVal) return;
    const payload = {
      ...memberForm,
      name: nameVal,
      responsibility: responsibilityVal
    };
    const method = editingMemberId ? 'PUT' : 'POST';
    const url = editingMemberId 
      ? `http://localhost:5000/api/v1/administration/vigilance/${editingMemberId}`
      : 'http://localhost:5000/api/v1/administration/vigilance';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if ((await res.json()).success) {
      alert('Member saved successfully!');
      fetchData();
      setMemberForm({ name: '', name_en: '', name_hi: '', responsibility: '', responsibility_en: '', responsibility_hi: '', phone: '', email: '' });
      setEditingMemberId(null);
    }
  };

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const titleVal = downloadForm.title_hi || downloadForm.title_en || downloadForm.title;
    if (!titleVal) return;
    const payload = {
      ...downloadForm,
      title: titleVal
    };
    const res = await fetch('http://localhost:5000/api/v1/administration/vigilance-downloads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (json.success) {
      alert('Download added successfully!');
      fetchData();
      setDownloadForm({ title: '', title_en: '', title_hi: '', file_path: '' });
    } else {
      alert('Error: ' + json.message);
    }
  };

  const handleEditMember = (m: Member) => {
    setMemberForm({
      ...m,
      name_en: isHindi(m.name) ? '' : m.name,
      name_hi: isHindi(m.name) ? m.name : '',
      responsibility_en: isHindi(m.responsibility) ? '' : m.responsibility,
      responsibility_hi: isHindi(m.responsibility) ? m.responsibility : '',
    });
    setEditingMemberId(m.id!);
  };

  if (loading) return <div className="p-8 text-black font-bold text-center">Loading...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <AlertTriangle className="w-10 h-10 text-yellow-400" />
          <h1 className="text-3xl font-extrabold tracking-tight">Vigilance Corner Admin</h1>
        </div>
        <p className="text-white/80 text-lg">Manage CVO members and vigilance resources</p>
      </div>

      <div className="flex gap-4 border-b">
        <button onClick={() => setActiveTab('members')} className={`pb-4 px-6 font-bold transition-all ${activeTab === 'members' ? 'border-b-4 border-[#631012] text-[#631012]' : 'text-gray-400'}`}>
          CVO Members
        </button>
        <button onClick={() => setActiveTab('downloads')} className={`pb-4 px-6 font-bold transition-all ${activeTab === 'downloads' ? 'border-b-4 border-[#631012] text-[#631012]' : 'text-gray-400'}`}>
          Downloads
        </button>
      </div>

      {activeTab === 'members' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">{editingMemberId ? 'Edit Member' : 'Add CVO Member'}</h2>
              <form onSubmit={handleMemberSubmit} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <input type="text" placeholder="Name (English)" value={memberForm.name_en || ''} onChange={e => setMemberForm({...memberForm, name_en: e.target.value, name: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" required />
                  <input type="text" placeholder="नाम (हिंदी)" value={memberForm.name_hi || ''} onChange={e => setMemberForm({...memberForm, name_hi: e.target.value, name: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
                </div>
                <div className="flex flex-col gap-2">
                  <input type="text" placeholder="Responsibility (English)" value={memberForm.responsibility_en || ''} onChange={e => setMemberForm({...memberForm, responsibility_en: e.target.value, responsibility: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" required />
                  <input type="text" placeholder="जिम्मेदारी (हिंदी)" value={memberForm.responsibility_hi || ''} onChange={e => setMemberForm({...memberForm, responsibility_hi: e.target.value, responsibility: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
                </div>
                <input type="text" placeholder="Phone" value={memberForm.phone} onChange={e => setMemberForm({...memberForm, phone: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
                <input type="email" placeholder="Email" value={memberForm.email} onChange={e => setMemberForm({...memberForm, email: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" required />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-[#631012] text-white py-3 rounded-xl font-bold">
                    {editingMemberId ? 'Update' : 'Add Member'}
                  </button>
                  {editingMemberId && <button type="button" onClick={() => {setEditingMemberId(null); setMemberForm({name:'', name_en:'', name_hi:'', responsibility:'', responsibility_en:'', responsibility_hi:'', phone:'', email:''})}} className="bg-gray-200 px-4 rounded-xl">Cancel</button>}
                </div>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr><th className="p-4">Member Info</th><th className="p-4 text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {members.map(m => (
                    <tr key={m.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-lg">{m.name}</div>
                        <div className="text-[#631012] font-medium text-sm">{m.responsibility}</div>
                        <div className="flex gap-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><Phone size={12}/> {m.phone}</span>
                          <span className="flex items-center gap-1"><Mail size={12}/> {m.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleEditMember(m)} className="p-2 text-blue-600 mr-2"><Save size={18}/></button>
                        <button onClick={async () => { if(confirm('Delete?')){ await fetch(`http://localhost:5000/api/v1/administration/vigilance/${m.id}`, {method:'DELETE'}); fetchData(); } }} className="p-2 text-red-600"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Add New Download</h2>
              <form onSubmit={handleDownloadSubmit} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <input type="text" placeholder="Document Title (English)" value={downloadForm.title_en || ''} onChange={e => setDownloadForm({...downloadForm, title_en: e.target.value, title: e.target.value})} className="w-full p-3 border rounded-xl" required />
                  <input type="text" placeholder="दस्तावेज़ शीर्षक (हिंदी)" value={downloadForm.title_hi || ''} onChange={e => setDownloadForm({...downloadForm, title_hi: e.target.value, title: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
                <input type="text" placeholder="File Path (e.g. /pdfs/...) or URL" value={downloadForm.file_path} onChange={e => setDownloadForm({...downloadForm, file_path: e.target.value})} className="w-full p-3 border rounded-xl" required />
                <button type="submit" className="w-full bg-[#631012] text-white py-3 rounded-xl font-bold">Add Download</button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr><th className="p-4">Document Title</th><th className="p-4 text-right">Actions</th></tr>
                  </thead>
                  <tbody>
                    {downloads.map(d => (
                      <tr key={d.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-bold flex items-center gap-2"><FileDown className="text-gray-400" size={16}/> {d.title}</div>
                          <div className="text-xs text-gray-400">{d.file_path}</div>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={async () => { if(confirm('Delete?')){ await fetch(`http://localhost:5000/api/v1/administration/vigilance-downloads/${d.id}`, {method:'DELETE'}); fetchData(); } }} className="p-2 text-red-600"><Trash2 size={18}/></button>
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
