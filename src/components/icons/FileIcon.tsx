import { ReactNode } from "react";
import IconProps from "./_IconProps";

/**
 * @function FileIcon
 * @param {IconProps} props
 * @returns {ReactNode}
 */
const FileIcon = (props: IconProps): ReactNode => {
    const { fill, width } = props;
    
    return (
        // Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.
        <svg xmlns="http://www.w3.org/2000/svg" fill={fill} width={width} viewBox="0 0 384 512">
            <path d="M320 464c8.8 0 16-7.2 16-16l0-288-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16l256 0zM0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64z"/></svg>
    );
};

export default FileIcon;
