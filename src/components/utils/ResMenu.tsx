import Button from "./Button";
import EllipsisIcon from "../icons/EllipsisIcon";
import { useState, ReactNode } from "react";

/**
 * @interface ResMenuProps
 * @description The props for the ResMenu component
 */
interface ResMenuProps {
    slot: ReactNode;
    type: string;
    title: string;
    stickDirection: string;
    display?: string;
}

/**
 * @function ResMenu
 * @param {ResMenuProps} props
 * @returns {ReactNode}
 */
const ResMenu = (props: ResMenuProps): ReactNode => {
    const [ show, setShow ] = useState(false);
    const { slot, type, title, stickDirection } = props;
    const display = props.display || "w-8 h-8 flex items-center justify-center";
    const showMenu = show ? "block" : "hidden sm:block";
    
    return (
        <div className="relative">
            <div className="sm:hidden">
                <Button type={type} title={title} display={display} onClick={() => setShow(!show)}
                    slot={<EllipsisIcon fill="white" width="1em" />}
                />
            </div>
            <div className={`${showMenu} ${stickDirection} absolute sm:relative top-9 sm:top-0 bg-gray-800 sm:bg-transparent rounded-md z-30`}>
                {slot}
            </div>
        </div>
    );
};

export default ResMenu;
