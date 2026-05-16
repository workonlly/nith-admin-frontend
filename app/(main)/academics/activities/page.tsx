'use client';

import React, { useState } from 'react';
import {
  Save,
  Activity,
  Plus,
  Trash2,
  FileText,
  ClipboardList,
  GitBranch,
  Megaphone,
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
  heroHeading: string;
  heroDescription: string;
  activitiesHeading: string;
  activitiesDescription: string;
  responsibilitiesHeading: string;
  responsibilitiesSubtitle: string;
  responsibilities: ResponsibilityItem[];
  governanceHeading: string;
  governanceSubheading: string;
  governanceDescription: string;
  governanceSteps: GovernanceStep[];
  ctaHeading: string;
  ctaDescription: string;
  ctaButtons: CallToAction[];
}

type TabType = 'hero' | 'responsibilities' | 'governance' | 'cta';

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');

  const [activitiesData, setActivitiesData] = useState<ActivitiesData>({
    heroHeading: 'Activities',
    heroDescription:
      'Academic governance, planning, and execution under the Office of the Dean (Academic).',
    activitiesHeading: 'ACTIVITIES',
    activitiesDescription:
      'As per Schedule C of the Institute Statutes, the Dean (Academic) advises the Director on key academic matters and governance.',
    responsibilitiesHeading: 'Responsibilities & Activities',
    responsibilitiesSubtitle:
      'Key responsibilities and activities of the academic office',
    responsibilities: [
      {
        title: 'Admission and Enrollment',
        description: 'Admission and enrollment of students.',
      },
      {
        title: 'Academic Calendar & Timetables',
        description:
          'Finalisation of academic calendar, time-tables, registration of students for course work and examinations, class arrangements and all other requirements for proper conduct of class work.',
      },
      {
        title: 'Conduct of Examinations',
        description:
          "Conduct of class tests and co-ordinating the finalization of session's evaluations and ensuring the timely declaration of results.",
      },
      {
        title: 'Academic Records Maintenance',
        description:
          'Supervision of the maintenance of up-to-date academic records of all categories of students.',
      },
      {
        title: 'Syllabi Publication',
        description: 'Publication and distribution of the syllabi.',
      },
      {
        title: 'Academic Body Meetings',
        description:
          'Organizing meetings of all the Institute-level academic bodies.',
      },
      {
        title: 'Certificates & Awards',
        description:
          'Arranging the issue of all academic certificates, medals, and prizes to the students.',
      },
      {
        title: 'Institute Examinations',
        description:
          'To arrange or conduct those examinations which are to be conducted by the Institute as stipulated in the Institute regulations.',
      },
      {
        title: 'Research Policy',
        description:
          'To formulate policies for the conduct of research and steps to maintain suitable standards by implementing the Board of Governors/Senate decisions.',
      },
      {
        title: 'P.G. & Ph.D. Programmes',
        description:
          'To execute the policy of the Senate in the conduct of P.G., Ph.D., and other research programmes including the examination of the thesis.',
      },
      {
        title: 'Convocation',
        description: 'To co-ordinate the conduct of Convocation.',
      },
      {
        title: 'Programme Modifications',
        description:
          'All proposals to modify the teaching programmes will be considered by BOAC, for which the Dean (Academic), as Chairman, and if approved, will be sent to the Senate for formal approval.',
      },
      {
        title: 'Sponsored Programmes',
        description:
          'To admit sponsored Early Faculty Induction Programme and Quality Improvement Programme candidates.',
      },
      {
        title: 'Academic Standards',
        description:
          'To suggest the Director take suitable steps from time to time to strive for high academic standards.',
      },
    ],
    governanceHeading: 'Academic Governance Flow',
    governanceSubheading: 'Decision Flow Process',
    governanceDescription:
      'A concise representation of decision flow from academic committees to implementation.',
    governanceSteps: [
      {
        number: '1',
        title: 'BOAC',
        description:
          'Board of Academic Curriculum - Initial review and recommendation of academic proposals.',
      },
      {
        number: '2',
        title: 'Senate',
        description:
          'Senate approval - Academic body reviews and approves recommendations.',
      },
      {
        number: '3',
        title: 'Board of Governors',
        description:
          'Final approval by the Board of Governors for major policy decisions.',
      },
      {
        number: '4',
        title: 'Implementation',
        description:
          'Execution of approved policies and decisions through relevant departments.',
      },
    ],
    ctaHeading: 'Connect with Academic Office',
    ctaDescription:
      'For queries related to academic matters, reach out to the Office of the Dean (Academic)',
    ctaButtons: [
      { buttonText: 'View Academic Calendar' },
      { buttonText: 'Contact Academic Office' },
    ],
  });

  const tabs = [
    {
      id: 'hero' as TabType,
      label: 'Hero Section',
      icon: <FileText size={18} />,
    },
    {
      id: 'responsibilities' as TabType,
      label: 'Responsibilities',
      icon: <ClipboardList size={18} />,
    },
    {
      id: 'governance' as TabType,
      label: 'Governance Flow',
      icon: <GitBranch size={18} />,
    },
    {
      id: 'cta' as TabType,
      label: 'Call to Action',
      icon: <Megaphone size={18} />,
    },
  ];

  const [editLang, setEditLang] = useState<'en' | 'hi'>('en');

  const [activitiesData, setActivitiesData] = useState<any>({
    heroHeading_en: 'Activities',
    heroHeading_hi: 'गतिविधियां',
    heroDescription_en: 'Academic governance...',
    heroDescription_hi: 'डीन (शैक्षणिक)...',
    content: {
      activitiesHeading_en: 'ACTIVITIES',
      activitiesHeading_hi: 'गतिविधियां',
      activitiesDescription_en: '',
      activitiesDescription_hi: '',
      responsibilitiesHeading_en: 'Responsibilities & Activities',
      responsibilitiesHeading_hi: 'कर्तव्य और जिम्मेदारियां',
      responsibilitiesSubtitle_en: '',
      responsibilitiesSubtitle_hi: '',
      responsibilities_en: [],
      responsibilities_hi: [],
      governanceHeading_en: 'Academic Governance Flow',
      governanceHeading_hi: 'अकादमिक शासन प्रवाह',
      governanceSubheading_en: 'Decision Flow Process',
      governanceSubheading_hi: 'निर्णय प्रवाह प्रक्रिया',
      governanceDescription_en: '',
      governanceDescription_hi: '',
      governanceSteps_en: [],
      governanceSteps_hi: [],
      ctaHeading_en: 'Connect with Academic Office',
      ctaHeading_hi: 'अकादमिक कार्यालय से जुड़ें',
      ctaDescription_en: '',
      ctaDescription_hi: '',
      ctaButtons_en: [],
      ctaButtons_hi: []
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
        setActivitiesData({
          heroHeading_en: item.title_en || '',
          heroHeading_hi: item.title_hi || '',
          heroDescription_en: item.description_en || '',
          heroDescription_hi: item.description_hi || '',
          content: item.content || {}
        });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
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
      alert('Error saving changes');
    }
  };

  const updateResponsibility = (
    index: number,
    field: 'title' | 'description',
    value: string
  ) => {
    const updated = [...(activitiesData.content[`responsibilities_${editLang}`] || [])];
    updated[index] = { ...updated[index], [field]: value };
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [`responsibilities_${editLang}`]: updated }
    });
  };

  const addResponsibility = () => {
    const updated = [...(activitiesData.content[`responsibilities_${editLang}`] || [])];
    updated.push({ title: '', description: '' });
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [`responsibilities_${editLang}`]: updated }
    });
  };

  const removeResponsibility = (index: number) => {
    const updated = (activitiesData.content[`responsibilities_${editLang}`] || []).filter((_: any, i: number) => i !== index);
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [`responsibilities_${editLang}`]: updated }
    });
  };

  const updateGovernanceStep = (
    index: number,
    field: 'number' | 'title' | 'description',
    value: string
  ) => {
    const updated = [...(activitiesData.content[`governanceSteps_${editLang}`] || [])];
    updated[index] = { ...updated[index], [field]: value };
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [`governanceSteps_${editLang}`]: updated }
    });
  };

  const addGovernanceStep = () => {
    const updated = [...(activitiesData.content[`governanceSteps_${editLang}`] || [])];
    updated.push({
      number: String(updated.length + 1),
      title: '',
      description: '',
    });
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [`governanceSteps_${editLang}`]: updated }
    });
  };

  const removeGovernanceStep = (index: number) => {
    const updated = (activitiesData.content[`governanceSteps_${editLang}`] || []).filter((_: any, i: number) => i !== index);
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [`governanceSteps_${editLang}`]: updated }
    });
  };

  const updateCtaButton = (index: number, value: string) => {
    const updated = [...(activitiesData.content[`ctaButtons_${editLang}`] || [])];
    updated[index] = { buttonText: value };
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [`ctaButtons_${editLang}`]: updated }
    });
  };

  const addCtaButton = () => {
    const updated = [...(activitiesData.content[`ctaButtons_${editLang}`] || [])];
    updated.push({ buttonText: '' });
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [`ctaButtons_${editLang}`]: updated }
    });
  };

  const removeCtaButton = (index: number) => {
    const updated = (activitiesData.content[`ctaButtons_${editLang}`] || []).filter((_: any, i: number) => i !== index);
    setActivitiesData({
      ...activitiesData,
      content: { ...activitiesData.content, [`ctaButtons_${editLang}`]: updated }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-[#631012]/10 p-2 sm:p-3 rounded-full text-[#631012] flex-shrink-0">
              <Activity className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#171717] break-words">
                Activities Editor
              </h1>
              <p className="text-sm sm:text-base text-[#171717]/60 mt-1">
                Edit academic activities and governance information
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md w-full sm:w-auto justify-center text-sm sm:text-base"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-[#171717]/10">
          <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-[#631012]/30 scrollbar-track-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0
                  ${
                    activeTab === tab.id
                      ? 'bg-[#631012] text-white border-b-2 border-[#631012]'
                      : 'text-[#171717]/70 hover:bg-[#F9F9F9] hover:text-[#171717]'
                  }
                `}
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Hero Section */}
          {activeTab === 'hero' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <FileText className="text-[#631012] w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">
                  Hero Section Content
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-2">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={activitiesData.heroHeading}
                    onChange={(e) =>
                      setActivitiesData({
                        ...activitiesData,
                        heroHeading: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                    placeholder="Activities"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={activitiesData.heroDescription}
                    onChange={(e) =>
                      setActivitiesData({
                        ...activitiesData,
                        heroDescription: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                    placeholder="Enter description"
                  />
                </div>

                <div className="p-4 bg-[#F9F9F9] rounded-lg border border-[#171717]/10">
                  <h3 className="text-lg font-semibold text-[#171717] mb-3">
                    Activities Section
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-[#171717] mb-2">
                        Activities Heading
                      </label>
                      <input
                        type="text"
                        value={activitiesData.activitiesHeading}
                        onChange={(e) =>
                          setActivitiesData({
                            ...activitiesData,
                            activitiesHeading: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                        placeholder="ACTIVITIES"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#171717] mb-2">
                        Activities Description
                      </label>
                      <textarea
                        rows={3}
                        value={activitiesData.activitiesDescription}
                        onChange={(e) =>
                          setActivitiesData({
                            ...activitiesData,
                            activitiesDescription: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                        placeholder="Description"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-[#F9F9F9] rounded-lg border-2 border-dashed border-[#171717]/20">
                <p className="text-xs sm:text-sm font-medium text-[#171717]/60 mb-3">
                  Preview:
                </p>
                <div className="bg-white p-4 sm:p-6 rounded-lg space-y-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171717] mb-3">
                      {activitiesData.heroHeading}
                    </h3>
                    <p className="text-base sm:text-lg text-[#171717]/70">
                      {activitiesData.heroDescription}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-[#631012]/5 to-[#8B1518]/5 p-6 rounded-lg border border-[#631012]/20">
                    <h4 className="text-xl sm:text-2xl font-bold text-[#171717] mb-3">
                      {activitiesData.activitiesHeading}
                    </h4>
                    <p className="text-sm sm:text-base text-[#171717]/70">
                      {activitiesData.activitiesDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {activeTab === 'responsibilities' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <ClipboardList className="text-[#631012] w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">
                  Responsibilities & Activities
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={activitiesData.responsibilitiesHeading}
                      onChange={(e) =>
                        setActivitiesData({
                          ...activitiesData,
                          responsibilitiesHeading: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                      placeholder="Responsibilities & Activities"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">
                      Section Subtitle
                    </label>
                    <input
                      type="text"
                      value={activitiesData.responsibilitiesSubtitle}
                      onChange={(e) =>
                        setActivitiesData({
                          ...activitiesData,
                          responsibilitiesSubtitle: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                      placeholder="Key responsibilities..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-2">
                    Responsibility Items
                  </label>
                  <div className="space-y-3">
                    {activitiesData.responsibilities.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 border border-[#171717]/20 rounded-lg bg-[#F9F9F9] space-y-2"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-[#171717]/60">
                            Responsibility {index + 1}
                          </span>
                          <button
                            onClick={() => removeResponsibility(index)}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div>
                          <label className="block text-xs text-[#171717]/60 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) =>
                              updateResponsibility(
                                index,
                                'title',
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                            placeholder="Title"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#171717]/60 mb-1">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={item.description}
                            onChange={(e) =>
                              updateResponsibility(
                                index,
                                'description',
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                            placeholder="Description"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addResponsibility}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 text-[#631012] hover:bg-[#631012]/10 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      <Plus size={18} />
                      Add Responsibility
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-[#F9F9F9] rounded-lg border-2 border-dashed border-[#171717]/20">
                <p className="text-xs sm:text-sm font-medium text-[#171717]/60 mb-3">
                  Preview:
                </p>
                <div className="bg-white p-4 sm:p-6 rounded-lg space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-[#171717] mb-2">
                      {activitiesData.responsibilitiesHeading}
                    </h3>
                    <p className="text-sm text-[#171717]/60">
                      {activitiesData.responsibilitiesSubtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activitiesData.responsibilities.map((item, index) => (
                      <div
                        key={index}
                        className="bg-[#F9F9F9] p-4 rounded-lg border border-[#171717]/10 hover:border-[#631012]/30 transition-colors"
                      >
                        <h5 className="text-base font-semibold text-[#171717] mb-2">
                          {item.title}
                        </h5>
                        <p className="text-sm text-[#171717]/70 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Governance Flow */}
          {activeTab === 'governance' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <GitBranch className="text-[#631012] w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">
                  Academic Governance Flow
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">
                      Governance Heading
                    </label>
                    <input
                      type="text"
                      value={activitiesData.governanceHeading}
                      onChange={(e) =>
                        setActivitiesData({
                          ...activitiesData,
                          governanceHeading: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                      placeholder="Academic Governance Flow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">
                      Governance Subheading
                    </label>
                    <input
                      type="text"
                      value={activitiesData.governanceSubheading}
                      onChange={(e) =>
                        setActivitiesData({
                          ...activitiesData,
                          governanceSubheading: e.target.value,
                        })
                      }
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                      placeholder="Decision Flow Process"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-2">
                    Governance Description
                  </label>
                  <textarea
                    rows={3}
                    value={activitiesData.governanceDescription}
                    onChange={(e) =>
                      setActivitiesData({
                        ...activitiesData,
                        governanceDescription: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                    placeholder="A concise representation..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-2">
                    Governance Steps
                  </label>
                  <div className="space-y-3">
                    {activitiesData.governanceSteps.map((step, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 border border-[#171717]/20 rounded-lg bg-[#F9F9F9]"
                      >
                        <div className="md:col-span-1">
                          <label className="block text-xs text-[#171717]/60 mb-1">
                            #
                          </label>
                          <input
                            type="text"
                            value={step.number}
                            onChange={(e) =>
                              updateGovernanceStep(
                                index,
                                'number',
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm text-center"
                            placeholder="1"
                          />
                        </div>
                        <div className="md:col-span-4">
                          <label className="block text-xs text-[#171717]/60 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) =>
                              updateGovernanceStep(
                                index,
                                'title',
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                            placeholder="Step title"
                          />
                        </div>
                        <div className="md:col-span-6">
                          <label className="block text-xs text-[#171717]/60 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={step.description}
                            onChange={(e) =>
                              updateGovernanceStep(
                                index,
                                'description',
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                            placeholder="Step description"
                          />
                        </div>
                        <div className="md:col-span-1 flex items-end justify-center">
                          <button
                            onClick={() => removeGovernanceStep(index)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addGovernanceStep}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 text-[#631012] hover:bg-[#631012]/10 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      <Plus size={18} />
                      Add Governance Step
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-[#F9F9F9] rounded-lg border-2 border-dashed border-[#171717]/20">
                <p className="text-xs sm:text-sm font-medium text-[#171717]/60 mb-3">
                  Preview:
                </p>
                <div className="bg-white p-4 sm:p-6 rounded-lg space-y-6">
                  <div className="text-center">
                    <span className="text-sm font-semibold text-[#631012] uppercase tracking-wide">
                      {activitiesData.governanceHeading}
                    </span>
                    <h3 className="text-2xl font-bold text-[#171717] mt-2 mb-2">
                      {activitiesData.governanceSubheading}
                    </h3>
                    <p className="text-sm text-[#171717]/60">
                      {activitiesData.governanceDescription}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {activitiesData.governanceSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex gap-4 items-start p-4 bg-[#F9F9F9] rounded-lg border border-[#171717]/10"
                      >
                        <div className="w-10 h-10 flex items-center justify-center bg-[#631012] text-white rounded-full font-bold flex-shrink-0">
                          {step.number}
                        </div>
                        <div>
                          <h5 className="text-base font-semibold text-[#171717] mb-1">
                            {step.title}
                          </h5>
                          <p className="text-sm text-[#171717]/70">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          {activeTab === 'cta' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Megaphone className="text-[#631012] w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">
                  Call to Action Section
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-2">
                    CTA Heading
                  </label>
                  <input
                    type="text"
                    value={activitiesData.ctaHeading}
                    onChange={(e) =>
                      setActivitiesData({
                        ...activitiesData,
                        ctaHeading: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                    placeholder="Connect with Academic Office"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-2">
                    CTA Description
                  </label>
                  <textarea
                    rows={3}
                    value={activitiesData.ctaDescription}
                    onChange={(e) =>
                      setActivitiesData({
                        ...activitiesData,
                        ctaDescription: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                    placeholder="For queries related to academic matters..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#171717] mb-2">
                    CTA Buttons
                  </label>
                  <div className="space-y-3">
                    {activitiesData.ctaButtons.map((button, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={button.buttonText}
                          onChange={(e) =>
                            updateCtaButton(index, e.target.value)
                          }
                          className="flex-1 px-3 sm:px-4 py-2 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                          placeholder="Button text"
                        />
                        <button
                          onClick={() => removeCtaButton(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addCtaButton}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 text-[#631012] hover:bg-[#631012]/10 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      <Plus size={18} />
                      Add Button
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-[#F9F9F9] rounded-lg border-2 border-dashed border-[#171717]/20">
                <p className="text-xs sm:text-sm font-medium text-[#171717]/60 mb-3">
                  Preview:
                </p>
                <div className="bg-gradient-to-r from-[#631012] to-[#8B1518] p-6 sm:p-8 rounded-lg text-center text-white">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3">
                    {activitiesData.ctaHeading}
                  </h3>
                  <p className="text-sm sm:text-base text-white/90 mb-6">
                    {activitiesData.ctaDescription}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {activitiesData.ctaButtons.map((button, index) => (
                      <button
                        key={index}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                          index === 0
                            ? 'bg-white text-[#631012] hover:bg-gray-100'
                            : 'border border-white text-white hover:bg-white/10'
                        }`}
                      >
                        {button.buttonText}
                      </button>
                    ))}
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
