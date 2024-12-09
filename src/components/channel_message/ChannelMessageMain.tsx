import ChannelMessageCreate from "./ChannelMessageCreate";
import ChannelMessageUpdate from "./ChannelMessageUpdate";
import ChannelMessageList from "./ChannelMessageList";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import useChannelMessages from "../../hooks/useChannelMessages";
import Channel from "../../models/channel";
import { JSX, useRef } from "react";
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
    const getChannelMessages = useGetChannelMessages(channel.uuid);
    const { data: cmData, page, pages, nextPage, isLoading, error } = getChannelMessages;
    const messages = cmData?.data ?? [];

    const {
        create, update, destroy,
        destroyFile, editMessage,
        setEditMessage
    } = useChannelMessages();

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
                    destroyMessage={destroy}
                    destroyFile={destroyFile}
                    nextPage={nextPage}
                    maxPages={pages}
                    page={page}
                />
            )}

            {!editMessage
                ? <ChannelMessageCreate
                    create={create}
                    scrollToBottom={scrollToBottom}
                    channel={channel}
                />
                : <ChannelMessageUpdate
                    editMessage={editMessage}
                    update={update}
                    setEditMessage={setEditMessage}
                />
            }
        </div>
    );
};

export default ChannelMessageMain;
