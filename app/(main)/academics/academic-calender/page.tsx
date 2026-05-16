'use client';

import React, { useState, useEffect } from 'react';
import { Save, Calendar, Plus, Trash2, Download } from 'lucide-react';

interface SemesterCalendar {
  id?: number;
  title: string;
  description: string;
  pdf_url: string;
  view_url: string;
}

export default function AcademicCalendarPage() {
  const [calendars, setCalendars] = useState<SemesterCalendar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/academics/calendars');
      const json = await res.json();
      if (json.success) setCalendars(json.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSave = async (calendar: SemesterCalendar) => {
    const method = calendar.id ? 'PUT' : 'POST';
    const url = calendar.id 
      ? `http://localhost:5000/api/v1/academics/calendars/${calendar.id}`
      : 'http://localhost:5000/api/v1/academics/calendars';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(calendar)
      });
      const json = await res.json();
      if (json.success) {
        alert('Saved successfully!');
        fetchCalendars();
      }
    } catch (err) {
      alert('Error saving');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this calendar?')) return;
    try {
      await fetch(`http://localhost:5000/api/v1/academics/calendars/${id}`, { method: 'DELETE' });
      setCalendars(calendars.filter(c => c.id !== id));
    } catch (err) {
      alert('Error deleting');
    }
  };

  const addEmptyCalendar = () => {
    setCalendars([{ title: '', description: '', pdf_url: '#', view_url: '#' }, ...calendars]);
  };

  if (loading) return <div className="p-8 text-black">Loading Calendars...</div>;

  return (
    <div className="space-y-6 p-4 lg:p-8 text-black bg-[#F8F9FA] min-h-screen">
      <div className="bg-gradient-to-r from-[#631012] to-[#800000] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-2">
          <Calendar className="w-10 h-10" />
          <h1 className="text-3xl font-extrabold tracking-tight">Academic Calendars</h1>
        </div>
        <p className="text-white/80 text-lg">Manage semester schedules and important dates</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={addEmptyCalendar}
          className="w-full py-4 border-2 border-dashed border-[#631012] rounded-xl text-[#631012] hover:bg-[#631012]/5 transition-all flex items-center justify-center gap-2 font-bold bg-white"
        >
          <Plus size={24} /> Add New Semester Calendar
        </button>

        {calendars.map((calendar, index) => (
          <div key={calendar.id || `new-${index}`} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Calendar Title</label>
                <input
                  type="text"
                  value={calendar.title}
                  onChange={e => {
                    const next = [...calendars];
                    next[index].title = e.target.value;
                    setCalendars(next);
                  }}
                  className="w-full p-2 border rounded font-bold text-black"
                  placeholder="e.g. Odd Semester 2025–26"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Short Description</label>
                <textarea
                  value={calendar.description}
                  onChange={e => {
                    const next = [...calendars];
                    next[index].description = e.target.value;
                    setCalendars(next);
                  }}
                  className="w-full p-2 border rounded text-black"
                  rows={2}
                  placeholder="Details about this calendar"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">PDF View URL</label>
                <input
                  type="text"
                  value={calendar.view_url}
                  onChange={e => {
                    const next = [...calendars];
                    next[index].view_url = e.target.value;
                    setCalendars(next);
                  }}
                  className="w-full p-2 border rounded text-black"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">PDF Download URL</label>
                <input
                  type="text"
                  value={calendar.pdf_url}
                  onChange={e => {
                    const next = [...calendars];
                    next[index].pdf_url = e.target.value;
                    setCalendars(next);
                  }}
                  className="w-full p-2 border rounded text-black"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end border-t pt-4">
              <button
                onClick={() => handleSave(calendar)}
                className="bg-[#631012] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#800000] transition-colors font-bold"
              >
                <Save size={18} /> {calendar.id ? 'Update Calendar' : 'Save Calendar'}
              </button>
              {calendar.id && (
                <button
                  onClick={() => handleDelete(calendar.id!)}
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
