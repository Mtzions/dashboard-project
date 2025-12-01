import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task }) => {
  return (
    <div className="task-item">
      <div className="task-header">
        <div className="task-content">
          <div className="task-title">{task.title}</div>
          {task.description && (
            <div className="task-description-code">
              <pre>{task.description}</pre>
            </div>
          )}
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="task-status-container">
        <span className={`status-badge ${task.status}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>
      
      {/* Full details section - always visible */}
      <div className="task-details">
        {task.prompt && (
          <div className="task-prompt">
            <div className="task-section-title">Prompt</div>
            <div className="task-prompt-content">
              <pre>{task.prompt}</pre>
            </div>
          </div>
        )}
        {task.result && (
          <div className="task-result">
            <div className="task-section-title">Result</div>
            <div className="task-result-content">
              <pre>{task.result}</pre>
            </div>
          </div>
        )}
        <div className="task-meta">
          <div className="task-timestamp">
            {task.timestamp ? new Date(task.timestamp).toLocaleString() : 'Just now'}
          </div>
          <div className="task-agent">
            Agent: {task.agent || 'Planner'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;