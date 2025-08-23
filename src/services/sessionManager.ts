import backendService from './backendService';

interface SessionInfo {
    sessionId: string;
    userId: string;
    isActive: boolean;
    lastActivity: string;
}

class SessionManager {
    private currentSession: SessionInfo | null = null;
    private isInitializing = false;
    private initPromise: Promise<SessionInfo> | null = null;

    // Khởi tạo session một lần duy nhất
    async initializeSession(): Promise<SessionInfo> {
        // Nếu đã có session và đang khởi tạo, đợi
        if (this.isInitializing && this.initPromise) {
            return this.initPromise;
        }

        // Nếu đã có session hợp lệ, trả về luôn
        if (this.currentSession && this.isSessionValid()) {
            return this.currentSession;
        }

        // Nếu chưa khởi tạo, bắt đầu khởi tạo
        if (!this.isInitializing) {
            this.isInitializing = true;
            this.initPromise = this._initializeSession();
        }

        return this.initPromise!;
    }

    private async _initializeSession(): Promise<SessionInfo> {
        try {
            // Kiểm tra localStorage trước
            const savedSessionId = localStorage.getItem('chinese_ai_session_id');
            const savedUserId = localStorage.getItem('chinese_ai_user_id');

            if (savedSessionId && savedUserId) {
                // Thử validate session đã lưu
                try {
                    const sessionData = await this.validateExistingSession(savedSessionId);
                    this.currentSession = sessionData;
                    console.log('Đã khôi phục session từ localStorage:', savedSessionId);
                    return sessionData;
                } catch (error) {
                    console.log('Session đã hết hạn, xóa khỏi localStorage');
                    localStorage.removeItem('chinese_ai_session_id');
                    localStorage.removeItem('chinese_ai_user_id');
                }
            }

            // Không có session hợp lệ, tạo mới
            const newSession = await this.createNewSession();
            this.currentSession = newSession;
            return newSession;
        } catch (error) {
            console.error('Lỗi khi khởi tạo session:', error);
            throw error;
        } finally {
            this.isInitializing = false;
            this.initPromise = null;
        }
    }

    // Validate session hiện có
    private async validateExistingSession(sessionId: string): Promise<SessionInfo> {
        try {
            // Sử dụng backendService thay vì fetch trực tiếp
            const response = await backendService.sessionService.getSession(sessionId);

            if (response.data && response.data.success && response.data.data) {
                const sessionData = response.data.data;
                return {
                    sessionId: sessionData.sessionId,
                    userId: sessionData.userId || 'anonymous',
                    isActive: sessionData.isActive,
                    lastActivity: sessionData.lastActivity
                };
            }

            throw new Error('Session không hợp lệ hoặc đã hết hạn');
        } catch (error) {
            throw new Error('Không thể validate session');
        }
    }

    // Tạo session mới (anonymous)
    private async createNewSession(): Promise<SessionInfo> {
        try {
            const response = await backendService.sessionService.createSession({
                userId: 'anonymous',
                userAgent: navigator.userAgent,
                deviceInfo: {
                    platform: navigator.platform,
                    language: navigator.language,
                    cookieEnabled: navigator.cookieEnabled,
                    onLine: navigator.onLine,
                },
            });

            if (response.data && response.data.success && response.data.data) {
                const session = response.data.data;

                // Lưu session mới vào localStorage
                localStorage.setItem('chinese_ai_session_id', session.sessionId);
                localStorage.setItem('chinese_ai_user_id', 'anonymous');

                return {
                    sessionId: session.sessionId,
                    userId: 'anonymous',
                    isActive: session.isActive,
                    lastActivity: session.lastActivity
                };
            }

            throw new Error('Không thể tạo session mới');
        } catch (error) {
            throw new Error('Lỗi khi tạo session mới');
        }
    }

    // Lấy session hiện tại
    getCurrentSession(): SessionInfo | null {
        return this.currentSession;
    }

    // Kiểm tra session có hợp lệ không
    private isSessionValid(): boolean {
        if (!this.currentSession) return false;

        // Kiểm tra session có quá cũ không (24 giờ)
        const lastActivity = new Date(this.currentSession.lastActivity);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

        return hoursDiff < 24;
    }

    // Cập nhật session khi user đăng nhập
    updateSessionAfterLogin(sessionId: string, userId: string): void {
        this.currentSession = {
            sessionId,
            userId,
            isActive: true,
            lastActivity: new Date().toISOString()
        };

        // Lưu vào localStorage
        localStorage.setItem('chinese_ai_session_id', sessionId);
        localStorage.setItem('chinese_ai_user_id', userId);
    }

    // Xóa session khi logout
    clearSession(): void {
        this.currentSession = null;
        localStorage.removeItem('chinese_ai_session_id');
        localStorage.removeItem('chinese_ai_user_id');
    }

    // Lưu hoạt động và cập nhật lastActivity
    async trackActivity(action: string, page: string, component?: string, details?: any): Promise<void> {
        if (!this.currentSession) {
            console.warn('Không có session để track activity');
            return;
        }

        try {
            await backendService.activityService.saveActivity({
                sessionId: this.currentSession.sessionId,
                userId: this.currentSession.userId === 'anonymous' ? undefined : this.currentSession.userId,
                action: action as any,
                page,
                component,
                details,
                userAgent: navigator.userAgent,
            });

            // Cập nhật lastActivity
            await backendService.sessionService.updateSessionActivity(this.currentSession.sessionId);

            // Cập nhật local session info
            if (this.currentSession) {
                this.currentSession.lastActivity = new Date().toISOString();
            }
        } catch (error) {
            console.error('Lỗi khi track activity:', error);
        }
    }
}

// Export singleton instance
export const sessionManager = new SessionManager();
export default sessionManager;
