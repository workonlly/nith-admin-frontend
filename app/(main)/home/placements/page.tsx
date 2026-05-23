'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  TrendingUp,
  Plus,
  Trash2,
  Building2,
  Loader,
} from 'lucide-react';

interface StatItem {
  n_en: string;
  n_hi: string;

  d_en: string;
  d_hi: string;
}

interface PlacementsData {
  heading_en: string;
  heading_hi: string;

  stats: StatItem[];

  recruitersHeading_en: string;
  recruitersHeading_hi: string;

  recruitersDescription_en: string;
  recruitersDescription_hi: string;

  topRecruiters_en: string[];
  topRecruiters_hi: string[];
}

type TabType = 'content';

export default function PlacementsAdminPage() {
  const [activeTab, setActiveTab] =
    useState<TabType>('content');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [placementsData, setPlacementsData] =
    useState<PlacementsData>({
      heading_en: 'Placement Statistics',
      heading_hi: 'प्लेसमेंट सांख्यिकी',

      stats: [
        {
          n_en: '3.4 Cr',
          n_hi: '3.4 करोड़',

          d_en: 'Highest Package',
          d_hi: 'उच्चतम पैकेज',
        },
      ],

      recruitersHeading_en: 'Top Recruiters',
      recruitersHeading_hi: 'शीर्ष भर्तीकर्ता',

      recruitersDescription_en:
        'Leading companies visit our campus.',

      recruitersDescription_hi:
        'प्रमुख कंपनियाँ हमारे परिसर में आती हैं।',

      topRecruiters_en: [
        'Google',
        'Microsoft',
      ],

      topRecruiters_hi: [
        'गूगल',
        'माइक्रोसॉफ्ट',
      ],
    });

  const tabs = [
    {
      id: 'content' as TabType,
      label: 'Placements Content',
      icon: <Building2 size={18} />,
    },
  ];

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    let mounted = true;

    async function loadPlacementsData() {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(
          'http://localhost:4000/v1/homepage/placements'
        );

        const json = await res.json();

        if (mounted && json.success) {
          setPlacementsData({
            heading_en:
              json.data.heading_en || '',

            heading_hi:
              json.data.heading_hi || '',

            stats:
              json.data.stats || [],

            recruitersHeading_en:
              json.data.recruitersheading_en ||
              '',

            recruitersHeading_hi:
              json.data.recruitersheading_hi ||
              '',

            recruitersDescription_en:
              json.data
                .recruitersdescription_en ||
              '',

            recruitersDescription_hi:
              json.data
                .recruitersdescription_hi ||
              '',

            topRecruiters_en:
              json.data.toprecruiters_en ||
              [],

            topRecruiters_hi:
              json.data.toprecruiters_hi ||
              [],
          });
        }
      } catch (err) {
        console.error(err);
        setError(
          'Failed to fetch placements data'
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlacementsData();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================
  // SAVE
  // =========================

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const res = await fetch(
        'http://localhost:4000/v1/homepage/placements',
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(
            placementsData
          ),
        }
      );

      const json = await res.json();

      if (json.success) {
        setSuccess(
          'Changes saved successfully!'
        );

        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError(
          json.error ||
            'Failed to save changes'
        );
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // STATS FUNCTIONS
  // =========================

  const updateStat = (
    index: number,
    field: keyof StatItem,
    value: string
  ) => {
    const updated = [...placementsData.stats];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setPlacementsData({
      ...placementsData,
      stats: updated,
    });
  };

  const addStat = () => {
    setPlacementsData({
      ...placementsData,
      stats: [
        ...placementsData.stats,
        {
          n_en: '',
          n_hi: '',

          d_en: '',
          d_hi: '',
        },
      ],
    });
  };

  const removeStat = (index: number) => {
    setPlacementsData({
      ...placementsData,
      stats: placementsData.stats.filter(
        (_, i) => i !== index
      ),
    });
  };

  // =========================
  // RECRUITERS FUNCTIONS
  // =========================

  const updateRecruiter = (
    index: number,
    language: 'en' | 'hi',
    value: string
  ) => {
    if (language === 'en') {
      const updated = [
        ...placementsData.topRecruiters_en,
      ];

      updated[index] = value;

      setPlacementsData({
        ...placementsData,
        topRecruiters_en: updated,
      });
    } else {
      const updated = [
        ...placementsData.topRecruiters_hi,
      ];

      updated[index] = value;

      setPlacementsData({
        ...placementsData,
        topRecruiters_hi: updated,
      });
    }
  };

  const addRecruiter = () => {
    setPlacementsData({
      ...placementsData,

      topRecruiters_en: [
        ...placementsData.topRecruiters_en,
        '',
      ],

      topRecruiters_hi: [
        ...placementsData.topRecruiters_hi,
        '',
      ],
    });
  };

  const removeRecruiter = (
    index: number
  ) => {
    setPlacementsData({
      ...placementsData,

      topRecruiters_en:
        placementsData.topRecruiters_en.filter(
          (_, i) => i !== index
        ),

      topRecruiters_hi:
        placementsData.topRecruiters_hi.filter(
          (_, i) => i !== index
        ),
    });
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#631012] mx-auto mb-4" />

          <p className="text-gray-600">
            Loading placements data...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6 p-4 sm:p-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-2xl shadow-lg p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-7 h-7" />

          <h1 className="text-2xl sm:text-3xl font-bold">
            Placements
          </h1>
        </div>

        <p className="text-white/90">
          Manage placement statistics and
          recruiters
        </p>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
          {success}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* TOP BAR */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div className="flex items-center gap-3">
          <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">
            <TrendingUp className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#171717]">
              Placements Editor
            </h2>

            <p className="text-[#171717]/60">
              Edit placement content
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#631012] hover:bg-[#7a1214] text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
        >
          {saving ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* TABS */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">

        <div className="border-b border-[#171717]/10">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`
                  flex items-center gap-2 px-6 py-4 font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? 'bg-[#631012] text-white'
                      : 'text-[#171717]/70 hover:bg-[#F9F9F9]'
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-10">

          {/* HEADING */}
          <div className="space-y-4">

            <h2 className="text-2xl font-bold">
              Placement Heading
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="text"
                value={
                  placementsData.heading_en
                }
                onChange={(e) =>
                  setPlacementsData({
                    ...placementsData,
                    heading_en:
                      e.target.value,
                  })
                }
                placeholder="Heading English"
                className="w-full px-4 py-3 border rounded-xl text-black"
              />

              <input
                type="text"
                value={
                  placementsData.heading_hi
                }
                onChange={(e) =>
                  setPlacementsData({
                    ...placementsData,
                    heading_hi:
                      e.target.value,
                  })
                }
                placeholder="Heading Hindi"
                className="w-full px-4 py-3 border rounded-xl text-black"
              />
            </div>
          </div>

          {/* STATS */}
          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Statistics
              </h2>

              <button
                onClick={addStat}
                className="flex items-center gap-2 text-[#631012]"
              >
                <Plus size={18} />
                Add Stat
              </button>
            </div>

            {placementsData.stats.map(
              (stat, index) => (
                <div
                  key={index}
                  className="border rounded-2xl p-5 space-y-4 bg-[#F9F9F9]"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">
                      Stat {index + 1}
                    </h3>

                    <button
                      onClick={() =>
                        removeStat(index)
                      }
                      className="text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                      type="text"
                      value={stat.n_en}
                      onChange={(e) =>
                        updateStat(
                          index,
                          'n_en',
                          e.target.value
                        )
                      }
                      placeholder="Value English"
                      className="px-4 py-3 border rounded-xl text-black"
                    />

                    <input
                      type="text"
                      value={stat.n_hi}
                      onChange={(e) =>
                        updateStat(
                          index,
                          'n_hi',
                          e.target.value
                        )
                      }
                      placeholder="Value Hindi"
                      className="px-4 py-3 border rounded-xl text-black"
                    />

                    <input
                      type="text"
                      value={stat.d_en}
                      onChange={(e) =>
                        updateStat(
                          index,
                          'd_en',
                          e.target.value
                        )
                      }
                      placeholder="Description English"
                      className="px-4 py-3 border rounded-xl text-black"
                    />

                    <input
                      type="text"
                      value={stat.d_hi}
                      onChange={(e) =>
                        updateStat(
                          index,
                          'd_hi',
                          e.target.value
                        )
                      }
                      placeholder="Description Hindi"
                      className="px-4 py-3 border rounded-xl text-black"
                    />
                  </div>
                </div>
              )
            )}
          </div>

          {/* RECRUITERS */}
          <div className="space-y-5">

            <h2 className="text-2xl font-bold">
              Recruiters Section
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="text"
                value={
                  placementsData.recruitersHeading_en
                }
                onChange={(e) =>
                  setPlacementsData({
                    ...placementsData,
                    recruitersHeading_en:
                      e.target.value,
                  })
                }
                placeholder="Recruiters Heading English"
                className="px-4 py-3 border rounded-xl text-black"
              />

              <input
                type="text"
                value={
                  placementsData.recruitersHeading_hi
                }
                onChange={(e) =>
                  setPlacementsData({
                    ...placementsData,
                    recruitersHeading_hi:
                      e.target.value,
                  })
                }
                placeholder="Recruiters Heading Hindi"
                className="px-4 py-3 border rounded-xl text-black"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <textarea
                rows={4}
                value={
                  placementsData.recruitersDescription_en
                }
                onChange={(e) =>
                  setPlacementsData({
                    ...placementsData,
                    recruitersDescription_en:
                      e.target.value,
                  })
                }
                placeholder="Description English"
                className="px-4 py-3 border rounded-xl text-black"
              />

              <textarea
                rows={4}
                value={
                  placementsData.recruitersDescription_hi
                }
                onChange={(e) =>
                  setPlacementsData({
                    ...placementsData,
                    recruitersDescription_hi:
                      e.target.value,
                  })
                }
                placeholder="Description Hindi"
                className="px-4 py-3 border rounded-xl text-black"
              />
            </div>

            {/* COMPANIES */}
            <div className="space-y-4">

              {placementsData.topRecruiters_en.map(
                (_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <input
                      type="text"
                      value={
                        placementsData
                          .topRecruiters_en[
                          index
                        ] || ''
                      }
                      onChange={(e) =>
                        updateRecruiter(
                          index,
                          'en',
                          e.target.value
                        )
                      }
                      placeholder="Company English"
                      className="px-4 py-3 border rounded-xl text-black"
                    />

                    <div className="flex gap-2">

                      <input
                        type="text"
                        value={
                          placementsData
                            .topRecruiters_hi[
                            index
                          ] || ''
                        }
                        onChange={(e) =>
                          updateRecruiter(
                            index,
                            'hi',
                            e.target.value
                          )
                        }
                        placeholder="Company Hindi"
                        className="flex-1 px-4 py-3 border rounded-xl text-black"
                      />

                      <button
                        onClick={() =>
                          removeRecruiter(
                            index
                          )
                        }
                        className="px-4 text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </div>
                )
              )}

              <button
                onClick={addRecruiter}
                className="flex items-center gap-2 text-[#631012]"
              >
                <Plus size={18} />
                Add Company
              </button>
            </div>
          </div>

          {/* PREVIEW */}
          <div className="space-y-10">

            {/* ENGLISH */}
            <div className="p-6 bg-[#F9F9F9] rounded-2xl border-2 border-dashed">

              <h2 className="text-2xl font-bold mb-5">
                English Preview
              </h2>

              <div className="bg-black rounded-3xl p-8 relative overflow-hidden">

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

                  <div>

                    <h2 className="text-5xl font-black text-white mb-8">
                      {
                        placementsData.heading_en
                      }
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                      {placementsData.stats.map(
                        (
                          stat,
                          index
                        ) => (
                          <div
                            key={index}
                            className="bg-white rounded-2xl p-5 text-center"
                          >
                            <h3 className="text-3xl font-bold text-[#631012]">
                              {stat.n_en}
                            </h3>

                            <p className="text-gray-600 mt-2 text-sm">
                              {stat.d_en}
                            </p>
                          </div>
                        )
                      )}

                    </div>
                  </div>

                  <div>

                    <h3 className="text-4xl font-bold text-white mb-5">
                      {
                        placementsData.recruitersHeading_en
                      }
                    </h3>

                    <p className="text-white/80 mb-8">
                      {
                        placementsData.recruitersDescription_en
                      }
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                      {placementsData.topRecruiters_en.map(
                        (
                          company,
                          index
                        ) => (
                          <div
                            key={index}
                            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center"
                          >
                            <p className="text-white text-sm">
                              {company}
                            </p>
                          </div>
                        )
                      )}

                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HINDI */}
            <div className="p-6 bg-[#F9F9F9] rounded-2xl border-2 border-dashed">

              <h2 className="text-2xl font-bold mb-5">
                Hindi Preview
              </h2>

              <div className="bg-black rounded-3xl p-8 relative overflow-hidden">

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

                  <div>

                    <h2 className="text-5xl font-black text-white mb-8">
                      {
                        placementsData.heading_hi
                      }
                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                      {placementsData.stats.map(
                        (
                          stat,
                          index
                        ) => (
                          <div
                            key={index}
                            className="bg-white rounded-2xl p-5 text-center"
                          >
                            <h3 className="text-3xl font-bold text-[#631012]">
                              {stat.n_hi}
                            </h3>

                            <p className="text-gray-600 mt-2 text-sm">
                              {stat.d_hi}
                            </p>
                          </div>
                        )
                      )}

                    </div>
                  </div>

                  <div>

                    <h3 className="text-4xl font-bold text-white mb-5">
                      {
                        placementsData.recruitersHeading_hi
                      }
                    </h3>

                    <p className="text-white/80 mb-8">
                      {
                        placementsData.recruitersDescription_hi
                      }
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

                      {placementsData.topRecruiters_hi.map(
                        (
                          company,
                          index
                        ) => (
                          <div
                            key={index}
                            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center"
                          >
                            <p className="text-white text-sm">
                              {company}
                            </p>
                          </div>
                        )
                      )}

                    </div>
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