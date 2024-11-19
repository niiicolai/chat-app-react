import ChannelMessageCreate from "./ChannelMessageCreate";
import ChannelMessageUpdate from "./ChannelMessageUpdate";
import ChannelMessageList from "./ChannelMessageList";
import useChannelMessages from "../../hooks/useChannelMessages";
import { JSX, useRef } from "react";
/**
 * @function ChannelMessageMain
 * @returns {JSX.Element}
 */
const ChannelMessageMain = (): JSX.Element => {
    const { 
        messages, error, isLoading, 
        nextPage, maxPages, page, 
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
            <ChannelMessageList
                messages={messages}
                isLoading={isLoading}
                error={error}
                setEditMessage={setEditMessage}
                destroyMessage={destroy}
                destroyFile={destroyFile}
                nextPage={nextPage}
                maxPages={maxPages}
                page={page}
            />

            {!editMessage
                ? <ChannelMessageCreate create={create} scrollToBottom={scrollToBottom} />
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
