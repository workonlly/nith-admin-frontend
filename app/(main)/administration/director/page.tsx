'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Plus, Trash2, FileText, Users, Building } from 'lucide-react';

interface FormerDirector {
  id?: number;
  name: string;
  tenure: string;
  type: 'NIT' | 'REC';
  name_en?: string;
  name_hi?: string;
  tenure_en?: string;
  tenure_hi?: string;
}

interface OfficeStaff {
  id?: number;
  name: string;
  designation: string;
  phone: string;
  email: string;
  is_director?: boolean;
  name_en?: string;
  name_hi?: string;
  designation_en?: string;
  designation_hi?: string;
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
  
  hero_heading_en?: string;
  hero_heading_hi?: string;
  hero_subheading_en?: string;
  hero_subheading_hi?: string;
  current_name_en?: string;
  current_name_hi?: string;
  current_designation_en?: string;
  current_designation_hi?: string;

  message_heading_en?: string;
  message_heading_hi?: string;
  message_paragraphs_en?: string[];
  message_paragraphs_hi?: string[];
  message_closing_en?: string;
  message_closing_hi?: string;
  message_signature_title_en?: string;
  message_signature_title_hi?: string;
  message_signature_org_en?: string;
  message_signature_org_hi?: string;
  message_signature_location_en?: string;
  message_signature_location_hi?: string;
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

  const [formerForm, setFormerForm] = useState<FormerDirector>({ name: '', name_en: '', name_hi: '', tenure: '', tenure_en: '', tenure_hi: '', type: 'NIT' });
  const [staffForm, setStaffForm] = useState<OfficeStaff>({ name: '', name_en: '', name_hi: '', designation: '', designation_en: '', designation_hi: '', phone: '', email: '' });
  const [showFormerForm, setShowFormerForm] = useState<boolean>(false);
  const [showStaffForm, setShowStaffForm] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const isHindi = (text: string) => /[\u0900-\u097F]/.test(text || '');

