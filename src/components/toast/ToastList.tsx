import { ToastContext } from "../../context/toastContext";
import { useContext, ReactNode } from "react";
import ToastListItem from "./ToastListItem";

/**
 * @function ToastList
 * @returns {ReactNode}
 */
const ToastList = (): ReactNode => {
    const { toasts } = useContext(ToastContext);
    return (
        <div className="fixed top-3 left-3 z-50 flex flex-col gap-2">
            {toasts.map((toast, index) => (
                <ToastListItem key={index} toast={toast} />
            ))}
        </div>
    );
};

export default ToastList;
