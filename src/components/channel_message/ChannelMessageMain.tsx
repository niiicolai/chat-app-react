import ChannelMessageCreate from "./ChannelMessageCreate";
import ChannelMessageUpdate from "./ChannelMessageUpdate";
import ChannelMessageList from "./ChannelMessageList";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import Channel from "../../models/channel";
import ChannelMessage from "../../models/channel_message";
import { JSX, useRef, useState } from "react";
import { useGetChannelMessages } from "../../hooks/useChannelMessages";

/**
 * @interface ChannelMessageMainProps
 * @description The props for the ChannelMessageMain component
 */
interface ChannelMessageMainProps {
    channel: Channel;
}

/**
 * @function ChannelMessageMain
 * @returns {JSX.Element}
 */
const ChannelMessageMain = (props: ChannelMessageMainProps): JSX.Element => {
    const { channel } = props;
    const [editMessage, setEditMessage] = useState<ChannelMessage | null>(null);
    const getChannelMessages = useGetChannelMessages(channel.uuid);
    const { data, fetchNextPage, isLoading, error } = getChannelMessages;
    const messages = data?.pages.flatMap(page => page.data) || [];
    const page = data?.pages.length || 1;
    const maxPages = messages.length ? (data?.pages[0].pages || 1) : 1;

    // useRef is used to get a reference to the wrapper DOM element
    // so we can scroll to the bottom of the chat when a new message is sent
    const channelWrapperRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        setTimeout(() => {
            if (channelWrapperRef.current) {
                channelWrapperRef.current.scrollTop = channelWrapperRef.current.scrollHeight;
            }
        }, 100);
    };

    return (
        <div className="overflow-y-auto main-msg-wrapper" ref={channelWrapperRef}>
            <Alert type="error" message={error} />

            {isLoading && (
                <div className="flex flex-col items-center justify-center gap-3 p-3 h-full text-center">
                    <Spinner isLoading={isLoading} fill="white" width="2em" />
                    <p className="text-white ml-3">Hold on, messages are<br />traveling through cyberspace</p>
                </div>
            )}

            {channel && !isLoading && (
                <ChannelMessageList
                    channel={channel}
                    messages={messages}
                    setEditMessage={setEditMessage}
                    nextPage={fetchNextPage}
                    page={page}
                    maxPages={maxPages}
                />
            )}

            {!editMessage
                ? <ChannelMessageCreate
                    scrollToBottom={scrollToBottom}
                    channel={channel}
                />
                : <ChannelMessageUpdate
                    editMessage={editMessage}
                    setEditMessage={setEditMessage}
                />
            }
        </div>
    );
};

export default ChannelMessageMain;
