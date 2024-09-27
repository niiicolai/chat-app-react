import { ToastContext } from '../context/toastContext';
import { JSX } from 'react';
import { useState } from 'react';
import Toast from '../models/toast';
import { v4 as uuidv4 } from 'uuid';

/**
 * @interface ToastProviderProps
 * @description The toast provider props
 */
interface ToastProviderProps {
    slot: JSX.Element;
}

/**
 * @function ToastProvider
 * @description The toast provider
 * @param {ToastProviderProps} props - The props
 * @returns {JSX.Element} JSX.Element
 */
function ToastProvider(props: ToastProviderProps): JSX.Element {
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