  const fetchData = async () => {
    try {
      const [infoRes, formerRes, staffRes] = await Promise.allSettled([
        fetch('http://localhost:5000/api/v1/administration/director'),
        fetch('http://localhost:5000/api/v1/administration/former-directors'),
        fetch('http://localhost:5000/api/v1/administration/office-staff')
      ]);

      if (infoRes.status === 'fulfilled') {
        const data = await infoRes.value.json();
        if (data.success && data.data) {
          const d = data.data;
          const msgPara = d.message_paragraphs || [];
          const isMsgParaHi = msgPara.some((p: string) => isHindi(p));
          setInfo({
            ...d,
            hero_heading_en: isHindi(d.hero_heading) ? '' : d.hero_heading,
            hero_heading_hi: isHindi(d.hero_heading) ? d.hero_heading : '',
            hero_subheading_en: isHindi(d.hero_subheading) ? '' : d.hero_subheading,
            hero_subheading_hi: isHindi(d.hero_subheading) ? d.hero_subheading : '',
            current_name_en: isHindi(d.current_name) ? '' : d.current_name,
            current_name_hi: isHindi(d.current_name) ? d.current_name : '',
            current_designation_en: isHindi(d.current_designation) ? '' : d.current_designation,
            current_designation_hi: isHindi(d.current_designation) ? d.current_designation : '',
            message_heading_en: isHindi(d.message_heading) ? '' : d.message_heading,
            message_heading_hi: isHindi(d.message_heading) ? d.message_heading : '',
            message_paragraphs_en: isMsgParaHi ? [] : msgPara,
            message_paragraphs_hi: isMsgParaHi ? msgPara : [],
            message_closing_en: isHindi(d.message_closing) ? '' : d.message_closing,
            message_closing_hi: isHindi(d.message_closing) ? d.message_closing : '',
            message_signature_title_en: isHindi(d.message_signature_title) ? '' : d.message_signature_title,
            message_signature_title_hi: isHindi(d.message_signature_title) ? d.message_signature_title : '',
            message_signature_org_en: isHindi(d.message_signature_org) ? '' : d.message_signature_org,
            message_signature_org_hi: isHindi(d.message_signature_org) ? d.message_signature_org : '',
            message_signature_location_en: isHindi(d.message_signature_location) ? '' : d.message_signature_location,
            message_signature_location_hi: isHindi(d.message_signature_location) ? d.message_signature_location : '',
          });
        }
      }
      
      if (formerRes.status === 'fulfilled') {
        const data = await formerRes.value.json();
        if (data.success) {
          const mapped = data.data.map((f: any) => ({
            ...f,
            name_en: isHindi(f.name) ? '' : f.name,
            name_hi: isHindi(f.name) ? f.name : '',
            tenure_en: isHindi(f.tenure) ? '' : f.tenure,
            tenure_hi: isHindi(f.tenure) ? f.tenure : '',
          }));
          setFormer(mapped);
        }
      }

      if (staffRes.status === 'fulfilled') {
        const data = await staffRes.value.json();
        if (data.success) {
          const mapped = data.data.map((s: any) => ({
            ...s,
            name_en: isHindi(s.name) ? '' : s.name,
            name_hi: isHindi(s.name) ? s.name : '',
            designation_en: isHindi(s.designation) ? '' : s.designation,
            designation_hi: isHindi(s.designation) ? s.designation : '',
          }));
          setStaff(mapped);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    const payload = {
      ...info,
      hero_heading: info.hero_heading_hi || info.hero_heading_en || info.hero_heading,
      hero_subheading: info.hero_subheading_hi || info.hero_subheading_en || info.hero_subheading,
      current_name: info.current_name_hi || info.current_name_en || info.current_name,
      current_designation: info.current_designation_hi || info.current_designation_en || info.current_designation,
      message_heading: info.message_heading_hi || info.message_heading_en || info.message_heading,
      message_paragraphs: (info.message_paragraphs_hi && info.message_paragraphs_hi.length > 0) 
        ? info.message_paragraphs_hi 
        : (info.message_paragraphs_en || info.message_paragraphs),
      message_closing: info.message_closing_hi || info.message_closing_en || info.message_closing,
      message_signature_title: info.message_signature_title_hi || info.message_signature_title_en || info.message_signature_title,
      message_signature_org: info.message_signature_org_hi || info.message_signature_org_en || info.message_signature_org,
      message_signature_location: info.message_signature_location_hi || info.message_signature_location_en || info.message_signature_location
    };
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) alert('Director Info Saved!');
    } catch (err) { alert('Error saving info'); }
  };

  const handleFormerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameVal = formerForm.name_hi || formerForm.name_en || formerForm.name;
    const tenureVal = formerForm.tenure_hi || formerForm.tenure_en || formerForm.tenure;
    if (!nameVal || !tenureVal) return;
    const payload = {
      ...formerForm,
      name: nameVal,
      tenure: tenureVal
    };
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/former-directors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        fetchData();
        setFormerForm({ name: '', name_en: '', name_hi: '', tenure: '', tenure_en: '', tenure_hi: '', type: formerForm.type });
        setShowFormerForm(false);
        alert('Added successfully!');
      }
    } catch (err) { alert('Error adding'); }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameVal = staffForm.name_hi || staffForm.name_en || staffForm.name;
    const designationVal = staffForm.designation_hi || staffForm.designation_en || staffForm.designation;
    if (!nameVal || !designationVal) return;
    const payload = {
      ...staffForm,
      name: nameVal,
      designation: designationVal
    };
    try {
      const res = await fetch('http://localhost:5000/api/v1/administration/office-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        fetchData();
        setStaffForm({ name: '', name_en: '', name_hi: '', designation: '', designation_en: '', designation_hi: '', phone: '', email: '' });
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
                <div className="flex flex-col gap-2">
                  <input type="text" value={info.current_name_en || ''} onChange={e => setInfo({...info, current_name_en: e.target.value, current_name: e.target.value})} className="w-full p-3 border rounded-xl font-bold bg-gray-50" placeholder="Director Name (English)" />
                  <input type="text" value={info.current_name_hi || ''} onChange={e => setInfo({...info, current_name_hi: e.target.value, current_name: e.target.value})} className="w-full p-3 border rounded-xl font-bold bg-gray-50" placeholder="निदेशक का नाम (हिंदी)" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Designation</label>
                <div className="flex flex-col gap-2">
                  <input type="text" value={info.current_designation_en || ''} onChange={e => setInfo({...info, current_designation_en: e.target.value, current_designation: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="Designation (English)" />
                  <input type="text" value={info.current_designation_hi || ''} onChange={e => setInfo({...info, current_designation_hi: e.target.value, current_designation: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="पद (हिंदी)" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Hero Heading</label>
                <div className="flex flex-col gap-2">
                  <input type="text" value={info.hero_heading_en || ''} onChange={e => setInfo({...info, hero_heading_en: e.target.value, hero_heading: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="Hero Heading (English)" />
                  <input type="text" value={info.hero_heading_hi || ''} onChange={e => setInfo({...info, hero_heading_hi: e.target.value, hero_heading: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="मुख्य शीर्षक (हिंदी)" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Hero Subheading</label>
                <div className="flex flex-col gap-2">
                  <input type="text" value={info.hero_subheading_en || ''} onChange={e => setInfo({...info, hero_subheading_en: e.target.value, hero_subheading: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="Hero Subheading (English)" />
                  <input type="text" value={info.hero_subheading_hi || ''} onChange={e => setInfo({...info, hero_subheading_hi: e.target.value, hero_subheading: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="मुख्य उपशीर्षक (हिंदी)" />
                </div>
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
                <div className="flex flex-col gap-2">
                  <input type="text" value={info.message_heading_en || ''} onChange={e => setInfo({...info, message_heading_en: e.target.value, message_heading: e.target.value})} className="w-full p-3 border rounded-xl font-bold bg-gray-50" placeholder="Message Heading (English)" />
                  <input type="text" value={info.message_heading_hi || ''} onChange={e => setInfo({...info, message_heading_hi: e.target.value, message_heading: e.target.value})} className="w-full p-3 border rounded-xl font-bold bg-gray-50" placeholder="संदेश शीर्षक (हिंदी)" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase">Message Body (One paragraph per line)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <textarea 
                      value={(info.message_paragraphs_en || []).join('\n')} 
                      onChange={e => setInfo({...info, message_paragraphs_en: e.target.value.split('\n').filter(p => p.trim()), message_paragraphs: e.target.value.split('\n').filter(p => p.trim())})} 
                      className="w-full p-3 border rounded-xl min-h-[300px] bg-gray-50" 
                      placeholder="Paste message paragraphs in English here..."
                    />
                  </div>
                  <div>
                    <textarea 
                      value={(info.message_paragraphs_hi || []).join('\n')} 
                      onChange={e => setInfo({...info, message_paragraphs_hi: e.target.value.split('\n').filter(p => p.trim()), message_paragraphs: e.target.value.split('\n').filter(p => p.trim())})} 
                      className="w-full p-3 border rounded-xl min-h-[300px] bg-gray-50" 
                      placeholder="संदेश के पैराग्राफ यहाँ हिंदी में डालें..."
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase">Closing Line</label>
                  <div className="flex flex-col gap-2">
                    <input type="text" value={info.message_closing_en || ''} onChange={e => setInfo({...info, message_closing_en: e.target.value, message_closing: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="e.g. With warm regards (English)" />
                    <input type="text" value={info.message_closing_hi || ''} onChange={e => setInfo({...info, message_closing_hi: e.target.value, message_closing: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="उदा. सस्नेह आदर सहित (हिंदी)" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 uppercase">Signature Title</label>
                  <div className="flex flex-col gap-2">
                    <input type="text" value={info.message_signature_title_en || ''} onChange={e => setInfo({...info, message_signature_title_en: e.target.value, message_signature_title: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="Signature Title (English)" />
                    <input type="text" value={info.message_signature_title_hi || ''} onChange={e => setInfo({...info, message_signature_title_hi: e.target.value, message_signature_title: e.target.value})} className="w-full p-3 border rounded-xl bg-gray-50" placeholder="हस्ताक्षर शीर्षक (हिंदी)" />
                  </div>
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
                  <div className="flex flex-col gap-2">
                    <input type="text" placeholder="Name (English)" value={formerForm.name_en || ''} onChange={e => setFormerForm({...formerForm, name_en: e.target.value, name: e.target.value})} className="p-2 border rounded-lg" required />
                    <input type="text" placeholder="नाम (हिंदी)" value={formerForm.name_hi || ''} onChange={e => setFormerForm({...formerForm, name_hi: e.target.value, name: e.target.value})} className="p-2 border rounded-lg" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <input type="text" placeholder="Tenure (e.g. 2010-2015)" value={formerForm.tenure_en || ''} onChange={e => setFormerForm({...formerForm, tenure_en: e.target.value, tenure: e.target.value})} className="p-2 border rounded-lg" required />
                    <input type="text" placeholder="कार्यकाल (उदा. 2010-2015)" value={formerForm.tenure_hi || ''} onChange={e => setFormerForm({...formerForm, tenure_hi: e.target.value, tenure: e.target.value})} className="p-2 border rounded-lg" />
                  </div>
                  <div className="flex gap-2 items-end">
                    <button type="submit" className="bg-[#631012] text-white px-4 py-2 rounded-lg font-bold flex-1 h-fit">Save</button>
                    <button type="button" onClick={() => setShowFormerForm(false)} className="bg-gray-200 px-4 py-2 rounded-lg font-bold h-fit">Cancel</button>
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
                    <div className="flex flex-col gap-2">
                      <input type="text" placeholder="Name (English)" value={staffForm.name_en || ''} onChange={e => setStaffForm({...staffForm, name_en: e.target.value, name: e.target.value})} className="p-2 border rounded-lg" required />
                      <input type="text" placeholder="नाम (हिंदी)" value={staffForm.name_hi || ''} onChange={e => setStaffForm({...staffForm, name_hi: e.target.value, name: e.target.value})} className="p-2 border rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <input type="text" placeholder="Designation (English)" value={staffForm.designation_en || ''} onChange={e => setStaffForm({...staffForm, designation_en: e.target.value, designation: e.target.value})} className="p-2 border rounded-lg" required />
                      <input type="text" placeholder="पद (हिंदी)" value={staffForm.designation_hi || ''} onChange={e => setStaffForm({...staffForm, designation_hi: e.target.value, designation: e.target.value})} className="p-2 border rounded-lg" />
                    </div>
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
