'use client';

import React, { useState } from 'react';

// --- Types ---
interface QueryResult {
  [key: string]: string | number | boolean;
}

// --- Mock Data ---
const MOCK_RESULTS: QueryResult[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    role: 'Professor',
    department: 'Computer Science',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Bob Smith',
    role: 'Assistant',
    department: 'Mechanical',
    status: 'On Leave',
  },
  {
    id: 3,
    name: 'Charlie Brown',
    role: 'Lecturer',
    department: 'Mathematics',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Diana Prince',
    role: 'Head of Dept',
    department: 'Physics',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Evan Wright',
    role: 'Admin',
    department: 'Registrar',
    status: 'Offline',
  },
];

export default function SQLQueryPage() {
  const [activeTab, setActiveTab] = useState('category');
  const [searchTerm, setSearchTerm] = useState('');
  const [results] = useState<QueryResult[] | null>(MOCK_RESULTS); // Default showing results for demo

  // Updated Tabs Configuration based on your request
  const tabs = [
    { id: 'category', label: 'Category' },
    { id: 'role_position', label: 'Role_position' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'faculty_role', label: 'faculty_role_assignment' },
  ];

  const handleSearch = () => {
    // Mock Search Logic
    console.log('Searching for:', searchTerm);
    // You would filter your results here
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6 bg-gray-50 min-h-screen font-sans">
      {/* 1. Top Banner (Red Gradient) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#631012] via-[#7a1214] to-[#921b1e] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-[#631012]/10 mb-6">
        <div className="absolute top-0 right-0 -translate-y-8 translate-x-1/4 opacity-10 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-64 h-64"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </div>
        <div className="absolute -bottom-8 -left-8 opacity-20 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-32 h-32"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                <path d="M3 12A9 3 0 0 0 21 12" />
              </svg>
              <span>Database Interface</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              SQL Console
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-xl leading-relaxed">
              Execute queries, search through tables, and manage database records directly from the interface.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Header Card (Search Panel) */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left Side: Title & Status */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="bg-[#631012]/10 p-2 sm:p-3 rounded-full text-[#631012] flex-shrink-0">
              {/* Search Icon (Large) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 sm:w-7 sm:h-7"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-[#171717]">
                Data Search
              </h1>
              <p className="text-sm text-[#171717]/60 mt-0.5">
                Target:{' '}
                <span className="font-semibold text-[#631012]">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </span>
              </p>
            </div>
          </div>

          {/* Right Side: Search Input & Button */}
          <div className="w-full lg:flex-1 lg:max-w-2xl flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 group">
              {/* Internal Search Icon */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/40 group-focus-within:text-[#631012] transition-colors pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search in ${tabs.find((t) => t.id === activeTab)?.label}...`}
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-[#171717]/20 rounded-lg outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all text-[#171717] placeholder:text-[#171717]/40 bg-gray-50 focus:bg-white"
              />

              {/* Clear (X) Icon */}
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#171717]/40 hover:text-[#631012] transition-colors p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button
              onClick={handleSearch}
              className="bg-[#631012] hover:bg-[#7a1214] text-white px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-colors shadow-md active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Content Area (Tabs & Results) */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tab Navigation */}
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
                      ? 'bg-[#631012] text-white border-b-2 border-[#631012]'
                      : 'text-[#171717]/70 hover:bg-[#F9F9F9] hover:text-[#171717]'
                  }
                `}
              >
                {/* Generic Table Icon for Tabs */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <line x1="3" x2="21" y1="9" y2="9" />
                  <line x1="3" x2="21" y1="15" y2="15" />
                  <line x1="9" x2="9" y1="9" y2="21" />
                  <line x1="15" x2="15" y1="9" y2="21" />
                </svg>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Results Area (Visible at the bottom) */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#171717] flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-[#631012]"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Results: {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            {results && (
              <span className="text-xs bg-[#631012]/10 text-[#631012] px-2 py-1 rounded font-medium">
                {results.length} records found
              </span>
            )}
          </div>

          {/* Table */}
          {results ? (
            <div className="bg-white rounded-lg border border-[#171717]/10 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#171717]/80">
                  <thead className="bg-[#F9F9F9] text-[#171717] font-semibold border-b border-[#171717]/10">
                    <tr>
                      {Object.keys(results[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 whitespace-nowrap uppercase text-xs tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#171717]/10 bg-white">
                    {results.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-[#631012]/5 transition-colors"
                      >
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-6 py-4 whitespace-nowrap">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 border-2 border-dashed border-[#171717]/10 rounded-lg text-center bg-[#F9F9F9]">
              <p className="text-[#171717]/40 text-sm font-medium">
                No results found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
