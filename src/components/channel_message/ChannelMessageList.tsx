import ChannelMessageListItem from "./ChannelMessageListItem";
import ChannelMessage from "../../models/channel_message";
import Alert from "../utils/Alert";
import Spinner from "../utils/Spinner";
import Button from "../utils/Button";
import { JSX } from "react";
import { useGetAuthenticatedRoomUser } from "../../hooks/useRoomUsers";
import { useGetUser } from "../../hooks/useUser";
import Channel from "../../models/channel";

/**
 * @interface ChannelMessageListProps
 * @description The props for the ChannelMessageList component
 */
interface ChannelMessageListProps {
    setEditMessage: (message: ChannelMessage | null) => void;
    messages: ChannelMessage[];
    nextPage: () => void;
    channel: Channel;
    page: number;
    maxPages: number;
}

/**
 * @function ChannelMessageList
 * @param {ChannelMessageListProps} props
 * @returns {JSX.Element}
 */
const ChannelMessageList = (props: ChannelMessageListProps): JSX.Element => {
    const { channel, messages, setEditMessage, nextPage, page, maxPages } = props;
    const { data: roomUser } = useGetAuthenticatedRoomUser(channel.room_uuid);
    const { data: user } = useGetUser();
    
    const isModOrAdmin = (
        roomUser?.room_user_role_name === 'Admin' || 
        roomUser?.room_user_role_name === 'Moderator'
    );

    const emptyStateMessages = [
        'Looks like you are the early bird! Send a message to kick things off! 🐦💬',
        'You are the first one here! Why not say hello? 👋💬',
        'It is quiet in here... be the first to break the silence! 🗨️'
    ];

    const emptyStateMessage = emptyStateMessages[Math.floor(Math.random() * emptyStateMessages.length)];

    return (
        <div className="bg-black">
            <div className="pl-3 pt-3 pr-3 pb-12 sm:pb-0">
                

                {!messages.length &&
                    <div className="flex flex-col items-center justify-center gap-3 p-3 text-center">
                        <p className="text-white ml-3">{emptyStateMessage}</p>
                    </div>
                }

                {channel && user &&
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
