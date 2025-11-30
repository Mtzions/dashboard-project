// src/utils/apiClient.js
const DEFAULT_PROJECT_ID = "dashboard-project";
const API_BASE = "/api";

// JSON request helper with error handling
async function jsonRequest(path, options = {}) {
  // If path starts with '/', use it as-is relative to API_BASE
  // Otherwise, prepend API_BASE with a '/' to create a proper path
  const normalizedPath = path.startsWith('/') ? `${API_BASE}${path}` : `${API_BASE}/${path}`;
  const url = normalizedPath;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json();
}

// API client object with all required methods
export const api = {
  // Health check
  async health() {
    return jsonRequest("/health", { method: "GET" });
  },

  // Project state
  async getProjectState(projectId = DEFAULT_PROJECT_ID) {
    return jsonRequest(`/state/${projectId}`, { method: "GET" });
  },

  // Messages endpoint (for chat history)
  // Note: Backend returns { projectId, messages: [...] } but we only want the messages array
  async getMessages(projectId = DEFAULT_PROJECT_ID, channel = "user_planner") {
    const response = await jsonRequest(`/messages/${projectId}?channel=${channel}`, { method: "GET" });
    return response.messages || [];
  },

  // Chat endpoint
  async chat({ projectId = DEFAULT_PROJECT_ID, messages, mode = "chat", usePremium = false }) {
    return jsonRequest("/chat", {
      method: "POST",
      body: JSON.stringify({
        projectId,
        messages,
        mode,
        usePremium,
      }),
    });
  },

  // Simple plan endpoint
  async simplePlan({ projectId = DEFAULT_PROJECT_ID, messages, usePremium = true }) {
    return jsonRequest("/plan", {
      method: "POST",
      body: JSON.stringify({
        projectId,
        messages,
        usePremium,
      }),
    });
  },

  // Create plan from messages endpoint
  async createPlanFromMessages(projectId = DEFAULT_PROJECT_ID, messages, usePremium = true) {
    return jsonRequest("/plan", {
      method: "POST",
      body: JSON.stringify({
        projectId,
        messages,
        usePremium,
      }),
    });
  },

  // Get tasks endpoint
  async getTasks(projectId = DEFAULT_PROJECT_ID) {
    return jsonRequest(`/tasks/${projectId}`, { method: "GET" });
  },

  // Planner with MCP endpoint
  async plannerWithMcp({ projectId = DEFAULT_PROJECT_ID, prompt }) {
    return jsonRequest("/planner/with-mcp", {
      method: "POST",
      body: JSON.stringify({
        projectId,
        prompt,
      }),
    });
  },

  // Task management
  async createTask(projectId = DEFAULT_PROJECT_ID, taskInput) {
    return jsonRequest(`/tasks/${projectId}`, {
      method: "POST",
      body: JSON.stringify(taskInput),
    });
  },

  async updateTask(projectId = DEFAULT_PROJECT_ID, taskId, patch) {
    return jsonRequest(`/tasks/${projectId}/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },

  // Task run management
  async runTask(projectId = DEFAULT_PROJECT_ID, taskId) {
    return jsonRequest(`/tasks/${projectId}/${taskId}/run`, {
      method: "POST",
    });
  },

  async getTaskRuns(projectId = DEFAULT_PROJECT_ID, filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const queryString = params ? `?${params}` : '';
    return jsonRequest(`/task-runs/${projectId}${queryString}`, { method: "GET" });
  },

  async getTaskRunLogs(projectId = DEFAULT_PROJECT_ID, runId) {
    return jsonRequest(`/task-runs/${projectId}/${runId}/logs`, { method: "GET" });
  },

  async updateTaskRun(projectId = DEFAULT_PROJECT_ID, runId, patch) {
    return jsonRequest(`/task-runs/${projectId}/${runId}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
  },
};

export { DEFAULT_PROJECT_ID };