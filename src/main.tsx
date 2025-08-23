import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './assets/index.css';
import { validateRequiredEnvVars } from './config/api.ts';
import { store } from './store/store.ts';

// Validate biến môi trường bắt buộc trước khi khởi động
try {
  validateRequiredEnvVars();
} catch (error) {
  console.error('Environment validation failed:', error);
  // Hiển thị lỗi cho user
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; text-align: center;">
        <h1 style="color: #dc2626;">Lỗi cấu hình</h1>
        <p style="color: #6b7280; margin: 20px 0;">
          ${error instanceof Error ? error.message : 'Thiếu biến môi trường bắt buộc'}
        </p>
        <p style="color: #6b7280; font-size: 14px;">
          Vui lòng kiểm tra file .env và đảm bảo REACT_APP_BACKEND_URL được thiết lập đúng.
        </p>
      </div>
    `;
  }
  throw error;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
