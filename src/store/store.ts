import { configureStore } from '@reduxjs/toolkit';
import analysisReducer from './slices/analysisSlice';
import exercisesReducer from './slices/exercisesSlice';
import historyReducer from './slices/historySlice';
import notificationReducer from './slices/notificationSlice';
import progressReducer from './slices/progressSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import vocabularyReducer from './slices/vocabularySlice';

export const store = configureStore({
  reducer: {
    analysis: analysisReducer,
    exercises: exercisesReducer,
    history: historyReducer,
    ui: uiReducer,
    user: userReducer,
    notification: notificationReducer,
    progress: progressReducer,
    vocabulary: vocabularyReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['analysis/setImage'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
