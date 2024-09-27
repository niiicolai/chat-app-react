import useRoomCategories from "../../hooks/useRoomCategories";
import InputControl from "../utils/InputControl";
import RoomService from "../../services/roomService";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import Room from "../../models/room";
import { FormEvent, ReactNode, useContext, useState } from "react";
import { ToastContext } from "../../context/toastContext";
import { RoomContext } from "../../context/roomContext";

/**
 * @interface RoomUpdateProps
 * @description The props for the RoomUpdate component
 */
interface RoomUpdateProps {
    editRoom: Room | null;
    setEditRoom: (room: Room | null) => void;
}

/**
 * @function RoomUpdate
 * @param {RoomUpdateProps} props
 * @returns {ReactNode}
 */
const RoomUpdate = (props: RoomUpdateProps): ReactNode => {
    const { selectedRoom, setSelectedRoom, rooms, setRooms } = useContext(RoomContext);
    const { addToast } = useContext(ToastContext);
    const { categories } = useRoomCategories();
    const [error, setError] = useState('' as string);
    const [isLoading, setIsLoading] = useState(false);
    const { editRoom, setEditRoom } = props;
    const show = editRoom !== null;

    const updateRoom = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
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
            addToast({ message: 'Room updated', type: 'success', duration: 5000 });
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
        <Modal title="Update Room" show={show} setShow={() => setEditRoom(null)} slot={
            <div>
                <Alert type="error" message={error} />

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
                        <InputControl 
                            id="room-update-file" 
                            type="file" 
                            label="Avatar" 
                            name="file" 
                            defaultValue={editRoom.avatar?.room_file?.src} 
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
                            <Button type="secondary" button="button" slot="Cancel" onClick={() => setEditRoom(null)} />
                        </div>
                    </form>
                )}
            </div>
        } />
    );
};

export default RoomUpdate;
