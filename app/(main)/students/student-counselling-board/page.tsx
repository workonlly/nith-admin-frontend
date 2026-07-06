'use client';

import React, { useState, useEffect } from 'react';
import { Save, Calendar, Plus, Trash2, FileText, Users, Link2, BookOpen } from 'lucide-react';

interface CompositionItem {
  sl_no: string;
  designation: string;
  responsibility: string;
}

interface CounsellorItem {
  sl_no: string;
  department: string;
  counsellors: string;
}

interface CounsellingData {
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  content: {
    overview_en: string;
    overview_hi: string;
    composition_en: CompositionItem[];
    composition_hi: CompositionItem[];
    counsellors_en: CounsellorItem[];
    counsellors_hi: CounsellorItem[];
    contact_discipline_email: string;
    contact_counselling_email: string;
    discipline_board_url: string;
  };
}

type TabType = 'overview' | 'composition' | 'counsellors' | 'contacts';

export default function StudentCounsellingBoardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CounsellingData>({
    title_en: 'Student Counselling Board',
    title_hi: 'छात्र परामर्श बोर्ड',
    description_en: '',
    description_hi: '',
    content: {
      overview_en: '',
      overview_hi: '',
      composition_en: [],
      composition_hi: [],
      counsellors_en: [],
      counsellors_hi: [],
      contact_discipline_email: 'associate.dean@nith.ac.in',
      contact_counselling_email: 'counselling@nith.ac.in',
      discipline_board_url: '/student/discipline/board'
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/students?page_name=student-counselling-board');
      const json = await res.json();
      if (json.success && json.data) {
        const item = json.data;
        const content = item.content || {};
        setData({
          title_en: item.title_en || 'Student Counselling Board',
          title_hi: item.title_hi || 'छात्र परामर्श बोर्ड',
          description_en: item.description_en || '',
          description_hi: item.description_hi || '',
          content: {
            overview_en: content.overview_en || '',
            overview_hi: content.overview_hi || '',
            composition_en: content.composition_en || [],
            composition_hi: content.composition_hi || [],
            counsellors_en: content.counsellors_en || [],
            counsellors_hi: content.counsellors_hi || [],
            contact_discipline_email: content.contact_discipline_email || 'associate.dean@nith.ac.in',
            contact_counselling_email: content.contact_counselling_email || 'counselling@nith.ac.in',
            discipline_board_url: content.discipline_board_url || '/student/discipline/board'
          }
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching counselling board data:', err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        page_name: 'student-counselling-board',
        title_en: data.title_en,
        title_hi: data.title_hi,
        description_en: data.description_en,
        description_hi: data.description_hi,
        content: data.content
      };
      const res = await fetch('http://localhost:5000/api/v1/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        alert('Changes saved successfully!');
      } else {
        alert('Error: ' + json.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving changes');
    }
  };

  const updateComposition = (
    index: number,
    lang: 'en' | 'hi',
    field: 'designation' | 'responsibility',
    value: string
  ) => {
    const listKey = `composition_${lang}` as 'composition_en' | 'composition_hi';
    const updated = [...(data.content[listKey] || [])];
    if (!updated[index]) {
      updated[index] = { sl_no: String(index + 1), designation: '', responsibility: '' };
    }
    updated[index] = { ...updated[index], [field]: value };
    setData({
      ...data,
      content: { ...data.content, [listKey]: updated }
    });
  };

  const addComposition = () => {
    const updatedEn = [...(data.content.composition_en || [])];
    const updatedHi = [...(data.content.composition_hi || [])];
    const nextSl = String(Math.max(updatedEn.length, updatedHi.length) + 1);
    updatedEn.push({ sl_no: nextSl, designation: '', responsibility: '' });
    updatedHi.push({ sl_no: nextSl, designation: '', responsibility: '' });
    setData({
      ...data,
      content: {
        ...data.content,
        composition_en: updatedEn,
        composition_hi: updatedHi
      }
    });
  };

  const removeComposition = (index: number) => {
    const updatedEn = (data.content.composition_en || []).filter((_, i) => i !== index).map((item, i) => ({ ...item, sl_no: String(i + 1) }));
    const updatedHi = (data.content.composition_hi || []).filter((_, i) => i !== index).map((item, i) => ({ ...item, sl_no: String(i + 1) }));
    setData({
      ...data,
      content: {
        ...data.content,
        composition_en: updatedEn,
        composition_hi: updatedHi
      }
    });
  };

  const updateCounsellor = (
    index: number,
    lang: 'en' | 'hi',
    field: 'department' | 'counsellors',
    value: string
  ) => {
    const listKey = `counsellors_${lang}` as 'counsellors_en' | 'counsellors_hi';
    const updated = [...(data.content[listKey] || [])];
    if (!updated[index]) {
      updated[index] = { sl_no: String(index + 1), department: '', counsellors: '' };
    }
    updated[index] = { ...updated[index], [field]: value };
    setData({
      ...data,
      content: { ...data.content, [listKey]: updated }
    });
  };

  const addCounsellor = () => {
    const updatedEn = [...(data.content.counsellors_en || [])];
    const updatedHi = [...(data.content.counsellors_hi || [])];
    const nextSl = String(Math.max(updatedEn.length, updatedHi.length) + 1);
    updatedEn.push({ sl_no: nextSl, department: '', counsellors: '' });
    updatedHi.push({ sl_no: nextSl, department: '', counsellors: '' });
    setData({
      ...data,
      content: {
        ...data.content,
        counsellors_en: updatedEn,
        counsellors_hi: updatedHi
      }
    });
  };

  const removeCounsellor = (index: number) => {
    const updatedEn = (data.content.counsellors_en || []).filter((_, i) => i !== index).map((item, i) => ({ ...item, sl_no: String(i + 1) }));
    const updatedHi = (data.content.counsellors_hi || []).filter((_, i) => i !== index).map((item, i) => ({ ...item, sl_no: String(i + 1) }));
    setData({
      ...data,
      content: {
        ...data.content,
        counsellors_en: updatedEn,
        counsellors_hi: updatedHi
      }
    });
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Hero & Overview', icon: <FileText size={18} /> },
    { id: 'composition' as TabType, label: 'Internal Committee', icon: <Users size={18} /> },
    { id: 'counsellors' as TabType, label: 'Dept Counsellors', icon: <BookOpen size={18} /> },
    { id: 'contacts' as TabType, label: 'Nodal Contacts & URLs', icon: <Link2 size={18} /> },
  ];

  if (loading) {
    return <div className="p-8 text-black font-semibold text-center">Loading Counselling Board Editor...</div>;
  }

  const compositionCount = Math.max(
    data.content.composition_en.length,
    data.content.composition_hi.length
  );

  const counsellorsCount = Math.max(
    data.content.counsellors_en.length,
    data.content.counsellors_hi.length
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-full flex-shrink-0">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Student Counselling Board</h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">
                Manage internal counseling committee composition, departmental counsellors, and support information.
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="bg-white text-[#631012] hover:bg-gray-100 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex overflow-x-auto scrollbar-thin">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 font-bold transition-all whitespace-nowrap text-sm sm:text-base flex-shrink-0
                  ${
                    activeTab === tab.id
                      ? 'border-b-4 border-[#631012] text-[#631012] bg-[#631012]/5'
                      : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-8">
          {/* Tab 1: Hero & Overview Section */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hero Title */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase">English</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">HERO PAGE TITLE</label>
                    <input
                      type="text"
                      value={data.title_en}
                      onChange={(e) => setData({ ...data, title_en: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="Student Counselling Board"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">HERO SUBTITLE / DESCRIPTION</label>
                    <textarea
                      rows={2}
                      value={data.description_en}
                      onChange={(e) => setData({ ...data, description_en: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="Student Counseling Facility helps students..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">OVERVIEW DESCRIPTION</label>
                    <textarea
                      rows={6}
                      value={data.content.overview_en}
                      onChange={(e) => setData({
                        ...data,
                        content: { ...data.content, overview_en: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="Enter detailed English overview..."
                    />
                  </div>
                </div>

                {/* Hero Title Hindi */}
                <div className="space-y-4 border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
                  <h3 className="text-sm font-bold text-[#631012] uppercase">Hindi</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">मुख्य शीर्षक (हिंदी)</label>
                    <input
                      type="text"
                      value={data.title_hi}
                      onChange={(e) => setData({ ...data, title_hi: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="छात्र परामर्श बोर्ड"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">मुख्य उपशीर्षक (हिंदी)</label>
                    <textarea
                      rows={2}
                      value={data.description_hi}
                      onChange={(e) => setData({ ...data, description_hi: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="छात्र परामर्श सुविधा छात्रों को..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">मुख्य विवरण (हिंदी)</label>
                    <textarea
                      rows={6}
                      value={data.content.overview_hi}
                      onChange={(e) => setData({
                        ...data,
                        content: { ...data.content, overview_hi: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="हिंदी में विस्तृत विवरण दर्ज करें..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Composition Section */}
          {activeTab === 'composition' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h2 className="text-xl font-bold">Internal Committee Composition</h2>
                <button
                  onClick={addComposition}
                  className="bg-[#631012] text-white hover:bg-[#800000] font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Plus size={16} /> Add Member Row
                </button>
              </div>

              <div className="space-y-4">
                {Array.from({ length: compositionCount }).map((_, index) => {
                  const enItem = data.content.composition_en[index] || { sl_no: String(index + 1), designation: '', responsibility: '' };
                  const hiItem = data.content.composition_hi[index] || { sl_no: String(index + 1), designation: '', responsibility: '' };

                  return (
                    <div key={index} className="p-6 border rounded-xl bg-gray-50 relative group border-gray-200">
                      <button
                        onClick={() => removeComposition(index)}
                        className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pr-10">
                        {/* Sl No */}
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 uppercase">Sl. No.</label>
                          <input
                            type="text"
                            value={enItem.sl_no}
                            disabled
                            className="w-full p-2.5 border rounded-lg bg-gray-100 text-gray-500 text-sm font-bold"
                          />
                        </div>

                        {/* English Inputs */}
                        <div className="md:col-span-5 space-y-3">
                          <h4 className="text-xs font-bold text-gray-400 uppercase">English Fields</h4>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">DESIGNATION</label>
                            <input
                              type="text"
                              value={enItem.designation}
                              onChange={(e) => updateComposition(index, 'en', 'designation', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="Dean (Student Welfare)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">RESPONSIBILITY</label>
                            <input
                              type="text"
                              value={enItem.responsibility}
                              onChange={(e) => updateComposition(index, 'en', 'responsibility', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="Chairperson"
                            />
                          </div>
                        </div>

                        {/* Hindi Inputs */}
                        <div className="md:col-span-5 space-y-3 border-t md:border-t-0 md:border-l md:pl-6 pt-3 md:pt-0">
                          <h4 className="text-xs font-bold text-[#631012] uppercase">हिंदी क्षेत्र</h4>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">पद (हिंदी)</label>
                            <input
                              type="text"
                              value={hiItem.designation}
                              onChange={(e) => updateComposition(index, 'hi', 'designation', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="डीन (छात्र कल्याण)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">जिम्मेदारी (हिंदी)</label>
                            <input
                              type="text"
                              value={hiItem.responsibility}
                              onChange={(e) => updateComposition(index, 'hi', 'responsibility', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="अध्यक्ष"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Departmental Counsellors Section */}
          {activeTab === 'counsellors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h2 className="text-xl font-bold">Departmental Counsellors</h2>
                <button
                  onClick={addCounsellor}
                  className="bg-[#631012] text-white hover:bg-[#800000] font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Plus size={16} /> Add Counsellor Row
                </button>
              </div>

              <div className="space-y-4">
                {Array.from({ length: counsellorsCount }).map((_, index) => {
                  const enItem = data.content.counsellors_en[index] || { sl_no: String(index + 1), department: '', counsellors: '' };
                  const hiItem = data.content.counsellors_hi[index] || { sl_no: String(index + 1), department: '', counsellors: '' };

                  return (
                    <div key={index} className="p-6 border rounded-xl bg-gray-50 relative group border-gray-200">
                      <button
                        onClick={() => removeCounsellor(index)}
                        className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pr-10">
                        {/* Sl No */}
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 uppercase">Sl. No.</label>
                          <input
                            type="text"
                            value={enItem.sl_no}
                            disabled
                            className="w-full p-2.5 border rounded-lg bg-gray-100 text-gray-500 text-sm font-bold"
                          />
                        </div>

                        {/* English Inputs */}
                        <div className="md:col-span-5 space-y-3">
                          <h4 className="text-xs font-bold text-gray-400 uppercase">English Fields</h4>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">DEPARTMENT NAME</label>
                            <input
                              type="text"
                              value={enItem.department}
                              onChange={(e) => updateCounsellor(index, 'en', 'department', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="Department of Civil Engineering"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">COUNSELLOR(S) (Newline separated)</label>
                            <textarea
                              rows={2}
                              value={enItem.counsellors}
                              onChange={(e) => updateCounsellor(index, 'en', 'counsellors', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="(i) Dr. Sanku Konai&#10;(ii) Dr. Arpita Saha"
                            />
                          </div>
                        </div>

                        {/* Hindi Inputs */}
                        <div className="md:col-span-5 space-y-3 border-t md:border-t-0 md:border-l md:pl-6 pt-3 md:pt-0">
                          <h4 className="text-xs font-bold text-[#631012] uppercase">हिंदी क्षेत्र</h4>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">विभाग का नाम (हिंदी)</label>
                            <input
                              type="text"
                              value={hiItem.department}
                              onChange={(e) => updateCounsellor(index, 'hi', 'department', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="सिविल इंजीनियरिंग विभाग"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">परामर्शदाता (हिंदी में)</label>
                            <textarea
                              rows={2}
                              value={hiItem.counsellors}
                              onChange={(e) => updateCounsellor(index, 'hi', 'counsellors', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="(i) डॉ. संकू कोनयी&#10;(ii) डॉ. अर्पिता साहा"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: Contacts Section */}
          {activeTab === 'contacts' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold border-b pb-2">Support Contacts & Discipline Board</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Associate Dean (Student Discipline & Counselling) Email</label>
                  <input
                    type="email"
                    value={data.content.contact_discipline_email}
                    onChange={(e) => setData({
                      ...data,
                      content: { ...data.content, contact_discipline_email: e.target.value }
                    })}
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black text-sm"
                    placeholder="associate.dean@nith.ac.in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Faculty Incharge (Counselling) Email</label>
                  <input
                    type="email"
                    value={data.content.contact_counselling_email}
                    onChange={(e) => setData({
                      ...data,
                      content: { ...data.content, contact_counselling_email: e.target.value }
                    })}
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black text-sm"
                    placeholder="counselling@nith.ac.in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Discipline Board URL Path</label>
                  <input
                    type="text"
                    value={data.content.discipline_board_url}
                    onChange={(e) => setData({
                      ...data,
                      content: { ...data.content, discipline_board_url: e.target.value }
                    })}
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black text-sm"
                    placeholder="/student/discipline/board"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
