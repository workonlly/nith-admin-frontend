'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Award,
  Save,
  Plus,
  Trash2,
  Edit2,
  Upload,
  RefreshCw,
  Layout,
  UserCheck,
  X,
  Image as ImageIcon,
} from 'lucide-react';

interface DistinguishedAlumnus {
  id: number;
  sl_no: string;
  name_en: string;
  name_hn: string;
  batch_en: string;
  batch_hn: string;
  photo: string;
  achievement_en: string;
  achievement_hn: string;
  department_en: string;
  department_hn: string;
  linkedin: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function DistinguishedAlumniAdmin() {
  const [heading, setHeading] = useState<HeadingData>({
    title_en: 'List of Noted Alumni',
    title_hn: 'प्रतिष्ठित पूर्व छात्रों की सूची',
    sub_title_en: 'Distinguished graduates of NIT Hamirpur who have made outstanding contributions in governance, industry, and academia.',
    sub_title_hn: 'एनआईटी हमीरपुर के प्रतिष्ठित स्नातक जिन्होंने शासन, उद्योग और शिक्षा जगत में उत्कृष्ट योगदान दिया है।',
  });

  const [alumni, setAlumni] = useState<DistinguishedAlumnus[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingHeading, setSavingHeading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'heading'>('list');

  // Modal / Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formSlNo, setFormSlNo] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formNameHn, setFormNameHn] = useState('');
  const [formBatchEn, setFormBatchEn] = useState('');
  const [formBatchHn, setFormBatchHn] = useState('');
  const [formDeptEn, setFormDeptEn] = useState('');
  const [formDeptHn, setFormDeptHn] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formAchievementEn, setFormAchievementEn] = useState('');
  const [formAchievementHn, setFormAchievementHn] = useState('');
  const [formLinkedin, setFormLinkedin] = useState('');
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch heading
      const hRes = await fetch(`${API_BASE}/api/alumni-distinguished`);
      if (hRes.ok) {
        const hData = await hRes.json();
        if (hData && hData.title_en) {
          setHeading({
            title_en: hData.title_en || '',
            title_hn: hData.title_hn || '',
            sub_title_en: hData.sub_title_en || '',
            sub_title_hn: hData.sub_title_hn || '',
          });
        }
      }

      // Fetch list
      const lRes = await fetch(`${API_BASE}/api/alumni-distinguished/list`);
      if (lRes.ok) {
        const lData = await lRes.json();
        if (Array.isArray(lData)) {
          setAlumni(lData);
        }
      }
    } catch (err) {
      console.error('Error fetching distinguished alumni:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveHeading = async () => {
    try {
      setSavingHeading(true);
      const res = await fetch(`${API_BASE}/api/alumni-distinguished`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heading),
      });
      if (res.ok) {
        alert('Page Heading saved successfully!');
      } else {
        alert('Failed to save heading');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving heading');
    } finally {
      setSavingHeading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormSlNo((alumni.length + 1).toString());
    setFormNameEn('');
    setFormNameHn('');
    setFormBatchEn('1990');
    setFormBatchHn('1990');
    setFormDeptEn('');
    setFormDeptHn('');
    setFormPhotoUrl('');
    setFormAchievementEn('');
    setFormAchievementHn('');
    setFormLinkedin('');
    setSelectedPhotoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setModalOpen(true);
  };

  const openEditModal = (item: DistinguishedAlumnus) => {
    setEditingId(item.id);
    setFormSlNo(item.sl_no || '');
    setFormNameEn(item.name_en || '');
    setFormNameHn(item.name_hn || '');
    setFormBatchEn(item.batch_en || '');
    setFormBatchHn(item.batch_hn || '');
    setFormDeptEn(item.department_en || '');
    setFormDeptHn(item.department_hn || '');
    setFormPhotoUrl(item.photo || '');
    setFormAchievementEn(item.achievement_en || '');
    setFormAchievementHn(item.achievement_hn || '');
    setFormLinkedin(item.linkedin || '');
    setSelectedPhotoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameEn.trim()) {
      alert('Please enter Alumnus Name and Title');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('sl_no', formSlNo);
      formData.append('name_en', formNameEn);
      formData.append('name_hn', formNameHn);
      formData.append('batch_en', formBatchEn);
      formData.append('batch_hn', formBatchHn || formBatchEn);
      formData.append('department_en', formDeptEn);
      formData.append('department_hn', formDeptHn);
      formData.append('achievement_en', formAchievementEn);
      formData.append('achievement_hn', formAchievementHn);
      formData.append('linkedin', formLinkedin);

      if (selectedPhotoFile) {
        formData.append('photo_file', selectedPhotoFile);
      } else if (formPhotoUrl) {
        formData.append('photo', formPhotoUrl);
      }

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/api/alumni-distinguished/list/${editingId}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        res = await fetch(`${API_BASE}/api/alumni-distinguished/list`, {
          method: 'POST',
          body: formData,
        });
      }

      if (res.ok) {
        alert(editingId ? 'Alumnus record updated successfully!' : 'New alumnus added successfully!');
        setModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save alumnus record');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this alumnus record?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/alumni-distinguished/list/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete record');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting record');
    }
  };

  return (
    <div className="space-y-6 p-6 font-sans">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <Award size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">List of Noted Alumni Manager</h1>
              <p className="text-xs text-gray-500">
                Manage distinguished alumni entries with names, designations, batch years, and photos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={openAddModal}
              className="bg-[#631012] hover:bg-[#500c0e] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>Add Noted Alumnus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'list'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Award size={16} />
            <span>Noted Alumni List ({alumni.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('heading')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'heading'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layout size={16} />
            <span>Page Title Settings</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Alumni List */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {alumni.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <Award className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">No alumni records uploaded yet.</p>
                  <button
                    onClick={openAddModal}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#631012] text-white text-xs font-bold rounded-lg"
                  >
                    <Plus size={14} /> Add First Alumnus
                  </button>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
                    <thead className="bg-[#f0f4f8] border-b border-gray-300 text-[#0c344e] font-mono uppercase text-xs">
                      <tr>
                        <th className="py-3 px-4 w-16 text-center">Sl. No.</th>
                        <th className="py-3 px-4">Name & Designation</th>
                        <th className="py-3 px-4 w-28 text-center">Batch</th>
                        <th className="py-3 px-4 w-32 text-center">Photo</th>
                        <th className="py-3 px-4 w-28 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {alumni.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-center font-bold text-gray-600">
                            {item.sl_no || index + 1}
                          </td>
                          <td className="py-3.5 px-4 space-y-1">
                            <div className="font-bold text-gray-900 leading-snug">
                              {item.name_en}
                            </div>
                            {item.name_hn && (
                              <div className="text-xs text-gray-600 font-medium">
                                {item.name_hn}
                              </div>
                            )}
                            {item.department_en && (
                              <div className="text-[11px] font-mono text-[#631012]">
                                {item.department_en}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-center text-gray-700">
                            {item.batch_en || '--'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {item.photo ? (
                              <img
                                src={item.photo}
                                alt={item.name_en}
                                className="w-14 h-16 object-cover rounded border border-gray-300 mx-auto shadow-sm"
                              />
                            ) : (
                              <div className="w-14 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center mx-auto text-gray-400 text-xs">
                                No Photo
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(item)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                title="Edit"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Heading */}
          {activeTab === 'heading' && (
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <label className="text-xs font-bold uppercase text-gray-700 block">
                    Page Title (English)
                  </label>
                  <input
                    type="text"
                    value={heading.title_en}
                    onChange={(e) => setHeading({ ...heading, title_en: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  />
                  <label className="text-xs font-bold uppercase text-gray-700 block pt-2">
                    Subtitle (English)
                  </label>
                  <textarea
                    rows={3}
                    value={heading.sub_title_en}
                    onChange={(e) => setHeading({ ...heading, sub_title_en: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  />
                </div>

                <div className="space-y-3 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <label className="text-xs font-bold uppercase text-gray-700 block">
                    Page Title (Hindi)
                  </label>
                  <input
                    type="text"
                    value={heading.title_hn}
                    onChange={(e) => setHeading({ ...heading, title_hn: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  />
                  <label className="text-xs font-bold uppercase text-gray-700 block pt-2">
                    Subtitle (Hindi)
                  </label>
                  <textarea
                    rows={3}
                    value={heading.sub_title_hn}
                    onChange={(e) => setHeading({ ...heading, sub_title_hn: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveHeading}
                disabled={savingHeading}
                className="bg-[#631012] hover:bg-[#500c0e] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
              >
                <Save size={16} />
                <span>{savingHeading ? 'Saving...' : 'Save Title Settings'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold">
                {editingId ? 'Edit Noted Alumnus' : 'Add New Noted Alumnus'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Sl. No.
                  </label>
                  <input
                    type="text"
                    value={formSlNo}
                    onChange={(e) => setFormSlNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] font-mono font-bold"
                    placeholder="1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Batch Year (e.g. 1990)
                  </label>
                  <input
                    type="text"
                    value={formBatchEn}
                    onChange={(e) => setFormBatchEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] font-mono font-bold"
                    placeholder="1990"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Name, Designation & Organization (English) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formNameEn}
                  onChange={(e) => setFormNameEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] font-semibold"
                  placeholder="e.g. O.P. Minhas Dy Director General, Indian Telecom Service, Deptt. of Telecommunication"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Name, Designation & Organization (Hindi)
                </label>
                <textarea
                  rows={2}
                  value={formNameHn}
                  onChange={(e) => setFormNameHn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="उदा. ओ.पी. मिन्हास उप महानिदेशक..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Department (English)
                  </label>
                  <input
                    type="text"
                    value={formDeptEn}
                    onChange={(e) => setFormDeptEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    placeholder="e.g. Electronics & Communication"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Department (Hindi)
                  </label>
                  <input
                    type="text"
                    value={formDeptHn}
                    onChange={(e) => setFormDeptHn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    placeholder="इलेक्ट्रॉनिक्स और संचार"
                  />
                </div>
              </div>

              {/* Photo Upload Box */}
              <div className="border border-gray-300 p-4 rounded-lg bg-gray-50/70 space-y-2">
                <label className="text-[11px] font-bold uppercase text-gray-700 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-[#631012]" />
                  <span>Upload Alumnus Photo:</span>
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedPhotoFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#631012] file:text-white hover:file:bg-[#500c0e]"
                />

                <div className="pt-2">
                  <span className="text-[10px] text-gray-500 block mb-1">Or Photo URL:</span>
                  <input
                    type="text"
                    value={formPhotoUrl}
                    onChange={(e) => setFormPhotoUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#631012] hover:bg-[#500c0e] text-white rounded-lg text-xs font-bold shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <UserCheck size={15} />
                  <span>{submitting ? 'Saving...' : editingId ? 'Update Record' : 'Add Alumnus'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
