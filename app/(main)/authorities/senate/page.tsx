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
  FileUp,
  Mail,
  Phone,
  Calendar,
  User,
  Activity
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

interface DeleteConfirmState {
  type: 'member' | 'minute';
  id: string;
  label: string;
}

const API_BASE_URL = `http://${process.env.NEXT_PUBLIC_URL || 'localhost:4000'}/senate`;

export default function SenatePage() {
  const [activeTab, setActiveTab] = useState<TabType>('members');
  const [members, setMembers] = useState<AuthorityMember[]>([]);
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  
  // Loading & transactional states
  const [loading, setLoading] = useState<boolean>(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modal deletion confirmation state (replacing native confirm)
  const [confirmDelete, setConfirmDelete] = useState<DeleteConfirmState | null>(null);

  // New forms states
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
  
  // File hot-swaps tracker for existing meeting minutes
  const [replacingFile, setReplacingFile] = useState<{ [key: string]: File }>({});

  // Toast systems UI
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

  // API Call: Fetch all Senate directory files
  const fetchSenateContent = async () => {
    setLoading(true);
    try {
      const [membersRes, minutesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/members`),
        fetch(`${API_BASE_URL}/minutes`)
      ]);

      if (!membersRes.ok || !minutesRes.ok) {
        throw new Error('Database server returned error status code.');
      }

      const membersData = await membersRes.json();
      const minutesData = await minutesRes.json();

      setMembers(membersData);
      setMinutes(minutesData);
      addToast('Data synchronized successfully!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast('Failed to retrieve Senate information from the database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSenateContent();
  }, []);

  /* ==========================================================================
     MEMBER TRANSACTIONS
     ========================================================================== */
  const handleUpdateMemberField = (index: number, field: keyof AuthorityMember, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const submitNewMember = async (e: React.FormEvent) => {
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

      if (!response.ok) throw new Error('Refused by Senate database.');
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
      addToast('Registered new Senate member successfully!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Error occurred while saving member details.', 'error');
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

      if (!response.ok) throw new Error('Database updates rejected.');
      const updatedRecord = await response.json();

      setMembers(members.map((m) => (m.id === member.id ? updatedRecord : m)));
      addToast(`Changes synced for member: ${member.name}`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to sync member adjustments.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const triggerDeleteMember = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/members/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Delete call rejected.');
      setMembers(members.filter((m) => m.id !== id));
      addToast('Senate member removed successfully.', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to remove member.', 'error');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  /* ==========================================================================
     MEETING MINUTES TRANSACTIONS (Form Data / Files)
     ========================================================================== */
  const handleUpdateMinuteField = (index: number, field: keyof MeetingMinute, value: string) => {
    const updated = [...minutes];
    updated[index] = { ...updated[index], [field]: value };
    setMinutes(updated);
  };

  const submitNewMinute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMinute.title || !newMinute.date || !selectedFile) {
      addToast('Title, date, and a PDF file are mandatory.', 'error');
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
        body: formData // Let browser set Content-Type with correct boundary boundaries
      });

      if (!response.ok) {
        const errorJson = await response.json();
        throw new Error(errorJson.error || 'Failed to upload minutes to storage.');
      }

      const createdRecord = await response.json();
      setMinutes([createdRecord, ...minutes]);

      // Form clearers
      setNewMinute({ title: '', date: '', uploadedBy: '' });
      setSelectedFile(null);
      addToast('Meeting Minute & S3 PDF logged successfully!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to add meeting minutes.', 'error');
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

      if (!response.ok) throw new Error('Refused to save updates to Senate Minutes database.');
      const updatedRecord = await response.json();

      setMinutes(minutes.map((m) => (m.id === minute.id ? updatedRecord : m)));

      if (replacingFile[minute.id]) {
        setReplacingFile((prev) => {
          const next = { ...prev };
          delete next[minute.id];
          return next;
        });
      }
      addToast(`Updated record for: ${minute.title}`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Error updating record.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const triggerDeleteMinute = async (id: string) => {
    setDeletingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/minutes/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Refused to drop file reference from database.');
      setMinutes(minutes.filter((m) => m.id !== id));
      addToast('Pruned S3 storage assets and deleted meeting record.', 'success');
    } catch (err: any) {
      addToast(err.message || 'Error deleting file.', 'error');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const executeDeleteAction = () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'member') {
      triggerDeleteMember(confirmDelete.id);
    } else {
      triggerDeleteMinute(confirmDelete.id);
    }
  };

  const tabs = [
    {
      id: 'members' as TabType,
      label: 'Senate Directory',
      icon: <Users size={18} />,
    },
    {
      id: 'minutes' as TabType,
      label: 'Minutes Database',
      icon: <FileText size={18} />,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6 min-h-screen bg-[#F4F4F5] relative">
      
      {/* Dynamic Overlay Slide Toasts */}
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

      {/* Custom Confirmation Modal (Replaces Native Confirms) */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border border-stone-200">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-red-100 text-red-700 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">Are you absolutely sure?</h3>
                <p className="text-sm text-stone-500 mt-1">
                  You are about to delete <span className="font-semibold text-stone-700">{confirmDelete.label}</span>. 
                  This will permanently clear this record from our directories and purge any associated S3 storage files.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 font-medium rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteAction}
                disabled={deletingId !== null}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:bg-stone-400 text-white font-medium rounded-lg text-sm flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {deletingId ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" /> Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner Header */}
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                Senate Control Center
              </h1>
              <p className="text-sm sm:text-base text-white/90 mt-1">
                Connected Administrative Live Sync: Database & MinIO File Asset Pipelines
              </p>
            </div>
          </div>
          <button
            onClick={fetchSenateContent}
            disabled={loading}
            className="self-start sm:self-center bg-white/10 hover:bg-white/20 disabled:bg-white/5 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 border border-white/25 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Database
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="w-12 h-12 text-[#631012] animate-spin" />
          <p className="text-lg font-medium text-stone-600">Retrieving Senate database archives...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          
          {/* Navigation Tab Header bar */}
          <div className="border-b border-stone-200">
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
                
                {/* Form to insert new member to the DB */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#631012] mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#631012]" /> Add New Senate Member
                  </h3>
                  <form onSubmit={submitNewMember} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                        placeholder="e.g. Prof. Lalit Kumar"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Designation</label>
                      <input
                        type="text"
                        value={newMember.designation}
                        onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                        placeholder="e.g. Committee Chairman"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Affiliation</label>
                      <input
                        type="text"
                        value={newMember.affiliation}
                        onChange={(e) => setNewMember({ ...newMember, affiliation: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                        placeholder="e.g. NIT Hamirpur"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Position / Office Role</label>
                      <input
                        type="text"
                        value={newMember.position}
                        onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                        placeholder="e.g. Dean of Academics"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                        placeholder="e.g. dean.acad@nith.ac.in"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={newMember.contactPhone}
                        onChange={(e) => setNewMember({ ...newMember, contactPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                        placeholder="e.g. +91-1972-254002"
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
                    <h2 className="text-xl font-bold text-stone-900">Current Senate Directory ({members.length})</h2>
                  </div>

                  {members.length === 0 ? (
                    <div className="text-stone-500 italic p-8 text-center border border-dashed rounded-xl bg-stone-50/50">
                      No Senate members registered in the database.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {members.map((member, index) => (
                        <div
                          key={member.id}
                          className="p-4 border border-stone-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
                            <span className="text-sm font-semibold text-stone-500">
                              Member Directory ID #{index + 1}
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
                                onClick={() => setConfirmDelete({ type: 'member', id: member.id, label: member.name })}
                                className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Name</label>
                              <input
                                type="text"
                                value={member.name || ''}
                                onChange={(e) => handleUpdateMemberField(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Designation</label>
                              <input
                                type="text"
                                value={member.designation || ''}
                                onChange={(e) => handleUpdateMemberField(index, 'designation', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Affiliation</label>
                              <input
                                type="text"
                                value={member.affiliation || ''}
                                onChange={(e) => handleUpdateMemberField(index, 'affiliation', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Position / Office Role</label>
                              <input
                                type="text"
                                value={member.position || ''}
                                onChange={(e) => handleUpdateMemberField(index, 'position', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Email Address</label>
                              <input
                                type="email"
                                value={member.email || ''}
                                onChange={(e) => handleUpdateMemberField(index, 'email', e.target.value)}
                                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-stone-500 mb-1">Contact Phone</label>
                              <input
                                type="text"
                                value={member.contactPhone || ''}
                                onChange={(e) => handleUpdateMemberField(index, 'contactPhone', e.target.value)}
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
                
                {/* Drag-n-drop file attachment loader for Senate meeting mins */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-[#631012] mb-4 flex items-center gap-2">
                    <FileUp className="w-5 h-5 text-[#631012]" /> Upload New Minutes Record (MinIO Storage S3)
                  </h3>
                  <form onSubmit={submitNewMinute} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Meeting Title *</label>
                        <input
                          type="text"
                          required
                          value={newMinute.title}
                          onChange={(e) => setNewMinute({ ...newMinute, title: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                          placeholder="e.g. 42nd Senate Meeting"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Meeting Date *</label>
                        <input
                          type="date"
                          required
                          value={newMinute.date}
                          onChange={(e) => setNewMinute({ ...newMinute, date: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1">Uploaded By</label>
                        <input
                          type="text"
                          value={newMinute.uploadedBy}
                          onChange={(e) => setNewMinute({ ...newMinute, uploadedBy: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                          placeholder="e.g. Senate Registrar"
                        />
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-[#631012]/30 rounded-xl p-4 text-center bg-white relative hover:border-[#631012]/50 transition-colors">
                      <input
                        type="file"
                        id="senate-file-uploader"
                        accept=".pdf"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="senate-file-uploader" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                        <Upload className="w-8 h-8 text-[#631012]/85" />
                        <span className="text-sm font-semibold text-[#631012]">
                          {selectedFile ? 'Change Selected PDF File' : 'Click to select Minutes PDF document'}
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
                        className="bg-[#631012] hover:bg-[#7a1214] disabled:bg-stone-400 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-semibold transition-colors text-sm shadow-sm"
                      >
                        {savingId === 'new-minute' ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Uploading S3 File Asset...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" /> Save Minutes and Upload File
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Listing of registered meeting minutes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FileText className="text-[#631012] w-5 h-5" />
                    <h2 className="text-xl font-bold text-stone-900">Archived Meeting Minutes ({minutes.length})</h2>
                  </div>

                  {minutes.length === 0 ? (
                    <div className="text-stone-500 italic p-8 text-center border border-dashed rounded-xl bg-stone-50/50">
                      No meeting minutes found in database archives.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {minutes.map((minute, index) => {
                        const cleanedDate = minute.date ? minute.date.split('T')[0] : '';
                        
                        return (
                          <div
                            key={minute.id}
                            className="p-4 border border-stone-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-100">
                              <span className="text-sm font-semibold text-stone-500">
                                Senate Minute File Record #{index + 1}
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
                                  onClick={() => setConfirmDelete({ type: 'minute', id: minute.id, label: minute.title })}
                                  className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-xs font-semibold text-stone-500 mb-1">Minutes Title</label>
                                <input
                                  type="text"
                                  value={minute.title || ''}
                                  onChange={(e) => handleUpdateMinuteField(index, 'title', e.target.value)}
                                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-stone-500 mb-1">Meeting Date</label>
                                <input
                                  type="date"
                                  value={cleanedDate}
                                  onChange={(e) => handleUpdateMinuteField(index, 'date', e.target.value)}
                                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-stone-500 mb-1">Uploaded By</label>
                                <input
                                  type="text"
                                  value={minute.uploadedBy || ''}
                                  onChange={(e) => handleUpdateMinuteField(index, 'uploadedBy', e.target.value)}
                                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#631012] text-black text-sm"
                                />
                              </div>
                              
                              {/* Document file viewer and S3 swapper */}
                              <div className="flex flex-col justify-end">
                                <label className="block text-xs font-semibold text-stone-500 mb-1">Document File (.pdf)</label>
                                <div className="flex items-center gap-2">
                                  {minute.documentUrl ? (
                                    <a
                                      href={minute.documentUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 px-3 py-2 border border-emerald-200 bg-emerald-50 rounded-lg text-emerald-800 text-xs font-medium flex items-center justify-between hover:bg-emerald-100 transition-colors"
                                    >
                                      <span className="truncate max-w-[150px] sm:max-w-none">View PDF inside S3 Bucket</span>
                                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 ml-1" />
                                    </a>
                                  ) : (
                                    <span className="flex-1 text-red-500 text-xs italic px-3 py-2 border border-red-200 bg-red-50 rounded-lg">Missing PDF File asset</span>
                                  )}
                                  
                                  {/* Custom PDF replacer tag */}
                                  <label className="cursor-pointer bg-stone-100 hover:bg-stone-200 border border-stone-300 p-2 rounded-lg text-stone-700 flex-shrink-0 relative">
                                    <input
                                      type="file"
                                      accept=".pdf"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          setReplacingFile(prev => ({ ...prev, [minute.id]: file }));
                                          addToast(`Loaded replacement PDF for Record ${index + 1}`, 'info');
                                        }
                                      }}
                                      className="absolute inset-0 opacity-0 w-full cursor-pointer"
                                    />
                                    <Upload className="w-4 h-4" />
                                  </label>
                                </div>
                                {replacingFile[minute.id] && (
                                  <span className="text-[11px] text-amber-700 font-semibold mt-1">
                                    Ready to replace: {replacingFile[minute.id].name} (pending update click)
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