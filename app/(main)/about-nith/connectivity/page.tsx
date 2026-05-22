'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  MapPin,
  Plus,
  Trash2,
  FileText,
  Train,
  Plane,
  Car,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
} from 'lucide-react';

interface TravelOption {
  id?: number | string;
  icon: string;
  title_en: string;
  title_hi: string;
  nearestPointLabel_en: string;
  nearestPointLabel_hi: string;
  nearestPointValue_en: string;
  nearestPointValue_hi: string;
  distanceLabel_en: string;
  distanceLabel_hi: string;
  distanceValue_en: string;
  distanceValue_hi: string;
  travelTime_en: string;
  travelTime_hi: string;
  servicesLabel_en: string;
  servicesLabel_hi: string;
  servicesParagraphs_en: string[];
  servicesParagraphs_hi: string[];
}

interface ConnectivityData {
  // Hero Section
  heroHeading_en: string;
  heroHeading_hi: string;
  heroDescription_en: string;
  heroDescription_hi: string;

  // Travel Options Header
  travelOptionsLabel_en: string;
  travelOptionsLabel_hi: string;
  travelOptionsHeading_en: string;
  travelOptionsHeading_hi: string;
  travelOptionsSubtitle_en: string;
  travelOptionsSubtitle_hi: string;

  // Options List
  travelOptions: TravelOption[];
}

type TabType = 'hero' | 'travel';

const API_BASE = 'http://localhost:4000/connectivity';

