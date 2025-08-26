import React from 'react';
import { LightbulbIcon, QuoteIcon, SpeakerIcon } from '../icons';

interface ImageAnalysisDisplayProps {
    data: any;
    onSpeak?: (text: string) => void;
}

export const ImageAnalysisDisplay: React.FC<ImageAnalysisDisplayProps> = ({ data, onSpeak }) => {
    const parsedData = data.parsedResult || data;

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

    if (!parsedData) {
        return (
            <div className="text-center text-red-500 p-8">
                Không thể tải dữ liệu phân tích hình ảnh. Vui lòng thử lại.
            </div>
        );
    }

    return (
        <div className="space-y-6 min-h-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border text-center">
                <h2 className="text-3xl font-bold text-blue-600 mb-2">
                    Phân tích hình ảnh
                </h2>
                <p className="text-gray-600">
                    Kết quả phân tích từ AI
                </p>
            </div>

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
                        <div className='text-3xl font-bold text-blue-600'>
                            {parsedData.vocabulary?.length || 0}
                        </div>
                        <div className='text-sm text-gray-600'>Từ vựng</div>
                    </div>
                    <div className='bg-white p-4 rounded-lg shadow-sm'>
                        <div className='text-3xl font-bold text-green-600'>
                            {parsedData.grammar?.length || 0}
                        </div>
                        <div className='text-sm text-gray-600'>Điểm ngữ pháp</div>
                    </div>
                    <div className='bg-white p-4 rounded-lg shadow-sm'>
                        <div className='text-3xl font-bold text-purple-600'>
                            {parsedData.responseTime ? `${(parsedData.responseTime / 1000).toFixed(1)}s` : 'N/A'}
                        </div>
                        <div className='text-sm text-gray-600'>Thời gian xử lý</div>
                    </div>
                </div>
            </div>

            {/* Lesson Request Section */}
            {parsedData.lessonRequest && (
                <Section icon={<LightbulbIcon />} title='Yêu cầu bài học'>
                    <div className='bg-white p-4 rounded-lg border border-blue-200'>
                        <p className='text-blue-700 leading-relaxed text-lg'>{parsedData.lessonRequest}</p>
                    </div>
                </Section>
            )}

            {/* Grammar Section */}
            {parsedData.grammar && parsedData.grammar.length > 0 && (
                <Section icon={<svg className='w-5 h-5 mr-2 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 017.072 0l-.707.707M12 21v-1m-6.364-1.636l.707-.707' />
                </svg>} title={`Điểm ngữ pháp quan trọng (${parsedData.grammar.length} điểm)`}>
                    <div className='space-y-4'>
                        {parsedData.grammar.map((grammarPoint: any, index: number) => (
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
                </Section>
            )}

            {/* Example Paragraph Section */}
            {parsedData.exampleParagraph && (
                <Section icon={<QuoteIcon />} title='Đoạn văn mẫu'>
                    <div className='bg-white p-4 rounded-lg border border-purple-200'>
                        <p className='text-purple-700 leading-relaxed text-lg'>{parsedData.exampleParagraph}</p>
                    </div>
                </Section>
            )}

            {/* Vocabulary Section */}
            {parsedData.vocabulary && parsedData.vocabulary.length > 0 && (
                <div className='bg-white p-6 rounded-lg border shadow-sm'>
                    <h3 className='font-semibold text-lg text-gray-700 mb-4 flex items-center justify-between'>
                        <span className='flex items-center'>
                            <svg className='w-5 h-5 mr-2 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                            </svg>
                            Từ vựng ({parsedData.vocabulary.length} từ)
                        </span>
                        <span className='text-sm text-gray-500 font-normal'>Click vào từ để nghe phát âm</span>
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {parsedData.vocabulary.map((word: any, index: number) => (
                            <div
                                key={index}
                                className='bg-gray-50 p-4 rounded-lg border shadow-sm hover:shadow-md hover:border-blue-500 transition-all cursor-pointer group relative'
                            >
                                <div className='absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center'>
                                    {index + 1}
                                </div>
                                {onSpeak && (
                                    <button
                                        onClick={() => onSpeak(word.hanzi)}
                                        className='absolute top-2 right-2 text-gray-400 hover:text-blue-500 p-2 rounded-full hover:bg-blue-100'
                                        title='Nghe phát âm mẫu'
                                    >
                                        <SpeakerIcon />
                                    </button>
                                )}
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
            )}
        </div>
    );
};
