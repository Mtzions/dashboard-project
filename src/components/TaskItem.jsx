import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/apiClient';
import StatusPill from './StatusPill';

const TaskItem = ({ task }) => {
  const [expanded, setExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

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

  // Handle run task
  const handleRunTask = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    try {
      // Call the API to run the task
      const result = await api.runTask("dashboard-project", task.id);
      
      // Dispatch the event to trigger a refresh
      window.dispatchEvent(new CustomEvent("worldsound:tasks-updated", {
        detail: { projectId: "dashboard-project" }
      }));
    } catch (error) {
      console.error("Failed to run task:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`task-item ${expanded ? 'expanded' : ''}`}
    >
      <div className="task-header" onClick={() => setExpanded(!expanded)}>
        <div className="task-status-icon">
          {getStatusIcon(task.status)}
        </div>
        <div className="task-content">
          <div className="task-title">{task.title}</div>
          {task.description && (
            <div className="task-description-snippet">{task.description}</div>
          )}
        </div>
        <div className="task-actions">
          <div className={`task-expand-icon ${expanded ? 'expanded' : ''}`}>
            {expanded ? '▲' : '▼'}
          </div>
        </div>
      </div>
      
      {/* Status pill and run button */}
      <div className="task-controls">
        <StatusPill status={task.status} />
        <button 
          className={`run-task-btn ${isRunning ? 'running' : ''}`}
          onClick={handleRunTask}
          disabled={isRunning}
          aria-label={`Run task ${task.title}`}
        >
          {isRunning ? 'Running...' : 'Run'}
        </button>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="task-details"
          >
            <div className="task-description-full">
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskItem;