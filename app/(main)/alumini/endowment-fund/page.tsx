'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Settings, ClipboardList, TrendingUp } from 'lucide-react';

interface InitiativeData {
  id: number;
  title_en: string;
  title_hn: string;
  description_en: string;
  description_hn: string;
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  year_en: string;
  year_hn: string;
  amount_en?: string;
  amount_hn?: string;
}

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

  // Objectives (6 cards * 4 fields = 24 fields)
  obj1_title_en: string;
  obj1_title_hn: string;
  obj1_desc_en: string;
  obj1_desc_hn: string;
  obj2_title_en: string;
  obj2_title_hn: string;
  obj2_desc_en: string;
  obj2_desc_hn: string;
  obj3_title_en: string;
  obj3_title_hn: string;
  obj3_desc_en: string;
  obj3_desc_hn: string;
  obj4_title_en: string;
  obj4_title_hn: string;
  obj4_desc_en: string;
  obj4_desc_hn: string;
  obj5_title_en: string;
  obj5_title_hn: string;
  obj5_desc_en: string;
  obj5_desc_hn: string;
  obj6_title_en: string;
  obj6_title_hn: string;
  obj6_desc_en: string;
  obj6_desc_hn: string;

  // Contribution block (16 fields)
  contrib_title_en: string;
  contrib_title_hn: string;
  contrib_desc_en: string;
  contrib_desc_hn: string;
  contrib1_title_en: string;
  contrib1_title_hn: string;
  contrib1_desc_en: string;
  contrib1_desc_hn: string;
  contrib2_title_en: string;
  contrib2_title_hn: string;
  contrib2_desc_en: string;
  contrib2_desc_hn: string;
  contrib3_title_en: string;
  contrib3_title_hn: string;
  contrib3_desc_en: string;
  contrib3_desc_hn: string;
  contrib4_title_en: string;
  contrib4_title_hn: string;
  contrib4_desc_en: string;
  contrib4_desc_hn: string;
  contrib_btn1_en: string;
  contrib_btn1_hn: string;
  contrib_btn2_en: string;
  contrib_btn2_hn: string;

  // Transparency & Governance (16 fields)
  trans_title_en: string;
  trans_title_hn: string;
  trans_desc_en: string;
  trans_desc_hn: string;
  trans1_title_en: string;
  trans1_title_hn: string;
  trans1_desc_en: string;
  trans1_desc_hn: string;
  trans2_title_en: string;
  trans2_title_hn: string;
  trans2_desc_en: string;
  trans2_desc_hn: string;
  trans3_title_en: string;
  trans3_title_hn: string;
  trans3_desc_en: string;
  trans3_desc_hn: string;

  // Contact Information (18 fields)
  contact_title_en: string;
  contact_title_hn: string;
  contact_office_title_en: string;
  contact_office_title_hn: string;
  contact_office_desc_en: string;
  contact_office_desc_hn: string;
  contact_email_title_en: string;
  contact_email_title_hn: string;
  contact_email_desc_en: string;
  contact_email_desc_hn: string;
  contact_phone_title_en: string;
  contact_phone_title_hn: string;
  contact_phone_desc_en: string;
  contact_phone_desc_hn: string;
  contact_hours_title_en: string;
  contact_hours_title_hn: string;
  contact_hours_desc_en: string;
  contact_hours_desc_hn: string;
}

