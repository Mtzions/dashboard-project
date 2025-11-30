import React, { useState, useEffect } from 'react';
import './AgentsSidebar.css';
import { api } from '../utils/apiClient';

const AgentsSidebar = ({ onSidebarStateChange }) => {
  const [expanded, setExpanded] = useState(true);
  const [hoveredAgent, setHoveredAgent] = useState(null);
  const [tasks, setTasks] = useState([]);

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

  const handleAgentAction = (agentId, action) => {
    console.log(`Agent ${agentId} action: ${action}`);
    // In a real app, this would trigger the actual action
  };

  // Load tasks function
  const loadTasks = async () => {
    try {
      const res = await api.getTasks("dashboard-project");
      setTasks(res.tasks || []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setTasks([]);
    }
  };

  // Load tasks on mount and when projectId changes
  useEffect(() => {
    loadTasks();
  }, []);

  // Set up event listener for task updates
  useEffect(() => {
    function handleTasksUpdated(e) {
      if (!e.detail || e.detail.projectId !== "dashboard-project") return;
      loadTasks();
    }
    
    window.addEventListener("worldsound:tasks-updated", handleTasksUpdated);
    return () => window.removeEventListener("worldsound:tasks-updated", handleTasksUpdated);
  }, []);

  // Notify parent component of sidebar state changes
  React.useEffect(() => {
    if (onSidebarStateChange) {
      onSidebarStateChange(expanded);
    }
  }, [expanded, onSidebarStateChange]);

  return (
    <div className={`agents-sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <button 
          className="toggle-button"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? '◀' : '▶'}
        </button>
        {expanded && <span className="sidebar-title">Agents</span>}
      </div>
      
      <div className="agents-list">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className="agent-item"
            onMouseEnter={() => setHoveredAgent(agent.id)}
            onMouseLeave={() => setHoveredAgent(null)}
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
            
            {/* Agent detail tooltip */}
            {hoveredAgent === agent.id && expanded && (
              <div className="agent-tooltip">
                <div className="tooltip-content">
                  <div className="tooltip-header">
                    <span className="tooltip-icon">{agent.icon}</span>
                    <span className="tooltip-name">{agent.name}</span>
                  </div>
                  <p className="tooltip-description">{agent.description}</p>
                  <div className="tooltip-footer">
                    <span className="tooltip-last-run">Last run: {agent.lastRun}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Task Queue Section */}
      {expanded && (
        <div className="task-queue-section">
          <h3 className="task-queue-title">Task Queue</h3>
          <div className="task-list">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-header">
                    <div className="task-title">{task.title}</div>
                    <div className="task-status">{task.status}</div>
                  </div>
                  <div className="task-description">{task.description}</div>
                </div>
              ))
            ) : (
              <div className="no-tasks">No tasks available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsSidebar;