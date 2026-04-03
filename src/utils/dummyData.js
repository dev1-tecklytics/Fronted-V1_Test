// dummyData.js
// NOTE: Hardcoded credentials removed — authentication is handled exclusively
// by the backend API. This file is retained only for non-sensitive UI mock data.

export const dummyUsers = [];

export const validateLogin = () => {
    throw new Error('Use authAPI.login() from services/api.js for authentication');
};

export const emailExists = () => {
    throw new Error('Use authAPI from services/api.js for authentication checks');
};

export const createUser = () => {
    throw new Error('Use authAPI.register() from services/api.js for user creation');
};

export default dummyUsers;
