import React, { useState, useEffect } from 'react';
import { getComplaints, updateComplaintStatus } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const CATEGORIES = ['All', 'WiFi', 'Hostel', 'Equipment', 'Library'];
const STATUSES   = ['Submitted', 'In Progress', 'Resolved'];

const statusCls  = s => s === 'Submitted' ? 'submitted' : s === 'In Progress' ? 'in-progress' : 'resolved';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [catFilter, setCatFilter]   = useState('All');
  const [statFilter, setStatFilter] = useState('All');
  const [updating, setUpdating]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getComplaints();
        console.log('[AdminDashboard] All complaints:', data);
        setComplaints(data);
      } catch {
        setError('Failed to load complaints.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await updateComplaintStatus(id, newStatus);
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    } catch (err) {
      alert('Update failed: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const filtered = complaints.filter(c => {
    const cat  = catFilter  === 'All' || c.category === catFilter;
    const stat = statFilter === 'All' || c.status   === statFilter;
    return cat && stat;
  });

  const stats = {
    total:      complaints.length,
    submitted:  complaints.filter(c => c.status === 'Submitted').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved:   complaints.filter(c => c.status === 'Resolved').length,
  };

  if (loading) return (
    <div className="page-content page-animate">
      <div className="loading-wrap"><div className="spinner" /><p>Loading all complaints…</p></div>
    </div>
  );

  return (
    <div className="page-content wide page-animate">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Review, filter, and resolve campus complaints</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: '📋', value: stats.total,      label: 'Total',       color: 'var(--text)' },
          { icon: '⏳', value: stats.submitted,  label: 'Submitted',   color: 'var(--yellow)' },
          { icon: '🔄', value: stats.inProgress, label: 'In Progress', color: 'var(--accent2)' },
          { icon: '✅', value: stats.resolved,   label: 'Resolved',    color: 'var(--green)' },
        ].map(({ icon, value, label, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.04)' }}>{icon}</div>
            <div>
              <div className="stat-value" style={{ color }}>{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {error && <div className="alert error">⚠️ {error}</div>}

      {/* Controls */}
      <div className="admin-controls">
        <span style={{ color: 'var(--text2)', fontSize: '0.875rem', fontWeight: 600 }}>Filter by:</span>
        <select className="filter-select" value={catFilter}  onChange={e => setCatFilter(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="filter-select" value={statFilter} onChange={e => setStatFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <span style={{ marginLeft: 'auto', color: 'var(--text3)', fontSize: '0.82rem' }}>
          Showing {filtered.length} / {complaints.length}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No complaints match this filter</h3>
          <p>Try a different category or status</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id}>
                  <td style={{ color: 'var(--text3)', fontWeight: 600, width: 40 }}>{i + 1}</td>
                  <td style={{ maxWidth: 280 }}>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{c.title}</div>
                    {c.description && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.description}
                      </div>
                    )}
                  </td>
                  <td><span className="badge category">📁 {c.category}</span></td>
                  <td style={{ color: 'var(--text2)', whiteSpace: 'nowrap' }}>📍 {c.location}</td>
                  <td style={{ color: 'var(--text3)', whiteSpace: 'nowrap' }}>🗓 {c.date}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <select
                      className={`status-select ${statusCls(c.status)}`}
                      value={c.status}
                      disabled={updating === c.id}
                      onChange={e => handleStatusChange(c.id, e.target.value)}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
