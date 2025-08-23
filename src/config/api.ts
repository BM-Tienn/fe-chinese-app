// Cấu hình môi trường và API tập trung
export const ENV_CONFIG = {
    // Backend Configuration
    BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
    API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),

    // App Configuration
    APP_NAME: process.env.REACT_APP_APP_NAME || 'Học Tiếng Trung cùng AI',
    APP_VERSION: process.env.REACT_APP_APP_VERSION || '3.0.0',

    // Environment
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Validation
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
};

// Validation function để kiểm tra biến môi trường bắt buộc
export const validateRequiredEnvVars = (): void => {
    const requiredVars = ['REACT_APP_BACKEND_URL'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVars.join(', ')}. ` +
            'Please check your .env file or environment configuration.'
        );
    }
};

// Cấu hình API
export const API_CONFIG = {
    // Backend base URL - sử dụng ENV_CONFIG
    BACKEND_BASE_URL: ENV_CONFIG.BACKEND_URL,

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
    TIMEOUT: ENV_CONFIG.API_TIMEOUT,

    // Headers
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
    },
};

// Helper function để tạo full URL
export const createApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BACKEND_BASE_URL}${endpoint}`;
};

// Helper function để lấy giá trị môi trường
export const getEnvVar = (key: string, defaultValue?: string): string => {
    const envKey = `REACT_APP_${key}`;
    return process.env[envKey] || defaultValue || '';
};
