/// <reference types="vite/client" />

// Hỗ trợ process.env cho tương thích với Create React App
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_BACKEND_URL: string
      REACT_APP_APP_NAME: string
      REACT_APP_APP_VERSION: string
      REACT_APP_API_TIMEOUT: string
      NODE_ENV: 'development' | 'production' | 'test'
    }
  }
}

export { }

