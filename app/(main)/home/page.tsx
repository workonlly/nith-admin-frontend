'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import {
  Plus,
  Trash2,
  Save,
  Home,
} from 'lucide-react';

interface SectionItem {
  id: number;
  title: string;
  description: string;
  href: string;
}

export default function HomePage() {
  const [sections, setSections] = useState<
    SectionItem[]
  >([
    {
      id: 1,
      title: 'Hero Section',
      description:
        'Main banner and hero content',
      href: '/home/hero',
    },

    {
      id: 2,
      title: 'Gallery',
      description: 'Manage gallery images',
      href: '/home/gallery',
    },
  ]);

  // =========================
  // UPDATE SECTION
  // =========================

  const updateSection = (
    index: number,
    field: keyof SectionItem,
    value: string
  ) => {
    const updated = [...sections];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setSections(updated);
  };

  // =========================
  // ADD SECTION
  // =========================

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        title: '',
        description: '',
        href: '',
      },
    ]);
  };

  // =========================
  // DELETE SECTION
  // =========================

  const deleteSection = (index: number) => {
    setSections(
      sections.filter((_, i) => i !== index)
    );
  };

  // =========================
  // SAVE
  // =========================

  const handleSave = async () => {
    console.log(sections);

    // API CALL HERE
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Home className="w-7 h-7" />

          <h1 className="text-3xl font-bold">
            Homepage Sections
          </h1>
        </div>

        <p className="text-white/80">
          Add, edit and delete homepage
          sections dynamically.
        </p>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-xl bg-[#631012] text-white flex items-center gap-2"
        >
          <Save size={18} />
          Save Sections
        </button>
      </div>

      {/* SECTIONS */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="bg-white rounded-2xl border p-5 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">
                Section {index + 1}
              </h2>

              <button
                onClick={() =>
                  deleteSection(index)
                }
                className="text-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TITLE */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Section Title
                </label>

                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    updateSection(
                      index,
                      'title',
                      e.target.value
                    )
                  }
                  placeholder="Gallery"
                  className="w-full px-4 py-3 border rounded-xl"
                />
              </div>

              {/* ROUTE */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Route
                </label>

                <input
                  type="text"
                  value={section.href}
                  onChange={(e) =>
                    updateSection(
                      index,
                      'href',
                      e.target.value
                    )
                  }
                  placeholder="/home/gallery"
                  className="w-full px-4 py-3 border rounded-xl"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>

              <textarea
                rows={3}
                value={section.description}
                onChange={(e) =>
                  updateSection(
                    index,
                    'description',
                    e.target.value
                  )
                }
                placeholder="Manage gallery images"
                className="w-full px-4 py-3 border rounded-xl"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={addSection}
        className="px-5 py-3 rounded-xl border-2 border-dashed border-[#631012] text-[#631012] flex items-center gap-2"
      >
        <Plus size={18} />
        Add New Section
      </button>

      {/* PREVIEW */}
      <div className="bg-white rounded-2xl p-6 border">
        <h2 className="text-2xl font-bold mb-6">
          Sidebar Preview
        </h2>

        <div className="space-y-2">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={section.href || '#'}
              className="block px-4 py-3 rounded-xl bg-[#F9F9F9] hover:bg-[#631012] hover:text-white transition-all"
            >
              {section.title || 'Untitled Section'}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}