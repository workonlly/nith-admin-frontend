'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Save, RefreshCw, Loader2, Plus, Trash2, X } from 'lucide-react';

interface RegistrarData {
  id?: number;
  image?: string;
  heading_en?: string;
  heading_hi?: string;
  designation_en?: string;
  designation_hi?: string;
  description_en?: string;
  description_hi?: string;
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

export default function RegistrarAdminPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'office'>('profile');
  const [registrar, setRegistrar] = useState<RegistrarData>({
    heading_en: 'Dr. Archana Santosh Nanoty',
    heading_hi: 'डॉ. अर्चना संतोष नानोटी',
    designation_en: 'Registrar, NIT Hamirpur',
    designation_hi: 'कुलसचिव, एनआईटी हमीरपुर',
    description_en: '',
    description_hi: '',
    image: '',
  });
  const [regFile, setRegFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      const res = await fetch(`${API_BASE}/api/administration/registrar`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.registrar) setRegistrar(data.registrar);
        if (data.registrarOffice) setOfficeList(data.registrarOffice);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('heading_en', registrar.heading_en || '');
      formData.append('heading_hi', registrar.heading_hi || '');
      formData.append('designation_en', registrar.designation_en || '');
      formData.append('designation_hi', registrar.designation_hi || '');
      formData.append('description_en', registrar.description_en || '');
      formData.append('description_hi', registrar.description_hi || '');
      if (regFile) formData.append('image_file', regFile);
      else if (registrar.image) formData.append('image', registrar.image);

      const res = await fetch(`${API_BASE}/api/administration/registrar`, {
        method: 'PUT',
        body: formData,
      });
      if (res.ok) {
        alert('Registrar profile saved!');
        fetchData();
      } else {
        alert('Failed to save');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) return;
    try {
      setSubmittingStaff(true);
      const res = await fetch(`${API_BASE}/api/administration/registrar-office`, {
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
        alert('Staff member added!');
        setOfficeModalOpen(false);
        setStaffName('');
        setStaffDesignation('');
        setStaffPhone('');
        setStaffEmail('');
        fetchData();
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
      const res = await fetch(`${API_BASE}/api/administration/registrar-office/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Registrar Section Manager</h1>
              <p className="text-xs text-gray-500">
                Manage Registrar profile, responsibilities, and office staff.
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-2 border rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="flex gap-4 mt-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-2 text-xs font-bold transition-colors ${
              activeTab === 'profile' ? 'text-[#631012] border-b-2 border-[#631012]' : 'text-gray-500'
            }`}
          >
            Registrar Profile
          </button>
          <button
            onClick={() => setActiveTab('office')}
            className={`pb-3 px-2 text-xs font-bold transition-colors ${
              activeTab === 'office' ? 'text-[#631012] border-b-2 border-[#631012]' : 'text-gray-500'
            }`}
          >
            Registrar Office Staff ({officeList.length})
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSaveRegistrar} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 block">Registrar Photo</label>
              <div className="border rounded-lg p-2 text-center bg-gray-50 space-y-2">
                <img
                  src={registrar.image || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'}
                  alt="Registrar"
                  className="w-full h-52 object-cover rounded border"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setRegFile(e.target.files?.[0] || null)}
                  className="text-xs text-gray-600 w-full"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={registrar.heading_en || ''}
                    onChange={(e) => setRegistrar({ ...registrar, heading_en: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Name (Hindi)</label>
                  <input
                    type="text"
                    value={registrar.heading_hi || ''}
                    onChange={(e) => setRegistrar({ ...registrar, heading_hi: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Description (English) *</label>
                <textarea
                  rows={4}
                  required
                  value={registrar.description_en || ''}
                  onChange={(e) => setRegistrar({ ...registrar, description_en: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Description (Hindi)</label>
                <textarea
                  rows={3}
                  value={registrar.description_hi || ''}
                  onChange={(e) => setRegistrar({ ...registrar, description_hi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#631012] text-white px-6 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Registrar Profile</span>
            </button>
          </div>
        </form>
      )}

      {activeTab === 'office' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-[#631012]">Registrar Office Staff</h2>
            <button
              onClick={() => setOfficeModalOpen(true)}
              className="bg-[#631012] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
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

      {officeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Registrar Office Staff</h3>
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
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Designation</label>
                <input
                  type="text"
                  value={staffDesignation}
                  onChange={(e) => setStaffDesignation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Phone No.</label>
                <input
                  type="text"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Email</label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded"
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
