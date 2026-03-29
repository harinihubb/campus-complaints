import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { getComplaints } from '../services/api';
import StatusBadge from '../components/StatusBadge';

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getComplaints(user?.id);
        setComplaints(data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const stats = {
    total:      complaints.length,
    submitted:  complaints.filter(c => c.status === 'Submitted').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved:   complaints.filter(c => c.status === 'Resolved').length,
  };

  const recent = [...complaints].reverse().slice(0, 3);

  return (
    <div className="page-content page-animate">
      {/* Header */}
      <div className="page-header">
        <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p>Manage your campus complaints from one place</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: '📋', value: stats.total,      label: 'Total Complaints',  color: 'var(--text)' },
          { icon: '⏳', value: stats.submitted,  label: 'Submitted',         color: 'var(--yellow)' },
          { icon: '🔄', value: stats.inProgress, label: 'In Progress',       color: 'var(--accent2)' },
          { icon: '✅', value: stats.resolved,   label: 'Resolved',          color: 'var(--green)' },
        ].map(({ icon, value, label, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.04)' }}>{icon}</div>
            <div>
              <div className="stat-value" style={{ color }}>{loading ? '—' : value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/submit" className="action-card">
          <div className="action-card-icon">📝</div>
          <h3>Submit a Complaint</h3>
          <p>Report issues with WiFi, hostel, equipment, or library</p>
          <div className="arrow">Get started →</div>
        </Link>
        <Link to="/my-complaints" className="action-card">
          <div className="action-card-icon">📂</div>
          <h3>My Complaints</h3>
          <p>View and track the status of all your submitted complaints</p>
          <div className="arrow">View all →</div>
        </Link>
      </div>

      {/* Recent */}
      {recent.length > 0 && (
        <>
          <div className="section-title">Recent Activity</div>
          <div className="complaints-grid">
            {recent.map(c => (
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
                <div className="complaint-card-footer">
                  <span>🗓 {c.date}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
