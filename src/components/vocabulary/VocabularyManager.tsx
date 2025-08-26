import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    addPersonalWord,
    deletePersonalWord,
    fetchNewWords,
    fetchPersonalVocabulary,
    fetchWordsForReview,
    updatePersonalWord
} from '../../store/slices/vocabularySlice';
import { AppDispatch, RootState } from '../../store/store';
import { AddWordModal } from './AddWordModal';
import { FlashcardSystem } from './FlashcardSystem';
import { VocabularyList } from './VocabularyList';

export const VocabularyManager: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { personalVocabulary, studyQueue, loading, error } = useSelector((state: RootState) => state.vocabulary);

    const [activeTab, setActiveTab] = useState<'list' | 'flashcards' | 'schedule'>('list');
    const [isAddWordModalOpen, setIsAddWordModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMastery, setFilterMastery] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'addedAt' | 'masteryLevel' | 'lastReviewed'>('addedAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        // Tải dữ liệu khi component mount
        dispatch(fetchPersonalVocabulary({}));
        dispatch(fetchWordsForReview(20));
        dispatch(fetchNewWords(10));
    }, [dispatch]);

    const handleAddWord = async (wordData: {
        hanzi: string;
        pinyin: string;
        meaning: string;
        tags: string[];
        notes: string;
    }) => {
        try {
            await dispatch(addPersonalWord({
                ...wordData,
                priority: 'medium'
            })).unwrap();

            setIsAddWordModalOpen(false);
            // Tải lại danh sách
            dispatch(fetchPersonalVocabulary({}));
        } catch (error) {
            console.error('Lỗi khi thêm từ vựng:', error);
        }
    };

    const handleDeleteWord = async (wordId: string) => {
        try {
            await dispatch(deletePersonalWord(wordId)).unwrap();
            // Tải lại danh sách
            dispatch(fetchPersonalVocabulary({}));
        } catch (error) {
            console.error('Lỗi khi xóa từ vựng:', error);
        }
    };

    const handleUpdateWord = async (wordId: string, updates: any) => {
        try {
            await dispatch(updatePersonalWord({ id: wordId, updateData: updates })).unwrap();
            // Tải lại danh sách
            dispatch(fetchPersonalVocabulary({}));
        } catch (error) {
            console.error('Lỗi khi cập nhật từ vựng:', error);
        }
    };

    // Lọc và sắp xếp từ vựng
    const filteredVocabulary = personalVocabulary
        .filter(word => {
            const matchesSearch = word.hanzi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                word.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                word.meaning.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesMastery = filterMastery === 'all' ||
                word.masteryLevel.toString() === filterMastery;

            return matchesSearch && matchesMastery;
        })
        .sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'addedAt':
                    comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
                    break;
                case 'masteryLevel':
                    comparison = a.masteryLevel - b.masteryLevel;
                    break;
                case 'lastReviewed':
                    comparison = new Date(a.lastReviewed).getTime() - new Date(b.lastReviewed).getTime();
                    break;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

    const existingTags = Array.from(new Set(personalVocabulary.flatMap(word => word.tags)));

    if (loading && personalVocabulary.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-600 mb-4">Lỗi: {error}</div>
                <button
                    onClick={() => dispatch(fetchPersonalVocabulary(undefined))}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý từ vựng cá nhân</h1>
                    <p className="text-gray-600">Tổng cộng {personalVocabulary.length} từ vựng</p>
                </div>
                <button
                    onClick={() => setIsAddWordModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Thêm từ mới
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'list'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Danh sách từ vựng
                    </button>
                    <button
                        onClick={() => setActiveTab('flashcards')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'flashcards'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Thẻ học
                    </button>
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'schedule'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Lịch ôn tập
                    </button>
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'list' && (
                <div className="space-y-4">
                    {/* Filters và Search */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Tìm kiếm từ vựng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <select
                            value={filterMastery}
                            onChange={(e) => setFilterMastery(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả mức độ</option>
                            <option value="1">Mới học</option>
                            <option value="2">Đang học</option>
                            <option value="3">Ôn tập</option>
                            <option value="4">Gần thuộc</option>
                            <option value="5">Thuộc lòng</option>
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="addedAt">Ngày thêm</option>
                            <option value="masteryLevel">Mức độ thành thạo</option>
                            <option value="lastReviewed">Lần ôn tập cuối</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            {sortOrder === 'asc' ? '↑' : '↓'}
                        </button>
                    </div>

                    {/* Danh sách từ vựng */}
                    <VocabularyList
                        vocabulary={filteredVocabulary}
                        onDeleteWord={handleDeleteWord}
                        onUpdateWord={handleUpdateWord}
                    />
                </div>
            )}

            {activeTab === 'flashcards' && (
                <div>
                    {studyQueue.length > 0 ? (
                        <FlashcardSystem studyQueue={studyQueue} />
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            Không có từ vựng nào để học. Hãy thêm từ mới hoặc đợi đến lịch ôn tập.
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'schedule' && (
                <div className="text-center py-8 text-gray-500">
                    Tính năng lịch ôn tập sẽ được phát triển trong phiên bản tiếp theo.
                </div>
            )}

            {/* Modal thêm từ mới */}
            <AddWordModal
                isOpen={isAddWordModalOpen}
                onClose={() => setIsAddWordModalOpen(false)}
                onAddWord={handleAddWord}
                existingTags={existingTags}
            />
        </div>
    );
};
