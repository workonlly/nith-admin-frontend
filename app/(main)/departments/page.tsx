"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

type Dept = {
  id: number;
  code: string;
  name_en: string;
  description_short_en?: string;
};

export default function Page() {
  const [depts, setDepts] = useState<Dept[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newDept, setNewDept] = useState({ code: '', name_en: '', description_short_en: '' });

  useEffect(() => {
    const fetchDepts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:4000/v1/departments");
        let json = null;
        let text = null;
        try { json = await res.json(); } catch { text = await res.text(); }
        if (!res.ok) throw new Error((json && json.message) || text || "Failed to load");
        setDepts((json && json.data) || []);
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/v1/departments");
      let json = null;
      let text = null;
      try { json = await res.json(); } catch { text = await res.text(); }
      if (!res.ok) throw new Error((json && json.message) || text || "Failed to load");
      setDepts((json && json.data) || []);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async () => {
    if (!newDept.code || !newDept.name_en) {
      alert('Please provide code and English name');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/v1/departments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newDept) });
      let json = null;
      let text = null;
      try { json = await res.json(); } catch { text = await res.text(); }
      if (!res.ok) throw new Error((json && json.message) || text || 'Create failed');
      setNewDept({ code: '', name_en: '', description_short_en: '' });
      setShowAdd(false);
      await refresh();
      router.push(`/departments/${json.data.code || newDept.code}`);
    } catch (err: any) {
      alert(err.message || String(err));
    }
  };

  const handleDeleteDepartment = async (code: string) => {
    if (!confirm('Delete this department and all associated records?')) return;
    try {
      const res = await fetch(`http://localhost:4000/v1/departments/${code}`, { method: 'DELETE' });
      let json = null;
      let text = null;
      try { json = await res.json(); } catch { text = await res.text(); }
      if (!res.ok) throw new Error((json && json.message) || text || 'Delete failed');
      await refresh();
    } catch (err: any) {
      alert(err.message || String(err));
    }
  };

  const openEditorWithAnimation = (code: string) => {
    setActiveCard(code);
    // small delay to allow scale animation to show
    setTimeout(() => {
      router.push(`/departments/${code}`);
    }, 220);
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: 20,
    marginTop: 16,
  };

  const cardBase: React.CSSProperties = {
    background: '#fff',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
    border: '1px solid rgba(235,230,230,1)',
    minHeight: 120,
  };

  const iconBox: React.CSSProperties = {
    width: 46,
    height: 46,
    borderRadius: 10,
    background: '#f6eaea',
    color: '#7b1414',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    marginRight: 12,
  };

  const openLinkStyle: React.CSSProperties = {
    color: '#7b1414',
    textDecoration: 'none',
    fontWeight: 600,
    display: 'inline-flex',
    gap: 8,
    alignItems: 'center',
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 6px 0' }}>Departments</h1>
        <p style={{ margin: 0, color: '#475569' }}>Manage department overview, programmes, mission, research, faculty, labs, contact, and media.</p>

        {loading && <div style={{ marginTop: 18 }}>Loading...</div>}
        {error && <div style={{ marginTop: 18, color: 'red' }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
          <div style={{ color: '#475569' }}>Select a department to open its editor.</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { setShowAdd(!showAdd); }} style={{ padding: '8px 12px', borderRadius: 8, background: '#fff', border: '1px solid #eef2f6' }}>{showAdd ? 'Cancel' : 'Add department'}</button>
          </div>
        </div>

        {showAdd && (
          <div style={{ marginTop: 12, ...cardBase }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px', gap: 12 }}>
              <input placeholder="Code (eg. cse)" value={newDept.code} onChange={(e) => setNewDept({ ...newDept, code: e.target.value })} style={{ padding: 10 }} />
              <input placeholder="English name" value={newDept.name_en} onChange={(e) => setNewDept({ ...newDept, name_en: e.target.value })} style={{ padding: 10 }} />
              <input placeholder="Order index" style={{ padding: 10 }} />
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={handleAddDepartment} style={{ ...{ background: '#7b1414', color: '#fff', padding: '10px 14px', borderRadius: 8, border: 'none' } }}>Create</button>
            </div>
          </div>
        )}

        <div style={gridStyle}>
          {depts.map((d, idx) => {
            const isActive = activeCard === d.code;
            return (
              <div key={d.id} style={{ ...cardBase, transition: 'transform 180ms ease, box-shadow 180ms ease', transform: isActive ? 'scale(0.98)' : 'scale(1)', boxShadow: isActive ? '0 18px 40px rgba(2,6,23,0.2)' : cardBase.boxShadow }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={iconBox}>🏫</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{d.name_en}</div>
                        <div style={{ marginTop: 8, color: '#64748b', fontSize: 13 }}>{d.description_short_en}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEditorWithAnimation(d.code)} style={{ background: '#fff', border: '1px solid #eef2f6', padding: '8px 10px', borderRadius: 8 }}>Open editor</button>
                        <button onClick={() => handleDeleteDepartment(d.code)} style={{ background: '#fff', border: '1px solid #ffd6de', color: '#b91c1c', padding: '8px 10px', borderRadius: 8 }}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
