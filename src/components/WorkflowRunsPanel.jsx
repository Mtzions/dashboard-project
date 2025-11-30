// src/components/WorkflowRunsPanel.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../utils/apiClient';
import { useProject } from '../context/ProjectStateContext';

const WorkflowRunsPanel = () => {
  const { projectId, setSelectedRunId, setActiveTab } = useProject();
  const [runs, setRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);

  // Load task runs when component mounts
  useEffect(() => {
    const loadTaskRuns = async () => {
      try {
        setLoading(true);
        const data = await api.getTaskRuns(projectId);
        // Handle both old and new response shapes for backward compatibility
        let taskRuns = [];
        if (Array.isArray(data)) {
          // Old format: just an array
          taskRuns = data;
        } else if (data && data.taskRuns) {
          // New format: { projectId, taskRuns }
          taskRuns = data.taskRuns;
        } else if (data && data.runs) {
          // Legacy format: { projectId, runs }
          taskRuns = data.runs;
        }
        
        // Sort runs by startedAt descending (newest first)
        const sortedRuns = [...taskRuns].sort((a, b) => 
          new Date(b.startedAt) - new Date(a.startedAt)
        );
        setRuns(sortedRuns);
      } catch (error) {
        console.error('Error loading task runs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTaskRuns();
  }, [projectId]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await api.getTaskRuns(projectId);
      // Handle both old and new response shapes for backward compatibility
      let taskRuns = [];
      if (Array.isArray(data)) {
        // Old format: just an array
        taskRuns = data;
      } else if (data && data.taskRuns) {
        // New format: { projectId, taskRuns }
        taskRuns = data.taskRuns;
      } else if (data && data.runs) {
        // Legacy format: { projectId, runs }
        taskRuns = data.runs;
      }
      
      // Sort runs by startedAt descending (newest first)
      const sortedRuns = [...taskRuns].sort((a, b) => 
        new Date(b.startedAt) - new Date(a.startedAt)
      );
      setRuns(sortedRuns);
    } catch (error) {
      console.error('Error refreshing runs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLogs = async (runId) => {
    try {
      setLogsLoading(true);
      const runLogs = await api.getTaskRunLogs(projectId, runId);
      setLogs(runLogs.logs || []);
      setSelectedRun(runId);
      setSelectedRunId(runId);
      setActiveTab('console');
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
      setSelectedRun(null);
    } finally {
      setLogsLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#4ade80';
      case 'failed': return '#f87171';
      case 'pending': return '#fbbf24';
      case 'running': return '#60a5fa';
      default: return '#94a3b8';
    }
  };

  if (loading) {
    return (
      <div className="workflow-runs-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Workflow Runs</h3>
          <button 
            onClick={handleRefresh}
            disabled={loading}
            style={{
              padding: '4px 8px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            Refreshing...
          </button>
        </div>
        <div style={{ textAlign: 'center' }}>
          Loading workflow runs...
        </div>
      </div>
    );
  }

  return (
    <div className="workflow-runs-panel" style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0 }}>Workflow Runs</h3>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          style={{
            padding: '4px 8px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Runs List */}
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>Recent Runs</h4>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {runs.length === 0 ? (
              <p style={{ color: '#64748b' }}>No workflow runs found</p>
            ) : (
              runs.map((run) => (
                <div 
                  key={run.id}
                  onClick={() => handleViewLogs(run.id)}
                  style={{
                    padding: '8px',
                    borderBottom: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    backgroundColor: selectedRun === run.id ? '#dbeafe' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold' }}>{run.id}</span>
                    <span 
                      style={{ 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        backgroundColor: getStatusColor(run.status)
                      }}
                    >
                      {run.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Task: {run.taskId}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {formatTimestamp(run.startedAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Logs Display */}
        <div>
          <h4 style={{ margin: '0 0 8px 0' }}>
            {selectedRun ? `Logs for ${selectedRun}` : 'Run Logs'}
          </h4>
          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto', 
            border: '1px solid #e2e8f0', 
            padding: '8px',
            backgroundColor: '#f8fafc'
          }}>
            {logsLoading ? (
              <p>Loading logs...</p>
            ) : selectedRun ? (
              logs.length === 0 ? (
                <p>No logs available</p>
              ) : (
                logs.map((log, index) => (
                  <div key={log.id || index} style={{ 
                    padding: '4px 0', 
                    borderBottom: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}>
                    <div style={{ 
                      color: '#64748b',
                      display: 'inline-block',
                      minWidth: '80px'
                    }}>
                      [{log.type}] 
                    </div>
                    <span>{log.message}</span>
                  </div>
                ))
              )
            ) : (
              <p>Select a run to view logs</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowRunsPanel;