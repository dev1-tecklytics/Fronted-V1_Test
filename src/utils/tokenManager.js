/**
 * Secure Token Manager
 *
 * Centralises all auth token access. In production, tokens should be stored
 * in HttpOnly cookies set by the backend. This module provides a single place
 * to swap the storage strategy without touching every API call.
 *
 * Current strategy: sessionStorage (cleared on tab close, not accessible
 * cross-tab, slightly safer than localStorage against persistent XSS).
 *
 * Recommended production strategy: HttpOnly cookies — remove all client-side
 * token storage and let the browser handle cookies automatically.
 */

const KEYS = {
    AUTH_TOKEN: 'authToken',
    API_KEY: 'apiKey',
    CURRENT_USER: 'currentUser',
};

const store = sessionStorage;

export const tokenManager = {
    setAuthToken: (token) => {
        if (!token || typeof token !== 'string') return;
        store.setItem(KEYS.AUTH_TOKEN, token);
    },

    getAuthToken: () => store.getItem(KEYS.AUTH_TOKEN),

    setApiKey: (key) => {
        if (!key || typeof key !== 'string') return;
        store.setItem(KEYS.API_KEY, key);
    },

    getApiKey: () => store.getItem(KEYS.API_KEY),

    setCurrentUser: (user) => {
        if (!user || typeof user !== 'object') return;
        // Store only non-sensitive fields
        const safeUser = {
            user_id: user.user_id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
        };
        store.setItem(KEYS.CURRENT_USER, JSON.stringify(safeUser));
    },

    getCurrentUser: () => {
        try {
            const raw = store.getItem(KEYS.CURRENT_USER);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },

    clear: () => {
        Object.values(KEYS).forEach((key) => store.removeItem(key));
    },
};
