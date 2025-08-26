import React, { useEffect, useState } from 'react';
import { StudyItem } from '../../store/slices/vocabularySlice';
import { SpeakerIcon } from '../icons';

interface FlashcardSystemProps {
    studyQueue: StudyItem[];
}

export const FlashcardSystem: React.FC<FlashcardSystemProps> = ({ studyQueue }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [studyMode, setStudyMode] = useState<'front' | 'back'>('front');
    const [studyResults, setStudyResults] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setCurrentIndex(0);
        setShowAnswer(false);
        setStudyMode('front');
        setStudyResults({});
    }, [studyQueue]);

    if (studyQueue.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Không có từ nào cần ôn tập</h3>
                <p className="text-gray-500">Tuyệt vời! Bạn đã hoàn thành tất cả từ vựng cần ôn tập hôm nay.</p>
            </div>
        );
    }

    const currentWord = studyQueue[currentIndex];
    const progress = ((currentIndex + 1) / studyQueue.length) * 100;
    const isLastCard = currentIndex === studyQueue.length - 1;

    const handleNext = () => {
        if (currentIndex < studyQueue.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowAnswer(false);
            setStudyMode('front');
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setShowAnswer(false);
            setStudyMode('front');
        }
    };

    const handleFlip = () => {
        setShowAnswer(!showAnswer);
        setStudyMode(studyMode === 'front' ? 'back' : 'front');
    };

    const handleResult = (isCorrect: boolean) => {
        setStudyResults({
            ...studyResults,
            [currentWord.id]: isCorrect,
        });

        // Auto-advance after a short delay
        setTimeout(() => {
            if (!isLastCard) {
                handleNext();
            }
        }, 1500);
    };

    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    };

    const getStudyTypeColor = (type: string) => {
        switch (type) {
            case 'review':
                return 'bg-red-100 text-red-800';
            case 'new':
                return 'bg-blue-100 text-blue-800';
            case 'mastery':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStudyTypeText = (type: string) => {
        switch (type) {
            case 'review':
                return 'Ôn tập';
            case 'new':
                return 'Từ mới';
            case 'mastery':
                return 'Nâng cao';
            default:
                return 'Khác';
        }
    };

    return (
        <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        Tiến độ: {currentIndex + 1} / {studyQueue.length}
                    </span>
                    <span className="text-sm text-gray-500">
                        {Math.round(progress)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Flashcard */}
            <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStudyTypeColor(currentWord.studyType)}`}>
                                {getStudyTypeText(currentWord.studyType)}
                            </span>
                            <span className="text-sm opacity-90">
                                {currentWord.priority === 'high' ? '🔴' : currentWord.priority === 'medium' ? '🟡' : '🟢'}
                                {currentWord.priority === 'high' ? ' Ưu tiên cao' : currentWord.priority === 'medium' ? ' Ưu tiên trung bình' : ' Ưu tiên thấp'}
                            </span>
                        </div>
                        <div className="text-sm opacity-90">
                            {new Date(currentWord.dueDate).toLocaleDateString('vi-VN')}
                        </div>
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-8 text-center">
                    {studyMode === 'front' ? (
                        // Front of card
                        <div className="space-y-6">
                            <div className="text-6xl font-bold text-gray-800 mb-4">
                                {currentWord.word.hanzi}
                            </div>

                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => handleSpeak(currentWord.word.hanzi)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    <SpeakerIcon className="h-5 w-5" />
                                    <span>Nghe phát âm</span>
                                </button>
                            </div>

                            <div className="text-center">
                                <p className="text-gray-600 mb-2">Nhấn để xem đáp án</p>
                                <button
                                    onClick={handleFlip}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Lật thẻ
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Back of card
                        <div className="space-y-6">
                            <div className="text-6xl font-bold text-gray-800 mb-4">
                                {currentWord.word.hanzi}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-lg text-gray-600 mb-1">Pinyin:</p>
                                    <p className="text-2xl font-semibold text-gray-800">{currentWord.word.pinyin}</p>
                                </div>

                                <div>
                                    <p className="text-lg text-gray-600 mb-1">Nghĩa:</p>
                                    <p className="text-xl font-medium text-gray-800">{currentWord.word.meaning}</p>
                                </div>

                                {currentWord.word.tags.length > 0 && (
                                    <div>
                                        <p className="text-lg text-gray-600 mb-1">Tags:</p>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {currentWord.word.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {currentWord.word.notes && (
                                    <div>
                                        <p className="text-lg text-gray-600 mb-1">Ghi chú:</p>
                                        <p className="text-sm text-gray-700 italic">{currentWord.word.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Study Actions */}
                            <div className="space-y-4">
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => handleResult(false)}
                                        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        ❌ Không nhớ
                                    </button>
                                    <button
                                        onClick={() => handleResult(true)}
                                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        ✅ Nhớ rõ
                                    </button>
                                </div>

                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={handleFlip}
                                        className="px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                                    >
                                        Lật lại
                                    </button>
                                    {!isLastCard && (
                                        <button
                                            onClick={handleNext}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Tiếp theo →
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className={`px-4 py-2 rounded-lg transition-colors ${currentIndex === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    ← Trước đó
                </button>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Thẻ {currentIndex + 1} trong {studyQueue.length}
                    </p>
                    <p className="text-xs text-gray-500">
                        {studyQueue[currentIndex]?.word.hanzi} - {studyQueue[currentIndex]?.word.meaning}
                    </p>
                </div>

                <button
                    onClick={handleNext}
                    disabled={isLastCard}
                    className={`px-4 py-2 rounded-lg transition-colors ${isLastCard
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    Tiếp theo →
                </button>
            </div>

            {/* Study Results Summary */}
            {Object.keys(studyResults).length > 0 && (
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <h4 className="font-medium text-gray-700 mb-3">Kết quả học tập:</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {Object.values(studyResults).filter(result => result).length}
                            </div>
                            <div className="text-sm text-gray-600">Đúng</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {Object.values(studyResults).filter(result => !result).length}
                            </div>
                            <div className="text-sm text-gray-600">Sai</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Completion Message */}
            {isLastCard && showAnswer && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-4">🎉</div>
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Hoàn thành buổi học!</h3>
                    <p className="text-green-700">
                        Bạn đã hoàn thành {studyQueue.length} từ vựng. Hãy tiếp tục duy trì thói quen học tập hàng ngày!
                    </p>
                </div>
            )}
        </div>
    );
};
