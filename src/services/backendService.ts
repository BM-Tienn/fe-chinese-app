import axios from 'axios';
import { ENV_CONFIG } from '../config/api';

// Cấu hình backend API
const BACKEND_CONFIG = {
  BASE_URL: ENV_CONFIG.BACKEND_URL,
  API_TIMEOUT: ENV_CONFIG.API_TIMEOUT,
};

// Tạo instance axios cho backend API
const backendClient = axios.create({
  baseURL: BACKEND_CONFIG.BASE_URL,
  timeout: BACKEND_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để xử lý response
backendClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('Backend API Error:', error);

    // Xử lý các loại lỗi khác nhau
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        'Không thể kết nối đến backend. Vui lòng kiểm tra xem backend có đang chạy không.'
      );
    }

    if (error.code === 'NETWORK_ERROR') {
      throw new Error('Lỗi mạng. Vui lòng kiểm tra kết nối internet.');
    }

    if (error.response?.status === 404) {
      throw new Error('API endpoint không tồn tại.');
    }

    if (error.response?.status === 500) {
      throw new Error('Lỗi server. Vui lòng thử lại sau.');
    }

    if (error.response?.status === 429) {
      throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau.');
    }

    throw new Error(
      error.response?.data?.message ||
      'Đã có lỗi xảy ra khi kết nối với backend'
    );
  }
);

// Helper function để extract data từ backend response
export const extractBackendData = (response: any) => {
  console.log('Backend response:', response);

  // Backend response structure:
  // { success: true, data: result.data, responseTime, aiModel, interactionId }
  if (response && response.success && response.data) {
    return response.data;
  }

  // Nếu response không có success hoặc data, có thể là error response
  if (response && response.message) {
    throw new Error(response.message);
  }

  // Kiểm tra nếu response có error
  if (response && response.error) {
    throw new Error(response.error);
  }

  // Kiểm tra nếu response có status và không phải success
  if (response && response.status && response.status !== 'success') {
    throw new Error(response.message || 'Backend trả về trạng thái lỗi');
  }

  throw new Error('Backend response không hợp lệ hoặc thiếu dữ liệu');
};

// User Management
export const userService = {
  // Verify user theo email
  verifyUser: async (data: { email: string }) => {
    return await backendClient.post('/api/users/verify', data);
  },

  // Đăng nhập hoặc tạo user mới
  loginOrCreateUser: async (data: { email: string; displayName?: string }) => {
    return await backendClient.post('/api/users/login', data);
  },

  // Lấy thông tin user theo session
  getUserBySession: async (sessionId: string) => {
    return await backendClient.get(`/api/users/session/${sessionId}`);
  },

  // Cập nhật thông tin user
  updateUser: async (
    sessionId: string,
    data: {
      displayName?: string;
      preferences?: any;
    }
  ) => {
    return await backendClient.patch(`/api/users/session/${sessionId}`, data);
  },
};

// Session Management
export const sessionService = {
  // Tạo phiên mới
  createSession: async (data: {
    userId?: string;
    userAgent?: string;
    ipAddress?: string;
    deviceInfo?: any;
    metadata?: any;
  }) => {
    return await backendClient.post('/api/sessions', data);
  },

  // Lấy thông tin phiên
  getSession: async (sessionId: string) => {
    return await backendClient.get(`/api/sessions/${sessionId}`);
  },

  // Cập nhật hoạt động phiên
  updateSessionActivity: async (sessionId: string) => {
    return await backendClient.patch(`/api/sessions/${sessionId}/activity`);
  },

  // Kết thúc phiên
  endSession: async (sessionId: string) => {
    return await backendClient.patch(`/api/sessions/${sessionId}/end`);
  },
};

// Frontend Activity Tracking
export const activityService = {
  // Lưu hoạt động frontend
  saveActivity: async (data: {
    sessionId: string;
    userId?: string;
    action:
    | 'page_view'
    | 'button_click'
    | 'form_submit'
    | 'navigation'
    | 'error'
    | 'other';
    page: string;
    component?: string;
    details?: any;
    userAgent?: string;
    ipAddress?: string;
    metadata?: any;
  }) => {
    return await backendClient.post('/api/frontend-activities', data);
  },

  // Lấy hoạt động theo session
  getActivitiesBySession: async (
    sessionId: string,
    params?: {
      page?: number;
      limit?: number;
      sort?: string;
      action?: string;
    }
  ) => {
    return await backendClient.get(
      `/api/frontend-activities/session/${sessionId}`,
      { params }
    );
  },

  // Lấy thống kê hoạt động
  getActivityStats: async (params?: {
    sessionId?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    action?: string;
    page?: string;
  }) => {
    return await backendClient.get('/api/frontend-activities/stats', {
      params,
    });
  },
};

