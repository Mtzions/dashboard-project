import React from 'react';

const StatusPill = ({ status, children, className = '' }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'queued':
        return 'status-pill--queued';
      case 'running':
        return 'status-pill--running';
      case 'done':
        return 'status-pill--done';
      case 'error':
        return 'status-pill--error';
      default:
        return 'status-pill';
    }
  };

  // If no children provided, use the status text
  const content = children || status?.replace('_', ' ') || '';

  return (
    <span className={`status-pill ${getStatusClass()} ${className}`}>
      {content}
    </span>
  );
};

export default StatusPill;