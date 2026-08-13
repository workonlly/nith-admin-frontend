'use client';

import React, { useState, useEffect } from 'react';
import { Save, Shield, Plus, Trash2, Users, FileText, Loader2 } from 'lucide-react';

interface AuthorityMember {
  id?: string;
  name: string;
  designation: string;
  affiliation: string;
  position: string;
  email: string;
  contactPhone: string;
}

interface MeetingMinute {
  id?: string;
  title: string;
  date: string;
  documentUrl?: string;
  uploadedDate?: string;
  uploadedBy: string;
  file?: File;
}

type TabType = 'members' | 'minutes';

interface AuthorityManagerProps {
  authorityName: string;
  apiBase: string;
}

export default function AuthorityManager({ authorityName, apiBase }: AuthorityManagerProps) {
  const hasMembers = apiBase === 'bog';
  const [activeTab, setActiveTab] = useState<TabType>(hasMembers ? 'members' : 'minutes');
  const [members, setMembers] = useState<AuthorityMember[]>([]);
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [apiBase]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const fetchPromises = [
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${apiBase}/minutes`).then(res => res.json())
      ];
      
      if (hasMembers) {
        fetchPromises.unshift(
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${apiBase}/members`).then(res => res.json())
        );
      }
      
      const results = await Promise.all(fetchPromises);
      
      if (hasMembers) {
        setMembers(Array.isArray(results[0]) ? results[0] : (results[0].data || []));
        setMinutes(Array.isArray(results[1]) ? results[1] : (results[1].data || []));
      } else {
        setMembers([]);
        setMinutes(Array.isArray(results[0]) ? results[0] : (results[0].data || []));
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveMember = async (index: number) => {
    const member = members[index];
    if (!member.name) {
      alert("Name is required");
      return;
    }
    setSavingId(`member-${index}`);
    try {
      const url = member.id 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${apiBase}/members/${member.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${apiBase}/members`;
        
      const method = member.id ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
      const data = await res.json();
      if (res.ok) {
        const updated = [...members];
        updated[index] = data;
        setMembers(updated);
        alert('Member saved successfully!');
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving member');
    } finally {
      setSavingId(null);
    }
  };

  const deleteMember = async (index: number, id?: string) => {
    if (!id) {
      setMembers(members.filter((_, i) => i !== index));
      return;
    }
    if (!confirm('Are you sure you want to delete this member?')) return;
    
    try {
      setSavingId(`member-del-${index}`);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${apiBase}/members/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMembers(members.filter((_, i) => i !== index));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting member');
    } finally {
      setSavingId(null);
    }
  };

  const saveMinute = async (index: number) => {
    const minute = minutes[index];
    if (!minute.title || !minute.date) {
      alert("Title and Date are required");
      return;
    }
    if (!minute.id && !minute.file) {
      alert("PDF file upload is required for new minutes");
      return;
    }
    
    setSavingId(`minute-${index}`);
    try {
      const url = minute.id 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${apiBase}/minutes/${minute.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${apiBase}/minutes`;
        
      const method = minute.id ? 'PUT' : 'POST';
      
      const formData = new FormData();
      formData.append('title', minute.title);
      formData.append('date', minute.date);
      formData.append('uploadedBy', minute.uploadedBy);
      if (minute.file) {
        formData.append('file', minute.file);
      }
      
      const res = await fetch(url, {
        method,
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        const updated = [...minutes];
        updated[index] = data;
        setMinutes(updated);
        alert('Minute saved successfully!');
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving minute');
    } finally {
      setSavingId(null);
    }
  };

  const deleteMinute = async (index: number, id?: string) => {
    if (!id) {
      setMinutes(minutes.filter((_, i) => i !== index));
      return;
    }
    if (!confirm('Are you sure you want to delete this minute?')) return;
    
    try {
      setSavingId(`minute-del-${index}`);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${apiBase}/minutes/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMinutes(minutes.filter((_, i) => i !== index));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting minute');
    } finally {
      setSavingId(null);
    }
  };

  const updateMember = (index: number, field: keyof AuthorityMember, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const addMember = () => {
    setMembers([
      ...members,
      { name: '', designation: '', affiliation: '', position: '', email: '', contactPhone: '' }
    ]);
  };

  const updateMinute = (index: number, field: keyof MeetingMinute, value: any) => {
    const updated = [...minutes];
    updated[index] = { ...updated[index], [field]: value };
    setMinutes(updated);
  };

  const addMinute = () => {
    setMinutes([
      ...minutes,
      { title: '', date: '', uploadedBy: 'Admin' }
    ]);
  };

  const tabs = [
    ...(hasMembers ? [{ id: 'members' as TabType, label: 'Members', icon: <Users size={18} /> }] : []),
    { id: 'minutes' as TabType, label: 'Meeting Minutes', icon: <FileText size={18} /> },
  ];

  if (loading) {
    return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#631012]" /></div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            {authorityName}
          </h1>
        </div>
        <p className="text-sm sm:text-base text-white/90">
          Manage {authorityName} members and meeting minutes
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-[#171717]/10">
          <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-[#631012]/30 scrollbar-track-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0 ${
                  activeTab === tab.id ? 'bg-[#631012] text-white border-b-2 border-[#631012]' : 'text-[#171717]/70 hover:bg-[#F9F9F9] hover:text-[#171717]'
                }`}
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Users className="text-[#631012] w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">Members</h2>
              </div>
              <div className="space-y-3">
                {members.map((member, index) => (
                  <div key={member.id || index} className="p-4 border border-[#171717]/20 rounded-lg bg-[#F9F9F9] space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#171717]/60">Member {index + 1}</span>
                      <div className="flex gap-2">
                        <button onClick={() => saveMember(index)} className="px-3 py-1 bg-[#631012] text-white text-xs rounded hover:bg-[#7a1214] flex items-center gap-1">
                          {savingId === `member-${index}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                        </button>
                        <button onClick={() => deleteMember(index, member.id)} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                          {savingId === `member-del-${index}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-[#171717]/60 mb-1">Name *</label>
                        <input type="text" value={member.name} onChange={(e) => updateMember(index, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm text-black" />
                      </div>
                      <div>
                        <label className="block text-xs text-[#171717]/60 mb-1">Designation</label>
                        <input type="text" value={member.designation} onChange={(e) => updateMember(index, 'designation', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm text-black" />
                      </div>
                      <div>
                        <label className="block text-xs text-[#171717]/60 mb-1">Affiliation</label>
                        <input type="text" value={member.affiliation} onChange={(e) => updateMember(index, 'affiliation', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm text-black" />
                      </div>
                      <div>
                        <label className="block text-xs text-[#171717]/60 mb-1">Position</label>
                        <input type="text" value={member.position} onChange={(e) => updateMember(index, 'position', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm text-black" />
                      </div>
                      <div>
                        <label className="block text-xs text-[#171717]/60 mb-1">Email</label>
                        <input type="email" value={member.email} onChange={(e) => updateMember(index, 'email', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm text-black" />
                      </div>
                      <div>
                        <label className="block text-xs text-[#171717]/60 mb-1">Contact Phone</label>
                        <input type="tel" value={member.contactPhone} onChange={(e) => updateMember(index, 'contactPhone', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm text-black" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addMember} className="flex items-center gap-2 px-3 sm:px-4 py-2 text-[#631012] hover:bg-[#631012]/10 rounded-lg text-sm font-semibold">
                  <Plus size={18} /> Add Member
                </button>
              </div>
            </div>
          )}

          {/* Meeting Minutes Tab */}
          {activeTab === 'minutes' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <FileText className="text-[#631012] w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">Meeting Minutes</h2>
              </div>
              <div className="space-y-3">
                {minutes.map((minute, index) => (
                  <div key={minute.id || index} className="p-4 border border-[#171717]/20 rounded-lg bg-[#F9F9F9] space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#171717]/60">Minute {index + 1}</span>
                      <div className="flex gap-2">
                        <button onClick={() => saveMinute(index)} className="px-3 py-1 bg-[#631012] text-white text-xs rounded hover:bg-[#7a1214] flex items-center gap-1">
                          {savingId === `minute-${index}` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                        </button>
                        <button onClick={() => deleteMinute(index, minute.id)} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                          {savingId === `minute-del-${index}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-[#171717]/60 mb-1">Title *</label>
                        <input type="text" value={minute.title} onChange={(e) => updateMinute(index, 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm text-black" />
                      </div>
                      <div>
                        <label className="block text-xs text-[#171717]/60 mb-1">Date *</label>
                        <input type="date" value={minute.date} onChange={(e) => updateMinute(index, 'date', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm text-black" />
                      </div>
                      <div>
                        <label className="block text-xs text-[#171717]/60 mb-1">Upload PDF Document</label>
                        <input type="file" accept="application/pdf" onChange={(e) => e.target.files && updateMinute(index, 'file', e.target.files[0])} className="w-full px-3 py-2 border rounded-lg text-sm text-black" />
                        {minute.documentUrl && !minute.file && (
                          <a href={minute.documentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 mt-1 block hover:underline">View current document</a>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-[#171717]/60 mb-1">Uploaded By</label>
                        <input type="text" value={minute.uploadedBy} onChange={(e) => updateMinute(index, 'uploadedBy', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm text-black" />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addMinute} className="flex items-center gap-2 px-3 sm:px-4 py-2 text-[#631012] hover:bg-[#631012]/10 rounded-lg text-sm font-semibold">
                  <Plus size={18} /> Add Minute
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
