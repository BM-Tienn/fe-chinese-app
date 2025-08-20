import { configureStore } from '@reduxjs/toolkit';
import analysisReducer from './slices/analysisSlice';
import exercisesReducer from './slices/exercisesSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    analysis: analysisReducer,
    exercises: exercisesReducer,
    ui: uiReducer,
    user: userReducer,
    notification: notificationReducer,
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
