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
  Users,
  Trophy
} from 'lucide-react';

interface YogaHeading {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  about_title_en: string;
  about_title_hn: string;
  about_desc_en: string;
  about_desc_hn: string;
}

interface YogaSchedule {
  id: number;
  time_en: string;
  time_hn: string;
  title_en: string;
  title_hn: string;
}

interface YogaBenefit {
  id: number;
  benefit_en: string;
  benefit_hn: string;
}

interface YogaInstructor {
  id: number;
  name_en: string;
  name_hn: string;
  role_en: string;
  role_hn: string;
  email: string;
}

type TabType = 'hero' | 'schedule' | 'benefits' | 'instructors';

export default function AnnualYogaDayPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const DEFAULT_HEADING: YogaHeading = {
    title_en: 'INTERNATIONAL YOGA DAY',
    title_hn: 'अंतर्राष्ट्रीय योग दिवस',
    sub_title_en: 'Join the campus community for yoga sessions that promote wellness, balance and mindful living.',
    sub_title_hn: 'संपूर्ण छात्र समुदाय में शामिल हो कर स्वास्थ्य, संतुलन और मानसिक शांति के लिए योग सत्रों में भाग लें।',
    about_title_en: 'About the Event',
    about_title_hn: 'कार्यक्रम के बारे में',
    about_desc_en: 'International Yoga Day at the institute brings students, staff and faculty together for guided yoga practices, breathing exercises and workshops led by trained instructors. The aim is to encourage physical and mental wellbeing, accessible to participants of all levels.',
    about_desc_hn: 'संस्थान में अंतर्राष्ट्रीय योग दिवस छात्रों, स्टाफ और संकाय को प्रशिक्षित प्रशिक्षकों द्वारा संचालित मार्गदर्शित योग, श्वास अभ्यास और कार्यशालाओं के लिए एकत्र करता है। उद्देश्य सभी स्तरों के प्रतिभागियों के लिए शारीरिक और मानसिक स्वास्थ्य को प्रोत्साहित करना है।'
  };

  const DEFAULT_SCHEDULE = [
    {
      time_en: '06:00 AM – 07:30 AM',
      time_hn: 'सुबह 06:00 – 07:30',
      title_en: 'Morning Yoga (All levels)',
      title_hn: 'मॉर्निंग योग (सभी स्तर)'
    },
    {
      time_en: '08:00 AM – 09:00 AM',
      time_hn: 'सुबह 08:00 – 09:00',
      title_en: 'Breathing & Relaxation Workshop',
      title_hn: 'प्राणायाम और विश्राम कार्यशाला'
    },
    {
      time_en: '10:00 AM – 12:00 PM',
      time_hn: 'सुबह 10:00 – 12:00',
      title_en: 'Advanced Techniques session',
      title_hn: 'उन्नत तकनीक सत्र'
    },
    {
      time_en: '03:00 PM – 04:00 PM',
      time_hn: 'दोपहर 03:00 – 04:00',
      title_en: 'Community Session & Q&A',
      title_hn: 'सामुदायिक सत्र और प्रश्नोत्तर'
    }
  ];

  const DEFAULT_BENEFITS = [
    {
      benefit_en: 'Improve flexibility, strength and posture',
      benefit_hn: 'लचीलापन, ताकत और मुद्रा में सुधार'
    },
    {
      benefit_en: 'Reduce stress with breathing techniques',
      benefit_hn: 'श्वास तकनीकों से तनाव में कमी'
    },
    {
      benefit_en: 'Increase mental clarity and focus',
      benefit_hn: 'मानसिक स्पष्टता और एकाग्रता में वृद्धि'
    },
    {
      benefit_en: 'Suitable for beginners and advanced practitioners',
      benefit_hn: 'शुरुआती और उन्नत दोनों के लिए उपयुक्त'
    }
  ];

  const DEFAULT_INSTRUCTORS = [
    {
      name_en: 'Ms. Ananya Sharma',
      name_hn: 'सुश्री अनन्या शर्मा',
      role_en: 'Senior Yoga Trainer',
      role_hn: 'वरिष्ठ योग प्रशिक्षक',
      email: 'ananya@yoga.nith.ac.in'
    },
    {
      name_en: 'Mr. Vikram Singh',
      name_hn: 'श्री विक्रम सिंह',
      role_en: 'Breathwork Specialist',
      role_hn: 'श्वास अभ्यास विशेषज्ञ',
      email: 'vikram@yoga.nith.ac.in'
    }
  ];

  // Singleton Heading state
  const [headingData, setHeadingData] = useState<YogaHeading>({
    title_en: DEFAULT_HEADING.title_en,
    title_hn: DEFAULT_HEADING.title_hn,
    sub_title_en: DEFAULT_HEADING.sub_title_en,
    sub_title_hn: DEFAULT_HEADING.sub_title_hn,
    about_title_en: DEFAULT_HEADING.about_title_en,
    about_title_hn: DEFAULT_HEADING.about_title_hn,
    about_desc_en: DEFAULT_HEADING.about_desc_en,
    about_desc_hn: DEFAULT_HEADING.about_desc_hn
  });

  // Dynamic Lists state
  const [schedule, setSchedule] = useState<YogaSchedule[]>([]);
  const [benefits, setBenefits] = useState<YogaBenefit[]>([]);
  const [instructors, setInstructors] = useState<YogaInstructor[]>([]);

  // CRUD Form states - Schedule
  const [newSchedule, setNewSchedule] = useState({ time_en: '', time_hn: '', title_en: '', title_hn: '' });
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(null);
  const [editingScheduleData, setEditingScheduleData] = useState({ time_en: '', time_hn: '', title_en: '', title_hn: '' });

  // CRUD Form states - Benefits
  const [newBenefit, setNewBenefit] = useState({ benefit_en: '', benefit_hn: '' });
  const [editingBenefitId, setEditingBenefitId] = useState<number | null>(null);
  const [editingBenefitData, setEditingBenefitData] = useState({ benefit_en: '', benefit_hn: '' });

  // CRUD Form states - Instructors
  const [newInstructor, setNewInstructor] = useState({ name_en: '', name_hn: '', role_en: '', role_hn: '', email: '' });
  const [editingInstructorId, setEditingInstructorId] = useState<number | null>(null);
  const [editingInstructorData, setEditingInstructorData] = useState({ name_en: '', name_hn: '', role_en: '', role_hn: '', email: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const handleLoadDefaultSchedule = async () => {
    try {
      setSaving(true);
      for (const item of DEFAULT_SCHEDULE) {
        await fetch(`${API_URL}/api/student-yogaday/schedule`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      await fetchData();
      alert('Default schedule initialized successfully!');
    } catch (err: any) {
      alert('Error initializing schedule: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadDefaultBenefits = async () => {
    try {
      setSaving(true);
      for (const item of DEFAULT_BENEFITS) {
        await fetch(`${API_URL}/api/student-yogaday/benefits`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      await fetchData();
      alert('Default benefits initialized successfully!');
    } catch (err: any) {
      alert('Error initializing benefits: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLoadDefaultInstructors = async () => {
    try {
      setSaving(true);
      for (const item of DEFAULT_INSTRUCTORS) {
        await fetch(`${API_URL}/api/student-yogaday/instructors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }
      await fetchData();
      alert('Default instructors initialized successfully!');
    } catch (err: any) {
      alert('Error initializing instructors: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Heading Settings
      const headRes = await fetch(`${API_URL}/api/student-yogaday`);
      if (headRes.ok) {
        const hData = await headRes.json();
        setHeadingData({
          title_en: hData.title_en || DEFAULT_HEADING.title_en,
          title_hn: hData.title_hn || DEFAULT_HEADING.title_hn,
          sub_title_en: hData.sub_title_en || DEFAULT_HEADING.sub_title_en,
          sub_title_hn: hData.sub_title_hn || DEFAULT_HEADING.sub_title_hn,
          about_title_en: hData.about_title_en || DEFAULT_HEADING.about_title_en,
          about_title_hn: hData.about_title_hn || DEFAULT_HEADING.about_title_hn,
          about_desc_en: hData.about_desc_en || DEFAULT_HEADING.about_desc_en,
          about_desc_hn: hData.about_desc_hn || DEFAULT_HEADING.about_desc_hn
        });
      }

      // 2. Schedule
      const schedRes = await fetch(`${API_URL}/api/student-yogaday/schedule`);
      if (schedRes.ok) {
        const sData = await schedRes.json();
        if (sData.length === 0) {
          for (const item of DEFAULT_SCHEDULE) {
            await fetch(`${API_URL}/api/student-yogaday/schedule`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            });
          }
          const schedRes2 = await fetch(`${API_URL}/api/student-yogaday/schedule`);
          setSchedule(await schedRes2.json());
        } else {
          setSchedule(sData);
        }
      }

      // 3. Benefits
      const benefitsRes = await fetch(`${API_URL}/api/student-yogaday/benefits`);
      if (benefitsRes.ok) {
        const bData = await benefitsRes.json();
        if (bData.length === 0) {
          for (const item of DEFAULT_BENEFITS) {
            await fetch(`${API_URL}/api/student-yogaday/benefits`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            });
          }
          const benefitsRes2 = await fetch(`${API_URL}/api/student-yogaday/benefits`);
          setBenefits(await benefitsRes2.json());
        } else {
          setBenefits(bData);
        }
      }

      // 4. Instructors
      const instRes = await fetch(`${API_URL}/api/student-yogaday/instructors`);
      if (instRes.ok) {
        const iData = await instRes.json();
        if (iData.length === 0) {
          for (const item of DEFAULT_INSTRUCTORS) {
            await fetch(`${API_URL}/api/student-yogaday/instructors`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            });
          }
          const instRes2 = await fetch(`${API_URL}/api/student-yogaday/instructors`);
          setInstructors(await instRes2.json());
        } else {
          setInstructors(iData);
        }
      }
    } catch (err: any) {
      console.error('Error fetching Yoga Day data:', err);
      setError('Failed to fetch Yoga Day details from backend. Check API status.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-yogaday`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update Yoga Day headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('Yoga Day banner and about settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Schedule CRUD ---
  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchedule.time_en.trim() || !newSchedule.time_hn.trim() || !newSchedule.title_en.trim() || !newSchedule.title_hn.trim()) {
      alert('All schedule fields (Bilingual) are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-yogaday/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule),
      });
      if (!res.ok) throw new Error('Failed to add schedule item');
      const saved = await res.json();
      setSchedule([...schedule, saved]);
      setNewSchedule({ time_en: '', time_hn: '', title_en: '', title_hn: '' });
      alert('Schedule item added!');
    } catch (err: any) {
      alert('Error adding schedule item: ' + err.message);
    }
  };

  const handleSaveScheduleEdit = async (id: number) => {
    if (!editingScheduleData.time_en.trim() || !editingScheduleData.time_hn.trim() || !editingScheduleData.title_en.trim() || !editingScheduleData.title_hn.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-yogaday/schedule/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingScheduleData),
      });
      if (!res.ok) throw new Error('Failed to update schedule');
      const updated = await res.json();
      setSchedule(schedule.map(s => s.id === id ? updated : s));
      setEditingScheduleId(null);
      alert('Schedule item updated!');
    } catch (err: any) {
      alert('Error updating schedule item: ' + err.message);
    }
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!confirm('Are you sure you want to delete this schedule item?')) return;
    try {
      await fetch(`${API_URL}/api/student-yogaday/schedule/${id}`, { method: 'DELETE' });
      setSchedule(schedule.filter(s => s.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  // --- Benefits CRUD ---
  const handleAddBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBenefit.benefit_en.trim() || !newBenefit.benefit_hn.trim()) {
      alert('Bilingual benefit descriptions are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-yogaday/benefits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBenefit),
      });
      if (!res.ok) throw new Error('Failed to add benefit');
      const saved = await res.json();
      setBenefits([...benefits, saved]);
      setNewBenefit({ benefit_en: '', benefit_hn: '' });
      alert('Yoga benefit added!');
    } catch (err: any) {
      alert('Error adding benefit: ' + err.message);
    }
  };

  const handleSaveBenefitEdit = async (id: number) => {
    if (!editingBenefitData.benefit_en.trim() || !editingBenefitData.benefit_hn.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-yogaday/benefits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBenefitData),
      });
      if (!res.ok) throw new Error('Failed to update benefit');
      const updated = await res.json();
      setBenefits(benefits.map(b => b.id === id ? updated : b));
      setEditingBenefitId(null);
      alert('Benefit updated!');
    } catch (err: any) {
      alert('Error updating benefit: ' + err.message);
    }
  };

  const handleDeleteBenefit = async (id: number) => {
    if (!confirm('Are you sure you want to delete this benefit?')) return;
    try {
      await fetch(`${API_URL}/api/student-yogaday/benefits/${id}`, { method: 'DELETE' });
      setBenefits(benefits.filter(b => b.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  // --- Instructors CRUD ---
  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstructor.name_en.trim() || !newInstructor.name_hn.trim() || !newInstructor.role_en.trim() || !newInstructor.role_hn.trim()) {
      alert('Instructor names and roles (Bilingual) are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-yogaday/instructors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInstructor),
      });
      if (!res.ok) throw new Error('Failed to add instructor');
      const saved = await res.json();
      setInstructors([...instructors, saved]);
      setNewInstructor({ name_en: '', name_hn: '', role_en: '', role_hn: '', email: '' });
      alert('Instructor added!');
    } catch (err: any) {
      alert('Error adding instructor: ' + err.message);
    }
  };

  const handleSaveInstructorEdit = async (id: number) => {
    if (!editingInstructorData.name_en.trim() || !editingInstructorData.name_hn.trim() || !editingInstructorData.role_en.trim() || !editingInstructorData.role_hn.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-yogaday/instructors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingInstructorData),
      });
      if (!res.ok) throw new Error('Failed to update instructor');
      const updated = await res.json();
      setInstructors(instructors.map(i => i.id === id ? updated : i));
      setEditingInstructorId(null);
      alert('Instructor updated!');
    } catch (err: any) {
      alert('Error updating instructor: ' + err.message);
    }
  };

  const handleDeleteInstructor = async (id: number) => {
    if (!confirm('Are you sure you want to delete this instructor?')) return;
    try {
      await fetch(`${API_URL}/api/student-yogaday/instructors/${id}`, { method: 'DELETE' });
      setInstructors(instructors.filter(i => i.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  const tabs = [
    { id: 'hero' as TabType, label: 'Hero & About Us', icon: <FileText size={18} /> },
    { id: 'schedule' as TabType, label: 'Event Schedule', icon: <List size={18} /> },
    { id: 'benefits' as TabType, label: 'Yoga Benefits', icon: <Trophy size={18} /> },
    { id: 'instructors' as TabType, label: 'Instructors / Trainers', icon: <Users size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Yoga Day Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Panel */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Palette className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                International Yoga Day Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure international yoga day banner titles, schedules, benefits list, and instructor details bilingually.
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
            Save Page Headings
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 p-3.5 bg-red-50 border-l-4 border-red-600 text-red-800 rounded-r-lg text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tabs list */}
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

      {/* Main Tab Content */}
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
                  {headingData.title_en || 'INTERNATIONAL YOGA DAY'}
                </h2>
                <h3 className="text-lg font-medium text-white/95">
                  {headingData.title_hn || 'अंतर्राष्ट्रीय योग दिवस'}
                </h3>
                <p className="text-sm text-white/70 max-w-xl italic mt-1">
                  {headingData.sub_title_en || 'Campus community guided yoga practices.'}
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
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">About Us Section Title (EN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.about_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, about_title_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">About Us Description (EN)</label>
                  <textarea
                    rows={5}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012] whitespace-pre-wrap"
                    value={headingData.about_desc_en}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc_en: e.target.value })}
                  />
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
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">About Us Section Title (HN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.about_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, about_title_hn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">About Us Description (HN)</label>
                  <textarea
                    rows={5}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012] whitespace-pre-wrap"
                    value={headingData.about_desc_hn}
                    onChange={(e) => setHeadingData({ ...headingData, about_desc_hn: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SCHEDULE TAB --- */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">Event Schedules</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {schedule.length} Entries
              </span>
            </div>

            {/* Existing Schedule Items */}
            {schedule.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed rounded-xl bg-gray-50/50 p-6">
                <p className="text-sm text-gray-500 font-medium mb-3">No schedule entries found in the database.</p>
                <button
                  type="button"
                  onClick={handleLoadDefaultSchedule}
                  disabled={saving}
                  className="px-4 py-2 bg-[#631012] hover:bg-[#520d0f] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  Load Default Schedule Data
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {schedule.map((item, idx) => (
                  <div key={item.id} className="p-4 border rounded-xl bg-gray-50/50 flex flex-col md:flex-row justify-between gap-4">
                    {editingScheduleId === item.id ? (
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 block uppercase">Time (EN)</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                            value={editingScheduleData.time_en}
                            onChange={(e) => setEditingScheduleData({ ...editingScheduleData, time_en: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 block uppercase">Time (HN)</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                            value={editingScheduleData.time_hn}
                            onChange={(e) => setEditingScheduleData({ ...editingScheduleData, time_hn: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 block uppercase">Title (EN)</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                            value={editingScheduleData.title_en}
                            onChange={(e) => setEditingScheduleData({ ...editingScheduleData, title_en: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 block uppercase">Title (HN)</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                            value={editingScheduleData.title_hn}
                            onChange={(e) => setEditingScheduleData({ ...editingScheduleData, title_hn: e.target.value })}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-[#631012]/10 text-[#631012] font-semibold text-xs px-2.5 py-1 rounded-md">
                            {item.time_en}
                          </span>
                          <span className="bg-red-50 text-red-700 font-semibold text-xs px-2.5 py-1 rounded-md">
                            {item.time_hn}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-800 text-sm mt-2">{item.title_en}</h4>
                        <p className="text-gray-500 text-xs">{item.title_hn}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 justify-end">
                      {editingScheduleId === item.id ? (
                        <>
                          <button
                            onClick={() => handleSaveScheduleEdit(item.id)}
                            className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingScheduleId(null)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingScheduleId(item.id);
                              setEditingScheduleData({
                                time_en: item.time_en,
                                time_hn: item.time_hn,
                                title_en: item.title_en,
                                title_hn: item.title_hn
                              });
                            }}
                            className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(item.id)}
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
            )}

            {/* Add Schedule Form */}
            <form onSubmit={handleAddSchedule} className="p-5 border rounded-xl bg-gray-50/30 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Plus size={16} /> Add New Schedule Entry
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Time (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. 06:00 AM – 07:30 AM"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newSchedule.time_en}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Time (HN)</label>
                  <input
                    type="text"
                    placeholder="e.g. सुबह 06:00 – 07:30"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newSchedule.time_hn}
                    onChange={(e) => setNewSchedule({ ...newSchedule, time_hn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Title (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. Morning Yoga (All levels)"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newSchedule.title_en}
                    onChange={(e) => setNewSchedule({ ...newSchedule, title_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Title (HN)</label>
                  <input
                    type="text"
                    placeholder="e.g. मॉर्निंग योग (सभी स्तर)"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newSchedule.title_hn}
                    onChange={(e) => setNewSchedule({ ...newSchedule, title_hn: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#631012] hover:bg-[#520d0f] text-white font-medium text-sm rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={16} /> Add Entry
              </button>
            </form>
          </div>
        )}

        {/* --- BENEFITS TAB --- */}
        {activeTab === 'benefits' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">Yoga Day Benefits</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {benefits.length} Benefits Listed
              </span>
            </div>

            {/* List */}
            {benefits.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed rounded-xl bg-gray-50/50 p-6">
                <p className="text-sm text-gray-500 font-medium mb-3">No benefit entries found in the database.</p>
                <button
                  type="button"
                  onClick={handleLoadDefaultBenefits}
                  disabled={saving}
                  className="px-4 py-2 bg-[#631012] hover:bg-[#520d0f] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  Load Default Benefits Data
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {benefits.map((b) => (
                  <div key={b.id} className="p-4 border rounded-xl bg-gray-50/50 flex items-center justify-between gap-4">
                    {editingBenefitId === b.id ? (
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 block uppercase">Benefit (EN)</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                            value={editingBenefitData.benefit_en}
                            onChange={(e) => setEditingBenefitData({ ...editingBenefitData, benefit_en: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 block uppercase">Benefit (HN)</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                            value={editingBenefitData.benefit_hn}
                            onChange={(e) => setEditingBenefitData({ ...editingBenefitData, benefit_hn: e.target.value })}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-semibold text-gray-800">{b.benefit_en}</p>
                        <p className="text-xs text-gray-500">{b.benefit_hn}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 justify-end">
                      {editingBenefitId === b.id ? (
                        <>
                          <button
                            onClick={() => handleSaveBenefitEdit(b.id)}
                            className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingBenefitId(null)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingBenefitId(b.id);
                              setEditingBenefitData({
                                benefit_en: b.benefit_en,
                                benefit_hn: b.benefit_hn
                              });
                            }}
                            className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteBenefit(b.id)}
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
            )}

            {/* Add Benefit Form */}
            <form onSubmit={handleAddBenefit} className="p-5 border rounded-xl bg-gray-50/30 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Plus size={16} /> Add New Benefit Point
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Benefit Description (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. Improve flexibility, strength and posture"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newBenefit.benefit_en}
                    onChange={(e) => setNewBenefit({ ...newBenefit, benefit_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Benefit Description (HN)</label>
                  <input
                    type="text"
                    placeholder="e.g. लचीलापन, ताकत और मुद्रा में सुधार"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newBenefit.benefit_hn}
                    onChange={(e) => setNewBenefit({ ...newBenefit, benefit_hn: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#631012] hover:bg-[#520d0f] text-white font-medium text-sm rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={16} /> Add Benefit
              </button>
            </form>
          </div>
        )}

        {/* --- INSTRUCTORS TAB --- */}
        {activeTab === 'instructors' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">Instructors & Trainers</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {instructors.length} Trainers
              </span>
            </div>

            {/* List */}
            {instructors.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed rounded-xl bg-gray-50/50 p-6 w-full">
                <p className="text-sm text-gray-500 font-medium mb-3">No instructor entries found in the database.</p>
                <button
                  type="button"
                  onClick={handleLoadDefaultInstructors}
                  disabled={saving}
                  className="px-4 py-2 bg-[#631012] hover:bg-[#520d0f] text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
                >
                  Load Default Instructors Data
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {instructors.map((trainer) => (
                  <div key={trainer.id} className="p-4 border rounded-xl bg-gray-50/50 flex flex-col justify-between gap-4">
                    {editingInstructorId === trainer.id ? (
                      <div className="space-y-3 flex-1">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 block uppercase">Name (EN)</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                            value={editingInstructorData.name_en}
                            onChange={(e) => setEditingInstructorData({ ...editingInstructorData, name_en: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 block uppercase">Name (HN)</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                            value={editingInstructorData.name_hn}
                            onChange={(e) => setEditingInstructorData({ ...editingInstructorData, name_hn: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 block uppercase">Role (EN)</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                            value={editingInstructorData.role_en}
                            onChange={(e) => setEditingInstructorData({ ...editingInstructorData, role_en: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 block uppercase">Role (HN)</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                            value={editingInstructorData.role_hn}
                            onChange={(e) => setEditingInstructorData({ ...editingInstructorData, role_hn: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 block uppercase">Email</label>
                          <input
                            type="email"
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                            value={editingInstructorData.email}
                            onChange={(e) => setEditingInstructorData({ ...editingInstructorData, email: e.target.value })}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 flex-1">
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">{trainer.name_en}</h4>
                          <p className="text-xs text-gray-500 font-medium">{trainer.name_hn}</p>
                        </div>
                        <div className="text-xs text-gray-600 space-y-0.5 border-t pt-2">
                          <p><span className="font-bold text-gray-700">Role:</span> {trainer.role_en} ({trainer.role_hn})</p>
                          {trainer.email && <p><span className="font-bold text-gray-700">Email:</span> {trainer.email}</p>}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 justify-end border-t pt-3">
                      {editingInstructorId === trainer.id ? (
                        <>
                          <button
                            onClick={() => handleSaveInstructorEdit(trainer.id)}
                            className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => setEditingInstructorId(null)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingInstructorId(trainer.id);
                              setEditingInstructorData({
                                name_en: trainer.name_en,
                                name_hn: trainer.name_hn,
                                role_en: trainer.role_en,
                                role_hn: trainer.role_hn,
                                email: trainer.email
                              });
                            }}
                            className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteInstructor(trainer.id)}
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
            )}

            {/* Add Form */}
            <form onSubmit={handleAddInstructor} className="p-5 border rounded-xl bg-gray-50/30 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Plus size={16} /> Add New Instructor / Trainer
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Name (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. Ms. Ananya Sharma"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newInstructor.name_en}
                    onChange={(e) => setNewInstructor({ ...newInstructor, name_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Name (HN)</label>
                  <input
                    type="text"
                    placeholder="e.g. सुश्री अनन्या शर्मा"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newInstructor.name_hn}
                    onChange={(e) => setNewInstructor({ ...newInstructor, name_hn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Role (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Yoga Trainer"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newInstructor.role_en}
                    onChange={(e) => setNewInstructor({ ...newInstructor, role_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Role (HN)</label>
                  <input
                    type="text"
                    placeholder="e.g. वरिष्ठ योग प्रशिक्षक"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newInstructor.role_hn}
                    onChange={(e) => setNewInstructor({ ...newInstructor, role_hn: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 block uppercase">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. ananya@yoga.nith.ac.in"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newInstructor.email}
                    onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#631012] hover:bg-[#520d0f] text-white font-medium text-sm rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={16} /> Add Instructor
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
