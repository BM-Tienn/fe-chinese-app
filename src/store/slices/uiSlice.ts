import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  selectedWord: any | null;
  wordDetails: any | null;
  loadingWordDetails: boolean;
  wordToPractice: any | null;
}

const initialState: UIState = {
  selectedWord: null,
  wordDetails: null,
  loadingWordDetails: false,
  wordToPractice: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedWord: (state, action: PayloadAction<any | null>) => {
      state.selectedWord = action.payload;
    },
    setWordDetails: (state, action: PayloadAction<any | null>) => {
      state.wordDetails = action.payload;

      // Thêm vào lịch sử nếu có kết quả phân tích
      if (action.payload) {
        // Dispatch action để thêm vào lịch sử
        // Chúng ta sẽ xử lý việc này trong component
      }
    },
    setLoadingWordDetails: (state, action: PayloadAction<boolean>) => {
      state.loadingWordDetails = action.payload;
    },
    setWordToPractice: (state, action: PayloadAction<any | null>) => {
      state.wordToPractice = action.payload;
    },
  },
});

export const {
  setSelectedWord,
  setWordDetails,
  setLoadingWordDetails,
  setWordToPractice,
} = uiSlice.actions;

export default uiSlice.reducer;
