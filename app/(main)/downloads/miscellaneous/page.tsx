'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  FileText,
  FolderOpen,
  Paperclip,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
} from 'lucide-react';

// 1. Define Types
interface UgTableItem {
  id: number;
  title: string;
  particulars: string;
  form_type: string;
  name: string;
  file_url: string;
  word_url?: string;
  created_at: string;
  category: string;
}

const FALLBACK_DOCUMENTS: UgTableItem[] = [
  {
    id: 1,
    title: 'miscellaneous',
    particulars: 'General Notice',
    form_type: 'PDF',
    name: 'Administration',
    file_url: '#',
    created_at: new Date().toISOString(),
    category: 'misc',
  },
  {
    id: 2,
    title: 'miscellaneous',
    particulars: 'Event Circular',
    form_type: 'PDF',
    name: 'Dean Student Welfare',
    file_url: '#',
    created_at: new Date().toISOString(),
    category: 'misc',
  },
];

export default function MiscDownloadPage() {
  const API_BASE = `http://${process.env.NEXT_PUBLIC_URL || 'localhost:4000'}/downloads`;
  const CATEGORY = 'misc';
  const FIXED_TITLE = 'miscellaneous'; // The mandatory title

  // 2. State Management
  const [documents, setDocuments] = useState<UgTableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const wordInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: FIXED_TITLE, // Default to fixed title
    particulars: '',
    form_type: '',
    name: '',
  });

  // 3. Fetch Data & Filter by Title
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // Fetch by category 'misc'
      const res = await fetch(`${API_BASE}?category=${CATEGORY}`);
      if (!res.ok) throw new Error('Failed to fetch documents');

      const data: UgTableItem[] = await res.json();

      // --- FILTER LOGIC ---
      // Only keep rows where title is exactly 'Miscellaneous' (case-insensitive check)
      const filteredData = data.filter(
        (doc) => doc.title.toLowerCase() === FIXED_TITLE.toLowerCase()
      );

      setDocuments(filteredData);
    } catch (err) {
      console.error(err);
      setDocuments(
        FALLBACK_DOCUMENTS.filter(
          (doc) => doc.title.toLowerCase() === FIXED_TITLE.toLowerCase()
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // 4. Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (doc: UgTableItem) => {
    setFormData({
      title: doc.title,
      particulars: doc.particulars,
      form_type: doc.form_type,
      name: doc.name,
    });
    setIsEditing(doc.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      alert('Document deleted successfully');
    } catch (err) {
      console.error(err);
      alert('Error deleting document');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('category', CATEGORY);
      data.append('title', FIXED_TITLE); // Always send fixed title
      data.append('particulars', formData.particulars);
      data.append('form_type', formData.form_type);
      data.append('name', formData.name);

      if (pdfInputRef.current?.files?.[0]) {
        data.append('pdf_file', pdfInputRef.current.files[0]);
      }
      if (wordInputRef.current?.files?.[0]) {
        data.append('word_file', wordInputRef.current.files[0]);
      }

      let res;
      if (isEditing) {
        res = await fetch(`${API_BASE}/${isEditing}`, {
          method: 'PUT',
          body: data,
        });
      } else {
        if (!pdfInputRef.current?.files?.[0]) {
          alert('Please select a PDF file to upload.');
          setSubmitting(false);
          return;
        }
        res = await fetch(API_BASE, {
          method: 'POST',
          body: data,
        });
      }

      if (!res.ok) throw new Error('Operation failed');

      await fetchDocuments();
      cancelEdit();
      alert(
        isEditing
          ? 'Document updated successfully'
          : 'Document added successfully'
      );
    } catch (err: Error | unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : 'Error saving document';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setFormData({
      title: FIXED_TITLE,
      particulars: '',
      form_type: '',
      name: '',
    });
    if (pdfInputRef.current) pdfInputRef.current.value = '';
    if (wordInputRef.current) wordInputRef.current.value = '';
    setShowForm(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      {/* --- Top Banner --- */}
      <div className="bg-gradient-to-r from-[#631012] to-[#7a1214] rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-white">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <FolderOpen className="w-6 h-6 sm:w-8 sm:h-8" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
            Miscellaneous Downloads
          </h1>
        </div>
        <p className="text-sm sm:text-base text-white/90">
          Manage general documents, reports, and forms
        </p>
      </div>

      {/* --- Main Content Card --- */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header inside Card */}
        <div className="p-4 sm:p-6 border-b border-[#171717]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#631012]/10 p-2 rounded-full text-[#631012]">
              <Paperclip size={20} />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#171717]">
              General Documents
            </h2>
          </div>
          <button
            onClick={() => {
              if (showForm) cancelEdit();
              else setShowForm(true);
            }}
            className="flex items-center gap-2 bg-[#631012] text-white px-4 py-2 rounded-lg hover:bg-[#7a1214] transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            {showForm && !isEditing ? 'Close Form' : 'Add New Document'}
          </button>
        </div>

        {/* --- ADD/EDIT FORM SECTION --- */}
        {showForm && (
          <div className="p-4 sm:p-6 bg-gray-50 border-b border-[#171717]/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#171717] text-lg">
                {isEditing ? 'Edit Document' : 'Add New Document'}
              </h3>
              <button
                onClick={cancelEdit}
                className="text-gray-500 hover:text-red-600"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Title: Read-Only */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  readOnly
                  className="w-full p-2 border border-gray-200 bg-gray-100 text-gray-500 rounded focus:outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
                  Particulars
                </label>
                <input
                  type="text"
                  name="particulars"
                  value={formData.particulars}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
                  placeholder="e.g. Official Report"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
                  Form Type
                </label>
                <input
                  type="text"
                  name="form_type"
                  value={formData.form_type}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
                  placeholder="e.g. PDF / Doc"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
                  Name / Dept
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#631012] focus:border-transparent outline-none"
                  placeholder="e.g. Admin Dept"
                />
              </div>

              {/* FILE UPLOADS */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
                  Upload PDF{' '}
                  {isEditing && (
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={pdfInputRef}
                  required={!isEditing}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
                  Upload Word Doc{' '}
                  {isEditing && (
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  accept=".doc,.docx"
                  ref={wordInputRef}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#631012] text-white rounded hover:bg-[#7a1214] transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  {isEditing ? 'Update Document' : 'Save Document'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- DATA TABLE SECTION --- */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading documents...
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Particulars</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Dept/Name</th>
                  <th className="p-4 font-semibold text-center">Downloads</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="p-4 text-sm font-medium text-gray-900">
                        {doc.title}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {doc.particulars}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {doc.form_type}
                      </td>
                      <td className="p-4 text-sm text-gray-600">{doc.name}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {doc.file_url && (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 hover:text-red-800"
                              title="Download PDF"
                            >
                              <FileText size={18} />
                            </a>
                          )}
                          {doc.word_url && (
                            <a
                              href={doc.word_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                              title="Download Word Doc"
                            >
                              <Download size={18} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(doc)}
                            className="p-1.5 text-gray-400 hover:text-[#631012] hover:bg-[#631012]/5 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400">
                      No documents with title &quot;Miscellaneous&quot; found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
