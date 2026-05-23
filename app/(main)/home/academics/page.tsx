'use client';

import React, { useState, useEffect } from 'react';
import { Save, Calendar, Plus, Trash2, Loader } from 'lucide-react';

interface AcademicsItem {
  id?: number;
  title_en: string;
  title_hi: string;
  date: string;
  description_en: string;
  description_hi: string;
  category_en: string;
  category_hi: string;
}

interface AcademicsData {
  academics: AcademicsItem[];
}

type TabType = 'content';

interface LanguageStrings {
  header: string;
  headerSubtitle: string;
  editorTitle: string;
  editorSubtitle: string;
  saveButton: string;
  savingButton: string;
  errorTitle: string;
  loadingText: string;
  academicList: string;
  noAcademics: string;
  addFirstAcademics: string;
  academicLabel: string;
  titleLabelEn: string;
  titlePlaceholderEn: string;
  titleLabelHi: string;
  titlePlaceholderHi: string;
  dateLabel: string;
  categoryLabelEn: string;
  categoryPlaceholderEn: string;
  categoryLabelHi: string;
  categoryPlaceholderHi: string;
  descriptionLabelEn: string;
  descriptionPlaceholderEn: string;
  descriptionLabelHi: string;
  descriptionPlaceholderHi: string;
  addAcademics: string;
  previewEn: string;
  previewHi: string;
  previewCategory: string;
  previewTitle: string;
  previewDescription: string;
  deleteSuccess: string;
  saveSuccess: string;
  contentTab: string;
  tabContent: string;
  tryAgain: string;
  englishSection: string;
  hindiSection: string;
}

const translations: { en: LanguageStrings; hi: LanguageStrings } = {
  en: {
    header: 'Academics',
    headerSubtitle: 'Manage academic section content',
    editorTitle: 'Academics Editor',
    editorSubtitle: 'Edit academic content',
    saveButton: 'Save Changes',
    savingButton: 'Saving...',
    errorTitle: '⚠️ Error',
    loadingText: 'Loading academic...',
    academicList: 'Academics List',
    noAcademics: 'No academic found',
    addFirstAcademics: 'Add First Academics',
    academicLabel: 'Academics',
    titleLabelEn: 'Title (English)',
    titlePlaceholderEn: 'Academics title in English',
    titleLabelHi: 'Title (Hindi)',
    titlePlaceholderHi: 'Academics title in Hindi',
    dateLabel: 'Date',
    categoryLabelEn: 'Category (English)',
    categoryPlaceholderEn: 'Technical, Cultural, etc.',
    categoryLabelHi: 'Category (Hindi)',
    categoryPlaceholderHi: 'तकनीकी, सांस्कृतिक, आदि।',
    descriptionLabelEn: 'Description (English)',
    descriptionPlaceholderEn: 'Academics description in English',
    descriptionLabelHi: 'Description (Hindi)',
    descriptionPlaceholderHi: 'हिंदी में समाचार विवरण',
    addAcademics: 'Add Academics',
    previewEn: 'English Preview',
    previewHi: 'Hindi Preview',
    previewCategory: 'ACADEMIC',
    previewTitle: 'Academics Title',
    previewDescription: 'Academics description',
    deleteSuccess: 'Academics deleted successfully!',
    saveSuccess: 'Changes saved successfully!',
    contentTab: 'Academics Content',
    tabContent: 'Manage academic items',
    tryAgain: 'Try Again',
    englishSection: 'English Content',
    hindiSection: 'Hindi Content',
  },
  hi: {
    header: 'समाचार',
    headerSubtitle: 'समाचार अनुभाग की सामग्री प्रबंधित करें',
    editorTitle: 'समाचार संपादक',
    editorSubtitle: 'समाचार सामग्री संपादित करें',
    saveButton: 'परिवर्तन सहेजें',
    savingButton: 'सहेज रहे हैं...',
    errorTitle: '⚠️ त्रुटि',
    loadingText: 'समाचार लोड हो रहे हैं...',
    academicList: 'समाचार सूची',
    noAcademics: 'कोई समाचार नहीं मिला',
    addFirstAcademics: 'पहला समाचार जोड़ें',
    academicLabel: 'समाचार',
    titleLabelEn: 'शीर्षक (अंग्रेजी)',
    titlePlaceholderEn: 'अंग्रेजी में समाचार शीर्षक',
    titleLabelHi: 'शीर्षक (हिंदी)',
    titlePlaceholderHi: 'हिंदी में समाचार शीर्षक',
    dateLabel: 'तारीख',
    categoryLabelEn: 'श्रेणी (अंग्रेजी)',
    categoryPlaceholderEn: 'तकनीकी, सांस्कृतिक, आदि।',
    categoryLabelHi: 'श्रेणी (हिंदी)',
    categoryPlaceholderHi: 'तकनीकी, सांस्कृतिक, आदि।',
    descriptionLabelEn: 'विवरण (अंग्रेजी)',
    descriptionPlaceholderEn: 'अंग्रेजी में समाचार विवरण',
    descriptionLabelHi: 'विवरण (हिंदी)',
    descriptionPlaceholderHi: 'हिंदी में समाचार विवरण',
    addAcademics: 'समाचार जोड़ें',
    previewEn: 'अंग्रेजी पूर्वावलोकन',
    previewHi: 'हिंदी पूर्वावलोकन',
    previewCategory: 'शैक्षणिक',
    previewTitle: 'समाचार शीर्षक',
    previewDescription: 'समाचार विवरण',
    deleteSuccess: 'समाचार सफलतापूर्वक हटा दिया गया!',
    saveSuccess: 'परिवर्तन सफलतापूर्वक सहेजे गए!',
    contentTab: 'समाचार सामग्री',
    tabContent: 'समाचार आइटम प्रबंधित करें',
    tryAgain: 'पुनः प्रयास करें',
    englishSection: 'अंग्रेजी सामग्री',
    hindiSection: 'हिंदी सामग्री',
  },
};

