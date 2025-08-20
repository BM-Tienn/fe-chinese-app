import React, { useEffect, useState } from 'react';
import { CloseIcon } from '../icons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, displayName?: string) => Promise<void>;
  loading?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  loading = false,
}) => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  // Reset form khi modal mở
  useEffect(() => {
    if (isOpen) {
      // Kiểm tra xem có base64 email trong localStorage không
      const base64Email = localStorage.getItem('chinese_ai_email_base64');
      if (base64Email) {
        try {
          const decodedEmail = atob(base64Email);
          setEmail(decodedEmail);
        } catch (error) {
          console.error('Lỗi khi decode base64 email:', error);
          setEmail('');
        }
      } else {
        setEmail('');
      }
      setDisplayName('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Email không hợp lệ');
      return;
    }

    try {
      await onLogin(email.trim(), displayName.trim() || undefined);
    } catch (err) {
      setError('Đã có lỗi xảy ra khi đăng nhập');
    }
  };

  const handleClose = () => {
    if (!loading) {
      setEmail('');
      setDisplayName('');
      setError('');
      onClose();
    }
  };

  return (
    <div className='modal-overlay p-4'>
      <div
        className='modal-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='p-6 border-b'>
          <div className='flex justify-between items-start'>
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                Chào mừng bạn!
              </h2>
              <p className='text-gray-500 mt-1'>
                Nhập email để bắt đầu học tiếng Trung
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className='text-gray-400 hover:text-gray-600 p-2 -mt-2 -mr-2 rounded-full hover:bg-gray-100 disabled:opacity-50'
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='p-6'>
          <div className='space-y-4'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Email <span className='text-red-500'>*</span>
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='example@email.com'
                disabled={loading}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500'
                required
              />
            </div>

            <div>
              <label
                htmlFor='displayName'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Tên hiển thị (tùy chọn)
              </label>
              <input
                id='displayName'
                type='text'
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder='Tên của bạn'
                disabled={loading}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500'
              />
            </div>

            {error && (
              <div className='text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200'>
                {error}
              </div>
            )}

            <div className='pt-4'>
              <button
                type='submit'
                disabled={loading || !email.trim()}
                className='w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors'
              >
                {loading ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                    Đang xử lý...
                  </>
                ) : (
                  'Bắt đầu học'
                )}
              </button>
            </div>

            <div className='text-xs text-gray-500 text-center'>
              Bằng cách tiếp tục, bạn đồng ý với điều khoản sử dụng của chúng tôi
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
