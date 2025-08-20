import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

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
  async (imageBase64: string, { rejectWithValue }) => {
    try {
      // Gọi trực tiếp apiService.analyzeImage với imageBase64
      // apiService sẽ tự tạo prompt và payload
      const result = await apiService.analyzeImage(imageBase64);
      return result;
    } catch (error) {
      console.error('Lỗi chi tiết trong analysisSlice:', error);

      let errorMessage = 'Lỗi khi phân tích hình ảnh. Vui lòng thử lại.';

      if (error instanceof Error) {
        errorMessage = `Lỗi khi phân tích hình ảnh: ${error.message}`;
      } else if (typeof error === 'string') {
        errorMessage = `Lỗi khi phân tích hình ảnh: ${error}`;
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
