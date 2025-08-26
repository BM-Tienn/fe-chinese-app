import React, { useCallback, useEffect, useState } from 'react';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { DashboardSection } from './components/dashboard/DashboardSection';
import { Footer } from './components/layout/Footer';
import { Header } from './components/layout/Header';
import { LoginModal } from './components/modals/LoginModal';
import { PronunciationPracticeModal } from './components/modals/PronunciationPracticeModal';
import { WordDetailModal } from './components/modals/WordDetailModal';
import { AnalysisSection } from './components/sections/AnalysisSection';
import { ExercisesSection } from './components/sections/ExercisesSection';
import { HistorySection } from './components/sections/HistorySection';
import { ImageUploadSection } from './components/sections/ImageUploadSection';
import { VocabularyManager } from './components/vocabulary/VocabularyManager';
import { analyzeWordDetails } from './services/apiService';
import { sessionManager } from './services/sessionManager';
import { useAppDispatch, useAppSelector } from './store/hooks';
import {
  Vocabulary,
  analyzeImage,
  clearAnalysis,
  setImage,
} from './store/slices/analysisSlice';
import {
  clearExercises,
  generateExercises,
  setShowResults,
  setUserAnswer,
} from './store/slices/exercisesSlice';
import { addHistoryItem } from './store/slices/historySlice';
import {
  setSelectedWord,
  setWordDetails,
  setWordToPractice
} from './store/slices/uiSlice';
import {
  getUserBySession,
  loginUser,
  setShowLoginModal,
} from './store/slices/userSlice';

