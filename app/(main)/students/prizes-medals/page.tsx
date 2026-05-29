'use client';

import React, { useState, useEffect } from 'react';
import { Save, Award, Plus, Trash2, FileText, Gift, Link2, HelpCircle } from 'lucide-react';

interface PrizeItem {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  award: string;
  icon: string;
}

interface PrizesData {
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  content: {
    overview_en: string;
    overview_hi: string;
    prizes_en: PrizeItem[];
    prizes_hi: PrizeItem[];
    links: { title: string; url: string; is_pdf: boolean }[];
    contact_name: string;
    contact_role: string;
    contact_email: string;
    contact_phone: string;
  };
}

type TabType = 'overview' | 'prizes' | 'links' | 'contacts';

export default function PrizesMedalsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PrizesData>({
    title_en: 'Prizes & Medals',
    title_hi: 'पुरस्कार और पदक',
    description_en: '',
    description_hi: '',
    content: {
      overview_en: '',
      overview_hi: '',
      prizes_en: [],
      prizes_hi: [],
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
      const res = await fetch('http://localhost:5000/api/v1/students?page_name=prizes-medals');
      const json = await res.json();
      if (json.success && json.data) {
        const item = json.data;
        const content = item.content || {};
        setData({
          title_en: item.title_en || 'Prizes & Medals',
          title_hi: item.title_hi || 'पुरस्कार और पदक',
          description_en: item.description_en || '',
          description_hi: item.description_hi || '',
          content: {
            overview_en: content.overview_en || '',
            overview_hi: content.overview_hi || '',
            prizes_en: content.prizes_en || [],
            prizes_hi: content.prizes_hi || [],
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
      console.error('Error fetching prizes data:', err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        page_name: 'prizes-medals',
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

  const updatePrize = (
    index: number,
    lang: 'en' | 'hi',
    field: keyof PrizeItem,
    value: string
  ) => {
    const listKey = `prizes_${lang}` as 'prizes_en' | 'prizes_hi';
    const updated = [...(data.content[listKey] || [])];
    if (!updated[index]) {
      updated[index] = { id: `p-${Date.now()}-${index}`, title: '', description: '', eligibility: '', award: '', icon: 'Award' };
    }
    updated[index] = { ...updated[index], [field]: value };
    setData({
      ...data,
      content: { ...data.content, [listKey]: updated }
    });
  };

  const addPrize = () => {
    const updatedEn = [...(data.content.prizes_en || [])];
    const updatedHi = [...(data.content.prizes_hi || [])];
    const newId = `p-${Date.now()}`;
    updatedEn.push({ id: newId, title: '', description: '', eligibility: '', award: '', icon: 'Award' });
    updatedHi.push({ id: newId, title: '', description: '', eligibility: '', award: '', icon: 'Award' });
    setData({
      ...data,
      content: {
        ...data.content,
        prizes_en: updatedEn,
        prizes_hi: updatedHi
      }
    });
  };

  const removePrize = (index: number) => {
    const updatedEn = (data.content.prizes_en || []).filter((_, i) => i !== index);
    const updatedHi = (data.content.prizes_hi || []).filter((_, i) => i !== index);
    setData({
      ...data,
      content: {
        ...data.content,
        prizes_en: updatedEn,
        prizes_hi: updatedHi
      }
    });
  };

  const updateLink = (index: number, field: 'title' | 'url' | 'is_pdf', value: any) => {
    const updated = [...(data.content.links || [])];
    if (!updated[index]) {
      updated[index] = { title: '', url: '', is_pdf: true };
    }
    updated[index] = { ...updated[index], [field]: value };
    setData({
      ...data,
      content: { ...data.content, links: updated }
    });
  };

  const addLink = () => {
    const updated = [...(data.content.links || [])];
    updated.push({ title: '', url: '', is_pdf: true });
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
    { id: 'prizes' as TabType, label: 'Prizes & Eligibility', icon: <Gift size={18} /> },
    { id: 'links' as TabType, label: 'Guidelines PDFs', icon: <Link2 size={18} /> },
    { id: 'contacts' as TabType, label: 'Ceremony Desk', icon: <HelpCircle size={18} /> },
  ];

  if (loading) {
    return <div className="p-8 text-black font-semibold text-center">Loading Prizes Editor...</div>;
  }

  const prizesCount = Math.max(
    data.content.prizes_en.length,
    data.content.prizes_hi.length
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
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Prizes & Medals Editor</h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">
                Manage bilingual campus recognitions, eligibility conditions, award details, and icons.
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
                      placeholder="Prizes & Medals"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">HERO SUBTITLE / DESCRIPTION</label>
                    <textarea
                      rows={2}
                      value={data.description_en}
                      onChange={(e) => setData({ ...data, description_en: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="A curated list of campus prizes..."
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
                      placeholder="पुरस्कार और पदक"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">मुख्य उपशीर्षक (हिंदी)</label>
                    <textarea
                      rows={2}
                      value={data.description_hi}
                      onChange={(e) => setData({ ...data, description_hi: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="शैक्षणिक, अनुसंधान और सेवा में उत्कृष्टता..."
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

          {/* Tab 2: Prizes Section */}
          {activeTab === 'prizes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h2 className="text-xl font-bold">Prizes & Eligibility</h2>
                <button
                  onClick={addPrize}
                  className="bg-[#631012] text-white hover:bg-[#800000] font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Plus size={16} /> Add Prize Card
                </button>
              </div>

              <div className="space-y-4">
                {Array.from({ length: prizesCount }).map((_, index) => {
                  const enItem = data.content.prizes_en[index] || { id: '', title: '', description: '', eligibility: '', award: '', icon: 'Award' };
                  const hiItem = data.content.prizes_hi[index] || { id: '', title: '', description: '', eligibility: '', award: '', icon: 'Award' };

                  return (
                    <div key={index} className="p-6 border rounded-xl bg-gray-50 relative group border-gray-200">
                      <button
                        onClick={() => removePrize(index)}
                        className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pr-10">
                        {/* Common configuration details (Icon, etc) */}
                        <div className="md:col-span-2 space-y-3">
                          <h4 className="text-xs font-bold text-gray-400 uppercase">Visual Settings</h4>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">ICON SHAPE</label>
                            <select
                              value={enItem.icon}
                              onChange={(e) => {
                                updatePrize(index, 'en', 'icon', e.target.value);
                                updatePrize(index, 'hi', 'icon', e.target.value);
                              }}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                            >
                              <option value="Award">Award / Ribbon</option>
                              <option value="Star">Star / Starburst</option>
                              <option value="GraduationCap">Graduation Cap</option>
                              <option value="Users">Users / Team</option>
                            </select>
                          </div>
                        </div>

                        {/* English Fields */}
                        <div className="md:col-span-5 space-y-3">
                          <h4 className="text-xs font-bold text-gray-400 uppercase">English Content</h4>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">PRIZE NAME</label>
                            <input
                              type="text"
                              value={enItem.title}
                              onChange={(e) => updatePrize(index, 'en', 'title', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="Best Academic Performance (B.Tech)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">DESCRIPTION</label>
                            <textarea
                              rows={2}
                              value={enItem.description}
                              onChange={(e) => updatePrize(index, 'en', 'description', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="Awarded to the top graduating student..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">ELIGIBILITY</label>
                            <input
                              type="text"
                              value={enItem.eligibility}
                              onChange={(e) => updatePrize(index, 'en', 'eligibility', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="Final year B.Tech students..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">AWARD RECOGNITION</label>
                            <input
                              type="text"
                              value={enItem.award}
                              onChange={(e) => updatePrize(index, 'en', 'award', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="Medal & Certificate"
                            />
                          </div>
                        </div>

                        {/* Hindi Fields */}
                        <div className="md:col-span-5 space-y-3 border-t md:border-t-0 md:border-l md:pl-6 pt-3 md:pt-0">
                          <h4 className="text-xs font-bold text-[#631012] uppercase">हिंदी विवरण</h4>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">पुरस्कार का नाम (हिंदी)</label>
                            <input
                              type="text"
                              value={hiItem.title}
                              onChange={(e) => updatePrize(index, 'hi', 'title', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="सर्वश्रेष्ठ शैक्षणिक प्रदर्शन (बी.टेक)"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">विवरण (हिंदी)</label>
                            <textarea
                              rows={2}
                              value={hiItem.description}
                              onChange={(e) => updatePrize(index, 'hi', 'description', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="उत्कृष्ट शैक्षणिक उपलब्धि के लिए..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">पात्रता (हिंदी)</label>
                            <input
                              type="text"
                              value={hiItem.eligibility}
                              onChange={(e) => updatePrize(index, 'hi', 'eligibility', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="अंतिम वर्ष के बी.टेक छात्र..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">पुरस्कार सम्मान (हिंदी)</label>
                            <input
                              type="text"
                              value={hiItem.award}
                              onChange={(e) => updatePrize(index, 'hi', 'award', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="पदक और प्रमाणपत्र"
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

          {/* Tab 3: Links Section */}
          {activeTab === 'links' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h2 className="text-xl font-bold">Guidelines & Nomination Documents</h2>
                <button
                  onClick={addLink}
                  className="bg-[#631012] text-white hover:bg-[#800000] font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Plus size={16} /> Add Document Link
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
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">DOCUMENT TITLE</label>
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) => updateLink(index, 'title', e.target.value)}
                          className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                          placeholder="Prizes & Medals Guidelines"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">URL LINK / PATH</label>
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                            className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                            placeholder="/pdfs/prizes-medals-guidelines.pdf"
                          />
                        </div>
                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 text-xs font-bold text-gray-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={link.is_pdf}
                              onChange={(e) => updateLink(index, 'is_pdf', e.target.checked)}
                              className="w-4 h-4 rounded text-[#631012] focus:ring-[#631012]"
                            />
                            Is PDF File?
                          </label>
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
              <h2 className="text-xl font-bold border-b pb-2">Nomination Desk Support</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Associate Dean Name</label>
                  <input
                    type="text"
                    value={data.content.contact_name}
                    onChange={(e) => setData({
                      ...data,
                      content: { ...data.content, contact_name: e.target.value }
                    })}
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black text-sm"
                    placeholder="Dr. Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Designation Role</label>
                  <input
                    type="text"
                    value={data.content.contact_role}
                    onChange={(e) => setData({
                      ...data,
                      content: { ...data.content, contact_role: e.target.value }
                    })}
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black text-sm"
                    placeholder="Associate Dean (Student Welfare)"
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
                      placeholder="studentwelfare@nith.ac.in"
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
                      placeholder="254000"
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
