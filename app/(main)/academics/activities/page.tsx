'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Activity,
  Plus,
  Trash2,
  FileText,
  ClipboardList,
  GitBranch,
  Megaphone,
  Globe
} from 'lucide-react';

interface ResponsibilityItem {
  title: string;
  description: string;
}

interface GovernanceStep {
  number: string;
  title: string;
  description: string;
}

interface CallToAction {
  buttonText: string;
}

interface ActivitiesData {
  heroHeading_en: string;
  heroHeading_hi: string;
  heroDescription_en: string;
  heroDescription_hi: string;
  content: {
    activitiesHeading_en: string;
    activitiesHeading_hi: string;
    activitiesDescription_en: string;
    activitiesDescription_hi: string;
    responsibilitiesHeading_en: string;
    responsibilitiesHeading_hi: string;
    responsibilitiesSubtitle_en: string;
    responsibilitiesSubtitle_hi: string;
    responsibilities_en: ResponsibilityItem[];
    responsibilities_hi: ResponsibilityItem[];
    governanceHeading_en: string;
    governanceHeading_hi: string;
    governanceSubheading_en: string;
    governanceSubheading_hi: string;
    governanceDescription_en: string;
    governanceDescription_hi: string;
    governanceSteps_en: GovernanceStep[];
    governanceSteps_hi: GovernanceStep[];
    ctaHeading_en: string;
    ctaHeading_hi: string;
    ctaDescription_en: string;
    ctaDescription_hi: string;
    ctaButtons_en: CallToAction[];
    ctaButtons_hi: CallToAction[];
  };
}

