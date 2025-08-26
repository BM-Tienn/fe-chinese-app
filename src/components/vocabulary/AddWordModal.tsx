import React, { useState } from 'react';
import { CloseIcon } from '../icons';

interface AddWordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddWord: (wordData: {
        hanzi: string;
        pinyin: string;
        meaning: string;
        tags: string[];
        notes: string;
    }) => void;
    existingTags: string[];
}

export const AddWordModal: React.FC<AddWordModalProps> = ({
    isOpen,
    onClose,
    onAddWord,
    existingTags,
}) => {
    const [formData, setFormData] = useState({
        hanzi: '',
        pinyin: '',
        meaning: '',
        tags: '',
        notes: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: Record<string, string> = {};
        if (!formData.hanzi.trim()) {
            newErrors.hanzi = 'Vui lòng nhập chữ Hán';
        }
        if (!formData.pinyin.trim()) {
            newErrors.pinyin = 'Vui lòng nhập pinyin';
        }
        if (!formData.meaning.trim()) {
            newErrors.meaning = 'Vui lòng nhập nghĩa';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Parse tags
        const tags = formData.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        // Call onAddWord
        onAddWord({
            hanzi: formData.hanzi.trim(),
            pinyin: formData.pinyin.trim(),
            meaning: formData.meaning.trim(),
            tags,
            notes: formData.notes.trim(),
        });

        // Reset form
        setFormData({
            hanzi: '',
            pinyin: '',
            meaning: '',
            tags: '',
            notes: '',
        });
        setErrors({});
    };

    const handleClose = () => {
        setFormData({
            hanzi: '',
            pinyin: '',
            meaning: '',
            tags: '',
            notes: '',
        });
        setErrors({});
        onClose();
    };

    const addExistingTag = (tag: string) => {
        const currentTags = formData.tags
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);

        if (!currentTags.includes(tag)) {
            const newTags = [...currentTags, tag].join(', ');
            setFormData({ ...formData, tags: newTags });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Thêm từ vựng mới</h2>
                            <p className="text-gray-500 mt-1">Nhập thông tin từ vựng bạn muốn học</p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="hanzi" className="block text-sm font-medium text-gray-700 mb-1">
                                Chữ Hán <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="hanzi"
                                type="text"
                                value={formData.hanzi}
                                onChange={(e) => {
                                    setFormData({ ...formData, hanzi: e.target.value });
                                    if (errors.hanzi) setErrors({ ...errors, hanzi: '' });
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.hanzi ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="你好"
                            />
                            {errors.hanzi && (
                                <p className="text-red-500 text-sm mt-1">{errors.hanzi}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="pinyin" className="block text-sm font-medium text-gray-700 mb-1">
                                Pinyin <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="pinyin"
                                type="text"
                                value={formData.pinyin}
                                onChange={(e) => {
                                    setFormData({ ...formData, pinyin: e.target.value });
                                    if (errors.pinyin) setErrors({ ...errors, pinyin: '' });
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.pinyin ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="nǐ hǎo"
                            />
                            {errors.pinyin && (
                                <p className="text-red-500 text-sm mt-1">{errors.pinyin}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 mb-1">
                                Nghĩa <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="meaning"
                                type="text"
                                value={formData.meaning}
                                onChange={(e) => {
                                    setFormData({ ...formData, meaning: e.target.value });
                                    if (errors.meaning) setErrors({ ...errors, meaning: '' });
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.meaning ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Xin chào"
                            />
                            {errors.meaning && (
                                <p className="text-red-500 text-sm mt-1">{errors.meaning}</p>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                            Tags
                        </label>
                        <input
                            id="tags"
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập tags, phân cách bằng dấu phẩy (ví dụ: chào hỏi, cơ bản)"
                        />
                        {existingTags.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-2">Tags có sẵn:</p>
                                <div className="flex flex-wrap gap-2">
                                    {existingTags.map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => addExistingTag(tag)}
                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200 transition-colors"
                                        >
                                            + {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Ghi chú
                        </label>
                        <textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ghi chú thêm về từ vựng này (tùy chọn)"
                        />
                    </div>

                    {/* Preview */}
                    {formData.hanzi && formData.pinyin && formData.meaning && (
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-medium text-gray-700 mb-2">Xem trước:</h4>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl font-bold text-gray-800">{formData.hanzi}</span>
                                    <span className="text-lg text-gray-600">{formData.pinyin}</span>
                                    <span className="text-lg text-gray-700">{formData.meaning}</span>
                                </div>
                                {formData.tags && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags
                                            .split(',')
                                            .map((tag) => tag.trim())
                                            .filter((tag) => tag.length > 0)
                                            .map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                    </div>
                                )}
                                {formData.notes && (
                                    <p className="text-sm text-gray-600 italic">"{formData.notes}"</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Thêm từ vựng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
