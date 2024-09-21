import useChannelMessages from "../../hooks/useChannelMessages";
import ChannelMessageListItem from "./ChannelMessageListItem";
import { useContext } from "react";
import { ChannelContext } from "../../context/channelContext";

const ChannelMessageList = (props: any) => {
    const { channel } = useContext(ChannelContext);
    const { messages, error, isLoading } = useChannelMessages();
    return (
        <div className="overflow-y-auto bg-black pb-12 sm:pb-0">
            {channel &&
                <div className="p-3">
                    <ul className="flex flex-col gap-3 mb-3">
                        {messages.map((message) => <ChannelMessageListItem key={message.uuid} channelMessage={message} />)}
                        {!messages.length && <li className="text-white">No channel messages found</li>}
                    </ul>
                </div>
            }
            {!channel &&
                <div className="flex items-center justify-center h-full p-3">
                    <p className="text-white">Select a channel to view messages</p>
                </div>
            }
        </div>
    );
};

export default ChannelMessageList;
