import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    message: '',
};

const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        startLoading: (state, action) => {
            state.isLoading = true;
            state.message = action.payload || 'Preparing...';
        },
        stopLoading: (state) => {
            state.isLoading = false;
            state.message = '';
        },
        updateLoadingMessage: (state, action) => {
            state.message = action.payload;
        }
    },
});

export const { startLoading, stopLoading, updateLoadingMessage } = loaderSlice.actions;

export const selectLoader = (state) => state.loader;

export default loaderSlice.reducer;
