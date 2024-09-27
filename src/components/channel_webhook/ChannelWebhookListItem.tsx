import ChannelWebhook from "../../models/channel_webhook";
import Channel from "../../models/channel";
import Button from "../utils/Button";
import PenIcon from "../icons/PenIcon";
import TrashIcon from "../icons/TrashIcon";
import PaperPlaneIcon from "../icons/PaperPlaneIcon";
import Avatar from "../utils/Avatar";
import { ReactNode } from "react";

/**
 * @interface ChannelWebhookListItemProps
 * @description The props for the ChannelWebhookListItem component
 */
interface ChannelWebhookListItemProps {
    webhook: ChannelWebhook;
    channel: Channel | undefined;
    setWebhookEdit: (webhook: ChannelWebhook | null) => void;
    setWebhookTest: (webhook: ChannelWebhook | null) => void;
    destroyWebhook: (uuid: string) => void;
}

/**
 * @function ChannelWebhookListItem
 * @param {ChannelWebhookListItemProps} props
 * @returns {ReactNode}
 */
const ChannelWebhookListItem = (props: ChannelWebhookListItemProps): ReactNode => {
    const { webhook, channel, setWebhookEdit, destroyWebhook, setWebhookTest } = props;

    const API_URL = import.meta.env.VITE_API_URL;
    const API_PREFIX = import.meta.env.VITE_API_PREFIX;
    const url = new URL(`${API_PREFIX}channel_webhook/${webhook.uuid}`, API_URL).toString();
    const curl = `curl -X POST ${url} -H "Content-Type: application/json" -d '{"message": "Hello World!"}'`;

    return (
        <li className="flex flex-col gap-1 border border-gray-800 p-3 rounded-md break-all">
            <div className="flex gap-2 items-center border-b border-gray-800 pb-2 mb-2">
                <Avatar src={webhook.room_file?.src} alternativeName={webhook.name} alternativeIcon={null} />
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
                <Button type="primary" display="h-5 w-5 flex items-center justify-center" title="Test webhook" onClick={() => setWebhookTest(webhook)} button="button" slot={
                    <PaperPlaneIcon fill="white" width=".8em" />
                } />
                <Button type="primary" display="h-5 w-5 flex items-center justify-center" title="Edit webhook" onClick={() => setWebhookEdit(webhook)} button="button" slot={
                    <PenIcon fill="white" width=".8em" />
                } />
                <Button type="error" display="h-5 w-5 flex items-center justify-center" button="button" title="Delete webhook" onClick={() => destroyWebhook(webhook.uuid)} slot={
                    <TrashIcon fill="white" width=".6em" />
                } />
            </div>
        </li>
    );
};

export default ChannelWebhookListItem;
