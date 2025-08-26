import React from 'react';

interface PreviewSection {
    title: string;
    content: string;
    type: string;
}

interface PreviewData {
    type: string;
    title: string;
    sections: PreviewSection[];
}

interface DataPreviewProps {
    preview: {
        request: PreviewData;
        response: PreviewData;
        metadata: {
            endpoint: string;
            aiModel: string;
            responseTime: number;
            status: string;
            timestamp: string;
        };
    };
}

export const DataPreview: React.FC<DataPreviewProps> = ({ preview }) => {
    const formatContent = (content: string, type: string) => {
        if (type === 'vocabulary_list' || type === 'exercise_list') {
            return content.split('\n\n').map((item, index) => (
                <div key={index} className="mb-2 p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                    {item.split('\n').map((line, lineIndex) => (
                        <div key={lineIndex} className="text-sm">
                            {line}
                        </div>
                    ))}
                </div>
            ));
        }

        if (type === 'grammar_list') {
            return content.split('\n\n').map((item, index) => (
                <div key={index} className="mb-3 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                    {item.split('\n').map((line, lineIndex) => (
                        <div key={lineIndex} className="text-sm">
                            {line}
                        </div>
                    ))}
                </div>
            ));
        }

        if (type === 'paragraph') {
            return (
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                    <p className="text-sm leading-relaxed">{content}</p>
                </div>
            );
        }

        if (type === 'text') {
            return (
                <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                    <p className="text-sm">{content}</p>
                </div>
            );
        }

        if (type === 'word_info') {
            return (
                <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                    <p className="text-sm font-medium">{content}</p>
                </div>
            );
        }

        if (type === 'examples_list') {
            return content.split('\n').map((example, index) => (
                <div key={index} className="mb-2 p-2 bg-indigo-50 rounded border-l-4 border-indigo-400">
                    <p className="text-sm">{example}</p>
                </div>
            ));
        }

        if (type === 'synonyms_list' || type === 'antonyms_list') {
            return (
                <div className="p-2 bg-orange-50 rounded border-l-4 border-orange-400">
                    <p className="text-sm">{content}</p>
                </div>
            );
        }

        if (type === 'pronunciation_guide') {
            return (
                <div className="p-3 bg-teal-50 rounded border-l-4 border-teal-400">
                    <p className="text-sm">{content}</p>
                </div>
            );
        }

        if (type === 'practice_tips') {
            return content.split('\n').map((tip, index) => (
                <div key={index} className="mb-2 p-2 bg-cyan-50 rounded border-l-4 border-cyan-400">
                    <p className="text-sm">💡 {tip}</p>
                </div>
            ));
        }

        if (type === 'generic_field') {
            return (
                <div className="p-2 bg-gray-100 rounded text-xs font-mono">
                    {content}
                </div>
            );
        }

        // Default rendering
        return (
            <div className="p-2 bg-gray-50 rounded">
                <p className="text-sm whitespace-pre-wrap">{content}</p>
            </div>
        );
    };

    const getEndpointLabel = (endpoint: string) => {
        const labels = {
            'analyzeImage': 'Phân tích hình ảnh',
            'generateExercises': 'Tạo bài tập',
            'analyzeWordDetails': 'Phân tích từ vựng',
            'analyzePronunciation': 'Phân tích phát âm'
        };
        return labels[endpoint as keyof typeof labels] || endpoint;
    };

    const getStatusColor = (status: string) => {
        const colors = {
            'success': 'bg-green-100 text-green-800 border-green-200',
            'error': 'bg-red-100 text-red-800 border-red-200',
            'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'timeout': 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusLabel = (status: string) => {
        const labels = {
            'success': 'Thành công',
            'error': 'Lỗi',
            'pending': 'Đang xử lý',
            'timeout': 'Hết thời gian'
        };
        return labels[status as keyof typeof labels] || status;
    };

    return (
        <div className="space-y-6">
            {/* Header với metadata */}
            <div className="bg-white rounded-lg shadow p-4 border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {getEndpointLabel(preview.metadata.endpoint)}
                    </h3>
                    <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(preview.metadata.status)}`}>
                            {getStatusLabel(preview.metadata.status)}
                        </span>
                        <span className="text-sm text-gray-500">
                            {preview.metadata.responseTime}ms
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                        <span className="font-medium">Model AI:</span> {preview.metadata.aiModel}
                    </div>
                    <div>
                        <span className="font-medium">Thời gian:</span> {new Date(preview.metadata.timestamp).toLocaleString('vi-VN')}
                    </div>
                </div>
            </div>

            {/* Request Preview */}
            <div className="bg-white rounded-lg shadow border">
                <div className="px-4 py-3 border-b bg-gray-50">
                    <h4 className="text-md font-medium text-gray-900">
                        {preview.request.title}
                    </h4>
                </div>
                <div className="p-4">
                    {preview.request.sections.length > 0 ? (
                        <div className="space-y-4">
                            {preview.request.sections.map((section, index) => (
                                <div key={index}>
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                                        {section.title}
                                    </h5>
                                    {formatContent(section.content, section.type)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">Không có dữ liệu request</p>
                    )}
                </div>
            </div>

            {/* Response Preview */}
            <div className="bg-white rounded-lg shadow border">
                <div className="px-4 py-3 border-b bg-gray-50">
                    <h4 className="text-md font-medium text-gray-900">
                        {preview.response.title}
                    </h4>
                </div>
                <div className="p-4">
                    {preview.response.sections.length > 0 ? (
                        <div className="space-y-4">
                            {preview.response.sections.map((section, index) => (
                                <div key={index}>
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                                        {section.title}
                                    </h5>
                                    {formatContent(section.content, section.type)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">Không có dữ liệu response</p>
                    )}
                </div>
            </div>
        </div>
    );
};
