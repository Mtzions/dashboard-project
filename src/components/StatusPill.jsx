import React from 'react';

const StatusPill = ({ type, children, className = '' }) => {
  const getTypeClass = () => {
    switch (type) {
      case 'added':
        return 'status-pill--added';
      case 'modified':
        return 'status-pill--modified';
      case 'removed':
        return 'status-pill--removed';
      default:
        return 'status-pill';
    }
  };

  return (
    <span className={`status-pill ${getTypeClass()} ${className}`}>
      {children}
    </span>
  );
};

export default StatusPill;