import { FormEvent, JSX } from 'react';

/**
 * @interface InputControlTrackedProps
 * @description The props for the InputControlTracked component
 */
interface InputControlTrackedProps {
    id: string;
    type: string;
    label: string;
    name: string;
    options?: JSX.Element[];
    onChange: (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    value: string;
    footerSlot?: JSX.Element;
}

/**
 * @function InputControlTracked
 * @param {InputControlTrackedProps} props
 * @returns {JSX.Element}
 */
const InputControlTracked = (props: InputControlTrackedProps): JSX.Element => {
    const { id, type, label, name, options, onChange, value, footerSlot } = props;
    const inputClassNames = "text-black w-full border p-3 rounded-md text-black text-sm focus:ring-2 focus:ring-indigo-800 focus:outline-none";

    return (
        <div className="mb-3 flex items-center gap-6">
            <label className="block mb-1 w-24">{label}</label>

            {type === 'textarea' &&
                <textarea
                    id={id}
                    name={name}
                    className={inputClassNames}
                    onChange={onChange}
                    value={value}
                />
            }
            {type === 'select' &&
                <select
                    id={id} 
                    name={name}
                    className={inputClassNames}
                    onChange={onChange}
                    value={value}
                >{options}</select>
            }
            {type === 'file' &&
                <div className="w-full bg-white rounded-md">
                    <input
                        id={id}
                        type={type}
                        name={name}
                        className={inputClassNames}
                        onChange={onChange}
                    />
                    {value && <img src={value} alt={value} />}
                    {footerSlot}
                </div>

            }
            {type !== 'textarea' && type !== 'select' && type !== 'file' &&
                <input
                    id={id}
                    type={type}
                    name={name}
                    className={inputClassNames}
                    onChange={onChange}
                    value={value}
                />
            }
        </div>
    );
};

export default InputControlTracked;
