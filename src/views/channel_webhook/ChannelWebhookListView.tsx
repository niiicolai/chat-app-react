import Restricted from "../../components/utils/Restricted";
import Button from "../../components/utils/Button";
import Paginator from "../../components/utils/Paginator";
import ChannelWebhook from "../../models/channel_webhook";
import ChannelWebhookListItem from "../../components/channel_webhook/ChannelWebhookListItem";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAuthenticatedRoomUser } from "../../hooks/useRoomUsers";
import { useGetChannels } from "../../hooks/useChannels";
import { useGetChannelWebhooks } from "../../hooks/useChannelWebhooks";

/**
 * @function ChannelWebhookListView
 * @returns {JSX.Element}
 */
const ChannelWebhookListView = (): JSX.Element => {
    const navigate = useNavigate();
    const { room_uuid } = useParams<{ room_uuid: string }>();
    const getRoomUser = useGetAuthenticatedRoomUser(room_uuid as string);
    const getChannels = useGetChannels(room_uuid as string);
    const getChannelWebhooks = useGetChannelWebhooks(room_uuid as string);
    const roomUser = getRoomUser.data;
    const channels = getChannels.data?.data;
    const isAdmin = roomUser?.room_user_role_name === 'Admin';
    const isLoading = getChannelWebhooks.isLoading || getChannels.isLoading || getRoomUser.isLoading;
    const error = getChannelWebhooks.error || getChannels.error || getRoomUser.error;
    const { data: webhookData, pages, page, nextPage, previousPage } = getChannelWebhooks;
    const webhooks = webhookData?.data;

    const getWebhookChannel = (webhook: ChannelWebhook) => {
        if (!channels) return null;

        const channel = channels.find((channel) => channel.uuid === webhook.channel_uuid);
        return channel;
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Channel Webhooks
                    </div>

                    <div className="flex gap-3">
                        {isAdmin &&
                            <Button
                                type="primary"
                                button="button"
                                display="px-3 py-1 w-full block text-sm"
                                title="Create Webhook"
                                testId="channel-webhook-create-button"
                                onClick={() => navigate(`/room/${room_uuid}/webhook/create`)}
                                slot="Create Webhook"
                            />
                        }

                        <Button
                            onClick={() => navigate(`/room/${room_uuid}`)}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Back to Room"
                            title="Back to Room"
                        />
                    </div>
                </div>

                <div className="p-3">
                    <Paginator nextPage={nextPage} previousPage={previousPage} isLoading={isLoading} error={error} page={page} pages={pages} slot={
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-3" data-testid="channel-webhook-list">
                            {webhooks && webhooks.map((webhook: ChannelWebhook) => (
                                <ChannelWebhookListItem
                                    key={webhook.uuid}
                                    webhook={webhook}
                                    channel={getWebhookChannel(webhook)}
                                    room_uuid={room_uuid}
                                />
                            ))}
                            {!webhooks || !webhooks.length && (
                                <li className="text-white" data-testid="channel-webhook-list-empty">No channel webhooks found</li>
                            )}
                        </ul>
                    } />
                </div>
            </div>
        } />
    );
};

export default ChannelWebhookListView;
