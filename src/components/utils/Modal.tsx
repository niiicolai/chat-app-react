import Button from "./Button";
import TimesIcon from "../icons/TimesIcon";

const Modal = (props: any) => {
    const { title, show, setShow, slot } = props;
    return (
        <div className={`${show ? 'block' : 'hidden'} absolute top-0 left-0 right-0 bg-black min-h-screen z-40`}>
            <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                <div className="text-lg font-bold">
                    { title }
                </div>
                <Button
                    title="Close"
                    type="secondary" 
                    button="button" 
                    display="w-8 h-8 flex items-center justify-center"
                    onClick={() => setShow(false)}                 
                    slot={<TimesIcon fill="white" width="1em" />}  
                />
            </div>
            <div className="p-3">
                { slot }
            </div>
        </div>
    );
};

export default Modal;
