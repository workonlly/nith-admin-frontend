'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Palette,
  Plus,
  Trash2,
  FileText,
  Info,
  List,
  AlertCircle,
  Loader,
  Edit2,
  Check,
  X,
  Trophy,
  Phone
} from 'lucide-react';

interface NccHeading {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  history_title_en: string;
  history_title_hn: string;
  history_desc_en: string;
  history_desc_hn: string;
  motto_title_en: string;
  motto_title_hn: string;
  motto_desc_en: string;
  motto_desc_hn: string;
  aim_title_en: string;
  aim_title_hn: string;
  aim_desc_en: string;
  aim_desc_hn: string;
  camps_title_en: string;
  camps_title_hn: string;
  community_title_en: string;
  community_title_hn: string;
  coord_email: string;
  calendar_url: string;
}

interface NccCamp {
  id: number;
  camp_en: string;
  camp_hn: string;
}

interface NccCommunity {
  id: number;
  service_en: string;
  service_hn: string;
}

type TabType = 'hero' | 'camps' | 'community';

export default function NCCActivitiesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const DEFAULT_HEADING: NccHeading = {
    title_en: 'National Cadet Corps (NCC)',
    title_hn: 'राष्ट्रीय कैडेट कोर (एनसीसी)',
    sub_title_en: 'NCC fosters discipline, leadership and community service through training and outreach programs for students.',
    sub_title_hn: 'एनसीसी छात्रों के लिए प्रशिक्षण और आउटरीच कार्यक्रमों के माध्यम से अनुशासन, नेतृत्व और सामुदायिक सेवा को बढ़ावा देता है।',
    history_title_en: 'History',
    history_title_hn: 'इतिहास',
    history_desc_en: 'The NCC (National Cadet Corps) has its origin in the University Corps formed in the early 20th century. It was later formalized into NCC to develop discipline and leadership among the youth through military-style training and community service.',
    history_desc_hn: 'एनसीसी (राष्ट्रीय कैडेट कोर) की उत्पत्ति 20वीं सदी की शुरुआत में गठित यूनिवर्सिटी कोर में हुई है। बाद में इसे सैन्य-शैली के प्रशिक्षण और सामुदायिक सेवा के माध्यम से युवाओं में अनुशासन और नेतृत्व विकसित करने के लिए एनसीसी का रूप दिया गया।',
    motto_title_en: 'NCC Motto',
    motto_title_hn: 'एनसीसी आदर्श वाक्य',
    motto_desc_en: "The official motto of NCC is 'Unity and Discipline', emphasizing the values the organization seeks to instill in cadets.",
    motto_desc_hn: "एनसीसी का आधिकारिक आदर्श वाक्य 'एकता और अनुशासन' है, जो उन मूल्यों पर जोर देता है जो संगठन कैडेटों में पैदा करना चाहता है।",
    aim_title_en: 'Aim of NCC',
    aim_title_hn: 'एनसीसी का उद्देश्य',
    aim_desc_en: 'NCC aims to develop character, leadership, a spirit of adventure, and the ideals of selfless service among young citizens.',
    aim_desc_hn: 'एनसीसी का उद्देश्य युवा नागरिकों के बीच चरित्र, नेतृत्व, साहस की भावना और निस्वार्थ सेवा के आदर्शों को विकसित करना है।',
    camps_title_en: 'Central Camps',
    camps_title_hn: 'केंद्रीय शिविर',
    community_title_en: 'Community Services',
    community_title_hn: 'सामुदायिक सेवाएं',
    coord_email: 'ncc-coordinator@nith.ac.in',
    calendar_url: '/student/welfare'
  };

  const DEFAULT_CAMPS = [
    {
      camp_en: 'Leadership and team-building exercises.',
      camp_hn: 'नेतृत्व और टीम-निर्माण अभ्यास।'
    },
    {
      camp_en: 'Adventure sports (trekking, obstacle courses).',
      camp_hn: 'साहसिक खेल (ट्रेकिंग, बाधा कोर्स)।'
    },
    {
      camp_en: 'Drill and ceremonial training.',
      camp_hn: 'ड्रिल और औपचारिक प्रशिक्षण।'
    },
    {
      camp_en: 'Competitive events and awarding of certificates.',
      camp_hn: 'प्रतिस्पर्धी कार्यक्रम और प्रमाणपत्रों का वितरण।'
    }
  ];

  const DEFAULT_COMMUNITY = [
    {
      service_en: 'Disaster relief participation and coordination.',
      service_hn: 'आपदा राहत भागीदारी और समन्वय।'
    },
    {
      service_en: 'Blood donation and health awareness drives.',
      service_hn: 'रक्तदान और स्वास्थ्य जागरूकता अभियान।'
    },
    {
      service_en: 'Tree plantation and environmental conservation projects.',
      service_hn: 'वृक्षारोपण and पर्यावरण संरक्षण परियोजनाएं।'
    },
    {
      service_en: 'Community literacy and outreach programs.',
      service_hn: 'सामुदायिक साक्षरता और आउटरीच कार्यक्रम।'
    }
  ];

  // Singleton Heading state
  const [headingData, setHeadingData] = useState<NccHeading>({
    title_en: DEFAULT_HEADING.title_en,
    title_hn: DEFAULT_HEADING.title_hn,
    sub_title_en: DEFAULT_HEADING.sub_title_en,
    sub_title_hn: DEFAULT_HEADING.sub_title_hn,
    history_title_en: DEFAULT_HEADING.history_title_en,
    history_title_hn: DEFAULT_HEADING.history_title_hn,
    history_desc_en: DEFAULT_HEADING.history_desc_en,
    history_desc_hn: DEFAULT_HEADING.history_desc_hn,
    motto_title_en: DEFAULT_HEADING.motto_title_en,
    motto_title_hn: DEFAULT_HEADING.motto_title_hn,
    motto_desc_en: DEFAULT_HEADING.motto_desc_en,
    motto_desc_hn: DEFAULT_HEADING.motto_desc_hn,
    aim_title_en: DEFAULT_HEADING.aim_title_en,
    aim_title_hn: DEFAULT_HEADING.aim_title_hn,
    aim_desc_en: DEFAULT_HEADING.aim_desc_en,
    aim_desc_hn: DEFAULT_HEADING.aim_desc_hn,
    camps_title_en: DEFAULT_HEADING.camps_title_en,
    camps_title_hn: DEFAULT_HEADING.camps_title_hn,
    community_title_en: DEFAULT_HEADING.community_title_en,
    community_title_hn: DEFAULT_HEADING.community_title_hn,
    coord_email: DEFAULT_HEADING.coord_email,
    calendar_url: DEFAULT_HEADING.calendar_url
  });

  // Dynamic Lists state
  const [camps, setCamps] = useState<NccCamp[]>([]);
  const [community, setCommunity] = useState<NccCommunity[]>([]);

  // CRUD Form states - Camps
  const [newCamp, setNewCamp] = useState({ camp_en: '', camp_hn: '' });
  const [editingCampId, setEditingCampId] = useState<number | null>(null);
  const [editingCampData, setEditingCampData] = useState({ camp_en: '', camp_hn: '' });

  // CRUD Form states - Community Services
  const [newCommunity, setNewCommunity] = useState({ service_en: '', service_hn: '' });
  const [editingCommunityId, setEditingCommunityId] = useState<number | null>(null);
  const [editingCommunityData, setEditingCommunityData] = useState({ service_en: '', service_hn: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Heading Settings
      const headRes = await fetch(`${API_URL}/api/student-ncc`);
      if (headRes.ok) {
        const hData = await headRes.json();
        if (hData && Object.keys(hData).length > 0) {
          setHeadingData({
            title_en: hData.title_en || DEFAULT_HEADING.title_en,
            title_hn: hData.title_hn || DEFAULT_HEADING.title_hn,
            sub_title_en: hData.sub_title_en || DEFAULT_HEADING.sub_title_en,
            sub_title_hn: hData.sub_title_hn || DEFAULT_HEADING.sub_title_hn,
            history_title_en: hData.history_title_en || DEFAULT_HEADING.history_title_en,
            history_title_hn: hData.history_title_hn || DEFAULT_HEADING.history_title_hn,
            history_desc_en: hData.history_desc_en || DEFAULT_HEADING.history_desc_en,
            history_desc_hn: hData.history_desc_hn || DEFAULT_HEADING.history_desc_hn,
            motto_title_en: hData.motto_title_en || DEFAULT_HEADING.motto_title_en,
            motto_title_hn: hData.motto_title_hn || DEFAULT_HEADING.motto_title_hn,
            motto_desc_en: hData.motto_desc_en || DEFAULT_HEADING.motto_desc_en,
            motto_desc_hn: hData.motto_desc_hn || DEFAULT_HEADING.motto_desc_hn,
            aim_title_en: hData.aim_title_en || DEFAULT_HEADING.aim_title_en,
            aim_title_hn: hData.aim_title_hn || DEFAULT_HEADING.aim_title_hn,
            aim_desc_en: hData.aim_desc_en || DEFAULT_HEADING.aim_desc_en,
            aim_desc_hn: hData.aim_desc_hn || DEFAULT_HEADING.aim_desc_hn,
            camps_title_en: hData.camps_title_en || DEFAULT_HEADING.camps_title_en,
            camps_title_hn: hData.camps_title_hn || DEFAULT_HEADING.camps_title_hn,
            community_title_en: hData.community_title_en || DEFAULT_HEADING.community_title_en,
            community_title_hn: hData.community_title_hn || DEFAULT_HEADING.community_title_hn,
            coord_email: hData.coord_email || DEFAULT_HEADING.coord_email,
            calendar_url: hData.calendar_url || DEFAULT_HEADING.calendar_url
          });
        }
      }

      // 2. Central Camps
      const campRes = await fetch(`${API_URL}/api/student-ncc/camps`);
      if (campRes.ok) {
        const cData = await campRes.json();
        if (cData.length === 0) {
          for (const item of DEFAULT_CAMPS) {
            await fetch(`${API_URL}/api/student-ncc/camps`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            });
          }
          const campRes2 = await fetch(`${API_URL}/api/student-ncc/camps`);
          setCamps(await campRes2.json());
        } else {
          setCamps(cData);
        }
      }

      // 3. Community Services
      const commRes = await fetch(`${API_URL}/api/student-ncc/community`);
      if (commRes.ok) {
        const cmData = await commRes.json();
        if (cmData.length === 0) {
          for (const item of DEFAULT_COMMUNITY) {
            await fetch(`${API_URL}/api/student-ncc/community`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            });
          }
          const commRes2 = await fetch(`${API_URL}/api/student-ncc/community`);
          setCommunity(await commRes2.json());
        } else {
          setCommunity(cmData);
        }
      }
    } catch (err: any) {
      console.error('Error fetching NCC data:', err);
      setError('Failed to fetch NCC details from backend. Check API status.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-ncc`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update NCC headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('NCC banner and history settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Camps CRUD ---
  const handleAddCamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamp.camp_en.trim() || !newCamp.camp_hn.trim()) {
      alert('Bilingual camp fields are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-ncc/camps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCamp),
      });
      if (!res.ok) throw new Error('Failed to add camp');
      const saved = await res.json();
      setCamps([...camps, saved]);
      setNewCamp({ camp_en: '', camp_hn: '' });
      alert('Camp entry added!');
    } catch (err: any) {
      alert('Error adding camp: ' + err.message);
    }
  };

  const handleSaveCampEdit = async (id: number) => {
    if (!editingCampData.camp_en.trim() || !editingCampData.camp_hn.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-ncc/camps/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCampData),
      });
      if (!res.ok) throw new Error('Failed to update camp');
      const updated = await res.json();
      setCamps(camps.map(c => c.id === id ? updated : c));
      setEditingCampId(null);
      alert('Camp updated!');
    } catch (err: any) {
      alert('Error updating camp: ' + err.message);
    }
  };

  const handleDeleteCamp = async (id: number) => {
    if (!confirm('Are you sure you want to delete this camp?')) return;
    try {
      await fetch(`${API_URL}/api/student-ncc/camps/${id}`, { method: 'DELETE' });
      setCamps(camps.filter(c => c.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  // --- Community Services CRUD ---
  const handleAddCommunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunity.service_en.trim() || !newCommunity.service_hn.trim()) {
      alert('Bilingual community service descriptions are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-ncc/community`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCommunity),
      });
      if (!res.ok) throw new Error('Failed to add service');
      const saved = await res.json();
      setCommunity([...community, saved]);
      setNewCommunity({ service_en: '', service_hn: '' });
      alert('Community service added!');
    } catch (err: any) {
      alert('Error adding community service: ' + err.message);
    }
  };

  const handleSaveCommunityEdit = async (id: number) => {
    if (!editingCommunityData.service_en.trim() || !editingCommunityData.service_hn.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-ncc/community/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCommunityData),
      });
      if (!res.ok) throw new Error('Failed to update service');
      const updated = await res.json();
      setCommunity(community.map(cm => cm.id === id ? updated : cm));
      setEditingCommunityId(null);
      alert('Community service updated!');
    } catch (err: any) {
      alert('Error updating community service: ' + err.message);
    }
  };

  const handleDeleteCommunity = async (id: number) => {
    if (!confirm('Are you sure you want to delete this community service item?')) return;
    try {
      await fetch(`${API_URL}/api/student-ncc/community/${id}`, { method: 'DELETE' });
      setCommunity(community.filter(cm => cm.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero & Text Details', icon: <FileText size={18} /> },
    { id: 'camps' as TabType, label: 'Central Camps', icon: <Info size={18} /> },
    { id: 'community' as TabType, label: 'Community Services', icon: <List size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading NCC Activities Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Palette className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                NCC Activities Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure NCC banner titles, history description, motto text, objectives, camps, and coordinator contacts bilingually.
              </p>
            </div>
          </div>

          <button
            onClick={handleSavePageSettings}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#631012] hover:bg-[#520d0f] active:scale-95 text-white font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 text-sm w-full sm:w-auto justify-center"
          >
            {saving ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Page Headers
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 p-3.5 bg-red-50 border-l-4 border-red-600 text-red-800 rounded-r-lg text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-white rounded-t-xl px-2 pt-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#631012] text-[#631012] bg-[#631012]/5 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contents */}
      <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 min-h-[400px]">
        {/* --- HERO TAB --- */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#631012] to-[#801416] p-6 rounded-xl text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <span className="text-xs uppercase bg-white/20 px-3 py-1 rounded-full font-semibold tracking-wider">
                  Live Banner Preview
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
                  {headingData.title_en || 'National Cadet Corps (NCC)'}
                </h2>
                <h3 className="text-lg font-medium text-white/95">
                  {headingData.title_hn || 'राष्ट्रीय कैडेट कोर (एनसीसी)'}
                </h3>
                <p className="text-sm text-white/70 max-w-xl italic mt-1">
                  {headingData.sub_title_en || 'Fostering discipline and leadership.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English */}
              <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#631012]"></span>
                  English Content (EN)
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Banner Title (EN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.title_en}
                    onChange={(e) => setHeadingData({ ...headingData, title_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Banner Subtitle (EN)</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.sub_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                  />
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">1. History Section</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">History Title (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.history_title_en}
                      onChange={(e) => setHeadingData({ ...headingData, history_title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">History Description (EN)</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012] whitespace-pre-wrap"
                      value={headingData.history_desc_en}
                      onChange={(e) => setHeadingData({ ...headingData, history_desc_en: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">2. Motto Section</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Motto Title (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.motto_title_en}
                      onChange={(e) => setHeadingData({ ...headingData, motto_title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Motto Description (EN)</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012] whitespace-pre-wrap"
                      value={headingData.motto_desc_en}
                      onChange={(e) => setHeadingData({ ...headingData, motto_desc_en: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">3. Aim Section</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Aim Title (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.aim_title_en}
                      onChange={(e) => setHeadingData({ ...headingData, aim_title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Aim Description (EN)</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012] whitespace-pre-wrap"
                      value={headingData.aim_desc_en}
                      onChange={(e) => setHeadingData({ ...headingData, aim_desc_en: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">Sub-Tab Headings (EN)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Camps Subtitle (EN)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                        value={headingData.camps_title_en}
                        onChange={(e) => setHeadingData({ ...headingData, camps_title_en: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Community Subtitle (EN)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                        value={headingData.community_title_en}
                        onChange={(e) => setHeadingData({ ...headingData, community_title_en: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hindi */}
              <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Hindi Content (HN)
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Banner Title (HN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, title_hn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Banner Subtitle (HN)</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.sub_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                  />
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">1. इतिहास अनुभाग</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">इतिहास शीर्षक (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.history_title_hn}
                      onChange={(e) => setHeadingData({ ...headingData, history_title_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">इतिहास विवरण (HN)</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012] whitespace-pre-wrap"
                      value={headingData.history_desc_hn}
                      onChange={(e) => setHeadingData({ ...headingData, history_desc_hn: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">2. आदर्श वाक्य अनुभाग</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">आदर्श वाक्य शीर्षक (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.motto_title_hn}
                      onChange={(e) => setHeadingData({ ...headingData, motto_title_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">आदर्श वाक्य विवरण (HN)</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012] whitespace-pre-wrap"
                      value={headingData.motto_desc_hn}
                      onChange={(e) => setHeadingData({ ...headingData, motto_desc_hn: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">3. उद्देश्य अनुभाग</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">उद्देश्य शीर्षक (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.aim_title_hn}
                      onChange={(e) => setHeadingData({ ...headingData, aim_title_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">उद्देश्य विवरण (HN)</label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012] whitespace-pre-wrap"
                      value={headingData.aim_desc_hn}
                      onChange={(e) => setHeadingData({ ...headingData, aim_desc_hn: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">Sub-Tab Headings (HN)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">केंद्रीय शिविर शीर्षक (HN)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                        value={headingData.camps_title_hn}
                        onChange={(e) => setHeadingData({ ...headingData, camps_title_hn: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">सामुदायिक सेवाएं शीर्षक (HN)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                        value={headingData.community_title_hn}
                        onChange={(e) => setHeadingData({ ...headingData, community_title_hn: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Coordinates & Links */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-150 mt-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#631012]" />
                Direct Communication Coordinates & Link URLs
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Coordinator Contact Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.coord_email}
                    onChange={(e) => setHeadingData({ ...headingData, coord_email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Training Calendar Link URL</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.calendar_url}
                    onChange={(e) => setHeadingData({ ...headingData, calendar_url: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- CAMPS TAB --- */}
        {activeTab === 'camps' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">NCC Central Camps List</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {camps.length} Camps
              </span>
            </div>

            {/* List */}
            <div className="space-y-3">
              {camps.map((item) => (
                <div key={item.id} className="p-4 border rounded-xl bg-gray-50/50 flex items-center justify-between gap-4">
                  {editingCampId === item.id ? (
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">Camp Activity (EN)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingCampData.camp_en}
                          onChange={(e) => setEditingCampData({ ...editingCampData, camp_en: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">Camp Activity (HN)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingCampData.camp_hn}
                          onChange={(e) => setEditingCampData({ ...editingCampData, camp_hn: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-gray-800">{item.camp_en}</p>
                      <p className="text-xs text-gray-500">{item.camp_hn}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 justify-end">
                    {editingCampId === item.id ? (
                      <>
                        <button
                          onClick={() => handleSaveCampEdit(item.id)}
                          className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingCampId(null)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingCampId(item.id);
                            setEditingCampData({
                              camp_en: item.camp_en,
                              camp_hn: item.camp_hn
                            });
                          }}
                          className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCamp(item.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add form */}
            <form onSubmit={handleAddCamp} className="p-5 border rounded-xl bg-gray-50/30 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Plus size={16} /> Add New Camp Activity
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Camp Activity (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. Leadership and team-building exercises."
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newCamp.camp_en}
                    onChange={(e) => setNewCamp({ ...newCamp, camp_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Camp Activity (HN)</label>
                  <input
                    type="text"
                    placeholder="e.g. नेतृत्व और टीम-निर्माण अभ्यास।"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newCamp.camp_hn}
                    onChange={(e) => setNewCamp({ ...newCamp, camp_hn: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#631012] hover:bg-[#520d0f] text-white font-medium text-sm rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={16} /> Add Camp
              </button>
            </form>
          </div>
        )}

        {/* --- COMMUNITY TAB --- */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">Community Service Campaigns</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {community.length} Services Listed
              </span>
            </div>

            {/* List */}
            <div className="space-y-3">
              {community.map((cm) => (
                <div key={cm.id} className="p-4 border rounded-xl bg-gray-50/50 flex items-center justify-between gap-4">
                  {editingCommunityId === cm.id ? (
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">Service (EN)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingCommunityData.service_en}
                          onChange={(e) => setEditingCommunityData({ ...editingCommunityData, service_en: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 block uppercase">Service (HN)</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                          value={editingCommunityData.service_hn}
                          onChange={(e) => setEditingCommunityData({ ...editingCommunityData, service_hn: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-gray-800">{cm.service_en}</p>
                      <p className="text-xs text-gray-500">{cm.service_hn}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 justify-end">
                    {editingCommunityId === cm.id ? (
                      <>
                        <button
                          onClick={() => handleSaveCommunityEdit(cm.id)}
                          className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingCommunityId(null)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingCommunityId(cm.id);
                            setEditingCommunityData({
                              service_en: cm.service_en,
                              service_hn: cm.service_hn
                            });
                          }}
                          className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCommunity(cm.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Form */}
            <form onSubmit={handleAddCommunity} className="p-5 border rounded-xl bg-gray-50/30 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Plus size={16} /> Add New Community Campaign
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Campaign Description (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. Tree plantation and environmental conservation projects."
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newCommunity.service_en}
                    onChange={(e) => setNewCommunity({ ...newCommunity, service_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Campaign Description (HN)</label>
                  <input
                    type="text"
                    placeholder="e.g. वृक्षारोपण और पर्यावरण संरक्षण परियोजनाएं।"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newCommunity.service_hn}
                    onChange={(e) => setNewCommunity({ ...newCommunity, service_hn: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#631012] hover:bg-[#520d0f] text-white font-medium text-sm rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={16} /> Add Service Point
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
