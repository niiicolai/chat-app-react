import InputControlTracked from "../../components/utils/InputControlTracked";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import ChannelWebhook from "../../models/channel_webhook";
import { useState, useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import { useNavigate, useParams } from "react-router-dom";
import { useGetChannelWebhook, useDestroyChannelWebhook } from "../../hooks/useChannelWebhooks";

/**
 * @function ChannelWebhookDeleteView
 * @returns {JSX.Element}
 */
const ChannelWebhookDeleteView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { room_uuid, channel_webhook_uuid } = useParams<{ room_uuid: string, channel_webhook_uuid: string }>();
    const getChannelWebhook = useGetChannelWebhook(channel_webhook_uuid as string);
    const destroyChannelWebhook = useDestroyChannelWebhook(channel_webhook_uuid as string);
    const channelWebhook = getChannelWebhook.data as ChannelWebhook;
    const isLoading = getChannelWebhook.isLoading || destroyChannelWebhook.isLoading;
    const error = getChannelWebhook.error || destroyChannelWebhook.error;
    const [name, setName] = useState("");

    const destroyHandler = async () => {
        if (!channel_webhook_uuid) return;

        if (name.toLowerCase() !== channelWebhook.name.toLowerCase()) {
            addToast({ message: 'The provided name must match: ' + channelWebhook.name, type: 'error', duration: 5000 });
            return;
        }

        try {
            await destroyChannelWebhook.mutateAsync(channel_webhook_uuid);
            navigate(`/room/${room_uuid}/webhooks`);
            addToast({ message: 'Channel webhook deleted successfully', type: 'success', duration: 5000 });
        } catch (error) {
            addToast({ message: 'Error deleting channel webhook', type: 'error', duration: 5000 });
        }
    }

    const nameHandler = (event: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setName(event.currentTarget.value);
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Delete Channel Webhook
                    </div>

                    <div>
                        <Button
                            onClick={() => navigate('/')}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Dashboard"
                            title="Dashboard"
                        />
                    </div>
                </div>

                <div className="p-3" data-testid="channel-webhook-delete-modal">
                    <Alert type="error" message={error} />

                    {isLoading &&
                        <div className="flex flex-col items-center justify-center gap-2">
                            <Spinner isLoading={true} fill="white" width="2em" />
                            <p className="text-md">Deleting channel webook...</p>
                        </div>
                    }

                    {channelWebhook && !isLoading &&
                        <div>
                            <p className="text-md mb-3">
                                Are you sure you want to delete this channel webook? The action is irreversible. All data associated with this room will be lost.
                            </p>

                            <p className="text-md mb-3" data-testid="channel-webhook-confirm-description">
                                Enter the name of the channel webhook to confirm deletion ({channelWebhook.name}).
                            </p>

                            <InputControlTracked id="channel-webhook-delete-name" type="text" label="Name" name="name" value={name} onChange={nameHandler} />

                            <div className="flex justify-end gap-3">
                                <Button onClick={() => navigate(`/room/${room_uuid}/webhooks`)} display="p-3" button="button" type="secondary" slot="Cancel" testId="channel-webhook-delete-cancel-button" />
                                <Button onClick={() => destroyHandler()} display="p-3" button="button" type="error" slot="Delete" testId="channel-webhook-delete-confirm-button" />
                            </div>
                        </div>
                    }

                </div>
            </div>
        } />
    );
};

export default ChannelWebhookDeleteView;
