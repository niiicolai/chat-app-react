import InputControlTracked from "../../components/utils/InputControlTracked";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import { useState, useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import { useParams, useNavigate } from "react-router-dom";
import { useGetRoom, useLeaveRoom } from "../../hooks/useRooms";

/**
 * @function RoomLeaveView
 * @returns {JSX.Element}
 */
const RoomLeaveView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { room_uuid } = useParams<{ room_uuid: string }>();
    const getRoom = useGetRoom(room_uuid as string).query;
    const leaveRoom = useLeaveRoom(room_uuid as string);
    const room = getRoom.data;
    const isLoading = leaveRoom.isLoading || getRoom.isLoading;
    const error = leaveRoom.error || getRoom.error;
    const [name, setName] = useState("");

    const leaveRoomHandler = async () => {
        if (!room_uuid || !room) return;

        if (name !== room.name) {
            addToast({ message: 'Room name does not match', type: 'error', duration: 5000 });
            return;
        }

        try {
            await leaveRoom.mutateAsync(room_uuid);
            navigate(`/rooms`);
            addToast({ message: 'User left the room', type: 'success', duration: 5000 });
        } catch {
            addToast({ message: 'Error leaving room', type: 'error', duration: 5000 });
        }
    }

    const nameHandler = (event: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setName(event.currentTarget.value);
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Leave Room
                    </div>

                    <div>
                        <Button
                            onClick={() => navigate('/')}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Dashboard"
                            title="Dashboard"
                        />
                    </div>
                </div>

                <div className="p-3" data-testid="room-leave-modal">
                    <Alert type="error" message={error} />

                    {isLoading &&
                        <div className="flex flex-col items-center justify-center gap-2">
                            <Spinner isLoading={true} fill="white" width="2em" />
                        </div>
                    }

                    {room && !isLoading &&
                        <div>
                            <p className="text-md mb-3">
                                Are you sure you want to leave this room? You must get a new invite link to rejoin.
                            </p>

                            <p className="text-md mb-3" data-testid="room-leave-confirm-description">
                                Enter the room name to confirm leave ({room.name}):
                            </p>

                            <InputControlTracked id="room-leave-name" type="text" label="Room Name" name="confirm" value={name} onChange={nameHandler} />

                            <div className="flex justify-end gap-3">
                                <Button onClick={() => navigate(`/room/${room_uuid}`)} display="p-3" button="button" type="secondary" slot="Cancel" testId="room-leave-cancel-button" />
                                <Button onClick={() => leaveRoomHandler()} display="p-3" button="button" type="error" slot="Delete" testId="room-leave-confirm-button" />
                            </div>
                        </div>
                    }
                </div>
            </div>
        } />
    );
};

export default RoomLeaveView;
