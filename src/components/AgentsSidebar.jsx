import React, { useState } from 'react';
import './AgentsSidebar.css';
import TaskQueueSidebar from './TaskQueueSidebar';
import { useProject } from '../context/ProjectStateContext';

const AgentsSidebar = ({ onSidebarStateChange }) => {
  const [expanded, setExpanded] = useState(true);
  const { projectId } = useProject();

  // Mock agent data
  const agents = [
    {
      id: 1,
      name: 'Planner',
      description: 'Creates plans & tasks',
      lastRun: '5m ago',
      status: 'READY',
      icon: '📋'
    },
    {
      id: 2,
      name: 'Executor',
      description: 'Runs tasks and workflows',
      lastRun: '12m ago',
      status: 'RUNNING',
      icon: '⚙️'
    },
    {
      id: 3,
      name: 'Analyzer',
      description: 'Analyzes data and reports',
      lastRun: '2h ago',
      status: 'PENDING',
      icon: '📊'
    },
    {
      id: 4,
      name: 'Communicator',
      description: 'Handles external communications',
      lastRun: '1d ago',
      status: 'ERROR',
      icon: '💬'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'READY': return '#4ade80';
      case 'RUNNING': return '#fbbf24';
      case 'PENDING': return '#6b7280';
      case 'ERROR': return '#f87171';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'READY': return 'Ready';
      case 'RUNNING': return 'Running';
      case 'PENDING': return 'Pending';
      case 'ERROR': return 'Error';
      default: return status;
    }
  };

  // Notify parent component of sidebar state changes
  React.useEffect(() => {
    if (onSidebarStateChange) {
      onSidebarStateChange(expanded);
    }
  }, [expanded, onSidebarStateChange]);

  return (
    <div className={`agents-sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <button 
          className="toggle-button"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? '◀' : '▶'}
        </button>
        {expanded && <span className="sidebar-title">WorldSound Agents</span>}
      </div>

      {/* Agents Section - Always visible, non-scrollable */}
      <div className="sidebar-agents">
        <h3 className="sidebar-section-title">Agents</h3>
        <div className="agents-list">
          {agents.map((agent) => (
            <div 
              key={agent.id}
              className="agent-item"
            >
              <div className="agent-info">
                <div className="agent-icon">{agent.icon}</div>
                <div className="agent-details">
                  {expanded && (
                    <>
                      <div className="agent-name">{agent.name}</div>
                      <div className="agent-meta">
                        <span className="agent-status" style={{ color: getStatusColor(agent.status) }}>
                          {getStatusText(agent.status)}
                        </span>
                        <span className="agent-last-run">• {agent.lastRun}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="agent-actions">
                  <button 
                    className="actions-menu-button"
                    aria-label="Agent actions"
                  >
                    ···
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Queue Section - Scrollable */}
      {expanded && <TaskQueueSidebar projectId={projectId} />}
    </div>
  );
};

export default AgentsSidebar;