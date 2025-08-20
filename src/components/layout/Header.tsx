import React from 'react';
import { sessionManager } from '../../services/sessionManager';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/userSlice';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.user);

  const handleLogout = () => {
    sessionManager.clearSession();

    // Dispatch logout action
    dispatch(logout());
  };

  return (
    <header className='mb-8'>
      <div className='flex justify-between items-center mb-4'>
        <div className='text-left'>
          {user && (
            <div className='text-sm text-gray-600'>
              <p>
                Xin chào,{' '}
                <span className='font-semibold'>
                  {user.displayName || user.email}
                </span>
              </p>
              {/* <p className='text-xs'>Lần đăng nhập: {user.loginCount}</p> */}
            </div>
          )}
        </div>

        {user && (
          <button
            onClick={handleLogout}
            className='px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
          >
            Đăng xuất
          </button>
        )}
      </div>

      <div className='text-center'>
        <h1 className='text-4xl md:text-5xl font-bold text-blue-600'>
          Learn Chinese
        </h1>
        <p className='text-gray-600 mt-2'>
          Nâng cao kỹ năng với phân tích phát âm và bài tập đa dạng!
        </p>
      </div>
    </header>
  );
};
