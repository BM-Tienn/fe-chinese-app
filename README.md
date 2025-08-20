# Ứng dụng Học Tiếng Trung cùng AI

Ứng dụng React + TypeScript + Vite để học tiếng Trung với sự hỗ trợ của AI Gemini.

## 🚀 Tính năng

- **Phân tích hình ảnh**: Tải lên hình ảnh và AI sẽ phân tích để tạo bài học
- **Từ vựng tương tác**: Click vào từ để xem chi tiết và luyện tập
- **Luyện phát âm**: Ghi âm và nhận phản hồi từ AI về phát âm
- **Bài tập đa dạng**: Trắc nghiệm, điền từ, dịch câu, tạo câu
- **Giao diện hiện đại**: Thiết kế responsive với Tailwind CSS

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **AI API**: Google Gemini
- **Code Quality**: ESLint + Prettier

## 📁 Cấu trúc dự án

```
src/
├── components/          # React components
│   ├── common/         # Components dùng chung
│   ├── icons/          # SVG icons
│   ├── layout/         # Layout components
│   ├── modals/         # Modal components
│   └── sections/       # Section components
├── store/              # Redux store
│   ├── slices/         # Redux slices
│   ├── hooks.ts        # Custom Redux hooks
│   └── store.ts        # Store configuration
├── services/           # API services
├── assets/             # Static assets
└── App.tsx            # Main component
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js 16+
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình biến môi trường

Tạo file `.env` trong thư mục gốc của dự án:

```bash
# Copy file env.example
cp env.example .env
```

Cập nhật file `.env` với các giá trị thực tế:

```env
# Backend Configuration
REACT_APP_BACKEND_URL=http://localhost:3001

# App Configuration
REACT_APP_APP_NAME=Học Tiếng Trung cùng AI
REACT_APP_APP_VERSION=3.0.0

# API Configuration
REACT_APP_API_TIMEOUT=30000

# Development Configuration
NODE_ENV=development
```

### Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3789

### Build production

```bash
npm run build
```

## ⚙️ Cấu hình

### Biến môi trường

Dự án sử dụng chuẩn `REACT_APP_` cho biến môi trường (tương thích với Create React App):

- **REACT_APP_BACKEND_URL**: URL của backend server (mặc định: http://localhost:3001)
- **REACT_APP_API_TIMEOUT**: Timeout cho API calls (ms, mặc định: 30000)
- **REACT_APP_APP_NAME**: Tên ứng dụng
- **REACT_APP_APP_VERSION**: Phiên bản ứng dụng

### Port

Port mặc định là 3789, có thể thay đổi trong `vite.config.ts`:

```typescript
server: {
  port: 3789;
}
```

## 🔧 Development

### Scripts có sẵn

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview build
- `npm run lint` - Kiểm tra code style
- `npm run lint:fix` - Tự động sửa lỗi ESLint
- `npm run format` - Format code với Prettier
- `npm run format:check` - Kiểm tra format code
- `npm run type-check` - Kiểm tra TypeScript types

### Code Quality Tools

#### ESLint

- **Cấu hình**: `.eslintrc.cjs`
- **Rules**: TypeScript, React Hooks, Prettier integration
- **Ignore**: `.eslintignore`

#### Prettier

- **Cấu hình**: `.prettierrc`
- **Format**: Tự động format khi save
- **Ignore**: `.prettierignore`

#### VS Code Integration

- **Settings**: `.vscode/settings.json`
- **Extensions**: `.vscode/extensions.json`
- **Auto-format**: Format on save + ESLint auto-fix

### Cấu trúc Redux

- **analysisSlice**: Quản lý trạng thái phân tích hình ảnh
- **exercisesSlice**: Quản lý trạng thái bài tập
- **uiSlice**: Quản lý trạng thái UI (modals, loading)

### Components

- **Modular**: Mỗi component có trách nhiệm riêng biệt
- **Reusable**: Components có thể tái sử dụng
- **Type-safe**: Sử dụng TypeScript interfaces

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive**: Thiết kế mobile-first
- **Custom animations**: Fade-in effects và hover states
- **Consistent design**: Sử dụng design system nhất quán

## 📝 Ghi chú

- **Bắt buộc**: Cần có API key Gemini để sử dụng tính năng AI
- **Biến môi trường**: Sử dụng chuẩn `REACT_APP_` (tương thích CRA)
- **Hỗ trợ hình ảnh**: JPG, PNG, JPEG
- **Trình duyệt**: Cần hỗ trợ WebRTC để luyện phát âm
- **Speech API**: Speech Synthesis API để nghe phát âm mẫu

## 🔒 Bảo mật

- **Không commit**: File `.env` chứa API key thật
- **Gitignore**: File `.env` đã được thêm vào `.gitignore`
- **Env example**: Sử dụng `env.example` làm template

## 🛠️ Development Workflow

### 1. Code Quality

```bash
# Kiểm tra và sửa lỗi ESLint
npm run lint:fix

# Format code với Prettier
npm run format

# Kiểm tra TypeScript types
npm run type-check
```

### 2. Pre-commit Checklist

- [ ] Code đã được format với Prettier
- [ ] Không có lỗi ESLint
- [ ] TypeScript types đã được kiểm tra
- [ ] Tests đã pass (nếu có)

### 3. VS Code Setup

1. Cài đặt các extension được đề xuất
2. Enable "Format on Save"
3. Enable "Auto Fix on Save" cho ESLint

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.
