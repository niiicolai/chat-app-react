import InputControlTracked from "../../components/utils/InputControlTracked";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import { useState, useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import { useNavigate, useParams } from "react-router-dom";
import { useGetRoom, useDestroyRoom } from "../../hooks/useRooms";

/**
 * @function RoomDelete
 * @returns {JSX.Element}
 */
const RoomDeleteView = (): JSX.Element => {
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const { room_uuid } = useParams<{ room_uuid: string }>();
    const getRoom = useGetRoom(room_uuid as string);
    const destroyRoom = useDestroyRoom(room_uuid as string);

    const { data: room, isLoading: isLoadingRoom } = getRoom.query;
    const error = getRoom.query.error || destroyRoom.error;
    const isLoading = destroyRoom.isLoading;

    const [name, setName] = useState("");

    const destroyRoomHandler = async () => {
        if (!room_uuid) return;
        if (name !== room?.name) {
            addToast({ message: 'Room name does not match', type: 'error', duration: 5000 });
            return;
        }

        try {
            await destroyRoom.mutateAsync(room_uuid);
            navigate(`/rooms`);
            addToast({ message: 'Room deleted successfully', type: 'success', duration: 5000 });
        } catch {
            addToast({ message: 'Error deleting room', type: 'error', duration: 5000 });
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
                        Create Room
                    </div>

                    <div>
                        <Button
                            onClick={() => navigate(`/room/${room_uuid}`)}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Back to Room"
                            title="Back to Room"
                        />
                    </div>
                </div>

                <Alert type="error" message={error} />

                {isLoadingRoom && room && (
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Spinner isLoading={true} fill="white" width="2em" />
                        <p className="text-md">Loading room...</p>
                    </div>
                )}

                {!isLoadingRoom && room && (
                    <div className="p-3" data-testid="room-delete-modal">
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
                                    Enter the room name to confirm deletion ({room?.name}):
                                </p>

                                <InputControlTracked id="room-delete-name" type="text" label="Room Name" name="confirm" value={name} onChange={nameHandler} />

                                <div className="flex justify-end gap-3">
                                    <Button onClick={() => navigate(`/room/${room_uuid}`)} display="p-3" button="button" type="secondary" slot="Cancel" testId="room-delete-cancel-button" />
                                    <Button onClick={() => destroyRoomHandler()} display="p-3" button="button" type="error" slot="Delete" testId="room-delete-confirm-button" />
                                </div>
                            </div>
                        }
                    </div>
                )}
            </div>
        } />
    );
};

export default RoomDeleteView;
