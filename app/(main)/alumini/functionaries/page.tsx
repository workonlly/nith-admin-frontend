'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Users, Layout } from 'lucide-react';

interface Row {
  id: number;
  slNo: string;
  nameEn: string;
  nameHn: string;
  responsibilityEn: string;
  responsibilityHn: string;
  phone: string;
  email: string;
  section_title_en: string;
  section_title_hn: string;
}

interface Section {
  titleEn: string;
  titleHn: string;
  rows: Row[];
}

interface FunctionariesData {
  heroHeadingEn: string;
  heroHeadingHn: string;
  heroSubheadingEn: string;
  heroSubheadingHn: string;
  sections: Section[];
}

const INITIAL_DATA: FunctionariesData = {
  heroHeadingEn: 'Functionaries',
  heroHeadingHn: 'पदाधिकारी',
  heroSubheadingEn: 'Dean, Associate Dean, Alumni Association, Resource Generation, Staff',
  heroSubheadingHn: 'डीन, एसोसिएट डीन, पूर्व छात्र संघ, संसाधन सृजन, कर्मचारी',
  sections: [
    {
      titleEn: 'Dean and Associate Dean (Alumni & Resources)',
      titleHn: 'डीन और एसोसिएट डीन (पूर्व छात्र और संसाधन)',
      rows: [
        { id: -1, slNo: '1', nameEn: 'Prof. Ashwani Kumar Chandel', nameHn: 'प्रो. अश्विनी कुमार चंदेल', responsibilityEn: 'Dean', responsibilityHn: 'डीन', phone: '254054', email: 'dar@nith.ac.in', section_title_en: 'Dean and Associate Dean (Alumni & Resources)', section_title_hn: 'डीन और एसोसिएट डीन (पूर्व छात्र और संसाधन)' },
        { id: -2, slNo: '2', nameEn: 'Dr. Gargi Sharma', nameHn: 'डॉ. गार्गी शर्मा', responsibilityEn: 'Associate Dean', responsibilityHn: 'एसोसिएट डीन', phone: '254536', email: 'gargi@nith.ac.in', section_title_en: 'Dean and Associate Dean (Alumni & Resources)', section_title_hn: 'डीन और एसोसिएट डीन (पूर्व छात्र और संसाधन)' },
        { id: -3, slNo: '3', nameEn: 'Dr. Somesh Kumar Sharma', nameHn: 'डॉ. सोमेश कुमार शर्मा', responsibilityEn: 'Associate Dean (Resource Generation & Industrialization)', responsibilityHn: 'एसोसिएट डीन (संसाधन सृजन और औद्योगिकीकरण)', phone: '254732', email: 'somesh@nith.ac.in', section_title_en: 'Dean and Associate Dean (Alumni & Resources)', section_title_hn: 'डीन और एसोसिएट डीन (पूर्व छात्र और संसाधन)' },
      ]
    },
    {
      titleEn: 'Alumni Association',
      titleHn: 'पूर्व छात्र संघ',
      rows: [
        { id: -4, slNo: '1', nameEn: 'Dr. Jyoti Srivastava', nameHn: 'डॉ. ज्योति श्रीवास्तव', responsibilityEn: 'Faculty Incharge', responsibilityHn: 'संकाय प्रभारी', phone: '254401', email: 'jyoti.s@nith.ac.in', section_title_en: 'Alumni Association', section_title_hn: 'पूर्व छात्र संघ' },
        { id: -5, slNo: '2', nameEn: 'Dr. Vandana Sharma', nameHn: 'डॉ. वंदना शर्मा', responsibilityEn: 'Faculty Incharge', responsibilityHn: 'संकाय प्रभारी', phone: '254920', email: 'vandna@nith.ac.in', section_title_en: 'Alumni Association', section_title_hn: 'पूर्व छात्र संघ' },
      ]
    },
    {
      titleEn: 'Resource Generation',
      titleHn: 'संसाधन सृजन',
      rows: [
        { id: -6, slNo: '1', nameEn: 'Dr. Amit Kaul', nameHn: 'डॉ. अमित कौल', responsibilityEn: 'Faculty Incharge', responsibilityHn: 'संकाय प्रभारी', phone: '254544', email: 'amitkaul@nith.ac.in', section_title_en: 'Resource Generation', section_title_hn: 'संसाधन सृजन' },
      ]
    },
    {
      titleEn: 'Staff',
      titleHn: 'कर्मचारी',
      rows: [
        { id: -7, slNo: '1', nameEn: 'Sh. Sanjay Jamwal', nameHn: 'श्री संजय जमवाल', responsibilityEn: 'Deputy Registrar', responsibilityHn: 'उप कुलसचिव', phone: '--', email: '--', section_title_en: 'Staff', section_title_hn: 'कर्मचारी' },
      ]
    }
  ],
};

