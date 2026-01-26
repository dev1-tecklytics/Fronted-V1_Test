/**
 * API Service Layer
 * Handles all HTTP requests to the Python backend
 */

// Base URL for the API - Update this to match your Python backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

console.log("🌐 API_BASE_URL:", API_BASE_URL);

/**
 * Generic API request handler with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Add authorization token if exists
  const token = localStorage.getItem("authToken");
  const apiKey = localStorage.getItem("apiKey");
  // if (apiKey) {
  defaultHeaders["X-API-Key"] = apiKey;
  // }
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle different response types
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || data.detail || "An error occurred",
        data: data,
      };
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

// ==================== Authentication APIs ====================

export const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} { access_token, token_type, user: { email, full_name, user_id } }
   */
  login: async (credentials) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // Store token and user data
    if (response.access_token) {
      const apiKey = data.api_key_prefix + " : " + data.api_key_hash;
      localStorage.setItem("authToken", response.access_token);
      localStorage.setItem("apiKey", apiKey);
      localStorage.setItem("currentUser", JSON.stringify(response.user));
    }

    return response;
  },

  /**
   * Register new user
   * @param {Object} userData - { full_name, email, password, company_name? }
   * @returns {Promise} User object with trial subscription
   */
  register: async (userData) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    // Auto-login after registration
    if (response.email) {
      const loginResponse = await authAPI.login({
        email: userData.email,
        password: userData.password,
      });
      return loginResponse;
    }

    return response;
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } finally {
      // Always clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async () => {
    const response = await apiRequest("/auth/refresh-token", {
      method: "POST",
    });

    if (response.access_token) {
      const apiKey = data.api_key_prefix + " : " + data.api_key_hash;
      localStorage.setItem("apiKey", apiKey);
      localStorage.setItem("authToken", response.access_token);
    }

    return response;
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  },
};

// ==================== Project APIs ====================

