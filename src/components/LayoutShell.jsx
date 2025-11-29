import React, { useState } from 'react';
import WindowHeader from './WindowHeader';
import TopTabs from './TopTabs';
import ChatPanel from './ChatPanel';
import ChangesPanel from './ChangesPanel';
import AgentsSidebar from './AgentsSidebar';
import TaskItem from './TaskItem';
import { restoreActiveTab, persistActiveTab, restoreChangesFilter, persistChangesFilter } from '../utils/persistence';
import styles from './TaskQueue.module.css';

const LayoutShell = () => {
  const [activeTab, setActiveTab] = useState(restoreActiveTab());
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [changesFilter, setChangesFilter] = useState(restoreChangesFilter());
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Persist active tab
  React.useEffect(() => {
    persistActiveTab(activeTab);
  }, [activeTab]);

  // Persist changes filter
  React.useEffect(() => {
    persistChangesFilter(changesFilter);
  }, [changesFilter]);

  // Mock task data for demonstration
  const mockTasks = [
    {
      id: 1,
      title: "Analyze user feedback patterns",
      description: "Examine recent feedback to identify common themes",
      status: "done",
      timestamp: Date.now() - 3600000,
      agent: "Planner"
    },
    {
      id: 2,
      title: "Generate database schema",
      description: "Create optimized schema for new analytics module",
      status: "in progress",
      progress: 65,
      timestamp: Date.now() - 1800000,
      agent: "Planner"
    },
    {
      id: 3,
      title: "Implement authentication layer",
      description: "Set up secure login and token management",
      status: "queued",
      timestamp: Date.now() - 1200000,
      agent: "Planner"
    },
    {
      id: 4,
      title: "Write unit tests for API endpoints",
      description: "Cover all new endpoints with comprehensive tests",
      status: "planning",
      timestamp: Date.now() - 600000,
      agent: "Planner"
    },
    {
      id: 5,
      title: "Deploy to staging environment",
      description: "Release latest build to staging for QA",
      status: "error",
      timestamp: Date.now() - 300000,
      agent: "Planner"
    }
  ];

  return (
    <div className="dashboard-container">
      <WindowHeader />
      
      <div className={`main-content ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <AgentsSidebar onSidebarStateChange={setSidebarExpanded} />
        <div className="center-column">
          <TopTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <ChatPanel />
          <ChangesPanel filter={changesFilter} setFilter={setChangesFilter} />
        </div>
        
        <div className="right-column">
          <div className={styles.taskQueuePanel}>
            <h2 className={styles.panelTitle}>Task Queue</h2>
            <div className={styles.taskList}>
              {mockTasks.map((task, index) => (
                <div key={task.id}>
                  {index > 0 && <div className={styles.taskSeparator}></div>}
                  <TaskItem task={task} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="ai-workflow-panel">
            <h2 className="panel-title">AI Workflow</h2>
            <div className="workflow-description">
              Recent workflow execution with automated steps
            </div>
            
            <div className="workflow-git-info">
              <div className="git-info-item">
                <span className="git-label">Branch:</span>
                <span className="git-value">feature/new-ui</span>
              </div>
              <div className="git-info-item">
                <span className="git-label">Commit:</span>
                <span className="git-value">Add new dashboard components</span>
              </div>
              <div className="git-info-item">
                <span className="git-label">CI Status:</span>
                <div className="ci-status">
                  <span className="ci-text">✓ Passed</span>
                </div>
              </div>
            </div>
            
            <div className="workflow-list">
              <div className="workflow-item">
                <div className="dot-indicator--completed"></div>
                <div className="task-text">File analysis</div>
              </div>
              <div className="workflow-item">
                <div className="dot-indicator--completed"></div>
                <div className="task-text">Code generation</div>
              </div>
              <div className="workflow-item">
                <div className="dot-indicator--in-progress"></div>
                <div className="task-text">Testing</div>
              </div>
              <div className="workflow-item">
                <div className="dot-indicator--pending"></div>
                <div className="task-text">Deployment</div>
              </div>
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
          className={`mobile-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Tasks</span>
        </div>
        <div 
          className={`mobile-nav-item ${activeTab === 'changes' ? 'active' : ''}`}
          onClick={() => setActiveTab('changes')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Changes</span>
        </div>
      </div>
    </div>
  );
};

export default LayoutShell;