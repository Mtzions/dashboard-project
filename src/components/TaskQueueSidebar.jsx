import React, { useState, useEffect } from 'react';
import { api } from '../utils/apiClient';
import StatusPill from './StatusPill';
import TaskItem from './TaskItem';

const TaskQueueSidebar = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  // Load tasks function
  const loadTasks = async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      const res = await api.getTasks(projectId);
      
      // Handle different response structures
      let tasksArray = [];
      if (Array.isArray(res)) {
        tasksArray = res;
      } else if (res && Array.isArray(res.tasks)) {
        tasksArray = res.tasks;
      } else if (res && res.data && Array.isArray(res.data)) {
        tasksArray = res.data;
      }
      
      setTasks(tasksArray);
    } catch (err) {
      setError(err.message);
      console.error("Failed to load tasks:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on mount and when projectId changes
  useEffect(() => {
    loadTasks();
  }, [projectId]);

  // Set up event listener for task updates
  useEffect(() => {
    function handleTasksUpdated(e) {
      if (!e.detail || e.detail.projectId !== projectId) return;
      loadTasks();
    }
    
    window.addEventListener("worldsound:tasks-updated", handleTasksUpdated);
    return () => window.removeEventListener("worldsound:tasks-updated", handleTasksUpdated);
  }, [projectId]);

  // Handle run all pending tasks
  const handleRunAllPending = () => {
    console.log("Run all pending tasks triggered");
    // In a real app, this would dispatch an event or call an API
    // For now, just log to console
  };

  // Toggle task expansion
  const toggleTaskExpansion = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  // Get status icon for task
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

  return (
    <div className="sidebar-tasks">
      <h3 className="sidebar-section-title">Task Queue</h3>
      <div className="task-list-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div className="loading-indicator">Loading tasks...</div>
        ) : error ? (
          <div className="error-message">Error loading tasks: {error}</div>
        ) : tasks.length > 0 ? (
          <div className="task-list">
            {/* Show all tasks */}
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="no-tasks">No tasks available</div>
        )}
      </div>
      <div className="sidebar-footer">
        <button 
          className="run-all-pending-btn"
          onClick={handleRunAllPending}
        >
          Run All Pending Tasks
        </button>
      </div>
    </div>
  );
};

export default TaskQueueSidebar;