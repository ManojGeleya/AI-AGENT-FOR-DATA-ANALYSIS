// authService.js - Handles User Authentication

const USER_TABLE = 'users';

/**
 * Register a new user
 */
async function registerUser(email, password, name, apiKey) {
    try {
        // Check if user exists (naive check for prototype)
        // In a real app, we'd query by email first. 
        // Trickle DB doesn't support complex filtering in listObjects easily without retrieving all, 
        // but for this prototype we will just create.
        
        // However, to be safer, let's list and check.
        const users = await trickleListObjects(USER_TABLE, 100, true);
        const exists = users.items.find(u => u.objectData.email === email);
        
        if (exists) {
            throw new Error("User already exists with this email.");
        }

        const userData = {
            email,
            password, // Note: In production, NEVER store plain text passwords.
            name,
            api_key: apiKey
        };

        const newUser = await trickleCreateObject(USER_TABLE, userData);
        return {
            id: newUser.objectId,
            ...newUser.objectData
        };
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
}

/**
 * Login user
 */
async function loginUser(email, password) {
    try {
        // Fetch users and find match
        // Optimization: In real backend, use a query. Here we scan.
        const result = await trickleListObjects(USER_TABLE, 100, true);
        const user = result.items.find(u => u.objectData.email === email && u.objectData.password === password);

        if (!user) {
            throw new Error("Invalid email or password");
        }

        return {
            id: user.objectId,
            ...user.objectData
        };
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

/**
 * Update user profile
 */
async function updateUserProfile(userId, data) {
    try {
        const updated = await trickleUpdateObject(USER_TABLE, userId, data);
        return {
            id: updated.objectId,
            ...updated.objectData
        };
    } catch (error) {
        console.error("Update profile failed:", error);
        throw error;
    }
}