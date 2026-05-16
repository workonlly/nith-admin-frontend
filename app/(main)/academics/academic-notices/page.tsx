'use client';

import React, { useState, useEffect } from 'react';
import { Save, Bell, Plus, Trash2, FileText } from 'lucide-react';

interface Notice {
  id?: number;
  title: string;
  description: string;
  category: string;
  date: string;
  view_url: string;
  download_url: string;
}

export default function AcademicNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/academics/notices');
      const json = await res.json();
      if (json.success) setNotices(json.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSave = async (notice: Notice) => {
    const method = notice.id ? 'PUT' : 'POST';
    const url = notice.id 
      ? `http://localhost:5000/api/v1/academics/notices/${notice.id}`
      : 'http://localhost:5000/api/v1/academics/notices';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notice)
      });
      const json = await res.json();
      if (json.success) {
        alert('Saved successfully!');
        fetchNotices();
      }
    } catch (err) {
      alert('Error saving');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this notice?')) return;
    try {
      await fetch(`http://localhost:5000/api/v1/academics/notices/${id}`, { method: 'DELETE' });
      setNotices(notices.filter(n => n.id !== id));
    } catch (err) {
      alert('Error deleting');
    }
  };

  const addEmptyNotice = () => {
    setNotices([{ title: '', description: '', category: 'General', date: new Date().toLocaleDateString(), view_url: '#', download_url: '#' }, ...notices]);
  };

  if (loading) return <div className="p-8 text-black">Loading Notices...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <Bell className="w-10 h-10" />
          <h1 className="text-3xl font-extrabold tracking-tight">Academic Notices</h1>
        </div>
        <p className="text-white/80 text-lg">Manage official announcements and circulars</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={addEmptyNotice}
          className="w-full py-4 border-2 border-dashed border-[#631012] rounded-xl text-[#631012] hover:bg-[#631012]/5 transition-all flex items-center justify-center gap-2 font-bold bg-white"
        >
          <Plus size={24} /> Post New Academic Notice
        </button>

        {notices.map((notice, index) => (
          <div key={notice.id || `new-${index}`} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Notice Title</label>
                <input
                  type="text"
                  value={notice.title}
                  onChange={e => {
                    const next = [...notices];
                    next[index].title = e.target.value;
                    setNotices(next);
                  }}
                  className="w-full p-2 border rounded font-bold text-black"
                  placeholder="e.g. End Semester Schedule"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Description / Details</label>
                <textarea
                  value={notice.description}
                  onChange={e => {
                    const next = [...notices];
                    next[index].description = e.target.value;
                    setNotices(next);
                  }}
                  className="w-full p-2 border rounded text-black"
                  rows={2}
                  placeholder="Detailed information about the notice"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                <select
                  value={notice.category}
                  onChange={e => {
                    const next = [...notices];
                    next[index].category = e.target.value;
                    setNotices(next);
                  }}
                  className="w-full p-2 border rounded bg-white text-black"
                >
                  <option value="General">General</option>
                  <option value="Examination">Examination</option>
                  <option value="Admission">Admission</option>
                  <option value="Registration">Registration</option>
                  <option value="Result">Result</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Display Date</label>
                <input
                  type="text"
                  value={notice.date}
                  onChange={e => {
                    const next = [...notices];
                    next[index].date = e.target.value;
                    setNotices(next);
                  }}
                  className="w-full p-2 border rounded bg-white text-black"
                  placeholder="e.g. May 15, 2026"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">View Link (URL)</label>
                <input
                  type="text"
                  value={notice.view_url}
                  onChange={e => {
                    const next = [...notices];
                    next[index].view_url = e.target.value;
                    setNotices(next);
                  }}
                  className="w-full p-2 border rounded bg-white text-black"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Download Link (PDF URL)</label>
                <input
                  type="text"
                  value={notice.download_url}
                  onChange={e => {
                    const next = [...notices];
                    next[index].download_url = e.target.value;
                    setNotices(next);
                  }}
                  className="w-full p-2 border rounded bg-white text-black"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end border-t pt-4">
              <button
                onClick={() => handleSave(notice)}
                className="bg-[#631012] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#800000] transition-colors font-bold"
              >
                <Save size={18} /> {notice.id ? 'Update Notice' : 'Post Notice'}
              </button>
              {notice.id && (
                <button
                  onClick={() => handleDelete(notice.id!)}
                  className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
