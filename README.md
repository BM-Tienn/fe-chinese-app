# Frontend - Hán Ngữ Trợ Thủ (Chinese AI Learning Assistant)

## 🎯 Tổng Quan

Frontend React + TypeScript cho ứng dụng "Hán Ngữ Trợ Thủ" - một nền tảng học tiếng Trung thông minh tích hợp AI, cung cấp các tính năng:

- **AI-Powered Learning**: Phân tích hình ảnh, tạo bài tập, phân tích từ vựng với Gemini AI
- **Personalized Learning**: Quản lý từ vựng cá nhân, theo dõi tiến độ học tập
- **Smart Content Generation**: Tự động tạo nội dung học tập từ AI
- **Progress Tracking**: Hệ thống theo dõi tiến độ, achievements và spaced repetition
- **Session Management**: Quản lý phiên làm việc và hoạt động người dùng

## 🏗️ Kiến Trúc Hệ Thống

### Core Components

```
frontend/
├── 📁 src/
│   ├── 📁 components/          # React components
│   │   ├── 📁 common/         # Components dùng chung
│   │   ├── 📁 dashboard/      # Dashboard components
│   │   ├── 📁 icons/          # SVG icons
│   │   ├── 📁 layout/         # Layout components
│   │   ├── 📁 modals/         # Modal components
│   │   ├── 📁 sections/       # Section components
│   │   └── 📁 vocabulary/     # Vocabulary components
│   ├── 📁 store/              # Redux store
│   │   ├── 📁 slices/         # Redux slices
│   │   ├── hooks.ts           # Custom Redux hooks
│   │   └── store.ts           # Store configuration
│   ├── 📁 services/           # API services
│   ├── 📁 config/             # Configuration files
│   ├── 📁 assets/             # Static assets
│   └── App.tsx                # Main component
├── 📁 dist/                   # Build output
├── 📁 node_modules/           # Dependencies
├── package.json               # Dependencies & scripts
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

### Technology Stack

#### Core Framework

- **React 18** - Modern React với hooks và concurrent features
- **TypeScript 5.9** - Type-safe development
- **Vite 5.0** - Fast build tool và dev server

#### State Management

- **Redux Toolkit 2.0** - Modern Redux với RTK Query
- **React Redux 9.0** - React bindings cho Redux
- **Custom Hooks** - useAppDispatch, useAppSelector

#### UI & Styling

- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Custom Animations** - Fade-in effects và transitions

#### HTTP & API

- **Axios 1.6** - HTTP client
- **Session Management** - Custom session manager
- **API Service Layer** - Centralized API calls

#### Development Tools

- **ESLint 8.57** - Code linting
- **Prettier 3.0** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Tính Năng Chính

### 1. **AI-Powered Image Analysis**

- Tải lên hình ảnh và AI phân tích để tạo bài học
- Trích xuất từ vựng, ngữ pháp và đoạn văn mẫu
- Tích hợp với Google Gemini AI

### 2. **Interactive Vocabulary Learning**

- Click vào từ để xem chi tiết và luyện tập
- Hệ thống flashcard thông minh
- Spaced repetition algorithm
- Mastery level tracking (1-5)

### 3. **Pronunciation Practice**

- Ghi âm và nhận phản hồi từ AI về phát âm
- Speech synthesis để nghe phát âm mẫu
- Real-time waveform visualization

### 4. **Exercise Generation**

- Bài tập đa dạng: trắc nghiệm, điền từ, dịch câu
- Tự động tạo từ AI dựa trên từ vựng
- Hỗ trợ nhiều loại bài tập khác nhau

### 5. **Dashboard & Progress Tracking**

- Thống kê học tập chi tiết
- Achievement system với badges
- Weekly progress charts
- Learning streak tracking

### 6. **Personal Vocabulary Management**

- Thêm, chỉnh sửa, xóa từ vựng cá nhân
- Tag system và ghi chú
- Priority levels và study scheduling
- Review queue management

### 7. **Session Management**

- Anonymous session support
- User authentication với email
- Activity tracking và analytics
- Session persistence

## 📱 Giao Diện Người Dùng

### Design System

- **Responsive Design** - Mobile-first approach
- **Modern UI** - Clean, intuitive interface
- **Accessibility** - WCAG compliant
- **Dark/Light Theme** - Theme switching support

### Component Architecture

- **Modular Components** - Reusable và maintainable
- **Atomic Design** - Consistent component hierarchy
- **Type Safety** - Full TypeScript support
- **Performance** - Optimized rendering

## 🔧 Cài Đặt và Chạy

### Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn
- Modern browser với ES6+ support

### Cài đặt dependencies

```bash
cd frontend
npm install
```

### Cấu hình biến môi trường

Tạo file `.env` trong thư mục gốc:

```env
# Backend Configuration
REACT_APP_BACKEND_URL=http://localhost:3001

# App Configuration
REACT_APP_APP_NAME=Hán Ngữ Trợ Thủ
REACT_APP_APP_VERSION=3.0.0

# API Configuration
REACT_APP_API_TIMEOUT=30000

# Development Configuration
NODE_ENV=development
```

### Chạy ứng dụng

```bash
# Development mode
npm run start

# Build production
npm run build

