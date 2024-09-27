import { FormEvent, useState, ReactNode, useContext } from "react";
import { ToastContext } from "../../context/toastContext";
import Button from "../utils/Button";
import Spinner from "../utils/Spinner";
import CheckMarkIcon from "../icons/CheckMarkIcon";
import ChannelMessage from "../../models/channel_message";

/**
 * @interface ChannelMessageUpdateProps
 * @description The props for the ChannelMessageUpdate component
 */
interface ChannelMessageUpdateProps {
    update: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    editMessage: ChannelMessage | null;
    setEditMessage: (message: ChannelMessage | null) => void;
}

/**
 * @function ChannelMessageUpdate
 * @param {ChannelMessageUpdateProps} props
 * @returns {ReactNode}
 */
const ChannelMessageUpdate = (props: ChannelMessageUpdateProps): ReactNode => {
    const { editMessage, setEditMessage, update } = props;
    const [message, setMessage] = useState(editMessage?.body || "");
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useContext(ToastContext);

    const updateHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        update(e)
        .then(() => {
            setMessage("");
            setEditMessage(null);
            addToast({ message: "Message updated", type: "success", duration: 5000 });
        })
        .catch((err: unknown) => {
            if (err instanceof Error) {
                addToast({ message: err.message, type: "error", duration: 5000 });
            } else {
                addToast({ message: "An unknown error occurred", type: "error", duration: 5000 });
            }
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div>
            {editMessage && (
                <div>
                    <form onSubmit={updateHandler} className="flex h-12 bg-black border-t border-gray-800 fixed sm:absolute bottom-0 left-0 right-0">
                        <input type="hidden" name="uuid" value={editMessage?.uuid} />

                        <input
                            type="text"
                            name="body"
                            placeholder="Enter message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full focus:outline-none focus:bg-slate-800 bg-black px-3"
                        />

                        <Button type="primary" button="submit" display="w-24 flex items-center justify-center rounded-none" slot={
                            <span>
                                {isLoading
                                    ? <Spinner isLoading={isLoading} width="2em" fill="white" />
                                    : <CheckMarkIcon fill="white" width="1em" />
                                }
                            </span>
                        } />

                        <Button 
                            onClick={() => setEditMessage(null)} 
                            type="secondary" 
                            button="button" 
                            slot="Cancel" 
                            display="w-24 flex items-center justify-center rounded-none" 
                        />
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChannelMessageUpdate;
