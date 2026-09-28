import React from 'react';

export default function StatCard({ label, value, subtext, icon: Icon, color = 'indigo' }) {
  return (
    <div className={`stat-card ${color}`}>
      {Icon && (
        <div className="stat-icon">
          <Icon size={22} />
        </div>
      )}
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {subtext && <div className="stat-subtext">{subtext}</div>}
    </div>
  );
}
