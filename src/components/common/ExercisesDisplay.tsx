import React, { useState } from 'react';
import { ExerciseIcon } from '../icons';

interface ExercisesDisplayProps {
    data: any;
}

export const ExercisesDisplay: React.FC<ExercisesDisplayProps> = ({ data }) => {
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [showResults, setShowResults] = useState(false);

    const handleAnswerChange = (key: string, value: string) => {
        setUserAnswers(prev => ({ ...prev, [key]: value }));
    };

    const handleCheckAnswers = () => {
        setShowResults(true);
    };

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
                                    className={`flex items-center p-2 rounded-md cursor-pointer ${showResults
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
                                        onChange={e => handleAnswerChange(answerKey, e.target.value)}
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
                            onChange={e => handleAnswerChange(answerKey, e.target.value)}
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
                            onChange={e => handleAnswerChange(answerKey, e.target.value)}
                            className={`mt-1 block w-full md:w-1/2 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${showResults
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
                            onChange={e => handleAnswerChange(answerKey, e.target.value)}
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
                            onChange={e => handleAnswerChange(answerKey, e.target.value)}
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

    const getExerciseTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'multipleChoice': 'Trắc nghiệm: Dịch nghĩa',
            'selectPinyin': 'Trắc nghiệm: Chọn Pinyin',
            'findTheMistake': 'Tìm lỗi sai',
            'fillInTheBlank': 'Điền từ vào chỗ trống',
            'sentenceBuilding': 'Tạo câu',
            'translation': 'Dịch câu',
        };
        return labels[type] || type;
    };

    // Xử lý dữ liệu từ parsedResult nếu có
    const exercisesData = data.parsedResult?.exercises || data.exercises || data;
    let exerciseCounter = 0;

    return (
        <div className="space-y-6 min-h-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border text-center">
                <h2 className="text-3xl font-bold text-green-600 mb-2 flex items-center justify-center">
                    <ExerciseIcon />
                    Bài tập luyện tập
                </h2>
                <p className="text-gray-600">
                    {data.topic ? `Chủ đề: ${data.topic}` : 'Bài tập được tạo bởi AI'}
                </p>
                {data.difficulty && (
                    <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full mt-2">
                        Độ khó: {data.difficulty}
                    </span>
                )}
            </div>

            {/* Bài tập */}
            <div className="space-y-8">
                {Object.keys(exercisesData).map(key => {
                    if (
                        !Array.isArray(exercisesData[key as keyof typeof exercisesData]) ||
                        !exercisesData[key as keyof typeof exercisesData]?.length
                    ) {
                        return null;
                    }

                    const title = getExerciseTypeLabel(key);

                    return (
                        <div key={key} className='bg-white p-6 rounded-lg border shadow-sm'>
                            <h3 className='text-xl font-semibold text-gray-800 mb-4 flex items-center'>
                                <span className='bg-green-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3'>
                                    {(exerciseCounter = exerciseCounter + 1)}
                                </span>
                                {title}
                            </h3>
                            {exercisesData[key as keyof typeof exercisesData]?.map((q: any, index: number) =>
                                renderExercise(key, q, index)
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Nút kiểm tra đáp án */}
            <div className='text-center pt-4'>
                <button
                    onClick={handleCheckAnswers}
                    className='px-8 py-3 bg-yellow-500 text-white font-semibold rounded-full shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-transform transform hover:scale-105'
                >
                    Kiểm tra đáp án
                </button>
            </div>
        </div>
    );
};
