import { FormEvent, ReactNode } from 'react';

/**
 * @interface InputControlTrackedProps
 * @description The props for the InputControlTracked component
 */
interface InputControlTrackedProps {
    id: string;
    type: string;
    label: string;
    name: string;
    options?: ReactNode;
    onChange: (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    value: string;
}

/**
 * @function InputControlTracked
 * @param {InputControlTrackedProps} props
 * @returns {ReactNode}
 */
const InputControlTracked = (props: InputControlTrackedProps): ReactNode => {
    const { id, type, label, name, options, onChange, value } = props;
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
