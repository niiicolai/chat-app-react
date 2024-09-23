
interface AvatarProps {
    alternativeName: string | null | undefined;
    src: string | null | undefined;
    alternativeIcon: any;
}

const Avatar = (props: AvatarProps) => {
    const { src, alternativeName, alternativeIcon } = props;
    const alt = alternativeName || "U";
    
    if (src) {
        return <img src={src} alt={alt} className="w-8 h-8 rounded-full" />;
    }

    if (alternativeIcon) {
        return (
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                {alternativeIcon}
            </div>
        );
    }

    return (
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
            {alt.charAt(0).toUpperCase()}
        </div>
    );
};

export default Avatar;
