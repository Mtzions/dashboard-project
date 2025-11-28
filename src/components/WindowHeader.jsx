import React, { useState, useRef, useEffect } from 'react';
import GitMenu from './GitMenu';
import ThemeToggle from './ThemeToggle';
import './WindowHeader.css';

const WindowHeader = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUserMenuClose = () => {
    setShowUserMenu(false);
  };

  return (
    <div className="window-header">
      <div className="header-left">
        <div className="traffic-lights">
          <div className="traffic-light red"></div>
          <div className="traffic-light yellow"></div>
          <div className="traffic-light green"></div>
        </div>
        <div className="window-title">WorldSound Agent Hub</div>
      </div>
      
      <div className="header-center">
        <div className="environment-pill">Dev</div>
      </div>
      
      <div className="header-toolbar">
        <GitMenu />
        <button className="toolbar-button" aria-label="New task">+</button>
        <ThemeToggle />
        <div className="user-menu-container" ref={userMenuRef}>
          <button 
            className="toolbar-button toolbar-button-avatar"
            onClick={handleUserMenuToggle}
            aria-label="User menu"
          >
            RL
          </button>
          
          {showUserMenu && (
            <div className="user-menu-dropdown fade-in-scale">
              <button className="user-menu-item">Profile</button>
              <button className="user-menu-item">Preferences</button>
              <button className="user-menu-item">Sign out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WindowHeader;