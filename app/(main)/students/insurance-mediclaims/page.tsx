'use client';

import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck, Plus, Trash2, FileText, Activity, Link2, CheckCircle } from 'lucide-react';

interface ParticularItem {
  sl_no: string;
  particulars: string;
  coverage: string;
}

interface InsuranceData {
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
  content: {
    particulars_en: ParticularItem[];
    particulars_hi: ParticularItem[];
    policy_doc_url: string;
    steps_en: string[];
    steps_hi: string[];
    contact_name: string;
    contact_email: string;
    contact_phone: string;
  };
}

type TabType = 'overview' | 'particulars' | 'steps' | 'contacts';

export default function InsuranceMediclaimsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InsuranceData>({
    title_en: 'Insurance & Mediclaims',
    title_hi: 'बीमा और मेडिक्लेम',
    description_en: '',
    description_hi: '',
    content: {
      particulars_en: [],
      particulars_hi: [],
      policy_doc_url: '/pdfs/insurance-policy.pdf',
      steps_en: [],
      steps_hi: [],
      contact_name: 'Student Welfare Office',
      contact_email: 'studentwelfare@nith.ac.in',
      contact_phone: '254000'
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/students?page_name=insurance');
      const json = await res.json();
      if (json.success && json.data) {
        const item = json.data;
        const content = item.content || {};
        setData({
          title_en: item.title_en || 'Insurance & Mediclaims',
          title_hi: item.title_hi || 'बीमा और मेडिक्लेम',
          description_en: item.description_en || '',
          description_hi: item.description_hi || '',
          content: {
            particulars_en: content.particulars_en || [],
            particulars_hi: content.particulars_hi || [],
            policy_doc_url: content.policy_doc_url || '/pdfs/insurance-policy.pdf',
            steps_en: content.steps_en || [],
            steps_hi: content.steps_hi || [],
            contact_name: content.contact_name || 'Student Welfare Office',
            contact_email: content.contact_email || 'studentwelfare@nith.ac.in',
            contact_phone: content.contact_phone || '254000'
          }
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching insurance data:', err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        page_name: 'insurance',
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

  const updateParticular = (
    index: number,
    lang: 'en' | 'hi',
    field: 'particulars' | 'coverage',
    value: string
  ) => {
    const listKey = `particulars_${lang}` as 'particulars_en' | 'particulars_hi';
    const updated = [...(data.content[listKey] || [])];
    if (!updated[index]) {
      updated[index] = { sl_no: String(index + 1), particulars: '', coverage: '' };
    }
    updated[index] = { ...updated[index], [field]: value };
    setData({
      ...data,
      content: { ...data.content, [listKey]: updated }
    });
  };

  const addParticular = () => {
    const updatedEn = [...(data.content.particulars_en || [])];
    const updatedHi = [...(data.content.particulars_hi || [])];
    const nextSl = String(Math.max(updatedEn.length, updatedHi.length) + 1);
    updatedEn.push({ sl_no: nextSl, particulars: '', coverage: '' });
    updatedHi.push({ sl_no: nextSl, particulars: '', coverage: '' });
    setData({
      ...data,
      content: {
        ...data.content,
        particulars_en: updatedEn,
        particulars_hi: updatedHi
      }
    });
  };

  const removeParticular = (index: number) => {
    const updatedEn = (data.content.particulars_en || []).filter((_, i) => i !== index).map((item, i) => ({ ...item, sl_no: String(i + 1) }));
    const updatedHi = (data.content.particulars_hi || []).filter((_, i) => i !== index).map((item, i) => ({ ...item, sl_no: String(i + 1) }));
    setData({
      ...data,
      content: {
        ...data.content,
        particulars_en: updatedEn,
        particulars_hi: updatedHi
      }
    });
  };

  const updateStep = (index: number, lang: 'en' | 'hi', value: string) => {
    const listKey = `steps_${lang}` as 'steps_en' | 'steps_hi';
    const updated = [...(data.content[listKey] || [])];
    updated[index] = value;
    setData({
      ...data,
      content: { ...data.content, [listKey]: updated }
    });
  };

  const addStep = () => {
    const updatedEn = [...(data.content.steps_en || [])];
    const updatedHi = [...(data.content.steps_hi || [])];
    updatedEn.push('');
    updatedHi.push('');
    setData({
      ...data,
      content: {
        ...data.content,
        steps_en: updatedEn,
        steps_hi: updatedHi
      }
    });
  };

  const removeStep = (index: number) => {
    const updatedEn = (data.content.steps_en || []).filter((_, i) => i !== index);
    const updatedHi = (data.content.steps_hi || []).filter((_, i) => i !== index);
    setData({
      ...data,
      content: {
        ...data.content,
        steps_en: updatedEn,
        steps_hi: updatedHi
      }
    });
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Hero & Policy', icon: <FileText size={18} /> },
    { id: 'particulars' as TabType, label: 'Coverages Details', icon: <Activity size={18} /> },
    { id: 'steps' as TabType, label: 'How to Claim', icon: <CheckCircle size={18} /> },
    { id: 'contacts' as TabType, label: 'Welfare Office', icon: <Link2 size={18} /> },
  ];

  if (loading) {
    return <div className="p-8 text-black font-semibold text-center">Loading Insurance Editor...</div>;
  }

  const particularsCount = Math.max(
    data.content.particulars_en.length,
    data.content.particulars_hi.length
  );

  const stepsCount = Math.max(
    data.content.steps_en.length,
    data.content.steps_hi.length
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-full flex-shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Insurance & Mediclaims</h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">
                Manage bilingual policy coverages, accidental hospitalization metrics, claim filing procedures, and support desks.
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
                      placeholder="Insurance & Mediclaims"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">HERO SUBTITLE / DESCRIPTION</label>
                    <textarea
                      rows={3}
                      value={data.description_en}
                      onChange={(e) => setData({ ...data, description_en: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="The Institute provides insurance cover..."
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
                      placeholder="बीमा और मेडिक्लेम"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">मुख्य उपशीर्षक (हिंदी)</label>
                    <textarea
                      rows={3}
                      value={data.description_hi}
                      onChange={(e) => setData({ ...data, description_hi: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="संस्थान हर साल अपने सभी छात्रों..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Particulars Section */}
          {activeTab === 'particulars' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h2 className="text-xl font-bold">Coverage Metrics & Benefits</h2>
                <button
                  onClick={addParticular}
                  className="bg-[#631012] text-white hover:bg-[#800000] font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Plus size={16} /> Add Particular Row
                </button>
              </div>

              <div className="space-y-4">
                {Array.from({ length: particularsCount }).map((_, index) => {
                  const enItem = data.content.particulars_en[index] || { sl_no: String(index + 1), particulars: '', coverage: '' };
                  const hiItem = data.content.particulars_hi[index] || { sl_no: String(index + 1), particulars: '', coverage: '' };

                  return (
                    <div key={index} className="p-6 border rounded-xl bg-gray-50 relative group border-gray-200">
                      <button
                        onClick={() => removeParticular(index)}
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
                            <label className="block text-xs text-gray-500 mb-1">PARTICULARS DESCRIPTION</label>
                            <textarea
                              rows={2}
                              value={enItem.particulars}
                              onChange={(e) => updateParticular(index, 'en', 'particulars', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="Personal accident cover per student..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">COVERAGE AMOUNT</label>
                            <input
                              type="text"
                              value={enItem.coverage}
                              onChange={(e) => updateParticular(index, 'en', 'coverage', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="Rs. 2,00,000/-"
                            />
                          </div>
                        </div>

                        {/* Hindi Inputs */}
                        <div className="md:col-span-5 space-y-3 border-t md:border-t-0 md:border-l md:pl-6 pt-3 md:pt-0">
                          <h4 className="text-xs font-bold text-[#631012] uppercase">हिंदी क्षेत्र</h4>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">विवरण (हिंदी)</label>
                            <textarea
                              rows={2}
                              value={hiItem.particulars}
                              onChange={(e) => updateParticular(index, 'hi', 'particulars', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="प्रति छात्र व्यक्तिगत दुर्घटना कवर..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">कवरेज राशि (हिंदी)</label>
                            <input
                              type="text"
                              value={hiItem.coverage}
                              onChange={(e) => updateParticular(index, 'hi', 'coverage', e.target.value)}
                              className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                              placeholder="रु. 2,00,000/-"
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

          {/* Tab 3: Claim Steps Section */}
          {activeTab === 'steps' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <h2 className="text-xl font-bold">Claim Filing Steps</h2>
                <button
                  onClick={addStep}
                  className="bg-[#631012] text-white hover:bg-[#800000] font-bold px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Plus size={16} /> Add Claim Step
                </button>
              </div>

              <div className="space-y-4">
                {Array.from({ length: stepsCount }).map((_, index) => {
                  const enStep = data.content.steps_en[index] || '';
                  const hiStep = data.content.steps_hi[index] || '';

                  return (
                    <div key={index} className="p-6 border rounded-xl bg-gray-50 relative group border-gray-200">
                      <button
                        onClick={() => removeStep(index)}
                        className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-10">
                        {/* English Field */}
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Step {index + 1} (English)</label>
                          <textarea
                            rows={2}
                            value={enStep}
                            onChange={(e) => updateStep(index, 'en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                            placeholder="Inform the Institute Office immediately..."
                          />
                        </div>

                        {/* Hindi Field */}
                        <div className="border-t md:border-t-0 md:border-l md:pl-6 pt-3 md:pt-0">
                          <label className="block text-xs font-bold text-[#631012] mb-1 uppercase">कदम {index + 1} (हिंदी)</label>
                          <textarea
                            rows={2}
                            value={hiStep}
                            onChange={(e) => updateStep(index, 'hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                            placeholder="संस्थान कार्यालय को तुरंत सूचित करें..."
                          />
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
              <h2 className="text-xl font-bold border-b pb-2">Welfare Office & Policy Downloads</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Policy PDF Document URL</label>
                  <input
                    type="text"
                    value={data.content.policy_doc_url}
                    onChange={(e) => setData({
                      ...data,
                      content: { ...data.content, policy_doc_url: e.target.value }
                    })}
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black text-sm"
                    placeholder="/pdfs/insurance-policy.pdf"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Office Name</label>
                  <input
                    type="text"
                    value={data.content.contact_name}
                    onChange={(e) => setData({
                      ...data,
                      content: { ...data.content, contact_name: e.target.value }
                    })}
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black text-sm"
                    placeholder="Student Welfare Office"
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
