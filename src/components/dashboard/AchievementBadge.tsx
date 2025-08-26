import React from 'react';
import { Achievement } from '../../store/slices/progressSlice';

interface AchievementBadgeProps {
    achievement: Achievement;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
    const isUnlocked = achievement.unlockedAt !== undefined;
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

    const getProgressColor = () => {
        if (isUnlocked) return 'bg-gradient-to-br from-yellow-400 to-orange-500';
        if (progressPercentage >= 75) return 'bg-gradient-to-br from-blue-400 to-purple-500';
        if (progressPercentage >= 50) return 'bg-gradient-to-br from-green-400 to-blue-500';
        return 'bg-gradient-to-br from-gray-300 to-gray-400';
    };

    const getBorderColor = () => {
        if (isUnlocked) return 'border-yellow-500';
        if (progressPercentage >= 75) return 'border-purple-500';
        if (progressPercentage >= 50) return 'border-blue-500';
        return 'border-gray-300';
    };

    return (
        <div className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105`}>
            {/* Badge chính */}
            <div className={`
        relative p-4 rounded-xl border-2 ${getBorderColor()} 
        ${isUnlocked ? 'shadow-lg' : 'shadow-sm'}
        transition-all duration-300
        ${isUnlocked ? 'opacity-100' : 'opacity-70'}
      `}>
                {/* Background gradient */}
                <div className={`absolute inset-0 rounded-xl ${getProgressColor()} opacity-10`}></div>

                {/* Icon */}
                <div className="text-center mb-3">
                    <div className={`
            text-4xl mb-2 transition-transform duration-300
            ${isUnlocked ? 'group-hover:scale-110' : ''}
          `}>
                        {achievement.icon}
                    </div>
                </div>

                {/* Tên thành tích */}
                <h4 className={`
          text-sm font-bold text-center mb-2 transition-colors duration-300
          ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}
        `}>
                    {achievement.name}
                </h4>

                {/* Mô tả */}
                <p className={`
          text-xs text-center mb-3 leading-tight transition-colors duration-300
          ${isUnlocked ? 'text-gray-600' : 'text-gray-400'}
        `}>
                    {achievement.description}
                </p>

                {/* Progress bar */}
                <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                        <span className={isUnlocked ? 'text-gray-600' : 'text-gray-400'}>
                            {achievement.progress}
                        </span>
                        <span className={isUnlocked ? 'text-gray-600' : 'text-gray-400'}>
                            / {achievement.maxProgress}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ${isUnlocked
                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                                : progressPercentage >= 75
                                    ? 'bg-gradient-to-r from-purple-400 to-blue-500'
                                    : progressPercentage >= 50
                                        ? 'bg-gradient-to-r from-blue-400 to-green-500'
                                        : 'bg-gray-400'
                                }`}
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Trạng thái */}
                <div className="text-center">
                    {isUnlocked ? (
                        <div className="flex items-center justify-center">
                            <span className="text-xs text-yellow-600 font-medium">Đã mở khóa</span>
                            <svg className="w-4 h-4 ml-1 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    ) : (
                        <div className="text-xs text-gray-500">
                            {progressPercentage >= 75 ? 'Gần hoàn thành!' :
                                progressPercentage >= 50 ? 'Đang tiến bộ' :
                                    'Bắt đầu thôi!'}
                        </div>
                    )}
                </div>

                {/* Ngày mở khóa */}
                {isUnlocked && (
                    <div className="absolute top-2 right-2">
                        <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            {new Date(achievement.unlockedAt!).toLocaleDateString('vi-VN')}
                        </div>
                    </div>
                )}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                <div className="text-center">
                    <div className="font-medium mb-1">{achievement.name}</div>
                    <div className="text-gray-300">{achievement.description}</div>
                    {isUnlocked && (
                        <div className="text-yellow-300 mt-1">
                            Mở khóa: {new Date(achievement.unlockedAt!).toLocaleDateString('vi-VN')}
                        </div>
                    )}
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
        </div>
    );
};
