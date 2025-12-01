import React, { useState, useEffect } from 'react';
import WindowHeader from './WindowHeader';
import TopTabs from './TopTabs';
import ChatPanel from './ChatPanel';
import TaskQueueSidebar from './TaskQueueSidebar';
import { restoreActiveTab, persistActiveTab } from '../utils/persistence';
import './Layout.css'; // Simple global CSS for layout
import './TaskQueueSidebar.css'; // Task queue specific styles
import './WindowHeader.css'; // Window header specific styles
import './ChatPanel.css'; // Chat panel specific styles
import './TopTabs.css'; // Top tabs specific styles
import { MODEL_PRESETS } from './ModelSelector';
import { useProject } from '../context/ProjectStateContext';

const LayoutShell = ({ projectId }) => {
  const { activeTab, setActiveTab } = useProject();
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [currentModelPreset, setCurrentModelPreset] = useState(MODEL_PRESETS[0]);

  // Persist active tab
  React.useEffect(() => {
    persistActiveTab(activeTab);
  }, [activeTab]);

  const handleModelPresetChange = (preset) => {
    setCurrentModelPreset(preset);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatPanel modelPreset={currentModelPreset} />;
      case 'console':
        return <div>Console View</div>;
      case 'workflow':
        return <div>Workflow View</div>;
      default:
        return <ChatPanel modelPreset={currentModelPreset} />;
    }
  };

  return (
    <div className="dashboard-container">
      <WindowHeader onModelPresetChange={handleModelPresetChange} />
      
      {/* New clean layout with single Task Queue sidebar */}
      <div className="app-main">
        {/* Single Task Queue Sidebar */}
        <div className="sidebar">
          <TaskQueueSidebar projectId={projectId} />
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <div className="tabbed-content">
            <div className="toolbar">
              <TopTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="content-area">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="mobile-nav">
        <div 
          className={`mobile-nav-item ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 11L12 15L8 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Chat</span>
        </div>
        <div 
          className={`mobile-nav-item ${activeTab === 'workflow' ? 'active' : ''}`}
          onClick={() => setActiveTab('workflow')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Workflow</span>
        </div>
      </div>
    </div>
  );
};

export default LayoutShell;