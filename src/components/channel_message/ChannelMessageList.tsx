import ChannelMessageListItem from "./ChannelMessageListItem";
import ChannelMessage from "../../models/channel_message";
import Alert from "../utils/Alert";
import Spinner from "../utils/Spinner";
import Button from "../utils/Button";
import { useContext, JSX } from "react";
import { ChannelContext } from "../../context/channelContext";
import { RoomContext } from "../../context/roomContext";
import { UserContext } from "../../context/userContext";

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
    nextPage: () => void;
    maxPages: number;
    page: number;
}

/**
 * @function ChannelMessageList
 * @param {ChannelMessageListProps} props
 * @returns {JSX.Element}
 */
const ChannelMessageList = (props: ChannelMessageListProps): JSX.Element => {
    const { messages, isLoading, error, setEditMessage, destroyMessage, destroyFile, nextPage, maxPages, page } = props;
    const { selectedChannel } = useContext(ChannelContext);
    const { selectedRoomUser } = useContext(RoomContext);
    const { user } = useContext(UserContext);
    const isModOrAdmin = selectedRoomUser?.room_user_role_name === 'Admin' || selectedRoomUser?.room_user_role_name === 'Moderator';

    const emptyStateMessages = [
        'Looks like you are the early bird! Send a message to kick things off! 🐦💬',
        'You are the first one here! Why not say hello? 👋💬',
        'It is quiet in here... be the first to break the silence! 🗨️'
    ];

    const emptyStateMessage = emptyStateMessages[Math.floor(Math.random() * emptyStateMessages.length)];

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center gap-3 p-3 h-full text-center">
            <Spinner isLoading={isLoading} fill="white" width="2em" />
            <p className="text-white ml-3">Hold on, messages are<br />traveling through cyberspace</p>
        </div>
    );

    return (
        <div className="bg-black">
            <div className="pl-3 pt-3 pr-3 pb-12 sm:pb-0">
                <Alert type="error" message={error} />

                {!messages.length &&
                    <div className="flex flex-col items-center justify-center gap-3 p-3 text-center">
                        <p className="text-white ml-3">{emptyStateMessage}</p>
                    </div>
                }

                {selectedChannel &&
                    <ul className="flex flex-col justify-end gap-3 mb-3">
                        <li className="flex justify-center">
                            {page < maxPages &&
                                <Button type="primary" title="Load more" display="w-full p-2 text-xs" onClick={nextPage} slot={
                                    <span className="flex items-center justify-between gap-3">
                                        <span>Load older messages</span>
                                        <span>
                                            Displaying for page {page == 1 ? '1' : `1-${page}`} of {maxPages}
                                        </span>
                                    </span>
                                } />
                            }
                            {page > 1 && page === maxPages &&
                                <span className="text-xs text-gray-500">No more messages to load</span>
                            }
                        </li>

                        {messages.map((message: ChannelMessage) => (
                            <ChannelMessageListItem
                                key={message.uuid}
                                channelMessage={message}
                                setEditMessage={setEditMessage}
                                destroyMessage={destroyMessage}
                                destroyFile={destroyFile}
                                isModOrAdmin={isModOrAdmin}
                                authenticatedUser={user}
                            />
                        ))}
                    </ul>
                }
            </div>
        </div>
    );
};

export default ChannelMessageList;
