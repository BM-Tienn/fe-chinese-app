import React from 'react';
import { Exercises } from '../../store/slices/exercisesSlice';

interface ExercisesSectionProps {
  exercises: Exercises;
  userAnswers: Record<string, string>;
  showResults: boolean;
  onAnswerChange: (key: string, value: string) => void;
  onCheckAnswers: () => void;
}

export const ExercisesSection: React.FC<ExercisesSectionProps> = ({
  exercises,
  userAnswers,
  showResults,
  onAnswerChange,
  onCheckAnswers,
}) => {
  let exerciseCounter = 0;

  const renderExercise = (key: string, q: any, index: number) => {
    const prefixMap: Record<string, string> = {
      multipleChoice: 'mc',
      selectPinyin: 'sp',
      findTheMistake: 'ftm',
      fillInTheBlank: 'fib',
      sentenceBuilding: 'sb',
      translation: 'trans',
    };
    const prefix = prefixMap[key];
    const answerKey = `${prefix}_${index}`;

    switch (key) {
      case 'multipleChoice':
      case 'selectPinyin':
        return (
          <div key={answerKey} className='mb-5 p-4 bg-gray-50 rounded-lg'>
            <p className='font-medium mb-2'>{q.question}</p>
            <div className='space-y-2'>
              {q.options?.map((option: string, i: number) => (
                <label
                  key={i}
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    showResults
                      ? option === q.answer
                        ? 'bg-green-200'
                        : userAnswers[answerKey] === option
                          ? 'bg-red-200'
                          : ''
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <input
                    type='radio'
                    name={answerKey}
                    value={option}
                    checked={userAnswers[answerKey] === option}
                    onChange={e => onAnswerChange(answerKey, e.target.value)}
                    disabled={showResults}
                    className='h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500'
                  />
                  <span className='ml-3 text-gray-700'>{option}</span>
                </label>
              ))}
            </div>
            {showResults && userAnswers[answerKey] !== q.answer && (
              <p className='text-sm text-green-700 mt-2'>
                Đáp án đúng: {q.answer}
              </p>
            )}
          </div>
        );

      case 'findTheMistake':
        return (
          <div key={answerKey} className='mb-4 p-4 bg-gray-50 rounded-lg'>
            <p className='mb-2'>{q.question}</p>
            <p className='mb-2 italic text-red-600'>"{q.sentence}"</p>
            <textarea
              value={userAnswers[answerKey] || ''}
              onChange={e => onAnswerChange(answerKey, e.target.value)}
              rows={2}
              placeholder='Viết lại câu đúng vào đây...'
              className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              disabled={showResults}
            />
            {showResults && (
              <p className='text-sm text-green-700 mt-2'>
                Câu đúng: {q.correctSentence}
              </p>
            )}
          </div>
        );

      case 'fillInTheBlank':
        return (
          <div key={answerKey} className='mb-4 p-4 bg-gray-50 rounded-lg'>
            <p className='mb-2'>{q.sentence.replace('___', '______')}</p>
            <input
              type='text'
              value={userAnswers[answerKey] || ''}
              onChange={e => onAnswerChange(answerKey, e.target.value)}
              className={`mt-1 block w-full md:w-1/2 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                showResults
                  ? userAnswers[answerKey] === q.answer
                    ? 'border-green-500'
                    : 'border-red-500'
                  : 'border-gray-300'
              }`}
              disabled={showResults}
            />
            {showResults && userAnswers[answerKey] !== q.answer && (
              <p className='text-sm text-green-700 mt-2'>
                Đáp án đúng: {q.answer}
              </p>
            )}
          </div>
        );

      case 'sentenceBuilding':
        return (
          <div key={answerKey} className='mb-4 p-4 bg-gray-50 rounded-lg'>
            <p className='mb-2'>{q.prompt}</p>
            <textarea
              value={userAnswers[answerKey] || ''}
              onChange={e => onAnswerChange(answerKey, e.target.value)}
              rows={3}
              className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              disabled={showResults}
            />
            {showResults && (
              <p className='text-sm text-green-700 mt-2'>
                Câu gợi ý: {q.suggestedAnswer}
              </p>
            )}
          </div>
        );

      case 'translation':
        return (
          <div key={answerKey} className='mb-4 p-4 bg-gray-50 rounded-lg'>
            <p className='mb-2'>
              Dịch câu sau ({q.direction}): "{q.prompt}"
            </p>
            <textarea
              value={userAnswers[answerKey] || ''}
              onChange={e => onAnswerChange(answerKey, e.target.value)}
              rows={2}
              className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
              disabled={showResults}
            />
            {showResults && (
              <p className='text-sm text-green-700 mt-2'>
                Gợi ý đáp án: {q.answer}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='mt-8 pt-6 border-t animate-fade-in'>
      <h2 className='text-2xl font-semibold text-gray-700 mb-6'>
        Bài tập luyện tập
      </h2>

      {Object.keys(exercises).map(key => {
        if (
          !Array.isArray(exercises[key as keyof Exercises]) ||
          !exercises[key as keyof Exercises]?.length
        ) {
          return null;
        }

        let title = '';
        switch (key) {
          case 'multipleChoice':
            title = 'Trắc nghiệm: Dịch nghĩa';
            break;
          case 'selectPinyin':
            title = 'Trắc nghiệm: Chọn Pinyin';
            break;
          case 'findTheMistake':
            title = 'Tìm lỗi sai';
            break;
          case 'fillInTheBlank':
            title = 'Điền từ vào chỗ trống';
            break;
          case 'sentenceBuilding':
            title = 'Tạo câu';
            break;
          case 'translation':
            title = 'Dịch câu';
            break;
          default:
            return null;
        }

        return (
          <div key={key} className='mb-8'>
            <h3 className='text-xl font-semibold text-gray-800 mb-4'>
              {(exerciseCounter = exerciseCounter + 1)}. {title}
            </h3>
            {exercises[key as keyof Exercises]?.map((q: any, index: number) =>
              renderExercise(key, q, index)
            )}
          </div>
        );
      })}

      <div className='text-center pt-4'>
        <button
          onClick={onCheckAnswers}
          className='px-8 py-3 bg-yellow-500 text-white font-semibold rounded-full shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-transform transform hover:scale-105'
        >
          Kiểm tra đáp án
        </button>
      </div>
    </div>
  );
};
