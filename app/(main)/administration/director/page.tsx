'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Plus, Trash2, FileText, Users, Building } from 'lucide-react';

interface FormerDirector {
  id?: number;
  name: string;
  tenure: string;
  type: 'NIT' | 'REC';
}

interface OfficeStaff {
  id?: number;
  name: string;
  designation: string;
  phone: string;
  email: string;
  is_director?: boolean;
}

interface DirectorInfo {
  hero_heading: string;
  hero_subheading: string;
  current_name: string;
  current_designation: string;
  message_heading: string;
  message_paragraphs: string[];
  message_closing: string;
  message_signature_title: string;
  message_signature_org: string;
  message_signature_location: string;
}

export default function DirectorAdminPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'message' | 'former' | 'office'>('current');
  const [info, setInfo] = useState<DirectorInfo>({
    hero_heading: '', hero_subheading: '', current_name: '', current_designation: '',
    message_heading: '', message_paragraphs: [], message_closing: '',
    message_signature_title: '', message_signature_org: '', message_signature_location: ''
  });
  const [former, setFormer] = useState<FormerDirector[]>([]);
  const [staff, setStaff] = useState<OfficeStaff[]>([]);
  const [loading, setLoading] = useState(true);

  const [formerForm, setFormerForm] = useState<FormerDirector>({ name: '', tenure: '', type: 'NIT' });
  const [staffForm, setStaffForm] = useState<OfficeStaff>({ name: '', designation: '', phone: '', email: '' });
  const [showFormerForm, setShowFormerForm] = useState<boolean>(false);
  const [showStaffForm, setShowStaffForm] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [infoRes, formerRes, staffRes] = await Promise.allSettled([
        fetch('http://localhost:5000/api/v1/administration/director'),
        fetch('http://localhost:5000/api/v1/administration/former-directors'),
        fetch('http://localhost:5000/api/v1/administration/office-staff')
      ]);

      if (infoRes.status === 'fulfilled') {
        const data = await infoRes.value.json();
        if (data.success && data.data) setInfo(data.data);
      }
      
      if (formerRes.status === 'fulfilled') {
        const data = await formerRes.value.json();
        if (data.success) setFormer(data.data);
      }

      if (staffRes.status === 'fulfilled') {
        const data = await staffRes.value.json();
        if (data.success) setStaff(data.data);
      }

      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info)
      });
      const json = await res.json();
      if (json.success) alert('Director Info Saved!');
    } catch (err) { alert('Error saving info'); }
  };

  const handleFormerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formerForm.name || !formerForm.tenure) return;
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/former-directors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formerForm)
      });
      const json = await res.json();
      if (json.success) {
        setFormer([...former, json.data]);
        setFormerForm({ name: '', tenure: '', type: formerForm.type });
        setShowFormerForm(false);
        alert('Added successfully!');
      }
    } catch (err) { alert('Error adding'); }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.designation) return;
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/office-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffForm)
      });
      const json = await res.json();
      if (json.success) {
        setStaff([...staff, json.data]);
        setStaffForm({ name: '', designation: '', phone: '', email: '' });
        setShowStaffForm(false);
        alert('Staff added successfully!');
      }
    } catch (err) { alert('Error adding staff'); }
  };

  const handleDeleteFormer = async (id: number) => {
    if (!confirm('Delete?')) return;
    try {
      await fetch(`http://localhost:5000/api/v1/administration/former-directors/${id}`, { method: 'DELETE' });
      setFormer(former.filter(f => f.id !== id));
    } catch (err) { alert('Error deleting'); }
  };

  if (loading) return <div className="p-8 text-black">Loading Director Data...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <User className="w-10 h-10" />
          <h1 className="text-3xl font-extrabold tracking-tight">Director Section</h1>
        </div>
        <p className="text-white/80 text-lg">Manage current director info, message, and office staff</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {['current', 'message', 'former', 'office'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap ${
              activeTab === tab ? 'bg-[#631012] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {activeTab === 'current' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-4"><User className="text-[#631012]" /> Current Director</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Director Name</label>
                <input type="text" value={info.current_name} onChange={e => setInfo({...info, current_name: e.target.value})} className="w-full p-3 border rounded-xl font-bold bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Designation</label>
                <input type="text" value={info.current_designation} onChange={e => setInfo({...info, current_designation: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Hero Heading</label>
                <input type="text" value={info.hero_heading} onChange={e => setInfo({...info, hero_heading: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Hero Subheading</label>
                <input type="text" value={info.hero_subheading} onChange={e => setInfo({...info, hero_subheading: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
              </div>
            </div>
            <button onClick={handleSaveInfo} className="bg-[#631012] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#800000] transition-all flex items-center gap-2">
              <Save size={20} /> Save Changes
            </button>
          </div>
        )}

        {activeTab === 'message' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-4"><FileText className="text-[#631012]" /> Director Message</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Message Heading</label>
                <input type="text" value={info.message_heading} onChange={e => setInfo({...info, message_heading: e.target.value})} className="w-full p-3 border rounded-xl font-bold bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Message Body (One paragraph per line)</label>
                <textarea 
                  value={info.message_paragraphs.join('\n')} 
                  onChange={e => setInfo({...info, message_paragraphs: e.target.value.split('\n').filter(p => p.trim())})} 
                  className="w-full p-3 border rounded-xl min-h-[300px] bg-gray-50" 
                  placeholder="Paste message paragraphs here..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase">Closing Line</label>
                  <input type="text" value={info.message_closing} onChange={e => setInfo({...info, message_closing: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase">Signature Title</label>
                  <input type="text" value={info.message_signature_title} onChange={e => setInfo({...info, message_signature_title: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" />
                </div>
              </div>
            </div>
            <button onClick={handleSaveInfo} className="bg-[#631012] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#800000] transition-all flex items-center gap-2">
              <Save size={20} /> Save Message
            </button>
          </div>
        )}

        {activeTab === 'former' && (
          <div className="space-y-8">
            {showFormerForm && (
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-[#631012]/10 mb-8 animate-in fade-in slide-in-from-top-4">
                <h3 className="text-lg font-bold mb-4">Add Former {formerForm.type === 'NIT' ? 'Director' : 'Principal'}</h3>
                <form onSubmit={handleFormerSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Name" value={formerForm.name} onChange={e => setFormerForm({...formerForm, name: e.target.value})} className="p-2 border rounded-lg" required />
                  <input type="text" placeholder="Tenure (e.g. 2010-2015)" value={formerForm.tenure} onChange={e => setFormerForm({...formerForm, tenure: e.target.value})} className="p-2 border rounded-lg" required />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-[#631012] text-white px-4 py-2 rounded-lg font-bold flex-1">Save</button>
                    <button type="button" onClick={() => setShowFormerForm(false)} className="bg-gray-200 px-4 py-2 rounded-lg font-bold">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Users className="text-[#631012]" /> Former NIT Directors</h2>
                <button onClick={() => { setFormerForm({...formerForm, type: 'NIT'}); setShowFormerForm(true); }} className="bg-[#631012] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={18}/> Add</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {former.filter(f => f.type === 'NIT').map(f => (
                  <div key={f.id} className="p-4 border rounded-xl bg-gray-50 relative group">
                    <button onClick={() => handleDeleteFormer(f.id!)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    <p className="font-bold text-[#631012]">{f.name}</p>
                    <p className="text-sm text-gray-500">{f.tenure}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Users className="text-[#631012]" /> Former REC Principals</h2>
                <button onClick={() => { setFormerForm({...formerForm, type: 'REC'}); setShowFormerForm(true); }} className="bg-[#631012] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={18}/> Add</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {former.filter(f => f.type === 'REC').map(f => (
                  <div key={f.id} className="p-4 border rounded-xl bg-gray-50 relative group">
                    <button onClick={() => handleDeleteFormer(f.id!)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    <p className="font-bold text-[#631012]">{f.name}</p>
                    <p className="text-sm text-gray-500">{f.tenure}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'office' && (
          <div className="space-y-6">
             <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-4"><Building className="text-[#631012]" /> Director Office Staff</h2>
             
             {showStaffForm && (
               <div className="bg-gray-50 p-6 rounded-2xl border-2 border-[#631012]/10 mb-8 animate-in fade-in slide-in-from-top-4">
                 <h3 className="text-lg font-bold mb-4">Add Office Staff</h3>
                 <form onSubmit={handleStaffSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} className="p-2 border rounded-lg" required />
                    <input type="text" placeholder="Designation" value={staffForm.designation} onChange={e => setStaffForm({...staffForm, designation: e.target.value})} className="p-2 border rounded-lg" required />
                    <input type="text" placeholder="Phone" value={staffForm.phone} onChange={e => setStaffForm({...staffForm, phone: e.target.value})} className="p-2 border rounded-lg" />
                    <input type="email" placeholder="Email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} className="p-2 border rounded-lg" />
                    <div className="md:col-span-2 flex gap-2">
                      <button type="submit" className="bg-[#631012] text-white px-6 py-2 rounded-lg font-bold flex-1">Save Staff</button>
                      <button type="button" onClick={() => setShowStaffForm(false)} className="bg-gray-200 px-6 py-2 rounded-lg font-bold">Cancel</button>
                    </div>
                 </form>
               </div>
             )}

             <div className="grid grid-cols-1 gap-4">
               {staff.map((s, idx) => (
                 <div key={s.id || idx} className="p-4 border rounded-xl flex justify-between items-center bg-gray-50 hover:shadow-md transition-shadow">
                    <div>
                      <p className="font-bold text-lg">{s.name}</p>
                      <p className="text-sm text-[#631012] font-medium">{s.designation}</p>
                      <p className="text-xs text-gray-500 mt-1">{s.email} | {s.phone}</p>
                    </div>
                    <button onClick={async () => {
                       if(confirm('Delete?')) {
                         await fetch(`http://localhost:5000/api/v1/administration/office-staff/${s.id}`, {method:'DELETE'});
                         setStaff(staff.filter(st => st.id !== s.id));
                       }
                    }} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><Trash2 size={20}/></button>
                 </div>
               ))}
               {!showStaffForm && (
                 <button onClick={() => setShowStaffForm(true)} className="w-full py-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold hover:border-[#631012] hover:text-[#631012] transition-all bg-white flex items-center justify-center gap-2">
                   <Plus size={24}/> Add Staff Member
                 </button>
               )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
