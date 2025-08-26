import React from 'react';
import { WeeklyProgress } from '../../store/slices/progressSlice';

interface ProgressChartProps {
    data: WeeklyProgress[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>Chưa có dữ liệu tiến độ</p>
            </div>
        );
    }

    // Tìm giá trị lớn nhất để scale biểu đồ
    const maxWords = Math.max(...data.map(d => d.wordsLearned));
    const maxExercises = Math.max(...data.map(d => d.exercisesCompleted));
    const maxTime = Math.max(...data.map(d => d.timeSpent));

    return (
        <div className="space-y-6">
            {/* Biểu đồ từ vựng */}
            <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">Từ vựng học được</h4>
                <div className="flex items-end space-x-2 h-32">
                    {data.map((week, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="relative w-full">
                                <div
                                    className="bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600 cursor-pointer"
                                    style={{
                                        height: `${(week.wordsLearned / maxWords) * 100}%`,
                                        minHeight: '20px'
                                    }}
                                    title={`${week.week}: ${week.wordsLearned} từ`}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2 text-center">
                                {week.week}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mt-1">
                                {week.wordsLearned}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Biểu đồ bài tập */}
            <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">Bài tập hoàn thành</h4>
                <div className="flex items-end space-x-2 h-32">
                    {data.map((week, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="relative w-full">
                                <div
                                    className="bg-green-500 rounded-t-lg transition-all duration-500 hover:bg-green-600 cursor-pointer"
                                    style={{
                                        height: `${(week.exercisesCompleted / maxExercises) * 100}%`,
                                        minHeight: '20px'
                                    }}
                                    title={`${week.week}: ${week.exercisesCompleted} bài tập`}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2 text-center">
                                {week.week}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mt-1">
                                {week.exercisesCompleted}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Biểu đồ thời gian học */}
            <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">Thời gian học tập (phút)</h4>
                <div className="flex items-end space-x-2 h-32">
                    {data.map((week, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="relative w-full">
                                <div
                                    className="bg-purple-500 rounded-t-lg transition-all duration-500 hover:bg-purple-600 cursor-pointer"
                                    style={{
                                        height: `${(week.timeSpent / maxTime) * 100}%`,
                                        minHeight: '20px'
                                    }}
                                    title={`${week.week}: ${week.timeSpent} phút`}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2 text-center">
                                {week.week}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mt-1">
                                {week.timeSpent}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Biểu đồ độ chính xác */}
            <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">Độ chính xác (%)</h4>
                <div className="flex items-end space-x-2 h-32">
                    {data.map((week, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="relative w-full">
                                <div
                                    className={`rounded-t-lg transition-all duration-500 cursor-pointer ${week.accuracy >= 80 ? 'bg-green-500 hover:bg-green-600' :
                                        week.accuracy >= 60 ? 'bg-yellow-500 hover:bg-yellow-600' :
                                            'bg-red-500 hover:bg-red-600'
                                        }`}
                                    style={{
                                        height: `${week.accuracy}%`,
                                        minHeight: '20px'
                                    }}
                                    title={`${week.week}: ${week.accuracy}%`}
                                ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2 text-center">
                                {week.week}
                            </div>
                            <div className="text-sm font-medium text-gray-700 mt-1">
                                {week.accuracy}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chú thích */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                    <span>Từ vựng</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span>Bài tập</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                    <span>Thời gian</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                    <span>Độ chính xác</span>
                </div>
            </div>
        </div>
    );
};
