import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    addPersonalWord as addPersonalWordAPI,
    deletePersonalWord as deletePersonalWordAPI,
    getNewWords,
    getPersonalVocabulary,
    getWordsForReview,
    updatePersonalWord as updatePersonalWordAPI,
    updateStudyResult as updateStudyResultAPI
} from '../../services/apiService';
import { sessionManager } from '../../services/sessionManager';

export interface PersonalWord {
    id: string;
    hanzi: string;
    pinyin: string;
    meaning: string;
    masteryLevel: number; // 1-5 (1: mới học, 5: thuộc lòng)
    lastReviewed: string;
    nextReview: string;
    reviewCount: number;
    correctAnswers: number;
    totalAttempts: number;
    tags: string[];
    notes: string;
    addedAt: string;
}

export interface StudyItem {
    id: string;
    wordId: string;
    word: PersonalWord;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    studyType: 'review' | 'new' | 'mastery';
}

export interface ReviewSchedule {
    date: string;
    wordsToReview: StudyItem[];
    newWords: StudyItem[];
    masteryWords: StudyItem[];
}

export interface VocabularyState {
    personalVocabulary: PersonalWord[];
    studyQueue: StudyItem[];
    reviewSchedule: ReviewSchedule[];
    masteryLevels: Record<string, number>;
    loading: boolean;
    error: string | null;
    currentStudySession: {
        words: StudyItem[];
        currentIndex: number;
        sessionType: 'review' | 'new' | 'mixed';
    } | null;
}

const initialState: VocabularyState = {
    personalVocabulary: [],
    studyQueue: [],
    reviewSchedule: [],
    masteryLevels: {},
    loading: false,
    error: null,
    currentStudySession: null,
};

// Async thunks
export const fetchPersonalVocabulary = createAsyncThunk(
    'vocabulary/fetchPersonalVocabulary',
    async ({ options }: { options?: any } = {}, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for fetchPersonalVocabulary:', session.sessionId);

            const response = await getPersonalVocabulary(options);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể tải từ vựng cá nhân');
        }
    }
);

export const addPersonalWord = createAsyncThunk(
    'vocabulary/addPersonalWord',
    async (wordData: any, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for addPersonalWord:', session.sessionId);

            const response = await addPersonalWordAPI(wordData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể thêm từ vựng');
        }
    }
);

export const updatePersonalWord = createAsyncThunk(
    'vocabulary/updatePersonalWord',
    async ({ id, updateData }: { id: string; updateData: any }, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for updatePersonalWord:', session.sessionId);

            const response = await updatePersonalWordAPI(id, updateData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể cập nhật từ vựng');
        }
    }
);

export const deletePersonalWord = createAsyncThunk(
    'vocabulary/deletePersonalWord',
    async (id: string, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for deletePersonalWord:', session.sessionId);

            const response = await deletePersonalWordAPI(id);
            return { id, ...response.data };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể xóa từ vựng');
        }
    }
);

export const fetchWordsForReview = createAsyncThunk(
    'vocabulary/fetchWordsForReview',
    async (limit: number = 20, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for fetchWordsForReview:', session.sessionId);

            const response = await getWordsForReview(limit);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể tải từ vựng cần ôn tập');
        }
    }
);

export const fetchNewWords = createAsyncThunk(
    'vocabulary/fetchNewWords',
    async (limit: number = 10, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for fetchNewWords:', session.sessionId);

            const response = await getNewWords(limit);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể tải từ vựng mới');
        }
    }
);

