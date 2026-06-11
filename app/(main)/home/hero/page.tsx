'use client';

import React, { useState, useEffect } from 'react';
import { Save, Home, FileText, Trash2 } from 'lucide-react';

interface HeroData {
  heading: string;
  tagline: string;
  description: string;
}

export default function HeroPage() {
  const [heroData, setHeroData] = useState<HeroData>({
    heading: 'NIT HAMIRPUR',
    tagline: 'Shaping Minds. Building Futures.',
    description:
      'NIT Hamirpur is committed to academic excellence in engineering, technology, architecture, and sciences—empowering students through innovation, research, and a value-based learning environment.',
  });

  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroImageId, setHeroImageId] = useState<number | null>(null); // Store ID for deletion
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = `http://${process.env.NEXT_PUBLIC_URL || 'localhost:4000'}/hero`;

  // 1) Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Text Data
        const homeRes = await fetch(`${API_BASE}/homepage`);
        if (homeRes.ok) {
          const home = await homeRes.json();
          setHeroData({
            heading: home.heromaintext || 'NIT HAMIRPUR',
            tagline: home.herosubheading || 'Shaping Minds. Building Futures.',
            description:
              home.herodescheading ||
              'NIT Hamirpur is committed to academic excellence...',
          });
        }

        // Load Latest Image
        const imgRes = await fetch(`${API_BASE}/hero-image`);
        if (imgRes.ok) {
          const images = await imgRes.json();
          if (Array.isArray(images) && images.length > 0) {
            setHeroImage(images[0].image_url);
            setHeroImageId(images[0].id); // Capture the ID for delete logic
          }
        }
      } catch (e: unknown) {
        setError('Failed to load initial data');
      }
    };

    loadData();
  }, []);

  // 2) Handle Image Deletion
  const handleDeleteImage = async () => {
    if (!heroImageId) return;

    if (!confirm('Are you sure you want to delete this hero image?')) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/hero-image/${heroImageId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete image');
      }

      // Reset image state on success
      setHeroImage(null);
      setHeroImageId(null);
      setHeroImageFile(null);
      alert('Image deleted successfully');
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error deleting image');
    } finally {
      setLoading(false);
    }
  };

  // 3) Save handler (Upload Image + Update Text)
  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      // A. Upload new image if selected
      if (heroImageFile) {
        const imgForm = new FormData();
        imgForm.append('image', heroImageFile);

        const imgRes = await fetch(`${API_BASE}/hero-image`, {
          method: 'POST',
          body: imgForm,
        });

        if (!imgRes.ok) throw new Error('Image upload failed');

        const imgData = await imgRes.json();
        setHeroImage(imgData.image_url);
        setHeroImageId(imgData.id); // Update ID to the new one
      }

      // B. Update Homepage Text
      const body = {
        heromaintext: heroData.heading,
        herosubheading: heroData.tagline,
        herodescheading: heroData.description,
        aboutdesc: '',
      };

      const res = await fetch(`${API_BASE}/homepage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Saving text failed');

      alert('Changes saved successfully!');
      setHeroImageFile(null); // Clear file input after save
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Home className="w-6 h-6 sm:w-8 sm:h-8" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Hero Section
          </h1>
        </div>
        <p className="text-sm sm:text-base text-white/90">
          Manage hero section and quick navigation
        </p>
      </div>

      {/* Header + Save Button */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-[#631012]/10 p-2 sm:p-3 rounded-full text-[#631012] flex-shrink-0">
              <Home className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#171717]">
                Hero Editor
              </h1>
              <p className="text-sm sm:text-base text-[#171717]/60 mt-1">
                Edit hero content and navigation
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#631012] hover:bg-[#7a1214] disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md w-full sm:w-auto justify-center text-sm sm:text-base"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-[#631012] w-5 h-5" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">
              Hero Content
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* --- Image Upload Section --- */}
            <div>
              <label className="block text-sm font-medium text-[#171717] mb-2">
                Hero Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (file) {
                    setHeroImageFile(file);
                    // Create local preview
                    const reader = new FileReader();
                    reader.onload = (ev) =>
                      setHeroImage(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-3 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none text-sm"
              />

              {/* Image Preview with Delete Button */}
              {heroImage && (
                <div className="mt-4 relative inline-block border border-gray-300 rounded-lg shadow-sm">
                  <img
                    src={heroImage}
                    alt="Hero Preview"
                    className="max-h-60 rounded-lg block"
                  />

                  {/* Delete Button: Always Visible + High Z-Index */}
                  <button
                    onClick={handleDeleteImage}
                    type="button"
                    className="absolute top-2 right-2 z-10 bg-red-600 text-white p-2 rounded-full shadow-md hover:bg-red-700 transition-colors focus:outline-none"
                    title="Delete Image"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* --- Text Inputs --- */}
            <div>
              <label className="block text-sm font-medium text-[#171717] mb-2">
                Main Heading
              </label>
              <input
                type="text"
                value={heroData.heading}
                onChange={(e) =>
                  setHeroData({ ...heroData, heading: e.target.value })
                }
                className="w-full px-4 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#171717] mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={heroData.tagline}
                onChange={(e) =>
                  setHeroData({ ...heroData, tagline: e.target.value })
                }
                className="w-full px-4 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#171717] mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={heroData.description}
                onChange={(e) =>
                  setHeroData({ ...heroData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-[#171717]/20 rounded-lg focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
          </div>

          {/* --- Bottom Preview Card --- */}
          <div className="mt-6 p-6 bg-white rounded-lg border-2 border-[#631012]/30">
            <p className="text-sm font-medium text-[#631012] mb-3">
              Live Preview:
            </p>
            <div className="bg-white p-10 rounded-lg text-center border border-[#631012]/20">
              {heroImage && (
                <img
                  src={heroImage}
                  alt="Hero Preview"
                  className="mx-auto mb-6 max-h-60 rounded-lg border border-[#631012]/20 shadow"
                />
              )}
              <h1 className="text-4xl lg:text-5xl font-bold text-[#631012] mb-4">
                {heroData.heading}
              </h1>
              <p className="text-2xl text-[#631012] font-semibold mb-4">
                {heroData.tagline}
              </p>
              <p className="text-base text-[#171717] max-w-2xl mx-auto">
                {heroData.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
