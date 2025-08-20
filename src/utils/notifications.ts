import { notify } from 'reapop';

// Các loại notification
export const createSuccessNotification = (title: string, message?: string) => {
    return notify({
        title,
        message,
        status: 'success',
        position: 'top-right',
        dismissible: true,
        dismissAfter: 5000,
    });
};

export const createErrorNotification = (title: string, message?: string) => {
    return notify({
        title,
        message,
        status: 'error',
        position: 'top-right',
        dismissible: true,
        dismissAfter: 8000,
    });
};

export const createWarningNotification = (title: string, message?: string) => {
    return notify({
        title,
        message,
        status: 'warning',
        position: 'top-right',
        dismissible: true,
        dismissAfter: 6000,
    });
};

export const createInfoNotification = (title: string, message?: string) => {
    return notify({
        title,
        message,
        status: 'info',
        position: 'top-right',
        dismissible: true,
        dismissAfter: 5000,
    });
};

// Custom notification với icon và styling
export const createCustomNotification = (config: {
    title: string;
    message?: string;
    status?: 'success' | 'error' | 'warning' | 'info';
    position?: string;
    dismissible?: boolean;
    dismissAfter?: number;
    icon?: string;
    className?: string;
}) => {
    return notify({
        title: config.title,
        message: config.message,
        status: config.status || 'info',
        position: config.position || 'top-right',
        dismissible: config.dismissible !== false,
        dismissAfter: config.dismissAfter || 5000,
        icon: config.icon,
        className: config.className,
    });
};

// Notification cho các action cụ thể
export const createSaveSuccessNotification = (itemName: string) => {
    return createSuccessNotification(
        'Lưu thành công',
        `${itemName} đã được lưu thành công!`
    );
};

export const createDeleteSuccessNotification = (itemName: string) => {
    return createSuccessNotification(
        'Xóa thành công',
        `${itemName} đã được xóa thành công!`
    );
};

export const createUpdateSuccessNotification = (itemName: string) => {
    return createSuccessNotification(
        'Cập nhật thành công',
        `${itemName} đã được cập nhật thành công!`
    );
};

export const createNetworkErrorNotification = () => {
    return createErrorNotification(
        'Lỗi kết nối',
        'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.'
    );
};

export const createValidationErrorNotification = (fieldName: string) => {
    return createErrorNotification(
        'Lỗi xác thực',
        `Vui lòng kiểm tra trường "${fieldName}" và thử lại.`
    );
};
