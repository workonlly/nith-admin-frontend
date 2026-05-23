'use client';

import React, { useState, useEffect } from 'react';
import { Save, Home, FileText, Trash2, Languages } from 'lucide-react';

interface HeroData {
  heading_en: string;
  heading_hi: string;

  tagline_en: string;
  tagline_hi: string;

  description_en: string;
  description_hi: string;
}

export default function HeroPage() {
  const [heroData, setHeroData] = useState<HeroData>({
    heading_en: 'NIT HAMIRPUR',
    heading_hi: 'एनआईटी हमीरपुर',

    tagline_en: 'Shaping Minds. Building Futures.',
    tagline_hi: 'दिमाग को आकार देना। भविष्य का निर्माण करना।',

    description_en:
      'NIT Hamirpur is committed to academic excellence in engineering, technology, architecture, and sciences.',
    description_hi:
      'एनआईटी हमीरपुर इंजीनियरिंग, प्रौद्योगिकी, वास्तुकला और विज्ञान में शैक्षणिक उत्कृष्टता के लिए प्रतिबद्ध है।',
  });

  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroImageId, setHeroImageId] = useState<number | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = 'http://localhost:4000';

  // Load Initial Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const homeRes = await fetch(`${API_BASE}/v1/homepage/hero`);

        if (homeRes.ok) {
          const home = await homeRes.json();

          setHeroData({
            heading_en: home.heromaintext_en || 'NIT HAMIRPUR',
            heading_hi: home.heromaintext_hi || 'एनआईटी हमीरपुर',

            tagline_en:
              home.herosubheading_en ||
              'Shaping Minds. Building Futures.',
            tagline_hi:
              home.herosubheading_hi ||
              'दिमाग को आकार देना। भविष्य का निर्माण करना।',

            description_en:
              home.herodescheading_en ||
              'NIT Hamirpur is committed to academic excellence.',

            description_hi:
              home.herodescheading_hi ||
              'एनआईटी हमीरपुर शैक्षणिक उत्कृष्टता के लिए प्रतिबद्ध है।',
          });
        }

        // Load Hero Image
        const imgRes = await fetch(`${API_BASE}/hero-image`);

        if (imgRes.ok) {
          const images = await imgRes.json();

          if (Array.isArray(images) && images.length > 0) {
            setHeroImage(images[0].image_url);
            setHeroImageId(images[0].id);
          }
        }
      } catch (e: unknown) {
        setError('Failed to load initial data');
      }
    };

    loadData();
  }, []);

  // Delete Image
  const handleDeleteImage = async () => {
    if (!heroImageId) return;

    if (!confirm('Are you sure you want to delete this hero image?'))
      return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/hero-image/${heroImageId}`,
        {
          method: 'DELETE',
        }
      );

      if (!res.ok) {
        throw new Error('Failed to delete image');
      }

      setHeroImage(null);
      setHeroImageId(null);
      setHeroImageFile(null);

      alert('Image deleted successfully');
    } catch (err: unknown) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'Error deleting image'
      );
    } finally {
      setLoading(false);
    }
  };

  // Save Data
  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      // Upload Image
      if (heroImageFile) {
        const imgForm = new FormData();

        imgForm.append('image', heroImageFile);

        const imgRes = await fetch(`${API_BASE}/hero-image`, {
          method: 'POST',
          body: imgForm,
        });

        if (!imgRes.ok) {
          throw new Error('Image upload failed');
        }

        const imgData = await imgRes.json();

        setHeroImage(imgData.image_url);
        setHeroImageId(imgData.id);
      }

      // Save Text Data
      const body = {
        heromaintext_en: heroData.heading_en,
        heromaintext_hi: heroData.heading_hi,

        herosubheading_en: heroData.tagline_en,
        herosubheading_hi: heroData.tagline_hi,

        herodescheading_en: heroData.description_en,
        herodescheading_hi: heroData.description_hi,

        aboutdesc: '',
      };

      const res = await fetch(`${API_BASE}/v1/homepage/hero`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error('Saving text failed');
      }

      alert('Changes saved successfully!');
      setHeroImageFile(null);
    } catch (err: unknown) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      {error && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-2 text-sm">
          {error}
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Home className="w-7 h-7" />

          <h1 className="text-2xl lg:text-3xl font-bold">
            Hero Section
          </h1>
        </div>

        <p className="text-white/90">
          Manage bilingual hero section content
        </p>
      </div>

      {/* Save Header */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">
              <Languages className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#171717]">
                Hero Editor
              </h1>

              <p className="text-[#171717]/60 mt-1">
                English + Hindi content management
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#631012] hover:bg-[#7a1214] disabled:opacity-60 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md"
          >
            <Save className="w-5 h-5" />

            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 space-y-8">

          {/* Heading */}
          <div className="flex items-center gap-2">
            <FileText className="text-[#631012] w-5 h-5" />

            <h2 className="text-2xl font-bold text-[#171717]">
              Hero Content
            </h2>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-[#171717] mb-2">
              Hero Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files && e.target.files[0];

                if (file) {
                  setHeroImageFile(file);

                  const reader = new FileReader();

                  reader.onload = (ev) =>
                    setHeroImage(
                      ev.target?.result as string
                    );

                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none"
            />

            {heroImage && (
              <div className="mt-4 relative inline-block border border-gray-300 rounded-lg shadow-sm">
                <img
                  src={heroImage}
                  alt="Hero Preview"
                  className="max-h-60 rounded-lg block"
                />

                <button
                  onClick={handleDeleteImage}
                  type="button"
                  className="absolute top-2 right-2 z-10 bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Heading Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium mb-2">
                Main Heading (English)
              </label>

              <input
                type="text"
                value={heroData.heading_en}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    heading_en: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Main Heading (Hindi)
              </label>

              <input
                type="text"
                value={heroData.heading_hi}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    heading_hi: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
          </div>

          {/* Tagline Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium mb-2">
                Tagline (English)
              </label>

              <input
                type="text"
                value={heroData.tagline_en}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    tagline_en: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tagline (Hindi)
              </label>

              <input
                type="text"
                value={heroData.tagline_hi}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    tagline_hi: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
          </div>

          {/* Description Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-medium mb-2">
                Description (English)
              </label>

              <textarea
                rows={5}
                value={heroData.description_en}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    description_en: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description (Hindi)
              </label>

              <textarea
                rows={5}
                value={heroData.description_hi}
                onChange={(e) =>
                  setHeroData({
                    ...heroData,
                    description_hi: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="mt-6 p-6 bg-white rounded-lg border-2 border-[#631012]/30">
            <p className="text-sm font-medium text-[#631012] mb-4">
              Live Preview:
            </p>

            <div className="bg-white p-10 rounded-lg border border-[#631012]/20">

              {heroImage && (
                <img
                  src={heroImage}
                  alt="Hero Preview"
                  className="mx-auto mb-6 max-h-60 rounded-lg border border-[#631012]/20 shadow"
                />
              )}

              {/* English Preview */}
              <div className="text-center mb-10">
                <h2 className="text-lg font-semibold text-gray-500 mb-4">
                  English Preview
                </h2>

                <h1 className="text-4xl lg:text-5xl font-bold text-[#631012] mb-4">
                  {heroData.heading_en}
                </h1>

                <p className="text-2xl text-[#631012] font-semibold mb-4">
                  {heroData.tagline_en}
                </p>

                <p className="text-base text-[#171717] max-w-2xl mx-auto">
                  {heroData.description_en}
                </p>
              </div>

              {/* Hindi Preview */}
              <div className="text-center border-t pt-10">
                <h2 className="text-lg font-semibold text-gray-500 mb-4">
                  हिंदी Preview
                </h2>

                <h1 className="text-4xl lg:text-5xl font-bold text-[#631012] mb-4">
                  {heroData.heading_hi}
                </h1>

                <p className="text-2xl text-[#631012] font-semibold mb-4">
                  {heroData.tagline_hi}
                </p>

                <p className="text-base text-[#171717] max-w-2xl mx-auto leading-8">
                  {heroData.description_hi}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}