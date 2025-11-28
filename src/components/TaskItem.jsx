import React, { useState } from 'react';

const TaskItem = ({ task }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusClass = (status) => {
    switch (status) {
      case 'planning':
        return 'task-item-planning';
      case 'queued':
        return 'task-item-queued';
      case 'in progress':
        return 'task-item-in-progress';
      case 'done':
        return 'task-item-done';
      case 'error':
        return 'task-item-error';
      default:
        return 'task-item-default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'planning':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'queued':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'in progress':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'done':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'error':
        return (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderProgress = () => {
    if (task.status !== 'in progress') return null;
    
    return (
      <div className="task-progress-container">
        <div className="task-progress-bar">
          <div 
            className="task-progress-fill"
            style={{ 
              width: `${task.progress || 0}%`,
              animation: 'pulse-progress 2s infinite'
            }}
          ></div>
        </div>
        <div className="task-progress-text">{task.progress || 0}%</div>
      </div>
    );
  };

  const renderDetails = () => {
    if (!expanded) return null;
    
    return (
      <div className="task-details">
        <div className="task-description">
          {task.description || 'No description available'}
        </div>
        {task.prompt && (
          <div className="task-prompt">
            <strong>Prompt:</strong> {task.prompt}
          </div>
        )}
        {task.result && (
          <div className="task-result">
            <strong>Result:</strong> {task.result}
          </div>
        )}
        <div className="task-meta">
          <span className="task-timestamp">
            {task.timestamp ? new Date(task.timestamp).toLocaleTimeString() : 'Just now'}
          </span>
          <span className="task-agent">Agent: {task.agent || 'Planner'}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`task-item ${getStatusClass(task.status)} ${expanded ? 'expanded' : ''}`}>
      <div className="task-header" onClick={() => setExpanded(!expanded)}>
        <div className="task-status-icon">
          {getStatusIcon(task.status)}
        </div>
        <div className="task-content">
          <div className="task-title">{task.title}</div>
          {task.description && (
            <div className="task-subtitle">{task.description}</div>
          )}
        </div>
        <div className="task-actions">
          {task.status === 'in progress' && (
            <div className="task-progress-indicator">
              {task.progress || 0}%
            </div>
          )}
          <div className="task-expand-icon">
            {expanded ? '▲' : '▼'}
          </div>
        </div>
      </div>
      
      {renderProgress()}
      {renderDetails()}
    </div>
  );
};

export default TaskItem;