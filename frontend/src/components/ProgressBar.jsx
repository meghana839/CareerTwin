import React from 'react';

export default function ProgressBar({ value = 0, max = 100, label, color = 'indigo' }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  
  return (
    <div className="progress-container">
      {label && (
        <div className="progress-header">
          <span>{label}</span>
          <span style={{ fontWeight: 600 }}>{percentage}%</span>
        </div>
      )}
      <div className="progress-track">
        <div 
          className={`progress-fill ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
