'use client';

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Layout, HelpCircle, FileText, HelpCircle as HelpIcon } from 'lucide-react';

interface ProcedureStep {
  id: number;
  section_title_en: string;
  section_title_hn: string;
  step_order: number;
  step_text_en: string;
  step_text_hn: string;
}

interface FeeItem {
  id: number;
  sl_no: string;
  name_en: string;
  name_hn: string;
  fee: string;
}

interface HeadingData {
  title_en: string;
  title_hn: string;
  sub_title_en: string;
  sub_title_hn: string;
  note_title_en: string;
  note_title_hn: string;
  note_desc_en: string;
  note_desc_hn: string;
  fees_title_en: string;
  fees_title_hn: string;
}

const INITIAL_HEADING: HeadingData = {
  title_en: 'Alumni Assist',
  title_hn: 'अलुम्नाई सहायता',
  sub_title_en: 'This section provides important procedures, rules, and assistance details for alumni of NIT Hamirpur.',
  sub_title_hn: 'यह अनुभाग एनआईटी हमीरपुर के पूर्व छात्रों के लिए महत्वपूर्ण प्रक्रियाएं, नियम और सहायता विवरण प्रदान करता है।',
  note_title_en: 'Important Note',
  note_title_hn: 'महत्वपूर्ण सूचना',
  note_desc_en: 'These formalities are not required in case of application due to mutilation of documents. In such cases, the applicant must attach the mutilated certificate/document along with the application and requisite fee.',
  note_desc_hn: 'दस्तावेज़ के क्षतिग्रस्त होने के कारण आवेदन की स्थिति में ये औपचारिकताएँ आवश्यक नहीं हैं। ऐसे मामलों में, आवेदक को क्षतिग्रस्त प्रमाण पत्र/दस्तावेज़ को आवेदन और आवश्यक शुल्क के साथ संलग्न करना चाहिए।',
  fees_title_en: 'Charges for Issue of Certificates / Documents',
  fees_title_hn: 'प्रमाण पत्र/दस्तावेज जारी करने के लिए शुल्क'
};

