import { JSX } from 'react';

/**
 * @constant types
 * @description Progress CSS types
 */
const types: { [key: string]: { fill: string, bgg: string } } = {
    primary: { fill: 'bg-indigo-500', bgg: 'bg-gray-500 text-white' },
    secondary: { fill: 'bg-gray-700', bgg: 'bg-gray-500 text-white' },
    error: { fill: 'bg-red-500', bgg: 'bg-gray-500 text-white' },
    success: { fill: 'bg-green-500', bgg: 'bg-gray-500 text-white' },
    warning: { fill: 'bg-orange-500', bgg: 'bg-gray-500 text-white' },
};

/**
 * @interface ProgressProps
 * @description The props for the Progress component
 */
interface ProgressProps {
    slot: JSX.Element;
    type?: string;
    value: number;
    max: number;
}

/**
 * @function Progress
 * @param {ProgressProps} props
 * @returns {JSX.Element}
 */
const Progress = (props: ProgressProps): JSX.Element => {
    const { slot, type, value, max } = props;
    const percentage = ( value / max ) * 100;
    const styling = type ? types[type] : types.primary;

    return (
        <div className={`${ styling.bgg } relative flex items-center justify-between gap-2 p-2 rounded-md overflow-hidden`}>
            <div style={{ width: `${ percentage }%` }} className={`${ styling.fill } rounded-md absolute left-0 top-0 bottom-0`} />
            <div className="relative">{ slot }</div>
        </div>
    );
};

export default Progress;
