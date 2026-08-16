'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Save, Upload, Link as LinkIcon, Trash2, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

interface SingleAnchorLinkManagerProps {
  id: string;
  linkText?: string;
  defaultText?: string;
  title: string;
  category?: string;
}

export default function SingleAnchorLinkManager({
  id,
  linkText: initialLinkText,
  defaultText,
  title,
  category,
}: SingleAnchorLinkManagerProps) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const API_URL = `${API_BASE}/anchor-links`;
  const UPLOAD_URL = `${API_BASE}/api/upload`;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [currentText, setCurrentText] = useState(initialLinkText || defaultText || title);
  const [urlMode, setUrlMode] = useState<'upload' | 'direct'>('direct');
  const [directUrl, setDirectUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingData, setExistingData] = useState<{ id: string; link_text: string; link_url: string } | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${id}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setExistingData(json.data);
          setCurrentText(json.data.link_text || initialLinkText || defaultText || title);
          setDirectUrl(json.data.link_url || '');
          if (json.data.link_url && (json.data.link_url.includes('/uploads/') || json.data.link_url.endsWith('.pdf'))) {
            setUrlMode('upload');
          }
          return;
        }
      }
      // Fallback check in all links
      const allRes = await fetch(API_URL, { cache: 'no-store' });
      const allJson = await allRes.json();
      if (allJson.success && Array.isArray(allJson.data)) {
        const item = allJson.data.find((d: any) => d.id === id);
        if (item) {
          setExistingData(item);
          setCurrentText(item.link_text || initialLinkText || defaultText || title);
          setDirectUrl(item.link_url || '');
          if (item.link_url && (item.link_url.includes('/uploads/') || item.link_url.endsWith('.pdf'))) {
            setUrlMode('upload');
          }
        }
      }
    } catch (err) {
      console.error('Error fetching anchor link:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);
    try {
      let finalUrl = directUrl.trim();

      if (urlMode === 'upload' && selectedFile) {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        const uploadRes = await fetch(UPLOAD_URL, {
          method: 'POST',
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        setUploading(false);

        if (uploadJson.success && uploadJson.url) {
          finalUrl = uploadJson.url;
          setDirectUrl(finalUrl);
        } else {
          setStatusMessage({ type: 'error', text: 'File upload failed: ' + (uploadJson.error || 'Unknown error') });
          setSaving(false);
          return;
        }
      }

      if (!finalUrl) {
        setStatusMessage({ type: 'error', text: 'Please enter a target URL or choose a file to upload.' });
        setSaving(false);
        return;
      }

      const payload = {
        id,
        link_text: currentText.trim() || title,
        link_url: finalUrl,
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        setExistingData(json.data);
        setSelectedFile(null);
        setStatusMessage({ type: 'success', text: 'Link configuration saved successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: json.error || 'Failed to save link configuration.' });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Error occurred while saving.' });
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingData) return;
    if (!confirm(`Are you sure you want to reset the configuration for "${title}"?`)) return;

    try {
      setSaving(true);
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setExistingData(null);
      setDirectUrl('');
      setSelectedFile(null);
      setStatusMessage({ type: 'success', text: 'Link configuration deleted/reset.' });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: 'Failed to delete.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        {category && (
          <span className="text-xs font-semibold uppercase tracking-wider text-[#800000] bg-red-50 px-2.5 py-1 rounded-md border border-red-100 mb-2 inline-block">
            {category}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage navigation target URL or upload document file for <span className="font-mono text-gray-700 font-medium">[{id}]</span>.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 p-8 bg-white rounded-xl border border-gray-200">
          <Loader2 className="w-6 h-6 animate-spin text-[#800000]" />
          <span className="text-gray-600 font-medium">Loading link settings...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Alert */}
          {statusMessage && (
            <div
              className={`p-4 rounded-lg text-sm flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {statusMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Current Live State Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Current Live Link</h2>
            {existingData && existingData.link_url ? (
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="space-y-1 overflow-hidden">
                  <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span>{existingData.link_text || title}</span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-normal bg-gray-200 text-gray-700">
                      ID: {id}
                    </span>
                  </div>
                  <a
                    href={existingData.link_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline break-all flex items-center gap-1 font-mono"
                  >
                    <span>{existingData.link_url}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg border border-gray-200">
                No custom link configured yet. The navbar currently defaults to fallback.
              </p>
            )}
          </div>

          {/* Edit Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Configure Navigation Link & Target
            </h2>

            {/* Link Text Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Link Display Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                placeholder="e.g. Activities / Notice / Syllabus"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">The title/label shown in the navigation menu.</p>
            </div>

            {/* Target Mode Selector Tabs */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Action <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setUrlMode('direct')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold border transition-all ${
                    urlMode === 'direct'
                      ? 'bg-[#800000] text-white border-[#800000] shadow-sm'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  Direct URL / Redirect
                </button>
                <button
                  type="button"
                  onClick={() => setUrlMode('upload')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold border transition-all ${
                    urlMode === 'upload'
                      ? 'bg-[#800000] text-white border-[#800000] shadow-sm'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload File / PDF
                </button>
              </div>
            </div>

            {/* Option 1: Direct URL Input */}
            {urlMode === 'direct' && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Target URL / Path
                </label>
                <input
                  type="text"
                  value={directUrl}
                  onChange={(e) => setDirectUrl(e.target.value)}
                  placeholder="e.g. https://alumni.nith.ac.in or /academics/calendar or #"
                  className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-md text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
                />
                <p className="text-xs text-gray-400">
                  Accepts external URLs (https://...), internal paths (/academics/...), or '#' for placeholder.
                </p>
              </div>
            )}

            {/* Option 2: Upload File */}
            {urlMode === 'upload' && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Select File to Upload (PDF, Word, Image)
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md cursor-pointer border border-gray-300 shadow-sm transition-colors">
                    <FileText className="w-4 h-4 text-[#800000]" />
                    <span>{selectedFile ? selectedFile.name : 'Choose File...'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    />
                  </label>
                  {selectedFile && (
                    <span className="text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200">
                      Ready to upload ({Math.round(selectedFile.size / 1024)} KB)
                    </span>
                  )}
                </div>
                {directUrl && (
                  <div className="text-xs text-gray-500 font-mono break-all mt-2 pt-2 border-t border-gray-200">
                    <span className="font-semibold text-gray-700">Currently Linked URL:</span> {directUrl}
                  </div>
                )}
                {uploading && (
                  <p className="text-xs text-blue-600 flex items-center gap-1.5 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading file to storage...
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || uploading || (urlMode === 'upload' && !selectedFile && !directUrl)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#800000] text-white text-sm font-semibold rounded-lg hover:bg-[#631012] transition-colors disabled:opacity-50 shadow-sm"
              >
                {saving || uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