# Preview build
npm run preview
```

Ứng dụng sẽ chạy tại: http://localhost:3789

## 🛠️ Development

### Scripts có sẵn

- `npm run start` - Chạy development server (port 3789)
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

## 📊 State Management

### Redux Store Structure

```typescript
store/
├── analysis/          # Phân tích hình ảnh
├── exercises/         # Bài tập và đáp án
├── history/           # Lịch sử AI interactions
├── notification/      # Hệ thống thông báo
├── progress/          # Tiến độ học tập
├── ui/                # UI state (modals, loading)
├── user/              # User authentication
└── vocabulary/        # Quản lý từ vựng cá nhân
```

### Key Features

- **Immutable Updates** - Sử dụng Immer
- **DevTools Integration** - Redux DevTools support
- **Middleware Support** - Custom middleware
- **Type Safety** - Full TypeScript integration

## 🌐 API Integration

### Service Layer

- **Centralized API calls** - Tất cả API calls qua service layer
- **Session Management** - Automatic session handling
- **Error Handling** - Consistent error handling
- **Request/Response Interceptors** - Axios interceptors

### Endpoints

- **AI Interactions** - Image analysis, exercise generation
- **User Management** - Authentication, session management
- **Vocabulary** - CRUD operations cho từ vựng
- **Progress Tracking** - Learning progress và achievements
- **Analytics** - User activity và performance metrics

## 🎨 Styling & UI

### Tailwind CSS

- **Utility-first approach** - Rapid UI development
- **Custom animations** - Fade-in effects và transitions
- **Responsive design** - Mobile-first responsive utilities
- **Custom components** - Reusable component classes

### Design Principles

- **Consistency** - Unified design language
- **Accessibility** - WCAG 2.1 AA compliance
- **Performance** - Optimized CSS delivery
- **Maintainability** - Scalable CSS architecture

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features

- Touch-friendly interactions
- Optimized layouts cho mobile
- Progressive Web App (PWA) ready
- Offline support capabilities

## 🚀 Performance Optimization

### Build Optimization

- **Code Splitting** - Dynamic imports và lazy loading
- **Tree Shaking** - Unused code elimination
- **Minification** - Terser optimization
- **Asset Optimization** - Image và font optimization

### Runtime Performance

- **React.memo** - Component memoization
- **useCallback/useMemo** - Hook optimization
- **Virtual Scrolling** - Large list optimization
- **Lazy Loading** - Component lazy loading

## 🔒 Security Features

### Authentication

- **Session-based auth** - Secure session management
- **Anonymous sessions** - Guest user support
- **Token validation** - Secure token handling
- **CSRF protection** - Cross-site request forgery protection

### Data Protection

- **Input validation** - Client-side validation
- **XSS prevention** - Cross-site scripting protection
- **Secure headers** - Security headers configuration
- **HTTPS enforcement** - Secure communication

## 📊 Analytics & Monitoring

### User Analytics

- **Session tracking** - User session analytics
- **Activity monitoring** - User behavior tracking
- **Performance metrics** - App performance monitoring
- **Error tracking** - Error logging và monitoring

### Performance Monitoring

- **Core Web Vitals** - LCP, FID, CLS tracking
- **Bundle analysis** - Bundle size monitoring
- **Runtime performance** - Real-time performance metrics
- **User experience** - UX metrics tracking

## 🧪 Testing

### Testing Strategy

- **Unit Testing** - Component testing
- **Integration Testing** - API integration testing
- **E2E Testing** - End-to-end testing
- **Performance Testing** - Load testing

### Testing Tools

- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Cypress** - E2E testing
- **Lighthouse** - Performance testing

## 📦 Deployment

### Build Process

```bash
npm run build
```

### Output Structure

```
dist/
├── assets/            # Optimized assets
├── index.html         # Main HTML file
└── manifest.json      # PWA manifest
```

### Deployment Options

- **Static Hosting** - Netlify, Vercel, GitHub Pages
- **CDN** - Cloudflare, AWS CloudFront
- **Container** - Docker deployment
- **Server** - Nginx, Apache

## 🔄 CI/CD

### Automated Workflows

- **Code Quality** - ESLint, Prettier, TypeScript checks
- **Testing** - Automated test execution
- **Build** - Automated build process
- **Deployment** - Automated deployment

### Quality Gates

- **Code Coverage** - Minimum coverage requirements
- **Performance Budget** - Bundle size limits
- **Accessibility** - WCAG compliance checks
- **Security** - Security vulnerability scanning

## 🤝 Contributing

### Development Workflow

1. Fork repository
2. Create feature branch
3. Make changes
4. Run tests và linting
5. Submit pull request

### Code Standards

- **TypeScript** - Strict type checking
- **ESLint** - Code style enforcement
- **Prettier** - Code formatting
- **Conventional Commits** - Commit message format

## 📚 Documentation

### API Documentation

- **OpenAPI/Swagger** - API specification
- **JSDoc** - Code documentation
- **Storybook** - Component documentation
- **README** - Project documentation

### User Guides

- **Getting Started** - Quick start guide
- **User Manual** - Detailed user guide
- **API Reference** - API documentation
- **Troubleshooting** - Common issues và solutions

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🆘 Support

### Getting Help

- **Documentation** - Comprehensive documentation
- **Issues** - GitHub issues tracking
- **Discussions** - Community discussions
- **Contact** - Direct support contact

### Community

- **GitHub** - Source code và issues
- **Discord** - Community chat
- **Forum** - User discussions
- **Blog** - Updates và tutorials
