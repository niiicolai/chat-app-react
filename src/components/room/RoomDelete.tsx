import InputControlTracked from "../utils/InputControlTracked";
import RoomService from "../../services/roomService";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import { useState, useContext, JSX, FormEvent } from "react";
import { RoomContext } from "../../context/roomContext";
import { ToastContext } from "../../context/toastContext";

/**
 * @interface RoomDeleteProps
 * @description The props for the RoomDelete component
 */
interface RoomDeleteProps {
    showDeleteRoom: boolean;
    setShowDeleteRoom: (show: boolean) => void;
}

/**
 * @function RoomDelete
 * @param {RoomDeleteProps} props
 * @returns {JSX.Element}
 */
const RoomDelete = (props: RoomDeleteProps): JSX.Element => {
    const { addToast } = useContext(ToastContext);
    const { rooms, setRooms, selectedRoom, setSelectedRoom } = useContext(RoomContext);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const { showDeleteRoom, setShowDeleteRoom } = props;

    const destroyRoom = async (uuid: string | undefined) => {
        if (!uuid) return;
        setIsLoading(true);
        if (name !== selectedRoom?.name) {
            addToast({ message: 'Room name does not match', type: 'error', duration: 5000 });
            setIsLoading(false);
            return;
        }
        try {
            await RoomService.destroy(uuid);
            setRooms(rooms.filter((r) => r.uuid !== uuid));
            if (selectedRoom?.uuid === uuid) {
                setSelectedRoom(null);
            }
            addToast({ message: 'Room deleted successfully', type: 'success', duration: 5000 });
        } catch (err: unknown) {
            if (err instanceof Error) {
                addToast({ message: err.message, type: 'error', duration: 5000 });
            } else {
                addToast({ message: 'An unknown error occurred', type: 'error', duration: 5000 });
            }
        } finally {
            setIsLoading(false);
            setShowDeleteRoom(false);
        }
    }

    const nameHandler = (event: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setName(event.currentTarget.value);
    }

    return (
        <Modal title="Delete Room" show={showDeleteRoom} setShow={setShowDeleteRoom} slot={
            <div data-testid="room-delete-modal">
                {isLoading &&
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Spinner isLoading={true} fill="white" width="2em" />
                        <p className="text-md">Deleting room...</p>
                    </div>
                }

                {!isLoading &&
                    <div>
                        <p className="text-md mb-3">
                            Are you sure you want to delete this room? The action is irreversible. All data associated with this room will be lost.
                        </p>

                        <p className="text-md mb-3" data-testid="room-delete-confirm-description">
                            Enter the room name to confirm deletion ({selectedRoom?.name}):
                        </p>

                        <InputControlTracked id="room-delete-name" type="text" label="Room Name" name="confirm" value={name} onChange={nameHandler} />

                        <div className="flex justify-end gap-3">
                            <Button onClick={() => setShowDeleteRoom(false)} display="p-3" button="button" type="secondary" slot="Cancel" testId="room-delete-cancel-button" />
                            <Button onClick={() => destroyRoom(selectedRoom?.uuid)} display="p-3" button="button" type="error" slot="Delete" testId="room-delete-confirm-button" />
                        </div>
                    </div>
                }

            </div>
        } />
    );
};

export default RoomDelete;
