'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  Upload,
  Save,
  Loader2,
  Calendar,
  Building,
  Phone,
  Mail,
} from 'lucide-react';

interface DirectorData {
  id?: number;
  image?: string;
  heading_en?: string;
  heading_hi?: string;
  designation_en?: string;
  designation_hi?: string;
  description_en?: string;
  description_hi?: string;
}

interface FormerDirector {
  id: number;
  type: string; // 'Former Directors, NIT Hamirpur' | 'Former Principals, REC Hamirpur'
  heading_en: string;
  heading_hi?: string;
  dates: string;
  image: string;
}

interface OfficeStaff {
  id: number;
  type: string;
  name: string;
  designation: string;
  phone_no: string;
  email: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function DirectorAdminPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'former' | 'office'>('profile');
  const [loading, setLoading] = useState(true);

  // Director profile state
  const [director, setDirector] = useState<DirectorData>({
    heading_en: 'Prof. Hiralal Murlidhar Suryawanshi',
    heading_hi: 'प्रो. हीरालाल मुरलीधर सूर्यवंशी',
    designation_en: 'Director, NIT Hamirpur',
    designation_hi: 'निदेशक, एनआईटी हमीरपुर',
    description_en: '',
    description_hi: '',
    image: '',
  });
  const [directorFile, setDirectorFile] = useState<File | null>(null);
  const [savingDirector, setSavingDirector] = useState(false);

  // Former directors state
  const [formerList, setFormerList] = useState<FormerDirector[]>([]);
  const [formerModalOpen, setFormerModalOpen] = useState(false);
  const [formerType, setFormerType] = useState('Former Directors, NIT Hamirpur');
  const [formerName, setFormerName] = useState('');
  const [formerDates, setFormerDates] = useState('');
  const [formerFile, setFormerFile] = useState<File | null>(null);
  const [submittingFormer, setSubmittingFormer] = useState(false);

