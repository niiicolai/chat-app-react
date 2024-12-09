import PaperPlaneIcon from "../icons/PaperPlaneIcon";
import Spinner from "../utils/Spinner";
import Button from "../utils/Button";
import Alert from "../utils/Alert";
import Channel from "../../models/channel";
import { v4 as uuidv4 } from "uuid";
import { FormEvent, useContext } from "react";
import { ToastContext } from "../../context/toastContext";
import { useState, JSX, useRef } from "react";
import { useCreateChannelMessage } from "../../hooks/useChannelMessages";

/**
 * @interface ChannelMessageCreateProps
 * @description The props for the ChannelMessageCreate component
 */
interface ChannelMessageCreateProps {
    scrollToBottom?: () => void;
    channel: Channel;
}

/**
 * @function ChannelMessageCreate
 * @param {ChannelMessageCreateProps} props
 * @returns {JSX.Element}
 */
const ChannelMessageCreate = (props: ChannelMessageCreateProps): JSX.Element => {
    const { addToast } = useContext(ToastContext);
    const [message, setMessage] = useState("");
    const [uuid, setUuid] = useState(uuidv4());
    const { mutateAsync, isLoading, error } = useCreateChannelMessage();
    const [file, setFile] = useState('' as string | Blob);
    const { scrollToBottom, channel } = props;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const createHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (message === "") {
            addToast({ message: 'Message is required', type: 'error', duration: 5000 });
            return;
        }

        try {
            const formData = new FormData(e.currentTarget);
            await mutateAsync(formData);
            addToast({ message: 'Message sent', type: 'success', duration: 5000 });
            if (scrollToBottom) scrollToBottom();
            setMessage('');
            setUuid(uuidv4());
            if (fileInputRef.current && fileInputRef.current?.value) fileInputRef.current.value = '';
        } catch {            
            addToast({ message: 'Error sending message', type: 'error', duration: 5000 });
        }
    };

    const messageHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setMessage(e.currentTarget.value);
    }

    const fileHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        if (!target.files || !target.files.length) {
            setFile('');
            return;
        }
        setFile(target.files[0]);
    }

    return (
        <div>
            <div>
                <Alert type="error" message={error} />

                <form onSubmit={createHandler} className="flex h-12 bg-black border-t border-gray-800 fixed sm:absolute bottom-0 left-0 right-0" data-testid="channel-message-create-form">
                    <input type="hidden" name="uuid" value={uuid} />
                    <input type="hidden" name="channel_uuid" value={channel.uuid} />

                    {!file && (
                        <label htmlFor="ch-msg-create-file" className="flex items-center justify-center w-12 h-12 cursor-pointer text-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </label>
                    )}
                    {file && (
                        <button className="flex items-center justify-center w-12 h-12 cursor-pointer text-red-500" onClick={() => setFile('')}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    <input type="file" name="file" id="ch-msg-create-file" className="hidden" ref={fileInputRef} onChange={fileHandler} />
                    <input
                        type="text"
                        name="body"
                        placeholder="Enter message"
                        value={message}
                        onChange={messageHandler}
                        className="w-full focus:outline-none focus:bg-slate-800 bg-black px-3"
                        data-testid="channel-message-create-body"
                    />

                    <Button type="primary" button="submit" display="w-24 flex items-center justify-center rounded-none" slot={
                        <span>
                            {isLoading
                                ? <Spinner isLoading={isLoading} width="2em" fill="white" />
                                : <PaperPlaneIcon fill="white" width="1em" />
                            }
                        </span>
                    } />
                </form>
            </div>
        </div>
    );
};

export default ChannelMessageCreate;