// AI Interaction Service - tích hợp với backend
export const aiService = {
  // Phân tích hình ảnh
  analyzeImage: async (data: {
    sessionId: string;
    userId?: string;
    payload: any;
    metadata?: any;
  }) => {
    // Lấy userId từ localStorage nếu không có trong data
    const userId = data.userId || localStorage.getItem('chinese_ai_user_id');
    return await backendClient.post('/api/ai-interactions/analyze-image', {
      ...data,
      userId,
    });
  },

  // Tạo bài tập
  generateExercises: async (data: {
    sessionId: string;
    userId?: string;
    payload: any;
    metadata?: any;
  }) => {
    // Lấy userId từ localStorage nếu không có trong data
    const userId = data.userId || localStorage.getItem('chinese_ai_user_id');
    return await backendClient.post('/api/ai-interactions/generate-exercises', {
      ...data,
      userId,
    });
  },

  // Phân tích chi tiết từ vựng
  analyzeWordDetails: async (data: {
    sessionId: string;
    userId?: string;
    payload: any;
    metadata?: any;
  }) => {
    // Lấy userId từ localStorage nếu không có trong data
    const userId = data.userId || localStorage.getItem('chinese_ai_user_id');
    return await backendClient.post(
      '/api/ai-interactions/analyze-word-details',
      {
        ...data,
        userId,
      }
    );
  },

  // Phân tích phát âm
  analyzePronunciation: async (data: {
    sessionId: string;
    userId?: string;
    payload: any;
    metadata?: any;
  }) => {
    // Lấy userId từ localStorage nếu không có trong data
    const userId = data.userId || localStorage.getItem('chinese_ai_user_id');
    return await backendClient.post(
      '/api/ai-interactions/analyze-pronunciation',
      {
        ...data,
        userId,
      }
    );
  },

  // Lưu tương tác AI tùy chỉnh
  saveInteraction: async (data: {
    sessionId: string;
    userId?: string;
    userInput: string;
    aiResponse: string;
    aiModel?: string;
    responseTime?: number;
    status?: 'success' | 'error' | 'pending';
    metadata?: any;
  }) => {
    return await backendClient.post('/api/ai-interactions', data);
  },

  // Lấy tương tác theo session
  getInteractionsBySession: async (
    sessionId: string,
    params?: {
      page?: number;
      limit?: number;
      sort?: string;
    }
  ) => {
    return await backendClient.get(
      `/api/ai-interactions/session/${sessionId}`,
      { params }
    );
  },

  // Lấy thống kê tương tác AI
  getInteractionStats: async (params?: {
    sessionId?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    return await backendClient.get('/api/ai-interactions/stats', { params });
  },
};

// Health Check
export const healthService = {
  checkHealth: async () => {
    return await backendClient.get('/health');
  },
};

// Utility functions
export const backendUtils = {
  // Tạo session và lưu hoạt động đầu tiên (anonymous - giữ lại để tương thích)
  initializeSession: async (page: string, component?: string) => {
    try {
      // Tạo phiên mới
      const sessionResponse = await sessionService.createSession({
        userId: 'anonymous',
        userAgent: navigator.userAgent,
        deviceInfo: {
          platform: navigator.platform,
          language: navigator.language,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine,
        },
      });

      const sessionData = sessionResponse.data;

      // Kiểm tra response structure
      if (!sessionData || !sessionData.success || !sessionData.data) {
        throw new Error('Backend response không hợp lệ khi tạo session');
      }

      const session = sessionData.data;

      // Kiểm tra xem session có sessionId không trước khi lưu hoạt động
      if (!session || !session.sessionId) {
        throw new Error('Không thể tạo session - thiếu sessionId');
      }

      // Lưu hoạt động đầu tiên
      try {
        await activityService.saveActivity({
          sessionId: session.sessionId,
          action: 'page_view',
          page,
          component: component || 'App',
          userAgent: navigator.userAgent,
        });
      } catch (activityError) {
        console.warn(
          'Không thể lưu hoạt động đầu tiên, nhưng session đã được tạo:',
          activityError
        );
        // Không throw error vì session đã được tạo thành công
      }

      return session;
    } catch (error) {
      console.error('Lỗi khi khởi tạo session:', error);
      throw error;
    }
  },

  // Lưu hoạt động với session hiện tại
  trackActivity: async (
    sessionId: string,
    action: string,
    page: string,
    component?: string,
    details?: any
  ) => {
    try {
      // Lấy userId từ localStorage nếu có
      const userId = localStorage.getItem('chinese_ai_user_id');

      await activityService.saveActivity({
        sessionId,
        userId: userId || undefined,
        action: action as any,
        page,
        component,
        details,
        userAgent: navigator.userAgent,
      });

      // Cập nhật hoạt động cuối cùng của session
      await sessionService.updateSessionActivity(sessionId);
    } catch (error) {
      console.error('Lỗi khi lưu hoạt động:', error);
    }
  },

  // Khởi tạo user session (thay thế cho anonymous session)
  initializeUserSession: async (email: string, displayName?: string) => {
    try {
      const response = await userService.loginOrCreateUser({
        email,
        displayName,
      });

      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi khởi tạo user session:', error);
      throw error;
    }
  },
};

const backendService = {
  userService,
  sessionService,
  activityService,
  aiService,
  healthService,
  backendUtils,
};
export default backendService;
