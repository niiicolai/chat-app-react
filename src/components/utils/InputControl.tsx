
const InputControl = (props: any) => {
    const { id, type, label, name, defaultValue, options } = props;
    const isTextarea = type === 'textarea';
    const isSelect = type === 'select';
    return (
        <div className="mb-3 flex items-center gap-6">
            <label className="block mb-1 w-24">{label}</label>

            {isTextarea &&
                <textarea
                    id={id}
                    name={name}
                    defaultValue={defaultValue}
                    className="text-black w-full border p-3 rounded-md text-black text-sm"
                />
            }

            {isSelect &&
                <select 
                    id={id} name={name} 
                    defaultValue={defaultValue} 
                    className="text-black w-full border p-3 rounded-md text-black text-sm"
                >{options}</select>
            }

            {!isSelect && !isTextarea &&
                <input
                    id={id}
                    type={type}
                    name={name}
                    defaultValue={defaultValue}
                    className="text-black w-full border p-3 rounded-md text-black text-sm"
                />
            }
        </div>
    );
};

export default InputControl;
