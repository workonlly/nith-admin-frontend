'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Music2,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  Loader,
  Edit2,
  Check,
  X,
  Sparkles,
  Layers,
  TrendingUp,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  about_title_en: string;
  about_title_hn: string;
  about_desc1_en: string;
  about_desc1_hn: string;
  about_desc2_en: string;
  about_desc2_hn: string;
  about_desc3_en: string;
  about_desc3_hn: string;
  movement_title_en: string;
  movement_title_hn: string;
  movement_intro_en: string;
  movement_intro_hn: string;
  growth_title_en: string;
  growth_title_hn: string;
  growth_desc_en: string;
  growth_desc_hn: string;
}

interface Assertion {
  id: number;
  assertion_en: string;
  assertion_hn: string;
}

interface GalleryItem {
  id: number;
  url: string;
  caption_en: string;
  caption_hn: string;
}

type TabType = 'hero' | 'history' | 'movement' | 'gallery';

export default function AnnualSpicMacayActivityPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Singleton data state
  const [headingData, setHeadingData] = useState<HeadingData>({
    title_en: '',
    title_hn: '',
    sub_title_en: '',
    sub_title_hn: '',
    about_title_en: '',
    about_title_hn: '',
    about_desc1_en: '',
    about_desc1_hn: '',
    about_desc2_en: '',
    about_desc2_hn: '',
    about_desc3_en: '',
    about_desc3_hn: '',
    movement_title_en: '',
    movement_title_hn: '',
    movement_intro_en: '',
    movement_intro_hn: '',
    growth_title_en: '',
    growth_title_hn: '',
    growth_desc_en: '',
    growth_desc_hn: '',
  });

  // Assertions and Gallery list states
  const [assertions, setAssertions] = useState<Assertion[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // Editing or adding states for assertions
  const [newAssertion, setNewAssertion] = useState({
    assertion_en: '',
    assertion_hn: '',
  });
  const [editingAssertionId, setEditingAssertionId] = useState<number | null>(
    null
  );
  const [editingAssertionData, setEditingAssertionData] = useState({
    assertion_en: '',
    assertion_hn: '',
  });

  // Upload/Adding states for gallery
  const [newGalleryItem, setNewGalleryItem] = useState({
    url: '',
    caption_en: '',
    caption_hn: '',
  });
  const [uploadingNewImage, setUploadingNewImage] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<number | null>(null);
  const [editingGalleryData, setEditingGalleryData] = useState({
    url: '',
    caption_en: '',
    caption_hn: '',
  });
  const [uploadingEditImage, setUploadingEditImage] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Headings
      const headRes = await fetch(`${API_URL}/api/student-spicmacay`);
      if (headRes.ok) {
        const hData = await headRes.json();
        setHeadingData({
          title_en: hData.title_en || '',
          title_hn: hData.title_hn || '',
          sub_title_en: hData.sub_title_en || '',
          sub_title_hn: hData.sub_title_hn || '',
          about_title_en: hData.about_title_en || '',
          about_title_hn: hData.about_title_hn || '',
          about_desc1_en: hData.about_desc1_en || '',
          about_desc1_hn: hData.about_desc1_hn || '',
          about_desc2_en: hData.about_desc2_en || '',
          about_desc2_hn: hData.about_desc2_hn || '',
          about_desc3_en: hData.about_desc3_en || '',
          about_desc3_hn: hData.about_desc3_hn || '',
          movement_title_en: hData.movement_title_en || '',
          movement_title_hn: hData.movement_title_hn || '',
          movement_intro_en: hData.movement_intro_en || '',
          movement_intro_hn: hData.movement_intro_hn || '',
          growth_title_en: hData.growth_title_en || '',
          growth_title_hn: hData.growth_title_hn || '',
          growth_desc_en: hData.growth_desc_en || '',
          growth_desc_hn: hData.growth_desc_hn || '',
        });
      }

      // 2. Fetch Assertions
      const assertRes = await fetch(
        `${API_URL}/api/student-spicmacay/assertions`
      );
      if (assertRes.ok) {
        const aData = await assertRes.json();
        setAssertions(aData);
      }

      // 3. Fetch Gallery
      const galleryRes = await fetch(
        `${API_URL}/api/student-spicmacay/gallery`
      );
      if (galleryRes.ok) {
        const gData = await galleryRes.json();
        setGallery(gData);
      }
    } catch (err: any) {
      console.error('Error fetching SPIC MACAY data:', err);
      setError(
        'Failed to load SPIC MACAY data from server. Please verify backend status.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${API_URL}${url}`;
  };

  // General Save Action (Saves the singletons headings & detailed contents)
  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-spicmacay`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('SPIC MACAY page settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Assertions CRUD Operations ---
  const handleAddAssertion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newAssertion.assertion_en.trim() ||
      !newAssertion.assertion_hn.trim()
    ) {
      alert('Please fill in both English and Hindi versions.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-spicmacay/assertions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssertion),
      });
      if (!res.ok) throw new Error('Failed to create assertion');
      const saved = await res.json();
      setAssertions([...assertions, saved]);
      setNewAssertion({ assertion_en: '', assertion_hn: '' });
      alert('Assertion added successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const startEditingAssertion = (assert: Assertion) => {
    setEditingAssertionId(assert.id);
    setEditingAssertionData({
      assertion_en: assert.assertion_en,
      assertion_hn: assert.assertion_hn,
    });
  };

  const handleSaveAssertionEdit = async (id: number) => {
    if (
      !editingAssertionData.assertion_en.trim() ||
      !editingAssertionData.assertion_hn.trim()
    ) {
      alert('Both language fields are required.');
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/api/student-spicmacay/assertions/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingAssertionData),
        }
      );
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setAssertions(assertions.map((a) => (a.id === id ? updated : a)));
      setEditingAssertionId(null);
      alert('Assertion updated successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteAssertion = async (id: number) => {
    if (!confirm('Are you sure you want to delete this assertion?')) return;
    try {
      const res = await fetch(
        `${API_URL}/api/student-spicmacay/assertions/${id}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Failed to delete');
      setAssertions(assertions.filter((a) => a.id !== id));
      alert('Assertion deleted successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  // --- Image Upload Helpers ---
  const handleUploadImageToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'x-bucket-name': 'student-section',
      },
      body: formData,
    });

    const result = await res.json();
    if (result.success && result.url) {
      return result.url;
    } else {
      throw new Error(result.error || 'Upload failed');
    }
  };

  const handleNewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed!');
      return;
    }

    setUploadingNewImage(true);
    try {
      const url = await handleUploadImageToServer(file);
      setNewGalleryItem((prev) => ({ ...prev, url }));
      alert('Image uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploadingNewImage(false);
    }
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed!');
      return;
    }

    setUploadingEditImage(true);
    try {
      const url = await handleUploadImageToServer(file);
      setEditingGalleryData((prev) => ({ ...prev, url }));
      alert('Image replaced successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploadingEditImage(false);
    }
  };

  // --- Gallery CRUD Operations ---
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.url.trim()) {
      alert('Please upload an image or paste a direct image URL.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-spicmacay/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGalleryItem),
      });
      if (!res.ok) throw new Error('Failed to add gallery item');
      const saved = await res.json();
      setGallery([...gallery, saved]);
      setNewGalleryItem({ url: '', caption_en: '', caption_hn: '' });
      alert('Image added to gallery successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const startEditingGallery = (item: GalleryItem) => {
    setEditingGalleryId(item.id);
    setEditingGalleryData({
      url: item.url,
      caption_en: item.caption_en || '',
      caption_hn: item.caption_hn || '',
    });
  };

  const handleSaveGalleryEdit = async (id: number) => {
    if (!editingGalleryData.url.trim()) {
      alert('Image URL or file upload is required.');
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/api/student-spicmacay/gallery/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingGalleryData),
        }
      );
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setGallery(gallery.map((g) => (g.id === id ? updated : g)));
      setEditingGalleryId(null);
      alert('Gallery item updated successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteGalleryItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this photo from the gallery?')) return;
    try {
      const res = await fetch(
        `${API_URL}/api/student-spicmacay/gallery/${id}`,
        { method: 'DELETE' }
      );
      if (!res.ok) throw new Error('Failed to delete');
      setGallery(gallery.filter((g) => g.id !== id));
      alert('Photo deleted successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const tabs = [
    {
      id: 'hero' as TabType,
      label: 'Hero Banner',
      icon: <FileText size={18} />,
    },
    {
      id: 'history' as TabType,
      label: 'History & Growth',
      icon: <TrendingUp size={18} />,
    },
    {
      id: 'movement' as TabType,
      label: 'The Movement',
      icon: <Sparkles size={18} />,
    },
    {
      id: 'gallery' as TabType,
      label: 'Photo Gallery',
      icon: <ImageIcon size={18} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading SPIC MACAY Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gray-50/50 min-h-screen">
      {/* 1. Page Title Header containing UNCONDITIONAL SAVE button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Music2 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                SPIC MACAY Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure SPIC MACAY description paragraphs, voluntary movement assertions list, and headings dynamically.
              </p>
            </div>
          </div>
          <button
            onClick={handleSavePageSettings}
            disabled={saving}
            className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-semibold shadow-sm hover:shadow active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Tabs Layout */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#631012] text-[#631012] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50/70'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* TAB 1: HERO SECTION */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Hero Banner Configuration</h3>
                <p className="text-sm text-gray-500">Bilingual settings for the landing header section of SPIC MACAY</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Heading (English)</label>
                  <input
                    type="text"
                    value={headingData.title_en}
                    onChange={(e) => setHeadingData({ ...headingData, title_en: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    placeholder="e.g. About SPIC MACAY"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Main Heading (Hindi)</label>
                  <input
                    type="text"
                    value={headingData.title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, title_hn: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    placeholder="e.g. SPIC MACAY के बारे में"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Banner Description (English)</label>
                  <textarea
                    value={headingData.sub_title_en}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    placeholder="Brief intro description in English"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Banner Description (Hindi)</label>
                  <textarea
                    value={headingData.sub_title_hn}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    placeholder="Brief intro description in Hindi"
                  />
                </div>
              </div>

              {/* Banner Preview */}
              <div className="mt-8 p-8 bg-gradient-to-br from-[#800000] via-[#631012] to-[#8B1E1E] rounded-xl text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full mb-3 inline-block">LIVE BANNER PREVIEW (ENGLISH)</span>
                <h4 className="text-2xl md:text-3xl font-black">{headingData.title_en || 'About SPIC MACAY'}</h4>
                <p className="text-sm md:text-base text-white/85 mt-2 leading-relaxed font-light">{headingData.sub_title_en || 'A movement...'}</p>
                <div className="h-px bg-white/10 my-4" />
                <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-full mb-3 inline-block">LIVE BANNER PREVIEW (HINDI)</span>
                <h4 className="text-2xl md:text-3xl font-black">{headingData.title_hn || 'SPIC MACAY के बारे में'}</h4>
                <p className="text-sm md:text-base text-white/85 mt-2 leading-relaxed font-light">{headingData.sub_title_hn || 'शैक्षिक संस्थानों तक...'}</p>
              </div>
            </div>
          )}

          {/* TAB 2: HISTORY & GROWTH */}
          {activeTab === 'history' && (
            <div className="space-y-8">
              {/* Beginning Section */}
              <div className="space-y-6">
                <div className="border-l-4 border-[#631012] pl-3 mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">Beginning of SPIC MACAY</h3>
                  <p className="text-sm text-gray-500">Edit the historical timeline details and narrative paragraphs bilingually</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Section Title (English)</label>
                    <input
                      type="text"
                      value={headingData.about_title_en}
                      onChange={(e) => setHeadingData({ ...headingData, about_title_en: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Section Title (Hindi)</label>
                    <input
                      type="text"
                      value={headingData.about_title_hn}
                      onChange={(e) => setHeadingData({ ...headingData, about_title_hn: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>

                  <div className="md:col-span-2 border-t border-gray-100 pt-4">
                    <span className="text-xs font-bold text-[#631012] uppercase tracking-wider">Paragraph 1</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Paragraph 1 (English)</label>
                    <textarea
                      value={headingData.about_desc1_en}
                      onChange={(e) => setHeadingData({ ...headingData, about_desc1_en: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Paragraph 1 (Hindi)</label>
                    <textarea
                      value={headingData.about_desc1_hn}
                      onChange={(e) => setHeadingData({ ...headingData, about_desc1_hn: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>

                  <div className="md:col-span-2 border-t border-gray-100 pt-4">
                    <span className="text-xs font-bold text-[#631012] uppercase tracking-wider">Paragraph 2</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Paragraph 2 (English)</label>
                    <textarea
                      value={headingData.about_desc2_en}
                      onChange={(e) => setHeadingData({ ...headingData, about_desc2_en: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Paragraph 2 (Hindi)</label>
                    <textarea
                      value={headingData.about_desc2_hn}
                      onChange={(e) => setHeadingData({ ...headingData, about_desc2_hn: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>

                  <div className="md:col-span-2 border-t border-gray-100 pt-4">
                    <span className="text-xs font-bold text-[#631012] uppercase tracking-wider">Paragraph 3</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Paragraph 3 (English)</label>
                    <textarea
                      value={headingData.about_desc3_en}
                      onChange={(e) => setHeadingData({ ...headingData, about_desc3_en: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Paragraph 3 (Hindi)</label>
                    <textarea
                      value={headingData.about_desc3_hn}
                      onChange={(e) => setHeadingData({ ...headingData, about_desc3_hn: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Growth Section */}
              <div className="border-t border-gray-100 pt-8 space-y-6">
                <div className="border-l-4 border-[#631012] pl-3 mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">Its Growth Section</h3>
                  <p className="text-sm text-gray-500">Edit the growth narrative and achievements text bilingually</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Growth Title (English)</label>
                    <input
                      type="text"
                      value={headingData.growth_title_en}
                      onChange={(e) => setHeadingData({ ...headingData, growth_title_en: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Growth Title (Hindi)</label>
                    <input
                      type="text"
                      value={headingData.growth_title_hn}
                      onChange={(e) => setHeadingData({ ...headingData, growth_title_hn: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Growth Narrative (English)</label>
                    <textarea
                      value={headingData.growth_desc_en}
                      onChange={(e) => setHeadingData({ ...headingData, growth_desc_en: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Growth Narrative (Hindi)</label>
                    <textarea
                      value={headingData.growth_desc_hn}
                      onChange={(e) => setHeadingData({ ...headingData, growth_desc_hn: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: THE MOVEMENT & ASSERTIONS CRUD */}
          {activeTab === 'movement' && (
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="border-l-4 border-[#631012] pl-3 mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">The Movement Settings</h3>
                  <p className="text-sm text-gray-500">Edit the title and introductory paragraph of the SPIC MACAY movement bilingually</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Movement Section Title (English)</label>
                    <input
                      type="text"
                      value={headingData.movement_title_en}
                      onChange={(e) => setHeadingData({ ...headingData, movement_title_en: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Movement Section Title (Hindi)</label>
                    <input
                      type="text"
                      value={headingData.movement_title_hn}
                      onChange={(e) => setHeadingData({ ...headingData, movement_title_hn: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Movement Intro (English)</label>
                    <textarea
                      value={headingData.movement_intro_en}
                      onChange={(e) => setHeadingData({ ...headingData, movement_intro_en: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Movement Intro (Hindi)</label>
                    <textarea
                      value={headingData.movement_intro_hn}
                      onChange={(e) => setHeadingData({ ...headingData, movement_intro_hn: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#631012] text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Assertions CRUD */}
              <div className="border-t border-gray-100 pt-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-[#631012] pl-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Assertions List</h3>
                    <p className="text-sm text-gray-500">Manage voluntary movement bullet assertions dynamically</p>
                  </div>
                </div>

                {/* Add Assertion Form */}
                <form onSubmit={handleAddAssertion} className="bg-gray-50/50 border border-gray-150 p-4 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">New Assertion (English)</label>
                      <input
                        type="text"
                        value={newAssertion.assertion_en}
                        onChange={(e) => setNewAssertion({ ...newAssertion, assertion_en: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#631012]"
                        placeholder="e.g. a priceless cultural heritage..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">New Assertion (Hindi)</label>
                      <input
                        type="text"
                        value={newAssertion.assertion_hn}
                        onChange={(e) => setNewAssertion({ ...newAssertion, assertion_hn: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#631012]"
                        placeholder="e.g. भारतीय जड़ों पर आधारित..."
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                    >
                      <Plus size={14} /> Add Assertion
                    </button>
                  </div>
                </form>

                {/* Assertions list display */}
                <div className="space-y-3">
                  {assertions.map((assert, i) => (
                    <div key={assert.id} className="border border-gray-150 p-4 rounded-xl flex items-start justify-between gap-4 bg-white hover:shadow-xs transition-shadow">
                      {editingAssertionId === assert.id ? (
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Assertion (English)</label>
                            <input
                              type="text"
                              value={editingAssertionData.assertion_en}
                              onChange={(e) => setEditingAssertionData({ ...editingAssertionData, assertion_en: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#631012]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Assertion (Hindi)</label>
                            <input
                              type="text"
                              value={editingAssertionData.assertion_hn}
                              onChange={(e) => setEditingAssertionData({ ...editingAssertionData, assertion_hn: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-[#631012]"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveAssertionEdit(assert.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold"
                            >
                              <Check size={14} /> Save
                            </button>
                            <button
                              onClick={() => setEditingAssertionId(null)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs font-bold"
                            >
                              <X size={14} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 space-y-1">
                          <div className="flex gap-2 items-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#631012] mt-2 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{assert.assertion_en}</p>
                              <p className="text-sm text-gray-500 mt-0.5">{assert.assertion_hn}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {editingAssertionId !== assert.id && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditingAssertion(assert)}
                            className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAssertion(assert.id)}
                            className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {assertions.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl text-gray-400">
                      No assertions found. Add some using the form above.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PHOTO GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="border-l-4 border-[#631012] pl-3 mb-4">
                <h3 className="font-bold text-gray-800 text-lg">Dynamic Photo Gallery</h3>
                <p className="text-sm text-gray-500">Add, upload, and bilingually caption beautiful campus activity images for SPIC MACAY</p>
              </div>

              {/* Add Gallery Item Form */}
              <form onSubmit={handleAddGalleryItem} className="bg-gray-50/50 border border-gray-150 p-6 rounded-xl space-y-4">
                <h4 className="font-bold text-gray-800 text-sm">Add New Photo to Gallery</h4>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Photo Upload/URL Panel */}
                  <div className="md:col-span-4 flex flex-col items-center gap-3">
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center shadow-inner">
                      {newGalleryItem.url ? (
                        <img src={getImageUrl(newGalleryItem.url)} alt="New Upload Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      )}
                      {uploadingNewImage && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white">
                          Uploading File...
                        </div>
                      )}
                    </div>

                    <label className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs px-3 py-2 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer font-bold transition-all active:scale-95">
                      <Upload size={14} />
                      Choose File (Upload)
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Captions Panel */}
                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image Web Address URL (Alternative)</label>
                      <input
                        type="text"
                        value={newGalleryItem.url}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#631012]"
                        placeholder="Paste direct URL or upload a file..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Caption (English)</label>
                        <input
                          type="text"
                          value={newGalleryItem.caption_en}
                          onChange={(e) => setNewGalleryItem({ ...newGalleryItem, caption_en: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#631012]"
                          placeholder="e.g. Sitar Lecture-DEM recital"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Caption (Hindi)</label>
                        <input
                          type="text"
                          value={newGalleryItem.caption_hn}
                          onChange={(e) => setNewGalleryItem({ ...newGalleryItem, caption_hn: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#631012]"
                          placeholder="e.g. सितार व्याख्यान-प्रदर्शन प्रस्तुति"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={!newGalleryItem.url}
                        className="bg-[#631012] hover:bg-[#7a1214] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 shadow-sm"
                      >
                        <Plus size={16} /> Add to Gallery
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Gallery Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
                    
                    {/* Thumbnail preview */}
                    <div className="relative aspect-video w-full bg-gray-50 overflow-hidden border-b border-gray-150">
                      {editingGalleryId === item.id ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-3 gap-2">
                          <img src={getImageUrl(editingGalleryData.url)} alt="Editing Preview" className="w-full h-24 object-cover rounded-lg border" />
                          <label className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-[10px] px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer font-bold">
                            <Upload size={12} />
                            Replace Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleEditImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : (
                        <img src={getImageUrl(item.url)} alt={item.caption_en || 'Gallery photo'} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      )}
                    </div>

                    {/* Captions & Actions */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      {editingGalleryId === item.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-0.5 uppercase">Image URL</label>
                            <input
                              type="text"
                              value={editingGalleryData.url}
                              onChange={(e) => setEditingGalleryData({ ...editingGalleryData, url: e.target.value })}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-0.5 uppercase">Caption (English)</label>
                            <input
                              type="text"
                              value={editingGalleryData.caption_en}
                              onChange={(e) => setEditingGalleryData({ ...editingGalleryData, caption_en: e.target.value })}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-0.5 uppercase">Caption (Hindi)</label>
                            <input
                              type="text"
                              value={editingGalleryData.caption_hn}
                              onChange={(e) => setEditingGalleryData({ ...editingGalleryData, caption_hn: e.target.value })}
                              className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs"
                            />
                          </div>
                          <div className="flex gap-1.5 pt-2 border-t">
                            <button
                              onClick={() => handleSaveGalleryEdit(item.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-[11px] font-bold"
                            >
                              <Check size={12} /> Save
                            </button>
                            <button
                              onClick={() => setEditingGalleryId(null)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1 text-[11px] font-bold"
                            >
                              <X size={12} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5 flex-1">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-2">{item.caption_en || '(No English caption)'}</p>
                          <p className="text-xs text-gray-500 line-clamp-2">{item.caption_hn || '(No Hindi caption)'}</p>
                        </div>
                      )}

                      {editingGalleryId !== item.id && (
                        <div className="flex items-center justify-end gap-2 border-t pt-2 mt-auto">
                          <button
                            onClick={() => startEditingGallery(item)}
                            className="text-gray-400 hover:text-blue-600 p-1.5 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1 text-xs"
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="text-gray-400 hover:text-red-600 p-1.5 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-1 text-xs"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {gallery.length === 0 && (
                <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl text-gray-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  No photos uploaded to gallery yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
