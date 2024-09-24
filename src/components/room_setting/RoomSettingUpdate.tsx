import InputControl from "../utils/InputControl";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import RoomService from "../../services/roomService";
import Room from "../../models/room";
import Channel from "../../models/channel";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import { useContext, useState, ReactNode, FormEvent } from "react";
import { RoomContext } from "../../context/roomContext";
import { ChannelContext } from "../../context/channelContext";
import { ToastContext } from "../../context/toastContext";

/**
 * @interface RoomSettingUpdateProps
 * @description The props for the RoomSettingUpdate component
 */
interface RoomSettingUpdateProps {
    editSettings: Room | null;
    setEditSettings: (room: Room | null) => void;
}

/**
 * @function RoomSettingUpdate
 * @param {RoomSettingUpdateProps} props
 * @returns {ReactNode}
 */
const RoomSettingUpdate = (props: RoomSettingUpdateProps): ReactNode => {
    const { rooms, setRooms, setSelectedRoom, selectedRoom } = useContext(RoomContext);
    const { channels } = useContext(ChannelContext);
    const { addToast } = useContext(ToastContext);
    const { editSettings, setEditSettings } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateRoomSettings = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const settings = {
            join_channel_uuid: formData.get("join_channel_uuid") as string,
            join_message: formData.get("join_message") as string,
            rules_text: formData.get("rules_text") as string
        };
        const uuid = editSettings?.uuid;
        if (!uuid) return;
        try {
            await RoomService.updateSettings(uuid, settings);
            const room = await RoomService.findOne(uuid);
            setRooms(rooms.map((r) => r.uuid === room.uuid ? room : r));
            if (selectedRoom?.uuid === room.uuid) {
                setSelectedRoom(room);
            }
            setEditSettings(null);
            addToast({ message: 'Room settings updated', type: 'success', duration: 5000 });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal title="Update Settings" show={editSettings} setShow={() => setEditSettings(null)} slot={
            <div>
                <Alert type="error" message={error} />

                <p className="text-md mb-3">
                    Enter the details to update a room setting
                </p>

                {editSettings && (
                    <form onSubmit={updateRoomSettings} className="text-white">
                        <InputControl id="join_channel_uuid" type="select" label="Join Channel UUID" name="join_channel_uuid" defaultValue={editSettings.joinSettings.channelUuid} options={channels.map((channel: Channel) => (
                            <option key={channel.uuid} value={channel.uuid}>
                                {channel.name}
                            </option>
                        ))} />
                        <InputControl id="join_message" type="text" label="Join Message" name="join_message" defaultValue={editSettings.joinSettings.message} />
                        <InputControl id="rules_text" type="text" label="Rules Text" name="rules_text" defaultValue={editSettings.rulesSettings.text} />

                        <div className="flex flex-col gap-2">
                            <Button type="primary" button="submit" slot={
                                <span>{isLoading ? <Spinner isLoading={isLoading} width="2em" fill="white" /> : "Update"}</span>
                            } />
                            <Button type="secondary" button="button" slot="Cancel" onClick={() => setEditSettings(null)} />
                        </div>
                    </form>
                )}
            </div>
        } />
    );
};

export default RoomSettingUpdate;
