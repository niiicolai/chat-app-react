import ArrowTurnDownIcon from "../icons/ArrowTurnDownIcon";
import Avatar from "../utils/Avatar";
import BotIcon from "../icons/BotIcon";
import GhostIcon from "../icons/GhostIcon";
import TrashIcon from "../icons/TrashIcon";
import PenIcon from "../icons/PenIcon";
import Button from "../utils/Button";
import Badge from "../utils/Badge";
import User from "../../models/user";
import ReactMarkdown from 'react-markdown';
import ChannelMessage from "../../models/channel_message";
import ChannelMessageUpload from "../channel_message_upload/ChannelMessageUpload";
import { ToastContext } from "../../context/toastContext";
import { useState, JSX, useContext } from "react";
import { useDestroyChannelMessage, useDestroyUpload } from "../../hooks/useChannelMessages";

/**
 * @interface ChannelMessageListItemProps
 * @description The props for the ChannelMessageListItem component
 */
interface ChannelMessageListItemProps {
    setEditMessage: (message: ChannelMessage | null) => void;
    channelMessage: ChannelMessage;
    isModOrAdmin: boolean;
    authenticatedUser: User | null;
}

/**
 * @function ChannelMessageListItem
 * @param {ChannelMessageListItemProps} props
 * @returns {JSX.Element}
 */
const ChannelMessageListItem = (props: ChannelMessageListItemProps): JSX.Element => {
    const { channelMessage, setEditMessage, isModOrAdmin, authenticatedUser } = props;
    const { addToast } = useContext(ToastContext);
    const destroyMessage = useDestroyChannelMessage();
    const destroyUpload = useDestroyUpload();
    const [showSettings, setShowSettings] = useState(false);
    const handleMouseEnter = () => setShowSettings(true);
    const handleMouseLeave = () => setShowSettings(false);
    const canModify = isModOrAdmin || authenticatedUser?.uuid === channelMessage.user?.uuid;

    const destroyMessageHandler = async () => {
        if (!channelMessage) return;
        try {
            await destroyMessage.mutateAsync({ uuid: channelMessage.uuid, channel_uuid: channelMessage.channel_uuid });
            addToast({ message: 'Message deleted', type: 'success', duration: 5000 });
        } catch {
            addToast({ message: 'Error deleting message', type: 'error', duration: 5000 });
        }
    }

    const destroyUploadHandler = async () => {
        if (!channelMessage.channel_message_upload) return;
        try {
            const room_file_uuid = channelMessage.channel_message_upload.room_file.uuid;
            const channel_message_uuid = channelMessage.uuid;
            const channel_uuid = channelMessage.channel_uuid;
            await destroyUpload.mutateAsync({ channel_message_uuid, room_file_uuid, channel_uuid });
            addToast({ message: 'Message upload deleted', type: 'success', duration: 5000 });
        } catch {
            addToast({ message: 'Error deleting message upload', type: 'error', duration: 5000 });
        }
    }

    return (
        <li key={channelMessage.uuid} className="relative flex justify-between gap-3 hover:bg-gray-800 p-2 rounded-md" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-testid="channel-message-list-item">
            <div className="w-full flex items-start gap-5">
                <div className="w-8">
                    {channelMessage.channel_message_type_name === 'System' &&
                        <Avatar
                            src={null}
                            alternativeName="System"
                            alternativeIcon={<GhostIcon fill="#FFF" width=".7em" />}
                        />
                    }
                    {channelMessage.channel_message_type_name === 'Webhook' &&
                        <Avatar
                            src={channelMessage.channel_webhook_message?.channel_webhook?.room_file?.src}
                            alternativeName={channelMessage.channel_webhook_message?.channel_webhook?.name}
                            alternativeIcon={<BotIcon fill="#FFF" width=".7em" />}
                        />
                    }
                    {channelMessage.channel_message_type_name === 'User' &&
                        <Avatar
                            src={channelMessage.user?.avatar_src}
                            alternativeName={channelMessage.user?.username}
                        />
                    }
                </div>
                <div>
                    <div className="flex items-center gap-3 text-indigo-500 text-xs mb-1">
                        <div data-testid="channel-message-list-item-username">
                            {
                                channelMessage.user?.username ||
                                channelMessage.channel_webhook_message?.channel_webhook?.name ||
                                (channelMessage.channel_message_type_name === 'System' && 'Friendly Ghost') ||
                                "Unknown"
                            }
                        </div>

                        <div>
                            {new Date(channelMessage.created_at).toLocaleString()}
                        </div>

                        {channelMessage.channel_message_type_name !== 'User' &&
                            <div className="scale-75">
                                <Badge type="primary" title="Message Type" slot={channelMessage.channel_message_type_name} />
                            </div>
                        }
                    </div>

                    <div className="text-sm markdown-chat-message" data-testid="channel-message-list-item-body">
                        <ReactMarkdown>{channelMessage.body}</ReactMarkdown>
                    </div>

                    {channelMessage.channel_message_upload &&
                        <div className="flex items-start gap-2 mt-1 sm:max-w-64 relative">
                            <div className="rotate-180">
                                <ArrowTurnDownIcon fill="#6366f1" width=".7em" />
                            </div>

                            <ChannelMessageUpload channelMessage={{
                                channel_message_upload: {
                                    uuid: channelMessage.channel_message_upload.uuid,
                                    channel_message_upload_type_name: channelMessage.channel_message_upload.channel_message_upload_type_name,
                                    channel_message: {
                                        uuid: channelMessage.uuid,
                                        body: channelMessage.body
                                    },
                                    room_file: channelMessage.channel_message_upload.room_file
                                }
                            }} />

                            {showSettings && canModify && (
                                <Button type="error" display="h-5 w-5 flex items-center justify-center absolute right-3 top-3" button="button" title="Delete file" onClick={() => destroyUploadHandler()} slot={
                                    <TrashIcon fill="white" width=".6em" />
                                } />
                            )}
                        </div>
                    }
                </div>
            </div>
            {showSettings && canModify && (
                <div className="bg-gray-700 p-1 rounded-md flex gap-1 absolute top-3 right-3">
                    <Button type="primary" display="h-5 w-5 flex items-center justify-center" title="Edit message" onClick={() => setEditMessage(channelMessage)} button="button" testId="edit-channel-message-button" slot={
                        <PenIcon fill="white" width=".6em" />
                    } />
                    <Button type="error" display="h-5 w-5 flex items-center justify-center" button="button" title="Delete message" testId="delete-channel-message-button" onClick={() => destroyMessageHandler()} slot={
                        <TrashIcon fill="white" width=".6em" />
                    } />
                </div>
            )}
        </li>
    );
};

export default ChannelMessageListItem;
