import RoomUser from "../../models/room_user";
import RoomUserListItem from "./RoomUserListItem";
import RoomUserService from "../../services/roomUserService";
import useRoomUsers from "../../hooks/useRoomUsers";
import Alert from "../utils/Alert";
import Spinner from "../utils/Spinner";
import Modal from "../utils/Modal";
import { useContext, ReactNode } from "react";
import { ToastContext } from "../../context/toastContext";

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
 * @returns {ReactNode}
 */
const RoomUserList = (props: RoomUserListProps): ReactNode => {
    const { addToast } = useContext(ToastContext);
    const { showUsers, setShowUsers } = props;
    const { roomUsers, setRoomUsers, error, isLoading } = useRoomUsers();

    const update = async (uuid: string, room_user_role_name: string) => {
        if (!uuid) return;
        await RoomUserService.update(uuid, room_user_role_name);
        setRoomUsers(roomUsers.map((user: RoomUser) => {
            if (user.uuid === uuid) {
                user.room_user_role_name = room_user_role_name;
            }
            return user;
        }));
        addToast({ message: 'Room user updated', type: 'success', duration: 5000 });
    };

    const destroy = async (uuid: string) => {
        await RoomUserService.destroy(uuid);
        setRoomUsers(roomUsers.filter((user: RoomUser) => user.uuid !== uuid));
        addToast({ message: 'Room user deleted', type: 'success', duration: 5000 });
    };

    return (
        <Modal title="Room Users" show={showUsers} setShow={setShowUsers} slot={
            <div>
                <Alert type="error" message={error} />
                <Spinner width="2em" fill="white" isLoading={isLoading} />

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
