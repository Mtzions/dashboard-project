// Persistence utilities for UI state
export const persistState = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to persist state for ${key}:`, error);
  }
};

export const restoreState = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Failed to restore state for ${key}:`, error);
    return defaultValue;
  }
};

// Specific persistence functions
export const persistActiveTab = (tab) => {
  persistState('activeTab', tab);
};

export const restoreActiveTab = () => {
  return restoreState('activeTab', 'chat');
};

export const persistSidebarCollapsed = (isCollapsed) => {
  persistState('sidebarCollapsed', isCollapsed);
};

export const restoreSidebarCollapsed = () => {
  return restoreState('sidebarCollapsed', false);
};

export const persistChangesFilter = (filter) => {
  persistState('changesFilter', filter);
};

export const restoreChangesFilter = () => {
  return restoreState('changesFilter', 'all');
};

export const persistTheme = (theme) => {
  persistState('theme', theme);
};

export const restoreTheme = () => {
  return restoreState('theme', 'dark');
};