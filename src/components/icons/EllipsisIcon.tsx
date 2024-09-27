import { ReactNode } from "react";
import IconProps from "./_IconProps";

/**
 * @function EllipsisIcon
 * @param {IconProps} props
 * @returns {ReactNode}
 */
const EllipsisIcon = (props: IconProps): ReactNode => {
    const { fill, width } = props;
    
    return (
        // Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.
        <svg xmlns="http://www.w3.org/2000/svg" fill={fill} width={width} viewBox="0 0 448 512">
            <path d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" /></svg>
    );
};

export default EllipsisIcon;
