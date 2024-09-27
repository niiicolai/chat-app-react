import { ReactNode } from 'react';

/**
 * @constant types
 * @description Link CSS types
 */
const types: { [key: string]: string } = {
    primary: 'text-indigo-500 hover:text-indigo-600',
    error: 'text-red-500 hover:text-indigo-600',
    success: 'text-green-500 hover:text-indigo-600',
    warning: 'text-yellow-500 hover:text-indigo-600',
};

/**
 * @interface LinkProps
 * @description The props for the Link component
 */
interface LinkProps {
    type?: string;
    href: string;
    slot: ReactNode;
}

/**
 * @function Link
 * @param {LinkProps} props
 * @returns {ReactNode}
 */
const Link = (props: LinkProps): ReactNode => {
    const { href, slot, type } = props;
    const styling = type ? types[type] : types.primary;

    return (
        <a href={href} className={`${styling} hover:underline`}>
            {slot}
        </a>
    );
};

export default Link;
