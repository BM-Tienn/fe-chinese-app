import React from 'react';
import { BrainIcon } from '../icons';

interface ImageUploadSectionProps {
  image: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyze: () => void;
  loading: boolean;
  error?: string | null;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  image,
  onImageChange,
  onAnalyze,
  loading,
  error,
}) => {
  return (
    <>
      <div className='border-b pb-6 mb-6'>
        <h2 className='text-2xl font-semibold mb-4 text-gray-700'>
          Tải ảnh lên để phân tích từ vựng và phát âm
        </h2>
        <div className='flex flex-col md:flex-row items-center gap-6'>
          <div className='w-full md:w-1/2'>
            <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
              <div className='space-y-1 text-center'>
                <svg
                  className='mx-auto h-12 w-12 text-gray-400'
                  stroke='currentColor'
                  fill='none'
                  viewBox='0 0 48 48'
                  aria-hidden='true'
                >
                  <path
                    d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <label
                  htmlFor='file-input'
                  className='relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500'
                >
                  <span>Tải tệp lên</span>
                  <input
                    id='file-input'
                    name='file-input'
                    type='file'
                    className='sr-only'
                    accept='image/*'
                    onChange={onImageChange}
                  />
                </label>
              </div>
            </div>
          </div>
          {image && (
            <div className='w-full md:w-1/2 mt-4 md:mt-0'>
              <img
                src={image}
                alt='Nội dung học'
                className='rounded-lg shadow-md max-h-64 w-auto mx-auto'
              />
            </div>
          )}
        </div>
      </div>

      {image && (
        <div className='text-center my-6'>
          {error && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
              <div className='flex items-start'>
                <div className='flex-shrink-0'>
                  <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                    <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                  </svg>
                </div>
                <div className='ml-3 flex-1'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-sm font-medium text-red-800'>Lỗi khi phân tích hình ảnh</h3>
                    <button
                      onClick={() => navigator.clipboard.writeText(error)}
                      className='text-red-400 hover:text-red-600 transition-colors'
                      title='Copy error message'
                    >
                      <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2m-6-4l2 2 4-4m-6 4V8' />
                      </svg>
                    </button>
                  </div>
                  <div className='mt-2 text-sm text-red-700'>
                    <p className='whitespace-pre-wrap break-words'>{error}</p>
                  </div>
                  <div className='mt-2 text-xs text-red-500'>
                    <p>Vui lòng thử lại hoặc liên hệ hỗ trợ nếu lỗi vẫn tiếp tục.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={onAnalyze}
            disabled={loading}
            className='inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-transform transform hover:scale-105'
          >
            <BrainIcon />
            {loading ? 'Đang phân tích...' : 'Phân tích với AI'}
          </button>
        </div>
      )}
    </>
  );
};
