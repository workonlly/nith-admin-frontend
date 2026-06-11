'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Building2,
  Plus,
  Trash2,
  MapPin,
  FileText,
  Info,
  List,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
} from 'lucide-react';

interface CityInfoCard {
  id?: number | string;
  label_en: string;
  label_hi: string;
  value_en: string;
  value_hi: string;
}

interface CityDescription {
  id?: number | string;
  description_en: string;
  description_hi: string;
}

interface CityData {
  // Hero & Introduction
  heading_en: string;
  heading_hi: string;
  introduction_en: string;
  introduction_hi: string;

  // Overview Main Info
  overviewTitle_en: string;
  overviewTitle_hi: string;
  overviewSubtitle_en: string;
  overviewSubtitle_hi: string;

  // Linked items
  infoCards: CityInfoCard[];
  descriptions: CityDescription[];
}

type TabType = 'hero' | 'overview' | 'descriptions';

const API_BASE = `http://${process.env.NEXT_PUBLIC_URL || 'localhost:4000'}/about-city`;

// High-fidelity fallback database values in case the server is unreachable
const FALLBACK_CITY_DATA: CityData = {
  heading_en: 'About Hamirpur',
  heading_hi: 'हमीरपुर के बारे में',
  introduction_en:
    'Set in the peaceful hills of Himachal Pradesh, Hamirpur offers a clean, calm, and welcoming environment for all who visit NIT Hamirpur. With its friendly community and natural beauty, the city creates the perfect backdrop for learning, growth, and new beginnings.',
  introduction_hi:
    'हिमाचल प्रदेश की शांत पहाड़ियों में बसा हमीरपुर एनआईटी हमीरपुर आने वाले सभी लोगों के लिए एक स्वच्छ, शांत और स्वागत योग्य वातावरण प्रदान करता है। अपने अनुकूल समुदाय और प्राकृतिक सुंदरता के साथ, यह शहर सीखने, विकास और नई शुरुआत के लिए आदर्श माहौल प्रदान करता है।',
  
  overviewTitle_en: 'City Overview',
  overviewTitle_hi: 'शहर का अवलोकन',
  overviewSubtitle_en: "Essential information about Hamirpur's location and characteristics",
  overviewSubtitle_hi: 'हमीरपुर की स्थिति और विशेषताओं के बारे में आवश्यक जानकारी',
  
  infoCards: [
    { id: 1, label_en: 'Location', label_hi: 'स्थान', value_en: 'Himachal Pradesh, India', value_hi: 'हिमाचल प्रदेश, भारत' },
    { id: 2, label_en: 'Altitude', label_hi: 'ऊंचाई', value_en: '785 metres', value_hi: '785 मीटर' },
    { id: 3, label_en: 'Connectivity', label_hi: 'कनेक्टिविटी', value_en: 'NH-3 & NH-103', value_hi: 'एनएच-3 और एनएच-103' },
  ],
  descriptions: [
    {
      id: 1,
      description_en: 'Hamirpur, the district headquarter, is situated at an altitude of 785 meters. It is well connected to surrounding regions by safe national highways.',
      description_hi: 'जिला मुख्यालय हमीरपुर 785 मीटर की ऊंचाई पर स्थित है। यह सुरक्षित राष्ट्रीय राजमार्गों द्वारा आसपास के क्षेत्रों से अच्छी तरह जुड़ा हुआ है।',
    },
    {
      id: 2,
      description_en: 'The town boasts excellent literacy rates and houses multiple key state educational institutions, offering a secure educational hub.',
      description_hi: 'यह शहर उत्कृष्ट साक्षरता दर का दावा करता है और यहां कई प्रमुख राज्य शैक्षणिक संस्थान हैं, जो एक सुरक्षित शैक्षणिक केंद्र प्रदान करते हैं।',
    }
  ],
};

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export default function AboutCityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // High-fidelity saving tracker matching previous implementation style
  const [savingSide, setSavingSide] = useState<{ side: 'en' | 'hi' | string | null; section: string | null }>({
    side: null,
    section: null,
  });

  const [cityData, setCityData] = useState<CityData>(FALLBACK_CITY_DATA);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Add Item Temp States
  const [newCard, setNewCard] = useState({
    label_en: '',
    label_hi: '',
    value_en: '',
    value_hi: '',
  });

  const [newDescEn, setNewDescEn] = useState('');
  const [newDescHi, setNewDescHi] = useState('');

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Synchronize on load
  const fetchCityData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();

      // Retrieve main singleton info and fallback if row doesn't exist
      const mappedData: CityData = {
        heading_en: data.heading_en || '',
        heading_hi: data.heading_hi || '',
        introduction_en: data.introduction_en || '',
        introduction_hi: data.introduction_hi || '',
        
        overviewTitle_en: data.overview_title_en || '',
        overviewTitle_hi: data.overview_title_hi || '',
        overviewSubtitle_en: data.overview_subtitle_en || '',
        overviewSubtitle_hi: data.overview_subtitle_hi || '',
        
        infoCards: (data.infoCards || []).map((card: any) => ({
          id: card.id,
          label_en: card.label_en || '',
          label_hi: card.label_hi || '',
          value_en: card.value_en || '',
          value_hi: card.value_hi || '',
        })),

        descriptions: (data.descriptions || []).map((desc: any) => ({
          id: desc.id,
          description_en: desc.description_en || '',
          description_hi: desc.description_hi || '',
        })),
      };

      setCityData(mappedData);
      showToast('Successfully synchronized city database information!', 'success');
    } catch (err) {
      console.warn('Backend server down. Active local backup data.', err);
      setCityData(FALLBACK_CITY_DATA);
      showToast('Using local offline backup dataset.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCityData();
  }, []);

  // Standard singleton put transaction
  const handleSaveMain = async (side: 'en' | 'hi', sectionKey: string) => {
    setSavingSide({ side, section: sectionKey });
    try {
      const payload: Record<string, any> = { lang: side };

      if (sectionKey === 'hero') {
        if (side === 'en') {
          payload.heading = cityData.heading_en;
          payload.introduction = cityData.introduction_en;
        } else {
          payload.heading = cityData.heading_hi;
          payload.introduction = cityData.introduction_hi;
        }
      } else if (sectionKey === 'overview_headers') {
        if (side === 'en') {
          payload.overviewTitle = cityData.overviewTitle_en;
          payload.overviewSubtitle = cityData.overviewSubtitle_en;
        } else {
          payload.overviewTitle = cityData.overviewTitle_hi;
          payload.overviewSubtitle = cityData.overviewSubtitle_hi;
        }
      }

      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Query transaction failed');
      showToast(`Saved ${side === 'en' ? 'English' : 'Hindi'} values to the backend server!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Applied updates to current local context.', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // ============================================
  // INFO CARDS - ADD / UPDATE / DELETE LOGIC
  // ============================================
  const handleAddInfoCard = async () => {
    if (!newCard.label_en && !newCard.label_hi) {
      showToast('Please specify a label', 'error');
      return;
    }
    setSavingSide({ side: 'all', section: 'addCard' });
    try {
      const payload = {
        label_en: newCard.label_en,
        label_hi: newCard.label_hi,
        value_en: newCard.value_en,
        value_hi: newCard.value_hi,
      };

      const response = await fetch(`${API_BASE}/info-cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      const added = await response.json();
      setCityData((prev) => ({
        ...prev,
        infoCards: [...prev.infoCards, added],
      }));
      setNewCard({ label_en: '', label_hi: '', value_en: '', value_hi: '' });
      showToast('Successfully added new Info Card!', 'success');
    } catch (err) {
      const mockId = `temp-${Date.now()}`;
      setCityData((prev) => ({
        ...prev,
        infoCards: [...prev.infoCards, { id: mockId, ...newCard }],
      }));
      setNewCard({ label_en: '', label_hi: '', value_en: '', value_hi: '' });
      showToast('Offline Mode: Card added locally.', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleUpdateInfoCard = async (id: number | string, index: number, side: 'en' | 'hi') => {
    setSavingSide({ side, section: `card-${id}` });
    const item = cityData.infoCards[index];
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const payload = {
        lang: side,
        label: side === 'en' ? item.label_en : item.label_hi,
        value: side === 'en' ? item.value_en : item.value_hi,
      };

      const response = await fetch(`${API_BASE}/info-cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      showToast(`Successfully saved ${side === 'en' ? 'English' : 'Hindi'} values of Card #${index + 1}!`, 'success');
    } catch (err) {
      showToast('Applied offline updates locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleDeleteInfoCard = async (id: number | string, index: number) => {
    setSavingSide({ side: 'all', section: `delete-card-${id}` });
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const response = await fetch(`${API_BASE}/info-cards/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      setCityData((prev) => ({
        ...prev,
        infoCards: prev.infoCards.filter((_, idx) => idx !== index),
      }));
      showToast('Deleted Info Card from server', 'success');
    } catch (err) {
      setCityData((prev) => ({
        ...prev,
        infoCards: prev.infoCards.filter((_, idx) => idx !== index),
      }));
      showToast('Removed card locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // ============================================
  // DESCRIPTION PARAGRAPHS - ADD / UPDATE / DELETE
  // ============================================
  const handleAddDescription = async () => {
    if (!newDescEn && !newDescHi) {
      showToast('Please write some content to add', 'error');
      return;
    }
    setSavingSide({ side: 'all', section: 'addDesc' });
    try {
      const payload = {
        description_en: newDescEn,
        description_hi: newDescHi,
      };

      const response = await fetch(`${API_BASE}/descriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      const added = await response.json();
      setCityData((prev) => ({
        ...prev,
        descriptions: [...prev.descriptions, added],
      }));
      setNewDescEn('');
      setNewDescHi('');
      showToast('Successfully added description paragraph!', 'success');
    } catch (err) {
      const mockId = `temp-${Date.now()}`;
      setCityData((prev) => ({
        ...prev,
        descriptions: [...prev.descriptions, { id: mockId, description_en: newDescEn, description_hi: newDescHi }],
      }));
      setNewDescEn('');
      setNewDescHi('');
      showToast('Offline Mode: Paragraph added locally.', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleUpdateDescription = async (id: number | string, index: number, side: 'en' | 'hi') => {
    setSavingSide({ side, section: `desc-${id}` });
    const item = cityData.descriptions[index];
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const payload = {
        lang: side,
        description: side === 'en' ? item.description_en : item.description_hi,
      };

      const response = await fetch(`${API_BASE}/descriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      showToast(`Successfully saved ${side === 'en' ? 'English' : 'Hindi'} values of Paragraph #${index + 1}!`, 'success');
    } catch (err) {
      showToast('Applied offline updates locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleDeleteDescription = async (id: number | string, index: number) => {
    setSavingSide({ side: 'all', section: `delete-desc-${id}` });
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const response = await fetch(`${API_BASE}/descriptions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      setCityData((prev) => ({
        ...prev,
        descriptions: prev.descriptions.filter((_, idx) => idx !== index),
      }));
      showToast('Deleted paragraph from server', 'success');
    } catch (err) {
      setCityData((prev) => ({
        ...prev,
        descriptions: prev.descriptions.filter((_, idx) => idx !== index),
      }));
      showToast('Removed paragraph locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // State Updaters
  const handleMainFieldChange = (key: keyof CityData, value: any) => {
    setCityData((prev) => ({ ...prev, [key]: value }));
  };

  const handleInfoCardChange = (idx: number, key: keyof CityInfoCard, value: string) => {
    setCityData((prev) => {
      const copy = [...prev.infoCards];
      copy[idx] = { ...copy[idx], [key]: value };
      return { ...prev, infoCards: copy };
    });
  };

  const handleDescriptionChange = (idx: number, key: keyof CityDescription, value: string) => {
    setCityData((prev) => {
      const copy = [...prev.descriptions];
      copy[idx] = { ...copy[idx], [key]: value };
      return { ...prev, descriptions: copy };
    });
  };

  const tabs = [
    { id: 'hero' as TabType, name: 'Hero Banner', icon: FileText, desc: 'Introductory headlines, city welcome stories and titles' },
    { id: 'overview' as TabType, name: 'City Overview', icon: Building2, desc: 'Setup overview descriptions and custom info tags' },
    { id: 'descriptions' as TabType, name: 'Detailed Paragraphs', icon: List, desc: 'Bilingual historical descriptions and general facts' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center max-w-sm w-full border border-gray-100 font-sans text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#631012] mb-4" />
          <h3 className="text-lg font-bold text-[#171717]">Loading City Data...</h3>
          <p className="text-xs text-[#171717]/60 mt-2">
            Fetching Hamirpur city details. In case of timeout issues, solid local offline back-ups will initiate automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col font-sans text-[#171717]">
      {/* Dynamic Notification Toasts */}
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

      {/* Top Banner Header */}
      <div className="bg-[#631012] text-white py-6 px-4 sm:px-8 border-b-4 border-[#171717] shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
              <MapPin size={28} className="text-white fill-white/20" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider">About City Portal</h1>
              <p className="text-xs text-white/70 font-medium">Bilingual Regional Information Console (English / हिन्दी)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-black/20 px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live API Mode
            </div>
            <button
              onClick={fetchCityData}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              Sync Database
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs font-extrabold text-[#171717]/40 uppercase tracking-widest mb-3 px-2">Navigation</p>
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
              <p className="text-xs font-semibold text-gray-500">Dual Language</p>
              <div className="mt-2.5 py-2 px-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center gap-2">
                <Globe size={14} className="text-[#631012]" />
                <span className="text-xs font-bold text-gray-700">English / हिन्दी Side-by-Side</span>
              </div>
            </div>
          </div>

          {/* Core Content Form Canvas */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* HERO TAB */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">City Welcome Banner & Intro</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure major heading values and welcoming introduction statements across both channels side-by-side.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      
                      {/* English Hero configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Language Version</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Heading (English)</label>
                          <input
                            type="text"
                            value={cityData.heading_en}
                            onChange={(e) => handleMainFieldChange('heading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="About Hamirpur"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Introduction paragraph (English)</label>
                          <textarea
                            rows={6}
                            value={cityData.introduction_en}
                            onChange={(e) => handleMainFieldChange('introduction_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="Set detailed introduction text in English..."
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('en', 'hero')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'hero' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Welcome
                          </button>
                        </div>
                      </div>

                      {/* Hindi Hero configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Language Version (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Heading (Hindi)</label>
                          <input
                            type="text"
                            value={cityData.heading_hi}
                            onChange={(e) => handleMainFieldChange('heading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="हमीरपुर के बारे में"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Introduction paragraph (Hindi)</label>
                          <textarea
                            rows={6}
                            value={cityData.introduction_hi}
                            onChange={(e) => handleMainFieldChange('introduction_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="हिंदी में विस्तृत परिचय विवरण सेट करें..."
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('hi', 'hero')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'hero' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Welcome
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CITY OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                
                {/* 1. Overview main headers */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Overview Section Headers</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure titles and subtitles displayed above the info tag grid modules.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* English configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Titles</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Overview Title</label>
                          <input
                            type="text"
                            value={cityData.overviewTitle_en}
                            onChange={(e) => handleMainFieldChange('overviewTitle_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="City Overview"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Overview Subtitle</label>
                          <textarea
                            rows={3}
                            value={cityData.overviewSubtitle_en}
                            onChange={(e) => handleMainFieldChange('overviewSubtitle_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="Essential information about Hamirpur..."
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('en', 'overview_headers')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'overview_headers' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Header Info
                          </button>
                        </div>
                      </div>

                      {/* Hindi configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Titles (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Overview Title (Hindi)</label>
                          <input
                            type="text"
                            value={cityData.overviewTitle_hi}
                            onChange={(e) => handleMainFieldChange('overviewTitle_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="शहर का अवलोकन"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Overview Subtitle (Hindi)</label>
                          <textarea
                            rows={3}
                            value={cityData.overviewSubtitle_hi}
                            onChange={(e) => handleMainFieldChange('overviewSubtitle_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="हमीरपुर की स्थिति के बारे में आवश्यक जानकारी..."
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('hi', 'overview_headers')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'overview_headers' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Header Info
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Side-by-Side bilingual dynamic info cards list */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Dynamic Info Tag Cards</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure specific info tags (Location, Altitude, etc.). All entries are edited side-by-side.</p>
                  </div>

                  <div className="p-6 space-y-8 divide-y divide-gray-100">
                    {cityData.infoCards.map((card, index) => (
                      <div key={card.id || index} className={`pt-6 ${index === 0 ? 'pt-0' : ''} space-y-4`}>
                        <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="text-xs font-black uppercase tracking-wider text-[#631012] bg-[#631012]/10 px-2.5 py-1 rounded">Info Tag #{index + 1}</span>
                          <button
                            onClick={() => handleDeleteInfoCard(card.id!, index)}
                            disabled={savingSide.side !== null}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold"
                          >
                            {savingSide.section === `delete-card-${card.id}` ? (
                              <Loader2 className="animate-spin w-3 h-3" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Delete Tag
                          </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {/* English column item */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider">English Parameters</p>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Tag Label (English)</label>
                              <input
                                type="text"
                                value={card.label_en}
                                onChange={(e) => handleInfoCardChange(index, 'label_en', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Tag Value (English)</label>
                              <input
                                type="text"
                                value={card.value_en}
                                onChange={(e) => handleInfoCardChange(index, 'value_en', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white font-semibold"
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleUpdateInfoCard(card.id!, index, 'en')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'en' && savingSide.section === `card-${card.id}` ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save English
                              </button>
                            </div>
                          </div>

                          {/* Hindi column item */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Hindi Parameters (हिन्दी)</p>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">टैग लेबल (Hindi)</label>
                              <input
                                type="text"
                                value={card.label_hi}
                                onChange={(e) => handleInfoCardChange(index, 'label_hi', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">टैग वैल्यू (Hindi)</label>
                              <input
                                type="text"
                                value={card.value_hi}
                                onChange={(e) => handleInfoCardChange(index, 'value_hi', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white font-semibold"
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleUpdateInfoCard(card.id!, index, 'hi')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'hi' && savingSide.section === `card-${card.id}` ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save Hindi
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Insert Info Card Form */}
                    <div className="bg-gray-50/70 p-5 rounded-xl border-2 border-dashed border-gray-200 mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-[#631012]" />
                        <h3 className="text-xs font-extrabold text-[#171717] uppercase tracking-wider">Create New Info Tag Card</h3>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* New Card English details */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider">English Label & Value</p>
                          <input
                            type="text"
                            value={newCard.label_en}
                            onChange={(e) => setNewCard({ ...newCard, label_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="Ex: Area / Population"
                          />
                          <input
                            type="text"
                            value={newCard.value_en}
                            onChange={(e) => setNewCard({ ...newCard, value_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Ex: 1118 sq km"
                          />
                        </div>

                        {/* New Card Hindi details */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Hindi Label & Value (हिन्दी)</p>
                          <input
                            type="text"
                            value={newCard.label_hi}
                            onChange={(e) => setNewCard({ ...newCard, label_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="जैसे: क्षेत्रफल / जनसंख्या"
                          />
                          <input
                            type="text"
                            value={newCard.value_hi}
                            onChange={(e) => setNewCard({ ...newCard, value_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="जैसे: 1118 वर्ग किमी"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleAddInfoCard}
                          disabled={savingSide.side !== null}
                          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                        >
                          {savingSide.section === 'addCard' ? (
                            <Loader2 className="animate-spin w-3.5 h-3.5" />
                          ) : (
                            <Plus size={14} />
                          )}
                          Insert Info Card
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DETAILED PARAGRAPHS TAB */}
            {activeTab === 'descriptions' && (
              <div className="space-y-8">
                
                {/* Side-by-Side bilingual descriptions */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Dynamic Description Paragraphs</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure structural descriptions and regional facts bilingually side-by-side.</p>
                  </div>

                  <div className="p-6 space-y-8 divide-y divide-gray-100">
                    {cityData.descriptions.map((desc, index) => (
                      <div key={desc.id || index} className={`pt-6 ${index === 0 ? 'pt-0' : ''} space-y-4`}>
                        <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="text-xs font-black uppercase tracking-wider text-[#631012] bg-[#631012]/10 px-2.5 py-1 rounded">Paragraph #{index + 1}</span>
                          <button
                            onClick={() => handleDeleteDescription(desc.id!, index)}
                            disabled={savingSide.side !== null}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold"
                          >
                            {savingSide.section === `delete-desc-${desc.id}` ? (
                              <Loader2 className="animate-spin w-3 h-3" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Remove Paragraph
                          </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {/* English column paragraph */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider">English Statement</p>
                            <textarea
                              rows={4}
                              value={desc.description_en}
                              onChange={(e) => handleDescriptionChange(index, 'description_en', e.target.value)}
                              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white leading-relaxed"
                            />
                            <div className="flex justify-end">
                              <button
                                onClick={() => handleUpdateDescription(desc.id!, index, 'en')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'en' && savingSide.section === `desc-${desc.id}` ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save English
                              </button>
                            </div>
                          </div>

                          {/* Hindi column paragraph */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Hindi Statement (हिन्दी)</p>
                            <textarea
                              rows={4}
                              value={desc.description_hi}
                              onChange={(e) => handleDescriptionChange(index, 'description_hi', e.target.value)}
                              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white leading-relaxed"
                            />
                            <div className="flex justify-end">
                              <button
                                onClick={() => handleUpdateDescription(desc.id!, index, 'hi')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'hi' && savingSide.section === `desc-${desc.id}` ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save Hindi
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Insert Paragraph Form */}
                    <div className="bg-gray-50/70 p-5 rounded-xl border-2 border-dashed border-gray-200 mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-[#631012]" />
                        <h3 className="text-xs font-extrabold text-[#171717] uppercase tracking-wider">Add New Bilingual Paragraph</h3>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* New paragraph English */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider">English content description</p>
                          <textarea
                            rows={4}
                            value={newDescEn}
                            onChange={(e) => setNewDescEn(e.target.value)}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Add paragraph details in English..."
                          />
                        </div>

                        {/* New paragraph Hindi */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Hindi content description (हिन्दी)</p>
                          <textarea
                            rows={4}
                            value={newDescHi}
                            onChange={(e) => setNewDescHi(e.target.value)}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="हिंदी में पैराग्राफ का विवरण जोड़ें..."
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleAddDescription}
                          disabled={savingSide.side !== null}
                          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                        >
                          {savingSide.section === 'addDesc' ? (
                            <Loader2 className="animate-spin w-3.5 h-3.5" />
                          ) : (
                            <Plus size={14} />
                          )}
                          Insert Paragraph
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* High-Fidelity Active Preview matches the image aesthetic */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-[#FBFBFB]">
                <p className="text-xs font-black text-[#171717]/40 uppercase tracking-wider">Active Presentation Preview</p>
              </div>
              <div className="p-6 space-y-8">
                {/* Welcome section preview */}
                <div className="bg-gradient-to-r from-[#631012] to-[#8B1518] text-white rounded-xl p-8 shadow-md">
                  <h3 className="text-2xl sm:text-3xl font-black mb-3">
                    {cityData.heading_en} / <span className="text-white/85 font-normal text-xl">{cityData.heading_hi}</span>
                  </h3>
                  <div className="space-y-4 text-white/90 leading-relaxed text-xs sm:text-sm pt-4 border-t border-white/20">
                    <p className="font-light italic">" {cityData.introduction_en} "</p>
                    <p className="font-normal text-right">" {cityData.introduction_hi} "</p>
                  </div>
                </div>

                {/* Info tags and paragraphs overview preview */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6 shadow-sm">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-[#171717]">{cityData.overviewTitle_en}</h4>
                    <p className="text-xs text-gray-500 italic mt-0.5">{cityData.overviewTitle_hi}</p>
                    <p className="text-xs text-gray-400 mt-2">{cityData.overviewSubtitle_en}</p>
                  </div>

                  {/* Grid cards info view */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {cityData.infoCards.map((card, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                        <span className="text-[10px] font-black uppercase text-[#631012] block mb-1">{card.label_en} / {card.label_hi}</span>
                        <span className="text-sm font-bold text-[#171717]">{card.value_en}</span>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{card.value_hi}</p>
                      </div>
                    ))}
                  </div>

                  {/* Custom descriptions block */}
                  <div className="space-y-4 pt-4 border-t">
                    {cityData.descriptions.map((desc, idx) => (
                      <div key={idx} className="border-l-4 border-[#631012] pl-3">
                        <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">{desc.description_en}</p>
                        <p className="text-[11px] sm:text-xs text-gray-500 italic mt-1">{desc.description_hi}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}