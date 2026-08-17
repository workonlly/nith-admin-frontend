'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Save,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Layout,
  UserCheck,
  X,
  Phone,
  Mail,
} from 'lucide-react';

interface FacultyFunctionary {
  id: number;
  faculty_id?: number | null;
  category_en: string;
  category_hn: string;
  category_description_en?: string;
  category_description_hn?: string;
  sl_no: string;
  role_en: string;
  role_hn: string;
  name_en: string;
  name_hn: string;
  department_en?: string;
  department_hn?: string;
  phone: string;
  email: string;
  since_date_en?: string;
  since_date_hn?: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
}

interface FacultyOption {
  id: number;
  name_en: string;
  email: string;
  designation_en?: string;
  department_en?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function FacultyFunctionariesAdmin() {
  const [heading, setHeading] = useState<HeadingData>({
    title_en: 'Functionaries (Faculty Welfare)',
    title_hn: 'पदाधिकारी (संकाय कल्याण)',
    sub_title_en: 'Administrative functionaries and officers responsible for faculty affairs, recruitment, discipline, and welfare at NIT Hamirpur.',
    sub_title_hn: 'एनआईटी हमीरपुर में संकाय मामलों, भर्ती, अनुशासन और कल्याण के लिए जिम्मेदार प्रशासनिक पदाधिकारी और अधिकारी।',
  });

  const [functionaries, setFunctionaries] = useState<FacultyFunctionary[]>([]);
  const [facultyOptions, setFacultyOptions] = useState<FacultyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingHeading, setSavingHeading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'heading'>('list');

  // Modal / Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formCategoryEn, setFormCategoryEn] = useState('Dean and Associate Deans');
  const [formCategoryHn, setFormCategoryHn] = useState('डीन और एसोसिएट डीन');
  const [formSlNo, setFormSlNo] = useState('1');
  const [formNameEn, setFormNameEn] = useState('');
  const [formNameHn, setFormNameHn] = useState('');
  const [formRoleEn, setFormRoleEn] = useState('');
  const [formRoleHn, setFormRoleHn] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formFacultyId, setFormFacultyId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch heading
      const hRes = await fetch(`${API_BASE}/api/faculty-functionaries`);
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

      // Fetch functionaries list
      const lRes = await fetch(`${API_BASE}/api/faculty-functionaries/list`);
      if (lRes.ok) {
        const lData = await lRes.json();
        if (Array.isArray(lData)) {
          setFunctionaries(lData);
        }
      }

      // Fetch faculty list for linking
      const fRes = await fetch(`${API_BASE}/api/faculties`);
      if (fRes.ok) {
        const fData = await fRes.json();
        if (Array.isArray(fData)) {
          setFacultyOptions(fData);
        }
      }
    } catch (err) {
      console.error('Error fetching faculty functionaries:', err);
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
      const res = await fetch(`${API_BASE}/api/faculty-functionaries`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heading),
      });
      if (res.ok) {
        alert('Heading settings saved successfully!');
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
    setFormCategoryEn('Dean and Associate Deans');
    setFormCategoryHn('डीन और एसोसिएट डीन');
    setFormSlNo((functionaries.length + 1).toString());
    setFormNameEn('');
    setFormNameHn('');
    setFormRoleEn('');
    setFormRoleHn('');
    setFormPhone('');
    setFormEmail('');
    setFormFacultyId('');
    setModalOpen(true);
  };

  const openEditModal = (item: FacultyFunctionary) => {
    setEditingId(item.id);
    setFormCategoryEn(item.category_en || 'Dean and Associate Deans');
    setFormCategoryHn(item.category_hn || 'डीन और एसोसिएट डीन');
    setFormSlNo(item.sl_no || '1');
    setFormNameEn(item.name_en || '');
    setFormNameHn(item.name_hn || '');
    setFormRoleEn(item.role_en || '');
    setFormRoleHn(item.role_hn || '');
    setFormPhone(item.phone || '');
    setFormEmail(item.email || '');
    setFormFacultyId(item.faculty_id ? item.faculty_id.toString() : '');
    setModalOpen(true);
  };

  const handleFacultySelect = (facultyIdStr: string) => {
    setFormFacultyId(facultyIdStr);
    if (!facultyIdStr) return;
    const found = facultyOptions.find((f) => f.id.toString() === facultyIdStr);
    if (found) {
      if (!formNameEn) setFormNameEn(found.name_en);
      if (!formEmail && found.email) setFormEmail(found.email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameEn.trim()) {
      alert('Please enter Functionary Name');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        category_en: formCategoryEn,
        category_hn: formCategoryHn,
        sl_no: formSlNo,
        name_en: formNameEn,
        name_hn: formNameHn,
        role_en: formRoleEn,
        role_hn: formRoleHn,
        phone: formPhone,
        email: formEmail,
        faculty_id: formFacultyId ? parseInt(formFacultyId) : null,
      };

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/api/faculty-functionaries/list/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/api/faculty-functionaries/list`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingId ? 'Functionary record updated!' : 'Functionary added successfully!');
        setModalOpen(false);
        fetchData();
      } else {
        alert('Failed to save functionary');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this functionary?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/faculty-functionaries/list/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Failed to delete functionary');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting functionary');
    }
  };

  // Group by category
  const categories = Array.from(new Set(functionaries.map((f) => f.category_en || 'General')));

  return (
    <div className="space-y-6 p-6 font-sans">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Faculty Welfare Functionaries Manager</h1>
              <p className="text-xs text-gray-500">
                Manage Dean, Associate Deans, and Section Staff with responsibility, phone numbers, emails, and faculties table references.
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
              <span>Add Functionary</span>
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
            <Users size={16} />
            <span>Functionaries List ({functionaries.length})</span>
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
          {/* Tab 1: Functionaries List */}
          {activeTab === 'list' && (
            <div className="space-y-6">
              {functionaries.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">No functionaries added yet.</p>
                  <button
                    onClick={openAddModal}
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#631012] text-white text-xs font-bold rounded-lg"
                  >
                    <Plus size={14} /> Add First Functionary
                  </button>
                </div>
              ) : (
                categories.map((cat) => {
                  const items = functionaries.filter((f) => (f.category_en || 'General') === cat);
                  return (
                    <div key={cat} className="space-y-2">
                      <div className="bg-[#f0f4f8] border-l-4 border-[#0c344e] px-4 py-2 rounded-r flex items-center justify-between">
                        <h3 className="font-bold text-xs uppercase text-[#0c344e] tracking-wider">{cat}</h3>
                        <span className="text-xs font-semibold text-gray-500">{items.length} members</span>
                      </div>

                      <div className="border border-gray-300 rounded-lg overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
                          <thead className="bg-gray-100 border-b border-gray-300 text-gray-700 font-mono uppercase text-[11px]">
                            <tr>
                              <th className="py-2.5 px-4 w-16 text-center">Sl. No.</th>
                              <th className="py-2.5 px-4">Name</th>
                              <th className="py-2.5 px-4">Responsibility</th>
                              <th className="py-2.5 px-4 w-32">Phone No.</th>
                              <th className="py-2.5 px-4 w-44">Email</th>
                              <th className="py-2.5 px-4 w-24 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {items.map((item, index) => (
                              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 font-mono text-center font-bold text-gray-600">
                                  {item.sl_no || index + 1}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-bold text-gray-900">{item.name_en}</div>
                                  {item.name_hn && (
                                    <div className="text-xs text-gray-600 font-medium">{item.name_hn}</div>
                                  )}
                                  {item.faculty_id && (
                                    <span className="inline-block mt-0.5 text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-mono">
                                      Linked to Faculty #{item.faculty_id}
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="font-semibold text-gray-800">{item.role_en || '--'}</div>
                                  {item.role_hn && (
                                    <div className="text-xs text-gray-500">{item.role_hn}</div>
                                  )}
                                </td>
                                <td className="py-3 px-4 font-mono text-gray-700">
                                  {item.phone || '--'}
                                </td>
                                <td className="py-3 px-4 font-mono text-xs text-blue-600">
                                  {item.email || '--'}
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
                  );
                })
              )}
            </div>
          )}

          {/* Tab 2: Title Settings */}
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
                {editingId ? 'Edit Functionary' : 'Add New Functionary'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Section Category (English) *
                  </label>
                  <select
                    value={formCategoryEn}
                    onChange={(e) => {
                      setFormCategoryEn(e.target.value);
                      if (e.target.value === 'Dean and Associate Deans') setFormCategoryHn('डीन और एसोसिएट डीन');
                      else if (e.target.value === 'Section Staff') setFormCategoryHn('अनुभाग कर्मचारी');
                    }}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] bg-white font-semibold"
                  >
                    <option value="Dean and Associate Deans">Dean and Associate Deans</option>
                    <option value="Section Staff">Section Staff</option>
                    <option value="Other Functionaries">Other Functionaries</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Section Category (Hindi)
                  </label>
                  <input
                    type="text"
                    value={formCategoryHn}
                    onChange={(e) => setFormCategoryHn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  />
                </div>
              </div>

              {/* Faculty link dropdown */}
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Link to Faculty Member (Optional)
                </label>
                <select
                  value={formFacultyId}
                  onChange={(e) => handleFacultySelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] bg-white"
                >
                  <option value="">-- Select from faculties table (or type below) --</option>
                  {facultyOptions.map((f) => (
                    <option key={f.id} value={f.id.toString()}>
                      {f.name_en} {f.email ? `(${f.email})` : ''} {f.department_en ? `- ${f.department_en}` : ''}
                    </option>
                  ))}
                </select>
              </div>

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
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] font-semibold"
                    placeholder="e.g. Prof. Sushil Chauhan"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Name (Hindi)
                </label>
                <input
                  type="text"
                  value={formNameHn}
                  onChange={(e) => setFormNameHn(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="उदा. प्रो. सुशील चौहान"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Responsibility / Role (English)
                  </label>
                  <input
                    type="text"
                    value={formRoleEn}
                    onChange={(e) => setFormRoleEn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    placeholder="e.g. Dean (Faculty Welfare)"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Responsibility / Role (Hindi)
                  </label>
                  <input
                    type="text"
                    value={formRoleHn}
                    onChange={(e) => setFormRoleHn(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    placeholder="डीन (संकाय कल्याण)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Phone No.
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] font-mono"
                    placeholder="254009"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                    Email
                  </label>
                  <input
                    type="text"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] font-mono"
                    placeholder="dfw@nith.ac.in"
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
                  <span>{submitting ? 'Saving...' : editingId ? 'Update Record' : 'Add Functionary'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
