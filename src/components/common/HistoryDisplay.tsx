import React from 'react';
import { ExercisesDisplay } from './ExercisesDisplay';
import { ImageAnalysisDisplay } from './ImageAnalysisDisplay';
import { PronunciationDisplay } from './PronunciationDisplay';
import { VocabularyDisplay } from './VocabularyDisplay';

interface HistoryDisplayProps {
    data: any;
    endpoint: string;
    onSpeak?: (text: string) => void;
}

export const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ data, endpoint, onSpeak }) => {
    // Debug logging
    console.log('HistoryDisplay received data:', data);
    console.log('HistoryDisplay endpoint:', endpoint);

    // Xác định loại dữ liệu và hiển thị component tương ứng
    const renderContent = () => {
        switch (endpoint) {
            case 'analyzeWordDetails':
                return <VocabularyDisplay data={data} onSpeak={onSpeak} />;

            case 'generateExercises':
                return <ExercisesDisplay data={data} />;

            case 'analyzeImage':
                return <ImageAnalysisDisplay data={data} onSpeak={onSpeak} />;

            case 'analyzePronunciation':
                return <PronunciationDisplay data={data} onSpeak={onSpeak} />;

            default:
                // Fallback: hiển thị dữ liệu thô nếu không nhận diện được endpoint
                return (
                    <div className="space-y-6">
                        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                                Dữ liệu không được hỗ trợ hiển thị
                            </h3>
                            <p className="text-yellow-700 mb-4">
                                Endpoint "{endpoint}" chưa có component hiển thị tương ứng.
                            </p>
                            <details className="text-sm">
                                <summary className="cursor-pointer font-medium text-yellow-800">
                                    Xem dữ liệu thô
                                </summary>
                                <div className="mt-3 p-3 bg-white rounded border">
                                    <pre className="text-xs overflow-x-auto">
                                        {JSON.stringify(data, null, 2)}
                                    </pre>
                                </div>
                            </details>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6 min-h-0">
            {/* Header với thông tin endpoint */}
            <div className="bg-white rounded-lg shadow p-4 border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {getEndpointLabel(endpoint)}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {endpoint}
                    </span>
                </div>

                {/* Thông tin bổ sung */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    {data.aiModel && (
                        <div>
                            <span className="font-medium">Model AI:</span> {data.aiModel}
                        </div>
                    )}
                    {data.responseTime && (
                        <div>
                            <span className="font-medium">Thời gian:</span> {data.responseTime}ms
                        </div>
                    )}
                    {data.status && (
                        <div>
                            <span className="font-medium">Trạng thái:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${data.status === 'success'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {data.status}
                            </span>
                        </div>
                    )}
                    {data.timestamp && (
                        <div>
                            <span className="font-medium">Thời gian:</span> {new Date(data.timestamp).toLocaleString('vi-VN')}
                        </div>
                    )}
                </div>
            </div>

            {/* Nội dung chính */}
            {renderContent()}
        </div>
    );
};

// Helper function để lấy nhãn tiếng Việt cho endpoint
const getEndpointLabel = (endpoint: string) => {
    const labels: Record<string, string> = {
        'analyzeImage': 'Phân tích hình ảnh',
        'generateExercises': 'Tạo bài tập',
        'analyzeWordDetails': 'Phân tích từ vựng',
        'analyzePronunciation': 'Phân tích phát âm'
    };
    return labels[endpoint] || endpoint;
};
