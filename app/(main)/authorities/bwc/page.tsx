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
  contactPhone: string;
}

interface MeetingMinute {
  id: string;
  title: string;
  date: string;
  documentUrl: string;
  uploadedDate: string;
  uploadedBy: string;
}

type TabType = 'members' | 'minutes';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const API_BASE_URL = `http://${process.env.NEXT_PUBLIC_URL || 'localhost:4000'}/bwc`;

export default function BWCPage() {
  const [activeTab, setActiveTab] = useState<TabType>('members');
  const [members, setMembers] = useState<AuthorityMember[]>([]);
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  
  // Loader and operational states
  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New item form template states
  const [newMember, setNewMember] = useState<Omit<AuthorityMember, 'id'>>({
    name: '',
    designation: '',
    affiliation: '',
    position: '',
    email: '',
    contactPhone: '',
  });

  const [newMinute, setNewMinute] = useState({
    title: '',
    date: '',
    uploadedBy: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Track files loaded to hot-swap existing PDFs
  const [replacingFile, setReplacingFile] = useState<{ [key: string]: File }>({});

  // Toast notifications UI state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch data on component mount
  const fetchBwcData = async () => {
    setLoading(true);
    try {
      const [membersRes, minutesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/members`),
        fetch(`${API_BASE_URL}/minutes`)
      ]);

      if (!membersRes.ok || !minutesRes.ok) {
        throw new Error('Database response unsuccessful.');
      }

      const membersData = await membersRes.json();
      const minutesData = await minutesRes.json();

      setMembers(membersData);
      setMinutes(minutesData);
      addToast('Data sync complete!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast('Failed to connect to backend server. Ensure Express is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBwcData();
  }, []);

  /* ==========================================================================
     BWC MEMBER HANDLERS
     ========================================================================== */
  const handleUpdateMemberLocal = (index: number, field: keyof AuthorityMember, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name) {
      addToast('Name is a required field.', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember)
      });

      if (!response.ok) throw new Error('Failed to create new BWC member.');
      const createdRecord = await response.json();

      setMembers((prev) => [...prev, createdRecord]);
      setNewMember({
        name: '',
        designation: '',
        affiliation: '',
        position: '',
        email: '',
        contactPhone: '',
      });
      addToast('Successfully registered new member!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Error executing insert operation.', 'error');
    }
  };

  const saveMemberEdits = async (member: AuthorityMember) => {
    setSavingId(member.id);
    try {
      const response = await fetch(`${API_BASE_URL}/members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });

      if (!response.ok) throw new Error('Database refused the modification request.');
      const updatedRecord = await response.json();

      setMembers(members.map((m) => (m.id === member.id ? updatedRecord : m)));
      addToast(`Updated member: ${member.name}`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Error occurred while saving modifications.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteMember = async (id: string, name: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/members/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Delete operation failed on database levels.');
      setMembers(members.filter((m) => m.id !== id));
      addToast(`Deleted entry: ${name}`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Could not delete member.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  /* ==========================================================================
     BWC MINUTES HANDLERS (With Multer-S3 uploads)
     ========================================================================== */
  const handleUpdateMinuteLocal = (index: number, field: keyof MeetingMinute, value: string) => {
    const updated = [...minutes];
    updated[index] = { ...updated[index], [field]: value };
    setMinutes(updated);
  };

  const handleAddMinuteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMinute.title || !newMinute.date || !selectedFile) {
      addToast('Please provide a Title, Meeting Date, and a PDF file attachment.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', newMinute.title);
    formData.append('date', newMinute.date);
    formData.append('uploadedBy', newMinute.uploadedBy || 'Admin');
    formData.append('file', selectedFile);

    setSavingId('new-minute');
    try {
      const response = await fetch(`${API_BASE_URL}/minutes`, {
        method: 'POST',
        body: formData // Server parses multipart form data
      });

      if (!response.ok) {
        const resErr = await response.json();
        throw new Error(resErr.error || 'Failed to upload document.');
      }

      const createdRecord = await response.json();
      setMinutes([createdRecord, ...minutes]);
      
      // Clear forms
      setNewMinute({ title: '', date: '', uploadedBy: '' });
      setSelectedFile(null);
      addToast('Uploaded meeting minutes & registered file!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to register meeting minute log.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const saveMinuteEdits = async (minute: MeetingMinute) => {
    setSavingId(minute.id);
    const formData = new FormData();
    formData.append('title', minute.title);
    formData.append('date', minute.date);
    formData.append('uploadedBy', minute.uploadedBy || 'Admin');

    if (replacingFile[minute.id]) {
      formData.append('file', replacingFile[minute.id]);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/minutes/${minute.id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) throw new Error('Refused to save BWC minutes updates.');
      const updatedRecord = await response.json();

      setMinutes(minutes.map((m) => (m.id === minute.id ? updatedRecord : m)));
      
      // Clean replacement file tracker for this entry
      if (replacingFile[minute.id]) {
        setReplacingFile(prev => {
          const next = { ...prev };
          delete next[minute.id];
          return next;
        });
      }
      addToast(`Updated minute log: ${minute.title}`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Error occurred while updating minute.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteMinute = async (id: string, title: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/minutes/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete file entry in db.');
      setMinutes(minutes.filter((m) => m.id !== id));
      addToast(`Deleted record & pruned storage file for: ${title}`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Error occurred while deleting minutes record.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const tabs = [
    {
      id: 'members' as TabType,
      label: 'Members Directory',
      icon: <Users size={18} />,
    },
    {
      id: 'minutes' as TabType,
      label: 'Meeting Minutes logs',
      icon: <FileText size={18} />,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6 min-h-screen bg-[#F4F4F5] relative">
      
      {/* Dynamic Slide Toasts */}
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

      {/* Hero Banner Header */}
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                Building & Works Committee (BWC)
              </h1>
              <p className="text-sm sm:text-base text-white/95 mt-1">
                Active dynamic administrative portal configured with Express/PostgreSQL and S3 MinIO Storage pipelines.
              </p>
            </div>
          </div>
          <button
            onClick={fetchBwcData}
            disabled={loading}
            className="self-start sm:self-center bg-white/10 hover:bg-white/20 disabled:bg-white/5 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 border border-white/25 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-12 h-12 text-[#631012] animate-spin" />
          <p className="text-lg font-medium text-stone-600">Retrieving committee information files...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          
          {/* Navigation Tab Header bar */}
          <div className="border-b border-stone-200">
            <div className="flex overflow-x-auto scrollbar-thin">
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
                
                {/* Form to insert new member to the DB */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#631012] mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#631012]" /> Add New BWC Member
                  </h3>
                  <form onSubmit={handleAddMemberSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Name *</label>
                      <input
                        type="text"
                        required
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                        placeholder="e.g. Shri S.K. Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Designation</label>
                      <input
                        type="text"
                        value={newMember.designation}
                        onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                        placeholder="e.g. Member Secretary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Affiliation</label>
                      <input
                        type="text"
                        value={newMember.affiliation}
                        onChange={(e) => setNewMember({ ...newMember, affiliation: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                        placeholder="e.g. CPWD Shimla"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Position / Role</label>
                      <input
                        type="text"
                        value={newMember.position}
                        onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                        placeholder="e.g. Chief Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Email ID</label>
                      <input
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                        placeholder="sharma.bwc@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={newMember.contactPhone}
                        onChange={(e) => setNewMember({ ...newMember, contactPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                        placeholder="e.g. +91-1972-254101"
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

                {/* Directory output listing with instant DB-sync controls */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="text-[#631012] w-5 h-5" />
                    <h2 className="text-xl font-bold text-[#171717]">Current Board Directory ({members.length})</h2>
                  </div>

                  {members.length === 0 ? (
                    <p className="text-stone-500 italic p-4 text-center border border-dashed rounded-lg">No active members found in BWC.</p>
                  ) : (
                    <div className="space-y-4">
                      {members.map((member, index) => (
                        <div
                          key={member.id}
                          className="p-4 border border-stone-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
                            <span className="text-sm font-semibold text-stone-500">
                              Member Record #{index + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => saveMemberEdits(member)}
                                disabled={savingId === member.id}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-green-700 hover:bg-green-800 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
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
                                  if (confirm(`Are you sure you want to remove member "${member.name}"?`)) {
                                    handleDeleteMember(member.id, member.name);
                                  }
                                }}
                                disabled={deletingId === member.id}
                                className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-55 rounded-lg transition-colors flex items-center gap-1"
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
                                onChange={(e) => handleUpdateMemberLocal(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Designation</label>
                              <input
                                type="text"
                                value={member.designation || ''}
                                onChange={(e) => handleUpdateMemberLocal(index, 'designation', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Affiliation</label>
                              <input
                                type="text"
                                value={member.affiliation || ''}
                                onChange={(e) => handleUpdateMemberLocal(index, 'affiliation', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Position / Office Role</label>
                              <input
                                type="text"
                                value={member.position || ''}
                                onChange={(e) => handleUpdateMemberLocal(index, 'position', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Email ID</label>
                              <input
                                type="email"
                                value={member.email || ''}
                                onChange={(e) => handleUpdateMemberLocal(index, 'email', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Contact Phone</label>
                              <input
                                type="text"
                                value={member.contactPhone || ''}
                                onChange={(e) => handleUpdateMemberLocal(index, 'contactPhone', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
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
                
                {/* Upload Section with File Stream Handling */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#631012] mb-4 flex items-center gap-2">
                    <FileUp className="w-5 h-5 text-[#631012]" /> Upload New Minutes Document (MinIO Storage)
                  </h3>
                  <form onSubmit={handleAddMinuteSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#171717]/70 mb-1 font-medium">Meeting Title *</label>
                        <input
                          type="text"
                          required
                          value={newMinute.title}
                          onChange={(e) => setNewMinute({ ...newMinute, title: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                          placeholder="e.g. 52nd Board meeting of BWC"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#171717]/70 mb-1 font-medium">Meeting Date *</label>
                        <input
                          type="date"
                          required
                          value={newMinute.date}
                          onChange={(e) => setNewMinute({ ...newMinute, date: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#171717]/70 mb-1 font-medium">Uploaded By</label>
                        <input
                          type="text"
                          value={newMinute.uploadedBy}
                          onChange={(e) => setNewMinute({ ...newMinute, uploadedBy: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                          placeholder="e.g. Works Committee Secretary"
                        />
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-[#631012]/30 rounded-xl p-4 text-center bg-white">
                      <input
                        type="file"
                        id="bwc-pdf-uploader"
                        accept=".pdf"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="bwc-pdf-uploader" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                        <Upload className="w-8 h-8 text-[#631012]/80" />
                        <span className="text-sm font-semibold text-[#631012]">
                          {selectedFile ? 'Change chosen file' : 'Click to select PDF document'}
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
                            <RefreshCw className="w-4 h-4 animate-spin" /> Uploading PDF to S3...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" /> Upload Document & Log Entry
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Listing of registered Meeting records */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="text-[#631012] w-5 h-5" />
                    <h2 className="text-xl font-bold text-[#171717]">Archived Minutes ({minutes.length})</h2>
                  </div>

                  {minutes.length === 0 ? (
                    <p className="text-stone-500 italic p-4 text-center border border-dashed rounded-lg">No records found.</p>
                  ) : (
                    <div className="space-y-4">
                      {minutes.map((minute, index) => {
                        // Extract plain YYYY-MM-DD from returned timestamps
                        const cleanedDate = minute.date ? minute.date.split('T')[0] : '';
                        
                        return (
                          <div
                            key={minute.id}
                            className="p-4 border border-stone-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
                              <span className="text-sm font-semibold text-stone-500 font-medium">
                                Record #{index + 1}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => saveMinuteEdits(minute)}
                                  disabled={savingId === minute.id}
                                  className="px-3 py-1.5 text-xs font-semibold text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
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
                                    if (confirm(`Do you want to delete minutes: "${minute.title}" and delete its stored PDF asset?`)) {
                                      handleDeleteMinute(minute.id, minute.title);
                                    }
                                  }}
                                  disabled={deletingId === minute.id}
                                  className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
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
                                  value={cleanedDate}
                                  onChange={(e) => handleUpdateMinuteLocal(index, 'date', e.target.value)}
                                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-[#171717] text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-stone-500 mb-1 font-medium">Uploaded By</label>
                                <input
                                  type="text"
                                  value={minute.uploadedBy || ''}
                                  onChange={(e) => handleUpdateMinuteLocal(index, 'uploadedBy', e.target.value)}
                                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-[#171717] text-sm"
                                />
                              </div>
                              
                              {/* PDF Viewing & Replacement Section */}
                              <div className="flex flex-col justify-end">
                                <label className="block text-xs font-semibold text-stone-500 mb-1 font-medium">Document File (.pdf)</label>
                                <div className="flex items-center gap-2">
                                  {minute.documentUrl ? (
                                    <a
                                      href={minute.documentUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 px-3 py-2 border border-emerald-200 bg-emerald-50 rounded-lg text-emerald-800 text-xs font-medium flex items-center justify-between hover:bg-emerald-100 transition-colors"
                                    >
                                      <span className="truncate max-w-[150px] sm:max-w-none">View PDF in S3 Bucket</span>
                                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 ml-1" />
                                    </a>
                                  ) : (
                                    <span className="flex-1 text-red-500 text-xs italic px-3 py-2 border border-red-200 bg-red-50 rounded-lg">No PDF File uploaded</span>
                                  )}
                                  
                                  {/* Custom PDF hot-swapper file picker */}
                                  <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 border border-stone-300 p-2 rounded-lg text-stone-700 flex-shrink-0 relative">
                                    <input
                                      type="file"
                                      accept=".pdf"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          setReplacingFile(prev => ({ ...prev, [minute.id]: file }));
                                          addToast(`File loaded to swap PDF for Record ${index + 1}`, 'info');
                                        }
                                      }}
                                      className="absolute inset-0 opacity-0 w-full cursor-pointer"
                                    />
                                    <Upload className="w-4 h-4" />
                                  </label>
                                </div>
                                {replacingFile[minute.id] && (
                                  <span className="text-[11px] text-amber-700 font-semibold mt-1">
                                    Ready to replace with: {replacingFile[minute.id].name} (pending update sync)
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