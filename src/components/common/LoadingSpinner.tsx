import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'AI đang xử lý, vui lòng chờ...',
}) => (
  <div className='flex justify-center items-center p-4 h-full'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
    <p className='ml-3 text-gray-600'>{text}</p>
  </div>
);
