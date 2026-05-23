'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';

interface AdmissionItem {
  id?: number;

  title_en: string;
  title_hi: string;

  description_en: string;
  description_hi: string;
}

interface AdmissionsData {
  heading_en: string;
  heading_hi: string;
  admissions: AdmissionItem[];
}

export default function AdmissionsPage() {
  const [admissionsData, setAdmissionsData] = useState<AdmissionsData>({
    heading_en: '',
    heading_hi: '',
    admissions: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'http://localhost:4000/v1/homepage/admission'
      );

      if (!response.ok) throw new Error('Failed to fetch admissions');

      const result = await response.json();

      if (result.success) {
        setAdmissionsData({
          heading_en: result.data.heading_en || '',
          heading_hi: result.data.heading_hi || '',
          admissions: result.data.admissions || [],
        });
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error occurred');
      setAdmissionsData({
        heading_en: '',
        heading_hi: '',
        admissions: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      if (!admissionsData.heading_en.trim() || !admissionsData.heading_hi.trim()) {
        throw new Error('Heading EN/HI cannot be empty');
      }

      for (let a of admissionsData.admissions) {
        if (!a.title_en.trim() || !a.title_hi.trim()) {
          throw new Error('Title EN/HI cannot be empty');
        }
        if (!a.description_en.trim() || !a.description_hi.trim()) {
          throw new Error('Description EN/HI cannot be empty');
        }
      }

      const response = await fetch(
        'http://localhost:4000/v1/homepage/admission/bulk/save',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(admissionsData),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert('Saved successfully!');
        await fetchAdmissions();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Save error';
      setError(msg);
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const updateAdmission = (
    index: number,
    field: keyof AdmissionItem,
    value: string
  ) => {
    const updated = [...admissionsData.admissions];
    updated[index] = { ...updated[index], [field]: value };
    setAdmissionsData({ ...admissionsData, admissions: updated });
  };

  const addAdmission = () => {
    setAdmissionsData({
      ...admissionsData,
      admissions: [
        ...admissionsData.admissions,
        {
          title_en: '',
          title_hi: '',
          description_en: '',
          description_hi: '',
        },
      ],
    });
  };

  const removeAdmission = async (index: number) => {
    const item = admissionsData.admissions[index];

    if (item.id) {
      await fetch(
        `http://localhost:4000/v1/homepage/admission/${item.id}`,
        { method: 'DELETE' }
      );
      await fetchAdmissions();
    } else {
      setAdmissionsData({
        ...admissionsData,
        admissions: admissionsData.admissions.filter(
          (_, i) => i !== index
        ),
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading admissions...</div>;
  }

  return (
    <div className="space-y-6 p-4">

      {/* HEADER */}
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold">Admissions Editor</h1>
      </div>

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#631012] text-white px-4 py-2 rounded"
        >
          <Save className="inline w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* GLOBAL HEADING INPUT (FIXED) */}
      <div className="bg-white p-4 rounded shadow space-y-3">
        <input
          value={admissionsData.heading_en}
          onChange={(e) =>
            setAdmissionsData({
              ...admissionsData,
              heading_en: e.target.value,
            })
          }
          placeholder="Section Heading (English) - e.g. Admissions"
          className="w-full border p-2 rounded"
        />

        <input
          value={admissionsData.heading_hi}
          onChange={(e) =>
            setAdmissionsData({
              ...admissionsData,
              heading_hi: e.target.value,
            })
          }
          placeholder="Section Heading (Hindi)"
          className="w-full border p-2 rounded"
        />
      </div>

      {/* LIST */}
      <div className="space-y-4">

        {admissionsData.admissions.map((a, index) => (
          <div key={index} className="border p-4 rounded bg-white space-y-3">

            <input
              value={a.title_en}
              onChange={(e) =>
                updateAdmission(index, 'title_en', e.target.value)
              }
              placeholder="Title (English)"
              className="w-full border p-2 rounded"
            />

            <input
              value={a.title_hi}
              onChange={(e) =>
                updateAdmission(index, 'title_hi', e.target.value)
              }
              placeholder="Title (Hindi)"
              className="w-full border p-2 rounded"
            />

            <textarea
              value={a.description_en}
              onChange={(e) =>
                updateAdmission(index, 'description_en', e.target.value)
              }
              placeholder="Description (English)"
              className="w-full border p-2 rounded"
            />

            <textarea
              value={a.description_hi}
              onChange={(e) =>
                updateAdmission(index, 'description_hi', e.target.value)
              }
              placeholder="Description (Hindi)"
              className="w-full border p-2 rounded"
            />

            <button
              onClick={() => removeAdmission(index)}
              className="text-red-600 flex items-center gap-1"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        ))}

      </div>

      <button
        onClick={addAdmission}
        className="text-[#631012] flex items-center gap-2"
      >
        <Plus /> Add Admission
      </button>

      {/* PREVIEW */}
      <div className="mt-8 bg-white p-6 rounded shadow">

        {/* FIXED GLOBAL HEADING */}
        <h2 className="text-2xl font-bold mb-6">
          {admissionsData.heading_en || 'Admissions'}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* EN */}
          <div>
            <h3 className="font-bold text-green-700 mb-3">
              English
            </h3>

            {admissionsData.admissions.map((a, i) => (
              <div key={i} className="p-4 border rounded mb-3">
                <h3 className="font-semibold">{a.title_en}</h3>
                <p className="text-sm text-gray-600">
                  {a.description_en}
                </p>
              </div>
            ))}
          </div>

          {/* HI */}
          <div>
            <h3 className="font-bold text-orange-700 mb-3">
              हिंदी
            </h3>

            {admissionsData.admissions.map((a, i) => (
              <div key={i} className="p-4 border rounded mb-3">
                <h3 className="font-semibold">{a.title_hi}</h3>
                <p className="text-sm text-gray-600">
                  {a.description_hi}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}