/**
 * API Service Layer
 * Handles all HTTP requests to the Python backend
 */
import { tokenManager } from '../utils/tokenManager';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Block requests to AWS metadata and other internal services (SSRF prevention)
const BLOCKED_HOSTS = ['169.254.169.254', '169.254.170.2', 'metadata.google.internal'];

const validateUrl = (url) => {
  try {
    const parsed = new URL(url);
    if (BLOCKED_HOSTS.includes(parsed.hostname)) {
      throw new Error('Request to internal metadata service blocked');
    }
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Only HTTP/HTTPS protocols are allowed');
    }
  } catch (e) {
    throw new Error(`Invalid request URL: ${e.message}`);
  }
};

if (import.meta.env.DEV) {
  console.log('🌐 API_BASE_URL:', API_BASE_URL);
}

/**
 * Generic API request handler with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  validateUrl(url);

  const token = tokenManager.getAuthToken();
  const apiKey = tokenManager.getApiKey();

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
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

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || data.detail || 'An error occurred',
        data: data,
      };
    }

    return data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('API Request Error:', error);
    }
    throw error;
  }
};

// ==================== Authentication APIs ====================

export const authAPI = {
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.access_token) {
      tokenManager.setAuthToken(response.access_token);
      if (response.api_key) {
        tokenManager.setApiKey(response.api_key);
      }
      if (response.user) {
        tokenManager.setCurrentUser(response.user);
      }
    }

    return response;
  },

  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.email) {
      const loginResponse = await authAPI.login({
        email: userData.email,
        password: userData.password,
      });
      return loginResponse;
    }

    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      tokenManager.clear();
    }
  },

  refreshToken: async () => {
    const response = await apiRequest('/auth/refresh-token', { method: 'POST' });

    if (response.access_token) {
      tokenManager.setAuthToken(response.access_token);
      if (response.api_key) {
        tokenManager.setApiKey(response.api_key);
      }
    }

    return response;
  },

  getCurrentUser: () => tokenManager.getCurrentUser(),
};

// ==================== Project APIs ====================

export const projectAPI = {
  getAll: () => apiRequest('/projects'),
  getById: (projectId) => apiRequest(`/projects/${projectId}`),
  create: (projectData) => apiRequest('/projects', { method: 'POST', body: JSON.stringify(projectData) }),
  update: (projectId, projectData) => apiRequest(`/projects/${projectId}`, { method: 'PUT', body: JSON.stringify(projectData) }),
  delete: (projectId) => apiRequest(`/projects/${projectId}`, { method: 'DELETE' }),
};

// ==================== Workflow APIs ====================

export const workflowAPI = {
  upload: (projectId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    return apiRequest('/workflows/upload', { method: 'POST', headers: {}, body: formData });
  },
  getByProject: (projectId) => apiRequest(`/workflows?projectId=${projectId}`),
  analyze: (workflowId, options) => apiRequest(`/workflows/${workflowId}/analyze`, { method: 'POST', body: JSON.stringify(options) }),
  convert: (workflowId, options) => apiRequest(`/workflows/${workflowId}/convert`, { method: 'POST', body: JSON.stringify(options) }),
  codeReview: (workflowId, options) => apiRequest(`/workflows/${workflowId}/code-review`, { method: 'POST', body: JSON.stringify(options) }),
};

// ==================== Custom Rules APIs ====================

export const rulesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') query.append(key, value);
    });
    return apiRequest(`/custom-rules?${query.toString()}`);
  },

  create: (ruleData) => apiRequest('/custom-rules', { method: 'POST', body: JSON.stringify(ruleData) }),
  update: (ruleId, ruleData) => apiRequest(`/custom-rules/${ruleId}`, { method: 'PATCH', body: JSON.stringify(ruleData) }),
  delete: (ruleId) => apiRequest(`/custom-rules/${ruleId}`, { method: 'DELETE' }),
  bulkUpdate: (bulkData) => apiRequest('/custom-rules/bulk', { method: 'PATCH', body: JSON.stringify(bulkData) }),

  export: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') query.append(key, value);
    });
    const url = `${API_BASE_URL}/custom-rules/export?${query.toString()}`;
    validateUrl(url);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${tokenManager.getAuthToken()}`,
        'X-API-Key': tokenManager.getApiKey(),
      },
    });
    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  },

  import: (importData) => apiRequest('/custom-rules/import', { method: 'POST', body: JSON.stringify(importData) }),
};

export const customRulesAPI = rulesAPI;

// ==================== Export APIs ====================

export const exportAPI = {
  exportProjectsCSV: async () => {
    const url = `${API_BASE_URL}/export/projects/csv`;
    validateUrl(url);
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${tokenManager.getAuthToken()}` },
    });
    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  },

  exportProjectsJSON: () => apiRequest('/export/projects/json'),

  exportRulesCSV: async () => {
    const url = `${API_BASE_URL}/export/rules/csv`;
    validateUrl(url);
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${tokenManager.getAuthToken()}` },
    });
    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  },

  exportRulesJSON: () => apiRequest('/export/rules/json'),
};

// ==================== Subscription APIs ====================

export const subscriptionAPI = {
  getPlans: () => apiRequest('/subscription/plans'),
  getCurrent: () => apiRequest('/subscription/current'),
  subscribe: (planId) => apiRequest(`/subscription/subscribe?plan_id=${planId}`, { method: 'POST' }),
  upgrade: (newPlanId) => apiRequest(`/subscription/upgrade?plan_id=${newPlanId}`, { method: 'PUT' }),
  cancel: () => apiRequest('/subscription/cancel', { method: 'POST' }),
  getUsage: () => apiRequest('/subscription/usage'),
};

// ==================== API Key Management ====================

export const apiKeyAPI = {
  create: (name = 'Default Key') => apiRequest(`/api_key?name=${encodeURIComponent(name)}`, { method: 'POST' }),
  list: () => apiRequest('/api_key'),
  delete: (apiKeyId) => apiRequest(`/api_key/${apiKeyId}`, { method: 'DELETE' }),
};

// ==================== Analysis APIs ====================

export const analysisAPI = {
  uploadAndAnalyze: async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    let url = `${API_BASE_URL}/analyze/uipath`;
    const queryParams = [];
    if (options?.projectId) queryParams.push(`project_id=${options.projectId}`);
    if (options?.enableAiAnalysis !== undefined) queryParams.push(`enable_ai_analysis=${options.enableAiAnalysis}`);
    if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

    validateUrl(url);

    const authToken = tokenManager.getAuthToken();
    const apiKey = tokenManager.getApiKey();
    const authHeaderValue = authToken || apiKey;

    if (!authHeaderValue) {
      throw new Error('Analysis requires a valid session or API Key. Please log in again.');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authHeaderValue}`,
        'X-API-Key': apiKey,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try { errorData = JSON.parse(errorText); } catch { errorData = { detail: errorText }; }
      if (response.status === 401) throw new Error('Authentication failed. Please log in again.');
      throw new Error(errorData.detail || errorData.message || `Upload failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.analysis || result;
  },

  getAnalysisStatus: (analysisId) => apiRequest(`/analyze/${analysisId}`),
  deleteWorkflow: (workflowId) => apiRequest(`/workflows/${workflowId}`, { method: 'DELETE' }),
  updateWorkflowName: (workflowId, workflowName) => apiRequest(`/workflows/name?workflow_id=${workflowId}&workflow_name=${workflowName}`, { method: 'PATCH' }),
  getHistory: (projectId) => apiRequest(`/analyze/history${projectId ? `?project_id=${projectId}` : ''}`),
  getWorkflowsForProject: (projectId) => apiRequest(`/workflows/project/${projectId ? `?project_id=${projectId}` : ''}`),
  uploadMultiple: (files, options = {}) => Promise.all(files.map((file) => analysisAPI.uploadAndAnalyze(file, options))),
  getWorkflow: (workflowId) => apiRequest(`/workflows/${workflowId}`),
  getSuggestions: (workflowId) => apiRequest(`/workflows/${workflowId}/suggestions`),
  getMigrationPreview: (workflowId) => apiRequest(`/workflows/${workflowId}/migration-preview`),
  getMigrationStrategy: (workflowId) => apiRequest(`/workflows/${workflowId}/migration-strategy`, { method: 'POST' }),
};

// ==================== Code Review APIs ====================

export const codeReviewAPI = {
  getExistingReview: async (workflowId) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(workflowId)) {
      throw new Error('Invalid workflow ID format. Please select a valid workflow.');
    }
    try {
      return await apiRequest(`/code-review?workflow_id=${encodeURIComponent(workflowId)}`);
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  },

  runReview: (reviewData) => apiRequest('/code-review', {
    method: 'POST',
    body: JSON.stringify({
      workflowId: reviewData.workflowId || reviewData.workflow_id,
      platform: reviewData.platform,
    }),
  }),

  runAIAnalysis: async (reviewId) => {
    const response = await apiRequest(`/code-review/${encodeURIComponent(reviewId)}/ai-analysis`, { method: 'POST' });
    return response?.analysis || response;
  },

  getAIAnalysis: async (reviewId) => {
    try {
      const response = await apiRequest(`/code-review/ai-analysis?review_id=${encodeURIComponent(reviewId)}`);
      return response?.analysis || response;
    } catch (error) {
      if (error.status === 404 || error.status === 422) return null;
      throw error;
    }
  },

  getAllReviews: () => apiRequest('/code-review/history'),

  exportToCSV: async (reviewId) => {
    const url = `${API_BASE_URL}/code-review/${reviewId}/export`;
    validateUrl(url);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${tokenManager.getAuthToken()}`,
        'X-API-Key': tokenManager.getApiKey(),
      },
    });
    if (!response.ok) throw new Error('Export failed');
    return response.blob();
  },
};

// ==================== Variable Analysis APIs ====================

export const variableAnalysisAPI = {
  runAnalysis: (workflowId) => apiRequest(`/workflows/${workflowId}/variable-analysis`, { method: 'POST' }),
  getAnalysis: (workflowId) => apiRequest(`/workflows/${workflowId}/variable-analysis`),
};

// ==================== Health Check ====================

export const healthAPI = {
  check: () => apiRequest('/health'),
};

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