  // Office staff state
  const [officeList, setOfficeList] = useState<OfficeStaff[]>([]);
  const [officeModalOpen, setOfficeModalOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffDesignation, setStaffDesignation] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [submittingStaff, setSubmittingStaff] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/administration/director`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.director) setDirector(data.director);
        if (data.formerDirectors) setFormerList(data.formerDirectors);
        if (data.directorOffice) setOfficeList(data.directorOffice);
      }
    } catch (err) {
      console.error('Error fetching director admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveDirector = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingDirector(true);
      const formData = new FormData();
      formData.append('heading_en', director.heading_en || '');
      formData.append('heading_hi', director.heading_hi || '');
      formData.append('designation_en', director.designation_en || '');
      formData.append('designation_hi', director.designation_hi || '');
      formData.append('description_en', director.description_en || '');
      formData.append('description_hi', director.description_hi || '');
      if (directorFile) formData.append('image_file', directorFile);
      else if (director.image) formData.append('image', director.image);

      const res = await fetch(`${API_BASE}/api/administration/director`, {
        method: 'PUT',
        body: formData,
      });
      if (res.ok) {
        alert('Director profile saved successfully!');
        fetchData();
      } else {
        alert('Failed to save Director profile');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving director profile');
    } finally {
      setSavingDirector(false);
    }
  };

  const handleAddFormer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formerName.trim()) {
      alert('Please enter name');
      return;
    }
    try {
      setSubmittingFormer(true);
      const formData = new FormData();
      formData.append('type', formerType);
      formData.append('heading_en', formerName.trim());
      formData.append('dates', formerDates.trim());
      if (formerFile) formData.append('image_file', formerFile);

      const res = await fetch(`${API_BASE}/api/administration/former-directors`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert('Former Director record added!');
        setFormerModalOpen(false);
        setFormerName('');
        setFormerDates('');
        setFormerFile(null);
        fetchData();
      } else {
        alert('Failed to save record');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingFormer(false);
    }
  };

  const handleDeleteFormer = async (id: number) => {
    if (!confirm('Delete this former director record?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/administration/former-directors/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) {
      alert('Please enter staff name');
      return;
    }
    try {
      setSubmittingStaff(true);
      const res = await fetch(`${API_BASE}/api/administration/director-office`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: staffName.trim(),
          designation: staffDesignation.trim(),
          phone_no: staffPhone.trim(),
          email: staffEmail.trim(),
        }),
      });
      if (res.ok) {
        alert('Staff added successfully!');
        setOfficeModalOpen(false);
        setStaffName('');
        setStaffDesignation('');
        setStaffPhone('');
        setStaffEmail('');
        fetchData();
      } else {
        alert('Failed to add staff');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingStaff(false);
    }
  };

  const handleDeleteStaff = async (id: number) => {
    if (!confirm('Delete this staff record?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/administration/director-office/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Director's Section Manager</h1>
              <p className="text-xs text-gray-500">
                Manage Director's Profile & Message, Former Directors/Principals, and Director Office Staff.
              </p>
            </div>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-4 mt-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-2 text-xs font-bold transition-colors relative ${
              activeTab === 'profile'
                ? 'text-[#631012] border-b-2 border-[#631012]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Director's Profile & Message
          </button>
          <button
            onClick={() => setActiveTab('former')}
            className={`pb-3 px-2 text-xs font-bold transition-colors relative ${
              activeTab === 'former'
                ? 'text-[#631012] border-b-2 border-[#631012]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Former Directors & Principals ({formerList.length})
          </button>
          <button
            onClick={() => setActiveTab('office')}
            className={`pb-3 px-2 text-xs font-bold transition-colors relative ${
              activeTab === 'office'
                ? 'text-[#631012] border-b-2 border-[#631012]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Director Office Staff ({officeList.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Profile & Message */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveDirector} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 block">Director Photo</label>
              <div className="border border-gray-300 rounded-lg p-2 text-center bg-gray-50 space-y-2">
                <img
                  src={
                    director.image ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                  }
                  alt="Director"
                  className="w-full h-48 object-cover rounded-md border border-gray-200"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDirectorFile(e.target.files?.[0] || null)}
                  className="text-xs text-gray-600 w-full"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Director Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={director.heading_en || ''}
                    onChange={(e) => setDirector({ ...director, heading_en: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Director Name (Hindi)
                  </label>
                  <input
                    type="text"
                    value={director.heading_hi || ''}
                    onChange={(e) => setDirector({ ...director, heading_hi: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Designation (English)
                  </label>
                  <input
                    type="text"
                    value={director.designation_en || ''}
                    onChange={(e) => setDirector({ ...director, designation_en: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Designation (Hindi)
                  </label>
                  <input
                    type="text"
                    value={director.designation_hi || ''}
                    onChange={(e) => setDirector({ ...director, designation_hi: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Message / Address (English) *
                </label>
                <textarea
                  rows={5}
                  required
                  value={director.description_en || ''}
                  onChange={(e) => setDirector({ ...director, description_en: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-sans leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Message / Address (Hindi)
                </label>
                <textarea
                  rows={4}
                  value={director.description_hi || ''}
                  onChange={(e) => setDirector({ ...director, description_hi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-sans leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={savingDirector}
              className="bg-[#631012] hover:bg-[#500c0e] text-white px-6 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              {savingDirector ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Director's Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Former Directors & Principals (Image 3 Style) */}
      {activeTab === 'former' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-[#631012]">
              Former Directors & Principals Gallery
            </h2>
            <button
              onClick={() => setFormerModalOpen(true)}
              className="bg-[#631012] hover:bg-[#500c0e] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Former Director / Principal</span>
            </button>
          </div>

          {/* Grid matching Image 3 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {formerList.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg p-3 text-center space-y-2 hover:shadow-md transition-shadow relative group"
              >
                <button
                  onClick={() => handleDeleteFormer(item.id)}
                  className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
                <img
                  src={
                    item.image ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={item.heading_en}
                  className="w-28 h-32 mx-auto object-cover rounded border border-gray-300"
                />
                <div className="font-bold text-xs text-[#631012]">{item.heading_en}</div>
                <div className="text-[11px] text-gray-500 font-mono">{item.dates}</div>
                <div className="text-[10px] text-gray-400 uppercase font-semibold">{item.type}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Office Staff */}
      {activeTab === 'office' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-[#631012]">Director Office Staff</h2>
            <button
              onClick={() => setOfficeModalOpen(true)}
              className="bg-[#631012] hover:bg-[#500c0e] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Staff Member</span>
            </button>
          </div>

          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-[#f0f4f8] border-b text-[#0c344e] font-bold">
              <tr>
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-4">Designation</th>
                <th className="py-2.5 px-4">Phone No.</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {officeList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-gray-900">{item.name}</td>
                  <td className="py-3 px-4 text-gray-600">{item.designation}</td>
                  <td className="py-3 px-4 text-gray-700 font-mono text-xs">{item.phone_no}</td>
                  <td className="py-3 px-4 text-blue-700 font-mono text-xs">{item.email}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteStaff(item.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Former Director */}
      {formerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Former Director / Principal</h3>
              <button onClick={() => setFormerModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddFormer} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Category Type</label>
                <select
                  value={formerType}
                  onChange={(e) => setFormerType(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded font-semibold text-[#631012]"
                >
                  <option value="Former Directors, NIT Hamirpur">Former Directors, NIT Hamirpur</option>
                  <option value="Former Principals, REC Hamirpur">Former Principals, REC Hamirpur</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Name with Title *</label>
                <input
                  type="text"
                  required
                  value={formerName}
                  onChange={(e) => setFormerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded font-bold"
                  placeholder="e.g. Prof. Lalit Kumar Awasthi"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Tenure Dates</label>
                <input
                  type="text"
                  value={formerDates}
                  onChange={(e) => setFormerDates(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded"
                  placeholder="e.g. Tenure: 18.10.2020 to 02.02.2022"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormerFile(e.target.files?.[0] || null)}
                  className="text-xs text-gray-600 w-full"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setFormerModalOpen(false)}
                  className="px-4 py-1.5 border rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingFormer}
                  className="px-4 py-1.5 bg-[#631012] text-white rounded text-xs font-bold"
                >
                  {submittingFormer ? 'Saving...' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Staff */}
      {officeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Director Office Staff</h3>
              <button onClick={() => setOfficeModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Staff Name *</label>
                <input
                  type="text"
                  required
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded font-bold"
                  placeholder="e.g. Sh. Ramesh Kumar"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Designation</label>
                <input
                  type="text"
                  value={staffDesignation}
                  onChange={(e) => setStaffDesignation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded"
                  placeholder="e.g. Private Secretary to Director"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Phone No.</label>
                <input
                  type="text"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded"
                  placeholder="01972-254001"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Email</label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded"
                  placeholder="ps-director@nith.ac.in"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setOfficeModalOpen(false)}
                  className="px-4 py-1.5 border rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingStaff}
                  className="px-4 py-1.5 bg-[#631012] text-white rounded text-xs font-bold"
                >
                  {submittingStaff ? 'Saving...' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
