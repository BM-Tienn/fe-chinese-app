import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService } from '../../services/backendService';

export interface User {
  id: string;
  email: string;
  displayName: string;
  lastLogin: string;
  loginCount: number;
  preferences?: {
    language: string;
    theme: string;
  };
}

export interface UserSession {
  sessionId: string;
  startTime: string;
  isActive: boolean;
}

interface UserState {
  user: User | null;
  session: UserSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  showLoginModal: boolean;
}

const initialState: UserState = {
  user: null,
  session: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  showLoginModal: false,
};

// Async thunk để đăng nhập
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (
    { email, displayName }: { email: string; displayName?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.loginOrCreateUser({
        email,
        displayName,
      });

      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data?.message || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Đã có lỗi xảy ra');
    }
  }
);

// Async thunk để lấy thông tin user theo session
export const getUserBySession = createAsyncThunk(
  'user/getUserBySession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await userService.getUserBySession(sessionId);

      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(
          response.data?.message || 'Không thể lấy thông tin user'
        );
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Đã có lỗi xảy ra');
    }
  }
);

// Async thunk để cập nhật thông tin user
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    {
      sessionId,
      data,
    }: { sessionId: string; data: { displayName?: string; preferences?: any } },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.updateUser(sessionId, data);

      if (response.data && response.data.success) {
        return response.data.data.user;
      } else {
        return rejectWithValue(response.data?.message || 'Cập nhật thất bại');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Đã có lỗi xảy ra');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setShowLoginModal: (state, action: PayloadAction<boolean>) => {
      state.showLoginModal = action.payload;
    },
    logout: state => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setSession: (state, action: PayloadAction<UserSession>) => {
      state.session = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = true;
        state.showLoginModal = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get user by session
      .addCase(getUserBySession.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBySession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUserBySession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Update user
      .addCase(updateUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setShowLoginModal, logout, clearError, setUser, setSession } =
  userSlice.actions;

export default userSlice.reducer;
