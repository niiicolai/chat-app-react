import InputControlTracked from "../../components/utils/InputControlTracked";
import Button from "../../components/utils/Button";
import Restricted from "../../components/utils/Restricted";
import Spinner from "../../components/utils/Spinner";
import Alert from "../../components/utils/Alert";
import { useState, useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import { useGetRoomFile, useDestroyRoomFile } from "../../hooks/useRoomFiles";
import { useParams, useNavigate } from "react-router-dom";

/**
 * @function RoomFileDelete
 * @returns {JSX.Element}
 */
const RoomFileDeleteView = (): JSX.Element => {
    const navigate = useNavigate();
    const [answer, setAnswer] = useState("");
    const { addToast } = useContext(ToastContext);
    const { file_uuid, room_uuid } = useParams<{ file_uuid: string, room_uuid: string }>();
    const getRoomFile = useGetRoomFile(file_uuid as string);
    const destroyRoomFile = useDestroyRoomFile(file_uuid as string);
    const isLoading = destroyRoomFile.isLoading || getRoomFile.isLoading;
    const error = destroyRoomFile.error || getRoomFile.error;
    const file = getRoomFile.data;

    const destroyHandler = async () => {
        if (!file_uuid) return;

        if (answer.toLowerCase() !== 'yes') {
            addToast({ message: 'Please confirm deletion by typing "yes"', type: 'error', duration: 5000 });
            return;
        }

        await destroyRoomFile.mutateAsync(file_uuid);
        navigateToRoomFiles();
        addToast({ message: 'Room file deleted', type: 'success', duration: 5000 });
    }

    const navigateToRoomFiles = () => {
        navigate(`/room/${room_uuid}/files`);
    }

    const answerHandler = (event: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setAnswer(event.currentTarget.value);
    }

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Delete Room File
                    </div>

                    <div>
                        <Button
                            onClick={() => navigate(`room/${room_uuid}/files`)}
                            display="px-3 py-1 w-full block text-sm"
                            slot="Back to Room files"
                            title="Back to Room files"
                        />
                    </div>
                </div>

                <div className="p-3" data-testid="room-file-delete-modal">
                    <Alert type="error" message={error} />

                    {isLoading &&
                        <div className="flex flex-col items-center justify-center gap-2">
                            <Spinner isLoading={true} fill="white" width="2em" />
                        </div>
                    }

                    {!isLoading &&
                        <div>
                            <p className="text-md mb-3">
                                Are you sure you want to delete this room invite link? The action is irreversible. All data associated with this room will be lost.
                            </p>

                            <p className="text-md mb-3" data-testid="room-file-confirm-description">
                                Enter yes to confirm deletion ({file ? file.src : ''}):
                            </p>

                            <InputControlTracked id="room-file-delete-answer" type="text" label="Answer" name="confirm" value={answer} onChange={answerHandler} />

                            <div className="flex justify-end gap-3">
                                <Button onClick={() => navigateToRoomFiles()} display="p-3" button="button" type="secondary" slot="Cancel" testId="room-file-delete-cancel-button" />
                                <Button onClick={() => destroyHandler()} display="p-3" button="button" type="error" slot="Delete" testId="room-file-delete-confirm-button" />
                            </div>
                        </div>
                    }
                </div>
            </div>
        } />
    );
};

export default RoomFileDeleteView;
