import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    session: null,
    isAuthenticated: false,
    isInitializing: true, // Application starts in a 'cloaked' initialization state
    registrationData: null, 
    verificationOtp: null,  
    flowType: null,         
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.user = action.payload.user;
            state.session = action.payload.session;
            state.isAuthenticated = !!action.payload.session;
            state.isInitializing = false;
        },
        setInitializing: (state, action) => {
            state.isInitializing = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.session = null;
            state.isAuthenticated = false;
        },
        setRegistrationData: (state, action) => {
            state.registrationData = action.payload;
        },
        setFlowType: (state, action) => {
            state.flowType = action.payload;
        },
        setVerificationOtp: (state, action) => {
            state.verificationOtp = action.payload;
        },
        clearAuthData: (state) => {
            state.registrationData = null;
            state.verificationOtp = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { 
    setAuth,
    setInitializing,
    logout,
    setRegistrationData, 
    setFlowType,
    setVerificationOtp, 
    clearAuthData, 
    setError 
} = authSlice.actions;

export const selectAuth = (state) => state.auth;

export default authSlice.reducer;
