import useRoomFiles from "../../hooks/useRoomFiles";
import Modal from "../utils/Modal";
import { useState } from "react";

const RoomFileList = (props: any) => {
    const { showFiles, setShowFiles } = props;
    const { files, error, isLoading } = useRoomFiles();
    const [ showLinkCreate, setShowLinkCreate ] = useState(false);
    const [ showLinkUpdate, setShowLinkUpdate ] = useState(false);
    return (
        <Modal title="Room Files" show={showFiles} setShow={setShowFiles} slot={
            <div>
                <ul className="flex flex-col gap-3 mb-3">
                    {files.map((file) => (
                        <li key={file.uuid} className="flex flex-col gap-1">
                            <span className="text-white">{file.uuid}</span>
                            <span className="text-white">{file.src}</span>
                            <span className="text-white">{file.room_file_type_name}</span>
                        </li>
                    ))}
                    {!files.length && <li className="text-white">No files found</li>}
                </ul>
            </div>
        } />
    );
};

export default RoomFileList;
