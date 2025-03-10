import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loadAuthState } from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch; // ✅ Export AppDispatch type

// ✅ Load persisted authentication state when the app starts
store.dispatch(loadAuthState());

export default store;