type TabType = 'hero' | 'responsibilities' | 'governance' | 'cta';

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [editLang, setEditLang] = useState<'en' | 'hi'>('en');
  const [loading, setLoading] = useState(true);

  const [activitiesData, setActivitiesData] = useState<ActivitiesData>({
    heroHeading_en: 'Activities',
    heroHeading_hi: 'गतिविधियां',
    heroDescription_en: 'Academic governance, planning, and execution under the Office of the Dean (Academic).',
    heroDescription_hi: 'शैक्षणिक प्रशासन, योजना और डीन (शैक्षणिक) के कार्यालय के तहत निष्पादन।',
    content: {
      activitiesHeading_en: 'ACTIVITIES',
      activitiesHeading_hi: 'गतिविधियां',
      activitiesDescription_en: 'As per Schedule C of the Institute Statutes, the Dean (Academic) advises the Director on key academic matters and governance.',
      activitiesDescription_hi: 'संस्थान संविधि की अनुसूची सी के अनुसार, डीन (शैक्षणिक) प्रमुख शैक्षणिक मामलों और शासन पर निदेशक को सलाह देते हैं।',
      responsibilitiesHeading_en: 'Responsibilities & Activities',
      responsibilitiesHeading_hi: 'कर्तव्य और जिम्मेदारियां',
      responsibilitiesSubtitle_en: 'Key responsibilities and activities of the academic office',
      responsibilitiesSubtitle_hi: 'शैक्षणिक कार्यालय की मुख्य जिम्मेदारियां और गतिविधियां',
      responsibilities_en: [
        { title: 'Admission and Enrollment', description: 'Admission and enrollment of students.' },
        { title: 'Academic Calendar & Timetables', description: 'Finalisation of academic calendar, time-tables, registration of students for course work and examinations.' }
      ],
      responsibilities_hi: [
        { title: 'प्रवेश और नामांकन', description: 'छात्रों का प्रवेश और नामांकन।' },
        { title: 'शैक्षणिक कैलेंडर और समय सारिणी', description: 'शैक्षणिक कैलेंडर, समय सारिणी को अंतिम रूप देना, पाठ्यक्रम और परीक्षाओं के लिए छात्रों का पंजीकरण।' }
      ],
      governanceHeading_en: 'Academic Governance Flow',
      governanceHeading_hi: 'अकादमिक शासन प्रवाह',
      governanceSubheading_en: 'Decision Flow Process',
      governanceSubheading_hi: 'निर्णय प्रवाह प्रक्रिया',
      governanceDescription_en: 'A concise representation of decision flow from academic committees to implementation.',
      governanceDescription_hi: 'शैक्षणिक समितियों से कार्यान्वयन तक निर्णय प्रवाह का एक संक्षिप्त प्रतिनिधित्व।',
      governanceSteps_en: [
        { number: '1', title: 'BOAC', description: 'Board of Academic Curriculum - Initial review and recommendation of academic proposals.' },
        { number: '2', title: 'Senate', description: 'Senate approval - Academic body reviews and approves recommendations.' }
      ],
      governanceSteps_hi: [
        { number: '1', title: 'बीओएसी', description: 'अकादमिक पाठ्यक्रम बोर्ड - शैक्षणिक प्रस्तावों की प्रारंभिक समीक्षा और सिफारिश।' },
        { number: '2', title: 'सीनेट', description: 'सीनेट की मंजूरी - शैक्षणिक निकाय समीक्षा करता है और सिफारिशों को मंजूरी देता है।' }
      ],
      ctaHeading_en: 'Connect with Academic Office',
      ctaHeading_hi: 'अकादमिक कार्यालय से संपर्क करें',
      ctaDescription_en: 'For queries related to academic matters, reach out to the Office of the Dean (Academic)',
      ctaDescription_hi: 'शैक्षणिक मामलों से संबंधित प्रश्नों के लिए, डीन (शैक्षणिक) के कार्यालय से संपर्क करें',
      ctaButtons_en: [
        { buttonText: 'View Academic Calendar' },
        { buttonText: 'Contact Academic Office' }
      ],
      ctaButtons_hi: [
        { buttonText: 'शैक्षणिक कैलेंडर देखें' },
        { buttonText: 'अकादमिक कार्यालय से संपर्क करें' }
      ]
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/academics/overview?page_name=activities');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        const item = json.data[0];
        // Ensure content structure matches expectations
        const content = item.content || {};
        setActivitiesData({
          heroHeading_en: item.title_en || '',
          heroHeading_hi: item.title_hi || '',
          heroDescription_en: item.description_en || '',
          heroDescription_hi: item.description_hi || '',
          content: {
            activitiesHeading_en: content.activitiesHeading_en || 'ACTIVITIES',
            activitiesHeading_hi: content.activitiesHeading_hi || 'गतिविधियां',
            activitiesDescription_en: content.activitiesDescription_en || '',
            activitiesDescription_hi: content.activitiesDescription_hi || '',
            responsibilitiesHeading_en: content.responsibilitiesHeading_en || 'Responsibilities & Activities',
            responsibilitiesHeading_hi: content.responsibilitiesHeading_hi || 'कर्तव्य और जिम्मेदारियां',
            responsibilitiesSubtitle_en: content.responsibilitiesSubtitle_en || '',
            responsibilitiesSubtitle_hi: content.responsibilitiesSubtitle_hi || '',
            responsibilities_en: content.responsibilities_en || [],
            responsibilities_hi: content.responsibilities_hi || [],
            governanceHeading_en: content.governanceHeading_en || 'Academic Governance Flow',
            governanceHeading_hi: content.governanceHeading_hi || 'अकादमिक शासन प्रवाह',
            governanceSubheading_en: content.governanceSubheading_en || 'Decision Flow Process',
            governanceSubheading_hi: content.governanceSubheading_hi || 'निर्णय प्रवाह प्रक्रिया',
            governanceDescription_en: content.governanceDescription_en || '',
            governanceDescription_hi: content.governanceDescription_hi || '',
            governanceSteps_en: content.governanceSteps_en || [],
            governanceSteps_hi: content.governanceSteps_hi || [],
            ctaHeading_en: content.ctaHeading_en || 'Connect with Academic Office',
            ctaHeading_hi: content.ctaHeading_hi || 'अकादमिक कार्यालय से संपर्क करें',
            ctaDescription_en: content.ctaDescription_en || '',
            ctaDescription_hi: content.ctaDescription_hi || '',
            ctaButtons_en: content.ctaButtons_en || [],
            ctaButtons_hi: content.ctaButtons_hi || []
          }
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        page_name: 'activities',
        title_en: activitiesData.heroHeading_en,
        title_hi: activitiesData.heroHeading_hi,
        description_en: activitiesData.heroDescription_en,
        description_hi: activitiesData.heroDescription_hi,
        content: activitiesData.content
      };
      const res = await fetch('http://localhost:5000/api/v1/academics/overview', {
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

  const updateResponsibility = (
    index: number,
    field: 'title' | 'description',
    value: string
  ) => {
    const listKey = `responsibilities_${editLang}` as 'responsibilities_en' | 'responsibilities_hi';
    const updated = [...(activitiesData.content[listKey] || [])];
    updated[index] = { ...updated[index], [field]: value };
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [listKey]: updated }
    });
  };

  const addResponsibility = () => {
    const listKey = `responsibilities_${editLang}` as 'responsibilities_en' | 'responsibilities_hi';
    const updated = [...(activitiesData.content[listKey] || [])];
    updated.push({ title: '', description: '' });
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [listKey]: updated }
    });
  };

  const removeResponsibility = (index: number) => {
    const listKey = `responsibilities_${editLang}` as 'responsibilities_en' | 'responsibilities_hi';
    const updated = (activitiesData.content[listKey] || []).filter((_: any, i: number) => i !== index);
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [listKey]: updated }
    });
  };

  const updateGovernanceStep = (
    index: number,
    field: 'number' | 'title' | 'description',
    value: string
  ) => {
    const listKey = `governanceSteps_${editLang}` as 'governanceSteps_en' | 'governanceSteps_hi';
    const updated = [...(activitiesData.content[listKey] || [])];
    updated[index] = { ...updated[index], [field]: value };
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [listKey]: updated }
    });
  };

  const addGovernanceStep = () => {
    const listKey = `governanceSteps_${editLang}` as 'governanceSteps_en' | 'governanceSteps_hi';
    const updated = [...(activitiesData.content[listKey] || [])];
    updated.push({
      number: String(updated.length + 1),
      title: '',
      description: '',
    });
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [listKey]: updated }
    });
  };

  const removeGovernanceStep = (index: number) => {
    const listKey = `governanceSteps_${editLang}` as 'governanceSteps_en' | 'governanceSteps_hi';
    const updated = (activitiesData.content[listKey] || []).filter((_: any, i: number) => i !== index);
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [listKey]: updated }
    });
  };

  const updateCtaButton = (index: number, value: string) => {
    const listKey = `ctaButtons_${editLang}` as 'ctaButtons_en' | 'ctaButtons_hi';
    const updated = [...(activitiesData.content[listKey] || [])];
    updated[index] = { buttonText: value };
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [listKey]: updated }
    });
  };

  const addCtaButton = () => {
    const listKey = `ctaButtons_${editLang}` as 'ctaButtons_en' | 'ctaButtons_hi';
    const updated = [...(activitiesData.content[listKey] || [])];
    updated.push({ buttonText: '' });
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [listKey]: updated }
    });
  };

  const removeCtaButton = (index: number) => {
    const listKey = `ctaButtons_${editLang}` as 'ctaButtons_en' | 'ctaButtons_hi';
    const updated = (activitiesData.content[listKey] || []).filter((_: any, i: number) => i !== index);
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [listKey]: updated }
    });
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero & Overview', icon: <FileText size={18} /> },
    { id: 'responsibilities' as TabType, label: 'Responsibilities', icon: <ClipboardList size={18} /> },
    { id: 'governance' as TabType, label: 'Governance Flow', icon: <GitBranch size={18} /> },
    { id: 'cta' as TabType, label: 'Call to Action', icon: <Megaphone size={18} /> },
  ];

  if (loading) {
    return <div className="p-8 text-black font-semibold text-center">Loading Activities Editor...</div>;
  }

  // Language specific properties for active editor state
  const heroHeading = editLang === 'en' ? activitiesData.heroHeading_en : activitiesData.heroHeading_hi;
  const heroDescription = editLang === 'en' ? activitiesData.heroDescription_en : activitiesData.heroDescription_hi;

  const activitiesHeading = editLang === 'en' ? activitiesData.content.activitiesHeading_en : activitiesData.content.activitiesHeading_hi;
  const activitiesDescription = editLang === 'en' ? activitiesData.content.activitiesDescription_en : activitiesData.content.activitiesDescription_hi;

  const responsibilitiesHeading = editLang === 'en' ? activitiesData.content.responsibilitiesHeading_en : activitiesData.content.responsibilitiesHeading_hi;
  const responsibilitiesSubtitle = editLang === 'en' ? activitiesData.content.responsibilitiesSubtitle_en : activitiesData.content.responsibilitiesSubtitle_hi;
  const responsibilitiesList = editLang === 'en' ? activitiesData.content.responsibilities_en : activitiesData.content.responsibilities_hi;

  const governanceHeading = editLang === 'en' ? activitiesData.content.governanceHeading_en : activitiesData.content.governanceHeading_hi;
  const governanceSubheading = editLang === 'en' ? activitiesData.content.governanceSubheading_en : activitiesData.content.governanceSubheading_hi;
  const governanceDescription = editLang === 'en' ? activitiesData.content.governanceDescription_en : activitiesData.content.governanceDescription_hi;
  const governanceStepsList = editLang === 'en' ? activitiesData.content.governanceSteps_en : activitiesData.content.governanceSteps_hi;

  const ctaHeading = editLang === 'en' ? activitiesData.content.ctaHeading_en : activitiesData.content.ctaHeading_hi;
  const ctaDescription = editLang === 'en' ? activitiesData.content.ctaDescription_en : activitiesData.content.ctaDescription_hi;
  const ctaButtonsList = editLang === 'en' ? activitiesData.content.ctaButtons_en : activitiesData.content.ctaButtons_hi;

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6 text-black bg-[#F8F9FA] min-h-screen">
      {/* Top Banner and Save Controls */}
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-full flex-shrink-0">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Activities Editor</h1>
              <p className="text-white/80 text-sm sm:text-base mt-1">
                Edit bilingual academic activities and governance decision processes
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

      {/* Language Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-500">
          <Globe size={20} className="text-[#631012]" />
          <span className="font-semibold text-sm sm:text-base">Editing Language Context:</span>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setEditLang('en')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              editLang === 'en' ? 'bg-[#631012] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            English (EN)
          </button>
          <button
            onClick={() => setEditLang('hi')}
            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
              editLang === 'hi' ? 'bg-[#631012] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hindi (HI)
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
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-3 mb-4">
                <FileText className="text-[#631012]" />
                <h2 className="text-xl font-bold">Hero & Academic Overview</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Hero Page Title ({editLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={heroHeading}
                    onChange={(e) =>
                      setActivitiesData({
                        ...activitiesData,
                        [editLang === 'en' ? 'heroHeading_en' : 'heroHeading_hi']: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]"
                    placeholder="Activities"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Hero Description ({editLang.toUpperCase()})</label>
                  <textarea
                    rows={3}
                    value={heroDescription}
                    onChange={(e) =>
                      setActivitiesData({
                        ...activitiesData,
                        [editLang === 'en' ? 'heroDescription_en' : 'heroDescription_hi']: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]"
                    placeholder="Enter hero banner description..."
                  />
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-bold mb-4">Academic Statues / Overview</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Section Heading ({editLang.toUpperCase()})</label>
                      <input
                        type="text"
                        value={activitiesHeading || ''}
                        onChange={(e) =>
                          setActivitiesData({
                            ...activitiesData,
                            content: {
                              ...activitiesData.content,
                              [`activitiesHeading_${editLang}`]: e.target.value,
                            },
                          })
                        }
                        className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012]"
                        placeholder="ACTIVITIES"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Section Description ({editLang.toUpperCase()})</label>
                      <textarea
                        rows={3}
                        value={activitiesDescription || ''}
                        onChange={(e) =>
                          setActivitiesData({
                            ...activitiesData,
                            content: {
                              ...activitiesData.content,
                              [`activitiesDescription_${editLang}`]: e.target.value,
                            },
                          })
                        }
                        className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012]"
                        placeholder="Statutes description..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsive Live Preview */}
              <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-sm font-bold text-gray-400 uppercase mb-4">Responsive Banner Live Preview ({editLang.toUpperCase()} Mode):</p>
                <div className="bg-[#800000] text-white p-8 rounded-xl space-y-4 text-center">
                  <h3 className="text-3xl font-black tracking-tight uppercase">{heroHeading}</h3>
                  <p className="text-white/80 max-w-2xl mx-auto text-base leading-relaxed font-light">{heroDescription}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Responsibilities Section */}
          {activeTab === 'responsibilities' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-3 mb-4">
                <ClipboardList className="text-[#631012]" />
                <h2 className="text-xl font-bold">Responsibilities & Action Items</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Section Title ({editLang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={responsibilitiesHeading || ''}
                      onChange={(e) =>
                        setActivitiesData({
                          ...activitiesData,
                          content: {
                            ...activitiesData.content,
                            [`responsibilitiesHeading_${editLang}`]: e.target.value,
                          },
                        })
                      }
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Section Subtitle ({editLang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={responsibilitiesSubtitle || ''}
                      onChange={(e) =>
                        setActivitiesData({
                          ...activitiesData,
                          content: {
                            ...activitiesData.content,
                            [`responsibilitiesSubtitle_${editLang}`]: e.target.value,
                          },
                        })
                      }
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-400 uppercase">Responsibility Items List</label>
                  <div className="grid grid-cols-1 gap-4">
                    {responsibilitiesList.map((item, index) => (
                      <div key={index} className="p-4 border rounded-xl bg-gray-50 relative group">
                        <button
                          onClick={() => removeResponsibility(index)}
                          className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="space-y-3 pr-10">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Title</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateResponsibility(index, 'title', e.target.value)}
                              className="w-full p-2 border rounded-lg bg-white"
                              placeholder="e.g. Course Allocation"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Description</label>
                            <textarea
                              rows={2}
                              value={item.description}
                              onChange={(e) => updateResponsibility(index, 'description', e.target.value)}
                              className="w-full p-2 border rounded-lg bg-white"
                              placeholder="e.g. Allocation of teaching roles..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addResponsibility}
                      className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold hover:border-[#631012] hover:text-[#631012] transition-all bg-white flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Add Responsibility Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Governance Flow Section */}
          {activeTab === 'governance' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-3 mb-4">
                <GitBranch className="text-[#631012]" />
                <h2 className="text-xl font-bold">Academic Governance Flow Process</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Governance Main Heading ({editLang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={governanceHeading || ''}
                      onChange={(e) =>
                        setActivitiesData({
                          ...activitiesData,
                          content: {
                            ...activitiesData.content,
                            [`governanceHeading_${editLang}`]: e.target.value,
                          },
                        })
                      }
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Governance Subtitle ({editLang.toUpperCase()})</label>
                    <input
                      type="text"
                      value={governanceSubheading || ''}
                      onChange={(e) =>
                        setActivitiesData({
                          ...activitiesData,
                          content: {
                            ...activitiesData.content,
                            [`governanceSubheading_${editLang}`]: e.target.value,
                          },
                        })
                      }
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">Governance Description ({editLang.toUpperCase()})</label>
                  <textarea
                    rows={2}
                    value={governanceDescription || ''}
                    onChange={(e) =>
                      setActivitiesData({
                        ...activitiesData,
                        content: {
                          ...activitiesData.content,
                          [`governanceDescription_${editLang}`]: e.target.value,
                        },
                      })
                    }
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-400 uppercase">Governance Decision Steps</label>
                  <div className="space-y-3">
                    {governanceStepsList.map((step, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 border rounded-xl bg-gray-50 relative">
                        <div className="md:col-span-1">
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Step #</label>
                          <input
                            type="text"
                            value={step.number}
                            onChange={(e) => updateGovernanceStep(index, 'number', e.target.value)}
                            className="w-full p-2 border rounded-lg bg-white text-center"
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Title</label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => updateGovernanceStep(index, 'title', e.target.value)}
                            className="w-full p-2 border rounded-lg bg-white"
                          />
                        </div>
                        <div className="md:col-span-7">
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Description</label>
                          <input
                            type="text"
                            value={step.description}
                            onChange={(e) => updateGovernanceStep(index, 'description', e.target.value)}
                            className="w-full p-2 border rounded-lg bg-white"
                          />
                        </div>
                        <div className="md:col-span-1 flex items-end justify-center">
                          <button
                            onClick={() => removeGovernanceStep(index)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addGovernanceStep}
                      className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold hover:border-[#631012] hover:text-[#631012] transition-all bg-white flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Add Decision Step
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Call to Action Section */}
          {activeTab === 'cta' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-3 mb-4">
                <Megaphone className="text-[#631012]" />
                <h2 className="text-xl font-bold">Call to Action & Contacts</h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">CTA Main Heading ({editLang.toUpperCase()})</label>
                  <input
                    type="text"
                    value={ctaHeading || ''}
                    onChange={(e) =>
                      setActivitiesData({
                        ...activitiesData,
                        content: {
                          ...activitiesData.content,
                          [`ctaHeading_${editLang}`]: e.target.value,
                        },
                      })
                    }
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2 uppercase">CTA Description ({editLang.toUpperCase()})</label>
                  <textarea
                    rows={3}
                    value={ctaDescription || ''}
                    onChange={(e) =>
                      setActivitiesData({
                        ...activitiesData,
                        content: {
                          ...activitiesData.content,
                          [`ctaDescription_${editLang}`]: e.target.value,
                        },
                      })
                    }
                    className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012]"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-400 uppercase">Interactive Action Buttons ({editLang.toUpperCase()})</label>
                  <div className="space-y-3">
                    {ctaButtonsList.map((button, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={button.buttonText}
                          onChange={(e) => updateCtaButton(index, e.target.value)}
                          className="flex-1 p-3 border rounded-xl bg-gray-50"
                          placeholder="Button Action Text"
                        />
                        <button
                          onClick={() => removeCtaButton(index)}
                          className="text-red-500 hover:bg-red-50 p-3 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addCtaButton}
                      className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold hover:border-[#631012] hover:text-[#631012] transition-all bg-white flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Add Action Button
                    </button>
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
