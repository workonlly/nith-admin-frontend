'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Settings, Calendar, Award, Image as ImageIcon, Mail, FileText, Upload } from 'lucide-react';

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

  // Upcoming meet fields
  upcoming_title_en: string;
  upcoming_title_hn: string;
  upcoming_theme_en: string;
  upcoming_theme_hn: string;
  upcoming_date_en: string;
  upcoming_date_hn: string;
  upcoming_venue_en: string;
  upcoming_venue_hn: string;
  upcoming_desc_en: string;
  upcoming_desc_hn: string;
  upcoming_reg_open: boolean;
  upcoming_image?: string;

  // Get involved and contacts
  involve_title_en: string;
  involve_title_hn: string;
  involve_desc_en: string;
  involve_desc_hn: string;
  contact_email: string;
  contact_phone: string;
  contact_address_en: string;
  contact_address_hn: string;

  // Stay connected
  connected_title_en: string;
  connected_title_hn: string;
  connected_desc_en: string;
  connected_desc_hn: string;

  // New dynamic links and actions
  link_register_label_en: string;
  link_register_label_hn: string;
  link_register_url: string;
  link_network_label_en: string;
  link_network_label_hn: string;
  link_network_url: string;
  link_endowment_label_en: string;
  link_endowment_label_hn: string;
  link_endowment_url: string;
  btn_join_label_en: string;
  btn_join_label_hn: string;
  btn_join_url: string;
  btn_sub_label_en: string;
  btn_sub_label_hn: string;
  btn_sub_url: string;
}

interface ScheduleItem {
  id: number;
  time_en: string;
  time_hn: string;
  activity_en: string;
  activity_hn: string;
  venue_en: string;
  venue_hn: string;
  speaker_en: string;
  speaker_hn: string;
}

interface PastMeetItem {
  id: number;
  year: string;
  theme_en: string;
  theme_hn: string;
  date_en: string;
  date_hn: string;
  highlights_en: string;
  highlights_hn: string;
  attendees: number;
  images: string; // Comma separated list of images
}

interface GalleryItem {
  id: number;
  url: string;
  year: string;
  caption_en: string;
  caption_hn: string;
}

const INITIAL_HEADING: HeadingData = {
  title_en: 'Annual Alumni Meet of NITH',
  title_hn: 'एनआईटी हमीरपुर की वार्षिक पूर्व छात्र बैठक',
  sub_title_en: 'Reconnecting alumni with their alma mater and celebrating shared journeys of excellence, innovation, and lifelong bonds.',
  sub_title_hn: 'पूर्व छात्रों को उनके अल्मा मेटर से फिर से जोड़ना और उत्कृष्टता, नवाचार और आजीवन संबंधों की साझा यात्रा का जश्न मनाना।',
  about_title_en: 'About the Annual Alumni Meet',
  about_title_hn: 'वार्षिक पूर्व छात्र बैठक के बारे में',
  about_desc1_en: 'The Annual Alumni Meet is a flagship event of NIT Hamirpur, bringing together graduates from across batches, disciplines, and geographies to celebrate our shared heritage and continued excellence. It serves as a platform for reconnection, knowledge sharing, and strengthening the bonds that tie us to our alma mater.',
  about_desc1_hn: 'वार्षिक पूर्व छात्र बैठक एनआईटी हमीरपुर का एक प्रमुख कार्यक्रम है, जो हमारी साझा विरासत और निरंतर उत्कृष्टता का जश्न मनाने के लिए विभिन्न बैचों, विषयों और भौगोलिक क्षेत्रों के स्नातकों को एक साथ लाता है। यह पुनर्मिलन, ज्ञान साझा करने और हमारे अल्मा मेटर से बांधने वाले संबंधों को मजबूत करने के लिए एक मंच के रूप में कार्य करता है।',
  about_desc2_en: 'This cherished tradition provides an opportunity for alumni to revisit the campus, witness its growth, interact with faculty and current students, and contribute to the institute\'s vision for the future. Through engaging sessions, cultural events, and informal gatherings, the meet fosters a sense of community that transcends time and distance.',
  about_desc2_hn: 'यह पोषित परंपरा पूर्व छात्रों को परिसर में फिर से जाने, इसके विकास को देखने, संकाय और वर्तमान छात्रों के साथ बातचीत करने और भविष्य के लिए संस्थान के दृष्टिकोण में योगदान करने का अवसर प्रदान करती है। आकर्षक सत्रों, सांस्कृतिक कार्यक्रमों और अनौपचारिक सभाओं के माध्यम से, बैठक समुदाय की भावना को बढ़ावा देती है जो समय और दूरी से परे है।',
  about_desc3_en: 'The event also recognizes outstanding achievements of alumni who have brought laurels to the institute through their professional accomplishments, social contributions, and exemplary leadership in their respective fields.',
  about_desc3_hn: 'यह कार्यक्रम उन पूर्व छात्रों की उत्कृष्ट उपलब्धियों को भी मान्यता देता है जिन्होंने अपने पेशेवर कार्यों, सामाजिक योगदान और अपने संबंधित क्षेत्रों में अनुकरणीय नेतृत्व के माध्यम से संस्थान का मान बढ़ाया है।',
  upcoming_title_en: 'Annual Alumni Meet 2025',
  upcoming_title_hn: 'वार्षिक पूर्व छात्र बैठक 2025',
  upcoming_theme_en: 'Innovation & Excellence: Building Tomorrow Together',
  upcoming_theme_hn: 'नवाचार और उत्कृष्टता: साथ मिलकर कल का निर्माण',
  upcoming_date_en: 'March 15-17, 2025',
  upcoming_date_hn: '15-17 मार्च, 2025',
  upcoming_venue_en: 'NIT Hamirpur Campus',
  upcoming_venue_hn: 'एनआईटी हमीरपुर परिसर',
  upcoming_desc_en: 'Join us for three days of reconnection, celebration, and inspiration as we bring together alumni from across generations to celebrate our shared legacy and strengthen our bonds.',
  upcoming_desc_hn: 'हमारी साझा विरासत का जश्न मनाने और हमारे बंधनों को मजबूत करने के लिए विभिन्न पीढ़ियों के पूर्व छात्रों को एक साथ लाने के साथ पुनर्मिलन, उत्सव और प्रेरणा के तीन दिनों के लिए हमारे साथ जुड़ें।',
  upcoming_reg_open: true,
  upcoming_image: '',
  involve_title_en: 'Get Involved',
  involve_title_hn: 'शामिल हों',
  involve_desc_en: 'Have questions or want to participate? Reach out to us',
  involve_desc_hn: 'प्रश्न हैं या भाग लेना चाहते हैं? हमसे संपर्क करें',
  contact_email: 'alumni@nith.ac.in',
  contact_phone: '+91-1972-254545',
  contact_address_en: 'Alumni Relations Office, NIT Hamirpur, Himachal Pradesh - 177005',
  contact_address_hn: 'पूर्व छात्र संबंध कार्यालय, एनआईटी हमीरपुर, हिमाचल प्रदेश - 177005',
  connected_title_en: 'Stay Connected with NITH Alumni',
  connected_title_hn: 'एनआईटीएच पूर्व छात्रों के साथ जुड़े रहें',
  connected_desc_en: 'Join our vibrant alumni community and be part of a network that spans the globe. Together, we continue to build on our shared legacy of excellence.',
  connected_desc_hn: 'हमारे जीवंत पूर्व छात्र समुदाय में शामिल हों और दुनिया भर में फैले नेटवर्क का हिस्सा बनें। साथ मिलकर, हम उत्कृष्टता की अपनी साझा विरासत का निर्माण जारी रखेंगे।',
  link_register_label_en: 'Register for Annual Meet',
  link_register_label_hn: 'वार्षिक बैठक के लिए पंजीकरण करें',
  link_register_url: '/alumni/registration',
  link_network_label_en: 'Alumni Network',
  link_network_label_hn: 'पूर्व छात्र नेटवर्क',
  link_network_url: '/alumni/network',
  link_endowment_label_en: 'Support Endowment Fund',
  link_endowment_label_hn: 'अक्षय निधि का समर्थन करें',
  link_endowment_url: '/alumni/endowment-fund',
  btn_join_label_en: 'Join Alumni Portal',
  btn_join_label_hn: 'पूर्व छात्र पोर्टल में शामिल हों',
  btn_join_url: '/alumni/registration',
  btn_sub_label_en: 'Subscribe to Newsletter',
  btn_sub_label_hn: 'समाचार पत्र की सदस्यता लें',
  btn_sub_url: '#'
};

