import React from 'react';
import { InfoIcon, LightbulbIcon, SpeakerIcon } from '../icons';

interface PronunciationDisplayProps {
    data: any;
    onSpeak?: (text: string) => void;
}

export const PronunciationDisplay: React.FC<PronunciationDisplayProps> = ({ data, onSpeak }) => {
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
                Không thể tải dữ liệu phân tích phát âm. Vui lòng thử lại.
            </div>
        );
    }

    return (
        <div className="space-y-6 min-h-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border text-center">
                <h2 className="text-3xl font-bold text-teal-600 mb-2">
                    Phân tích phát âm
                </h2>
                <p className="text-gray-600">
                    Hướng dẫn phát âm từ AI
                </p>
            </div>

            {/* Thông tin từ vựng */}
            <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
                <h3 className="text-2xl font-bold text-teal-600 mb-2">
                    {parsedData.word || 'N/A'}
                </h3>
                <p className="text-lg text-gray-500 mb-2">
                    {parsedData.pinyin || 'N/A'}
                </p>
                <p className="text-lg text-gray-800 font-semibold mb-4">
                    {parsedData.meaning || 'N/A'}
                </p>
                <div className="flex items-center justify-center gap-4">
                    {parsedData.tone && (
                        <span className="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full">
                            Thanh điệu: {parsedData.tone}
                        </span>
                    )}
                    {onSpeak && (
                        <button
                            onClick={() => onSpeak(parsedData.word)}
                            className="bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 transition-colors"
                            title="Nghe phát âm mẫu"
                        >
                            <SpeakerIcon className="h-6 w-6" />
                        </button>
                    )}
                </div>
            </div>

            {/* Hướng dẫn phát âm */}
            {parsedData.pronunciation && (
                <Section icon={<InfoIcon />} title="Hướng dẫn phát âm">
                    <div className="bg-white p-4 rounded-lg border border-teal-200">
                        <p className="text-teal-700 leading-relaxed text-lg">{parsedData.pronunciation}</p>
                    </div>
                </Section>
            )}

            {/* Lỗi thường gặp */}
            {parsedData.commonMistakes && parsedData.commonMistakes.length > 0 && (
                <Section icon={<svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>} title="Lỗi thường gặp">
                    <div className="space-y-3">
                        {parsedData.commonMistakes.map((mistake: string, index: number) => (
                            <div key={index} className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                                <p className="text-red-700 text-sm">❌ {mistake}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Mẹo luyện tập */}
            {parsedData.practiceTips && parsedData.practiceTips.length > 0 && (
                <Section icon={<LightbulbIcon />} title="Mẹo luyện tập">
                    <div className="space-y-3">
                        {parsedData.practiceTips.map((tip: string, index: number) => (
                            <div key={index} className="bg-cyan-50 p-3 rounded-lg border-l-4 border-cyan-400">
                                <p className="text-cyan-700 text-sm">💡 {tip}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Thông tin bổ sung */}
            {(parsedData.phoneticRules || parsedData.tonePatterns) && (
                <div className="bg-gray-50 p-6 rounded-lg border">
                    <h3 className="font-semibold text-lg text-gray-800 mb-4">Thông tin bổ sung</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parsedData.phoneticRules && (
                            <div className="bg-white p-4 rounded-lg border">
                                <h4 className="font-medium text-gray-700 mb-2">Quy tắc ngữ âm:</h4>
                                <p className="text-sm text-gray-600">{parsedData.phoneticRules}</p>
                            </div>
                        )}
                        {parsedData.tonePatterns && (
                            <div className="bg-white p-4 rounded-lg border">
                                <h4 className="font-medium text-gray-700 mb-2">Mẫu thanh điệu:</h4>
                                <p className="text-sm text-gray-600">{parsedData.tonePatterns}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