// Hindi numerals mapping
const hindiNumerals: { [key: string]: string } = {
  '0': '०',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९',
};

// Hindi month names
const hindiMonths = [
  'जनवरी',
  'फरवरी',
  'मार्च',
  'अप्रैल',
  'मई',
  'जून',
  'जुलाई',
  'अगस्त',
  'सितंबर',
  'अक्टूबर',
  'नवंबर',
  'दिसंबर',
];

// Convert English numerals to Hindi
const convertToHindiNumerals = (str: string): string => {
  return str.split('').map((char) => hindiNumerals[char] || char).join('');
};

export default function AcademicsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [academicData, setAcademicsData] = useState<AcademicsData>({
    academics: [],
  });

  const t = translations.en;

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    let mounted = true;

    async function loadAcademicsData() {
      try {
        setLoading(true);
        setError('');

        const res = await fetch('http://localhost:4000/v1/homepage/academic');
        const json = await res.json();

        if (mounted && json.success) {
          setAcademicsData({
            academics: json.data.academics || [],
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch academic data');
      } finally {
        setLoading(false);
      }
    }

    loadAcademicsData();

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
        'http://localhost:4000/v1/homepage/academic/bulk/save',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(academicData),
        }
      );

      const json = await res.json();

      if (json.success) {
        setSuccess(t.saveSuccess);
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError(json.error || 'Failed to save changes');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // NEWS FUNCTIONS
  // =========================

  const updateAcademics = (
    index: number,
    field: keyof AcademicsItem,
    value: string
  ) => {
    const updated = [...academicData.academics];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setAcademicsData({ ...academicData, academics: updated });
  };

  const addAcademics = () => {
    setAcademicsData({
      ...academicData,
      academics: [
        ...academicData.academics,
        {
          title_en: '',
          title_hi: '',
          date: '',
          description_en: '',
          description_hi: '',
          category_en: '',
          category_hi: '',
        },
      ],
    });
  };

  const removeAcademics = async (index: number) => {
    const academicId = academicData.academics[index].id;

    if (academicId) {
      try {
        const response = await fetch(
          `http://localhost:4000/v1/homepage/academic/${academicId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const result = await response.json();

        if (result.success) {
          setAcademicsData({
            ...academicData,
            academics: academicData.academics.filter((_, i) => i !== index),
          });
          alert(t.deleteSuccess);
        } else {
          throw new Error(result.message || 'Failed to delete academic');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred while deleting';
        alert('Error: ' + errorMessage);
        console.error('Error deleting academic:', err);
      }
    } else {
      setAcademicsData({
        ...academicData,
        academics: academicData.academics.filter((_, i) => i !== index),
      });
    }
  };

  const getFormattedDate = (dateString: string) => {
    if (!dateString) return { month: '', day: '' };
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { month: '', day: '' };
      return {
        month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
        day: date.getDate().toString(),
      };
    } catch {
      return { month: '', day: '' };
    }
  };

  const getFormattedDateHindi = (dateString: string) => {
    if (!dateString) return { month: '', day: '' };
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { month: '', day: '' };
      const monthIndex = date.getMonth();
      return {
        month: hindiMonths[monthIndex],
        day: convertToHindiNumerals(date.getDate().toString()),
      };
    } catch {
      return { month: '', day: '' };
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#631012] mx-auto mb-4" />
          <p className="text-gray-600">{t.loadingText}</p>
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
          <Calendar className="w-7 h-7" />
          <h1 className="text-2xl sm:text-3xl font-bold">{t.header}</h1>
        </div>
        <p className="text-white/90">{t.headerSubtitle}</p>
      </div>

      {/* SUCCESS */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 font-medium">
          ✓ {success}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex justify-between items-center">
          <div>{error}</div>
          <button
            onClick={() => setError('')}
            className="text-sm underline hover:no-underline"
          >
            {t.tryAgain}
          </button>
        </div>
      )}

      {/* TOP BAR */}
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#171717]">{t.editorTitle}</h2>
            <p className="text-[#171717]/60">{t.editorSubtitle}</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#631012] hover:bg-[#7a1214] disabled:bg-gray-400 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          {saving ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              {t.savingButton}
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {t.saveButton}
            </>
          )}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="p-6 space-y-8">
          {/* NEWS LIST SECTION */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t.academicList}</h2>
              <button
                onClick={addAcademics}
                className="flex items-center gap-2 text-[#631012] hover:bg-[#631012]/10 px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={18} />
                {t.addAcademics}
              </button>
            </div>

            {academicData.academics.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#171717]/60 mb-4">{t.noAcademics}</p>
                <button
                  onClick={addAcademics}
                  className="flex items-center gap-2 px-4 py-2 text-[#631012] hover:bg-[#631012]/10 rounded-lg transition-colors mx-auto"
                >
                  <Plus size={18} />
                  {t.addFirstAcademics}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {academicData.academics.map((academic, index) => (
                  <div
                    key={index}
                    className="border rounded-2xl p-6 space-y-4 bg-[#F9F9F9]"
                  >
                    {/* Header with delete button */}
                    <div className="flex justify-between items-center pb-4 border-b border-[#171717]/10">
                      <h3 className="font-semibold text-lg">
                        {t.academicLabel} {index + 1} {academic.id && `(ID: ${academic.id})`}
                      </h3>
                      <button
                        onClick={() => removeAcademics(index)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Date Input - Shared */}
                    <div>
                      <label className="block text-sm font-medium text-[#171717]/70 mb-2">
                        {t.dateLabel}
                      </label>
                      <input
                        type="date"
                        value={academic.date}
                        onChange={(e) =>
                          updateAcademics(index, 'date', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#631012] text-black"
                      />
                    </div>

                    {/* Two Column Layout for English and Hindi */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* ENGLISH SECTION */}
                      <div className="space-y-4 p-4 bg-white rounded-xl border border-blue-200/50">
                        <h4 className="font-semibold text-blue-700 text-sm uppercase tracking-wide">
                          {t.englishSection}
                        </h4>

                        <div>
                          <label className="block text-sm font-medium text-[#171717]/70 mb-2">
                            {t.titleLabelEn}
                          </label>
                          <input
                            type="text"
                            value={academic.title_en}
                            onChange={(e) =>
                              updateAcademics(index, 'title_en', e.target.value)
                            }
                            placeholder={t.titlePlaceholderEn}
                            className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#631012] text-black"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#171717]/70 mb-2">
                            {t.categoryLabelEn}
                          </label>
                          <input
                            type="text"
                            value={academic.category_en}
                            onChange={(e) =>
                              updateAcademics(index, 'category_en', e.target.value)
                            }
                            placeholder={t.categoryPlaceholderEn}
                            className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#631012] text-black"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#171717]/70 mb-2">
                            {t.descriptionLabelEn}
                          </label>
                          <textarea
                            rows={3}
                            value={academic.description_en}
                            onChange={(e) =>
                              updateAcademics(index, 'description_en', e.target.value)
                            }
                            placeholder={t.descriptionPlaceholderEn}
                            className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#631012] text-black resize-none"
                          />
                        </div>
                      </div>

                      {/* HINDI SECTION */}
                      <div className="space-y-4 p-4 bg-white rounded-xl border border-orange-200/50">
                        <h4 className="font-semibold text-orange-700 text-sm uppercase tracking-wide">
                          {t.hindiSection}
                        </h4>

                        <div>
                          <label className="block text-sm font-medium text-[#171717]/70 mb-2">
                            {t.titleLabelHi}
                          </label>
                          <input
                            type="text"
                            value={academic.title_hi}
                            onChange={(e) =>
                              updateAcademics(index, 'title_hi', e.target.value)
                            }
                            placeholder={t.titlePlaceholderHi}
                            className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#631012] text-black"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#171717]/70 mb-2">
                            {t.categoryLabelHi}
                          </label>
                          <input
                            type="text"
                            value={academic.category_hi}
                            onChange={(e) =>
                              updateAcademics(index, 'category_hi', e.target.value)
                            }
                            placeholder={t.categoryPlaceholderHi}
                            className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#631012] text-black"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#171717]/70 mb-2">
                            {t.descriptionLabelHi}
                          </label>
                          <textarea
                            rows={3}
                            value={academic.description_hi}
                            onChange={(e) =>
                              updateAcademics(index, 'description_hi', e.target.value)
                            }
                            placeholder={t.descriptionPlaceholderHi}
                            className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#631012] text-black resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PREVIEW SECTION */}
          {academicData.academics.length > 0 && (
            <div className="space-y-8 mt-10 pt-10 border-t border-[#171717]/10">
              <h2 className="text-2xl font-bold">{t.previewEn}</h2>

              {/* Two Column Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ENGLISH PREVIEW */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-blue-700 text-sm uppercase tracking-wide mb-4">
                    {t.previewEn}
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {academicData.academics.map((academic, index) => {
                      const { month, day } = getFormattedDate(academic.date);
                      return (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-gray-200 flex gap-4 items-start hover:shadow-md transition-shadow"
                        >
                          {/* Date Box */}
                          <div className="flex flex-col items-center justify-center bg-white border border-gray-300 rounded-xl w-14 h-14 flex-shrink-0 shadow-sm">
                            <span className="text-[9px] font-semibold text-[#8b5c5c] uppercase leading-none">
                              {month || 'N/A'}
                            </span>
                            <span className="text-lg font-bold text-[#631012] leading-tight">
                              {day || 'N/A'}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="mb-2">
                              <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md border border-gray-300 text-gray-700 uppercase">
                                {academic.category_en || t.previewCategory}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-[#171717] leading-snug">
                              {academic.title_en || t.previewTitle}
                            </h3>
                            <p className="text-xs text-[#171717]/70 mt-1.5 line-clamp-2">
                              {academic.description_en || t.previewDescription}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* HINDI PREVIEW */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-orange-700 text-sm uppercase tracking-wide mb-4">
                    {t.previewHi}
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {academicData.academics.map((academic, index) => {
                      const { month, day } = getFormattedDateHindi(academic.date);
                      return (
                        <div
                          key={index}
                          className="bg-white p-4 rounded-lg border border-gray-200 flex gap-4 items-start hover:shadow-md transition-shadow"
                        >
                          {/* Date Box with Hindi Text */}
                          <div className="flex flex-col items-center justify-center bg-white border border-gray-300 rounded-xl w-14 h-14 flex-shrink-0 shadow-sm">
                            <span className="text-[8px] font-semibold text-[#8b5c5c] leading-tight text-center">
                              {month || 'N/A'}
                            </span>
                            <span className="text-lg font-bold text-[#631012] leading-tight">
                              {day || 'N/A'}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="mb-2">
                              <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md border border-gray-300 text-gray-700 uppercase">
                                {academic.category_hi || t.previewCategory}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-[#171717] leading-snug">
                              {academic.title_hi || t.previewTitle}
                            </h3>
                            <p className="text-xs text-[#171717]/70 mt-1.5 line-clamp-2">
                              {academic.description_hi || t.previewDescription}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}