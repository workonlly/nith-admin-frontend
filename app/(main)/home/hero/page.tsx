'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Trash2,
  Upload,
  PlusCircle,
  Loader2
} from 'lucide-react';

interface HeroImage {
  id: string;
  herourl: string;
}

export default function HeroPage() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ======================================================
  // LOAD DATA
  // ======================================================
  useEffect(() => {
    loadHeroImages();
  }, []);

  const loadHeroImages = async () => {
    try {
      setError('');
      setLoading(true);
      const res = await fetch(`${API_BASE}/hero/hero`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setHeroImages(data.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load hero images');
    } finally {
      setLoading(false);
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
      const res = await fetch(`${API_BASE}/hero/heropost`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      setHeroImages((prev) => [data.data, ...prev]);
      setHeroImageFile(null);
      setPreviewImage(null);
    } catch (err) {
      console.error(err);
      setError('Image upload failed');
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DELETE IMAGE
  // ======================================================
  const handleDeleteImage = async (id: string) => {
    const ok = confirm('Are you sure you want to delete this image? This action cannot be undone.');
    if (!ok) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/hero/herodelete/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setHeroImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10 space-y-8 font-sans">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-[#631012] to-[#8c1719] rounded-2xl p-8 text-white shadow-xl flex justify-between items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-8 h-8 opacity-90" />
            <h1 className="text-4xl font-extrabold tracking-tight">Hero Carousel</h1>
          </div>
          <p className="text-white/80 text-lg max-w-xl">
            Upload and manage breathtaking images for the main website's homepage hero banner.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-4 rounded-r-lg shadow-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* UPLOAD SECTION */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Upload className="text-[#631012] w-6 h-6" />
              Upload Image
            </h2>
            
            <label className="group relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100/80 hover:border-[#631012] transition-all cursor-pointer overflow-hidden">
              {previewImage ? (
                <>
                  <img src={previewImage} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" alt="Preview" />
                  <div className="relative z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg font-medium text-gray-800 shadow-sm border border-gray-200">
                    Change Image
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500 group-hover:text-[#631012] transition-colors">
                  <PlusCircle className="w-12 h-12 mb-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <p className="mb-2 text-sm font-semibold">Click to browse or drag & drop</p>
                  <p className="text-xs opacity-75">JPEG, PNG, WEBP (Max 5MB)</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} />
            </label>

            <button
              type="button"
              onClick={uploadImage}
              disabled={!heroImageFile || loading}
              className="mt-6 w-full bg-[#631012] hover:bg-[#7a1214] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {loading ? 'Uploading...' : 'Save to Carousel'}
            </button>
          </div>
        </div>

        {/* IMAGES GRID */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Active Banner Images</h2>
              <span className="bg-[#631012]/10 text-[#631012] px-3 py-1 rounded-full text-sm font-bold">
                {heroImages.length} {heroImages.length === 1 ? 'Image' : 'Images'}
              </span>
            </div>

            {loading && heroImages.length === 0 ? (
              <div className="flex justify-center items-center h-64 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : heroImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium text-lg">No images in your carousel</p>
                <p className="text-gray-400 text-sm">Upload one from the left panel to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {heroImages.map((img) => (
                  <div key={img.id} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 bg-gray-100">
                    <img
                      src={img.herourl}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="Hero banner"
                      loading="lazy"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-lg shadow-lg flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50"
                        title="Delete image"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}