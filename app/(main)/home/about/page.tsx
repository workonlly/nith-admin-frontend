'use client';

import React, { useState, useEffect } from 'react';
import { Save, Info, FileText } from 'lucide-react';

export default function AboutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // We need to store the full homepage data so we don't overwrite
  // the Hero section when we update the About section.
  // Fix @typescript-eslint/no-explicit-any by specifying types
  // const [fullHomeData, setFullHomeData] = useState<any>({});
  interface HomeData {
    heromaintext?: string;
    herosubheading?: string;
    herodescheading?: string;
    aboutdesc?: string;
    [key: string]: unknown;
  }
  const FALLBACK_HOME_DATA: HomeData = {
    heromaintext: 'NIT HAMIRPUR',
    herosubheading: 'Shaping Minds. Building Futures.',
    herodescheading:
      'NIT Hamirpur is committed to academic excellence in engineering, technology, architecture, and sciences.',
    aboutdesc:
      'NIT Hamirpur is a premier technical institute focused on innovation, research, and holistic student development.',
  };

  const [fullHomeData, setFullHomeData] = useState<HomeData>({});

  // State specifically for the About Description editor
  const [aboutDescription, setAboutDescription] = useState('');

  const API_BASE = `http://${process.env.NEXT_PUBLIC_URL || 'localhost:4000'}/hero`;

  // 1. Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/homepage`);

        if (!res.ok) throw new Error('Failed to fetch data');

        const data = await res.json();

        // Store full data to preserve hero fields later
        setFullHomeData(data);

        // Set the editor state
        setAboutDescription(data.aboutdesc || '');
      } catch (err: unknown) {
        console.error(err);
        setFullHomeData(FALLBACK_HOME_DATA);
        setAboutDescription(FALLBACK_HOME_DATA.aboutdesc || '');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Handle Save (PUT)
  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');

      // Construct payload: Keep existing hero data, update only aboutdesc
      const body = {
        heromaintext: fullHomeData.heromaintext || FALLBACK_HOME_DATA.heromaintext,
        herosubheading: fullHomeData.herosubheading || FALLBACK_HOME_DATA.herosubheading,
        herodescheading:
          fullHomeData.herodescheading || FALLBACK_HOME_DATA.herodescheading,
        aboutdesc: aboutDescription,
      };

      const res = await fetch(`${API_BASE}/homepage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to save changes');

      const updatedData = await res.json();

      // Update local full state with the response
      setFullHomeData(updatedData);

      alert('Changes saved successfully!');
    } catch (err: unknown) {
      console.error(err);
      setError('Error saving changes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Info className="w-6 h-6 sm:w-8 sm:h-8" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            About Us
          </h1>
        </div>
        <p className="text-sm sm:text-base text-white/90">
          Manage about section content
        </p>
      </div>

      {/* Header & Save Button */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-[#631012]/10 p-2 sm:p-3 rounded-full text-[#631012] flex-shrink-0">
              <Info className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#171717] break-words">
                About Editor
              </h1>
              <p className="text-sm sm:text-base text-[#171717]/60 mt-1">
                Edit about section details
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#631012] hover:bg-[#7a1214] disabled:opacity-70 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md w-full sm:w-auto justify-center text-sm sm:text-base"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Main Editor Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <FileText className="text-[#631012] w-5 h-5 sm:w-6 sm:h-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#171717]">
                About Content
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {/* Description Input */}
              <div>
                <label className="block text-sm font-medium text-[#171717] mb-2">
                  Description
                </label>
                <textarea
                  rows={6}
                  value={aboutDescription}
                  onChange={(e) => setAboutDescription(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#171717]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent text-black text-sm sm:text-base"
                  placeholder="Enter about description..."
                />
              </div>
            </div>

            {/* Live Preview */}
            <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-[#F9F9F9] rounded-lg border-2 border-dashed border-[#171717]/20">
              <p className="text-xs sm:text-sm font-medium text-[#171717]/60 mb-3">
                Preview:
              </p>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#171717] mb-4">
                  About Us
                </h3>
                <p className="text-sm sm:text-base text-[#171717]/70 leading-relaxed whitespace-pre-wrap">
                  {aboutDescription || 'No description available.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
