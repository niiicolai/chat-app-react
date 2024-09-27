import { useState, ReactNode } from "react";
import ChannelMessageUpload from "../channel_message_upload/ChannelMessageUpload";
import ChannelMessage from "../../models/channel_message";
import ArrowTurnDownIcon from "../icons/ArrowTurnDownIcon";
import Avatar from "../utils/Avatar";
import BotIcon from "../icons/BotIcon";
import GhostIcon from "../icons/GhostIcon";
import TrashIcon from "../icons/TrashIcon";
import PenIcon from "../icons/PenIcon";
import Button from "../utils/Button";
import Badge from "../utils/Badge";

/**
 * @interface ChannelMessageListItemProps
 * @description The props for the ChannelMessageListItem component
 */
interface ChannelMessageListItemProps {
    setEditMessage: (message: ChannelMessage | null) => void;
    destroyMessage: (uuid: string) => void;
    destroyFile: (msg: ChannelMessage) => void;
    channelMessage: ChannelMessage;
}

/**
 * @function ChannelMessageListItem
 * @param {ChannelMessageListItemProps} props
 * @returns {ReactNode}
 */
const ChannelMessageListItem = (props: ChannelMessageListItemProps): ReactNode => {
    const { channelMessage, setEditMessage, destroyMessage, destroyFile } = props;
    const [showSettings, setShowSettings] = useState(false);
    const handleMouseEnter = () => setShowSettings(true);
    const handleMouseLeave = () => setShowSettings(false);

    return (
        <li key={channelMessage.uuid} className="relative flex justify-between gap-3 hover:bg-gray-800 p-2 rounded-md" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
                            src={channelMessage.channel_webhook_message?.channel_webhook.room_file?.src} 
                            alternativeName={channelMessage.channel_webhook_message?.channel_webhook.name} 
                            alternativeIcon={<BotIcon fill="#FFF" width=".7em" />} 
                        />
                    }
                    {channelMessage.channel_message_type_name === 'User' &&
                        <Avatar 
                            src={channelMessage.user?.avatar_src} 
                            alternativeName={channelMessage.user?.username} 
                            alternativeIcon={null} 
                        />
                    }
                </div>
                <div>
                    <div className="flex items-center gap-3 text-indigo-500 text-xs mb-1">
                        <div>
                            {
                                channelMessage.user?.username ||
                                channelMessage.channel_webhook_message?.channel_webhook.name ||
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

                    <div className="text-sm">
                        {channelMessage.body}
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

                            {showSettings && (
                                <Button type="error" display="h-5 w-5 flex items-center justify-center absolute right-3 top-3" button="button" title="Delete file" onClick={()=>destroyFile(channelMessage)} slot={
                                    <TrashIcon fill="white" width=".6em" />
                                } />
                            )}
                        </div>
                    }
                </div>
            </div>
            {showSettings && (
                <div className="bg-gray-700 p-1 rounded-md flex gap-1 absolute top-3 right-3">
                    <Button type="primary" display="h-5 w-5 flex items-center justify-center" title="Edit message" onClick={() => setEditMessage(channelMessage)} button="button" slot={
                        <PenIcon fill="white" width=".6em" />
                    } />
                    <Button type="error" display="h-5 w-5 flex items-center justify-center" button="button" title="Delete message" onClick={() => destroyMessage(channelMessage.uuid)} slot={
                        <TrashIcon fill="white" width=".6em" />
                    } />
                </div>
            )}
        </li>
    );
};

export default ChannelMessageListItem;
