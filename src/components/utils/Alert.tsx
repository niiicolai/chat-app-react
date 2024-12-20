import { JSX } from 'react';

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
    message?: string | null | unknown;
    testId?: string | null;
}

/**
 * @function Alert
 * @param {AlertProps} props
 * @returns {JSX.Element}
 */
const Alert = (props: AlertProps): JSX.Element => {
    const { message, type, testId } = props;
    const styling = type ? types[type] : types.error;
    return (
        <>
            {message &&
                <p className={`${styling} p-3 text-sm rounded-md text-center font-bold`} data-testid={testId || ''}>
                    {props.message?.toString()}
                </p>
            }
        </>
    );
};

export default Alert;
