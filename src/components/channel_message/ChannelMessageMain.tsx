import ChannelMessageService from "../../services/channelMessageService";
import RoomFileService from "../../services/roomFileService";
import ChannelMessageCreate from "./ChannelMessageCreate";
import ChannelMessageUpdate from "./ChannelMessageUpdate";
import ChannelMessageList from "./ChannelMessageList";
import useChannelMessages from "../../hooks/useChannelMessages";
import { SocketMessage } from "../../hooks/useWebsockets";
import ChannelMessage from "../../models/channel_message";
import { useState, JSX, FormEvent, useEffect, useContext } from "react";
import { ChannelContext } from "../../context/channelContext";
import { WebsocketContext } from "../../context/websocketContext";
import { UserContext } from "../../context/userContext";
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
