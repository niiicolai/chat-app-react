
const types: { [key: string]: string } = {
    error: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
};

const Alert = (props: any) => {
    return (
        <p className={`${types[props.type]} p-3 text-sm rounded-md text-center font-bold`}>
            {props.message}
        </p>
    );
};

export default Alert;
