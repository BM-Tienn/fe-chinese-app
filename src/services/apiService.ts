import { ENDPOINTS, createApiUrl } from '../config/api';
import { sessionManager } from './sessionManager';

// Helper function để lấy headers với session
const getAuthHeaders = async (): Promise<HeadersInit> => {
  try {
    const session = await sessionManager.initializeSession();
    return {
      'Content-Type': 'application/json',
      'x-session-id': session.sessionId,
      'x-user-id': session.userId
    };
  } catch (error) {
    console.error('Lỗi khi lấy session:', error);
    return {
      'Content-Type': 'application/json'
    };
  }
};

// Hàm tiện ích để làm sạch và parse JSON (giữ lại để tương thích)
export const sanitizeAndParseJson = (text: string) => {
  const jsonMatch = text.match(/```json\s*(\{[\s\S]*\})\s*```|(\{[\s\S]*\})/);
  if (jsonMatch) {
    let jsonString = jsonMatch[1] || jsonMatch[2];
    jsonString = jsonString.replace(/,(?=\s*?[}\]])/g, '');
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Lỗi phân tích JSON sau khi đã làm sạch:', e);
      console.error('Chuỗi JSON lỗi:', jsonString);
      throw new Error('Invalid JSON response from API after sanitization.');
    }
  }
  throw new Error('Could not find valid JSON in the API response.');
};

// Service để phân tích hình ảnh - sử dụng sessionManager
export const analyzeImage = async (imageBase64: string) => {
  try {
    // Lấy session từ sessionManager (sẽ tự động khởi tạo nếu cần)
    const session = await sessionManager.initializeSession();

    const payload = {
      contents: [
        {
          parts: [
            {
              text: 'Phân tích hình ảnh này và trích xuất tất cả từ vựng tiếng Trung có trong đó. Trả về kết quả dưới dạng JSON với cấu trúc: { "lessonRequest": "string", "vocabulary": [{"hanzi": "...", "pinyin": "...", "meaning": "..."}], "grammar": [{"point": "...", "explanation": "...", "example": "..."}], "exampleParagraph": "string" }'
            },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageBase64
              }
            }
          ]
        }
      ]
    };

    // Gọi backend API với format đúng
    const response = await fetch(createApiUrl(ENDPOINTS.AI_INTERACTIONS_ANALYZE_IMAGE), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payload,
        sessionId: session.sessionId,
        userId: session.userId,
        metadata: {
          source: 'frontend',
          timestamp: new Date().toISOString(),
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Lỗi khi phân tích hình ảnh:', error);
    throw error;
  }
};

