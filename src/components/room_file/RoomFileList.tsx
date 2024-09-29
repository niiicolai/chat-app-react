import RoomFileService from "../../services/roomFileService";
import RoomFileListItem from "./RoomFileListItem";
import useRoomFiles from "../../hooks/useRoomFiles";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import Modal from "../utils/Modal";
import { ToastContext } from "../../context/toastContext";
import { RoomContext } from "../../context/roomContext";
import { useContext, JSX } from "react";

/**
 * @interface RoomFileListProps
 * @description The props for the RoomFileList component
 */
interface RoomFileListProps {
    showFiles: boolean;
    setShowFiles: (show: boolean) => void;
}

/**
 * @function RoomFileList
 * @param {RoomFileListProps} props
 * @returns {JSX.Element}
 */
const RoomFileList = (props: RoomFileListProps): JSX.Element => {
    const { showFiles, setShowFiles } = props;
    const { addToast } = useContext(ToastContext);
    const { selectedRoomUser } = useContext(RoomContext);
    const { files, setFiles, error, isLoading } = useRoomFiles();
    const isAdmin = selectedRoomUser?.room_user_role_name === 'Admin';

    const destroy = async (uuid: string) => {
        try {
            await RoomFileService.destroy(uuid);
            setFiles(files.filter((file) => file.uuid !== uuid));
            addToast({ message: 'File deleted', type: 'success', duration: 5000 });
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error("An unknown error occurred");
            }
        }
    }

    return (
        <Modal title="Room Files" show={showFiles} setShow={setShowFiles} slot={
            <div>
                <Alert type="error" message={error} />
                <Spinner width="2em" fill="white" isLoading={isLoading} />
                
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {files.map((file) => (
                        <RoomFileListItem file={file} key={file.uuid} destroyFile={destroy} isAdmin={isAdmin} />
                    ))}
                    {!files.length && <li className="text-white">No files found</li>}
                </ul>
            </div>
        } />
    );
};

export default RoomFileList;
