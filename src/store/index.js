import { configureStore } from '@reduxjs/toolkit';
import alertReducer from './slices/alertSlice';
import loaderReducer from './slices/loaderSlice';
import readerReducer from './slices/readerSlice';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
    reducer: {
        alerts: alertReducer,
        loader: loaderReducer,
        reader: readerReducer,
        auth: authReducer,
        admin: adminReducer,
    },
});

export default store;
