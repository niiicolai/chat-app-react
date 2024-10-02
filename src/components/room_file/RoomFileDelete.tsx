import { useState, useContext, JSX, FormEvent } from "react";
import { ToastContext } from "../../context/toastContext";
import InputControlTracked from "../utils/InputControlTracked";
import Button from "../utils/Button";
import Modal from "../utils/Modal";
import Spinner from "../utils/Spinner";
import RoomFile from "../../models/room_file";

/**
 * @interface RoomFileDeleteProps
 * @description The props for the RoomFileDelete component
 */
interface RoomFileDeleteProps {
    fileDelete: RoomFile;
    setFileDelete: (link: RoomFile | null) => void;
    destroyRoomFile: (uuid: string) => Promise<void>;
}

/**
 * @function RoomFileDelete
 * @param {RoomFileDeleteProps} props
 * @returns {JSX.Element}
 */
const RoomFileDelete = (props: RoomFileDeleteProps): JSX.Element => {
    const { fileDelete, setFileDelete, destroyRoomFile } = props;
    const { addToast } = useContext(ToastContext);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ answer, setAnswer ] = useState("");
    const show = fileDelete !== null;

    const destroy = async (uuid: string | undefined) => {
        if (!uuid) return;
        setIsLoading(true);
        if (answer.toLowerCase() !== 'yes') {
            addToast({ message: 'Please confirm deletion by typing "yes"', type: 'error', duration: 5000 });
            setIsLoading(false);
            return;
        }

        try {
            await destroyRoomFile(uuid);
        } catch (err: unknown) {
            if (err instanceof Error) {
                addToast({ message: err.message, type: 'error', duration: 5000 });
            } else {
                addToast({ message: 'An unknown error occurred', type: 'error', duration: 5000 });
            }
        } finally {
            setIsLoading(false);
            setFileDelete(null);
        }
    }

    const answerHandler = (event: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setAnswer(event.currentTarget.value);
    }

    return (
        <Modal title="Delete Room File" show={show} setShow={()=>setFileDelete(null)} slot={
            <div data-testid="room-file-delete-modal">
                {isLoading &&
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Spinner isLoading={true} fill="white" width="2em" />
                        <p className="text-md">Deleting room file...</p>
                    </div>
                }

                {!isLoading &&
                    <div>
                        <p className="text-md mb-3">
                            Are you sure you want to delete this room invite link? The action is irreversible. All data associated with this room will be lost.
                        </p>

                        <p className="text-md mb-3" data-testid="room-file-confirm-description">
                            Enter 'yes' to confirm deletion ({fileDelete.src}):
                        </p>

                        <InputControlTracked id="room-file-delete-answer" type="text" label="Answer" name="confirm" value={answer} onChange={answerHandler} />

                        <div className="flex justify-end gap-3">
                            <Button onClick={() => setFileDelete(null)} display="p-3" button="button" type="secondary" slot="Cancel" testId="room-file-delete-cancel-button" />
                            <Button onClick={() => destroy(fileDelete.uuid)} display="p-3" button="button" type="error" slot="Delete" testId="room-file-delete-confirm-button" />
                        </div>
                    </div>
                }

            </div>
        } />
    );
};

export default RoomFileDelete;
