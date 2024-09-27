import ChannelMessageListItem from "./ChannelMessageListItem";
import ChannelMessage from "../../models/channel_message";
import Alert from "../utils/Alert";
import Spinner from "../utils/Spinner";
import { useContext, JSX } from "react";
import { ChannelContext } from "../../context/channelContext";

/**
 * @interface ChannelMessageListProps
 * @description The props for the ChannelMessageList component
 */
interface ChannelMessageListProps {
    setEditMessage: (message: ChannelMessage | null) => void;
    destroyMessage: (uuid: string) => void;
    destroyFile: (msg: ChannelMessage) => void;
    messages: ChannelMessage[];
    isLoading: boolean;
    error: string | null;
}

/**
 * @function ChannelMessageList
 * @param {ChannelMessageListProps} props
 * @returns {JSX.Element}
 */
const ChannelMessageList = (props: ChannelMessageListProps): JSX.Element => {
    const { messages, isLoading, error, setEditMessage, destroyMessage, destroyFile } = props;
    const { selectedChannel } = useContext(ChannelContext);

    const emptyStateMessages = [
        'Looks like you&rsquo;re the early bird! Send a message to kick things off! 🐦💬',
        'You&rsquo;re the first one here! Why not say hello? 👋💬',
        'It&rsquo;s quiet in here... be the first to break the silence! 🗨️'
    ];

    const emptyStateMessage = emptyStateMessages[Math.floor(Math.random() * emptyStateMessages.length)];

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center gap-3 p-3 h-full text-center">
            <Spinner isLoading={isLoading} fill="white" width="2em" />
            <p className="text-white ml-3">Hold on, messages are<br />traveling through cyberspace</p>
        </div>
    );

    return (
        <div className="bg-black pb-12">
            <div className="p-3">
                <Alert type="error" message={error} />

                {!messages.length &&
                    <div className="flex flex-col items-center justify-center gap-3 p-3 text-center">
                        <p className="text-white ml-3">{emptyStateMessage}</p>
                    </div>
                }

                {selectedChannel &&
                    <ul className="flex flex-col justify-end gap-3 mb-3">
                        {messages.map((message: ChannelMessage) => (
                            <ChannelMessageListItem
                                key={message.uuid}
                                channelMessage={message}
                                setEditMessage={setEditMessage}
                                destroyMessage={destroyMessage}
                                destroyFile={destroyFile}
                            />
                        ))}
                    </ul>
                }
            </div>
        </div>
    );
};

export default ChannelMessageList;
