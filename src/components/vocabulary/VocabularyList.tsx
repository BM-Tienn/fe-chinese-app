import React, { useState } from 'react';
import { PersonalWord } from '../../store/slices/vocabularySlice';
import { SpeakerIcon } from '../icons';

interface VocabularyListProps {
    vocabulary: PersonalWord[];
    onDeleteWord: (wordId: string) => void;
    onUpdateWord: (wordId: string, updates: Partial<PersonalWord>) => void;
}

export const VocabularyList: React.FC<VocabularyListProps> = ({
    vocabulary,
    onDeleteWord,
    onUpdateWord,
}) => {
    const [editingWord, setEditingWord] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<PersonalWord>>({});

    const handleEdit = (word: PersonalWord) => {
        setEditingWord(word.id);
        setEditForm({
            hanzi: word.hanzi,
            pinyin: word.pinyin,
            meaning: word.meaning,
            tags: word.tags,
            notes: word.notes,
        });
    };

    const handleSave = (wordId: string) => {
        onUpdateWord(wordId, editForm);
        setEditingWord(null);
        setEditForm({});
    };

    const handleCancel = () => {
        setEditingWord(null);
        setEditForm({});
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

    const getMasteryColor = (level: number) => {
        if (level >= 5) return 'bg-green-100 text-green-800';
        if (level >= 4) return 'bg-blue-100 text-blue-800';
        if (level >= 3) return 'bg-yellow-100 text-yellow-800';
        if (level >= 2) return 'bg-orange-100 text-orange-800';
        return 'bg-red-100 text-red-800';
    };

    const getMasteryText = (level: number) => {
        if (level >= 5) return 'Thuộc lòng';
        if (level >= 4) return 'Rất tốt';
        if (level >= 3) return 'Tốt';
        if (level >= 2) return 'Khá';
        return 'Mới học';
    };

    if (vocabulary.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có từ vựng nào</h3>
                <p className="text-gray-500">Hãy bắt đầu thêm từ vựng mới để học tập!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {vocabulary.map((word) => (
                <div key={word.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                    {editingWord === word.id ? (
                        // Edit mode
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Chữ Hán</label>
                                    <input
                                        type="text"
                                        value={editForm.hanzi || ''}
                                        onChange={(e) => setEditForm({ ...editForm, hanzi: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pinyin</label>
                                    <input
                                        type="text"
                                        value={editForm.pinyin || ''}
                                        onChange={(e) => setEditForm({ ...editForm, pinyin: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nghĩa</label>
                                    <input
                                        type="text"
                                        value={editForm.meaning || ''}
                                        onChange={(e) => setEditForm({ ...editForm, meaning: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                <input
                                    type="text"
                                    value={editForm.tags?.join(', ') || ''}
                                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                                    placeholder="Nhập tags, phân cách bằng dấu phẩy"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                                <textarea
                                    value={editForm.notes || ''}
                                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => handleSave(word.id)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    ) : (
                        // View mode
                        <div className="space-y-4">
                            {/* Header with mastery level */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-2xl font-bold text-gray-800">{word.hanzi}</h3>
                                        <button
                                            onClick={() => handleSpeak(word.hanzi)}
                                            className="text-gray-400 hover:text-blue-500 transition-colors"
                                            title="Nghe phát âm"
                                        >
                                            <SpeakerIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <p className="text-lg text-gray-600">{word.pinyin}</p>
                                    <p className="text-lg text-gray-700 font-medium">{word.meaning}</p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMasteryColor(word.masteryLevel)}`}>
                                        {getMasteryText(word.masteryLevel)}
                                    </span>
                                    <span className="text-sm text-gray-500">Level {word.masteryLevel}</span>
                                </div>
                            </div>

                            {/* Tags */}
                            {word.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {word.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Notes */}
                            {word.notes && (
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-700">{word.notes}</p>
                                </div>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-gray-200">
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-gray-800">{word.reviewCount}</div>
                                    <div className="text-xs text-gray-500">Lần ôn tập</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-gray-800">
                                        {word.totalAttempts > 0 ? Math.round((word.correctAnswers / word.totalAttempts) * 100) : 0}%
                                    </div>
                                    <div className="text-xs text-gray-500">Tỷ lệ đúng</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-gray-800">
                                        {new Date(word.lastReviewed).toLocaleDateString('vi-VN')}
                                    </div>
                                    <div className="text-xs text-gray-500">Lần ôn cuối</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-semibold text-gray-800">
                                        {new Date(word.nextReview).toLocaleDateString('vi-VN')}
                                    </div>
                                    <div className="text-xs text-gray-500">Ôn tập tiếp</div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
                                <button
                                    onClick={() => handleEdit(word)}
                                    className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => onDeleteWord(word.id)}
                                    className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
