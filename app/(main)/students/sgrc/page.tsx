'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Users,
  Plus,
  Trash2,
  FileText,
  Target,
  ClipboardList,
  Calendar,
  AlertCircle,
  Loader,
  Edit2,
  Check,
  X
} from 'lucide-react';

interface CommitteeMember {
  id: number;
  name_en: string;
  name_hn: string;
  designation_en: string;
  designation_hn: string;
  department_en: string;
  department_hn: string;
  role_en: string;
  role_hn: string;
}

interface Objective {
  id: number;
  objective_en: string;
  objective_hn: string;
}

interface Meeting {
  id: number;
  date: string;
  agenda_en: string;
  agenda_hn: string;
  minutes_en: string;
  minutes_hn: string;
  status_en: string;
  status_hn: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  about_title_en: string;
  about_title_hn: string;
  about_desc_en: string;
  about_desc_hn: string;
}

type TabType = 'hero' | 'about' | 'members' | 'meetings';

export default function SGRCPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Singleton data state
  const [headingData, setHeadingData] = useState<HeadingData>({
    title_en: '',
    title_hn: '',
    sub_title_en: '',
    sub_title_hn: '',
    about_title_en: '',
    about_title_hn: '',
    about_desc_en: '',
    about_desc_hn: '',
  });

  // Lists state
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  // Editing or adding states
  const [newObjective, setNewObjective] = useState({ objective_en: '', objective_hn: '' });
  const [editingObjectiveId, setEditingObjectiveId] = useState<number | null>(null);
  const [editingObjectiveData, setEditingObjectiveData] = useState({ objective_en: '', objective_hn: '' });

  const [newMember, setNewMember] = useState({
    name_en: '', name_hn: '',
    designation_en: '', designation_hn: '',
    department_en: '', department_hn: '',
    role_en: 'Member', role_hn: 'सदस्य'
  });
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editingMemberData, setEditingMemberData] = useState({
    name_en: '', name_hn: '',
    designation_en: '', designation_hn: '',
    department_en: '', department_hn: '',
    role_en: 'Member', role_hn: 'सदस्य'
  });

  const [newMeeting, setNewMeeting] = useState({
    date: new Date().toISOString().split('T')[0],
    agenda_en: '', agenda_hn: '',
    minutes_en: '', minutes_hn: '',
    status_en: 'Scheduled', status_hn: 'निर्धारित'
  });
  const [editingMeetingId, setEditingMeetingId] = useState<number | null>(null);
  const [editingMeetingData, setEditingMeetingData] = useState({
    date: '',
    agenda_en: '', agenda_hn: '',
    minutes_en: '', minutes_hn: '',
    status_en: 'Scheduled', status_hn: 'निर्धारित'
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Headings
      const headRes = await fetch(`${API_URL}/api/student-sgrc`);
      if (headRes.ok) {
        const hData = await headRes.json();
        setHeadingData({
          title_en: hData.title_en || '',
          title_hn: hData.title_hn || '',
          sub_title_en: hData.sub_title_en || '',
          sub_title_hn: hData.sub_title_hn || '',
          about_title_en: hData.about_title_en || '',
          about_title_hn: hData.about_title_hn || '',
          about_desc_en: hData.about_desc_en || '',
          about_desc_hn: hData.about_desc_hn || '',
        });
      }

      // 2. Fetch Objectives
      const objRes = await fetch(`${API_URL}/api/student-sgrc/objectives`);
      if (objRes.ok) {
        const oData = await objRes.json();
        setObjectives(oData);
      }

      // 3. Fetch Members
      const memRes = await fetch(`${API_URL}/api/student-sgrc/members`);
      if (memRes.ok) {
        const mData = await memRes.json();
        setMembers(mData);
      }

      // 4. Fetch Meetings
      const meetRes = await fetch(`${API_URL}/api/student-sgrc/meetings`);
      if (meetRes.ok) {
        const mtData = await meetRes.json();
        setMeetings(mtData);
      }
    } catch (err: any) {
      console.error('Error fetching SGRC data:', err);
      setError('Failed to load SGRC data from server. Please verify backend state.');
    } finally {
      setLoading(false);
    }
  };

  // General Save Action (Saves current Tab headings/content)
  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-sgrc`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('SGRC page settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Objectives CRUD Operations ---
  const handleAddObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjective.objective_en.trim() || !newObjective.objective_hn.trim()) {
      alert('Please fill in both English and Hindi versions.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-sgrc/objectives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newObjective),
      });
      if (!res.ok) throw new Error('Failed to create objective');
      const saved = await res.json();
      setObjectives([...objectives, saved]);
      setNewObjective({ objective_en: '', objective_hn: '' });
      alert('Objective added successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const startEditingObjective = (obj: Objective) => {
    setEditingObjectiveId(obj.id);
    setEditingObjectiveData({ objective_en: obj.objective_en, objective_hn: obj.objective_hn });
  };

  const handleSaveObjectiveEdit = async (id: number) => {
    if (!editingObjectiveData.objective_en.trim() || !editingObjectiveData.objective_hn.trim()) {
      alert('Both language fields are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-sgrc/objectives/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingObjectiveData),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setObjectives(objectives.map(o => o.id === id ? updated : o));
      setEditingObjectiveId(null);
      alert('Objective updated successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteObjective = async (id: number) => {
    if (!confirm('Are you sure you want to delete this objective?')) return;
    try {
      await fetch(`${API_URL}/api/student-sgrc/objectives/${id}`, { method: 'DELETE' });
      setObjectives(objectives.filter(o => o.id !== id));
      alert('Deleted!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // --- Members CRUD Operations ---
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name_en.trim() || !newMember.name_hn.trim() || !newMember.designation_en.trim() || !newMember.designation_hn.trim()) {
      alert('Name and Designation bilingually are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-sgrc/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });
      if (!res.ok) throw new Error('Failed to create member');
      const saved = await res.json();
      setMembers([...members, saved]);
      setNewMember({
        name_en: '', name_hn: '',
        designation_en: '', designation_hn: '',
        department_en: '', department_hn: '',
        role_en: 'Member', role_hn: 'सदस्य'
      });
      alert('Committee Member added successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const startEditingMember = (m: CommitteeMember) => {
    setEditingMemberId(m.id);
    setEditingMemberData({
      name_en: m.name_en, name_hn: m.name_hn,
      designation_en: m.designation_en, designation_hn: m.designation_hn,
      department_en: m.department_en || '', department_hn: m.department_hn || '',
      role_en: m.role_en || 'Member', role_hn: m.role_hn || 'सदस्य'
    });
  };

  const handleSaveMemberEdit = async (id: number) => {
    if (!editingMemberData.name_en.trim() || !editingMemberData.name_hn.trim()) {
      alert('Name fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-sgrc/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMemberData),
      });
      if (!res.ok) throw new Error('Failed to update member');
      const updated = await res.json();
      setMembers(members.map(m => m.id === id ? updated : m));
      setEditingMemberId(null);
      alert('Member updated successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await fetch(`${API_URL}/api/student-sgrc/members/${id}`, { method: 'DELETE' });
      setMembers(members.filter(m => m.id !== id));
      alert('Deleted!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // Synchronize English/Hindi values for Role selection
  const syncNewMemberRole = (roleEn: string) => {
    const rolesMapping: Record<string, string> = {
      'Chairperson': 'अध्यक्ष',
      'Member Secretary': 'सदस्य सचिव',
      'Member': 'सदस्य',
      'Student Representative': 'छात्र प्रतिनिधि',
      'Special Invitee': 'विशेष आमंत्रित सदस्य'
    };
    setNewMember({
      ...newMember,
      role_en: roleEn,
      role_hn: rolesMapping[roleEn] || 'सदस्य'
    });
  };

  const syncEditingMemberRole = (roleEn: string) => {
    const rolesMapping: Record<string, string> = {
      'Chairperson': 'अध्यक्ष',
      'Member Secretary': 'सदस्य सचिव',
      'Member': 'सदस्य',
      'Student Representative': 'छात्र प्रतिनिधि',
      'Special Invitee': 'विशेष आमंत्रित सदस्य'
    };
    setEditingMemberData({
      ...editingMemberData,
      role_en: roleEn,
      role_hn: rolesMapping[roleEn] || 'सदस्य'
    });
  };

  // --- Meetings CRUD Operations ---
  const handleAddMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.date || !newMeeting.agenda_en.trim() || !newMeeting.agenda_hn.trim()) {
      alert('Date and Agenda fields are required bilingually.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-sgrc/meetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMeeting),
      });
      if (!res.ok) throw new Error('Failed to create meeting');
      const saved = await res.json();
      setMeetings([saved, ...meetings]);
      setNewMeeting({
        date: new Date().toISOString().split('T')[0],
        agenda_en: '', agenda_hn: '',
        minutes_en: '', minutes_hn: '',
        status_en: 'Scheduled', status_hn: 'निर्धारित'
      });
      alert('Meeting added successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const startEditingMeeting = (meet: Meeting) => {
    setEditingMeetingId(meet.id);
    setEditingMeetingData({
      date: meet.date,
      agenda_en: meet.agenda_en, agenda_hn: meet.agenda_hn,
      minutes_en: meet.minutes_en || '', minutes_hn: meet.minutes_hn || '',
      status_en: meet.status_en, status_hn: meet.status_hn
    });
  };

  const handleSaveMeetingEdit = async (id: number) => {
    if (!editingMeetingData.date || !editingMeetingData.agenda_en.trim()) {
      alert('Date and Agenda cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-sgrc/meetings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingMeetingData),
      });
      if (!res.ok) throw new Error('Failed to update meeting');
      const updated = await res.json();
      setMeetings(meetings.map(m => m.id === id ? updated : m));
      setEditingMeetingId(null);
      alert('Meeting details updated successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteMeeting = async (id: number) => {
    if (!confirm('Are you sure you want to delete this meeting record?')) return;
    try {
      await fetch(`${API_URL}/api/student-sgrc/meetings/${id}`, { method: 'DELETE' });
      setMeetings(meetings.filter(m => m.id !== id));
      alert('Deleted!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const syncNewMeetingStatus = (statusEn: string) => {
    const statusMapping: Record<string, string> = {
      'Scheduled': 'निर्धारित',
      'Completed': 'पूर्ण',
      'Cancelled': 'रद्द'
    };
    setNewMeeting({
      ...newMeeting,
      status_en: statusEn,
      status_hn: statusMapping[statusEn] || 'निर्धारित'
    });
  };

  const syncEditingMeetingStatus = (statusEn: string) => {
    const statusMapping: Record<string, string> = {
      'Scheduled': 'निर्धारित',
      'Completed': 'पूर्ण',
      'Cancelled': 'रद्द'
    };
    setEditingMeetingData({
      ...editingMeetingData,
      status_en: statusEn,
      status_hn: statusMapping[statusEn] || 'निर्धारित'
    });
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero Banner', icon: <FileText size={18} /> },
    { id: 'about' as TabType, label: 'About & Objectives', icon: <Target size={18} /> },
    { id: 'members' as TabType, label: 'Committee Members', icon: <Users size={18} /> },
    { id: 'meetings' as TabType, label: 'Meetings Panel', icon: <ClipboardList size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading SGRC Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* 1. Page Title Header containing UNCONDITIONAL SAVE button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                SGRC Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure Student Grievance Redressal Committee settings, members directory, and meeting schedules bilingually.
              </p>
            </div>
          </div>
          <button
            onClick={handleSavePageSettings}
            disabled={saving}
            className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-semibold shadow-sm hover:shadow active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Tabs Layout */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#631012] text-[#631012] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/70'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* TAB 1: HERO SECTION */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Hero Banner Configuration</h3>
                <p className="text-sm text-gray-500">Bilingual settings for the header section of the SGRC page</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Heading (English)</label>
                  <input
                    type="text"
                    value={headingData.title_en}
                    onChange={(e) => setHeadingData({ ...headingData, title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    placeholder="Enter main page title in English"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Heading (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    placeholder="Enter main page title in Hindi"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sub Title / Banner Desc (English)</label>
                  <textarea
                    value={headingData.sub_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    placeholder="Brief description under main title in English"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sub Title / Banner Desc (Hindi)</label>
                  <textarea
                    value={headingData.sub_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    placeholder="Brief description under main title in Hindi"
                  />
                </div>
              </div>

              {/* Active Preview */}
              <div className="mt-8 p-6 bg-gradient-to-br from-[#631012] to-[#800000] rounded-xl text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full mb-3 inline-block">LIVE BANNER PREVIEW</span>
                <h4 className="text-xl sm:text-2xl font-black">{headingData.title_en || 'SGRC'}</h4>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">{headingData.sub_title_en || 'Committee members...'}</p>
                <div className="h-px bg-white/10 my-4" />
                <h4 className="text-xl sm:text-2xl font-black">{headingData.title_hn || 'एसजीआरसी'}</h4>
                <p className="text-sm text-white/80 mt-2 leading-relaxed">{headingData.sub_title_hn || 'समिति सदस्य...'}</p>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT & OBJECTIVES */}
          {activeTab === 'about' && (
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="border-l-4 border-[#631012] pl-3 mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">About Section</h3>
                  <p className="text-sm text-gray-500">Edit the descriptive overview of the Student Grievance Redressal Committee</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Title (English)</label>
                    <input
                      type="text"
                      value={headingData.about_title_en}
                      onChange={(e) => setHeadingData({ ...headingData, about_title_en: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Title (Hindi)</label>
                    <input
                      type="text"
                      value={headingData.about_title_hn}
                      onChange={(e) => setHeadingData({ ...headingData, about_title_hn: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Description (English)</label>
                    <textarea
                      value={headingData.about_desc_en}
                      onChange={(e) => setHeadingData({ ...headingData, about_desc_en: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">About Description (Hindi)</label>
                    <textarea
                      value={headingData.about_desc_hn}
                      onChange={(e) => setHeadingData({ ...headingData, about_desc_hn: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Objectives List */}
              <div className="border-t border-gray-100 pt-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-[#631012] pl-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Objectives List</h3>
                    <p className="text-sm text-gray-500">Add, delete, or modify individual committee objectives</p>
                  </div>
                </div>

                {/* Add Objective form */}
                <form onSubmit={handleAddObjective} className="bg-gray-50/50 border border-gray-150 p-4 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">New Objective (English)</label>
                      <input
                        type="text"
                        value={newObjective.objective_en}
                        onChange={(e) => setNewObjective({ ...newObjective, objective_en: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white"
                        placeholder="Platform to voice concerns..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">New Objective (Hindi)</label>
                      <input
                        type="text"
                        value={newObjective.objective_hn}
                        onChange={(e) => setNewObjective({ ...newObjective, objective_hn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white"
                        placeholder="शिकायतें व्यक्त करने के लिए एक मंच..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Objective
                    </button>
                  </div>
                </form>

                {/* Objectives list display */}
                <div className="space-y-3">
                  {objectives.map((obj, i) => (
                    <div key={obj.id} className="border border-gray-150 p-4 rounded-xl flex items-start justify-between gap-4 hover:shadow-xs transition-shadow">
                      {editingObjectiveId === obj.id ? (
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={editingObjectiveData.objective_en}
                            onChange={(e) => setEditingObjectiveData({ ...editingObjectiveData, objective_en: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900"
                          />
                          <input
                            type="text"
                            value={editingObjectiveData.objective_hn}
                            onChange={(e) => setEditingObjectiveData({ ...editingObjectiveData, objective_hn: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveObjectiveEdit(obj.id)}
                              className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded-lg flex items-center gap-1 text-xs"
                            >
                              <Check size={14} /> Save
                            </button>
                            <button
                              onClick={() => setEditingObjectiveId(null)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1.5 rounded-lg flex items-center gap-1 text-xs"
                            >
                              <X size={14} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 space-y-1.5">
                          <p className="text-sm font-semibold text-gray-800 flex gap-2">
                            <span className="text-[#631012]">{i + 1}.</span>
                            <span>{obj.objective_en}</span>
                          </p>
                          <p className="text-sm text-gray-500 pl-5">{obj.objective_hn}</p>
                        </div>
                      )}
                      
                      {editingObjectiveId !== obj.id && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditingObjective(obj)}
                            className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded-lg"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteObjective(obj.id)}
                            className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded-lg"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMMITTEE MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-8">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Committee Directory</h3>
                <p className="text-sm text-gray-500">Configure grievance committee positions, names, designations, and department structures bilingually</p>
              </div>

              {/* Add Member Form */}
              <form onSubmit={handleAddMember} className="bg-gray-50/50 border border-gray-150 p-6 rounded-xl space-y-4">
                <h4 className="font-bold text-gray-800 text-sm">Add New Committee Member</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Name (English)</label>
                    <input
                      type="text"
                      value={newMember.name_en}
                      onChange={(e) => setNewMember({ ...newMember, name_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. Dr. Pawan Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Name (Hindi)</label>
                    <input
                      type="text"
                      value={newMember.name_hn}
                      onChange={(e) => setNewMember({ ...newMember, name_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. डॉ पवन शर्मा"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Designation (English)</label>
                    <input
                      type="text"
                      value={newMember.designation_en}
                      onChange={(e) => setNewMember({ ...newMember, designation_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. Professor"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Designation (Hindi)</label>
                    <input
                      type="text"
                      value={newMember.designation_hn}
                      onChange={(e) => setNewMember({ ...newMember, designation_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. प्रोफेसर"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Department (English)</label>
                    <input
                      type="text"
                      value={newMember.department_en}
                      onChange={(e) => setNewMember({ ...newMember, department_en: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. DoCSE"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Department (Hindi)</label>
                    <input
                      type="text"
                      value={newMember.department_hn}
                      onChange={(e) => setNewMember({ ...newMember, department_hn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. कंप्यूटर विज्ञान विभाग"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Role / SGRC Assignment</label>
                    <select
                      value={newMember.role_en}
                      onChange={(e) => syncNewMemberRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900 focus:ring-1 focus:ring-[#631012]"
                    >
                      <option value="Chairperson">Chairperson (अध्यक्ष)</option>
                      <option value="Member Secretary">Member Secretary (सदस्य सचिव)</option>
                      <option value="Member">Member (सदस्य)</option>
                      <option value="Student Representative">Student Representative (छात्र प्रतिनिधि)</option>
                      <option value="Special Invitee">Special Invitee (विशेष आमंत्रित सदस्य)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={15} /> Add Committee Member
                  </button>
                </div>
              </form>

              {/* Members Directory List */}
              <div className="overflow-x-auto rounded-xl border border-gray-150">
                <table className="w-full text-left table-fixed border-collapse text-sm">
                  <colgroup>
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '20%' }} />
                    <col style={{ width: '16%' }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase font-bold tracking-wider text-gray-500">
                      <th className="p-4">Name (En/Hn)</th>
                      <th className="p-4">Designation (En/Hn)</th>
                      <th className="p-4">Department (En/Hn)</th>
                      <th className="p-4">SGRC Role (En/Hn)</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-150">
                    {members.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/40">
                        {editingMemberId === m.id ? (
                          <td colSpan={4} className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                value={editingMemberData.name_en}
                                onChange={(e) => setEditingMemberData({ ...editingMemberData, name_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Name English"
                              />
                              <input
                                type="text"
                                value={editingMemberData.name_hn}
                                onChange={(e) => setEditingMemberData({ ...editingMemberData, name_hn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Name Hindi"
                              />
                              <input
                                type="text"
                                value={editingMemberData.designation_en}
                                onChange={(e) => setEditingMemberData({ ...editingMemberData, designation_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Designation English"
                              />
                              <input
                                type="text"
                                value={editingMemberData.designation_hn}
                                onChange={(e) => setEditingMemberData({ ...editingMemberData, designation_hn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Designation Hindi"
                              />
                              <input
                                type="text"
                                value={editingMemberData.department_en}
                                onChange={(e) => setEditingMemberData({ ...editingMemberData, department_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Department English"
                              />
                              <input
                                type="text"
                                value={editingMemberData.department_hn}
                                onChange={(e) => setEditingMemberData({ ...editingMemberData, department_hn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                                placeholder="Department Hindi"
                              />
                              <div className="col-span-2">
                                <select
                                  value={editingMemberData.role_en}
                                  onChange={(e) => syncEditingMemberRole(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                                >
                                  <option value="Chairperson">Chairperson</option>
                                  <option value="Member Secretary">Member Secretary</option>
                                  <option value="Member">Member</option>
                                  <option value="Student Representative">Student Representative</option>
                                  <option value="Special Invitee">Special Invitee</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveMemberEdit(m.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold"
                              >
                                <Check size={14} /> Save
                              </button>
                              <button
                                onClick={() => setEditingMemberId(null)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs"
                              >
                                <X size={14} /> Cancel
                              </button>
                            </div>
                          </td>
                        ) : (
                          <>
                            <td className="p-4 align-top">
                              <div className="font-semibold text-gray-800">{m.name_en}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{m.name_hn}</div>
                            </td>
                            <td className="p-4 align-top">
                              <div className="font-medium text-gray-700">{m.designation_en}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{m.designation_hn}</div>
                            </td>
                            <td className="p-4 align-top">
                              <div className="text-gray-600 font-medium">{m.department_en || '—'}</div>
                              <div className="text-xs text-gray-400 mt-0.5">{m.department_hn || '—'}</div>
                            </td>
                            <td className="p-4 align-top">
                              <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-gray-100 text-gray-700 border border-gray-150">
                                {m.role_en}
                              </span>
                              <div className="text-xs text-gray-500 mt-1 pl-1">{m.role_hn}</div>
                            </td>
                            <td className="p-4 align-top text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => startEditingMember(m)}
                                  className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded-lg"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteMember(m.id)}
                                  className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded-lg"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: MEETINGS PANEL */}
          {activeTab === 'meetings' && (
            <div className="space-y-8">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Meeting Records</h3>
                <p className="text-sm text-gray-500">Record agendas, dates, minutes, and schedules of SGRC meetings bilingually</p>
              </div>

              {/* Add Meeting Form */}
              <form onSubmit={handleAddMeeting} className="bg-gray-50/50 border border-gray-150 p-6 rounded-xl space-y-4">
                <h4 className="font-bold text-gray-800 text-sm">Add New Meeting</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Meeting Date</label>
                    <input
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Status</label>
                    <select
                      value={newMeeting.status_en}
                      onChange={(e) => syncNewMeetingStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900 focus:ring-1 focus:ring-[#631012]"
                    >
                      <option value="Scheduled">Scheduled (निर्धारित)</option>
                      <option value="Completed">Completed (पूर्ण)</option>
                      <option value="Cancelled">Cancelled (रद्द)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Agenda (English)</label>
                    <textarea
                      value={newMeeting.agenda_en}
                      onChange={(e) => setNewMeeting({ ...newMeeting, agenda_en: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. Review of pending grievances"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Agenda (Hindi)</label>
                    <textarea
                      value={newMeeting.agenda_hn}
                      onChange={(e) => setNewMeeting({ ...newMeeting, agenda_hn: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. लंबित शिकायतों की समीक्षा"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Minutes / Notes (English) - Optional</label>
                    <textarea
                      value={newMeeting.minutes_en}
                      onChange={(e) => setNewMeeting({ ...newMeeting, minutes_en: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. Resolved 8 cases, referred 4."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Minutes / Notes (Hindi) - Optional</label>
                    <textarea
                      value={newMeeting.minutes_hn}
                      onChange={(e) => setNewMeeting({ ...newMeeting, minutes_hn: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900"
                      placeholder="e.g. 8 मामलों का समाधान, 4 को भेजा।"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus size={15} /> Add Meeting Record
                  </button>
                </div>
              </form>

              {/* Meetings List */}
              <div className="space-y-4">
                {meetings.map((meet) => (
                  <div key={meet.id} className="border border-gray-150 rounded-xl p-5 hover:shadow-xs transition-shadow">
                    {editingMeetingId === meet.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400">Date</label>
                            <input
                              type="date"
                              value={editingMeetingData.date}
                              onChange={(e) => setEditingMeetingData({ ...editingMeetingData, date: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400">Status</label>
                            <select
                              value={editingMeetingData.status_en}
                              onChange={(e) => syncEditingMeetingStatus(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900 bg-white"
                            >
                              <option value="Scheduled">Scheduled</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400">Agenda English</label>
                            <textarea
                              value={editingMeetingData.agenda_en}
                              onChange={(e) => setEditingMeetingData({ ...editingMeetingData, agenda_en: e.target.value })}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400">Agenda Hindi</label>
                            <textarea
                              value={editingMeetingData.agenda_hn}
                              onChange={(e) => setEditingMeetingData({ ...editingMeetingData, agenda_hn: e.target.value })}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400">Minutes English</label>
                            <textarea
                              value={editingMeetingData.minutes_en}
                              onChange={(e) => setEditingMeetingData({ ...editingMeetingData, minutes_en: e.target.value })}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-400">Minutes Hindi</label>
                            <textarea
                              value={editingMeetingData.minutes_hn}
                              onChange={(e) => setEditingMeetingData({ ...editingMeetingData, minutes_hn: e.target.value })}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-900"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveMeetingEdit(meet.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold animate-pulse"
                          >
                            <Check size={14} /> Save Meeting Details
                          </button>
                          <button
                            onClick={() => setEditingMeetingId(null)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs"
                          >
                            <X size={14} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1 bg-gray-50 border border-gray-150 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-600">
                              <Calendar size={14} className="text-[#631012]" />
                              <span>{meet.date}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              meet.status_en === 'Completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                              meet.status_en === 'Cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                              'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}>
                              {meet.status_en} ({meet.status_hn})
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                            <div className="space-y-1">
                              <h5 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Agenda</h5>
                              <p className="text-sm font-semibold text-gray-800 leading-snug">{meet.agenda_en}</p>
                              <p className="text-xs text-gray-500 leading-relaxed">{meet.agenda_hn}</p>
                            </div>
                            <div className="space-y-1">
                              <h5 className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Minutes / Notes</h5>
                              <p className="text-sm text-gray-700 leading-snug">{meet.minutes_en || '—'}</p>
                              <p className="text-xs text-gray-500 leading-relaxed">{meet.minutes_hn || '—'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditingMeeting(meet)}
                            className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded-lg"
                          >
                            <Edit2 size={17} />
                          </button>
                          <button
                            onClick={() => handleDeleteMeeting(meet.id)}
                            className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded-lg"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
