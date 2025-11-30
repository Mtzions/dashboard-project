// src/utils/debugHealthCheck.js
// Dev-only health check utility for verifying proxy connectivity

export const debugHealthCheck = async () => {
  try {
    console.log('[DEBUG] Initiating health check via /api/health...');
    
    const response = await fetch("/api/health");
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    console.log('[DEBUG] Health check successful:', data);
    alert(`Health check OK!\nServer: ${data.server}\nVersion: ${data.version}`);
    return data;
  } catch (error) {
    console.error('[DEBUG] Health check failed:', error);
    alert(`Health check failed!\nError: ${error.message}`);
    throw error;
  }
};

// Optional: Add a global function for easy testing in console
if (import.meta.env.DEV) {
  window.debugHealthCheck = debugHealthCheck;
}