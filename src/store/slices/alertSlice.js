import { createSlice, nanoid } from '@reduxjs/toolkit';

const DEFAULT_DURATION = 5000;

const alertSlice = createSlice({
    name: 'alerts',
    initialState: [],
    reducers: {
        addAlert: {
            reducer: (state, action) => {
                state.push(action.payload);
            },
            prepare: (message, type = 'info', duration = DEFAULT_DURATION) => {
                return {
                    payload: {
                        id: nanoid(),
                        message,
                        type,
                        duration,
                        createdAt: Date.now(),
                    },
                };
            },
        },
        removeAlert: (state, action) => {
            const id = action.payload;
            return state.filter((alert) => alert.id !== id);
        },
    },
});

export const { addAlert, removeAlert } = alertSlice.actions;

export const selectAlerts = (state) => state.alerts;

export default alertSlice.reducer;
