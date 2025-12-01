import React from 'react';
import TaskQueueSidebar from './TaskQueueSidebar';

const Sidebar = ({ isCollapsed, onToggleCollapse, projectId = "dashboard-project" }) => {
  return (
    <div style={styles.container}>
      {/* Task Queue Panel - Full Height */}
      <div style={styles.taskQueueContainer}>
        <TaskQueueSidebar projectId={projectId} />
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 5px)',
    margin: '0 10px 0 0',
    backgroundColor: 'rgba(25, 25, 30, 0.7)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    minWidth: '300px',
    maxWidth: '450px',
  },
  
  taskQueueContainer: {
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }
};

export default Sidebar;