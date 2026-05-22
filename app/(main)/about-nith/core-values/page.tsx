'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Heart,
  Plus,
  Trash2,
  FileText,
  Shield,
  BookOpen,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
} from 'lucide-react';

interface CoreValue {
  id?: number | string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
}

interface CoreValuesData {
  // Hero section
  heroHeading_en: string;
  heroHeading_hi: string;
  heroDescription_en: string;
  heroDescription_hi: string;

  // Pillars/Guiding Principles headers
  pillarsLabel_en: string;
  pillarsLabel_hi: string;
  pillarsHeading_en: string;
  pillarsHeading_hi: string;
  pillarsSubtitle_en: string;
  pillarsSubtitle_hi: string;

  // List of values
  coreValues: CoreValue[];

  // Practice/Our Guiding Practice section
  practiceLabel_en: string;
  practiceLabel_hi: string;
  practiceHeading_en: string;
  practiceHeading_hi: string;
  practiceSubtitle_en: string;
  practiceSubtitle_hi: string;
  
  // Custom Paragraph strings mapped bilingually
  practiceParagraphs_en: string[];
  practiceParagraphs_hi: string[];
}

type TabType = 'hero' | 'values' | 'practice';

const API_BASE = 'http://localhost:4000/core-values';

// Predefined, robust fallbacks if the database is unreachable
const FALLBACK_CORE_VALUES_DATA: CoreValuesData = {
  heroHeading_en: 'Core Values',
  heroHeading_hi: 'मूल मूल्य',
  heroDescription_en:
    'The enduring principles that guide our commitment to excellence: Integrity, Excellence, Unity, Accountability, Inclusivity, and Empathy',
  heroDescription_hi:
    'उत्कृष्टता के प्रति हमारी प्रतिबद्धता का मार्गदर्शन करने वाले स्थायी सिद्धांत: सत्यनिष्ठा, उत्कृष्टता, एकता, जवाबदेही, समावेशिता और सहानुभूति।',
  
  pillarsLabel_en: 'Six Pillars',
  pillarsLabel_hi: 'छह स्तंभ',
  pillarsHeading_en: 'Our Guiding Principles',
  pillarsHeading_hi: 'हमारे मार्गदर्शक सिद्धांत',
  pillarsSubtitle_en:
    'The foundation of our institutional excellence and ethical leadership',
  pillarsSubtitle_hi:
    'हमारी संस्थागत उत्कृष्टता और नैतिक नेतृत्व की नींव',

  coreValues: [
    {
      id: 1,
      title_en: 'Integrity',
      title_hi: 'सत्यनिष्ठा',
      description_en:
        'To be honest in intention, fair in evaluation, transparent in deeds, and adhere to the highest standards of ethics in all its activities.',
      description_hi:
        'इरादे में ईमानदार होना, मूल्यांकन में निष्पक्ष होना, कार्यों में पारदर्शी होना और अपनी सभी गतिविधियों में नैतिकता के उच्चतम मानकों का पालन करना।',
    },
    {
      id: 2,
      title_en: 'Excellence',
      title_hi: 'उत्कृष्टता',
      description_en:
        'A relentless commitment to continuous improvement, high-quality research, and comprehensive pedagogy.',
      description_hi:
        'निरंतर सुधार, उच्च गुणवत्ता वाले अनुसंधान और व्यापक शिक्षाशास्त्र के प्रति निरंतर प्रतिबद्धता।',
    },
  ],

  practiceLabel_en: 'In Practice',
  practiceLabel_hi: 'व्यवहार में',
  practiceHeading_en: 'Living Our Principles',
  practiceHeading_hi: 'हमारे सिद्धांतों को जीना',
  practiceSubtitle_en: 'How we translate our core beliefs into everyday action and institutional behavior',
  practiceSubtitle_hi: 'हम अपने मूल विश्वासों को रोजमर्रा की कार्रवाई और संस्थागत व्यवहार में कैसे बदलते हैं',
  
  practiceParagraphs_en: [
    'We implement rigorous transparency policies across academic administrations and examinations.',
    'We actively support green campus initiatives and equitable financial aids for inclusive social growth.'
  ],
  practiceParagraphs_hi: [
    'हम शैक्षणिक प्रशासन और परीक्षाओं में कड़े पारदर्शिता नियमों को लागू करते हैं।',
    'हम समावेशी सामाजिक विकास के लिए हरित परिसर पहल और समान वित्तीय सहायता का सक्रिय रूप से समर्थन करते हैं।'
  ]
};

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Custom action save flags
  const [savingSide, setSavingSide] = useState<{ side: 'en' | 'hi' | 'all' | string | null; section: string | null }>({
    side: null,
    section: null,
  });

  const [coreValuesData, setCoreValuesData] = useState<CoreValuesData>(FALLBACK_CORE_VALUES_DATA);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Add Item states
  const [newValue, setNewValue] = useState<Omit<CoreValue, 'id'>>({
    title_en: '',
    title_hi: '',
    description_en: '',
    description_hi: '',
  });

  const [newParagraphEn, setNewParagraphEn] = useState<string>('');
  const [newParagraphHi, setNewParagraphHi] = useState<string>('');

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Synchronize frontend state structures to match backend's schema return
  const fetchCoreValuesData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();

      const mappedData: CoreValuesData = {
        heroHeading_en: data.heroHeadingEn || '',
        heroHeading_hi: data.heroHeadingHi || '',
        heroDescription_en: data.heroDescriptionEn || '',
        heroDescription_hi: data.heroDescriptionHi || '',

        pillarsLabel_en: data.pillarsLabelEn || '',
        pillarsLabel_hi: data.pillarsLabelHi || '',
        pillarsHeading_en: data.pillarsHeadingEn || '',
        pillarsHeading_hi: data.pillarsHeadingHi || '',
        pillarsSubtitle_en: data.pillarsSubtitleEn || '',
        pillarsSubtitle_hi: data.pillarsSubtitleHi || '',

        // Convert relational lists from JSON response
        coreValues: (data.coreValues || []).map((v: any) => ({
          id: v.id,
          title_en: v.title_en || v.titleEn || '',
          title_hi: v.title_hi || v.titleHi || '',
          description_en: v.description_en || v.descriptionEn || '',
          description_hi: v.description_hi || v.descriptionHi || '',
        })),

        practiceLabel_en: data.practiceLabelEn || '',
        practiceLabel_hi: data.practiceLabelHi || '',
        practiceHeading_en: data.practiceHeadingEn || '',
        practiceHeading_hi: data.practiceHeadingHi || '',
        practiceSubtitle_en: data.practiceSubtitleEn || '',
        practiceSubtitle_hi: data.practiceSubtitleHi || '',

        practiceParagraphs_en: (data.practiceParagraphs || [])
          .map((p: any) => p.paragraph_en || '')
          .filter((p: string) => p !== ''),
        practiceParagraphs_hi: (data.practiceParagraphs || [])
          .map((p: any) => p.paragraph_hi || '')
          .filter((p: string) => p !== '')
      };

      setCoreValuesData(mappedData);
      showToast('Successfully synchronized backend database values!', 'success');
    } catch (err) {
      console.warn('Backend server connection failed. Utilizing offline fallback dataset.', err);
      setCoreValuesData(FALLBACK_CORE_VALUES_DATA);
      showToast('Could not connect to database. Local fallback active.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoreValuesData();
  }, []);

  // Standard backend updates calling POST /core-values
  const handleSaveSection = async (side: 'en' | 'hi', sectionKey: string) => {
    setSavingSide({ side, section: sectionKey });
    try {
      // Dynamic payload building based on selected side (English / Hindi)
      const payload: Record<string, any> = { lang: side };

      if (sectionKey === 'hero') {
        if (side === 'en') {
          payload.heroHeading = coreValuesData.heroHeading_en;
          payload.heroDescription = coreValuesData.heroDescription_en;
        } else {
          payload.heroHeading = coreValuesData.heroHeading_hi;
          payload.heroDescription = coreValuesData.heroDescription_hi;
        }
      } else if (sectionKey === 'pillars') {
        if (side === 'en') {
          payload.pillarsLabel = coreValuesData.pillarsLabel_en;
          payload.pillarsHeading = coreValuesData.pillarsHeading_en;
          payload.pillarsSubtitle = coreValuesData.pillarsSubtitle_en;
        } else {
          payload.pillarsLabel = coreValuesData.pillarsLabel_hi;
          payload.pillarsHeading = coreValuesData.pillarsHeading_hi;
          payload.pillarsSubtitle = coreValuesData.pillarsSubtitle_hi;
        }
      } else if (sectionKey === 'practice') {
        if (side === 'en') {
          payload.practiceLabel = coreValuesData.practiceLabel_en;
          payload.practiceHeading = coreValuesData.practiceHeading_en;
          payload.practiceSubtitle = coreValuesData.practiceSubtitle_en;
          // Format as required by backend schema helper
          payload.practiceParagraphs = coreValuesData.practiceParagraphs_en;
        } else {
          payload.practiceLabel = coreValuesData.practiceLabel_hi;
          payload.practiceHeading = coreValuesData.practiceHeading_hi;
          payload.practiceSubtitle = coreValuesData.practiceSubtitle_hi;
          payload.practiceParagraphs = coreValuesData.practiceParagraphs_hi;
        }
      }

      // Format core values payload inside the transactions
      payload.coreValues = coreValuesData.coreValues.map(v => ({
        title: side === 'en' ? v.title_en : v.title_hi,
        description: side === 'en' ? v.description_en : v.description_hi
      }));

      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Server update transaction failed');
      }

      showToast(`Successfully saved ${side === 'en' ? 'English' : 'Hindi'} section content to backend!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Server update failed. Modifications applied to local state.', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // ============================================
  // CORE VALUE PILLARS - ADD / DELETE OPERATIONS
  // ============================================
  const handleAddCoreValue = () => {
    if (!newValue.title_en && !newValue.title_hi) {
      showToast('Please specify a title in English or Hindi', 'error');
      return;
    }

    const valueObject: CoreValue = {
      id: `temp-${Date.now()}`,
      title_en: newValue.title_en,
      title_hi: newValue.title_hi,
      description_en: newValue.description_en,
      description_hi: newValue.description_hi
    };

    setCoreValuesData(prev => ({
      ...prev,
      coreValues: [...prev.coreValues, valueObject]
    }));

    setNewValue({ title_en: '', title_hi: '', description_en: '', description_hi: '' });
    showToast('Value added locally. Click save button in section to commit to database!', 'success');
  };

  const handleDeleteCoreValue = (id: number | string, index: number) => {
    setCoreValuesData(prev => ({
      ...prev,
      coreValues: prev.coreValues.filter((_, idx) => idx !== index)
    }));
    showToast('Item deleted locally. Remember to click Save on this section to commit changes!', 'warning');
  };

  // ============================================
  // PRACTICE PARAGRAPHS - ADD / DELETE OPERATIONS
  // ============================================
  const handleAddParagraph = (side: 'en' | 'hi') => {
    if (side === 'en') {
      if (!newParagraphEn.trim()) return;
      setCoreValuesData(prev => ({
        ...prev,
        practiceParagraphs_en: [...prev.practiceParagraphs_en, newParagraphEn.trim()]
      }));
      setNewParagraphEn('');
    } else {
      if (!newParagraphHi.trim()) return;
      setCoreValuesData(prev => ({
        ...prev,
        practiceParagraphs_hi: [...prev.practiceParagraphs_hi, newParagraphHi.trim()]
      }));
      setNewParagraphHi('');
    }
    showToast('Paragraph added locally. Remember to click Save in this section!', 'success');
  };

  const handleDeleteParagraph = (side: 'en' | 'hi', index: number) => {
    if (side === 'en') {
      setCoreValuesData(prev => ({
        ...prev,
        practiceParagraphs_en: prev.practiceParagraphs_en.filter((_, idx) => idx !== index)
      }));
    } else {
      setCoreValuesData(prev => ({
        ...prev,
        practiceParagraphs_hi: prev.practiceParagraphs_hi.filter((_, idx) => idx !== index)
      }));
    }
    showToast('Paragraph removed locally.', 'warning');
  };

  // Handlers for side-by-side modifications
  const handleMainChange = (key: keyof CoreValuesData, value: any) => {
    setCoreValuesData(prev => ({ ...prev, [key]: value }));
  };

  const handleValueItemChange = (index: number, key: keyof CoreValue, value: string) => {
    setCoreValuesData(prev => {
      const updated = [...prev.coreValues];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, coreValues: updated };
    });
  };

  const handleParagraphValueChange = (side: 'en' | 'hi', index: number, value: string) => {
    setCoreValuesData(prev => {
      if (side === 'en') {
        const updated = [...prev.practiceParagraphs_en];
        updated[index] = value;
        return { ...prev, practiceParagraphs_en: updated };
      } else {
        const updated = [...prev.practiceParagraphs_hi];
        updated[index] = value;
        return { ...prev, practiceParagraphs_hi: updated };
      }
    });
  };

  const tabs = [
    { id: 'hero' as TabType, name: 'Hero Banner', icon: FileText, desc: 'Introductory headings and description metrics' },
    { id: 'values' as TabType, name: 'Guiding Pillars', icon: Shield, desc: 'Define key pillars, ethics, and statements' },
    { id: 'practice' as TabType, name: 'Practice / Everyday', icon: BookOpen, desc: 'Institutional application processes and stories' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center max-w-sm w-full border border-gray-100">
          <Loader2 className="h-10 w-10 animate-spin text-[#631012] mb-4" />
          <h3 className="text-lg font-bold text-[#171717]">Loading Core Values...</h3>
          <p className="text-xs text-[#171717]/60 text-center mt-2">
            Fetching institutional core values. In case of timeouts, secure local fallbacks will load automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col font-sans text-[#171717]">
      {/* Dynamic Alerts matched to requested layouts */}
      {toast.show && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce shadow-2xl rounded-xl p-4 max-w-md flex items-center gap-3 border bg-white">
          {toast.type === 'success' && <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />}
          {toast.type === 'error' && <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0" />}
          <div>
            <p className="text-sm font-bold text-gray-900">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Maroon Banner Header matching historical layouts */}
      <div className="bg-[#631012] text-white py-6 px-4 sm:px-8 border-b-4 border-[#171717] shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
              <Heart size={28} className="text-white fill-white/20" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider">Core Values Console</h1>
              <p className="text-xs text-white/70 font-medium">Bilingual Content Management (English / हिन्दी)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-black/20 px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live API Connection
            </div>
            <button
              onClick={fetchCoreValuesData}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              Sync Database
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Workspace Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Tabs (History Style) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs font-extrabold text-[#171717]/40 uppercase tracking-widest mb-3 px-2">Portal Navigation</p>
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all flex items-start gap-3 border ${
                        isActive
                          ? 'bg-[#631012]/5 border-[#631012] text-[#631012] shadow-sm font-semibold'
                          : 'bg-transparent border-transparent text-gray-600 hover:bg-gray-50 hover:text-[#171717]'
                      }`}
                    >
                      <Icon size={20} className={`mt-0.5 ${isActive ? 'text-[#631012]' : 'text-gray-400'}`} />
                      <div>
                        <p className="text-sm font-bold leading-none">{tab.name}</p>
                        <p className="text-[11px] text-gray-400 font-medium mt-1">{tab.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
              <p className="text-xs font-semibold text-gray-500">System Mode</p>
              <div className="mt-2.5 py-2 px-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center gap-2">
                <Globe size={14} className="text-[#631012]" />
                <span className="text-xs font-bold text-gray-700">Dual-Language Active</span>
              </div>
            </div>
          </div>

          {/* Form Content Panel */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* HERO SECTION TAB */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Hero Banner Introduction</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure landing headlines and secondary descriptions across both languages side-by-side.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      
                      {/* English Hero Form */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Language Version</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Heading (English)</label>
                          <input
                            type="text"
                            value={coreValuesData.heroHeading_en}
                            onChange={(e) => handleMainChange('heroHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="Our Core Values"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Description (English)</label>
                          <textarea
                            rows={4}
                            value={coreValuesData.heroDescription_en}
                            onChange={(e) => handleMainChange('heroDescription_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="English description guidelines..."
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveSection('en', 'hero')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'hero' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Hero
                          </button>
                        </div>
                      </div>

                      {/* Hindi Hero Form */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Language Version (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Heading (Hindi)</label>
                          <input
                            type="text"
                            value={coreValuesData.heroHeading_hi}
                            onChange={(e) => handleMainChange('heroHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="हमारे मूल मूल्य"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Description (Hindi)</label>
                          <textarea
                            rows={4}
                            value={coreValuesData.heroDescription_hi}
                            onChange={(e) => handleMainChange('heroDescription_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="हिंदी मार्गदर्शन मूल्य..."
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveSection('hi', 'hero')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'hero' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Hero
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GUIDING PILLARS TAB */}
            {activeTab === 'values' && (
              <div className="space-y-8">
                {/* 1. Pill Titles side-by-side config */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Guiding Principles main headers</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure section-wide labels and headings mapping to institutional principles.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* English parameters */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Pillars Headline</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Pillars Label Tag</label>
                          <input
                            type="text"
                            value={coreValuesData.pillarsLabel_en}
                            onChange={(e) => handleMainChange('pillarsLabel_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="Six Pillars"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Pillars Main Heading</label>
                          <input
                            type="text"
                            value={coreValuesData.pillarsHeading_en}
                            onChange={(e) => handleMainChange('pillarsHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-bold"
                            placeholder="Our Guiding Principles"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Pillars Subtitle Details</label>
                          <textarea
                            rows={3}
                            value={coreValuesData.pillarsSubtitle_en}
                            onChange={(e) => handleMainChange('pillarsSubtitle_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="The foundation of our institutional excellence..."
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveSection('en', 'pillars')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'pillars' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Pillars Header
                          </button>
                        </div>
                      </div>

                      {/* Hindi parameters */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Pillars Headline (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Pillars Label Tag (Hindi)</label>
                          <input
                            type="text"
                            value={coreValuesData.pillarsLabel_hi}
                            onChange={(e) => handleMainChange('pillarsLabel_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="छह स्तंभ"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Pillars Main Heading (Hindi)</label>
                          <input
                            type="text"
                            value={coreValuesData.pillarsHeading_hi}
                            onChange={(e) => handleMainChange('pillarsHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-bold"
                            placeholder="हमारे मार्गदर्शक सिद्धांत"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Pillars Subtitle Details (Hindi)</label>
                          <textarea
                            rows={3}
                            value={coreValuesData.pillarsSubtitle_hi}
                            onChange={(e) => handleMainChange('pillarsSubtitle_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="हमारी संस्थागत उत्कृष्टता और नैतिक नेतृत्व की नींव..."
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveSection('hi', 'pillars')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'pillars' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Pillars Header
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Core Value items list side-by-side with individual edits */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Dynamic Core Values List</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure individual ethics and standard objectives. Hindi and English details are processed side-by-side.</p>
                  </div>

                  <div className="p-6 space-y-6 divide-y divide-gray-100">
                    {coreValuesData.coreValues.map((value, index) => (
                      <div key={value.id || index} className={`pt-6 ${index === 0 ? 'pt-0' : ''} space-y-4`}>
                        <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="text-xs font-black uppercase tracking-wider text-[#631012] bg-[#631012]/10 px-2.5 py-1 rounded">Ethical Value Pillar #{index + 1}</span>
                          <button
                            onClick={() => handleDeleteCoreValue(value.id!, index)}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold"
                          >
                            <Trash2 size={14} />
                            Remove Value
                          </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {/* English Column Item */}
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Value Title (English)</label>
                              <input
                                type="text"
                                value={value.title_en}
                                onChange={(e) => handleValueItemChange(index, 'title_en', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Statement description (English)</label>
                              <textarea
                                rows={3}
                                value={value.description_en}
                                onChange={(e) => handleValueItemChange(index, 'description_en', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white leading-relaxed"
                              />
                            </div>
                          </div>

                          {/* Hindi Column Item */}
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Value Title (Hindi)</label>
                              <input
                                type="text"
                                value={value.title_hi}
                                onChange={(e) => handleValueItemChange(index, 'title_hi', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Statement description (Hindi)</label>
                              <textarea
                                rows={3}
                                value={value.description_hi}
                                onChange={(e) => handleValueItemChange(index, 'description_hi', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white leading-relaxed"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Insert Goal form card (History styled) */}
                    <div className="bg-gray-50/70 p-5 rounded-xl border-2 border-dashed border-gray-200 mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-[#631012]" />
                        <h3 className="text-xs font-extrabold text-[#171717] uppercase tracking-wider">Add New Core Value Pillar</h3>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* New Goal English details */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider">English Language Details</p>
                          <input
                            type="text"
                            value={newValue.title_en}
                            onChange={(e) => setNewValue({ ...newValue, title_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="Title English (e.g. Integrity)"
                          />
                          <textarea
                            rows={3}
                            value={newValue.description_en}
                            onChange={(e) => setNewValue({ ...newValue, description_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Description statement English..."
                          />
                        </div>

                        {/* New Goal Hindi details */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Hindi Language Details (हिन्दी)</p>
                          <input
                            type="text"
                            value={newValue.title_hi}
                            onChange={(e) => setNewValue({ ...newValue, title_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="शीर्षक हिंदी (जैसे सत्यनिष्ठा)"
                          />
                          <textarea
                            rows={3}
                            value={newValue.description_hi}
                            onChange={(e) => setNewValue({ ...newValue, description_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="विवरण हिंदी..."
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <p className="text-[10px] text-gray-500 font-semibold italic">
                          * Ensure to hit Save on the respective heading columns after adding items to commit to database.
                        </p>
                        <button
                          onClick={handleAddCoreValue}
                          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                        >
                          <Plus size={14} />
                          Insert Value Element
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* IN PRACTICE TAB */}
            {activeTab === 'practice' && (
              <div className="space-y-8">
                {/* 1. Practice Headers configuration */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Practice Section Headings</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure action statements, titles, and subtitle headers side-by-side.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* English configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Practice Heading</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section tag label</label>
                          <input
                            type="text"
                            value={coreValuesData.practiceLabel_en}
                            onChange={(e) => handleMainChange('practiceLabel_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="In Practice"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section Headline</label>
                          <input
                            type="text"
                            value={coreValuesData.practiceHeading_en}
                            onChange={(e) => handleMainChange('practiceHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-bold"
                            placeholder="Living Our Principles"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section Subtitle Explanation</label>
                          <textarea
                            rows={3}
                            value={coreValuesData.practiceSubtitle_en}
                            onChange={(e) => handleMainChange('practiceSubtitle_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="How we translate our core beliefs into action..."
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveSection('en', 'practice')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'practice' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Practice
                          </button>
                        </div>
                      </div>

                      {/* Hindi configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Practice Heading (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section tag label (Hindi)</label>
                          <input
                            type="text"
                            value={coreValuesData.practiceLabel_hi}
                            onChange={(e) => handleMainChange('practiceLabel_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="व्यवहार में"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section Headline (Hindi)</label>
                          <input
                            type="text"
                            value={coreValuesData.practiceHeading_hi}
                            onChange={(e) => handleMainChange('practiceHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-bold"
                            placeholder="हमारे सिद्धांतों को जीना"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section Subtitle Explanation (Hindi)</label>
                          <textarea
                            rows={3}
                            value={coreValuesData.practiceSubtitle_hi}
                            onChange={(e) => handleMainChange('practiceSubtitle_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="हम अपने मूल विश्वासों को रोजमर्रा की कार्रवाई में कैसे बदलते हैं..."
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveSection('hi', 'practice')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'practice' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Practice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Practice paragraphs dynamic list */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Dynamic Practice Paragraphs</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure structural descriptions and real-world stories mapping bilingually.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* English paragraphs stack */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-1.5 border-b pb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Paragraph Stack</span>
                        </div>

                        <div className="space-y-3">
                          {coreValuesData.practiceParagraphs_en.map((para, index) => (
                            <div key={index} className="flex gap-2">
                              <textarea
                                rows={2}
                                value={para}
                                onChange={(e) => handleParagraphValueChange('en', index, e.target.value)}
                                className="w-full p-2 border text-xs rounded bg-white"
                              />
                              <button
                                onClick={() => handleDeleteParagraph('en', index)}
                                className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors self-start"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Paragraph form English */}
                        <div className="flex gap-2 pt-2">
                          <input
                            type="text"
                            value={newParagraphEn}
                            onChange={(e) => setNewParagraphEn(e.target.value)}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Add new English paragraph details..."
                          />
                          <button
                            onClick={() => handleAddParagraph('en')}
                            className="bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                          >
                            <Plus size={14} /> Add
                          </button>
                        </div>
                      </div>

                      {/* Hindi paragraphs stack */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-1.5 border-b pb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Paragraph Stack</span>
                        </div>

                        <div className="space-y-3">
                          {coreValuesData.practiceParagraphs_hi.map((para, index) => (
                            <div key={index} className="flex gap-2">
                              <textarea
                                rows={2}
                                value={para}
                                onChange={(e) => handleParagraphValueChange('hi', index, e.target.value)}
                                className="w-full p-2 border text-xs rounded bg-white"
                              />
                              <button
                                onClick={() => handleDeleteParagraph('hi', index)}
                                className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors self-start"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Paragraph form Hindi */}
                        <div className="flex gap-2 pt-2">
                          <input
                            type="text"
                            value={newParagraphHi}
                            onChange={(e) => setNewParagraphHi(e.target.value)}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="नया हिंदी विवरण पैराग्राफ जोड़ें..."
                          />
                          <button
                            onClick={() => handleAddParagraph('hi')}
                            className="bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                          >
                            <Plus size={14} /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. High Fidelity Practice preview */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-[#FBFBFB]">
                    <p className="text-xs font-black text-[#171717]/40 uppercase tracking-wider">Practice Section Live Presentation Preview</p>
                  </div>
                  <div className="p-6">
                    <div className="bg-white p-6 rounded-xl border-2 border-dashed border-[#171717]/15 space-y-6">
                      <div className="text-center">
                        <span className="text-sm font-semibold text-[#631012] uppercase tracking-wide">
                          {coreValuesData.practiceLabel_en} / {coreValuesData.practiceLabel_hi}
                        </span>
                        <h3 className="text-2xl font-bold text-[#171717] mt-2 mb-2">
                          {coreValuesData.practiceHeading_en || 'Guiding Principle Practice Heading'}
                        </h3>
                        <p className="text-xs text-gray-500 italic">
                          {coreValuesData.practiceHeading_hi}
                        </p>
                        <p className="text-sm text-[#171717]/60 mt-3">
                          {coreValuesData.practiceSubtitle_en}
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-[#631012]/5 to-[#8B1518]/5 p-6 rounded-lg border border-[#631012]/20">
                        <div className="space-y-4">
                          {coreValuesData.practiceParagraphs_en.map((paragraph, index) => (
                            <div key={index} className="border-b pb-2 last:border-b-0 border-gray-100 last:pb-0">
                              <p className="text-sm sm:text-base text-[#171717]/80 leading-relaxed font-medium">
                                {paragraph}
                              </p>
                              {coreValuesData.practiceParagraphs_hi[index] && (
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                  {coreValuesData.practiceParagraphs_hi[index]}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}