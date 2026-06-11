'use client';

import React, { useState, useEffect } from 'react';
import { Save, Search, Trash2, Eye, CheckCircle, XCircle, Settings, ClipboardList, Info } from 'lucide-react';

interface RegistrationData {
  id: number;
  full_name: string;
  roll_number: string;
  email: string;
  mobile: string;
  degree: string;
  department: string;
  passing_year: string;
  current_organization: string;
  designation: string;
  industry: string;
  current_city: string;
  current_country: string;
  areas_of_interest: string;
  willing_to_support: string;
  status: string;
  created_at: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  about_title_en: string;
  about_title_hn: string;
  about_sub_en: string;
  about_sub_hn: string;
  card1_title_en: string;
  card1_title_hn: string;
  card1_desc_en: string;
  card1_desc_hn: string;
  card2_title_en: string;
  card2_title_hn: string;
  card2_desc_en: string;
  card2_desc_hn: string;
  card3_title_en: string;
  card3_title_hn: string;
  card3_desc_en: string;
  card3_desc_hn: string;
  card4_title_en: string;
  card4_title_hn: string;
  card4_desc_en: string;
  card4_desc_hn: string;
  help_title_en: string;
  help_title_hn: string;
  help_desc_en: string;
  help_desc_hn: string;
  help_email: string;
  help_phone: string;
}

const INITIAL_HEADING: HeadingData = {
  title_en: 'Alumni Registration',
  title_hn: 'पूर्व छात्र पंजीकरण',
  sub_title_en: 'Join the official NIT Hamirpur Alumni Network. Stay connected, contribute to your alma mater, and be part of a thriving community of accomplished professionals.',
  sub_title_hn: 'आधिकारिक एनआईटी हमीरपुर पूर्व छात्र नेटवर्क में शामिल हों। जुड़े रहें, अपने अल्मा मेटर में योगदान दें, और कुशल पेशेवरों के एक समृद्ध समुदाय का हिस्सा बनें।',
  about_title_en: 'About Alumni Registration',
  about_title_hn: 'पूर्व छात्र पंजीकरण के बारे में',
  about_sub_en: 'Join thousands of NITH alumni worldwide. Registration takes only a few minutes and opens doors to lifelong connections and opportunities.',
  about_sub_hn: 'दुनिया भर में हजारों एनआईटीएच पूर्व छात्रों में शामिल हों। पंजीकरण में केवल कुछ मिनट लगते हैं और यह आजीवन संबंधों और अवसरों के द्वार खोलता है।',
  card1_title_en: 'Who Can Register',
  card1_title_hn: 'कौन पंजीकरण कर सकता है',
  card1_desc_en: 'All graduates of National Institute of Technology, Hamirpur, across all programs and batches. Whether you graduated decades ago or recently, we welcome you to join our alumni network.',
  card1_desc_hn: 'राष्ट्रीय प्रौद्योगिकी संस्थान, हमीरपुर के सभी स्नातक, सभी कार्यक्रमों और बैचों में। चाहे आप दशकों पहले स्नातक हुए हों या हाल ही में, हम पूर्व छात्र नेटवर्क में शामिल होने के लिए आपका स्वागत करते हैं।',
  card2_title_en: 'Purpose & Benefits',
  card2_title_hn: 'उद्देश्य और लाभ',
  card2_desc_en: 'Maintain an updated alumni database, facilitate networking opportunities, stay informed about institute developments, events, and initiatives. Connect with fellow alumni globally.',
  card2_desc_hn: 'एक अद्यतन पूर्व छात्र डेटाबेस बनाए रखें, नेटवर्किंग के अवसरों को सुगम बनाएं, संस्थान के विकास, कार्यक्रमों और पहलों के बारे में सूचित रहें। वैश्विक स्तर पर साथी पूर्व छात्रों के साथ जुड़ें।',
  card3_title_en: 'How We Use Your Data',
  card3_title_hn: 'हम आपके डेटा का उपयोग कैसे करते हैं',
  card3_desc_en: 'Your data is used solely for alumni engagement: event invitations, newsletters, mentorship programs, professional networking, and keeping you connected with your alma mater.',
  card3_desc_hn: 'आपके डेटा का उपयोग केवल पूर्व छात्र जुड़ाव के लिए किया जाता है: कार्यक्रम निमंत्रण, समाचार पत्र, परामर्श कार्यक्रम, पेशेवर नेटवर्किंग, और आपको अपने अल्मा मेटर से जोड़े रखना।',
  card4_title_en: 'Privacy & Security',
  card4_title_hn: 'गोपनीयता और सुरक्षा',
  card4_desc_en: 'We are committed to protecting your privacy. Your information will not be shared with third parties without consent and is stored securely in compliance with data protection regulations.',
  card4_desc_hn: 'हम आपकी गोपनीयता की रक्षा करने के लिए प्रतिबद्ध हैं। आपकी जानकारी सहमति के बिना तीसरे पक्षों के साथ साझा नहीं की जाएगी और डेटा सुरक्षा नियमों के अनुपालन में सुरक्षित रूप से संग्रहीत की जाती है।',
  help_title_en: 'Need Help?',
  help_title_hn: 'मदद की ज़रूरत है?',
  help_desc_en: 'If you encounter any issues during registration or have questions, please contact the Alumni Relations Office:',
  help_desc_hn: 'यदि आपको पंजीकरण के दौरान कोई समस्या आती है या आपके कोई प्रश्न हैं, तो कृपया पूर्व छात्र संबंध कार्यालय से संपर्क करें:',
  help_email: 'alumni@nith.ac.in',
  help_phone: '+91-1972-254802'
};

