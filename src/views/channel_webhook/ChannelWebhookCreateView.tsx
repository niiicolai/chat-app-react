import InputControlTracked from "../../components/utils/InputControlTracked";
import InputControl from "../../components/utils/InputControl";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import Channel from "../../models/channel";
import { useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { useGetChannels } from "../../hooks/useChannels";
import { useCreateChannelWebhook } from "../../hooks/useChannelWebhooks";

/**
 * @function ChannelWebhookCreateView
 * @returns {JSX.Element}
 */
const ChannelWebhookCreateView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { room_uuid } = useParams<{ room_uuid: string }>();
    const getChannels = useGetChannels(room_uuid as string);
    const createChannel = useCreateChannelWebhook();
    const [uuid] = useState(uuidv4());
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [channelUuid, setChannelUuid] = useState('');
    const channels = getChannels.data?.data;
    const error = createChannel.error || getChannels.error;
    const isLoading = createChannel.isLoading;
    const isLoadingChannel = getChannels.isLoading;

    useEffect(() => {
        if (channels && channels.length > 0) {
            setChannelUuid(channels[0].uuid);
        }
        return () => { };
    }, [channels]);

    const createHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!room_uuid) return;

        if (name === '') {
            addToast({ message: 'Name is required', type: 'error', duration: 5000 });
            return;
        }

        if (description === '') {
            addToast({ message: 'Description is required', type: 'error', duration: 5000 });
            return;
        }

        if (channelUuid === '') {
            addToast({ message: 'Channel is required', type: 'error', duration: 5000 });
            return;
        }

        try {
            const formData = new FormData(e.currentTarget);
            await createChannel.mutateAsync(formData);
            navigate(`/room/${room_uuid}/webhooks`);
            addToast({ message: 'Channel webhook created successfully', type: 'success', duration: 5000 });
        } catch {
            addToast({ message: 'Failed to create channel webhook', type: 'error', duration: 5000 });
        }
    }

    const nameHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setName(e.currentTarget.value);
    }

    const descriptionHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setDescription(e.currentTarget.value);
    }

    const channelUuidHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setChannelUuid(e.currentTarget.value);
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Create Channel Webhook
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
                    <Alert type="error" message={error} testId="channel-webhook-create-alert-message" />

                    <p className="text-md mb-3">
                        Enter the details to create a new channel webhook.
                    </p>

                    <form onSubmit={createHandler} data-testid="channel-webhook-create-form">
                        <input type="hidden" name="uuid" value={uuid} />

                        <InputControlTracked
                            id="webhook-create-name"
                            type="text"
                            label="Name"
                            name="name"
                            value={name}
                            onChange={nameHandler}
                        />

                        <InputControlTracked
                            id="webhook-create-description"
                            type="text"
                            label="Desc"
                            name="description"
                            value={description}
                            onChange={descriptionHandler}
                        />

                        {isLoadingChannel && (
                            <div className="flex gap-2 items-center">
                                <Spinner isLoading={isLoadingChannel} width="2em" fill="white" />
                                <p>Loading channels...</p>
                            </div>
                        )}
                        {channels && !isLoadingChannel && (
                            <InputControlTracked
                                id="webhook-create-channel-uuid"
                                name="channel_uuid"
                                type="select"
                                label="Channel"
                                value={channelUuid}
                                onChange={channelUuidHandler}
                                options={channels.map((channel: Channel) => (
                                    <option key={channel.uuid} value={channel.uuid}>{channel.name}</option>
                                ))}
                            />
                        )}

                        <InputControl
                            id="webhook-create-file"
                            type="file"
                            label="Avatar"
                            name="file"
                        />

                        <div className="flex flex-col gap-2">
                            <Button type="primary" button="submit" slot={
                                <span>
                                    {isLoading
                                        ? <Spinner isLoading={isLoading} width="2em" fill="white" />
                                        : "Create"
                                    }
                                </span>
                            } />
                        </div>
                    </form>
                </div>
            </div>
        } />
    );
};

export default ChannelWebhookCreateView;