const INITIAL_HEADING: HeadingData = {
  title_en: 'Endowment Fund Generation',
  title_hn: 'एंडोमेंट फंड जनरेशन',
  sub_title_en: 'Building a sustainable future for NIT Hamirpur through strategic endowment initiatives that support academic excellence, innovation, and student welfare.',
  sub_title_hn: 'शैक्षणिक उत्कृष्टता, नवाचार और छात्र कल्याण का समर्थन करने वाली रणनीतिक एंडोमेंट पहलों के माध्यम से एनआईटी हमीरपुर के लिए एक स्थायी भविष्य का निर्माण करना।',
  about_title_en: 'About the Endowment Fund',
  about_title_hn: 'एंडोमेंट फंड के बारे में',
  about_desc1_en: 'An Endowment Fund is a permanent fund established to provide long-term financial support to NIT Hamirpur. The principal amount is invested prudently, and the generated returns are utilized to support various institutional initiatives without depleting the core corpus.',
  about_desc1_hn: 'एक एंडोमेंट फंड एनआईटी हमीरपुर को दीर्घकालिक वित्तीय सहायता प्रदान करने के लिए स्थापित एक स्थायी फंड है। मूल राशि का निवेश विवेकपूर्ण तरीके से किया जाता, और उत्पन्न रिटर्न का उपयोग कोर कॉर्पस को समाप्त किए बिना विभिन्न संस्थागत पहलों का समर्थन करने के लिए किया जाता है।',
  about_desc2_en: 'The Endowment Fund plays a crucial role in supporting academic excellence, cutting-edge research, modern infrastructure development, student scholarships, faculty development, and overall student welfare at the institute.',
  about_desc2_hn: 'एंडोमेंट फंड संस्थान में शैक्षणिक उत्कृष्टता, अत्याधुनिक अनुसंधान, आधुनिक बुनियादी ढांचे के विकास, छात्र छात्रवृत्ति, संकाय विकास और समग्र छात्र कल्याण का समर्थन करने में महत्वपूर्ण भूमिका निभाता है।',
  about_desc3_en: 'Alumni participation is vital to the success of these initiatives. By contributing to the endowment fund, alumni give back to their alma mater, ensuring that future generations of students receive the same quality education and opportunities that shaped their own careers.',
  about_desc3_hn: 'इन पहलों की सफलता के लिए पूर्व छात्रों की भागीदारी महत्वपूर्ण है। एंडोमेंट फंड में योगदान देकर, पूर्व छात्र अपने अल्मा मेटर को वापस देते हैं, यह सुनिश्चित करते हुए कि छात्रों की भावी पीढ़ियों को वही गुणवत्तापूर्ण शिक्षा और अवसर प्राप्त हों जिन्होंने उनके अपने करियर को आकार दिया।',

  // Objectives defaults
  obj1_title_en: 'Academic Excellence',
  obj1_title_hn: 'शैक्षणिक उत्कृष्टता',
  obj1_desc_en: 'Supporting merit-based scholarships, endowed faculty chairs, and global academic exchange programs.',
  obj1_desc_hn: 'योग्यता-आधारित छात्रवृत्ति, एंडोएड संकाय अध्यक्षों और वैश्विक शैक्षणिक विनिमय कार्यक्रमों का समर्थन करना।',
  obj2_title_en: 'Research & Innovation',
  obj2_title_hn: 'अनुसंधान और नवाचार',
  obj2_desc_en: 'Funding cutting-edge research projects, innovation hubs, and entrepreneurship cells.',
  obj2_desc_hn: 'अत्याधुनिक अनुसंधान परियोजनाओं, नवाचार केंद्रों और उद्यमिता सेल को वित्तपोषित करना।',
  obj3_title_en: 'Infrastructure Development',
  obj3_title_hn: 'बुनियादी ढांचे का विकास',
  obj3_desc_en: 'Creating modern classrooms, state-of-the-art laboratories, and high-tech campus facilities.',
  obj3_desc_hn: 'आधुनिक कक्षाओं, अत्याधुनिक प्रयोगशालाओं और उच्च तकनीक परिसर सुविधाओं का निर्माण करना।',
  obj4_title_en: 'Student Welfare',
  obj4_title_hn: 'छात्र कल्याण',
  obj4_desc_en: 'Providing financial assistance to needy students, medical support systems, and sports facilities.',
  obj4_desc_hn: 'जरूरतमंद छात्रों को वित्तीय सहायता, चिकित्सा सहायता प्रणाली और खेल सुविधाएं प्रदान करना।',
  obj5_title_en: 'Faculty Development',
  obj5_title_hn: 'संकाय विकास',
  obj5_desc_en: 'Supporting faculty research grants, international conferences, and specialized training programs.',
  obj5_desc_hn: 'संकाय अनुसंधान अनुदान, अंतर्राष्ट्रीय सम्मेलनों और विशेष प्रशिक्षण कार्यक्रमों का समर्थन करना।',
  obj6_title_en: 'Campus Sustainability',
  obj6_title_hn: 'परिसर स्थिरता',
  obj6_desc_en: 'Promoting green initiatives, solar power installations, water conservation, and eco-friendly practices.',
  obj6_desc_hn: 'हरित पहलों, सौर ऊर्जा स्थापनाओं, जल संरक्षण और पर्यावरण-अनुकूल प्रथाओं को बढ़ावा देना।',

  // Contributions defaults
  contrib_title_en: 'Contribution & Participation',
  contrib_title_hn: 'योगदान और भागीदारी',
  contrib_desc_en: 'Every contribution, big or small, plays a vital role in building the future of NIT Hamirpur. There are several ways you can participate and make a lasting impact on your alma mater.',
  contrib_desc_hn: 'हर योगदान, बड़ा या छोटा, एनआईटी हमीरपुर के भविष्य के निर्माण में महत्वपूर्ण भूमिका निभाता है। कई तरीके हैं जिनसे आप भाग ले सकते हैं और अपने अल्मा मेटर पर एक स्थायी प्रभाव डाल सकते हैं।',
  contrib1_title_en: 'Financial Contributions',
  contrib1_title_hn: 'वित्तीय योगदान',
  contrib1_desc_en: 'Make one-time or recurring donations to support the overall endowment corpus.',
  contrib1_desc_hn: 'समग्र एंडोमेंट कॉर्पस का समर्थन करने के लिए एकमुश्त या आवर्ती दान करें।',
  contrib2_title_en: 'Sponsored Scholarships',
  contrib2_title_hn: 'प्रायोजित छात्रवृत्ति',
  contrib2_desc_en: 'Establish named scholarships in your name or in memory of loved ones.',
  contrib2_desc_hn: 'अपने नाम पर या प्रियजनों की स्मृति में नामांकित छात्रवृत्ति स्थापित करें।',
  contrib3_title_en: 'Infrastructure Support',
  contrib3_title_hn: 'बुनियादी ढांचा सहायता',
  contrib3_desc_en: 'Sponsor laboratories, classrooms, or specific equipment for academic departments.',
  contrib3_desc_hn: 'शैक्षणिक विभागों के लिए प्रयोगशालाओं, कक्षाओं या विशिष्ट उपकरणों को प्रायोजित करें।',
  contrib4_title_en: 'Research Grants',
  contrib4_title_hn: 'अनुसंधान अनुदान',
  contrib4_desc_en: 'Fund specific research projects or provide research fellowships for faculty and students.',
  contrib4_desc_hn: 'विशिष्ट अनुसंधान परियोजनाओं को निधि देना या संकाय और छात्रों के लिए अनुसंधान फैलोशिप प्रदान करना।',
  contrib_btn1_en: 'Contribute Online',
  contrib_btn1_hn: 'ऑनलाइन योगदान करें',
  contrib_btn2_en: 'Contact Alumni Office',
  contrib_btn2_hn: 'पूर्व छात्र कार्यालय से संपर्क करें',

  // Transparency defaults
  trans_title_en: 'Transparency & Governance',
  trans_title_hn: 'पारदर्शिता और शासन',
  trans_desc_en: 'NIT Hamirpur is committed to the highest standards of transparency and accountability in managing the Endowment Fund. The governance structure ensures that all contributions are utilized strictly in accordance with the donors\' wishes.',
  trans_desc_hn: 'एनआईटी हमीरपुर एंडोमेंट फंड के प्रबंधन में पारदर्शिता और जवाबदेही के उच्चतम मानकों के लिए प्रतिबद्ध है। शासन संरचना यह सुनिश्चित करती है कि सभी योगदानों का उपयोग केवल दाताओं की इच्छाओं के अनुसार किया जाए।',
  trans1_title_en: 'Oversight Committee',
  trans1_title_hn: 'निगरानी समिति',
  trans1_desc_en: 'A high-level committee comprising institute administrators, alumni representatives, and financial experts reviews fund allocation.',
  trans1_desc_hn: 'संस्थान के प्रशासकों, पूर्व छात्रों के प्रतिनिधियों और वित्तीय विशेषज्ञों की एक उच्च स्तरीय समिति फंड आवंटन की समीक्षा करती है।',
  trans2_title_en: 'Investment Policy',
  trans2_title_hn: 'निवेश नीति',
  trans2_desc_en: 'Funds are invested in low-risk, stable instruments in compliance with Government guidelines to ensure capital preservation.',
  trans2_desc_hn: 'पूंजी संरक्षण सुनिश्चित करने के लिए सरकारी दिशानिर्देशों के अनुपालन में कम जोखिम वाले, स्थिर साधनों में फंड का निवेश किया जाता है।',
  trans3_title_en: 'Annual Reporting',
  trans3_title_hn: 'वार्षिक रिपोर्टिंग',
  trans3_desc_en: 'Detailed audited financial statements and utilization reports are shared with all contributors annually.',
  trans3_desc_hn: 'विस्तृत ऑडिट किए गए वित्तीय विवरण और उपयोग रिपोर्ट सालाना सभी योगदानकर्ताओं के साथ साझा की जाती हैं।',

  // Contact defaults
  contact_title_en: 'Contact Information',
  contact_title_hn: 'संपर्क जानकारी',
  contact_office_title_en: 'Alumni Relations Office',
  contact_office_title_hn: 'पूर्व छात्र संबंध कार्यालय',
  contact_office_desc_en: 'Administrative Block, NIT Hamirpur\nHamirpur, Himachal Pradesh - 177005, India',
  contact_office_desc_hn: 'प्रशासनिक ब्लॉक, एनआईटी हमीरपुर\nहमीरपुर, हिमाचल प्रदेश - 177005, भारत',
  contact_email_title_en: 'Email Address',
  contact_email_title_hn: 'ईमेल पता',
  contact_email_desc_en: 'alumni@nith.ac.in\nendowment@nith.ac.in',
  contact_email_desc_hn: 'alumni@nith.ac.in\nendowment@nith.ac.in',
  contact_phone_title_en: 'Phone Number',
  contact_phone_title_hn: 'फ़ोन नंबर',
  contact_phone_desc_en: '+91-1972-223467\n+91-1972-254200',
  contact_phone_desc_hn: '+91-1972-223467\n+91-1972-254200',
  contact_hours_title_en: 'Office Hours',
  contact_hours_title_hn: 'कार्यालय समय',
  contact_hours_desc_en: 'Monday to Friday: 9:00 AM - 5:00 PM IST\nClosed on Saturdays, Sundays, and public holidays',
  contact_hours_desc_hn: 'सोमवार से शुक्रवार: 9:00 AM - 5:00 PM IST\nशनिवार, रविवार और सार्वजनिक छुट्टियों पर बंद'
};

