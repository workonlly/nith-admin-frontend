'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Settings, Award, ClipboardList, Gift, HelpCircle, Eye } from 'lucide-react';

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  about_title_en: string;
  about_title_hn: string;
  about_desc_en: string;
  about_desc_hn: string;
  join_title_en: string;
  join_title_hn: string;
  join_desc_en: string;
  join_desc_hn: string;
  join_btn1_en: string;
  join_btn1_hn: string;
  join_btn2_en: string;
  join_btn2_hn: string;
  inquiries_text_en: string;
  inquiries_text_hn: string;
}

interface CategoryData {
  id: number;
  title_en: string;
  title_hn: string;
  description_en: string;
  description_hn: string;
  icon: string;
}

interface InitiativeData {
  id: number;
  name_en: string;
  name_hn: string;
  initiated_by_en: string;
  initiated_by_hn: string;
  year_introduced: number;
  frequency_en: string;
  frequency_hn: string;
  description_en: string;
  description_hn: string;
}

interface EligibilityData {
  id: number;
  step: string;
  title_en: string;
  title_hn: string;
  points_en: string; // Newline-separated in admin for easy editing
  points_hn: string;
}

interface BenefitData {
  id: number;
  icon: string;
  title_en: string;
  title_hn: string;
  description_en: string;
  description_hn: string;
}

const INITIAL_HEADING: HeadingData = {
  title_en: 'Awards Initiatives',
  title_hn: 'पुरस्कार पहल',
  sub_title_en: 'Recognizing excellence, celebrating achievements, and honoring the outstanding contributions of our distinguished alumni community.',
  sub_title_hn: 'उत्कृष्टता को मान्यता देना, उपलब्धियों का जश्न मनाना और हमारे प्रतिष्ठित पूर्व छात्र समुदाय के उत्कृष्ट योगदान का सम्मान करना।',
  about_title_en: 'About Alumni Awards',
  about_title_hn: 'पूर्व छात्र पुरस्कारों के बारे में',
  about_desc_en: '',
  about_desc_hn: '',
  join_title_en: 'Join Us in Celebrating Excellence',
  join_title_hn: 'उत्कृष्टता का जश्न मनाने में हमारे साथ जुड़ें',
  join_desc_en: 'Help us recognize and honor outstanding alumni. Nominate deserving candidates or propose new award initiatives to strengthen our community.',
  join_desc_hn: 'उत्कृष्ट पूर्व छात्रों को पहचानने और उनका सम्मान करने में हमारी मदद करें। हमारे समुदाय को मजबूत करने के लिए योग्य उम्मीदवारों को नामांकित करें या नई पुरस्कार पहलों का प्रस्ताव दें।',
  join_btn1_en: 'Nominate an Alumni',
  join_btn1_hn: 'एक पूर्व छात्र को नामांकित करें',
  join_btn2_en: 'Propose an Award Initiative',
  join_btn2_hn: 'पुरस्कार पहल का प्रस्ताव दें',
  inquiries_text_en: 'For inquiries about award nominations or initiatives, contact alumni@nith.ac.in',
  inquiries_text_hn: 'पुरस्कार नामांकन या पहलों के बारे में पूछताछ के लिए, alumni@nith.ac.in पर संपर्क करें'
};