export default function App() {
  const dispatch = useAppDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'vocabulary' | 'history'>('home');

  // User state
  const {
    isAuthenticated,
    showLoginModal,
    loading: userLoading,
  } = useAppSelector(state => state.user);

  // Redux selectors
  const {
    image,
    imageBase64,
    analysis,
    loading: loadingAnalysis,
    error: analysisError,
  } = useAppSelector(state => state.analysis);
  const {
    exercises,
    userAnswers,
    showResults,
    loading: loadingExercises,
  } = useAppSelector(state => state.exercises);
  const { selectedWord, wordDetails, loadingWordDetails, wordToPractice } =
    useAppSelector(state => state.ui);

  // Khởi tạo app khi component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsInitializing(true);

        // 1. Kiểm tra base64 email trong localStorage
        const base64Email = localStorage.getItem('chinese_ai_email_base64');
        const savedUserId = localStorage.getItem('chinese_ai_user_id');
        const savedSessionId = localStorage.getItem('chinese_ai_session_id');

        if (base64Email && savedUserId && savedUserId !== 'anonymous' && savedSessionId) {
          // Có thông tin đăng nhập, thử khôi phục session
          try {
            await dispatch(getUserBySession(savedSessionId)).unwrap();
            console.log('Đã khôi phục user session:', savedSessionId);
          } catch (error) {
            console.log('User session đã hết hạn, yêu cầu đăng nhập lại');
            localStorage.removeItem('chinese_ai_session_id');
            localStorage.removeItem('chinese_ai_user_id');
            // Giữ lại base64 email để user có thể đăng nhập lại
            dispatch(setShowLoginModal(true));
          }
        } else if (base64Email) {
          // Có base64 email nhưng không có session, hiển thị login modal
          console.log('Có email nhưng không có session, hiển thị login modal');
          dispatch(setShowLoginModal(true));
        } else {
          // Không có thông tin đăng nhập, hiển thị login modal
          console.log('Không có thông tin đăng nhập, hiển thị login modal');
          dispatch(setShowLoginModal(true));
        }
      } catch (error) {
        console.error('Lỗi khi khởi tạo app:', error);
        dispatch(setShowLoginModal(true));
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  // Login handler
  const handleLogin = useCallback(
    async (email: string, displayName?: string) => {
      try {
        // 1. Lưu base64 email vào localStorage
        const base64Email = btoa(email);
        localStorage.setItem('chinese_ai_email_base64', base64Email);

        // 2. Gọi backend để tạo mới hoặc update user
        const result = await dispatch(
          loginUser({ email, displayName })
        ).unwrap();

        // 3. Cập nhật sessionManager với thông tin user mới
        sessionManager.updateSessionAfterLogin(result.session.sessionId, result.user.id);

        // 4. Lưu hoạt động đầu tiên
        try {
          await sessionManager.trackActivity(
            'page_view',
            '/',
            'App',
            { action: 'user_login', userEmail: email }
          );
        } catch (error) {
          console.warn('Không thể lưu hoạt động đăng nhập:', error);
        }

        console.log('Đăng nhập thành công:', result.user.email);
      } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Handlers
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        dispatch(clearAnalysis());
        dispatch(clearExercises());

        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64String = result.replace(
            /^data:image\/(png|jpeg|jpg);base64,/,
            ''
          );
          dispatch(setImage({ image: result, imageBase64: base64String }));
        };
        reader.readAsDataURL(file);
      }
    },
    [dispatch]
  );

  const handleAnalyzeImage = useCallback(async () => {
    if (!imageBase64) return;

    // Lưu hoạt động
    try {
      await sessionManager.trackActivity(
        'button_click',
        '/',
        'AnalyzeButton',
        { action: 'analyze_image' }
      );
    } catch (error) {
      console.error('Lỗi khi lưu hoạt động:', error);
    }

    dispatch(analyzeImage(imageBase64));
  }, [imageBase64, dispatch]);

  const handleGenerateAllExercises = useCallback(() => {
    if (!analysis?.vocabulary) return;

    // Lưu hoạt động
    try {
      sessionManager.trackActivity(
        'button_click',
        '/',
        'GenerateExercisesButton',
        {
          action: 'generate_all_exercises',
          vocabularyCount: analysis.vocabulary.length,
        }
      );
    } catch (error) {
      console.error('Lỗi khi lưu hoạt động:', error);
    }

    const vocabularyList = analysis.vocabulary
      .map(v => `${v.hanzi} (${v.pinyin}): ${v.meaning}`)
      .join(', ');
    const prompt = `Dựa trên từ vựng: ${vocabularyList}. Hãy tạo 3 loại bài tập: 3 câu trắc nghiệm (dịch Việt-Trung), 3 câu điền vào chỗ trống, 2 câu dịch (1 Việt-Trung, 1 Trung-Việt). Trả lời bằng tiếng Việt, định dạng JSON: {"multipleChoice": [{"question": "...", "options": ["..."], "answer": "..."}], "fillInTheBlank": [{"sentence": "...", "answer": "..."}], "translation": [{"prompt": "...", "direction": "...", "answer": "..."}]}`;

    dispatch(generateExercises(prompt));
  }, [analysis, dispatch]);

  const handleGenerateSingleWordExercises = useCallback(
    (word: any) => {
      dispatch(setSelectedWord(null));

      // Lưu hoạt động
      try {
        sessionManager.trackActivity(
          'button_click',
          '/',
          'GenerateSingleWordExercisesButton',
          { action: 'generate_single_word_exercises', word: word.hanzi }
        );
      } catch (error) {
        console.error('Lỗi khi lưu hoạt động:', error);
      }

      const prompt = `Bạn là giáo viên tiếng Trung chuyên nghiệp. Dựa vào từ vựng "${word.hanzi}" (pinyin: ${word.pinyin}, nghĩa: ${word.meaning}), hãy tạo 4 bài tập đa dạng, đảm bảo chuẩn ngữ pháp và ngữ nghĩa để kiểm tra hiểu biết sâu về từ này. 1. **Trắc nghiệm dịch nghĩa (multipleChoice):** 1 câu hỏi, cho nghĩa tiếng Việt và 4 lựa chọn chữ Hán. 2. **Chọn Pinyin Đúng (selectPinyin):** 1 câu hỏi, cho chữ Hán và 4 lựa chọn pinyin (1 đúng, 3 sai). 3. **Tìm lỗi sai (findTheMistake):** 1 câu tiếng Trung dùng sai từ "${word.hanzi}", yêu cầu người học tìm lỗi. 4. **Tạo câu (sentenceBuilding):** 1 yêu cầu người dùng viết một câu hoàn chỉnh sử dụng từ "${word.hanzi}". Trả lời bằng tiếng Việt, định dạng JSON: {"multipleChoice": [{"question": "Từ nào sau đây có nghĩa là '${word.meaning}'?", "options": ["..."], "answer": "${word.hanzi}"}], "selectPinyin": [{"question": "Chọn pinyin đúng cho chữ Hán '${word.hanzi}':", "options": ["..."], "answer": "${word.pinyin}"}], "findTheMistake": [{"question": "Tìm và sửa lỗi sai trong câu sau:", "sentence": "...", "correctSentence": "..."}], "sentenceBuilding": [{"prompt": "Hãy dùng từ '${word.hanzi}' để viết một câu hoàn chỉnh.", "suggestedAnswer": "..."}]}`;

      dispatch(generateExercises(prompt));
    },
    [dispatch]
  );

  const fetchWordDetails = async (word: Vocabulary) => {
    const startTime = Date.now();
    try {
      const session = await sessionManager.initializeSession();
      const payload = {
        contents: [{ parts: [{ text: `Phân tích chi tiết từ vựng "${word.hanzi}" (${word.pinyin}) - ${word.meaning}. Hãy cung cấp thông tin chi tiết về từ này bao gồm: nghĩa mở rộng, cách sử dụng, ví dụ câu, từ liên quan, và ngữ pháp liên quan. Trả về kết quả dưới dạng JSON.` }] }]
      };

      const result = await analyzeWordDetails(payload);
      dispatch(setWordDetails(result));

      // Thêm vào lịch sử
      dispatch(addHistoryItem({
        sessionId: session.sessionId,
        userId: session.userId,
        endpoint: 'analyzeWordDetails',
        aiModel: 'gemini-2.5-flash-preview-05-20',
        requestPayload: { word: word.hanzi },
        responseData: result,
        requestTimestamp: new Date().toISOString(),
        responseTimestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        status: 'success',
        tags: ['word-analysis', 'vocabulary'],
      }));
    } catch (err) {
      console.error('Lỗi khi phân tích chi tiết từ:', err);

      try {
        const session = await sessionManager.initializeSession();
        // Thêm vào lịch sử với trạng thái thất bại
        dispatch(addHistoryItem({
          sessionId: session.sessionId,
          userId: session.userId,
          endpoint: 'analyzeWordDetails',
          aiModel: 'gemini-2.5-flash-preview-05-20',
          requestPayload: { word: word.hanzi },
          responseData: { error: err instanceof Error ? err.message : 'Lỗi không xác định' },
          requestTimestamp: new Date().toISOString(),
          responseTimestamp: new Date().toISOString(),
          responseTime: Date.now() - startTime,
          status: 'error',
          errorMessage: err instanceof Error ? err.message : 'Lỗi không xác định',
          tags: ['word-analysis', 'error'],
        }));
      } catch (historyError) {
        console.error('Lỗi khi thêm vào lịch sử:', historyError);
      }
    }
  };

  const handleWordClick = useCallback(
    (word: any) => {
      dispatch(setSelectedWord(word));
      fetchWordDetails(word);
    },
    [dispatch, fetchWordDetails]
  );

  const handleSpeak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Trình duyệt của bạn không hỗ trợ chức năng phát âm.');
    }
  }, []);

  const handleAnswerChange = useCallback(
    (key: string, value: string) => {
      dispatch(setUserAnswer({ key, value }));
    },
    [dispatch]
  );

  const checkAnswers = useCallback(() => {
    dispatch(setShowResults(true));
  }, [dispatch]);

  // Hiển thị loading khi đang khởi tạo
  if (isInitializing) {
    return (
      <div className='bg-gray-50 min-h-screen font-sans text-gray-800 flex items-center justify-center'>
        <div className='text-center'>
          <LoadingSpinner />
          <p className='mt-4 text-gray-600'>Đang khởi tạo ứng dụng...</p>
        </div>
      </div>
    );
  }

  // Hiển thị loading khi đang đăng nhập
  if (userLoading) {
    return (
      <div className='bg-gray-50 min-h-screen font-sans text-gray-800 flex items-center justify-center'>
        <div className='text-center'>
          <LoadingSpinner />
          <p className='mt-4 text-gray-600'>Đang xử lý đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => dispatch(setShowLoginModal(false))}
        onLogin={handleLogin}
        loading={userLoading}
      />

      <WordDetailModal
        word={selectedWord}
        details={wordDetails}
        isLoading={loadingWordDetails}
        onClose={() => dispatch(setSelectedWord(null))}
        onSpeak={handleSpeak}
        onGenerateSingleWordExercises={handleGenerateSingleWordExercises}
      />

      {wordToPractice && (
        <PronunciationPracticeModal
          word={wordToPractice}
          onClose={() => dispatch(setWordToPractice(null))}
        />
      )}

      {isAuthenticated ? (
        <div className='bg-gray-50 min-h-screen font-sans text-gray-800'>
          <div className='container mx-auto p-4 md:p-8'>
            <Header />

            {/* Navigation Tabs */}
            <div className='mb-8'>
              <div className='flex flex-wrap gap-2 border-b border-gray-200'>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${activeTab === 'home'
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  🏠 Trang chủ
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${activeTab === 'dashboard'
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('vocabulary')}
                  className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${activeTab === 'vocabulary'
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  📚 Từ vựng
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${activeTab === 'history'
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  📜 Lịch sử
                </button>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'home' && (
              <div className='max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg'>
                <ImageUploadSection
                  image={image}
                  onImageChange={handleImageChange}
                  onAnalyze={handleAnalyzeImage}
                  loading={loadingAnalysis}
                  error={analysisError}
                />

                {analysisError && (
                  <p className='text-center text-red-500 my-4'>{analysisError}</p>
                )}

                {analysis && (
                  <AnalysisSection
                    analysis={analysis}
                    onWordClick={handleWordClick}
                    onSpeak={handleSpeak}
                    onPracticePronunciation={word =>
                      dispatch(setWordToPractice(word))
                    }
                    onGenerateExercises={handleGenerateAllExercises}
                    loading={loadingExercises}
                  />
                )}

                {loadingExercises && <LoadingSpinner />}

                {exercises && (
                  <ExercisesSection
                    exercises={exercises}
                    userAnswers={userAnswers}
                    showResults={showResults}
                    onAnswerChange={handleAnswerChange}
                    onCheckAnswers={checkAnswers}
                  />
                )}
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className='max-w-6xl mx-auto'>
                <DashboardSection />
              </div>
            )}

            {activeTab === 'vocabulary' && (
              <div className='max-w-6xl mx-auto'>
                <VocabularyManager />
              </div>
            )}

            {activeTab === 'history' && (
              <div className='max-w-6xl mx-auto'>
                <HistorySection />
              </div>
            )}

            <Footer />
          </div>
        </div>
      ) : showLoginModal ? (
        // Hiển thị modal đăng nhập
        <div className='bg-gray-50 min-h-screen font-sans text-gray-800 flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-blue-600 mb-4'>
              Học Tiếng Trung cùng AI
            </h1>
            <p className='text-gray-600 text-lg mb-6'>
              Vui lòng đăng nhập để bắt đầu học
            </p>
          </div>
        </div>
      ) : (
        // Hiển thị màn hình chào mừng với nút đăng nhập
        <div className='bg-gray-50 min-h-screen font-sans text-gray-800 flex items-center justify-center'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-blue-600 mb-4'>
              Học Tiếng Trung cùng AI
            </h1>
            <p className='text-gray-600 text-lg mb-6'>
              Chào mừng bạn đến với ứng dụng học tiếng Trung thông minh
            </p>
            <button
              onClick={() => dispatch(setShowLoginModal(true))}
              className='inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105'
            >
              Bắt đầu học ngay
            </button>
          </div>
        </div>
      )}
    </>
  );
}
