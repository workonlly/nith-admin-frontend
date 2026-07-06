'use client';

import React, { useState, useEffect } from 'react';
import { Save, Award, Plus, Trash2, FileText, Users, Link2, Download } from 'lucide-react';

interface FacultyItem {
  name: string;
  responsibility: string;
  phone: string;
  email: string;
}

interface LinkItem {
  title: string;
  subtitle: string;
  url: string;
  is_external: boolean;
  type: string;
}

interface ScholarshipsData {
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  content: {
    overview_en: string;
    overview_hi: string;
    faculty_en: FacultyItem[];
    faculty_hi: FacultyItem[];
    links: LinkItem[];
    contact_name: string;
    contact_role: string;
    contact_email: string;
    contact_phone: string;
  };
}

type TabType = 'overview' | 'faculty' | 'links' | 'contacts';

export default function ScholarshipsFellowshipsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ScholarshipsData>({
    title_en: 'Scholarships & Welfare',
    title_hi: 'छात्रवृत्ति और कल्याण',
    description_en: '',
    description_hi: '',
    content: {
      overview_en: '',
      overview_hi: '',
      faculty_en: [],
      faculty_hi: [],
      links: [],
      contact_name: '',
      contact_role: '',
      contact_email: '',
      contact_phone: ''
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/students?page_name=scholarships');
      const json = await res.json();
      if (json.success && json.data) {
        const item = json.data;
        const content = item.content || {};
        setData({
          title_en: item.title_en || 'Scholarships & Welfare',
          title_hi: item.title_hi || 'छात्रवृत्ति और कल्याण',
          description_en: item.description_en || '',
          description_hi: item.description_hi || '',
          content: {
            overview_en: content.overview_en || '',
            overview_hi: content.overview_hi || '',
            faculty_en: content.faculty_en || [],
            faculty_hi: content.faculty_hi || [],
            links: content.links || [],
            contact_name: content.contact_name || '',
            contact_role: content.contact_role || '',
            contact_email: content.contact_email || '',
            contact_phone: content.contact_phone || ''
          }
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching scholarships data:', err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        page_name: 'scholarships',
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

  const updateFaculty = (
    index: number,
    lang: 'en' | 'hi',
    field: keyof FacultyItem,
    value: string
  ) => {
    const listKey = `faculty_${lang}` as 'faculty_en' | 'faculty_hi';
    const updated = [...(data.content[listKey] || [])];
    if (!updated[index]) {
      updated[index] = { name: '', responsibility: '', phone: '', email: '' };
    }
    updated[index] = { ...updated[index], [field]: value };
    setData({
      ...data,
      content: { ...data.content, [listKey]: updated }
    });
  };

  const addFaculty = () => {
    const updatedEn = [...(data.content.faculty_en || [])];
    const updatedHi = [...(data.content.faculty_hi || [])];
    updatedEn.push({ name: '', responsibility: '', phone: '', email: '' });
    updatedHi.push({ name: '', responsibility: '', phone: '', email: '' });
    setData({
      ...data,
      content: {
        ...data.content,
        faculty_en: updatedEn,
        faculty_hi: updatedHi
      }
    });
  };

  const removeFaculty = (index: number) => {
    const updatedEn = (data.content.faculty_en || []).filter((_, i) => i !== index);
    const updatedHi = (data.content.faculty_hi || []).filter((_, i) => i !== index);
    setData({
      ...data,
      content: {
        ...data.content,
        faculty_en: updatedEn,
        faculty_hi: updatedHi
      }
    });
  };

  const updateLink = (index: number, field: keyof LinkItem, value: any) => {
    const updated = [...(data.content.links || [])];
    if (!updated[index]) {
      updated[index] = { title: '', subtitle: '', url: '', is_external: false, type: 'portal' };
    }
    updated[index] = { ...updated[index], [field]: value };
    setData({
      ...data,
      content: { ...data.content, links: updated }
    });
  };

  const addLink = () => {
    const updated = [...(data.content.links || [])];
    updated.push({ title: '', subtitle: '', url: '', is_external: false, type: 'portal' });
    setData({
      ...data,
      content: { ...data.content, links: updated }
    });
  };

  const removeLink = (index: number) => {
    const updated = (data.content.links || []).filter((_, i) => i !== index);
    setData({
      ...data,
      content: { ...data.content, links: updated }
    });
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Hero & Overview', icon: <FileText size={18} /> },
    { id: 'faculty' as TabType, label: 'Faculty Contacts', icon: <Users size={18} /> },
    { id: 'links' as TabType, label: 'Portals & PDFs', icon: <Link2 size={18} /> },
    { id: 'contacts' as TabType, label: 'Nomination Office', icon: <Download size={18} /> },
  ];

  if (loading) {
    return <div className="p-8 text-black font-semibold text-center">Loading Scholarships Editor...</div>;
  }

  const facultyCount = Math.max(
    data.content.faculty_en.length,
    data.content.faculty_hi.length
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-full flex-shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Scholarships & Welfare</h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">
                Manage bilingual portal details, nodal officers, external links, and policies.
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
                      placeholder="Scholarships & Welfare"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">HERO SUBTITLE / DESCRIPTION</label>
                    <textarea
                      rows={2}
                      value={data.description_en}
                      onChange={(e) => setData({ ...data, description_en: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="Centralized information on scholarships..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">OVERVIEW DESCRIPTION</label>
                    <textarea
                      rows={4}
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
                      placeholder="छात्रवृत्ति और कल्याण"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">मुख्य उपशीर्षक (हिंदी)</label>
                    <textarea
                      rows={2}
                      value={data.description_hi}
                      onChange={(e) => setData({ ...data, description_hi: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="छात्रवृत्ति, नोडल अधिकारियों..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">मुख्य विवरण (हिंदी)</label>
                    <textarea
                      rows={4}
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

          {/* Tab 2: Faculty Section */}
          {activeTab === 'faculty' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h2 className="text-xl font-bold">Faculty Nodal Contacts</h2>
                <button
                  onClick={addFaculty}
                  className="bg-[#631012] text-white hover:bg-[#800000] font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Plus size={16} /> Add Contact Row
                </button>
              </div>

              <div className="space-y-4">
                {Array.from({ length: facultyCount }).map((_, index) => {
                  const enItem = data.content.faculty_en[index] || { name: '', responsibility: '', phone: '', email: '' };
                  const hiItem = data.content.faculty_hi[index] || { name: '', responsibility: '', phone: '', email: '' };

                  return (
                    <div key={index} className="p-6 border rounded-xl bg-gray-50 relative group border-gray-200">
                      <button
                        onClick={() => removeFaculty(index)}
                        className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-10">
                        {/* English Inputs */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-gray-400 uppercase">Contact {index + 1} (English)</h4>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">NAME</label>
                            <input
                              type="text"
                              value={enItem.name}
                              onChange={(e) => updateFaculty(index, 'en', 'name', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="Dr. Puneet Sharma"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">RESPONSIBILITY</label>
                            <input
                              type="text"
                              value={enItem.responsibility}
                              onChange={(e) => updateFaculty(index, 'en', 'responsibility', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="Faculty Incharge cum Nodal Officer"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">PHONE</label>
                              <input
                                type="text"
                                value={enItem.phone}
                                onChange={(e) => updateFaculty(index, 'en', 'phone', e.target.value)}
                                className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                                placeholder="254926"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">EMAIL</label>
                              <input
                                type="email"
                                value={enItem.email}
                                onChange={(e) => updateFaculty(index, 'en', 'email', e.target.value)}
                                className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                                placeholder="architect.puneet@nith.ac.in"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Hindi Inputs */}
                        <div className="space-y-3 border-t md:border-t-0 md:border-l md:pl-6 pt-3 md:pt-0">
                          <h4 className="text-xs font-bold text-[#631012] uppercase">संपर्क {index + 1} (हिंदी)</h4>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">नाम (हिंदी)</label>
                            <input
                              type="text"
                              value={hiItem.name}
                              onChange={(e) => updateFaculty(index, 'hi', 'name', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="डॉ. पुनीत शर्मा"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">जिम्मेदारी (हिंदी)</label>
                            <input
                              type="text"
                              value={hiItem.responsibility}
                              onChange={(e) => updateFaculty(index, 'hi', 'responsibility', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="संकाय प्रभारी सह नोडल अधिकारी"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">फोन (हिंदी)</label>
                              <input
                                type="text"
                                value={hiItem.phone}
                                onChange={(e) => updateFaculty(index, 'hi', 'phone', e.target.value)}
                                className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                                placeholder="254926"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">ईमेल (हिंदी)</label>
                              <input
                                type="email"
                                value={hiItem.email}
                                onChange={(e) => updateFaculty(index, 'hi', 'email', e.target.value)}
                                className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                                placeholder="architect.puneet@nith.ac.in"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Links Section */}
          {activeTab === 'links' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h2 className="text-xl font-bold">Portals & Download Links</h2>
                <button
                  onClick={addLink}
                  className="bg-[#631012] text-white hover:bg-[#800000] font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Plus size={16} /> Add Link Item
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {(data.content.links || []).map((link, index) => (
                  <div key={index} className="p-6 border rounded-xl bg-gray-50 relative group border-gray-200">
                    <button
                      onClick={() => removeLink(index)}
                      className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-10">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">LINK / PORTAL TITLE</label>
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => updateLink(index, 'title', e.target.value)}
                            className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                            placeholder="National Scholarship Portal"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">SUBTITLE</label>
                          <input
                            type="text"
                            value={link.subtitle}
                            onChange={(e) => updateLink(index, 'subtitle', e.target.value)}
                            className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                            placeholder="Apply / Track applications"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">URL PATH / LINK</label>
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                            className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                            placeholder="https://scholarships.gov.in"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">LINK TYPE</label>
                            <select
                              value={link.type}
                              onChange={(e) => updateLink(index, 'type', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                            >
                              <option value="portal">Portal Link</option>
                              <option value="pdf">PDF Download</option>
                            </select>
                          </div>
                          <div className="flex items-center pt-5">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={link.is_external}
                                onChange={(e) => updateLink(index, 'is_external', e.target.checked)}
                                className="w-4 h-4 rounded text-[#631012] focus:ring-[#631012]"
                              />
                              External URL?
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Contacts Section */}
          {activeTab === 'contacts' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-xl font-bold border-b pb-2">Nomination & Ceremony Coordination Desk</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Office Incharge Name</label>
                  <input
                    type="text"
                    value={data.content.contact_name}
                    onChange={(e) => setData({
                      ...data,
                      content: { ...data.content, contact_name: e.target.value }
                    })}
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black text-sm"
                    placeholder="Dr. Pardeep Singh"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Office Role / Designation</label>
                  <input
                    type="text"
                    value={data.content.contact_role}
                    onChange={(e) => setData({
                      ...data,
                      content: { ...data.content, contact_role: e.target.value }
                    })}
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black text-sm"
                    placeholder="Associate Dean (Student Activities & Scholarships)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={data.content.contact_email}
                      onChange={(e) => setData({
                        ...data,
                        content: { ...data.content, contact_email: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black text-sm"
                      placeholder="ad_sas@nith.ac.in"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={data.content.contact_phone}
                      onChange={(e) => setData({
                        ...data,
                        content: { ...data.content, contact_phone: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black text-sm"
                      placeholder="254436"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
