import React from 'react';

const TopTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'chat', label: 'Chat Agent Chat' },
    { id: 'console', label: 'Cline Console' },
    { id: 'workflow', label: 'Workflow Runs' }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="top-tabs" role="tablist">
      {tabs.map(tab => (
        <div 
          key={tab.id} 
          className={`tab ${activeTab === tab.id ? 'active' : ''} ${activeTab === tab.id ? 'tab-active' : ''}`}
          onClick={() => handleTabClick(tab.id)}
          role="tab"
          aria-selected={activeTab === tab.id}
          tabIndex={0}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
};

export default TopTabs;