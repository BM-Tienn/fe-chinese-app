import React from 'react';
import { InfoIcon, LightbulbIcon, LinkIcon, QuoteIcon, SpeakerIcon } from '../icons';

interface VocabularyDisplayProps {
    data: any;
    onSpeak?: (text: string) => void;
}

export const VocabularyDisplay: React.FC<VocabularyDisplayProps> = ({ data, onSpeak }) => {
    // Debug logging
    console.log('VocabularyDisplay received data:', data);
    console.log('data.parsedResult:', data.parsedResult);

    const parsedData = data.parsedResult || data;

    console.log('Final parsedData:', parsedData);

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

    if (!parsedData) {
        return (
            <div className="text-center text-red-500 p-8">
                Không thể tải dữ liệu từ vựng. Vui lòng thử lại.
            </div>
        );
    }

    return (
        <div className="space-y-6 min-h-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border text-center">
                <h2 className="text-4xl font-bold text-blue-600 mb-2">
                    {parsedData.word || 'N/A'}
                </h2>
                <p className="text-lg text-gray-500 mb-2">
                    {parsedData.pinyin || 'N/A'}
                </p>
                <p className="text-lg text-gray-800 font-semibold">
                    {parsedData.meaning || 'N/A'}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                    {parsedData.wordType && (
                        <span className='bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full'>
                            {parsedData.wordType}
                        </span>
                    )}
                    {parsedData.popularity && (
                        <span className='bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full'>
                            {parsedData.popularity}
                        </span>
                    )}
                    {onSpeak && (
                        <button
                            onClick={() => onSpeak(parsedData.word)}
                            className='text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100'
                        >
                            <SpeakerIcon />
                        </button>
                    )}
                </div>
            </div>

            {/* Phân tích chi tiết */}
            {parsedData.analysis && (
                <Section icon={<InfoIcon />} title='Phân tích chi tiết'>
                    {parsedData.analysis.etymology && (
                        <div className='mb-3'>
                            <strong className='font-medium text-gray-700'>Từ nguyên:</strong>
                            <p className='mt-1'>{parsedData.analysis.etymology}</p>
                        </div>
                    )}
                    {parsedData.analysis.coreMeanings && (
                        <div className='mb-3'>
                            <strong className='font-medium text-gray-700'>Nghĩa cốt lõi:</strong>
                            {parsedData.analysis.coreMeanings.map((meaning: any, index: number) => (
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
                    {parsedData.analysis.grammaticalNotes && (
                        <div>
                            <strong className='font-medium text-gray-700'>Ghi chú ngữ pháp:</strong>
                            <p className='mt-1'>{parsedData.analysis.grammaticalNotes}</p>
                        </div>
                    )}
                </Section>
            )}

            {/* Cách dùng & Ngữ cảnh */}
            {(parsedData.usage || parsedData.context) && (
                <Section icon={<LightbulbIcon />} title='Cách dùng & Ngữ cảnh'>
                    {parsedData.usage && <p>{parsedData.usage}</p>}
                    {parsedData.context && (
                        <p className='italic'>
                            <strong className='font-medium'>Ngữ cảnh:</strong>{' '}
                            {parsedData.context}
                        </p>
                    )}
                </Section>
            )}

            {/* Từ liên quan */}
            {(parsedData.synonyms || parsedData.antonyms || parsedData.homophones) && (
                <Section icon={<LinkIcon />} title='Từ liên quan'>
                    <RelatedWords title='Đồng nghĩa' words={parsedData.synonyms} />
                    <RelatedWords title='Trái nghĩa' words={parsedData.antonyms} />
                    <RelatedWords title='Đồng âm' words={parsedData.homophones} />
                </Section>
            )}

            {/* Ví dụ thực tế */}
            {parsedData.examples && parsedData.examples.length > 0 && (
                <Section icon={<QuoteIcon />} title='Ví dụ thực tế'>
                    <ul className='space-y-4'>
                        {parsedData.examples.map((ex: any, i: number) => (
                            <li
                                key={i}
                                className='border-l-4 border-blue-200 pl-4 py-1'
                            >
                                <div className='flex items-center justify-between'>
                                    <p className='text-lg font-medium text-gray-800'>
                                        {ex.sentence}
                                    </p>
                                    {onSpeak && (
                                        <button
                                            onClick={() => onSpeak(ex.sentence)}
                                            className='text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100'
                                        >
                                            <SpeakerIcon className='h-6 w-6' />
                                        </button>
                                    )}
                                </div>
                                <p className='text-sm text-gray-500'>{ex.pinyin}</p>
                                <p className='text-sm text-gray-500 italic'>
                                    "{ex.translation}"
                                </p>
                            </li>
                        ))}
                    </ul>
                </Section>
            )}
        </div>
    );
};
