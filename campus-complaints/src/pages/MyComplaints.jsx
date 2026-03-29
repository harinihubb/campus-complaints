import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComplaints } from '../services/api';
import { useAuth } from '../components/AuthContext';
import StatusBadge from '../components/StatusBadge';

const FILTERS = ['All', 'Submitted', 'In Progress', 'Resolved'];

const MyComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [filter, setFilter]         = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const data = await getComplaints(user?.id);
        console.log('[MyComplaints] Loaded:', data);
        setComplaints(data);
      } catch {
        setError('Failed to load complaints. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

  if (loading) return (
    <div className="page-content page-animate">
      <div className="loading-wrap"><div className="spinner" /><p>Loading your complaints…</p></div>
    </div>
  );

  return (
    <div className="page-content page-animate">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Syne', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>My Complaints</h1>
          <p style={{ color: 'var(--text2)', marginTop: 4, fontSize: '0.925rem' }}>
            {complaints.length} total · {complaints.filter(c => c.status === 'Resolved').length} resolved
          </p>
        </div>
        <Link to="/submit" className="btn-submit" style={{ width: 'auto', marginTop: 0 }}>
          + New Complaint
        </Link>
      </div>

      {error && <div className="alert error">⚠️ {error}</div>}

      {/* Filter buttons */}
      <div className="admin-controls">
        <span style={{ color: 'var(--text2)', fontSize: '0.875rem', fontWeight: 600 }}>Filter:</span>
        {FILTERS.map(f => (
          <button key={f} className={`filter-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No complaints found</h3>
          <p>{filter !== 'All' ? `No complaints with status "${filter}"` : "You haven't submitted any complaints yet"}</p>
          {filter === 'All' && (
            <Link to="/submit" style={{ display: 'inline-block', marginTop: '1rem', color: 'var(--accent2)', textDecoration: 'none', fontWeight: 600 }}>
              Submit your first complaint →
            </Link>
          )}
        </div>
      ) : (
        <div className="complaints-grid">
          {filtered.map(c => (
            <div key={c.id} className="complaint-card">
              <div className="complaint-card-header">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="complaint-card-title">{c.title}</div>
                  <div className="complaint-card-meta">
                    <span className="badge category">📁 {c.category}</span>
                    <span className="badge category">📍 {c.location}</span>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
              {c.description && (
                <div className="complaint-card-body">{c.description}</div>
              )}
              <div className="complaint-card-footer">
                <span>🗓 {c.date}</span>
                {c.imageUrl && <span>📎 {c.imageUrl}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
