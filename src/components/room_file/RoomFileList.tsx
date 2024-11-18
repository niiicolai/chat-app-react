
import { RoomContext } from "../../context/roomContext";
import { useContext, JSX, useState } from "react";
import useRoomFiles from "../../hooks/useRoomFiles";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import Modal from "../utils/Modal";
import Paginator from "../utils/Paginator";
import RoomFile from "../../models/room_file";
import RoomFileListItem from "./RoomFileListItem";
import RoomFileDelete from "./RoomFileDelete";

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
    const { selectedRoomUser } = useContext(RoomContext);
    const { files, error, isLoading, pages, page, nextPage, previousPage, destroy } = useRoomFiles();
    const [ fileDelete, setFileDelete ] = useState<RoomFile | null>(null);
    const isAdmin = selectedRoomUser?.room_user_role_name === 'Admin';

    if (fileDelete) {
        return <RoomFileDelete 
            fileDelete={fileDelete} 
            setFileDelete={setFileDelete} 
            destroyRoomFile={destroy} 
        />;
    }

    return (
        <Modal title="Room Files" show={showFiles} setShow={setShowFiles} slot={
            <div>
                <Alert type="error" message={error} />
                <Spinner width="2em" fill="white" isLoading={isLoading} />

                <Paginator nextPage={nextPage} previousPage={previousPage} isLoading={isLoading} error={error} page={page} pages={pages} slot={
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3" data-testid="room-file-list">
                        {files.map((file) => (
                            <RoomFileListItem file={file} key={file.uuid} setFileDelete={setFileDelete} isAdmin={isAdmin} />
                        ))}
                        {!files.length && <li className="text-white">No files found</li>}
                    </ul>
                } />
            </div>
        } />
    );
};

export default RoomFileList;
