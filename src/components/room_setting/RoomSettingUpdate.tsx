import InputControl from "../utils/InputControl";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import RoomService from "../../services/roomService";
import { useContext } from "react";
import { RoomContext } from "../../context/roomContext";
import { ChannelContext } from "../../context/channelContext";

const RoomSettingUpdate = (props: any) => {
    const { editSettings, setEditSettings } = props;
    const { rooms, setRooms, setSelectedRoom, selectedRoom } = useContext(RoomContext);
    const { channels } = useContext(ChannelContext);

    const updateRoomSettings = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const settings = {
            join_channel_uuid: formData.get("join_channel_uuid") as string,
            join_message: formData.get("join_message") as string,
            rules_text: formData.get("rules_text") as string
        }
        const uuid = editSettings.uuid;
        try {
            await RoomService.updateSettings(uuid, settings);
            const room = await RoomService.findOne(uuid);
            setRooms(rooms.map((r) => r.uuid === room.uuid ? room : r));
            if (selectedRoom?.uuid === room.uuid) {
                setSelectedRoom(room);
            }
            setEditSettings(null);
        } catch (err: any) {
            console.error(err);
        }
    }

    return (
        <Modal title="Update Settings" show={editSettings} setShow={()=>setEditSettings(null)} slot={
            <div>

                <p className="text-md mb-3">
                    Enter the details to update a room setting
                </p>

                {editSettings && (
                    <form onSubmit={updateRoomSettings} className="text-white">
                        <InputControl id="join_channel_uuid" type="select" label="Join Channel UUID" name="join_channel_uuid" defaultValue={editSettings.joinSettings.channelUuid} options={channels.map((channel: any) => (
                            <option key={channel.uuid} value={channel.uuid}>
                                {channel.name}
                            </option>
                        ))} />
                        <InputControl id="join_message" type="text" label="Join Message" name="join_message" defaultValue={editSettings.joinSettings.message} />
                        <InputControl id="rules_text" type="text" label="Rules Text" name="rules_text" defaultValue={editSettings.rulesSettings.text} />
                        
                        <div className="flex flex-col gap-2">
                            <Button type="primary" button="submit" slot="Update" />
                            <Button type="secondary" button="button" slot="Cancel" onClick={() => setEditSettings(null)} />
                        </div>
                    </form>
                )}
            </div>
        } />
    );
};

export default RoomSettingUpdate;
