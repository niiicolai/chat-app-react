import InputControl from "../../components/utils/InputControl";
import InputControlTracked from "../../components/utils/InputControlTracked";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import ChannelWebhook from "../../models/channel_webhook";
import { useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import { useNavigate, useParams } from "react-router-dom";
import { useGetChannels } from "../../hooks/useChannels";
import { useGetChannelWebhook, useUpdateChannelWebhook } from "../../hooks/useChannelWebhooks";
import { useDestroyAvatar } from "../../hooks/useChannelWebhooks";

/**
 * @function ChannelWebhookEditView
 * @returns {JSX.Element}
 */
const ChannelWebhookEditView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { room_uuid, channel_webhook_uuid } = useParams<{ room_uuid: string, channel_webhook_uuid: string }>();
    const getChannelWebhook = useGetChannelWebhook(channel_webhook_uuid as string);
    const updateChannelWebhook = useUpdateChannelWebhook(channel_webhook_uuid as string);
    const destroyAvatar = useDestroyAvatar(channel_webhook_uuid as string);
    const getChannels = useGetChannels(room_uuid as string);
    const webhook = getChannelWebhook.data as ChannelWebhook;
    const channels = getChannels.data?.data;
    const isLoading = getChannelWebhook.isLoading || updateChannelWebhook.isLoading || destroyAvatar.isLoading;
    const error = getChannelWebhook.error || updateChannelWebhook.error || destroyAvatar.error || getChannels.error;
    const isLoadingChannels = getChannels.isLoading;

    const updateHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!channel_webhook_uuid) return;

        const formData = new FormData(e.currentTarget);
        if (formData.get('name') === '') {
            addToast({ message: 'Name is required', type: 'error', duration: 5000 });
            return;
        }

        if (formData.get('description') === '') {
            addToast({ message: 'Description is required', type: 'error', duration: 5000 });
            return;
        }

        try {
            await updateChannelWebhook.mutateAsync({ uuid: channel_webhook_uuid, formData });
            navigate(`/room/${room_uuid}/webhooks`);
            addToast({ message: 'Channel webhook updated', type: 'success', duration: 5000 });
        } catch (error) {
            addToast({ message: 'Error updating channel webhook', type: 'error', duration: 5000 });
        }
    }

    const destroyAvatarHandler = async () => {
        if (!channel_webhook_uuid || !webhook?.room_file) return;

        try {
            await destroyAvatar.mutateAsync(webhook.room_file.uuid);
            addToast({ message: 'Avatar removed', type: 'success', duration: 5000 });
        } catch (error) {
            addToast({ message: 'Error removing avatar', type: 'error', duration: 5000 });
        }
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Update Channel Webhook
                    </div>

                    <div>
                        <Button
                            onClick={() => navigate(`/room/${room_uuid}/webhooks`)}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Back to Webhooks"
                            title="Back to Webhooks"
                        />
                    </div>
                </div>

                <div className="p-3">
                    <Alert type="error" message={error} testId="channel-webhook-edit-alert-message" />

                    <p className="text-md mb-3">
                        Enter the details to update the channel webhook.
                    </p>

                    <form onSubmit={updateHandler} data-testid="channel-webhook-edit-form">
                        <input type="hidden" name="uuid" defaultValue={webhook?.uuid} />

                        <InputControl
                            id="webhook-update-name"
                            type="text"
                            label="Name"
                            name="name"
                            defaultValue={webhook?.name}
                        />

                        <InputControl
                            id="webhook-update-description"
                            type="text"
                            label="Desc"
                            name="description"
                            defaultValue={webhook?.description}
                        />

                        {isLoadingChannels && (
                            <div className="text-center">
                                <Spinner isLoading={isLoadingChannels} width="2em" fill="white" />
                                <p>Loading channels...</p>
                            </div>
                        )}
                        {channels && !isLoadingChannels && (
                            <InputControl
                                id="webhook-update-channel-uuid"
                                name="channel_uuid"
                                type="select"
                                label="Channel"
                                defaultValue={webhook?.channel_uuid}
                                options={channels.map((channel) => (
                                    <option key={channel.uuid} value={channel.uuid}>{channel.name}</option>
                                ))
                                } />
                        )}

                        <InputControlTracked
                            id="webhook-update-file"
                            type="file"
                            label="Avatar"
                            name="file"
                            value={webhook?.room_file?.src || ''}
                            onChange={() => { }}
                            footerSlot={
                                <div>
                                    {webhook?.room_file?.src &&
                                        <div className="p-3">
                                            <Button
                                                type="error"
                                                onClick={() => destroyAvatarHandler()}
                                                button="button"
                                                slot="Delete Avatar"
                                            />
                                        </div>
                                    }
                                </div>
                            }
                        />

                        <div className="flex flex-col gap-2">
                            {
                                isLoading
                                    ? <Spinner isLoading={isLoading} width="2em" fill="white" />
                                    : (<>
                                        <Button type="primary" button="submit" slot="Update" />
                                        <Button
                                            type="secondary"
                                            button="button"
                                            slot="Cancel"
                                            onClick={() => { navigate(`/room/${room_uuid}/webhooks`) }}
                                        />
                                    </>)
                            }
                        </div>
                    </form>
                </div>
            </div>
        } />
    );
};

export default ChannelWebhookEditView;
