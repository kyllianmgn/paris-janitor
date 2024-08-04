import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import authReducer from './slices/authSlice';

import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
    return {
        getItem(_key: string) {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: null) {
            return Promise.resolve(value);
        },
        removeItem(_key: string) {
            return Promise.resolve();
        },
    };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

export default storage;

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['register'],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;