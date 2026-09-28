import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading career intelligence...' }) {
  return (
    <div className="state-container">
      <div className="state-icon-wrapper loading">
        <Loader2 size={32} />
      </div>
      <div className="state-title">Please Wait</div>
      <div className="state-desc">{message}</div>
    </div>
  );
}
