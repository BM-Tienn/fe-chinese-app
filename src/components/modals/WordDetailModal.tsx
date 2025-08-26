import React from 'react';
import { Vocabulary } from '../../store/slices/analysisSlice';
import { LoadingSpinner } from '../common/LoadingSpinner';
import {
  CloseIcon,
  ExerciseIcon,
  InfoIcon,
  LightbulbIcon,
  LinkIcon,
  QuoteIcon,
  SpeakerIcon,
} from '../icons';

interface WordDetailModalProps {
  word: Vocabulary | null;
  details: any | null;
  isLoading: boolean;
  onClose: () => void;
  onSpeak: (text: string) => void;
  onGenerateSingleWordExercises: (word: Vocabulary) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  details,
  isLoading,
  onClose,
  onSpeak,
  onGenerateSingleWordExercises,
}) => {
  if (!word) return null;

  const Section: React.FC<{
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
  }> = ({ icon, title, children }) => (
    <div className='bg-gray-50 p-4 rounded-lg'>
      <h3 className='flex items-center text-lg font-semibold text-gray-800 mb-2'>
        <span className='text-blue-500 mr-2'>{icon}</span>
        {title}
      </h3>
      <div className='pl-7 text-gray-600 space-y-2'>{children}</div>
    </div>
  );

  const RelatedWords: React.FC<{ title: string; words: string[] }> = ({
    title,
    words,
  }) => {
    if (!words || words.length === 0) return null;
    return (
      <div>
        <strong className='font-medium text-gray-700'>{title}:</strong>
        <span className='ml-2'>
          {words.map((w, i) => (
            <span
              key={i}
              className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'
            >
              {w}
            </span>
          ))}
        </span>
      </div>
    );
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in-fast'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]'
        onClick={e => e.stopPropagation()}
      >
        <div className='sticky top-0 bg-white/80 backdrop-blur-sm p-6 border-b z-10'>
          <div className='flex justify-between items-start'>
            <div>
              <h2 className='text-4xl font-bold text-blue-600'>
                {details?.word || word.hanzi}
              </h2>
              <p className='text-lg text-gray-500'>
                {details?.pinyin || word.pinyin}
              </p>
              <p className='text-lg text-gray-800 font-semibold'>
                {details?.meaning || word.meaning}
              </p>
            </div>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100'
            >
              <CloseIcon />
            </button>
          </div>
          {details && (
            <div className='flex items-center gap-2 mt-3'>
              <span className='bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full'>
                {details.wordType}
              </span>
              <span className='bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full'>
                {details.popularity}
              </span>
            </div>
          )}
        </div>

        <div className='overflow-y-auto p-6'>
          {isLoading ? (
            <LoadingSpinner text='AI đang phân tích từ...' />
          ) : details ? (
            <div className='space-y-4 text-left'>
              <Section icon={<InfoIcon />} title='Phân tích chi tiết'>
                {details.analysis?.etymology && (
                  <div className='mb-3'>
                    <strong className='font-medium text-gray-700'>Từ nguyên:</strong>
                    <p className='mt-1'>{details.analysis.etymology}</p>
                  </div>
                )}
                {details.analysis?.coreMeanings && (
                  <div className='mb-3'>
                    <strong className='font-medium text-gray-700'>Nghĩa cốt lõi:</strong>
                    {details.analysis.coreMeanings.map((meaning: any, index: number) => (
                      <div key={index} className='mt-2'>
                        <p className='font-medium text-gray-600'>{meaning.type}:</p>
                        <ul className='list-disc list-inside ml-4 space-y-1'>
                          {meaning.senses.map((sense: string, senseIndex: number) => (
                            <li key={senseIndex} className='text-sm'>{sense}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
                {details.analysis?.grammaticalNotes && (
                  <div>
                    <strong className='font-medium text-gray-700'>Ghi chú ngữ pháp:</strong>
                    <p className='mt-1'>{details.analysis.grammaticalNotes}</p>
                  </div>
                )}
              </Section>

              <Section icon={<LightbulbIcon />} title='Cách dùng & Ngữ cảnh'>
                <p>{details.usage}</p>
                <p className='italic'>
                  <strong className='font-medium'>Ngữ cảnh:</strong>{' '}
                  {details.context}
                </p>
              </Section>

              <Section icon={<LinkIcon />} title='Từ liên quan'>
                <RelatedWords title='Đồng nghĩa' words={details.synonyms} />
                <RelatedWords title='Trái nghĩa' words={details.antonyms} />
                <RelatedWords title='Đồng âm' words={details.homophones} />
              </Section>

              <Section icon={<QuoteIcon />} title='Ví dụ thực tế'>
                <ul className='space-y-4'>
                  {details.examples?.map((ex: any, i: number) => (
                    <li
                      key={i}
                      className='border-l-4 border-blue-200 pl-4 py-1'
                    >
                      <div className='flex items-center justify-between'>
                        <p className='text-lg font-medium text-gray-800'>
                          {ex.sentence}
                        </p>
                        <button
                          onClick={() => onSpeak(ex.sentence)}
                          className='text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100'
                        >
                          <SpeakerIcon className='h-6 w-6' />
                        </button>
                      </div>
                      <p className='text-sm text-gray-500'>{ex.pinyin}</p>
                      <p className='text-sm text-gray-500 italic'>
                        "{ex.translation}"
                      </p>
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          ) : (
            <p className='text-center text-red-500 p-8'>
              Không thể tải chi tiết từ vựng. Vui lòng thử lại.
            </p>
          )}
        </div>

        <div className='sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 mt-auto border-t text-center'>
          <button
            onClick={() => onGenerateSingleWordExercises(word)}
            className='inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105'
          >
            <ExerciseIcon />
            Tạo bài tập cho từ này
          </button>
        </div>
      </div>
    </div>
  );
};
