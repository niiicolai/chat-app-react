
const types: { [key: string]: string } = {
    primary: 'bg-indigo-500 text-white',
    error: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
};

const Badge = (props: any) => {
    const { slot, title } = props;
    return (
        <div title={title} className={`${types[props.type]} px-2 rounded-md inline-block text-xs flex items-center justify-center`} style={{ paddingTop: '.2em', paddingBottom: '.2em' }}>
            {slot}
        </div>
    );
};

export default Badge;
