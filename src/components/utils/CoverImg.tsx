
interface CoverImgProps {
    src: string;
    overlay?: boolean;
}

const CoverImg = (props: CoverImgProps) => {
    const { src, overlay } = props;
    const isSrcPresent = src && src.length > 0;

    return (
        <span>
            <span className={`absolute left-0 right-0 top-0 bottom-0 bg-black/50 z-20 ${overlay ? 'block' : 'hidden'}`} />
            <span className="absolute left-0 right-0 top-0 bottom-0 z-10"
                style={{
                    backgroundImage: isSrcPresent ? `url(${src})` : 'none',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                }} />
        </span>
    );
};

export default CoverImg;
