'use client';

import React, { useState, useEffect } from 'react';
import { Landmark, Save, RefreshCw, Loader2 } from 'lucide-react';

interface VisitorData {
  id?: number;
  image?: string;
  heading_en?: string;
  heading_hi?: string;
  designation_en?: string;
  designation_hi?: string;
  description_en?: string;
  description_hi?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function VisitorAdminPage() {
  const [visitor, setVisitor] = useState<VisitorData>({
    heading_en: 'Smt. Droupadi Murmu',
    heading_hi: 'श्रीमती द्रौपदी मुर्मु',
    designation_en: "Hon'ble President of India & Visitor of NIT Hamirpur",
    designation_hi: 'माननीय भारत की राष्ट्रपति एवं एनआईटी हमीरपुर की कुलाध्यक्ष',
    description_en: '',
    description_hi: '',
    image: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/administration/visitor`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.heading_en) setVisitor(data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('heading_en', visitor.heading_en || '');
      formData.append('heading_hi', visitor.heading_hi || '');
      formData.append('designation_en', visitor.designation_en || '');
      formData.append('designation_hi', visitor.designation_hi || '');
      formData.append('description_en', visitor.description_en || '');
      formData.append('description_hi', visitor.description_hi || '');
      if (file) formData.append('image_file', file);
      else if (visitor.image) formData.append('image', visitor.image);

      const res = await fetch(`${API_BASE}/api/administration/visitor`, {
        method: 'PUT',
        body: formData,
      });
      if (res.ok) {
        alert('Visitor profile saved successfully!');
        fetchData();
      } else {
        alert('Failed to save visitor profile');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <Landmark size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Visitor Profile Manager</h1>
              <p className="text-xs text-gray-500">
                Manage the Hon'ble Visitor (President of India) profile of NIT Hamirpur.
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
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-700 block">Visitor Photo</label>
            <div className="border rounded-lg p-2 text-center bg-gray-50 space-y-2">
              <img
                src={visitor.image || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'}
                alt="Visitor"
                className="w-full h-52 object-cover rounded border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
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
                  value={visitor.heading_en || ''}
                  onChange={(e) => setVisitor({ ...visitor, heading_en: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Name (Hindi)</label>
                <input
                  type="text"
                  value={visitor.heading_hi || ''}
                  onChange={(e) => setVisitor({ ...visitor, heading_hi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Designation (English)</label>
                <input
                  type="text"
                  value={visitor.designation_en || ''}
                  onChange={(e) => setVisitor({ ...visitor, designation_en: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Designation (Hindi)</label>
                <input
                  type="text"
                  value={visitor.designation_hi || ''}
                  onChange={(e) => setVisitor({ ...visitor, designation_hi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border rounded"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Description (English) *</label>
              <textarea
                rows={4}
                required
                value={visitor.description_en || ''}
                onChange={(e) => setVisitor({ ...visitor, description_en: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded leading-relaxed"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Description (Hindi)</label>
              <textarea
                rows={3}
                value={visitor.description_hi || ''}
                onChange={(e) => setVisitor({ ...visitor, description_hi: e.target.value })}
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
            <span>Save Visitor Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
