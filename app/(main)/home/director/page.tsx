'use client';

import React, { useEffect, useState } from 'react';
import {
  Save,
  User,
  Loader,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';

interface DirectorData {
  image: string;

  label_en: string;
  label_hi: string;

  heading_en: string;
  heading_hi: string;

  name_en: string;
  name_hi: string;

  designation_en: string;
  designation_hi: string;

  institute_en: string;
  institute_hi: string;

  message_en: string;
  message_hi: string;
}

export default function Director() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [directorData, setDirectorData] =
    useState<DirectorData>({
      image: '',

      label_en: '',
      label_hi: '',

      heading_en: '',
      heading_hi: '',

      name_en: '',
      name_hi: '',

      designation_en: '',
      designation_hi: '',

      institute_en: '',
      institute_hi: '',

      message_en: '',
      message_hi: '',
    });

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    let mounted = true;

    async function fetchDirector() {
      try {
        setLoading(true);

        const res = await fetch(
          'http://localhost:4000/v1/homepage/director'
        );

        const json = await res.json();

        if (mounted && json.success) {
          setDirectorData(json.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch director data');
      } finally {
        setLoading(false);
      }
    }

    fetchDirector();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================
  // UPDATE FIELD
  // =========================

  const updateField = (
    field: keyof DirectorData,
    value: string
  ) => {
    setDirectorData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================
  // SAVE
  // =========================

  const handleSave = async () => {
    try {
      setSaving(true);

      setError('');
      setSuccess('');

      const res = await fetch(
        'http://localhost:4000/v1/homepage/director',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(directorData),
        }
      );

      const json = await res.json();

      if (json.success) {
        setSuccess('Changes saved successfully!');

        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError('Failed to save changes');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong');
    } finally {
      setSaving(false);
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

          <p className="text-gray-600">
            Loading director section...
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
          <User className="w-7 h-7" />

          <h1 className="text-2xl sm:text-3xl font-bold">
            Director Section
          </h1>
        </div>

        <p className="text-white/90">
          Manage director message section
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
            <User className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#171717]">
              Director Editor
            </h2>

            <p className="text-[#171717]/60">
              Edit director section content
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

      {/* MAIN CONTENT */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-8">

        {/* IMAGE */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Director Image URL
          </label>

          <div className="flex items-center gap-2">
            <div className="px-4 text-[#631012]">
              <ImageIcon size={20} />
            </div>

            <input
              type="text"
              value={directorData.image}
              onChange={(e) =>
                updateField('image', e.target.value)
              }
              placeholder="/direct.jpg"
              className="flex-1 px-4 py-3 border border-[#171717]/20 rounded-xl text-black"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-6">

          <div className="flex items-center gap-2">
            <FileText className="text-[#631012]" />

            <h2 className="text-xl font-bold">
              Director Content
            </h2>
          </div>

          {/* LABEL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={directorData.label_en}
              onChange={(e) =>
                updateField('label_en', e.target.value)
              }
              placeholder="Label (English)"
              className="px-4 py-3 border rounded-xl text-black"
            />

            <input
              type="text"
              value={directorData.label_hi}
              onChange={(e) =>
                updateField('label_hi', e.target.value)
              }
              placeholder="लेबल (Hindi)"
              className="px-4 py-3 border rounded-xl text-black"
            />
          </div>

          {/* HEADING */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={directorData.heading_en}
              onChange={(e) =>
                updateField('heading_en', e.target.value)
              }
              placeholder="Heading (English)"
              className="px-4 py-3 border rounded-xl text-black"
            />

            <input
              type="text"
              value={directorData.heading_hi}
              onChange={(e) =>
                updateField('heading_hi', e.target.value)
              }
              placeholder="शीर्षक (Hindi)"
              className="px-4 py-3 border rounded-xl text-black"
            />
          </div>

          {/* NAME */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={directorData.name_en}
              onChange={(e) =>
                updateField('name_en', e.target.value)
              }
              placeholder="Name (English)"
              className="px-4 py-3 border rounded-xl text-black"
            />

            <input
              type="text"
              value={directorData.name_hi}
              onChange={(e) =>
                updateField('name_hi', e.target.value)
              }
              placeholder="नाम (Hindi)"
              className="px-4 py-3 border rounded-xl text-black"
            />
          </div>

          {/* DESIGNATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={directorData.designation_en}
              onChange={(e) =>
                updateField(
                  'designation_en',
                  e.target.value
                )
              }
              placeholder="Designation (English)"
              className="px-4 py-3 border rounded-xl text-black"
            />

            <input
              type="text"
              value={directorData.designation_hi}
              onChange={(e) =>
                updateField(
                  'designation_hi',
                  e.target.value
                )
              }
              placeholder="पदनाम (Hindi)"
              className="px-4 py-3 border rounded-xl text-black"
            />
          </div>

          {/* INSTITUTE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={directorData.institute_en}
              onChange={(e) =>
                updateField(
                  'institute_en',
                  e.target.value
                )
              }
              placeholder="Institute (English)"
              className="px-4 py-3 border rounded-xl text-black"
            />

            <input
              type="text"
              value={directorData.institute_hi}
              onChange={(e) =>
                updateField(
                  'institute_hi',
                  e.target.value
                )
              }
              placeholder="संस्थान (Hindi)"
              className="px-4 py-3 border rounded-xl text-black"
            />
          </div>

          {/* MESSAGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <textarea
              rows={6}
              value={directorData.message_en}
              onChange={(e) =>
                updateField(
                  'message_en',
                  e.target.value
                )
              }
              placeholder="Message (English)"
              className="px-4 py-3 border rounded-xl text-black"
            />

            <textarea
              rows={6}
              value={directorData.message_hi}
              onChange={(e) =>
                updateField(
                  'message_hi',
                  e.target.value
                )
              }
              placeholder="संदेश (Hindi)"
              className="px-4 py-3 border rounded-xl text-black"
            />
          </div>
        </div>

        {/* PREVIEW */}
       {/* PREVIEW */}
<div className="p-6 bg-[#F9F9F9] rounded-2xl border-2 border-dashed border-[#171717]/10">

  <p className="text-sm font-medium text-[#171717]/60 mb-5">
    Preview:
  </p>

  {/* ENGLISH PREVIEW */}
  <div className="bg-white rounded-3xl p-8 border border-[#171717]/10 mb-10">

    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#631012]">
        English Preview
      </h2>
    </div>

    <div className="text-center mb-8">
      <span className="text-[#631012] font-bold tracking-widest uppercase text-sm">
        {directorData.label_en}
      </span>

      <h2 className="text-4xl font-bold text-[#171717] mt-2">
        {directorData.heading_en}
      </h2>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

      {/* IMAGE */}
      <div>
        {directorData.image ? (
          <img
            src={directorData.image}
            alt={directorData.name_en}
            className="w-full h-[450px] object-cover rounded-2xl"
          />
        ) : (
          <div className="w-full h-[450px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div>
        <blockquote className="text-xl italic text-gray-700 leading-relaxed mb-6">
          "
          {directorData.message_en}
          "
        </blockquote>

        <h3 className="text-3xl font-bold text-[#631012]">
          {directorData.name_en}
        </h3>

        <p className="uppercase tracking-widest text-gray-600 mt-2">
          {directorData.designation_en}
        </p>

        <div className="mt-6 pt-4 border-t border-gray-300">
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            {directorData.institute_en}
          </p>
        </div>
      </div>

    </div>
  </div>

  {/* HINDI PREVIEW */}
  <div className="bg-white rounded-3xl p-8 border border-[#171717]/10">

    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#631012]">
        हिंदी प्रीव्यू
      </h2>
    </div>

    <div className="text-center mb-8">
      <span className="text-[#631012] font-bold tracking-widest text-sm">
        {directorData.label_hi}
      </span>

      <h2 className="text-4xl font-bold text-[#171717] mt-2">
        {directorData.heading_hi}
      </h2>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

      {/* IMAGE */}
      <div>
        {directorData.image ? (
          <img
            src={directorData.image}
            alt={directorData.name_hi}
            className="w-full h-[450px] object-cover rounded-2xl"
          />
        ) : (
          <div className="w-full h-[450px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div>
        <blockquote className="text-xl italic text-gray-700 leading-relaxed mb-6">
          "
          {directorData.message_hi}
          "
        </blockquote>

        <h3 className="text-3xl font-bold text-[#631012]">
          {directorData.name_hi}
        </h3>

        <p className="tracking-widest text-gray-600 mt-2">
          {directorData.designation_hi}
        </p>

        <div className="mt-6 pt-4 border-t border-gray-300">
          <p className="text-sm text-gray-500 tracking-wide">
            {directorData.institute_hi}
          </p>
        </div>
      </div>

    </div>
  </div>

</div>

      </div>
    </div>
  );
}