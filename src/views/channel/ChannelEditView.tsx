import InputControl from "../../components/utils/InputControl";
import InputControlTracked from "../../components/utils/InputControlTracked";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import Channel from "../../models/channel";
import { FormEvent, JSX, useContext } from "react";
import { ToastContext } from "../../context/toastContext";
import { useNavigate, useParams } from "react-router-dom";
import { useGetChannel, useUpdateChannel, useDestroyAvatar } from "../../hooks/useChannels";

/**
 * @function ChannelUpdateView
 * @returns {JSX.Element}
 */
const ChannelEditView = (): JSX.Element => {
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const { channel_uuid, room_uuid } = useParams<{ channel_uuid: string, room_uuid: string }>();
    const getChannel = useGetChannel(channel_uuid as string);
    const updateChannel = useUpdateChannel(channel_uuid as string);
    const destroyAvatar = useDestroyAvatar(channel_uuid as string);
    const channel = getChannel.data as Channel;
    const error = getChannel.error || updateChannel.error || destroyAvatar.error;
    const isLoading = updateChannel.isLoading || destroyAvatar.isLoading;

    const updateHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!channel_uuid) return;

        const formData = new FormData(e.currentTarget);

        if (formData.get('name') === '') {
            addToast({ message: 'Name is required', type: 'error', duration: 5000 });
            return;
        }

        if (formData.get('description') === '') {
            addToast({ message: 'Description is required', type: 'error', duration: 5000 });
            return;
        }

        await updateChannel.mutateAsync({ uuid: channel_uuid, formData });
        navigate(`/room/${room_uuid}/channel/${channel_uuid}`);
        addToast({ message: 'Channel updated', type: 'success', duration: 5000 });
    };

    const destroyAvatarHandler = async () => {
        if (!channel.room_file) return;
        await destroyAvatar.mutateAsync(channel.room_file.uuid);
        addToast({ message: 'Avatar deleted', type: 'success', duration: 5000 });
    };

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Edit Channel
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

                <div className="p-3">
                    <div>
                        <Alert type="error" message={error} testId="channel-edit-alert-message" />

                        <p className="text-md mb-3">
                            Enter the details to update the channel.
                        </p>

                        <form onSubmit={updateHandler} data-testid="channel-edit-form">
                            <input type="hidden" name="uuid" value={channel_uuid} />

                            <InputControl
                                id="channel-update-name"
                                label="Name"
                                type="text"
                                name="name" defaultValue={channel.name || ''}
                            />

                            <InputControl
                                id="channel-update-description"
                                label="Description"
                                type="text"
                                name="description"
                                defaultValue={channel.description || ''}
                            />

                            <InputControlTracked
                                id="channel-update-file"
                                type="file"
                                label="Avatar"
                                name="file"
                                value={channel.room_file?.src as string}
                                onChange={() => { }}
                                footerSlot={
                                    <div>
                                        {channel.room_file?.src &&
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
                                                onClick={() => { navigate(`/room/${room_uuid}/channel/${channel_uuid}`) }}
                                            />
                                        </>)
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        } />
    );
};

export default ChannelEditView;
