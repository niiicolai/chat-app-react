import Toast from "../../models/toast";
import { JSX } from "react";

/**
 * @constant types
 * @description The toast types
 */
const types: { [key: string]: string } = {
    primary: 'bg-indigo-500 text-white',
    secondary: 'bg-gray-500 text-white',
    error: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
};

/**
 * @interface ToastListItemProps
 * @description The props for the ToastListItem component
 */
interface ToastListItemProps {
    toast: Toast;
}

/**
 * @function ToastListItem
 * @param {ToastListItemProps} props
 * @returns {JSX.Element}
 */
const ToastListItem = (props: ToastListItemProps): JSX.Element => {
    const { message, type } = props.toast;

    return (
        <>
            {message &&
                <p className={`${types[type]} p-3 text-sm rounded-md text-center font-bold`}>
                    {message}
                </p>
            }
        </>
    );
};

export default ToastListItem;
