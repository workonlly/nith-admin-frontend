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
  Megaphone
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
    lang: 'en' | 'hi',
    field: 'title' | 'description',
    value: string
  ) => {
    const listKey = `responsibilities_${lang}` as 'responsibilities_en' | 'responsibilities_hi';
    const updated = [...(activitiesData.content[listKey] || [])];
    if (!updated[index]) {
      updated[index] = { title: '', description: '' };
    }
    updated[index] = { ...updated[index], [field]: value };
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [listKey]: updated }
    });
  };

  const addResponsibility = () => {
    const updatedEn = [...(activitiesData.content.responsibilities_en || [])];
    const updatedHi = [...(activitiesData.content.responsibilities_hi || [])];
    updatedEn.push({ title: '', description: '' });
    updatedHi.push({ title: '', description: '' });
    setActivitiesData({
      ...activitiesData,
      content: {
        ...activitiesData.content,
        responsibilities_en: updatedEn,
        responsibilities_hi: updatedHi
      }
    });
  };

  const removeResponsibility = (index: number) => {
    const updatedEn = (activitiesData.content.responsibilities_en || []).filter((_: any, i: number) => i !== index);
    const updatedHi = (activitiesData.content.responsibilities_hi || []).filter((_: any, i: number) => i !== index);
    setActivitiesData({
      ...activitiesData,
      content: {
        ...activitiesData.content,
        responsibilities_en: updatedEn,
        responsibilities_hi: updatedHi
      }
    });
  };

  const updateGovernanceStep = (
    index: number,
    lang: 'en' | 'hi',
    field: 'number' | 'title' | 'description',
    value: string
  ) => {
    const listKey = `governanceSteps_${lang}` as 'governanceSteps_en' | 'governanceSteps_hi';
    const updated = [...(activitiesData.content[listKey] || [])];
    if (!updated[index]) {
      updated[index] = { number: String(index + 1), title: '', description: '' };
    }
    updated[index] = { ...updated[index], [field]: value };
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [listKey]: updated }
    });
  };

  const addGovernanceStep = () => {
    const updatedEn = [...(activitiesData.content.governanceSteps_en || [])];
    const updatedHi = [...(activitiesData.content.governanceSteps_hi || [])];
    const nextNum = String(Math.max(updatedEn.length, updatedHi.length) + 1);
    updatedEn.push({ number: nextNum, title: '', description: '' });
    updatedHi.push({ number: nextNum, title: '', description: '' });
    setActivitiesData({
      ...activitiesData,
      content: {
        ...activitiesData.content,
        governanceSteps_en: updatedEn,
        governanceSteps_hi: updatedHi
      }
    });
  };

  const removeGovernanceStep = (index: number) => {
    const updatedEn = (activitiesData.content.governanceSteps_en || []).filter((_: any, i: number) => i !== index);
    const updatedHi = (activitiesData.content.governanceSteps_hi || []).filter((_: any, i: number) => i !== index);
    const mappedEn = updatedEn.map((item, i) => ({ ...item, number: String(i + 1) }));
    const mappedHi = updatedHi.map((item, i) => ({ ...item, number: String(i + 1) }));
    setActivitiesData({
      ...activitiesData,
      content: {
        ...activitiesData.content,
        governanceSteps_en: mappedEn,
        governanceSteps_hi: mappedHi
      }
    });
  };

  const updateCtaButton = (index: number, lang: 'en' | 'hi', value: string) => {
    const listKey = `ctaButtons_${lang}` as 'ctaButtons_en' | 'ctaButtons_hi';
    const updated = [...(activitiesData.content[listKey] || [])];
    if (!updated[index]) {
      updated[index] = { buttonText: '' };
    }
    updated[index] = { buttonText: value };
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [listKey]: updated }
    });
  };

  const addCtaButton = () => {
    const updatedEn = [...(activitiesData.content.ctaButtons_en || [])];
    const updatedHi = [...(activitiesData.content.ctaButtons_hi || [])];
    updatedEn.push({ buttonText: '' });
    updatedHi.push({ buttonText: '' });
    setActivitiesData({
      ...activitiesData,
      content: {
        ...activitiesData.content,
        ctaButtons_en: updatedEn,
        ctaButtons_hi: updatedHi
      }
    });
  };

  const removeCtaButton = (index: number) => {
    const updatedEn = (activitiesData.content.ctaButtons_en || []).filter((_: any, i: number) => i !== index);
    const updatedHi = (activitiesData.content.ctaButtons_hi || []).filter((_: any, i: number) => i !== index);
    setActivitiesData({
      ...activitiesData,
      content: {
        ...activitiesData.content,
        ctaButtons_en: updatedEn,
        ctaButtons_hi: updatedHi
      }
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

  const responsibilitiesCount = Math.max(
    activitiesData.content.responsibilities_en.length,
    activitiesData.content.responsibilities_hi.length
  );

  const governanceStepsCount = Math.max(
    activitiesData.content.governanceSteps_en.length,
    activitiesData.content.governanceSteps_hi.length
  );

  const ctaButtonsCount = Math.max(
    activitiesData.content.ctaButtons_en.length,
    activitiesData.content.ctaButtons_hi.length
  );

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
            <div className="space-y-8">
              <div className="flex items-center gap-2 border-b pb-3 mb-4">
                <FileText className="text-[#631012]" />
                <h2 className="text-xl font-bold">Hero & Academic Overview</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hero Title */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase">English</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">HERO PAGE TITLE</label>
                    <input
                      type="text"
                      value={activitiesData.heroHeading_en}
                      onChange={(e) => setActivitiesData({ ...activitiesData, heroHeading_en: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="Activities"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">HERO DESCRIPTION</label>
                    <textarea
                      rows={3}
                      value={activitiesData.heroDescription_en}
                      onChange={(e) => setActivitiesData({ ...activitiesData, heroDescription_en: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="Enter hero banner description..."
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
                      value={activitiesData.heroHeading_hi}
                      onChange={(e) => setActivitiesData({ ...activitiesData, heroHeading_hi: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="गतिविधियां"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">मुख्य विवरण (हिंदी)</label>
                    <textarea
                      rows={3}
                      value={activitiesData.heroDescription_hi}
                      onChange={(e) => setActivitiesData({ ...activitiesData, heroDescription_hi: e.target.value })}
                      className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#631012] text-black"
                      placeholder="बैनर का हिंदी विवरण..."
                    />
                  </div>
                </div>
              </div>

              {/* Statutes Section */}
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-6">
                <h3 className="text-lg font-bold border-b pb-2">Academic Statutes / Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase">English</h4>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">SECTION HEADING</label>
                      <input
                        type="text"
                        value={activitiesData.content.activitiesHeading_en}
                        onChange={(e) => setActivitiesData({
                          ...activitiesData,
                          content: { ...activitiesData.content, activitiesHeading_en: e.target.value }
                        })}
                        className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                        placeholder="ACTIVITIES"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">SECTION DESCRIPTION</label>
                      <textarea
                        rows={3}
                        value={activitiesData.content.activitiesDescription_en}
                        onChange={(e) => setActivitiesData({
                          ...activitiesData,
                          content: { ...activitiesData.content, activitiesDescription_en: e.target.value }
                        })}
                        className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                        placeholder="Statutes description..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4 border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
                    <h4 className="text-xs font-bold text-[#631012] uppercase">Hindi</h4>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">विभाग शीर्षक (हिंदी)</label>
                      <input
                        type="text"
                        value={activitiesData.content.activitiesHeading_hi}
                        onChange={(e) => setActivitiesData({
                          ...activitiesData,
                          content: { ...activitiesData.content, activitiesHeading_hi: e.target.value }
                        })}
                        className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                        placeholder="गतिविधियां"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">विभाग विवरण (हिंदी)</label>
                      <textarea
                        rows={3}
                        value={activitiesData.content.activitiesDescription_hi}
                        onChange={(e) => setActivitiesData({
                          ...activitiesData,
                          content: { ...activitiesData.content, activitiesDescription_hi: e.target.value }
                        })}
                        className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                        placeholder="संवैधानिक विवरण..."
                      />
                    </div>
                  </div>
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

              {/* Responsibilities Headers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase">English Header</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">SECTION TITLE</label>
                    <input
                      type="text"
                      value={activitiesData.content.responsibilitiesHeading_en}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, responsibilitiesHeading_en: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">SECTION SUBTITLE</label>
                    <input
                      type="text"
                      value={activitiesData.content.responsibilitiesSubtitle_en}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, responsibilitiesSubtitle_en: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
                  <h3 className="text-xs font-bold text-[#631012] uppercase">Hindi Header</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">शीर्षक (हिंदी)</label>
                    <input
                      type="text"
                      value={activitiesData.content.responsibilitiesHeading_hi}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, responsibilitiesHeading_hi: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">उपशीर्षक (हिंदी)</label>
                    <input
                      type="text"
                      value={activitiesData.content.responsibilitiesSubtitle_hi}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, responsibilitiesSubtitle_hi: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Responsibilities Items list */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-400 uppercase">Responsibility Items List</label>
                <div className="grid grid-cols-1 gap-4">
                  {Array.from({ length: responsibilitiesCount }).map((_, index) => {
                    const enItem = activitiesData.content.responsibilities_en[index] || { title: '', description: '' };
                    const hiItem = activitiesData.content.responsibilities_hi[index] || { title: '', description: '' };

                    return (
                      <div key={index} className="p-6 border rounded-xl bg-gray-50 relative group border-gray-200">
                        <button
                          onClick={() => removeResponsibility(index)}
                          className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-10">
                          {/* English Inputs */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-400 uppercase">Item {index + 1} (English)</h4>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">TITLE</label>
                              <input
                                type="text"
                                value={enItem.title}
                                onChange={(e) => updateResponsibility(index, 'en', 'title', e.target.value)}
                                className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                                placeholder="Course Allocation"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">DESCRIPTION</label>
                              <textarea
                                rows={2}
                                value={enItem.description}
                                onChange={(e) => updateResponsibility(index, 'en', 'description', e.target.value)}
                                className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                                placeholder="Details about this responsibility..."
                              />
                            </div>
                          </div>

                          {/* Hindi Inputs */}
                          <div className="space-y-3 border-t md:border-t-0 md:border-l md:pl-6 pt-3 md:pt-0">
                            <h4 className="text-xs font-bold text-[#631012] uppercase">मद {index + 1} (हिंदी)</h4>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">शीर्षक (हिंदी)</label>
                              <input
                                type="text"
                                value={hiItem.title}
                                onChange={(e) => updateResponsibility(index, 'hi', 'title', e.target.value)}
                                className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                                placeholder="पाठ्यक्रम आवंटन"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">विवरण (हिंदी)</label>
                              <textarea
                                rows={2}
                                value={hiItem.description}
                                onChange={(e) => updateResponsibility(index, 'hi', 'description', e.target.value)}
                                className="w-full p-2.5 border rounded-lg bg-white text-black text-sm"
                                placeholder="इस जिम्मेदारी के बारे में विवरण..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
          )}

          {/* Tab 3: Governance Flow Section */}
          {activeTab === 'governance' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-3 mb-4">
                <GitBranch className="text-[#631012]" />
                <h2 className="text-xl font-bold">Academic Governance Flow Process</h2>
              </div>

              {/* Governance Headers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase">English</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">GOVERNANCE HEADING</label>
                    <input
                      type="text"
                      value={activitiesData.content.governanceHeading_en}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, governanceHeading_en: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">GOVERNANCE SUBTITLE</label>
                    <input
                      type="text"
                      value={activitiesData.content.governanceSubheading_en}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, governanceSubheading_en: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">DESCRIPTION</label>
                    <textarea
                      rows={2}
                      value={activitiesData.content.governanceDescription_en}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, governanceDescription_en: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
                  <h3 className="text-xs font-bold text-[#631012] uppercase">Hindi</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">शीर्षक (हिंदी)</label>
                    <input
                      type="text"
                      value={activitiesData.content.governanceHeading_hi}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, governanceHeading_hi: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">उपशीर्षक (हिंदी)</label>
                    <input
                      type="text"
                      value={activitiesData.content.governanceSubheading_hi}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, governanceSubheading_hi: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">विवरण (हिंदी)</label>
                    <textarea
                      rows={2}
                      value={activitiesData.content.governanceDescription_hi}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, governanceDescription_hi: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Governance Steps list */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-400 uppercase">Governance Decision Steps</label>
                <div className="space-y-3">
                  {Array.from({ length: governanceStepsCount }).map((_, index) => {
                    const enStep = activitiesData.content.governanceSteps_en[index] || { number: String(index + 1), title: '', description: '' };
                    const hiStep = activitiesData.content.governanceSteps_hi[index] || { number: String(index + 1), title: '', description: '' };

                    return (
                      <div key={index} className="p-6 border rounded-xl bg-gray-50 relative border-gray-200">
                        <button
                          onClick={() => removeGovernanceStep(index)}
                          className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pr-10">
                          {/* Step number common label */}
                          <div className="md:col-span-2 space-y-1">
                            <label className="block text-xs font-bold text-gray-400 uppercase">Step Number</label>
                            <input
                              type="text"
                              value={enStep.number}
                              onChange={(e) => {
                                updateGovernanceStep(index, 'en', 'number', e.target.value);
                                updateGovernanceStep(index, 'hi', 'number', e.target.value);
                              }}
                              className="w-full p-2 border rounded-lg bg-white text-center font-bold text-black text-sm"
                            />
                          </div>

                          {/* English Inputs */}
                          <div className="md:col-span-5 space-y-3">
                            <h4 className="text-xs font-bold text-gray-400 uppercase">Step {index + 1} (English)</h4>
                            <div>
                              <input
                                type="text"
                                value={enStep.title}
                                onChange={(e) => updateGovernanceStep(index, 'en', 'title', e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white text-black text-sm"
                                placeholder="Title (e.g. BOAC)"
                              />
                            </div>
                            <div>
                              <textarea
                                rows={2}
                                value={enStep.description}
                                onChange={(e) => updateGovernanceStep(index, 'en', 'description', e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white text-black text-sm"
                                placeholder="Description (e.g. Board review...)"
                              />
                            </div>
                          </div>

                          {/* Hindi Inputs */}
                          <div className="md:col-span-5 space-y-3 border-t md:border-t-0 md:border-l md:pl-6 pt-3 md:pt-0">
                            <h4 className="text-xs font-bold text-[#631012] uppercase">चरण {index + 1} (हिंदी)</h4>
                            <div>
                              <input
                                type="text"
                                value={hiStep.title}
                                onChange={(e) => updateGovernanceStep(index, 'hi', 'title', e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white text-black text-sm"
                                placeholder="शीर्षक (जैसे बीओएसी)"
                              />
                            </div>
                            <div>
                              <textarea
                                rows={2}
                                value={hiStep.description}
                                onChange={(e) => updateGovernanceStep(index, 'hi', 'description', e.target.value)}
                                className="w-full p-2 border rounded-lg bg-white text-black text-sm"
                                placeholder="विवरण (जैसे बोर्ड समीक्षा...)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
          )}

          {/* Tab 4: Call to Action Section */}
          {activeTab === 'cta' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-3 mb-4">
                <Megaphone className="text-[#631012]" />
                <h2 className="text-xl font-bold">Call to Action & Contacts</h2>
              </div>

              {/* CTA Headers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase">English</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">CTA MAIN HEADING</label>
                    <input
                      type="text"
                      value={activitiesData.content.ctaHeading_en}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, ctaHeading_en: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">CTA DESCRIPTION</label>
                    <textarea
                      rows={3}
                      value={activitiesData.content.ctaDescription_en}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, ctaDescription_en: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
                  <h3 className="text-xs font-bold text-[#631012] uppercase">Hindi</h3>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">शीर्षक (हिंदी)</label>
                    <input
                      type="text"
                      value={activitiesData.content.ctaHeading_hi}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, ctaHeading_hi: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">विवरण (हिंदी)</label>
                    <textarea
                      rows={3}
                      value={activitiesData.content.ctaDescription_hi}
                      onChange={(e) => setActivitiesData({
                        ...activitiesData,
                        content: { ...activitiesData.content, ctaDescription_hi: e.target.value }
                      })}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-[#631012] text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-400 uppercase">Interactive Action Buttons</label>
                <div className="space-y-3">
                  {Array.from({ length: ctaButtonsCount }).map((_, index) => {
                    const enButton = activitiesData.content.ctaButtons_en[index] || { buttonText: '' };
                    const hiButton = activitiesData.content.ctaButtons_hi[index] || { buttonText: '' };

                    return (
                      <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border rounded-xl bg-gray-50 relative border-gray-200">
                        <button
                          onClick={() => removeCtaButton(index)}
                          className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="flex-1 space-y-2">
                          <label className="block text-xs font-bold text-gray-400 uppercase">English Button Text</label>
                          <input
                            type="text"
                            value={enButton.buttonText}
                            onChange={(e) => updateCtaButton(index, 'en', e.target.value)}
                            className="w-full p-3 border rounded-xl bg-white text-black"
                            placeholder="Button Action Text (EN)"
                          />
                        </div>
                        <div className="flex-1 space-y-2 border-t md:border-t-0 md:border-l md:pl-6 pt-3 md:pt-0">
                          <label className="block text-xs font-bold text-[#631012] uppercase">Hindi Button Text</label>
                          <input
                            type="text"
                            value={hiButton.buttonText}
                            onChange={(e) => updateCtaButton(index, 'hi', e.target.value)}
                            className="w-full p-3 border rounded-xl bg-white text-black"
                            placeholder="बटन का नाम (हिंदी)"
                          />
                        </div>
                      </div>
                    );
                  })}
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
          )}
        </div>
      </div>
    </div>
  );
}
