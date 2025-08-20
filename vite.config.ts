import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { defineConfig, loadEnv } from 'vite'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      viteTsconfigPaths(),
    ],
    server: {
      port: 3789,
      host: true
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss,
          autoprefixer,
        ],
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    // Cấu hình để sử dụng process.env và REACT_APP_ prefix
    define: {
      // Tạo global process.env object
      'process.env': env,
      // Hỗ trợ REACT_APP_ prefix
      'process.env.REACT_APP_BACKEND_URL': JSON.stringify(env.REACT_APP_BACKEND_URL || 'http://localhost:3001'),
      'process.env.REACT_APP_APP_NAME': JSON.stringify(env.REACT_APP_APP_NAME || 'Học Tiếng Trung cùng AI'),
      'process.env.REACT_APP_APP_VERSION': JSON.stringify(env.REACT_APP_APP_VERSION || '3.0.0'),
      'process.env.REACT_APP_API_TIMEOUT': JSON.stringify(env.REACT_APP_API_TIMEOUT || '30000'),
    },
  }
})
