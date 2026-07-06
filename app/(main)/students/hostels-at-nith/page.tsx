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
  Home,
  Image as ImageIcon,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface HostelHeading {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  warden_contacts_en: string;
  warden_contacts_hn: string;
  mess_timings_en: string;
  mess_timings_hn: string;
  rules_url: string;
  maintenance_url: string;
  emergency_url: string;
}

interface HostelItem {
  id: number;
  key_name: string;
  title_en: string;
  title_hn: string;
  description_en: string;
  description_hn: string;
  photo_url: string;
  features_en: string;
  features_hn: string;
}

type TabType = 'headers' | 'hostels';

export default function HostelsAtNITHPage() {
  const [activeTab, setActiveTab] = useState<TabType>('headers');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const DEFAULT_HEADING: HostelHeading = {
    title_en: 'NITH Hostels',
    title_hn: 'एनआईटीएच छात्रावास',
    sub_title_en: 'Hostel accommodation, contact points and brief descriptions for each hall of residence.',
    sub_title_hn: 'संस्थान के प्रत्येक छात्रावास के लिए आवास, संपर्क सूत्र और संक्षिप्त विवरण।',
    warden_contacts_en: 'Contact your hostel warden via the Student Office for emergencies and maintenance requests.',
    warden_contacts_hn: 'आपात स्थिति और रखरखाव अनुरोधों के लिए छात्र कार्यालय के माध्यम से अपने छात्रावास वार्डन से संपर्क करें।',
    mess_timings_en: 'Breakfast: 7:30 - 9:00\nLunch: 12:30 - 2:00\nDinner: 8:00 - 9:30',
    mess_timings_hn: 'नाश्ता: 7:30 - 9:00\nदोपहर का भोजन: 12:30 - 2:00\nरात का खाना: 8:00 - 9:30',
    rules_url: '/about/connectivity',
    maintenance_url: '/student/hostels-at-nith',
    emergency_url: '/student/ncc'
  };

  const DEFAULT_HOSTELS = [
    {
      key_name: 'introduction',
      title_en: 'Introduction',
      title_hn: 'परिचय',
      description_en: 'NITH provides comfortable hostel accommodation to students with separate hostels for boys and girls. The hostels are supervised by wardens and supported by dedicated staff to ensure safety, hygiene, and a supportive residential environment.',
      description_hn: 'एनआईटीएच लड़कों और लड़कियों के अलग-अलग छात्रावासों के साथ छात्रों को आरामदायक आवास प्रदान करता है। सुरक्षा, स्वच्छता और सहायक वातावरण के लिए समर्पित स्टाफ और वार्डन नियुक्त हैं।',
      photo_url: '#',
      features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
      features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
    },
    {
      key_name: 'kailash',
      title_en: 'Kailash Boys Hostel',
      title_hn: 'कैलाश बॉयज हॉस्टल',
      description_en: 'Kailash Boys Hostel houses students across multiple batches with common study areas, recreation room and 24x7 security. Facility includes Wi-Fi, mess and sports access.',
      description_hn: 'कैलाश बॉयज़ हॉस्टल में कई बैचों के छात्र रहते हैं, यहाँ सामान्य अध्ययन क्षेत्र, मनोरंजन कक्ष और 24x7 सुरक्षा है। वाई-फाई, मेस और खेल सुविधाएं उपलब्ध हैं।',
      photo_url: '#',
      features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
      features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
    },
    {
      key_name: 'himgiri',
      title_en: 'Himgiri Boys Hostel',
      title_hn: 'हिमगिरी बॉयज हॉस्टल',
      description_en: 'Himgiri is known for its quiet study zones and proximity to academic blocks. Hostellers have access to mess facilities and indoor games.',
      description_hn: 'हिमगिरी अपने शांत अध्ययन क्षेत्रों और शैक्षणिक ब्लॉक से निकटता के लिए जाना जाता है। मेस सुविधाओं और इनडोर खेलों तक पहुंच उपलब्ध है।',
      photo_url: '#',
      features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
      features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
    },
    {
      key_name: 'udaygiri',
      title_en: 'Udaygiri Boys Hostel',
      title_hn: 'उदयगिरी बॉयज हॉस्टल',
      description_en: 'Udaygiri offers well-ventilated rooms and student common rooms. Regular maintenance and housekeeping are provided.',
      description_hn: 'उदयगिरी हवादार कमरे और छात्र कॉमन रूम प्रदान करता है। नियमित रखरखाव और हाउसकीपिंग प्रदान की जाती है।',
      photo_url: '#',
      features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
      features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
    },
    {
      key_name: 'neelkanth',
      title_en: 'Neelkanth Boys Hostel',
      title_hn: 'नीलकंठ बॉयज हॉस्टल',
      description_en: 'Neelkanth has modern amenities, prepared for senior students and research scholars with dedicated study lounges.',
      description_hn: 'नीलकंठ में आधुनिक सुविधाएं हैं, जो वरिष्ठ छात्रों और शोध विद्वानों के लिए समर्पित अध्ययन लाउंज के साथ तैयार हैं।',
      photo_url: '#',
      features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
      features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
    },
    {
      key_name: 'dhauladhar',
      title_en: 'Dhauladhar Boys Hostel',
      title_hn: 'धौलाधार बॉयज हॉस्टल',
      description_en: 'Dhauladhar emphasizes community activities and sports; it includes outdoor play areas and common recreation.',
      description_hn: 'धौलाधार सामुदायिक गतिविधियों और खेलों पर जोर देता है; इसमें आउटडोर खेल क्षेत्र और सामान्य मनोरंजन शामिल हैं।',
      photo_url: '#',
      features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
      features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
    },
    {
      key_name: 'vindhyachal',
      title_en: 'Vindhyachal Boys Hostel',
      title_hn: 'विंध्याचल बॉयज हॉस्टल',
      description_en: 'Vindhyachal provides comfortable accommodation with easy access to central facilities and libraries.',
      description_hn: 'विंध्याचल केंद्रीय सुविधाओं और पुस्तकालयों तक आसान पहुंच के साथ आरामदायक आवास प्रदान करता है।',
      photo_url: '#',
      features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
      features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
    },
    {
      key_name: 'shivalik',
      title_en: 'Shivalik Boys Hostel',
      title_hn: 'शिवालिक बॉयज हॉस्टल',
      description_en: 'Shivalik is one of the larger hostels with spacious common areas and frequent cultural events.',
      description_hn: 'शिवालिक विशाल सामान्य क्षेत्रों और लगातार सांस्कृतिक कार्यक्रमों के साथ बड़े छात्रावासों में से एक है।',
      photo_url: '#',
      features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
      features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
    },
    {
      key_name: 'ambika',
      title_en: 'Ambika Girls Hostel',
      title_hn: 'अंबिका गर्ल्स हॉस्टल',
      description_en: 'Ambika Girls Hostel ensures a secure environment with female wardens and dedicated medical liaison.',
      description_hn: 'अंबिका गर्ल्स हॉस्टल महिला वार्डन और समर्पित चिकित्सा संपर्क के साथ एक सुरक्षित वातावरण सुनिश्चित करता है।',
      photo_url: '#',
      features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
      features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
    },
    {
      key_name: 'parvati',
      title_en: 'Parvati Girls Hostel',
      title_hn: 'पार्वती गर्ल्स हॉस्टल',
      description_en: 'Parvati offers a balanced residential life with study rooms and an active student committee.',
      description_hn: 'पार्वती अध्ययन कक्ष और एक सक्रिय छात्र समिति के साथ एक संतुलित आवासीय जीवन प्रदान करती है।',
      photo_url: '#',
      features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
      features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
    },
    {
      key_name: 'mani-mahesh',
      title_en: 'Mani-Mahesh Girls Hostel',
      title_hn: 'मणि-महेश गर्ल्स हॉस्टल',
      description_en: 'Mani-Mahesh supports new entrants and emphasizes orientation, welfare and mentorship.',
      description_hn: 'मणि-महेश नए प्रवेशकों का समर्थन करता है और ओरिएंटेशन, कल्याण और परामर्श पर जोर देता है।',
      photo_url: '#',
      features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
      features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
    },
    {
      key_name: 'aravali',
      title_en: 'Aravali Girls Hostel',
      title_hn: 'अरावली गर्ल्स हॉस्टल',
      description_en: 'Aravali provides comfortable living with proximity to sports and cultural centers.',
      description_hn: 'अरावली खेल और सांस्कृतिक केंद्रों के निकट आरामदायक जीवन प्रदान करती है।',
      photo_url: '#',
      features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
      features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
    },
    {
      key_name: 'satpura',
      title_en: 'Satpura Hostel',
      title_hn: 'सतपुड़ा हॉस्टल',
      description_en: 'Satpura hosts students with accessible facilities and a responsive warden team.',
      description_hn: 'सतपुड़ा सुलभ सुविधाओं और एक उत्तरदायी वार्डन टीम के साथ छात्रों की मेजबानी करता है।',
      photo_url: '#',
      features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
      features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
    }
  ];

  const [headingData, setHeadingData] = useState<HostelHeading>({ ...DEFAULT_HEADING });
  const [hostels, setHostels] = useState<HostelItem[]>([]);

  // CRUD states for Hostels
  const [newHostel, setNewHostel] = useState({
    key_name: '',
    title_en: '',
    title_hn: '',
    description_en: '',
    description_hn: '',
    photo_url: '#',
    features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
    features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({
    key_name: '',
    title_en: '',
    title_hn: '',
    description_en: '',
    description_hn: '',
    photo_url: '',
    features_en: '',
    features_hn: ''
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Heading
      const headRes = await fetch(`${API_URL}/api/student-hostels-at-nith`);
      if (headRes.ok) {
        const hData = await headRes.json();
        if (hData && Object.keys(hData).length > 0) {
          setHeadingData({
            title_en: hData.title_en || DEFAULT_HEADING.title_en,
            title_hn: hData.title_hn || DEFAULT_HEADING.title_hn,
            sub_title_en: hData.sub_title_en || DEFAULT_HEADING.sub_title_en,
            sub_title_hn: hData.sub_title_hn || DEFAULT_HEADING.sub_title_hn,
            warden_contacts_en: hData.warden_contacts_en || DEFAULT_HEADING.warden_contacts_en,
            warden_contacts_hn: hData.warden_contacts_hn || DEFAULT_HEADING.warden_contacts_hn,
            mess_timings_en: hData.mess_timings_en || DEFAULT_HEADING.mess_timings_en,
            mess_timings_hn: hData.mess_timings_hn || DEFAULT_HEADING.mess_timings_hn,
            rules_url: hData.rules_url || DEFAULT_HEADING.rules_url,
            maintenance_url: hData.maintenance_url || DEFAULT_HEADING.maintenance_url,
            emergency_url: hData.emergency_url || DEFAULT_HEADING.emergency_url
          });
        } else {
          // Seed heading
          await fetch(`${API_URL}/api/student-hostels-at-nith`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(DEFAULT_HEADING),
          });
        }
      }

      // Fetch Hostels list
      const listRes = await fetch(`${API_URL}/api/student-hostels-at-nith/list`);
      if (listRes.ok) {
        const lData = await listRes.json();
        if (lData.length === 0) {
          // Seed hostels
          for (const item of DEFAULT_HOSTELS) {
            await fetch(`${API_URL}/api/student-hostels-at-nith/list`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item),
            });
          }
          const listRes2 = await fetch(`${API_URL}/api/student-hostels-at-nith/list`);
          setHostels(await listRes2.json());
        } else {
          setHostels(lData);
        }
      }
    } catch (err: any) {
      console.error('Error fetching hostels data:', err);
      setError('Failed to fetch data from backend. Verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePageSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/student-hostels-at-nith`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(headingData),
      });

      if (!res.ok) throw new Error('Failed to update headings');
      const updated = await res.json();
      setHeadingData(updated);
      alert('Hostel banner and quick info widget settings updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Error saving settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- CRUD Actions ---
  const handleAddHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHostel.key_name.trim() || !newHostel.title_en.trim() || !newHostel.title_hn.trim()) {
      alert('Key Name and Bilingual Titles are required.');
      return;
    }
    const formattedKey = newHostel.key_name.trim().toLowerCase().replace(/\s+/g, '-');
    try {
      const res = await fetch(`${API_URL}/api/student-hostels-at-nith/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newHostel, key_name: formattedKey }),
      });
      if (!res.ok) throw new Error('Failed to add hostel');
      const saved = await res.json();
      setHostels([...hostels, saved]);
      setNewHostel({
        key_name: '',
        title_en: '',
        title_hn: '',
        description_en: '',
        description_hn: '',
        photo_url: '#',
        features_en: 'Mess facilities available\nCommon study areas\n24x7 security',
        features_hn: 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
      });
      alert('Hostel profile created successfully!');
    } catch (err: any) {
      alert('Error creating hostel profile: ' + err.message);
    }
  };

  const handleStartEdit = (item: HostelItem) => {
    setEditingId(item.id);
    setEditingData({
      key_name: item.key_name,
      title_en: item.title_en,
      title_hn: item.title_hn,
      description_en: item.description_en,
      description_hn: item.description_hn,
      photo_url: item.photo_url,
      features_en: item.features_en,
      features_hn: item.features_hn
    });
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingData.title_en.trim() || !editingData.title_hn.trim()) {
      alert('Bilingual Titles are required.');
      return;
    }
    const formattedKey = editingData.key_name.trim().toLowerCase().replace(/\s+/g, '-');
    try {
      const res = await fetch(`${API_URL}/api/student-hostels-at-nith/list/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingData, key_name: formattedKey }),
      });
      if (!res.ok) throw new Error('Failed to update hostel');
      const updated = await res.json();
      setHostels(hostels.map(h => h.id === id ? updated : h));
      setEditingId(null);
      alert('Hostel updated successfully!');
    } catch (err: any) {
      alert('Error updating hostel: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hostel?')) return;
    try {
      await fetch(`${API_URL}/api/student-hostels-at-nith/list/${id}`, { method: 'DELETE' });
      setHostels(hostels.filter(h => h.id !== id));
      alert('Deleted successfully.');
    } catch (err: any) {
      alert('Error deleting hostel: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader className="w-10 h-10 text-[#631012] animate-spin" />
        <p className="text-gray-500 font-medium">Loading Hostels Editor Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Editor Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-xl text-[#631012]">
              <Home className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                NITH Hostels Editor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Customize the hostels list, descriptions, bullet features list, and the Quick Info widget dynamic mappings.
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
            Save Page Mappings
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
        <button
          onClick={() => setActiveTab('headers')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'headers'
              ? 'border-[#631012] text-[#631012] bg-[#631012]/5 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FileText size={18} />
          Banner Headers & Quick Info Widgets
        </button>
        <button
          onClick={() => setActiveTab('hostels')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'hostels'
              ? 'border-[#631012] text-[#631012] bg-[#631012]/5 rounded-t-lg'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <List size={18} />
          Manage Hostels & Features
        </button>
      </div>

      {/* Contents */}
      <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 min-h-[400px]">
        {activeTab === 'headers' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English Banner Details */}
              <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#631012]"></span>
                  English Banner Details
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Page Title (EN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.title_en || ''}
                    onChange={(e) => setHeadingData({ ...headingData, title_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Banner Description / Subtitle (EN)</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.sub_title_en || ''}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_en: e.target.value })}
                  />
                </div>
              </div>

              {/* Hindi Banner Details */}
              <div className="space-y-4 bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Hindi Banner Details
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">पृष्ठ शीर्षक (HN)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.title_hn || ''}
                    onChange={(e) => setHeadingData({ ...headingData, title_hn: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">बैनर विवरण / उपशीर्षक (HN)</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={headingData.sub_title_hn || ''}
                    onChange={(e) => setHeadingData({ ...headingData, sub_title_hn: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Quick Info Dynamic Mappings */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
                <Info size={20} className="text-[#631012]" />
                Right Aside Quick Info Widgets
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Warden contacts bilingual */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-800">1. Warden & Contacts Widget Description</h4>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description (EN)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#631012]"
                      value={headingData.warden_contacts_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, warden_contacts_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">विवरण (HN)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#631012]"
                      value={headingData.warden_contacts_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, warden_contacts_hn: e.target.value })}
                    />
                  </div>
                </div>

                {/* Mess timings bilingual */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-gray-800">2. Mess Timings Details (use newlines)</h4>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Timings (EN)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#631012]"
                      value={headingData.mess_timings_en || ''}
                      onChange={(e) => setHeadingData({ ...headingData, mess_timings_en: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">समय (HN)</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#631012]"
                      value={headingData.mess_timings_hn || ''}
                      onChange={(e) => setHeadingData({ ...headingData, mess_timings_hn: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Link URLs */}
              <div className="border-t pt-4 space-y-4">
                <h4 className="text-sm font-bold text-gray-800">3. Quick Links URLs</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Hostel Rules Link</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#631012]"
                      value={headingData.rules_url || ''}
                      onChange={(e) => setHeadingData({ ...headingData, rules_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Apply for Maintenance Link</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#631012]"
                      value={headingData.maintenance_url || ''}
                      onChange={(e) => setHeadingData({ ...headingData, maintenance_url: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Emergency Contacts Link</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#631012]"
                      value={headingData.emergency_url || ''}
                      onChange={(e) => setHeadingData({ ...headingData, emergency_url: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hostels' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">Halls of Residence</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {hostels.length} Active Profiles
              </span>
            </div>

            {/* Add Hostel Form */}
            <form onSubmit={handleAddHostel} className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
              <h4 className="text-sm font-extrabold text-[#631012] uppercase tracking-wider flex items-center gap-2">
                <Plus size={16} /> Establish a New Hostel Profile
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Unique Key Name (lowercased, no spaces)</label>
                  <input
                    type="text"
                    placeholder="e.g. himgiri or kailash"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newHostel.key_name}
                    onChange={(e) => setNewHostel({ ...newHostel, key_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Hostel Title (EN)</label>
                  <input
                    type="text"
                    placeholder="e.g. Himgiri Boys Hostel"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newHostel.title_en}
                    onChange={(e) => setNewHostel({ ...newHostel, title_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Hostel Title (HN)</label>
                  <input
                    type="text"
                    placeholder="e.g. हिमगिरी बॉयज हॉस्टल"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newHostel.title_hn}
                    onChange={(e) => setNewHostel({ ...newHostel, title_hn: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Brief Description (EN)</label>
                  <textarea
                    rows={3}
                    placeholder="Describe amenities and batches in English..."
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newHostel.description_en}
                    onChange={(e) => setNewHostel({ ...newHostel, description_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Brief Description (HN)</label>
                  <textarea
                    rows={3}
                    placeholder="छात्रावास विवरण हिंदी में..."
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newHostel.description_hn}
                    onChange={(e) => setNewHostel({ ...newHostel, description_hn: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Bullet Point Features (EN, use newlines)</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newHostel.features_en}
                    onChange={(e) => setNewHostel({ ...newHostel, features_en: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Bullet Point Features (HN, use newlines)</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                    value={newHostel.features_hn}
                    onChange={(e) => setNewHostel({ ...newHostel, features_hn: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Photo Image Link / URL</label>
                <input
                  type="text"
                  placeholder="#"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#631012]"
                  value={newHostel.photo_url}
                  onChange={(e) => setNewHostel({ ...newHostel, photo_url: e.target.value })}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 bg-[#631012] hover:bg-[#520d0f] active:scale-95 text-white font-semibold rounded-lg shadow-sm text-sm"
                >
                  <Plus className="w-4 h-4" /> Save Hostel Profile
                </button>
              </div>
            </form>

            {/* List Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full border-collapse table-auto text-left text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 font-semibold text-gray-700">Sl. No.</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Key Name</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Bilingual Titles</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Bilingual Descriptions</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Bilingual Features</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Photo Location</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {hostels.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-gray-500 font-medium">{idx + 1}</td>
                      <td className="px-4 py-4">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:border-[#631012]"
                            value={editingData.key_name}
                            onChange={(e) => setEditingData({ ...editingData, key_name: e.target.value })}
                          />
                        ) : (
                          <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded font-semibold text-xs">{item.key_name}</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {editingId === item.id ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:border-[#631012]"
                              value={editingData.title_en}
                              onChange={(e) => setEditingData({ ...editingData, title_en: e.target.value })}
                            />
                            <input
                              type="text"
                              className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:border-[#631012]"
                              value={editingData.title_hn}
                              onChange={(e) => setEditingData({ ...editingData, title_hn: e.target.value })}
                            />
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <p className="font-semibold text-gray-900">{item.title_en}</p>
                            <p className="text-xs text-gray-500">{item.title_hn}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 max-w-[200px]">
                        {editingId === item.id ? (
                          <div className="space-y-1">
                            <textarea
                              rows={2}
                              className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:border-[#631012]"
                              value={editingData.description_en}
                              onChange={(e) => setEditingData({ ...editingData, description_en: e.target.value })}
                            />
                            <textarea
                              rows={2}
                              className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:border-[#631012]"
                              value={editingData.description_hn}
                              onChange={(e) => setEditingData({ ...editingData, description_hn: e.target.value })}
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-gray-700 text-xs line-clamp-2">{item.description_en}</p>
                            <p className="text-gray-500 text-[10px] line-clamp-1 italic">{item.description_hn}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 max-w-[200px]">
                        {editingId === item.id ? (
                          <div className="space-y-1">
                            <textarea
                              rows={2}
                              className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:border-[#631012]"
                              value={editingData.features_en}
                              onChange={(e) => setEditingData({ ...editingData, features_en: e.target.value })}
                            />
                            <textarea
                              rows={2}
                              className="w-full px-2 py-1 border rounded text-xs focus:outline-none focus:border-[#631012]"
                              value={editingData.features_hn}
                              onChange={(e) => setEditingData({ ...editingData, features_hn: e.target.value })}
                            />
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-gray-700 text-xs line-clamp-2">{item.features_en?.split('\n').join(', ')}</p>
                            <p className="text-gray-500 text-[10px] line-clamp-1 italic">{item.features_hn?.split('\n').join(', ')}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            className="w-full px-2 py-1 border rounded text-sm focus:outline-none focus:border-[#631012]"
                            value={editingData.photo_url}
                            onChange={(e) => setEditingData({ ...editingData, photo_url: e.target.value })}
                          />
                        ) : (
                          <span className="text-xs text-gray-600 flex items-center gap-1.5">
                            <ImageIcon size={14} className="text-gray-400" /> {item.photo_url}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {editingId === item.id ? (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                              title="Save Profile"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                              title="Cancel Edit"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => handleStartEdit(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit Hostel"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Delete Profile"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {hostels.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-400 italic">
                        No hostel entries found. Reload to seed standard profiles.
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
