import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'development'
  ? 'http://172.20.10.2:8003'
  
  : 'https://fastapi-app-427504069028.us-central1.run.app';
const API_KEY = 'sushi';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
  },
});

// 🔹 Load saved authentication state from AsyncStorage
export const loadAuthState = createAsyncThunk('auth/loadAuthState', async (_, { rejectWithValue }) => {
  try {
    const userData = await AsyncStorage.getItem('authState');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    return rejectWithValue('Failed to load auth state');
  }
});

// 🔹 Sign In and Save to AsyncStorage
export const signIn = createAsyncThunk('auth/signIn', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/signin', credentials);
    const authData = response.data;

    await AsyncStorage.setItem('authState', JSON.stringify(authData)); // ✅ Save user state
    return authData;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Login failed');
  }
});

// Async thunk for signing up
export const signUp = createAsyncThunk('auth/signUp', async (userData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/signup', userData);
      const authData = response.data;
  
      await AsyncStorage.setItem('authState', JSON.stringify(authData)); // ✅ Save user state
      return authData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Signup failed');
    }
  });

// 🔹 Sign Out and Clear AsyncStorage
export const signOut = createAsyncThunk('auth/signOut', async (_, { dispatch }) => {
  await AsyncStorage.removeItem('authState'); // ✅ Remove user data from storage
  dispatch(authSlice.actions.logout());
});

// 🔹 Authentication Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAuthState.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export default authSlice.reducer;