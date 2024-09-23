import ChannelMessageService from "../../services/channelMessageService";
import { ChannelContext } from "../../context/channelContext";
import { useContext, useState } from "react";
import Button from "../utils/Button";
import CheckMarkIcon from "../icons/CheckMarkIcon";
import ChannelMessage from "../../models/channel_message";

interface ChannelMessageUpdateProps {
    update: (e: any) => Promise<void>;
    editMessage: ChannelMessage | null;
    setEditMessage: (message: ChannelMessage | null) => void;
}

const ChannelMessageUpdate = (props: ChannelMessageUpdateProps) => {
    const { editMessage, setEditMessage, update } = props;
    const [message, setMessage] = useState(editMessage?.body || "");

    const updateHandler = (e: any) => {
        update(e).then(() => {
            setMessage("");
            setEditMessage(null);
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
                            <CheckMarkIcon fill="white" width="1em" />
                        } />

                        <Button onClick={() => setEditMessage(null)} type="secondary" button="button" slot="Cancel" display="w-24 flex items-center justify-center rounded-none" />
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChannelMessageUpdate;
