import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    dismissNotification,
    dismissNotifications,
    notify
} from 'reapop';

export interface NotificationState {
    notifications: any[];
}

const initialState: NotificationState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<any>) => {
            state.notifications.push(action.payload);
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                notification => notification.id !== action.payload
            );
        },
        clearAllNotifications: (state) => {
            state.notifications = [];
        },
        updateNotification: (state, action: PayloadAction<{ id: string; updates: any }>) => {
            const { id, updates } = action.payload;
            const notificationIndex = state.notifications.findIndex(n => n.id === id);
            if (notificationIndex !== -1) {
                state.notifications[notificationIndex] = {
                    ...state.notifications[notificationIndex],
                    ...updates,
                };
            }
        },
    },
});

export const {
    addNotification: addNotificationAction,
    removeNotification: removeNotificationAction,
    clearAllNotifications,
    updateNotification: updateNotificationAction,
} = notificationSlice.actions;

// Thunk actions để tích hợp với reapop
export const showNotification = (notification: any) => (dispatch: any) => {
    const newNotification = notify(notification);
    dispatch(addNotificationAction(newNotification));
    return newNotification;
};

export const hideNotification = (id: string) => (dispatch: any) => {
    dismissNotification(id);
    dispatch(removeNotificationAction(id));
};

export const hideAllNotifications = () => (dispatch: any) => {
    dismissNotifications();
    dispatch(clearAllNotifications());
};

export default notificationSlice.reducer;
