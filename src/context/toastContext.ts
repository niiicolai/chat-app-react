import { createContext } from 'react';
import Toast from '../models/toast';

/**
 * @constant ToastContext
 * @description The current toast context
 */
export const ToastContext = createContext<{
    toasts: Toast[],
    setToasts: (toasts: Toast[]) => void
    addToast: (options: {message: string, type: string, duration: number}) => void,
    removeToast: (uuid: string) => void
}>({
    toasts: [],
    setToasts: () => { },
    addToast: () => { },
    removeToast: () => { }
});

