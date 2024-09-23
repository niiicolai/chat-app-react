import RoomFileService from "../../services/roomFileService";
import RoomFileListItem from "./RoomFileListItem";
import useRoomFiles from "../../hooks/useRoomFiles";
import Spinner from "../utils/Spinner";
import Alert from "../utils/Alert";
import Modal from "../utils/Modal";

const RoomFileList = (props: any) => {
    const { showFiles, setShowFiles } = props;
    const { files, setFiles, error, isLoading } = useRoomFiles();

    const destroy = async (uuid: string) => {
        try {
            await RoomFileService.destroy(uuid);
            setFiles((files: any) => files.filter((file: any) => file.uuid !== uuid));
        }catch (error: any) {
            throw new Error(error.message);
        }
    }

    return (
        <Modal title="Room Files" show={showFiles} setShow={setShowFiles} slot={
            <div>
                <Alert type="error" message={error} />
                <Spinner show={isLoading} />
                
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {files.map((file) => (
                        <RoomFileListItem file={file} key={file.uuid} destroyFile={destroy} />
                    ))}
                    {!files.length && <li className="text-white">No files found</li>}
                </ul>
            </div>
        } />
    );
};

export default RoomFileList;