export default function AlumniAssistAdmin() {
  const [heading, setHeading] = useState<HeadingData>(INITIAL_HEADING);
  const [procedures, setProcedures] = useState<ProcedureStep[]>([]);
  const [fees, setFees] = useState<FeeItem[]>([]);
  
  const [deletedProcedureIds, setDeletedProcedureIds] = useState<number[]>([]);
  const [deletedFeeIds, setDeletedFeeIds] = useState<number[]>([]);
  
  const [activeTab, setActiveTab] = useState<'hero' | 'procedures' | 'fees'>('hero');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Headings
        const hRes = await fetch('http://localhost:4000/api/alumni-assist');
        const hData = await hRes.json();
        if (hData && hData.title_en) {
          setHeading(hData);
        }

        // 2. Fetch Procedures
        const pRes = await fetch('http://localhost:4000/api/alumni-assist/procedures');
        const pData = await pRes.json();
        if (Array.isArray(pData)) {
          setProcedures(pData);
        }

        // 3. Fetch Fees
        const fRes = await fetch('http://localhost:4000/api/alumni-assist/fees');
        const fData = await fRes.json();
        if (Array.isArray(fData)) {
          setFees(fData);
        }
      } catch (err) {
        console.error('Fetch initial data failed:', err);
      }
    };
    fetchData();
  }, []);

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Process Deletions
      for (const id of deletedProcedureIds) {
        await fetch(`http://localhost:4000/api/alumni-assist/procedures/${id}`, {
          method: 'DELETE'
        });
      }
      setDeletedProcedureIds([]);

      for (const id of deletedFeeIds) {
        await fetch(`http://localhost:4000/api/alumni-assist/fees/${id}`, {
          method: 'DELETE'
        });
      }
      setDeletedFeeIds([]);

      // 2. Save Headings
      await fetch('http://localhost:4000/api/alumni-assist', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heading)
      });

      // 3. Save Procedures (Insert new or update existing)
      for (const proc of procedures) {
        const payload = {
          section_title_en: proc.section_title_en,
          section_title_hn: proc.section_title_hn,
          step_order: proc.step_order,
          step_text_en: proc.step_text_en,
          step_text_hn: proc.step_text_hn
        };

        if (proc.id > 0 && proc.id < 1000000000) {
          // Real ID, do PUT
          await fetch(`http://localhost:4000/api/alumni-assist/procedures/${proc.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          // Local/Temporary ID, do POST
          await fetch('http://localhost:4000/api/alumni-assist/procedures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      }

      // 4. Save Fees
      for (const feeItem of fees) {
        const payload = {
          sl_no: feeItem.sl_no,
          name_en: feeItem.name_en,
          name_hn: feeItem.name_hn,
          fee: feeItem.fee
        };

        if (feeItem.id > 0 && feeItem.id < 1000000000) {
          // Real ID, do PUT
          await fetch(`http://localhost:4000/api/alumni-assist/fees/${feeItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          // Local/Temporary ID, do POST
          await fetch('http://localhost:4000/api/alumni-assist/fees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      }

      alert('All changes saved successfully!');
      // Reload to get actual DB IDs for new items
      window.location.reload();
    } catch (err) {
      console.error('Save changes failed:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Group procedures by section title
  const getUniqueSections = () => {
    const sections: { en: string; hn: string }[] = [];
    procedures.forEach(p => {
      if (!sections.some(s => s.en === p.section_title_en)) {
        sections.push({ en: p.section_title_en, hn: p.section_title_hn });
      }
    });
    return sections;
  };

  const sections = getUniqueSections();

  // Manage Procedure Actions
  const handleUpdateProcedure = (id: number, field: keyof ProcedureStep, value: any) => {
    setProcedures(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleAddProcedureStep = (secEn: string, secHn: string) => {
    const maxOrder = procedures
      .filter(p => p.section_title_en === secEn)
      .reduce((max, p) => p.step_order > max ? p.step_order : max, 0);

    const newStep: ProcedureStep = {
      id: Date.now() + Math.random(), // Temporary ID
      section_title_en: secEn,
      section_title_hn: secHn,
      step_order: maxOrder + 1,
      step_text_en: '',
      step_text_hn: ''
    };

    setProcedures(prev => [...prev, newStep]);
  };

  const handleRemoveProcedureStep = (id: number) => {
    if (id > 0 && id < 1000000000) {
      setDeletedProcedureIds(prev => [...prev, id]);
    }
    setProcedures(prev => prev.filter(p => p.id !== id));
  };

  const handleCreateNewSection = () => {
    const enName = prompt('Enter new Procedure Section Title (English):');
    if (!enName) return;
    const hnName = prompt('Enter new Procedure Section Title (Hindi):') || enName;

    // Add first step automatically to initialize section
    const newStep: ProcedureStep = {
      id: Date.now() + Math.random(),
      section_title_en: enName,
      section_title_hn: hnName,
      step_order: 1,
      step_text_en: '',
      step_text_hn: ''
    };
    setProcedures(prev => [...prev, newStep]);
  };

  const handleRenameSection = (oldEn: string, newEn: string, newHn: string) => {
    setProcedures(prev => prev.map(p => 
      p.section_title_en === oldEn 
        ? { ...p, section_title_en: newEn, section_title_hn: newHn }
        : p
    ));
  };

  // Manage Fee Actions
  const handleUpdateFee = (id: number, field: keyof FeeItem, value: string) => {
    setFees(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const handleAddFeeItem = () => {
    const newFee: FeeItem = {
      id: Date.now() + Math.random(),
      sl_no: (fees.length + 1).toString(),
      name_en: '',
      name_hn: '',
      fee: ''
    };
    setFees(prev => [...prev, newFee]);
  };

  const handleRemoveFeeItem = (id: number) => {
    if (id > 0 && id < 1000000000) {
      setDeletedFeeIds(prev => [...prev, id]);
    }
    setFees(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header and Save Control */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-full text-[#631012]">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#171717]">Alumni Assist Editor</h1>
              <p className="text-[#171717]/60">Manage dynamic instructions, fees, and notes for alumni services</p>
            </div>
          </div>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-[#631012] hover:bg-[#7a1214] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md disabled:opacity-50 w-full md:w-auto justify-center"
          >
            <Save size={20} /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          <button 
            onClick={() => setActiveTab('hero')} 
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors shrink-0 ${activeTab === 'hero' ? 'bg-[#631012] text-white' : 'text-[#171717]/70 hover:bg-gray-50'}`}
          >
            <Layout size={18} /> Hero & Alert Info
          </button>
          <button 
            onClick={() => setActiveTab('procedures')} 
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors shrink-0 ${activeTab === 'procedures' ? 'bg-[#631012] text-white' : 'text-[#171717]/70 hover:bg-gray-50'}`}
          >
            <HelpCircle size={18} /> Procedures Steps
          </button>
          <button 
            onClick={() => setActiveTab('fees')} 
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors shrink-0 ${activeTab === 'fees' ? 'bg-[#631012] text-white' : 'text-[#171717]/70 hover:bg-gray-50'}`}
          >
            <FileText size={18} /> Certificate Fees
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: HERO & NOTE */}
          {activeTab === 'hero' && (
            <div className="space-y-8">
              {/* Hero Section */}
              <div className="border-b pb-6 space-y-4">
                <h3 className="text-lg font-bold text-[#631012]">Hero Header Sections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">English Title</label>
                    <input 
                      type="text" 
                      value={heading.title_en} 
                      onChange={(e) => setHeading({...heading, title_en: e.target.value})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                    />
                    
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">English Subtitle</label>
                    <textarea 
                      rows={3} 
                      value={heading.sub_title_en} 
                      onChange={(e) => setHeading({...heading, sub_title_en: e.target.value})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">Hindi Title</label>
                    <input 
                      type="text" 
                      value={heading.title_hn} 
                      onChange={(e) => setHeading({...heading, title_hn: e.target.value})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                    />
                    
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">Hindi Subtitle</label>
                    <textarea 
                      rows={3} 
                      value={heading.sub_title_hn} 
                      onChange={(e) => setHeading({...heading, sub_title_hn: e.target.value})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Alert / Important Note Section */}
              <div className="border-b pb-6 space-y-4">
                <h3 className="text-lg font-bold text-[#631012]">Important Note Alert Box</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">English Note Title</label>
                    <input 
                      type="text" 
                      value={heading.note_title_en} 
                      onChange={(e) => setHeading({...heading, note_title_en: e.target.value})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                    />
                    
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">English Note Description</label>
                    <textarea 
                      rows={4} 
                      value={heading.note_desc_en} 
                      onChange={(e) => setHeading({...heading, note_desc_en: e.target.value})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">Hindi Note Title</label>
                    <input 
                      type="text" 
                      value={heading.note_title_hn} 
                      onChange={(e) => setHeading({...heading, note_title_hn: e.target.value})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                    />
                    
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">Hindi Note Description</label>
                    <textarea 
                      rows={4} 
                      value={heading.note_desc_hn} 
                      onChange={(e) => setHeading({...heading, note_desc_hn: e.target.value})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Table Heading Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#631012]">Charges Table Heading</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">English Table Heading</label>
                    <input 
                      type="text" 
                      value={heading.fees_title_en} 
                      onChange={(e) => setHeading({...heading, fees_title_en: e.target.value})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">Hindi Table Heading</label>
                    <input 
                      type="text" 
                      value={heading.fees_title_hn} 
                      onChange={(e) => setHeading({...heading, fees_title_hn: e.target.value})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#631012] outline-none" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROCEDURES */}
          {activeTab === 'procedures' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Procedures Step Editor</h2>
                <button 
                  onClick={handleCreateNewSection} 
                  className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                  <Plus size={18} /> Add New Procedure Section
                </button>
              </div>

              {sections.length === 0 ? (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                  No procedure sections found. Click button to create one!
                </div>
              ) : (
                sections.map((section, sIdx) => {
                  const sectionSteps = procedures
                    .filter(p => p.section_title_en === section.en)
                    .sort((a, b) => a.step_order - b.step_order);

                  return (
                    <div key={sIdx} className="p-6 border border-gray-200 bg-white rounded-2xl space-y-6 shadow-sm hover:shadow transition-shadow">
                      {/* Section Heading Inputs */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                          <div>
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Section Title (English)</label>
                            <input 
                              value={section.en} 
                              onChange={(e) => handleRenameSection(section.en, e.target.value, section.hn)} 
                              className="text-lg font-bold text-[#631012] outline-none border-b border-transparent focus:border-[#631012] w-full" 
                              placeholder="Procedure Section (EN)" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Section Title (Hindi)</label>
                            <input 
                              value={section.hn} 
                              onChange={(e) => handleRenameSection(section.en, section.en, e.target.value)} 
                              className="text-lg font-bold text-[#631012] outline-none border-b border-transparent focus:border-[#631012] w-full" 
                              placeholder="Procedure Section (HI)" 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Steps Container */}
                      <div className="space-y-4">
                        {sectionSteps.map((step) => (
                          <div key={step.id} className="p-4 bg-gray-50 rounded-xl relative group border border-gray-100">
                            {/* Remove Step Trigger */}
                            <button 
                              onClick={() => handleRemoveProcedureStep(step.id)} 
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete Step"
                            >
                              <Trash2 size={16} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                              <div className="md:col-span-1">
                                <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Order</label>
                                <input 
                                  type="number"
                                  value={step.step_order} 
                                  onChange={(e) => handleUpdateProcedure(step.id, 'step_order', parseInt(e.target.value) || 0)} 
                                  className="px-2 py-1.5 border rounded text-sm w-full outline-none focus:ring-1 focus:ring-[#631012]" 
                                  placeholder="#" 
                                />
                              </div>
                              <div className="md:col-span-11 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">English Step Description</label>
                                  <textarea 
                                    rows={2}
                                    value={step.step_text_en} 
                                    onChange={(e) => handleUpdateProcedure(step.id, 'step_text_en', e.target.value)} 
                                    className="w-full px-3 py-1.5 border rounded text-sm outline-none focus:ring-1 focus:ring-[#631012]" 
                                    placeholder="Enter instructions in English..." 
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Hindi Step Description</label>
                                  <textarea 
                                    rows={2}
                                    value={step.step_text_hn} 
                                    onChange={(e) => handleUpdateProcedure(step.id, 'step_text_hn', e.target.value)} 
                                    className="w-full px-3 py-1.5 border rounded text-sm outline-none focus:ring-1 focus:ring-[#631012]" 
                                    placeholder="निर्देश हिंदी में दर्ज करें..." 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <button 
                          onClick={() => handleAddProcedureStep(section.en, section.hn)} 
                          className="w-full py-3 border border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-[#631012] hover:text-[#631012] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                        >
                          <Plus size={16} /> Add Step to: {section.en}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: FEES */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">Certificate and Document Fees List</h2>
                <button 
                  onClick={handleAddFeeItem} 
                  className="bg-[#631012] hover:bg-[#7a1214] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                >
                  <Plus size={18} /> Add Fee Record
                </button>
              </div>

              {fees.length === 0 ? (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                  No certificate fees found. Click the button to add a record!
                </div>
              ) : (
                <div className="space-y-3">
                  {fees.map((feeItem, idx) => (
                    <div key={feeItem.id} className="p-4 bg-gray-50 rounded-xl relative group border border-gray-100 shadow-sm">
                      <button 
                        onClick={() => handleRemoveFeeItem(feeItem.id)} 
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Fee Record"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <div className="md:col-span-1">
                          <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Sl No</label>
                          <input 
                            value={feeItem.sl_no} 
                            onChange={(e) => handleUpdateFee(feeItem.id, 'sl_no', e.target.value)} 
                            className="px-2 py-1.5 border rounded text-sm w-full outline-none focus:ring-1 focus:ring-[#631012]" 
                            placeholder="e.g. 1" 
                          />
                        </div>
                        <div className="md:col-span-4">
                          <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Certificate Name (English)</label>
                          <input 
                            value={feeItem.name_en} 
                            onChange={(e) => handleUpdateFee(feeItem.id, 'name_en', e.target.value)} 
                            className="px-3 py-1.5 border rounded text-sm w-full outline-none focus:ring-1 focus:ring-[#631012]" 
                            placeholder="Bonafide Certificate" 
                          />
                        </div>
                        <div className="md:col-span-5">
                          <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Certificate Name (Hindi)</label>
                          <input 
                            value={feeItem.name_hn} 
                            onChange={(e) => handleUpdateFee(feeItem.id, 'name_hn', e.target.value)} 
                            className="px-3 py-1.5 border rounded text-sm w-full outline-none focus:ring-1 focus:ring-[#631012]" 
                            placeholder="बोनाफाइड प्रमाण पत्र" 
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] uppercase text-gray-400 font-bold mb-1">Fee Charge</label>
                          <input 
                            value={feeItem.fee} 
                            onChange={(e) => handleUpdateFee(feeItem.id, 'fee', e.target.value)} 
                            className="px-3 py-1.5 border rounded text-sm w-full outline-none focus:ring-1 focus:ring-[#631012] font-semibold text-[#631012]" 
                            placeholder="₹500 / $100 / 0" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
