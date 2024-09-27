import { JSX } from 'react';

/**
 * @constant types
 * @description Badge CSS types
 */
const types: { [key: string]: string } = {
    primary: 'bg-indigo-500 text-white',
    error: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
};

/**
 * @interface BadgeProps
 * @description The props for the Badge component
 */
interface BadgeProps {
    type?: string;
    slot: JSX.Element | string;
    title: string;
}

/**
 * @function Badge
 * @param {BadgeProps} props
 * @returns {JSX.Element}
 */
const Badge = (props: BadgeProps): JSX.Element => {
    const { slot, title, type } = props;
    const styling = type ? types[type] : types.primary;
    
    return (
        <div title={title} className={`${styling} px-2 rounded-md inline-block text-xs flex items-center justify-center`} style={{ paddingTop: '.2em', paddingBottom: '.2em' }}>
            {slot}
        </div>
    );
};

export default Badge;
