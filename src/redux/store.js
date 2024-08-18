// const { configureStore } = require('@reduxjs/toolkit');
// const userReducer = require('../redux/userSlice');  // Ensure the path is correct

// const store = configureStore({
//     reducer: {
//         user: userReducer
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: false
//         })
// });

// module.exports = { store };
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';



// Combine all reducers into a root reducer
const rootReducer = combineReducers({ user: userReducer });

// Configuration for Redux Persist
const persistConfig = {
  key: 'root', // key for localStorage object
  storage, // storage object to be used, such as localStorage
  version: 1 // version number for persistence state, useful for migrations
};

// Create a persisted reducer with Redux Persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer // Use persistedReducer directly
});

// Create a persistor to persist the Redux store
export const persistor = persistStore(store);