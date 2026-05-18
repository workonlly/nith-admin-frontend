'use client';

import React, { useState, useEffect } from 'react';
import { Save, Users, Plus, Trash2, FileText, UserCircle } from 'lucide-react';

type TabType = 'hero' | 'sections';

export default function FunctionariesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState({
    title_en: 'Functionaries',
    title_hi: 'पदाधिकारी',
    description_en: 'Key academic administrative authorities and supporting staff of the Institute.',
    description_hi: 'संस्थान के प्रमुख शैक्षणिक प्रशासनिक अधिकारी और सहायक कर्मचारी।'
  });

  const isHindi = (text: string) => /[\u0900-\u097F]/.test(text || '');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch Hero
      const resHero = await fetch('http://localhost:5000/api/v1/academics/overview?page_name=functionaries');
      const jsonHero = await resHero.json();
      if (jsonHero.success && jsonHero.data.length > 0) {
        setHeroData({
          title_en: jsonHero.data[0].title_en || 'Functionaries',
          title_hi: jsonHero.data[0].title_hi || 'पदाधिकारी',
          description_en: jsonHero.data[0].description_en || '',
          description_hi: jsonHero.data[0].description_hi || ''
        });
      }

      // Fetch Members
      const resMembers = await fetch('http://localhost:5000/api/v1/academics/tables');
      const jsonMembers = await resMembers.json();
      if (jsonMembers.success) {
        const mapped = jsonMembers.data.map((m: any) => ({
          ...m,
          name_en: isHindi(m.name) ? '' : m.name,
          name_hi: isHindi(m.name) ? m.name : '',
          responsibility_en: isHindi(m.responsibility) ? '' : m.responsibility,
          responsibility_hi: isHindi(m.responsibility) ? m.responsibility : ''
        }));
        setMembers(mapped);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSaveHero = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/academics/overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_name: 'functionaries',
          title_en: heroData.title_en,
          title_hi: heroData.title_hi,
          description_en: heroData.description_en,
          description_hi: heroData.description_hi,
          content: {}
        })
      });
      const json = await res.json();
      if (json.success) alert('Hero updated!');
      else alert('Error: ' + json.message);
    } catch (err) {
      alert('Error saving hero');
    }
  };

  const handleAddMember = async (tableName: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/academics/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_name: tableName,
          name: 'New Member',
          responsibility: 'Staff',
          email: '',
          phone: ''
        })
      });
      const json = await res.json();
      if (json.success) {
        const newMember = {
          ...json.data,
          name_en: isHindi(json.data.name) ? '' : json.data.name,
          name_hi: isHindi(json.data.name) ? json.data.name : '',
          responsibility_en: isHindi(json.data.responsibility) ? '' : json.data.responsibility,
          responsibility_hi: isHindi(json.data.responsibility) ? json.data.responsibility : ''
        };
        setMembers([...members, newMember]);
      }
    } catch (err) {
      alert('Error adding member');
    }
  };

  const handleUpdateMember = async (id: number, updatedFields: any) => {
    try {
      const member = members.find(m => m.id === id);
      const merged = { ...member, ...updatedFields };
      const payload = {
        ...merged,
        name: merged.name_hi || merged.name_en || merged.name,
        responsibility: merged.responsibility_hi || merged.responsibility_en || merged.responsibility
      };
      const res = await fetch(`http://localhost:5000/api/v1/academics/tables/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success) {
        const updated = {
          ...json.data,
          name_en: isHindi(json.data.name) ? '' : json.data.name,
          name_hi: isHindi(json.data.name) ? json.data.name : '',
          responsibility_en: isHindi(json.data.responsibility) ? '' : json.data.responsibility,
          responsibility_hi: isHindi(json.data.responsibility) ? json.data.responsibility : ''
        };
        setMembers(members.map(m => m.id === id ? updated : m));
      }
    } catch (err) {
      alert('Error updating member');
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/academics/tables/${id}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        setMembers(members.filter(m => m.id !== id));
      }
    } catch (err) {
      alert('Error deleting member');
    }
  };

  // Grouping for display
  const sections = members.reduce((acc: any[], curr: any) => {
    const section = acc.find(s => s.title === curr.table_name);
    if (section) {
      section.members.push(curr);
    } else {
      acc.push({ title: curr.table_name, members: [curr] });
    }
    return acc;
  }, []);

  const tabs = [
    {
      id: 'hero' as TabType,
      label: 'Hero Section',
      icon: <FileText size={18} />,
    },
    {
      id: 'sections' as TabType,
      label: 'Functionary Sections',
      icon: <UserCircle size={18} />,
    },
  ];

  if (loading) return <div className="p-8 text-black font-bold">Loading Editor...</div>;

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-[#631012]/10 p-2 sm:p-3 rounded-full text-[#631012] flex-shrink-0">
              <Users className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#171717] break-words">
                Functionaries Editor
              </h1>
              <p className="text-sm sm:text-base text-[#171717]/60 mt-1">
                Edit academic functionaries and administrative staff information
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-[#171717]/10">
          <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-[#631012]/30 scrollbar-track-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base flex-shrink-0
                  ${
                    activeTab === tab.id
                      ? 'bg-[#631012] text-white'
                      : 'text-[#171717]/70 hover:bg-[#F9F9F9] hover:text-[#171717]'
                  }
                `}
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-[#631012]">English Content</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Heading (EN)</label>
                    <input
                      type="text"
                      value={heroData.title_en}
                      onChange={(e) => setHeroData({ ...heroData, title_en: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description (EN)</label>
                    <textarea
                      rows={3}
                      value={heroData.description_en}
                      onChange={(e) => setHeroData({ ...heroData, description_en: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg text-black"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-[#631012]">Hindi Content</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Heading (HI)</label>
                    <input
                      type="text"
                      value={heroData.title_hi}
                      onChange={(e) => setHeroData({ ...heroData, title_hi: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description (HI)</label>
                    <textarea
                      rows={3}
                      value={heroData.description_hi}
                      onChange={(e) => setHeroData({ ...heroData, description_hi: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg text-black"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSaveHero}
                className="bg-[#631012] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7a1214]"
              >
                <Save size={18} /> Save Hero Section
              </button>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-8">
              {sections.map((section: any, sIdx: number) => (
                <div key={sIdx} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                    <button
                      onClick={() => handleAddMember(section.title)}
                      className="text-[#631012] flex items-center gap-1 hover:underline font-medium"
                    >
                      <Plus size={16} /> Add Member
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-white">
                        <tr>
                          <th className="px-4 py-3 text-left">Name</th>
                          <th className="px-4 py-3 text-left">Responsibility</th>
                          <th className="px-4 py-3 text-left">Email</th>
                          <th className="px-4 py-3 text-left">Phone</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {section.members.map((member: any) => (
                          <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-2 space-y-1">
                              <input
                                type="text"
                                value={member.name_en || ''}
                                onChange={(e) => handleUpdateMember(member.id, { name_en: e.target.value })}
                                className="w-full bg-transparent border-b border-gray-200 focus:border-[#631012] outline-none text-black font-medium text-xs py-0.5 bg-gray-50/50 px-1 rounded"
                                placeholder="Name (English)"
                              />
                              <input
                                type="text"
                                value={member.name_hi || ''}
                                onChange={(e) => handleUpdateMember(member.id, { name_hi: e.target.value })}
                                className="w-full bg-transparent border-b border-gray-200 focus:border-[#631012] outline-none text-[#631012] font-semibold text-xs py-0.5 bg-gray-50/50 px-1 rounded"
                                placeholder="नाम (हिंदी)"
                              />
                            </td>
                            <td className="px-4 py-2 space-y-1">
                              <input
                                type="text"
                                value={member.responsibility_en || ''}
                                onChange={(e) => handleUpdateMember(member.id, { responsibility_en: e.target.value })}
                                className="w-full bg-transparent border-b border-gray-200 focus:border-[#631012] outline-none text-gray-600 text-xs py-0.5 bg-gray-50/50 px-1 rounded"
                                placeholder="Responsibility (EN)"
                              />
                              <input
                                type="text"
                                value={member.responsibility_hi || ''}
                                onChange={(e) => handleUpdateMember(member.id, { responsibility_hi: e.target.value })}
                                className="w-full bg-transparent border-b border-gray-200 focus:border-[#631012] outline-none text-[#631012] font-medium text-xs py-0.5 bg-gray-50/50 px-1 rounded"
                                placeholder="दायित्व (हिंदी)"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={member.email}
                                onChange={(e) => handleUpdateMember(member.id, { email: e.target.value })}
                                className="w-full bg-transparent border-b border-transparent focus:border-[#631012] outline-none text-gray-600"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input
                                type="text"
                                value={member.phone}
                                onChange={(e) => handleUpdateMember(member.id, { phone: e.target.value })}
                                className="w-full bg-transparent border-b border-transparent focus:border-[#631012] outline-none text-gray-600"
                              />
                            </td>
                            <td className="px-4 py-2 text-right">
                              <button
                                onClick={() => handleDeleteMember(member.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center">
                <p className="text-gray-500 mb-4 font-medium">Create a New Functionary Category</p>
                <div className="flex gap-2 w-full max-w-md">
                  <input
                    id="new-category-name"
                    type="text"
                    placeholder="Category Name (e.g., Office of the Dean)"
                    className="flex-1 px-4 py-2 border rounded-lg text-black"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('new-category-name') as HTMLInputElement;
                      if (input.value) handleAddMember(input.value);
                    }}
                    className="bg-[#631012] text-white px-4 py-2 rounded-lg"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
