import InputControl from "../../components/utils/InputControl";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import Progress from "../../components/utils/Progress";

import RoomService from "../../services/roomService";
import Room from "../../models/room";
import Channel from "../../models/channel";

import { useContext, useState, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import { useParams, useNavigate } from "react-router-dom";
import { useGetRoom, useUpdateRoomSettings } from "../../hooks/useRooms";
import { useGetRoomUsers } from "../../hooks/useRoomUsers";
import { useGetChannels } from "../../hooks/useChannels";

/**
 * @function RoomSettingUpdate
 * @returns {JSX.Element}
 */
const RoomSettingEditView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { room_uuid } = useParams<{ room_uuid: string }>();
    const getRoomUsers = useGetRoomUsers(room_uuid as string);
    const getRoom = useGetRoom(room_uuid as string).query;
    const getChannels = useGetChannels(room_uuid as string);
    const updateRoomSettings = useUpdateRoomSettings(room_uuid as string);

    const room = getRoom.data as Room;
    const channels = getChannels.data?.data as Channel[];

    const error = getRoom.error || getRoomUsers.error || getChannels.error;
    const isLoading = getRoom.isLoading || getRoomUsers.isLoading || getChannels.isLoading;

    const roomUsersTotal = getRoomUsers.data?.total || 0;
    const channelsTotal = getChannels.data?.total || 0;

    const updateRoomSettingsHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!room_uuid) return;

        const formData = new FormData(e.currentTarget);
        const join_message = formData.get("join_message") as string;
        const rules_text = formData.get("rules_text") as string;
        const join_channel_uuid = formData.get("join_channel_uuid") as string;

        if (!join_message) {
            addToast({ message: 'Join message is required', type: 'error', duration: 5000 });
            return;
        }

        if (!join_message.includes("{name}")) {
            addToast({ message: 'Join message must contain {name}', type: 'error', duration: 5000 });
            return;
        }

        if (!rules_text) {
            addToast({ message: 'Rules text is required', type: 'error', duration: 5000 });
            return;
        }

        await updateRoomSettings.mutateAsync({
            uuid: room_uuid, settings: {
                join_message,
                rules_text,
                join_channel_uuid
            }
        });
        navigate(`/room/${room_uuid}`);
        addToast({ message: 'Room settings updated', type: 'success', duration: 5000 });
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Edit Room Settings
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => navigate(`/room/${room_uuid}`)}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Back to Room"
                            title="Back to Room"
                        />
                    </div>
                </div>

                <div className="p-3">
                    <Alert type="error" message={error} testId="room-settings-alert-message" />

                    {room && (
                        <div>
                            <p className="text-md mb-3">
                                Fixed settings for the room
                            </p>

                            <div className="border-b border-gray-800 pb-3 mb-3 flex flex-col gap-3">
                                <div className="w-full">
                                    <Progress type="primary" value={roomUsersTotal} max={room.userSettings.max_users}
                                        slot={
                                            <span className="flex items-center gap-1 justify-center text-xs overflow-hidden truncate ...">
                                                <span>Members:</span>
                                                <span>{roomUsersTotal} / {room.userSettings.max_users}</span>
                                            </span>
                                        }
                                    />
                                </div>

                                <div className="w-full">
                                    <Progress type="primary" value={channelsTotal} max={room.channelSettings.max_channels}
                                        slot={
                                            <span className="flex items-center gap-1 justify-center text-xs overflow-hidden truncate ...">
                                                <span>Channels:</span>
                                                <span>{channelsTotal} / {room.channelSettings.max_channels}</span>
                                            </span>
                                        }
                                    />
                                </div>

                                <div className="w-full">
                                    <span className="bg-gray-500 rounded-md p-2 flex items-center gap-1 justify-start text-xs overflow-hidden truncate ...">
                                        <span>Message File Max Size:</span>
                                        <span>{room.fileSettings.single_file_mb} MB</span>
                                    </span>
                                </div>

                                <div className="w-full">
                                    <span className="bg-gray-500 rounded-md p-2 flex items-center gap-1 justify-start text-xs overflow-hidden truncate ...">
                                        <span>Message Retention:</span>
                                        <span>{room.channelSettings.message_days_to_live} Days</span>
                                    </span>
                                </div>

                                <div className="w-full">
                                    <span className="bg-gray-500 rounded-md p-2 flex items-center gap-1 justify-start text-xs overflow-hidden truncate ...">
                                        <span>Message File Retention:</span>
                                        <span>{room.fileSettings.file_days_to_live} Days</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <p className="text-md mb-3">
                        Enter the details to update a room setting
                    </p>

                    {room && (
                        <div>
                            <form onSubmit={updateRoomSettingsHandler} className="text-white" data-testid="room-settings-edit-form">
                                {!isLoading && (
                                    <InputControl
                                        id="update_settings_join_channel_uuid"
                                        type="select"
                                        label="Join Channel"
                                        name="join_channel_uuid"
                                        defaultValue={room.joinSettings.join_channel_uuid}
                                        options={channels.map((channel: Channel) => (
                                            <option key={channel.uuid} value={channel.uuid}>
                                                {channel.name}
                                            </option>
                                        )
                                        )} />
                                )}

                                <InputControl
                                    id="update_settings_join_message"
                                    type="text"
                                    label="Join Message ({name} will be replaced with the user's name)"
                                    name="join_message"
                                    defaultValue={room.joinSettings.join_message}
                                />

                                <InputControl
                                    id="update_settings_rules_text"
                                    type="textarea"
                                    label="README (Markdown)"
                                    name="rules_text"
                                    defaultValue={room.rulesSettings.rules_text}
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
                                                    onClick={() => { navigate(`/room/${room_uuid}`) }}
                                                />
                                            </>)
                                    }
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        } />
    );
};

export default RoomSettingEditView;
