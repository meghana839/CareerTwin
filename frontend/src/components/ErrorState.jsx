import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ 
  title = 'Something Went Wrong', 
  message = 'Unable to complete your request at this time.', 
  onRetry 
}) {
  return (
    <div className="state-container">
      <div className="state-icon-wrapper error">
        <AlertCircle size={32} />
      </div>
      <div className="state-title">{title}</div>
      <div className="state-desc">{message}</div>
      {onRetry && (
        <button className="btn btn-secondary btn-sm" onClick={onRetry}>
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
