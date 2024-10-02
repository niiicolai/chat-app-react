import InputControl from "../utils/InputControl";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import RoomService from "../../services/roomService";
import Room from "../../models/room";
import Channel from "../../models/channel";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import Progress from "../utils/Progress";
import { useContext, useState, JSX, FormEvent } from "react";
import { RoomContext } from "../../context/roomContext";
import { ChannelContext } from "../../context/channelContext";
import { ToastContext } from "../../context/toastContext";
import useRoomUsers from "../../hooks/useRoomUsers";

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
 * @returns {JSX.Element}
 */
const RoomSettingUpdate = (props: RoomSettingUpdateProps): JSX.Element => {
    const { rooms, setRooms, setSelectedRoom, selectedRoom } = useContext(RoomContext);
    const { channels, total: channelsTotal } = useContext(ChannelContext);
    const { addToast } = useContext(ToastContext);
    const { editSettings, setEditSettings } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const show = editSettings ? true : false;
    const { total: roomUsersTotal } = useRoomUsers();

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

        if (settings.join_message === "") {
            setError("Join message is required");
            setIsLoading(false);
            return;
        }

        if (!settings.join_message.includes("{name}")) {
            setError("Join message must contain {name}");
            setIsLoading(false);
            return;
        }

        if (settings.rules_text === "") {
            setError("Rules text is required");
            setIsLoading(false);
            return;
        }

        try {
            await RoomService.updateSettings(uuid, settings);
            const room = await RoomService.findOne(uuid);
            setRooms(rooms.map((r) => r.uuid === room.uuid ? room : r));
            if (selectedRoom?.uuid === room.uuid) {
                setSelectedRoom(room);
            }
            setEditSettings(null);
            setError(null);
            addToast({ message: 'Room settings updated successfully', type: 'success', duration: 5000 });
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
        <Modal title="Update Settings" show={show} setShow={() => setEditSettings(null)} slot={
            <div>
                <Alert type="error" message={error} testId="room-settings-alert-message" />

                {selectedRoom && (
                    <div>
                        <p className="text-md mb-3">
                            Fixed settings for the room
                        </p>

                        <div className="border-b border-gray-800 pb-3 mb-3 flex flex-col gap-3">
                            <div className="w-full">
                                <Progress type="primary" value={roomUsersTotal} max={selectedRoom.userSettings.maxUsers}
                                    slot={
                                        <span className="flex items-center gap-1 justify-center text-xs overflow-hidden truncate ...">
                                            <span>Members:</span>
                                            <span>{roomUsersTotal} / {selectedRoom.userSettings.maxUsers}</span>
                                        </span>
                                    }
                                />
                            </div>

                            <div className="w-full">
                                <Progress type="primary" value={channelsTotal} max={selectedRoom.channelSettings.maxChannels}
                                    slot={
                                        <span className="flex items-center gap-1 justify-center text-xs overflow-hidden truncate ...">
                                            <span>Channels:</span>
                                            <span>{channelsTotal} / {selectedRoom.channelSettings.maxChannels}</span>
                                        </span>
                                    }
                                />
                            </div>

                            <div className="w-full">
                                <span className="bg-gray-500 rounded-md p-2 flex items-center gap-1 justify-start text-xs overflow-hidden truncate ...">
                                    <span>Message File Max Size:</span>
                                    <span>{selectedRoom.fileSettings.singleFileMb} MB</span>
                                </span>
                            </div>

                            <div className="w-full">
                                <span className="bg-gray-500 rounded-md p-2 flex items-center gap-1 justify-start text-xs overflow-hidden truncate ...">
                                    <span>Message Retention:</span>
                                    <span>{selectedRoom.channelSettings.messagesDaysToLive} Days</span>
                                </span>
                            </div>

                            <div className="w-full">
                                <span className="bg-gray-500 rounded-md p-2 flex items-center gap-1 justify-start text-xs overflow-hidden truncate ...">
                                    <span>Message File Retention:</span>
                                    <span>{selectedRoom.fileSettings.fileDaysToLive} Days</span>
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <p className="text-md mb-3">
                    Enter the details to update a room setting
                </p>

                {editSettings && (
                    <div>
                        <form onSubmit={updateRoomSettings} className="text-white" data-testid="room-settings-edit-form">
                            <InputControl
                                id="update_settings_join_channel_uuid"
                                type="select"
                                label="Join Channel"
                                name="join_channel_uuid"
                                defaultValue={editSettings.joinSettings.channelUuid}
                                options={channels.map((channel: Channel) => (
                                    <option key={channel.uuid} value={channel.uuid}>
                                        {channel.name}
                                    </option>
                                )
                                )} />

                            <InputControl
                                id="update_settings_join_message"
                                type="text"
                                label="Join Message ({name} will be replaced with the user's name)"
                                name="join_message"
                                defaultValue={editSettings.joinSettings.message}
                            />

                            <InputControl
                                id="update_settings_rules_text"
                                type="textarea"
                                label="README (Markdown)"
                                name="rules_text"
                                defaultValue={editSettings.rulesSettings.text}
                            />

                            <div className="flex flex-col gap-2">
                                <Button type="primary" button="submit" slot={
                                    <span>{isLoading ? <Spinner isLoading={isLoading} width="2em" fill="white" /> : "Update"}</span>
                                } />
                                <Button type="secondary" button="button" slot="Cancel" onClick={() => setEditSettings(null)} />
                            </div>
                        </form>
                    </div>
                )}
            </div>
        } />
    );
};

export default RoomSettingUpdate;
