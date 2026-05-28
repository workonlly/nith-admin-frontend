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

  imageFile?: File | null;
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
          title_en: '',
          title_hi: '',

          category_en: '',
          category_hi: '',

          altText_en: '',
          altText_hi: '',

          imageUrl: '',

          imageFile: null,
        },
      ],
    });

  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {

    try {

      const formData = new FormData();

      formData.append(
        'heading_en',
        galleryData.heading_en
      );

      formData.append(
        'heading_hi',
        galleryData.heading_hi
      );

      formData.append(
        'description_en',
        galleryData.description_en
      );

      formData.append(
        'description_hi',
        galleryData.description_hi
      );

      // =========================================
      // IMAGE DATA
      // =========================================

      const imageData =
        galleryData.images.map((img) => ({

          title_en: img.title_en,
          title_hi: img.title_hi,

          category_en: img.category_en,
          category_hi: img.category_hi,

          altText_en: img.altText_en,
          altText_hi: img.altText_hi,
        }));

      formData.append(
        'images',
        JSON.stringify(imageData)
      );

      // =========================================
      // FILES
      // =========================================

      galleryData.images.forEach((img) => {

        if (img.imageFile) {

          formData.append(
            'images',
            img.imageFile
          );
        }
      });

      const res = await fetch(
        'http://localhost:4000/v1/homepage/gallery',
        {
          method: 'PUT',
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {

        alert(
          'Changes saved successfully!'
        );

      } else {

        alert(data.error || 'Failed');
      }

    } catch (err) {

      console.error(err);

      alert('Server error');
    }
  };

  // =====================================================
  // UPDATE IMAGE
  // =====================================================

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

  // =====================================================
  // ADD IMAGE
  // =====================================================

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

          imageFile: null,
        },
      ],
    });
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

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

      {/* MAIN */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-8">

        {/* CONTENT */}
        <div className="space-y-5">

          <div className="flex items-center gap-2">

            <FileText className="text-[#631012]" />

            <h2 className="text-2xl font-bold text-[#171717]">
              Gallery Content
            </h2>
          </div>

          {/* HEADINGS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              value={galleryData.heading_en}
              onChange={(e) =>
                setGalleryData({
                  ...galleryData,
                  heading_en: e.target.value,
                })
              }
              placeholder="Heading (English)"
              className="px-4 py-3 border border-[#171717]/20 rounded-xl"
            />

            <input
              type="text"
              value={galleryData.heading_hi}
              onChange={(e) =>
                setGalleryData({
                  ...galleryData,
                  heading_hi: e.target.value,
                })
              }
              placeholder="Heading (Hindi)"
              className="px-4 py-3 border border-[#171717]/20 rounded-xl"
            />
          </div>

          {/* DESCRIPTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <textarea
              rows={4}
              value={galleryData.description_en}
              onChange={(e) =>
                setGalleryData({
                  ...galleryData,
                  description_en: e.target.value,
                })
              }
              placeholder="Description (English)"
              className="px-4 py-3 border border-[#171717]/20 rounded-xl"
            />

            <textarea
              rows={4}
              value={galleryData.description_hi}
              onChange={(e) =>
                setGalleryData({
                  ...galleryData,
                  description_hi: e.target.value,
                })
              }
              placeholder="Description (Hindi)"
              className="px-4 py-3 border border-[#171717]/20 rounded-xl"
            />
          </div>
        </div>

        {/* IMAGES */}
        <div className="space-y-6">

          <div className="flex items-center gap-2">

            <Image className="text-[#631012]" />

            <h2 className="text-2xl font-bold text-[#171717]">
              Gallery Images
            </h2>
          </div>

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
                  onClick={() =>
                    removeImage(index)
                  }
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

                {/* ALT */}
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

                {/* FILE */}
                <div className="md:col-span-2">

                  <input
                    type="file"
                    accept="image/*"

                    onChange={(e) => {

                      const file =
                        e.target.files?.[0];

                      if (!file) return;

                      const updated = [
                        ...galleryData.images,
                      ];

                      updated[index] = {

                        ...updated[index],

                        imageFile: file,

                        imageUrl:
                          URL.createObjectURL(file),
                      };

                      setGalleryData({
                        ...galleryData,
                        images: updated,
                      });
                    }}

                    className="w-full px-4 py-3 border border-[#171717]/20 rounded-xl bg-white"
                  />
                </div>

                {/* PREVIEW */}
                {image.imageUrl && (

                  <div className="md:col-span-2">

                    <img
                      src={image.imageUrl}
                      alt="Preview"
                      className="w-full h-60 object-cover rounded-xl border"
                    />
                  </div>
                )}
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
    </div>
  );
}