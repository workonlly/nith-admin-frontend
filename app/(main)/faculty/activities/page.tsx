'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Calendar,
  Plus,
  Trash2,
  FileText,
  Filter,
  MapPin,
  Monitor,
} from 'lucide-react';

interface Activity {
  id: number;
  date: string;
  title: string;
  description: string;
  category: string;
  mode: string;
  location: string;
}

interface ActivitiesData {
  heroHeadingEn: string;
  heroHeadingHn: string;
  heroDescriptionEn: string;
  heroDescriptionHn: string;
  filterHeading: string;
  categories: string[];
  activitiesTableHeading: string;
  activities: Activity[];
}

type TabType = 'hero' | 'activities' | 'sections';

export default function FacultyActivitiesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [subtexts, setSubtexts] = useState<any[]>([]);

  // Fetch heading and subtexts from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hData = await fetch('http://localhost:4000/api/faculty-activities').then(res => res.json());
        if (hData) {
          setActivitiesData(prev => ({
            ...prev,
            heroHeadingEn: hData.title_en || prev.heroHeadingEn,
            heroHeadingHn: hData.title_hn || prev.heroHeadingHn,
            heroDescriptionEn: hData.sub_title_en || prev.heroDescriptionEn,
            heroDescriptionHn: hData.sub_title_hn || prev.heroDescriptionHn,
          }));
        }
        
        const sData = await fetch('http://localhost:4000/api/faculty-activities/subtext').then(res => res.json());
        if (Array.isArray(sData)) {
          setSubtexts(sData);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const [activitiesData, setActivitiesData] = useState<ActivitiesData>({
    heroHeadingEn: 'Faculty Activities',
    heroHeadingHn: 'संकाय गतिविधियां',
    heroDescriptionEn: 'Stay connected with your alma mater through reunions, webinars, hackathons, and campus events.',
    heroDescriptionHn: 'पुनर्मिलन, वेबिनार, हैकाथॉन और कैंपस कार्यक्रमों के माध्यम से अपने अल्मा मेटर से जुड़े रहें।',
    filterHeading: 'Filter by Category:',
    categories: ['All', 'Reunions', 'Webinars', 'Hackathons', 'Campus Events'],
    activitiesTableHeading: 'Faculty Activities',
    activities: [
      {
        id: 1,
        date: 'Jan 20, 2025',
        title: 'Tech Talk: AI in Industry',
        description:
          'Learn about AI applications in modern industry from our distinguished alumni.',
        category: 'Webinars',
        mode: 'Online',
        location: 'Zoom',
      },
      {
        id: 2,
        date: 'Feb 5, 2025',
        title: 'Code Sprint 2025',
        description: '48-hour hackathon with mentorship from industry experts.',
        category: 'Hackathons',
        mode: 'Hybrid',
        location: 'CS Block & Online',
      },
      {
        id: 3,
        date: 'Feb 14, 2025',
        title: 'Campus Tour & Meet',
        description:
          'Explore the new campus developments with current students.',
        category: 'Campus Events',
        mode: 'Offline',
        location: 'NIT Hamirpur Campus',
      },
      {
        id: 4,
        date: 'Feb 28, 2025',
        title: 'Batch of 2015 Reunion',
        description: 'Special reunion for the graduating class of 2015.',
        category: 'Reunions',
        mode: 'Offline',
        location: 'Guest House, NIT Hamirpur',
      },
      {
        id: 5,
        date: 'Mar 10, 2025',
        title: 'Career Guidance Webinar',
        description: 'Alumni sharing career insights with current students.',
        category: 'Webinars',
        mode: 'Online',
        location: 'Google Meet',
      },
      {
        id: 6,
        date: 'Mar 20, 2025',
        title: 'Innovation Hackathon',
        description: 'Build innovative solutions for real-world problems.',
        category: 'Hackathons',
        mode: 'Hybrid',
        location: 'Innovation Hub & Discord',
      },
      {
        id: 7,
        date: 'Apr 1, 2025',
        title: 'Foundation Day Celebration',
        description:
          "Celebrate the institute's foundation day with cultural events.",
        category: 'Campus Events',
        mode: 'Offline',
        location: 'Open Air Theatre',
      },
      {
        id: 8,
        date: 'Apr 15, 2025',
        title: 'Startup Stories Webinar',
        description: 'Alumni entrepreneurs share their startup journeys.',
        category: 'Webinars',
        mode: 'Online',
        location: 'Microsoft Teams',
      },
      {
        id: 9,
        date: 'Apr 25, 2025',
        title: 'Silver Jubilee Reunion',
        description: '25 years celebration for batch of 2000.',
        category: 'Reunions',
        mode: 'Offline',
        location: 'Convention Center',
      },
    ],
  });

  const tabs = [
    {
      id: 'hero' as TabType,
      label: 'Hero Section',
      icon: <FileText size={18} />,
    },
    {
      id: 'activities' as TabType,
      label: 'Activities',
      icon: <Calendar size={18} />,
    },
    {
      id: 'sections' as TabType,
      label: 'Responsibility Sections',
      icon: <Monitor size={18} />,
    },
  ];

  const handleSaveSections = async () => {
    try {
      for (const section of subtexts) {
        if (section.id > 0 && section.id < 1000000) {
          await fetch(`http://localhost:4000/api/faculty-activities/subtext/${section.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(section),
          });
        } else {
          await fetch('http://localhost:4000/api/faculty-activities/subtext', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(section),
          });
        }
      }
      alert('Sections saved successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Save sections failed:', err);
      alert('Failed to save sections');
    }
  };

  const addSection = () => {
    setSubtexts([
      ...subtexts,
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        heading_en: 'New Section Header',
        heading_hn: 'नया अनुभाग',
        subheading_en: 'Role & Responsibilities Description',
        subheading_hn: 'भूमिका और जिम्मेदारियां विवरण',
        small_text: '• Bullet Point 1\n• Bullet Point 2',
      },
    ]);
  };

  const removeSection = async (index: number, id?: number) => {
    if (id && id > 0 && id < 1000000) {
      if (!confirm('Are you sure you want to delete this section from database?')) return;
      try {
        await fetch(`http://localhost:4000/api/faculty-activities/subtext/${id}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
    setSubtexts(subtexts.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: string, value: string) => {
    const updated = [...subtexts];
    updated[index] = { ...updated[index], [field]: value };
    setSubtexts(updated);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/faculty-activities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_en: activitiesData.heroHeadingEn,
          title_hn: activitiesData.heroHeadingHn,
          sub_title_en: activitiesData.heroDescriptionEn,
          sub_title_hn: activitiesData.heroDescriptionHn,
        }),
      });
      const res = await response.json();
      console.log('Saved:', res);
      alert('Changes saved successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save changes');
    }
  };

  // Activities
  const updateActivity = (id: number, field: keyof Activity, value: string) => {
    setActivitiesData({
      ...activitiesData,
      activities: activitiesData.activities.map((activity) =>
        activity.id === id ? { ...activity, [field]: value } : activity
      ),
    });
  };

  const addActivity = () => {
    const newId =
      activitiesData.activities.length > 0
        ? Math.max(...activitiesData.activities.map((a) => a.id)) + 1
        : 1;
    setActivitiesData({
      ...activitiesData,
      activities: [
        ...activitiesData.activities,
        {
          id: newId,
          date: '',
          title: '',
          description: '',
          category: 'Webinars',
          mode: 'Online',
          location: '',
        },
      ],
    });
  };

  const removeActivity = (id: number) => {
    setActivitiesData({
      ...activitiesData,
      activities: activitiesData.activities.filter((a) => a.id !== id),
    });
  };

  // Categories
  const updateCategory = (index: number, value: string) => {
    const updated = [...activitiesData.categories];
    updated[index] = value;
    setActivitiesData({ ...activitiesData, categories: updated });
  };

  const addCategory = () => {
    setActivitiesData({
      ...activitiesData,
      categories: [...activitiesData.categories, ''],
    });
  };

  const removeCategory = (index: number) => {
    setActivitiesData({
      ...activitiesData,
      categories: activitiesData.categories.filter((_, i) => i !== index),
    });
  };

  // Filter activities
  const filteredActivities =
    selectedCategory === 'All'
      ? activitiesData.activities
      : activitiesData.activities.filter(
          (activity) => activity.category === selectedCategory
        );

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-[#631012]/10 p-2 sm:p-3 rounded-full text-[#631012] flex-shrink-0">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#171717] break-words">
                Faculty Activities Editor
              </h1>
              <p className="text-sm sm:text-base text-[#171717]/60 mt-1">
                Manage faculty activities, events, and reunions
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
                      value={activitiesData.heroHeadingEn}
                      onChange={(e) => setActivitiesData({...activitiesData, heroHeadingEn: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#171717]/15 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm"
                      placeholder="Faculty Activities"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">Description</label>
                    <textarea
                      rows={4}
                      value={activitiesData.heroDescriptionEn}
                      onChange={(e) => setActivitiesData({...activitiesData, heroDescriptionEn: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#171717]/15 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm"
                      placeholder="Enter description"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]/50">Hindi Content</label>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">Heading (Hindi)</label>
                    <input
                      type="text"
                      value={activitiesData.heroHeadingHn}
                      onChange={(e) => setActivitiesData({...activitiesData, heroHeadingHn: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#171717]/15 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm"
                      placeholder="संकाय गतिविधियां"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#171717] mb-2">Description (Hindi)</label>
                    <textarea
                      rows={4}
                      value={activitiesData.heroDescriptionHn}
                      onChange={(e) => setActivitiesData({...activitiesData, heroDescriptionHn: e.target.value})}
                      className="w-full px-4 py-2.5 border border-[#171717]/15 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm"
                      placeholder="विवरण दर्ज करें"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-[#F9F9F9] rounded-xl border-2 border-dashed border-[#171717]/10">
                <p className="text-xs font-bold uppercase tracking-wider text-[#171717]/50 mb-4">Preview (English):</p>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-3">
                    {activitiesData.heroHeadingEn}
                  </h3>
                  <p className="text-base text-[#171717]/70 leading-relaxed">
                    {activitiesData.heroDescriptionEn}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Activities */}
          {activeTab === 'activities' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Calendar className="text-[#631012] w-5 h-5 sm:w-6 sm:h-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">
                  Activities Management
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
                        value={activitiesData.filterHeading}
                        onChange={(e) =>
                          setActivitiesData({
                            ...activitiesData,
                            filterHeading: e.target.value,
                          })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                        placeholder="Filter by Category:"
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
                        {activitiesData.categories.map((category, index) => (
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
                      Activities ({activitiesData.activities.length})
                    </h3>
                    <button
                      onClick={addActivity}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#631012] text-white text-sm rounded-lg hover:bg-[#7a1214] transition-colors"
                    >
                      <Plus size={16} />
                      Add Activity
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {activitiesData.activities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="p-3 border border-[#171717]/20 rounded-lg bg-white"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-[#171717]/60">
                            Activity {index + 1}
                          </span>
                          <button
                            onClick={() => removeActivity(activity.id)}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-[#171717]/60 mb-1">
                              Date
                            </label>
                            <input
                              type="text"
                              value={activity.date}
                              onChange={(e) =>
                                updateActivity(
                                  activity.id,
                                  'date',
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                              placeholder="Jan 20, 2025"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#171717]/60 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={activity.title}
                              onChange={(e) =>
                                updateActivity(
                                  activity.id,
                                  'title',
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                              placeholder="Activity Title"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs text-[#171717]/60 mb-1">
                              Description
                            </label>
                            <textarea
                              rows={2}
                              value={activity.description}
                              onChange={(e) =>
                                updateActivity(
                                  activity.id,
                                  'description',
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                              placeholder="Activity description"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#171717]/60 mb-1">
                              Category
                            </label>
                            <select
                              value={activity.category}
                              onChange={(e) =>
                                updateActivity(
                                  activity.id,
                                  'category',
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                            >
                              {activitiesData.categories
                                .filter((cat) => cat !== 'All')
                                .map((cat, idx) => (
                                  <option key={idx} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-[#171717]/60 mb-1">
                              Mode
                            </label>
                            <select
                              value={activity.mode}
                              onChange={(e) =>
                                updateActivity(
                                  activity.id,
                                  'mode',
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                            >
                              <option value="Online">Online</option>
                              <option value="Offline">Offline</option>
                              <option value="Hybrid">Hybrid</option>
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs text-[#171717]/60 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={activity.location}
                              onChange={(e) =>
                                updateActivity(
                                  activity.id,
                                  'location',
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm"
                              placeholder="Zoom / Campus"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-[#F9F9F9] rounded-lg border-2 border-dashed border-[#171717]/20">
                <p className="text-xs sm:text-sm font-medium text-[#171717]/60 mb-3">
                  Preview:
                </p>
                <div className="bg-white p-4 sm:p-6 rounded-lg space-y-4">
                  {/* Filter Section */}
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="text-[#631012] w-5 h-5" />
                    <h3 className="text-lg font-semibold text-[#171717]">
                      {activitiesData.filterHeading}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {activitiesData.categories.map((category, idx) => (
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

                  <div className="text-sm text-[#171717]/60 mb-2">
                    Showing {filteredActivities.length} of{' '}
                    {activitiesData.activities.length} activities
                  </div>

                  <div className="text-base font-semibold text-[#171717] mb-3">
                    Total: {filteredActivities.length} activities
                  </div>

                  {/* Activities Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#F9F9F9] border-b border-[#171717]/10">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[#171717] uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[#171717] uppercase tracking-wider">
                            Activity Title
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[#171717] uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[#171717] uppercase tracking-wider">
                            Mode
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-[#171717] uppercase tracking-wider">
                            Location
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-[#171717]/10">
                        {filteredActivities.map((activity) => (
                          <tr
                            key={activity.id}
                            className="hover:bg-[#F9F9F9] transition-colors"
                          >
                            <td className="px-4 py-3 text-sm text-[#171717] font-medium">
                              {activity.date}
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm font-semibold text-[#171717]">
                                {activity.title}
                              </div>
                              <div className="text-xs text-[#171717]/60 mt-1">
                                {activity.description}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#171717]">
                              {activity.category}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                  activity.mode === 'Online'
                                    ? 'bg-blue-100 text-blue-800'
                                    : activity.mode === 'Offline'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                <Monitor size={12} />
                                {activity.mode}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-sm text-[#171717]">
                                <MapPin size={14} className="text-[#631012]" />
                                {activity.location}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Responsibility Sections (Bullet Points) */}
          {activeTab === 'sections' && (
            <div className="space-y-6">
              <div className="flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Monitor className="text-[#631012] w-5 h-5 sm:w-6 sm:h-6" />
                  <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">
                    Responsibility Sections (Bullet Points)
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addSection}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md text-sm sm:text-base font-medium"
                  >
                    <Plus size={18} />
                    Add Section
                  </button>
                  <button
                    onClick={handleSaveSections}
                    className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-md text-sm sm:text-base font-medium"
                  >
                    <Save size={18} />
                    Save All
                  </button>
                </div>
              </div>

              <div className="space-y-8 mt-6">
                {subtexts.map((item, index) => (
                  <div key={index} className="p-6 border border-[#171717]/10 rounded-xl bg-[#F9F9F9] shadow-sm relative">
                    <button
                      onClick={() => removeSection(index, item.id)}
                      className="absolute top-4 right-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Section"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]/50">English Content</label>
                        <input
                          type="text"
                          value={item.heading_en}
                          onChange={(e) => updateSection(index, 'heading_en', e.target.value)}
                          className="w-full px-4 py-2.5 border border-[#171717]/15 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm font-semibold"
                          placeholder="Section Heading (English)"
                        />
                        <textarea
                          rows={2}
                          value={item.subheading_en}
                          onChange={(e) => updateSection(index, 'subheading_en', e.target.value)}
                          className="w-full px-4 py-2.5 border border-[#171717]/15 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm"
                          placeholder="Section Subheading (English)"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]/50">Hindi Content</label>
                        <input
                          type="text"
                          value={item.heading_hn}
                          onChange={(e) => updateSection(index, 'heading_hn', e.target.value)}
                          className="w-full px-4 py-2.5 border border-[#171717]/15 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm font-semibold"
                          placeholder="Section Heading (Hindi)"
                        />
                        <textarea
                          rows={2}
                          value={item.subheading_hn}
                          onChange={(e) => updateSection(index, 'subheading_hn', e.target.value)}
                          className="w-full px-4 py-2.5 border border-[#171717]/15 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm"
                          placeholder="Section Subheading (Hindi)"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#171717]/50 mb-2">Bullet Points (One per line)</label>
                      <textarea
                        rows={6}
                        value={item.small_text}
                        onChange={(e) => updateSection(index, 'small_text', e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#171717]/15 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm font-mono"
                        placeholder="• Point 1&#10;• Point 2"
                      />
                      <p className="text-[10px] text-[#171717]/40 mt-1 italic">Note: Content will be split by new lines on the website.</p>
                    </div>
                  </div>
                ))}

                {subtexts.length === 0 && (
                  <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <Monitor className="mx-auto w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No sections found. Add a new section to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
