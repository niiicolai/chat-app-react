
const types: { [key: string]: string } = {
    primary: 'bg-indigo-500 text-white',
    error: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
};

const Badge = (props: any) => {
    const { slot } = props;
    return (
        <div className={`${types[props.type]} px-1 py-1 rounded-md inline-block text-xs font-bold`}>
            {slot}
        </div>
    );
};

export default Badge;
