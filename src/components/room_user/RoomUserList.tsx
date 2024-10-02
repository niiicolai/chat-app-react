import RoomUserListItem from "./RoomUserListItem";
import useRoomUsers from "../../hooks/useRoomUsers";
import Modal from "../utils/Modal";
import Paginator from "../utils/Paginator";
import { useContext, JSX } from "react";
import { RoomContext } from "../../context/roomContext";

/**
 * @interface RoomUserListProps
 * @description The props for the RoomUserList component
 */
interface RoomUserListProps {
    showUsers: boolean;
    setShowUsers: (show: boolean) => void;
}

/**
 * @function RoomUserList
 * @param {RoomUserListProps} props
 * @returns {JSX.Element}
 */
const RoomUserList = (props: RoomUserListProps): JSX.Element => {
    const { showUsers, setShowUsers } = props;
    const { roomUsers, update, destroy, error, isLoading, page, pages, nextPage, previousPage } = useRoomUsers();
    const { selectedRoomUser } = useContext(RoomContext);
    const isAdmin = selectedRoomUser?.room_user_role_name === 'Admin';
    const isMod = selectedRoomUser?.room_user_role_name === 'Moderator';

    return (
        <Modal title="Room Users" show={showUsers} setShow={setShowUsers} slot={
            <div>
                <Paginator nextPage={nextPage} previousPage={previousPage} isLoading={isLoading} error={error} page={page} pages={pages} slot={
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-3" data-testid="room-user-list">
                        {roomUsers.map((roomUser) => (
                            <RoomUserListItem roomUser={roomUser} key={roomUser.uuid} update={update} destroy={destroy} isAdmin={isAdmin} isMod={isMod} />
                        ))}
                        {!roomUsers.length && <li className="text-white">No room users found</li>}
                    </ul>
                } />
            </div>
        } />
    );
};

export default RoomUserList;
