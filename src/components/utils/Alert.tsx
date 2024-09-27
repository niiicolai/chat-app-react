import { ReactNode } from 'react';

/**
 * @constant types
 * @description Alert CSS types
 */
const types: { [key: string]: string } = {
    error: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
};

/**
 * @interface AlertProps
 * @description The props for the Alert component
 */
interface AlertProps {
    type?: string | null;
    message?: string | null;
}

/**
 * @function Alert
 * @param {AlertProps} props
 * @returns {ReactNode}
 */
const Alert = (props: AlertProps): ReactNode => {
    const { message, type } = props;
    const styling = type ? types[type] : types.error;
    return (
        <>
            {message &&
                <p className={`${styling} p-3 text-sm rounded-md text-center font-bold`}>
                    {props.message}
                </p>
            }
        </>
    );
};

export default Alert;
