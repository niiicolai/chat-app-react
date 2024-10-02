import { useContext, JSX } from "react";
import { ChannelContext } from "../../context/channelContext";
import ChannelWebhook from "../../models/channel_webhook";
import ChannelWebhookListItem from "./ChannelWebhookListItem";
import Modal from "../utils/Modal";
import Button from "../utils/Button";
import Paginator from "../utils/Paginator";

/**
 * @interface ChannelWebhookListProps
 * @description The props for the ChannelWebhookList component
 */
interface ChannelWebhookListProps {
    webhooks: ChannelWebhook[];
    showWebhooks: boolean;
    setShowWebhooks: (show: boolean) => void;
    setWebhookEdit: (webhook: ChannelWebhook | null) => void;
    setWebhookDelete: (webhook: ChannelWebhook | null) => void;
    setShowWebhookCreate: (show: boolean) => void;
    setWebhookTest: (webhook: ChannelWebhook | null) => void;
    page: number;
    pages: number;
    previousPage: () => void;
    nextPage: () => void;
    isLoading: boolean;
    error: string;
}

/**
 * @function ChannelWebhookList
 * @param {ChannelWebhookListProps} props
 * @returns {JSX.Element}
 */
const ChannelWebhookList = (props: ChannelWebhookListProps): JSX.Element => {
    const { channels } = useContext(ChannelContext);
    const getWebhookChannel = (webhook: ChannelWebhook) => {
        const channel = channels.find((channel) => channel.uuid === webhook.channel_uuid);
        return channel;
    }

    return (
        <Modal title="Channel Webhooks" show={props.showWebhooks} setShow={props.setShowWebhooks} slot={
            <div>
                <div className="mb-3">
                    <Button 
                        type="primary" 
                        button="button" 
                        title="Create Webhook"
                        testId="channel-webhook-create-button"
                        onClick={() => props.setShowWebhookCreate(true)} slot="Create Webhook" 
                    />
                </div>

                <Paginator nextPage={props.nextPage} previousPage={props.previousPage} isLoading={props.isLoading} error={props.error} page={props.page} pages={props.pages} slot={
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-3" data-testid="channel-webhook-list">
                        {props.webhooks.map((webhook) => (
                            <ChannelWebhookListItem 
                                key={webhook.uuid}
                                webhook={webhook}
                                setWebhookEdit={props.setWebhookEdit} 
                                channel={getWebhookChannel(webhook)} 
                                setWebhookDelete={props.setWebhookDelete} 
                                setWebhookTest={props.setWebhookTest} 
                            />
                        ))}
                        {!props.webhooks.length && <li className="text-white" data-testid="channel-webhook-list-empty">No channel webhooks found</li>}
                    </ul>
                } />
            </div>
        } />
    );
};

export default ChannelWebhookList;
