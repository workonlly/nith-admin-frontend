'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  Upload,
  UserCheck,
  Building,
  Mail,
  Phone,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

interface SenateMember {
  id: string;
  name: string;
  designation: string;
  affiliation: string;
  position: string;
  email: string;
  contactPhone?: string;
  contact_phone?: string;
  photo?: string;
  imageUrl?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function SenateCompositionAdminPage() {
  const [members, setMembers] = useState<SenateMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formPosition, setFormPosition] = useState('');
  const [formDesignation, setFormDesignation] = useState('');
  const [formAffiliation, setFormAffiliation] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPhoto, setFormPhoto] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/senate/members`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setMembers(Array.isArray(data) ? data : data.data || []);
      }
    } catch (err) {
      console.error('Error fetching senate members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormName('');
    setFormPosition('Member, Senate');
    setFormDesignation('Professor');
    setFormAffiliation('National Institute of Technology Hamirpur (HP)');
    setFormEmail('');
    setFormPhone('');
    setFormPhoto('');
    setFile(null);
    setModalOpen(true);
  };

  const openEditModal = (item: SenateMember) => {
    setEditingId(item.id);
    setFormName(item.name || '');
    setFormPosition(item.position || '');
    setFormDesignation(item.designation || '');
    setFormAffiliation(item.affiliation || '');
    setFormEmail(item.email || '');
    setFormPhone(item.contactPhone || item.contact_phone || '');
    setFormPhoto(item.photo || item.imageUrl || '');
    setFile(null);
    setModalOpen(true);
  };

  const handleFileUpload = async (fileToUpload: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', fileToUpload);
    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    const json = await res.json();
    if (json.success && json.url) {
      return json.url;
    }
    throw new Error(json.error || 'File upload failed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please enter member name');
      return;
    }

    try {
      setSubmitting(true);
      let photoUrl = formPhoto.trim();

      if (file) {
        photoUrl = await handleFileUpload(file);
      }

      const payload = {
        name: formName.trim(),
        position: formPosition.trim(),
        designation: formDesignation.trim(),
        affiliation: formAffiliation.trim(),
        email: formEmail.trim(),
        contactPhone: formPhone.trim(),
        photo: photoUrl,
      };

      let res;
      if (editingId) {
        res = await fetch(`${API_BASE}/senate/members/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API_BASE}/senate/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(editingId ? 'Senate member updated!' : 'Senate member added!');
        setModalOpen(false);
        fetchMembers();
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(errJson.error || 'Failed to save member');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error saving member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this senate member?')) return;
    try {
      const res = await fetch(`${API_BASE}/senate/members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMembers();
      } else {
        alert('Failed to delete member');
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
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Composition of Senate - Members Manager
              </h1>
              <p className="text-xs text-gray-500">
                Manage the Chairman, external experts, Deans, and Senate members of NIT Hamirpur.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchMembers}
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
              <span>Add Senate Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Members Grid / Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-sm uppercase tracking-wider">
            Current Senate Composition ({members.length})
          </h2>
          <span className="text-xs text-gray-500 font-mono">
            Displays with photos and position highlights
          </span>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#631012] mb-2" />
              Loading senate members...
            </div>
          ) : members.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No Senate members added yet. Click "Add Senate Member" to add one.
            </div>
          ) : (
            members.map((m, idx) => {
              const photoSrc = m.photo || m.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

              return (
                <div key={m.id || idx} className="p-5 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                  <div className="flex items-start gap-4 flex-grow">
                    <img
                      src={photoSrc}
                      alt={m.name}
                      className="w-20 h-20 rounded-lg object-cover border border-gray-300 shadow-sm shrink-0 bg-gray-100"
                    />
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-[#631012]">
                        {m.position || 'Member, Senate'}
                      </div>
                      <div className="text-base font-bold text-gray-900">
                        {m.name}
                      </div>
                      <div className="text-xs font-medium text-gray-600">
                        {m.designation}
                      </div>
                      <div className="text-xs text-gray-500 whitespace-pre-line leading-relaxed">
                        {m.affiliation}
                      </div>
                      {(m.email || m.contactPhone) && (
                        <div className="text-[11px] text-gray-500 font-mono pt-1">
                          {m.email && <span>{m.email}</span>}
                          {m.email && m.contactPhone && <span> • </span>}
                          {m.contactPhone && <span>{m.contactPhone}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => openEditModal(m)}
                      className="px-3 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="px-3 py-1.5 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="text-base font-bold">
                {editingId ? 'Edit Senate Member' : 'Add Senate Member'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Position / Role Title (Maroon Header) *
                </label>
                <input
                  type="text"
                  required
                  value={formPosition}
                  onChange={(e) => setFormPosition(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] font-semibold text-[#631012]"
                  placeholder="e.g. Ex-officio, Chairman of the Senate / Representing the field of Humanities"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Full Name with Title *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012] font-bold text-gray-900"
                  placeholder="e.g. Prof. Hiralal Murlidhar Suryawanshi"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Designation *
                </label>
                <input
                  type="text"
                  required
                  value={formDesignation}
                  onChange={(e) => setFormDesignation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="e.g. Director / Professor"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">
                  Department / Affiliation / Address *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formAffiliation}
                  onChange={(e) => setFormAffiliation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="e.g. Humanities & Social Sciences Department&#10;IIT Roorkee, Roorkee"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                    placeholder="email@domain.ac.in"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded"
                    placeholder="+91-..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase text-gray-600 block">
                  Member Photo (Upload Image or Enter URL)
                </label>
                <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center space-y-1 bg-gray-50">
                  <Upload size={20} className="mx-auto text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="text-xs text-gray-600"
                  />
                </div>
                <input
                  type="text"
                  value={formPhoto}
                  onChange={(e) => setFormPhoto(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#631012]"
                  placeholder="Or enter Image URL: https://..."
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
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
                  <span>{submitting ? 'Saving...' : editingId ? 'Update Member' : 'Add Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
