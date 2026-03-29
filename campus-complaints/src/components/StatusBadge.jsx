import React from 'react';

const MAP = {
  'Submitted':   { cls: 'submitted',   icon: '🟡' },
  'In Progress': { cls: 'in-progress', icon: '🔵' },
  'Resolved':    { cls: 'resolved',    icon: '🟢' },
};

const StatusBadge = ({ status }) => {
  const { cls, icon } = MAP[status] || { cls: 'submitted', icon: '⚪' };
  return <span className={`badge ${cls}`}>{icon} {status}</span>;
};

export default StatusBadge;
