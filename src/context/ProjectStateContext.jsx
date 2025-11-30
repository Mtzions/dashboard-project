// src/context/ProjectStateContext.jsx
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useProjectState } from '../hooks/useProjectState';

const ProjectStateContext = createContext();

export const ProjectStateProvider = ({ children, projectId }) => {
  const projectState = useProjectState(projectId);
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');

  const value = useMemo(() => {
    return {
      ...projectState,
      selectedRunId,
      setSelectedRunId,
      activeTab,
      setActiveTab
    };
  }, [projectState, selectedRunId, activeTab]);

  return (
    <ProjectStateContext.Provider value={value}>
      {children}
    </ProjectStateContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectStateContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectStateProvider');
  }
  return context;
};