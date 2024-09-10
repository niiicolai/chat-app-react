
const types: { [key: string]: string } = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-600',
    error: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
};

const Button = (props: any) => {
    const { button, onClick, slot } = props;
    return (
        <button type={button} className={`${types[props.type]} px-6 py-1 rounded-md w-full block`} onClick={onClick}>
            {slot}
        </button>
    );
};

export default Button;
