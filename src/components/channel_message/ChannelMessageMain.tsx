import ChannelMessageService from "../../services/channelMessageService";
import RoomFileService from "../../services/roomFileService";
import ChannelMessageCreate from "./ChannelMessageCreate";
import ChannelMessageUpdate from "./ChannelMessageUpdate";
import ChannelMessageList from "./ChannelMessageList";
import useChannelMessages from "../../hooks/useChannelMessages";
import ChannelMessage from "../../models/channel_message";
import { useState, ReactNode, FormEvent } from "react";

/**
 * @function ChannelMessageMain
 * @returns {ReactNode}
 */
const ChannelMessageMain = (): ReactNode => {
    const { messages, setMessages, error, isLoading } = useChannelMessages();
    const [editMessage, setEditMessage] = useState<ChannelMessage | null>(null);

    const create = async (e: FormEvent<HTMLFormElement>, file: string | Blob) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        // override the file
        form.set('file', file);
        const response = await ChannelMessageService.create(form);
        setMessages([response, ...messages]);
    };

    const update = async (e: FormEvent<HTMLFormElement>) => {
        if (!editMessage) return;
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const uuid = form.get('uuid') as string;
        const body = form.get('body') as string;
        const response = await ChannelMessageService.update(uuid, { body });
        setMessages(messages.map((message: ChannelMessage) => message.uuid === response.uuid 
            ? response 
            : message
        ));
    };

    const destroy = async (uuid: string) => {
        await ChannelMessageService.destroy(uuid);
        setMessages(messages.filter((message: ChannelMessage) => message.uuid !== uuid));
    };

    const destroyFile = async (msg: ChannelMessage) => {
        if (!msg.channel_message_upload) return;
        const { uuid } = msg;
        const { uuid: fileUuid } = msg.channel_message_upload.room_file;
        await RoomFileService.destroy(fileUuid);
        setMessages(messages.map((message: ChannelMessage) => message.uuid === uuid
            ? { ...message, channel_message_upload: null }
            : message
        ));
    };

    return (
        <div className="overflow-y-auto">
            <ChannelMessageList
                messages={messages}
                isLoading={isLoading}
                error={error}
                setEditMessage={setEditMessage}
                destroyMessage={destroy}
                destroyFile={destroyFile}
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
