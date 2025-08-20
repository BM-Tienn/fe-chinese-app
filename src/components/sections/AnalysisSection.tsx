import React from 'react';
import { Analysis, Vocabulary } from '../../store/slices/analysisSlice';
import { ExerciseIcon, LightbulbIcon, MicIcon, QuoteIcon, SpeakerIcon } from '../icons';

interface AnalysisSectionProps {
  analysis: Analysis;
  onWordClick: (word: Vocabulary) => void;
  onSpeak: (text: string) => void;
  onPracticePronunciation: (word: Vocabulary) => void;
  onGenerateExercises: () => void;
  loading: boolean;
}

export const AnalysisSection: React.FC<AnalysisSectionProps> = ({
  analysis,
  onWordClick,
  onSpeak,
  onPracticePronunciation,
  onGenerateExercises,
  loading,
}) => {
  return (
    <div className='space-y-6 mt-6 animate-fade-in'>
      <h2 className='text-2xl font-semibold text-gray-700 border-b pb-2'>
        Kết quả phân tích của AI
      </h2>

      {/* Summary Section */}
      <div className='bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border'>
        <h3 className='font-semibold text-lg text-gray-800 mb-4 text-center flex items-center justify-center'>
          <svg className='w-6 h-6 mr-2 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
          </svg>
          Tổng quan bài học
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <div className='text-3xl font-bold text-blue-600'>{analysis.vocabulary.length}</div>
            <div className='text-sm text-gray-600'>Từ vựng</div>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <div className='text-3xl font-bold text-green-600'>{analysis.grammar?.length || 0}</div>
            <div className='text-sm text-gray-600'>Điểm ngữ pháp</div>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <div className='text-3xl font-bold text-purple-600'>
              {analysis.responseTime ? `${(analysis.responseTime / 1000).toFixed(1)}s` : 'N/A'}
            </div>
            <div className='text-sm text-gray-600'>Thời gian xử lý</div>
          </div>
        </div>
      </div>

      {/* Lesson Request Section */}
      {analysis.lessonRequest && (
        <div className='bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400'>
          <h3 className='font-semibold text-lg text-blue-800 mb-3 flex items-center justify-between'>
            <span className='flex items-center'>
              <LightbulbIcon />
              <span className='ml-2'>Yêu cầu bài học</span>
            </span>
            <span className='text-sm text-blue-600 font-normal'>Mục tiêu và nội dung</span>
          </h3>
          <div className='bg-white p-4 rounded-lg border border-blue-200'>
            <p className='text-blue-700 leading-relaxed text-lg'>{analysis.lessonRequest}</p>
          </div>
        </div>
      )}

      {/* Grammar Section */}
      {analysis.grammar && analysis.grammar.length > 0 && (
        <div className='bg-green-50 p-6 rounded-lg border-l-4 border-green-400'>
          <h3 className='font-semibold text-lg text-green-800 mb-4 flex items-center justify-between'>
            <span className='flex items-center'>
              <svg className='w-5 h-5 mr-2 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 017.072 0l-.707.707M12 21v-1m-6.364-1.636l.707-.707' />
              </svg>
              Điểm ngữ pháp quan trọng ({analysis.grammar.length} điểm)
            </span>
            <span className='text-sm text-green-600 font-normal'>Cấu trúc câu và cách sử dụng</span>
          </h3>
          <div className='space-y-4'>
            {analysis.grammar.map((grammarPoint, index) => (
              <div key={index} className='bg-white p-4 rounded-lg shadow-sm'>
                <h4 className='font-semibold text-green-700 mb-2 flex items-center'>
                  <span className='bg-green-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3'>
                    {index + 1}
                  </span>
                  {grammarPoint.point}
                </h4>
                <p className='text-gray-700 mb-3 leading-relaxed'>{grammarPoint.explanation}</p>
                <div className='bg-gray-50 p-3 rounded border-l-2 border-green-300'>
                  <p className='text-sm text-gray-600 font-medium mb-1'>Ví dụ:</p>
                  <p className='text-gray-800'>{grammarPoint.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Example Paragraph Section */}
      {analysis.exampleParagraph && (
        <div className='bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400'>
          <h3 className='font-semibold text-lg text-purple-800 mb-3 flex items-center justify-between'>
            <span className='flex items-center'>
              <QuoteIcon />
              <span className='ml-2'>Đoạn văn mẫu</span>
            </span>
            <span className='text-sm text-purple-600 font-normal'>Áp dụng từ vựng và ngữ pháp</span>
          </h3>
          <div className='bg-white p-4 rounded-lg border border-purple-200'>
            <p className='text-purple-700 leading-relaxed text-lg'>{analysis.exampleParagraph}</p>
          </div>
        </div>
      )}

      {/* Vocabulary Section */}
      <div className='bg-white p-6 rounded-lg border shadow-sm'>
        <h3 className='font-semibold text-lg text-gray-700 mb-4 flex items-center justify-between'>
          <span className='flex items-center'>
            <svg className='w-5 h-5 mr-2 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
            </svg>
            Từ vựng ({analysis.vocabulary.length} từ)
          </span>
          <span className='text-sm text-gray-500 font-normal'>Click vào từ để xem chi tiết</span>
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {analysis.vocabulary.map((word, index) => (
            <div
              key={index}
              onClick={() => onWordClick(word)}
              className='bg-gray-50 p-4 rounded-lg border shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group relative'
            >
              <div className='absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center'>
                {index + 1}
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onPracticePronunciation(word);
                }}
                className='absolute top-2 right-12 p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors'
                title='Luyện phát âm'
              >
                <MicIcon className='h-5 w-5' />
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onSpeak(word.hanzi);
                }}
                className='absolute top-2 right-2 text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-blue-100'
                title='Nghe phát âm mẫu'
              >
                <SpeakerIcon />
              </button>
              <div className='pr-24 pl-8'>
                <p className='text-2xl font-bold text-gray-800 group-hover:text-blue-600'>
                  {word.hanzi}
                </p>
                <p className='text-gray-500 font-medium'>{word.pinyin}</p>
              </div>
              <p className='text-gray-700 mt-2 pl-8 text-sm leading-relaxed'>{word.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Exercises Button */}
      <div className='text-center pt-6'>
        <button
          onClick={onGenerateExercises}
          disabled={loading}
          className='inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 transition-transform transform hover:scale-105'
        >
          <ExerciseIcon />
          {loading ? 'Đang tạo...' : 'Tạo bài tập chung'}
        </button>
      </div>

      {/* Additional Info Section */}
      {(analysis.responseTime || analysis.aiModel) && (
        <div className='bg-gray-50 p-4 rounded-lg border text-center'>
          <h4 className='text-sm font-medium text-gray-600 mb-3 flex items-center justify-center'>
            <svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            Thông tin bổ sung
          </h4>
          <div className='flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600'>
            {analysis.responseTime && (
              <div className='flex items-center'>
                <span className='font-medium'>Thời gian xử lý:</span>
                <span className='ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
                  {(analysis.responseTime / 1000).toFixed(1)}s
                </span>
              </div>
            )}
            {analysis.aiModel && (
              <div className='flex items-center'>
                <span className='font-medium'>AI Model:</span>
                <span className='ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full'>
                  {analysis.aiModel}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