export default function EndowmentFundAdmin() {
  const [heading, setHeading] = useState<HeadingData>(INITIAL_HEADING);
  const [initiatives, setInitiatives] = useState<InitiativeData[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const [activeTab, setActiveTab] = useState<'hero' | 'initiatives' | 'objectives' | 'participation' | 'transparency'>('hero');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Headings
        const hRes = await fetch('http://localhost:4000/api/alumni-endowment', { cache: 'no-store' });
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

        // 2. Fetch Initiatives List
        const iRes = await fetch('http://localhost:4000/api/alumni-endowment/initiatives', { cache: 'no-store' });
        const iData = await iRes.json();
        if (Array.isArray(iData)) {
          setInitiatives(iData);
        }
      } catch (err) {
        console.error('Fetch Endowment Fund data failed:', err);
      }
    };
    fetchData();
  }, []);

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Delete Removed Initiatives
      for (const id of deletedIds) {
        await fetch(`http://localhost:4000/api/alumni-endowment/initiatives/${id}`, {
          method: 'DELETE'
        });
      }
      setDeletedIds([]);

      // 2. Save Headings Settings
      await fetch('http://localhost:4000/api/alumni-endowment/heading', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heading)
      });

      // 3. Save Initiatives List (POST for new ones, PUT for existing)
      for (const item of initiatives) {
        const payload = {
          title_en: item.title_en,
          title_hn: item.title_hn,
          description_en: item.description_en,
          description_hn: item.description_hn,
          status: item.status,
          year_en: item.year_en,
          year_hn: item.year_hn,
          amount_en: item.amount_en || '',
          amount_hn: item.amount_hn || ''
        };

        if (item.id > 0 && item.id < 1000000000) {
          // Real ID, do PUT
          await fetch(`http://localhost:4000/api/alumni-endowment/initiatives/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          // Temporary ID, do POST
          await fetch('http://localhost:4000/api/alumni-endowment/initiatives', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      }

      alert('All endowment fund changes saved successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Failed to save changes:', err);
      alert('Error saving changes. Please check server logs.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add initiative Row
  const handleAddInitiative = () => {
    const newItem: InitiativeData = {
      id: Date.now() + Math.random(),
      title_en: '',
      title_hn: '',
      description_en: '',
      description_hn: '',
      status: 'Ongoing',
      year_en: '',
      year_hn: '',
      amount_en: '',
      amount_hn: ''
    };
    setInitiatives(prev => [...prev, newItem]);
  };

  // Remove initiative Row
  const handleRemoveInitiative = (id: number) => {
    if (id > 0 && id < 1000000000) {
      setDeletedIds(prev => [...prev, id]);
    }
    setInitiatives(prev => prev.filter(item => item.id !== id));
  };

  // Update field value
  const handleUpdateField = (id: number, field: keyof InitiativeData, value: string) => {
    setInitiatives(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Top Banner */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-[#631012]" />
              Endowment Fund Manager
            </h1>
            <p className="text-gray-500 mt-1">
              Configure titles, page descriptions, and manage fundraising initiatives bilingually.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#631012] text-white rounded-lg hover:bg-[#4d0c0e] font-semibold transition-all disabled:bg-gray-400"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Tab Headers */}
        <div className="flex flex-wrap border-b border-gray-200 mt-6 gap-2">
          <button
            onClick={() => setActiveTab('hero')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'hero'
                ? 'border-[#631012] text-[#631012]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            Hero & About Copy
          </button>
          <button
            onClick={() => setActiveTab('objectives')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'objectives'
                ? 'border-[#631012] text-[#631012]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Objectives Cards
          </button>
          <button
            onClick={() => setActiveTab('participation')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'participation'
                ? 'border-[#631012] text-[#631012]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            Participation Block
          </button>
          <button
            onClick={() => setActiveTab('transparency')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'transparency'
                ? 'border-[#631012] text-[#631012]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            Transparency & Contacts
          </button>
          <button
            onClick={() => setActiveTab('initiatives')}
            className={`py-3 px-6 font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'initiatives'
                ? 'border-[#631012] text-[#631012]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            Fundraising Initiatives ({initiatives.length})
          </button>
        </div>
      </div>

      {/* Main Tab Panels */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Hero Section Heading</h2>
            <p className="text-gray-500 text-sm">Configure the main welcome banner text of the endowment page.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title (English)</label>
              <input
                type="text"
                value={heading.title_en}
                onChange={e => setHeading(prev => ({ ...prev, title_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title (Hindi)</label>
              <input
                type="text"
                value={heading.title_hn}
                onChange={e => setHeading(prev => ({ ...prev, title_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-title (English)</label>
              <textarea
                rows={3}
                value={heading.sub_title_en}
                onChange={e => setHeading(prev => ({ ...prev, sub_title_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-title (Hindi)</label>
              <textarea
                rows={3}
                value={heading.sub_title_hn}
                onChange={e => setHeading(prev => ({ ...prev, sub_title_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">About Section Heading & Paragraphs</h2>
            <p className="text-gray-500 text-sm mb-6 font-normal">Edit the complete About descriptions displayed on the page.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Title (English)</label>
                <input
                  type="text"
                  value={heading.about_title_en}
                  onChange={e => setHeading(prev => ({ ...prev, about_title_en: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">About Title (Hindi)</label>
                <input
                  type="text"
                  value={heading.about_title_hn}
                  onChange={e => setHeading(prev => ({ ...prev, about_title_hn: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
                />
              </div>

              {/* Desc Paragraph 1 */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-[#631012] uppercase mb-1">About Paragraph 1 (English)</label>
                  <textarea
                    rows={3}
                    value={heading.about_desc1_en}
                    onChange={e => setHeading(prev => ({ ...prev, about_desc1_en: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#631012] uppercase mb-1">About Paragraph 1 (Hindi)</label>
                  <textarea
                    rows={3}
                    value={heading.about_desc1_hn}
                    onChange={e => setHeading(prev => ({ ...prev, about_desc1_hn: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
              </div>

              {/* Desc Paragraph 2 */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-[#631012] uppercase mb-1">About Paragraph 2 (English)</label>
                  <textarea
                    rows={3}
                    value={heading.about_desc2_en}
                    onChange={e => setHeading(prev => ({ ...prev, about_desc2_en: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#631012] uppercase mb-1">About Paragraph 2 (Hindi)</label>
                  <textarea
                    rows={3}
                    value={heading.about_desc2_hn}
                    onChange={e => setHeading(prev => ({ ...prev, about_desc2_hn: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
              </div>

              {/* Desc Paragraph 3 */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-[#631012] uppercase mb-1">About Paragraph 3 (English)</label>
                  <textarea
                    rows={3}
                    value={heading.about_desc3_en}
                    onChange={e => setHeading(prev => ({ ...prev, about_desc3_en: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#631012] uppercase mb-1">About Paragraph 3 (Hindi)</label>
                  <textarea
                    rows={3}
                    value={heading.about_desc3_hn}
                    onChange={e => setHeading(prev => ({ ...prev, about_desc3_hn: e.target.value }))}
                    className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Objectives Tab Panel */}
      {activeTab === 'objectives' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Objectives Cards</h2>
            <p className="text-gray-500 text-sm">Configure all six objectives cards shown in the objectives grid bilingually.</p>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <div key={num} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <div className="font-bold text-[#631012] text-sm">Objectives Card #{num}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Title (English)</label>
                    <input
                      type="text"
                      value={(heading as any)[`obj${num}_title_en` as any] || ''}
                      onChange={e => setHeading(prev => ({ ...prev, [`obj${num}_title_en`]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Title (Hindi)</label>
                    <input
                      type="text"
                      value={(heading as any)[`obj${num}_title_hn` as any] || ''}
                      onChange={e => setHeading(prev => ({ ...prev, [`obj${num}_title_hn`]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Description (English)</label>
                    <textarea
                      rows={2}
                      value={(heading as any)[`obj${num}_desc_en` as any] || ''}
                      onChange={e => setHeading(prev => ({ ...prev, [`obj${num}_desc_en`]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Description (Hindi)</label>
                    <textarea
                      rows={2}
                      value={(heading as any)[`obj${num}_desc_hn` as any] || ''}
                      onChange={e => setHeading(prev => ({ ...prev, [`obj${num}_desc_hn`]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participation Tab Panel */}
      {activeTab === 'participation' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Participation & Contribution Block</h2>
            <p className="text-gray-500 text-sm">Configure the main call to action block, bullet items, and action buttons.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Block Title (English)</label>
              <input
                type="text"
                value={heading.contrib_title_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, contrib_title_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Block Title (Hindi)</label>
              <input
                type="text"
                value={heading.contrib_title_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, contrib_title_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description (English)</label>
              <textarea
                rows={3}
                value={heading.contrib_desc_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, contrib_desc_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Hindi)</label>
              <textarea
                rows={3}
                value={heading.contrib_desc_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, contrib_desc_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>

            {/* Bullets */}
            {[1, 2, 3, 4].map(num => (
              <div key={num} className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                <div className="font-bold text-[#631012] text-xs uppercase">Bullet Item #{num}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Title (English)</label>
                    <input
                      type="text"
                      value={(heading as any)[`contrib${num}_title_en` as any] || ''}
                      onChange={e => setHeading(prev => ({ ...prev, [`contrib${num}_title_en`]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#631012] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Title (Hindi)</label>
                    <input
                      type="text"
                      value={(heading as any)[`contrib${num}_title_hn` as any] || ''}
                      onChange={e => setHeading(prev => ({ ...prev, [`contrib${num}_title_hn`]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#631012] outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description (English)</label>
                    <textarea
                      rows={2}
                      value={(heading as any)[`contrib${num}_desc_en` as any] || ''}
                      onChange={e => setHeading(prev => ({ ...prev, [`contrib${num}_desc_en`]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#631012] outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description (Hindi)</label>
                    <textarea
                      rows={2}
                      value={(heading as any)[`contrib${num}_desc_hn` as any] || ''}
                      onChange={e => setHeading(prev => ({ ...prev, [`contrib${num}_desc_hn`]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#631012] outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Buttons */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Button 1 Label (English)</label>
              <input
                type="text"
                value={heading.contrib_btn1_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, contrib_btn1_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Button 1 Label (Hindi)</label>
              <input
                type="text"
                value={heading.contrib_btn1_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, contrib_btn1_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Button 2 Label (English)</label>
              <input
                type="text"
                value={heading.contrib_btn2_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, contrib_btn2_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Button 2 Label (Hindi)</label>
              <input
                type="text"
                value={heading.contrib_btn2_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, contrib_btn2_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Transparency & Contacts Tab Panel */}
      {activeTab === 'transparency' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Transparency, Governance & Contact Details</h2>
            <p className="text-gray-500 text-sm font-normal">Configure the transparency cards and direct institutional contacts bilingually.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
            <div className="md:col-span-2"><h3 className="font-bold text-gray-800 border-l-4 border-[#631012] pl-2 mb-4">Transparency Block Copy</h3></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Transparency Title (English)</label>
              <input
                type="text"
                value={heading.trans_title_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, trans_title_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Transparency Title (Hindi)</label>
              <input
                type="text"
                value={heading.trans_title_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, trans_title_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Transparency Description (English)</label>
              <textarea
                rows={3}
                value={heading.trans_desc_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, trans_desc_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Transparency Description (Hindi)</label>
              <textarea
                rows={3}
                value={heading.trans_desc_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, trans_desc_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>

            {/* Oversight, Investment, Reporting Cards */}
            {['Oversight', 'Investment', 'Reporting'].map((cardName, idx) => {
              const num = idx + 1;
              return (
                <div key={cardName} className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
                  <div className="font-bold text-[#631012] text-xs uppercase">{cardName} Card Details</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Title (English)</label>
                      <input
                        type="text"
                        value={(heading as any)[`trans${num}_title_en` as any] || ''}
                        onChange={e => setHeading(prev => ({ ...prev, [`trans${num}_title_en`]: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#631012] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Title (Hindi)</label>
                      <input
                        type="text"
                        value={(heading as any)[`trans${num}_title_hn` as any] || ''}
                        onChange={e => setHeading(prev => ({ ...prev, [`trans${num}_title_hn`]: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#631012] outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Description (English)</label>
                      <textarea
                        rows={2}
                        value={(heading as any)[`trans${num}_desc_en` as any] || ''}
                        onChange={e => setHeading(prev => ({ ...prev, [`trans${num}_desc_en`]: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#631012] outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Description (Hindi)</label>
                      <textarea
                        rows={2}
                        value={(heading as any)[`trans${num}_desc_hn` as any] || ''}
                        onChange={e => setHeading(prev => ({ ...prev, [`trans${num}_desc_hn`]: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#631012] outline-none"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="md:col-span-2"><h3 className="font-bold text-gray-800 border-l-4 border-[#631012] pl-2 mb-4">Contact Information Copy</h3></div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contacts Section Title (English)</label>
              <input
                type="text"
                value={heading.contact_title_en || ''}
                onChange={e => setHeading(prev => ({ ...prev, contact_title_en: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contacts Section Title (Hindi)</label>
              <input
                type="text"
                value={heading.contact_title_hn || ''}
                onChange={e => setHeading(prev => ({ ...prev, contact_title_hn: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#631012] outline-none"
              />
            </div>

            {/* Office Address Card */}
            <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
              <div className="font-bold text-[#631012] text-xs uppercase">Alumni Office Card</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Card Title (English)</label>
                  <input
                    type="text"
                    value={heading.contact_office_title_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_office_title_en: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Card Title (Hindi)</label>
                  <input
                    type="text"
                    value={heading.contact_office_title_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_office_title_hn: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Address Copy (English)</label>
                  <textarea
                    rows={2}
                    value={heading.contact_office_desc_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_office_desc_en: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Address Copy (Hindi)</label>
                  <textarea
                    rows={2}
                    value={heading.contact_office_desc_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_office_desc_hn: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
              </div>
            </div>

            {/* Email Addresses Card */}
            <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
              <div className="font-bold text-[#631012] text-xs uppercase">Email Addresses Card</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Card Title (English)</label>
                  <input
                    type="text"
                    value={heading.contact_email_title_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_email_title_en: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Card Title (Hindi)</label>
                  <input
                    type="text"
                    value={heading.contact_email_title_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_email_title_hn: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Emails (English) - One per line</label>
                  <textarea
                    rows={2}
                    value={heading.contact_email_desc_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_email_desc_en: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Emails (Hindi) - One per line</label>
                  <textarea
                    rows={2}
                    value={heading.contact_email_desc_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_email_desc_hn: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
              </div>
            </div>

            {/* Phone Numbers Card */}
            <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
              <div className="font-bold text-[#631012] text-xs uppercase">Phone Numbers Card</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Card Title (English)</label>
                  <input
                    type="text"
                    value={heading.contact_phone_title_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_phone_title_en: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Card Title (Hindi)</label>
                  <input
                    type="text"
                    value={heading.contact_phone_title_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_phone_title_hn: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Numbers (English) - One per line</label>
                  <textarea
                    rows={2}
                    value={heading.contact_phone_desc_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_phone_desc_en: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Numbers (Hindi) - One per line</label>
                  <textarea
                    rows={2}
                    value={heading.contact_phone_desc_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_phone_desc_hn: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
              </div>
            </div>

            {/* Office Hours Card */}
            <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
              <div className="font-bold text-[#631012] text-xs uppercase">Office Hours Card</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Card Title (English)</label>
                  <input
                    type="text"
                    value={heading.contact_hours_title_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_hours_title_en: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Card Title (Hindi)</label>
                  <input
                    type="text"
                    value={heading.contact_hours_title_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_hours_title_hn: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Hours Details (English)</label>
                  <textarea
                    rows={2}
                    value={heading.contact_hours_desc_en || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_hours_desc_en: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Hours Details (Hindi)</label>
                  <textarea
                    rows={2}
                    value={heading.contact_hours_desc_hn || ''}
                    onChange={e => setHeading(prev => ({ ...prev, contact_hours_desc_hn: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initiatives Tab Panel */}
      {activeTab === 'initiatives' && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Manage Initiatives</h2>
              <p className="text-gray-500 text-sm">Add, remove, and update existing endowment project goals.</p>
            </div>
            <button
              onClick={handleAddInitiative}
              className="flex items-center gap-2 px-4 py-2 bg-[#631012] text-white rounded-lg hover:bg-[#4d0c0e] text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Initiative Row
            </button>
          </div>

          <div className="space-y-6">
            {initiatives.length === 0 ? (
              <div className="py-12 text-center text-gray-400 font-medium border border-dashed border-gray-200 rounded-xl">
                No initiatives created yet. Click "Add Initiative Row" to start.
              </div>
            ) : (
              initiatives.map((item, idx) => (
                <div key={item.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200 relative space-y-4">
                  {/* Delete Button */}
                  <button
                    onClick={() => handleRemoveInitiative(item.id)}
                    title="Remove Item"
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="bg-[#631012] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Initiative #{idx + 1}
                    </span>
                    {item.id > 1000000000 && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                        New / Unsaved
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title (English)</label>
                      <input
                        type="text"
                        value={item.title_en}
                        onChange={e => handleUpdateField(item.id, 'title_en', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title (Hindi)</label>
                      <input
                        type="text"
                        value={item.title_hn}
                        onChange={e => handleUpdateField(item.id, 'title_hn', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (English)</label>
                      <textarea
                        rows={2}
                        value={item.description_en}
                        onChange={e => handleUpdateField(item.id, 'description_en', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description (Hindi)</label>
                      <textarea
                        rows={2}
                        value={item.description_hn}
                        onChange={e => handleUpdateField(item.id, 'description_hn', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#631012]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                      <select
                        value={item.status}
                        onChange={e => handleUpdateField(item.id, 'status', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#631012]"
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Upcoming">Upcoming</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year (En)</label>
                        <input
                          type="text"
                          value={item.year_en}
                          onChange={e => handleUpdateField(item.id, 'year_en', e.target.value)}
                          className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year (Hn)</label>
                        <input
                          type="text"
                          value={item.year_hn}
                          onChange={e => handleUpdateField(item.id, 'year_hn', e.target.value)}
                          className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (English)</label>
                      <input
                        type="text"
                        value={item.amount_en || ''}
                        onChange={e => handleUpdateField(item.id, 'amount_en', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (Hindi)</label>
                      <input
                        type="text"
                        value={item.amount_hn || ''}
                        onChange={e => handleUpdateField(item.id, 'amount_hn', e.target.value)}
                        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