export default function AlumniFunctionariesAdmin() {
  const [data, setData] = useState<FunctionariesData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'hero' | 'sections'>('hero');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hRes = await fetch('http://localhost:4000/api/alumni-functionaries');
        const hData = await hRes.json();
        if (hData && hData.title_en) {
          setData(prev => ({
            ...prev,
            heroHeadingEn: hData.title_en,
            heroHeadingHn: hData.title_hn,
            heroDescriptionEn: hData.sub_title_en,
            heroDescriptionHn: hData.sub_title_hn,
          }));
        }

        const lRes = await fetch('http://localhost:4000/api/alumni-functionaries/list');
        const lData = await lRes.json();
        if (Array.isArray(lData) && lData.length > 0) {
          const sectionsMap: { [key: string]: Section } = {};
          lData.forEach((row: any) => {
            const key = row.section_title_en;
            if (!sectionsMap[key]) {
              sectionsMap[key] = {
                titleEn: row.section_title_en,
                titleHn: row.section_title_hn,
                rows: []
              };
            }
            sectionsMap[key].rows.push({
              id: row.id,
              slNo: row.sl_no,
              nameEn: row.name_en,
              nameHn: row.name_hn,
              responsibilityEn: row.responsibility_en,
              responsibilityHn: row.responsibility_hn,
              phone: row.phone,
              email: row.email,
              section_title_en: row.section_title_en,
              section_title_hn: row.section_title_hn
            });
          });
          setData(prev => ({ ...prev, sections: Object.values(sectionsMap) }));
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await fetch('http://localhost:4000/api/alumni-functionaries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title_en: data.heroHeadingEn,
          title_hn: data.heroHeadingHn,
          sub_title_en: data.heroSubheadingEn,
          sub_title_hn: data.heroSubheadingHn,
        }),
      });

      for (const section of data.sections) {
        for (const row of section.rows) {
          const payload = {
            section_title_en: section.titleEn,
            section_title_hn: section.titleHn,
            sl_no: row.slNo,
            name_en: row.nameEn,
            name_hn: row.nameHn,
            responsibility_en: row.responsibilityEn,
            responsibility_hn: row.responsibilityHn,
            phone: row.phone,
            email: row.email
          };

          if (row.id > 0 && row.id < 1000000000) {
            await fetch(`http://localhost:4000/api/alumni-functionaries/list/${row.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          } else {
            await fetch('http://localhost:4000/api/alumni-functionaries/list', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
          }
        }
      }
      alert('Changes saved successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save changes');
    }
  };

  const updateRow = (sectionIdx: number, rowIdx: number, field: keyof Row, value: string) => {
    const updated = [...data.sections];
    updated[sectionIdx].rows[rowIdx] = { ...updated[sectionIdx].rows[rowIdx], [field]: value };
    setData({ ...data, sections: updated });
  };

  const addRow = (sectionIdx: number) => {
    const updated = [...data.sections];
    updated[sectionIdx].rows.push({
      id: Date.now() + Math.random(),
      slNo: '',
      nameEn: '',
      nameHn: '',
      responsibilityEn: '',
      responsibilityHn: '',
      phone: '',
      email: '',
      section_title_en: updated[sectionIdx].titleEn,
      section_title_hn: updated[sectionIdx].titleHn
    });
    setData({ ...data, sections: updated });
  };

  const removeRow = async (sectionIdx: number, rowIdx: number, id: number) => {
    if (id > 0 && id < 1000000000) {
      if (!confirm('Delete from database?')) return;
      await fetch(`http://localhost:4000/api/alumni-functionaries/list/${id}`, { method: 'DELETE' });
    }
    const updated = [...data.sections];
    updated[sectionIdx].rows = updated[sectionIdx].rows.filter((_, i) => i !== rowIdx);
    setData({ ...data, sections: updated });
  };

  const addSection = () => {
    setData({
      ...data,
      sections: [...data.sections, { titleEn: 'New Section', titleHn: 'नया अनुभाग', rows: [] }]
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#171717]">Alumni Functionaries Editor</h1>
              <p className="text-[#171717]/60">Manage administrative roles and contact information</p>
            </div>
          </div>
          <button onClick={handleSave} className="bg-[#631012] hover:bg-[#7a1214] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md">
            <Save size={20} /> Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button onClick={() => setActiveTab('hero')} className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'hero' ? 'bg-[#631012] text-white' : 'text-[#171717]/70 hover:bg-gray-50'}`}>
            <Layout size={18} /> Hero Section
          </button>
          <button onClick={() => setActiveTab('sections')} className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === 'sections' ? 'bg-[#631012] text-white' : 'text-[#171717]/70 hover:bg-gray-50'}`}>
            <Users size={18} /> Sections & Roles
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'hero' && (
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-500 tracking-widest">English Header</label>
                <input type="text" value={data.heroHeadingEn} onChange={(e) => setData({...data, heroHeadingEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Heading" />
                <textarea rows={3} value={data.heroSubheadingEn} onChange={(e) => setData({...data, heroSubheadingEn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="Subheading" />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase text-gray-500 tracking-widest">Hindi Header</label>
                <input type="text" value={data.heroHeadingHn} onChange={(e) => setData({...data, heroHeadingHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="शीर्षक" />
                <textarea rows={3} value={data.heroSubheadingHn} onChange={(e) => setData({...data, heroSubheadingHn: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012]" placeholder="उपशीर्षक" />
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Section Management</h2>
                <button onClick={addSection} className="bg-[#631012] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <Plus size={18} /> Add New Section
                </button>
              </div>

              {data.sections.map((section, sIdx) => (
                <div key={sIdx} className="p-6 border-2 border-gray-100 rounded-2xl space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <input value={section.titleEn} onChange={(e) => {
                      const updated = [...data.sections];
                      updated[sIdx].titleEn = e.target.value;
                      setData({...data, sections: updated});
                    }} className="text-lg font-bold text-[#631012] border-b focus:outline-none" placeholder="Section Title (EN)" />
                    <input value={section.titleHn} onChange={(e) => {
                      const updated = [...data.sections];
                      updated[sIdx].titleHn = e.target.value;
                      setData({...data, sections: updated});
                    }} className="text-lg font-bold text-[#631012] border-b focus:outline-none" placeholder="अनुभाग शीर्षक (HI)" />
                  </div>

                  <div className="space-y-3">
                    {section.rows.map((row, rIdx) => (
                      <div key={row.id} className="p-4 bg-gray-50 rounded-xl relative group">
                        <button onClick={() => removeRow(sIdx, rIdx, row.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-6 gap-3">
                          <input value={row.slNo} onChange={(e) => updateRow(sIdx, rIdx, 'slNo', e.target.value)} className="px-2 py-1 border rounded text-sm w-12" placeholder="#" />
                          <div className="col-span-2 flex flex-col gap-1">
                            <input value={row.nameEn} onChange={(e) => updateRow(sIdx, rIdx, 'nameEn', e.target.value)} className="px-2 py-1 border rounded text-sm" placeholder="Name (EN)" />
                            <input value={row.nameHn} onChange={(e) => updateRow(sIdx, rIdx, 'nameHn', e.target.value)} className="px-2 py-1 border rounded text-sm" placeholder="नाम (HI)" />
                          </div>
                          <div className="col-span-2 flex flex-col gap-1">
                            <input value={row.responsibilityEn} onChange={(e) => updateRow(sIdx, rIdx, 'responsibilityEn', e.target.value)} className="px-2 py-1 border rounded text-sm" placeholder="Responsibility (EN)" />
                            <input value={row.responsibilityHn} onChange={(e) => updateRow(sIdx, rIdx, 'responsibilityHn', e.target.value)} className="px-2 py-1 border rounded text-sm" placeholder="जिम्मेदारी (HI)" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <input value={row.phone} onChange={(e) => updateRow(sIdx, rIdx, 'phone', e.target.value)} className="px-2 py-1 border rounded text-sm" placeholder="Phone" />
                            <input value={row.email} onChange={(e) => updateRow(sIdx, rIdx, 'email', e.target.value)} className="px-2 py-1 border rounded text-sm" placeholder="Email" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => addRow(sIdx)} className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-400 rounded-xl hover:border-[#631012] hover:text-[#631012] transition-colors flex items-center justify-center gap-2">
                      <Plus size={16} /> Add Member to {section.titleEn}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
