'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  History as HistoryIcon,
  Plus,
  Trash2,
  Calendar,
  FileText,
  Award,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
} from 'lucide-react';

interface TimelineEvent {
  id: number | string;
  year: string;
  event_date: string;
  
  // English parameters
  title: string;
  subtitle?: string;
  description: string;

  // Hindi parameters
  title_hi: string;
  subtitle_hi?: string;
  description_hi: string;
}

interface HistoryData {
  // Hero Section (description1 / description1_hi)
  heading: string;
  subtitle: string;
  heading_hi: string;
  subtitle_hi: string;

  // Introduction Section (description2 / description2_hi)
  introText: string;
  initialDepartments: string[];
  introText_hi: string;
  initialDepartments_hi: string[];

  // Timeline
  timelineSectionTitle: string;
  timelineSectionSubtitle: string;
  timelineEvents: TimelineEvent[];

  // Legacy Section (legacy / legacy_hi)
  legacyTitle: string;
  legacyText: string;
  legacyTitle_hi: string;
  legacyText_hi: string;
}

type TabType = 'hero' | 'intro' | 'timeline' | 'legacy';

const API_BASE = `http://${process.env.NEXT_PUBLIC_URL || 'localhost:4000'}/history`;

const FALLBACK_HISTORY_DATA: HistoryData = {
  heading: 'About NIT Hamirpur',
  subtitle: 'A legacy of learning, research, and service',
  heading_hi: 'एनआईटी हमीरपुर के बारे में',
  subtitle_hi: 'सीखने, अनुसंधान और सेवा की एक विरासत',
  introText:
    'NIT Hamirpur has grown into a leading institute with strong academic programs and a vibrant campus culture. Established to deliver high-quality technical education, it has consistently achieved milestones.',
  introText_hi:
    'एनआईटी हमीरpur मजबूत शैक्षणिक कार्यक्रमों और जीवंत परिसर संस्कृति के साथ एक अग्रणी संस्थान के रूप में विकसित हुआ है। उच्च गुणवत्ता वाली तकनीकी शिक्षा प्रदान करने के लिए स्थापित, इसने लगातार मील के पत्थर हासिल किए हैं।',
  initialDepartments: ['Civil Engineering', 'Electrical Engineering', 'Computer Science'],
  initialDepartments_hi: ['सिविल इंजीनियरिंग', 'इलेक्ट्रिकल इंजीनियरिंग', 'कंप्यूटर साइंस'],
  timelineSectionTitle: 'Historical Timeline',
  timelineSectionSubtitle: 'Key milestones in our institutional journey',
  timelineEvents: [
    {
      id: 1,
      year: '1986',
      event_date: '1986-08-01',
      title: 'Foundation Stone',
      subtitle: 'The Beginning',
      description: 'Regional Engineering College (REC) Hamirpur was established to provide technical guidance.',
      title_hi: 'शिलान्यास',
      subtitle_hi: 'शुरुआत',
      description_hi: 'क्षेत्रीय इंजीनियरिंग कॉलेज (आरईसी) हमीरपुर की स्थापना तकनीकी मार्गदर्शन प्रदान करने के लिए की गई थी।',
    },
    {
      id: 2,
      year: '2002',
      event_date: '2002-06-26',
      title: 'Deemed University Status',
      subtitle: 'Elevation of Status',
      description: 'Upgraded to National Institute of Technology (NIT) with Deemed University status.',
      title_hi: 'डीम्ड यूनिवर्सिटी का दर्जा',
      subtitle_hi: 'दर्जे में वृद्धि',
      description_hi: 'डीम्ड यूनिवर्सिटी के दर्जे के साथ राष्ट्रीय प्रौद्योगिकी संस्थान (एनआईटी) में अपग्रेड किया गया।',
    },
  ],
  legacyTitle: 'Our Enduring Legacy',
  legacyText: 'Decades of producing top-tier engineers, innovators, and leaders who shape global technologies with high ethical guidelines.',
  legacyTitle_hi: 'हमारी स्थायी विरासत',
  legacyText_hi: 'दशकों से शीर्ष स्तर के इंजीनियरों, इनोवेटर्स और नेताओं का निर्माण करना जो नैतिक मूल्यों के साथ वैश्विक तकनीकों को आकार देते हैं।',
};

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Tracks loading indicator per save side and section
  const [savingSide, setSavingSide] = useState<{ side: 'en' | 'hi' | string | null; section: string | null }>({
    side: null,
    section: null,
  });

  const [historyData, setHistoryData] = useState<HistoryData>(FALLBACK_HISTORY_DATA);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Add Item Temp States
  const [newEvent, setNewEvent] = useState({
    year: '',
    event_date: '',
    title: '',
    subtitle: '',
    description: '',
    title_hi: '',
    subtitle_hi: '',
    description_hi: '',
  });

  const [newDeptEn, setNewDeptEn] = useState('');
  const [newDeptHi, setNewDeptHi] = useState('');

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Synchronize with live backend database API on mount
  const fetchHistoryData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error(`Server returned status: ${response.status}`);
      const data = await response.json();

      // Retrieve main singleton and timeline data
      const mappedData: HistoryData = {
        heading: data.heading_en || data.description1_heading || 'About NIT Hamirpur',
        subtitle: data.description1_sub || data.description1_subtitle || 'A legacy of learning, research, and service',
        heading_hi: data.heading_hi || data.description1_heading_hi || 'एनआईटी हमीरपुर के बारे में',
        subtitle_hi: data.subtitle_hi || data.description1_subtitle_hi || 'सीखने, अनुसंधान और सेवा की एक विरासत',

        introText: data.description2_text || data.introText || '',
        introText_hi: data.description2_text_hi || data.introText_hi || '',
        
        initialDepartments: Array.isArray(data.initial_departments) 
          ? data.initial_departments 
          : (data.initial_departments ? data.initial_departments.split(',') : []),
        initialDepartments_hi: Array.isArray(data.initial_departments_hi) 
          ? data.initial_departments_hi 
          : (data.initial_departments_hi ? data.initial_departments_hi.split(',') : []),

        timelineSectionTitle: data.timeline_title || 'Timeline',
        timelineSectionSubtitle: data.timeline_subtitle || 'Key milestones in our journey',

        legacyTitle: data.legacy_title || 'Our Enduring Legacy',
        legacyText: data.legacy_text || data.legacy || '',
        legacyTitle_hi: data.legacy_title_hi || 'हमारी स्थायी विरासत',
        legacyText_hi: data.legacy_text_hi || data.legacy_hi || '',

        timelineEvents: [],
      };

      // Now fetch timeline items separately as designed in history.js
      try {
        const timelineRes = await fetch(`${API_BASE}/timeline`);
        if (timelineRes.ok) {
          const events = await timelineRes.json();
          mappedData.timelineEvents = events.map((e: any) => ({
            id: e.id,
            year: e.year || '',
            event_date: e.event_date ? e.event_date.split('T')[0] : '',
            title: e.title || '',
            subtitle: e.subtitle || '',
            description: e.description || '',
            title_hi: e.title_hi || '',
            subtitle_hi: e.subtitle_hi || '',
            description_hi: e.description_hi || '',
          }));
        }
      } catch (timelineErr) {
        console.warn('Failed to retrieve timeline events:', timelineErr);
      }

      setHistoryData(mappedData);
      showToast('Successfully synchronized history database details!', 'success');
    } catch (err) {
      console.warn('Backend server down. Activating local fallback data.', err);
      setHistoryData(FALLBACK_HISTORY_DATA);
      showToast('Could not reach database. Offline fallback dataset active.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  // Standard singleton PUT transaction
  const handleSaveMain = async (side: 'en' | 'hi', sectionKey: string) => {
    setSavingSide({ side, section: sectionKey });
    try {
      const payload: Record<string, any> = { lang: side };

      if (sectionKey === 'hero') {
        if (side === 'en') {
          payload.description1_heading = historyData.heading;
          payload.description1_subtitle = historyData.subtitle;
          payload.description1 = `${historyData.heading} - ${historyData.subtitle}`;
        } else {
          payload.description1_heading_hi = historyData.heading_hi;
          payload.description1_subtitle_hi = historyData.subtitle_hi;
          payload.description1_hi = `${historyData.heading_hi} - ${historyData.subtitle_hi}`;
        }
      } else if (sectionKey === 'intro') {
        if (side === 'en') {
          payload.description2 = historyData.introText;
          payload.initial_departments = historyData.initialDepartments;
        } else {
          payload.description2_hi = historyData.introText_hi;
          payload.initial_departments_hi = historyData.initialDepartments_hi;
        }
      } else if (sectionKey === 'legacy') {
        if (side === 'en') {
          payload.legacy_title = historyData.legacyTitle;
          payload.legacy = historyData.legacyText;
        } else {
          payload.legacy_title_hi = historyData.legacyTitle_hi;
          payload.legacy_hi = historyData.legacyText_hi;
        }
      }

      const response = await fetch(API_BASE, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Transaction query failed');
      showToast(`Saved ${side === 'en' ? 'English' : 'Hindi'} values to the backend server!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Applied updates to current local context.', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // ============================================
  // TIMELINE EVENTS - ADD / UPDATE / DELETE LOGIC
  // ============================================
  const handleAddTimelineEvent = async () => {
    if (!newEvent.title && !newEvent.title_hi) {
      showToast('Please specify a title in English or Hindi', 'error');
      return;
    }
    setSavingSide({ side: 'all', section: 'addTimeline' });
    try {
      const payload = {
        year: newEvent.year,
        event_date: newEvent.event_date || new Date().toISOString().split('T')[0],
        title: newEvent.title,
        subtitle: newEvent.subtitle,
        description: newEvent.description,
        title_hi: newEvent.title_hi,
        subtitle_hi: newEvent.subtitle_hi,
        description_hi: newEvent.description_hi,
      };

      const response = await fetch(`${API_BASE}/timeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      const added = await response.json();
      setHistoryData((prev) => ({
        ...prev,
        timelineEvents: [
          ...prev.timelineEvents,
          {
            id: added.id,
            year: added.year || '',
            event_date: added.event_date ? added.event_date.split('T')[0] : '',
            title: added.title || '',
            subtitle: added.subtitle || '',
            description: added.description || '',
            title_hi: added.title_hi || '',
            subtitle_hi: added.subtitle_hi || '',
            description_hi: added.description_hi || '',
          },
        ],
      }));
      setNewEvent({
        year: '',
        event_date: '',
        title: '',
        subtitle: '',
        description: '',
        title_hi: '',
        subtitle_hi: '',
        description_hi: '',
      });
      showToast('Successfully added new Timeline Event!', 'success');
    } catch (err) {
      const mockId = Date.now();
      setHistoryData((prev) => ({
        ...prev,
        timelineEvents: [...prev.timelineEvents, { id: mockId, ...newEvent }],
      }));
      setNewEvent({
        year: '',
        event_date: '',
        title: '',
        subtitle: '',
        description: '',
        title_hi: '',
        subtitle_hi: '',
        description_hi: '',
      });
      showToast('Offline Mode: Event added locally.', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleUpdateTimelineEvent = async (id: number | string, index: number, side: 'en' | 'hi') => {
    setSavingSide({ side, section: `timeline-${id}` });
    const item = historyData.timelineEvents[index];
    try {
      if (typeof id === 'number' && id > 100000000000) throw new Error(); // Local mock detection
      
      const payload = {
        lang: side,
        year: item.year,
        event_date: item.event_date || new Date().toISOString().split('T')[0],
        title: side === 'en' ? item.title : item.title_hi,
        subtitle: side === 'en' ? item.subtitle : item.subtitle_hi,
        description: side === 'en' ? item.description : item.description_hi,
      };

      const response = await fetch(`${API_BASE}/timeline/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      showToast(`Successfully saved ${side === 'en' ? 'English' : 'Hindi'} values of Event #${index + 1}!`, 'success');
    } catch (err) {
      showToast('Applied offline updates locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleDeleteTimelineEvent = async (id: number | string, index: number) => {
    setSavingSide({ side: 'all', section: `delete-timeline-${id}` });
    try {
      if (typeof id === 'number' && id > 100000000000) throw new Error(); // Local mock detection
      
      const response = await fetch(`${API_BASE}/timeline/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      
      setHistoryData((prev) => ({
        ...prev,
        timelineEvents: prev.timelineEvents.filter((_, idx) => idx !== index),
      }));
      showToast('Deleted Timeline Event from server', 'success');
    } catch (err) {
      setHistoryData((prev) => ({
        ...prev,
        timelineEvents: prev.timelineEvents.filter((_, idx) => idx !== index),
      }));
      showToast('Removed event locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // ============================================
  // DEPARTMENTS - ADD / REMOVE LOGIC
  // ============================================
  const handleAddDept = (side: 'en' | 'hi') => {
    if (side === 'en') {
      if (!newDeptEn.trim()) return;
      setHistoryData((prev) => ({
        ...prev,
        initialDepartments: [...prev.initialDepartments, newDeptEn.trim()],
      }));
      setNewDeptEn('');
    } else {
      if (!newDeptHi.trim()) return;
      setHistoryData((prev) => ({
        ...prev,
        initialDepartments_hi: [...prev.initialDepartments_hi, newDeptHi.trim()],
      }));
      setNewDeptHi('');
    }
    showToast('Department added locally. Remember to click Save on this section!', 'success');
  };

  const handleDeleteDept = (side: 'en' | 'hi', index: number) => {
    if (side === 'en') {
      setHistoryData((prev) => ({
        ...prev,
        initialDepartments: prev.initialDepartments.filter((_, idx) => idx !== index),
      }));
    } else {
      setHistoryData((prev) => ({
        ...prev,
        initialDepartments_hi: prev.initialDepartments_hi.filter((_, idx) => idx !== index),
      }));
    }
    showToast('Department removed locally.', 'warning');
  };

  // State Updaters
  const handleTimelineFieldChange = (idx: number, key: keyof TimelineEvent, value: string) => {
    setHistoryData((prev) => {
      const copy = [...prev.timelineEvents];
      copy[idx] = { ...copy[idx], [key]: value };
      return { ...prev, timelineEvents: copy };
    });
  };

  const tabs = [
    { id: 'hero' as TabType, name: 'Hero Preamble', icon: FileText, desc: 'Introductory main headings and portal subtitles' },
    { id: 'intro' as TabType, name: 'Intro Details', icon: HistoryIcon, desc: 'Detailed campus introduction text and initial departments' },
    { id: 'timeline' as TabType, name: 'Historical Timeline', icon: Calendar, desc: 'Setup milestones, timelines, and campus achievements' },
    { id: 'legacy' as TabType, name: 'Our Legacy', icon: Award, desc: 'Configure university parameters and closing comments' },
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col font-sans text-[#171717]">
      {/* Top Banner Header */}
      <div className="bg-[#631012] text-white py-6 px-4 sm:px-8 border-b-4 border-[#171717] shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
              <HistoryIcon size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider">NIT Hamirpur History Portal</h1>
              <p className="text-xs text-white/70 font-medium">Bilingual Milestone & Legacy Resources Console (English / हिन्दी)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-black/20 px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live API Mode
            </div>
            <button
              onClick={fetchHistoryData}
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
              <p className="text-xs font-semibold text-gray-500">System Mode</p>
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
                    <h2 className="text-base font-extrabold text-[#171717]">Hero Welcome Banner & Intro</h2>
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
                            value={historyData.heading}
                            onChange={(e) => setHistoryData({ ...historyData, heading: e.target.value })}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Subtitle (English)</label>
                          <input
                            type="text"
                            value={historyData.subtitle}
                            onChange={(e) => setHistoryData({ ...historyData, subtitle: e.target.value })}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
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
                            value={historyData.heading_hi}
                            onChange={(e) => setHistoryData({ ...historyData, heading_hi: e.target.value })}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Hero Subtitle (Hindi)</label>
                          <input
                            type="text"
                            value={historyData.subtitle_hi}
                            onChange={(e) => setHistoryData({ ...historyData, subtitle_hi: e.target.value })}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
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
                            Save Hindi Hero
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* INTRO TAB */}
            {activeTab === 'intro' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Introduction & Initial Departments</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure secondary welcome paragraphs and academic foundation lists side-by-side.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      
                      {/* English Intro */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Details</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Introduction Text</label>
                          <textarea
                            rows={6}
                            value={historyData.introText}
                            onChange={(e) => setHistoryData({ ...historyData, introText: e.target.value })}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Initial Departments</label>
                          <div className="space-y-2">
                            {historyData.initialDepartments.map((dept, index) => (
                              <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border">
                                <span className="text-xs font-semibold">{dept}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDept('en', index)}
                                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newDeptEn}
                                onChange={(e) => setNewDeptEn(e.target.value)}
                                className="w-full p-2 border rounded text-xs bg-white"
                                placeholder="Add department name..."
                              />
                              <button
                                type="button"
                                onClick={() => handleAddDept('en')}
                                className="bg-gray-800 text-white px-3 py-1.5 rounded text-xs font-bold"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('en', 'intro')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'intro' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Intro
                          </button>
                        </div>
                      </div>

                      {/* Hindi Intro */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Details (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Introduction Text (Hindi)</label>
                          <textarea
                            rows={6}
                            value={historyData.introText_hi}
                            onChange={(e) => setHistoryData({ ...historyData, introText_hi: e.target.value })}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Initial Departments (Hindi)</label>
                          <div className="space-y-2">
                            {historyData.initialDepartments_hi.map((dept, index) => (
                              <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border">
                                <span className="text-xs font-semibold">{dept}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteDept('hi', index)}
                                  className="text-red-600 hover:bg-red-50 p-1 rounded"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newDeptHi}
                                onChange={(e) => setNewDeptHi(e.target.value)}
                                className="w-full p-2 border rounded text-xs bg-white"
                                placeholder="विभाग का नाम जोड़ें..."
                              />
                              <button
                                type="button"
                                onClick={() => handleAddDept('hi')}
                                className="bg-gray-800 text-white px-3 py-1.5 rounded text-xs font-bold"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('hi', 'intro')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'intro' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Intro
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TIMELINE TAB */}
            {activeTab === 'timeline' && (
              <div className="space-y-8">
                {/* 1. Main Timeline Segment list */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Dynamic Timeline Milestones</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure historical events, target years, and milestones bilingually side-by-side.</p>
                  </div>

                  <div className="p-6 space-y-8 divide-y divide-gray-100">
                    {historyData.timelineEvents.map((event, index) => (
                      <div key={event.id || index} className={`pt-6 ${index === 0 ? 'pt-0' : ''} space-y-4`}>
                        <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="text-xs font-black uppercase tracking-wider text-[#631012] bg-[#631012]/10 px-2.5 py-1 rounded">Event Milestone #{index + 1}</span>
                          <button
                            onClick={() => handleDeleteTimelineEvent(event.id!, index)}
                            disabled={savingSide.side !== null}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold"
                          >
                            {savingSide.section === `delete-timeline-${event.id}` ? (
                              <Loader2 className="animate-spin w-3 h-3" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Delete Event
                          </button>
                        </div>

                        {/* Top Shared Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Target Year</label>
                            <input
                              type="text"
                              value={event.year}
                              onChange={(e) => handleTimelineFieldChange(index, 'year', e.target.value)}
                              className="w-full p-2 border rounded-lg text-xs bg-white font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Event Date (YYYY-MM-DD)</label>
                            <input
                              type="date"
                              value={event.event_date}
                              onChange={(e) => handleTimelineFieldChange(index, 'event_date', e.target.value)}
                              className="w-full p-2 border rounded-lg text-xs bg-white font-semibold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {/* English column configuration */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider font-mono">English Preamble</p>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Milestone Title (English)</label>
                              <input
                                type="text"
                                value={event.title}
                                onChange={(e) => handleTimelineFieldChange(index, 'title', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Subtitle (English)</label>
                              <input
                                type="text"
                                value={event.subtitle || ''}
                                onChange={(e) => handleTimelineFieldChange(index, 'subtitle', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Detailed Description (English)</label>
                              <textarea
                                rows={3}
                                value={event.description}
                                onChange={(e) => handleTimelineFieldChange(index, 'description', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white leading-relaxed"
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleUpdateTimelineEvent(event.id!, index, 'en')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'en' && savingSide.section === `timeline-${event.id}` ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save English
                              </button>
                            </div>
                          </div>

                          {/* Hindi column configuration */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono">Hindi Preamble (हिन्दी)</p>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Milestone Title (Hindi)</label>
                              <input
                                type="text"
                                value={event.title_hi}
                                onChange={(e) => handleTimelineFieldChange(index, 'title_hi', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Subtitle (Hindi)</label>
                              <input
                                type="text"
                                value={event.subtitle_hi || ''}
                                onChange={(e) => handleTimelineFieldChange(index, 'subtitle_hi', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Detailed Description (Hindi)</label>
                              <textarea
                                rows={3}
                                value={event.description_hi}
                                onChange={(e) => handleTimelineFieldChange(index, 'description_hi', e.target.value)}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-xs bg-white leading-relaxed"
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleUpdateTimelineEvent(event.id!, index, 'hi')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'hi' && savingSide.section === `timeline-${event.id}` ? (
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

                    {/* Insert Timeline form card */}
                    <div className="bg-gray-50/70 p-5 rounded-xl border-2 border-dashed border-gray-200 mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-[#631012]" />
                        <h3 className="text-xs font-extrabold text-[#171717] uppercase tracking-wider">Create New Timeline Event</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">Target Year</label>
                          <input
                            type="text"
                            value={newEvent.year}
                            onChange={(e) => setNewEvent({ ...newEvent, year: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="Ex: 1986"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-500 block mb-1">Event Date (YYYY-MM-DD)</label>
                          <input
                            type="date"
                            value={newEvent.event_date}
                            onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Event English */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider">English Label & Details</p>
                          <input
                            type="text"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="Title English"
                          />
                          <input
                            type="text"
                            value={newEvent.subtitle}
                            onChange={(e) => setNewEvent({ ...newEvent, subtitle: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Subtitle English"
                          />
                          <textarea
                            rows={3}
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Description details in English..."
                          />
                        </div>

                        {/* Event Hindi */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Hindi Label & Details (हिन्दी)</p>
                          <input
                            type="text"
                            value={newEvent.title_hi}
                            onChange={(e) => setNewEvent({ ...newEvent, title_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="शीर्षक हिंदी"
                          />
                          <input
                            type="text"
                            value={newEvent.subtitle_hi}
                            onChange={(e) => setNewEvent({ ...newEvent, subtitle_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="उपशीर्षक हिंदी"
                          />
                          <textarea
                            rows={3}
                            value={newEvent.description_hi}
                            onChange={(e) => setNewEvent({ ...newEvent, description_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="विवरण हिंदी..."
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleAddTimelineEvent}
                          disabled={savingSide.side !== null}
                          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                        >
                          {savingSide.section === 'addTimeline' ? (
                            <Loader2 className="animate-spin w-3.5 h-3.5" />
                          ) : (
                            <Plus size={14} />
                          )}
                          Insert Timeline Event
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LEGACY TAB */}
            {activeTab === 'legacy' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Institutional Legacy & Heritage</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure historical closing notes, milestone summaries and final comments.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      
                      {/* English Legacy */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Heritage Details</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Legacy Title (English)</label>
                          <input
                            type="text"
                            value={historyData.legacyTitle}
                            onChange={(e) => setHistoryData({ ...historyData, legacyTitle: e.target.value })}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Legacy Summary (English)</label>
                          <textarea
                            rows={6}
                            value={historyData.legacyText}
                            onChange={(e) => setHistoryData({ ...historyData, legacyText: e.target.value })}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('en', 'legacy')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'legacy' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Legacy
                          </button>
                        </div>
                      </div>

                      {/* Hindi Legacy */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Heritage Details (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Legacy Title (Hindi)</label>
                          <input
                            type="text"
                            value={historyData.legacyTitle_hi}
                            onChange={(e) => setHistoryData({ ...historyData, legacyTitle_hi: e.target.value })}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Legacy Summary (Hindi)</label>
                          <textarea
                            rows={6}
                            value={historyData.legacyText_hi}
                            onChange={(e) => setHistoryData({ ...historyData, legacyText_hi: e.target.value })}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('hi', 'legacy')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'legacy' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Legacy
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* High-Fidelity Active Live Preview Matching the Esthetics */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-[#FBFBFB]">
                <p className="text-xs font-black text-[#171717]/40 uppercase tracking-wider">Active Presentation Live Preview</p>
              </div>
              <div className="p-6 space-y-8">
                
                {/* 1. Hero Block Container */}
                <div className="bg-gradient-to-r from-[#631012] to-[#8B1518] text-white rounded-xl p-8 shadow-md border-2 border-[#171717]">
                  <div className="text-center">
                    <span className="text-xs font-bold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full text-white/95">
                      {historyData.heading} / {historyData.heading_hi}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black mt-3">
                      {historyData.subtitle}
                    </h3>
                    <p className="text-xs text-white/75 italic mt-1">
                      {historyData.subtitle_hi}
                    </p>
                  </div>
                </div>

                {/* 2. Intro and Departments */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6 shadow-sm">
                  <div>
                    <h4 className="text-base font-bold text-[#171717]">Institute Introduction</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">{historyData.introText}</p>
                    <p className="text-xs text-gray-400 italic mt-1">{historyData.introText_hi}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                      <h5 className="text-xs font-extrabold text-[#631012] uppercase tracking-wider mb-2">Initial Departments (EN)</h5>
                      <div className="flex flex-wrap gap-2">
                        {historyData.initialDepartments.map((dept, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-800 text-xs px-2.5 py-1 rounded-full border font-medium">{dept}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-[#631012] uppercase tracking-wider mb-2">प्रारंभिक विभाग (HI)</h5>
                      <div className="flex flex-wrap gap-2">
                        {historyData.initialDepartments_hi.map((dept, idx) => (
                          <span key={idx} className="bg-amber-50 text-amber-900 text-xs px-2.5 py-1 rounded-full border border-amber-100 font-medium">{dept}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Milestone Timeline View */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6 shadow-sm">
                  <h4 className="text-base font-bold text-[#171717]">Campus Timeline milestones</h4>
                  <div className="relative border-l-2 border-gray-200 ml-4 pl-6 space-y-6">
                    {historyData.timelineEvents.map((event, idx) => (
                      <div key={idx} className="relative">
                        {/* Point badge */}
                        <span className="absolute -left-10 top-0.5 bg-[#631012] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow">
                          {event.year}
                        </span>
                        <div className="bg-gray-50 p-4 rounded-xl border">
                          <h5 className="text-xs sm:text-sm font-black text-[#171717]">{event.title} <span className="text-[10px] text-gray-400">({event.subtitle})</span></h5>
                          <p className="text-xs text-[#631012] font-semibold italic">{event.title_hi} <span className="text-[9px] text-gray-400">({event.subtitle_hi})</span></p>
                          <p className="text-xs text-gray-600 mt-2 font-medium leading-relaxed">{event.description}</p>
                          <p className="text-[11px] text-gray-400 italic leading-relaxed mt-1">{event.description_hi}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Legacy Summary Card */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <span className="text-[10px] font-black uppercase text-[#631012] bg-[#631012]/10 px-2.5 py-1 rounded">Heritage Summary</span>
                  <h4 className="text-base font-bold text-[#171717] mt-3">{historyData.legacyTitle}</h4>
                  <p className="text-xs text-gray-400 italic mt-0.5">{historyData.legacyTitle_hi}</p>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium mt-3 italic">" {historyData.legacyText} "</p>
                  <p className="text-xs text-gray-500 mt-2 italic">" {historyData.legacyText_hi} "</p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}