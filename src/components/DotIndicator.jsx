import React from 'react';

const DotIndicator = ({ status, className = '' }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'completed':
        return 'dot-indicator--completed';
      case 'in-progress':
        return 'dot-indicator--in-progress';
      case 'pending':
        return 'dot-indicator--pending';
      case 'passing':
        return 'dot-indicator--passing';
      case 'failing':
        return 'dot-indicator--failing';
      default:
        return 'dot-indicator';
    }
  };

  return (
    <span className={`dot-indicator ${getStatusClass()} ${className}`}></span>
  );
};

export default DotIndicator;