'use client';
import React, { useState, useEffect } from 'react';
import { Loader2, Save, Upload, Trash2 } from 'lucide-react';

interface SingleAnchorLinkManagerProps {
  id: string;
  linkText: string;
  title: string;
}

export default function SingleAnchorLinkManager({ id, linkText, title }: SingleAnchorLinkManagerProps) {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000')}/anchor-links`;
  const UPLOAD_URL = `${process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000')}/api/upload`;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const json = await res.json();
      if (json.success) {
        const item = json.data.find((d: any) => d.id === id);
        setData(item || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let finalUrl = data?.link_url || '';

      if (file) {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploadRes = await fetch(UPLOAD_URL, {
          method: 'POST',
          body: uploadData,
        });
        const uploadJson = await uploadRes.json();
        setUploading(false);
        
        if (uploadJson.success) {
          finalUrl = uploadJson.url;
        } else {
          alert('File upload failed: ' + uploadJson.error);
          setSaving(false);
          return;
        }
      } else if (!finalUrl) {
        alert("Please select a file to upload first.");
        setSaving(false);
        return;
      }

      const method = data ? 'PUT' : 'POST';
      const url = data ? `${API_URL}/${id}` : API_URL;

      const payload = { 
        id, // Will be used by POST to set exact ID
        link_text: linkText, 
        link_url: finalUrl 
      };

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setFile(null);
      await fetchData();
      alert("Successfully saved!");
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!data) return;
    if (!confirm(`Are you sure you want to delete this PDF link for ${title}?`)) return;
    
    try {
      setSaving(true);
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setData(null);
      alert("Successfully deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>

      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#800000]" />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Current PDF URL</label>
              {data && data.link_url ? (
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <a href={data.link_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
                    {data.link_url}
                  </a>
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg border border-gray-200">
                  No PDF is currently linked.
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {data ? 'Update Document' : 'Upload Document'}
              </label>
              <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg cursor-pointer transition-colors border border-gray-300">
                  <Upload className="w-5 h-5" />
                  <span>{file ? file.name : 'Choose File'}</span>
                  <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf" />
                </label>
              </div>
              {uploading && <p className="text-sm text-blue-600 animate-pulse">Uploading file...</p>}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={saving || uploading || (!file && !data?.link_url)}
                className="flex items-center gap-2 px-6 py-2 bg-[#800000] text-white font-medium rounded-lg hover:bg-[#631012] transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? 'Saving...' : 'Save Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
