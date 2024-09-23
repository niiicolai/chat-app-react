import Modal from "../utils/Modal";
import RoomUser from "../../models/room_user";
import RoomUserListItem from "./RoomUserListItem";

interface RoomUserListProps {
    roomUsers: RoomUser[];
    showUsers: boolean;
    setShowUsers: (show: boolean) => void;
    update: (uuid: string, room_user_role_name: string) => void;
    destroy: (uuid: string) => void;
}

const RoomUserList = (props: RoomUserListProps) => {
    const { showUsers, setShowUsers, roomUsers, update, destroy } = props;

    return (
        <Modal title="Room Users" show={showUsers} setShow={setShowUsers} slot={
            <div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-3">
                    {roomUsers.map((roomUser) => (
                        <RoomUserListItem roomUser={roomUser} key={roomUser.uuid} update={update} destroy={destroy} />
                    ))}
                    {!roomUsers.length && <li className="text-white">No room users found</li>}
                </ul>
            </div>
        } />
    );
};

export default RoomUserList;
