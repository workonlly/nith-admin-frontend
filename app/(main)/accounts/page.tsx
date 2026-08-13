'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Faculty {
  faculty_id: string;
  name_en: string;
  name_hi: string;
  role_en: string;
  role_hi: string;
  designation_en: string;
  designation_hi: string;
  department_en: string;
  department_hi: string;
  email: string;
  phone_no: string;
  since_date_en: string;
  since_date_hi: string;
  end_date_en: string;
  end_date_hi: string;
  status: string;
  tag: string;
}

export default function FacultyAccountsPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<Faculty>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  // UI States
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFaculties = async () => {
    try {
      const res = await fetch(`${API_URL}/api/faculties`);
      if (res.ok) {
        const data = await res.json();
        setFaculties(data);
      }
    } catch (err) {
      console.error('Failed to fetch faculties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `${API_URL}/api/faculties/${formData.faculty_id}` 
        : `${API_URL}/api/faculties`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage(`Faculty ${isEditing ? 'updated' : 'added'} successfully!`);
        fetchFaculties();
        setShowModal(false); // Close modal on success
      } else {
        setMessage('Failed to save faculty.');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (faculty: Faculty) => {
    setFormData(faculty);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setFormData({});
    setIsEditing(false);
    setShowModal(true);
  };

  const handleDelete = async (faculty_id: string) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      const res = await fetch(`${API_URL}/api/faculties/${faculty_id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchFaculties();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFaculties = faculties.filter(fac => 
    fac.name_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fac.faculty_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fac.department_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-lg shadow-lg p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Faculty Management</h1>
          <p className="text-white/90 mt-1">Manage faculty records comprehensively.</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-white text-[#631012] px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add New Faculty
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4 sm:p-5 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <h3 className="font-bold text-lg text-gray-800">Directory List</h3>
            <span className="bg-[#631012] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-inner">{filteredFaculties.length} Records</span>
          </div>
          
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Search by Name, ID, or Dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all shadow-sm"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="overflow-x-auto max-h-[70vh]">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-medium">Loading faculties...</div>
          ) : filteredFaculties.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-medium">No faculties found matching your search.</div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 shadow-sm z-10">
                <tr>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Faculty ID</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Name</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Role</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Department</th>
                  <th className="px-6 py-4 font-semibold whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFaculties.map((fac) => (
                  <tr key={fac.faculty_id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-[#631012] font-semibold whitespace-nowrap">{fac.faculty_id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{fac.name_en}</td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{fac.role_en}</td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">{fac.department_en}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-[10px] uppercase font-bold rounded-full border ${fac.status?.toLowerCase() === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {fac.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button onClick={() => handleEdit(fac)} className="text-[#631012] hover:bg-[#631012]/10 px-3 py-1.5 rounded transition-colors mr-2 font-medium">Edit</button>
                      <button onClick={() => handleDelete(fac.faculty_id)} className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded transition-colors font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 sm:p-6 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-full flex flex-col animate-in fade-in zoom-in duration-200 my-auto">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl sticky top-0 z-10">
              <h2 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Faculty Member' : 'Add New Faculty Member'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-2 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {message && (
                <div className={`px-4 py-3 rounded-lg mb-6 text-sm font-medium ${message.includes('error') || message.includes('Failed') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                  {message}
                </div>
              )}

              <form id="facultyForm" onSubmit={handleSubmit} className="space-y-6">


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Name (English) <span className="text-red-500">*</span></label>
                    <input required type="text" name="name_en" value={formData.name_en || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Name (Hindi) <span className="text-red-500">*</span></label>
                    <input required type="text" name="name_hi" value={formData.name_hi || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Role (English) <span className="text-red-500">*</span></label>
                    <input required type="text" name="role_en" value={formData.role_en || ''} onChange={handleChange} placeholder="e.g. Professor" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Role (Hindi) <span className="text-red-500">*</span></label>
                    <input required type="text" name="role_hi" value={formData.role_hi || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Designation (English) <span className="text-red-500">*</span></label>
                    <input required type="text" name="designation_en" value={formData.designation_en || ''} onChange={handleChange} placeholder="e.g. Head of Department" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Designation (Hindi) <span className="text-red-500">*</span></label>
                    <input required type="text" name="designation_hi" value={formData.designation_hi || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department (English) <span className="text-red-500">*</span></label>
                    <input required type="text" name="department_en" value={formData.department_en || ''} onChange={handleChange} placeholder="e.g. Computer Science" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department (Hindi) <span className="text-red-500">*</span></label>
                    <input required type="text" name="department_hi" value={formData.department_hi || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                    <input required type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <input required type="text" name="phone_no" value={formData.phone_no || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Since Date (English) <span className="text-red-500">*</span></label>
                    <input required type="text" name="since_date_en" value={formData.since_date_en || ''} onChange={handleChange} placeholder="YYYY-MM-DD" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Since Date (Hindi) <span className="text-red-500">*</span></label>
                    <input required type="text" name="since_date_hi" value={formData.since_date_hi || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">End Date (English) <span className="text-red-500">*</span></label>
                    <input required type="text" name="end_date_en" value={formData.end_date_en || ''} onChange={handleChange} placeholder="YYYY-MM-DD or Present" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">End Date (Hindi) <span className="text-red-500">*</span></label>
                    <input required type="text" name="end_date_hi" value={formData.end_date_hi || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
                    <select required name="status" value={formData.status || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all bg-white">
                      <option value="" disabled>Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tag <span className="text-red-500">*</span></label>
                    <select required name="tag" value={formData.tag || ''} onChange={handleChange} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#631012] focus:border-transparent transition-all bg-white">
                      <option value="" disabled>Select Tag</option>
                      <option value="Admin">Admin</option>
                      <option value="Normal">Normal</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl sticky bottom-0 z-10">
              <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-gray-700 font-semibold hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" form="facultyForm" disabled={isSubmitting} className="bg-[#631012] text-white px-8 py-2.5 rounded-lg font-bold shadow-md hover:bg-[#7a1214] transition-colors disabled:opacity-70 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  isEditing ? 'Save Changes' : 'Add Faculty Member'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
