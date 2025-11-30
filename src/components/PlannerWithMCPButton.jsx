// src/components/PlannerWithMCPButton.jsx
import React from 'react';
import { api } from '../utils/apiClient';
import { useProject } from '../context/ProjectStateContext';

const PlannerWithMCPButton = () => {
  const { projectId, reload } = useProject();

  const handlePlannerWithMCP = async () => {
    try {
      const prompt = window.prompt('What should the planner work on?');
      if (!prompt) return;

      console.log('[PlannerWithMCPButton] Sending to /api/planner/with-mcp:', { projectId, prompt });
      
      const response = await api.plannerWithMcp({ projectId, prompt });
      
      console.log('[PlannerWithMCPButton] Response received:', response);
      
      // Reload project state to show new tasks
      await reload();
      
      alert('Planning completed! New tasks have been added to the Task Queue.');
    } catch (error) {
      console.error('[PlannerWithMCPButton] ERROR: Failed to run planner with MCP:', error);
      alert('Error: Failed to run planner with MCP. Check console for details.');
    }
  };

  return (
    <button 
      onClick={handlePlannerWithMCP}
      className="planner-mcp-button"
      style={{
        padding: '8px 12px',
        backgroundColor: '#4a6fa5',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        marginLeft: '8px'
      }}
    >
      Planner with MCP
    </button>
  );
};

export default PlannerWithMCPButton;