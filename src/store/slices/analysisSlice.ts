import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';
import { sessionManager } from '../../services/sessionManager';
import { addHistoryItem } from './historySlice';

export interface Vocabulary {
  hanzi: string;
  pinyin: string;
  meaning: string;
}

export interface Grammar {
  point: string;
  explanation: string;
  example: string;
}

export interface Analysis {
  lessonRequest: string;
  vocabulary: Vocabulary[];
  grammar: Grammar[];
  exampleParagraph: string;
  responseTime?: number;
  aiModel?: string;
}

interface AnalysisState {
  image: string | null;
  imageBase64: string;
  analysis: Analysis | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalysisState = {
  image: null,
  imageBase64: '',
  analysis: null,
  loading: false,
  error: null,
};

export const analyzeImage = createAsyncThunk(
  'analysis/analyzeImage',
  async (imageBase64: string, { rejectWithValue, dispatch }) => {
    const startTime = Date.now();
    try {
      const session = await sessionManager.initializeSession();
      const result = await apiService.analyzeImage(imageBase64);

      dispatch(addHistoryItem({
        sessionId: session.sessionId,
        userId: session.userId,
        endpoint: 'analyzeImage',
        aiModel: 'gemini-2.5-flash-preview-05-20',
        requestPayload: { imageBase64: imageBase64.substring(0, 100) + '...' },
        responseData: result,
        requestTimestamp: new Date().toISOString(),
        responseTimestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        status: 'success',
        tags: ['image-analysis', 'vocabulary'],
      }));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';

      try {
        const session = await sessionManager.initializeSession();
        dispatch(addHistoryItem({
          sessionId: session.sessionId,
          userId: session.userId,
          endpoint: 'analyzeImage',
          aiModel: 'gemini-2.5-flash-preview-05-20',
          requestPayload: { imageBase64: imageBase64.substring(0, 100) + '...' },
          responseData: { error: errorMessage },
          requestTimestamp: new Date().toISOString(),
          responseTimestamp: new Date().toISOString(),
          responseTime: Date.now() - startTime,
          status: 'error',
          errorMessage: errorMessage,
          tags: ['image-analysis', 'error'],
        }));
      } catch (historyError) {
        console.error('Lỗi khi thêm vào lịch sử:', historyError);
      }

      return rejectWithValue(errorMessage);
    }
  }
);

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setImage: (
      state,
      action: PayloadAction<{ image: string; imageBase64: string }>
    ) => {
      state.image = action.payload.image;
      state.imageBase64 = action.payload.imageBase64;
      state.analysis = null;
      state.error = null;
    },
    clearAnalysis: state => {
      state.analysis = null;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(analyzeImage.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeImage.fulfilled, (state, action) => {
        state.loading = false;
        state.analysis = action.payload;
        state.error = null;
      })
      .addCase(analyzeImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setImage, clearAnalysis, clearError } = analysisSlice.actions;
export default analysisSlice.reducer;