export const projectAPI = {
  /**
   * Get all projects for current user
   */
  getAll: async () => {
    return apiRequest("/projects", {
      method: "GET",
    });
  },

  /**
   * Get single project by ID
   * @param {string|number} projectId
   */
  getById: async (projectId) => {
    return apiRequest(`/projects/${projectId}`, {
      method: "GET",
    });
  },

  /**
   * Create new project
   * @param {Object} projectData - { name, description, platform }
   */
  create: async (projectData) => {
    return apiRequest("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  },

  /**
   * Update existing project
   * @param {string|number} projectId
   * @param {Object} projectData
   */
  update: async (projectId, projectData) => {
    return apiRequest(`/projects/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    });
  },

  /**
   * Delete project
   * @param {string|number} projectId
   */
  delete: async (projectId) => {
    return apiRequest(`/projects/${projectId}`, {
      method: "DELETE",
    });
  },
};

// ==================== Workflow APIs ====================

export const workflowAPI = {
  /**
   * Upload workflow file
   * @param {string|number} projectId
   * @param {File} file
   */
  upload: async (projectId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);

    return apiRequest("/workflows/upload", {
      method: "POST",
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  },

  /**
   * Get all workflows for a project
   * @param {string|number} projectId
   */
  getByProject: async (projectId) => {
    return apiRequest(`/workflows?projectId=${projectId}`, {
      method: "GET",
    });
  },

  /**
   * Analyze workflow
   * @param {string|number} workflowId
   * @param {Object} options - { sourcePlatform, targetPlatform }
   */
  analyze: async (workflowId, options) => {
    return apiRequest(`/workflows/${workflowId}/analyze`, {
      method: "POST",
      body: JSON.stringify(options),
    });
  },

  /**
   * Convert workflow
   * @param {string|number} workflowId
   * @param {Object} options - { targetPlatform }
   */
  convert: async (workflowId, options) => {
    return apiRequest(`/workflows/${workflowId}/convert`, {
      method: "POST",
      body: JSON.stringify(options),
    });
  },

  /**
   * Run code review on workflow
   * @param {string|number} workflowId
   * @param {Object} options - { platform, rules }
   */
  codeReview: async (workflowId, options) => {
    return apiRequest(`/workflows/${workflowId}/code-review`, {
      method: "POST",
      body: JSON.stringify(options),
    });
  },
};

// ==================== Custom Rules APIs ====================

export const rulesAPI = {
  /**
   * Get all custom rules with optional filtering
   */
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    return apiRequest(`/custom-rules?${query.toString()}`);
  },

  /**
   * Create new custom rule
   */
  create: (ruleData) =>
    apiRequest("/custom-rules", {
      method: "POST",
      body: JSON.stringify(ruleData),
    }),

  /**
   * Update custom rule
   */
  update: (ruleId, ruleData) =>
    apiRequest(`/custom-rules/${ruleId}`, {
      method: "PATCH",
      body: JSON.stringify(ruleData),
    }),

  /**
   * Delete custom rule
   */
  delete: (ruleId) =>
    apiRequest(`/custom-rules/${ruleId}`, {
      method: "DELETE",
    }),

  /**
   * Bulk update rules
   */
  bulkUpdate: async (bulkData) => {
    return apiRequest('/custom-rules/bulk', {
      method: 'PATCH',
      body: JSON.stringify(bulkData),
    });
  },

  /**
   * Export rules
   */
  export: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.append(key, value);
      }
    });
    const apiKey = localStorage.getItem("apiKey");
    const response = await fetch(`${API_BASE_URL}/custom-rules/export/${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        "X-API-Key": apiKey,
      },
    });
    
    if (!response.ok) throw new Error('Export failed');
    return await response.blob();
  },

  /**
   * Import rules
   */
  import: async (importData) => {
    return apiRequest('/custom-rules/import', {
      method: 'POST',
      body: JSON.stringify(importData),
    });
  },
};

export const customRulesAPI = rulesAPI;

// ==================== Export APIs ====================

export const exportAPI = {
  /**
   * Export projects to CSV
   */
  exportProjectsCSV: async () => {
    const response = await fetch(`${API_BASE_URL}/export/projects/csv`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) throw new Error("Export failed");

    const blob = await response.blob();
    return blob;
  },

  /**
   * Export projects to JSON
   */
  exportProjectsJSON: async () => {
    return apiRequest("/export/projects/json", {
      method: "GET",
    });
  },

  /**
   * Export rules to CSV
   */
  exportRulesCSV: async () => {
    const response = await fetch(`${API_BASE_URL}/export/rules/csv`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    if (!response.ok) throw new Error("Export failed");

    const blob = await response.blob();
    return blob;
  },

  /**
   * Export rules to JSON
   */
  exportRulesJSON: async () => {
    return apiRequest("/export/rules/json", {
      method: "GET",
    });
  },
};

// ==================== Subscription APIs ====================

export const subscriptionAPI = {
  /**
   * Get all available subscription plans
   */
  getPlans: async () => {
    return apiRequest("/subscription/plans", {
      method: "GET",
    });
  },

  /**
   * Get current user's subscription
   */
  getCurrent: async () => {
    return apiRequest("/subscription/current", {
      method: "GET",
    });
  },

  /**
   * Subscribe to a plan
   * @param {string} planId - Plan ID to subscribe to
   */
  subscribe: async (planId) => {
    return apiRequest(`/subscription/subscribe?plan_id=${planId}`, {
      method: "POST",
    });
  },

  /**
   * Upgrade subscription
   * @param {string} newPlanId - New plan ID
   */
  upgrade: async (newPlanId) => {
    return apiRequest(`/subscription/upgrade?plan_id=${newPlanId}`, {
      method: "PUT",
    });
  },

  /**
   * Cancel subscription
   */
  cancel: async () => {
    return apiRequest("/subscription/cancel", {
      method: "POST",
    });
  },

  /**
   * Get subscription usage statistics
   */
  getUsage: async () => {
    return apiRequest("/subscription/usage", {
      method: "GET",
    });
  },
};

// ==================== API Key Management ====================

export const apiKeyAPI = {
  /**
   * Create a new API key
   * @param {string} name - Optional name for the API key
   */
  create: async (name = "Default Key") => {
    return apiRequest(`/api_key?name=${encodeURIComponent(name)}`, {
      method: "POST",
    });
  },

  /**
   * List all API keys for current user
   */
  list: async () => {
    return apiRequest("/api_key", {
      method: "GET",
    });
  },

  /**
   * Delete an API key
   * @param {string} apiKeyId
   */
  delete: async (apiKeyId) => {
    return apiRequest(`/api_key/${apiKeyId}`, {
      method: "DELETE",
    });
  },
};

// ==================== Analysis APIs ====================

export const analysisAPI = {
  /**
   * Upload and analyze UiPath workflow file
   * @param {File} file - Workflow file to analyze
   */
  uploadAndAnalyze: async (file, options = {}) => {
    const formData = new FormData();
    formData.append("file", file);

    // NOTE: Backend currently uses /uipath for both UiPath and Blue Prism mock uploads
    let url = `${API_BASE_URL}/analyze/uipath`;
    if (options?.projectId) {
      url += `?project_id=${options.projectId}`;
    }

    // PRIORITY: Use JWT (authToken) if available, fallback to apiKey
    // This allows the "same API identity" to circulate via the user's login session
    const authToken = localStorage.getItem("authToken");
    const apiKey = localStorage.getItem("apiKey");
    const authHeaderValue = authToken || apiKey;

    if (!authHeaderValue) {
      console.error("❌ No Authentication found in localStorage");
      throw new Error(
        "Analysis requires a valid session or API Key. Please log in again.",
      );
    }

    console.log("📤 Uploading file to analysis engine:", file.name);
    console.log("📍 Target URL:", url);
    console.log("🔑 Auth Method:", authToken ? "JWT Session" : "API Key");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          // Use whichever token is available (Backend now supports both)
          Authorization: `Bearer ${authHeaderValue}`,
          "X-API-Key": apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { detail: errorText };
        }

        if (response.status === 401) {
          throw new Error(
            "Authentication failed (Invalid API Key). Please check your API key in settings.",
          );
        }
        throw new Error(
          errorData.detail ||
            errorData.message ||
            `Upload failed with status ${response.status}`,
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("❌ Upload error:", error);
      throw error;
    }
  },

  /**
   * Get analysis status and results
   * @param {string} analysisId - Analysis ID returned from upload
   */
  getAnalysisStatus: async (analysisId) => {
    return apiRequest(`/analyze/${analysisId}`, {
      method: "GET",
    });
  },

  deleteWorkflow: async (workflowId) => {
    return apiRequest(`/workflows/${workflowId}`, {
      method: "DELETE",
    });
  },

  updateWorkflowName: async (workflowId, workflowName) => {
    return apiRequest(`/workflows/name?workflow_id=${workflowId}&workflow_name=${workflowName}`, {
      method: "PATCH",
    });
  },

  getHistory: async (projectId) => {
    const query = projectId ? `?project_id=${projectId}` : "";
    return apiRequest(`/analyze/history${query}`);
  },

  getWorkflowsForProject: async (projectId) => {
    const query = projectId ? `?project_id=${projectId}` : "";
    return apiRequest(`/workflows/project/${query}`);
  },
  /**
   * Upload multiple files for batch analysis
   * @param {File[]} files - Array of workflow files
   */
  uploadMultiple: async (files, options = {}) => {
    const uploadPromises = files.map((file) =>
      analysisAPI.uploadAndAnalyze(file, options),
    );
    return Promise.all(uploadPromises);
  },

  /**
   * Get workflow details by ID
   * @param {string} workflowId - Workflow ID from upload response
   */
  getWorkflow: async (workflowId) => {
    return apiRequest(`/workflows/${workflowId}`, {
      method: "GET",
    });
  },

  /**
   * Get AI-generated suggestions for workflow
   * @param {string} workflowId - Workflow ID
   */
  getSuggestions: async (workflowId) => {
    return apiRequest(`/workflows/${workflowId}/suggestions`, {
      method: "GET",
    });
  },

  /**
   * Get migration preview with activity mappings
   * @param {string} workflowId - Workflow ID
   */
  getMigrationPreview: async (workflowId) => {
    return apiRequest(`/workflows/${workflowId}/migration-preview`, {
      method: "GET",
    });
  },

  /**
   * Get AI-generated migration strategy
   * @param {string} workflowId - Workflow ID
   */
  getMigrationStrategy: async (workflowId) => {
    return apiRequest(`/workflows/${workflowId}/migration-strategy`, {
      method: "POST",
    });
  },
  /**
   * Get AI-generated migration strategy
   * @param {string} workflowId - Workflow ID
   */
  getMigrationStrategy: async (workflowId) => {
    return apiRequest(`/workflows/${workflowId}/migration-strategy`, {
      method: "POST",
    });
  },
};

// ==================== Code Review APIs ====================

export const codeReviewAPI = {

    

  /**
   * Get existing code review for a workflow (intelligent caching)
   * @param {string} workflowId - Workflow ID to check
   * @returns {Promise} Cached review results or null
   */
  getExistingReview: async (workflowId) => {
    const authToken = localStorage.getItem("authToken");
    const apiKey = localStorage.getItem("apiKey");
    const authHeaderValue = authToken || apiKey;

    if (!authHeaderValue) {
      console.error("❌ No Authentication found in localStorage");
      throw new Error(
        "Analysis requires a valid session or API Key. Please log in again.",
      );
    }
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(workflowId)) {
      console.error("❌ Invalid workflow ID format. Expected UUID, got:", workflowId);
      throw new Error("Invalid workflow ID format. Please select a valid workflow.");
    }
    
    try {
      return await apiRequest(`/code-review?workflow_id=${encodeURIComponent(workflowId)}`, {
        method: "GET",
        headers: {
            // Use whichever token is available (Backend now supports both)
            Authorization: `Bearer ${authHeaderValue}`,
            "X-API-Key": apiKey,
          },
      });
    } catch (error) {
      // Return null if no cached review found (404)
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Run new code review analysis
   * @param {Object} reviewData - { workflowId, platform }
   * @returns {Promise} Code review results
   */
  runReview: async (reviewData) => {
    const authToken = localStorage.getItem("authToken");
    const apiKey = localStorage.getItem("apiKey");
    const authHeaderValue = authToken || apiKey;

    if (!authHeaderValue) {
      console.error("❌ No Authentication found in localStorage");
      throw new Error(
        "Analysis requires a valid session or API Key. Please log in again.",
      );
    }
    return apiRequest("/code-review", {
      method: "POST",
      headers: {
        // Use whichever token is available (Backend now supports both)
        Authorization: `Bearer ${authHeaderValue}`,
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(reviewData),
    });
  },

  /**
   * Get all code reviews for current user
   * @returns {Promise} Array of code review results
   */
  getAllReviews: async () => {
    return apiRequest("/code-review/history", {
      method: "GET",
    });
  },

  /**
   * Export code review to CSV
   * @param {string} reviewId - Review ID
   * @returns {Promise<Blob>} CSV file blob
   */
  exportToCSV: async (reviewId) => {
    const response = await fetch(
      `${API_BASE_URL}/code-review/${reviewId}/export`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    if (!response.ok) throw new Error("Export failed");
    return await response.blob();
  },
};

// ==================== Variable Analysis APIs ====================

export const variableAnalysisAPI = {
  /**
   * Run variable analysis on workflow
   * @param {string} workflowId - Workflow ID
   */
  runAnalysis: async (workflowId) => {
    return apiRequest(`/workflows/${workflowId}/variable-analysis`, {
      method: "POST",
    });
  },

  /**
   * Get variable analysis results
   * @param {string} workflowId - Workflow ID
   */
  getAnalysis: async (workflowId) => {
    return apiRequest(`/workflows/${workflowId}/variable-analysis`, {
      method: "GET",
    });
  },
};

// ==================== Health Check ====================

export const healthAPI = {
  /**
   * Check if backend is running
   */
  check: async () => {
    return apiRequest("/health", {
      method: "GET",
    });
  },
};

// Export default API object
export default {
  auth: authAPI,
  projects: projectAPI,
  workflows: workflowAPI,
  rules: rulesAPI,
  export: exportAPI,
  subscriptions: subscriptionAPI,
  apiKeys: apiKeyAPI,
  analysis: analysisAPI,
  codeReview: codeReviewAPI,
  variableAnalysis: variableAnalysisAPI,
  health: healthAPI,
};
