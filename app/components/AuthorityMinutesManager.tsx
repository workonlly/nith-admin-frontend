'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  RefreshCw,
  X,
  Upload,
  Calendar,
  Loader2,
} from 'lucide-react';

interface MeetingMinute {
  id: string;
  title: string;
  meeting_date?: string;
  date?: string;
  document_url?: string;
  documentUrl?: string;
  uploaded_date?: string;
  uploaded_by?: string;
}

interface AuthorityMinutesManagerProps {
  authorityName: string;
  apiBase: string; // 'bog' | 'fc' | 'bwc' | 'senate'
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AuthorityMinutesManager({ authorityName, apiBase }: AuthorityMinutesManagerProps) {
  const [minutes, setMinutes] = useState<MeetingMinute[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formDocUrl, setFormDocUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMinutes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/${apiBase}/minutes`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setMinutes(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error(`Error fetching ${apiBase} minutes:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinutes();
  }, [apiBase]);

  const openAddModal = () => {
    setEditingId(null);
    setFormTitle('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDocUrl('');
    setFile(null);
    setModalOpen(true);
  };

  const openEditModal = (item: MeetingMinute) => {
    setEditingId(item.id);
    setFormTitle(item.title || '');
    const dateVal = item.meeting_date || item.date || '';
    setFormDate(dateVal ? new Date(dateVal).toISOString().split('T')[0] : '');
    setFormDocUrl(item.document_url || item.documentUrl || '');
    setFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please enter a meeting title');
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('title', formTitle.trim());
      formData.append('meeting_date', formDate);
      formData.append('date', formDate);
      formData.append('uploadedBy', 'Admin');

      if (file) {
        formData.append('file', file);
      } else if (formDocUrl.trim()) {
        formData.append('document_url', formDocUrl.trim());
        formData.append('documentUrl', formDocUrl.trim());
      } else if (!editingId) {
        alert('Please upload a PDF file or provide a Document URL');
        setSubmitting(false);
        return;
      }

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/${apiBase}/minutes/${editingId}`, {
          method: 'PUT',
          body: file ? formData : JSON.stringify({
            title: formTitle,
            meeting_date: formDate,
            date: formDate,
            document_url: formDocUrl,
            documentUrl: formDocUrl,
          }),
          headers: file ? undefined : { 'Content-Type': 'application/json' },
        });
      } else {
        res = await fetch(`${API_BASE}/${apiBase}/minutes`, {
          method: 'POST',
          body: file ? formData : JSON.stringify({
            title: formTitle,
            meeting_date: formDate,
            date: formDate,
            document_url: formDocUrl,
            documentUrl: formDocUrl,
          }),
          headers: file ? undefined : { 'Content-Type': 'application/json' },
        });
      }

      if (res.ok) {
        alert(editingId ? 'Minutes updated successfully!' : 'Minutes added successfully!');
        setModalOpen(false);
        fetchMinutes();
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(errJson.error || 'Failed to save meeting minutes');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving minutes');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meeting minute record?')) return;
    try {
      const res = await fetch(`${API_BASE}/${apiBase}/minutes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMinutes();
      } else {
        alert('Failed to delete minutes');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <FileText size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {authorityName} - Meeting Minutes
              </h1>
              <p className="text-xs text-gray-500">
                Upload and manage official meeting minutes, agendas, resolutions, and documents.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMinutes}
              disabled={loading}
              className="px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={openAddModal}
              className="bg-[#631012] hover:bg-[#500c0e] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>Add Meeting Minutes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Minutes Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
            All Recorded Minutes ({minutes.length})
          </h2>
          <span className="text-xs text-gray-500 font-mono">
            Direct PDF file downloads
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-gray-800 border-collapse">
            <thead className="bg-[#f0f4f8] border-b border-gray-300 text-[#0c344e] font-mono uppercase text-xs">
              <tr>
                <th className="py-3 px-4 w-20 text-center">Sl. No</th>
                <th className="py-3 px-4">Particulars</th>
                <th className="py-3 px-4 w-44 text-center">Date of Meeting</th>
                <th className="py-3 px-4 w-32 text-center">Document</th>
                <th className="py-3 px-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#631012] mb-2" />
                    Loading meeting minutes...
                  </td>
                </tr>
              ) : minutes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No meeting minutes recorded yet. Click "Add Meeting Minutes" to upload one.
                  </td>
                </tr>
              ) : (
                minutes.map((item, idx) => {
                  const docUrl = item.document_url || item.documentUrl || '#';
                  const dateStr = item.meeting_date || item.date || '';
                  const formattedDate = dateStr
                    ? new Date(dateStr).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }).replace(/\//g, '.')
                    : '-';

                  return (
                    <tr key={item.id || idx} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-gray-600">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#631012] hover:underline flex items-center gap-1.5"
                        >
                          <span>{item.title}</span>
                          <ExternalLink size={12} className="shrink-0 text-gray-400" />
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-gray-700">
                        {formattedDate}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-[#631012] rounded text-xs font-semibold border border-red-200"
                        >
                          <FileText size={12} />
                          <span>PDF</span>
                        </a>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold">
                {editingId ? 'Edit Meeting Minutes' : `Add ${authorityName} Minutes`}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Particulars / Meeting Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="e.g. 54th meeting of the Board of Governors"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Date of Meeting *
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-gray-600 block">
                  Document PDF File (Upload or URL) *
                </label>
                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center space-y-2 bg-gray-50">
                  <Upload size={24} className="mx-auto text-gray-400" />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="text-xs text-gray-600"
                  />
                  {file && (
                    <p className="text-xs font-semibold text-green-700">
                      Selected file: {file.name}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-[11px] text-gray-500 block text-center my-1">OR Enter File URL</span>
                  <input
                    type="text"
                    value={formDocUrl}
                    onChange={(e) => setFormDocUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#631012] hover:bg-[#500c0e] text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>{submitting ? 'Saving...' : editingId ? 'Update Record' : 'Save Minutes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
