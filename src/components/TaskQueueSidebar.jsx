import React, { useState, useEffect } from 'react';
import { api } from '../utils/apiClient';
import StatusPill from './StatusPill';
import TaskItem from './TaskItem';

const TaskQueueSidebar = ({ projectId = "dashboard-project" }) => {
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


  // Calculate task statistics
  const getTaskStats = () => {
    const total = tasks.length;
    const queued = tasks.filter(t => t.status === 'queued').length;
    const inProgress = tasks.filter(t => t.status === 'in progress').length;
    const done = tasks.filter(t => t.status === 'done').length;
    const error = tasks.filter(t => t.status === 'error').length;
    
    return { total, queued, inProgress, done, error };
  };

  const stats = getTaskStats();
  
  // Only show first 3 tasks
  const displayedTasks = tasks.slice(0, 3);

  return (
    <div className="sidebar-tasks">
      <h3 className="sidebar-section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Task Queue
      </h3>
      
      {/* Task Stats */}
      <div className="task-stats">
        <span>{stats.total} tasks</span>
        <span>{stats.queued} queued</span>
        <span>{stats.inProgress} in progress</span>
      </div>
      
      <div className="task-list-wrapper">
        {loading ? (
          <div className="loading-indicator">Loading tasks...</div>
        ) : error ? (
          <div className="error-message">Error loading tasks: {error}</div>
        ) : displayedTasks.length > 0 ? (
          <div className="task-list">
            {/* Show only first 5 tasks */}
            {displayedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
            {tasks.length > 3 && (
              <div className="task-limit-indicator">
                Showing 3 of {tasks.length} tasks
              </div>
            )}
          </div>
        ) : (
          <div className="empty-state">
            <svg className="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="empty-state-title">No tasks yet</div>
            <div className="empty-state-description">Your task queue is empty. Start by creating a new task or waiting for tasks to be generated.</div>
          </div>
        )}
      </div>
      
      <div className="sidebar-footer">
        <button 
          className="run-all-pending-btn"
          onClick={handleRunAllPending}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M12 4L16 8M12 4L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Run All Pending Tasks
        </button>
      </div>
    </div>
  );
};

export default TaskQueueSidebar;