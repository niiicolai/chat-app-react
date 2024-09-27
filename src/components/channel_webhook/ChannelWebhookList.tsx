import ChannelWebhook from "../../models/channel_webhook";
import ChannelWebhookListItem from "./ChannelWebhookListItem";
import { useContext, ReactNode } from "react";
import { ChannelContext } from "../../context/channelContext";
import Modal from "../utils/Modal";
import Button from "../utils/Button";

/**
 * @interface ChannelWebhookListProps
 * @description The props for the ChannelWebhookList component
 */
interface ChannelWebhookListProps {
    webhooks: ChannelWebhook[];
    showWebhooks: boolean;
    setShowWebhooks: (show: boolean) => void;
    setWebhookEdit: (webhook: ChannelWebhook | null) => void;
    destroyWebhook: (uuid: string) => void;
    setShowWebhookCreate: (show: boolean) => void;
    setWebhookTest: (webhook: ChannelWebhook | null) => void;
}

/**
 * @function ChannelWebhookList
 * @param {ChannelWebhookListProps} props
 * @returns {ReactNode}
 */
const ChannelWebhookList = (props: ChannelWebhookListProps): ReactNode => {
    const { channels } = useContext(ChannelContext);
    const { showWebhooks, setShowWebhooks, webhooks, setWebhookEdit, destroyWebhook, setShowWebhookCreate, setWebhookTest } = props;
    const getWebhookChannel = (webhook: ChannelWebhook) => {
        const channel = channels.find((channel) => channel.uuid === webhook.channel_uuid);
        return channel;
    }
    return (
        <Modal title="Channel Webhooks" show={showWebhooks} setShow={setShowWebhooks} slot={
            <div>
                <div className="mb-3">
                    <Button type="primary" button="button" title="Create Webhook"
                    onClick={() => setShowWebhookCreate(true)} slot="Create Webhook" />
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-3">
                    {webhooks.map((webhook) => (
                        <ChannelWebhookListItem webhook={webhook} key={webhook.uuid} setWebhookEdit={setWebhookEdit} channel={getWebhookChannel(webhook)} destroyWebhook={destroyWebhook} setWebhookTest={setWebhookTest} />
                    ))}
                    {!webhooks.length && <li className="text-white">No channel webhooks found</li>}
                </ul>
            </div>
        } />
    );
};

export default ChannelWebhookList;
