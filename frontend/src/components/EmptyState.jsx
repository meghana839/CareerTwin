import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = 'No Data Found', 
  message = 'There is currently no information available for this section.',
  actionLabel,
  onAction 
}) {
  return (
    <div className="state-container">
      <div className="state-icon-wrapper empty">
        <Icon size={32} />
      </div>
      <div className="state-title">{title}</div>
      <div className="state-desc">{message}</div>
      {actionLabel && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
