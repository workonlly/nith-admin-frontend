'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Palette,
  Plus,
  Trash2,
  FileText,
  Info,
  List,
  AlertCircle,
  Loader,
  Edit2,
  Check,
  X,
  BookOpen,
  Download,
  Eye,
  Upload
} from 'lucide-react';

interface MagazineHeading {
  institute_title_en: string;
  institute_title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  institute_content_en: string;
  institute_content_hn: string;
  srijan_title_en: string;
  srijan_title_hn: string;
  srijan_content_en: string;
  srijan_content_hn: string;
  archive_title_en: string;
  archive_title_hn: string;
  archive_desc_en: string;
  archive_desc_hn: string;
  latest_issue_url: string;
  contact_url: string;
}

interface ArchiveItem {
  id: number;
  title_en: string;
  title_hn: string;
  download_url: string;
  view_url: string;
}

type TabType = 'headers' | 'archive';

export default function MagazinePublicationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('headers');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const DEFAULT_HEADING: MagazineHeading = {
    institute_title_en: 'Institute Magazine',
    institute_title_hn: 'संस्थान पत्रिका',
    sub_title_en: 'SRIJAN — the official annual cultural magazine of the institute.',
    sub_title_hn: 'सृजन — संस्थान की आधिकारिक वार्षिक सांस्कृतिक पत्रिका।',
    institute_content_en: 'The institute publishes an annual cultural magazine that showcases creative works from students across departments, including articles, poems, photographs and artwork.',
    institute_content_hn: 'संस्थान एक वार्षिक सांस्कृतिक पत्रिका प्रकाशित करता है जो विभागों में छात्रों के रचनात्मक कार्यों को प्रदर्शित करती है, जिसमें लेख, कविताएं, तस्वीरें और कलाकृतियां शामिल हैं।',
    srijan_title_en: 'Srijan',
    srijan_title_hn: 'सृजन',
    srijan_content_en: `There are certain corners in this universe, where big black holes disorient light, absorbing from it every speck of direction that it was born with; yet there are others where tiny strokes of running ink are capable of evoking emotion. We, at SRIJAN, prosper in the latter. Digging deep into hearts and helming higher into brains, we assemble facts and fiction, amuse and ruse, from haphazard thoughts into a compilation of shiny sheets. SRIJAN is the official annual cultural magazine of the institute.

Looking at it from a distance, the readers get glimpses of the year-around happenings in the college, set amid pieces of art by writers, painters, hotographers and whatnots in the college; up close, the magazine spells to the reader another universe of creativity. All the events and proceedings, activities by various teams and clubs, works carried on in the different departments are accounted. Artworks by creators make the most part of the magazine; they include handfuls of articles, beautiful poems, soulful photographs, paintings, sketches and digital arts.

Behind this compilation of about a couple of 100 pages, lays the hard-work of nights and days that is put together by Team SRIJAN. The team consists of editors, designers and the lately added members of the team the photographers. The team of editors is further split on the basis of language: Hindi and English. Moreover, all the factions consist of members from each year of study in the university. The editors handle the write-ups submitted: filter, edit, filter again, amend to make more reader-friendly, and proofread again. The designers hold the binding element to the magazine; they design each curve and each corner of what we finally have in the handbook.

We, at SRIJAN, welcome the talent to come and reach the surface, celebrate literature with fellow artists and rejoice in art that a stroke of ink can draw.`,
    srijan_content_hn: `इस ब्रह्मांड में कुछ ऐसे कोने हैं, जहां बड़े ब्लैक होल प्रकाश को दिशाहीन कर देते हैं, जिससे उसकी दिशा का हर अंश सोख लिया जाता है; फिर भी कुछ ऐसे भी हैं जहां स्याही के छोटे-छोटे स्ट्रोक भावनाओं को जगाने में सक्षम होते हैं। हम, सृजन में, बाद वाले में समृद्ध होते हैं। दिलों की गहराइयों में उतरकर और दिमागों को ऊंचाइयों पर ले जाकर, हम तथ्यों और कल्पनाओं को इकट्ठा करते हैं, मनोरंजन और युक्ति करते हैं, बेतरतीब विचारों से चमकदार पन्नों के संकलन में तब्दील करते हैं। सृजन संस्थान की आधिकारिक वार्षिक सांस्कृतिक पत्रिका है।

इसे दूर से देखने पर पाठकों को कॉलेज में साल भर होने वाली गतिविधियों की झलक मिलती है, जो कॉलेज में लेखकों, चित्रकारों, फोटोग्राफरों और अन्य कलाकारों की कलाकृतियों के बीच स्थापित होती है; करीब से देखने पर, यह पत्रिका पाठक को रचनात्मकता का एक और ब्रह्मांड दिखाती है। सभी कार्यक्रम और कार्यवाही, विभिन्न टीमों और क्लबों की गतिविधियाँ, विभिन्न विभागों में किए गए कार्यों का लेखा-जोखा इसमें होता है। रचनाकारों की कलाकृतियाँ पत्रिका का अधिकांश भाग बनाती हैं; इनमें लेख, सुंदर कविताएँ, भावपूर्ण तस्वीरें, पेंटिंग, रेखाचित्र और डिजिटल कला शामिल हैं।

लगभग 100 से अधिक पृष्ठों के इस संकलन के पीछे टीम सृजन द्वारा दिन-रात की गई कड़ी मेहनत है। टीम में संपादक, डिजाइनर और हाल ही में टीम में शामिल हुए फोटोग्राफर शामिल हैं। संपादकों की टीम को भाषा के आधार पर विभाजित किया गया है: हिंदी और अंग्रेजी। इसके अलावा, सभी गुटों में विश्वविद्यालय में अध्ययन के प्रत्येक वर्ष के सदस्य शामिल हैं। संपादक जमा की गई रचनाओं को संभालते हैं: फ़िल्टर करते हैं, संपादित करते हैं, फिर से फ़िल्टर करते हैं, अधिक पाठक-अनुकूल बनाने के लिए संशोधन करते हैं, और फिर से प्रूफरीड करते हैं। डिजाइनर पत्रिका के बाइंडिंग तत्व को संभालते हैं; वे हर वक्र और हर कोने को डिजाइन करते हैं जो अंततः हमारे पास हैंडबुक के रूप में होता है।

हम, सृजन में, प्रतिभा का सतह पर आने और पहुंचने का स्वागत करते हैं, साथी कलाकारों के साथ साहित्य का जश्न मनाते हैं और उस कला में आनंद लेते हैं जिसे स्याही का एक स्ट्रोक खींच सकता है।`,
    archive_title_en: 'Magazine Archive',
    archive_title_hn: 'पत्रिका संग्रह',
    archive_desc_en: 'List of past issues with download links.',
    archive_desc_hn: 'डाउनलोड लिंक के साथ पिछले अंकों की सूची।',
    latest_issue_url: '/student/publications/magazine',
    contact_url: '/student/publications/magazine'
  };

  const DEFAULT_ARCHIVE = [
    { title_en: 'SRIJAN 2023-24', title_hn: 'सृजन 2023-24', download_url: '/student/publications/magazine', view_url: '/student/publications/magazine' },
    { title_en: 'SRIJAN 2022', title_hn: 'सृजन 2022', download_url: '/student/publications/magazine', view_url: '/student/publications/magazine' },
    { title_en: 'SRIJAN 2021', title_hn: 'सृजन 2021', download_url: '/student/publications/magazine', view_url: '/student/publications/magazine' },
    { title_en: 'SRIJAN 2016', title_hn: 'सृजन 2016', download_url: '/student/publications/magazine', view_url: '/student/publications/magazine' },
    { title_en: 'SRIJAN 2015', title_hn: 'सृजन 2015', download_url: '/student/publications/magazine', view_url: '/student/publications/magazine' },
    { title_en: 'SRIJAN 2014', title_hn: 'सृजन 2014', download_url: '/student/publications/magazine', view_url: '/student/publications/magazine' },
    { title_en: 'SRIJAN 2013', title_hn: 'सृजन 2013', download_url: '/student/publications/magazine', view_url: '/student/publications/magazine' },
    { title_en: 'SRIJAN 2012', title_hn: 'सृजन 2012', download_url: '/student/publications/magazine', view_url: '/student/publications/magazine' },
  ];

  const [headingData, setHeadingData] = useState<MagazineHeading>({ ...DEFAULT_HEADING });
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);

  // CRUD states for archive
  const [newArchive, setNewArchive] = useState({ title_en: '', title_hn: '', download_url: '/student/publications/magazine', view_url: '/student/publications/magazine' });
  const [editingArchiveId, setEditingArchiveId] = useState<number | null>(null);
  const [editingArchiveData, setEditingArchiveData] = useState({ title_en: '', title_hn: '', download_url: '', view_url: '' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const [uploadingNewPdf, setUploadingNewPdf] = useState(false);
  const [uploadingIds, setUploadingIds] = useState<{ [key: number]: boolean }>({});

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, id?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed!');
      return;
    }

    if (id !== undefined) {
      setUploadingIds((prev) => ({ ...prev, [id]: true }));
    } else {
      setUploadingNewPdf(true);
    }

    try {
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
        if (id !== undefined) {
          if (editingArchiveId === id) {
            setEditingArchiveData((prev) => ({ ...prev, download_url: result.url, view_url: result.url }));
          } else {
            setArchiveItems((prev) =>
              prev.map((item) => (item.id === id ? { ...item, download_url: result.url, view_url: result.url } : item))
            );
          }
        } else {
          setNewArchive((prev) => ({ ...prev, download_url: result.url, view_url: result.url }));
        }
        alert('PDF uploaded successfully!');
      } else {
        alert('Failed to upload PDF: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading PDF to server');
    } finally {
      if (id !== undefined) {
        setUploadingIds((prev) => ({ ...prev, [id]: false }));
      } else {
        setUploadingNewPdf(false);
      }
    }
  };

  const getAttachmentUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${API_URL}${url}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Heading singleton
      const headRes = await fetch(`${API_URL}/api/student-magazine`);
      if (headRes.ok) {
        const hData = await headRes.json();
        if (hData && Object.keys(hData).length > 0) {
          setHeadingData({
            institute_title_en: hData.institute_title_en || DEFAULT_HEADING.institute_title_en,
            institute_title_hn: hData.institute_title_hn || DEFAULT_HEADING.institute_title_hn,
            sub_title_en: hData.sub_title_en || DEFAULT_HEADING.sub_title_en,
            sub_title_hn: hData.sub_title_hn || DEFAULT_HEADING.sub_title_hn,
            institute_content_en: hData.institute_content_en || DEFAULT_HEADING.institute_content_en,
            institute_content_hn: hData.institute_content_hn || DEFAULT_HEADING.institute_content_hn,
            srijan_title_en: hData.srijan_title_en || DEFAULT_HEADING.srijan_title_en,
            srijan_title_hn: hData.srijan_title_hn || DEFAULT_HEADING.srijan_title_hn,
            srijan_content_en: hData.srijan_content_en || DEFAULT_HEADING.srijan_content_en,
            srijan_content_hn: hData.srijan_content_hn || DEFAULT_HEADING.srijan_content_hn,
            archive_title_en: hData.archive_title_en || DEFAULT_HEADING.archive_title_en,
            archive_title_hn: hData.archive_title_hn || DEFAULT_HEADING.archive_title_hn,
            archive_desc_en: hData.archive_desc_en || DEFAULT_HEADING.archive_desc_en,
            archive_desc_hn: hData.archive_desc_hn || DEFAULT_HEADING.archive_desc_hn,
            latest_issue_url: hData.latest_issue_url || DEFAULT_HEADING.latest_issue_url,
            contact_url: hData.contact_url || DEFAULT_HEADING.contact_url
          });
        } else {
          // If empty in database, let's create the default heading row immediately via PUT
          await fetch(`${API_URL}/api/student-magazine`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(DEFAULT_HEADING),
          });
        }
      }

      // Fetch Archive Items
      const archRes = await fetch(`${API_URL}/api/student-magazine/archive`);
      if (archRes.ok) {
        const archData = await archRes.json();
        if (archData.length === 0) {
          // Seed archive table with default array
          for (const item of DEFAULT_ARCHIVE) {
            await fetch(`${API_URL}/api/student-magazine/archive`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            });
          }
          const archRes2 = await fetch(`${API_URL}/api/student-magazine/archive`);
          setArchiveItems(await archRes2.json());
        } else {
          setArchiveItems(archData);
        }
      }
    } catch (err: any) {
      console.error('Error fetching magazine data:', err);
      setError('Failed to fetch magazine details from backend. Check API status.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-magazine`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update magazine headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('Magazine headings and content settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- Archive CRUD ---
  const handleAddArchive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArchive.title_en.trim() || !newArchive.title_hn.trim()) {
      alert('Bilingual magazine title fields are required.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-magazine/archive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArchive),
      });
      if (!res.ok) throw new Error('Failed to add archive item');
      const saved = await res.json();
      setArchiveItems([saved, ...archiveItems]);
      setNewArchive({ title_en: '', title_hn: '', download_url: '/student/publications/magazine', view_url: '/student/publications/magazine' });
      alert('Magazine issue added to the archive!');
    } catch (err: any) {
      alert('Error adding archive item: ' + err.message);
    }
  };

  const handleSaveArchiveEdit = async (id: number) => {
    if (!editingArchiveData.title_en.trim() || !editingArchiveData.title_hn.trim()) {
      alert('Fields cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/student-magazine/archive/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingArchiveData),
      });
      if (!res.ok) throw new Error('Failed to update archive item');
      const updated = await res.json();
      setArchiveItems(archiveItems.map(item => item.id === id ? updated : item));
      setEditingArchiveId(null);
      alert('Archive issue updated!');
    } catch (err: any) {
      alert('Error updating archive issue: ' + err.message);
    }
  };

  const handleDeleteArchive = async (id: number) => {
    if (!confirm('Are you sure you want to delete this magazine issue from archive?')) return;
    try {
      await fetch(`${API_URL}/api/student-magazine/archive/${id}`, { method: 'DELETE' });
      setArchiveItems(archiveItems.filter(item => item.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  const tabs = [
    { id: 'headers' as TabType, label: 'Magazine Settings & Text', icon: <FileText size={18} /> },
    { id: 'archive' as TabType, label: 'Magazine Archives', icon: <BookOpen size={18} /> },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Magazine Editor Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Palette className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Magazine Publications Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure bilingual headings, Srijan description paragraphs, action links, and manage the download archive.
              </p>
            </div>
          </div>

          <button
            onClick={handleSavePageSettings}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#631012] hover:bg-[#520d0f] active:scale-95 text-white font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 text-sm w-full sm:w-auto justify-center"
          >
            {saving ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Page Content
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 p-3.5 bg-red-50 border-l-4 border-red-600 text-red-800 rounded-r-lg text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-white rounded-t-xl px-2 pt-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#631012] text-[#631012] bg-[#631012]/5 rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contents */}
      <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 min-h-[400px]">
        {/* --- HEADERS TAB --- */}
        {activeTab === 'headers' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English */}
              <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#631012]"></span>
                  English Content (EN)
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Institute Magazine Title (EN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.institute_title_en || ''}
                    onChange={(e) => setHeadingData({ ...headingData, institute_title_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Banner Subtitle (EN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.sub_title_en || ''}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Institute Magazine Description (EN)</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.institute_content_en || ''}
                    onChange={(e) => setHeadingData({ ...headingData, institute_content_en: e.target.value })}
                  />
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">1. Srijan Section (Bilingual Introduction)</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Srijan Title (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.srijan_title_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, srijan_title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Srijan Description (EN) — Use Double Enter for Paragraphs</label>
                    <textarea
                      rows={10}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012] whitespace-pre-wrap font-sans"
                      value={headingData.srijan_content_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, srijan_content_en: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">2. Archive Section Header</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Archive Title (EN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.archive_title_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, archive_title_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Archive Description (EN)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.archive_desc_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, archive_desc_en: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Hindi */}
              <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Hindi Content (HN)
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">संस्थान पत्रिका शीर्षक (HN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.institute_title_hn || ''}
                    onChange={(e) => setHeadingData({ ...headingData, institute_title_hn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">संस्थान पत्रिका उपशीर्षक (HN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.sub_title_hn || ''}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">संस्थान पत्रिका विवरण (HN)</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.institute_content_hn || ''}
                    onChange={(e) => setHeadingData({ ...headingData, institute_content_hn: e.target.value })}
                  />
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">1. सृजन अनुभाग (द्विभाषी परिचय)</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">सृजन शीर्षक (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.srijan_title_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, srijan_title_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">सृजन विवरण (HN) — पैराग्राफ के लिए डबल एंटर का उपयोग करें</label>
                    <textarea
                      rows={10}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012] whitespace-pre-wrap font-sans"
                      value={headingData.srijan_content_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, srijan_content_hn: e.target.value })}
                    />
                  </div>
                </div>
                <div className="border-t pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-gray-700">2. संग्रह अनुभाग शीर्षक</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">संग्रह शीर्षक (HN)</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.archive_title_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, archive_title_hn: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">संग्रह विवरण (HN)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                      value={headingData.archive_desc_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, archive_desc_hn: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#631012]" />
                Footer Action Redirect Links
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">View Latest Issue Redirect URL</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.latest_issue_url || ''}
                    onChange={(e) => setHeadingData({ ...headingData, latest_issue_url: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Contact Editorial Team Redirect URL</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.contact_url || ''}
                    onChange={(e) => setHeadingData({ ...headingData, contact_url: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- ARCHIVE TAB --- */}
        {activeTab === 'archive' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">Archive Issues</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {archiveItems.length} Mapped Issues
              </span>
            </div>

            {/* Form for new issue */}
            <form onSubmit={handleAddArchive} className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
              <h4 className="text-sm font-extrabold text-[#631012] uppercase tracking-wider flex items-center gap-2">
                <Plus size={16} /> Add a New Issue Release
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Title (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. SRIJAN 2023-24"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newArchive.title_en}
                    onChange={(e) => setNewArchive({ ...newArchive, title_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Title (HN)</label>
                  <input
                    type="text"
                    placeholder="e.g. सृजन 2023-24"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newArchive.title_hn}
                    onChange={(e) => setNewArchive({ ...newArchive, title_hn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Download Link URL</label>
                  <input
                    type="text"
                    placeholder="/student/publications/magazine"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newArchive.download_url}
                    onChange={(e) => setNewArchive({ ...newArchive, download_url: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">View Link URL</label>
                  <input
                    type="text"
                    placeholder="/student/publications/magazine"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newArchive.view_url}
                    onChange={(e) => setNewArchive({ ...newArchive, view_url: e.target.value })}
                  />
                </div>
                <div className="flex items-end pb-0.5">
                  <div className="w-full flex items-center gap-3 bg-white p-2 rounded-lg border border-dashed border-[#631012]/30 h-[38px]">
                    <label className={`px-4 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm w-full justify-center ${uploadingNewPdf ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                      <Upload size={14} />
                      {uploadingNewPdf ? 'Uploading...' : 'Upload PDF'}
                      <input 
                        type="file" 
                        accept="application/pdf" 
                        disabled={uploadingNewPdf}
                        onChange={(e) => handlePdfUpload(e)} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-[#631012] hover:bg-[#520d0f] active:scale-95 text-white font-semibold rounded-lg shadow-sm text-sm"
                >
                  <Plus className="w-4 h-4" /> Add Issue Release
                </button>
              </div>
            </form>

            {/* List Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full border-collapse table-auto text-left text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 font-semibold text-gray-700">Sl. No.</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Issue Title (EN)</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Issue Title (HN)</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Action URLs</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {archiveItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 font-medium text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-4">
                        {editingArchiveId === item.id ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:border-[#631012]"
                            value={editingArchiveData.title_en || ''}
                            onChange={(e) => setEditingArchiveData({ ...editingArchiveData, title_en: e.target.value })}
                          />
                        ) : (
                          <span className="font-semibold text-gray-900">{item.title_en}</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {editingArchiveId === item.id ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:border-[#631012]"
                            value={editingArchiveData.title_hn || ''}
                            onChange={(e) => setEditingArchiveData({ ...editingArchiveData, title_hn: e.target.value })}
                          />
                        ) : (
                          <span className="text-gray-600">{item.title_hn}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 space-y-1">
                        {editingArchiveId === item.id ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Download size={12} className="text-gray-400" />
                              <input
                                type="text"
                                className="w-full px-2 py-0.5 border rounded text-xs focus:outline-none focus:border-[#631012]"
                                value={editingArchiveData.download_url || ''}
                                onChange={(e) => setEditingArchiveData({ ...editingArchiveData, download_url: e.target.value })}
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye size={12} className="text-gray-400" />
                              <input
                                type="text"
                                className="w-full px-2 py-0.5 border rounded text-xs focus:outline-none focus:border-[#631012]"
                                value={editingArchiveData.view_url || ''}
                                onChange={(e) => setEditingArchiveData({ ...editingArchiveData, view_url: e.target.value })}
                              />
                            </div>
                            <div className="flex items-center gap-1.5 pt-0.5">
                              <label className={`px-2 py-1 rounded text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs ${uploadingIds[item.id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#631012] hover:bg-[#7a1214]'}`}>
                                <Upload size={10} />
                                {uploadingIds[item.id] ? 'Uploading...' : 'Upload PDF'}
                                <input 
                                  type="file" 
                                  accept="application/pdf" 
                                  disabled={!!uploadingIds[item.id]}
                                  onChange={(e) => handlePdfUpload(e, item.id)} 
                                  className="hidden" 
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 space-y-0.5">
                            <p className="flex items-center gap-1"><Download size={10} /> {item.download_url}</p>
                            <p className="flex items-center gap-1"><Eye size={10} /> {item.view_url}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {editingArchiveId === item.id ? (
                            <>
                              <button
                                onClick={() => handleSaveArchiveEdit(item.id)}
                                className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                                title="Save"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => setEditingArchiveId(null)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingArchiveId(item.id);
                                  setEditingArchiveData({
                                    title_en: item.title_en,
                                    title_hn: item.title_hn,
                                    download_url: item.download_url,
                                    view_url: item.view_url
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteArchive(item.id)}
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {archiveItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500 font-medium bg-gray-50/20">
                        No archive issues configured yet. Use the form above to add issues.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
