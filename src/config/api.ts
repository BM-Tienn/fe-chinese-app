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

// Cấu hình API cho backend mới
export const API_CONFIG = {
    BASE_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001',
    PREFIX_URL: process.env.REACT_APP_BACKEND_PREFIX_URL || '/api',
    TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
};

// Các endpoint cho backend mới
export const ENDPOINTS = {
    // Personal Vocabulary
    PERSONAL_VOCABULARY: '/personal-vocabulary',
    PERSONAL_VOCABULARY_REVIEW: '/personal-vocabulary/review/words',
    PERSONAL_VOCABULARY_NEW: '/personal-vocabulary/new/words',
    PERSONAL_VOCABULARY_STATS: '/personal-vocabulary/stats',

    // User Progress
    USER_PROGRESS: '/user-progress',
    USER_PROGRESS_WEEKLY: '/user-progress/weekly',
    USER_PROGRESS_DAILY: '/user-progress/daily',
    USER_PROGRESS_ACHIEVEMENTS: '/user-progress/achievements',
    USER_PROGRESS_EXPERIENCE: '/user-progress/experience',
    USER_PROGRESS_STREAK: '/user-progress/streak',
    USER_PROGRESS_CHECK_ACHIEVEMENTS: '/user-progress/check-achievements',
    USER_PROGRESS_OVERALL_STATS: '/user-progress/overall-stats',
    USER_PROGRESS_VOCABULARY_STATS: '/user-progress/vocabulary-stats',

    // AI Interactions
    AI_INTERACTIONS_ANALYZE_IMAGE: '/ai-interactions/analyze-image',
    AI_INTERACTIONS_GENERATE_EXERCISES: '/ai-interactions/generate-exercises',
    AI_INTERACTIONS_ANALYZE_WORD: '/ai-interactions/analyze-word-details',
    AI_INTERACTIONS_ANALYZE_PRONUNCIATION: '/ai-interactions/analyze-pronunciation',
    AI_INTERACTIONS_HISTORY: '/ai-interactions/history',
    AI_INTERACTIONS_STATS: '/ai-interactions/stats',

    // Auto Task Management
    AUTO_TASK_STATUS: '/auto-task/status',
    AUTO_TASK_HISTORY: '/auto-task/history',
    AUTO_TASK_ANALYTICS: '/auto-task/analytics',
    AUTO_TASK_RERUN: '/auto-task/rerun',
    AUTO_TASK_CLEANUP: '/auto-task/cleanup',

    // Users & Sessions
    USERS_LOGIN: '/users/login',
    USERS_VERIFY: '/users/verify',
    SESSIONS: '/sessions',

    // Frontend Activities
    FRONTEND_ACTIVITIES: '/frontend-activities',
};

// Helper function để tạo full URL
export const createApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.PREFIX_URL}${endpoint}`;
};

// Helper function để lấy giá trị môi trường
export const getEnvVar = (key: string, defaultValue?: string): string => {
    const envKey = `REACT_APP_${key}`;
    return process.env[envKey] || defaultValue || '';
};
