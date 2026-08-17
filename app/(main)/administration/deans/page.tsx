'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, RefreshCw, X, Loader2, Phone, Mail, Award } from 'lucide-react';

interface DeanRecord {
  id: number;
  type: string; // 'Deans' | 'Associate Deans'
  sl_no: string;
  name: string;
  designation: string;
  department: string;
  responsibility: string;
  phone_no: string;
  email: string;
  faculty_id?: string;
}

interface FacultyOption {
  id: number;
  name_en: string;
  email: string;
  designation_en?: string;
  department_en?: string;
  phone_no?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function DeansAdminPage() {
  const [records, setRecords] = useState<DeanRecord[]>([]);
  const [facultyOptions, setFacultyOptions] = useState<FacultyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Deans' | 'Associate Deans'>('All');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formType, setFormType] = useState('Deans');
  const [formSlNo, setFormSlNo] = useState('1');
  const [formName, setFormName] = useState('');
  const [formDesignation, setFormDesignation] = useState('Professor');
  const [formDepartment, setFormDepartment] = useState('');
  const [formResponsibility, setFormResponsibility] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formFacultyId, setFormFacultyId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [res, fRes] = await Promise.all([
        fetch(`${API_BASE}/api/administration/deans`, { cache: 'no-store' }),
        fetch(`${API_BASE}/api/faculties`, { cache: 'no-store' }).catch(() => null),
      ]);

      if (res.ok) {
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : []);
      }
      if (fRes && fRes.ok) {
        const fData = await fRes.json();
        if (Array.isArray(fData)) setFacultyOptions(fData);
      }
    } catch (err) {
      console.error('Error fetching deans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = (defaultType = 'Deans') => {
    setEditingId(null);
    setFormType(defaultType);
    const filteredCount = records.filter((r) => r.type === defaultType).length;
    setFormSlNo((filteredCount + 1).toString());
    setFormName('');
    setFormDesignation('Professor');
    setFormDepartment('');
    setFormResponsibility('');
    setFormPhone('');
    setFormEmail('');
    setFormFacultyId('');
    setModalOpen(true);
  };

  const openEditModal = (item: DeanRecord) => {
    setEditingId(item.id);
    setFormType(item.type || 'Deans');
    setFormSlNo(item.sl_no || '1');
    setFormName(item.name || '');
    setFormDesignation(item.designation || '');
    setFormDepartment(item.department || '');
    setFormResponsibility(item.responsibility || '');
    setFormPhone(item.phone_no || '');
    setFormEmail(item.email || '');
    setFormFacultyId(item.faculty_id || '');
    setModalOpen(true);
  };

  const handleFacultySelect = (fId: string) => {
    setFormFacultyId(fId);
    if (!fId) return;
    const found = facultyOptions.find((f) => f.id.toString() === fId);
    if (found) {
      setFormName(found.name_en || '');
      if (found.email) setFormEmail(found.email);
      if (found.designation_en) setFormDesignation(found.designation_en);
      if (found.department_en) setFormDepartment(found.department_en);
      if (found.phone_no) setFormPhone(found.phone_no);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter Name');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        type: formType,
        sl_no: formSlNo,
        name: formName.trim(),
        designation: formDesignation.trim(),
        department: formDepartment.trim(),
        responsibility: formResponsibility.trim(),
        phone_no: formPhone.trim(),
        email: formEmail.trim(),
        faculty_id: formFacultyId,
      };

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/api/administration/deans/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/api/administration/deans`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingId ? 'Record updated!' : 'Record added!');
        setModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save record');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/administration/deans/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deansList = records.filter((r) => r.type === 'Deans');
  const assocDeansList = records.filter((r) => r.type === 'Associate Deans');

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Deans & Associate Deans Manager
              </h1>
              <p className="text-xs text-gray-500">
                Manage the Deans and Associate Deans of NIT Hamirpur with responsibilities, departments, and contacts.
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
              onClick={() => openAddModal('Deans')}
              className="bg-[#631012] hover:bg-[#500c0e] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>Add Dean / Assoc. Dean</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-6 border-b border-gray-200">
          {(['All', 'Deans', 'Associate Deans'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-3 text-xs font-bold transition-colors relative ${
                activeTab === tab
                  ? 'text-[#631012] border-b-2 border-[#631012]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab} (
              {tab === 'All'
                ? records.length
                : tab === 'Deans'
                ? deansList.length
                : assocDeansList.length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Sections Table (Image 1 Style) */}
      {(activeTab === 'All' || activeTab === 'Deans') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#e9f2f8] border-b border-gray-300 px-6 py-3 text-center">
            <h2 className="text-base font-bold text-[#0c344e]">Deans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
              <thead className="bg-[#002b49] text-white font-bold text-xs uppercase">
                <tr>
                  <th className="py-3 px-4 w-16 text-center border-r border-white/20">Sl. No.</th>
                  <th className="py-3 px-6 border-r border-white/20">Name</th>
                  <th className="py-3 px-6 border-r border-white/20">Responsibility</th>
                  <th className="py-3 px-4 w-32 border-r border-white/20">Phone No.</th>
                  <th className="py-3 px-6 border-r border-white/20">Email</th>
                  <th className="py-3 px-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {deansList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-gray-600 border-r border-gray-200">
                      {item.sl_no || idx + 1}
                    </td>
                    <td className="py-3 px-6 border-r border-gray-200">
                      <div className="font-bold text-gray-900">{item.name}</div>
                      {item.designation && (
                        <div className="text-xs text-gray-500">{item.designation}</div>
                      )}
                    </td>
                    <td className="py-3 px-6 border-r border-gray-200 font-medium text-gray-800">
                      {item.responsibility}
                    </td>
                    <td className="py-3 px-4 border-r border-gray-200 text-gray-700 font-mono text-xs">
                      {item.phone_no || '-'}
                    </td>
                    <td className="py-3 px-6 border-r border-gray-200 font-mono text-xs text-blue-700">
                      {item.email || '-'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeTab === 'All' || activeTab === 'Associate Deans') && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#e9f2f8] border-b border-gray-300 px-6 py-3 text-center">
            <h2 className="text-base font-bold text-[#0c344e]">Associate Deans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
              <thead className="bg-[#002b49] text-white font-bold text-xs uppercase">
                <tr>
                  <th className="py-3 px-4 w-16 text-center border-r border-white/20">Sl. No.</th>
                  <th className="py-3 px-6 border-r border-white/20">Name</th>
                  <th className="py-3 px-6 border-r border-white/20">Responsibility</th>
                  <th className="py-3 px-4 w-32 border-r border-white/20">Phone No.</th>
                  <th className="py-3 px-6 border-r border-white/20">Email</th>
                  <th className="py-3 px-4 w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {assocDeansList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-gray-600 border-r border-gray-200">
                      {item.sl_no || idx + 1}
                    </td>
                    <td className="py-3 px-6 border-r border-gray-200">
                      <div className="font-bold text-gray-900">{item.name}</div>
                      {item.designation && (
                        <div className="text-xs text-gray-500">{item.designation}</div>
                      )}
                    </td>
                    <td className="py-3 px-6 border-r border-gray-200 font-medium text-gray-800">
                      {item.responsibility}
                    </td>
                    <td className="py-3 px-4 border-r border-gray-200 text-gray-700 font-mono text-xs">
                      {item.phone_no || '-'}
                    </td>
                    <td className="py-3 px-6 border-r border-gray-200 font-mono text-xs text-blue-700">
                      {item.email || '-'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold">
                {editingId ? 'Edit Record' : 'Add Dean / Associate Dean'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Category Type *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-semibold text-[#631012]"
                  >
                    <option value="Deans">Deans</option>
                    <option value="Associate Deans">Associate Deans</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Sl. No.
                  </label>
                  <input
                    type="text"
                    value={formSlNo}
                    onChange={(e) => setFormSlNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Faculty Table Quick-Select */}
              {facultyOptions.length > 0 && (
                <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200 space-y-1">
                  <label className="text-[11px] font-bold uppercase text-amber-900 flex items-center gap-1">
                    <Award size={13} />
                    <span>Quick Select from Faculties Table</span>
                  </label>
                  <select
                    value={formFacultyId}
                    onChange={(e) => handleFacultySelect(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded bg-white"
                  >
                    <option value="">-- Choose faculty to auto-fill --</option>
                    {facultyOptions.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name_en} ({f.department_en || 'Faculty'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Full Name with Title *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] font-bold"
                  placeholder="e.g. Prof. Sushil Chauhan"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Responsibility / Portfolio *
                </label>
                <input
                  type="text"
                  required
                  value={formResponsibility}
                  onChange={(e) => setFormResponsibility(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-semibold text-[#0c344e]"
                  placeholder="e.g. Faculty Welfare / Academics"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Designation & Sub-text
                </label>
                <input
                  type="text"
                  value={formDesignation}
                  onChange={(e) => setFormDesignation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                  placeholder="e.g. Professor, Department of Electrical Engineering"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Phone No.</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                    placeholder="254009"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                    placeholder="dfw@nith.ac.in"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2">
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
                  className="px-5 py-2 bg-[#631012] hover:bg-[#500c0e] text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>{submitting ? 'Saving...' : editingId ? 'Update Record' : 'Save Record'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
