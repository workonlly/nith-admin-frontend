'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Target,
  Plus,
  Trash2,
  FileText,
  Compass,
  Award,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
  Eye,
} from 'lucide-react';

interface MissionPillar {
  id?: number | string;
  title_en: string;
  title_hi: string;
  description_en: string;
  description_hi: string;
}

interface LegacyStat {
  id?: number | string;
  value_en: string;
  value_hi: string;
  label_en: string;
  label_hi: string;
  description_en: string;
  description_hi: string;
}

interface VisionMissionData {
  // Guiding Principles
  guidingPrinciplesHeading_en: string;
  guidingPrinciplesHeading_hi: string;
  guidingPrinciplesDescription_en: string;
  guidingPrinciplesDescription_hi: string;

  // Vision
  visionHeading_en: string;
  visionHeading_hi: string;
  visionSubtitle_en: string;
  visionSubtitle_hi: string;
  visionDescription_en: string;
  visionDescription_hi: string;

  // Strategic Objectives
  strategicObjectivesHeading_en: string;
  strategicObjectivesHeading_hi: string;

  // Mission
  missionHeading_en: string;
  missionHeading_hi: string;
  missionSubtitle_en: string;
  missionSubtitle_hi: string;
  missionPillars: MissionPillar[];

  // Tagline
  tagline_en: string;
  tagline_hi: string;
  taglineDescription_en: string;
  taglineDescription_hi: string;

  // Legacy
  legacyHeading_en: string;
  legacyHeading_hi: string;
  legacySubheading_en: string;
  legacySubheading_hi: string;
  legacyStats: LegacyStat[];
}

type TabType = 'vision' | 'mission' | 'legacy';

const API_BASE = `http://${process.env.NEXT_PUBLIC_URL || 'localhost:4000'}/vision-mission`;

