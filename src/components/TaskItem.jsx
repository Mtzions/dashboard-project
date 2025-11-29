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

  const formatStatusLabel = (status) => {
    switch (status) {
      case 'planning':
        return 'Planning';
      case 'queued':
        return 'Queued';
      case 'in progress':
        return 'In progress';
      case 'done':
        return 'Done';
      case 'error':
        return 'Error';
      default:
        return '';
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
              width: `${task.progress || 0}%`
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
        {/* LEFT SIDE: status label + title/description */}
        <div className="task-header-main">
          <div className="task-status-row">
            <span className={`task-status-label task-status-label--${task.status.replace(' ', '-')}`}>
              {formatStatusLabel(task.status)}
            </span>
            <span className="task-status-divider">•</span>
            <span className="task-status-agent">
              Agent: {task.agent || 'Planner'}
            </span>
          </div>

          <div className="task-content">
            <div className="task-title">{task.title}</div>
            {task.description && (
              <div className="task-subtitle">{task.description}</div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: progress + chevron */}
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