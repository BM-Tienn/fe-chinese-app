// Cấu hình API
export const API_CONFIG = {
    // Backend base URL - sử dụng port 3001
    BACKEND_BASE_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001',

    // API endpoints
    ENDPOINTS: {
        AI_INTERACTIONS: {
            ANALYZE_IMAGE: '/api/ai-interactions/analyze-image',
            GENERATE_EXERCISES: '/api/ai-interactions/generate-exercises',
            ANALYZE_WORD_DETAILS: '/api/ai-interactions/analyze-word-details',
            ANALYZE_PRONUNCIATION: '/api/ai-interactions/analyze-pronunciation',
        },
        SESSIONS: '/api/sessions',
        USERS: {
            VERIFY: '/api/users/verify',
            LOGIN: '/api/users/login',
            SESSION: '/api/users/session',
        },
        FRONTEND_ACTIVITIES: '/api/frontend-activities',
    },

    // Timeout
    TIMEOUT: 30000,

    // Headers
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
    },
};

// Helper function để tạo full URL
export const createApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BACKEND_BASE_URL}${endpoint}`;
};
