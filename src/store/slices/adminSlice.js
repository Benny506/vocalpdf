import { createSlice } from '@reduxjs/toolkit';

/**
 * generateAdminCredentials: Creates a transient set of credentials.
 * In a real app, this would be fetched from a secure server.
 */
const generateAdminCredentials = () => {
    const timestamp = Math.floor(Date.now() / (1000 * 60 * 10)); // Rotates every 10 mins
    const key = `ADMIN-${timestamp.toString().slice(-4)}`;
    const secret = `PASS-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    return { key, secret };
};

const initialState = {
    isAdminAuthenticated: !!localStorage.getItem('vocal_admin_session'),
    adminProfile: JSON.parse(localStorage.getItem('vocal_admin_profile')) || null,
    credentials: generateAdminCredentials(),
    lastRefresh: Date.now()
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        refreshCredentials: (state) => {
            state.credentials = generateAdminCredentials();
            state.lastRefresh = Date.now();
        },
        loginAdmin: (state, action) => {
            state.isAdminAuthenticated = true;
            state.adminProfile = { role: 'Citadel Administrator', loggedInAt: new Date().toISOString() };
            localStorage.setItem('vocal_admin_session', 'active');
            localStorage.setItem('vocal_admin_profile', JSON.stringify(state.adminProfile));
        },
        logoutAdmin: (state) => {
            state.isAdminAuthenticated = false;
            state.adminProfile = null;
            localStorage.removeItem('vocal_admin_session');
            localStorage.removeItem('vocal_admin_profile');
        }
    }
});

export const { refreshCredentials, loginAdmin, logoutAdmin } = adminSlice.actions;
export const selectAdmin = (state) => state.admin;
export default adminSlice.reducer;
