import React, { useState, useRef, useEffect } from 'react';
import './GitMenu.css';

const GitMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const menuItems = [
    { id: 'open-repo', label: 'Open Repo' },
    { id: 'new-branch', label: 'Create New Branch' },
    { id: 'commit', label: 'Commit Changes' },
    { id: 'push', label: 'Push to Remote' },
    { id: 'pull-requests', label: 'View Pull Requests' },
    { id: 'ci-runs', label: 'View CI/CD Runs' }
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (itemId) => {
    console.log(`Git action: ${itemId}`);
    setIsOpen(false);
  };

  return (
    <div className="git-menu-container" ref={menuRef}>
      <button 
        className="git-menu-button toolbar-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Git menu"
      >
        {/* Text-based menu button - no SVG needed */}
        <span className="menu-text">Git</span>
      </button>
      
      {isOpen && (
        <div className="git-menu-dropdown fade-in-scale">
          {menuItems.map(item => (
            <button
              key={item.id}
              className="git-menu-item"
              onClick={() => handleItemClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GitMenu;