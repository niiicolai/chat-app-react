import InputControlTracked from "../utils/InputControlTracked";
import RoomService from "../../services/roomService";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import { useState, useContext, JSX, FormEvent } from "react";
import { RoomContext } from "../../context/roomContext";
import { ToastContext } from "../../context/toastContext";

/**
 * @interface RoomLeaveProps
 * @description The props for the RoomLeave component
 */
interface RoomLeaveProps {
    showLeaveRoom: boolean;
    setShowLeaveRoom: (show: boolean) => void;
}

/**
 * @function RoomLeave
 * @param {RoomLeaveProps} props
 * @returns {JSX.Element}
 */
const RoomLeave = (props: RoomLeaveProps): JSX.Element => {
    const { addToast } = useContext(ToastContext);
    const { rooms, setRooms, selectedRoom, setSelectedRoom } = useContext(RoomContext);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const { showLeaveRoom, setShowLeaveRoom } = props;

    const leaveRoom = async (uuid: string | undefined) => {
        if (!uuid) return;
        setIsLoading(true);
        if (name !== selectedRoom?.name) {
            addToast({ message: 'Room name does not match', type: 'error', duration: 5000 });
            setIsLoading(false);
            return;
        }
        try {
            await RoomService.leave(uuid);
            setRooms(rooms.filter((r) => r.uuid !== uuid));
            if (selectedRoom?.uuid === uuid) {
                setSelectedRoom(null);
            }
            addToast({ message: 'User left the room', type: 'success', duration: 5000 });
        } catch (err: unknown) {
            if (err instanceof Error) {
                addToast({ message: err.message, type: 'error', duration: 5000 });
            } else {
                addToast({ message: 'An unknown error occurred', type: 'error', duration: 5000 });
            }
        } finally {
            setIsLoading(false);
            setShowLeaveRoom(false);
        }
    }

    const nameHandler = (event: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setName(event.currentTarget.value);
    }

    return (
        <Modal title="Leave Room" show={showLeaveRoom} setShow={setShowLeaveRoom} slot={
            <div data-testid="room-leave-modal">
                {isLoading &&
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Spinner isLoading={true} fill="white" width="2em" />
                        <p className="text-md">Leaving room...</p>
                    </div>
                }

                {!isLoading &&
                    <div>
                        <p className="text-md mb-3">
                            Are you sure you want to leave this room? You must get a new invite link to rejoin.
                        </p>

                        <p className="text-md mb-3" data-testid="room-leave-confirm-description">
                            Enter the room name to confirm leave ({selectedRoom?.name}):
                        </p>

                        <InputControlTracked id="room-leave-name" type="text" label="Room Name" name="confirm" value={name} onChange={nameHandler} />

                        <div className="flex justify-end gap-3">
                            <Button onClick={() => setShowLeaveRoom(false)} display="p-3" button="button" type="secondary" slot="Cancel" testId="room-leave-cancel-button" />
                            <Button onClick={() => leaveRoom(selectedRoom?.uuid)} display="p-3" button="button" type="error" slot="Delete" testId="room-leave-confirm-button" />
                        </div>
                    </div>
                }

            </div>
        } />
    );
};

export default RoomLeave;
