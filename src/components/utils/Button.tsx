import { JSX } from 'react';

/**
 * @constant types
 * @description Button CSS types
 */
const types: { [key: string]: string } = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-600 hover:ring-2 hover:ring-indigo-800 disabled:bg-gray-500 disabled:cursor-not-allowed',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 hover:ring-2 hover:ring-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed',
    error: 'bg-red-500 text-white hover:ring-2 hover:ring-red-800 disabled:bg-gray-500 disabled:cursor-not-allowed',
    success: 'bg-green-500 text-white hover:ring-2 hover:ring-green-800 disabled:bg-gray-500 disabled:cursor-not-allowed',
    warning: 'bg-yellow-500 text-white hover:ring-2 hover:ring-yellow-800 disabled:bg-gray-500 disabled:cursor-not-allowed',
};

/**
 * @interface ButtonProps
 * @description The props for the Button component
 */
interface ButtonProps {
    onClick?: () => void;
    slot: JSX.Element | string;
    type?: string;
    display?: string;
    button?: 'button' | 'submit' | 'reset';
    title?: string;
    disabled?: boolean;
    testId?: string;
}

/**
 * @function Button
 * @param {ButtonProps} props
 * @returns {JSX.Element}
 */
const Button = (props: ButtonProps): JSX.Element => {
    const { button, onClick, slot, display, title, type, disabled, testId } = props;
    const displayClass = display ? display : 'px-6 py-1 w-full block';
    const styling = type ? types[type] : types.primary;
    const buttonType = button ? button : 'button';
    const finalTitle = title ? title : '';
    const finalDisabled = disabled === true ? true : false;
    const finalTestId = testId ? testId : '';

    if (!onClick) {
        return (
            <button type={buttonType} disabled={finalDisabled} data-testid={finalTestId}
                className={`${styling} ${displayClass} transition-all rounded-md`}
                title={finalTitle}>
                {slot}
            </button>
        );
    }

    return (
        <button type={buttonType} disabled={finalDisabled} data-testid={finalTestId}
            className={`${styling} ${displayClass} transition-all rounded-md`}
            onClick={onClick}
            title={finalTitle}>
            {slot}
        </button>
    );
};

export default Button;
