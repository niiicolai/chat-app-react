import Button from "../../components/utils/Button";
import Paginator from "../../components/utils/Paginator";
import Restricted from "../../components/utils/Restricted";
import RoomFile from "../../models/room_file";
import RoomFileListItem from "../../components/room_file/RoomFileListItem";
import { JSX } from "react";
import { useGetRoomFiles } from "../../hooks/useRoomFiles";
import { useGetAuthenticatedRoomUser } from "../../hooks/useRoomUsers";
import { useParams, useNavigate } from "react-router-dom";

/**
 * @function RoomFileList
 * @returns {JSX.Element}
 */
const RoomFileListView = (): JSX.Element => {
    const navigate = useNavigate();
    const { room_uuid } = useParams<{ room_uuid: string }>();
    const getRoomUser = useGetAuthenticatedRoomUser(room_uuid as string);
    const getRoomFiles = useGetRoomFiles(room_uuid as string);
    const { data: files, pages, page, nextPage, previousPage } = getRoomFiles;
    const roomUser = getRoomUser.data;
    const isLoading = getRoomFiles.isLoading || getRoomUser.isLoading;
    const error = getRoomFiles.error || getRoomUser.error;
    const isAdmin = roomUser?.room_user_role_name === 'Admin';

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Room Files
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

                <div className="p-3">
                    <Paginator nextPage={nextPage} previousPage={previousPage} isLoading={isLoading} error={error} page={page} pages={pages} slot={
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3" data-testid="room-file-list">
                            {files && files.map((file: RoomFile) => (
                                <RoomFileListItem file={file} key={file.uuid} isAdmin={isAdmin} />
                            ))}
                            {!files || !files?.length && <li className="text-white">No files found</li>}
                        </ul>
                    } />
                </div>
            </div>
        } />
    );
};

export default RoomFileListView;
