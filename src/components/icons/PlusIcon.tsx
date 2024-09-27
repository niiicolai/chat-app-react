import { ReactNode } from "react";
import IconProps from "./_IconProps";

/**
 * @function PlusIcon
 * @param {IconProps} props
 * @returns {ReactNode}
 */
const PlusIcon = (props: IconProps): ReactNode => {
    const { fill, width } = props;
    
    return (
        // Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.
        <svg xmlns="http://www.w3.org/2000/svg" fill={fill} width={width} viewBox="0 0 448 512">
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" /></svg>
    );
};

export default PlusIcon;
