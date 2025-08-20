import React from 'react';
import NotificationsSystem, { atalhoTheme, setUpNotifications } from 'reapop';
import { useAppDispatch } from '../store/hooks';
import { hideNotification } from '../store/slices/notificationSlice';

interface NotificationProviderProps {
    children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const dispatch = useAppDispatch();

    // Thiết lập notification system
    React.useEffect(() => {
        setUpNotifications({
            defaultProps: {
                position: 'top-right',
                dismissible: true,
                dismissAfter: 5000,
                showDismissButton: true,
                allowHTML: true,
            },
        });
    }, []);

    return (
        <>
            {children}
            <NotificationsSystem
                theme={atalhoTheme}
                notifications={[]}
                dismissNotification={(id: string) => dispatch(hideNotification(id))}
            />
        </>
    );
};

export default NotificationProvider;
