'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Users,
  Plus,
  Trash2,
  FileText,
  Filter,
  Mail,
  IdCard,
  Calendar,
  Briefcase,
} from 'lucide-react';

interface Functionary {
  id: number;
  category_en: string;
  category_hn: string;
  category_description_en: string;
  category_description_hn: string;
  role_en: string;
  role_hn: string;
  name_en: string;
  name_hn: string;
  department_en: string;
  department_hn: string;
  email: string;
  faculty_id: string;
  since_date_en: string;
  since_date_hn: string;
}

interface FunctionariesData {
  heroHeadingEn: string;
  heroHeadingHn: string;
  heroDescriptionEn: string;
  heroDescriptionHn: string;
  filterHeading: string;
  categories: string[];
  functionaries: Functionary[];
}

type TabType = 'hero' | 'functionaries';

const INITIAL_FUNCTIONARIES: Functionary[] = [
  {
    id: -1,
    category_en: 'Academics',
    category_hn: 'अकादमिक',
    category_description_en: 'Faculty members entrusted with academics responsibilities.',
    category_description_hn: 'अकादमिक जिम्मेदारियों के साथ सौंपे गए संकाय सदस्य।',
    role_en: 'Dean',
    role_hn: 'डीन',
    name_en: 'Dr. Rohan Mehta',
    name_hn: 'डॉ. रोहन मेहता',
    department_en: 'Mechanical Engineering',
    department_hn: 'मैकेनिक इंजीनियरिंग',
    email: 'dean.academics@nitth.ac.in',
    faculty_id: 'FI03',
    since_date_en: 'August 15, 2023',
    since_date_hn: '15 अगस्त, 2023',
  },
  {
    id: 2,
    category_en: 'Academics',
    category_hn: 'अकादमिक',
    category_description_en: 'Faculty members entrusted with academics responsibilities.',
    category_description_hn: 'अकादमिक जिम्मेदारियों के साथ सौंपे गए संकाय सदस्य।',
    role_en: 'Associate Dean',
    role_hn: 'एसोसिएट डीन',
    name_en: 'Dr. Anjali Sharma',
    name_hn: 'डॉ. अंजली शर्मा',
    department_en: 'Computer Science Engineering',
    department_hn: 'कंप्यूटर विज्ञान इंजीनियरिंग',
    email: 'ad.academics@nitth.ac.in',
    faculty_id: 'FI04',
    since_date_en: 'August 15, 2023',
    since_date_hn: '15 अगस्त, 2023',
  },
  {
    id: 3,
    category_en: 'Student Welfare',
    category_hn: 'छात्र कल्याण',
    category_description_en: 'Faculty members entrusted with student welfare responsibilities.',
    category_description_hn: 'छात्र कल्याण जिम्मेदारियों के साथ सौंपे गए संकाय सदस्य।',
    role_en: 'Dean',
    role_hn: 'डीन',
    name_en: 'Dr. Neeraj Gupta',
    name_hn: 'डॉ. नीरज गुप्ता',
    department_en: 'Electrical Engineering',
    department_hn: 'इलेक्ट्रिकल इंजीनियरिंग',
    email: 'dean.sw@nitth.ac.in',
    faculty_id: 'SW01',
    since_date_en: 'July 10, 2022',
    since_date_hn: '10 जुलाई, 2022',
  },
  {
    id: 4,
    category_en: 'Student Welfare',
    category_hn: 'छात्र कल्याण',
    category_description_en: 'Faculty members entrusted with student welfare responsibilities.',
    category_description_hn: 'छात्र कल्याण जिम्मेदारियों के साथ सौंपे गए संकाय सदस्य।',
    role_en: 'Associate Dean',
    role_hn: 'एसोसिएट डीन',
    name_en: 'Dr. Priya Verma',
    name_hn: 'डॉ. प्रिया वर्मा',
    department_en: 'Civil Engineering',
    department_hn: 'सिविल इंजीनियरिंग',
    email: 'ad.sw@nitth.ac.in',
    faculty_id: 'SW02',
    since_date_en: 'July 10, 2022',
    since_date_hn: '10 जुलाई, 2022',
  },
  {
    id: 5,
    category_en: 'Faculty Welfare',
    category_hn: 'संकाय कल्याण',
    category_description_en: 'Faculty members entrusted with faculty welfare responsibilities.',
    category_description_hn: 'संकाय कल्याण जिम्मेदारियों के साथ सौंपे गए संकाय सदस्य।',
    role_en: 'Dean',
    role_hn: 'डीन',
    name_en: 'Dr. Sushil Chauhan',
    name_hn: 'डॉ. सुशील चौहान',
    department_en: 'Faculty Welfare Office',
    department_hn: 'संकाय कल्याण कार्यालय',
    email: 'dean.fw@nitth.ac.in',
    faculty_id: 'FW01',
    since_date_en: 'January 01, 2024',
    since_date_hn: '01 जनवरी, 2024',
  },
  {
    id: 6,
    category_en: 'Faculty Welfare',
    category_hn: 'संकाय कल्याण',
    category_description_en: 'Faculty members entrusted with faculty welfare responsibilities.',
    category_description_hn: 'संकाय कल्याण जिम्मेदारियों के साथ सौंपे गए संकाय सदस्य।',
    role_en: 'Associate Dean',
    role_hn: 'एसोसिएट डीन',
    name_en: 'Dr. Naveen Chauhan',
    name_hn: 'डॉ. नवीन चौहान',
    department_en: 'Faculty Activity & Support',
    department_hn: 'संकाय गतिविधि और सहायता',
    email: 'ad.fw@nitth.ac.in',
    faculty_id: 'FW02',
    since_date_en: 'January 01, 2024',
    since_date_hn: '01 जनवरी, 2024',
  },
  {
    id: 7,
    category_en: 'Cultural Activities',
    category_hn: 'सांस्कृतिक गतिविधियां',
    category_description_en: 'Faculty members entrusted with cultural activities responsibilities.',
    category_description_hn: 'सांस्कृतिक गतिविधियों की जिम्मेदारियों के साथ सौंपे गए संकाय सदस्य।',
    role_en: 'Coordinator',
    role_hn: 'समन्वयक',
    name_en: 'Dr. Neetu Kapoor',
    name_hn: 'डॉ. नीतू कपूर',
    department_en: 'Faculty Incharge (Cultural Activities)',
    department_hn: 'संकाय प्रभारी (सांस्कृतिक गतिविधियां)',
    email: 'culture@nitth.ac.in',
    faculty_id: 'CA01',
    since_date_en: 'March 01, 2023',
    since_date_hn: '01 मार्च, 2023',
  },
  {
    id: 8,
    category_en: 'Cultural Activities',
    category_hn: 'सांस्कृतिक गतिविधियां',
    category_description_en: 'Faculty members entrusted with cultural activities responsibilities.',
    category_description_hn: 'सांस्कृतिक गतिविधियों की जिम्मेदारियों के साथ सौंपे गए संकाय सदस्य।',
    role_en: 'Coordinator',
    role_hn: 'समन्वयक',
    name_en: 'Dr. Arjun Rao',
    name_hn: 'डॉ. अर्जुन राव',
    department_en: 'Humanities & Social Sciences',
    department_hn: 'मानविकी और सामाजिक विज्ञान',
    email: 'culture2@nitth.ac.in',
    faculty_id: 'CA02',
    since_date_en: 'March 01, 2023',
    since_date_hn: '01 मार्च, 2023',
  },
  {
    id: 9,
    category_en: 'Technical Activities',
    category_hn: 'तकनीकी गतिविधियां',
    category_description_en: 'Faculty members entrusted with technical activities responsibilities.',
    category_description_hn: 'तकनीकी गतिविधियों की जिम्मेदारियों के साथ सौंपे गए संकाय सदस्य।',
    role_en: 'Coordinator',
    role_hn: 'समन्वयक',
    name_en: 'Dr. Mehak Bansal',
    name_hn: 'डॉ. महक बंसल',
    department_en: 'Computer Science & Engineering',
    department_hn: 'कंप्यूटर विज्ञान और इंजीनियरिंग',
    email: 'technical@nitth.ac.in',
    faculty_id: 'TA01',
    since_date_en: 'November 01, 2022',
    since_date_hn: '01 नवंबर, 2022',
  },
  {
    id: 10,
    category_en: 'Technical Activities',
    category_hn: 'तकनीकी गतिविधियां',
    category_description_en: 'Faculty members entrusted with technical activities responsibilities.',
    category_description_hn: 'तकनीकी गतिविधियों की जिम्मेदारियों के साथ सौंपे गए संकाय सदस्य।',
    role_en: 'Coordinator',
    role_hn: 'समन्वयक',
    name_en: 'Dr. Vivek Sharma',
    name_hn: 'डॉ. विवेक शर्मा',
    department_en: 'Electronics & Communication',
    department_hn: 'इलेक्ट्रॉनिक्स और संचार',
    email: 'technical2@nitth.ac.in',
    faculty_id: 'TA02',
    since_date_en: 'November 01, 2022',
    since_date_hn: '01 नवंबर, 2022',
  },
];

