import RoomUserListItem from "../../components/room_user/RoomUserListItem";
import Restricted from "../../components/utils/Restricted";
import Button from "../../components/utils/Button";
import Paginator from "../../components/utils/Paginator";
import { JSX } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAuthenticatedRoomUser, useGetRoomUsers } from "../../hooks/useRoomUsers";

/**
 * @function RoomUserListView
 * @returns {JSX.Element}
 */
const RoomUserListView = (): JSX.Element => {
    const navigate = useNavigate();
    const { room_uuid } = useParams<{ room_uuid: string }>();
    const getRoomUser = useGetAuthenticatedRoomUser(room_uuid as string);
    const getRoomUsers = useGetRoomUsers(room_uuid as string);
    const { data, pages, page, nextPage, previousPage, refetch } = getRoomUsers;
    const roomUsers = data?.data || [];
    const authRoomUser = getRoomUser.data;
    const isLoading = getRoomUsers.isLoading || getRoomUser.isLoading;
    const error = getRoomUsers.error || getRoomUser.error;

    return (
        <Restricted slot={
            <div className="bg-black min-h-screen text-white">

                <div className="flex gap-3 justify-between p-3 border-b border-gray-800">
                    <div className="text-lg font-bold">
                        Room Files
                    </div>

                    <div className="flex gap-3">
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
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-3" data-testid="room-user-list">
                            {roomUsers && roomUsers.map((roomUser) => (
                                <RoomUserListItem roomUser={roomUser} authRoomUser={authRoomUser} key={roomUser.uuid} refetch={refetch} />
                            ))}
                            {!roomUsers || !roomUsers.length && <li className="text-white">No room users found</li>}
                        </ul>
                    } />
                </div>
            </div>
        } />
    );
};

export default RoomUserListView;