export default function AnnualAlumniMeetAdmin() {
  const [heading, setHeading] = useState<HeadingData>(INITIAL_HEADING);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [pastMeets, setPastMeets] = useState<PastMeetItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  // Deletions tracking
  const [deletedScheduleIds, setDeletedScheduleIds] = useState<number[]>([]);
  const [deletedPastIds, setDeletedPastIds] = useState<number[]>([]);
  const [deletedGalleryIds, setDeletedGalleryIds] = useState<number[]>([]);

  const [activeTab, setActiveTab] = useState<'hero' | 'upcoming' | 'schedule' | 'past' | 'gallery'>('hero');
  const [isSaving, setIsSaving] = useState(false);

  // Upload States
  const [uploadingGalleryIds, setUploadingGalleryIds] = useState<{ [key: number]: boolean }>({});
  const [uploadingPastIds, setUploadingPastIds] = useState<{ [key: number]: boolean }>({});
  const [uploadingUpcomingImage, setUploadingUpcomingImage] = useState(false);

  // Upcoming promotional image upload handler
  const handleUpcomingImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed!');
      return;
    }

    setUploadingUpcomingImage(true);
    try {
      const url = await handleImageUpload(file);
      setHeading(prev => ({ ...prev, upcoming_image: url }));
      alert('Upcoming promotional image uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploadingUpcomingImage(false);
    }
  };

  // Core image upload helper
  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:4000/api/upload', {
      method: 'POST',
      headers: {
        'x-bucket-name': 'alumni-section'
      },
      body: formData
    });
    
    const result = await res.json();
    if (result.success && result.url) {
      return result.url;
    } else {
      throw new Error(result.error || 'Upload failed');
    }
  };

  // Gallery photo upload handler
  const handlePhotoUploadForGallery = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed!');
      return;
    }

    setUploadingGalleryIds(prev => ({ ...prev, [id]: true }));
    try {
      const url = await handleImageUpload(file);
      setGallery(prev => prev.map(item => item.id === id ? { ...item, url } : item));
      alert('Image uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploadingGalleryIds(prev => ({ ...prev, [id]: false }));
    }
  };

  // Past Reunion photo upload and append handler
  const handlePhotoUploadForPastMeet = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed!');
      return;
    }

    setUploadingPastIds(prev => ({ ...prev, [id]: true }));
    try {
      const url = await handleImageUpload(file);
      setPastMeets(prev => prev.map(meet => {
        if (meet.id === id) {
          const currentImages = meet.images ? meet.images.split(',').map(s => s.trim()).filter(Boolean) : [];
          currentImages.push(url);
          return { ...meet, images: currentImages.join(',') };
        }
        return meet;
      }));
      alert('Image uploaded and appended successfully!');
    } catch (err: any) {
      console.error(err);
      alert('Error uploading image: ' + err.message);
    } finally {
      setUploadingPastIds(prev => ({ ...prev, [id]: false }));
    }
  };

  // Remove individual photo from past meet reunion list
  const handleRemoveImageFromPastMeet = (meetId: number, imgUrlToRemove: string) => {
    setPastMeets(prev => prev.map(meet => {
      if (meet.id === meetId) {
        const currentImages = meet.images ? meet.images.split(',').map(s => s.trim()).filter(Boolean) : [];
        const filtered = currentImages.filter(url => url !== imgUrlToRemove);
        return { ...meet, images: filtered.join(',') };
      }
      return meet;
    }));
  };

  // Fetch initial database records
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/alumni-annual-meet', { cache: 'no-store' });
        const data = await res.json();
        
        if (data.heading) {
          setHeading(prev => ({ ...INITIAL_HEADING, ...data.heading }));
        }
        if (Array.isArray(data.schedule)) setSchedule(data.schedule);
        if (Array.isArray(data.past)) setPastMeets(data.past);
        if (Array.isArray(data.gallery)) setGallery(data.gallery);
      } catch (err) {
        console.error('Fetch annual meet data failed:', err);
      }
    };
    fetchData();
  }, []);

  // Save changes handler
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Process deleted items
      for (const id of deletedScheduleIds) {
        await fetch(`http://localhost:4000/api/alumni-annual-meet/schedule/${id}`, { method: 'DELETE' });
      }
      for (const id of deletedPastIds) {
        await fetch(`http://localhost:4000/api/alumni-annual-meet/past-meets/${id}`, { method: 'DELETE' });
      }
      for (const id of deletedGalleryIds) {
        await fetch(`http://localhost:4000/api/alumni-annual-meet/gallery/${id}`, { method: 'DELETE' });
      }
      setDeletedScheduleIds([]);
      setDeletedPastIds([]);
      setDeletedGalleryIds([]);

      // 2. Save Headings and Copy
      await fetch('http://localhost:4000/api/alumni-annual-meet/heading', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heading)
      });

      // 3. Save Schedule items (POST for new items, PUT for existing ones)
      for (const item of schedule) {
        const payload = {
          time_en: item.time_en,
          time_hn: item.time_hn,
          activity_en: item.activity_en,
          activity_hn: item.activity_hn,
          venue_en: item.venue_en,
          venue_hn: item.venue_hn,
          speaker_en: item.speaker_en,
          speaker_hn: item.speaker_hn
        };
        if (item.id > 0 && item.id < 1000000000) {
          await fetch(`http://localhost:4000/api/alumni-annual-meet/schedule/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          await fetch('http://localhost:4000/api/alumni-annual-meet/schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      }

      // 4. Save Past Meets items
      for (const item of pastMeets) {
        const payload = {
          year: item.year,
          theme_en: item.theme_en,
          theme_hn: item.theme_hn,
          date_en: item.date_en,
          date_hn: item.date_hn,
          highlights_en: item.highlights_en,
          highlights_hn: item.highlights_hn,
          attendees: Number(item.attendees),
          images: item.images
        };
        if (item.id > 0 && item.id < 1000000000) {
          await fetch(`http://localhost:4000/api/alumni-annual-meet/past-meets/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          await fetch('http://localhost:4000/api/alumni-annual-meet/past-meets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      }

      // 5. Save Gallery items
      for (const item of gallery) {
        const payload = {
          url: item.url,
          year: item.year,
          caption_en: item.caption_en,
          caption_hn: item.caption_hn
        };
        if (item.id > 0 && item.id < 1000000000) {
          await fetch(`http://localhost:4000/api/alumni-annual-meet/gallery/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          await fetch('http://localhost:4000/api/alumni-annual-meet/gallery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      }

      alert('All Annual Alumni Meet changes saved successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Failed to save changes:', err);
      alert('Error saving changes. Please check server logs.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add / Remove utilities for Schedule
  const handleAddSchedule = () => {
    const newItem: ScheduleItem = {
      id: Date.now() + Math.random(),
      time_en: '',
      time_hn: '',
      activity_en: '',
      activity_hn: '',
      venue_en: '',
      venue_hn: '',
      speaker_en: '',
      speaker_hn: ''
    };
    setSchedule(prev => [...prev, newItem]);
  };
  const handleRemoveSchedule = (id: number) => {
    if (id > 0 && id < 1000000000) setDeletedScheduleIds(prev => [...prev, id]);
    setSchedule(prev => prev.filter(item => item.id !== id));
  };
  const handleUpdateScheduleField = (id: number, field: keyof ScheduleItem, value: string) => {
    setSchedule(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Add / Remove utilities for Past Meets
  const handleAddPastMeet = () => {
    const newItem: PastMeetItem = {
      id: Date.now() + Math.random(),
      year: '',
      theme_en: '',
      theme_hn: '',
      date_en: '',
      date_hn: '',
      highlights_en: '',
      highlights_hn: '',
      attendees: 0,
      images: ''
    };
    setPastMeets(prev => [...prev, newItem]);
  };
  const handleRemovePastMeet = (id: number) => {
    if (id > 0 && id < 1000000000) setDeletedPastIds(prev => [...prev, id]);
    setPastMeets(prev => prev.filter(item => item.id !== id));
  };
  const handleUpdatePastMeetField = (id: number, field: keyof PastMeetItem, value: any) => {
    setPastMeets(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // Add / Remove utilities for Gallery
  const handleAddGallery = () => {
    const newItem: GalleryItem = {
      id: Date.now() + Math.random(),
      url: '',
      year: '',
      caption_en: '',
      caption_hn: ''
    };
    setGallery(prev => [...prev, newItem]);
  };
  const handleRemoveGallery = (id: number) => {
    if (id > 0 && id < 1000000000) setDeletedGalleryIds(prev => [...prev, id]);
    setGallery(prev => prev.filter(item => item.id !== id));
  };
  const handleUpdateGalleryField = (id: number, field: keyof GalleryItem, value: string) => {
    setGallery(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="space-y-6 p-6 pb-28">
      {/* Header card with action bar */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-[#631012]" />
              Annual Alumni Meet Manager
            </h1>
            <p className="text-gray-500 mt-1">
              Bilingually manage page banners, upcoming event schedules, reunion timelines, and photo galleries.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#631012] text-white rounded-lg hover:bg-[#4d0c0e] font-semibold transition-all disabled:bg-gray-400 shadow-md transform hover:-translate-y-0.5"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Horizontally scrollable navigation tabs */}
        <div className="flex overflow-x-auto whitespace-nowrap flex-nowrap border-b border-gray-200 mt-6 gap-2 scrollbar-thin">
          <button
            onClick={() => setActiveTab('hero')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'hero' ? 'border-[#631012] text-[#631012]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            Hero & About Copy
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'upcoming' ? 'border-[#631012] text-[#631012]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Upcoming Reunion & Contacts
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'schedule' ? 'border-[#631012] text-[#631012]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-5 h-5" />
            Reunion Schedule ({schedule.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'past' ? 'border-[#631012] text-[#631012]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Award className="w-5 h-5" />
            Past Reunions ({pastMeets.length})
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
              activeTab === 'gallery' ? 'border-[#631012] text-[#631012]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            Photo Gallery ({gallery.length})
          </button>
        </div>
      </div>

      {/* Main Form Fields */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#631012] pl-2">Hero Welcome Banner</h2>
            <p className="text-gray-500 text-sm mt-1">Configure titles and descriptions for the page hero section.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title (English)</label>
              <input
                type="text"
                value={heading.title_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, title_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title (Hindi)</label>
              <input
                type="text"
                value={heading.title_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, title_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-title (English)</label>
              <textarea
                rows={3}
                value={heading.sub_title_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, sub_title_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-title (Hindi)</label>
              <textarea
                rows={3}
                value={heading.sub_title_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, sub_title_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#631012] pl-2">About Section Paragraphs</h2>
              <p className="text-gray-500 text-sm mt-1">Configure bilingually the three main about paragraphs describing NITH alumni meets.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Title (English)</label>
                <input
                  type="text"
                  value={heading.about_title_en || ''}
                  onChange={e => setHeading(prev => ({ ...prev, about_title_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Title (Hindi)</label>
                <input
                  type="text"
                  value={heading.about_title_hn || ''}
                  onChange={e => setHeading(prev => ({ ...prev, about_title_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
                />
              </div>

              {/* About descriptions */}
              {[1, 2, 3].map(num => (
                <div key={num} className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-150">
                  <div>
                    <label className="block text-xs font-bold text-[#631012] uppercase mb-2">Paragraph {num} (English)</label>
                    <textarea
                      rows={3}
                      value={(heading as any)[`about_desc${num}_en`] || ''}
                      onChange={e => setHeading(prev => ({ ...prev, [`about_desc${num}_en`]: e.target.value }))}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#631012] uppercase mb-2">Paragraph {num} (Hindi)</label>
                    <textarea
                      rows={3}
                      value={(heading as any)[`about_desc${num}_hn`] || ''}
                      onChange={e => setHeading(prev => ({ ...prev, [`about_desc${num}_hn`]: e.target.value }))}
                      className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'upcoming' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#631012] pl-2">Upcoming Reunion Details</h2>
            <p className="text-gray-500 text-sm mt-1">Configure bilingually descriptions, venues, timings, and registration toggle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title (English)</label>
              <input
                type="text"
                value={heading.upcoming_title_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, upcoming_title_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title (Hindi)</label>
              <input
                type="text"
                value={heading.upcoming_title_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, upcoming_title_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Theme (English)</label>
              <input
                type="text"
                value={heading.upcoming_theme_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, upcoming_theme_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Theme (Hindi)</label>
              <input
                type="text"
                value={heading.upcoming_theme_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, upcoming_theme_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date / Duration (English)</label>
              <input
                type="text"
                value={heading.upcoming_date_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, upcoming_date_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date / Duration (Hindi)</label>
              <input
                type="text"
                value={heading.upcoming_date_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, upcoming_date_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Venue (English)</label>
              <input
                type="text"
                value={heading.upcoming_venue_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, upcoming_venue_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Venue (Hindi)</label>
              <input
                type="text"
                value={heading.upcoming_venue_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, upcoming_venue_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description (English)</label>
              <textarea
                rows={3}
                value={heading.upcoming_desc_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, upcoming_desc_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Description (Hindi)</label>
              <textarea
                rows={3}
                value={heading.upcoming_desc_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, upcoming_desc_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Open</label>
              <select
                value={heading.upcoming_reg_open ? 'true' : 'false'}
                onChange={e => setHeading(prev => ({ ...prev, upcoming_reg_open: e.target.value === 'true' }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none bg-white focus:ring-2 focus:ring-[#631012]"
              >
                <option value="true">Open (Shows Register Button)</option>
                <option value="false">Closed / Tentative</option>
              </select>
            </div>

            <div className="md:col-span-2 border-t border-gray-150 pt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Event Promotional Image</label>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                {/* Image preview */}
                <div className="md:col-span-3 flex flex-col items-center gap-2">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center shadow-inner">
                    {heading.upcoming_image ? (
                      <img src={heading.upcoming_image} alt="Promotional Banner Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    )}
                    {uploadingUpcomingImage && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white">
                        Uploading...
                      </div>
                    )}
                  </div>
                  
                  <label className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs px-3 py-2 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer font-medium">
                    <Upload size={12} />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUpcomingImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct image input */}
                <div className="md:col-span-9 space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase">Image URL Link</label>
                  <input
                    type="text"
                    value={heading.upcoming_image || ''}
                    onChange={e => setHeading(prev => ({ ...prev, upcoming_image: e.target.value }))}
                    placeholder="e.g. http://localhost:9000/alumni-section/promo.jpg"
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2.5 outline-none text-xs focus:ring-2 focus:ring-[#631012]"
                  />
                  <p className="text-[10px] text-gray-400 font-medium">
                    Upload an upcoming reunion promotional banner here. It will display on the home card of the annual meet page.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#631012] pl-2">Office Contacts & Call To Action Blocks</h2>
              <p className="text-gray-500 text-sm mt-1">Configure bilingually active contact information, office email, phones, and addresses.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contacts Header (English)</label>
                <input
                  type="text"
                  value={heading.involve_title_en || ''}
                  onChange={e => setHeading(prev => ({ ...prev, involve_title_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contacts Header (Hindi)</label>
                <input
                  type="text"
                  value={heading.involve_title_hn || ''}
                  onChange={e => setHeading(prev => ({ ...prev, involve_title_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contacts Subtitle (English)</label>
                <input
                  type="text"
                  value={heading.involve_desc_en || ''}
                  onChange={e => setHeading(prev => ({ ...prev, involve_desc_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contacts Subtitle (Hindi)</label>
                <input
                  type="text"
                  value={heading.involve_desc_hn || ''}
                  onChange={e => setHeading(prev => ({ ...prev, involve_desc_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={heading.contact_email || ''}
                  onChange={e => setHeading(prev => ({ ...prev, contact_email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="text"
                  value={heading.contact_phone || ''}
                  onChange={e => setHeading(prev => ({ ...prev, contact_phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Alumni Office Address (English)</label>
                <textarea
                  rows={2}
                  value={heading.contact_address_en || ''}
                  onChange={e => setHeading(prev => ({ ...prev, contact_address_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Alumni Office Address (Hindi)</label>
                <textarea
                  rows={2}
                  value={heading.contact_address_hn || ''}
                  onChange={e => setHeading(prev => ({ ...prev, contact_address_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none"
                />
              </div>
              
              <div className="md:col-span-2 border-t border-gray-200 pt-6 space-y-4">
                <div className="font-bold text-gray-800 text-sm">Stay Connected Footer Panel</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Footer Block Title (English)</label>
                    <input
                      type="text"
                      value={heading.connected_title_en || ''}
                      onChange={e => setHeading(prev => ({ ...prev, connected_title_en: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Footer Block Title (Hindi)</label>
                    <input
                      type="text"
                      value={heading.connected_title_hn || ''}
                      onChange={e => setHeading(prev => ({ ...prev, connected_title_hn: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Footer Block Subtitle (English)</label>
                    <textarea
                      rows={2}
                      value={heading.connected_desc_en || ''}
                      onChange={e => setHeading(prev => ({ ...prev, connected_desc_en: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Footer Block Subtitle (Hindi)</label>
                    <textarea
                      rows={2}
                      value={heading.connected_desc_hn || ''}
                      onChange={e => setHeading(prev => ({ ...prev, connected_desc_hn: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Action Links Manager */}
              <div className="md:col-span-2 border-t border-gray-200 pt-6 space-y-4">
                <div className="font-bold text-gray-800 text-sm">Quick Action Links Manager</div>
                
                {/* Action 1: Register */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 space-y-3">
                  <div className="text-xs font-bold text-[#631012] uppercase">Quick Action 1 (Register for Annual Meet)</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Label (English)</label>
                      <input
                        type="text"
                        value={heading.link_register_label_en || ''}
                        onChange={e => setHeading(prev => ({ ...prev, link_register_label_en: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Label (Hindi)</label>
                      <input
                        type="text"
                        value={heading.link_register_label_hn || ''}
                        onChange={e => setHeading(prev => ({ ...prev, link_register_label_hn: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Destination URL</label>
                      <input
                        type="text"
                        value={heading.link_register_url || ''}
                        onChange={e => setHeading(prev => ({ ...prev, link_register_url: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Action 2: Network */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 space-y-3">
                  <div className="text-xs font-bold text-[#631012] uppercase">Quick Action 2 (Alumni Network)</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Label (English)</label>
                      <input
                        type="text"
                        value={heading.link_network_label_en || ''}
                        onChange={e => setHeading(prev => ({ ...prev, link_network_label_en: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Label (Hindi)</label>
                      <input
                        type="text"
                        value={heading.link_network_label_hn || ''}
                        onChange={e => setHeading(prev => ({ ...prev, link_network_label_hn: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Destination URL</label>
                      <input
                        type="text"
                        value={heading.link_network_url || ''}
                        onChange={e => setHeading(prev => ({ ...prev, link_network_url: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Action 3: Endowment */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 space-y-3">
                  <div className="text-xs font-bold text-[#631012] uppercase">Quick Action 3 (Support Endowment Fund)</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Label (English)</label>
                      <input
                        type="text"
                        value={heading.link_endowment_label_en || ''}
                        onChange={e => setHeading(prev => ({ ...prev, link_endowment_label_en: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Label (Hindi)</label>
                      <input
                        type="text"
                        value={heading.link_endowment_label_hn || ''}
                        onChange={e => setHeading(prev => ({ ...prev, link_endowment_label_hn: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Destination URL</label>
                      <input
                        type="text"
                        value={heading.link_endowment_url || ''}
                        onChange={e => setHeading(prev => ({ ...prev, link_endowment_url: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stay Connected Callout Buttons Manager */}
              <div className="md:col-span-2 border-t border-gray-200 pt-6 space-y-4">
                <div className="font-bold text-gray-800 text-sm">Stay Connected Callout Buttons Manager</div>
                
                {/* Button 1: Join Portal */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 space-y-3">
                  <div className="text-xs font-bold text-[#631012] uppercase">Call-To-Action Button 1 (Join Alumni Portal)</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Label (English)</label>
                      <input
                        type="text"
                        value={heading.btn_join_label_en || ''}
                        onChange={e => setHeading(prev => ({ ...prev, btn_join_label_en: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Label (Hindi)</label>
                      <input
                        type="text"
                        value={heading.btn_join_label_hn || ''}
                        onChange={e => setHeading(prev => ({ ...prev, btn_join_label_hn: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Destination URL</label>
                      <input
                        type="text"
                        value={heading.btn_join_url || ''}
                        onChange={e => setHeading(prev => ({ ...prev, btn_join_url: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Button 2: Subscribe */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 space-y-3">
                  <div className="text-xs font-bold text-[#631012] uppercase">Call-To-Action Button 2 (Subscribe to Newsletter)</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Label (English)</label>
                      <input
                        type="text"
                        value={heading.btn_sub_label_en || ''}
                        onChange={e => setHeading(prev => ({ ...prev, btn_sub_label_en: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Label (Hindi)</label>
                      <input
                        type="text"
                        value={heading.btn_sub_label_hn || ''}
                        onChange={e => setHeading(prev => ({ ...prev, btn_sub_label_hn: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Destination URL</label>
                      <input
                        type="text"
                        value={heading.btn_sub_url || ''}
                        onChange={e => setHeading(prev => ({ ...prev, btn_sub_url: e.target.value }))}
                        className="w-full border border-gray-300 bg-white rounded px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-[#631012] text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Interactive Live Preview Mockup */}
              <div className="border-t border-gray-200 pt-8 mt-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-2.5 h-6 bg-[#631012] rounded-full inline-block"></span>
                      Live Website Real-time Preview Mockup
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      Visual mockup of both English and Hindi versions updating instantly as you type.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-green-600 inline-block"></span>
                    Live Syncing
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-100 p-6 rounded-2xl border border-gray-200">
                  {/* English Live Preview */}
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">English Version Live Preview</div>
                    <div className="bg-gray-50 rounded-2xl p-6 shadow border border-gray-200 max-w-xl mx-auto space-y-6 font-sans">
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{heading.involve_title_en || 'Get Involved'}</h3>
                        <p className="text-gray-600 text-sm">{heading.involve_desc_en || 'Have questions or want to participate? Reach out to us'}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 space-y-4">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-8 h-8 bg-[#631012] rounded-full flex items-center justify-center text-white">
                              <Mail className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-gray-800 text-sm">Contact Info</span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div>
                              <div className="font-semibold text-gray-600">Email</div>
                              <a href={`mailto:${heading.contact_email}`} className="text-[#631012] hover:underline font-medium break-all">{heading.contact_email || 'alumni@nith.ac.in'}</a>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-600">Phone</div>
                              <p className="text-gray-600 font-medium">{heading.contact_phone || '+91-1972-254545'}</p>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-600">Alumni Relations Office</div>
                              <p className="text-gray-500 leading-relaxed">{heading.contact_address_en || 'Alumni Relations Office, NIT Hamirpur, Himachal Pradesh - 177005'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 space-y-3">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-8 h-8 bg-[#631012] rounded-full flex items-center justify-center text-white">
                              <Settings className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-gray-800 text-sm">Quick Actions</span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <a href={heading.link_register_url || '#'} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-[#631012] hover:text-white transition-all duration-200">
                              <span className="font-medium">{heading.link_register_label_en || 'Register for Annual Meet'}</span>
                              <span>➔</span>
                            </a>
                            <a href={heading.link_network_url || '#'} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-[#631012] hover:text-white transition-all duration-200">
                              <span className="font-medium">{heading.link_network_label_en || 'Alumni Network'}</span>
                              <span>➔</span>
                            </a>
                            <a href={heading.link_endowment_url || '#'} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-[#631012] hover:text-white transition-all duration-200">
                              <span className="font-medium">{heading.link_endowment_label_en || 'Support Endowment Fund'}</span>
                              <span>➔</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-[#631012] to-[#4a0c0e] rounded-xl p-5 text-center text-white shadow-md space-y-3">
                        <h4 className="font-bold text-base">{heading.connected_title_en || 'Stay Connected with NITH Alumni'}</h4>
                        <p className="text-gray-200 text-xs leading-relaxed max-w-md mx-auto">{heading.connected_desc_en || 'Join our vibrant alumni community and be part of a network that spans the globe.'}</p>
                        <div className="flex justify-center gap-3 pt-2">
                          <a href={heading.btn_join_url || '#'} className="px-4 py-1.5 bg-white text-[#631012] font-semibold text-xs rounded-md shadow hover:bg-gray-100 transition-all">{heading.btn_join_label_en || 'Join Alumni Portal'}</a>
                          <a href={heading.btn_sub_url || '#'} className="px-4 py-1.5 bg-white/10 text-white font-semibold text-xs rounded-md border border-white/20 hover:bg-white/20 transition-all">{heading.btn_sub_label_en || 'Subscribe to Newsletter'}</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hindi Live Preview */}
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Hindi Version Live Preview</div>
                    <div className="bg-gray-50 rounded-2xl p-6 shadow border border-gray-200 max-w-xl mx-auto space-y-6 font-sans">
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{heading.involve_title_hn || 'शामिल हों'}</h3>
                        <p className="text-gray-600 text-sm">{heading.involve_desc_hn || 'प्रश्न हैं या भाग लेना चाहते हैं? हमसे संपर्क करें'}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 space-y-4">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-8 h-8 bg-[#631012] rounded-full flex items-center justify-center text-white">
                              <Mail className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-gray-800 text-sm">संपर्क जानकारी</span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <div>
                              <div className="font-semibold text-gray-600">ईमेल</div>
                              <a href={`mailto:${heading.contact_email}`} className="text-[#631012] hover:underline font-medium break-all">{heading.contact_email || 'alumni@nith.ac.in'}</a>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-600">फ़ोन</div>
                              <p className="text-gray-600 font-medium">{heading.contact_phone || '+91-1972-254545'}</p>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-600">कार्यालय पता</div>
                              <p className="text-gray-500 leading-relaxed">{heading.contact_address_hn || 'पूर्व छात्र संबंध कार्यालय, एनआईटी हमीरपुर, हिमाचल प्रदेश - 177005'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 space-y-3">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-8 h-8 bg-[#631012] rounded-full flex items-center justify-center text-white">
                              <Settings className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-gray-800 text-sm">त्वरित लिंक</span>
                          </div>
                          <div className="space-y-2 text-xs">
                            <a href={heading.link_register_url || '#'} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-[#631012] hover:text-white transition-all duration-200">
                              <span className="font-medium">{heading.link_register_label_hn || 'वार्षिक बैठक के लिए पंजीकरण करें'}</span>
                              <span>➔</span>
                            </a>
                            <a href={heading.link_network_url || '#'} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-[#631012] hover:text-white transition-all duration-200">
                              <span className="font-medium">{heading.link_network_label_hn || 'पूर्व छात्र नेटवर्क'}</span>
                              <span>➔</span>
                            </a>
                            <a href={heading.link_endowment_url || '#'} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-[#631012] hover:text-white transition-all duration-200">
                              <span className="font-medium">{heading.link_endowment_label_hn || 'अक्षय निधि का समर्थन करें'}</span>
                              <span>➔</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-[#631012] to-[#4a0c0e] rounded-xl p-5 text-center text-white shadow-md space-y-3">
                        <h4 className="font-bold text-base">{heading.connected_title_hn || 'एनआईटीएच पूर्व छात्रों के साथ जुड़े रहें'}</h4>
                        <p className="text-gray-200 text-xs leading-relaxed max-w-md mx-auto">{heading.connected_desc_hn || 'हमारे जीवंत पूर्व छात्र समुदाय में शामिल हों और दुनिया भर में फैले नेटवर्क का हिस्सा बनें।'}</p>
                        <div className="flex justify-center gap-3 pt-2">
                          <a href={heading.btn_join_url || '#'} className="px-4 py-1.5 bg-white text-[#631012] font-semibold text-xs rounded-md shadow hover:bg-gray-100 transition-all">{heading.btn_join_label_hn || 'पूर्व छात्र पोर्टल में शामिल हों'}</a>
                          <a href={heading.btn_sub_url || '#'} className="px-4 py-1.5 bg-white/10 text-white font-semibold text-xs rounded-md border border-white/20 hover:bg-white/20 transition-all">{heading.btn_sub_label_hn || 'समाचार पत्र की सदस्यता लें'}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-gray-150 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#631012] pl-2">Event Schedule Timeline</h2>
              <p className="text-gray-500 text-sm">Add, remove, and sort schedule items bilingually.</p>
            </div>
            <button
              onClick={handleAddSchedule}
              className="flex items-center gap-2 px-4 py-2 bg-[#631012] text-white rounded-lg hover:bg-[#4d0c0e] text-sm font-semibold transition-all shadow"
            >
              <Plus className="w-4 h-4" />
              Add Schedule Item
            </button>
          </div>

          <div className="space-y-6">
            {schedule.length === 0 ? (
              <div className="py-12 text-center text-gray-400 font-medium border border-dashed border-gray-200 rounded-xl">
                No schedule slots defined yet. Click "Add Schedule Item" to build a timeline.
              </div>
            ) : (
              schedule.map((item, idx) => (
                <div key={item.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200 relative space-y-4">
                  <button
                    onClick={() => handleRemoveSchedule(item.id)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Slot"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="bg-[#631012] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Timeline Slot #{idx + 1}
                    </span>
                    {item.id > 1000000000 && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                        New / Unsaved
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time Slot (English)</label>
                      <input
                        type="text"
                        value={item.time_en}
                        onChange={e => handleUpdateScheduleField(item.id, 'time_en', e.target.value)}
                        placeholder="e.g. 09:00 AM - 10:00 AM"
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time Slot (Hindi)</label>
                      <input
                        type="text"
                        value={item.time_hn}
                        onChange={e => handleUpdateScheduleField(item.id, 'time_hn', e.target.value)}
                        placeholder="जैसे 09:00 AM - 10:00 AM"
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Activity Name (English)</label>
                      <input
                        type="text"
                        value={item.activity_en}
                        onChange={e => handleUpdateScheduleField(item.id, 'activity_en', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Activity Name (Hindi)</label>
                      <input
                        type="text"
                        value={item.activity_hn}
                        onChange={e => handleUpdateScheduleField(item.id, 'activity_hn', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Venue Location (English)</label>
                      <input
                        type="text"
                        value={item.venue_en}
                        onChange={e => handleUpdateScheduleField(item.id, 'venue_en', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Venue Location (Hindi)</label>
                      <input
                        type="text"
                        value={item.venue_hn}
                        onChange={e => handleUpdateScheduleField(item.id, 'venue_hn', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Speaker / Host (English)</label>
                      <input
                        type="text"
                        value={item.speaker_en}
                        onChange={e => handleUpdateScheduleField(item.id, 'speaker_en', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Speaker / Host (Hindi)</label>
                      <input
                        type="text"
                        value={item.speaker_hn}
                        onChange={e => handleUpdateScheduleField(item.id, 'speaker_hn', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'past' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-gray-150 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#631012] pl-2">Past Reunions History</h2>
              <p className="text-gray-500 text-sm">Add and bilingually configure past meet themes, years, stats, and gallery lists.</p>
            </div>
            <button
              onClick={handleAddPastMeet}
              className="flex items-center gap-2 px-4 py-2 bg-[#631012] text-white rounded-lg hover:bg-[#4d0c0e] text-sm font-semibold transition-all shadow"
            >
              <Plus className="w-4 h-4" />
              Add Past Reunion
            </button>
          </div>

          <div className="space-y-6">
            {pastMeets.length === 0 ? (
              <div className="py-12 text-center text-gray-400 font-medium border border-dashed border-gray-200 rounded-xl">
                No past meets records defined yet. Click "Add Past Reunion" to record histories.
              </div>
            ) : (
              pastMeets.map((item, idx) => (
                <div key={item.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200 relative space-y-4">
                  <button
                    onClick={() => handleRemovePastMeet(item.id)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Meet"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="bg-[#631012] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Reunion #{idx + 1}
                    </span>
                    {item.id > 1000000000 && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                        New / Unsaved
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reunion Year</label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={e => handleUpdatePastMeetField(item.id, 'year', e.target.value)}
                        placeholder="e.g. 2024"
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Attendees count</label>
                      <input
                        type="number"
                        value={item.attendees}
                        onChange={e => handleUpdatePastMeetField(item.id, 'attendees', Number(e.target.value))}
                        placeholder="e.g. 850"
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Theme (English)</label>
                      <input
                        type="text"
                        value={item.theme_en}
                        onChange={e => handleUpdatePastMeetField(item.id, 'theme_en', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Theme (Hindi)</label>
                      <input
                        type="text"
                        value={item.theme_hn}
                        onChange={e => handleUpdatePastMeetField(item.id, 'theme_hn', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date Duration (English)</label>
                      <input
                        type="text"
                        value={item.date_en}
                        onChange={e => handleUpdatePastMeetField(item.id, 'date_en', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date Duration (Hindi)</label>
                      <input
                        type="text"
                        value={item.date_hn}
                        onChange={e => handleUpdatePastMeetField(item.id, 'date_hn', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Highlights (English)</label>
                      <textarea
                        rows={2}
                        value={item.highlights_en}
                        onChange={e => handleUpdatePastMeetField(item.id, 'highlights_en', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Highlights (Hindi)</label>
                      <textarea
                        rows={2}
                        value={item.highlights_hn}
                        onChange={e => handleUpdatePastMeetField(item.id, 'highlights_hn', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gallery Images Manager</label>
                        <p className="text-xs text-gray-400 mb-2">Upload images to the reunion gallery or edit direct image links.</p>
                      </div>

                      {/* Visual Grid of Attached Images */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {item.images && item.images.split(',').map(s => s.trim()).filter(Boolean).map((imgUrl, i) => (
                          <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-white group shadow-sm">
                            <img src={imgUrl} alt={`Thumbnail ${i+1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImageFromPastMeet(item.id, imgUrl)}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md hover:scale-110 transition-all text-[10px] w-5 h-5 flex items-center justify-center font-bold"
                              title="Remove image"
                            >
                              ✕
                            </button>
                          </div>
                        ))}

                        {/* Upload trigger card */}
                        <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-[#631012] hover:bg-gray-50 transition-colors p-2 text-center text-xs font-medium text-gray-500">
                          {uploadingPastIds[item.id] ? (
                            <span className="text-[10px] text-[#631012] animate-pulse">Uploading...</span>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-gray-400 mb-1" />
                              <span>Upload Photo</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handlePhotoUploadForPastMeet(e, item.id)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Legacy URL Textarea for advanced overrides */}
                      <div>
                        <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Raw Comma-separated Image URLs (Advanced)</label>
                        <textarea
                          rows={2}
                          value={item.images}
                          onChange={e => handleUpdatePastMeetField(item.id, 'images', e.target.value)}
                          placeholder="e.g. http://url1.jpg,http://url2.jpg"
                          className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-gray-150 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 border-l-4 border-[#631012] pl-2">Reunion Gallery Images</h2>
              <p className="text-gray-500 text-sm">Add, remove, and configure images displaying in the portal gallery bilingually.</p>
            </div>
            <button
              onClick={handleAddGallery}
              className="flex items-center gap-2 px-4 py-2 bg-[#631012] text-white rounded-lg hover:bg-[#4d0c0e] text-sm font-semibold transition-all shadow"
            >
              <Plus className="w-4 h-4" />
              Add Photo Card
            </button>
          </div>

          <div className="space-y-6">
            {gallery.length === 0 ? (
              <div className="py-12 text-center text-gray-400 font-medium border border-dashed border-gray-200 rounded-xl">
                No gallery images defined yet. Click "Add Photo Card" to upload reunion moments.
              </div>
            ) : (
              gallery.map((item, idx) => (
                <div key={item.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200 relative space-y-4">
                  <button
                    onClick={() => handleRemoveGallery(item.id)}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete Image"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="bg-[#631012] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Photo Card #{idx + 1}
                    </span>
                    {item.id > 1000000000 && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                        New / Unsaved
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 rounded-xl border border-gray-200">
                      {/* Photo preview container */}
                      <div className="md:col-span-3 flex flex-col items-center gap-2">
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center shadow-inner">
                          {item.url ? (
                            <img src={item.url} alt="Gallery Preview" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-gray-300" />
                          )}
                          {uploadingGalleryIds[item.id] && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-white">
                              Uploading...
                            </div>
                          )}
                        </div>

                        <label className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs px-3 py-2 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer font-medium">
                          <Upload size={12} />
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handlePhotoUploadForGallery(e, item.id)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Manual Image URL text input */}
                      <div className="md:col-span-9 space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">Image Destination URL</label>
                        <input
                          type="text"
                          value={item.url}
                          onChange={e => handleUpdateGalleryField(item.id, 'url', e.target.value)}
                          placeholder="e.g. http://localhost:9000/alumni-section/image.jpg"
                          className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none text-xs focus:ring-2 focus:ring-[#631012]"
                        />
                        <p className="text-[10px] text-gray-400 font-medium">
                          Upload an image using the button, or paste an external URL directly in the input box above.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year Tag</label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={e => handleUpdateGalleryField(item.id, 'year', e.target.value)}
                        placeholder="e.g. 2024"
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Caption (English)</label>
                      <input
                        type="text"
                        value={item.caption_en}
                        onChange={e => handleUpdateGalleryField(item.id, 'caption_en', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Caption (Hindi)</label>
                      <input
                        type="text"
                        value={item.caption_hn}
                        onChange={e => handleUpdateGalleryField(item.id, 'caption_hn', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Sticky Bottom Actions Bar */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between">
        <div className="text-gray-500 text-sm font-medium hidden sm:block">
          Make sure to click save to sync all changes dynamically!
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-[#631012] text-white rounded-lg hover:bg-[#4d0c0e] text-base font-bold transition-all disabled:bg-gray-400 shadow-md ml-auto"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </div> */}
    </div>
  );
}