export default function FacultyFunctionariesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [selectedCategory, setSelectedCategory] =
    useState<string>('All Categories');

  const [functionariesData, setFunctionariesData] = useState<FunctionariesData>(
    {
      heroHeadingEn: 'FACULTY ROLE ASSIGNMENTS',
      heroHeadingHn: 'संकाय भूमिका असाइनमेंट',
      heroDescriptionEn: 'Dedicated faculty members serving in various administrative and functional roles across the institute.',
      heroDescriptionHn: 'संस्थान भर में विभिन्न प्रशासनिक और कार्यात्मक भूमिकाओं में सेवारत समर्पित संकाय सदस्य।',
      filterHeading: 'Filter by Category',
      categories: [
        'All Categories',
        'Academics',
        'Student Welfare',
        'Faculty Welfare',
        'Cultural Activities',
        'Technical Activities',
      ],
      functionaries: INITIAL_FUNCTIONARIES,
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hData = await fetch('http://localhost:4000/api/faculty-functionaries').then(res => res.json());
        if (hData && hData.title_en) {
          setFunctionariesData(prev => ({
            ...prev,
            heroHeadingEn: hData.title_en || prev.heroHeadingEn,
            heroHeadingHn: hData.title_hn || prev.heroHeadingHn,
            heroDescriptionEn: hData.sub_title_en || prev.heroDescriptionEn,
            heroDescriptionHn: hData.sub_title_hn || prev.heroDescriptionHn,
          }));
        }
        
        const lData = await fetch('http://localhost:4000/api/faculty-functionaries/list').then(res => res.json());
        if (Array.isArray(lData) && lData.length > 0) {
          setFunctionariesData(prev => {
            // Merge database data with defaults, avoiding duplicates by email
            const merged = [...lData];
            INITIAL_FUNCTIONARIES.forEach(def => {
              if (!merged.find(m => m.email === def.email)) {
                merged.push(def);
              }
            });
            return { ...prev, functionaries: merged };
          });
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    {
      id: 'hero' as TabType,
      label: 'Hero Section',
      icon: <FileText size={18} />,
    },
    {
      id: 'functionaries' as TabType,
      label: 'Functionaries',
      icon: <Users size={18} />,
    },
  ];

  const handleSave = async () => {
    try {
      // Save Hero
      await fetch('http://localhost:4000/api/faculty-functionaries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_en: functionariesData.heroHeadingEn,
          title_hn: functionariesData.heroHeadingHn,
          sub_title_en: functionariesData.heroDescriptionEn,
          sub_title_hn: functionariesData.heroDescriptionHn,
        }),
      });

      // Save Functionaries
      for (const func of functionariesData.functionaries) {
        if (func.id > 0 && func.id < 1000000) { // Check if it's a real database ID
           await fetch(`http://localhost:4000/api/faculty-functionaries/list/${func.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(func),
          });
        } else {
          await fetch('http://localhost:4000/api/faculty-functionaries/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(func),
          });
        }
      }
      alert('Changes saved successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save changes');
    }
  };

  // Functionaries
  const updateFunctionary = (
    id: number,
    field: keyof Functionary,
    value: string
  ) => {
    setFunctionariesData({
      ...functionariesData,
      functionaries: functionariesData.functionaries.map((func) =>
        func.id === id ? { ...func, [field]: value } : func
      ),
    });
  };

  const addFunctionary = () => {
    setFunctionariesData({
      ...functionariesData,
      functionaries: [
        ...functionariesData.functionaries,
        {
          id: Date.now() + Math.floor(Math.random() * 1000),
          category_en: 'Academics',
          category_hn: 'अकादमिक',
          category_description_en: 'Faculty members entrusted with academics responsibilities.',
          category_description_hn: 'अकादमिक जिम्मेदारियों के साथ सौंपे गए संकाय सदस्य।',
          role_en: 'Dean',
          role_hn: 'डीन',
          name_en: '',
          name_hn: '',
          department_en: '',
          department_hn: '',
          email: '',
          faculty_id: '',
          since_date_en: '',
          since_date_hn: '',
        },
      ],
    });
  };

  const removeFunctionary = async (id: number) => {
    if (id > 0 && id < 1000000) { // Real DB ID
      if (!confirm('Are you sure you want to delete this from database?')) return;
      try {
        await fetch(`http://localhost:4000/api/faculty-functionaries/list/${id}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
    setFunctionariesData({
      ...functionariesData,
      functionaries: functionariesData.functionaries.filter((f) => f.id !== id),
    });
  };

  // Categories
  const updateCategory = (index: number, value: string) => {
    const updated = [...functionariesData.categories];
    updated[index] = value;
    setFunctionariesData({ ...functionariesData, categories: updated });
  };

  const addCategory = () => {
    setFunctionariesData({
      ...functionariesData,
      categories: [...functionariesData.categories, ''],
    });
  };

  const removeCategory = (index: number) => {
    setFunctionariesData({
      ...functionariesData,
      categories: functionariesData.categories.filter((_, i) => i !== index),
    });
  };

  // Filter functionaries
  const filteredFunctionaries =
    selectedCategory === 'All Categories'
      ? functionariesData.functionaries
      : functionariesData.functionaries.filter(
          (func) => func.category_en === selectedCategory
        );

  // Group by category
  const groupedFunctionaries = filteredFunctionaries.reduce<Record<string, Functionary[]>>(
    (acc, func) => {
      const category = func.category_en;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(func);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-[#631012]/10 p-2 sm:p-3 rounded-full text-[#631012] flex-shrink-0">
              <Users className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#171717] break-words">
                Faculty Functionaries Editor
              </h1>
              <p className="text-sm sm:text-base text-[#171717]/60 mt-1">
                Manage faculty role assignments and responsibilities
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]/50">English Content</label>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">Heading</label>
                    <input
                      type="text"
                      value={functionariesData.heroHeadingEn}
                      onChange={(e) => setFunctionariesData({...functionariesData, heroHeadingEn: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#171717]/15 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">Description</label>
                    <textarea
                      rows={4}
                      value={functionariesData.heroDescriptionEn}
                      onChange={(e) => setFunctionariesData({...functionariesData, heroDescriptionEn: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#171717]/15 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]/50">Hindi Content</label>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">Heading (Hindi)</label>
                    <input
                      type="text"
                      value={functionariesData.heroHeadingHn}
                      onChange={(e) => setFunctionariesData({...functionariesData, heroHeadingHn: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#171717]/15 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">Description (Hindi)</label>
                    <textarea
                      rows={4}
                      value={functionariesData.heroDescriptionHn}
                      onChange={(e) => setFunctionariesData({...functionariesData, heroDescriptionHn: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#171717]/15 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-[#F9F9F9] rounded-xl border-2 border-dashed border-[#171717]/10">
                <p className="text-xs font-bold uppercase tracking-wider text-[#171717]/50 mb-4">Preview (English):</p>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-3">
                    {functionariesData.heroHeadingEn}
                  </h3>
                  <p className="text-base text-[#171717]/70 leading-relaxed">
                    {functionariesData.heroDescriptionEn}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Functionaries */}
          {activeTab === 'functionaries' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Users className="text-[#631012] w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">
                  Functionaries Management
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="p-4 bg-[#F9F9F9] rounded-lg border border-[#171717]/10">
                  <h3 className="text-lg font-semibold text-[#171717] mb-3">
                    Filter Categories
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-[#171717] mb-2">
                        Filter Heading
                      </label>
                      <input
                        type="text"
                        value={functionariesData.filterHeading}
                        onChange={(e) =>
                          setFunctionariesData({
                            ...functionariesData,
                            filterHeading: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                        placeholder="Filter by Category"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-[#171717]">
                          Categories
                        </label>
                        <button
                          onClick={addCategory}
                          className="flex items-center gap-1 px-2 py-1 bg-[#631012] text-white text-xs rounded hover:bg-[#7a1214] transition-colors"
                        >
                          <Plus size={14} />
                          Add Category
                        </button>
                      </div>
                      <div className="space-y-2">
                        {functionariesData.categories.map((category, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={category}
                              onChange={(e) =>
                                updateCategory(index, e.target.value)
                              }
                              className="flex-1 px-3 py-2 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                              placeholder={`Category ${index + 1}`}
                            />
                            {index > 0 && (
                              <button
                                onClick={() => removeCategory(index)}
                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#F9F9F9] rounded-lg border border-[#171717]/10">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-[#171717]">
                      Functionaries ({functionariesData.functionaries.length})
                    </h3>
                    <button
                      onClick={addFunctionary}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#631012] text-white text-sm rounded-lg hover:bg-[#7a1214] transition-colors"
                    >
                      <Plus size={16} />
                      Add Functionary
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {functionariesData.functionaries.map(
                      (functionary, index) => (
                        <div
                          key={functionary.id}
                          className="p-3 border border-[#171717]/20 rounded-lg bg-white"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-[#171717]/60">
                              Functionary {index + 1}
                            </span>
                            <button
                              onClick={() => removeFunctionary(functionary.id)}
                              className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4 mb-4">
                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-[#631012]">English Details</label>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase">Category</label>
                                    <select
                                        value={functionary.category_en}
                                        onChange={(e) => updateFunctionary(functionary.id, 'category_en', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                    >
                                        {functionariesData.categories.filter(c => c !== 'All Categories').map((c, i) => <option key={i} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase">Role</label>
                                    <input type="text" value={functionary.role_en} onChange={(e) => updateFunctionary(functionary.id, 'role_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase">Name</label>
                                    <input type="text" value={functionary.name_en} onChange={(e) => updateFunctionary(functionary.id, 'name_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase">Department</label>
                                    <input type="text" value={functionary.department_en} onChange={(e) => updateFunctionary(functionary.id, 'department_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase">Since Date</label>
                                    <input type="text" value={functionary.since_date_en} onChange={(e) => updateFunctionary(functionary.id, 'since_date_en', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-xs font-bold text-[#631012]">Hindi Details</label>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase">Category (Hindi)</label>
                                    <input type="text" value={functionary.category_hn} onChange={(e) => updateFunctionary(functionary.id, 'category_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase">Role (Hindi)</label>
                                    <input type="text" value={functionary.role_hn} onChange={(e) => updateFunctionary(functionary.id, 'role_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase">Name (Hindi)</label>
                                    <input type="text" value={functionary.name_hn} onChange={(e) => updateFunctionary(functionary.id, 'name_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase">Department (Hindi)</label>
                                    <input type="text" value={functionary.department_hn} onChange={(e) => updateFunctionary(functionary.id, 'department_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase">Since Date (Hindi)</label>
                                    <input type="text" value={functionary.since_date_hn} onChange={(e) => updateFunctionary(functionary.id, 'since_date_hn', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase">Email</label>
                                    <input type="email" value={functionary.email} onChange={(e) => updateFunctionary(functionary.id, 'email', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 uppercase">Faculty ID</label>
                                    <input type="text" value={functionary.faculty_id} onChange={(e) => updateFunctionary(functionary.id, 'faculty_id', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-[#F9F9F9] rounded-lg border-2 border-dashed border-[#171717]/20">
                <p className="text-xs sm:text-sm font-medium text-[#171717]/60 mb-3">
                  Preview:
                </p>
                <div className="bg-white p-4 sm:p-6 rounded-lg space-y-6">
                  {/* Filter Section */}
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="text-[#631012] w-5 h-5" />
                    <h3 className="text-lg font-semibold text-[#171717]">
                      {functionariesData.filterHeading}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {functionariesData.categories.map((category, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === category
                            ? 'bg-[#631012] text-white'
                            : 'bg-[#F9F9F9] text-[#171717] hover:bg-[#631012]/10'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Functionaries by Category */}
                  {Object.entries(groupedFunctionaries).map(
                    ([category, funcs]) => (
                      <div key={category} className="mb-6">
                        <h3 className="text-xl font-bold text-[#631012] mb-2">
                          {category}
                        </h3>
                        {funcs[0]?.category_description_en && (
                          <p className="text-sm text-[#171717]/70 mb-4">
                            {funcs[0].category_description_en}
                          </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {funcs.map((func) => (
                            <div
                              key={func.id}
                              className="bg-white border border-[#171717]/20 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start gap-3">
                                <div className="bg-[#631012]/10 p-2 rounded-full">
                                  <Briefcase className="w-5 h-5 text-[#631012]" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs font-semibold text-[#631012] uppercase mb-1">
                                    {func.role_en}
                                  </div>
                                  <div className="text-lg font-bold text-[#171717] mb-1">
                                    {func.name_en}
                                  </div>
                                  <div className="text-sm text-[#171717]/70 mb-3">
                                    {func.department_en}
                                  </div>

                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-[#171717]/70">
                                      <Mail
                                        size={14}
                                        className="text-[#631012]"
                                      />
                                      <span className="font-medium">
                                        Email:
                                      </span>
                                      <a
                                        href={`mailto:${func.email}`}
                                        className="text-[#631012] hover:underline"
                                      >
                                        {func.email}
                                      </a>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#171717]/70">
                                      <IdCard
                                        size={14}
                                        className="text-[#631012]"
                                      />
                                      <span className="font-medium">
                                        Faculty ID:
                                      </span>
                                      <span>{func.faculty_id}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#171717]/70">
                                      <Calendar
                                        size={14}
                                        className="text-[#631012]"
                                      />
                                      <span className="font-medium">Since</span>
                                      <span>{func.since_date_en}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
