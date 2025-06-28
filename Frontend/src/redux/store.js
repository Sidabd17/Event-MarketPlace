import { combineReducers, configureStore } from "@reduxjs/toolkit";  
import authSlice from "./authSlice";
import eventSlice from "./eventSlice";
import ticketSlice from "./ticketSlice";
import notificationSlice from "./notificationSlice";

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  import storage from 'redux-persist/lib/storage'

  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
  }
  
  const rootReducer = combineReducers({
    auth: authSlice,
    event: eventSlice,
    ticket: ticketSlice,
    notification : notificationSlice,
  })

  const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
});

export default store;