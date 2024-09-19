
const types: { [key: string]: string } = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-600 hover:ring-2 hover:ring-indigo-800',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 hover:ring-2 hover:ring-gray-800',
    error: 'bg-red-500 text-white hover:ring-2 hover:ring-red-800',
    success: 'bg-green-500 text-white hover:ring-2 hover:ring-green-800',
    warning: 'bg-yellow-500 text-white hover:ring-2 hover:ring-yellow-800',
};

const Button = (props: any) => {
    const { button, onClick, slot, display } = props;
    const displayClass = display ? display : 'px-6 py-1 w-full block';
    return (
        <button type={button} className={`${types[props.type]} ${displayClass} transition-all rounded-md`} onClick={onClick}>
            {slot}
        </button>
    );
};

export default Button;
