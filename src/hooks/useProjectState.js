// src/hooks/useProjectState.js
import { useState, useEffect } from 'react';
import { api, DEFAULT_PROJECT_ID } from '../utils/apiClient';

export const useProjectState = (projectId = DEFAULT_PROJECT_ID) => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadProjectState = async (projectIdParam = projectId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProjectState(projectIdParam);
      setState(data);
      return data;
    } catch (err) {
      setError(err);
      console.error('Error loading project state:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reload = async (projectIdParam = projectId) => {
    try {
      setRefreshing(true);
      const data = await api.getProjectState(projectIdParam);
      setState(data);
      return data;
    } catch (err) {
      setError(err);
      console.error('Error reloading project state:', err);
      throw err;
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProjectState(projectId);
  }, [projectId]);

  return {
    projectId,
    state,
    loading,
    refreshing,
    error,
    reload,
    setState
  };
};