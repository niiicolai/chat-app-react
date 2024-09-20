
const InputControl = (props: any) => {
    const { id, type, label, name, defaultValue, options } = props;
    const inputClassNames = "text-black w-full border p-3 rounded-md text-black text-sm focus:ring-2 focus:ring-indigo-800 focus:outline-none";
    return (
        <div className="mb-3 flex items-center gap-6">
            <label className="block mb-1 w-24">{label}</label>

            {type === 'textarea' &&
                <textarea
                    id={id}
                    name={name}
                    defaultValue={defaultValue}
                    className={inputClassNames}
                />
            }

            {type === 'select' &&
                <select
                    id={id} name={name}
                    defaultValue={defaultValue}
                    className={inputClassNames}
                >{options}</select>
            }

            {type === 'file' &&
                <div className="w-full bg-white rounded-md">
                    <input
                        id={id}
                        type={type}
                        name={name}
                        className={inputClassNames}
                    />
                    {defaultValue && <img src={defaultValue} alt={defaultValue} />}
                </div>

            }

            {type !== 'textarea' && type !== 'select' && type !== 'file' &&
                <input
                    id={id}
                    type={type}
                    name={name}
                    defaultValue={defaultValue}
                    className={inputClassNames}
                />
            }
        </div>
    );
};

export default InputControl;
