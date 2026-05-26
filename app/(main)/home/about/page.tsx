'use client';

import React, { useState, useEffect } from 'react';
import { Save, Info, FileText } from 'lucide-react';

interface AboutResponse {
  success: boolean;
  data: {
    id?: number;
    title_en: string;
    title_hi: string;
    description_en: string;
    description_hi: string;
  };
}

export default function AboutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');

  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionHi, setDescriptionHi] = useState('');

  const API_BASE = 'http://localhost:4000/v1/homepage/about';

  // -------------------------
  // FETCH DATA
  // -------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(API_BASE, { cache: 'no-store' });
        const text = await res.text();

        const json: AboutResponse = JSON.parse(text);

        if (!json.success) throw new Error('Failed to load data');

        setTitleEn(json.data?.title_en || '');
        setTitleHi(json.data?.title_hi || '');
        setDescriptionEn(json.data?.description_en || '');
        setDescriptionHi(json.data?.description_hi || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fetch error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // -------------------------
  // SAVE DATA
  // -------------------------
  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(API_BASE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title_en: titleEn,
          title_hi: titleHi,
          description_en: descriptionEn,
          description_hi: descriptionHi,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || 'Save failed');
      }

      setTitleEn(json.data.title_en);
      setTitleHi(json.data.title_hi);
      setDescriptionEn(json.data.description_en);
      setDescriptionHi(json.data.description_hi);

      alert('Saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <Info className="w-6 h-6" />
          <h1 className="text-2xl font-bold">About Us</h1>
        </div>
        <p className="text-sm text-white/80 mt-1">
          Manage About Section Content (English + Hindi)
        </p>
      </div>

      {/* EDITOR */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">

        {/* TITLE EN */}
        <div>
          <h2 className="font-semibold mb-2">Title (English)</h2>
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className="w-full border p-3 rounded-lg text-black"
            placeholder="Enter English title"
          />
        </div>

        {/* TITLE HI */}
        <div>
          <h2 className="font-semibold mb-2">Title (Hindi)</h2>
          <input
            value={titleHi}
            onChange={(e) => setTitleHi(e.target.value)}
            className="w-full border p-3 rounded-lg text-black"
            placeholder="हिंदी शीर्षक लिखें"
          />
        </div>

        {/* DESCRIPTION EN */}
        <div>
          <h2 className="font-semibold mb-2">Description (English)</h2>
          <textarea
            rows={4}
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            className="w-full border p-3 rounded-lg text-black"
            placeholder="Enter English description"
          />
        </div>

        {/* DESCRIPTION HI */}
        <div>
          <h2 className="font-semibold mb-2">Description (Hindi)</h2>
          <textarea
            rows={4}
            value={descriptionHi}
            onChange={(e) => setDescriptionHi(e.target.value)}
            className="w-full border p-3 rounded-lg text-black"
            placeholder="हिंदी विवरण लिखें"
          />
        </div>

        {/* SAVE */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#631012] hover:bg-[#7a1214] text-white px-6 py-2 rounded-lg"
        >
          <Save className="inline w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* PREVIEW */}
      <div className="bg-gray-50 p-6 rounded-lg border space-y-6">

        {/* ENGLISH PREVIEW */}
        <div>
          <h3 className="text-lg font-bold text-[#631012] mb-2">
            English Preview
          </h3>

          <h2 className="text-xl font-semibold mb-2">
            {titleEn || 'About Title (EN)'}
          </h2>

          <p className="text-gray-700 whitespace-pre-wrap">
            {descriptionEn || 'About description in English'}
          </p>
        </div>

        {/* HINDI PREVIEW */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-bold text-[#631012] mb-2">
            हिंदी पूर्वावलोकन
          </h3>

          <h2 className="text-xl font-semibold mb-2">
            {titleHi || 'About Title (HI)'}
          </h2>

          <p className="text-gray-700 whitespace-pre-wrap">
            {descriptionHi || 'हिंदी विवरण'}
          </p>
        </div>

      </div>

    </div>
  );
}