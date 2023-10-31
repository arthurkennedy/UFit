// src/store/index.js
import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js'
import entriesReducer from './slices/entrySlice.js'
import storage from 'redux-persist/lib/storage'
import {persistReducer, persistStore} from "redux-persist";


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'token']
}

const persistUserReducer = persistReducer(persistConfig, userReducer)
const store = configureStore({
    reducer: {
        user: persistUserReducer,
        entries: entriesReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['persist/PERSIST'],
        },
    }),
});

const persistor = persistStore(store)

export {store, persistor}
