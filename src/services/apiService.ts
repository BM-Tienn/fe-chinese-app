import { API_CONFIG, createApiUrl } from '../config/api';
import { sessionManager } from './sessionManager';

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

    // Tạo payload giống hệt App.tsx gốc
    const prompt = `Bạn là một giáo viên dạy tiếng Trung. Hãy phân tích hình ảnh này. Trả lời bằng tiếng Việt, định dạng JSON: {"lessonRequest": "...", "vocabulary": [{"hanzi": "...", "pinyin": "...", "meaning": "..."}], "grammar": [{"point": "...", "explanation": "...", "example": "..."}], "exampleParagraph": "..."}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
          ],
        },
      ],
      generationConfig: { responseMimeType: 'application/json' },
    };

    // Gọi backend API
    const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.AI_INTERACTIONS.ANALYZE_IMAGE), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload,
        sessionId: session.sessionId,
        metadata: {
          source: 'frontend',
          timestamp: new Date().toISOString(),
          expectedWordCount: 40,
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

    // Cải thiện thông báo lỗi
    if (error instanceof Error) {
      throw new Error(`Lỗi khi phân tích hình ảnh: ${error.message}`);
    } else if (typeof error === 'string') {
      throw new Error(`Lỗi khi phân tích hình ảnh: ${error}`);
    } else {
      throw new Error('Lỗi không xác định khi phân tích hình ảnh');
    }
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
    const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.AI_INTERACTIONS.GENERATE_EXERCISES), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload,
        sessionId: session.sessionId,
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
    const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.AI_INTERACTIONS.ANALYZE_WORD_DETAILS), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload,
        sessionId: session.sessionId,
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
    const response = await fetch(createApiUrl(API_CONFIG.ENDPOINTS.AI_INTERACTIONS.ANALYZE_PRONUNCIATION), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload,
        sessionId: session.sessionId,
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

// Export default object để tương thích với các slice
export const apiService = {
  analyzeImage,
  generateExercises,
  analyzeWordDetails,
  analyzePronunciation,
};

// Export sessionManager để sử dụng trong components
export { sessionManager };

