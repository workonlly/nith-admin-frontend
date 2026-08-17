'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plane,
  Train,
  Bus,
  Plus,
  Edit2,
  Trash2,
  Save,
  RefreshCw,
  Layout,
  CheckCircle2,
  X,
  Navigation,
} from 'lucide-react';

interface ConnectivityMode {
  id: number;
  icon: string;
  title_en: string;
  title_hi: string;
  nearest_point_en: string;
  nearest_point_hi: string;
  distance_en: string;
  distance_hi: string;
  travel_time_en: string;
  travel_time_hi: string;
  services_en: string;
  services_hi: string;
  additional_info_en: string;
  additional_info_hi: string;
}

interface PageData {
  hero_heading_en: string;
  hero_heading_hi: string;
  hero_description_en: string;
  hero_description_hi: string;
  travel_options_heading_en: string;
  travel_options_heading_hi: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const ICON_OPTIONS = [
  { label: 'Plane (Air Connectivity)', value: 'Plane' },
  { label: 'Train (Rail Connectivity)', value: 'Train' },
  { label: 'Bus (Road & ISBT Connectivity)', value: 'Bus' },
];

export default function ConnectivityAdminPage() {
  const [modes, setModes] = useState<ConnectivityMode[]>([]);
  const [pageData, setPageData] = useState<PageData>({
    hero_heading_en: '',
    hero_heading_hi: '',
    hero_description_en: '',
    hero_description_hi: '',
    travel_options_heading_en: '',
    travel_options_heading_hi: '',
  });

  const [loading, setLoading] = useState(true);
  const [savingPage, setSavingPage] = useState(false);
  const [activeTab, setActiveTab] = useState<'modes' | 'page'>('modes');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formIcon, setFormIcon] = useState('Bus');
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleHi, setFormTitleHi] = useState('');
  const [formNearestEn, setFormNearestEn] = useState('');
  const [formNearestHi, setFormNearestHi] = useState('');
  const [formDistanceEn, setFormDistanceEn] = useState('');
  const [formDistanceHi, setFormDistanceHi] = useState('');
  const [formTimeEn, setFormTimeEn] = useState('');
  const [formTimeHi, setFormTimeHi] = useState('');
  const [formServicesEn, setFormServicesEn] = useState('');
  const [formServicesHi, setFormServicesHi] = useState('');
  const [formAddInfoEn, setFormAddInfoEn] = useState('');
  const [formAddInfoHi, setFormAddInfoHi] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/connectivity`);
      const json = await res.json();
      if (json.success) {
        setModes(json.data || []);
        if (json.page && json.page.hero_heading_en) {
          setPageData({
            hero_heading_en: json.page.hero_heading_en || '',
            hero_heading_hi: json.page.hero_heading_hi || '',
            hero_description_en: json.page.hero_description_en || '',
            hero_description_hi: json.page.hero_description_hi || '',
            travel_options_heading_en: json.page.travel_options_heading_en || '',
            travel_options_heading_hi: json.page.travel_options_heading_hi || '',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching connectivity:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePage = async () => {
    try {
      setSavingPage(true);
      const res = await fetch(`${API_BASE}/connectivity/page`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });
      if (res.ok) {
        alert('Connectivity page settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings');
    } finally {
      setSavingPage(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormIcon('Bus');
    setFormTitleEn('');
    setFormTitleHi('');
    setFormNearestEn('');
    setFormNearestHi('');
    setFormDistanceEn('');
    setFormDistanceHi('');
    setFormTimeEn('');
    setFormTimeHi('');
    setFormServicesEn('');
    setFormServicesHi('');
    setFormAddInfoEn('');
    setFormAddInfoHi('');
    setModalOpen(true);
  };

  const openEditModal = (item: ConnectivityMode) => {
    setEditingId(item.id);
    setFormIcon(item.icon || 'Bus');
    setFormTitleEn(item.title_en || '');
    setFormTitleHi(item.title_hi || '');
    setFormNearestEn(item.nearest_point_en || '');
    setFormNearestHi(item.nearest_point_hi || '');
    setFormDistanceEn(item.distance_en || '');
    setFormDistanceHi(item.distance_hi || '');
    setFormTimeEn(item.travel_time_en || '');
    setFormTimeHi(item.travel_time_hi || '');
    setFormServicesEn(item.services_en || '');
    setFormServicesHi(item.services_hi || '');
    setFormAddInfoEn(item.additional_info_en || '');
    setFormAddInfoHi(item.additional_info_hi || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitleEn.trim()) {
      alert('Please enter a Title');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        icon: formIcon,
        title_en: formTitleEn,
        title_hi: formTitleHi || formTitleEn,
        nearest_point_en: formNearestEn,
        nearest_point_hi: formNearestHi || formNearestEn,
        distance_en: formDistanceEn,
        distance_hi: formDistanceHi || formDistanceEn,
        travel_time_en: formTimeEn,
        travel_time_hi: formTimeHi || formTimeEn,
        services_en: formServicesEn,
        services_hi: formServicesHi || formServicesEn,
        additional_info_en: formAddInfoEn,
        additional_info_hi: formAddInfoHi || formAddInfoEn,
      };

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/connectivity/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/connectivity`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingId ? 'Connectivity mode updated!' : 'Connectivity mode added successfully!');
        setModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save mode');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transport mode?')) return;
    try {
      const res = await fetch(`${API_BASE}/connectivity/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-6 font-sans">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <Navigation size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Campus Connectivity & Routes Manager</h1>
              <p className="text-xs text-gray-500">
                Manage travel options, distances, bus routes, rail hubs, and airports connecting to NIT Hamirpur.
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
              <span>Add Travel Mode</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('modes')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'modes'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Navigation size={16} />
            <span>Transport Modes ({modes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('page')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'page'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layout size={16} />
            <span>Header & Intro Settings</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Modes List */}
          {activeTab === 'modes' && (
            <div className="space-y-4">
              <div className="border border-gray-300 rounded-lg overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
                  <thead className="bg-[#f0f4f8] border-b border-gray-300 text-[#0c344e] font-mono uppercase text-xs">
                    <tr>
                      <th className="py-3 px-4 w-24 text-center">Mode</th>
                      <th className="py-3 px-4 w-44">Title</th>
                      <th className="py-3 px-4 w-52">Nearest Point & Distance</th>
                      <th className="py-3 px-4">Services & Routes</th>
                      <th className="py-3 px-4 w-24 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {modes.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono text-xs font-bold text-gray-700">
                          <span className="px-2 py-1 bg-gray-100 rounded text-gray-800 border border-gray-300">
                            {item.icon}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 space-y-1 font-bold text-gray-900">
                          <div>{item.title_en}</div>
                          {item.title_hi && <div className="text-xs text-gray-600 font-medium">{item.title_hi}</div>}
                        </td>
                        <td className="py-3.5 px-4 space-y-1 text-xs">
                          <div className="font-semibold text-[#631012]">{item.nearest_point_en}</div>
                          <div className="text-gray-600 font-mono">{item.distance_en} ({item.travel_time_en})</div>
                        </td>
                        <td className="py-3.5 px-4 space-y-1 text-xs text-gray-700 leading-relaxed">
                          <div>{item.services_en}</div>
                          {item.additional_info_en && (
                            <div className="text-gray-500 italic">{item.additional_info_en}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
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

          {/* Tab 2: Page Settings */}
          {activeTab === 'page' && (
            <div className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-xs uppercase text-[#631012]">English Content</h3>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      Hero Heading
                    </label>
                    <input
                      type="text"
                      value={pageData.hero_heading_en}
                      onChange={(e) => setPageData({ ...pageData, hero_heading_en: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      Hero Description
                    </label>
                    <textarea
                      rows={4}
                      value={pageData.hero_description_en}
                      onChange={(e) => setPageData({ ...pageData, hero_description_en: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50/70 p-5 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-xs uppercase text-[#631012]">हिंदी सामग्री</h3>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      मुख्य शीर्षक (Hero Heading)
                    </label>
                    <input
                      type="text"
                      value={pageData.hero_heading_hi}
                      onChange={(e) => setPageData({ ...pageData, hero_heading_hi: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                      मुख्य विवरण (Hero Description)
                    </label>
                    <textarea
                      rows={4}
                      value={pageData.hero_description_hi}
                      onChange={(e) => setPageData({ ...pageData, hero_description_hi: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSavePage}
                disabled={savingPage}
                className="bg-[#631012] hover:bg-[#500c0e] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
              >
                <Save size={16} />
                <span>{savingPage ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold">
                {editingId ? 'Edit Travel Mode' : 'Add Travel Mode'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Icon</label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-semibold"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitleEn}
                    onChange={(e) => setFormTitleEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    placeholder="e.g. By Air / By Train"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Nearest Hub / Point (English)
                  </label>
                  <input
                    type="text"
                    value={formNearestEn}
                    onChange={(e) => setFormNearestEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                    placeholder="e.g. Gaggal Airport"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Distance (e.g. 85 km)
                  </label>
                  <input
                    type="text"
                    value={formDistanceEn}
                    onChange={(e) => setFormDistanceEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                    placeholder="85 km"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Travel Time (e.g. 2.5 Hours)
                </label>
                <input
                  type="text"
                  value={formTimeEn}
                  onChange={(e) => setFormTimeEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                  placeholder="2.5 - 4.5 Hours"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Services & Routes Details (English) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formServicesEn}
                  onChange={(e) => setFormServicesEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Additional Information (English)
                </label>
                <textarea
                  rows={2}
                  value={formAddInfoEn}
                  onChange={(e) => setFormAddInfoEn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                />
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
                  className="px-5 py-2 bg-[#631012] hover:bg-[#500c0e] text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Mode' : 'Add Mode'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
