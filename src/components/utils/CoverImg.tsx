import { ReactNode } from 'react';

/**
 * @interface CoverImgProps
 * @description The props for the CoverImg component
 */
interface CoverImgProps {
    src: string;
    overlay?: boolean;
}

/**
 * @function CoverImg
 * @param {CoverImgProps} props
 * @returns {ReactNode}
 */
const CoverImg = (props: CoverImgProps): ReactNode => {
    const { src, overlay } = props;
    const isSrcPresent = src && src.length > 0;
    const overlayVisibleState = overlay ? 'block' : 'hidden';
    const backgroundImage = isSrcPresent ? `url(${src})` : 'none';

    return (
        <span>
            <span className={`absolute left-0 right-0 top-0 bottom-0 bg-black/50 z-20 ${overlayVisibleState}`} />
            <span className="absolute left-0 right-0 top-0 bottom-0 z-10"
                style={{
                    backgroundImage,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                }} />
        </span>
    );
};

export default CoverImg;
