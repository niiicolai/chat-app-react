import { useState, useContext, JSX, FormEvent } from "react";
import { ChannelContext } from "../../context/channelContext";
import { ToastContext } from "../../context/toastContext";
import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Channel from "../../models/channel";
import ChannelService from "../../services/channelService";

/**
 * @interface ChannelDeleteProps
 * @description The props for the ChannelDelete component
 */
interface ChannelDeleteProps {
    showDeleteChannel: boolean;
    setShowDeleteChannel: (show: boolean) => void;
}

/**
 * @function ChannelDelete
 * @param {ChannelDeleteProps} props
 * @returns {JSX.Element}
 */
const ChannelDelete = (props: ChannelDeleteProps): JSX.Element => {
    const { addToast } = useContext(ToastContext);
    const { channels, setChannels, selectedChannel, setSelectedChannel, setTotal, total } = useContext(ChannelContext); 
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const { showDeleteChannel, setShowDeleteChannel } = props;

    const destroyChannel = async (uuid: string | undefined) => {
        if (!uuid) return;
        setIsLoading(true);
        if (name !== selectedChannel?.name) {
            addToast({ message: 'Channel name does not match', type: 'error', duration: 5000 });
            setIsLoading(false);
            return;
        }
        try {
            await ChannelService.destroy(uuid);
            setChannels(channels.filter((channel: Channel) => channel.uuid !== uuid));
            if (selectedChannel?.uuid === uuid) {
                setSelectedChannel(null);
            }
            setTotal(total - 1);
            addToast({ message: 'Channel deleted successfully', type: 'success', duration: 5000 });
        } catch (err: unknown) {
            if (err instanceof Error) {
                addToast({ message: err.message, type: 'error', duration: 5000 });
            } else {
                addToast({ message: 'An unknown error occurred', type: 'error', duration: 5000 });
            }
        } finally {
            setIsLoading(false);
            setShowDeleteChannel(false);
        }
    }

    const nameHandler = (event: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setName(event.currentTarget.value);
    }

    return (
        <Modal title="Delete Channel" show={showDeleteChannel} setShow={setShowDeleteChannel} slot={
            <div data-testid="channel-delete-modal">
                {isLoading &&
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Spinner isLoading={true} fill="white" width="2em" />
                        <p className="text-md">Deleting channel...</p>
                    </div>
                }

                {!isLoading &&
                    <div>
                        <p className="text-md mb-3">
                            Are you sure you want to delete this channel? The action is irreversible. All data associated with this channel will be lost.
                        </p>

                        <p className="text-md mb-3" data-testid="channel-delete-confirm-description">
                            Enter the channel name to confirm deletion ({selectedChannel?.name}):
                        </p>

                        <InputControlTracked id="channel-delete-name" type="text" label="Channel Name" name="confirm" value={name} onChange={nameHandler} />

                        <div className="flex justify-end gap-3">
                            <Button onClick={() => setShowDeleteChannel(false)} display="p-3" button="button" type="secondary" slot="Cancel" testId="channel-delete-cancel-button" />
                            <Button onClick={() => destroyChannel(selectedChannel?.uuid)} display="p-3" button="button" type="error" slot="Delete" testId="channel-delete-confirm-button" />
                        </div>
                    </div>
                }

            </div>
        } />
    );
};

export default ChannelDelete;
