import InputControl from "../utils/InputControl";
import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import Channel from "../../models/channel";
import ChannelService from "../../services/channelService";
import RoomFileService from "../../services/roomFileService";
import { FormEvent, JSX, useContext, useState } from "react";
import { ChannelContext } from "../../context/channelContext";
import { ToastContext } from "../../context/toastContext";

/**
 * @interface ChannelUpdateProps
 * @description The props for the ChannelUpdate component
 */
interface ChannelUpdateProps {
    editChannel: Channel | null;
    setEditChannel: (channel: Channel | null) => void;
}

/**
 * @function ChannelUpdate
 * @param {ChannelUpdateProps} props
 * @returns {JSX.Element}
 */
const ChannelUpdate = (props: ChannelUpdateProps): JSX.Element => {
    const { editChannel, setEditChannel } = props;
    const { addToast } = useContext(ToastContext);
    const { selectedChannel, setChannels, channels, setSelectedChannel } = useContext(ChannelContext);
    const [file, setFile] = useState('' as string | Blob);
    const [error, setError] = useState('' as string);
    const [isLoading, setIsLoading] = useState(false);
    const show = editChannel !== null;

    const update = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const uuid = formData.get('uuid') as string;
            formData.set('file', file);
            if (!uuid) return;
            const response = await ChannelService.update(uuid, formData);
            setEditChannel(null);
            setFile(editChannel?.room_file?.src || '');
            setError('');
            setChannels(channels.map((channel: Channel) => channel.uuid === response.uuid
                ? response : channel));
            if (selectedChannel?.uuid === response.uuid) {
                setSelectedChannel(response);
            }
            addToast({ message: 'Channel updated', type: 'success', duration: 5000 });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const destroyAvatar = async () => {
        try {
            if (!editChannel || !editChannel.room_file) return;
            await RoomFileService.destroy(editChannel.room_file.uuid);
            setFile('');
            setError('');
            setChannels(channels.map((channel: Channel) => channel.uuid === editChannel.uuid
                ? { ...editChannel, room_file: null } : channel));
            if (selectedChannel && selectedChannel.uuid === editChannel.uuid) {
                selectedChannel.room_file = null;
                setSelectedChannel(selectedChannel);
            }
            setEditChannel(null);
            addToast({ message: 'Avatar deleted', type: 'success', duration: 5000 });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    const fileHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        if (!target.files || !target.files.length) {
            setFile('');
            return;
        }
        setFile(target.files[0]);
    }

    return (
        <Modal title="Update Channel" show={show} setShow={() => setEditChannel(null)} slot={
            <div>
                <div>
                    <Alert type="error" message={error} />

                    <p className="text-md mb-3">
                        Enter the details to update the channel.
                    </p>

                    <form onSubmit={update}>
                        <input type="hidden" name="uuid" value={editChannel?.uuid || ''} />

                        <InputControl
                            id="channel-update-name"
                            label="Name"
                            type="text"
                            name="name" defaultValue={editChannel?.name || ''}
                        />

                        <InputControl
                            id="channel-update-description"
                            label="Description"
                            type="text"
                            name="description"
                            defaultValue={editChannel?.description || ''}
                        />

                        <InputControlTracked
                            id="channel-update-file"
                            type="file"
                            label="Avatar"
                            name="file" value={editChannel?.room_file?.src || ''}
                            onChange={fileHandler}
                            footerSlot={
                                <div>
                                    {editChannel?.room_file?.src &&
                                        <div className="p-3">
                                            <Button
                                                type="error"
                                                onClick={() => destroyAvatar()}
                                                button="button"
                                                slot="Delete Avatar"
                                            />
                                        </div>
                                    }
                                </div>
                            }
                        />

                        <div className="flex flex-col gap-2">
                            <Button type="primary" button="submit" slot={
                                <span>
                                    {isLoading
                                        ? <Spinner isLoading={isLoading} width="2em" fill="white" />
                                        : "Update"
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

export default ChannelUpdate;
