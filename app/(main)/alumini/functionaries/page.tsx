'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Users, Layout, UserCheck, AlertCircle, RefreshCw } from 'lucide-react';

interface FacultyOption {
  id: number;
  faculty_id: string;
  name_en: string;
  name_hi: string;
  designation_en: string;
  department_en: string;
  email: string;
  phone_no: string;
}

interface Row {
  id: number;
  faculty_id?: number | null;
  slNo: string;
  nameEn: string;
  nameHn: string;
  responsibilityEn: string;
  responsibilityHn: string;
  phone: string;
  email: string;
  section_title_en: string;
  section_title_hn: string;
}

interface Section {
  titleEn: string;
  titleHn: string;
  rows: Row[];
}

interface FunctionariesData {
  heroHeadingEn: string;
  heroHeadingHn: string;
  heroSubheadingEn: string;
  heroSubheadingHn: string;
  sections: Section[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AlumniFunctionariesAdmin() {
  const [data, setData] = useState<FunctionariesData>({
    heroHeadingEn: 'Functionaries',
    heroHeadingHn: 'पदाधिकारी',
    heroSubheadingEn: 'Dean, Associate Dean, Alumni Association, Resource Generation, Staff',
    heroSubheadingHn: 'डीन, एसोसिएट डीन, पूर्व छात्र संघ, संसाधन सृजन, कर्मचारी',
    sections: [],
  });

  const [facultiesList, setFacultiesList] = useState<FacultyOption[]>([]);
  const [activeTab, setActiveTab] = useState<'hero' | 'sections'>('sections');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch functionaries & faculties
  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Fetch faculties from faculties_table
      try {
        const facRes = await fetch(`${API_BASE}/faculties`);
        if (facRes.ok) {
          const facData = await facRes.json();
          if (Array.isArray(facData)) {
            setFacultiesList(facData);
          }
        }
      } catch (fErr) {
        console.error('Failed to load faculties:', fErr);
      }

      // 2. Fetch heading
      const hRes = await fetch(`${API_BASE}/api/alumni-functionaries`);
      const hData = await hRes.json();
      if (hData && hData.title_en) {
        setData((prev) => ({
          ...prev,
          heroHeadingEn: hData.title_en,
          heroHeadingHn: hData.title_hn || '',
          heroSubheadingEn: hData.sub_title_en || '',
          heroSubheadingHn: hData.sub_title_hn || '',
        }));
      }

      // 3. Fetch list
      const lRes = await fetch(`${API_BASE}/api/alumni-functionaries/list`);
      const lData = await lRes.json();

      if (Array.isArray(lData) && lData.length > 0) {
        const sectionsMap: { [key: string]: Section } = {};
        lData.forEach((row: any) => {
          const key = row.section_title_en || 'General';
          if (!sectionsMap[key]) {
            sectionsMap[key] = {
              titleEn: row.section_title_en || 'General',
              titleHn: row.section_title_hn || '',
              rows: [],
            };
          }
          sectionsMap[key].rows.push({
            id: row.id,
            faculty_id: row.faculty_id || null,
            slNo: row.sl_no || '',
            nameEn: row.name_en || '',
            nameHn: row.name_hn || '',
            responsibilityEn: row.responsibility_en || '',
            responsibilityHn: row.responsibility_hn || '',
            phone: row.phone || '',
            email: row.email || '',
            section_title_en: row.section_title_en || key,
            section_title_hn: row.section_title_hn || '',
          });
        });
        setData((prev) => ({ ...prev, sections: Object.values(sectionsMap) }));
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // When admin selects a faculty member from the dropdown
  const handleSelectFaculty = (sectionIdx: number, rowIdx: number, selectedIdStr: string) => {
    const updated = [...data.sections];
    const currentRow = updated[sectionIdx].rows[rowIdx];

    if (!selectedIdStr) {
      // Unlink faculty
      updated[sectionIdx].rows[rowIdx] = {
        ...currentRow,
        faculty_id: null,
      };
    } else {
      const selectedId = parseInt(selectedIdStr, 10);
      const selectedFaculty = facultiesList.find((f) => f.id === selectedId);

      if (selectedFaculty) {
        updated[sectionIdx].rows[rowIdx] = {
          ...currentRow,
          faculty_id: selectedFaculty.id,
          nameEn: selectedFaculty.name_en || currentRow.nameEn,
          nameHn: selectedFaculty.name_hi || currentRow.nameHn,
          email: selectedFaculty.email || currentRow.email,
          phone: selectedFaculty.phone_no || currentRow.phone,
        };
      }
    }

    setData({ ...data, sections: updated });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Save heading
      await fetch(`${API_BASE}/api/alumni-functionaries`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_en: data.heroHeadingEn,
          title_hn: data.heroHeadingHn,
          sub_title_en: data.heroSubheadingEn,
          sub_title_hn: data.heroSubheadingHn,
        }),
      });

      // Save all section rows
      for (const section of data.sections) {
        for (const row of section.rows) {
          const payload = {
            faculty_id: row.faculty_id || null,
            section_title_en: section.titleEn,
            section_title_hn: section.titleHn,
            sl_no: row.slNo,
            name_en: row.nameEn,
            name_hn: row.nameHn,
            responsibility_en: row.responsibilityEn,
            responsibility_hn: row.responsibilityHn,
            phone: row.phone,
            email: row.email,
          };

          if (row.id > 0 && row.id < 1000000000) {
            await fetch(`${API_BASE}/api/alumni-functionaries/list/${row.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          } else {
            await fetch(`${API_BASE}/api/alumni-functionaries/list`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          }
        }
      }

      alert('All Alumni Functionaries changes saved successfully!');
      fetchData();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const updateRow = (sectionIdx: number, rowIdx: number, field: keyof Row, value: string) => {
    const updated = [...data.sections];
    updated[sectionIdx].rows[rowIdx] = { ...updated[sectionIdx].rows[rowIdx], [field]: value };
    setData({ ...data, sections: updated });
  };

  const addRow = (sectionIdx: number) => {
    const updated = [...data.sections];
    const newSlNo = (updated[sectionIdx].rows.length + 1).toString();

    updated[sectionIdx].rows.push({
      id: Date.now() + Math.random(),
      faculty_id: null,
      slNo: newSlNo,
      nameEn: '',
      nameHn: '',
      responsibilityEn: '',
      responsibilityHn: '',
      phone: '',
      email: '',
      section_title_en: updated[sectionIdx].titleEn,
      section_title_hn: updated[sectionIdx].titleHn,
    });
    setData({ ...data, sections: updated });
  };

  const removeRow = async (sectionIdx: number, rowIdx: number, id: number) => {
    if (id > 0 && id < 1000000000) {
      if (!confirm('Are you sure you want to delete this functionary from the database?')) return;
      await fetch(`${API_BASE}/api/alumni-functionaries/list/${id}`, { method: 'DELETE' });
    }
    const updated = [...data.sections];
    updated[sectionIdx].rows = updated[sectionIdx].rows.filter((_, i) => i !== rowIdx);
    setData({ ...data, sections: updated });
  };

  const addSection = () => {
    setData({
      ...data,
      sections: [
        ...data.sections,
        {
          titleEn: 'New Section',
          titleHn: 'नया अनुभाग',
          rows: [
            {
              id: Date.now() + Math.random(),
              faculty_id: null,
              slNo: '1',
              nameEn: '',
              nameHn: '',
              responsibilityEn: '',
              responsibilityHn: '',
              phone: '',
              email: '',
              section_title_en: 'New Section',
              section_title_hn: 'नया अनुभाग',
            },
          ],
        },
      ],
    });
  };

  const removeSection = (sectionIdx: number) => {
    if (!confirm('Are you sure you want to remove this section and all its rows?')) return;
    const updated = [...data.sections];
    updated.splice(sectionIdx, 1);
    setData({ ...data, sections: updated });
  };

  return (
    <div className="space-y-6 p-6 font-sans">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Alumni Functionaries Editor</h1>
              <p className="text-xs text-gray-500">
                Manage executive roles, associate deans, faculty in-charges, and staff linked with Faculties Table.
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
              onClick={handleSave}
              disabled={saving}
              className="bg-[#631012] hover:bg-[#500c0e] text-white px-5 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'sections'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users size={16} />
            <span>Sections & Members</span>
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'hero'
                ? 'border-[#631012] text-[#631012] bg-gray-50/70'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layout size={16} />
            <span>Page Heading</span>
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Hero & Page Heading */}
          {activeTab === 'hero' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 border border-gray-200 p-5 rounded-lg bg-gray-50/50">
                <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider">
                  English Title & Subtitle
                </label>
                <input
                  type="text"
                  value={data.heroHeadingEn}
                  onChange={(e) => setData({ ...data, heroHeadingEn: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="e.g. Functionaries"
                />
                <textarea
                  rows={3}
                  value={data.heroSubheadingEn}
                  onChange={(e) => setData({ ...data, heroSubheadingEn: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="Subheading description in English"
                />
              </div>

              <div className="space-y-4 border border-gray-200 p-5 rounded-lg bg-gray-50/50">
                <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider">
                  Hindi Title & Subtitle
                </label>
                <input
                  type="text"
                  value={data.heroHeadingHn}
                  onChange={(e) => setData({ ...data, heroHeadingHn: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="शीर्षक (e.g. पदाधिकारी)"
                />
                <textarea
                  rows={3}
                  value={data.heroSubheadingHn}
                  onChange={(e) => setData({ ...data, heroSubheadingHn: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="उपशीर्षक विवरण (हिंदी में)"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Sections & Members */}
          {activeTab === 'sections' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-start gap-2.5">
                  <UserCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-blue-900">
                      Faculty Table Foreign Key Integration
                    </h3>
                    <p className="text-xs text-blue-800 mt-0.5">
                      You can link each member directly with a faculty from the <strong>Faculties Table</strong>.
                      Selecting a faculty member automatically autofills and links their record with cascading delete protection.
                    </p>
                  </div>
                </div>
                <button
                  onClick={addSection}
                  className="bg-[#631012] hover:bg-[#500c0e] text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                >
                  <Plus size={15} />
                  <span>Add New Section</span>
                </button>
              </div>

              {data.sections.map((section, sIdx) => (
                <div
                  key={sIdx}
                  className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm space-y-4"
                >
                  {/* Section Title Bar */}
                  <div className="bg-[#f0f4f8] border-b border-gray-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                          Section Name (EN)
                        </label>
                        <input
                          value={section.titleEn}
                          onChange={(e) => {
                            const updated = [...data.sections];
                            updated[sIdx].titleEn = e.target.value;
                            setData({ ...data, sections: updated });
                          }}
                          className="w-full text-sm font-bold text-[#631012] bg-white border border-gray-300 px-3 py-1.5 rounded focus:outline-none focus:border-[#631012]"
                          placeholder="e.g. Dean and Associate Dean (Alumni & Resources)"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">
                          अनुभाग शीर्षक (HI)
                        </label>
                        <input
                          value={section.titleHn}
                          onChange={(e) => {
                            const updated = [...data.sections];
                            updated[sIdx].titleHn = e.target.value;
                            setData({ ...data, sections: updated });
                          }}
                          className="w-full text-sm font-bold text-[#631012] bg-white border border-gray-300 px-3 py-1.5 rounded focus:outline-none focus:border-[#631012]"
                          placeholder="उदा. डीन और एसोसिएट डीन (पूर्व छात्र और संसाधन)"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => removeSection(sIdx)}
                      className="text-red-600 hover:text-red-800 text-xs font-semibold px-2 py-1 flex items-center gap-1 shrink-0"
                    >
                      <Trash2 size={14} />
                      <span>Delete Section</span>
                    </button>
                  </div>

                  {/* Section Member Rows */}
                  <div className="p-4 space-y-4">
                    {section.rows.map((row, rIdx) => (
                      <div
                        key={row.id}
                        className="border border-gray-200 bg-gray-50/50 p-4 rounded-lg relative hover:border-gray-400 transition-colors space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold font-mono text-gray-600">
                              Row #{rIdx + 1}
                            </span>
                            {row.faculty_id ? (
                              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-bold flex items-center gap-1">
                                <UserCheck size={12} /> Linked (Faculty ID: {row.faculty_id})
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300 font-bold">
                                Manual / Staff
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => removeRow(sIdx, rIdx, row.id)}
                            className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 font-semibold"
                          >
                            <Trash2 size={14} />
                            <span>Remove</span>
                          </button>
                        </div>

                        {/* Faculty Selector from faculties_table */}
                        <div className="bg-white p-3 border border-gray-200 rounded">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 block mb-1.5">
                            ⚡ Choose Faculty from Faculties Table:
                          </label>
                          <select
                            value={row.faculty_id || ''}
                            onChange={(e) => handleSelectFaculty(sIdx, rIdx, e.target.value)}
                            className="w-full text-xs bg-gray-50 border border-gray-300 p-2 rounded focus:outline-none focus:border-[#631012] font-medium"
                          >
                            <option value="">-- Or Manual Entry (Not in Faculties Table) --</option>
                            {facultiesList.map((fac) => (
                              <option key={fac.id} value={fac.id}>
                                {fac.name_en} ({fac.designation_en || fac.department_en || fac.email})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Grid Form Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                          <div className="sm:col-span-1">
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                              Sl. No.
                            </label>
                            <input
                              value={row.slNo}
                              onChange={(e) => updateRow(sIdx, rIdx, 'slNo', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-300 bg-white rounded text-xs"
                              placeholder="1"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                              Name (English)
                            </label>
                            <input
                              value={row.nameEn}
                              onChange={(e) => updateRow(sIdx, rIdx, 'nameEn', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-300 bg-white rounded text-xs font-semibold"
                              placeholder="Prof. Ashwani Kumar Chandel"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                              नाम (Hindi)
                            </label>
                            <input
                              value={row.nameHn}
                              onChange={(e) => updateRow(sIdx, rIdx, 'nameHn', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-300 bg-white rounded text-xs"
                              placeholder="प्रो. अश्विनी कुमार चंदेल"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                              Responsibility (English)
                            </label>
                            <input
                              value={row.responsibilityEn}
                              onChange={(e) => updateRow(sIdx, rIdx, 'responsibilityEn', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-300 bg-white rounded text-xs"
                              placeholder="Dean / Associate Dean / Faculty Incharge"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                              जिम्मेदारी (Hindi)
                            </label>
                            <input
                              value={row.responsibilityHn}
                              onChange={(e) => updateRow(sIdx, rIdx, 'responsibilityHn', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-300 bg-white rounded text-xs"
                              placeholder="डीन / संकाय प्रभारी"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                              Phone No.
                            </label>
                            <input
                              value={row.phone}
                              onChange={(e) => updateRow(sIdx, rIdx, 'phone', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-300 bg-white rounded text-xs font-mono"
                              placeholder="254054 or --"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                              Email Address
                            </label>
                            <input
                              value={row.email}
                              onChange={(e) => updateRow(sIdx, rIdx, 'email', e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-gray-300 bg-white rounded text-xs font-mono"
                              placeholder="dar@nith.ac.in or --"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => addRow(sIdx)}
                      className="w-full py-2.5 border-2 border-dashed border-gray-300 bg-white text-gray-600 rounded-lg hover:border-[#631012] hover:text-[#631012] text-xs font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={15} />
                      <span>Add Member to {section.titleEn}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
