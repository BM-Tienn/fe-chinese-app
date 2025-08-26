import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAIInteractionHistory } from '../../services/apiService';

export interface HistoryItem {
    id: string;
    sessionId: string;
    userId?: string;
    endpoint: 'analyzeImage' | 'generateExercises' | 'analyzeWordDetails' | 'analyzePronunciation';
    aiModel: string;
    requestPayload: any;
    responseData: any;
    requestTimestamp: string;
    responseTimestamp: string;
    responseTime: number;
    status: 'pending' | 'success' | 'error' | 'timeout';
    errorMessage?: string;
    tags?: string[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface HistoryState {
    items: HistoryItem[];
    loading: boolean;
    error: string | null;
    filters: {
        endpoint: string;
        status: string;
        dateRange: {
            start: string;
            end: string;
        };
        searchTerm: string;
    };
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

const initialState: HistoryState = {
    items: [],
    loading: false,
    error: null,
    filters: {
        endpoint: 'all',
        status: 'all',
        dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 ngày trước
            end: new Date().toISOString().split('T')[0], // Hôm nay
        },
        searchTerm: '',
    },
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
    },
};

// Async thunks
export const fetchHistory = createAsyncThunk(
    'history/fetchHistory',
    async (params: {
        page?: number;
        limit?: number;
        endpoint?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
        search?: string;
    }) => {
        try {
            const result = await getAIInteractionHistory({
                page: params.page,
                limit: params.limit,
                endpoint: params.endpoint === 'all' ? undefined : params.endpoint,
                status: params.status === 'all' ? undefined : params.status,
                dateFrom: params.dateFrom,
                dateTo: params.dateTo,
            });

            return {
                items: result.data || [],
                total: result.pagination?.total || 0,
            };
        } catch (error) {
            console.error('Lỗi khi fetch history:', error);
            throw error;
        }
    }
);

export const addHistoryItem = createAsyncThunk(
    'history/addHistoryItem',
    async (item: Omit<HistoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        // Backend sẽ tự động tạo item khi có AI interaction
        // Frontend chỉ cần thêm vào state local để hiển thị ngay lập tức
        const newItem: HistoryItem = {
            ...item,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return newItem;
    }
);

export const deleteHistoryItem = createAsyncThunk(
    'history/deleteHistoryItem',
    async (id: string) => {
        // TODO: Implement API call to delete history item
        return id;
    }
);

export const clearHistory = createAsyncThunk(
    'history/clearHistory',
    async () => {
        // TODO: Implement API call to clear all history
        return true;
    }
);

const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<Partial<HistoryState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
            state.pagination.page = 1; // Reset to first page when filters change
        },
        setPagination: (state, action: PayloadAction<Partial<HistoryState['pagination']>>) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
            state.pagination.page = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.pagination.total = action.payload.total;
            })
            .addCase(fetchHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Lỗi khi tải lịch sử';
            })
            .addCase(addHistoryItem.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
                state.pagination.total += 1;
            })
            .addCase(deleteHistoryItem.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
                state.pagination.total -= 1;
            })
            .addCase(clearHistory.fulfilled, (state) => {
                state.items = [];
                state.pagination.total = 0;
                state.pagination.page = 1;
            });
    },
});

export const { setFilters, setPagination, clearFilters } = historySlice.actions;
export default historySlice.reducer;
