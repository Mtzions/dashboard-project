import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../context/ProjectStateContext';
import { api } from '../utils/apiClient';

const ClineConsole = () => {
  const { projectId, selectedRunId } = useProject();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when logs change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [logs]);

  // Fetch logs when selectedRunId changes
  useEffect(() => {
    const fetchLogs = async () => {
      if (!selectedRunId) {
        setLogs([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const runLogs = await api.getTaskRunLogs(projectId, selectedRunId);
        setLogs(runLogs.logs || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [selectedRunId, projectId]);

  const renderLogEntry = (log) => {
    const logType = log.type || 'info';
    const message = log.message || '';
    const data = log.data || {};

    // Determine styling based on log type
    let containerStyle = {
      padding: '8px',
      margin: '4px 0',
      borderRadius: '4px',
      fontSize: '12px',
      wordBreak: 'break-word'
    };

    let textStyle = {
      color: '#333'
    };

    switch (logType) {
      case 'planner_message':
        containerStyle = {
          ...containerStyle,
          backgroundColor: '#dbeafe',
          borderLeft: '3px solid #3b82f6'
        };
        textStyle.color = '#1e40af';
        break;
      case 'cline_message':
        containerStyle = {
          ...containerStyle,
          backgroundColor: '#dcfce7',
          borderLeft: '3px solid #22c55e'
        };
        textStyle.color = '#166534';
        break;
      case 'error':
        containerStyle = {
          ...containerStyle,
          backgroundColor: '#fee2e2',
          borderLeft: '3px solid #ef4444'
        };
        textStyle.color = '#b91c1c';
        break;
      case 'file':
        containerStyle = {
          ...containerStyle,
          backgroundColor: '#fef3c7',
          borderLeft: '3px solid #f59e0b'
        };
        textStyle.color = '#92400e';
        break;
      case 'command':
        containerStyle = {
          ...containerStyle,
          backgroundColor: '#e0e7ff',
          borderLeft: '3px solid #6366f1'
        };
        textStyle.color = '#4338ca';
        break;
      case 'summary':
        containerStyle = {
          ...containerStyle,
          backgroundColor: '#f0fdf4',
          borderLeft: '3px solid #10b981'
        };
        textStyle.color = '#047857';
        break;
      case 'criteria':
        containerStyle = {
          ...containerStyle,
          backgroundColor: '#fff7ed',
          borderLeft: '3px solid #f97316'
        };
        textStyle.color = '#ea580c';
        break;
      case 'notes':
        containerStyle = {
          ...containerStyle,
          backgroundColor: '#f3e8ff',
          borderLeft: '3px solid #a855f7'
        };
        textStyle.color = '#7e22ce';
        break;
      default:
        containerStyle = {
          ...containerStyle,
          backgroundColor: '#f8fafc',
          borderLeft: '3px solid #94a3b8'
        };
        textStyle.color = '#475569';
    }

    // Format different log types
    let formattedMessage = message;
    
    if (logType === 'command') {
      formattedMessage = `[COMMAND] ${message}`;
    } else if (logType === 'file') {
      formattedMessage = `[FILE] ${message}`;
    } else if (logType === 'error') {
      formattedMessage = `[ERROR] ${message}`;
    } else if (logType === 'summary') {
      formattedMessage = `[SUMMARY] ${message}`;
    } else if (logType === 'criteria') {
      formattedMessage = `[CRITERIA] ${message}`;
    } else if (logType === 'notes') {
      formattedMessage = `[NOTES] ${message}`;
    }

    return (
      <div key={log.id} style={containerStyle}>
        <div style={textStyle}>
          {formattedMessage}
        </div>
        {Object.keys(data).length > 0 && (
          <div style={{ 
            marginTop: '4px', 
            fontSize: '10px', 
            color: '#64748b',
            fontStyle: 'italic'
          }}>
            {JSON.stringify(data, null, 2)}
          </div>
        )}
      </div>
    );
  };

  if (!selectedRunId) {
    return (
      <div style={{ 
        padding: '16px', 
        textAlign: 'center', 
        color: '#64748b',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <h3>No run selected</h3>
          <p>Choose a run from Workflow Runs to see the Cline Console</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ 
        padding: '16px', 
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading logs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '16px', 
        color: '#ef4444',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Error loading logs: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '16px', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        border: '1px solid #e2e8f0', 
        borderRadius: '4px',
        backgroundColor: '#ffffff'
      }}>
        {logs.length === 0 ? (
          <div style={{ 
            padding: '16px', 
            textAlign: 'center', 
            color: '#64748b'
          }}>
            No logs available for this run
          </div>
        ) : (
          logs.map(renderLogEntry)
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ClineConsole;