// Service để tạo bài tập - sử dụng sessionManager
export const generateExercises = async (prompt: string) => {
  try {
    // Lấy session từ sessionManager (sẽ tự động khởi tạo nếu cần)
    const session = await sessionManager.initializeSession();

    // Tạo payload từ prompt
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    };

    // Gọi backend API
    const response = await fetch(createApiUrl(ENDPOINTS.AI_INTERACTIONS_GENERATE_EXERCISES), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload,
        sessionId: session.sessionId,
        userId: session.userId,
        metadata: {
          source: 'frontend',
          timestamp: new Date().toISOString(),
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Lỗi khi tạo bài tập:', error);
    throw error;
  }
};

// Service để phân tích chi tiết từ vựng - sử dụng sessionManager
export const analyzeWordDetails = async (payload: any) => {
  try {
    // Lấy session từ sessionManager (sẽ tự động khởi tạo nếu cần)
    const session = await sessionManager.initializeSession();

    // Gọi backend API
    const response = await fetch(createApiUrl(ENDPOINTS.AI_INTERACTIONS_ANALYZE_WORD), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload,
        sessionId: session.sessionId,
        userId: session.userId,
        metadata: {
          source: 'frontend',
          timestamp: new Date().toISOString(),
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Lỗi khi phân tích chi tiết từ:', error);
    throw error;
  }
};

// Service để phân tích phát âm - sử dụng sessionManager
export const analyzePronunciation = async (payload: any) => {
  try {
    // Lấy session từ sessionManager (sẽ tự động khởi tạo nếu cần)
    const session = await sessionManager.initializeSession();

    // Gọi backend API
    const response = await fetch(createApiUrl(ENDPOINTS.AI_INTERACTIONS_ANALYZE_PRONUNCIATION), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload,
        sessionId: session.sessionId,
        userId: session.userId,
        metadata: {
          source: 'frontend',
          timestamp: new Date().toISOString(),
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Lỗi khi phân tích phát âm:', error);
    throw error;
  }
};

// Personal Vocabulary API
export const getPersonalVocabulary = async (options?: {
  page?: number;
  limit?: number;
  search?: string;
  masteryLevel?: number;
  studyStatus?: string;
  tags?: string[];
  sortBy?: string;
  sortOrder?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.search) params.append('search', options.search);
    if (options?.masteryLevel) params.append('masteryLevel', options.masteryLevel.toString());
    if (options?.studyStatus) params.append('studyStatus', options.studyStatus);
    if (options?.tags) params.append('tags', options.tags.join(','));
    if (options?.sortBy) params.append('sortBy', options.sortBy);
    if (options?.sortOrder) params.append('sortOrder', options.sortOrder);

    const response = await fetch(createApiUrl(ENDPOINTS.PERSONAL_VOCABULARY) + `?${params}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching personal vocabulary:', error);
    throw error;
  }
};

export const addPersonalWord = async (wordData: {
  wordId?: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  notes?: string;
  tags?: string[];
  priority?: string;
}) => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.PERSONAL_VOCABULARY), {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(wordData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding personal word:', error);
    throw error;
  }
};

export const updatePersonalWord = async (id: string, updateData: Partial<{
  hanzi: string;
  pinyin: string;
  meaning: string;
  notes: string;
  tags: string[];
  priority: string;
}>) => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.PERSONAL_VOCABULARY) + `/${id}`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating personal word:', error);
    throw error;
  }
};

export const deletePersonalWord = async (id: string) => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.PERSONAL_VOCABULARY) + `/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting personal word:', error);
    throw error;
  }
};

export const getWordsForReview = async (limit: number = 20) => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.PERSONAL_VOCABULARY_REVIEW) + `?limit=${limit}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy từ vựng cần ôn tập:', error);
    throw error;
  }
};

export const getNewWords = async (limit: number = 10) => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.PERSONAL_VOCABULARY_NEW) + `?limit=${limit}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy từ vựng mới:', error);
    throw error;
  }
};

export const updateStudyResult = async (id: string, studyData: {
  isCorrect: boolean;
  timeSpent?: number;
}) => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.PERSONAL_VOCABULARY) + `/${id}/study-result`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(studyData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating study result:', error);
    throw error;
  }
};

// User Progress API
export const getUserProgress = async () => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.USER_PROGRESS), {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
};

export const updateUserProgress = async (updateData: any) => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.USER_PROGRESS), {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
};

export const addExperience = async (amount: number, reason: string = '') => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.USER_PROGRESS_EXPERIENCE), {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ amount, reason }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding experience:', error);
    throw error;
  }
};

export const updateStreak = async () => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.USER_PROGRESS_STREAK), {
      method: 'POST',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi cập nhật streak:', error);
    throw error;
  }
};

export const getWeeklyProgress = async (weeks: number = 12) => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.USER_PROGRESS_WEEKLY) + `?weeks=${weeks}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy tiến độ tuần:', error);
    throw error;
  }
};

export const getDailyProgress = async (days: number = 30) => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.USER_PROGRESS_DAILY) + `?days=${days}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy tiến độ ngày:', error);
    throw error;
  }
};

export const getAchievements = async () => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.USER_PROGRESS_ACHIEVEMENTS), {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy achievements:', error);
    throw error;
  }
};

export const updateDailyProgress = async (dailyData: {
  wordsLearned: number;
  exercisesCompleted: number;
  timeSpent: number;
  accuracy: number;
}) => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.USER_PROGRESS_DAILY), {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(dailyData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi cập nhật tiến độ ngày:', error);
    throw error;
  }
};

export const updateWeeklyProgress = async (weekData: {
  week: string;
  wordsLearned: number;
  exercisesCompleted: number;
  timeSpent: number;
  accuracy: number;
}) => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.USER_PROGRESS_WEEKLY), {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(weekData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi cập nhật tiến độ tuần:', error);
    throw error;
  }
};

export const checkAchievements = async () => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.USER_PROGRESS_CHECK_ACHIEVEMENTS), {
      method: 'POST',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi kiểm tra achievements:', error);
    throw error;
  }
};

export const getOverallStats = async () => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.USER_PROGRESS_OVERALL_STATS), {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thống kê tổng quan:', error);
    throw error;
  }
};

