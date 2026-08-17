'use client';

import React, { useState, useEffect } from 'react';
import { Award, Plus, Trash2, RefreshCw, X, Save, Loader2 } from 'lucide-react';

interface ChairpersonData {
  id?: number;
  image?: string;
  heading_en?: string;
  heading_hi?: string;
  designation_en?: string;
  designation_hi?: string;
  description_en?: string;
  description_hi?: string;
}

interface FormerChairperson {
  id: number;
  type: string;
  heading_en: string;
  heading_hi?: string;
  dates: string;
  image: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ChairpersonAdminPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'former'>('profile');
  const [loading, setLoading] = useState(true);

  const [chairperson, setChairperson] = useState<ChairpersonData>({
    heading_en: 'Chairperson, Board of Governors',
    heading_hi: 'अध्यक्ष, शासी मंडल',
    designation_en: 'Chairperson, BOG, NIT Hamirpur',
    designation_hi: 'अध्यक्ष, शासी मंडल, एनआईटी हमीरपुर',
    description_en: '',
    description_hi: '',
    image: '',
  });
  const [chairFile, setChairFile] = useState<File | null>(null);
  const [savingChair, setSavingChair] = useState(false);

  const [formerList, setFormerList] = useState<FormerChairperson[]>([]);
  const [formerModalOpen, setFormerModalOpen] = useState(false);
  const [formerName, setFormerName] = useState('');
  const [formerDates, setFormerDates] = useState('');
  const [formerFile, setFormerFile] = useState<File | null>(null);
  const [submittingFormer, setSubmittingFormer] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/administration/chairperson`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.chairperson) setChairperson(data.chairperson);
        if (data.formerChairpersons) setFormerList(data.formerChairpersons);
      }
    } catch (err) {
      console.error('Error fetching chairperson admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveChairperson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingChair(true);
      const formData = new FormData();
      formData.append('heading_en', chairperson.heading_en || '');
      formData.append('heading_hi', chairperson.heading_hi || '');
      formData.append('designation_en', chairperson.designation_en || '');
      formData.append('designation_hi', chairperson.designation_hi || '');
      formData.append('description_en', chairperson.description_en || '');
      formData.append('description_hi', chairperson.description_hi || '');
      if (chairFile) formData.append('image_file', chairFile);
      else if (chairperson.image) formData.append('image', chairperson.image);

      const res = await fetch(`${API_BASE}/api/administration/chairperson`, {
        method: 'PUT',
        body: formData,
      });
      if (res.ok) {
        alert('Chairperson profile saved!');
        fetchData();
      } else {
        alert('Failed to save');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingChair(false);
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
      formData.append('type', 'Former Chairperson, BOG');
      formData.append('heading_en', formerName.trim());
      formData.append('dates', formerDates.trim());
      if (formerFile) formData.append('image_file', formerFile);

      const res = await fetch(`${API_BASE}/api/administration/former-chairperson`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert('Former Chairperson added!');
        setFormerModalOpen(false);
        setFormerName('');
        setFormerDates('');
        setFormerFile(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingFormer(false);
    }
  };

  const handleDeleteFormer = async (id: number) => {
    if (!confirm('Delete this former chairperson?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/administration/former-chairperson/${id}`, {
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <Award size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chairperson Manager</h1>
              <p className="text-xs text-gray-500">
                Manage Chairperson profile and former chairpersons gallery.
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
            Chairperson Profile
          </button>
          <button
            onClick={() => setActiveTab('former')}
            className={`pb-3 px-2 text-xs font-bold transition-colors ${
              activeTab === 'former' ? 'text-[#631012] border-b-2 border-[#631012]' : 'text-gray-500'
            }`}
          >
            Former Chairpersons ({formerList.length})
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSaveChairperson} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 block">Photo</label>
              <div className="border rounded-lg p-2 text-center bg-gray-50 space-y-2">
                <img
                  src={chairperson.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                  alt="Chairperson"
                  className="w-full h-48 object-cover rounded border"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setChairFile(e.target.files?.[0] || null)}
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
                    value={chairperson.heading_en || ''}
                    onChange={(e) => setChairperson({ ...chairperson, heading_en: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Name (Hindi)</label>
                  <input
                    type="text"
                    value={chairperson.heading_hi || ''}
                    onChange={(e) => setChairperson({ ...chairperson, heading_hi: e.target.value })}
                    className="w-full px-3 py-2 text-xs border rounded font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Message (English)</label>
                <textarea
                  rows={5}
                  value={chairperson.description_en || ''}
                  onChange={(e) => setChairperson({ ...chairperson, description_en: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={savingChair}
              className="bg-[#631012] text-white px-6 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
            >
              {savingChair ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Chairperson Profile</span>
            </button>
          </div>
        </form>
      )}

      {activeTab === 'former' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-[#631012]">Former Chairpersons Gallery</h2>
            <button
              onClick={() => setFormerModalOpen(true)}
              className="bg-[#631012] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Former Chairperson</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {formerList.map((item) => (
              <div key={item.id} className="border rounded-lg p-3 text-center space-y-2 relative group hover:shadow-md">
                <button
                  onClick={() => handleDeleteFormer(item.id)}
                  className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                  alt={item.heading_en}
                  className="w-28 h-32 mx-auto object-cover rounded border"
                />
                <div className="font-bold text-xs text-[#631012]">{item.heading_en}</div>
                <div className="text-[11px] text-gray-500 font-mono">{item.dates}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {formerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Former Chairperson</h3>
              <button onClick={() => setFormerModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddFormer} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Name with Title *</label>
                <input
                  type="text"
                  required
                  value={formerName}
                  onChange={(e) => setFormerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded font-bold"
                  placeholder="e.g. Prof. Chandra Shekhar"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Tenure Dates</label>
                <input
                  type="text"
                  value={formerDates}
                  onChange={(e) => setFormerDates(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded"
                  placeholder="e.g. Tenure: 2018 to 2023"
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
    </div>
  );
}
