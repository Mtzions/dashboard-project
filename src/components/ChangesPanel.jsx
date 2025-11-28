import React, { useState, useEffect } from 'react';
import StatusPill from './StatusPill';
import './ChangesPanel.css';

const ChangesPanel = ({ filter, setFilter }) => {
  const [previousFilter, setPreviousFilter] = useState(filter);
  
  const changes = [
    { id: 1, type: 'ADDED', file: 'src/tools/worldsound_file_tools.py', time: '2h ago', branch: 'main' },
    { id: 2, type: 'MODIFIED', file: 'src/worldsound.py', time: '5h ago', branch: 'main' },
    { id: 3, type: 'REMOVED', file: 'tests/old_stft_test.py', time: '8h ago', branch: 'main' }
  ];

  const filteredChanges = filter === 'all' 
    ? changes 
    : changes.filter(change => change.type.toLowerCase() === filter);

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'added', label: 'Added' },
    { id: 'modified', label: 'Modified' },
    { id: 'removed', label: 'Removed' }
  ];

  const handleFilterClick = (filterId) => {
    setPreviousFilter(filter);
    setFilter(filterId);
  };

  const handleFileClick = (file) => {
    console.log(`View diff for: ${file}`);
    // In a real app, this would show a diff view
  };

  // Add animation class when filter changes
  useEffect(() => {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
      button.classList.remove('filter-transition');
      void button.offsetWidth; // Trigger reflow
      button.classList.add('filter-transition');
    });
  }, [filter]);

  return (
    <div className="changes-panel">
      <h2 className="panel-title">Changes</h2>
      <div className="changes-filters">
        {filterOptions.map(option => (
          <button
            key={option.id}
            className={`filter-button ${filter === option.id ? 'active' : ''}`}
            onClick={() => handleFilterClick(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="changes-list">
        {filteredChanges.map(change => (
          <div 
            key={change.id} 
            className="change-item fade-in-up"
            onClick={() => handleFileClick(change.file)}
          >
            <div className="change-file-info">
              <div className="file-icon">
                <span className="file-icon-text">📄</span>
              </div>
              <span className="file-name">{change.file}</span>
            </div>
            <span className="change-time">{change.time}</span>
            <span className="branch-tag">{change.branch}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangesPanel;