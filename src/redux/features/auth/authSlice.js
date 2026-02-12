
import { createSlice } from '@reduxjs/toolkit';

// Helper to safely parse JSON from localStorage
const getLocalStorageItem = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        return localStorage.getItem(key); // Return as string if parsing fails, though expected usage below handles object vs string
    }
};

const initialState = {
    user: getLocalStorageItem('user'),
    token: localStorage.getItem('token'),
    roleId: localStorage.getItem('roleId'), // Assuming roleId is stored as a simple value
    permissions: [],
    isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token, roleId } = action.payload;
            state.user = user;
            state.token = token;
            state.roleId = roleId;
            state.isAuthenticated = true;

            // Persist to localStorage
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            if (roleId) localStorage.setItem('roleId', roleId);
        },
        setPermissions: (state, action) => {
            state.permissions = action.payload;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            state.roleId = null;
            state.permissions = [];
            state.isAuthenticated = false;

            // Clear localStorage
            localStorage.clear();
            // Or selectively remove:
            // localStorage.removeItem('user');
            // localStorage.removeItem('token');
            // localStorage.removeItem('roleId');
        },
    },
});

export const { setCredentials, setPermissions, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRoleId = (state) => state.auth.roleId;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