export const updateStudyResult = createAsyncThunk(
    'vocabulary/updateStudyResult',
    async ({ id, studyData }: { id: string; studyData: any }, { rejectWithValue }: any) => {
        try {
            const session = await sessionManager.initializeSession();
            console.log('Session initialized for updateStudyResult:', session.sessionId);

            const response = await updateStudyResultAPI(id, studyData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Không thể cập nhật kết quả học tập');
        }
    }
);

const vocabularySlice = createSlice({
    name: 'vocabulary',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        setCurrentStudySession: (state, action: PayloadAction<{
            words: StudyItem[];
            currentIndex: number;
            sessionType: 'review' | 'new' | 'mixed';
        } | null>) => {
            state.currentStudySession = action.payload;
        },
        updateCurrentStudyIndex: (state, action: PayloadAction<number>) => {
            if (state.currentStudySession) {
                state.currentStudySession.currentIndex = action.payload;
            }
        },
        addWordToStudyQueue: (state, action: PayloadAction<StudyItem>) => {
            state.studyQueue.push(action.payload);
        },
        removeWordFromStudyQueue: (state, action: PayloadAction<string>) => {
            state.studyQueue = state.studyQueue.filter(item => item.wordId !== action.payload);
        },
        updateMasteryLevel: (state, action: PayloadAction<{ wordId: string; level: number }>) => {
            state.masteryLevels[action.payload.wordId] = action.payload.level;
        },
        startStudySession: (state, action: PayloadAction<{
            words: StudyItem[];
            sessionType: 'review' | 'new' | 'mixed';
        }>) => {
            state.currentStudySession = {
                words: action.payload.words,
                currentIndex: 0,
                sessionType: action.payload.sessionType,
            };
        },
        nextWord: (state) => {
            if (state.currentStudySession && state.currentStudySession.currentIndex < state.currentStudySession.words.length - 1) {
                state.currentStudySession.currentIndex += 1;
            }
        },
        previousWord: (state) => {
            if (state.currentStudySession && state.currentStudySession.currentIndex > 0) {
                state.currentStudySession.currentIndex -= 1;
            }
        },
        endStudySession: (state) => {
            state.currentStudySession = null;
        },
        updateWordMastery: (state, action: PayloadAction<{ wordId: string; newLevel: number; isCorrect: boolean }>) => {
            const { wordId, newLevel, isCorrect } = action.payload;
            const word = state.personalVocabulary.find(w => w.id === wordId);
            if (word) {
                word.masteryLevel = newLevel;
                word.lastReviewed = new Date().toISOString();
                word.reviewCount += 1;
                word.totalAttempts += 1;
                if (isCorrect) {
                    word.correctAnswers += 1;
                }

                // Tính toán thời gian ôn tập tiếp theo dựa trên thuật toán spaced repetition
                const daysUntilNextReview = Math.pow(2, newLevel - 1);
                word.nextReview = new Date(Date.now() + daysUntilNextReview * 24 * 60 * 60 * 1000).toISOString();
            }
        },
        addWordTag: (state, action: PayloadAction<{ wordId: string; tag: string }>) => {
            const { wordId, tag } = action.payload;
            const word = state.personalVocabulary.find(w => w.id === wordId);
            if (word && !word.tags.includes(tag)) {
                word.tags.push(tag);
            }
        },
        removeWordTag: (state, action: PayloadAction<{ wordId: string; tag: string }>) => {
            const { wordId, tag } = action.payload;
            const word = state.personalVocabulary.find(w => w.id === wordId);
            if (word) {
                word.tags = word.tags.filter(t => t !== tag);
            }
        },
        updateWordNotes: (state, action: PayloadAction<{ wordId: string; notes: string }>) => {
            const { wordId, notes } = action.payload;
            const word = state.personalVocabulary.find(w => w.id === wordId);
            if (word) {
                word.notes = notes;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchPersonalVocabulary
            .addCase(fetchPersonalVocabulary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPersonalVocabulary.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.vocabularies) {
                    state.personalVocabulary = action.payload.vocabularies;
                } else if (Array.isArray(action.payload)) {
                    state.personalVocabulary = action.payload;
                }
                // Cập nhật masteryLevels
                action.payload.forEach((word: PersonalWord) => {
                    state.masteryLevels[word.id] = word.masteryLevel;
                });
            })
            .addCase(fetchPersonalVocabulary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // addPersonalWord
            .addCase(addPersonalWord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPersonalWord.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const newWord: PersonalWord = {
                        id: action.payload._id || action.payload.id,
                        hanzi: action.payload.hanzi,
                        pinyin: action.payload.pinyin,
                        meaning: action.payload.meaning,
                        masteryLevel: action.payload.masteryLevel || 1,
                        lastReviewed: action.payload.lastReviewed || new Date().toISOString(),
                        nextReview: action.payload.nextReview || new Date().toISOString(),
                        reviewCount: action.payload.learningStats?.reviewCount || 0,
                        correctAnswers: action.payload.learningStats?.correctAnswers || 0,
                        totalAttempts: action.payload.learningStats?.totalAttempts || 0,
                        tags: action.payload.tags || [],
                        notes: action.payload.notes || '',
                        addedAt: action.payload.createdAt || new Date().toISOString()
                    };
                    state.personalVocabulary.push(newWord);
                }
            })
            .addCase(addPersonalWord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // updatePersonalWord
            .addCase(updatePersonalWord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePersonalWord.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    const index = state.personalVocabulary.findIndex(word => word.id === action.payload._id || action.payload.id);
                    if (index !== -1) {
                        state.personalVocabulary[index] = {
                            ...state.personalVocabulary[index],
                            hanzi: action.payload.hanzi || state.personalVocabulary[index].hanzi,
                            pinyin: action.payload.pinyin || state.personalVocabulary[index].pinyin,
                            meaning: action.payload.meaning || state.personalVocabulary[index].meaning,
                            masteryLevel: action.payload.masteryLevel || state.personalVocabulary[index].masteryLevel,
                            tags: action.payload.tags || state.personalVocabulary[index].tags,
                            notes: action.payload.notes || state.personalVocabulary[index].notes
                        };
                    }
                }
            })
            .addCase(updatePersonalWord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // deletePersonalWord
            .addCase(deletePersonalWord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePersonalWord.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.id) {
                    state.personalVocabulary = state.personalVocabulary.filter(word => word.id !== action.payload.id);
                }
            })
            .addCase(deletePersonalWord.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchWordsForReview
            .addCase(fetchWordsForReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWordsForReview.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && Array.isArray(action.payload)) {
                    const reviewItems: StudyItem[] = action.payload.map(word => ({
                        id: word._id || word.id,
                        wordId: word._id || word.id,
                        word: {
                            id: word._id || word.id,
                            hanzi: word.hanzi,
                            pinyin: word.pinyin,
                            meaning: word.meaning,
                            masteryLevel: word.masteryLevel || 1,
                            lastReviewed: word.lastReviewed || new Date().toISOString(),
                            nextReview: word.nextReview || new Date().toISOString(),
                            reviewCount: word.learningStats?.reviewCount || 0,
                            correctAnswers: word.learningStats?.correctAnswers || 0,
                            totalAttempts: word.learningStats?.totalAttempts || 0,
                            tags: word.tags || [],
                            notes: word.notes || '',
                            addedAt: word.createdAt || new Date().toISOString()
                        },
                        dueDate: word.nextReview || new Date().toISOString(),
                        priority: word.priority || 'medium',
                        studyType: 'review' as const
                    }));
                    state.studyQueue = reviewItems;
                }
            })
            .addCase(fetchWordsForReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // fetchNewWords
            .addCase(fetchNewWords.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNewWords.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && Array.isArray(action.payload)) {
                    const newItems: StudyItem[] = action.payload.map(word => ({
                        id: word._id || word.id,
                        wordId: word._id || word.id,
                        word: {
                            id: word._id || word.id,
                            hanzi: word.hanzi,
                            pinyin: word.pinyin,
                            meaning: word.meaning,
                            masteryLevel: word.masteryLevel || 1,
                            lastReviewed: word.lastReviewed || new Date().toISOString(),
                            nextReview: word.nextReview || new Date().toISOString(),
                            reviewCount: word.learningStats?.reviewCount || 0,
                            correctAnswers: word.learningStats?.correctAnswers || 0,
                            totalAttempts: word.learningStats?.totalAttempts || 0,
                            tags: word.tags || [],
                            notes: word.notes || '',
                            addedAt: word.createdAt || new Date().toISOString()
                        },
                        dueDate: word.nextReview || new Date().toISOString(),
                        priority: word.priority || 'medium',
                        studyType: 'new' as const
                    }));
                    state.studyQueue = [...state.studyQueue, ...newItems];
                }
            })
            .addCase(fetchNewWords.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // updateStudyResult
            .addCase(updateStudyResult.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudyResult.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    // Cập nhật từ vựng trong danh sách cá nhân
                    const index = state.personalVocabulary.findIndex(word => word.id === action.payload._id || action.payload.id);
                    if (index !== -1) {
                        state.personalVocabulary[index] = {
                            ...state.personalVocabulary[index],
                            masteryLevel: action.payload.masteryLevel || state.personalVocabulary[index].masteryLevel,
                            lastReviewed: action.payload.lastReviewed || new Date().toISOString(),
                            nextReview: action.payload.nextReview || new Date().toISOString(),
                            reviewCount: action.payload.learningStats?.reviewCount || state.personalVocabulary[index].reviewCount,
                            correctAnswers: action.payload.learningStats?.correctAnswers || state.personalVocabulary[index].correctAnswers,
                            totalAttempts: action.payload.learningStats?.totalAttempts || state.personalVocabulary[index].totalAttempts
                        };
                    }
                }
            })
            .addCase(updateStudyResult.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setLoading,
    clearError,
    setCurrentStudySession,
    updateCurrentStudyIndex,
    addWordToStudyQueue,
    removeWordFromStudyQueue,
    updateMasteryLevel,
    startStudySession,
    nextWord,
    previousWord,
    endStudySession,
    updateWordMastery,
    addWordTag,
    removeWordTag,
    updateWordNotes,
} = vocabularySlice.actions;

export default vocabularySlice.reducer;
