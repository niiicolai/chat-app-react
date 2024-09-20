
const types: { [key: string]: any } = {
    primary: { fill: 'bg-indigo-500', bgg: 'bg-gray-500 text-white' },
    secondary: { fill: 'bg-gray-700', bgg: 'bg-gray-500 text-white' },
    error: { fill: 'bg-red-500', bgg: 'bg-gray-500 text-white' },
    success: { fill: 'bg-green-500', bgg: 'bg-gray-500 text-white' },
    warning: { fill: 'bg-orange-500', bgg: 'bg-gray-500 text-white' },
};

const Progress = (props: any) => {
    const { slot, type, value, max } = props;
    const percentage = (value / max) * 100;
    return (
        <div className={`relative flex items-center justify-between gap-2 ${types[type].bgg} p-2 rounded-md overflow-hidden`}>
            <div style={{ width: `${percentage}%` }} className={`${types[type].fill} rounded-md absolute left-0 top-0 bottom-0`} />
            <div className="relative">{ slot }</div>
        </div>
    );
};

export default Progress;
