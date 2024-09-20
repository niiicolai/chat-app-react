import Button from "./Button";
import EllipsisIcon from "../icons/EllipsisIcon";
import React, { useState } from "react";

const ResMenu = (props: any) => {
    const [ show, setShow ] = useState(false);
    const { slot, type, title } = props;
    const display = props.display || "w-8 h-8 flex items-center justify-center";
    const showMenu = show ? "block" : "hidden sm:block";
    return (
        <div className="relative">
            <div className="sm:hidden">
                <Button type={type} title={title} display={display} onClick={() => setShow(!show)}
                    slot={<EllipsisIcon fill="white" width="1em" />}
                />
            </div>
            <div className={`${showMenu} absolute sm:relative right-0 top-9 sm:top-0 bg-gray-800 sm:bg-transparent rounded-md`}>
                {slot}
            </div>
        </div>
    );
};

export default ResMenu;
