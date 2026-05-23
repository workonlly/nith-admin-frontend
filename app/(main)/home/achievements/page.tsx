'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Trophy,
  Plus,
  Trash2,
  Loader,
  Image as ImageIcon,
  Languages,
} from 'lucide-react';

interface AchievementItem {
  id?: number;

  tagline_en: string;
  tagline_hi: string;

  heading_en: string;
  heading_hi: string;

  description_en: string;
  description_hi: string;

  image: string;
}

interface AchievementsData {
  achievements: AchievementItem[];
}

type Language = 'en' | 'hi';

export default function AchievementsAdminPage() {

  const [language, setLanguage] =
    useState<Language>('en');

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  const [achievementsData, setAchievementsData] =
    useState<AchievementsData>({
      achievements: [],
    });

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    let mounted = true;

    async function loadAchievements() {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(
          'http://localhost:4000/v1/homepage/achievements'
        );

        const json = await res.json();

        if (mounted && json.success) {
          setAchievementsData({
            achievements: json.data || [],
          });
        }

      } catch (err) {
        console.error(err);
        setError(
          'Failed to fetch achievements'
        );

      } finally {
        setLoading(false);
      }
    }

    loadAchievements();

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
        'http://localhost:4000/v1/homepage/achievements',
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(
            achievementsData
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
  // UPDATE ACHIEVEMENT
  // =========================

  const updateAchievement = (
    index: number,
    field: keyof AchievementItem,
    value: string
  ) => {

    const updated = [
      ...achievementsData.achievements,
    ];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setAchievementsData({
      ...achievementsData,
      achievements: updated,
    });
  };

  // =========================
  // ADD ACHIEVEMENT
  // =========================

  const addAchievement = () => {

    setAchievementsData({
      ...achievementsData,

      achievements: [
        ...achievementsData.achievements,

        {
          tagline_en: '',
          tagline_hi: '',

          heading_en: '',
          heading_hi: '',

          description_en: '',
          description_hi: '',

          image: '',
        },
      ],
    });
  };

  // =========================
  // REMOVE ACHIEVEMENT
  // =========================

  const removeAchievement = (
    index: number
  ) => {

    setAchievementsData({
      ...achievementsData,

      achievements:
        achievementsData.achievements.filter(
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
            Loading achievements...
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

          <Trophy className="w-7 h-7" />

          <h1 className="text-2xl sm:text-3xl font-bold">
            Achievements
          </h1>
        </div>

        <p className="text-white/90">
          Manage achievements section
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
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">

            <Trophy className="w-6 h-6" />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-[#171717]">
              Achievements Editor
            </h2>

            <p className="text-[#171717]/60">
              Edit achievements content
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* LANGUAGE TOGGLE */}
          <div className="flex items-center bg-[#631012]/10 rounded-full p-1">

            <button
              onClick={() =>
                setLanguage('en')
              }
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                language === 'en'
                  ? 'bg-[#631012] text-white'
                  : 'text-[#631012]'
              }`}
            >
              English
            </button>

            <button
              onClick={() =>
                setLanguage('hi')
              }
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                language === 'hi'
                  ? 'bg-[#631012] text-white'
                  : 'text-[#631012]'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* SAVE */}
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
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-10">

        {/* HEADING */}
        <div className="flex items-center gap-2">

          <Trophy className="text-[#631012] w-6 h-6" />

          <h2 className="text-2xl font-bold text-[#171717]">
            Achievements List
          </h2>
        </div>

        {/* ACHIEVEMENTS */}
        <div className="space-y-4">

          {achievementsData.achievements.map(
            (achievement, index) => (

              <div
                key={index}
                className="p-5 border border-[#171717]/10 rounded-2xl bg-[#F9F9F9]"
              >

                {/* TOP */}
                <div className="flex justify-between items-center mb-4">

                  <p className="font-medium text-sm">
                    Achievement {index + 1}
                  </p>

                  <button
                    onClick={() =>
                      removeAchievement(index)
                    }
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* TAGLINE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tagline English
                    </label>

                    <input
                      type="text"
                      value={
                        achievement.tagline_en
                      }
                      onChange={(e) =>
                        updateAchievement(
                          index,
                          'tagline_en',
                          e.target.value
                        )
                      }
                      placeholder="Academic Excellence"
                      className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tagline Hindi
                    </label>

                    <input
                      type="text"
                      value={
                        achievement.tagline_hi
                      }
                      onChange={(e) =>
                        updateAchievement(
                          index,
                          'tagline_hi',
                          e.target.value
                        )
                      }
                      placeholder="शैक्षणिक उत्कृष्टता"
                      className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl"
                    />
                  </div>
                </div>

                {/* HEADING */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Heading English
                    </label>

                    <input
                      type="text"
                      value={
                        achievement.heading_en
                      }
                      onChange={(e) =>
                        updateAchievement(
                          index,
                          'heading_en',
                          e.target.value
                        )
                      }
                      placeholder="Achievement Heading"
                      className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Heading Hindi
                    </label>

                    <input
                      type="text"
                      value={
                        achievement.heading_hi
                      }
                      onChange={(e) =>
                        updateAchievement(
                          index,
                          'heading_hi',
                          e.target.value
                        )
                      }
                      placeholder="उपलब्धि शीर्षक"
                      className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl"
                    />
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description English
                    </label>

                    <textarea
                      rows={4}
                      value={
                        achievement.description_en
                      }
                      onChange={(e) =>
                        updateAchievement(
                          index,
                          'description_en',
                          e.target.value
                        )
                      }
                      placeholder="Achievement description"
                      className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description Hindi
                    </label>

                    <textarea
                      rows={4}
                      value={
                        achievement.description_hi
                      }
                      onChange={(e) =>
                        updateAchievement(
                          index,
                          'description_hi',
                          e.target.value
                        )
                      }
                      placeholder="उपलब्धि विवरण"
                      className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl"
                    />
                  </div>
                </div>

                {/* IMAGE */}
                <div>

                  <label className="block text-sm font-medium mb-2">
                    Image URL
                  </label>

                  <div className="flex items-center gap-2">

                    <div className="px-4 text-[#631012]">

                      <ImageIcon size={20} />
                    </div>

                    <input
                      type="text"
                      value={achievement.image}
                      onChange={(e) =>
                        updateAchievement(
                          index,
                          'image',
                          e.target.value
                        )
                      }
                      placeholder="/nith.jpg"
                      className="flex-1 px-4 py-3 border border-[#171717]/20 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )
          )}

          {/* ADD BUTTON */}
          <button
            onClick={addAchievement}
            className="flex items-center gap-2 text-[#631012] font-medium"
          >

            <Plus size={18} />
            Add Achievement
          </button>
        </div>

        {/* PREVIEW */}
        <div className="p-6 bg-[#F9F9F9] rounded-2xl border-2 border-dashed border-[#171717]/10">

          <div className="flex items-center justify-between mb-5">

            <p className="text-sm font-medium text-[#171717]/60">
              Live Preview
            </p>

            <div className="flex items-center gap-2 text-[#631012]">

              <Languages size={18} />

              <span className="text-sm font-medium">
                {language === 'en'
                  ? 'English Preview'
                  : 'Hindi Preview'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#171717]/10">

            <h2 className="text-4xl font-bold text-[#631012] mb-10 border-b-4 border-[#631012] inline-block pb-2">

              {language === 'en'
                ? 'Achievements'
                : 'उपलब्धियाँ'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {achievementsData.achievements.map(
                (achievement, index) => (

                  <div
                    key={index}
                    className="bg-[#F9F9F9] rounded-2xl overflow-hidden border border-[#171717]/10 shadow-sm"
                  >

                    {/* IMAGE */}
                    <div className="h-48 bg-gray-200 overflow-hidden">

                      {achievement.image ? (
                        <img
                          src={achievement.image}
                          alt={
                            language === 'en'
                              ? achievement.heading_en
                              : achievement.heading_hi
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-5">

                      <span className="inline-block px-3 py-1 bg-[#631012]/10 text-[#631012] text-xs font-semibold rounded-full mb-3">

                        {language === 'en'
                          ? achievement.tagline_en
                          : achievement.tagline_hi}
                      </span>

                      <h3 className="text-lg font-bold text-[#631012] mb-3">

                        {language === 'en'
                          ? achievement.heading_en
                          : achievement.heading_hi}
                      </h3>

                      <p className="text-gray-700 text-sm leading-relaxed">

                        {language === 'en'
                          ? achievement.description_en
                          : achievement.description_hi}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}