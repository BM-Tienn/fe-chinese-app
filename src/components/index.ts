// Common Components
export { DataPreview } from './common/DataPreview';
export { ExercisesDisplay } from './common/ExercisesDisplay';
export { HistoryDisplay } from './common/HistoryDisplay';
export { ImageAnalysisDisplay } from './common/ImageAnalysisDisplay';
export { LoadingSpinner } from './common/LoadingSpinner';
export { PronunciationDisplay } from './common/PronunciationDisplay';
export { VocabularyDisplay } from './common/VocabularyDisplay';

// Dashboard Components
export { AchievementBadge } from './dashboard/AchievementBadge';
export { DashboardSection } from './dashboard/DashboardSection';
export { LearningStats } from './dashboard/LearningStats';
export { ProgressChart } from './dashboard/ProgressChart';

// Icon Components
export { BrainIcon, CloseIcon, ExerciseIcon, InfoIcon, LightbulbIcon, LinkIcon, MicIcon, QuoteIcon, SpeakerIcon } from './icons';

// Layout Components
export { Footer } from './layout/Footer';
export { Header } from './layout/Header';

// Modal Components
export { LoginModal } from './modals/LoginModal';
export { PronunciationPracticeModal } from './modals/PronunciationPracticeModal';
export { WordDetailModal } from './modals/WordDetailModal';

// Other Components
export { default as NotificationProvider } from './NotificationProvider';

// Section Components
export { AnalysisSection } from './sections/AnalysisSection';
export { ExercisesSection } from './sections/ExercisesSection';
export { HistorySection } from './sections/HistorySection';
export { ImageUploadSection } from './sections/ImageUploadSection';

// Vocabulary Components
export { AddWordModal } from './vocabulary/AddWordModal';
export { FlashcardSystem } from './vocabulary/FlashcardSystem';
export { VocabularyList } from './vocabulary/VocabularyList';
export { VocabularyManager } from './vocabulary/VocabularyManager';

// Re-export notification utilities
export * from '../store/slices/notificationSlice';
export * from '../utils/notifications';

