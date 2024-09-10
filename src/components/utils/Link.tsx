
const types: { [key: string]: string } = {
    primary: 'text-indigo-500 hover:text-indigo-600',
    error: 'text-red-500 hover:text-indigo-600',
    success: 'text-green-500 hover:text-indigo-600',
    warning: 'text-yellow-500 hover:text-indigo-600',
};

const Link = (props: any) => {
    const { href, slot } = props;
    return (
        <a href={href} className={`${types[props.type]} hover:underline`}>
            {slot}
        </a>
    );
};

export default Link;
