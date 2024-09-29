import ChannelMessageCreate from "./ChannelMessageCreate";
import ChannelMessageUpdate from "./ChannelMessageUpdate";
import ChannelMessageList from "./ChannelMessageList";
import useChannelMessages from "../../hooks/useChannelMessages";
import { JSX } from "react";
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

    return (
        <div className="overflow-y-auto">
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
                ? <ChannelMessageCreate create={create} />
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
