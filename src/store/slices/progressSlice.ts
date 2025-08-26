import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    addExperience as addExperienceAPI,
    checkAchievements,
    getAchievements,
    getUserProgress,
    getWeeklyProgress,
    updateDailyProgress,
    updateStreak as updateStreakAPI
} from '../../services/apiService';
import { sessionManager } from '../../services/sessionManager';

export interface WeeklyProgress {
    week: string;
    wordsLearned: number;
    exercisesCompleted: number;
    timeSpent: number;
    accuracy: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: string;
    progress: number;
    maxProgress: number;
}

export interface ProgressState {
    totalWords: number;
    masteredWords: number;
    learningStreak: number;
    currentLevel: number;
    experiencePoints: number;
    weeklyProgress: WeeklyProgress[];
    achievements: Achievement[];
    loading: boolean;
    error: string | null;
}

const initialState: ProgressState = {
    totalWords: 0,
    masteredWords: 0,
    learningStreak: 0,
    currentLevel: 1,
    experiencePoints: 0,
    weeklyProgress: [],
    achievements: [],
    loading: false,
    error: null,
};

// Async thunks
export const fetchUserProgress = createAsyncThunk(
    'progress/fetchUserProgress',
    async (_: any, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for fetchUserProgress:', session.sessionId);

            const response = await getUserProgress();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể tải tiến độ người dùng');
        }
    }
);

export const updateProgress = createAsyncThunk(
    'progress/updateProgress',
    async (updateData: any, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for updateProgress:', session.sessionId);

            const response = await updateDailyProgress(updateData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể cập nhật tiến độ');
        }
    }
);

export const addExperienceAsync = createAsyncThunk(
    'progress/addExperienceAsync',
    async ({ amount, reason }: { amount: number; reason?: string }, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for addExperienceAsync:', session.sessionId);

            const response = await addExperienceAPI(amount, reason || '');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể thêm XP');
        }
    }
);

export const incrementStreakAsync = createAsyncThunk(
    'progress/incrementStreakAsync',
    async (_: any, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for incrementStreakAsync:', session.sessionId);

            const response = await updateStreakAPI();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể cập nhật streak');
        }
    }
);

export const fetchWeeklyProgress = createAsyncThunk(
    'progress/fetchWeeklyProgress',
    async (weeks: number = 12, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for fetchWeeklyProgress:', session.sessionId);

            const response = await getWeeklyProgress(weeks);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể tải tiến độ tuần');
        }
    }
);

export const fetchAchievements = createAsyncThunk(
    'progress/fetchAchievements',
    async (_: any, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for fetchAchievements:', session.sessionId);

            const response = await getAchievements();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể tải achievements');
        }
    }
);

export const checkAndUpdateAchievements = createAsyncThunk(
    'progress/checkAndUpdateAchievements',
    async (_: any, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for checkAndUpdateAchievements:', session.sessionId);

            const response = await checkAchievements();
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể kiểm tra achievements');
        }
    }
);

const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        addExperience: (state, action: PayloadAction<number>) => {
            state.experiencePoints += action.payload;
            // Kiểm tra level up
            const nextLevelXP = Math.pow(state.currentLevel + 1, 2) * 100;
            if (state.experiencePoints >= nextLevelXP) {
                state.currentLevel += 1;
            }
        },
        incrementStreak: (state) => {
            state.learningStreak += 1;
        },
        resetStreak: (state) => {
            state.learningStreak = 0;
        },
        addMasteredWord: (state) => {
            state.masteredWords += 1;
            state.totalWords += 1;
        },
        updateWeeklyProgress: (state, action: PayloadAction<WeeklyProgress>) => {
            const existingIndex = state.weeklyProgress.findIndex(w => w.week === action.payload.week);
            if (existingIndex !== -1) {
                state.weeklyProgress[existingIndex] = action.payload;
            } else {
                state.weeklyProgress.push(action.payload);
            }
            // Giữ chỉ 12 tuần gần nhất
            if (state.weeklyProgress.length > 12) {
                state.weeklyProgress = state.weeklyProgress.slice(-12);
            }
        },
        addAchievement: (state, action: PayloadAction<Achievement>) => {
            const existingIndex = state.achievements.findIndex(a => a.id === action.payload.id);
            if (existingIndex === -1) {
                state.achievements.push(action.payload);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchUserProgress
            .addCase(fetchUserProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.totalWords = action.payload.totalWords || 0;
                state.masteredWords = action.payload.masteredWords || 0;
                state.learningStreak = action.payload.learningStreak || 0;
                state.currentLevel = action.payload.currentLevel || 1;
                state.experiencePoints = action.payload.experiencePoints || 0;
                state.weeklyProgress = action.payload.weeklyProgress || [];
                state.achievements = action.payload.achievements || [];
            })
            .addCase(fetchUserProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // updateProgress
            .addCase(updateProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProgress.fulfilled, (state, action) => {
                state.loading = false;
                // Cập nhật state dựa trên response
                if (action.payload) {
                    state.totalWords = action.payload.totalWords || state.totalWords;
                    state.masteredWords = action.payload.masteredWords || state.masteredWords;
                    state.learningStreak = action.payload.learningStreak || state.learningStreak;
                    state.currentLevel = action.payload.currentLevel || state.currentLevel;
                    state.experiencePoints = action.payload.experiencePoints || state.experiencePoints;
                }
            })
            .addCase(updateProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // addExperienceAsync
            .addCase(addExperienceAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addExperienceAsync.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.experiencePoints = action.payload.experiencePoints || state.experiencePoints;
                    state.currentLevel = action.payload.currentLevel || state.currentLevel;
                }
            })
            .addCase(addExperienceAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // incrementStreakAsync
            .addCase(incrementStreakAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(incrementStreakAsync.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.learningStreak = action.payload.learningStreak || state.learningStreak;
                }
            })
            .addCase(incrementStreakAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchWeeklyProgress
            .addCase(fetchWeeklyProgress.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWeeklyProgress.fulfilled, (state, action) => {
                state.loading = false;
                state.weeklyProgress = action.payload || [];
            })
            .addCase(fetchWeeklyProgress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchAchievements
            .addCase(fetchAchievements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAchievements.fulfilled, (state, action) => {
                state.loading = false;
                state.achievements = action.payload || [];
            })
            .addCase(fetchAchievements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // checkAndUpdateAchievements
            .addCase(checkAndUpdateAchievements.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAndUpdateAchievements.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.newAchievements) {
                    state.achievements = [...state.achievements, ...action.payload.newAchievements];
                }
            })
            .addCase(checkAndUpdateAchievements.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const {
    setLoading,
    clearError,
    addExperience,
    incrementStreak,
    resetStreak,
    addMasteredWord,
    updateWeeklyProgress,
    addAchievement,
} = progressSlice.actions;

export default progressSlice.reducer;
