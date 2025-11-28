import React from 'react';

const TopTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'console', label: 'Cline Console' },
    { id: 'chat', label: 'Chat Agent Chat' },
    { id: 'workflow', label: 'Workflow Runs' },
    { id: 'changes', label: 'Changes' }
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