// Robust bilingual offline fallbacks in case the server is down
const FALLBACK_CONNECTIVITY_DATA: ConnectivityData = {
  heroHeading_en: 'Connectivity',
  heroHeading_hi: 'कनेक्टिविटी',
  heroDescription_en:
    'Well connected to all major cities through rail, air, and road networks — situated amidst serene hills while offering excellent accessibility.',
  heroDescription_hi:
    'रेल, हवाई और सड़क नेटवर्क के माध्यम से सभी प्रमुख शहरों से अच्छी तरह से जुड़ा हुआ है - उत्कृष्ट पहुंच प्रदान करते हुए शांत पहाड़ियों के बीच स्थित है।',
  
  travelOptionsLabel_en: 'Travel Options',
  travelOptionsLabel_hi: 'यात्रा के विकल्प',
  travelOptionsHeading_en: 'How to Reach',
  travelOptionsHeading_hi: 'कैसे पहुँचें',
  travelOptionsSubtitle_en: 'Multiple convenient options to reach our campus',
  travelOptionsSubtitle_hi: 'हमारे परिसर तक पहुँचने के लिए कई सुविधाजनक विकल्प',
  
  travelOptions: [
    {
      id: 1,
      icon: 'train',
      title_en: 'By Rail',
      title_hi: 'रेल द्वारा',
      nearestPointLabel_en: 'Nearest Point:',
      nearestPointLabel_hi: 'निकटतम बिंदु:',
      nearestPointValue_en: 'Una Railway Station (Himachal Pradesh)',
      nearestPointValue_hi: 'ऊना रेलवे स्टेशन (हिमाचल प्रदेश)',
      distanceLabel_en: 'Distance:',
      distanceLabel_hi: 'दूरी:',
      distanceValue_en: '85 km from Campus',
      distanceValue_hi: 'परिसर से 85 किमी',
      travelTime_en: 'Approx. 2 Hours',
      travelTime_hi: 'लगभग 2 घंटे',
      servicesLabel_en: 'Local Transport:',
      servicesLabel_hi: 'स्थानीय परिवहन:',
      servicesParagraphs_en: [
        'Regular taxi services are available directly from Una to Hamirpur.',
        'Frequent local buses run on this highway route during daytime.'
      ],
      servicesParagraphs_hi: [
        'ऊना से हमीरपुर के लिए सीधी नियमित टैक्सी सेवाएँ उपलब्ध हैं।',
        'दिन के समय इस राजमार्ग मार्ग पर लगातार स्थानीय बसें चलती हैं।'
      ]
    },
    {
      id: 2,
      icon: 'plane',
      title_en: 'By Air',
      title_hi: 'हवाई मार्ग द्वारा',
      nearestPointLabel_en: 'Nearest Airport:',
      nearestPointLabel_hi: 'निकटतम हवाई अड्डा:',
      nearestPointValue_en: 'Gaggal Airport, Dharamshala',
      nearestPointValue_hi: 'गग्गल हवाई अड्डा, धर्मशाला',
      distanceLabel_en: 'Distance:',
      distanceLabel_hi: 'दूरी:',
      distanceValue_en: '80 km from Campus',
      distanceValue_hi: 'परिसर से 80 किमी',
      travelTime_en: 'Approx. 2.5 Hours',
      travelTime_hi: 'लगभग 2.5 घंटे',
      servicesLabel_en: 'Connecting Services:',
      servicesLabel_hi: 'कनेक्टिंग सेवाएं:',
      servicesParagraphs_en: [
        'Pre-paid taxi cabs can be booked from the arrival terminal.',
        'Direct flight connections are available from Delhi.'
      ],
      servicesParagraphs_hi: [
        'आगमन टर्मिनल से प्रीपेड टैक्सी कैब बुक की जा सकती हैं।',
        'दिल्ली से सीधी उड़ान कनेक्टिविटी उपलब्ध है।'
      ]
    }
  ],
};

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export default function ConnectivityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [savingSide, setSavingSide] = useState<{ side: 'en' | 'hi' | string | null; section: string | null }>({
    side: null,
    section: null,
  });

  const [connectivityData, setConnectivityData] = useState<ConnectivityData>(FALLBACK_CONNECTIVITY_DATA);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Add Item Temp States
  const [newOption, setNewOption] = useState({
    icon: 'train',
    title_en: '',
    title_hi: '',
    nearestPointLabel_en: 'Nearest Point:',
    nearestPointLabel_hi: 'निकटतम बिंदु:',
    nearestPointValue_en: '',
    nearestPointValue_hi: '',
    distanceLabel_en: 'Distance:',
    distanceLabel_hi: 'दूरी:',
    distanceValue_en: '',
    distanceValue_hi: '',
    travelTime_en: '',
    travelTime_hi: '',
    servicesLabel_en: 'Available Services:',
    servicesLabel_hi: 'उपलब्ध सेवाएं:',
  });

  const [newServiceParaEn, setNewServiceParaEn] = useState('');
  const [newServiceParaHi, setNewServiceParaHi] = useState('');

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Synchronize dynamic elements on load
  const fetchConnectivityData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();

      const mappedData: ConnectivityData = {
        heroHeading_en: data.heroHeadingEn || '',
        heroHeading_hi: data.heroHeadingHi || '',
        heroDescription_en: data.heroDescriptionEn || '',
        heroDescription_hi: data.heroDescriptionHi || '',
        travelOptionsLabel_en: data.travelOptionsLabelEn || '',
        travelOptionsLabel_hi: data.travelOptionsLabelHi || '',
        travelOptionsHeading_en: data.travelOptionsHeadingEn || '',
        travelOptionsHeading_hi: data.travelOptionsHeadingHi || '',
        travelOptionsSubtitle_en: data.travelOptionsSubtitleEn || '',
        travelOptionsSubtitle_hi: data.travelOptionsSubtitleHi || '',
        
        travelOptions: (data.travelOptions || []).map((opt: any) => ({
          id: opt.id,
          icon: opt.icon || 'train',
          title_en: opt.title_en || opt.titleEn || '',
          title_hi: opt.title_hi || opt.titleHi || '',
          nearestPointLabel_en: opt.np_label_en || opt.nearestPointLabelEn || '',
          nearestPointLabel_hi: opt.np_label_hi || opt.nearestPointLabelHi || '',
          nearestPointValue_en: opt.np_val_en || opt.nearestPointValueEn || '',
          nearestPointValue_hi: opt.np_val_hi || opt.nearestPointValueHi || '',
          distanceLabel_en: opt.d_label_en || opt.distanceLabelEn || '',
          distanceLabel_hi: opt.d_label_hi || opt.distanceLabelHi || '',
          distanceValue_en: opt.d_val_en || opt.distanceValueEn || '',
          distanceValue_hi: opt.d_val_hi || opt.distanceValueHi || '',
          travelTime_en: opt.time_en || opt.travelTimeEn || '',
          travelTime_hi: opt.time_hi || opt.travelTimeHi || '',
          servicesLabel_en: opt.s_label_en || opt.servicesLabelEn || '',
          servicesLabel_hi: opt.s_label_hi || opt.servicesLabelHi || '',
          servicesParagraphs_en: (opt.servicesParagraphs || [])
            .map((p: any) => p.paragraph_en || p)
            .filter((p: any) => p && typeof p === 'string'),
          servicesParagraphs_hi: (opt.servicesParagraphs || [])
            .map((p: any) => p.paragraph_hi || p)
            .filter((p: any) => p && typeof p === 'string'),
        })),
      };

      setConnectivityData(mappedData);
      showToast('Successfully synchronized connection database details!', 'success');
    } catch (err) {
      console.warn('Backend server down. Active local backup data.', err);
      setConnectivityData(FALLBACK_CONNECTIVITY_DATA);
      showToast('Could not reach backend database. Offline fallback mode active.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectivityData();
  }, []);

  // Standard backend post transaction
  const handleSaveSection = async (side: 'en' | 'hi', sectionKey: string) => {
    setSavingSide({ side, section: sectionKey });
    try {
      const payload: Record<string, any> = { lang: side };

      if (sectionKey === 'hero') {
        if (side === 'en') {
          payload.heroHeading = connectivityData.heroHeading_en;
          payload.heroDescription = connectivityData.heroDescription_en;
        } else {
          payload.heroHeading = connectivityData.heroHeading_hi;
          payload.heroDescription = connectivityData.heroDescription_hi;
        }
      } else if (sectionKey === 'travel_headers') {
        if (side === 'en') {
          payload.travelOptionsLabel = connectivityData.travelOptionsLabel_en;
          payload.travelOptionsHeading = connectivityData.travelOptionsHeading_en;
          payload.travelOptionsSubtitle = connectivityData.travelOptionsSubtitle_en;
        } else {
          payload.travelOptionsLabel = connectivityData.travelOptionsLabel_hi;
          payload.travelOptionsHeading = connectivityData.travelOptionsHeading_hi;
          payload.travelOptionsSubtitle = connectivityData.travelOptionsSubtitle_hi;
        }
      }

      // Map global option sets aligned to the side language 
      payload.travelOptions = connectivityData.travelOptions.map((opt) => ({
        icon: opt.icon,
        title: side === 'en' ? opt.title_en : opt.title_hi,
        nearestPointLabel: side === 'en' ? opt.nearestPointLabel_en : opt.nearestPointLabel_hi,
        nearestPointValue: side === 'en' ? opt.nearestPointValue_en : opt.nearestPointValue_hi,
        distanceLabel: side === 'en' ? opt.distanceLabel_en : opt.distanceLabel_hi,
        distanceValue: side === 'en' ? opt.distanceValue_en : opt.distanceValue_hi,
        travelTime: side === 'en' ? opt.travelTime_en : opt.travelTime_hi,
        servicesLabel: side === 'en' ? opt.servicesLabel_en : opt.servicesLabel_hi,
        servicesParagraphs: side === 'en' ? opt.servicesParagraphs_en : opt.servicesParagraphs_hi,
      }));

      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Transaction query failed');
      showToast(`Saved ${side === 'en' ? 'English' : 'Hindi'} values to the backend server!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Database server offline. Applied updates to current local context.', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // ============================================
  // DYNAMIC TRAVEL OPTIONS - ADD / REMOVE LOGIC
  // ============================================
  const handleAddTravelOption = () => {
    if (!newOption.title_en && !newOption.title_hi) {
      showToast('Specify at least a Title in English or Hindi', 'error');
      return;
    }

    const valueObject: TravelOption = {
      id: `temp-${Date.now()}`,
      icon: newOption.icon,
      title_en: newOption.title_en,
      title_hi: newOption.title_hi,
      nearestPointLabel_en: newOption.nearestPointLabel_en,
      nearestPointLabel_hi: newOption.nearestPointLabel_hi,
      nearestPointValue_en: newOption.nearestPointValue_en,
      nearestPointValue_hi: newOption.nearestPointValue_hi,
      distanceLabel_en: newOption.distanceLabel_en,
      distanceLabel_hi: newOption.distanceLabel_hi,
      distanceValue_en: newOption.distanceValue_en,
      distanceValue_hi: newOption.distanceValue_hi,
      travelTime_en: newOption.travelTime_en,
      travelTime_hi: newOption.travelTime_hi,
      servicesLabel_en: newOption.servicesLabel_en,
      servicesLabel_hi: newOption.servicesLabel_hi,
      servicesParagraphs_en: [],
      servicesParagraphs_hi: [],
    };

    setConnectivityData((prev) => ({
      ...prev,
      travelOptions: [...prev.travelOptions, valueObject],
    }));

    setNewOption({
      icon: 'train',
      title_en: '',
      title_hi: '',
      nearestPointLabel_en: 'Nearest Point:',
      nearestPointLabel_hi: 'निकटतम बिंदु:',
      nearestPointValue_en: '',
      nearestPointValue_hi: '',
      distanceLabel_en: 'Distance:',
      distanceLabel_hi: 'दूरी:',
      distanceValue_en: '',
      distanceValue_hi: '',
      travelTime_en: '',
      travelTime_hi: '',
      servicesLabel_en: 'Available Services:',
      servicesLabel_hi: 'उपलब्ध सेवाएं:',
    });

    showToast('Travel option added locally! Remember to save either language column below.', 'success');
  };

  const handleDeleteTravelOption = (index: number) => {
    setConnectivityData((prev) => ({
      ...prev,
      travelOptions: prev.travelOptions.filter((_, idx) => idx !== index),
    }));
    showToast('Removed option locally. Save the section to apply changes.', 'warning');
  };

  // ============================================
  // CONNECTING SERVICES PARAGRAPHS - ADD / REMOVE
  // ============================================
  const handleAddServiceParagraph = (optionIdx: number, side: 'en' | 'hi') => {
    if (side === 'en') {
      if (!newServiceParaEn.trim()) return;
      setConnectivityData((prev) => {
        const copy = [...prev.travelOptions];
        copy[optionIdx].servicesParagraphs_en = [
          ...copy[optionIdx].servicesParagraphs_en,
          newServiceParaEn.trim(),
        ];
        return { ...prev, travelOptions: copy };
      });
      setNewServiceParaEn('');
    } else {
      if (!newServiceParaHi.trim()) return;
      setConnectivityData((prev) => {
        const copy = [...prev.travelOptions];
        copy[optionIdx].servicesParagraphs_hi = [
          ...copy[optionIdx].servicesParagraphs_hi,
          newServiceParaHi.trim(),
        ];
        return { ...prev, travelOptions: copy };
      });
      setNewServiceParaHi('');
    }
  };

  const handleDeleteServiceParagraph = (optionIdx: number, paraIdx: number, side: 'en' | 'hi') => {
    setConnectivityData((prev) => {
      const copy = [...prev.travelOptions];
      if (side === 'en') {
        copy[optionIdx].servicesParagraphs_en = copy[optionIdx].servicesParagraphs_en.filter(
          (_, idx) => idx !== paraIdx
        );
      } else {
        copy[optionIdx].servicesParagraphs_hi = copy[optionIdx].servicesParagraphs_hi.filter(
          (_, idx) => idx !== paraIdx
        );
      }
      return { ...prev, travelOptions: copy };
    });
  };

  // State Updaters
  const handleMainChange = (key: keyof ConnectivityData, value: any) => {
    setConnectivityData((prev) => ({ ...prev, [key]: value }));
  };

  const handleOptionFieldChange = (optionIdx: number, key: keyof TravelOption, value: any) => {
    setConnectivityData((prev) => {
      const copy = [...prev.travelOptions];
      copy[optionIdx] = { ...copy[optionIdx], [key]: value };
      return { ...prev, travelOptions: copy };
    });
  };

  const handleOptionParagraphChange = (optionIdx: number, paraIdx: number, side: 'en' | 'hi', value: string) => {
    setConnectivityData((prev) => {
      const copy = [...prev.travelOptions];
      if (side === 'en') {
        copy[optionIdx].servicesParagraphs_en[paraIdx] = value;
      } else {
        copy[optionIdx].servicesParagraphs_hi[paraIdx] = value;
      }
      return { ...prev, travelOptions: copy };
    });
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'train':
        return <Train className="h-5 w-5" />;
      case 'plane':
        return <Plane className="h-5 w-5" />;
      case 'car':
        return <Car className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const tabs = [
    { id: 'hero' as TabType, name: 'Hero Banner', icon: FileText, desc: 'Introductory headlines, geo descriptions and titles' },
    { id: 'travel' as TabType, name: 'Travel Options', icon: MapPin, desc: 'Setup custom rail, plane, and road routes' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center max-w-sm w-full border border-gray-100 font-sans text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#631012] mb-4" />
          <h3 className="text-lg font-bold text-[#171717]">Loading Connectivity Data...</h3>
          <p className="text-xs text-[#171717]/60 mt-2">
            Fetching institutional commute resources. In case of timeout issues, solid local offline back-ups will initiate automatically.
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
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider">Campus Reachability Portal</h1>
              <p className="text-xs text-white/70 font-medium">Bilingual Connection Resources Console (English / हिन्दी)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-black/20 px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live API Mode
            </div>
            <button
              onClick={fetchConnectivityData}
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
                    <h2 className="text-base font-extrabold text-[#171717]">Hero Section Banner</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure major heading values and geo location statements across both channels side-by-side.</p>
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
                            value={connectivityData.heroHeading_en}
                            onChange={(e) => handleMainChange('heroHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="Getting Here"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Description (English)</label>
                          <textarea
                            rows={4}
                            value={connectivityData.heroDescription_en}
                            onChange={(e) => handleMainChange('heroDescription_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="Detailed reachability rules in English..."
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
                            value={connectivityData.heroHeading_hi}
                            onChange={(e) => handleMainChange('heroHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="हम तक कैसे पहुँचे"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Description (Hindi)</label>
                          <textarea
                            rows={4}
                            value={connectivityData.heroDescription_hi}
                            onChange={(e) => handleMainChange('heroDescription_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="विवरण हिंदी में..."
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

            {/* TRAVEL OPTIONS TAB */}
            {activeTab === 'travel' && (
              <div className="space-y-8">
                
                {/* 1. Dynamic Travel Option Headers */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Travel Category Section Titles</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure primary labels, headlines and subtitles displayed above transport grid modules.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* English labels configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Category Titles</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section tag label</label>
                          <input
                            type="text"
                            value={connectivityData.travelOptionsLabel_en}
                            onChange={(e) => handleMainChange('travelOptionsLabel_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="Travel Options"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section Headline</label>
                          <input
                            type="text"
                            value={connectivityData.travelOptionsHeading_en}
                            onChange={(e) => handleMainChange('travelOptionsHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-bold"
                            placeholder="How to Reach"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section Subtitle Explanation</label>
                          <textarea
                            rows={3}
                            value={connectivityData.travelOptionsSubtitle_en}
                            onChange={(e) => handleMainChange('travelOptionsSubtitle_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="Multiple convenient options to reach our campus..."
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveSection('en', 'travel_headers')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'travel_headers' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Header Info
                          </button>
                        </div>
                      </div>

                      {/* Hindi labels configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Category Titles (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section tag label (Hindi)</label>
                          <input
                            type="text"
                            value={connectivityData.travelOptionsLabel_hi}
                            onChange={(e) => handleMainChange('travelOptionsLabel_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                            placeholder="यात्रा के विकल्प"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section Headline (Hindi)</label>
                          <input
                            type="text"
                            value={connectivityData.travelOptionsHeading_hi}
                            onChange={(e) => handleMainChange('travelOptionsHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-bold"
                            placeholder="कैसे पहुँचे"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Section Subtitle Explanation (Hindi)</label>
                          <textarea
                            rows={3}
                            value={connectivityData.travelOptionsSubtitle_hi}
                            onChange={(e) => handleMainChange('travelOptionsSubtitle_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                            placeholder="हमारे परिसर तक पहुँचने के लिए कई सुविधाजनक विकल्प..."
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveSection('hi', 'travel_headers')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'travel_headers' ? (
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

                {/* 2. Side-by-Side bilingual dynamic options list */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Dynamic Commute Channels List</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure distinct transport cards (rail, road, air). All entries are edited side-by-side.</p>
                  </div>

                  <div className="p-6 space-y-12 divide-y divide-gray-100">
                    {connectivityData.travelOptions.map((option, optionIdx) => (
                      <div key={option.id || optionIdx} className={`pt-8 ${optionIdx === 0 ? 'pt-0' : ''} space-y-4`}>
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-3">
                            <span className="p-2 bg-white rounded-lg text-[#631012] border shadow-sm">
                              {getIconComponent(option.icon)}
                            </span>
                            <span className="text-xs font-black uppercase tracking-wider text-[#631012]">
                              Commute Option #{optionIdx + 1} ({option.title_en || 'Unnamed'})
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteTravelOption(optionIdx)}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold"
                          >
                            <Trash2 size={14} />
                            Delete Card
                          </button>
                        </div>

                        {/* Layout Icon Selector & Option titles */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="text-xs font-bold text-gray-400 block mb-1 uppercase">Commute Icon Type</label>
                            <select
                              value={option.icon}
                              onChange={(e) => handleOptionFieldChange(optionIdx, 'icon', e.target.value)}
                              className="w-full p-2 border rounded-lg text-xs bg-white font-bold"
                            >
                              <option value="train">Train / Rail</option>
                              <option value="plane">Plane / Air</option>
                              <option value="car">Car / Road / Cab</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Title (English)</label>
                            <input
                              type="text"
                              value={option.title_en}
                              onChange={(e) => handleOptionFieldChange(optionIdx, 'title_en', e.target.value)}
                              className="w-full p-2 border rounded-lg text-xs font-bold bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Title (Hindi)</label>
                            <input
                              type="text"
                              value={option.title_hi}
                              onChange={(e) => handleOptionFieldChange(optionIdx, 'title_hi', e.target.value)}
                              className="w-full p-2 border rounded-lg text-xs font-bold bg-white"
                            />
                          </div>
                        </div>

                        {/* Location point parameters */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
                          {/* English column configuration details */}
                          <div className="space-y-4 bg-gray-50/30 p-4 rounded-xl border border-gray-100">
                            <div className="text-[10px] font-bold text-[#631012] tracking-wider uppercase">English Route Settings</div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[11px] font-bold text-gray-500 block mb-1">Nearest Pt. Tag</label>
                                <input
                                  type="text"
                                  value={option.nearestPointLabel_en}
                                  onChange={(e) => handleOptionFieldChange(optionIdx, 'nearestPointLabel_en', e.target.value)}
                                  className="w-full p-2 border rounded text-xs bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-gray-500 block mb-1">Nearest Pt. Value</label>
                                <input
                                  type="text"
                                  value={option.nearestPointValue_en}
                                  onChange={(e) => handleOptionFieldChange(optionIdx, 'nearestPointValue_en', e.target.value)}
                                  className="w-full p-2 border rounded text-xs bg-white font-medium"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[11px] font-bold text-gray-500 block mb-1">Distance Tag</label>
                                <input
                                  type="text"
                                  value={option.distanceLabel_en}
                                  onChange={(e) => handleOptionFieldChange(optionIdx, 'distanceLabel_en', e.target.value)}
                                  className="w-full p-2 border rounded text-xs bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-gray-500 block mb-1">Distance Value</label>
                                <input
                                  type="text"
                                  value={option.distanceValue_en}
                                  onChange={(e) => handleOptionFieldChange(optionIdx, 'distanceValue_en', e.target.value)}
                                  className="w-full p-2 border rounded text-xs bg-white font-medium"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[11px] font-bold text-gray-500 block mb-1">Commute Time Estimate</label>
                                <input
                                  type="text"
                                  value={option.travelTime_en}
                                  onChange={(e) => handleOptionFieldChange(optionIdx, 'travelTime_en', e.target.value)}
                                  className="w-full p-2 border rounded text-xs bg-white text-[#631012] font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-gray-500 block mb-1">Services Title Tag</label>
                                <input
                                  type="text"
                                  value={option.servicesLabel_en}
                                  onChange={(e) => handleOptionFieldChange(optionIdx, 'servicesLabel_en', e.target.value)}
                                  className="w-full p-2 border rounded text-xs bg-white"
                                />
                              </div>
                            </div>

                            {/* Services Paragraph English entries */}
                            <div className="space-y-2.5 pt-2 border-t">
                              <label className="text-[11px] font-black text-[#171717] uppercase block">Route Services / Guidelines</label>
                              {option.servicesParagraphs_en.map((para, paraIdx) => (
                                <div key={paraIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={para}
                                    onChange={(e) => handleOptionParagraphChange(optionIdx, paraIdx, 'en', e.target.value)}
                                    className="w-full p-2 border rounded text-xs bg-white text-gray-600"
                                  />
                                  <button
                                    onClick={() => handleDeleteServiceParagraph(optionIdx, paraIdx, 'en')}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))}

                              {/* Form Add paragraph English */}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={newServiceParaEn}
                                  onChange={(e) => setNewServiceParaEn(e.target.value)}
                                  placeholder="Add details/frequency..."
                                  className="w-full p-2 border rounded text-xs bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddServiceParagraph(optionIdx, 'en')}
                                  className="bg-gray-800 hover:bg-black text-white px-3 py-2 rounded text-xs font-bold shrink-0 transition-all"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Hindi column configuration details */}
                          <div className="space-y-4 bg-amber-50/10 p-4 rounded-xl border border-amber-100/50">
                            <div className="text-[10px] font-bold text-amber-800 tracking-wider uppercase">Hindi Route Settings (हिन्दी)</div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[11px] font-bold text-gray-500 block mb-1">निकटतम स्थान टैग</label>
                                <input
                                  type="text"
                                  value={option.nearestPointLabel_hi}
                                  onChange={(e) => handleOptionFieldChange(optionIdx, 'nearestPointLabel_hi', e.target.value)}
                                  className="w-full p-2 border rounded text-xs bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-gray-500 block mb-1">निकटतम स्थान नाम</label>
                                <input
                                  type="text"
                                  value={option.nearestPointValue_hi}
                                  onChange={(e) => handleOptionFieldChange(optionIdx, 'nearestPointValue_hi', e.target.value)}
                                  className="w-full p-2 border rounded text-xs bg-white font-medium"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[11px] font-bold text-gray-500 block mb-1">दूरी टैग</label>
                                <input
                                  type="text"
                                  value={option.distanceLabel_hi}
                                  onChange={(e) => handleOptionFieldChange(optionIdx, 'distanceLabel_hi', e.target.value)}
                                  className="w-full p-2 border rounded text-xs bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-gray-500 block mb-1">दूरी वैल्यू</label>
                                <input
                                  type="text"
                                  value={option.distanceValue_hi}
                                  onChange={(e) => handleOptionFieldChange(optionIdx, 'distanceValue_hi', e.target.value)}
                                  className="w-full p-2 border rounded text-xs bg-white font-medium"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[11px] font-bold text-gray-500 block mb-1">यात्रा समय वैल्यू</label>
                                <input
                                  type="text"
                                  value={option.travelTime_hi}
                                  onChange={(e) => handleOptionFieldChange(optionIdx, 'travelTime_hi', e.target.value)}
                                  className="w-full p-2 border rounded text-xs bg-white text-[#631012] font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-gray-500 block mb-1">सेवाएं शीर्षक टैग</label>
                                <input
                                  type="text"
                                  value={option.servicesLabel_hi}
                                  onChange={(e) => handleOptionFieldChange(optionIdx, 'servicesLabel_hi', e.target.value)}
                                  className="w-full p-2 border rounded text-xs bg-white"
                                />
                              </div>
                            </div>

                            {/* Services Paragraph Hindi entries */}
                            <div className="space-y-2.5 pt-2 border-t">
                              <label className="text-[11px] font-black text-[#171717] uppercase block">मार्ग सेवाएं / हिंदी विवरण</label>
                              {option.servicesParagraphs_hi.map((para, paraIdx) => (
                                <div key={paraIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={para}
                                    onChange={(e) => handleOptionParagraphChange(optionIdx, paraIdx, 'hi', e.target.value)}
                                    className="w-full p-2 border rounded text-xs bg-white text-gray-600"
                                  />
                                  <button
                                    onClick={() => handleDeleteServiceParagraph(optionIdx, paraIdx, 'hi')}
                                    className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))}

                              {/* Form Add paragraph Hindi */}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={newServiceParaHi}
                                  onChange={(e) => setNewServiceParaHi(e.target.value)}
                                  placeholder="विवरण/आवृत्ति जोड़ें..."
                                  className="w-full p-2 border rounded text-xs bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddServiceParagraph(optionIdx, 'hi')}
                                  className="bg-gray-800 hover:bg-black text-white px-3 py-2 rounded text-xs font-bold shrink-0 transition-all"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Insert Travel Option Form */}
                    <div className="bg-gray-50/70 p-5 rounded-xl border-2 border-dashed border-gray-200 mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-[#631012]" />
                        <h3 className="text-xs font-extrabold text-[#171717] uppercase tracking-wider">Create New Commute Card</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">Icon Selection</label>
                          <select
                            value={newOption.icon}
                            onChange={(e) => setNewOption({ ...newOption, icon: e.target.value })}
                            className="w-full p-2 border rounded-lg text-xs bg-white font-bold"
                          >
                            <option value="train">Train / Rail</option>
                            <option value="plane">Plane / Air</option>
                            <option value="car">Car / Road / Cab</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">Title (English)</label>
                          <input
                            type="text"
                            value={newOption.title_en}
                            onChange={(e) => setNewOption({ ...newOption, title_en: e.target.value })}
                            className="w-full p-2 border rounded-lg text-xs bg-white"
                            placeholder="Ex: By Road"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">Title (Hindi)</label>
                          <input
                            type="text"
                            value={newOption.title_hi}
                            onChange={(e) => setNewOption({ ...newOption, title_hi: e.target.value })}
                            className="w-full p-2 border rounded-lg text-xs bg-white"
                            placeholder="जैसे: सड़क मार्ग"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider">English Initial Fields</p>
                          <input
                            type="text"
                            value={newOption.nearestPointValue_en}
                            onChange={(e) => setNewOption({ ...newOption, nearestPointValue_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Nearest Station Value (Una, Dharamshala)"
                          />
                          <input
                            type="text"
                            value={newOption.distanceValue_en}
                            onChange={(e) => setNewOption({ ...newOption, distanceValue_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Distance Value (85 km from Campus)"
                          />
                          <input
                            type="text"
                            value={newOption.travelTime_en}
                            onChange={(e) => setNewOption({ ...newOption, travelTime_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Time Value (Approx. 2 Hours)"
                          />
                        </div>

                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Hindi Initial Fields (हिन्दी)</p>
                          <input
                            type="text"
                            value={newOption.nearestPointValue_hi}
                            onChange={(e) => setNewOption({ ...newOption, nearestPointValue_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="निकटतम रेलवे स्टेशन/हवाईअड्डे का नाम"
                          />
                          <input
                            type="text"
                            value={newOption.distanceValue_hi}
                            onChange={(e) => setNewOption({ ...newOption, distanceValue_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="दूरी मूल्य (परिसर से दूरी)"
                          />
                          <input
                            type="text"
                            value={newOption.travelTime_hi}
                            onChange={(e) => setNewOption({ ...newOption, travelTime_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="यात्रा अवधि"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <p className="text-[10px] text-gray-500 font-semibold italic">
                          * Click the 'Insert Route Card' button to add locally, then click Save at the bottom to commit to the server.
                        </p>
                        <button
                          type="button"
                          onClick={handleAddTravelOption}
                          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                        >
                          <Plus size={14} />
                          Insert Route Card
                        </button>
                      </div>
                    </div>

                    {/* Bilingual English / Hindi Column Saves */}
                    <div className="pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleSaveSection('en', 'travel_headers')}
                        disabled={savingSide.side !== null}
                        className="w-full bg-[#631012] hover:bg-[#7a1214] text-white py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow"
                      >
                        {savingSide.side === 'en' && savingSide.section === 'travel_headers' ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          <Save size={14} />
                        )}
                        Commit All English Cards To Server
                      </button>
                      <button
                        onClick={() => handleSaveSection('hi', 'travel_headers')}
                        disabled={savingSide.side !== null}
                        className="w-full bg-[#631012] hover:bg-[#7a1214] text-white py-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow"
                      >
                        {savingSide.side === 'hi' && savingSide.section === 'travel_headers' ? (
                          <Loader2 className="animate-spin w-4 h-4" />
                        ) : (
                          <Save size={14} />
                        )}
                        Commit All Hindi Cards To Server
                      </button>
                    </div>

                  </div>
                </div>

                {/* Travel Option Interactive Preview */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-[#FBFBFB]">
                    <p className="text-xs font-black text-[#171717]/40 uppercase tracking-wider">Travel Section Live Presentation Preview</p>
                  </div>
                  <div className="p-6">
                    <div className="text-center mb-8">
                      <span className="text-sm font-semibold text-[#631012] uppercase tracking-wide">
                        {connectivityData.travelOptionsLabel_en} / {connectivityData.travelOptionsLabel_hi}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-[#171717] mt-2 mb-2">
                        {connectivityData.travelOptionsHeading_en}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium italic mb-2">
                        {connectivityData.travelOptionsHeading_hi}
                      </p>
                      <p className="text-sm text-[#171717]/60 max-w-xl mx-auto">
                        {connectivityData.travelOptionsSubtitle_en}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {connectivityData.travelOptions.map((option, idx) => (
                        <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                          <div className="bg-gradient-to-r from-[#631012] to-[#8B1518] text-white p-4 flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                              {getIconComponent(option.icon)}
                            </div>
                            <div>
                              <h4 className="font-bold text-sm sm:text-base leading-tight">
                                {option.title_en}
                              </h4>
                              <p className="text-[10px] text-white/70 italic leading-none mt-1">
                                {option.title_hi}
                              </p>
                            </div>
                          </div>

                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                              <div className="flex justify-between text-xs border-b pb-1.5 border-gray-100">
                                <div>
                                  <span className="text-gray-400 font-bold block">{option.nearestPointLabel_en}</span>
                                  <span className="text-[#171717] font-semibold">{option.nearestPointValue_en}</span>
                                </div>
                                {option.nearestPointValue_hi && (
                                  <div className="text-right">
                                    <span className="text-gray-400 font-bold block">{option.nearestPointLabel_hi}</span>
                                    <span className="text-gray-500 font-medium">{option.nearestPointValue_hi}</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between text-xs border-b pb-1.5 border-gray-100">
                                <div>
                                  <span className="text-gray-400 font-bold block">{option.distanceLabel_en}</span>
                                  <span className="text-[#171717] font-semibold">{option.distanceValue_en}</span>
                                </div>
                                {option.distanceValue_hi && (
                                  <div className="text-right">
                                    <span className="text-gray-400 font-bold block">{option.distanceLabel_hi}</span>
                                    <span className="text-gray-500 font-medium">{option.distanceValue_hi}</span>
                                  </div>
                                )}
                              </div>

                              <div className="inline-block px-3 py-1 bg-[#631012]/10 text-[#631012] rounded-full text-xs font-bold">
                                {option.travelTime_en} / {option.travelTime_hi}
                              </div>
                            </div>

                            <div className="pt-2">
                              <p className="text-xs font-extrabold text-[#171717] mb-2 uppercase tracking-wide">
                                {option.servicesLabel_en} / {option.servicesLabel_hi}
                              </p>
                              <div className="space-y-1">
                                {option.servicesParagraphs_en.map((p, pIdx) => (
                                  <div key={pIdx} className="text-xs text-gray-600 leading-relaxed border-l-2 border-[#631012] pl-2 mb-1.5">
                                    <p className="font-medium text-gray-800">{p}</p>
                                    {option.servicesParagraphs_hi[pIdx] && (
                                      <p className="text-gray-500 italic mt-0.5">{option.servicesParagraphs_hi[pIdx]}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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