import Button from "../utils/Button";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import CheckMarkIcon from "../icons/CheckMarkIcon";
import ChannelMessage from "../../models/channel_message";
import { FormEvent, useState, JSX, useContext, useEffect } from "react";
import { ToastContext } from "../../context/toastContext";
import { useUpdateChannelMessage } from "../../hooks/useChannelMessages";

/**
 * @interface ChannelMessageUpdateProps
 * @description The props for the ChannelMessageUpdate component
 */
interface ChannelMessageUpdateProps {
    editMessage: ChannelMessage | null;
    setEditMessage: (message: ChannelMessage | null) => void;
}

/**
 * @function ChannelMessageUpdate
 * @param {ChannelMessageUpdateProps} props
 * @returns {JSX.Element}
 */
const ChannelMessageUpdate = (props: ChannelMessageUpdateProps): JSX.Element => {
    const { editMessage, setEditMessage } = props;
    const { addToast } = useContext(ToastContext);
    const { mutateAsync, isLoading, error } = useUpdateChannelMessage();
    const [message, setMessage] = useState(editMessage?.body || "");

    /**
     * If the editMessage prop changes, update the message state
     * to ensure the input field is updated with the message body
     */
    useEffect(() => {
        setMessage(editMessage?.body || "");
    }, [editMessage]);

    const updateHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editMessage) return;
        if (message === "") {
            addToast({ message: "Message is required", type: "error", duration: 5000 });
            return;
        }

        try {
            await mutateAsync({ uuid: editMessage.uuid, body: { body: message } });
            setEditMessage(null);
            addToast({ message: "Message updated", type: "success", duration: 5000 });
            setMessage("");
        } catch {
            addToast({ message: "Error updating message", type: "error", duration: 5000 });
        }
    };

    return (
        <div>
            {editMessage && (
                <div>
                    <Alert type="error" message={error} />

                    <form onSubmit={updateHandler} className="flex h-12 bg-black border-t border-gray-800 fixed sm:absolute bottom-0 left-0 right-0" data-testid="channel-message-edit-form">
                        <input type="hidden" name="uuid" value={editMessage?.uuid} />

                        <input
                            type="text"
                            name="body"
                            placeholder="Enter message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full focus:outline-none focus:bg-slate-800 bg-black px-3"
                            data-testid="channel-message-edit-body"
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
