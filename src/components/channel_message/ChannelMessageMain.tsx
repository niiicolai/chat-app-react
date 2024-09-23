import ChannelMessageService from "../../services/channelMessageService";
import RoomFileService from "../../services/roomFileService";
import ChannelMessageCreate from "./ChannelMessageCreate";
import ChannelMessageUpdate from "./ChannelMessageUpdate";
import ChannelMessageList from "./ChannelMessageList";
import useChannelMessages from "../../hooks/useChannelMessages";
import ChannelMessage from "../../models/channel_message";
import { useState } from "react";

const ChannelMessageMain = () => {
    const { messages, setMessages, error, isLoading } = useChannelMessages();
    const [editMessage, setEditMessage] = useState<ChannelMessage | null>(null);

    const create = async (e: any, file: any) => {
        e.preventDefault();
        const form = new FormData(e.target);
        // override the file
        form.set('file', file);
        const response = await ChannelMessageService.create(form);
        setMessages((messages: any) => [response, ...messages]);
    };

    const update = async (e: any) => {
        if (!editMessage) return;
        e.preventDefault();
        const form = new FormData(e.target);
        const uuid = form.get('uuid');
        const body = form.get('body');
        const response = await ChannelMessageService.update(editMessage.uuid, { body, uuid });
        const updatedMessages = messages.map((message: ChannelMessage) => {
            if (message.uuid === response.uuid) {
                return response;
            }
            return message;
        });
        setMessages(updatedMessages);
    };

    const destroy = async (uuid: string) => {
        await ChannelMessageService.destroy(uuid);
        const updatedMessages = messages.filter((message: ChannelMessage) => message.uuid !== uuid);
        setMessages(updatedMessages);
    };

    const destroyFile = async (msg: ChannelMessage) => {
        if (!msg.channel_message_upload) return;
        const { uuid } = msg;
        const { uuid: fileUuid } = msg.channel_message_upload.room_file;
        await RoomFileService.destroy(fileUuid);
        const updatedMessages = messages.map((message: ChannelMessage) => {
            if (message.uuid === uuid) {
                message.channel_message_upload = null;
            }
            return message;
        });
        setMessages(updatedMessages);
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
            {!editMessage && <ChannelMessageCreate create={create} />}
            {!!editMessage && <ChannelMessageUpdate editMessage={editMessage} update={update} setEditMessage={setEditMessage} />}
        </div>
    );
};

export default ChannelMessageMain;
