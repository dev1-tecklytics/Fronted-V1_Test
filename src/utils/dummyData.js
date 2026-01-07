// Dummy User Database
// This file contains the dummy data structure for testing purposes

export const dummyUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        createdAt: '2025-01-01',
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password456',
        role: 'user',
        createdAt: '2025-01-02',
    },
    {
        id: 3,
        name: 'Admin User',
        email: 'admin@iaap.com',
        password: 'admin123',
        role: 'admin',
        createdAt: '2025-01-03',
    },
];

// Helper function to validate user credentials
export const validateLogin = (email, password) => {
    const user = dummyUsers.find(
        (u) => u.email === email && u.password === password
    );
    return user;
};

// Helper function to check if email exists
export const emailExists = (email) => {
    return dummyUsers.some((u) => u.email === email);
};

// Helper function to create new user (for demonstration)
export const createUser = (userData) => {
    const newUser = {
        id: dummyUsers.length + 1,
        ...userData,
        role: 'user',
        createdAt: new Date().toISOString().split('T')[0],
    };

    dummyUsers.push(newUser);
    return newUser;
};

export default dummyUsers;