export default function AlumniRegistrationAdmin() {
  const [heading, setHeading] = useState<HeadingData>(INITIAL_HEADING);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [selectedReg, setSelectedReg] = useState<RegistrationData | null>(null);

  const [activeTab, setActiveTab] = useState<'hero' | 'list'>('list');
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // Fetch initial data
  const fetchData = async () => {
    try {
      // 1. Fetch Headings
      const hRes = await fetch('http://localhost:4000/api/alumni-registration');
      const hData = await hRes.json();
      if (hData && hData.title_en) {
        const merged = { ...INITIAL_HEADING };
        Object.keys(INITIAL_HEADING).forEach((key) => {
          const val = hData[key];
          if (val !== null && val !== undefined && val !== '') {
            (merged as any)[key] = val;
          }
        });
        setHeading(merged);
      }

      // 2. Fetch Registrations List
      const lRes = await fetch('http://localhost:4000/api/alumni-registration/list');
      const lData = await lRes.json();
      if (Array.isArray(lData)) {
        setRegistrations(lData);
      }
    } catch (err) {
      console.error('Fetch Alumni Registration data failed:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Headings
  const handleSaveHeading = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:4000/api/alumni-registration/heading', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heading)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Registration headings updated successfully!');
      } else {
        alert('Failed to update headings: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error updating headings settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Update registration status
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/alumni-registration/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setRegistrations(prev =>
          prev.map(reg => reg.id === id ? { ...reg, status: newStatus } : reg)
        );
        if (selectedReg && selectedReg.id === id) {
          setSelectedReg(prev => prev ? { ...prev, status: newStatus } : null);
        }
        alert(`Application marked as ${newStatus} successfully!`);
      } else {
        alert('Failed to update registration status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status');
    }
  };

  // Delete registration
  const handleDeleteRegistration = async (id: number) => {
    if (!confirm('Are you sure you want to delete this registration record? This action is irreversible.')) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:4000/api/alumni-registration/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setRegistrations(prev => prev.filter(reg => reg.id !== id));
        setSelectedReg(null);
        alert('Registration record deleted successfully!');
      } else {
        alert('Failed to delete registration record');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting registration record');
    }
  };

  // Filter lists
  const filteredRegs = registrations.filter(reg => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (reg.full_name || '').toLowerCase().includes(q) ||
      (reg.roll_number || '').toLowerCase().includes(q) ||
      (reg.email || '').toLowerCase().includes(q) ||
      (reg.current_organization || '').toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || reg.status === statusFilter;
    const matchesDept = deptFilter === 'All' || reg.department === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  // Extract unique departments for filtering
  const allDepartments = Array.from(
    new Set(registrations.map(reg => reg.department).filter(Boolean))
  );

  return (
    <div className="space-y-6 p-6">
      {/* Top Banner */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-8 h-8 text-[#631012]" />
              Alumni Registration Management
            </h1>
            <p className="text-gray-500 mt-1">
              Review and manage alumni registrations, verify credentials, and edit page headings.
            </p>
          </div>
          {activeTab === 'hero' && (
            <button
              onClick={handleSaveHeading}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#631012] text-white rounded-lg hover:bg-[#4d0c0e] font-semibold transition-all disabled:bg-gray-400"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Headings'}
            </button>
          )}
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 mt-6">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'list'
                ? 'border-[#631012] text-[#631012]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            Submitted Registrations ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'hero'
                ? 'border-[#631012] text-[#631012]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            Page Settings & Headings
          </button>
        </div>
      </div>

      {/* Main Tab Panels */}
      {activeTab === 'hero' ? (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Hero Section Heading</h2>
            <p className="text-gray-500 text-sm">Configure the main welcome banner text of the registration page.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title (English)</label>
              <input
                type="text"
                value={heading.title_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, title_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title (Hindi)</label>
              <input
                type="text"
                value={heading.title_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, title_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-title (English)</label>
              <textarea
                rows={3}
                value={heading.sub_title_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, sub_title_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-title (Hindi)</label>
              <textarea
                rows={3}
                value={heading.sub_title_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, sub_title_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">About Section Heading</h2>
            <p className="text-gray-500 text-sm mb-6 font-normal">Edit the text in the "About Alumni Registration" alert block.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Title (English)</label>
                <input
                  type="text"
                  value={heading.about_title_en || ''}
                  onChange={e => setHeading(prev => ({ ...prev, about_title_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Title (Hindi)</label>
                <input
                  type="text"
                  value={heading.about_title_hn || ''}
                  onChange={e => setHeading(prev => ({ ...prev, about_title_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Description (English)</label>
                <textarea
                  rows={2}
                  value={heading.about_sub_en || ''}
                  onChange={e => setHeading(prev => ({ ...prev, about_sub_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Description (Hindi)</label>
                <textarea
                  rows={2}
                  value={heading.about_sub_hn || ''}
                  onChange={e => setHeading(prev => ({ ...prev, about_sub_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Cards Heading Settings */}
          <div className="border-t border-gray-200 pt-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bilingual Cards Settings (4 Information Cards)</h2>

            {/* Card 1 */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-[#631012] mb-4">Card 1 Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={heading.card1_title_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card1_title_en: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title (Hindi)</label>
                  <input
                    type="text"
                    value={heading.card1_title_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card1_title_hn: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (English)</label>
                  <textarea
                    rows={2}
                    value={heading.card1_desc_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card1_desc_en: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (Hindi)</label>
                  <textarea
                    rows={2}
                    value={heading.card1_desc_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card1_desc_hn: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-[#631012] mb-4">Card 2 Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={heading.card2_title_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card2_title_en: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title (Hindi)</label>
                  <input
                    type="text"
                    value={heading.card2_title_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card2_title_hn: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (English)</label>
                  <textarea
                    rows={2}
                    value={heading.card2_desc_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card2_desc_en: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (Hindi)</label>
                  <textarea
                    rows={2}
                    value={heading.card2_desc_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card2_desc_hn: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-[#631012] mb-4">Card 3 Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={heading.card3_title_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card3_title_en: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title (Hindi)</label>
                  <input
                    type="text"
                    value={heading.card3_title_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card3_title_hn: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (English)</label>
                  <textarea
                    rows={2}
                    value={heading.card3_desc_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card3_desc_en: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (Hindi)</label>
                  <textarea
                    rows={2}
                    value={heading.card3_desc_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card3_desc_hn: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-[#631012] mb-4">Card 4 Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={heading.card4_title_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card4_title_en: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title (Hindi)</label>
                  <input
                    type="text"
                    value={heading.card4_title_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card4_title_hn: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (English)</label>
                  <textarea
                    rows={2}
                    value={heading.card4_desc_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card4_desc_en: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (Hindi)</label>
                  <textarea
                    rows={2}
                    value={heading.card4_desc_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, card4_desc_hn: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Help Card Settings */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-[#631012] mb-4">"Need Help?" Section Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Title (English)</label>
                  <input
                    type="text"
                    value={heading.help_title_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, help_title_en: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Title (Hindi)</label>
                  <input
                    type="text"
                    value={heading.help_title_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, help_title_hn: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Description (English)</label>
                  <textarea
                    rows={2}
                    value={heading.help_desc_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, help_desc_en: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Description (Hindi)</label>
                  <textarea
                    rows={2}
                    value={heading.help_desc_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, help_desc_hn: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Email</label>
                  <input
                    type="text"
                    value={heading.help_email || ''}
                    onChange={e => setHeading(prev => ({ ...prev, help_email: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={heading.help_phone || ''}
                    onChange={e => setHeading(prev => ({ ...prev, help_phone: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Live Real-time Preview Panel */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Live Real-time Website Preview</h2>
              <p className="text-gray-500 text-sm mb-6 font-normal">Below is a real-time preview of how the help card looks on the live Main Website (English and Hindi).</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* English Preview */}
                <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-200 px-2 py-1 rounded">English Version Preview</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <div className="bg-white rounded-xl shadow-xs p-5 md:p-6 border border-gray-150">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {heading.help_title_en || INITIAL_HEADING.help_title_en}
                    </h3>
                    <p className="text-gray-700 text-sm mb-4">
                      {heading.help_desc_en || INITIAL_HEADING.help_desc_en}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#631012]">Email:</span>
                        <span className="text-gray-600 truncate">{heading.help_email || INITIAL_HEADING.help_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#631012]">Phone:</span>
                        <span className="text-gray-600 truncate">{heading.help_phone || INITIAL_HEADING.help_phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hindi Preview */}
                <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-200 px-2 py-1 rounded">Hindi Version Preview</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <div className="bg-white rounded-xl shadow-xs p-5 md:p-6 border border-gray-150">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {heading.help_title_hn || INITIAL_HEADING.help_title_hn}
                    </h3>
                    <p className="text-gray-700 text-sm mb-4">
                      {heading.help_desc_hn || INITIAL_HEADING.help_desc_hn}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#631012]">ईमेल:</span>
                        <span className="text-gray-600 truncate">{heading.help_email || INITIAL_HEADING.help_email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#631012]">फोन:</span>
                        <span className="text-gray-600 truncate">{heading.help_phone || INITIAL_HEADING.help_phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Name, Roll, Org, Email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-[#631012]"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none bg-white focus:ring-2 focus:ring-[#631012]"
              >
                <option value="All">All Departments</option>
                {allDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Registrations List Grid */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Full Name</th>
                    <th className="py-4 px-6">Roll & Degree</th>
                    <th className="py-4 px-6">Email & Contact</th>
                    <th className="py-4 px-6">Passing Year</th>
                    <th className="py-4 px-6">Current Organization</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {filteredRegs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400 font-medium">
                        No registrations found matching the filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRegs.map(reg => (
                      <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs">{reg.id}</td>
                        <td className="py-4 px-6 font-semibold text-gray-900">{reg.full_name}</td>
                        <td className="py-4 px-6">
                          <span className="block font-medium">{reg.roll_number || 'N/A'}</span>
                          <span className="block text-xs text-gray-500">{reg.degree} - {reg.department}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="block">{reg.email}</span>
                          <span className="block text-xs text-gray-500">{reg.mobile}</span>
                        </td>
                        <td className="py-4 px-6">{reg.passing_year}</td>
                        <td className="py-4 px-6">
                          <span className="block font-medium">{reg.current_organization}</span>
                          <span className="block text-xs text-gray-500">{reg.designation} ({reg.industry})</span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              reg.status === 'Approved'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : reg.status === 'Rejected'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedReg(reg)}
                              title="View Full Profile Details"
                              className="p-2 text-[#631012] hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(reg.id, 'Approved')}
                              disabled={reg.status === 'Approved'}
                              title="Approve Member Application"
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <CheckCircle className="w-4.5 h-4.5" />
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(reg.id, 'Rejected')}
                              disabled={reg.status === 'Rejected'}
                              title="Reject Application"
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              <XCircle className="w-4.5 h-4.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteRegistration(reg.id)}
                              title="Delete Record"
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal View */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden transform transition-all duration-300">
            {/* Modal Header */}
            <div className="bg-[#631012] text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{selectedReg.full_name}</h3>
                <p className="text-xs text-red-100 mt-0.5">Submitted on: {new Date(selectedReg.created_at).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="text-white hover:text-red-200 font-semibold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Roll Number</span>
                  <span className="text-sm font-medium text-gray-800">{selectedReg.roll_number || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Degree / Program</span>
                  <span className="text-sm font-medium text-gray-800">{selectedReg.degree}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Academic Department</span>
                  <span className="text-sm font-medium text-gray-800">{selectedReg.department}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Passing Year</span>
                  <span className="text-sm font-medium text-gray-800">{selectedReg.passing_year}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Contact Mobile</span>
                  <span className="text-sm font-medium text-gray-800">{selectedReg.mobile}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Email Address</span>
                  <span className="text-sm font-medium text-gray-800">{selectedReg.email}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Current Company / Organization</span>
                  <span className="text-sm font-medium text-gray-800">{selectedReg.current_organization}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Job Title / Designation</span>
                  <span className="text-sm font-medium text-gray-800">{selectedReg.designation}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Industry / Sector</span>
                  <span className="text-sm font-medium text-gray-800">{selectedReg.industry}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Current Location</span>
                  <span className="text-sm font-medium text-gray-800">{selectedReg.current_city}, {selectedReg.current_country}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Willing to Support NITH Activities?</span>
                  <span className="text-sm font-bold text-gray-800">{selectedReg.willing_to_support}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Selected Areas of Interest</span>
                  <span className="text-sm font-medium text-gray-800">{selectedReg.areas_of_interest || 'None Selected'}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Current Status</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold mt-1 ${
                      selectedReg.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : selectedReg.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedReg.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedReg.id, 'Approved')}
                    disabled={selectedReg.status === 'Approved'}
                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-40"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedReg.id, 'Rejected')}
                    disabled={selectedReg.status === 'Rejected'}
                    className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors disabled:opacity-40"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>

                  <button
                    onClick={() => handleDeleteRegistration(selectedReg.id)}
                    className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