export default function AwardInitiativesAdmin() {
  const [heading, setHeading] = useState<HeadingData>(INITIAL_HEADING);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [initiatives, setInitiatives] = useState<InitiativeData[]>([]);
  const [eligibility, setEligibility] = useState<EligibilityData[]>([]);
  const [benefits, setBenefits] = useState<BenefitData[]>([]);

  // Deletions tracking
  const [deletedCategoryIds, setDeletedCategoryIds] = useState<number[]>([]);
  const [deletedInitiativeIds, setDeletedInitiativeIds] = useState<number[]>([]);
  const [deletedEligibilityIds, setDeletedEligibilityIds] = useState<number[]>([]);
  const [deletedBenefitIds, setDeletedBenefitIds] = useState<number[]>([]);

  const [activeTab, setActiveTab] = useState<'headings' | 'categories' | 'initiatives' | 'eligibility' | 'benefits'>('headings');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/alumni-awards', { cache: 'no-store' });
        const data = await res.json();
        
        if (data.heading) {
          setHeading(data.heading);
        }
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
        if (Array.isArray(data.initiatives)) {
          setInitiatives(data.initiatives);
        }
        if (Array.isArray(data.eligibility)) {
          setEligibility(data.eligibility);
        }
        if (Array.isArray(data.benefits)) {
          setBenefits(data.benefits);
        }
      } catch (err) {
        console.error('Fetch Alumni Awards data failed:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Save all changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Headings PUT request
      await fetch('http://localhost:4000/api/alumni-awards/heading', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heading)
      });

      // 2. Perform deletions
      for (const id of deletedCategoryIds) {
        await fetch(`http://localhost:4000/api/alumni-awards/categories/${id}`, { method: 'DELETE' });
      }
      for (const id of deletedInitiativeIds) {
        await fetch(`http://localhost:4000/api/alumni-awards/initiatives/${id}`, { method: 'DELETE' });
      }
      for (const id of deletedEligibilityIds) {
        await fetch(`http://localhost:4000/api/alumni-awards/eligibility/${id}`, { method: 'DELETE' });
      }
      for (const id of deletedBenefitIds) {
        await fetch(`http://localhost:4000/api/alumni-awards/benefits/${id}`, { method: 'DELETE' });
      }

      // Reset deletions tracking lists
      setDeletedCategoryIds([]);
      setDeletedInitiativeIds([]);
      setDeletedEligibilityIds([]);
      setDeletedBenefitIds([]);

      // 3. Save Categories
      for (const cat of categories) {
        if (cat.id > 0 && cat.id < 1000000000) {
          await fetch(`http://localhost:4000/api/alumni-awards/categories/${cat.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cat)
          });
        } else {
          await fetch('http://localhost:4000/api/alumni-awards/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...cat, id: undefined })
          });
        }
      }

      // 4. Save Initiatives
      for (const init of initiatives) {
        if (init.id > 0 && init.id < 1000000000) {
          await fetch(`http://localhost:4000/api/alumni-awards/initiatives/${init.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(init)
          });
        } else {
          await fetch('http://localhost:4000/api/alumni-awards/initiatives', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...init, id: undefined })
          });
        }
      }

      // 5. Save Eligibility steps
      for (const elig of eligibility) {
        if (elig.id > 0 && elig.id < 1000000000) {
          await fetch(`http://localhost:4000/api/alumni-awards/eligibility/${elig.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(elig)
          });
        } else {
          await fetch('http://localhost:4000/api/alumni-awards/eligibility', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...elig, id: undefined })
          });
        }
      }

      // 6. Save Benefits
      for (const ben of benefits) {
        if (ben.id > 0 && ben.id < 1000000000) {
          await fetch(`http://localhost:4000/api/alumni-awards/benefits/${ben.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ben)
          });
        } else {
          await fetch('http://localhost:4000/api/alumni-awards/benefits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...ben, id: undefined })
          });
        }
      }

      alert('All Alumni Awards initiatives saved successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Failed to save changes:', err);
      alert('Error saving changes. Please check server logs.');
    } finally {
      setIsSaving(false);
    }
  };

  // Categories CRUD helpers
  const handleAddCategory = () => {
    const newItem: CategoryData = {
      id: Date.now() + Math.random(),
      title_en: '',
      title_hn: '',
      description_en: '',
      description_hn: '',
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
    };
    setCategories(prev => [...prev, newItem]);
  };
  const handleRemoveCategory = (id: number) => {
    if (id > 0 && id < 1000000000) {
      setDeletedCategoryIds(prev => [...prev, id]);
    }
    setCategories(prev => prev.filter(c => c.id !== id));
  };
  const handleUpdateCategory = (id: number, field: keyof CategoryData, value: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Initiatives CRUD helpers
  const handleAddInitiative = () => {
    const newItem: InitiativeData = {
      id: Date.now() + Math.random(),
      name_en: '',
      name_hn: '',
      initiated_by_en: '',
      initiated_by_hn: '',
      year_introduced: new Date().getFullYear(),
      frequency_en: 'Annual',
      frequency_hn: 'वार्षिक',
      description_en: '',
      description_hn: ''
    };
    setInitiatives(prev => [...prev, newItem]);
  };
  const handleRemoveInitiative = (id: number) => {
    if (id > 0 && id < 1000000000) {
      setDeletedInitiativeIds(prev => [...prev, id]);
    }
    setInitiatives(prev => prev.filter(i => i.id !== id));
  };
  const handleUpdateInitiative = (id: number, field: keyof InitiativeData, value: any) => {
    setInitiatives(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  // Eligibility CRUD helpers
  const handleAddEligibility = () => {
    const newItem: EligibilityData = {
      id: Date.now() + Math.random(),
      step: `0${eligibility.length + 1}`,
      title_en: '',
      title_hn: '',
      points_en: '',
      points_hn: ''
    };
    setEligibility(prev => [...prev, newItem]);
  };
  const handleRemoveEligibility = (id: number) => {
    if (id > 0 && id < 1000000000) {
      setDeletedEligibilityIds(prev => [...prev, id]);
    }
    setEligibility(prev => prev.filter(e => e.id !== id));
  };
  const handleUpdateEligibility = (id: number, field: keyof EligibilityData, value: string) => {
    setEligibility(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  // Benefits CRUD helpers
  const handleAddBenefit = () => {
    const newItem: BenefitData = {
      id: Date.now() + Math.random(),
      icon: 'M9 12l2 2 4-4',
      title_en: '',
      title_hn: '',
      description_en: '',
      description_hn: ''
    };
    setBenefits(prev => [...prev, newItem]);
  };
  const handleRemoveBenefit = (id: number) => {
    if (id > 0 && id < 1000000000) {
      setDeletedBenefitIds(prev => [...prev, id]);
    }
    setBenefits(prev => prev.filter(b => b.id !== id));
  };
  const handleUpdateBenefit = (id: number, field: keyof BenefitData, value: string) => {
    setBenefits(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F9F9F9]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Top banner header card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-8 h-8 text-[#800000]" />
              Alumni Awards & Initiatives
            </h1>
            <p className="text-gray-500 mt-1">
              Configure and manage headings, award categories, initiatives table, process steps, and benefits.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#631012] text-white rounded-lg hover:bg-[#4d0c0e] font-semibold transition-all disabled:bg-gray-400 shadow-md hover:shadow-lg"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Dynamic Tab Navigation Headers */}
        <div className="flex overflow-x-auto whitespace-nowrap border-b border-gray-200 mt-6 gap-1 pb-1">
          <button
            onClick={() => setActiveTab('headings')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'headings'
                ? 'border-[#800000] text-[#800000]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            Page Copy & Headings
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'categories'
                ? 'border-[#800000] text-[#800000]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Award className="w-5 h-5" />
            Award Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('initiatives')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'initiatives'
                ? 'border-[#800000] text-[#800000]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            Initiatives Table ({initiatives.length})
          </button>
          <button
            onClick={() => setActiveTab('eligibility')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'eligibility'
                ? 'border-[#800000] text-[#800000]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            Process & Eligibility ({eligibility.length})
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'benefits'
                ? 'border-[#800000] text-[#800000]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Gift className="w-5 h-5" />
            Benefits & Citation ({benefits.length})
          </button>
        </div>
      </div>

      {/* Main Tab Panels Content */}

      {/* Headings Tab */}
      {activeTab === 'headings' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#800000] pl-2 mb-2">Main Hero Copy</h2>
            <p className="text-gray-500 text-sm">Update the primary welcome title and introductory banner subtitles.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title (English)</label>
              <input
                type="text"
                value={heading.title_en}
                onChange={e => setHeading(prev => ({ ...prev, title_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title (Hindi)</label>
              <input
                type="text"
                value={heading.title_hn}
                onChange={e => setHeading(prev => ({ ...prev, title_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-title (English)</label>
              <textarea
                rows={3}
                value={heading.sub_title_en}
                onChange={e => setHeading(prev => ({ ...prev, sub_title_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-title (Hindi)</label>
              <textarea
                rows={3}
                value={heading.sub_title_hn}
                onChange={e => setHeading(prev => ({ ...prev, sub_title_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#800000] pl-2 mb-2">About Section</h2>
            <p className="text-gray-500 text-sm mb-4">Edit the details about award history, objectives, and significance bilingually.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Title (English)</label>
                <input
                  type="text"
                  value={heading.about_title_en}
                  onChange={e => setHeading(prev => ({ ...prev, about_title_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Title (Hindi)</label>
                <input
                  type="text"
                  value={heading.about_title_hn}
                  onChange={e => setHeading(prev => ({ ...prev, about_title_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Description (English)</label>
                <textarea
                  rows={6}
                  value={heading.about_desc_en}
                  onChange={e => setHeading(prev => ({ ...prev, about_desc_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Description (Hindi)</label>
                <textarea
                  rows={6}
                  value={heading.about_desc_hn}
                  onChange={e => setHeading(prev => ({ ...prev, about_desc_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#800000] pl-2 mb-2">Join & Nominations Box</h2>
            <p className="text-gray-500 text-sm mb-4">Edit the interactive nomination Call-To-Action (CTA) block at the bottom of the page.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Title (English)</label>
                <input
                  type="text"
                  value={heading.join_title_en}
                  onChange={e => setHeading(prev => ({ ...prev, join_title_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Title (Hindi)</label>
                <input
                  type="text"
                  value={heading.join_title_hn}
                  onChange={e => setHeading(prev => ({ ...prev, join_title_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Description (English)</label>
                <textarea
                  rows={2}
                  value={heading.join_desc_en}
                  onChange={e => setHeading(prev => ({ ...prev, join_desc_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Description (Hindi)</label>
                <textarea
                  rows={2}
                  value={heading.join_desc_hn}
                  onChange={e => setHeading(prev => ({ ...prev, join_desc_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Button 1 Text (English)</label>
                <input
                  type="text"
                  value={heading.join_btn1_en}
                  onChange={e => setHeading(prev => ({ ...prev, join_btn1_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Button 1 Text (Hindi)</label>
                <input
                  type="text"
                  value={heading.join_btn1_hn}
                  onChange={e => setHeading(prev => ({ ...prev, join_btn1_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Button 2 Text (English)</label>
                <input
                  type="text"
                  value={heading.join_btn2_en}
                  onChange={e => setHeading(prev => ({ ...prev, join_btn2_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Button 2 Text (Hindi)</label>
                <input
                  type="text"
                  value={heading.join_btn2_hn}
                  onChange={e => setHeading(prev => ({ ...prev, join_btn2_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Inquiries Note (English)</label>
                <input
                  type="text"
                  value={heading.inquiries_text_en}
                  onChange={e => setHeading(prev => ({ ...prev, inquiries_text_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Inquiries Note (Hindi)</label>
                <input
                  type="text"
                  value={heading.inquiries_text_hn}
                  onChange={e => setHeading(prev => ({ ...prev, inquiries_text_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#800000] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#800000] pl-2">Award Categories</h2>
              <p className="text-gray-500 text-sm mt-1">Configure categories featuring custom SVG path shapes and details.</p>
            </div>
            <button
              onClick={handleAddCategory}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#631012] hover:bg-[#4d0c0e] text-white font-semibold rounded-lg text-sm transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" /> Add New Category
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {categories.map((cat, idx) => (
              <div key={cat.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200 relative space-y-4">
                <button
                  onClick={() => handleRemoveCategory(cat.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Remove Category"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="font-bold text-[#800000] text-sm flex items-center gap-1">
                  <Award className="w-4 h-4" /> Category Item #{idx + 1}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title (English)</label>
                    <input
                      type="text"
                      value={cat.title_en}
                      onChange={e => handleUpdateCategory(cat.id, 'title_en', e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#800000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title (Hindi)</label>
                    <input
                      type="text"
                      value={cat.title_hn}
                      onChange={e => handleUpdateCategory(cat.id, 'title_hn', e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#800000]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description (English)</label>
                    <textarea
                      rows={2}
                      value={cat.description_en}
                      onChange={e => handleUpdateCategory(cat.id, 'description_en', e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#800000]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description (Hindi)</label>
                    <textarea
                      rows={2}
                      value={cat.description_hn}
                      onChange={e => handleUpdateCategory(cat.id, 'description_hn', e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#800000]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">SVG Icon Path String (Lucide/Standard Shape)</label>
                    <input
                      type="text"
                      value={cat.icon}
                      onChange={e => handleUpdateCategory(cat.id, 'icon', e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-[#800000]"
                    />
                  </div>
                </div>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="text-center py-8 text-gray-500 font-medium bg-gray-50 rounded-lg">
                No categories configured. Click Add Category above to create one!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Initiatives Table Tab */}
      {activeTab === 'initiatives' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#800000] pl-2">Alumni Initiatives List</h2>
              <p className="text-gray-500 text-sm mt-1">Configure specific awards listed in the tabular interactive section.</p>
            </div>
            <button
              onClick={handleAddInitiative}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#631012] hover:bg-[#4d0c0e] text-white font-semibold rounded-lg text-sm transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" /> Add New Initiative
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left border-b border-gray-200">
                  <th className="py-3 px-4 font-bold text-xs uppercase text-gray-700 w-1/5">Award Name (EN/HN)</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-gray-700 w-1/6">Initiated By (EN/HN)</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-gray-700 w-[100px]">Year / Freq</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-gray-700">Description (EN/HN)</th>
                  <th className="py-3 px-4 font-bold text-xs uppercase text-gray-700 w-[60px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {initiatives.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors align-top">
                    <td className="py-3 px-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Name (English)"
                        value={item.name_en}
                        onChange={e => handleUpdateInitiative(item.id, 'name_en', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                      <input
                        type="text"
                        placeholder="Name (Hindi)"
                        value={item.name_hn}
                        onChange={e => handleUpdateInitiative(item.id, 'name_hn', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                    </td>
                    <td className="py-3 px-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Initiated By (English)"
                        value={item.initiated_by_en}
                        onChange={e => handleUpdateInitiative(item.id, 'initiated_by_en', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                      <input
                        type="text"
                        placeholder="Initiated By (Hindi)"
                        value={item.initiated_by_hn}
                        onChange={e => handleUpdateInitiative(item.id, 'initiated_by_hn', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                    </td>
                    <td className="py-3 px-3 space-y-2">
                      <input
                        type="number"
                        placeholder="Year"
                        value={item.year_introduced}
                        onChange={e => handleUpdateInitiative(item.id, 'year_introduced', parseInt(e.target.value) || 0)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                      <input
                        type="text"
                        placeholder="Frequency (EN)"
                        value={item.frequency_en}
                        onChange={e => handleUpdateInitiative(item.id, 'frequency_en', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                      <input
                        type="text"
                        placeholder="Frequency (HN)"
                        value={item.frequency_hn}
                        onChange={e => handleUpdateInitiative(item.id, 'frequency_hn', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                    </td>
                    <td className="py-3 px-3 space-y-2">
                      <textarea
                        rows={2}
                        placeholder="Description (English)"
                        value={item.description_en}
                        onChange={e => handleUpdateInitiative(item.id, 'description_en', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                      <textarea
                        rows={2}
                        placeholder="Description (Hindi)"
                        value={item.description_hn}
                        onChange={e => handleUpdateInitiative(item.id, 'description_hn', e.target.value)}
                        className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-[#800000]"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleRemoveInitiative(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 mt-1"
                        title="Delete Initiative"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {initiatives.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 font-medium bg-gray-50 rounded-lg">
                      No initiatives configured. Click Add Initiative above to create one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Eligibility steps Tab */}
      {activeTab === 'eligibility' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#800000] pl-2">Process & Eligibility Steps</h2>
              <p className="text-gray-500 text-sm mt-1">Configure nomination steps and display points (enter one point per line).</p>
            </div>
            <button
              onClick={handleAddEligibility}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#631012] hover:bg-[#4d0c0e] text-white font-semibold rounded-lg text-sm transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" /> Add New Step
            </button>
          </div>

          <div className="space-y-6">
            {eligibility.map((elig, idx) => (
              <div key={elig.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200 relative space-y-4">
                <button
                  onClick={() => handleRemoveEligibility(elig.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Remove Step"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="font-bold text-[#800000] text-sm flex items-center gap-1">
                  <Award className="w-4 h-4" /> Step Item #{idx + 1}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Step Number/Code (e.g. 01)</label>
                    <input
                      type="text"
                      value={elig.step}
                      onChange={e => handleUpdateEligibility(elig.id, 'step', e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#800000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title (English)</label>
                    <input
                      type="text"
                      value={elig.title_en}
                      onChange={e => handleUpdateEligibility(elig.id, 'title_en', e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#800000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title (Hindi)</label>
                    <input
                      type="text"
                      value={elig.title_hn}
                      onChange={e => handleUpdateEligibility(elig.id, 'title_hn', e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#800000]"
                    />
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Points List (English) - <span className="text-[#800000]">One point per line</span></label>
                      <textarea
                        rows={4}
                        placeholder="Enter first eligibility point&#10;Enter second eligibility point"
                        value={elig.points_en}
                        onChange={e => handleUpdateEligibility(elig.id, 'points_en', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#800000]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Points List (Hindi) - <span className="text-[#800000]">One point per line</span></label>
                      <textarea
                        rows={4}
                        placeholder="पहला पात्रता बिंदु दर्ज करें&#10;दूसरा पात्रता बिंदु दर्ज करें"
                        value={elig.points_hn}
                        onChange={e => handleUpdateEligibility(elig.id, 'points_hn', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#800000]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {eligibility.length === 0 && (
              <div className="text-center py-8 text-gray-500 font-medium bg-gray-50 rounded-lg">
                No process steps configured. Click Add Step above to create one!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Benefits Tab */}
      {activeTab === 'benefits' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#800000] pl-2">Recognition & Benefits Copy</h2>
              <p className="text-gray-500 text-sm mt-1">Configure specific honors and awards-benefits highlight items.</p>
            </div>
            <button
              onClick={handleAddBenefit}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#631012] hover:bg-[#4d0c0e] text-white font-semibold rounded-lg text-sm transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" /> Add New Benefit
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {benefits.map((ben, idx) => (
              <div key={ben.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200 relative space-y-4">
                <button
                  onClick={() => handleRemoveBenefit(ben.id)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Remove Benefit"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="font-bold text-[#800000] text-sm flex items-center gap-1">
                  <Gift className="w-4 h-4" /> Benefit Highlight Item #{idx + 1}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title (English)</label>
                    <input
                      type="text"
                      value={ben.title_en}
                      onChange={e => handleUpdateBenefit(ben.id, 'title_en', e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#800000]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title (Hindi)</label>
                    <input
                      type="text"
                      value={ben.title_hn}
                      onChange={e => handleUpdateBenefit(ben.id, 'title_hn', e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#800000]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description (English)</label>
                    <textarea
                      rows={2}
                      value={ben.description_en}
                      onChange={e => handleUpdateBenefit(ben.id, 'description_en', e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#800000]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description (Hindi)</label>
                    <textarea
                      rows={2}
                      value={ben.description_hn}
                      onChange={e => handleUpdateBenefit(ben.id, 'description_hn', e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#800000]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Icon Shape Path String</label>
                    <input
                      type="text"
                      value={ben.icon}
                      onChange={e => handleUpdateBenefit(ben.id, 'icon', e.target.value)}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-[#800000]"
                    />
                  </div>
                </div>
              </div>
            ))}

            {benefits.length === 0 && (
              <div className="text-center py-8 text-gray-500 font-medium bg-gray-50 rounded-lg">
                No benefits configured. Click Add Benefit above to create one!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Save Action Bar at the Bottom */}
      {/* <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4 flex justify-between items-center sticky bottom-4 z-10">
        <span className="text-sm font-medium text-gray-500">
          Make sure to click save to sync all changes dynamically!
        </span>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-[#631012] text-white rounded-lg hover:bg-[#4d0c0e] font-bold text-sm transition-all disabled:bg-gray-400 shadow-md hover:shadow-lg"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </div> */}
    </div>
  );
}
