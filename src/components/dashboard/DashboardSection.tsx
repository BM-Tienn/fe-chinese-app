import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    checkAndUpdateAchievements,
    fetchAchievements,
    fetchUserProgress,
    fetchWeeklyProgress
} from '../../store/slices/progressSlice';
import { AppDispatch, RootState } from '../../store/store';
import { AchievementBadge } from './AchievementBadge';
import { LearningStats } from './LearningStats';
import { ProgressChart } from './ProgressChart';

export const DashboardSection: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        totalWords,
        masteredWords,
        learningStreak,
        currentLevel,
        experiencePoints,
        weeklyProgress,
        achievements,
        loading,
        error
    } = useSelector((state: RootState) => state.progress);

    useEffect(() => {
        // Tải dữ liệu khi component mount
        dispatch(fetchUserProgress(undefined));
        dispatch(fetchWeeklyProgress(12));
        dispatch(fetchAchievements(undefined));
        dispatch(checkAndUpdateAchievements(undefined));
    }, [dispatch]);

    if (loading && weeklyProgress.length === 0) {
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
                    onClick={() => dispatch(fetchUserProgress(undefined))}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    const completionRate = totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0;
    const xpForNextLevel = Math.pow(currentLevel + 1, 2) * 100;
    const levelProgress = Math.round(((experiencePoints % xpForNextLevel) / xpForNextLevel) * 100);

    return (
        <div className="space-y-6">
            {/* Header với thông tin tổng quan */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold mb-4">Bảng điều khiển học tập</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold">{currentLevel}</div>
                        <div className="text-sm opacity-90">Cấp độ</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">{experiencePoints}</div>
                        <div className="text-sm opacity-90">XP</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">{learningStreak}</div>
                        <div className="text-sm opacity-90">Ngày liên tiếp</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">{completionRate}%</div>
                        <div className="text-sm opacity-90">Hoàn thành</div>
                    </div>
                </div>

                {/* Progress bar cho level */}
                <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Level {currentLevel}</span>
                        <span>Level {currentLevel + 1}</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${levelProgress}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-center mt-1">
                        {experiencePoints % xpForNextLevel} / {xpForNextLevel} XP
                    </div>
                </div>
            </div>

            {/* Thống kê chính */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Từ vựng đã học</p>
                            <p className="text-2xl font-bold text-gray-900">{totalWords}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Từ đã thuộc lòng</p>
                            <p className="text-2xl font-bold text-gray-900">{masteredWords}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Chuỗi học tập</p>
                            <p className="text-2xl font-bold text-gray-900">{learningStreak} ngày</p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0-.768.293-1.536.879-2.121z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Biểu đồ tiến độ tuần */}
            {weeklyProgress.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Tiến độ tuần</h2>
                    <ProgressChart data={weeklyProgress} />
                </div>
            )}

            {/* Thống kê học tập chi tiết */}
            {weeklyProgress.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Thống kê học tập</h2>
                    <LearningStats weeklyProgress={weeklyProgress} />
                </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Thành tích</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {achievements.map((achievement) => (
                            <AchievementBadge key={achievement.id} achievement={achievement} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
