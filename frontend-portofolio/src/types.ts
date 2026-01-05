export interface SweetAlertOptions {
    title?: string;
    text?: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
    confirmText?: string;
    cancelText?: string;
}

export interface ApiError {
    message: string;
    status?: number;
}