import InputControlTracked from "../../components/utils/InputControlTracked";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import Channel from "../../models/channel";
import { useState, useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import { useGetChannel, useDestroyChannel } from "../../hooks/useChannels";
import { useNavigate, useParams } from "react-router-dom";

/**
 * @function ChannelDeleteView
 * @returns {JSX.Element}
 */
const ChannelDeleteView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { channel_uuid, room_uuid } = useParams<{ channel_uuid: string, room_uuid: string }>();
    const getChannel = useGetChannel(channel_uuid as string);
    const destroyChannel = useDestroyChannel(channel_uuid as string);
    const channel = getChannel.data as Channel;
    const error = getChannel.error || destroyChannel.error;
    const isLoading = getChannel.isLoading || destroyChannel.isLoading;
    const [name, setName] = useState("");

    const destroyChannelHandler = async () => {
        if (!channel_uuid || !channel) return;

        if (name !== channel.name) {
            addToast({ message: 'Channel name does not match', type: 'error', duration: 5000 });
            return;
        }

        await destroyChannel.mutateAsync(channel_uuid);
        navigate(`/room/${room_uuid}`);
        addToast({ message: 'Channel deleted', type: 'success', duration: 5000 });
    }

    const nameHandler = (event: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setName(event.currentTarget.value);
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Delete Channel
                    </div>

                    <div>
                        <Button
                            onClick={() => navigate(`/room/${room_uuid}/channel/${channel_uuid}`)}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Back to channel"
                            title="Back to channel"
                        />
                    </div>
                </div>

                <div className="p-3" data-testid="channel-delete-modal">
                    <Alert type="error" message={error} />

                    {isLoading &&
                        <div className="flex flex-col items-center justify-center gap-2">
                            <Spinner isLoading={true} fill="white" width="2em" />
                        </div>
                    }

                    {channel && !isLoading &&
                        <div>
                            <p className="text-md mb-3">
                                Are you sure you want to delete this channel? The action is irreversible. All data associated with this channel will be lost.
                            </p>

                            <p className="text-md mb-3" data-testid="channel-delete-confirm-description">
                                Enter the channel name to confirm deletion ({channel?.name}):
                            </p>

                            <InputControlTracked id="channel-delete-name" type="text" label="Channel Name" name="confirm" value={name} onChange={nameHandler} />

                            <div className="flex justify-end gap-3">
                                <Button onClick={() => navigate(`/room/${room_uuid}/channel/${channel_uuid}`)} display="p-3" button="button" type="secondary" slot="Cancel" testId="channel-delete-cancel-button" />
                                <Button onClick={() => destroyChannelHandler()} display="p-3" button="button" type="error" slot="Delete" testId="channel-delete-confirm-button" />
                            </div>
                        </div>
                    }
                </div>
            </div>
        } />
    );
};

export default ChannelDeleteView;
