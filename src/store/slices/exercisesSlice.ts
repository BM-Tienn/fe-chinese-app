import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';
import { sessionManager } from '../../services/sessionManager';
import { addHistoryItem } from './historySlice';

export interface Exercise {
  question: string;
  options?: string[];
  answer: string;
  sentence?: string;
  correctSentence?: string;
  prompt?: string;
  suggestedAnswer?: string;
  direction?: string;
}

export interface Exercises {
  multipleChoice?: Exercise[];
  selectPinyin?: Exercise[];
  findTheMistake?: Exercise[];
  fillInTheBlank?: Exercise[];
  sentenceBuilding?: Exercise[];
  translation?: Exercise[];
}

interface ExercisesState {
  exercises: Exercises | null;
  userAnswers: Record<string, string>;
  showResults: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ExercisesState = {
  exercises: null,
  userAnswers: {},
  showResults: false,
  loading: false,
  error: null,
};

export const generateExercises = createAsyncThunk(
  'exercises/generateExercises',
  async (prompt: string, { rejectWithValue, dispatch }) => {
    const startTime = Date.now();
    try {
      const session = await sessionManager.initializeSession();
      const result = await apiService.generateExercises(prompt);

      dispatch(addHistoryItem({
        sessionId: session.sessionId,
        userId: session.userId,
        endpoint: 'generateExercises',
        aiModel: 'gemini-2.5-flash-preview-05-20',
        requestPayload: { prompt },
        responseData: result,
        requestTimestamp: new Date().toISOString(),
        responseTimestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        status: 'success',
        tags: ['exercise-generation', 'ai'],
      }));

      return result;
    } catch (error) {
      try {
        const session = await sessionManager.initializeSession();
        dispatch(addHistoryItem({
          sessionId: session.sessionId,
          userId: session.userId,
          endpoint: 'generateExercises',
          aiModel: 'gemini-2.5-flash-preview-05-20',
          requestPayload: { prompt },
          responseData: { error: 'Lỗi khi tạo bài tập. Vui lòng thử lại.' },
          requestTimestamp: new Date().toISOString(),
          responseTimestamp: new Date().toISOString(),
          responseTime: Date.now() - startTime,
          status: 'error',
          errorMessage: 'Lỗi khi tạo bài tập. Vui lòng thử lại.',
          tags: ['exercise-generation', 'error'],
        }));
      } catch (historyError) {
        console.error('Lỗi khi thêm vào lịch sử:', historyError);
      }

      return rejectWithValue('Lỗi khi tạo bài tập. Vui lòng thử lại.');
    }
  }
);

const exercisesSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setUserAnswer: (
      state,
      action: PayloadAction<{ key: string; value: string }>
    ) => {
      state.userAnswers[action.payload.key] = action.payload.value;
    },
    setShowResults: (state, action: PayloadAction<boolean>) => {
      state.showResults = action.payload;
    },
    clearExercises: state => {
      state.exercises = null;
      state.userAnswers = {};
      state.showResults = false;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(generateExercises.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateExercises.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload;
        state.error = null;

        // Khởi tạo userAnswers
        const initialAnswers: Record<string, string> = {};
        Object.keys(action.payload).forEach(key => {
          if (Array.isArray(action.payload[key])) {
            const prefixMap: Record<string, string> = {
              multipleChoice: 'mc',
              selectPinyin: 'sp',
              findTheMistake: 'ftm',
              fillInTheBlank: 'fib',
              sentenceBuilding: 'sb',
              translation: 'trans',
            };
            const prefix = prefixMap[key] || key.substring(0, 3).toLowerCase();
            action.payload[key].forEach((_: any, i: any) => {
              initialAnswers[`${prefix}_${i}`] = '';
            });
          }
        });
        state.userAnswers = initialAnswers;
      })
      .addCase(generateExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUserAnswer, setShowResults, clearExercises, clearError } =
  exercisesSlice.actions;
export default exercisesSlice.reducer;
