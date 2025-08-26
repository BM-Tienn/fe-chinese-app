import React from 'react';
import { WeeklyProgress } from '../../store/slices/progressSlice';

interface LearningStatsProps {
    weeklyProgress: WeeklyProgress[];
}

export const LearningStats: React.FC<LearningStatsProps> = ({ weeklyProgress }) => {
    if (!weeklyProgress || weeklyProgress.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>Chưa có dữ liệu thống kê</p>
            </div>
        );
    }

    // Tính toán thống kê
    const totalWords = weeklyProgress.reduce((sum, week) => sum + week.wordsLearned, 0);
    const totalExercises = weeklyProgress.reduce((sum, week) => sum + week.exercisesCompleted, 0);
    const totalTime = weeklyProgress.reduce((sum, week) => sum + week.timeSpent, 0);
    const averageAccuracy = weeklyProgress.reduce((sum, week) => sum + week.accuracy, 0) / weeklyProgress.length;

    // Tìm tuần tốt nhất
    const bestWeek = weeklyProgress.reduce((best, current) =>
        current.wordsLearned > best.wordsLearned ? current : best
    );

    // Tìm tuần có độ chính xác cao nhất
    const mostAccurateWeek = weeklyProgress.reduce((best, current) =>
        current.accuracy > best.accuracy ? current : best
    );

    // Tính xu hướng (so sánh tuần này với tuần trước)
    const thisWeek = weeklyProgress[0];
    const lastWeek = weeklyProgress[1];
    const wordsTrend = thisWeek && lastWeek ? thisWeek.wordsLearned - lastWeek.wordsLearned : 0;
    const accuracyTrend = thisWeek && lastWeek ? thisWeek.accuracy - lastWeek.accuracy : 0;

    const getTrendIcon = (trend: number) => {
        if (trend > 0) return '↗️';
        if (trend < 0) return '↘️';
        return '→';
    };

    const getTrendColor = (trend: number) => {
        if (trend > 0) return 'text-green-600';
        if (trend < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    const getTrendText = (trend: number) => {
        if (trend > 0) return 'Tăng';
        if (trend < 0) return 'Giảm';
        return 'Không đổi';
    };

    return (
        <div className="space-y-6">
            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Tổng từ vựng</p>
                            <p className="text-2xl font-bold text-blue-800">{totalWords}</p>
                        </div>
                        <div className="text-3xl">📚</div>
                    </div>
                    {wordsTrend !== 0 && (
                        <div className={`text-xs mt-2 ${getTrendColor(wordsTrend)}`}>
                            {getTrendIcon(wordsTrend)} {getTrendText(wordsTrend)} {Math.abs(wordsTrend)} từ
                        </div>
                    )}
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium">Tổng bài tập</p>
                            <p className="text-2xl font-bold text-green-800">{totalExercises}</p>
                        </div>
                        <div className="text-3xl">✅</div>
                    </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-600 font-medium">Tổng thời gian</p>
                            <p className="text-2xl font-bold text-purple-800">{totalTime} phút</p>
                        </div>
                        <div className="text-3xl">⏰</div>
                    </div>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-orange-600 font-medium">Độ chính xác TB</p>
                            <p className="text-2xl font-bold text-orange-800">{averageAccuracy.toFixed(1)}%</p>
                        </div>
                        <div className="text-3xl">🎯</div>
                    </div>
                    {accuracyTrend !== 0 && (
                        <div className={`text-xs mt-2 ${getTrendColor(accuracyTrend)}`}>
                            {getTrendIcon(accuracyTrend)} {getTrendText(accuracyTrend)} {Math.abs(accuracyTrend).toFixed(1)}%
                        </div>
                    )}
                </div>
            </div>

            {/* Tuần tốt nhất */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                        <span className="text-2xl mr-2">🏆</span>
                        Tuần xuất sắc nhất
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-green-700">Tuần:</span>
                            <span className="font-semibold text-green-800">{bestWeek.week}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-green-700">Từ vựng học được:</span>
                            <span className="font-semibold text-green-800">{bestWeek.wordsLearned} từ</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-green-700">Bài tập hoàn thành:</span>
                            <span className="font-semibold text-green-800">{bestWeek.exercisesCompleted} bài</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-green-700">Thời gian học:</span>
                            <span className="font-semibold text-green-800">{bestWeek.timeSpent} phút</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                        <span className="text-2xl mr-2">🎯</span>
                        Tuần chính xác nhất
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700">Tuần:</span>
                            <span className="font-semibold text-blue-800">{mostAccurateWeek.week}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700">Độ chính xác:</span>
                            <span className="font-semibold text-blue-800">{mostAccurateWeek.accuracy}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700">Từ vựng học được:</span>
                            <span className="font-semibold text-blue-800">{mostAccurateWeek.wordsLearned} từ</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700">Bài tập hoàn thành:</span>
                            <span className="font-semibold text-blue-800">{mostAccurateWeek.exercisesCompleted} bài</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phân tích xu hướng */}
            <div className="bg-gray-50 p-6 rounded-xl border">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📈</span>
                    Phân tích xu hướng
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                        <h5 className="font-medium text-gray-700 mb-2">Từ vựng</h5>
                        <div className="flex items-center space-x-2">
                            <span className={`text-lg font-semibold ${getTrendColor(wordsTrend)}`}>
                                {getTrendIcon(wordsTrend)}
                            </span>
                            <span className={`text-sm ${getTrendColor(wordsTrend)}`}>
                                {wordsTrend > 0 ? `+${wordsTrend}` : wordsTrend} từ so với tuần trước
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {wordsTrend > 0 ? 'Bạn đang học tập rất hiệu quả!' :
                                wordsTrend < 0 ? 'Hãy cố gắng hơn nữa!' :
                                    'Duy trì tốt mức độ học tập!'}
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                        <h5 className="font-medium text-gray-700 mb-2">Độ chính xác</h5>
                        <div className="flex items-center space-x-2">
                            <span className={`text-lg font-semibold ${getTrendColor(accuracyTrend)}`}>
                                {getTrendIcon(accuracyTrend)}
                            </span>
                            <span className={`text-sm ${getTrendColor(accuracyTrend)}`}>
                                {accuracyTrend > 0 ? `+${accuracyTrend.toFixed(1)}` : accuracyTrend.toFixed(1)}% so với tuần trước
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {accuracyTrend > 0 ? 'Kiến thức của bạn ngày càng vững chắc!' :
                                accuracyTrend < 0 ? 'Hãy ôn tập lại những gì đã học!' :
                                    'Duy trì tốt độ chính xác!'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Gợi ý cải thiện */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-200">
                <h4 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">💡</span>
                    Gợi ý cải thiện
                </h4>
                <div className="space-y-3">
                    {wordsTrend < 0 && (
                        <div className="flex items-start space-x-3">
                            <span className="text-yellow-600 text-lg">📚</span>
                            <div>
                                <p className="font-medium text-yellow-800">Tăng cường học từ vựng</p>
                                <p className="text-sm text-yellow-700">Hãy dành thêm thời gian để học từ mới mỗi ngày</p>
                            </div>
                        </div>
                    )}

                    {accuracyTrend < 0 && (
                        <div className="flex items-start space-x-3">
                            <span className="text-yellow-600 text-lg">🎯</span>
                            <div>
                                <p className="font-medium text-yellow-800">Ôn tập lại kiến thức</p>
                                <p className="text-sm text-yellow-700">Làm lại các bài tập cũ để củng cố kiến thức</p>
                            </div>
                        </div>
                    )}

                    {totalTime < 300 && (
                        <div className="flex items-start space-x-3">
                            <span className="text-yellow-600 text-lg">⏰</span>
                            <div>
                                <p className="font-medium text-yellow-800">Tăng thời gian học tập</p>
                                <p className="text-sm text-yellow-700">Mục tiêu: ít nhất 30 phút mỗi ngày</p>
                            </div>
                        </div>
                    )}

                    {wordsTrend >= 0 && accuracyTrend >= 0 && totalTime >= 300 && (
                        <div className="flex items-start space-x-3">
                            <span className="text-yellow-600 text-lg">🌟</span>
                            <div>
                                <p className="font-medium text-yellow-800">Xuất sắc!</p>
                                <p className="text-sm text-yellow-700">Bạn đang học tập rất hiệu quả. Hãy duy trì nhịp độ này!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
