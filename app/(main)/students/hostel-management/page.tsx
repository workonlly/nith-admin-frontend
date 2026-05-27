'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Palette,
  Plus,
  Trash2,
  FileText,
  Info,
  List,
  AlertCircle,
  Loader,
  Edit2,
  Check,
  X,
  Phone,
  Mail,
  Home,
  User,
  ShieldAlert
} from 'lucide-react';

interface HostelHeading {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
}

interface HostelFunctionary {
  id: number;
  hostel_name: string;
  name: string;
  responsibility: string;
  phone: string;
  email: string;
  priority: number;
}

type TabType = 'headers' | 'functionaries';

const HOSTEL_OPTIONS = [
  'Chief Warden',
  'Himgiri Boys Hostel',
  'Neelkanth Boys Hostel',
  'Himadri Boys Hostel',
  'Udaygiri Boys Hostel',
  'Kailash Boys Hostel',
  'Vindhyachal Boys Hostel',
  'Dhauladhar Boys Hostel',
  'Ambika Girls Hostel',
  'Parvati Girls Hostel',
  'Satpura & Aravali Girls Hostel',
  'Mani Mahesh Girls Hostel',
  'Shivalik Boys Hostel'
];

export default function HostelManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('headers');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const DEFAULT_HEADING: HostelHeading = {
    title_en: 'Hostel Functionaries',
    title_hn: 'छात्रावास पदाधिकारी',
    sub_title_en: 'Chief Warden and wardens / assistant wardens contact details',
    sub_title_hn: 'मुख्य वार्डन और वार्डन / सहायक वार्डन संपर्क विवरण'
  };

  const DEFAULT_FUNCTIONARIES = [
    { hostel_name: 'Chief Warden', name: 'Dr. Kuldeep Kr. Sharma, DoPPS', responsibility: 'Chief Warden', phone: '254850', email: 'cw@nith.ac.in', priority: 1 },
    { hostel_name: 'Himgiri Boys Hostel', name: 'Er. Vinod Kumar', responsibility: 'Warden', phone: '254803', email: 'wardenhimgiri@nith.ac.in', priority: 2 },
    { hostel_name: 'Himgiri Boys Hostel', name: 'Dr. Abhishek Singh', responsibility: 'Assistant Warden', phone: '-', email: 'abhi.phy@nith.ac.in', priority: 3 },
    { hostel_name: 'Neelkanth Boys Hostel', name: 'Dr. Chandrashekharan S', responsibility: 'Warden', phone: '254860', email: 'wardenneelkanth@nith.ac.in', priority: 4 },
    { hostel_name: 'Neelkanth Boys Hostel', name: 'Dr. Anshul Sharma', responsibility: 'Assistant Warden', phone: '-', email: 'anshulsharma@nith.ac.in', priority: 5 },
    { hostel_name: 'Himadri Boys Hostel', name: 'Dr. Vivek Tiwari', responsibility: 'Warden', phone: '254810', email: 'wardenhimadri@nith.ac.in', priority: 6 },
    { hostel_name: 'Himadri Boys Hostel', name: 'Dr. Sandeep Sharma', responsibility: 'Assistant Warden', phone: '-', email: 'sandeep.phy@nith.ac.in', priority: 7 },
    { hostel_name: 'Udaygiri Boys Hostel', name: 'Dr. Sachin Kumar', responsibility: 'Warden', phone: '-', email: 'wardenudaygiri@nith.ac.in', priority: 8 },
    { hostel_name: 'Udaygiri Boys Hostel', name: 'Dr. Jiwanjot Singh', responsibility: 'Assistant Warden', phone: '-', email: 'jiwanjot@nith.ac.in', priority: 9 },
    { hostel_name: 'Kailash Boys Hostel', name: 'Dr. Talari Ganesh', responsibility: 'Warden', phone: '254802', email: 'wardenkailash@nith.ac.in', priority: 10 },
    { hostel_name: 'Kailash Boys Hostel', name: 'Dr. Aman Kumar', responsibility: 'Assistant Warden', phone: '-', email: 'akumar@nith.ac.in', priority: 11 },
    { hostel_name: 'Vindhyachal Boys Hostel', name: 'Dr. Rajesh Kumar', responsibility: 'Warden', phone: '254855', email: 'wardenvindhyachal@nith.ac.in', priority: 12 },
    { hostel_name: 'Vindhyachal Boys Hostel', name: 'Dr. Mahaveer Singh', responsibility: 'Assistant Warden', phone: '-', email: 'mahavir@nith.ac.in', priority: 13 },
    { hostel_name: 'Dhauladhar Boys Hostel', name: 'Dr. Vikram Verma', responsibility: 'Warden', phone: '254822', email: 'wardendhauladhar@nith.ac.in', priority: 14 },
    { hostel_name: 'Dhauladhar Boys Hostel', name: 'Dr. Hammad Siddiqui', responsibility: 'Assistant Warden', phone: '-', email: 'hammad@nith.ac.in', priority: 15 },
    { hostel_name: 'Ambika Girls Hostel', name: 'Dr. Sunder Kala Negi', responsibility: 'Warden', phone: '254842', email: 'wardenambika@nith.ac.in', priority: 16 },
    { hostel_name: 'Ambika Girls Hostel', name: 'Dr. Upasana Sharma', responsibility: 'Assistant Warden', phone: '-', email: 'upasana@nith.ac.in', priority: 17 },
    { hostel_name: 'Parvati Girls Hostel', name: 'Dr. Sangeeta Sharma', responsibility: 'Warden', phone: '254845', email: 'wardenparvati@nith.ac.in', priority: 18 },
    { hostel_name: 'Parvati Girls Hostel', name: 'Dr. Swechha Roy', responsibility: 'Assistant Warden', phone: '-', email: 'sroy@nith.ac.in', priority: 19 },
    { hostel_name: 'Satpura & Aravali Girls Hostel', name: 'Dr. Bharti Gaur', responsibility: 'Warden', phone: '254156', email: 'wardenaravali@nith.ac.in wardensatpura@nith.ac.in', priority: 20 },
    { hostel_name: 'Satpura & Aravali Girls Hostel', name: 'Dr. Neetika', responsibility: 'Assistant Warden', phone: '-', email: 'wardenaravali@nith.ac.in wardensatpura@nith.ac.in', priority: 21 },
    { hostel_name: 'Mani Mahesh Girls Hostel', name: 'Dr. Supriya Jaiswal', responsibility: 'Warden', phone: '254832', email: 'wardenmanimahesh@nith.ac.in', priority: 22 },
    { hostel_name: 'Mani Mahesh Girls Hostel', name: 'Dr. Rinshu', responsibility: 'Assistant Warden', phone: '254152', email: 'rinshu@nith.ac.in', priority: 23 },
    { hostel_name: 'Shivalik Boys Hostel', name: 'Dr. Rajesh Kumar', responsibility: 'Warden', phone: '-', email: 'wardenshivalik@nith.ac.in', priority: 24 }
  ];

  const [headingData, setHeadingData] = useState<HostelHeading>({ ...DEFAULT_HEADING });
  const [functionaries, setFunctionaries] = useState<HostelFunctionary[]>([]);

  // CRUD states for functionaries
  const [newFunc, setNewFunc] = useState({
    hostel_name: 'Chief Warden',
    name: '',
    responsibility: 'Warden',
    phone: '',
    email: '',
    priority: 10
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({
    hostel_name: '',
    name: '',
    responsibility: '',
    phone: '',
    email: '',
    priority: 10
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Heading
      const headRes = await fetch(`${API_URL}/api/student-hostel-management`);
      if (headRes.ok) {
        const hData = await headRes.json();
        if (hData && Object.keys(hData).length > 0) {
          setHeadingData({
            title_en: hData.title_en || DEFAULT_HEADING.title_en,
            title_hn: hData.title_hn || DEFAULT_HEADING.title_hn,
            sub_title_en: hData.sub_title_en || DEFAULT_HEADING.sub_title_en,
            sub_title_hn: hData.sub_title_hn || DEFAULT_HEADING.sub_title_hn
          });
        } else {
          // Auto-seed heading singleton
          await fetch(`${API_URL}/api/student-hostel-management`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(DEFAULT_HEADING),
          });
        }
      }

      // Fetch Functionaries
      const listRes = await fetch(`${API_URL}/api/student-hostel-management/list`);
      if (listRes.ok) {
        const lData = await listRes.json();
        if (lData.length === 0) {
          // Seed functionaries list
          for (const item of DEFAULT_FUNCTIONARIES) {
            await fetch(`${API_URL}/api/student-hostel-management/list`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            });
          }
          const listRes2 = await fetch(`${API_URL}/api/student-hostel-management/list`);
          setFunctionaries(await listRes2.json());
        } else {
          setFunctionaries(lData);
        }
      }
    } catch (err: any) {
      console.error('Error fetching hostel management data:', err);
      setError('Failed to fetch data from backend database.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-hostel-management`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('Hostel Management page banner settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- CRUD Actions ---
  const handleAddFunctionary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFunc.name.trim() || !newFunc.responsibility.trim()) {
      alert('Name and Responsibility are required fields.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-hostel-management/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFunc),
      });
      if (!res.ok) throw new Error('Failed to add functionary');
      const saved = await res.json();
      setFunctionaries([...functionaries, saved].sort((a, b) => a.priority - b.priority));
      setNewFunc({
        hostel_name: 'Chief Warden',
        name: '',
        responsibility: 'Warden',
        phone: '',
        email: '',
        priority: 10
      });
      alert('Hostel Functionary added successfully!');
    } catch (err: any) {
      alert('Error adding functionary: ' + err.message);
    }
  };

  const handleStartEdit = (item: HostelFunctionary) => {
    setEditingId(item.id);
    setEditingData({
      hostel_name: item.hostel_name,
      name: item.name,
      responsibility: item.responsibility,
      phone: item.phone,
      email: item.email,
      priority: item.priority
    });
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingData.name.trim() || !editingData.responsibility.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-hostel-management/list/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingData),
      });
      if (!res.ok) throw new Error('Failed to update functionary');
      const updated = await res.json();
      setFunctionaries(functionaries.map(f => f.id === id ? updated : f).sort((a, b) => a.priority - b.priority));
      setEditingId(null);
      alert('Hostel Functionary updated successfully!');
    } catch (err: any) {
      alert('Error updating functionary: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hostel functionary?')) return;
    try {
      await fetch(`${API_URL}/api/student-hostel-management/list/${id}`, { method: 'DELETE' });
      setFunctionaries(functionaries.filter(f => f.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting functionary: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Hostel Management Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Home className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Hostel Functionaries Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure details of Chief Warden, wardens, assistant wardens, and update titles bilingually.
              </p>
            </div>
          </div>

          <button
            onClick={handleSavePageSettings}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#631012] hover:bg-[#520d0f] active:scale-95 text-white font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 text-sm w-full sm:w-auto justify-center"
          >
            {saving ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Page Headers
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 p-3.5 bg-red-50 border-l-4 border-red-600 text-red-800 rounded-r-lg text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-white rounded-t-xl px-2 pt-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('headers')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'headers'
              ? 'border-[#631012] text-[#631012] bg-[#631012]/5 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FileText size={18} />
          Page Banner Settings
        </button>
        <button
          onClick={() => setActiveTab('functionaries')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'functionaries'
              ? 'border-[#631012] text-[#631012] bg-[#631012]/5 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <List size={18} />
          Manage Functionaries
        </button>
      </div>

      {/* Contents */}
      <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 min-h-[400px]">
        {activeTab === 'headers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English Headers */}
            <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#631012]"></span>
                English Banner Details
              </h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Page Title (EN)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                  value={headingData.title_en || ''}
                  onChange={(e) => setHeadingData({ ...headingData, title_en: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Banner Description / Subtitle (EN)</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                  value={headingData.sub_title_en || ''}
                  onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                />
              </div>
            </div>

            {/* Hindi Headers */}
            <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Hindi Banner Details
              </h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">पृष्ठ शीर्षक (HN)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                  value={headingData.title_hn || ''}
                  onChange={(e) => setHeadingData({ ...headingData, title_hn: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">बैनर विवरण / उपशीर्षक (HN)</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                  value={headingData.sub_title_hn || ''}
                  onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'functionaries' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">Hostel Functionaries Directory</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {functionaries.length} Registered Functionaries
              </span>
            </div>

            {/* Add New Form */}
            <form onSubmit={handleAddFunctionary} className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
              <h4 className="text-sm font-extrabold text-[#631012] uppercase tracking-wider flex items-center gap-2">
                <Plus size={16} /> Add a New Warden / Functionary Profile
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Hostel Assignment</label>
                  <input
                    list="hostel-options"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#631012]"
                    value={newFunc.hostel_name}
                    onChange={(e) => setNewFunc({ ...newFunc, hostel_name: e.target.value })}
                    placeholder="Select or type hostel name"
                  />
                  <datalist id="hostel-options">
                    {HOSTEL_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Jane Doe"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newFunc.name}
                    onChange={(e) => setNewFunc({ ...newFunc, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Responsibility / Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Warden"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newFunc.responsibility}
                    onChange={(e) => setNewFunc({ ...newFunc, responsibility: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Phone / Landline Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 254803 or -"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newFunc.phone}
                    onChange={(e) => setNewFunc({ ...newFunc, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Email Address</label>
                  <input
                    type="text"
                    placeholder="e.g. warden@nith.ac.in"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newFunc.email}
                    onChange={(e) => setNewFunc({ ...newFunc, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Priority (Sorting Order Number)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newFunc.priority}
                    onChange={(e) => setNewFunc({ ...newFunc, priority: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-[#631012] hover:bg-[#520d0f] active:scale-95 text-white font-semibold rounded-lg shadow-sm text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Functionary Profile
                </button>
              </div>
            </form>

            {/* Functionaries List Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full border-collapse table-auto text-left text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 font-semibold text-gray-700">Priority</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Hostel Name</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Designation</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Phone</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {functionaries.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        {editingId === item.id ? (
                          <input
                            type="number"
                            className="w-16 px-2 py-1 border rounded text-sm focus:outline-none focus:border-[#631012]"
                            value={editingData.priority}
                            onChange={(e) => setEditingData({ ...editingData, priority: parseInt(e.target.value) || 0 })}
                          />
                        ) : (
                          <span className="text-gray-500 font-medium">{item.priority}</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {editingId === item.id ? (
                          <input
                            list="hostel-options"
                            className="w-full px-2 py-1 border rounded text-sm bg-white focus:outline-none focus:border-[#631012]"
                            value={editingData.hostel_name}
                            onChange={(e) => setEditingData({ ...editingData, hostel_name: e.target.value })}
                            placeholder="Select or type hostel name"
                          />
                        ) : (
                          <span className="text-gray-950 font-semibold">{item.hostel_name}</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:border-[#631012]"
                            value={editingData.name}
                            onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                          />
                        ) : (
                          <span className="text-gray-900 font-semibold">{item.name}</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:border-[#631012]"
                            value={editingData.responsibility}
                            onChange={(e) => setEditingData({ ...editingData, responsibility: e.target.value })}
                          />
                        ) : (
                          <span className="text-gray-600">{item.responsibility}</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:border-[#631012]"
                            value={editingData.phone}
                            onChange={(e) => setEditingData({ ...editingData, phone: e.target.value })}
                          />
                        ) : (
                          <span className="text-gray-600 flex items-center gap-1.5">
                            <Phone size={14} className="text-gray-400" /> {item.phone}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:border-[#631012]"
                            value={editingData.email}
                            onChange={(e) => setEditingData({ ...editingData, email: e.target.value })}
                          />
                        ) : (
                          <span className="text-[#631012] font-medium flex items-center gap-1.5">
                            <Mail size={14} className="text-gray-400" /> {item.email}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {editingId === item.id ? (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                              title="Save Profile"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                              title="Cancel Edit"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit Warden"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Delete Profile"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {functionaries.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-400 italic">
                        No functionaries found. Seed defaults by reloading the page.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
