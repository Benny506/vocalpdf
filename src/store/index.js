import { configureStore } from '@reduxjs/toolkit';
import alertReducer from './slices/alertSlice';
import loaderReducer from './slices/loaderSlice';
import readerReducer from './slices/readerSlice';

export const store = configureStore({
    reducer: {
        alerts: alertReducer,
        loader: loaderReducer,
        reader: readerReducer,
    },
});

export default store;
