
const types: { [key: string]: string } = {
    primary: 'bg-indigo-500 text-white',
    error: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
};

const Badge = (props: any) => {
    const { slot, title } = props;
    return (
        <div title={title} className={`${types[props.type]} px-3 py-1 rounded-md inline-block text-xs font-bold flex items-center justify-center`}>
            {slot}
        </div>
    );
};

export default Badge;
