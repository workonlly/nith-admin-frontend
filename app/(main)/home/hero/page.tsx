'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Home,
  FileText,
  Trash2,
  Languages,
  Upload,
} from 'lucide-react';

interface HeroData {
  heading_en: string;
  heading_hi: string;
  tagline_en: string;
  tagline_hi: string;
  description_en: string;
  description_hi: string;
}

interface HeroImage {
  id: number;
  image: string;
  image_url: string;
}

export default function HeroPage() {
  const API_BASE =
    
    'http://localhost:4000';

  const [heroData, setHeroData] = useState<HeroData>({
    heading_en: 'NIT HAMIRPUR',
    heading_hi: 'एनआईटी हमीरपुर',
    tagline_en: 'Shaping Minds. Building Futures.',
    tagline_hi: 'दिमाग को आकार देना। भविष्य का निर्माण करना।',
    description_en: 'NIT Hamirpur is committed to academic excellence.',
    description_hi: 'एनआईटी हमीरपुर शैक्षणिक उत्कृष्टता के लिए प्रतिबद्ध है।',
  });

  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ======================================================
  // LOAD DATA
  // ======================================================
  useEffect(() => {
    loadHeroData();
    loadHeroImages();
  }, []);

  // ======================================================
  // HERO TEXT (MATCHED BACKEND)
  // ======================================================
  const loadHeroData = async () => {
    try {
      setError('');

      const res = await fetch(`${API_BASE}/v1/homepage/hero`);
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      const h = data.data;

      setHeroData({
        heading_en: h.heromaintext_en || '',
        heading_hi: h.heromaintext_hi || '',
        tagline_en: h.herosubheading_en || '',
        tagline_hi: h.herosubheading_hi || '',
        description_en: h.herodescheading_en || '',
        description_hi: h.herodescheading_hi || '',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to load hero data');
    }
  };

  // ======================================================
  // HERO IMAGES
  // ======================================================
  const loadHeroImages = async () => {
    try {
      setError('');

      const res = await fetch(`${API_BASE}/v1/homepage/hero/hero-image`);
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      setHeroImages(data.images || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load hero images');
    }
  };

  // ======================================================
  // IMAGE VALIDATION + PREVIEW
  // ======================================================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Only JPG, PNG and WEBP allowed');
      return;
    }

    setHeroImageFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ======================================================
  // UPLOAD IMAGE
  // ======================================================
  const uploadImage = async () => {
    if (!heroImageFile) return;

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('image', heroImageFile);

      const res = await fetch(`${API_BASE}/v1/homepage/hero/hero-image`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setHeroImages((prev) => [data.data, ...prev]);
      setHeroImageFile(null);
      setPreviewImage(null);

      alert('Image uploaded successfully');
    } catch (err) {
      console.error(err);
      alert('Image upload failed');
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE IMAGE
  // ======================================================
  const handleDeleteImage = async (id: number) => {
    const ok = confirm('Delete this image?');
    if (!ok) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/v1/homepage/hero/hero-image/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setHeroImages((prev) => prev.filter((img) => img.id !== id));

      alert('Image deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // SAVE HERO TEXT
  // ======================================================
  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

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

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      alert('Hero content updated successfully');
    } catch (err) {
      console.error(err);
      setError('Failed to save hero content');
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="space-y-6 p-4 lg:p-6">

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Home className="w-7 h-7" />
          <h1 className="text-3xl font-bold">Hero Section</h1>
        </div>
        <p className="text-white/90">
          Manage bilingual homepage hero section
        </p>
      </div>

      {/* SAVE BAR */}
      <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Languages className="text-[#631012] w-6 h-6" />
          <div>
            <h2 className="text-2xl font-bold">Hero Editor</h2>
            <p className="text-gray-500">English + Hindi content</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#631012] hover:bg-[#7a1214] text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-white rounded-xl shadow p-6 space-y-8">

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block font-medium mb-2">
            Upload Hero Image
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
            <input type="file" accept="image/*" onChange={handleImageChange} />

            <button
              type="button"
              onClick={uploadImage}
              disabled={!heroImageFile}
              className="mt-4 bg-[#631012] text-white px-5 py-2 rounded-lg flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </button>

            {previewImage && (
              <img
                src={previewImage}
                className="mt-4 rounded-lg max-h-60 border"
              />
            )}
          </div>
        </div>

        {/* IMAGES */}
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Uploaded Hero Images
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroImages.map((img) => (
              <div key={img.id} className="relative border rounded-xl overflow-hidden">
                <img
                  src={img.image_url}
                  className="w-full h-60 object-cover"
                />

                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TEXT FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input
            value={heroData.heading_en}
            onChange={(e) =>
              setHeroData({ ...heroData, heading_en: e.target.value })
            }
            className="border p-3 rounded-lg"
            placeholder="Heading English"
          />

          <input
            value={heroData.heading_hi}
            onChange={(e) =>
              setHeroData({ ...heroData, heading_hi: e.target.value })
            }
            className="border p-3 rounded-lg"
            placeholder="Heading Hindi"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input
            value={heroData.tagline_en}
            onChange={(e) =>
              setHeroData({ ...heroData, tagline_en: e.target.value })
            }
            className="border p-3 rounded-lg"
            placeholder="Tagline English"
          />

          <input
            value={heroData.tagline_hi}
            onChange={(e) =>
              setHeroData({ ...heroData, tagline_hi: e.target.value })
            }
            className="border p-3 rounded-lg"
            placeholder="Tagline Hindi"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <textarea
            value={heroData.description_en}
            onChange={(e) =>
              setHeroData({ ...heroData, description_en: e.target.value })
            }
            className="border p-3 rounded-lg"
            rows={5}
            placeholder="Description English"
          />

          <textarea
            value={heroData.description_hi}
            onChange={(e) =>
              setHeroData({ ...heroData, description_hi: e.target.value })
            }
            className="border p-3 rounded-lg"
            rows={5}
            placeholder="Description Hindi"
          />
        </div>

      </div>
    </div>
  );
}