/**
 * API Service Layer
 * Handles all HTTP requests to the Python backend
 */

// Base URL for the API - Update this to match your Python backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

console.log('🌐 API_BASE_URL:', API_BASE_URL);

/**
 * Generic API request handler with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Add authorization token if exists
    const token = localStorage.getItem('authToken');
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

        // Handle different response types
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
        console.error('API Request Error:', error);
        throw error;
    }
};

// ==================== Authentication APIs ====================

export const authAPI = {
    /**
     * Login user
     * @param {Object} credentials - { email, password }
     */
    login: async (credentials) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    /**
     * Register new user
     * @param {Object} userData - { fullName, email, password }
     */
    register: async (userData) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    /**
     * Logout user
     */
    logout: async () => {
        return apiRequest('/auth/logout', {
            method: 'POST',
        });
    },

    /**
     * Get current user profile
     */
    getCurrentUser: async () => {
        return apiRequest('/auth/me', {
            method: 'GET',
        });
    },
};

// ==================== Project APIs ====================

export const projectAPI = {
    /**
     * Get all projects for current user
     */
    getAll: async () => {
        return apiRequest('/projects', {
            method: 'GET',
        });
    },

    /**
     * Get single project by ID
     * @param {string|number} projectId
     */
    getById: async (projectId) => {
        return apiRequest(`/projects/${projectId}`, {
            method: 'GET',
        });
    },

    /**
     * Create new project
     * @param {Object} projectData - { name, description, platform }
     */
    create: async (projectData) => {
        return apiRequest('/projects', {
            method: 'POST',
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
            method: 'PUT',
            body: JSON.stringify(projectData),
        });
    },

    /**
     * Delete project
     * @param {string|number} projectId
     */
    delete: async (projectId) => {
        return apiRequest(`/projects/${projectId}`, {
            method: 'DELETE',
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
        formData.append('file', file);
        formData.append('projectId', projectId);

        return apiRequest('/workflows/upload', {
            method: 'POST',
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
            method: 'GET',
        });
    },

    /**
     * Analyze workflow
     * @param {string|number} workflowId
     * @param {Object} options - { sourcePlatform, targetPlatform }
     */
    analyze: async (workflowId, options) => {
        return apiRequest(`/workflows/${workflowId}/analyze`, {
            method: 'POST',
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
            method: 'POST',
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
            method: 'POST',
            body: JSON.stringify(options),
        });
    },
};

// ==================== Custom Rules APIs ====================

export const rulesAPI = {
    /**
     * Get all custom rules
     */
    getAll: async () => {
        return apiRequest('/rules', {
            method: 'GET',
        });
    },

    /**
     * Create new custom rule
     * @param {Object} ruleData
     */
    create: async (ruleData) => {
        return apiRequest('/rules', {
            method: 'POST',
            body: JSON.stringify(ruleData),
        });
    },

    /**
     * Update custom rule
     * @param {string|number} ruleId
     * @param {Object} ruleData
     */
    update: async (ruleId, ruleData) => {
        return apiRequest(`/rules/${ruleId}`, {
            method: 'PUT',
            body: JSON.stringify(ruleData),
        });
    },

    /**
     * Delete custom rule
     * @param {string|number} ruleId
     */
    delete: async (ruleId) => {
        return apiRequest(`/rules/${ruleId}`, {
            method: 'DELETE',
        });
    },

    /**
     * Import rules from JSON
     * @param {Array} rulesData
     * @param {boolean} overwrite
     */
    import: async (rulesData, overwrite = false) => {
        return apiRequest('/rules/import', {
            method: 'POST',
            body: JSON.stringify({ rules: rulesData, overwrite }),
        });
    },

    /**
     * Export rules to JSON
     */
    export: async () => {
        return apiRequest('/rules/export', {
            method: 'GET',
        });
    },
};

// ==================== Export APIs ====================

export const exportAPI = {
    /**
     * Export projects to CSV
     */
    exportProjectsCSV: async () => {
        const response = await fetch(`${API_BASE_URL}/export/projects/csv`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) throw new Error('Export failed');

        const blob = await response.blob();
        return blob;
    },

    /**
     * Export projects to JSON
     */
    exportProjectsJSON: async () => {
        return apiRequest('/export/projects/json', {
            method: 'GET',
        });
    },

    /**
     * Export rules to CSV
     */
    exportRulesCSV: async () => {
        const response = await fetch(`${API_BASE_URL}/export/rules/csv`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });

        if (!response.ok) throw new Error('Export failed');

        const blob = await response.blob();
        return blob;
    },

    /**
     * Export rules to JSON
     */
    exportRulesJSON: async () => {
        return apiRequest('/export/rules/json', {
            method: 'GET',
        });
    },
};

// ==================== Subscription APIs ====================

export const subscriptionAPI = {
    /**
     * Get all available subscription plans
     */
    getPlans: async () => {
        return apiRequest('/subscription/plans', {
            method: 'GET',
        });
    },

    /**
     * Get current user's subscription
     */
    getCurrent: async () => {
        return apiRequest('/subscription/current', {
            method: 'GET',
        });
    },

    /**
     * Subscribe to a plan
     * @param {string} planId - Plan ID to subscribe to
     */
    subscribe: async (planId) => {
        return apiRequest(`/subscription/subscribe?plan_id=${planId}`, {
            method: 'POST',
        });
    },

    /**
     * Upgrade subscription
     * @param {string} newPlanId - New plan ID
     */
    upgrade: async (newPlanId) => {
        return apiRequest(`/subscription/upgrade?plan_id=${newPlanId}`, {
            method: 'PUT',
        });
    },

    /**
     * Cancel subscription
     */
    cancel: async () => {
        return apiRequest('/subscription/cancel', {
            method: 'POST',
        });
    },

    /**
     * Get subscription usage statistics
     */
    getUsage: async () => {
        return apiRequest('/subscription/usage', {
            method: 'GET',
        });
    },
};

// ==================== API Key Management ====================

export const apiKeyAPI = {
    /**
     * Create a new API key
     * @param {string} name - Optional name for the API key
     */
    create: async (name = 'Default Key') => {
        return apiRequest(`/api_key?name=${encodeURIComponent(name)}`, {
            method: 'POST',
        });
    },

    /**
     * List all API keys for current user
     */
    list: async () => {
        return apiRequest('/api_key', {
            method: 'GET',
        });
    },

    /**
     * Delete an API key
     * @param {string} apiKeyId
     */
    delete: async (apiKeyId) => {
        return apiRequest(`/api_key/${apiKeyId}`, {
            method: 'DELETE',
        });
    },
};

// ==================== Analysis APIs ====================

export const analysisAPI = {
    /**
     * Upload and analyze UiPath workflow file
     * @param {File} file - Workflow file to analyze
     */
    uploadAndAnalyze: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const url = `${API_BASE_URL}/analyze/uipath`;
        let apiKey = localStorage.getItem('apiKey');

        // TEMPORARY: Use dummy key if not found (for testing)
        if (!apiKey) {
            console.warn('⚠️ No API key found. Using dummy key for testing.');
            apiKey = 'sk_live_test_dummy_key_12345';
        }

        console.log('📤 Uploading to:', url);
        console.log('🔑 Using API key:', apiKey.substring(0, 20) + '...');

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    // Backend expects API key in Authorization Bearer header
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: formData,
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);

                try {
                    const error = JSON.parse(errorText);
                    throw new Error(error.detail || 'Upload failed');
                } catch (e) {
                    throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
                }
            }

            return response.json();
        } catch (error) {
            console.error('❌ Upload error:', error);
            throw error;
        }
    },

    /**
     * Get analysis status and results
     * @param {string} analysisId - Analysis ID returned from upload
     */
    getAnalysisStatus: async (analysisId) => {
        return apiRequest(`/analyze/${analysisId}`, {
            method: 'GET',
        });
    },

    /**
     * Upload multiple files for batch analysis
     * @param {File[]} files - Array of workflow files
     */
    uploadMultiple: async (files) => {
        const uploadPromises = files.map(file => analysisAPI.uploadAndAnalyze(file));
        return Promise.all(uploadPromises);
    },
};

// ==================== Health Check ====================

export const healthAPI = {
    /**
     * Check if backend is running
     */
    check: async () => {
        return apiRequest('/health', {
            method: 'GET',
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
    health: healthAPI,
};
