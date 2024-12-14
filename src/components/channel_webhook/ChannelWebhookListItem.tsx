import ChannelWebhook from "../../models/channel_webhook";
import Channel from "../../models/channel";
import Button from "../utils/Button";
import PenIcon from "../icons/PenIcon";
import TrashIcon from "../icons/TrashIcon";
import PaperPlaneIcon from "../icons/PaperPlaneIcon";
import Avatar from "../utils/Avatar";
import { JSX } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @interface ChannelWebhookListItemProps
 * @description The props for the ChannelWebhookListItem component
 */
interface ChannelWebhookListItemProps {
    webhook: ChannelWebhook;
    channel: Channel | undefined | null;
    room_uuid: string | undefined;
}

/**
 * @function ChannelWebhookListItem
 * @param {ChannelWebhookListItemProps} props
 * @returns {JSX.Element}
 */
const ChannelWebhookListItem = (props: ChannelWebhookListItemProps): JSX.Element => {
    const { webhook, channel, room_uuid } = props;
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;
    const API_PREFIX = import.meta.env.VITE_API_PREFIX;
    
    const url = `${API_URL}${API_PREFIX}/channel_webhook/${webhook.uuid}`;
    const curl = `curl -X POST ${url} -H "Content-Type: application/json" -d '{"message": "Hello World!"}'`;

    return (
        <li className="flex flex-col gap-1 border border-gray-800 p-3 rounded-md break-all" data-testid="channel-webhook-list-item">
            <div className="flex gap-2 items-center border-b border-gray-800 pb-2 mb-2">
                <Avatar src={webhook.room_file?.src} alternativeName={webhook.name} />
                <span className="text-white">{webhook.name}</span>
            </div>

            <div className="flex flex-col gap-1 border-b border-gray-800 pb-2 mb-2">
                <span className="text-indigo-500">Description:</span>
                <span>{webhook.description}</span>
            </div>

            <div className="flex flex-col gap-1 border-b border-gray-800 pb-2 mb-2">
                <span className="text-indigo-500">Channel:</span>
                <span>{channel?.name}</span>
            </div>

            <div className="flex flex-col gap-1 border-b border-gray-800 pb-2 mb-2">
                <span className="text-indigo-500">URL:</span>
                <a href={url} className="hover:underline">{url}</a>
            </div>

            <div className="flex flex-col gap-1 border-b border-gray-800 pb-2 mb-2">
                <span className="text-indigo-500">CURL:</span>
                <pre className="text-black whitespace-pre-wrap bg-gray-500 p-2 rounded-md">{curl}</pre>
            </div>

            <div className="bg-gray-700 p-2 rounded-md flex gap-1">
                <Button 
                    type="primary" 
                    display="h-5 w-5 flex items-center justify-center" 
                    title="Test webhook" 
                    testId="channel-webhook-test-button" 
                    onClick={() => navigate(`/room/${room_uuid}/webhook/${webhook.uuid}/test`)} 
                    button="button" 
                    slot={
                    <PaperPlaneIcon fill="white" width=".8em" />
                } />

                <Button 
                    type="primary" 
                    display="h-5 w-5 flex items-center justify-center" 
                    title="Edit webhook" 
                    testId="channel-webhook-edit-button" 
                    onClick={() => navigate(`/room/${room_uuid}/webhook/${webhook.uuid}/edit`)} 
                    button="button" 
                    slot={
                    <PenIcon fill="white" width=".8em" />
                } />

                <Button 
                    type="error" 
                    display="h-5 w-5 flex items-center justify-center" 
                    button="button" 
                    title="Delete webhook" 
                    testId="channel-webhook-delete-button" 
                    onClick={() => navigate(`/room/${room_uuid}/webhook/${webhook.uuid}/delete`)} 
                    slot={
                    <TrashIcon fill="white" width=".6em" />
                } />
            </div>
        </li>
    );
};

export default ChannelWebhookListItem;