export const getVocabularyStats = async () => {
  try {
    const response = await fetch(createApiUrl(ENDPOINTS.PERSONAL_VOCABULARY_STATS), {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Lỗi khi lấy thống kê từ vựng:', error);
    throw error;
  }
};

// Export default object để tương thích với các slice
export const apiService = {
  analyzeImage,
  generateExercises,
  analyzeWordDetails,
  analyzePronunciation,
};

// Export sessionManager để sử dụng trong components
export { sessionManager };

// Service để lấy lịch sử AI interactions
export const getAIInteractionHistory = async (params: {
  page?: number;
  limit?: number;
  sessionId?: string;
  userId?: string;
  endpoint?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sessionId) queryParams.append('sessionId', params.sessionId);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.endpoint) queryParams.append('endpoint', params.endpoint);
    if (params.status) queryParams.append('status', params.status);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.search) queryParams.append('search', params.search);

    const response = await fetch(`${createApiUrl(ENDPOINTS.AI_INTERACTIONS_HISTORY)}?${queryParams}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Debug logging để kiểm tra response từ backend
    console.log('Backend response for history:', result);
    console.log('Response data:', result.data);
    if (result.data && result.data.length > 0) {
      console.log('First item from backend:', result.data[0]);
      console.log('First item _id:', result.data[0]._id);
      console.log('First item id:', result.data[0].id);
    }

    // Xử lý dữ liệu để đảm bảo có id field
    if (result.data && Array.isArray(result.data)) {
      result.data = result.data.map((item: any) => {
        // Đảm bảo cả id và _id đều có giá trị
        if (item._id && !item.id) {
          return { ...item, id: item._id.toString() };
        }
        if (item.id && !item._id) {
          return { ...item, _id: item.id };
        }
        // Nếu cả hai đều có, đảm bảo chúng giống nhau
        if (item.id && item._id && item.id !== item._id.toString()) {
          return { ...item, _id: item.id };
        }
        return item;
      });
    }

    // Xử lý response từ backend để đảm bảo tính nhất quán
    if (result.success) {
      return {
        success: true,
        data: result.data || [],
        pagination: result.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        filters: result.filters || {
          applied: {},
          available: {
            endpoints: [],
            statuses: []
          }
        }
      };
    } else {
      throw new Error(result.message || 'Lỗi khi lấy lịch sử AI interactions');
    }
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử AI interactions:', error);
    throw error;
  }
};

// Service để lấy thống kê AI interactions
export const getAIInteractionStats = async (params: {
  sessionId?: string;
  userId?: string;
  endpoint?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.sessionId) queryParams.append('sessionId', params.sessionId);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.endpoint) queryParams.append('endpoint', params.endpoint);
    if (params.status) queryParams.append('status', params.status);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);

    const response = await fetch(`${createApiUrl(ENDPOINTS.AI_INTERACTIONS_STATS)}?${queryParams}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Xử lý response từ backend để đảm bảo tính nhất quán
    if (result.success) {
      return {
        success: true,
        data: result.data || {
          overview: {
            totalInteractions: 0,
            totalSuccess: 0,
            totalErrors: 0,
            avgResponseTime: 0,
            successRate: 0,
            errorRate: 0
          },
          performance: {
            avgResponseTime: 0,
            fastestResponse: 0,
            slowestResponse: 0,
            responseTimeDistribution: {
              fast: 0,
              normal: 0,
              slow: 0
            }
          },
          byEndpoint: [],
          byStatus: [],
          byTime: [],
          contentAnalysis: {
            totalVocabularyGenerated: 0,
            totalExercisesGenerated: 0,
            totalWordsAnalyzed: 0,
            totalPronunciationAnalyzed: 0
          },
          timeAnalysis: {
            peakHours: [],
            dailyTrends: [],
            weeklyPatterns: []
          },
          filters: {
            applied: {},
            dateRange: {}
          },
          lastUpdated: new Date().toISOString()
        }
      };
    } else {
      throw new Error(result.message || 'Lỗi khi lấy thống kê AI interactions');
    }
  } catch (error) {
    console.error('Lỗi khi lấy thống kê AI interactions:', error);
    throw error;
  }
};

// API để lấy dữ liệu chi tiết của một AI interaction
export const getFullAIInteraction = async (id: string) => {
  try {
    // Sửa URL để khớp với backend route /full/:id
    const response = await fetch(`${createApiUrl('/ai-interactions/full')}/${id}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.data || null
      };
    } else {
      throw new Error(result.message || 'Lỗi khi lấy dữ liệu chi tiết AI interaction');
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu chi tiết AI interaction:', error);
    throw error;
  }
};

