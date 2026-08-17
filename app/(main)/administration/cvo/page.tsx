'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, RefreshCw, X, Save, Loader2, ExternalLink } from 'lucide-react';

interface CVOData {
  id?: number;
  name?: string;
  responsibility?: string;
  phone_no?: string;
  email?: string;
  photo?: string;
}

interface CVOLink {
  id: number;
  name: string;
  links: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function CVOAdminPage() {
  const [officer, setOfficer] = useState<CVOData>({
    name: 'Prof. Raman Parti',
    responsibility: 'Chief Vigilance Officer (CVO)',
    phone_no: '01972-254005',
    email: 'cvo@nith.ac.in',
    photo: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [links, setLinks] = useState<CVOLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingOfficer, setSavingOfficer] = useState(false);

  // Link modal
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [submittingLink, setSubmittingLink] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/administration/cvo`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.officer && data.officer.name) setOfficer(data.officer);
        if (data.links) setLinks(data.links);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingOfficer(true);
      const formData = new FormData();
      formData.append('name', officer.name || '');
      formData.append('responsibility', officer.responsibility || '');
      formData.append('phone_no', officer.phone_no || '');
      formData.append('email', officer.email || '');
      if (photoFile) formData.append('photo_file', photoFile);
      else if (officer.photo) formData.append('photo', officer.photo);

      const res = await fetch(`${API_BASE}/api/administration/cvo`, {
        method: 'PUT',
        body: formData,
      });
      if (res.ok) {
        alert('CVO profile updated!');
        fetchData();
      } else {
        alert('Failed to update');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingOfficer(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkName.trim() || !linkUrl.trim()) return;
    try {
      setSubmittingLink(true);
      const res = await fetch(`${API_BASE}/api/administration/cvo/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: linkName.trim(), links: linkUrl.trim() }),
      });
      if (res.ok) {
        setLinkModalOpen(false);
        setLinkName('');
        setLinkUrl('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingLink(false);
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (!confirm('Delete this vigilance link?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/administration/cvo/links/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6 font-sans">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#631012]/10 p-3 rounded-lg text-[#631012]">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chief Vigilance Officer Manager</h1>
              <p className="text-xs text-gray-500">
                Manage CVO officer details, contact information, and vigilance portal circular links.
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3 py-2 border rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CVO Officer Form */}
        <form onSubmit={handleSaveOfficer} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#631012] uppercase tracking-wider border-b pb-2">
            Chief Vigilance Officer Details
          </h2>

          <div className="flex items-center gap-4">
            <img
              src={officer.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'}
              alt="CVO"
              className="w-20 h-24 object-cover rounded border border-gray-300 shrink-0"
            />
            <div className="space-y-1 flex-grow">
              <label className="text-xs font-bold text-gray-600 block">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                className="text-xs text-gray-600 w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Name *</label>
            <input
              type="text"
              required
              value={officer.name || ''}
              onChange={(e) => setOfficer({ ...officer, name: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded font-bold"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Responsibility / Role</label>
            <input
              type="text"
              value={officer.responsibility || ''}
              onChange={(e) => setOfficer({ ...officer, responsibility: e.target.value })}
              className="w-full px-3 py-2 text-xs border rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Phone</label>
              <input
                type="text"
                value={officer.phone_no || ''}
                onChange={(e) => setOfficer({ ...officer, phone_no: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-gray-600 block mb-1">Email</label>
              <input
                type="email"
                value={officer.email || ''}
                onChange={(e) => setOfficer({ ...officer, email: e.target.value })}
                className="w-full px-3 py-2 text-xs border rounded"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingOfficer}
              className="w-full bg-[#631012] text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-1.5"
            >
              {savingOfficer ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save CVO Details</span>
            </button>
          </div>
        </form>

        {/* Vigilance Links Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-sm font-bold text-[#631012] uppercase tracking-wider">
              Vigilance Portals & Circulars ({links.length})
            </h2>
            <button
              onClick={() => setLinkModalOpen(true)}
              className="bg-[#631012] text-white px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1"
            >
              <Plus size={12} />
              <span>Add Link</span>
            </button>
          </div>

          <div className="divide-y">
            {links.map((lnk) => (
              <div key={lnk.id} className="py-2.5 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-xs text-gray-900">{lnk.name}</div>
                  <a
                    href={lnk.links}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-700 hover:underline flex items-center gap-1 font-mono"
                  >
                    <span>{lnk.links}</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteLink(lnk.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {linkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-[#500c0e] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Add Vigilance Link</h3>
              <button onClick={() => setLinkModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddLink} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded font-bold"
                  placeholder="e.g. Central Vigilance Commission (CVC) Portal"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">URL *</label>
                <input
                  type="text"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border rounded"
                  placeholder="https://cvc.gov.in"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="px-4 py-1.5 border rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingLink}
                  className="px-4 py-1.5 bg-[#631012] text-white rounded text-xs font-bold"
                >
                  {submittingLink ? 'Saving...' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
