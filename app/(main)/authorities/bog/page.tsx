'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Trash2, 
  Users, 
  FileText, 
  Upload, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  X,
  FileUp
} from 'lucide-react';

interface AuthorityMember {
  id: string;
  name: string;
  designation: string;
  affiliation: string;
  position: string;
  email: string;
  contact_phone: string; // matches backend response
}

interface MeetingMinute {
  id: string;
  title: string;
  meeting_date: string; // matches backend response
  document_url: string; // matches backend response
  uploaded_by: string;  // matches backend response
}

type TabType = 'members' | 'minutes';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const API_BASE_URL = `http://${process.env.NEXT_PUBLIC_URL || 'localhost:4000'}/bog`;

export default function BOGPage() {
  const [activeTab, setActiveTab] = useState<TabType>('members');
  const [members, setMembers] = useState<AuthorityMember[]>([]);
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  
  // Loading & Action states
  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Temp form states for adding new entries cleanly
  const [newMember, setNewMember] = useState<Omit<AuthorityMember, 'id'>>({
    name: '',
    designation: '',
    affiliation: '',
    position: '',
    email: '',
    contact_phone: '',
  });

  const [newMinute, setNewMinute] = useState({
    title: '',
    meeting_date: '',
    uploaded_by: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Track files being replaced/uploaded for existing minutes
  const [replacingFile, setReplacingFile] = useState<{ [key: string]: File }>({});

  // UI Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersRes, minutesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/members`),
        fetch(`${API_BASE_URL}/minutes`)
      ]);

      if (!membersRes.ok || !minutesRes.ok) {
        throw new Error('Failed to fetch BOG contents from backend.');
      }

      const membersData = await membersRes.json();
      const minutesData = await minutesRes.json();

      setMembers(membersData);
      setMinutes(minutesData);
      addToast('Data loaded successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err.message || 'Error communicating with database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ==========================================================================
     MEMBER ACTIONS
     ========================================================================== */
  const handleUpdateMember = (index: number, field: keyof AuthorityMember, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const saveMemberChanges = async (member: AuthorityMember) => {
    setSavingId(member.id);
    try {
      const response = await fetch(`${API_BASE_URL}/members/${member.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: member.name,
          designation: member.designation,
          affiliation: member.affiliation,
          position: member.position,
          email: member.email,
          contactPhone: member.contact_phone, // matches express backend req.body mapping
        }),
      });

      if (!response.ok) throw new Error('Could not update member record.');
      const updatedRecord = await response.json();
      
      // Update local state with returned item
      setMembers(members.map((m) => (m.id === member.id ? updatedRecord : m)));
      addToast(`Updated details for ${member.name || 'Member'}`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to update member.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name) {
      addToast('Member name is required.', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newMember.name,
          designation: newMember.designation,
          affiliation: newMember.affiliation,
          position: newMember.position,
          email: newMember.email,
          contactPhone: newMember.contact_phone, // backend maps contactPhone to contact_phone
        }),
      });

      if (!response.ok) throw new Error('Could not insert new member.');
      const created = await response.json();

      setMembers([...members, created]);
      setNewMember({
        name: '',
        designation: '',
        affiliation: '',
        position: '',
        email: '',
        contact_phone: '',
      });
      addToast('New member registered successfully!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to register member.', 'error');
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/members/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Could not delete member.');
      
      setMembers(members.filter((m) => m.id !== id));
      addToast(`Removed member: ${name || 'ID ' + id}`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to remove member.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  /* ==========================================================================
     MEETING MINUTES ACTIONS
     ========================================================================== */
  const handleUpdateMinuteLocal = (index: number, field: keyof MeetingMinute, value: string) => {
    const updated = [...minutes];
    updated[index] = { ...updated[index], [field]: value };
    setMinutes(updated);
  };

  const handleAddMinute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMinute.title || !newMinute.meeting_date || !selectedFile) {
      addToast('Please provide a Title, Meeting Date, and a PDF document file.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', newMinute.title);
    formData.append('date', newMinute.meeting_date);
    formData.append('uploadedBy', newMinute.uploaded_by || 'Admin');
    formData.append('file', selectedFile);

    try {
      setSavingId('new-minute');
      const response = await fetch(`${API_BASE_URL}/minutes`, {
        method: 'POST',
        body: formData, // Do NOT set Content-Type header manually when using FormData
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to upload and create minute.');
      }

      const created = await response.json();
      setMinutes([created, ...minutes]);
      
      // Reset State
      setNewMinute({ title: '', meeting_date: '', uploaded_by: '' });
      setSelectedFile(null);
      addToast('Meeting Minute uploaded and created successfully!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to upload minutes.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const saveMinuteChanges = async (minute: MeetingMinute) => {
    setSavingId(minute.id);
    const formData = new FormData();
    formData.append('title', minute.title);
    formData.append('date', minute.meeting_date);
    formData.append('uploadedBy', minute.uploaded_by || 'Admin');
    
    // Check if user has picked a replacement file
    if (replacingFile[minute.id]) {
      formData.append('file', replacingFile[minute.id]);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/minutes/${minute.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Could not update meeting minute record.');
      const updatedRecord = await response.json();

      setMinutes(minutes.map((m) => (m.id === minute.id ? updatedRecord : m)));
      
      // Clear file replacement state for this ID
      if (replacingFile[minute.id]) {
        setReplacingFile(prev => {
          const next = { ...prev };
          delete next[minute.id];
          return next;
        });
      }
      
      addToast(`Updated details for: ${minute.title}`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to update meeting minute.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteMinute = async (id: string, title: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/minutes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Could not delete minute.');

      setMinutes(minutes.filter((m) => m.id !== id));
      addToast(`Deleted meeting minute: ${title}`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to delete meeting minute.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const tabs = [
    {
      id: 'members' as TabType,
      label: 'Members',
      icon: <Users size={18} />,
    },
    {
      id: 'minutes' as TabType,
      label: 'Meeting Minutes',
      icon: <FileText size={18} />,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6 min-h-screen bg-[#F4F4F5] relative">
      
      {/* Toast Notification Area */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg text-white flex items-start gap-3 transition-all duration-300 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-[#15803d]'
                : toast.type === 'error'
                ? 'bg-[#b91c1c]'
                : 'bg-[#1e40af]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Header Panel */}
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                Board of Governors (BOG) Panel
              </h1>
              <p className="text-sm sm:text-base text-white/90">
                Connected live editor: synchronization with database and MinIO storage
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="self-start sm:self-center bg-white/15 hover:bg-white/25 disabled:bg-white/5 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Board Data
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-12 h-12 text-[#631012] animate-spin" />
          <p className="text-lg font-medium text-[#171717]/80">Loading database records...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          
          {/* Tabs header */}
          <div className="border-b border-[#171717]/10">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0
                    ${
                      activeTab === tab.id
                        ? 'bg-[#631012] text-white border-b-2 border-[#631012]'
                        : 'text-[#171717]/70 hover:bg-[#F9F9F9] hover:text-[#171717]'
                    }
                  `}
                >
                  <span className="w-4 h-4 sm:w-5 sm:h-5">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            {/* ========================================== MEMBERS TAB ========================================== */}
            {activeTab === 'members' && (
              <div className="space-y-8">
                
                {/* Add new member form panel */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#631012] mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add New Board Member
                  </h3>
                  <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#171717]/70 mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                        placeholder="e.g. Prof. Rajesh Kumar"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#171717]/70 mb-1">Designation</label>
                      <input
                        type="text"
                        value={newMember.designation}
                        onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
                        className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                        placeholder="e.g. Chairman"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#171717]/70 mb-1">Affiliation</label>
                      <input
                        type="text"
                        value={newMember.affiliation}
                        onChange={(e) => setNewMember({ ...newMember, affiliation: e.target.value })}
                        className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                        placeholder="e.g. NIT Hamirpur"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#171717]/70 mb-1">Position / Office Role</label>
                      <input
                        type="text"
                        value={newMember.position}
                        onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                        className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                        placeholder="e.g. Director"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#171717]/70 mb-1">Email</label>
                      <input
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                        placeholder="chairman.bog@nith.ac.in"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#171717]/70 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        value={newMember.contact_phone}
                        onChange={(e) => setNewMember({ ...newMember, contact_phone: e.target.value })}
                        className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                        placeholder="+91-1972-254001"
                      />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-2">
                      <button
                        type="submit"
                        className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm shadow-sm"
                      >
                        <Plus className="w-4 h-4" /> Save New Member to Database
                      </button>
                    </div>
                  </form>
                </div>

                {/* Existing Members List */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="text-[#631012] w-5 h-5" />
                    <h2 className="text-xl font-bold text-[#171717]">Current Board Members ({members.length})</h2>
                  </div>

                  {members.length === 0 ? (
                    <p className="text-stone-500 italic p-4 text-center border border-dashed rounded-lg">No members found in the database directory.</p>
                  ) : (
                    <div className="space-y-4">
                      {members.map((member, index) => (
                        <div
                          key={member.id}
                          className="p-4 border border-stone-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
                            <span className="text-sm font-semibold text-stone-500">
                              Directory Index #{index + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => saveMemberChanges(member)}
                                disabled={savingId === member.id}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                              >
                                {savingId === member.id ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle className="w-3.5 h-3.5" />
                                )}
                                Sync Changes
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to remove ${member.name || 'this member'}?`)) {
                                    handleDeleteMember(member.id, member.name);
                                  }
                                }}
                                disabled={deletingId === member.id}
                                className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                {deletingId === member.id ? 'Deleting...' : 'Remove'}
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Name</label>
                              <input
                                type="text"
                                value={member.name || ''}
                                onChange={(e) => handleUpdateMember(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-[#171717] text-sm font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Designation</label>
                              <input
                                type="text"
                                value={member.designation || ''}
                                onChange={(e) => handleUpdateMember(index, 'designation', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-[#171717] text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Affiliation</label>
                              <input
                                type="text"
                                value={member.affiliation || ''}
                                onChange={(e) => handleUpdateMember(index, 'affiliation', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-[#171717] text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Position / Office Role</label>
                              <input
                                type="text"
                                value={member.position || ''}
                                onChange={(e) => handleUpdateMember(index, 'position', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-[#171717] text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Email ID</label>
                              <input
                                type="email"
                                value={member.email || ''}
                                onChange={(e) => handleUpdateMember(index, 'email', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-[#171717] text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Contact Phone</label>
                              <input
                                type="text"
                                value={member.contact_phone || ''}
                                onChange={(e) => handleUpdateMember(index, 'contact_phone', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-[#171717] text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================== MEETING MINUTES TAB ========================================== */}
            {activeTab === 'minutes' && (
              <div className="space-y-8">
                
                {/* Upload panel for minute document */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#631012] mb-4 flex items-center gap-2">
                    <FileUp className="w-5 h-5 text-[#631012]" /> Upload New Meeting Minutes File (MinIO)
                  </h3>
                  <form onSubmit={handleAddMinute} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#171717]/70 mb-1 font-medium">Meeting Title *</label>
                        <input
                          type="text"
                          required
                          value={newMinute.title}
                          onChange={(e) => setNewMinute({ ...newMinute, title: e.target.value })}
                          className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                          placeholder="e.g. 26th Meeting of BOG"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#171717]/70 mb-1 font-medium">Meeting Date *</label>
                        <input
                          type="date"
                          required
                          value={newMinute.meeting_date}
                          onChange={(e) => setNewMinute({ ...newMinute, meeting_date: e.target.value })}
                          className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#171717]/70 mb-1 font-medium">Uploaded By</label>
                        <input
                          type="text"
                          value={newMinute.uploaded_by}
                          onChange={(e) => setNewMinute({ ...newMinute, uploaded_by: e.target.value })}
                          className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                          placeholder="e.g. Administrator"
                        />
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-[#631012]/30 rounded-xl p-4 text-center bg-white">
                      <input
                        type="file"
                        id="pdf-uploader"
                        accept=".pdf"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="pdf-uploader" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                        <Upload className="w-8 h-8 text-[#631012]/80" />
                        <span className="text-sm font-semibold text-[#631012]">
                          {selectedFile ? 'Change selected file' : 'Click to select PDF document'}
                        </span>
                        <span className="text-xs text-stone-500">
                          {selectedFile ? `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)` : 'Only PDF documents allowed'}
                        </span>
                      </label>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={savingId === 'new-minute'}
                        className="bg-[#631012] hover:bg-[#7a1214] disabled:bg-stone-400 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors text-sm shadow-sm"
                      >
                        {savingId === 'new-minute' ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Uploading PDF to MinIO...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" /> Upload Document & Create Record
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Existing minutes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="text-[#631012] w-5 h-5" />
                    <h2 className="text-xl font-bold text-[#171717]">Uploaded Meeting Minutes ({minutes.length})</h2>
                  </div>

                  {minutes.length === 0 ? (
                    <p className="text-stone-500 italic p-4 text-center border border-dashed rounded-lg">No minute files found in database archives.</p>
                  ) : (
                    <div className="space-y-4">
                      {minutes.map((minute, index) => {
                        // Format ISO meeting date to YYYY-MM-DD for standard browser input tags
                        const displayDate = minute.meeting_date ? minute.meeting_date.split('T')[0] : '';
                        
                        return (
                          <div
                            key={minute.id}
                            className="p-4 border border-stone-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
                              <span className="text-sm font-semibold text-stone-500">
                                Minute Record #{index + 1}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => saveMinuteChanges(minute)}
                                  disabled={savingId === minute.id}
                                  className="px-3 py-1.5 text-xs font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                                >
                                  {savingId === minute.id ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  )}
                                  Update Minutes
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to completely remove "${minute.title}" and delete its stored PDF?`)) {
                                      handleDeleteMinute(minute.id, minute.title);
                                    }
                                  }}
                                  disabled={deletingId === minute.id}
                                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  {deletingId === minute.id ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-xs font-semibold text-stone-500 mb-1 font-medium">Minutes Title</label>
                                <input
                                  type="text"
                                  value={minute.title || ''}
                                  onChange={(e) => handleUpdateMinuteLocal(index, 'title', e.target.value)}
                                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-[#171717] text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-stone-500 mb-1 font-medium">Meeting Date</label>
                                <input
                                  type="date"
                                  value={displayDate}
                                  onChange={(e) => handleUpdateMinuteLocal(index, 'meeting_date', e.target.value)}
                                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-[#171717] text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-stone-500 mb-1 font-medium">Uploader Name</label>
                                <input
                                  type="text"
                                  value={minute.uploaded_by || ''}
                                  onChange={(e) => handleUpdateMinuteLocal(index, 'uploaded_by', e.target.value)}
                                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-[#171717] text-sm"
                                />
                              </div>
                              
                              {/* Live File/PDF section */}
                              <div className="flex flex-col justify-end">
                                <label className="block text-xs font-semibold text-stone-500 mb-1 font-medium">Document PDF</label>
                                <div className="flex items-center gap-2">
                                  {minute.document_url ? (
                                    <a
                                      href={minute.document_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 px-3 py-2 border border-emerald-200 bg-emerald-50 rounded-lg text-emerald-800 text-xs font-medium flex items-center justify-between hover:bg-emerald-100 transition-colors"
                                    >
                                      <span className="truncate max-w-[150px] sm:max-w-none">View PDF in bucket</span>
                                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 ml-1" />
                                    </a>
                                  ) : (
                                    <span className="flex-1 text-red-500 text-xs italic px-3 py-2 border border-red-200 bg-red-50 rounded-lg">Missing PDF File</span>
                                  )}
                                  
                                  {/* Replace Document file trigger */}
                                  <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 border border-stone-300 p-2 rounded-lg text-stone-700 flex-shrink-0 relative">
                                    <input
                                      type="file"
                                      accept=".pdf"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          setReplacingFile(prev => ({ ...prev, [minute.id]: file }));
                                          addToast(`File selected to replace PDF for ID ${minute.id}`, 'info');
                                        }
                                      }}
                                      className="absolute inset-0 opacity-0 w-full cursor-pointer"
                                    />
                                    <Upload className="w-4 h-4" />
                                  </label>
                                </div>
                                {replacingFile[minute.id] && (
                                  <span className="text-[11px] text-amber-700 font-medium mt-1">
                                    Will replace with: {replacingFile[minute.id].name} (pending update)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}