'use client';

import React, { useState } from 'react';
import {
  Save,
  Image,
  Plus,
  Trash2,
  FileText,
  Languages,
} from 'lucide-react';

interface GalleryImage {
  title_en: string;
  title_hi: string;

  category_en: string;
  category_hi: string;

  altText_en: string;
  altText_hi: string;

  imageUrl: string;
}

interface GalleryData {
  heading_en: string;
  heading_hi: string;

  description_en: string;
  description_hi: string;

  images: GalleryImage[];
}

export default function GalleryPage() {
  const [galleryData, setGalleryData] =
    useState<GalleryData>({
      heading_en: 'Gallery',
      heading_hi: 'गैलरी',

      description_en:
        'Explore moments from our campus events, achievements, and vibrant community.',

      description_hi:
        'हमारे कैंपस कार्यक्रमों, उपलब्धियों और जीवंत समुदाय के क्षणों का अन्वेषण करें।',

      images: [
        {
          title_en: 'Gallery Image 1',
          title_hi: 'गैलरी इमेज 1',

          category_en: 'Event',
          category_hi: 'कार्यक्रम',

          altText_en: 'Gallery Image 1',
          altText_hi: 'गैलरी इमेज 1',

          imageUrl: '/images/gallery/1.jpg',
        },
      ],
    });

  const handleSave = async () => {
    try {
      const res = await fetch(
        'http://localhost:4000/v1/homepage/gallery',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(galleryData),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert('Changes saved successfully!');
      } else {
        alert(data.error || 'Failed');
      }

    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const updateImage = (
    index: number,
    field: keyof GalleryImage,
    value: string
  ) => {
    const updated = [...galleryData.images];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setGalleryData({
      ...galleryData,
      images: updated,
    });
  };

  const addImage = () => {
    setGalleryData({
      ...galleryData,

      images: [
        ...galleryData.images,

        {
          title_en: '',
          title_hi: '',

          category_en: '',
          category_hi: '',

          altText_en: '',
          altText_hi: '',

          imageUrl: '',
        },
      ],
    });
  };

  const removeImage = (index: number) => {
    setGalleryData({
      ...galleryData,

      images: galleryData.images.filter(
        (_, i) => i !== index
      ),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-white">

        <div className="flex items-center gap-3 mb-4">
          <Image className="w-7 h-7" />

          <h1 className="text-2xl lg:text-3xl font-bold">
            Gallery
          </h1>
        </div>

        <p className="text-white/90">
          Manage bilingual gallery section
        </p>
      </div>

      {/* TOP BAR */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">
              <Languages className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#171717]">
                Gallery Editor
              </h2>

              <p className="text-[#171717]/60">
                English + Hindi content management
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="bg-[#631012] hover:bg-[#7a1214] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-8">

        {/* CONTENT */}
        <div className="space-y-5">

          <div className="flex items-center gap-2">
            <FileText className="text-[#631012]" />

            <h2 className="text-2xl font-bold text-[#171717]">
              Gallery Content
            </h2>
          </div>

          {/* HEADING */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium mb-2">
                Heading (English)
              </label>

              <input
                type="text"
                value={galleryData.heading_en}
                onChange={(e) =>
                  setGalleryData({
                    ...galleryData,
                    heading_en: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Heading (Hindi)
              </label>

              <input
                type="text"
                value={galleryData.heading_hi}
                onChange={(e) =>
                  setGalleryData({
                    ...galleryData,
                    heading_hi: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium mb-2">
                Description (English)
              </label>

              <textarea
                rows={4}
                value={galleryData.description_en}
                onChange={(e) =>
                  setGalleryData({
                    ...galleryData,
                    description_en: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description (Hindi)
              </label>

              <textarea
                rows={4}
                value={galleryData.description_hi}
                onChange={(e) =>
                  setGalleryData({
                    ...galleryData,
                    description_hi: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="space-y-5">

          <div className="flex items-center gap-2">
            <Image className="text-[#631012]" />

            <h2 className="text-2xl font-bold text-[#171717]">
              Gallery Images
            </h2>
          </div>

          <div className="space-y-6">

            {galleryData.images.map((image, index) => (
              <div
                key={index}
                className="p-5 border border-[#171717]/10 rounded-2xl bg-[#F9F9F9]"
              >

                <div className="flex justify-between items-center mb-5">

                  <p className="font-medium text-sm">
                    Image {index + 1}
                  </p>

                  <button
                    onClick={() => removeImage(index)}
                    className="text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* TITLE */}
                  <input
                    type="text"
                    value={image.title_en}
                    onChange={(e) =>
                      updateImage(
                        index,
                        'title_en',
                        e.target.value
                      )
                    }
                    placeholder="Title (English)"
                    className="px-4 py-3 border border-[#171717]/20 rounded-xl"
                  />

                  <input
                    type="text"
                    value={image.title_hi}
                    onChange={(e) =>
                      updateImage(
                        index,
                        'title_hi',
                        e.target.value
                      )
                    }
                    placeholder="Title (Hindi)"
                    className="px-4 py-3 border border-[#171717]/20 rounded-xl"
                  />

                  {/* CATEGORY */}
                  <input
                    type="text"
                    value={image.category_en}
                    onChange={(e) =>
                      updateImage(
                        index,
                        'category_en',
                        e.target.value
                      )
                    }
                    placeholder="Category (English)"
                    className="px-4 py-3 border border-[#171717]/20 rounded-xl"
                  />

                  <input
                    type="text"
                    value={image.category_hi}
                    onChange={(e) =>
                      updateImage(
                        index,
                        'category_hi',
                        e.target.value
                      )
                    }
                    placeholder="Category (Hindi)"
                    className="px-4 py-3 border border-[#171717]/20 rounded-xl"
                  />

                  {/* ALT TEXT */}
                  <input
                    type="text"
                    value={image.altText_en}
                    onChange={(e) =>
                      updateImage(
                        index,
                        'altText_en',
                        e.target.value
                      )
                    }
                    placeholder="Alt Text (English)"
                    className="px-4 py-3 border border-[#171717]/20 rounded-xl"
                  />

                  <input
                    type="text"
                    value={image.altText_hi}
                    onChange={(e) =>
                      updateImage(
                        index,
                        'altText_hi',
                        e.target.value
                      )
                    }
                    placeholder="Alt Text (Hindi)"
                    className="px-4 py-3 border border-[#171717]/20 rounded-xl"
                  />

                  {/* IMAGE URL */}
                  <input
                    type="text"
                    value={image.imageUrl}
                    onChange={(e) =>
                      updateImage(
                        index,
                        'imageUrl',
                        e.target.value
                      )
                    }
                    placeholder="/images/gallery/1.jpg"
                    className="md:col-span-2 px-4 py-3 border border-[#171717]/20 rounded-xl"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addImage}
              className="flex items-center gap-2 text-[#631012]"
            >
              <Plus size={18} />
              Add Image
            </button>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="p-6 bg-[#F9F9F9] rounded-2xl border-2 border-dashed border-[#171717]/10">

          <p className="text-sm font-medium text-[#171717]/60 mb-5">
            Live Preview
          </p>

          <div className="bg-white rounded-3xl p-8 border border-[#171717]/10">

            {/* ENGLISH PREVIEW */}
            <div className="mb-12">

              <h2 className="text-4xl font-bold text-[#631012] mb-4">
                {galleryData.heading_en}
              </h2>

              <p className="text-gray-600 mb-10">
                {galleryData.description_en}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {galleryData.images.map((image, index) => (
                  <div
                    key={index}
                    className="bg-[#F9F9F9] rounded-xl overflow-hidden border border-[#171717]/10"
                  >

                    <div className="h-40 bg-gray-200 overflow-hidden">

                      {image.imageUrl ? (
                        <img
                          src={image.imageUrl}
                          alt={image.altText_en}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-4">

                      <p className="text-xs text-[#631012] font-semibold mb-1">
                        {image.category_en}
                      </p>

                      <h3 className="font-bold text-sm">
                        {image.title_en}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HINDI PREVIEW */}
            <div className="border-t pt-12">

              <h2 className="text-4xl font-bold text-[#631012] mb-4">
                {galleryData.heading_hi}
              </h2>

              <p className="text-gray-600 mb-10">
                {galleryData.description_hi}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                {galleryData.images.map((image, index) => (
                  <div
                    key={index}
                    className="bg-[#F9F9F9] rounded-xl overflow-hidden border border-[#171717]/10"
                  >

                    <div className="h-40 bg-gray-200 overflow-hidden">

                      {image.imageUrl ? (
                        <img
                          src={image.imageUrl}
                          alt={image.altText_hi}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-4">

                      <p className="text-xs text-[#631012] font-semibold mb-1">
                        {image.category_hi}
                      </p>

                      <h3 className="font-bold text-sm">
                        {image.title_hi}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}