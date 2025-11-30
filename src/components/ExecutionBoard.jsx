import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../utils/apiClient';
import { useProject } from '../context/ProjectStateContext';
import styles from './TaskQueue.module.css';
import './ExecutionBoard.css'; // Custom styles for execution board

const ExecutionBoard = () => {
  const [projectId] = useState("dashboard-project");
  const [runs, setRuns] = useState([]);
  const [repoSnapshot, setRepoSnapshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRun, setSelectedRun] = useState(null);
  const [runLogs, setRunLogs] = useState({});

  // Load execution state
  const loadExecutionState = async () => {
    try {
      setLoading(true);
      setError(null);

      const state = await api.getProjectState(projectId);
      setRuns(state.taskRuns || []);
      setRepoSnapshot(state.repoSnapshot || null);
    } catch (err) {
      setError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadExecutionState();
  }, [projectId]);

  // Listen for updates
  useEffect(() => {
    function handleTasksUpdated(e) {
      if (!e.detail || e.detail.projectId !== projectId) return;
      loadExecutionState();
    }

    window.addEventListener("worldsound:tasks-updated", handleTasksUpdated);
    return () => {
      window.removeEventListener("worldsound:tasks-updated", handleTasksUpdated);
    };
  }, [projectId]);

  // Load logs for a specific run
  const loadRunLogs = async (runId) => {
    if (runLogs[runId]) return; // Already loaded
    
    try {
      const logs = await api.getTaskRunLogs(projectId, runId);
      setRunLogs(prev => ({
        ...prev,
        [runId]: logs.logs || []
      }));
    } catch (err) {
      console.error("Failed to load run logs:", err);
    }
  };

  // Group runs by status
  const runsByStatus = useMemo(() => {
    const groups = {
      running: [],
      waiting_for_user: [],
      success: [],
      failed: [],
      pending: [],
      cancelled: [],
    };

    for (const run of runs) {
      const status = run.status || "pending";
      if (groups[status]) {
        groups[status].push(run);
      } else {
        groups.pending.push(run);
      }
    }

    return groups;
  }, [runs]);

  // Calculate summary counts
  const totalRuns = runs.length;
  const runningCount = runsByStatus.running.length;
  const waitingCount = runsByStatus.waiting_for_user.length;
  const successCount = runsByStatus.success.length;
  const failedCount = runsByStatus.failed.length;

  // Format relative time
  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const now = new Date();
    const runTime = new Date(timestamp);
    const diffMinutes = Math.floor((now - runTime) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Get task title from metadata or fallback
  const getTaskTitle = (run) => {
    if (run.metadata?.taskTitle) return run.metadata.taskTitle;
    if (run.taskId) return run.taskId;
    return 'Unknown Task';
  };

  // Run list item component
  const RunListItem = ({ run }) => {
    const isExpanded = selectedRun?.id === run.id;
    
    return (
      <div className="run-item">
        <div className="run-header">
          <div className="run-title">
            {getTaskTitle(run)}
          </div>
          <div className="run-status">
            <span className={`status-pill status-${run.status}`}>
              {run.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="run-meta">
          <span className="run-time">{formatRelativeTime(run.startedAt)}</span>
        </div>
        <div className="run-actions">
          <button 
            className="run-action-btn"
            onClick={() => {
              if (isExpanded) {
                setSelectedRun(null);
              } else {
                setSelectedRun(run);
                loadRunLogs(run.id);
              }
            }}
          >
            {isExpanded ? 'Hide Logs' : 'View Logs'}
          </button>
        </div>
        
        {isExpanded && runLogs[run.id] && (
          <div className="run-logs">
            <h4>Log Entries</h4>
            {runLogs[run.id].map((log, index) => (
              <div key={index} className="log-entry">
                <div className="log-header">
                  <span className="log-timestamp">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`log-type log-type-${log.type}`}>
                    {log.type.toUpperCase()}
                  </span>
                </div>
                <div className="log-message">
                  {log.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="execution-board">
        <div className="panel-header">
          <h2>AI Workflow</h2>
          <p className="subtle">Execution Dashboard</p>
        </div>
        <div className="loading">Loading execution state...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="execution-board">
        <div className="panel-header">
          <h2>AI Workflow</h2>
          <p className="subtle">Execution Dashboard</p>
        </div>
        <div className="error">Failed to load: {error}</div>
      </div>
    );
  }

  return (
    <div className="execution-board">
      <div className="panel-header">
        <h2>AI Workflow</h2>
        <p className="subtle">Execution Dashboard</p>
      </div>

      {/* Repo snapshot */}
      {repoSnapshot && repoSnapshot.repoInfo && (
        <section className="repo-snapshot">
          <div className="label">Repository Status</div>
          <div className="value">
            <div className="repo-info">
              <span className="branch">Branch: {repoSnapshot.repoInfo.current_branch || "unknown"}</span>
              <span className="commit-summary">
                {repoSnapshot.repoInfo.latest_commit?.summary || "No commits"}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Summary metrics */}
      <section className="run-metrics">
        <div className="metric-card">
          <div className="metric-label">Running</div>
          <div className="metric-value">{runningCount}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Waiting</div>
          <div className="metric-value">{waitingCount}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Succeeded</div>
          <div className="metric-value">{successCount}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Failed</div>
          <div className="metric-value">{failedCount}</div>
        </div>
      </section>

      {/* Recent Runs List */}
      <section className="recent-runs">
        <h3>Recent Executions</h3>
        {runs.length > 0 ? (
          <div className="run-list">
            {runs.slice(0, 10).map((run) => (
              <RunListItem key={run.id} run={run} />
            ))}
          </div>
        ) : (
          <div className="no-runs">No task executions recorded yet.</div>
        )}
      </section>
    </div>
  );
};

export default ExecutionBoard;