// High-fidelity fallback database values in case the server is unreachable
const FALLBACK_VISION_MISSION_DATA: VisionMissionData = {
  guidingPrinciplesHeading_en: 'Guiding Principles',
  guidingPrinciplesHeading_hi: 'मार्गदर्शक सिद्धांत',
  guidingPrinciplesDescription_en:
    'Our vision and mission define our commitment to academic excellence, research innovation, and holistic human development',
  guidingPrinciplesDescription_hi:
    'हमारा दृष्टिकोण और मिशन शैक्षणिक उत्कृष्टता, अनुसंधान नवाचार और समग्र मानव विकास के प्रति हमारी प्रतिबद्धता को परिभाषित करते हैं',

  visionHeading_en: 'Our Vision',
  visionHeading_hi: 'हमारा दृष्टिकोण',
  visionSubtitle_en: "Building Tomorrow's Leaders",
  visionSubtitle_hi: 'कल के नेताओं का निर्माण',
  visionDescription_en:
    'To build a center of excellence in technical education and research that fosters innovation, critical thinking, and societal growth — empowering students to lead with vision and integrity.',
  visionDescription_hi:
    'तकनीकी शिक्षा और अनुसंधान में उत्कृष्टता का एक ऐसा केंद्र बनाना जो नवाचार, महत्वपूर्ण सोच और सामाजिक विकास को बढ़ावा दे - छात्रों को दृष्टि और अखंडता के साथ नेतृत्व करने के लिए सशक्त बनाए।',

  strategicObjectivesHeading_en: 'Strategic Objectives',
  strategicObjectivesHeading_hi: 'रणनीतिक उद्देश्य',

  missionHeading_en: 'Our Mission',
  missionHeading_hi: 'हमारा मिशन',
  missionSubtitle_en: 'Excellence, Innovation and Character',
  missionSubtitle_hi: 'उत्कृष्टता, नवाचार और चरित्र',
  missionPillars: [
    {
      id: 1,
      title_en: 'Academic Excellence',
      title_hi: 'शैक्षणिक उत्कृष्टता',
      description_en: 'Providing state-of-the-art infrastructure and a dynamic curriculum focused on holistic development.',
      description_hi: 'समग्र विकास पर केंद्रित अत्याधुनिक बुनियादी ढांचा और एक गतिशील पाठ्यक्रम प्रदान करना।',
    },
    {
      id: 2,
      title_en: 'Research & Innovation',
      title_hi: 'अनुसंधान और नवाचार',
      description_en: 'Encouraging interdisciplinary research that addresses local, national, and global challenges.',
      description_hi: 'अंतर-विषयक अनुसंधान को प्रोत्साहित करना जो स्थानीय, राष्ट्रीय और वैश्विक चुनौतियों का समाधान करता है।',
    },
  ],

  tagline_en: '“Shaping the Future, Empowering Minds”',
  tagline_hi: '“भविष्य को आकार देना, दिमागों को सशक्त बनाना”',
  taglineDescription_en:
    'Every initiative we undertake is aimed at creating a positive, lasting impact on our students and the global community.',
  taglineDescription_hi:
    'हमारे द्वारा की जाने वाली प्रत्येक पहल का उद्देश्य हमारे छात्रों और वैश्विक समुदाय पर सकारात्मक, स्थायी प्रभाव डालना है।',

  legacyHeading_en: 'Our Enduring Legacy',
  legacyHeading_hi: 'हमारी स्थायी विरासत',
  legacySubheading_en: 'Decades of transformative education and scientific research',
  legacySubheading_hi: 'दशकों की परिवर्तनकारी शिक्षा और वैज्ञानिक अनुसंधान',
  legacyStats: [
    { id: 1, value_en: '35+', value_hi: '35+', label_en: 'Years', label_hi: 'वर्ष', description_en: 'Of Academic Excellence', description_hi: 'शैक्षणिक उत्कृष्टता के' },
    { id: 2, value_en: '15k+', value_hi: '15k+', label_en: 'Alumni', label_hi: 'पूर्व छात्र', description_en: 'Leading Globally', description_hi: 'वैश्विक स्तर पर अग्रणी' },
  ],
};

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export default function VisionMissionPage() {
  const [activeTab, setActiveTab] = useState<TabType>('vision');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // High-fidelity saving tracker matching previous implementation style
  const [savingSide, setSavingSide] = useState<{ side: 'en' | 'hi' | string | null; section: string | null }>({
    side: null,
    section: null,
  });

  const [visionMissionData, setVisionMissionData] = useState<VisionMissionData>(FALLBACK_VISION_MISSION_DATA);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Add Item Temp States
  const [newPillar, setNewPillar] = useState({
    title_en: '',
    title_hi: '',
    description_en: '',
    description_hi: '',
  });

  const [newStat, setNewStat] = useState({
    value_en: '',
    value_hi: '',
    label_en: '',
    label_hi: '',
    description_en: '',
    description_hi: '',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Synchronize on load
  const fetchVisionMissionData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error(`Status: ${response.status}`);
      const data = await response.json();

      // Retrieve main singleton information and map fields correctly
      const mappedData: VisionMissionData = {
        guidingPrinciplesHeading_en: data.guiding_principles_heading_en || '',
        guidingPrinciplesHeading_hi: data.guiding_principles_heading_hi || '',
        guidingPrinciplesDescription_en: data.guiding_principles_description_en || '',
        guidingPrinciplesDescription_hi: data.guiding_principles_description_hi || '',

        visionHeading_en: data.vision_heading_en || '',
        visionHeading_hi: data.vision_heading_hi || '',
        visionSubtitle_en: data.vision_subtitle_en || '',
        visionSubtitle_hi: data.vision_subtitle_hi || '',
        visionDescription_en: data.vision_description_en || '',
        visionDescription_hi: data.vision_description_hi || '',

        strategicObjectivesHeading_en: data.strategic_objectives_heading_en || '',
        strategicObjectivesHeading_hi: data.strategic_objectives_heading_hi || '',

        missionHeading_en: data.mission_heading_en || '',
        missionHeading_hi: data.mission_heading_hi || '',
        missionSubtitle_en: data.mission_subtitle_en || '',
        missionSubtitle_hi: data.mission_subtitle_hi || '',

        tagline_en: data.tagline_en || '',
        tagline_hi: data.tagline_hi || '',
        taglineDescription_en: data.tagline_description_en || '',
        taglineDescription_hi: data.tagline_description_hi || '',

        legacyHeading_en: data.legacy_heading_en || '',
        legacyHeading_hi: data.legacy_heading_hi || '',
        legacySubheading_en: data.legacy_subheading_en || '',
        legacySubheading_hi: data.legacy_subheading_hi || '',

        missionPillars: (data.missionPillars || []).map((pillar: any) => ({
          id: pillar.id,
          title_en: pillar.title_en || '',
          title_hi: pillar.title_hi || '',
          description_en: pillar.description_en || '',
          description_hi: pillar.description_hi || '',
        })),

        legacyStats: (data.legacyStats || []).map((stat: any) => ({
          id: stat.id,
          value_en: stat.value_en || '',
          value_hi: stat.value_hi || '',
          label_en: stat.label_en || '',
          label_hi: stat.label_hi || '',
          description_en: stat.description_en || '',
          description_hi: stat.description_hi || '',
        })),
      };

      setVisionMissionData(mappedData);
      showToast('Successfully synchronized Vision & Mission database details!', 'success');
    } catch (err) {
      console.warn('Backend server unreachable. Maintaining fallback local dataset.', err);
      setVisionMissionData(FALLBACK_VISION_MISSION_DATA);
      showToast('Database server down. Offline fallback mode active.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisionMissionData();
  }, []);

  // Standard singleton put/post transaction
  const handleSaveMain = async (side: 'en' | 'hi', sectionKey: string) => {
    setSavingSide({ side, section: sectionKey });
    try {
      const payload: Record<string, any> = { lang: side };

      if (sectionKey === 'guiding_principles') {
        if (side === 'en') {
          payload.guidingPrinciplesHeading = visionMissionData.guidingPrinciplesHeading_en;
          payload.guidingPrinciplesDescription = visionMissionData.guidingPrinciplesDescription_en;
        } else {
          payload.guidingPrinciplesHeading = visionMissionData.guidingPrinciplesHeading_hi;
          payload.guidingPrinciplesDescription = visionMissionData.guidingPrinciplesDescription_hi;
        }
      } else if (sectionKey === 'vision') {
        if (side === 'en') {
          payload.visionHeading = visionMissionData.visionHeading_en;
          payload.visionSubtitle = visionMissionData.visionSubtitle_en;
          payload.visionDescription = visionMissionData.visionDescription_en;
          payload.strategicObjectivesHeading = visionMissionData.strategicObjectivesHeading_en;
        } else {
          payload.visionHeading = visionMissionData.visionHeading_hi;
          payload.visionSubtitle = visionMissionData.visionSubtitle_hi;
          payload.visionDescription = visionMissionData.visionDescription_hi;
          payload.strategicObjectivesHeading = visionMissionData.strategicObjectivesHeading_hi;
        }
      } else if (sectionKey === 'mission') {
        if (side === 'en') {
          payload.missionHeading = visionMissionData.missionHeading_en;
          payload.missionSubtitle = visionMissionData.missionSubtitle_en;
        } else {
          payload.missionHeading = visionMissionData.missionHeading_hi;
          payload.missionSubtitle = visionMissionData.missionSubtitle_hi;
        }
      } else if (sectionKey === 'tagline') {
        if (side === 'en') {
          payload.tagline = visionMissionData.tagline_en;
          payload.taglineDescription = visionMissionData.taglineDescription_en;
        } else {
          payload.tagline = visionMissionData.tagline_hi;
          payload.taglineDescription = visionMissionData.taglineDescription_hi;
        }
      } else if (sectionKey === 'legacy') {
        if (side === 'en') {
          payload.legacyHeading = visionMissionData.legacyHeading_en;
          payload.legacySubheading = visionMissionData.legacySubheading_en;
        } else {
          payload.legacyHeading = visionMissionData.legacyHeading_hi;
          payload.legacySubheading = visionMissionData.legacySubheading_hi;
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
      showToast('Applied updates to current local state context.', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // ============================================
  // MISSION PILLARS - ADD / UPDATE / DELETE LOGIC
  // ============================================
  const handleAddMissionPillar = async () => {
    if (!newPillar.title_en && !newPillar.title_hi) {
      showToast('Please specify a title', 'error');
      return;
    }
    setSavingSide({ side: 'all', section: 'addPillar' });
    try {
      const payload = {
        title_en: newPillar.title_en,
        title_hi: newPillar.title_hi,
        description_en: newPillar.description_en,
        description_hi: newPillar.description_hi,
      };

      const response = await fetch(`${API_BASE}/mission-pillar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      const added = await response.json();
      setVisionMissionData((prev) => ({
        ...prev,
        missionPillars: [...prev.missionPillars, added],
      }));
      setNewPillar({ title_en: '', title_hi: '', description_en: '', description_hi: '' });
      showToast('Successfully added new Mission Pillar!', 'success');
    } catch (err) {
      const mockId = `temp-${Date.now()}`;
      setVisionMissionData((prev) => ({
        ...prev,
        missionPillars: [...prev.missionPillars, { id: mockId, ...newPillar }],
      }));
      setNewPillar({ title_en: '', title_hi: '', description_en: '', description_hi: '' });
      showToast('Offline Mode: Pillar added locally.', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleUpdateMissionPillar = async (id: number | string, index: number, side: 'en' | 'hi') => {
    setSavingSide({ side, section: `pillar-${id}` });
    const item = visionMissionData.missionPillars[index];
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const payload = {
        lang: side,
        title: side === 'en' ? item.title_en : item.title_hi,
        description: side === 'en' ? item.description_en : item.description_hi,
      };

      const response = await fetch(`${API_BASE}/mission-pillar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      showToast(`Successfully saved ${side === 'en' ? 'English' : 'Hindi'} values of Pillar #${index + 1}!`, 'success');
    } catch (err) {
      showToast('Applied offline updates locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleDeleteMissionPillar = async (id: number | string, index: number) => {
    setSavingSide({ side: 'all', section: `delete-pillar-${id}` });
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const response = await fetch(`${API_BASE}/mission-pillar/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      setVisionMissionData((prev) => ({
        ...prev,
        missionPillars: prev.missionPillars.filter((_, idx) => idx !== index),
      }));
      showToast('Deleted Mission Pillar from server', 'success');
    } catch (err) {
      setVisionMissionData((prev) => ({
        ...prev,
        missionPillars: prev.missionPillars.filter((_, idx) => idx !== index),
      }));
      showToast('Removed pillar locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // ============================================
  // LEGACY STATS - ADD / UPDATE / DELETE LOGIC
  // ============================================
  const handleAddLegacyStat = async () => {
    if (!newStat.value_en && !newStat.value_hi) {
      showToast('Please specify a value amount', 'error');
      return;
    }
    setSavingSide({ side: 'all', section: 'addStat' });
    try {
      const payload = {
        value_en: newStat.value_en,
        value_hi: newStat.value_hi,
        label_en: newStat.label_en,
        label_hi: newStat.label_hi,
        description_en: newStat.description_en,
        description_hi: newStat.description_hi,
      };

      const response = await fetch(`${API_BASE}/legacy-stat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      const added = await response.json();
      setVisionMissionData((prev) => ({
        ...prev,
        legacyStats: [...prev.legacyStats, added],
      }));
      setNewStat({ value_en: '', value_hi: '', label_en: '', label_hi: '', description_en: '', description_hi: '' });
      showToast('Successfully added legacy record metric!', 'success');
    } catch (err) {
      const mockId = `temp-${Date.now()}`;
      setVisionMissionData((prev) => ({
        ...prev,
        legacyStats: [...prev.legacyStats, { id: mockId, ...newStat }],
      }));
      setNewStat({ value_en: '', value_hi: '', label_en: '', label_hi: '', description_en: '', description_hi: '' });
      showToast('Offline Mode: Metric added locally.', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleUpdateLegacyStat = async (id: number | string, index: number, side: 'en' | 'hi') => {
    setSavingSide({ side, section: `stat-${id}` });
    const item = visionMissionData.legacyStats[index];
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const payload = {
        lang: side,
        value: side === 'en' ? item.value_en : item.value_hi,
        label: side === 'en' ? item.label_en : item.label_hi,
        description: side === 'en' ? item.description_en : item.description_hi,
      };

      const response = await fetch(`${API_BASE}/legacy-stat/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error();
      showToast(`Successfully saved ${side === 'en' ? 'English' : 'Hindi'} values of Metric #${index + 1}!`, 'success');
    } catch (err) {
      showToast('Applied offline updates locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  const handleDeleteLegacyStat = async (id: number | string, index: number) => {
    setSavingSide({ side: 'all', section: `delete-stat-${id}` });
    try {
      if (typeof id === 'string' && id.startsWith('temp-')) throw new Error();
      const response = await fetch(`${API_BASE}/legacy-stat/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
      setVisionMissionData((prev) => ({
        ...prev,
        legacyStats: prev.legacyStats.filter((_, idx) => idx !== index),
      }));
      showToast('Deleted metric card from server', 'success');
    } catch (err) {
      setVisionMissionData((prev) => ({
        ...prev,
        legacyStats: prev.legacyStats.filter((_, idx) => idx !== index),
      }));
      showToast('Removed metric locally', 'warning');
    } finally {
      setSavingSide({ side: null, section: null });
    }
  };

  // State Updaters
  const handleMainFieldChange = (key: keyof VisionMissionData, value: any) => {
    setVisionMissionData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePillarChange = (idx: number, key: keyof MissionPillar, value: string) => {
    setVisionMissionData((prev) => {
      const copy = [...prev.missionPillars];
      copy[idx] = { ...copy[idx], [key]: value };
      return { ...prev, missionPillars: copy };
    });
  };

  const handleStatChange = (idx: number, key: keyof LegacyStat, value: string) => {
    setVisionMissionData((prev) => {
      const copy = [...prev.legacyStats];
      copy[idx] = { ...copy[idx], [key]: value };
      return { ...prev, legacyStats: copy };
    });
  };

  const tabs = [
    { id: 'vision' as TabType, name: 'Vision Section', icon: Eye, desc: 'Introductory principles, vision descriptions and strategic objectives' },
    { id: 'mission' as TabType, name: 'Mission Pillars', icon: Compass, desc: 'Establish mission statement headings and pillar descriptions' },
    { id: 'legacy' as TabType, name: 'Legacy Metrics', icon: Award, desc: 'Configure university milestones, statistics, and legacy quotes' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center max-w-sm w-full border border-gray-100 font-sans text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#631012] mb-4" />
          <h3 className="text-lg font-bold text-[#171717]">Loading Vision & Mission...</h3>
          <p className="text-xs text-[#171717]/60 mt-2">
            Fetching NIT Hamirpur institutional mission guidelines. In case of server latency, local secure backups will auto-initiate.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex flex-col font-sans text-[#171717]">
      {/* Dynamic Alerts */}
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

      {/* Top Header Banner matching image style guide */}
      <div className="bg-[#631012] text-white py-6 px-4 sm:px-8 border-b-4 border-[#171717] shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
              <Target size={28} className="text-white fill-white/20" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider">Vision & Mission Console</h1>
              <p className="text-xs text-white/70 font-medium">Bilingual Core Directives Management Panel (English / हिन्दी)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-black/20 px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-2 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live API Sync
            </div>
            <button
              onClick={fetchVisionMissionData}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              Sync Database
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Frame */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Sidebar Tabs */}
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
            
            {/* VISION TAB */}
            {activeTab === 'vision' && (
              <div className="space-y-8">
                {/* 1. Guiding Principles Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Guiding Principles</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure core preamble parameters displayed before the vision blocks.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      
                      {/* English Guiding Principles */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Preamble</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Principles Title Heading</label>
                          <input
                            type="text"
                            value={visionMissionData.guidingPrinciplesHeading_en}
                            onChange={(e) => handleMainFieldChange('guidingPrinciplesHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Principles Statement Description</label>
                          <textarea
                            rows={3}
                            value={visionMissionData.guidingPrinciplesDescription_en}
                            onChange={(e) => handleMainFieldChange('guidingPrinciplesDescription_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('en', 'guiding_principles')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'guiding_principles' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Principles
                          </button>
                        </div>
                      </div>

                      {/* Hindi Guiding Principles */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Preamble (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Principles Title Heading (Hindi)</label>
                          <input
                            type="text"
                            value={visionMissionData.guidingPrinciplesHeading_hi}
                            onChange={(e) => handleMainFieldChange('guidingPrinciplesHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Principles Statement Description (Hindi)</label>
                          <textarea
                            rows={3}
                            value={visionMissionData.guidingPrinciplesDescription_hi}
                            onChange={(e) => handleMainFieldChange('guidingPrinciplesDescription_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('hi', 'guiding_principles')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'guiding_principles' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Principles
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* 2. Our Vision Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Institutional Vision</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure our global roadmap vision statement headings, subtitles, and descriptions.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      
                      {/* English Vision */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Vision Configuration</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Vision Section Heading</label>
                          <input
                            type="text"
                            value={visionMissionData.visionHeading_en}
                            onChange={(e) => handleMainFieldChange('visionHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Vision Subtitle</label>
                          <input
                            type="text"
                            value={visionMissionData.visionSubtitle_en}
                            onChange={(e) => handleMainFieldChange('visionSubtitle_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Vision Detailed Description</label>
                          <textarea
                            rows={4}
                            value={visionMissionData.visionDescription_en}
                            onChange={(e) => handleMainFieldChange('visionDescription_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Strategic Objectives Heading</label>
                          <input
                            type="text"
                            value={visionMissionData.strategicObjectivesHeading_en}
                            onChange={(e) => handleMainFieldChange('strategicObjectivesHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('en', 'vision')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'vision' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Vision
                          </button>
                        </div>
                      </div>

                      {/* Hindi Vision */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Vision Configuration (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Vision Section Heading (Hindi)</label>
                          <input
                            type="text"
                            value={visionMissionData.visionHeading_hi}
                            onChange={(e) => handleMainFieldChange('visionHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Vision Subtitle (Hindi)</label>
                          <input
                            type="text"
                            value={visionMissionData.visionSubtitle_hi}
                            onChange={(e) => handleMainFieldChange('visionSubtitle_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Vision Detailed Description (Hindi)</label>
                          <textarea
                            rows={4}
                            value={visionMissionData.visionDescription_hi}
                            onChange={(e) => handleMainFieldChange('visionDescription_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Strategic Objectives Heading (Hindi)</label>
                          <input
                            type="text"
                            value={visionMissionData.strategicObjectivesHeading_hi}
                            onChange={(e) => handleMainFieldChange('strategicObjectivesHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('hi', 'vision')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'vision' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Vision
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MISSION PILLARS TAB */}
            {activeTab === 'mission' && (
              <div className="space-y-8">
                {/* 1. Mission Headings setup */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Mission Statement Titles</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure secondary welcome titles and action directive sub-headers.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* English configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Mission Titles</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Mission Heading Title</label>
                          <input
                            type="text"
                            value={visionMissionData.missionHeading_en}
                            onChange={(e) => handleMainFieldChange('missionHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Mission Subtitle Tagline</label>
                          <input
                            type="text"
                            value={visionMissionData.missionSubtitle_en}
                            onChange={(e) => handleMainFieldChange('missionSubtitle_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('en', 'mission')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'mission' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Heading
                          </button>
                        </div>
                      </div>

                      {/* Hindi configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Mission Titles (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Mission Heading Title (Hindi)</label>
                          <input
                            type="text"
                            value={visionMissionData.missionHeading_hi}
                            onChange={(e) => handleMainFieldChange('missionHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Mission Subtitle Tagline (Hindi)</label>
                          <input
                            type="text"
                            value={visionMissionData.missionSubtitle_hi}
                            onChange={(e) => handleMainFieldChange('missionSubtitle_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('hi', 'mission')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'mission' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Heading
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Pillars Side-by-Side List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Dynamic Mission Objectives Pillars</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure discrete academic pillars and execution methodologies bilingually side-by-side.</p>
                  </div>

                  <div className="p-6 space-y-8 divide-y divide-gray-100">
                    {visionMissionData.missionPillars.map((pillar, index) => (
                      <div key={pillar.id || index} className={`pt-6 ${index === 0 ? 'pt-0' : ''} space-y-4`}>
                        <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="text-xs font-black uppercase tracking-wider text-[#631012] bg-[#631012]/10 px-2.5 py-1 rounded">Mission Objective Pillar #{index + 1}</span>
                          <button
                            onClick={() => handleDeleteMissionPillar(pillar.id!, index)}
                            disabled={savingSide.side !== null}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold"
                          >
                            {savingSide.section === `delete-pillar-${pillar.id}` ? (
                              <Loader2 className="animate-spin w-3 h-3" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Delete Pillar
                          </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {/* English column configuration */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider font-mono">English Column Parameters</p>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Pillar Title (English)</label>
                              <input
                                type="text"
                                value={pillar.title_en}
                                onChange={(e) => handlePillarChange(index, 'title_en', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Pillar Description (English)</label>
                              <textarea
                                rows={3}
                                value={pillar.description_en}
                                onChange={(e) => handlePillarChange(index, 'description_en', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white leading-relaxed"
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleUpdateMissionPillar(pillar.id!, index, 'en')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'en' && savingSide.section === `pillar-${pillar.id}` ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save English Pillar
                              </button>
                            </div>
                          </div>

                          {/* Hindi column configuration */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono">Hindi Column Parameters (हिन्दी)</p>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Pillar Title (Hindi)</label>
                              <input
                                type="text"
                                value={pillar.title_hi}
                                onChange={(e) => handlePillarChange(index, 'title_hi', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Pillar Description (Hindi)</label>
                              <textarea
                                rows={3}
                                value={pillar.description_hi}
                                onChange={(e) => handlePillarChange(index, 'description_hi', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white leading-relaxed"
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleUpdateMissionPillar(pillar.id!, index, 'hi')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'hi' && savingSide.section === `pillar-${pillar.id}` ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <Save size={12} />
                                )}
                                Save Hindi Pillar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Insert Pillar form card */}
                    <div className="bg-gray-50/70 p-5 rounded-xl border-2 border-dashed border-gray-200 mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-[#631012]" />
                        <h3 className="text-xs font-extrabold text-[#171717] uppercase tracking-wider">Create New Mission Pillar</h3>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Pillar English */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider">English Label & Details</p>
                          <input
                            type="text"
                            value={newPillar.title_en}
                            onChange={(e) => setNewPillar({ ...newPillar, title_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="Title English"
                          />
                          <textarea
                            rows={3}
                            value={newPillar.description_en}
                            onChange={(e) => setNewPillar({ ...newPillar, description_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Description details in English..."
                          />
                        </div>

                        {/* Pillar Hindi */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Hindi Label & Details (हिन्दी)</p>
                          <input
                            type="text"
                            value={newPillar.title_hi}
                            onChange={(e) => setNewPillar({ ...newPillar, title_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="शीर्षक हिंदी"
                          />
                          <textarea
                            rows={3}
                            value={newPillar.description_hi}
                            onChange={(e) => setNewPillar({ ...newPillar, description_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="विवरण हिंदी..."
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleAddMissionPillar}
                          disabled={savingSide.side !== null}
                          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                        >
                          {savingSide.section === 'addPillar' ? (
                            <Loader2 className="animate-spin w-3.5 h-3.5" />
                          ) : (
                            <Plus size={14} />
                          )}
                          Insert Mission Pillar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Section Tagline */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Mission Block Quote Tagline</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure bilingually aligned quote directives mapped under mission statement objectives.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* English Tagline */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Tagline</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Tagline Quote Heading</label>
                          <input
                            type="text"
                            value={visionMissionData.tagline_en}
                            onChange={(e) => handleMainFieldChange('tagline_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-bold italic text-[#631012]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Tagline Detailed description</label>
                          <textarea
                            rows={3}
                            value={visionMissionData.taglineDescription_en}
                            onChange={(e) => handleMainFieldChange('taglineDescription_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('en', 'tagline')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'en' && savingSide.section === 'tagline' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save English Tagline
                          </button>
                        </div>
                      </div>

                      {/* Hindi Tagline */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Tagline (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Tagline Quote Heading (Hindi)</label>
                          <input
                            type="text"
                            value={visionMissionData.tagline_hi}
                            onChange={(e) => handleMainFieldChange('tagline_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-bold italic text-[#631012]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Tagline Detailed description (Hindi)</label>
                          <textarea
                            rows={3}
                            value={visionMissionData.taglineDescription_hi}
                            onChange={(e) => handleMainFieldChange('taglineDescription_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white leading-relaxed"
                          />
                        </div>

                        <div className="pt-3 border-t flex justify-end">
                          <button
                            onClick={() => handleSaveMain('hi', 'tagline')}
                            disabled={savingSide.side !== null}
                            className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
                          >
                            {savingSide.side === 'hi' && savingSide.section === 'tagline' ? (
                              <Loader2 className="animate-spin w-3.5 h-3.5" />
                            ) : (
                              <Save size={14} />
                            )}
                            Save Hindi Tagline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LEGACY METRICS TAB */}
            {activeTab === 'legacy' && (
              <div className="space-y-8">
                {/* 1. Legacy main headers */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Enduring Legacy Heading Configuration</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure the main legacy headings and subheadings side-by-side.</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* English configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-[#631012]/10 text-[#631012] text-xs font-extrabold rounded">EN</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">English Legacy Headers</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Legacy Main Heading</label>
                          <input
                            type="text"
                            value={visionMissionData.legacyHeading_en}
                            onChange={(e) => handleMainFieldChange('legacyHeading_en', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Legacy Subheading</label>
                          <textarea
                            rows={3}
                            value={visionMissionData.legacySubheading_en}
                            onChange={(e) => handleMainFieldChange('legacySubheading_en', e.target.value)}
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
                            Save English Headers
                          </button>
                        </div>
                      </div>

                      {/* Hindi configuration */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 mb-2">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded">HI</span>
                          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Hindi Legacy Headers (हिन्दी)</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Legacy Main Heading (Hindi)</label>
                          <input
                            type="text"
                            value={visionMissionData.legacyHeading_hi}
                            onChange={(e) => handleMainFieldChange('legacyHeading_hi', e.target.value)}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Legacy Subheading (Hindi)</label>
                          <textarea
                            rows={3}
                            value={visionMissionData.legacySubheading_hi}
                            onChange={(e) => handleMainFieldChange('legacySubheading_hi', e.target.value)}
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
                            Save Hindi Headers
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Side-by-Side bilingual dynamic stats cards list */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base font-extrabold text-[#171717]">Dynamic Legacy Milestone Stat Metrics</h2>
                    <p className="text-xs text-gray-500 mt-1">Configure historical record counts (Years, Alumni network limits). All entries are processed side-by-side.</p>
                  </div>

                  <div className="p-6 space-y-8 divide-y divide-gray-100">
                    {visionMissionData.legacyStats.map((stat, index) => (
                      <div key={stat.id || index} className={`pt-6 ${index === 0 ? 'pt-0' : ''} space-y-4`}>
                        <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="text-xs font-black uppercase tracking-wider text-[#631012] bg-[#631012]/10 px-2.5 py-1 rounded">Record Card #{index + 1}</span>
                          <button
                            onClick={() => handleDeleteLegacyStat(stat.id!, index)}
                            disabled={savingSide.side !== null}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center gap-1 text-xs font-bold"
                          >
                            {savingSide.section === `delete-stat-${stat.id}` ? (
                              <Loader2 className="animate-spin w-3 h-3" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Delete Metric
                          </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {/* English column configuration */}
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider font-mono">English Params</p>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Value Metric Count</label>
                              <input
                                type="text"
                                value={stat.value_en}
                                onChange={(e) => handleStatChange(index, 'value_en', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Label Tag Name</label>
                              <input
                                type="text"
                                value={stat.label_en}
                                onChange={(e) => handleStatChange(index, 'label_en', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Detailed Description Context</label>
                              <input
                                type="text"
                                value={stat.description_en}
                                onChange={(e) => handleStatChange(index, 'description_en', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white"
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleUpdateLegacyStat(stat.id!, index, 'en')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'en' && savingSide.section === `stat-${stat.id}` ? (
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
                            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider font-mono">Hindi Params (हिन्दी)</p>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Value Metric Count (Hindi)</label>
                              <input
                                type="text"
                                value={stat.value_hi}
                                onChange={(e) => handleStatChange(index, 'value_hi', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Label Tag Name (Hindi)</label>
                              <input
                                type="text"
                                value={stat.label_hi}
                                onChange={(e) => handleStatChange(index, 'label_hi', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Detailed Description Context (Hindi)</label>
                              <input
                                type="text"
                                value={stat.description_hi}
                                onChange={(e) => handleStatChange(index, 'description_hi', e.target.value)}
                                className="w-full p-2 border rounded-lg text-xs bg-white"
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                onClick={() => handleUpdateLegacyStat(stat.id!, index, 'hi')}
                                disabled={savingSide.side !== null}
                                className="bg-[#631012] hover:bg-[#7a1214] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                {savingSide.side === 'hi' && savingSide.section === `stat-${stat.id}` ? (
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

                    {/* Insert Stat Form */}
                    <div className="bg-gray-50/70 p-5 rounded-xl border-2 border-dashed border-gray-200 mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-[#631012]" />
                        <h3 className="text-xs font-extrabold text-[#171717] uppercase tracking-wider">Create New Legacy Stat Card</h3>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* New Card English details */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-[#631012] uppercase tracking-wider">English Parameters</p>
                          <input
                            type="text"
                            value={newStat.value_en}
                            onChange={(e) => setNewStat({ ...newStat, value_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="Value Metric (e.g. 100+)"
                          />
                          <input
                            type="text"
                            value={newStat.label_en}
                            onChange={(e) => setNewStat({ ...newStat, label_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Label Tag Name (e.g. Patents)"
                          />
                          <input
                            type="text"
                            value={newStat.description_en}
                            onChange={(e) => setNewStat({ ...newStat, description_en: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="Brief description (e.g. Published Annually)"
                          />
                        </div>

                        {/* New Card Hindi details */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Hindi Parameters (हिन्दी)</p>
                          <input
                            type="text"
                            value={newStat.value_hi}
                            onChange={(e) => setNewStat({ ...newStat, value_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white font-semibold"
                            placeholder="संख्यात्मक वैल्यू (जैसे 100+)"
                          />
                          <input
                            type="text"
                            value={newStat.label_hi}
                            onChange={(e) => setNewStat({ ...newStat, label_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="लेबल नाम (जैसे पेटेंट)"
                          />
                          <input
                            type="text"
                            value={newStat.description_hi}
                            onChange={(e) => setNewStat({ ...newStat, description_hi: e.target.value })}
                            className="w-full p-2 border rounded text-xs bg-white"
                            placeholder="संक्षिप्त विवरण (जैसे प्रतिवर्ष प्रकाशित)"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={handleAddLegacyStat}
                          disabled={savingSide.side !== null}
                          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                        >
                          {savingSide.section === 'addStat' ? (
                            <Loader2 className="animate-spin w-3.5 h-3.5" />
                          ) : (
                            <Plus size={14} />
                          )}
                          Insert Stat Card
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* High-Fidelity Active Preview Matching Core Guidelines */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-[#FBFBFB]">
                <p className="text-xs font-black text-[#171717]/40 uppercase tracking-wider">Active Presentation Live Preview</p>
              </div>
              <div className="p-6 space-y-8">
                
                {/* 1. Guiding Principles & Vision Block Container */}
                <div className="bg-gradient-to-r from-[#631012] to-[#8B1518] text-white rounded-xl p-8 shadow-md border-2 border-[#171717]">
                  <div className="text-center pb-6 border-b border-white/20">
                    <span className="text-xs font-bold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full text-white/95">
                      {visionMissionData.guidingPrinciplesHeading_en} / {visionMissionData.guidingPrinciplesHeading_hi}
                    </span>
                    <p className="text-xs sm:text-sm mt-3 text-white/80 max-w-2xl mx-auto leading-relaxed">
                      {visionMissionData.guidingPrinciplesDescription_en}
                    </p>
                  </div>

                  <div className="pt-6 text-center space-y-4">
                    <h3 className="text-2xl sm:text-3xl font-black">
                      {visionMissionData.visionHeading_en}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/75 font-medium italic">
                      {visionMissionData.visionHeading_hi} ( {visionMissionData.visionSubtitle_hi} )
                    </p>
                    <p className="text-sm sm:text-base text-white/90 max-w-3xl mx-auto leading-relaxed italic">
                      " {visionMissionData.visionDescription_en} "
                    </p>
                    <p className="text-xs text-white/80 max-w-3xl mx-auto leading-relaxed">
                      {visionMissionData.visionDescription_hi}
                    </p>
                  </div>
                </div>

                {/* 2. Mission Pillars Presentation Grid */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6 shadow-sm">
                  <div className="text-center">
                    <span className="text-xs font-black uppercase text-[#631012]">
                      {visionMissionData.missionHeading_en} / {visionMissionData.missionHeading_hi}
                    </span>
                    <p className="text-sm text-gray-500 font-bold mt-1">
                      {visionMissionData.missionSubtitle_en}
                    </p>
                    <p className="text-xs text-gray-400 italic">
                      {visionMissionData.missionSubtitle_hi}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    {visionMissionData.missionPillars.map((pillar, idx) => (
                      <div key={idx} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                        <span className="text-xs font-black uppercase text-[#631012] bg-[#631012]/10 px-2 py-0.5 rounded">Pillar {idx + 1}</span>
                        <h4 className="text-sm font-bold text-[#171717] mt-2 mb-1">{pillar.title_en}</h4>
                        <p className="text-xs text-gray-500 font-semibold mb-2">{pillar.title_hi}</p>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">{pillar.description_en}</p>
                        <p className="text-[11px] text-gray-400 italic leading-relaxed mt-1">{pillar.description_hi}</p>
                      </div>
                    ))}
                  </div>

                  {/* Tagline block */}
                  <div className="bg-[#FAF9F9] p-5 rounded-xl border border-gray-100 text-center">
                    <p className="text-sm sm:text-base font-black text-[#631012] italic">
                      {visionMissionData.tagline_en}
                    </p>
                    <p className="text-xs text-[#631012]/70 italic mt-0.5">
                      {visionMissionData.tagline_hi}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 max-w-xl mx-auto">
                      {visionMissionData.taglineDescription_en}
                    </p>
                  </div>
                </div>

                {/* 3. Legacy Stats Presentation Grid */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6 shadow-sm">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-[#171717]">{visionMissionData.legacyHeading_en}</h4>
                    <p className="text-xs text-gray-500 italic mt-0.5">{visionMissionData.legacyHeading_hi}</p>
                    <p className="text-xs text-gray-400 mt-2">{visionMissionData.legacySubheading_en}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {visionMissionData.legacyStats.map((stat, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center hover:border-[#631012]/30 transition-colors">
                        <div className="text-2xl font-black text-[#631012] mb-1">{stat.value_en}</div>
                        <div className="text-xs font-black uppercase text-[#171717] mb-1">{stat.label_en} / {stat.label_hi}</div>
                        <p className="text-[11px] text-gray-500 font-semibold">{stat.description_en}</p>
                        <p className="text-[10px] text-gray-400 italic mt-0.5">{stat.description_hi}</p>
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