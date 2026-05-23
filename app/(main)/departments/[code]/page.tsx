"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Dept = {
  id: number;
  code: string;
  name_en: string;
  name_hi?: string;
  description_short_en?: string;
  description_short_hi?: string;
  is_active?: boolean;
};

export default function DeptEditorPage() {
  const params = useParams();
  const router = useRouter();
  const code = params?.code as string;

  const [dept, setDept] = useState<Dept | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'programmes' | 'vision' | 'research' | 'publications' | 'faculty' | 'labs' | 'contact' | 'media'>('overview');
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [progLoading, setProgLoading] = useState(false);
  const [visionData, setVisionData] = useState<any[]>([]);
  const [visionLoading, setVisionLoading] = useState(false);
  const [researchAreas, setResearchAreas] = useState<any[]>([]);
  const [researchLoading, setResearchLoading] = useState(false);
  const [publications, setPublications] = useState<any[]>([]);
  const [publicationsLoading, setPublicationsLoading] = useState(false);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [labsList, setLabsList] = useState<any[]>([]);
  const [labsLoading, setLabsLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState<any | null>(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  // editing states for inline edit forms
  const [editingProgrammeId, setEditingProgrammeId] = useState<number | null>(null);
  const [editProgrammeData, setEditProgrammeData] = useState<any>(null);
  const [editingVisionId, setEditingVisionId] = useState<number | null>(null);
  const [editVisionData, setEditVisionData] = useState<any>(null);
  const [editingResearchId, setEditingResearchId] = useState<number | null>(null);
  const [editResearchData, setEditResearchData] = useState<any>(null);
  const [editingPublicationId, setEditingPublicationId] = useState<number | null>(null);
  const [editPublicationData, setEditPublicationData] = useState<any>(null);
  const [editingFacultyId, setEditingFacultyId] = useState<number | null>(null);
  const [editFacultyData, setEditFacultyData] = useState<any>(null);
  const [editingLabId, setEditingLabId] = useState<number | null>(null);
  const [editLabData, setEditLabData] = useState<any>(null);
  const [editingMediaId, setEditingMediaId] = useState<number | null>(null);
  const [editMediaData, setEditMediaData] = useState<any>(null);
  // show/add states for resources
  const [showAddVision, setShowAddVision] = useState(false);
  const [addVisionData, setAddVisionData] = useState({ title_en: '', title_hi: '', description_en: '', description_hi: '' });
  const [showAddResearch, setShowAddResearch] = useState(false);
  const [addResearchData, setAddResearchData] = useState({ title_en: '', title_hi: '' });
  const [showAddPublication, setShowAddPublication] = useState(false);
  const [addPublicationData, setAddPublicationData] = useState({ title_en: '', title_hi: '', link: '' });
  const [showAddFaculty, setShowAddFaculty] = useState(false);
  const [addFacultyData, setAddFacultyData] = useState({ name_en: '', name_hi: '', role_en: '', role_hi: '' });
  const [showAddLab, setShowAddLab] = useState(false);
  const [addLabData, setAddLabData] = useState({ title_en: '', title_hi: '' });
  const [showAddMedia, setShowAddMedia] = useState(false);
  const [addMediaData, setAddMediaData] = useState({ title_en: '', title_hi: '', url: '' });
  const [showDeleteDeptConfirm, setShowDeleteDeptConfirm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ resource?: string; id?: number; refreshFn?: (() => Promise<void>) | null }>({});
  const [newProgramme, setNewProgramme] = useState({
    programme_type: '',
    title_en: '',
    title_hi: '',
    duration: '',
    description_en: '',
    description_hi: '',
    order_index: 0,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddDept, setShowAddDept] = useState(false);
  const [newDeptData, setNewDeptData] = useState({ code: '', name_en: '', description_short_en: '' });

  useEffect(() => {
    if (!code) return;
    fetchDept();
    fetchProgrammes();
    fetchVision();
    fetchResearchAreas();
    fetchPublications();
    fetchFaculty();
    fetchLabs();
    fetchContact();
    fetchMedia();
  }, [code]);

  const fetchDept = async () => {
    if (!code) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}`);
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || "Failed to load");
      setDept((json && json.data) || null);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchDeptRefresh = async (c: string) => {
    await fetchDept();
    // also refresh lists
    await Promise.all([fetchProgrammes(), fetchVision(), fetchResearchAreas(), fetchPublications(), fetchFaculty(), fetchLabs(), fetchContact(), fetchMedia()].map(p => p.catch?.(() => {})));
  };

  const fetchProgrammes = async () => {
    setProgLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}/programmes?language=en`);
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Failed to load programmes');
      setProgrammes((json && json.data) || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setProgLoading(false);
    }
  };

  const fetchVision = async () => {
    setVisionLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}/vision?language=en`);
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Failed to load vision');
      setVisionData((json && json.data) || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setVisionLoading(false);
    }
  };

  const fetchResearchAreas = async () => {
    setResearchLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}/research-areas?language=en`);
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Failed to load research areas');
      setResearchAreas((json && json.data) || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setResearchLoading(false);
    }
  };

  const fetchPublications = async () => {
    setPublicationsLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}/publications?language=en`);
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Failed to load publications');
      setPublications((json && json.data) || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setPublicationsLoading(false);
    }
  };

  const fetchFaculty = async () => {
    setFacultyLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}/faculty?language=en`);
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Failed to load faculty');
      setFacultyList((json && json.data) || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setFacultyLoading(false);
    }
  };

  const fetchLabs = async () => {
    setLabsLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}/labs?language=en`);
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Failed to load labs');
      setLabsList((json && json.data) || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLabsLoading(false);
    }
  };

  const fetchContact = async () => {
    setContactLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}/contact?language=en`);
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Failed to load contact');
      setContactInfo((json && json.data) || null);
    } catch (err: any) {
      console.error(err);
    } finally {
      setContactLoading(false);
    }
  };

  const fetchMedia = async () => {
    setMediaLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}/media?language=en`);
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Failed to load media');
      setMediaList((json && json.data) || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setMediaLoading(false);
    }
  };

  const handleChange = (k: keyof Dept, v: any) => {
    setDept((prev) => (prev ? { ...prev, [k]: v } : prev));
  };

  const safeParse = async (res: Response) => {
    try {
      const json = await res.json();
      return { json, text: null };
    } catch (err) {
      try {
        const text = await res.text();
        return { json: null, text };
      } catch (e) {
        return { json: null, text: null };
      }
    }
  };

  const handleSave = async () => {
    if (!dept) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_en: dept.name_en,
          name_hi: dept.name_hi,
          description_short_en: dept.description_short_en,
          description_short_hi: dept.description_short_hi,
          is_active: dept.is_active,
        }),
      });
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || "Save failed");
      setDept((json && json.data) || dept);
      alert("Saved");
    } catch (err: any) {
      alert(err.message || String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    // trigger inline confirmation UI
    setShowDeleteDeptConfirm(true);
  };

  const confirmDeleteDepartment = async () => {
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}`, { method: 'DELETE' });
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Delete failed');
      router.push('/departments');
    } catch (err: any) {
      alert(err.message || String(err));
    } finally {
      setShowDeleteDeptConfirm(false);
    }
  };

  const openDeleteConfirmation = (resource: string, id: number, refreshFn?: () => Promise<void>) => {
    setPendingDelete({ resource, id, refreshFn: refreshFn || null });
  };

  const cancelPendingDelete = () => setPendingDelete({});

  const performPendingDelete = async () => {
    if (!pendingDelete.resource || pendingDelete.id == null) return;
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}/${pendingDelete.resource}/${pendingDelete.id}`, { method: 'DELETE' });
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Delete failed');
      if (pendingDelete.refreshFn) await pendingDelete.refreshFn();
    } catch (err: any) {
      alert(err.message || String(err));
    } finally {
      setPendingDelete({});
    }
  };

  const handleAddProgramme = async () => {
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}/programmes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgramme),
      });
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Create failed');
      setNewProgramme({ programme_type: '', title_en: '', title_hi: '', duration: '', description_en: '', description_hi: '', order_index: 0 });
      fetchProgrammes();
    } catch (err: any) {
      alert(err.message || String(err));
    }
  };

  const handleUpdateProgramme = async (id: number, payload: any) => {
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}/programmes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Update failed');
      fetchProgrammes();
    } catch (err: any) {
      alert(err.message || String(err));
    }
  };

  const handleDeleteProgramme = async (id: number) => {
    openDeleteConfirmation('programmes', id, fetchProgrammes);
  };

  // Generic add/update/delete for simple list resources
  const handleAddResource = async (resource: string, payload: any, refreshFn: () => Promise<void>) => {
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}/${resource}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Create failed');
      await refreshFn();
    } catch (err: any) {
      alert(err.message || String(err));
    }
  };

  const handleUpdateResource = async (resource: string, id: number, payload: any, refreshFn: () => Promise<void>) => {
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}/${resource}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const { json, text } = await safeParse(res);
      if (!res.ok) throw new Error((json && json.message) || text || 'Update failed');
      await refreshFn();
    } catch (err: any) {
      alert(err.message || String(err));
    }
  };

  const handleDeleteResource = async (resource: string, id: number, refreshFn: () => Promise<void>) => {
    // use inline confirmation flow instead of browser confirm
    openDeleteConfirmation(resource, id, refreshFn);
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  if (!dept) return <div style={{ padding: 20 }}>No department data.</div>;

  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg,#0d0d0d,#0b0b0b)',
    color: '#fff',
    padding: '34px 28px',
    borderRadius: 14,
    boxShadow: '0 12px 30px rgba(2,6,23,0.45)',
  };

  const pill = (active: boolean) => ({
    padding: '10px 14px',
    borderRadius: 999,
    border: active ? '1px solid rgba(123,20,20,0.15)' : '1px solid rgba(226,232,240,1)',
    background: active ? '#7b1414' : '#fff',
    color: active ? '#fff' : '#0f172a',
    cursor: 'pointer',
    boxShadow: active ? '0 6px 12px rgba(123,20,20,0.12)' : 'none',
    display: 'inline-flex',
    gap: 8,
    alignItems: 'center',
  });

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #eef2f6',
    padding: 18,
    marginTop: 12,
  };

  const maroonBtn: React.CSSProperties = {
    background: '#7b1414',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 6px 12px rgba(123,20,20,0.12)'
  };

  const dangerBtn: React.CSSProperties = {
    background: '#fff0f2',
    color: '#b91c1c',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #ffd6de',
    cursor: 'pointer'
  };

  const actionBtn: React.CSSProperties = { background: 'transparent', border: 'none', color: '#0f172a', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' };
  const actionDangerBtn: React.CSSProperties = { background: 'transparent', border: 'none', color: '#b91c1c', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' };

  const inputStyle: React.CSSProperties = { padding: 12, borderRadius: 8, border: '1px solid #eef2f6', width: '100%', boxSizing: 'border-box' };
  const textareaStyle: React.CSSProperties = { padding: 12, borderRadius: 8, border: '1px solid #eef2f6', width: '100%', boxSizing: 'border-box', minHeight: 120 };

  return (
    <div style={{ padding: 20 }}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>NITH ADMIN</div>
            <h1 style={{ margin: '6px 0 0', fontSize: 32 }}>Department of {dept.name_en}</h1>
            <div style={{ marginTop: 8, opacity: 0.85 }}>Edit the backend records for this department. The public frontend reads from these APIs, so changes will be reflected when the pages reload.</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => { fetchDeptRefresh(code); }} style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.06)' }}>⟳ Refresh</button>
                <button onClick={() => window.location.href = '/departments'} style={{ padding: '8px 12px', borderRadius: 8, background: '#fff', color: '#0f172a', border: 'none' }}>Back to departments</button>
                <button onClick={() => setShowAddDept((s) => !s)} style={{ padding: '8px 12px', borderRadius: 8, background: '#7b1414', color: '#fff', border: 'none' }}>{showAddDept ? 'Cancel' : 'Add department'}</button>
          </div>
        </div>
      </div>

          {showAddDept && (
            <div style={{ marginTop: 12, ...cardStyle }}>
              <h3 style={{ marginTop: 0 }}>Create new department</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px', gap: 12 }}>
                <input placeholder="Code (eg. chem)" value={newDeptData.code} onChange={(e) => setNewDeptData({ ...newDeptData, code: e.target.value })} style={{ padding: 10 }} />
                <input placeholder="English name" value={newDeptData.name_en} onChange={(e) => setNewDeptData({ ...newDeptData, name_en: e.target.value })} style={{ padding: 10 }} />
                <input placeholder="Order index" style={{ padding: 10 }} />
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={async () => {
                  if (!newDeptData.code || !newDeptData.name_en) { alert('Provide code and English name'); return; }
                  try {
                    const res = await fetch('http://localhost:4000/v1/departments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newDeptData) });
                    const { json, text } = await safeParse(res);
                    if (!res.ok) throw new Error((json && json.message) || text || 'Create failed');
                    setNewDeptData({ code: '', name_en: '', description_short_en: '' });
                    setShowAddDept(false);
                    router.push(`/departments/${(json && json.data && json.data.code) || newDeptData.code}`);
                  } catch (err: any) {
                    alert(err.message || String(err));
                  }
                }} style={{ ...maroonBtn }}>Create</button>
              </div>
            </div>
          )}

      <div style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <button style={pill(activeTab === 'overview')} onClick={() => setActiveTab('overview')}>🏠 Department Info</button>
        <button style={pill(activeTab === 'programmes')} onClick={() => setActiveTab('programmes')}>🎓 Programmes</button>
        <button style={pill(activeTab === 'vision')} onClick={() => setActiveTab('vision')}>📘 Vision & Mission</button>
        <button style={pill(activeTab === 'research')} onClick={() => setActiveTab('research')}>🔬 Research Areas</button>
        <button style={pill(activeTab === 'publications')} onClick={() => setActiveTab('publications')}>📚 Publications</button>
        <button style={pill(activeTab === 'faculty')} onClick={() => setActiveTab('faculty')}>👩‍🏫 Faculty</button>
        <button style={pill(activeTab === 'labs')} onClick={() => setActiveTab('labs')}>🧪 Labs</button>
        <button style={pill(activeTab === 'contact')} onClick={() => setActiveTab('contact')}>📞 Contact</button>
        <button style={pill(activeTab === 'media')} onClick={() => setActiveTab('media')}>🖼️ Media</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ background: '#fff8e6', padding: 14, borderRadius: 8, border: '1px solid #ffecd1', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#916c00' }}>i</div>
          <div style={{ color: '#8a6d00' }}>Department data loaded for <strong>{dept && dept.code ? dept.code.toUpperCase() : '—'}</strong>.</div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Department overview</h3>
            <div>
              <button onClick={handleSave} style={maroonBtn}>{saving ? 'Saving...' : 'Save overview'}</button>
              <button onClick={handleDelete} style={{ marginLeft: 8, background: '#ffe6e6', borderRadius: 8, padding: '8px 12px' }}>Delete overview</button>
            </div>
          </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600 }}>English heading</label>
              <input placeholder="Department title" value={dept.name_en || ''} onChange={(e) => handleChange('name_en', e.target.value)} style={{ ...inputStyle, marginTop: 8 }} />

              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginTop: 12 }}>Department image URL</label>
              <input placeholder="https://..." value={(dept as any).dept_image_url || ''} onChange={(e) => handleChange('dept_image_url' as any, e.target.value)} style={{ ...inputStyle, marginTop: 8 }} />

              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginTop: 12 }}>English description</label>
              <textarea placeholder="Short intro shown on the landing page" value={dept.description_short_en || ''} onChange={(e) => handleChange('description_short_en', e.target.value)} style={{ ...textareaStyle, marginTop: 8 }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600 }}>Hindi heading</label>
              <input placeholder="विभाग शीर्षक" value={dept.name_hi || ''} onChange={(e) => handleChange('name_hi', e.target.value)} style={{ ...inputStyle, marginTop: 8 }} />

              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={!!dept.is_active} onChange={(e) => handleChange('is_active', e.target.checked)} />
                <div>Publish this department</div>
              </div>

              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginTop: 12 }}>Hindi description</label>
              <textarea placeholder="हिंदी विवरण" value={dept.description_short_hi || ''} onChange={(e) => handleChange('description_short_hi', e.target.value)} style={{ ...textareaStyle, marginTop: 8 }} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'programmes' && (
        <div style={{ marginTop: 12 }}>
          <div style={cardStyle}>
            <h3>Academic programmes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input placeholder="Programme type" value={newProgramme.programme_type} onChange={(e) => setNewProgramme({ ...newProgramme, programme_type: e.target.value })} style={{ padding: 10 }} />
              <input placeholder="Order" value={String(newProgramme.order_index)} onChange={(e) => setNewProgramme({ ...newProgramme, order_index: Number(e.target.value || 0) })} style={{ padding: 10 }} />
              <input placeholder="English title" value={newProgramme.title_en} onChange={(e) => setNewProgramme({ ...newProgramme, title_en: e.target.value })} style={{ padding: 10 }} />
              <input placeholder="Hindi title" value={newProgramme.title_hi} onChange={(e) => setNewProgramme({ ...newProgramme, title_hi: e.target.value })} style={{ padding: 10 }} />
              <input placeholder="Duration" value={newProgramme.duration} onChange={(e) => setNewProgramme({ ...newProgramme, duration: e.target.value })} style={{ padding: 10 }} />
              <input placeholder="Icon emoji" style={{ padding: 10 }} />
              <textarea placeholder="English description" value={newProgramme.description_en} onChange={(e) => setNewProgramme({ ...newProgramme, description_en: e.target.value })} style={{ gridColumn: '1 / span 2', minHeight: 80, padding: 10 }} />
              <textarea placeholder="Hindi description" value={newProgramme.description_hi} onChange={(e) => setNewProgramme({ ...newProgramme, description_hi: e.target.value })} style={{ gridColumn: '1 / span 2', minHeight: 80, padding: 10 }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <button onClick={handleAddProgramme} style={{ ...maroonBtn }}>Add programme</button>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ padding: 12, background: '#fff', borderRadius: 8 }}>
              <h4 style={{ marginTop: 0 }}>Existing programmes</h4>
              {progLoading && <div>Loading programmes...</div>}
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr><th style={{ textAlign: 'left' }}>Type</th><th>English title</th><th>Duration</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {programmes.map((p) => (
                        <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
                          <td>{p.programme_type}</td>
                          <td style={{ maxWidth: 320 }}>
                            {p.title_en}
                            {p.title_hi ? <div style={{ color: '#6b7280', marginTop: 4 }}>{p.title_hi}</div> : null}
                          </td>
                          <td>{p.duration || '—'}</td>
                          <td>
                            {editingProgrammeId === p.id ? (
                              <div style={{ display: 'grid', gap: 8 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                  <input value={editProgrammeData.programme_type || ''} onChange={(e) => setEditProgrammeData({ ...editProgrammeData, programme_type: e.target.value })} placeholder="Programme type" style={{ padding: 8 }} />
                                  <input value={editProgrammeData.title_en || ''} onChange={(e) => setEditProgrammeData({ ...editProgrammeData, title_en: e.target.value })} placeholder="Title (EN)" style={{ padding: 8 }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                  <input value={editProgrammeData.title_hi || ''} onChange={(e) => setEditProgrammeData({ ...editProgrammeData, title_hi: e.target.value })} placeholder="Title (HI)" style={{ padding: 8 }} />
                                  <input value={editProgrammeData.duration || ''} onChange={(e) => setEditProgrammeData({ ...editProgrammeData, duration: e.target.value })} placeholder="Duration" style={{ padding: 8 }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                  <input value={String(editProgrammeData.order_index || '')} onChange={(e) => setEditProgrammeData({ ...editProgrammeData, order_index: Number(e.target.value || 0) })} placeholder="Order index" style={{ padding: 8 }} />
                                  <input value={editProgrammeData.icon || ''} onChange={(e) => setEditProgrammeData({ ...editProgrammeData, icon: e.target.value })} placeholder="Icon emoji" style={{ padding: 8 }} />
                                </div>
                                <div>
                                  <textarea value={editProgrammeData.description_en || ''} onChange={(e) => setEditProgrammeData({ ...editProgrammeData, description_en: e.target.value })} placeholder="Description (EN)" style={{ padding: 8, width: '100%' }} />
                                  <textarea value={editProgrammeData.description_hi || ''} onChange={(e) => setEditProgrammeData({ ...editProgrammeData, description_hi: e.target.value })} placeholder="विवरण (HI)" style={{ padding: 8, width: '100%', marginTop: 8 }} />
                                </div>
                                <div style={{ marginTop: 6 }}>
                                  <button onClick={() => { handleUpdateResource('programmes', p.id, editProgrammeData, fetchProgrammes); setEditingProgrammeId(null); }} style={{ padding: '8px 10px' }}>Save</button>
                                  <button onClick={() => setEditingProgrammeId(null)} style={{ padding: '8px 10px', marginLeft: 8 }}>Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <button style={actionBtn} onClick={() => { setEditingProgrammeId(p.id); setEditProgrammeData(p); }}>Edit</button>
                                {pendingDelete.resource === 'programmes' && pendingDelete.id === p.id ? (
                                  <span style={{ marginLeft: 8 }}>
                                    <button onClick={performPendingDelete} style={{ background: '#b91c1c', color: '#fff', padding: '6px 10px', borderRadius: 6 }}>Confirm</button>
                                    <button onClick={cancelPendingDelete} style={{ marginLeft: 8, ...actionBtn }}>Cancel</button>
                                  </span>
                                  ) : (
                                  <button onClick={() => handleDeleteProgramme(p.id)} style={{ marginLeft: 8, ...actionDangerBtn }}>Delete</button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vision' && (
        <div style={{ marginTop: 12 }}>
          <div style={cardStyle}>
            <h3>Vision & Mission</h3>
            <div style={{ marginTop: 8 }}>
              {visionLoading ? <div>Loading...</div> : (
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Heading (EN)</label>
                      <input placeholder="Heading (EN)" value={addVisionData.title_en} onChange={(e) => setAddVisionData({ ...addVisionData, title_en: e.target.value })} style={{ padding: 10, marginTop: 6 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Heading (HI)</label>
                      <input placeholder="शीर्षक (HI)" value={addVisionData.title_hi} onChange={(e) => setAddVisionData({ ...addVisionData, title_hi: e.target.value })} style={{ padding: 10, marginTop: 6 }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Description (EN)</label>
                      <textarea placeholder="Description (EN)" value={addVisionData.description_en} onChange={(e) => setAddVisionData({ ...addVisionData, description_en: e.target.value })} style={{ padding: 10, marginTop: 6, minHeight: 80 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>Description (HI)</label>
                      <textarea placeholder="विवरण (HI)" value={addVisionData.description_hi} onChange={(e) => setAddVisionData({ ...addVisionData, description_hi: e.target.value })} style={{ padding: 10, marginTop: 6, minHeight: 80 }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={async () => { await handleAddResource('vision', addVisionData, fetchVision); setAddVisionData({ title_en: '', title_hi: '', description_en: '', description_hi: '' }); }} style={maroonBtn}>Save</button>
                    <button onClick={() => { setAddVisionData({ title_en: '', title_hi: '', description_en: '', description_hi: '' }); }} style={{ padding: '10px 14px', borderRadius: 8 }}>Reset</button>
                  </div>
                </div>
              )}
            </div>
            <div style={{ marginTop: 12 }}>
              {visionData.map((v: any) => (
                <div key={v.id} style={{ borderTop: '1px solid #eee', paddingTop: 10, marginTop: 10 }}>
                  {editingVisionId === v.id ? (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <input value={editVisionData.title_en} onChange={(e) => setEditVisionData({ ...editVisionData, title_en: e.target.value })} style={{ padding: 8, width: '100%' }} />
                        <input value={editVisionData.title_hi || ''} onChange={(e) => setEditVisionData({ ...editVisionData, title_hi: e.target.value })} style={{ padding: 8, width: '100%' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                        <textarea value={editVisionData.description_en} onChange={(e) => setEditVisionData({ ...editVisionData, description_en: e.target.value })} style={{ padding: 8, width: '100%' }} />
                        <textarea value={editVisionData.description_hi || ''} onChange={(e) => setEditVisionData({ ...editVisionData, description_hi: e.target.value })} style={{ padding: 8, width: '100%' }} />
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <button onClick={() => { handleUpdateResource('vision', v.id, editVisionData, fetchVision); setEditingVisionId(null); }} style={{ padding: '8px 10px' }}>Save</button>
                        <button onClick={() => setEditingVisionId(null)} style={{ padding: '8px 10px', marginLeft: 8 }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <strong>{v.title_en}</strong>
                      {v.title_hi ? <div style={{ marginTop: 4, color: '#6b7280' }}>{v.title_hi}</div> : null}
                      <div style={{ marginTop: 6 }}>{v.description_en}</div>
                      {v.description_hi ? <div style={{ marginTop: 6, color: '#6b7280' }}>{v.description_hi}</div> : null}
                      <div style={{ marginTop: 6 }}>
                        <button style={actionBtn} onClick={() => { setEditingVisionId(v.id); setEditVisionData(v); }}>Edit</button>
                        {pendingDelete.resource === 'vision' && pendingDelete.id === v.id ? (
                          <span style={{ marginLeft: 8 }}>
                            <button onClick={performPendingDelete} style={{ background: '#b91c1c', color: '#fff', padding: '6px 10px', borderRadius: 6 }}>Confirm</button>
                            <button onClick={cancelPendingDelete} style={{ marginLeft: 8, ...actionBtn }}>Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => openDeleteConfirmation('vision', v.id, fetchVision)} style={{ marginLeft: 8, ...actionDangerBtn }}>Delete</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'research' && (
        <div style={{ marginTop: 12 }}>
          <div style={cardStyle}>
            <h3>Research Areas</h3>
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input placeholder="Area (EN)" value={addResearchData.title_en} onChange={(e) => setAddResearchData({ ...addResearchData, title_en: e.target.value })} style={{ padding: 10 }} />
                  <input placeholder="क्षेत्र (HI)" value={addResearchData.title_hi} onChange={(e) => setAddResearchData({ ...addResearchData, title_hi: e.target.value })} style={{ padding: 10 }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={async () => { await handleAddResource('research-areas', addResearchData, fetchResearchAreas); setAddResearchData({ title_en: '', title_hi: '' }); }} style={maroonBtn}>Save</button>
                  <button onClick={() => { setAddResearchData({ title_en: '', title_hi: '' }); }} style={{ padding: '10px 14px', borderRadius: 8 }}>Reset</button>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              {researchAreas.map((r: any) => (
                <div key={r.id} style={{ borderTop: '1px solid #eee', paddingTop: 10, marginTop: 10 }}>
                  {editingResearchId === r.id ? (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <input value={editResearchData.title_en} onChange={(e) => setEditResearchData({ ...editResearchData, title_en: e.target.value })} style={{ padding: 8, width: '100%' }} />
                        <input value={editResearchData.title_hi || ''} onChange={(e) => setEditResearchData({ ...editResearchData, title_hi: e.target.value })} style={{ padding: 8, width: '100%' }} />
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <button onClick={() => { handleUpdateResource('research-areas', r.id, editResearchData, fetchResearchAreas); setEditingResearchId(null); }}>Save</button>
                        <button onClick={() => setEditingResearchId(null)} style={{ marginLeft: 8 }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <strong>{r.title_en}</strong>
                      {r.title_hi ? <div style={{ marginTop: 4, color: '#6b7280' }}>{r.title_hi}</div> : null}
                      <div style={{ marginTop: 6 }}>
                        <button style={actionBtn} onClick={() => { setEditingResearchId(r.id); setEditResearchData(r); }}>Edit</button>
                        {pendingDelete.resource === 'research-areas' && pendingDelete.id === r.id ? (
                          <span style={{ marginLeft: 8 }}>
                            <button onClick={performPendingDelete} style={{ background: '#b91c1c', color: '#fff', padding: '6px 10px', borderRadius: 6 }}>Confirm</button>
                            <button onClick={cancelPendingDelete} style={{ marginLeft: 8, ...actionBtn }}>Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => openDeleteConfirmation('research-areas', r.id, fetchResearchAreas)} style={{ marginLeft: 8, ...actionDangerBtn }}>Delete</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'publications' && (
        <div style={{ marginTop: 12 }}>
          <div style={cardStyle}>
            <h3>Publications</h3>
            <div style={{ marginTop: 8 }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input placeholder="Title (EN)" value={addPublicationData.title_en} onChange={(e) => setAddPublicationData({ ...addPublicationData, title_en: e.target.value })} style={{ padding: 10 }} />
                    <input placeholder="शीर्षक (HI)" value={addPublicationData.title_hi} onChange={(e) => setAddPublicationData({ ...addPublicationData, title_hi: e.target.value })} style={{ padding: 10 }} />
                  </div>
                  <input placeholder="Link (optional)" value={addPublicationData.link} onChange={(e) => setAddPublicationData({ ...addPublicationData, link: e.target.value })} style={{ padding: 10 }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={async () => { await handleAddResource('publications', addPublicationData, fetchPublications); setAddPublicationData({ title_en: '', title_hi: '', link: '' }); }} style={maroonBtn}>Save</button>
                    <button onClick={() => { setAddPublicationData({ title_en: '', title_hi: '', link: '' }); }} style={{ padding: '10px 14px', borderRadius: 8 }}>Reset</button>
                  </div>
                </div>
            </div>
            <div style={{ marginTop: 12 }}>
              {publications.map((p: any) => (
                <div key={p.id} style={{ borderTop: '1px solid #eee', paddingTop: 10, marginTop: 10 }}>
                  {editingPublicationId === p.id ? (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <input value={editPublicationData.title_en} onChange={(e) => setEditPublicationData({ ...editPublicationData, title_en: e.target.value })} style={{ padding: 8, width: '100%' }} />
                        <input value={editPublicationData.title_hi || ''} onChange={(e) => setEditPublicationData({ ...editPublicationData, title_hi: e.target.value })} style={{ padding: 8, width: '100%' }} />
                      </div>
                      <input value={editPublicationData.link || ''} onChange={(e) => setEditPublicationData({ ...editPublicationData, link: e.target.value })} style={{ padding: 8, width: '100%', marginTop: 8 }} />
                      <div style={{ marginTop: 8 }}>
                        <button onClick={() => { handleUpdateResource('publications', p.id, editPublicationData, fetchPublications); setEditingPublicationId(null); }}>Save</button>
                        <button onClick={() => setEditingPublicationId(null)} style={{ marginLeft: 8 }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <strong>{p.title_en}</strong>
                      {p.title_hi ? <div style={{ marginTop: 4, color: '#6b7280' }}>{p.title_hi}</div> : null}
                      <div style={{ marginTop: 6 }}><a href={p.link} target="_blank" rel="noreferrer">{p.link}</a></div>
                      <div style={{ marginTop: 6 }}>
                        <button style={actionBtn} onClick={() => { setEditingPublicationId(p.id); setEditPublicationData(p); }}>Edit</button>
                        {pendingDelete.resource === 'publications' && pendingDelete.id === p.id ? (
                          <span style={{ marginLeft: 8 }}>
                            <button onClick={performPendingDelete} style={{ background: '#b91c1c', color: '#fff', padding: '6px 10px', borderRadius: 6 }}>Confirm</button>
                            <button onClick={cancelPendingDelete} style={{ marginLeft: 8, ...actionBtn }}>Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => openDeleteConfirmation('publications', p.id, fetchPublications)} style={{ marginLeft: 8, ...actionDangerBtn }}>Delete</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'faculty' && (
        <div style={{ marginTop: 12 }}>
          <div style={cardStyle}>
            <h3>Faculty</h3>
            <div style={{ marginTop: 8 }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input placeholder="Name (EN)" value={addFacultyData.name_en} onChange={(e) => setAddFacultyData({ ...addFacultyData, name_en: e.target.value })} style={{ padding: 10 }} />
                    <input placeholder="नाम (HI)" value={addFacultyData.name_hi} onChange={(e) => setAddFacultyData({ ...addFacultyData, name_hi: e.target.value })} style={{ padding: 10 }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input placeholder="Role / title (EN)" value={addFacultyData.role_en} onChange={(e) => setAddFacultyData({ ...addFacultyData, role_en: e.target.value })} style={{ padding: 10 }} />
                    <input placeholder="पद (HI)" value={addFacultyData.role_hi} onChange={(e) => setAddFacultyData({ ...addFacultyData, role_hi: e.target.value })} style={{ padding: 10 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={async () => { await handleAddResource('faculty', addFacultyData, fetchFaculty); setAddFacultyData({ name_en: '', name_hi: '', role_en: '', role_hi: '' }); }} style={maroonBtn}>Save</button>
                    <button onClick={() => { setAddFacultyData({ name_en: '', name_hi: '', role_en: '', role_hi: '' }); }} style={{ padding: '10px 14px', borderRadius: 8 }}>Reset</button>
                  </div>
                </div>
            </div>
            <div style={{ marginTop: 12 }}>
              {facultyList.map((f: any) => (
                <div key={f.id} style={{ borderTop: '1px solid #eee', paddingTop: 10, marginTop: 10 }}>
                  {editingFacultyId === f.id ? (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <input value={editFacultyData.name_en} onChange={(e) => setEditFacultyData({ ...editFacultyData, name_en: e.target.value })} style={{ padding: 8, width: '100%' }} />
                        <input value={editFacultyData.name_hi || ''} onChange={(e) => setEditFacultyData({ ...editFacultyData, name_hi: e.target.value })} style={{ padding: 8, width: '100%' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                        <input value={editFacultyData.role_en || ''} onChange={(e) => setEditFacultyData({ ...editFacultyData, role_en: e.target.value })} style={{ padding: 8, width: '100%' }} />
                        <input value={editFacultyData.role_hi || ''} onChange={(e) => setEditFacultyData({ ...editFacultyData, role_hi: e.target.value })} style={{ padding: 8, width: '100%' }} />
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <button onClick={() => { handleUpdateResource('faculty', f.id, editFacultyData, fetchFaculty); setEditingFacultyId(null); }}>Save</button>
                        <button onClick={() => setEditingFacultyId(null)} style={{ marginLeft: 8 }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <strong>{f.name_en}</strong>
                      {f.name_hi ? <div style={{ marginTop: 4, color: '#6b7280' }}>{f.name_hi}</div> : null}
                      <div style={{ marginTop: 6 }}>{f.role_en}</div>
                      {f.role_hi ? <div style={{ marginTop: 4, color: '#6b7280' }}>{f.role_hi}</div> : null}
                      <div style={{ marginTop: 6 }}>
                        <button style={actionBtn} onClick={() => { setEditingFacultyId(f.id); setEditFacultyData(f); }}>Edit</button>
                        {pendingDelete.resource === 'faculty' && pendingDelete.id === f.id ? (
                          <span style={{ marginLeft: 8 }}>
                            <button onClick={performPendingDelete} style={{ background: '#b91c1c', color: '#fff', padding: '6px 10px', borderRadius: 6 }}>Confirm</button>
                            <button onClick={cancelPendingDelete} style={{ marginLeft: 8, ...actionBtn }}>Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => openDeleteConfirmation('faculty', f.id, fetchFaculty)} style={{ marginLeft: 8, ...actionDangerBtn }}>Delete</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'labs' && (
        <div style={{ marginTop: 12 }}>
          <div style={cardStyle}>
            <h3>Labs</h3>
            <div style={{ marginTop: 8 }}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input placeholder="Lab name (EN)" value={addLabData.title_en} onChange={(e) => setAddLabData({ ...addLabData, title_en: e.target.value })} style={{ padding: 10 }} />
                    <input placeholder="प्रयोगशाला (HI)" value={addLabData.title_hi} onChange={(e) => setAddLabData({ ...addLabData, title_hi: e.target.value })} style={{ padding: 10 }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={async () => { await handleAddResource('labs', addLabData, fetchLabs); setAddLabData({ title_en: '', title_hi: '' }); }} style={maroonBtn}>Save</button>
                    <button onClick={() => { setAddLabData({ title_en: '', title_hi: '' }); }} style={{ padding: '10px 14px', borderRadius: 8 }}>Reset</button>
                  </div>
                </div>
            </div>
            <div style={{ marginTop: 12 }}>
              {labsList.map((l: any) => (
                <div key={l.id} style={{ borderTop: '1px solid #eee', paddingTop: 10, marginTop: 10 }}>
                  {editingLabId === l.id ? (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <input value={editLabData.title_en} onChange={(e) => setEditLabData({ ...editLabData, title_en: e.target.value })} style={{ padding: 8, width: '100%' }} />
                        <input value={editLabData.title_hi || ''} onChange={(e) => setEditLabData({ ...editLabData, title_hi: e.target.value })} style={{ padding: 8, width: '100%' }} />
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <button onClick={() => { handleUpdateResource('labs', l.id, editLabData, fetchLabs); setEditingLabId(null); }}>Save</button>
                        <button onClick={() => setEditingLabId(null)} style={{ marginLeft: 8 }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <strong>{l.title_en}</strong>
                      {l.title_hi ? <div style={{ marginTop: 4, color: '#6b7280' }}>{l.title_hi}</div> : null}
                      <div style={{ marginTop: 6 }}>
                        <button style={actionBtn} onClick={() => { setEditingLabId(l.id); setEditLabData(l); }}>Edit</button>
                        {pendingDelete.resource === 'labs' && pendingDelete.id === l.id ? (
                          <span style={{ marginLeft: 8 }}>
                            <button onClick={performPendingDelete} style={{ background: '#b91c1c', color: '#fff', padding: '6px 10px', borderRadius: 6 }}>Confirm</button>
                            <button onClick={cancelPendingDelete} style={{ marginLeft: 8, ...actionBtn }}>Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => openDeleteConfirmation('labs', l.id, fetchLabs)} style={{ marginLeft: 8, ...actionDangerBtn }}>Delete</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div style={{ marginTop: 12 }}>
          <div style={cardStyle}>
            <h3>Contact</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input placeholder="Phone" value={contactInfo?.phone || ''} onChange={(e) => setContactInfo({ ...(contactInfo||{}), phone: e.target.value })} style={{ padding: 10 }} />
              <input placeholder="Email" value={contactInfo?.email || ''} onChange={(e) => setContactInfo({ ...(contactInfo||{}), email: e.target.value })} style={{ padding: 10 }} />
              <textarea placeholder="Address" value={contactInfo?.address || ''} onChange={(e) => setContactInfo({ ...(contactInfo||{}), address: e.target.value })} style={{ gridColumn: '1 / span 2', padding: 10, minHeight: 80 }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <button onClick={async () => { await handleUpdateResource('contact', contactInfo?.id || 0, contactInfo || {}, fetchContact); }} style={maroonBtn}>Save contact</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'media' && (
        <div style={{ marginTop: 12 }}>
          <div style={cardStyle}>
            <h3>Media</h3>
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'grid', gap: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <input placeholder="Caption (EN)" value={addMediaData.title_en} onChange={(e) => setAddMediaData({ ...addMediaData, title_en: e.target.value })} style={{ padding: 10 }} />
                  <input placeholder="शीर्षक (HI)" value={addMediaData.title_hi} onChange={(e) => setAddMediaData({ ...addMediaData, title_hi: e.target.value })} style={{ padding: 10 }} />
                </div>
                <input placeholder="URL" value={addMediaData.url} onChange={(e) => setAddMediaData({ ...addMediaData, url: e.target.value })} style={{ padding: 10 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={async () => { await handleAddResource('media', addMediaData, fetchMedia); setAddMediaData({ title_en: '', title_hi: '', url: '' }); }} style={maroonBtn}>Save</button>
                  <button onClick={() => { setAddMediaData({ title_en: '', title_hi: '', url: '' }); }} style={{ padding: '10px 14px', borderRadius: 8 }}>Reset</button>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              {mediaList.map((m: any) => (
                <div key={m.id} style={{ borderTop: '1px solid #eee', paddingTop: 10, marginTop: 10 }}>
                  {editingMediaId === m.id ? (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <input value={editMediaData.title_en || ''} onChange={(e) => setEditMediaData({ ...editMediaData, title_en: e.target.value })} style={{ padding: 8, width: '100%' }} />
                        <input value={editMediaData.title_hi || ''} onChange={(e) => setEditMediaData({ ...editMediaData, title_hi: e.target.value })} style={{ padding: 8, width: '100%' }} />
                      </div>
                      <input value={editMediaData.url || ''} onChange={(e) => setEditMediaData({ ...editMediaData, url: e.target.value })} style={{ padding: 8, width: '100%', marginTop: 8 }} />
                      <div style={{ marginTop: 8 }}>
                        <button onClick={() => { handleUpdateResource('media', m.id, editMediaData, fetchMedia); setEditingMediaId(null); }}>Save</button>
                        <button onClick={() => setEditingMediaId(null)} style={{ marginLeft: 8 }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <strong>{m.title_en || m.url}</strong>
                      {m.title_hi ? <div style={{ marginTop: 4, color: '#6b7280' }}>{m.title_hi}</div> : null}
                      <div style={{ marginTop: 6 }}><a href={m.url} target="_blank" rel="noreferrer">Open</a></div>
                      <div style={{ marginTop: 6 }}>
                        <button style={actionBtn} onClick={() => { setEditingMediaId(m.id); setEditMediaData(m); }}>Edit</button>
                        {pendingDelete.resource === 'media' && pendingDelete.id === m.id ? (
                          <span style={{ marginLeft: 8 }}>
                            <button onClick={performPendingDelete} style={{ background: '#b91c1c', color: '#fff', padding: '6px 10px', borderRadius: 6 }}>Confirm</button>
                            <button onClick={cancelPendingDelete} style={{ marginLeft: 8, ...actionBtn }}>Cancel</button>
                          </span>
                        ) : (
                          <button onClick={() => openDeleteConfirmation('media', m.id, fetchMedia)} style={{ marginLeft: 8, ...actionDangerBtn }}>Delete</button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
