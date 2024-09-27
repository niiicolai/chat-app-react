import { ToastContext } from '../context/toastContext';
import { ReactNode } from 'react';
import { useState } from 'react';
import Toast from '../models/toast';
import { v4 as uuidv4 } from 'uuid';

/**
 * @interface ToastProviderProps
 * @description The toast provider props
 * @param {ReactNode} slot - The slot
 */
interface ToastProviderProps {
    slot: ReactNode;
}

/**
 * @function ToastProvider
 * @description The toast provider
 * @param {ToastProviderProps} props - The props
 * @returns {ReactNode} ReactNode
 */
function ToastProvider(props: ToastProviderProps): ReactNode {
    const [ toasts, setToasts ] = useState<Toast[]>([]);
    const { slot } = props;

    const addToast = (options: {message: string, type: string, duration: number}) => {
        const uuid = uuidv4();
        const toast = { uuid, ...options };
        setToasts([...toasts, toast]);
        setTimeout(() => {
            removeToast(uuid);
        }, options.duration);
    };

    const removeToast = (uuid: string) => {
        setToasts(prevToasts => prevToasts.filter((t: Toast) => t.uuid !== uuid));
    };
    
    return (
        <ToastContext.Provider value={{ toasts, setToasts, addToast, removeToast }}> 
            {slot}
        </ToastContext.Provider>
    );
}

export default ToastProvider;
