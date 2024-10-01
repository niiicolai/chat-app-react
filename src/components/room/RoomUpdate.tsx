import useRoomCategories from "../../hooks/useRoomCategories";
import InputControl from "../utils/InputControl";
import RoomService from "../../services/roomService";
import RoomFileService from "../../services/roomFileService";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import Room from "../../models/room";
import { FormEvent, JSX, useContext, useState } from "react";
import { ToastContext } from "../../context/toastContext";
import { RoomContext } from "../../context/roomContext";
import InputControlTracked from "../utils/InputControlTracked";

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
 * @returns {JSX.Element}
 */
const RoomUpdate = (props: RoomUpdateProps): JSX.Element => {
    const { selectedRoom, setSelectedRoom, rooms, setRooms } = useContext(RoomContext);
    const { addToast } = useContext(ToastContext);
    const { categories } = useRoomCategories();
    const [error, setError] = useState('' as string);
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState('' as string | Blob);
    const { editRoom, setEditRoom } = props;
    const show = editRoom !== null;

    const updateRoom = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.currentTarget);
        const uuid = formData.get("uuid") as string;
        formData.delete("uuid");

        if (formData.get("name") === "") {
            setError("Name is required");
            setIsLoading(false);
            return;
        }

        if (formData.get("description") === "") {
            setError("Description is required");
            setIsLoading(false);
            return;
        }

        try {
            const room = await RoomService.update(uuid, formData);
            setRooms(rooms.map((r) => r.uuid === room.uuid ? room : r));
            if (selectedRoom?.uuid === room.uuid) {
                setSelectedRoom(room);
            }
            setEditRoom(null);
            setError('');
            if (file) { setFile('') }
            addToast({ message: 'Room updated successfully', type: 'success', duration: 5000 });
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

    const destroyAvatar = async () => {
        try {
            await RoomFileService.destroy(editRoom?.avatar?.room_file?.uuid as string);
            setFile('');
            setRooms(rooms.map((r) => r.uuid === editRoom?.uuid ? { ...editRoom, avatar: null } : r));
            if (selectedRoom && selectedRoom?.uuid === editRoom?.uuid) {
                selectedRoom.avatar = null;
                setSelectedRoom(selectedRoom);
            }
            setEditRoom(null);
            addToast({ message: 'Avatar deleted', type: 'success', duration: 5000 });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    }

    const categoryHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLSelectElement;
        const category = categories.find((category) => category.name === target.value);
        if (category && editRoom) {
            setEditRoom({ ...editRoom, room_category_name: category.name });
        }
    }

    const fileHandler = (e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        if (!target.files || !target.files.length) {
            setFile('');
            return;
        }
        setFile(target.files[0]);
    }

    return (
        <Modal title="Update Room" show={show} setShow={() => setEditRoom(null)} slot={
            <div>
                <Alert type="error" message={error} testId="room-edit-alert-message" />

                <p className="text-md mb-3">
                    Enter the details to update a room
                </p>

                {editRoom && (
                    <form onSubmit={updateRoom} className="text-white" data-testid="room-edit-form">
                        <input type="hidden" name="uuid" value={editRoom.uuid} />

                        <InputControl
                            id="room-update-name"
                            type="text"
                            label="Name"
                            name="name"
                            defaultValue={editRoom.name}
                        />

                        <InputControl
                            id="room-update-description"
                            type="text"
                            label="Desc"
                            name="description"
                            defaultValue={editRoom.description}
                        />

                        <InputControlTracked
                            id="room-update-room_category_name"
                            name="room_category_name"
                            type="select"
                            label="Category"
                            value={editRoom.room_category_name}
                            onChange={categoryHandler}
                            options={
                                categories.map((category) => (
                                    <option key={category.name} value={category.name}>
                                        {category.name}
                                    </option>
                                ))
                            }
                        />

                        <InputControlTracked
                            id="room-update-file"
                            type="file"
                            label="Avatar"
                            name="file"
                            value={editRoom.avatar?.room_file?.src as string}
                            onChange={fileHandler}
                            footerSlot={
                                <div>
                                    {editRoom.avatar?.room_file &&
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
                            <Button type="secondary" button="button" slot="Cancel" onClick={() => setEditRoom(null)} />
                        </div>
                    </form>
                )}
            </div>
        } />
    );
};

export default RoomUpdate;
