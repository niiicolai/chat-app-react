import useRoomCategories from "../../hooks/useRoomCategories";
import InputControl from "../utils/InputControl";
import RoomService from "../../services/roomService";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import { useContext } from "react";
import { RoomContext } from "../../context/roomContext";

const RoomUpdate = (props: any) => {
    const { selectedRoom, setSelectedRoom, rooms, setRooms } = useContext(RoomContext);
    const { editRoom, setEditRoom } = props;
    const { categories } = useRoomCategories();

    const updateRoom = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const uuid = formData.get("uuid") as string;
        formData.delete("uuid");
        try {
            const room = await RoomService.update(uuid, formData);
            setRooms(rooms.map((r) => r.uuid === room.uuid ? room : r));
            if (selectedRoom?.uuid === room.uuid) {
                setSelectedRoom(room);
            }
            setEditRoom(null);
        } catch (err: any) {
            console.error(err);
        }
    }

    return (
        <Modal title="Update Room" show={editRoom} setShow={()=>setEditRoom(null)} slot={
            <div>

                <p className="text-md mb-3">
                    Enter the details to update a room
                </p>

                {editRoom && (
                    <form onSubmit={updateRoom} className="text-white">
                        <input type="hidden" name="uuid" value={editRoom.uuid} />
                        <InputControl id="room-update-name" type="text" label="Name" name="name" defaultValue={editRoom.name} />
                        <InputControl id="room-update-description" type="text" label="Desc" name="description" defaultValue={editRoom.description} />
                        <InputControl 
                            id="room-update-room_category_name" 
                            name="room_category_name"
                            type="select" 
                            label="Category" 
                            defaultValue={editRoom.room_category_name} 
                            options={
                                categories.map((category) => (
                                    <option key={category.name} value={category.name}>
                                        {category.name}
                                    </option>
                                ))
                            }
                        />
                        <InputControl id="room-update-file" type="file" label="Avatar" name="file" defaultValue={editRoom.avatar?.room_file?.src} />
                        
                        <div className="flex flex-col gap-2">
                            <Button type="primary" button="submit" slot="Update" />
                            <Button type="secondary" button="button" slot="Cancel" onClick={() => setEditRoom(null)} />
                        </div>
                    </form>
                )}
            </div>
        } />
    );
};

export default RoomUpdate;
